import * as dgraph from 'dgraph-js';
import {XCreateDgraphClient} from '../create-client/create-dgraph-client';
import {XSetSchema} from '../set-schema/set-schema';
import {XTrxSetJSNow} from '../trx-set-now/trx-set-now';

export interface ISetupReturnValue {
    dgraphClient: dgraph.DgraphClient,
        dgraphClientStub: dgraph.DgraphClientStub
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
    await XSetSchema(schema, dgraphClient);

    if (data) {
        await XTrxSetJSNow(data, dgraphClient)
    }

    return {dgraphClient, dgraphClientStub}
}

export function dropAll(c: dgraph.DgraphClient, _dgraph = dgraph): Promise<dgraph.Payload> {
    const op = new _dgraph.Operation();
    op.setDropAll(true);
    return c.alter(op);
}