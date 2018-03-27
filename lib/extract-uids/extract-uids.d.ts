import { Assigned } from "dgraph-js/generated/api_pb";
export declare function XExtractUids(_result: Promise<Assigned>, limitTo?: number): Promise<string[]>;
export declare function XExtractUids(_result: Assigned, limitTo?: number): string[];
export declare function XExtractFirstUid(result: Promise<Assigned>): Promise<string>;
export declare function XExtractFirstUid(result: Assigned): string;
export declare function isPromise(potentialPromise: Promise<any> | any): potentialPromise is Promise<any>;
