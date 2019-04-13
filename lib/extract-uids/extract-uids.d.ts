/**
 * @module ExtractUids
 */
import { Assigned } from "dgraph-js/generated/api_pb";
export declare function xExtractUids(mutation: Promise<Assigned>, limitTo?: number): Promise<string[]>;
export declare function xExtractUids(mutation: Assigned, limitTo?: number): string[];
export declare function xExtractFirstUid(mutation: Promise<Assigned>): Promise<string>;
export declare function xExtractFirstUid(mutation: Assigned): string;
