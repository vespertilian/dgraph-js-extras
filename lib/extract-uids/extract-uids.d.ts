import { Assigned } from "dgraph-js/generated/api_pb";
export declare function xExtractUids(_result: Promise<Assigned>, limitTo?: number): Promise<string[]>;
export declare function xExtractUids(_result: Assigned, limitTo?: number): string[];
export declare function xExtractFirstUid(result: Promise<Assigned>): Promise<string>;
export declare function xExtractFirstUid(result: Assigned): string;
export declare function isPromise(potentialPromise: Promise<any> | any): potentialPromise is Promise<any>;
