import * as dgraph from 'dgraph-js'
import {XSetJs} from '../js-set/js-set';
import {Txn} from 'dgraph-js';

// overload function to always return a string array when an object array is passed in
export async function XUpsertNow(searchPredicates: string | string[], data: object[], dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string[]>
export async function XUpsertNow(searchPredicates: string | string[], data: object, dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string>

export async function XUpsertNow(searchPredicates: string | string[], data: object | object[], dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<string | string[]> {
    if(Array.isArray(data)) {
        return XFindOrCreateArray(searchPredicates, data, dgraphClient, _dgraph)
    } else {
        return XFindOrCreateObjectNow(searchPredicates, data, dgraphClient, _dgraph)
    }
}

async function XFindOrCreateArray(searchPredicates: string | string[], nodes: object[], dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<string[]> {
    const results: string[] = [];
    const errors: Error[] = [];
    const transaction = dgraphClient.newTxn();
        try {
            for(let i=0; i < nodes.length; i++) {
                const currentNode = nodes[i];
                const result = await XFindOrCreateObject(searchPredicates, currentNode, transaction);
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
                // not the error we want - the one that was thrown in the for loop
                if(errors.length > 0) throw(errors);
                else throw(e)
            }
        }

    return results
}

async function XFindOrCreateObjectNow(searchPredicates: string | string[], node: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<string> {
    let uid = null;
    let error: Error | null = null;
    const transaction = dgraphClient.newTxn();
    try {
        try {
            uid = await XFindOrCreateObject(searchPredicates, node, transaction);
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
            if(error) throw error;
            else throw e
        }
    }
    return uid;
}

async function XFindOrCreateObject(searchPredicates: string | string[], node: object, transaction: Txn): Promise<string | null> {
    let result = null;

    const {query, searchValues} = buildUpsertQuery(searchPredicates, node);
    const queryResult = await transaction.query(query);

    const [existingUid, ...others] = queryResult.getJson().q.map(r => r.uid);

    if(Boolean(existingUid)) {
        if(others.length > 0) {
            const error = new Error(`
                    More than one node matches "${searchValues}" for the "${searchPredicates}" predicate. 
                    Aborting XUpsertNow. 
                    Delete the extra values before tyring XUpsert again.`);
            throw error;
        }
        const mu = XSetJs(Object.assign({}, node, {uid: existingUid}));
        await transaction.mutate(mu);
        result = existingUid;
    } else {
        const mu = XSetJs(node);
        const muResult = await transaction.mutate(mu);
        const uid = muResult.getUidsMap().get('blank-0');
        const deeplyNestedObjectsDetected = Boolean(muResult.getUidsMap().get('blank-1'));
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

// TODO this is really a find by predicate function that returns the id of the node - maybe break out... not sure
export function buildUpsertQuery(_searchPredicates: string | string[], node: object): {query: string, searchValues: string[]}{

    // make search predicates an array if it is not already
    const searchPredicates: string[] =
        Array.isArray(_searchPredicates) ?
            _searchPredicates
            : [_searchPredicates];


    // check values are present on predicate
    const searchValues: string[] = searchPredicates.map((predicate, index) => {
        const searchValue = node[predicate];
        if(!searchValue) {
            const error = new Error(`
        The search predicate/s must be a searchable value on the object you are creating.
        
        "${searchPredicates[index]}" does not exist on:
        ${JSON.stringify(node)}`);
            throw error;
        }
        return searchValue
    });

    let query = '';

    const searchLength= searchValues.length;
    if(searchLength === 1) {
        // simple case simple query
        query = `{
            q(func: eq(${searchPredicates}, "${searchValues}")) {
                uid
            }
        }`;
    } else {
        // build query
        query = `
        {
            q(func: eq(${searchPredicates[0]}, "${searchValues[0]}"))`;

        // add first filter
        query = query.concat(
            `
            @filter(eq(${searchPredicates[1]}, "${searchValues[1]}")`
        );

        // add more filters if required
        if(searchValues.length > 2){
            for(let i=2; i < searchLength; i++) {
                query = query.concat(
                  `
                AND eq(${searchPredicates[i]}, "${searchValues[i]}")`
                )
            }
        }
        // close the filters, get the uid and close the larger query
        query = query.concat(`)
            {
                uid
            }
        }`)
    }

    return {query, searchValues}
}