import * as dgraph from 'dgraph-js'
import {XSetJs} from '../js-set/js-set';


export async function XUpsertNow(searchPredicates: string | string[], data: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<void> {
    if(Array.isArray(data)) {
        return XFindOrCreateArray(searchPredicates, data, dgraphClient, _dgraph)
    } else {
        return XFindOrCreateObject(searchPredicates, data, dgraphClient, _dgraph)
    }
}

async function XFindOrCreateArray(searchPredicates: string | string[], nodes: object[], dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<void> {
    const errors: {error: Error, forNode: any}[] = [];
    for(let i=0; i < nodes.length; i++) {
        const currentNode = nodes[i];
        try {
            await XFindOrCreateObject(searchPredicates, currentNode, dgraphClient)
        } catch(e) {
            errors.push({
                error: e,
                forNode: currentNode
            })
        }
    }

    if(errors.length > 0) {
        let message: string = `${errors.length} node/s failed to upsert`;
        errors.forEach(e => {
            message = message.concat(`
                        node: ${JSON.stringify(e.forNode)}
                        error: ${e.error.message}
                    `)
        });
        message = message.concat(`
            All other nodes were upserted
        `);
        throw new Error(message);
    }
}

async function XFindOrCreateObject(searchPredicates: string | string[], node: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<void> {


    const {query, searchValues} = getSearchQuery(searchPredicates, node);


    const transaction = dgraphClient.newTxn();
    try {

        const queryResult = await transaction.query(query);

        const [uid, ...others] = queryResult.getJson().q.map(r => r.uid);

        if(uid) {
            if(others.length > 0) {
                const error = new Error(`
                    More than one node matches "${searchValues}" for the "${searchPredicates}" predicate. 
                    Aborting XUpsert. 
                    Delete the extra values before tyring XUpsert again.`);
                throw error;
            }
            const mu = XSetJs(Object.assign({}, node, {uid}));
            await transaction.mutate(mu)
        } else {
            const mu = XSetJs(node);
            await transaction.mutate(mu)
        }

        await transaction.commit()
    } finally {
        await transaction.discard()
    }

}

function getSearchQuery(_searchPredicates: string | string[], node: object): {query: string, searchValues: string[]}{

    // make search predicates an array if it is not already
    const searchPredicates =
        Array.isArray(_searchPredicates) ?
            _searchPredicates
            : [_searchPredicates];


    const searchValues: string[] = searchPredicates.map((predicate) => {
        const searchValue = node[predicate];
        if(typeof searchValue !== 'string') {
            const error = new Error(`
        The search predicate/s must be a searchable value on the object you are creating.
        
        "${searchPredicates}" does not exist as a string on:
        ${JSON.stringify(node)}`);
            throw error;
        }
        return searchValue
    });

    let query = '';
    if(searchValues.length === 1) {
        query = `{
            q(func: eq(${searchPredicates}, "${searchValues[0]}")) {
                uid
            }
        }`;
    }

    return {query, searchValues}
}