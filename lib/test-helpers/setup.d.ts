import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import { ICreateDgraphClientConfig, XCreateDgraphClient } from '../create-client/create-dgraph-client';
import { XDropDBNow } from './drob-db';
export interface ISetupReturnValue {
    dgraphClient: dgraph.DgraphClient;
    dgraphClientStub: dgraph.DgraphClientStub;
    result?: messages.Assigned;
}
export declare function XSetupForTestNow(config?: ICreateDgraphClientConfig, _XCreateDgraphClient?: typeof XCreateDgraphClient, _drop?: typeof XDropDBNow): Promise<ISetupReturnValue>;
export interface ISetupWithParams {
    schema: string | null;
    data?: object | null;
    debugDgraphClient?: boolean;
}
export declare function XSetupWithSchemaDataNow(params: ISetupWithParams): Promise<ISetupReturnValue>;
