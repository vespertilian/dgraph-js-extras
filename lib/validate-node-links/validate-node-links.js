"use strict";
/**
 * @module Validate
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
var __1 = require("..");
var path_or_1 = require("../util/path-or");
/**
* Same as {@link xValidateNodeLinks} but it creates it's own transaction
*/
function xValidateNodeLinksTxn(params, dgraphClient) {
    return __awaiter(this, void 0, void 0, function () {
        var txn;
        return __generator(this, function (_a) {
            txn = dgraphClient.newTxn();
            return [2 /*return*/, xValidateNodeLinks(params, txn)];
        });
    });
}
exports.xValidateNodeLinksTxn = xValidateNodeLinksTxn;
/**
* Validates nodeA is linked to the specified edge name on nodeB
*
* ```ts
* const users = [
* {
*   uid: '_:user1',
*   username: 'user1',
*   addresses: [{
*     uid: '_:user1address1',
*     postcode: 2444
*   }]
* },
* {
*   uid: '_:user2',
*   username: 'user2',
*   addresses: [
*     {
*       uid: '_:user2address1',
*       postcode: 2000
*     },
*     {
*       uid: '_:user2address2',
*       postcode: 2000
*     }
*   ]
* }];
* const params = {
*  node: user1uid,
*  edgename: 'addresses',
*  linkednodesuids: [user1addressuid]
* };
* // this will return true as user1 does have address 1
* const result = await xvalidatenodelinkstxn(params, dgraphclient);
* ```
*
*/
function xValidateNodeLinks(params, txn) {
    return __awaiter(this, void 0, void 0, function () {
        var query, q, getLengthOrNull, resultsLength;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "{\n    q(func: uid(" + params.node + ")) {\n      " + params.edgeName + " @filter(uid(" + params.linkedNodesUids.join(",") + ")) {\n        uid\n      }\n    }\n  }";
                    return [4 /*yield*/, __1.xQuery(query, txn)];
                case 1:
                    q = (_a.sent()).q;
                    getLengthOrNull = function (obj) { return path_or_1.pathOr(null, ['0', params.edgeName, 'length'], obj); };
                    resultsLength = getLengthOrNull(q);
                    // while we could return the uid of the failed link
                    // its quicker just to return true or false rather than iterate
                    return [2 /*return*/, (resultsLength === params.linkedNodesUids.length)];
            }
        });
    });
}
exports.xValidateNodeLinks = xValidateNodeLinks;
