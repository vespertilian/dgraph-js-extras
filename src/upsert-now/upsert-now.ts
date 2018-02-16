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


    const {query, searchValues} = buildUpsertQuery(searchPredicates, node);


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

// TODO this is really a find by predicate function that returns the id of the node
export function buildUpsertQuery(_searchPredicates: string | string[], node: object): {query: string, searchValues: string[]}{

    // make search predicates an array if it is not already
    const searchPredicates: string[] =
        Array.isArray(_searchPredicates) ?
            _searchPredicates
            : [_searchPredicates];


    // check values are present on predicate
    const searchValues: string[] = searchPredicates.map((predicate, index) => {
        const searchValue = node[predicate];
        if(typeof searchValue !== 'string') {
            const error = new Error(`
        The search predicate/s must be a searchable value on the object you are creating.
        
        "${searchPredicates[index]}" does not exist as a string on:
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