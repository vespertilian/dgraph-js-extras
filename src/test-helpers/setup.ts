/**
 * @module TestHelpers
 */

import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import {ICreateDgraphClientConfig, xCreateDgraphClient} from '../create-client/create-dgraph-client';
import {xSetSchemaAlt} from '..';
import {xDropDBAlt} from '../drop-db/drob-db';
import {xSetJSONCommitTxn} from '../set-json/set-json';

export interface ISetupReturnValue {
    dgraphClient: dgraph.DgraphClient,
    dgraphClientStub: dgraph.DgraphClientStub,
    result?: messages.Assigned
}

/**
 * - Sets some defaults like using port 9081 when testing vs 9080 when developing
 * - Creates the client
 * - Drops the DB
 *
 * Most of the time you will use {@link xSetupWithSchemaDataCommitTxn} which does all of the above + optionally sets a schema and data.
 */
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

/**
 * - Sets some defaults like using port 9081 when testing vs 9080 when developing
 * - Creates the client
 * - Drops the DB
 * - Sets a schema
 * - Sets some initial data
 *
 * ```ts
 * const schema = `
 * name: string @index(exact) .
 * street: string @index(exact) .
 * `;
 *
 * const sampleData = {
 * uid: "_:user",
 * name: "cameron",
 * addresses: [
 *  {uid: "_:address1", street: "william", postcode: 2000},
 *  {uid: "_:address2", street: "george", postcode: 2001},
 *  {uid: "_:address3", street: "hay", postcode: 2444},
 *  {uid: "_:address4", street: "short", postcode: 2107}
 *  ]
 * };
 *
 * const {result, dgraphClient} = await xSetupWithSchemaDataCommitTxn({schema, data: sampleData});
 * ```
 */
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

