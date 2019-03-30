/**
 * @module ExtractUids
 */

import {Assigned} from "dgraph-js/generated/api_pb"
import {isPromise} from '../util/is-promise';

// core function
function extractNamedUids(mutation: Assigned, names: string[]): string[] {
  return names.map(name => {
    const result = mutation.getUidsMap().get(name);
    if(!result) throw new Error(`No named uid present for '${name}'`);
    return result;
  })
}

// fancy way to let us use this function with an existing Async function (promise) or existing mutation
export function xExtractNamedUids(names: string[], mutation: Promise<Assigned>): Promise<string[]>
export function xExtractNamedUids(names: string[], mutation: Assigned): string[]
export function xExtractNamedUids(names: string[], mutation: Promise<Assigned> | Assigned): Promise<string[]> | string[] {
  let result = [];
  try {
    result = isPromise(mutation) ?
      extractUidsFromPromise(mutation) :
      extractNamedUids(mutation, names);
  } catch(e) {
    ThrowExtractError(e, mutation)
  }

  function extractUidsFromPromise(p) {
    return p.then((r) => {
      try {
        return extractNamedUids(r, names)
      } catch(e) {
        return ThrowExtractError(e, r);
      }
    })
  }

  // needs to be a function so we can call it from the promise
  // as well as from the main function
  function ThrowExtractError(e, r){
    throw new Error(`
        xExtractNamedUids could not extract named uids
        
        Original Error: ${e.message}
        
        Mutation result: ${JSON.stringify(r)}
        `)
  }
  return result;
}
