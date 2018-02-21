"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dgraph = require("dgraph-js");
var js_set_1 = require("../js-set/js-set");
function XUpsertNow(searchPredicates, data, dgraphClient, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (Array.isArray(data)) {
                return [2 /*return*/, XFindOrCreateArray(searchPredicates, data, dgraphClient, _dgraph)];
            }
            else {
                return [2 /*return*/, XFindOrCreateObject(searchPredicates, data, dgraphClient, _dgraph)];
            }
            return [2 /*return*/];
        });
    });
}
exports.XUpsertNow = XUpsertNow;
function XFindOrCreateArray(searchPredicates, nodes, dgraphClient, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    return __awaiter(this, void 0, void 0, function () {
        var errors, i, currentNode, e_1, message_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < nodes.length)) return [3 /*break*/, 6];
                    currentNode = nodes[i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, XFindOrCreateObject(searchPredicates, currentNode, dgraphClient)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    errors.push({
                        error: e_1,
                        forNode: currentNode
                    });
                    return [3 /*break*/, 5];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    if (errors.length > 0) {
                        message_1 = errors.length + " node/s failed to upsert";
                        errors.forEach(function (e) {
                            message_1 = message_1.concat("\n                        node: " + JSON.stringify(e.forNode) + "\n                        error: " + e.error.message + "\n                    ");
                        });
                        message_1 = message_1.concat("\n            All other nodes were upserted\n        ");
                        throw new Error(message_1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function XFindOrCreateObject(searchPredicates, node, dgraphClient, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, query, searchValues, transaction, queryResult, _b, uid, others, error, mu, mu;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = buildUpsertQuery(searchPredicates, node), query = _a.query, searchValues = _a.searchValues;
                    transaction = dgraphClient.newTxn();
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 8, 10]);
                    return [4 /*yield*/, transaction.query(query)];
                case 2:
                    queryResult = _c.sent();
                    _b = queryResult.getJson().q.map(function (r) { return r.uid; }), uid = _b[0], others = _b.slice(1);
                    if (!uid) return [3 /*break*/, 4];
                    if (others.length > 0) {
                        error = new Error("\n                    More than one node matches \"" + searchValues + "\" for the \"" + searchPredicates + "\" predicate. \n                    Aborting XUpsert. \n                    Delete the extra values before tyring XUpsert again.");
                        throw error;
                    }
                    mu = js_set_1.XSetJs(Object.assign({}, node, { uid: uid }));
                    return [4 /*yield*/, transaction.mutate(mu)];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 4:
                    mu = js_set_1.XSetJs(node);
                    return [4 /*yield*/, transaction.mutate(mu)];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [4 /*yield*/, transaction.commit()];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, transaction.discard()];
                case 9:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// TODO this is really a find by predicate function that returns the id of the node - maybe break out... not sure
function buildUpsertQuery(_searchPredicates, node) {
    // make search predicates an array if it is not already
    var searchPredicates = Array.isArray(_searchPredicates) ?
        _searchPredicates
        : [_searchPredicates];
    // check values are present on predicate
    var searchValues = searchPredicates.map(function (predicate, index) {
        var searchValue = node[predicate];
        if (!searchValue) {
            var error = new Error("\n        The search predicate/s must be a searchable value on the object you are creating.\n        \n        \"" + searchPredicates[index] + "\" does not exist on:\n        " + JSON.stringify(node));
            throw error;
        }
        return searchValue;
    });
    var query = '';
    var searchLength = searchValues.length;
    if (searchLength === 1) {
        // simple case simple query
        query = "{\n            q(func: eq(" + searchPredicates + ", \"" + searchValues + "\")) {\n                uid\n            }\n        }";
    }
    else {
        // build query
        query = "\n        {\n            q(func: eq(" + searchPredicates[0] + ", \"" + searchValues[0] + "\"))";
        // add first filter
        query = query.concat("\n            @filter(eq(" + searchPredicates[1] + ", \"" + searchValues[1] + "\")");
        // add more filters if required
        if (searchValues.length > 2) {
            for (var i = 2; i < searchLength; i++) {
                query = query.concat("\n                AND eq(" + searchPredicates[i] + ", \"" + searchValues[i] + "\")");
            }
        }
        // close the filters, get the uid and close the larger query
        query = query.concat(")\n            {\n                uid\n            }\n        }");
    }
    return { query: query, searchValues: searchValues };
}
exports.buildUpsertQuery = buildUpsertQuery;