/**
 * @module ExtractUids
 */
import { Assigned } from "dgraph-js/generated/api_pb";
export declare function xExtractNamedUids(names: string[], mutation: Promise<Assigned>): Promise<string[]>;
export declare function xExtractNamedUids(names: string[], mutation: Assigned): string[];
