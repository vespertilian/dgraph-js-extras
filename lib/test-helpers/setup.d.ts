import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import { ICreateDgraphClientConfig, xCreateDgraphClient } from '../create-client/create-dgraph-client';
import { xDropDBNow } from './drob-db';
export interface ISetupReturnValue {
    dgraphClient: dgraph.DgraphClient;
    dgraphClientStub: dgraph.DgraphClientStub;
    result?: messages.Assigned;
}
export declare function xSetupForTestNow(config?: ICreateDgraphClientConfig, _xCreateDgraphClient?: typeof xCreateDgraphClient, _drop?: typeof xDropDBNow): Promise<ISetupReturnValue>;
export interface ISetupWithParams {
    schema?: string | null;
    data?: object | null;
    debugDgraphClient?: boolean;
}
export declare function xSetupWithSchemaDataNow(params: ISetupWithParams): Promise<ISetupReturnValue>;
