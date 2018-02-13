import * as dgraph from 'dgraph-js'
import {createDgraphClient} from '../src/create-client/create-dgraph-client';

export async function setup(): Promise<dgraph.DgraphClient> {
    const {dgraphClient} = createDgraphClient();
    await dropAll(dgraphClient);
    return dgraphClient;
}

export function dropAll(c: dgraph.DgraphClient): Promise<dgraph.Payload> {
    const op = new dgraph.Operation();
    op.setDropAll(true);
    return c.alter(op);
}