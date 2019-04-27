/**
 * @module DropDB
 */

import * as dgraph from 'dgraph-js';

/**
 * xDropDBAlt is shorthand for:
 *
 * ```ts
 * const op = new _dgraph.Operation();
 * op.setDropAll(true);
 * return c.alter(op);
 * ```
 */
export async function xDropDBAlt(c: dgraph.DgraphClient, _dgraph: any = dgraph): Promise<dgraph.Payload> {
    const op = new _dgraph.Operation();
    op.setDropAll(true);
    return c.alter(op);
}
