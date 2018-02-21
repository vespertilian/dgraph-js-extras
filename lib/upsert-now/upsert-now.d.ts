import * as dgraph from 'dgraph-js';
export declare function XUpsertNow(searchPredicates: string | string[], data: object[], dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string[]>;
export declare function XUpsertNow(searchPredicates: string | string[], data: object, dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string>;
export declare function buildUpsertQuery(_searchPredicates: string | string[], node: object): {
    query: string;
    searchValues: string[];
};
