/**
 * @module Upsert
 */
import * as dgraph from 'dgraph-js';
import { uid } from '../upsert/upsert';
export interface IObjectMap {
    [key: string]: object;
}
export interface IUidMap {
    [key: string]: uid;
}
/**
 * #### Upsert an object which has keys for the upsert objects
 *
 * ```typescript
 * const map = {
 *    howard: { // howard is an upsert key
 *       name: 'Howard',
 *       email: 'hb@gmail.com'
 *    },
 *    cameron: { // so is cameron
 *       name: 'Cameron B',
 *       email: 'cam@gmail.com'
 *    }
 * };
 *
 * const resultMap = await xUpsertMapCommitTxn(basicEqualityUpsertFn('email'), map, dgraphClient);
 *
 * // returns an object that has the uid of the upserted values
 * const expectedResult: IUidMap = {
 *    cameron: cameronUid,
 *    howard: howardUid
 * };
 * ```
 *
 * **Not sure if this function adds enough value to be kept in the lib. Please do comment in the issues**
 */
export declare function xUpsertMapCommitTxn(queryFn: any, data: IObjectMap, dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<IUidMap>;
