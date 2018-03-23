import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
export declare function XSetJSONNow(object: object, dgraphClient: dgraph.DgraphClient, _dgraph?: typeof dgraph): Promise<messages.Assigned>;
