import * as dgraph from 'dgraph-js'
import {XSetJs} from '../js-set/js-set';


export async function XUpsertNow(keyPredicate: string, data: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<void> {
    if(Array.isArray(data)) {
        return XFindOrCreateArray(keyPredicate, data, dgraphClient, _dgraph)
    } else {
        return XFindOrCreateObject(keyPredicate, data, dgraphClient, _dgraph)
    }
}

async function XFindOrCreateArray(keyPredicate: string, nodes: object[], dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<void> {
    const errors: {error: Error, forNode: any}[] = [];
    for(let i=0; i < nodes.length; i++) {
        const currentNode = nodes[i];
        try {
            await XFindOrCreateObject(keyPredicate, currentNode, dgraphClient)
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

async function XFindOrCreateObject(keyPredicate: string, node: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<void> {

    const searchValue = node[keyPredicate];

    if(typeof searchValue !== 'string') {
        const error = new Error(`
        The key predicate must be a searchable string value on the object you are creating.
        
        "${keyPredicate}" does not exist as a string on:
        ${JSON.stringify(node)}`);
        throw error;
    }


    const transaction = dgraphClient.newTxn();
    try {
        const query = `{
            q(func: eq(${keyPredicate}, "${searchValue}")) {
                uid
            }
        }`;

        const queryResult = await transaction.query(query);

        const [uid, ...others] = queryResult.getJson().q.map(r => r.uid);

        if(uid) {
            if(others.length > 0) {
                const error = new Error(`
                    More than one node matches "${searchValue}" for the "${keyPredicate}" predicate. 
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
