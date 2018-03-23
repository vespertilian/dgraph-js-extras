import * as dgraph from 'dgraph-js';
import { Mutation } from 'dgraph-js';
export declare function XSetJSON(object: object, _dgraph?: typeof dgraph): Mutation;
export declare function XSetJSONCommitNow(object: object, _dgraph?: typeof dgraph): Mutation;
