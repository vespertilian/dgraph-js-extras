import * as dgraph from 'dgraph-js'
import {SchemaNode} from 'dgraph-js';

export interface ISchemaMap {
    [predicate: string]: SchemaNode
}

export async function XGetSchemaMap(dgraphClient: dgraph.DgraphClient): Promise<ISchemaMap>{
    const query = `
                schema {
                    type
                    index
                    reverse
                    tokenizer
                }
        `;

    const res = await dgraphClient.newTxn().query(query);
    const schemaNodes: SchemaNode[]= res.getSchemaList();//?

    // maps the schema nodes so they are keyed by predicate
    const schemaMap = schemaNodes.reduce((accumulator, schemaNode) => {
        const predicate = schemaNode.getPredicate();

        // only return predicates we created
        if(predicate !== '_predicate_') {
            accumulator[predicate] = schemaNode;
        }
        return accumulator;
    }, {});

    return schemaMap;
}
