import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import { ICreateDgraphClientConfig, xCreateDgraphClient } from '../create-client/create-dgraph-client';
import { xDropDBAlt } from './drob-db';
export interface ISetupReturnValue {
    dgraphClient: dgraph.DgraphClient;
    dgraphClientStub: dgraph.DgraphClientStub;
    result?: messages.Assigned;
}
export declare function xSetupForTest(config?: ICreateDgraphClientConfig, _xCreateDgraphClient?: typeof xCreateDgraphClient, _drop?: typeof xDropDBAlt): Promise<ISetupReturnValue>;
export interface ISetupWithParams {
    schema?: string | null;
    data?: object | null;
    debugDgraphClient?: boolean;
}
export declare function xSetupWithSchemaDataNowTxn(params: ISetupWithParams): Promise<ISetupReturnValue>;
