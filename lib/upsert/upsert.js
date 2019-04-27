"use strict";
/**
 * @module Upsert
 */
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var set_json_1 = require("../set-json/set-json");
function xUpsertCommitTxn(upsertFn, data, dgraphClient, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (Array.isArray(data)) {
                return [2 /*return*/, xUpsertArrayCommitTxn(upsertFn, data, dgraphClient, _dgraph)];
            }
            else {
                return [2 /*return*/, xUpsertObjectCommitTxn(upsertFn, data, dgraphClient, _dgraph)];
            }
            return [2 /*return*/];
        });
    });
}
exports.xUpsertCommitTxn = xUpsertCommitTxn;
function xUpsertArrayCommitTxn(upsertFn, nodes, dgraphClient, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    return __awaiter(this, void 0, void 0, function () {
        var results, errors, transaction, i, currentNode, result, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    errors = [];
                    transaction = dgraphClient.newTxn();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 12]);
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < nodes.length)) return [3 /*break*/, 5];
                    currentNode = nodes[i];
                    return [4 /*yield*/, xUpsertObject(upsertFn, currentNode, transaction)];
                case 3:
                    result = _a.sent();
                    results.push(result);
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, transaction.commit()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 12];
                case 7:
                    e_1 = _a.sent();
                    // catch the error here so we can throw it properly
                    errors.push(e_1);
                    throw e_1;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, transaction.discard()];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    e_2 = _a.sent();
                    // the error e here will be the transaction.discard() error.
                    // not the error we want - the one that was thrown in the for loop.
                    throw (errors);
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, results];
            }
        });
    });
}
function xUpsertObjectCommitTxn(upsertFn, node, dgraphClient, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    return __awaiter(this, void 0, void 0, function () {
        var uid, error, transaction, e_3, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uid = null;
                    error = null;
                    transaction = dgraphClient.newTxn();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 7, 11]);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, xUpsertObject(upsertFn, node, transaction)];
                case 3:
                    uid = _a.sent();
                    return [4 /*yield*/, transaction.commit()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_3 = _a.sent();
                    // catch the error here so we can throw it properly
                    error = e_3;
                    throw e_3;
                case 6: return [3 /*break*/, 11];
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, transaction.discard()];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_4 = _a.sent();
                    // the error e here will be the transaction.discard() error.
                    // not the error we want - the one that was thrown in the try catch block
                    throw error;
                case 10: return [7 /*endfinally*/];
                case 11: return [2 /*return*/, uid];
            }
        });
    });
}
// this function is only exported to be used internally
/** * @ignore */
function xUpsertObject(upsertFn, node, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var result, _a, dgraphQuery, nodeFoundFn, queryResult, _b, existingUid, newNodeFn, updatedNode, mu, createNode, mu, muResult, uid, multipleNodes, errorMessage;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    result = null;
                    _a = upsertFn(node), dgraphQuery = _a.dgraphQuery, nodeFoundFn = _a.nodeFoundFn;
                    return [4 /*yield*/, transaction.query(dgraphQuery).catch(function (e) {
                            // Rethrow the error but with more context about exactly what failed
                            throw new Error("xUpsert DgraphQuery failed, check the query you provided against this error: " + e);
                        })];
                case 1:
                    queryResult = _c.sent();
                    _b = nodeFoundFn(queryResult), existingUid = _b.existingUid, newNodeFn = _b.newNodeFn;
                    if (!Boolean(existingUid)) return [3 /*break*/, 3];
                    updatedNode = Object.assign({ uid: existingUid }, node);
                    mu = set_json_1.xSetJSON(updatedNode);
                    return [4 /*yield*/, transaction.mutate(mu)];
                case 2:
                    _c.sent();
                    result = existingUid;
                    return [3 /*break*/, 5];
                case 3:
                    createNode = newNodeFn ?
                        newNodeFn(node) :
                        node;
                    mu = set_json_1.xSetJSON(createNode);
                    return [4 /*yield*/, transaction.mutate(mu)];
                case 4:
                    muResult = _c.sent();
                    uid = muResult.getUidsMap().get('blank-0');
                    multipleNodes = Boolean(muResult.getUidsMap().get('blank-1'));
                    if (multipleNodes) {
                        errorMessage = "\n                The find functions for xUpsert should only return a single node.\n                That's how we know which node we need to update.\n                \n                Therefor xUpsert cannot support creating multiple new nodes.\n                It seems that you have passed in an object that requires the creation of multiple nodes.\n                \n                Update your upsert to only create a single node at a time .\n                xUpsert does accept an array of objects to upsert.\n                \n                Failed for object: " + JSON.stringify(node) + "\n            ";
                        throw new Error(errorMessage);
                    }
                    result = uid;
                    _c.label = 5;
                case 5: return [2 /*return*/, result];
            }
        });
    });
}
exports.xUpsertObject = xUpsertObject;
