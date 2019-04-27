/**
 * @module ExtractUids
 */
import { Assigned } from "dgraph-js/generated/api_pb";
/**
 *
 * xExtractUids lets you wrap any of the set commands that return a dgraph assigned value or a **promise** that returns a dgraph assigned value
 *
 * ```ts
 * const users = [
 *  { username: 'foo' }
 *  { username: 'bar' }
 * ]
 *
 * // Wrapping the xSetJSONCommitTxn promise. Nice.
 * const [id1, id2] = await xExtractUids(xSetJSONCommitTxn(users, dgraphClient));
 * ```
 *
 */
export declare function xExtractUids(mutation: Promise<Assigned>, limitTo?: number): Promise<string[]>;
export declare function xExtractUids(mutation: Assigned, limitTo?: number): string[];
/**
 *
 * xExtractFirstUid is useful when you expect only one value and dont want to destructure the returned array.
 * It's effectively just {@link xExtractUids} limited to one result
 *
 * ```ts
 * const users = [
 *  { username: 'foo' }
 *  { username: 'bar' }
 * ]
 *
 * // Wrapping the xSetJSONCommitTxn promise. Nice.
 * const id1 = await xExtractFirstUid(xSetJSONCommitTxn(users, dgraphClient));
 * ```
 *
 */
export declare function xExtractFirstUid(mutation: Promise<Assigned>): Promise<string>;
export declare function xExtractFirstUid(mutation: Assigned): string;
