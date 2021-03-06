"use strict";
/**
 * @module TestHelpers
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
var create_dgraph_client_1 = require("../create-client/create-dgraph-client");
var __1 = require("..");
var drob_db_1 = require("../drop-db/drob-db");
var set_json_1 = require("../set-json/set-json");
/**
 * - Sets some defaults like using port 9081 when testing vs 9080 when developing
 * - Creates the client
 * - Drops the DB
 *
 * Most of the time you will use {@link xSetupWithSchemaDataCommitTxn} which does all of the above + optionally sets a schema and data.
 */
function xSetupForTest(config, _xCreateDgraphClient, _drop) {
    if (_xCreateDgraphClient === void 0) { _xCreateDgraphClient = create_dgraph_client_1.xCreateDgraphClient; }
    if (_drop === void 0) { _drop = drob_db_1.xDropDBAlt; }
    return __awaiter(this, void 0, void 0, function () {
        var defaults, testConfig, _a, dgraphClient, dgraphClientStub;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    defaults = {
                        port: 9081,
                        host: null,
                        debug: false
                    };
                    testConfig = Object.assign(defaults, config);
                    _a = _xCreateDgraphClient(testConfig), dgraphClient = _a.dgraphClient, dgraphClientStub = _a.dgraphClientStub;
                    return [4 /*yield*/, _drop(dgraphClient)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, { dgraphClient: dgraphClient, dgraphClientStub: dgraphClientStub }];
            }
        });
    });
}
exports.xSetupForTest = xSetupForTest;
/**
 * - Sets some defaults like using port 9081 when testing vs 9080 when developing
 * - Creates the client
 * - Drops the DB
 * - Sets a schema
 * - Sets some initial data
 *
 * ```ts
 * const schema = `
 * name: string @index(exact) .
 * street: string @index(exact) .
 * `;
 *
 * const sampleData = {
 * uid: "_:user",
 * name: "cameron",
 * addresses: [
 *  {uid: "_:address1", street: "william", postcode: 2000},
 *  {uid: "_:address2", street: "george", postcode: 2001},
 *  {uid: "_:address3", street: "hay", postcode: 2444},
 *  {uid: "_:address4", street: "short", postcode: 2107}
 *  ]
 * };
 *
 * const {result, dgraphClient} = await xSetupWithSchemaDataCommitTxn({schema, data: sampleData});
 * ```
 */
function xSetupWithSchemaDataCommitTxn(params) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultParams, _a, schema, data, debugDgraphClient, _b, dgraphClient, dgraphClientStub, result;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    defaultParams = {
                        schema: null,
                        data: null,
                        debugDgraphClient: false
                    };
                    _a = Object.assign(defaultParams, params), schema = _a.schema, data = _a.data, debugDgraphClient = _a.debugDgraphClient;
                    return [4 /*yield*/, xSetupForTest({ debug: debugDgraphClient })];
                case 1:
                    _b = _c.sent(), dgraphClient = _b.dgraphClient, dgraphClientStub = _b.dgraphClientStub;
                    if (!schema) return [3 /*break*/, 3];
                    return [4 /*yield*/, __1.xSetSchemaAlt(schema, dgraphClient)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    result = null;
                    if (!data) return [3 /*break*/, 5];
                    return [4 /*yield*/, set_json_1.xSetJSONCommitTxn(data, dgraphClient)];
                case 4:
                    result = _c.sent();
                    _c.label = 5;
                case 5: return [2 /*return*/, { dgraphClient: dgraphClient, dgraphClientStub: dgraphClientStub, result: result }];
            }
        });
    });
}
exports.xSetupWithSchemaDataCommitTxn = xSetupWithSchemaDataCommitTxn;
