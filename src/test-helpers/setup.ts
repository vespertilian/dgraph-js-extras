import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import {ICreateDgraphClientConfig, XCreateDgraphClient} from '../create-client/create-dgraph-client';
import {XSetSchemaNow, XTrxSetJSNow} from '..';
import {XDropDBNow} from './drob-db';

export interface ISetupReturnValue {
    dgraphClient: dgraph.DgraphClient,
    dgraphClientStub: dgraph.DgraphClientStub,
    result?: messages.Assigned
}

export async function XSetupForTestNow(config?: ICreateDgraphClientConfig, _XCreateDgraphClient=XCreateDgraphClient, _drop=XDropDBNow): Promise<ISetupReturnValue> {

    const defaults = {
        port: 9081,
        host: null,
        debug: false
    };

    const testConfig: ICreateDgraphClientConfig = Object.assign(defaults, config);

    const {dgraphClient, dgraphClientStub} = _XCreateDgraphClient(testConfig);
    await _drop(dgraphClient);
    return {dgraphClient, dgraphClientStub};
}

export interface ISetupWithParams {
    schema: string | null,
    data?: object | null
    debugDgraphClient?: boolean
}

export async function XSetupWithSchemaDataNow(params: ISetupWithParams): Promise<ISetupReturnValue> {
    const defaultParams: ISetupWithParams = {
        schema: null,
        data: null,
        debugDgraphClient: false
    };

    const {schema, data, debugDgraphClient } = Object.assign(defaultParams, params);

    const {dgraphClient, dgraphClientStub} = await XSetupForTestNow({debug: debugDgraphClient});
    await XSetSchemaNow(schema, dgraphClient);

    let result = null;
    if (data) {
        result = await XTrxSetJSNow(data, dgraphClient)
    }

    return {dgraphClient, dgraphClientStub, result}
}

