import * as dgraph from 'dgraph-js';
import { SchemaNode } from 'dgraph-js';
export interface ISchemaMap {
    [predicate: string]: SchemaNode;
}
export declare function XGetSchemaMapNow(dgraphClient: dgraph.DgraphClient): Promise<ISchemaMap>;
