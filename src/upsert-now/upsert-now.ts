import * as dgraph from 'dgraph-js'
import {XSetJSON} from '../set-json/set-json';
import {Txn} from 'dgraph-js';

export interface queryFnReturnValues {
    dgraphQuery: string
    nodeFoundFn: (queryResult: dgraph.Response) => string | null
}

// overload function to always return a string array when an object array is passed in
export async function XUpsertNow(queryFn: (input?: any) => queryFnReturnValues, data: object[], dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string[]>
export async function XUpsertNow(queryFn: (input?: any) => queryFnReturnValues, data: object, dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string>

export async function XUpsertNow(queryFn: (input?: any) => queryFnReturnValues, data: object | object[], dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<string | string[]> {
    if(Array.isArray(data)) {
        return XUpsertArrayNow(queryFn, data, dgraphClient, _dgraph)
    } else {
        return XUpsertObjectNow(queryFn, data, dgraphClient, _dgraph)
    }
}

async function XUpsertArrayNow(queryFn: (input?: any) => queryFnReturnValues, nodes: object[], dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<string[]> {
    const results: string[] = [];
    const errors: Error[] = [];
    const transaction = dgraphClient.newTxn();
        try {
            for(let i=0; i < nodes.length; i++) {
                const currentNode = nodes[i];
                const result = await XUpsertObject(queryFn, currentNode, transaction);
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
                if(errors.length > 0) throw(errors);
                // if for some reason it was only the transaction.discard that threw the error rethrow that.
                else throw(e)
            }
        }

    return results
}

async function XUpsertObjectNow(queryFn: (input?: any) => queryFnReturnValues, node: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<string> {
    let uid = null;
    let error: Error | null = null;
    const transaction = dgraphClient.newTxn();
    try {
        try {
            uid = await XUpsertObject(queryFn, node, transaction);
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
            if(error) throw error;
            // if for some reason it was only the transaction.discard that threw the error rethrow that.
            else throw e
        }
    }
    return uid;
}

async function XUpsertObject(queryFn: (input?: any) => queryFnReturnValues, node: object, transaction: Txn): Promise<string | null> {
    let result = null;

    const {dgraphQuery, nodeFoundFn} = queryFn(node);

    const queryResult = await transaction.query(dgraphQuery).catch((e) => {
        // Rethrow the error but with more context about exactly what failed
        throw new Error(`XUpsert DgraphQuery failed, check the query your provided against this error: ${e}`)
    });

    const existingUid = nodeFoundFn(queryResult);

    if(Boolean(existingUid) && queryResult) {
        const updatedNode = Object.assign({uid: existingUid}, node);
        const mu = XSetJSON(updatedNode);
        await transaction.mutate(mu);
        result = existingUid;
    } else if(queryResult) {
        const mu = XSetJSON(node);
        const muResult = await transaction.mutate(mu);
        const uid = muResult.getUidsMap().get('blank-0');
        const deeplyNestedObjectsDetected = Boolean(muResult.getUidsMap().get('blank-1'));

        // TODO improve this
        if(deeplyNestedObjectsDetected) {
            const error = new Error(`
                XUpsertNow does not support finding and creating nested objects.
                Failed for object: ${JSON.stringify(node)}
                You should write your own custom transaction for this.
                You can upsert existing references if you have the UID.
            `);
            throw error;
        }
        result = uid;
    }
    return result
}

