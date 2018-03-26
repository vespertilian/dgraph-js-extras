import * as messages from "dgraph-js/generated/api_pb";
export declare function XExtractUids(_result: Promise<messages.Assigned>, limitTo?: number): Promise<string[]>;
export declare function XExtractUids(_result: messages.Assigned, limitTo?: number): string[];
export declare function XExtractFirstUid(_result: Promise<messages.Assigned>): Promise<string[]>;
export declare function XExtractFirstUid(_result: messages.Assigned): string[];
