import * as dgraph from 'dgraph-js';

export function XDropDBNow(c: dgraph.DgraphClient, _dgraph = dgraph): Promise<dgraph.Payload> {
    const op = new _dgraph.Operation();
    op.setDropAll(true);
    return c.alter(op);
}