"use strict";
/**
 * @module TestHelpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
var grpc = require("grpc");
var dgraph = require("dgraph-js");
function xCreateDgraphClient(config, _dgraph, infoLog) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    if (infoLog === void 0) { infoLog = console.info; }
    var defaults = {
        port: null,
        host: null,
        debug: false,
        logAddress: false
    };
    var _a = Object.assign(defaults, config), port = _a.port, host = _a.host, debug = _a.debug, logAddress = _a.logAddress;
    // use params passed in, followed env values, followed by a static default
    var _port = port || process.env.DGRAPH_PORT || 9080;
    var _host = host || process.env.DGRAPH_HOST || 'localhost';
    var address = _host + ":" + _port;
    if (debug || logAddress) {
        infoLog("configuring Dgraph host address: " + address);
    }
    var grpcCredentials = grpc.credentials.createInsecure();
    var dgraphClientStub = new _dgraph.DgraphClientStub(address, grpcCredentials);
    var dgraphClient = new _dgraph.DgraphClient(dgraphClientStub);
    dgraphClient.setDebugMode(debug);
    return { dgraphClient: dgraphClient, dgraphClientStub: dgraphClientStub };
}
exports.xCreateDgraphClient = xCreateDgraphClient;
