import * as dgraph from 'dgraph-js';
export declare function XUpsertNow(keyPredicate: string, data: object, dgraphClient: dgraph.DgraphClient, _dgraph?: typeof dgraph): Promise<void>;
