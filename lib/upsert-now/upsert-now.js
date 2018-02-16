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
function XUpsertNow(keyPredicate, data, dgraphClient, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (Array.isArray(data)) {
                return [2 /*return*/, XFindOrCreateArray(keyPredicate, data, dgraphClient, _dgraph)];
            }
            else {
                return [2 /*return*/, XFindOrCreateObject(keyPredicate, data, dgraphClient, _dgraph)];
            }
            return [2 /*return*/];
        });
    });
}
exports.XUpsertNow = XUpsertNow;
function XFindOrCreateArray(keyPredicate, nodes, dgraphClient, _dgraph) {
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
                    return [4 /*yield*/, XFindOrCreateObject(keyPredicate, currentNode, dgraphClient)];
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
function XFindOrCreateObject(keyPredicate, node, dgraphClient, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    return __awaiter(this, void 0, void 0, function () {
        var searchValue, error, transaction, query, queryResult, _a, uid, others, error, mu, mu;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    searchValue = node[keyPredicate];
                    if (typeof searchValue !== 'string') {
                        error = new Error("\n        The key predicate must be a searchable string value on the object you are creating.\n        \n        \"" + keyPredicate + "\" does not exist as a string on:\n        " + JSON.stringify(node));
                        throw error;
                    }
                    transaction = dgraphClient.newTxn();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 8, 10]);
                    query = "{\n            q(func: eq(" + keyPredicate + ", \"" + searchValue + "\")) {\n                uid\n            }\n        }";
                    return [4 /*yield*/, transaction.query(query)];
                case 2:
                    queryResult = _b.sent();
                    _a = queryResult.getJson().q.map(function (r) { return r.uid; }), uid = _a[0], others = _a.slice(1);
                    if (!uid) return [3 /*break*/, 4];
                    if (others.length > 0) {
                        error = new Error("\n                    More than one node matches \"" + searchValue + "\" for the \"" + keyPredicate + "\" predicate. \n                    Aborting XUpsert. \n                    Delete the extra values before tyring XUpsert again.");
                        throw error;
                    }
                    mu = js_set_1.XSetJs(Object.assign({}, node, { uid: uid }));
                    return [4 /*yield*/, transaction.mutate(mu)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4:
                    mu = js_set_1.XSetJs(node);
                    return [4 /*yield*/, transaction.mutate(mu)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [4 /*yield*/, transaction.commit()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, transaction.discard()];
                case 9:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
