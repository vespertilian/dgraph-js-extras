/**
 * @module ExtractUids
 */
import { Assigned } from "dgraph-js/generated/api_pb";
/**
 *
 * xExtractNamedUids lets you wrap any of the set commands that return a dgraph assigned value or a **promise** that returns a dgraph assigned value
 *
 * ```ts
 * const sampleData = {
 * uid: "_:user",
 * name: "cameron",
 * username: "vespertilian",
 *  address: {
 *   uid: "_:address",
 *   street: 'William',
 *   postCode: 2000
 *  }
 * };
 *
 * // Wrapping the xSetJSONCommitTxn promise. Nice.
 * const [userId, addressId] = await xExtractNamedUids(['user', 'address'], xSetJSONCommitTxn(sampleData, dgraphClient))
 * ```
 */
export declare function xExtractNamedUids(names: string[], mutation: Promise<Assigned>): Promise<string[]>;
export declare function xExtractNamedUids(names: string[], mutation: Assigned): string[];
