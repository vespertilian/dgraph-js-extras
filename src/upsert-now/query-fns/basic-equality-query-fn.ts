import * as dgraph from 'dgraph-js'
import {queryFnReturnValues} from '../upsert-now';

// TODO this is more of a function that a query now, maybe change the name
export const basicEqualityQueryFn = searchPredicates => node => queryFn(searchPredicates, node);

function queryFn(_searchPredicates: string | string[], node: object): queryFnReturnValues {
    // make search predicates an array if it is not already
    const searchPredicates: string[] =
        Array.isArray(_searchPredicates) ?
            _searchPredicates
            : [_searchPredicates];

    // check values are present on predicate
    const searchValues: string[] = searchPredicates.map((predicate, index) => {
        const searchValue = node[predicate];
        if(!searchValue) {
            const error = new Error(`
        The search predicate/s must be a value on the object you are trying to persist.
        
        "${searchPredicates[index]}" does not exist on:
        ${JSON.stringify(node)}`);
            throw error;
        }
        return searchValue
    });

    let dgraphQuery = '';

    const searchLength = searchValues.length;
    if(searchLength === 1) {
        // simple case simple query
        dgraphQuery = `{
            q(func: eq(${searchPredicates}, "${searchValues}")) {
                uid
            }
        }`;
    } else {
        // build query
        dgraphQuery = `
        {
            q(func: eq(${searchPredicates[0]}, "${searchValues[0]}"))`;

        // add first filter
        dgraphQuery = dgraphQuery.concat(
            `
            @filter(eq(${searchPredicates[1]}, "${searchValues[1]}")`
        );

        // add more filters if required
        if(searchValues.length > 2){
            for(let i=2; i < searchLength; i++) {
                dgraphQuery = dgraphQuery.concat(
                    `
                AND eq(${searchPredicates[i]}, "${searchValues[i]}")`
                )
            }
        }
        // close the filters, get the uid and close the larger query
        dgraphQuery = dgraphQuery.concat(`)
            {
                uid
            }
        }`)
    }

    function nodeFoundFn(queryResult: dgraph.Response): string {

        const [existingUid, ...others] = queryResult.getJson().q.map(r => r.uid);

        if(others.length > 0) {
            const error = new Error(`
                    More than one node matches "${searchValues}" for the "${searchPredicates}" predicate.
                    Aborting XUpsertNow. 
                    Delete the extra values before tyring XUpsert again.`);
            throw error;
        }
        return existingUid
    }

    return {dgraphQuery, nodeFoundFn}
}

