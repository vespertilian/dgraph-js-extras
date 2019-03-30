/**
 * @module TestHelpers
 */

import * as dgraph from 'dgraph-js'
import {SchemaNode} from 'dgraph-js';

export interface ISchemaMap {
    [predicate: string]: SchemaNode
}

export async function xGetSchemaMapTxn(dgraphClient: dgraph.DgraphClient): Promise<ISchemaMap>{
    const query = `
                schema {
                    type
                    index
                    reverse
                    tokenizer
                }
        `;

    const res = await dgraphClient.newTxn().query(query);
    const schemaNodes: SchemaNode[]= res.getSchemaList();

    // maps the schema nodes so they are keyed by predicate
    const schemaMap = schemaNodes.reduce((accumulator, schemaNode) => {
        const predicate = schemaNode.getPredicate();

        // only return predicates we created
        // they don't contain _predicate_ and also dont include dgraph. (namespaces)
        // dgraph namespaces include ACL and password fields
        if(predicate !== '_predicate_' && !predicate.includes('dgraph.')) {
            accumulator[predicate] = schemaNode;
        }
        return accumulator;
    }, {});

    return schemaMap;
}
