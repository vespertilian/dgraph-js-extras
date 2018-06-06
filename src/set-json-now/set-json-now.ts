import * as dgraph from 'dgraph-js'
import * as messages from "dgraph-js/generated/api_pb";
import {xSetJSONCommitNow} from '../set-json/set-json';

export async function xSetJSONNow(object: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<messages.Assigned> {
    return dgraphClient.newTxn().mutate(xSetJSONCommitNow(object));
}
