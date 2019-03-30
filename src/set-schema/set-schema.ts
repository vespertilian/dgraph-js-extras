/**
 * @module SetSchema
 */

import * as dgraph from 'dgraph-js'

/**
 * Quickly set the schema
 *
 * Example
 * ```ts
 * const {dgraphClient} = await xSetupForTest();
 *
 * const schema = `
 * name: string @index(fulltext) .
 * email: string @index(exact) .
 * friend: uid .`;
 *
 * await xSetSchemaAlt(schema, dgraphClient);
 *
 * // effectively a one line statement for
 * const op = new _dgraph.Operation();
 * op.setSchema(schema);
 * return dgraphClient.alter(op);
 *
 * ```
 */

export async function xSetSchemaAlt(schema: string, dgraphClient: dgraph.DgraphClient, _dgraph: any = dgraph): Promise<dgraph.Payload> {
    const op = new _dgraph.Operation();
    op.setSchema(schema);
    return dgraphClient.alter(op);
}
