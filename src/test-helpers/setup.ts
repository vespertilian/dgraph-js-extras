/**
 * @module TestHelpers
 */

import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import {ICreateDgraphClientConfig, xCreateDgraphClient} from '../create-client/create-dgraph-client';
import {xSetSchemaAlt} from '..';
import {xDropDBAlt} from './drob-db';
import {xSetJSONCommitTxn} from '../set-json/set-json';

export interface ISetupReturnValue {
    dgraphClient: dgraph.DgraphClient,
    dgraphClientStub: dgraph.DgraphClientStub,
    result?: messages.Assigned
}

export async function xSetupForTest(config?: ICreateDgraphClientConfig, _xCreateDgraphClient=xCreateDgraphClient, _drop=xDropDBAlt): Promise<ISetupReturnValue> {

    const defaults = {
        port: 9081,
        host: null,
        debug: false
    };

    const testConfig: ICreateDgraphClientConfig = Object.assign(defaults, config);

    const {dgraphClient, dgraphClientStub} = _xCreateDgraphClient(testConfig);
    await _drop(dgraphClient);
    return {dgraphClient, dgraphClientStub};
}

export interface ISetupWithParams {
    schema?: string | null,
    data?: object | null
    debugDgraphClient?: boolean
}

export async function xSetupWithSchemaDataCommitTxn(params: ISetupWithParams): Promise<ISetupReturnValue> {
    const defaultParams: ISetupWithParams = {
        schema: null,
        data: null,
        debugDgraphClient: false
    };

    const {schema, data, debugDgraphClient } = Object.assign(defaultParams, params);

    const {dgraphClient, dgraphClientStub} = await xSetupForTest({debug: debugDgraphClient});

    if(schema) {
      await xSetSchemaAlt(schema, dgraphClient);
    }

    let result = null;
    if (data) {
        result = await xSetJSONCommitTxn(data, dgraphClient)
    }

    return {dgraphClient, dgraphClientStub, result}
}

