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
var __1 = require("..");
var is_string_1 = require("../util/is-string");
var validate_node_exists_1 = require("../validate-node-exists/validate-node-exists");
var upsert_1 = require("../upsert/upsert");
function xUpsertEdgeListCommitTxn(upsertFn, upsertNode, nodes, dgraphClient, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    return __awaiter(this, void 0, void 0, function () {
        var transaction, result, error, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transaction = dgraphClient.newTxn();
                    error = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 8]);
                    return [4 /*yield*/, xUpsertEdgeList(upsertFn, upsertNode, nodes, transaction, _dgraph)];
                case 2:
                    result = _a.sent();
                    transaction.commit();
                    return [3 /*break*/, 8];
                case 3:
                    e_1 = _a.sent();
                    error = e_1;
                    throw e_1;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, transaction.discard()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _a.sent();
                    // the error e here will be the transaction.discard() error.
                    // not the error we want - the one that was thrown in the try catch block
                    throw (error);
                case 7: return [7 /*endfinally*/];
                case 8: return [2 /*return*/, result];
            }
        });
    });
}
exports.xUpsertEdgeListCommitTxn = xUpsertEdgeListCommitTxn;
function xUpsertEdgeList(upsertFn, _a, nodes, transaction, _dgraph) {
    var uid = _a.uid, predicate = _a.predicate;
    if (_dgraph === void 0) { _dgraph = dgraph; }
    return __awaiter(this, void 0, void 0, function () {
        var upsertedNodes, nodeExists, deleteAllPredicateLinks, i, currentNode, result, addPredicateLinks, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    upsertedNodes = [];
                    if (!Array.isArray(nodes)) {
                        throw new Error('You must pass nodes as an array of objects');
                    }
                    if (!is_string_1.isString(predicate)) {
                        throw new Error('You must pass in a predicate string as part of the upsert node');
                    }
                    return [4 /*yield*/, validate_node_exists_1.xValidateNodeExists(uid, transaction)];
                case 1:
                    nodeExists = _d.sent();
                    if (!nodeExists) {
                        // if the node does not exist you get an unhelpful error.
                        // this one is better
                        throw new Error("You passed a uid for a node that does not exist, uid: " + uid);
                    }
                    deleteAllPredicateLinks = (_b = {
                            uid: uid
                        },
                        _b[predicate] = null,
                        _b);
                    return [4 /*yield*/, transaction.mutate(__1.xDeleteJSON(deleteAllPredicateLinks))];
                case 2:
                    _d.sent();
                    i = 0;
                    _d.label = 3;
                case 3:
                    if (!(i < nodes.length)) return [3 /*break*/, 6];
                    currentNode = nodes[i];
                    return [4 /*yield*/, upsert_1.xUpsertObject(upsertFn, currentNode, transaction)];
                case 4:
                    result = _d.sent();
                    upsertedNodes.push(result);
                    _d.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    addPredicateLinks = (_c = {
                            uid: uid
                        },
                        _c[predicate] = upsertedNodes.map(function (uid) { return ({ uid: uid }); }),
                        _c);
                    return [4 /*yield*/, transaction.mutate(__1.xSetJSON(addPredicateLinks, _dgraph))];
                case 7:
                    _d.sent();
                    return [2 /*return*/, upsertedNodes];
            }
        });
    });
}
exports.xUpsertEdgeList = xUpsertEdgeList;
