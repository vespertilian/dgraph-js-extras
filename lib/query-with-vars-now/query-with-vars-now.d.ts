import * as dgraph from 'dgraph-js';
export interface IxQueryParams {
    query: string;
    vars?: {
        [k: string]: any;
    };
}
export declare function xQueryNow({query, vars}: IxQueryParams, dgraphClient: dgraph.DgraphClient): Promise<any>;
