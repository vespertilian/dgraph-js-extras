import * as dgraph from 'dgraph-js'
import * as messages from "dgraph-js/generated/api_pb";
import {XSetJSCommitNow} from '../js-set/js-set';

export async function XTrxSetJSNow(object: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<messages.Assigned> {
    return dgraphClient.newTxn().mutate(XSetJSCommitNow(object));
}
