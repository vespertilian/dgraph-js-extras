"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicEqualityUpsertFn = function (searchPredicates) { return function (node) { return queryFn(searchPredicates, node); }; };
function queryFn(_searchPredicates, node) {
    // make search predicates an array if it is not already
    var searchPredicates = Array.isArray(_searchPredicates) ?
        _searchPredicates
        : [_searchPredicates];
    // check values are present on predicate
    var searchValues = searchPredicates.map(function (predicate, index) {
        var searchValue = node[predicate];
        if (!searchValue) {
            var error = new Error("\n        The search predicate/s must be a value on the object you are trying to persist.\n        \n        \"" + searchPredicates[index] + "\" does not exist on:\n        " + JSON.stringify(node));
            throw error;
        }
        return searchValue;
    });
    var dgraphQuery = '';
    var searchLength = searchValues.length;
    if (searchLength === 1) {
        // simple case simple query
        dgraphQuery = "{\n            q(func: eq(" + searchPredicates + ", \"" + searchValues + "\")) {\n                uid\n            }\n        }";
    }
    else {
        // build query
        dgraphQuery = "\n        {\n            q(func: eq(" + searchPredicates[0] + ", \"" + searchValues[0] + "\"))";
        // add first filter
        dgraphQuery = dgraphQuery.concat("\n            @filter(eq(" + searchPredicates[1] + ", \"" + searchValues[1] + "\")");
        // add more filters if required
        if (searchValues.length > 2) {
            for (var i = 2; i < searchLength; i++) {
                dgraphQuery = dgraphQuery.concat("\n                AND eq(" + searchPredicates[i] + ", \"" + searchValues[i] + "\")");
            }
        }
        // close the filters, get the uid and close the larger query
        dgraphQuery = dgraphQuery.concat(")\n            {\n                uid\n            }\n        }");
    }
    function nodeFoundFn(queryResult) {
        var _a = queryResult.getJson().q.map(function (r) { return r.uid; }), existingUid = _a[0], others = _a.slice(1);
        if (others.length > 0) {
            var error = new Error("\n                    More than one node matches \"" + searchValues + "\" for the \"" + searchPredicates + "\" predicate.\n                    Aborting xUpsertNow. \n                    Delete the extra values before tyring xUpsert again.");
            throw error;
        }
        return { existingUid: existingUid };
    }
    return { dgraphQuery: dgraphQuery, nodeFoundFn: nodeFoundFn };
}
