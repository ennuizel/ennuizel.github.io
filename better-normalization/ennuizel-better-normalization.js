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
/// <reference path="../ennuizel.d.ts" />
var licenseInfo = "\nCopyright (c) 2021 Yahweasel\n\nPermission to use, copy, modify, and/or distribute this software for any\npurpose with or without fee is hereby granted, provided that the above\ncopyright notice and this permission notice appear in all copies.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\" AND THE AUTHOR DISCLAIMS ALL WARRANTIES\nWITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF\nMERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY\nSPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES\nWHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION\nOF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN\nCONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.\n";
// The plugin info
var plugin = {
    name: "Better Normalization",
    id: "better-normalization",
    infoURL: "https://github.com/ennuizel/ennuizel-better-normalization-plugin",
    description: 'This plugin adds a normalization filter that gives dynaudnorm time to adapt.',
    licenseInfo: licenseInfo,
    load: load,
    api: {
        betterNormalize: betterNormalize
    }
};
// Register the plugin
Ennuizel.registerPlugin(plugin);
/**
 * Load the plugin.
 */
function load() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Register the filter
            Ennuizel.filters.registerCustomFilter({
                name: "_Normalize (Improved)",
                filter: uiNormalize
            });
            return [2 /*return*/];
        });
    });
}
/**
 * User interface.
 * @param d  Dialog to show filter options.
 */
function uiNormalize(d) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Currently no options
                return [4 /*yield*/, Ennuizel.ui.loading(function (d) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        Ennuizel.undoPoint();
                                        return [4 /*yield*/, Ennuizel.filters.selectionFilter(function (x) { return betterNormalize(x); }, false, Ennuizel.select.getSelection(), d)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }, {
                        reuse: d
                    })];
                case 1:
                    // Currently no options
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Filter implementation.
 * @param stream  Input stream to filter.
 * @param opts  Other dynaudnorm options.
 */
function betterNormalize(stream, opts) {
    if (opts === void 0) { opts = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var fs, parts, key, first, remaining, recycle, inputStream, filterStream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fs = "dynaudnorm";
                    if (Object.keys(opts).length) {
                        fs += "=";
                        parts = [];
                        for (key in opts)
                            parts.push(key + "=" + opts[key]);
                        fs += parts.join(":");
                    }
                    fs += ",atrim=start=10";
                    return [4 /*yield*/, stream.read()];
                case 1:
                    first = _a.sent();
                    if (!first) {
                        // Oh well!
                        return [2 /*return*/, new Ennuizel.ReadableStream({
                                start: function (controller) {
                                    controller.close();
                                }
                            })];
                    }
                    stream.push(first);
                    remaining = 10 * first.sample_rate * first.channels;
                    recycle = [];
                    inputStream = new Ennuizel.ReadableStream({
                        pull: function (controller) {
                            return __awaiter(this, void 0, void 0, function () {
                                var chunk, nchunk, chunk;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(remaining > 0)) return [3 /*break*/, 4];
                                            chunk = null;
                                            _a.label = 1;
                                        case 1:
                                            if (!!chunk) return [3 /*break*/, 3];
                                            return [4 /*yield*/, stream.read()];
                                        case 2:
                                            chunk = _a.sent();
                                            if (!chunk) {
                                                // Early recycling!
                                                while (recycle.length)
                                                    stream.push(recycle.pop());
                                            }
                                            return [3 /*break*/, 1];
                                        case 3:
                                            recycle.push(chunk);
                                            if (chunk.data.length > remaining) {
                                                nchunk = Object.assign({}, chunk);
                                                nchunk.data = nchunk.data.subarray(0, remaining);
                                                controller.enqueue(nchunk);
                                                remaining = 0;
                                            }
                                            else {
                                                // Send this whole chunk
                                                controller.enqueue(chunk);
                                                remaining -= chunk.data.length;
                                            }
                                            // Perhaps done with initial data?
                                            if (remaining === 0) {
                                                while (recycle.length)
                                                    stream.push(recycle.pop());
                                            }
                                            return [3 /*break*/, 6];
                                        case 4: return [4 /*yield*/, stream.read()];
                                        case 5:
                                            chunk = _a.sent();
                                            if (chunk)
                                                controller.enqueue(chunk);
                                            else
                                                controller.close();
                                            _a.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                    });
                    return [4 /*yield*/, Ennuizel.filters.ffmpegStream(new Ennuizel.EZStream(inputStream), fs)];
                case 2:
                    filterStream = _a.sent();
                    return [2 /*return*/, filterStream];
            }
        });
    });
}
