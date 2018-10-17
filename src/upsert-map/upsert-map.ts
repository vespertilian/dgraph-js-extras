import * as dgraph from 'dgraph-js'
import {xUpsertTxn} from '../upsert/upsert';

export interface IObjectMap {
   [key: string]: object
}

export interface IUidMap {
   [key: string]: string
}

export async function xUpsertMapTxn(queryFn, data: IObjectMap, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph) {
   const objectKeys = Object.keys(data);
   const objects: object[] = objectKeys.map(key => { return {...data[key]} });
   const uids = await xUpsertTxn(queryFn, objects, dgraphClient, _dgraph);
   const resultMap: IUidMap = objectKeys.reduce((acc, key, index) => { return {...acc, [key]: uids[index]} }, {});
   return resultMap;
}