import * as dgraph from 'dgraph-js'
import {xSetJSON} from '../set-json/set-json';
import {Txn} from 'dgraph-js';

export interface INodeFoundFunction {
    existingUid: string | null
    newNodeFn?: (node: any) => object
}

export interface IUpsertFnReturnValues {
    dgraphQuery: string
    nodeFoundFn: (queryResult: dgraph.Response) => INodeFoundFunction
}

// overload function to always return a string array when an object array is passed in
export async function xUpsertTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object[], dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string[]>
export async function xUpsertTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object, dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string>
export async function xUpsertTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object | object[], dgraphClient: dgraph.DgraphClient, _dgraph: any = dgraph): Promise<string | string[]> {
    if(Array.isArray(data)) {
        return xUpsertArrayTxn(upsertFn, data, dgraphClient, _dgraph)
    } else {
        return xUpsertObjectTxn(upsertFn, data, dgraphClient, _dgraph)
    }
}

async function xUpsertArrayTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, nodes: object[], dgraphClient: dgraph.DgraphClient, _dgraph: any = dgraph): Promise<string[]> {
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

async function xUpsertObjectTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, node: object, dgraphClient: dgraph.DgraphClient, _dgraph: any = dgraph): Promise<string> {
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

export async function xUpsertObject(upsertFn: (input?: any) => IUpsertFnReturnValues, node: object, transaction: Txn): Promise<string | null> {
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
                The find functions for xUpsertNow should only return a single node.
                That's how we know which node we need to update.
                
                Therefor xUpsertNow cannot support creating multiple new nodes.
                It seems that you have passed in an object that requires the creation of multiple nodes.
                
                Update your upsert to only create a single node at a time .
                xUpsertNow does accept an array of objects to upsert.
                
                Failed for object: ${JSON.stringify(node)}
            `;
            throw new Error(errorMessage);
        }
        result = uid;
    }
    return result
}

