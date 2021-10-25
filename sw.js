var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
/*
 * Copyright (c) 2021 Yahweasel
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
// A page to ping this service worker
var pinger = "\n<!doctype html>\n<html>\n    <head>\n        <meta charset=\"utf-8\" />\n    </head>\n    <body>\n        <script type=\"text/javascript\">(function() {\n            var interval = setInterval(function() {\n                fetch(\"/download-stream-service-worker/\" + Math.random() +\n                    Math.random() + Math.random() +\n                    \"/download-stream-service-worker-ping\").then(function(f) {\n\n                    return f.text();\n\n                }).then(function(t) {\n                    if (t !== \"pong\") {\n                        console.log(t);\n                        clearInterval(interval);\n                    }\n\n                }).catch(console.error);\n            }, 5000);\n        })();\n        </script>\n    </body>\n</html>\n";
// Current streams
var streams = Object.create(null);
// Wait for clients
self.addEventListener("message", function (ev) {
    return __awaiter(this, void 0, void 0, function () {
        var port;
        return __generator(this, function (_a) {
            if (ev.data.c !== "port")
                return [2 /*return*/];
            port = ev.data.p;
            port.onmessage = function (ev) {
                message(port, ev);
            };
            return [2 /*return*/];
        });
    });
});
// Messages from clients
function message(port, ev) {
    return __awaiter(this, void 0, void 0, function () {
        var msg, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    msg = ev.data;
                    _a = msg.c;
                    switch (_a) {
                        case "setup": return [3 /*break*/, 1];
                        case "ping": return [3 /*break*/, 2];
                        case "stream": return [3 /*break*/, 3];
                        case "wait-start": return [3 /*break*/, 4];
                        case "data": return [3 /*break*/, 6];
                        case "end": return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 1:
                    // Ack with our version
                    port.postMessage({ c: "ack", i: msg.i, v: 3 });
                    return [2 /*return*/];
                case 2:
                    // Pong
                    port.postMessage({ c: "pong", i: msg.i });
                    return [2 /*return*/];
                case 3:
                    stream(msg);
                    return [3 /*break*/, 9];
                case 4: return [4 /*yield*/, waitStart(msg)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 6: return [4 /*yield*/, data(msg)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    // Unrecognized message!
                    port.postMessage({ c: "nack", i: msg.i });
                    return [2 /*return*/];
                case 9:
                    port.postMessage({ c: "ack", i: msg.i });
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Set up a stream.
 */
function stream(msg) {
    streams[msg.u] = {
        buf: null,
        started: false,
        ended: false,
        headers: msg.h,
        onstart: null,
        readyForData: null,
        dataAvailable: null
    };
}
/**
 * Wait for this stream to start.
 */
function waitStart(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stream = streams[msg.u];
                    if (!stream)
                        return [2 /*return*/]; // FIXME
                    if (stream.started)
                        return [2 /*return*/];
                    return [4 /*yield*/, new Promise(function (res) { return stream.onstart = res; })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Send some data.
 */
function data(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stream = streams[msg.u];
                    _a.label = 1;
                case 1:
                    if (!stream.buf) return [3 /*break*/, 3];
                    // Need to wait to buffer this data!
                    return [4 /*yield*/, new Promise(function (res) { return stream.readyForData = res; })];
                case 2:
                    // Need to wait to buffer this data!
                    _a.sent();
                    stream.readyForData = null;
                    return [3 /*break*/, 1];
                case 3:
                    if (msg.c === "data") {
                        stream.buf = msg.b;
                    }
                    else { // msg.c === "end"
                        stream.ended = true;
                    }
                    if (stream.dataAvailable)
                        stream.dataAvailable();
                    return [2 /*return*/];
            }
        });
    });
}
// Prepare to fetch
self.addEventListener("fetch", function (ev) {
    var urlF = new URL(ev.request.url);
    var url = urlF.pathname;
    // Keep the service worker alive with pings
    if (url.endsWith("/download-stream-service-worker-ping")) {
        ev.respondWith(new Response("pong", {
            status: 200,
            headers: {
                "content-type": "text/plain",
                "cross-origin-embedder-policy": "require-corp"
            }
        }));
        return;
    }
    if (url.endsWith("/download-stream-service-worker-pinger.html")) {
        ev.respondWith(new Response(pinger, {
            status: 200,
            headers: {
                "content-type": "text/html",
                "cross-origin-embedder-policy": "require-corp"
            }
        }));
        return;
    }
    if (!(url in streams)) {
        // No stream!
        ev.respondWith(new Response("404", { status: 404 }));
        return;
    }
    var stream = streams[url];
    stream.started = true;
    if (stream.onstart)
        stream.onstart();
    // Stream our response
    ev.respondWith(new Response(new ReadableStream({
        pull: function (controller) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!true) return [3 /*break*/, 5];
                            if (!stream.buf) return [3 /*break*/, 1];
                            controller.enqueue(stream.buf);
                            stream.buf = null;
                            if (stream.readyForData)
                                stream.readyForData();
                            return [3 /*break*/, 5];
                        case 1:
                            if (!stream.ended) return [3 /*break*/, 2];
                            controller.close();
                            return [3 /*break*/, 5];
                        case 2: 
                        // Wait for data
                        return [4 /*yield*/, new Promise(function (res) { return stream.dataAvailable = res; })];
                        case 3:
                            // Wait for data
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 0];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    }), {
        status: 200,
        headers: stream.headers
    }));
});
