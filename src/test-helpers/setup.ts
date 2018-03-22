import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import {XCreateDgraphClient} from '../src/create-client/create-dgraph-client';
import {XSetSchemaNow} from '../src/set-schema-now/set-schema-now';
import {XTrxSetJSNow} from '../src/js-set-now/js-set-now';

export interface ISetupReturnValue {
    dgraphClient: dgraph.DgraphClient,
    dgraphClientStub: dgraph.DgraphClientStub,
    result?: messages.Assigned
}

export async function setup(debug: boolean = false): Promise<ISetupReturnValue> {
    const {dgraphClient, dgraphClientStub} = XCreateDgraphClient({debug});
    await dropAll(dgraphClient);
    return {dgraphClient, dgraphClientStub};
}

export interface ISetupWithParams {
    schema: string | null,
    data?: object | null
    debugDgraphClient?: boolean
}

export async function setupWith(params: ISetupWithParams): Promise<ISetupReturnValue> {
    const defaultParams: ISetupWithParams = {
        schema: null,
        data: null,
        debugDgraphClient: false
    };

    const {schema, data, debugDgraphClient } = Object.assign(defaultParams, params);

    const {dgraphClient, dgraphClientStub} = await setup(debugDgraphClient);
    await XSetSchemaNow(schema, dgraphClient);

    let result = null;
    if (data) {
        result = await XTrxSetJSNow(data, dgraphClient)
    }

    return {dgraphClient, dgraphClientStub, result}
}

export function dropAll(c: dgraph.DgraphClient, _dgraph = dgraph): Promise<dgraph.Payload> {
    const op = new _dgraph.Operation();
    op.setDropAll(true);
    return c.alter(op);
}

export function getUids(params: {numberOfIdsToGet: number, result: messages.Assigned}): string[] {
    let uids = [];
    for(let i=0; i < params.numberOfIdsToGet; i++) {
        const key = `blank-${i}`;
        const uid = params.result.getUidsMap().get(key);
        uids.push(uid)
    }
    return uids;
}