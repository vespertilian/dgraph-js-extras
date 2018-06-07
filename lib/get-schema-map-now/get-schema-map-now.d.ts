import * as dgraph from 'dgraph-js';
import { SchemaNode } from 'dgraph-js';
export interface ISchemaMap {
    [predicate: string]: SchemaNode;
}
export declare function xGetSchemaMapNow(dgraphClient: dgraph.DgraphClient): Promise<ISchemaMap>;
