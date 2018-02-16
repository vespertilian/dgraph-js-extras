import * as dgraph from 'dgraph-js'

export async function XSetSchemaNow(schema: string, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<dgraph.Payload> {
    const op = new _dgraph.Operation();
    op.setSchema(schema);
    return dgraphClient.alter(op);
}
