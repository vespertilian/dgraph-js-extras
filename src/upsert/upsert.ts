/**
 * @module Upsert
 */

import * as dgraph from 'dgraph-js'
import {xSetJSON} from '../set-json/set-json';
import {Txn} from 'dgraph-js';

export type uid = string;

export interface INodeFoundFunction {
    existingUid: string | null
    newNodeFn?: (node: any) => object
}

export interface IUpsertFnReturnValues {
    dgraphQuery: string
    nodeFoundFn: (queryResult: dgraph.Response) => INodeFoundFunction
}

/**
 * #### Return a dgraph query and a node found function
 *
 * The basicEqualityUpsertFn below will find any nodes that has skill and level predicates.
 * ```ts
 * const updateJunior = {
 *   skill: 'Javascript',
 *   level: 10,
 *   x: 'y',
 *   y: 'y',
 *   z: 'y'
 * };
 *
 * // So if you already had a node in the db that looks like:
 * const existingNode = {
 *   skill: 'Javascript',
 *   level: 10,
 *   x: 'foo',
 *   y: 'foo',
 *   z: 'foo'
 * };
 *
 * /// x, y and z would be updated from 'foo' to 'y'
 * const updates = [updateJunior];
 * const upsertFn = basicEqualityUpsertFn(['skill', 'level']);
 *
 * // takes a upsertFn as well as an array or single object returns a uid or an array of uids
 * await xUpsertCommitTxn(upsertFn, updates, dgraphClient);
 * ```
 *
 * If no node matched both skill 'Javascript' and level '10' a new node would be created
 */

// overload function to always return a string array when an object array is passed in
export async function xUpsertCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object[], dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<uid[]>
export async function xUpsertCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object, dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<uid>
export async function xUpsertCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object | object[], dgraphClient: dgraph.DgraphClient, _dgraph: any = dgraph): Promise<uid | uid[]> {
    if(Array.isArray(data)) {
        return xUpsertArrayCommitTxn(upsertFn, data, dgraphClient, _dgraph)
    } else {
        return xUpsertObjectCommitTxn(upsertFn, data, dgraphClient, _dgraph)
    }
}

async function xUpsertArrayCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, nodes: object[], dgraphClient: dgraph.DgraphClient, _dgraph: any = dgraph): Promise<uid[]> {
    const results: string[] = [];
    const errors: Error[] = [];
    const transaction = dgraphClient.newTxn();
        try {
            for(let i=0; i < nodes.length; i++) {
                const currentNode = nodes[i];
                const result = await xUpsertObject(upsertFn, currentNode, transaction);
                results.push(result)
            }
            await transaction.commit()
        } catch(e) {
            // catch the error here so we can throw it properly
            errors.push(e);
            throw e
        }
        finally {
            try {
                await transaction.discard()
            } catch(e) {
                // the error e here will be the transaction.discard() error.
                // not the error we want - the one that was thrown in the for loop.
                throw(errors);
            }
        }

    return results
}

async function xUpsertObjectCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, node: object, dgraphClient: dgraph.DgraphClient, _dgraph: any = dgraph): Promise<uid> {
    let uid = null;
    let error: Error | null = null;
    const transaction = dgraphClient.newTxn();
    try {
        try {
            uid = await xUpsertObject(upsertFn, node, transaction);
            await transaction.commit()
        } catch (e) {
           // catch the error here so we can throw it properly
           error = e;
           throw e;
        }
    }  finally {
        try {
            await transaction.discard()
        } catch(e) {
            // the error e here will be the transaction.discard() error.
            // not the error we want - the one that was thrown in the try catch block
            throw error;
        }
    }
    return uid;
}

// this function is only exported to be used internally
/** * @ignore */
export async function xUpsertObject(upsertFn: (input?: any) => IUpsertFnReturnValues, node: object, transaction: Txn): Promise<uid | null> {
    let result = null;

    const {dgraphQuery, nodeFoundFn} = upsertFn(node);

    const queryResult = await transaction.query(dgraphQuery).catch((e) => {
        // Rethrow the error but with more context about exactly what failed
        throw new Error(`xUpsert DgraphQuery failed, check the query you provided against this error: ${e}`)
    });

    const {existingUid, newNodeFn} = nodeFoundFn(queryResult);

    if(Boolean(existingUid)) {
        const updatedNode = Object.assign({uid: existingUid}, node);
        const mu = xSetJSON(updatedNode);
        await transaction.mutate(mu);
        result = existingUid;
    } else {
        const createNode =
            newNodeFn ?
                newNodeFn(node) :
                node;

        const mu = xSetJSON(createNode);
        const muResult = await transaction.mutate(mu);
        const uid = muResult.getUidsMap().get('blank-0');
        const multipleNodes = Boolean(muResult.getUidsMap().get('blank-1'));

        if(multipleNodes) {
            const errorMessage = `
                The find functions for xUpsert should only return a single node.
                That's how we know which node we need to update.
                
                Therefor xUpsert cannot support creating multiple new nodes.
                It seems that you have passed in an object that requires the creation of multiple nodes.
                
                Update your upsert to only create a single node at a time .
                xUpsert does accept an array of objects to upsert.
                
                Failed for object: ${JSON.stringify(node)}
            `;
            throw new Error(errorMessage);
        }
        result = uid;
    }
    return result
}

