import * as dgraph from 'dgraph-js'
import {XSetJs} from '../js-set/js-set';


export async function XUpsertNow(keyPredicate: string, value: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<any> {
    return XFindOrCreateObject(keyPredicate, value, dgraphClient, _dgraph)
}

async function XFindOrCreateObject(keyPredicate: string, data: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<any> {

    const searchValue = data[keyPredicate];

    if(typeof searchValue !== 'string') {
        const error = new Error(`
        The key predicate must be a searchable string value on the object you are creating.
        
        "${keyPredicate}" does not exist as a string on:
        ${JSON.stringify(data)}`);
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
            const mu = XSetJs(Object.assign(data, {uid}));
            await transaction.mutate(mu)
        } else {
            const mu = XSetJs(data);
            await transaction.mutate(mu)
        }

        await transaction.commit()
    } finally {
        await transaction.discard()
    }

}
