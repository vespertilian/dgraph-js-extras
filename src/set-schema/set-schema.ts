import * as dgraph from 'dgraph-js'

export async function xSetSchemaAlt(schema: string, dgraphClient: dgraph.DgraphClient, _dgraph: any = dgraph): Promise<dgraph.Payload> {
    const op = new _dgraph.Operation();
    op.setSchema(schema);
    return dgraphClient.alter(op);
}
