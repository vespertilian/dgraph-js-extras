export const basicEqualityQuery = searchPredicates => node => query(searchPredicates, node);

function query(_searchPredicates: string | string[], node: object): {query: string, searchValues: string[], searchPredicates: string[]}{
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

    let query = '';

    const searchLength = searchValues.length;
    if(searchLength === 1) {
        // simple case simple query
        query = `{
            q(func: eq(${searchPredicates}, "${searchValues}")) {
                uid
            }
        }`;
    } else {
        // build query
        query = `
        {
            q(func: eq(${searchPredicates[0]}, "${searchValues[0]}"))`;

        // add first filter
        query = query.concat(
            `
            @filter(eq(${searchPredicates[1]}, "${searchValues[1]}")`
        );

        // add more filters if required
        if(searchValues.length > 2){
            for(let i=2; i < searchLength; i++) {
                query = query.concat(
                    `
                AND eq(${searchPredicates[i]}, "${searchValues[i]}")`
                )
            }
        }
        // close the filters, get the uid and close the larger query
        query = query.concat(`)
            {
                uid
            }
        }`)
    }

    return {query, searchValues, searchPredicates}
}
