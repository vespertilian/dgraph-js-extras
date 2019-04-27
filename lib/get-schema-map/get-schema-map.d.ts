/**
 * @module TestHelpers
 */
import * as dgraph from 'dgraph-js';
import { SchemaNode } from 'dgraph-js';
export interface ISchemaMap {
    [predicate: string]: SchemaNode;
}
/**
 * xGetSchemaMapTxn is useful for verifying you schema is what you think it is.
 * **Will ignore system predicates only returning the predicates you have set!**
 *
 * ```ts
 * const schema = `
 *  name: string @index(fulltext) .
 *  age: int .
 *  percent: float .
 *  awesome: bool .
 *  friend: uid @reverse .
 *  date: dateTime .
 *  location: geo .
 * `;
 * await xSetSchemaAlt(schema, dgraphClient);
 * const schemaMap = await xGetSchemaMapTxn(dgraphClient);
 * // check our schema
 * expect(schemaMap.name.getType()).toBe('string');
 * expect(schemaMap.age.getType()).toBe('int');
 * ```
 */
export declare function xGetSchemaMapTxn(dgraphClient: dgraph.DgraphClient): Promise<ISchemaMap>;
