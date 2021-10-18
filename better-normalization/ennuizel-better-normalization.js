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
                                        return [4 /*yield*/, betterNormalize(Object.create(null), Ennuizel.select.getSelection(), d)];
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
 * @param opts  dynaudnorm options.
 * @param sel  Selection to filter.
 * @param d  Dialog to show progress.
 */
function betterNormalize(opts, sel, d) {
    return __awaiter(this, void 0, void 0, function () {
        // Function to show the current status
        function showStatus() {
            if (d) {
                var statusStr = status.map(function (x) {
                    return x.name + ": " + Math.round(x.filtered / x.duration * 100) + "%";
                })
                    .join("<br/>");
                d.box.innerHTML = "Filtering...<br/>" + statusStr;
            }
        }
        // The filtering function for each track
        function filterThread(track, idx) {
            return __awaiter(this, void 0, void 0, function () {
                var libav, channelLayout, frame, _a, src, sink, preInStream, remaining, rd, inStream, filterStream;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, LibAV.LibAV()];
                        case 1:
                            libav = _b.sent();
                            channelLayout = (track.channels === 1) ? 4 : ((1 << track.channels) - 1);
                            return [4 /*yield*/, libav.av_frame_alloc()];
                        case 2:
                            frame = _b.sent();
                            return [4 /*yield*/, libav.ff_init_filter_graph(fs, {
                                    sample_rate: track.sampleRate,
                                    sample_fmt: track.format,
                                    channel_layout: channelLayout
                                }, {
                                    sample_rate: track.sampleRate,
                                    sample_fmt: track.format,
                                    channel_layout: channelLayout
                                })];
                        case 3:
                            _a = _b.sent(), src = _a[1], sink = _a[2];
                            preInStream = track.stream(streamOpts).getReader();
                            remaining = 10 * track.sampleRate * track.channels;
                            _b.label = 4;
                        case 4:
                            if (!remaining) return [3 /*break*/, 9];
                            return [4 /*yield*/, preInStream.read()];
                        case 5:
                            rd = _b.sent();
                            if (!rd.done) return [3 /*break*/, 6];
                            // Try again from the start
                            preInStream = track.stream(streamOpts).getReader();
                            return [3 /*break*/, 8];
                        case 6:
                            rd.value.node = null;
                            if (rd.value.data.length > remaining)
                                rd.value.data = rd.value.data.subarray(0, remaining);
                            return [4 /*yield*/, libav.ff_filter_multi(src, sink, frame, [rd.value], false)];
                        case 7:
                            _b.sent();
                            remaining -= rd.value.data.length;
                            _b.label = 8;
                        case 8: return [3 /*break*/, 4];
                        case 9:
                            preInStream.cancel();
                            inStream = track.stream(Object.assign({ keepOpen: true }, streamOpts)).getReader();
                            filterStream = new Ennuizel.ReadableStream({
                                pull: function (controller) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var inp, outp, _i, outp_1, part;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!true) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, inStream.read()];
                                                case 1:
                                                    inp = _a.sent();
                                                    if (inp.value)
                                                        inp.value.node = null;
                                                    return [4 /*yield*/, libav.ff_filter_multi(src, sink, frame, inp.done ? [] : [inp.value], inp.done)];
                                                case 2:
                                                    outp = _a.sent();
                                                    // Update the status
                                                    if (inp.done)
                                                        status[idx].filtered = status[idx].duration;
                                                    else
                                                        status[idx].filtered += inp.value.data.length;
                                                    showStatus();
                                                    // Write it out
                                                    for (_i = 0, outp_1 = outp; _i < outp_1.length; _i++) {
                                                        part = outp_1[_i];
                                                        controller.enqueue(part.data);
                                                    }
                                                    // Maybe end it
                                                    if (inp.done)
                                                        controller.close();
                                                    if (outp.length || inp.done)
                                                        return [3 /*break*/, 3];
                                                    return [3 /*break*/, 0];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }
                            });
                            // Overwrite the track
                            return [4 /*yield*/, track.overwrite(filterStream, Object.assign({ closeTwice: true }, streamOpts))];
                        case 10:
                            // Overwrite the track
                            _b.sent();
                            // And get rid of the libav instance
                            libav.terminate();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var tracks, streamOpts, fs, parts, key, status, threads, running, toRun, _a, sel_1, idx, fin;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tracks = sel.tracks.filter(function (x) { return x.type() === Ennuizel.TrackType.Audio; });
                    tracks = tracks.filter(function (x) { return x.duration() !== 0; });
                    if (tracks.length === 0)
                        return [2 /*return*/];
                    if (d)
                        d.box.innerHTML = "Filtering...";
                    streamOpts = {
                        start: sel.range ? sel.start : void 0,
                        end: sel.range ? sel.end : void 0
                    };
                    fs = "dynaudnorm";
                    if (Object.keys(opts).length) {
                        fs += "=";
                        parts = [];
                        for (key in opts)
                            parts.push(key + "=" + opts[key]);
                        fs += parts.join(":");
                    }
                    fs += ",atrim=start=10";
                    status = tracks.map(function (x) { return ({
                        name: x.name,
                        filtered: 0,
                        duration: x.sampleCount()
                    }); });
                    threads = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 2;
                    running = [];
                    toRun = tracks.map(function (x, idx) { return [x, idx]; });
                    _b.label = 1;
                case 1:
                    if (!toRun.length) return [3 /*break*/, 3];
                    // Get the right number of threads running
                    while (running.length < threads && toRun.length) {
                        _a = toRun.shift(), sel_1 = _a[0], idx = _a[1];
                        running.push(filterThread(sel_1, idx));
                    }
                    return [4 /*yield*/, Promise.race(running.map(function (x, idx) { return x.then(function () { return idx; }); }))];
                case 2:
                    fin = _b.sent();
                    running.splice(fin, 1);
                    return [3 /*break*/, 1];
                case 3: 
                // Wait for them all to finish
                return [4 /*yield*/, Promise.all(running)];
                case 4:
                    // Wait for them all to finish
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
