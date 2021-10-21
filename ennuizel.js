(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EnnuizelApp = f()}})(function(){var define,module,exports;
var _$avthreads_6 = {};
"use strict";
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
Object.defineProperty(_$avthreads_6, "__esModule", { value: true });
_$avthreads_6.flush = _$avthreads_6.enqueueSync = _$avthreads_6.enqueue = _$avthreads_6.load = void 0;
var threads = navigator.hardwareConcurrency ? navigator.hardwareConcurrency * 2 : 8;
// Multiple parallel libav instances
var libavPromises = [];
var libavs = [];
var users = [];
var queue = [];
/**
 * Load all our libavs.
 */
function load() {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1;
        return __generator(this, function (_a) {
            _loop_1 = function () {
                var idx = libavs.length;
                libavs.push(null);
                libavPromises.push(LibAV.LibAV().then(function (libav) { return libavs[idx] = libav; }));
            };
            while (libavs.length < threads) {
                _loop_1();
            }
            while (users.length < threads)
                users.push(null);
            return [2 /*return*/];
        });
    });
}
_$avthreads_6.load = load;
/**
 * Enqueue a task. enqueue itself returns when the task *starts* running. The
 * task takes the assigned libav as an argument.
 * @param task  The task to be enqueued.
 */
function enqueue(task) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_2, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_2 = function () {
                        var idx, libav;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    idx = 0;
                                    for (idx = 0; idx < threads; idx++) {
                                        if (!users[idx])
                                            break;
                                    }
                                    if (!(idx >= threads)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, new Promise(function (res) { return queue.push(res); })];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/, "continue"];
                                case 2:
                                    libav = libavs[idx];
                                    if (!!libav) return [3 /*break*/, 4];
                                    return [4 /*yield*/, libavPromises[idx]];
                                case 3:
                                    _b.sent();
                                    libav = libavs[idx];
                                    _b.label = 4;
                                case 4:
                                    // OK, take the slot
                                    users[idx] = task(libav).then(function () {
                                        users[idx] = null;
                                        if (queue.length)
                                            queue.shift()(null);
                                    });
                                    return [2 /*return*/, "break"];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_2()];
                case 2:
                    state_1 = _a.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 3];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
_$avthreads_6.enqueue = enqueue;
/**
 * Enqueue a task and wait for its completion.
 * @params task  The task.
 */
function enqueueSync(task) {
    return __awaiter(this, void 0, void 0, function () {
        var syncRes, syncRej, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Promise(function (res, rej) {
                        syncRes = res;
                        syncRej = rej;
                    });
                    // Enqueue as normal
                    enqueue(function (libav) {
                        return __awaiter(this, void 0, void 0, function () {
                            var ex_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, task(libav)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        ex_1 = _a.sent();
                                        syncRej(ex_1);
                                        return [2 /*return*/];
                                    case 3:
                                        syncRes(null);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                    // Now wait for p
                    return [4 /*yield*/, p];
                case 1:
                    // Now wait for p
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$avthreads_6.enqueueSync = enqueueSync;
/**
 * Wait for the queue of libav tasks to finish. You should usually do this at
 * the end of any processing, to make sure you don't create race conditions
 * with later processing.
 */
function flush() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // First wait for something, to make sure we empty the queue
                return [4 /*yield*/, new Promise(function (res) {
                        enqueue(function () {
                            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                                res(null);
                                return [2 /*return*/];
                            }); });
                        });
                    })];
                case 1:
                    // First wait for something, to make sure we empty the queue
                    _a.sent();
                    // Then wait for anything remaining
                    return [4 /*yield*/, Promise.all(users)];
                case 2:
                    // Then wait for anything remaining
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$avthreads_6.flush = flush;

var _$id36_10 = {};
"use strict";
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
var ____awaiter_10 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_10 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$id36_10, "__esModule", { value: true });
_$id36_10.genFresh = _$id36_10.gen = void 0;
/**
 * Generate a random ID.
 * @param len  Length of the ID to generate.
 */
function gen(len) {
    if (len === void 0) { len = 12; }
    var ret = "";
    while (ret.length < len)
        ret += Math.random().toString(36).slice(2);
    return ret.slice(0, len);
}
_$id36_10.gen = gen;
/**
 * Generate a random ID that isn't used in the store.
 * @param store  Store to check.
 * @param prefix  Prefix for the item in the store.
 * @param len  Length of the ID.
 */
function genFresh(store, prefix, len) {
    if (prefix === void 0) { prefix = ""; }
    if (len === void 0) { len = 12; }
    return ____awaiter_10(this, void 0, void 0, function () {
        var id;
        return ____generator_10(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 2];
                    id = gen(len);
                    return [4 /*yield*/, store.getItem(prefix + id)];
                case 1:
                    if ((_a.sent()) === null)
                        return [2 /*return*/, id];
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    });
}
_$id36_10.genFresh = genFresh;

var _$uiCode_19 = {};
"use strict";
Object.defineProperty(_$uiCode_19, "__esModule", { value: true });
_$uiCode_19.code = void 0;
// This file was generated by mk-ui-code.js. Do not modify.
_$uiCode_19.code = "<div class=\"main cflex\"><div class=\"menu\"><button id=\"b-project\"><i class=\"fas fa-file-audio\"></i> <u>P</u>roject</button>&nbsp;<button id=\"b-edit\"><i class=\"fas fa-edit\"></i> <u>E</u>dit</button>&nbsp;<button id=\"b-tracks\"><i class=\"fas fa-bars\"></i> <u>T</u>racks</button>&nbsp;<button id=\"b-filters\"><i class=\"fas fa-filter\"></i> <u>F</u>ilters</button><div class=\"stretch\"></div><button id=\"b-zoom\"><i class=\"fas fa-search\"></i> <u>Z</u>oom</button><button id=\"b-about\"><i class=\"fas fa-address-card\"></i> About</button></div><input id=\"zoom-selector\" type=\"range\" min=\"1\" max=\"100\" value=\"10\" /><canvas id=\"timeline\" height=32></canvas><div id=\"project\"></div><div class=\"status-bar\" id=\"status\">&nbsp;</div></div>";

var _$ui_20 = {};
"use strict";
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
var ____awaiter_20 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_20 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$ui_20, "__esModule", { value: true });
_$ui_20.txt = _$ui_20.lbl = _$ui_20.btn = _$ui_20.br = _$ui_20.mk = _$ui_20.alert = _$ui_20.loading = _$ui_20.dialogClose = _$ui_20.dialog = _$ui_20.loadLibrary = _$ui_20.load = _$ui_20.pixelsPerSecond = _$ui_20.trackMiddle = _$ui_20.trackHeight = _$ui_20.ui = _$ui_20.dce = _$ui_20.gebi = void 0;
/* removed: var _$uiCode_19 = require("./ui-code"); */;
_$ui_20.gebi = document.getElementById.bind(document);
_$ui_20.dce = document.createElement.bind(document);
/**
 * The UI elements.
 */
_$ui_20.ui = {
    // Main menu
    menu: {
        project: null,
        edit: null,
        tracks: null,
        filters: null,
        zoom: null,
        about: null
    },
    // The timeline
    timeline: null,
    // Main project space
    main: null,
    // Status bar
    status: null,
    // All dialogs
    dialogs: [],
    // Closeable dialogs
    closeable: [],
    // Zoomability
    zoomSelector: null,
    onzoom: [],
    utilityCSS: null,
    zoom: 0.1
};
/**
 * Height of (audio) tracks.
 */
_$ui_20.trackHeight = 128;
/**
 * Middle of the height of audio tracks.
 */
_$ui_20.trackMiddle = _$ui_20.trackHeight / 2;
/**
 * Pixels per second at zoom 1.
 */
_$ui_20.pixelsPerSecond = 128;
/**
 * Load the UI.
 */
function __load_20() {
    // Load the UI
    document.body.innerHTML = _$uiCode_19.code;
    // And export it
    _$ui_20.ui.menu = {
        project: (0, _$ui_20.gebi)("b-project"),
        edit: (0, _$ui_20.gebi)("b-edit"),
        tracks: (0, _$ui_20.gebi)("b-tracks"),
        filters: (0, _$ui_20.gebi)("b-filters"),
        zoom: (0, _$ui_20.gebi)("b-zoom"),
        about: (0, _$ui_20.gebi)("b-about")
    };
    _$ui_20.ui.timeline = (0, _$ui_20.gebi)("timeline");
    _$ui_20.ui.main = (0, _$ui_20.gebi)("project");
    _$ui_20.ui.status = (0, _$ui_20.gebi)("status");
    _$ui_20.ui.zoomSelector = (0, _$ui_20.gebi)("zoom-selector");
    _$ui_20.ui.utilityCSS = mk("style", document.body, { type: "text/css" });
    zoom();
    _$ui_20.ui.zoomSelector.addEventListener("input", function () {
        _$ui_20.ui.zoom = (+_$ui_20.ui.zoomSelector.value) / 100;
        zoom();
    });
}
_$ui_20.load = __load_20;
/**
 * Load a library.
 * @param name  URL of the library to load.
 */
function loadLibrary(name) {
    return new Promise(function (res, rej) {
        var scr = (0, _$ui_20.dce)("script");
        scr.addEventListener("load", res);
        scr.addEventListener("error", function (ev) { return rej(new Error(ev.message)); });
        scr.src = name;
        scr.async = true;
        document.body.appendChild(scr);
    });
}
_$ui_20.loadLibrary = loadLibrary;
// Set the zoom in CSS
function zoom() {
    _$ui_20.ui.utilityCSS.innerText =
        ":root {" +
            "--zoom-wave: " + _$ui_20.ui.zoom + ";" +
            "}";
    for (var _i = 0, _a = _$ui_20.ui.onzoom; _i < _a.length; _i++) {
        var oz = _a[_i];
        oz();
    }
}
/**
 * Create a dialog box. If it's not closeable by the user, will close
 * automatically after the callback finishes.
 * @param callback  Function to call with the dialog box.
 * @param opts  Other options.
 */
function dialog(callback, opts) {
    if (opts === void 0) { opts = {}; }
    return ____awaiter_20(this, void 0, void 0, function () {
        var d, layerSeparator, wrapper1, wrapper2, box, dIdx, clIdx, close_1, ret, dIdx, cIdx;
        return ____generator_20(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (opts.reuse) {
                        d = opts.reuse;
                        d.wrapper.style.display = "none";
                        d.box.innerHTML = "";
                    }
                    else {
                        layerSeparator = mk("div", document.body, { className: "layer-separator" });
                        wrapper1 = mk("div", document.body, { className: "dialog-wrapper" });
                        mk("div", wrapper1, { className: "stretch" });
                        wrapper2 = mk("div", wrapper1, { className: "dialog-wrapper-inner" });
                        mk("div", wrapper2, { className: "stretch" });
                        box = mk("div", wrapper2, { className: "dialog" });
                        mk("div", wrapper2, { className: "stretch" });
                        mk("div", wrapper1, { className: "stretch" });
                        d = { layerSeparator: layerSeparator, wrapper: wrapper1, box: box };
                    }
                    // Remove any previous metadata
                    if (opts.reuse) {
                        dIdx = _$ui_20.ui.dialogs.indexOf(d);
                        if (dIdx >= 0)
                            _$ui_20.ui.dialogs.splice(dIdx, 1);
                        clIdx = _$ui_20.ui.closeable.indexOf(d);
                        if (clIdx >= 0)
                            _$ui_20.ui.closeable.splice(clIdx, 1);
                    }
                    // Remember it
                    _$ui_20.ui.dialogs.push(d);
                    // Make it closeable, if applicable
                    if (opts.closeable) {
                        close_1 = btn(d.box, "X", { className: "close-button" });
                        close_1.onclick = function () { return dialogClose(d); };
                        mk("div", d.box).style.height = "2em";
                        _$ui_20.ui.closeable.push(d);
                    }
                    return [4 /*yield*/, callback(d, function (focus) {
                            d.wrapper.style.display = "flex";
                            if (focus)
                                focus.focus();
                        })];
                case 1:
                    ret = _a.sent();
                    /* Close it (closeable things are assumed to be kept open and closed by the
                     * user) */
                    if ((!opts.closeable && !opts.keepOpen) || opts.forceClose) {
                        dIdx = _$ui_20.ui.dialogs.indexOf(d);
                        if (dIdx >= 0)
                            _$ui_20.ui.dialogs.splice(dIdx, 1);
                        cIdx = _$ui_20.ui.closeable.indexOf(d);
                        if (cIdx >= 0)
                            _$ui_20.ui.closeable.splice(cIdx, 1);
                        try {
                            document.body.removeChild(d.layerSeparator);
                            document.body.removeChild(d.wrapper);
                        }
                        catch (ex) { }
                    }
                    return [2 /*return*/, ret];
            }
        });
    });
}
_$ui_20.dialog = dialog;
/**
 * Wrapper to quickly close a dialog box that's been kept open.
 * @param d  The dialog.
 */
function dialogClose(d) {
    return ____awaiter_20(this, void 0, void 0, function () {
        return ____generator_20(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dialog(function () { return void 0; }, { reuse: d })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$ui_20.dialogClose = dialogClose;
// Handle closing with escape
document.body.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && _$ui_20.ui.closeable.length) {
        ev.preventDefault();
        dialogClose(_$ui_20.ui.closeable.pop());
    }
});
/**
 * Show a loading screen while performing some task.
 * @param callback  The callback to run while the loading screen is shown.
 */
function loading(callback, opts) {
    if (opts === void 0) { opts = {}; }
    return dialog(function (d, show) {
        return ____awaiter_20(this, void 0, void 0, function () {
            return ____generator_20(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        d.box.innerText = "Loading...";
                        show(null);
                        return [4 /*yield*/, callback(d)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }, Object.assign({
        closeable: false
    }, opts));
}
_$ui_20.loading = loading;
/**
 * Show an OK-only alert box.
 * @param html  innerHTML of the dialog.
 */
function alert(html) {
    return ____awaiter_20(this, void 0, void 0, function () {
        return ____generator_20(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dialog(function (d, show) {
                        return ____awaiter_20(this, void 0, void 0, function () {
                            var ok;
                            return ____generator_20(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        mk("div", d.box, { innerHTML: html + "<br/><br/>" });
                                        ok = btn(d.box, "OK", { className: "row" });
                                        show(ok);
                                        return [4 /*yield*/, new Promise(function (res) { return ok.onclick = res; })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$ui_20.alert = alert;
// Standard interface elements
/**
 * Make an element.
 * @param el  Element type.
 * @param parent  Element to add it to.
 * @param opts  Attributes to set.
 */
function mk(el, parent, opts) {
    if (opts === void 0) { opts = {}; }
    var ret = (0, _$ui_20.dce)(el);
    if (parent)
        parent.appendChild(ret);
    Object.assign(ret, opts);
    return ret;
}
_$ui_20.mk = mk;
/**
 * Make a <br/>
 * @param parent  Element to add it to.
 */
function br(parent) {
    return mk("br", parent);
}
_$ui_20.br = br;
/**
 * Make a <button/>
 * @param parent  Element to add it to.
 * @param innerHTML  Text of the button.
 * @param opts  Other options.
 */
function btn(parent, innerHTML, opts) {
    if (opts === void 0) { opts = {}; }
    return mk("button", parent, Object.assign({ innerHTML: innerHTML }, opts));
}
_$ui_20.btn = btn;
/**
 * Make a <label/>
 * @param parent  Element to add it to.
 * @param htmlFor  ID of the element this label corresponds to.
 * @param innerHTML  Text of the label.
 * @param opts  Other options.
 */
function lbl(parent, htmlFor, innerHTML, opts) {
    if (opts === void 0) { opts = {}; }
    return mk("label", parent, Object.assign({ htmlFor: htmlFor, innerHTML: innerHTML }, opts));
}
_$ui_20.lbl = lbl;
/**
 * Make an <input type="text"/>
 * @param parent  Element to add it to.
 * @param opts  Other options.
 */
function txt(parent, opts) {
    if (opts === void 0) { opts = {}; }
    return mk("input", parent, Object.assign({
        type: "text"
    }, opts));
}
_$ui_20.txt = txt;

var _$util_21 = {};
"use strict";
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
Object.defineProperty(_$util_21, "__esModule", { value: true });
_$util_21.timestamp = void 0;
/**
 * Convert a time in seconds to a string timestamp.
 * @param s  The time.
 * @param min  Show only the fields needed.
 */
function timestamp(s, min) {
    var h = ~~(s / 3600);
    s -= h * 3600;
    var m = ~~(s / 60);
    s -= m * 60;
    var hs = h + "";
    if (hs.length < 2)
        hs = "0" + hs;
    var ms = m + "";
    if (ms.length < 2)
        ms = "0" + ms;
    var ss = s.toFixed(3);
    if (s < 10)
        ss = "0" + ss;
    if (min) {
        // Minimize seconds by removing the decimal
        if (s === ~~s) {
            ss = s + "";
            if (s < 10)
                ss = "0" + ss;
        }
        // Give as little as needed
        if (h === 0) {
            if (m === 0) {
                return s.toString();
            }
            else {
                return m + ":" + ss;
            }
        }
        else {
            return h + ":" + ms + ":" + ss;
        }
    }
    return hs + ":" + ms + ":" + ss;
}
_$util_21.timestamp = timestamp;

var _$select_14 = {};
"use strict";
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
var ____awaiter_14 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_14 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$select_14, "__esModule", { value: true });
_$select_14.load = _$select_14.setPlayHead = _$select_14.selectAll = _$select_14.selectTracks = _$select_14.selectTime = _$select_14.getSelection = _$select_14.clearSelectables = _$select_14.removeSelectable = _$select_14.addSelectable = _$select_14.playHead = void 0;
/* removed: var _$ui_20 = require("./ui"); */;
/* removed: var _$util_21 = require("./util"); */;
/**
 * All of the selectable entities currently known.
 */
var selectables = [];
/**
 * When durations change and such, it's not necessary for the client to wait
 * for the async function, but it *is* necessary for us to synchronize
 * everything, so we have a single global Promise to do so.
 */
var selPromise = Promise.all([]);
/**
 * The current selection range, in time, plus the anchor, used during selection
 * to decide whether to switch to range-selection mode.
 */
var selectStart = 0, selectEnd = 0, selectAnchor = null, selectAnchorTime = 0;
/**
 * Set if we're currently selecting a range.
 */
var activeSelectingRange = false;
/**
 * The current selected selectable(s).
 */
var selectedEls = new Set();
/**
 * The play head, only visible while playing audio.
 */
_$select_14.playHead = null;
/**
 * Add a selectable.
 * @param sel  Selectable to add.
 */
function addSelectable(sel) {
    return ____awaiter_14(this, void 0, void 0, function () {
        var c;
        return ____generator_14(this, function (_a) {
            switch (_a.label) {
                case 0:
                    c = sel.display = _$ui_20.mk("canvas", sel.wrapper, {
                        className: "selection-canvas",
                        width: 1280,
                        height: _$ui_20.trackHeight
                    });
                    selectables.push(sel);
                    selectedEls.add(sel);
                    // Make sure it actually is selectable
                    c.addEventListener("mousedown", function (ev) {
                        ev.preventDefault();
                        if (document.activeElement)
                            document.activeElement.blur();
                        var x = ev.offsetX + _$ui_20.ui.main.scrollLeft;
                        /* Behavior of clicking on selection:
                         * With ctrl: Add or remove this track from the selection list.
                         * With shift: Add this track if it's not selected; extend the time
                         * otherwise.
                         * With neither: Click to select just this track, drag to extend
                         * selection.
                         */
                        if (ev.ctrlKey) {
                            // Add or remove this track
                            if (selectedEls.has(sel))
                                selectedEls.delete(sel);
                            else
                                selectedEls.add(sel);
                        }
                        else if (ev.shiftKey) {
                            // Extending an existing selection
                            if (selectedEls.has(sel)) {
                                // In time
                                var selectTime_1 = x / (_$ui_20.pixelsPerSecond * _$ui_20.ui.zoom);
                                var startDist = Math.abs(selectTime_1 - selectStart);
                                var endDist = Math.abs(selectTime_1 - selectEnd);
                                if (selectTime_1 < selectStart ||
                                    (selectTime_1 <= selectEnd && startDist < endDist)) {
                                    selectAnchorTime = selectEnd;
                                    selectStart = selectTime_1;
                                }
                                else {
                                    selectAnchorTime = selectStart;
                                    selectEnd = selectTime_1;
                                }
                                selectAnchor = x;
                                activeSelectingRange = true;
                            }
                            else {
                                // In space
                                selectedEls.add(sel);
                            }
                        }
                        else {
                            // Starting a fresh selection
                            selectStart = selectEnd = selectAnchorTime =
                                x / (_$ui_20.pixelsPerSecond * _$ui_20.ui.zoom);
                            selectAnchor = x;
                            selectedEls.clear();
                            selectedEls.add(sel);
                            activeSelectingRange = false;
                        }
                        updateDisplay();
                    });
                    c.addEventListener("mousemove", function (ev) {
                        if (selectAnchor === null)
                            return;
                        ev.preventDefault();
                        var x = ev.offsetX + _$ui_20.ui.main.scrollLeft;
                        // Make sure we're in the selection
                        if (!selectedEls.has(sel))
                            selectedEls.add(sel);
                        // Decide whether to do range selection
                        if (!activeSelectingRange && Math.abs(x - selectAnchor) >= 16)
                            activeSelectingRange = true;
                        // Update the range selection
                        var time = x / (_$ui_20.pixelsPerSecond * _$ui_20.ui.zoom);
                        if (activeSelectingRange) {
                            if (time < selectAnchorTime) {
                                selectStart = time;
                                selectEnd = selectAnchorTime;
                            }
                            else {
                                selectStart = selectAnchorTime;
                                selectEnd = time;
                            }
                        }
                        else {
                            selectStart = selectEnd = time;
                        }
                        updateDisplay();
                    });
                    return [4 /*yield*/, updateDisplay()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$select_14.addSelectable = addSelectable;
// When we lift the mouse *anywhere*, unanchor
document.body.addEventListener("mouseup", function () {
    if (selectAnchor !== null)
        selectAnchor = null;
});
/**
 * Remove a selectable, based on the underlying track.
 * @param track  Track to remove.
 */
function removeSelectable(track) {
    return ____awaiter_14(this, void 0, void 0, function () {
        var sel, idx;
        return ____generator_14(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sel = selectables.filter(function (x) { return x.track === track; })[0];
                    if (!sel) return [3 /*break*/, 2];
                    idx = selectables.indexOf(sel);
                    selectables.splice(idx, 1);
                    return [4 /*yield*/, updateDisplay()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
_$select_14.removeSelectable = removeSelectable;
/**
 * Clear all selectables.
 */
function clearSelectables() {
    return ____awaiter_14(this, void 0, void 0, function () {
        return ____generator_14(this, function (_a) {
            selectables = [];
            selectStart = selectEnd = 0;
            selectedEls.clear();
            return [2 /*return*/];
        });
    });
}
_$select_14.clearSelectables = clearSelectables;
/**
 * Get the current selection.
 */
function getSelection() {
    return {
        range: (selectStart !== selectEnd),
        start: selectStart,
        end: selectEnd,
        tracks: selectables.filter(function (x) { return selectedEls.has(x); }).map(function (x) { return x.track; })
    };
}
_$select_14.getSelection = getSelection;
/**
 * Set the *time* of the selection. Don't set the end time to select all time.
 * @param start  Start time. Default 0.
 * @param end  Optional end time.
 */
function selectTime(start, end) {
    if (start === void 0) { start = 0; }
    return ____awaiter_14(this, void 0, void 0, function () {
        return ____generator_14(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectStart = start;
                    selectEnd = (typeof end === "number") ? end : start;
                    return [4 /*yield*/, updateDisplay()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$select_14.selectTime = selectTime;
/**
 * Set the *tracks* currently selected. Does not update the time.
 * @param tracks  Array of tracks to select. May be empty.
 */
function selectTracks(tracks) {
    return ____awaiter_14(this, void 0, void 0, function () {
        var trackSet, _i, selectables_1, sel;
        return ____generator_14(this, function (_a) {
            switch (_a.label) {
                case 0:
                    trackSet = new Set(tracks);
                    // Then add the right ones
                    selectedEls.clear();
                    for (_i = 0, selectables_1 = selectables; _i < selectables_1.length; _i++) {
                        sel = selectables_1[_i];
                        if (trackSet.has(sel.track))
                            selectedEls.add(sel);
                    }
                    return [4 /*yield*/, updateDisplay()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$select_14.selectTracks = selectTracks;
/**
 * Select all selectables, and clear the range so that everything is selected.
 * @param opts  Selection options.
 */
function selectAll(opts) {
    if (opts === void 0) { opts = {}; }
    return ____awaiter_14(this, void 0, void 0, function () {
        var _i, selectables_2, sel;
        return ____generator_14(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!opts.tracksOnly)
                        selectEnd = selectStart;
                    for (_i = 0, selectables_2 = selectables; _i < selectables_2.length; _i++) {
                        sel = selectables_2[_i];
                        selectedEls.add(sel);
                    }
                    return [4 /*yield*/, updateDisplay()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$select_14.selectAll = selectAll;
/**
 * Get the maximum duration of any selectable.
 */
function maxDuration() {
    var duration = 0;
    for (var _i = 0, selectables_3 = selectables; _i < selectables_3.length; _i++) {
        var sel = selectables_3[_i];
        duration = Math.max(duration, sel.duration());
    }
    return duration;
}
/**
 * Set the play head.
 * @param to  Value to set the play head to.
 */
function setPlayHead(to) {
    return ____awaiter_14(this, void 0, void 0, function () {
        return ____generator_14(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _$select_14.playHead = to;
                    return [4 /*yield*/, updateDisplay()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$select_14.setPlayHead = setPlayHead;
// The animation frame currently being awaited
var animationFrame = null;
/**
 * Update the selection display.
 */
function updateDisplay() {
    return ____awaiter_14(this, void 0, void 0, function () {
        return ____generator_14(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (animationFrame !== null) {
                        // Somebody else is handling this already
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, selPromise];
                case 1:
                    _a.sent();
                    // Wait for an animation frame
                    return [4 /*yield*/, new Promise(function (res) {
                            animationFrame = window.requestAnimationFrame(function () {
                                animationFrame = null;
                                res(null);
                            });
                        })];
                case 2:
                    // Wait for an animation frame
                    _a.sent();
                    selPromise = (function () {
                        return ____awaiter_14(this, void 0, void 0, function () {
                            var scrollLeft, width, _i, selectables_4, sel, selectingRange, startPx, endPx, playHeadPx, timeline, tw, th, ctx, pps, labelScale, firstSec, sec, x, ts, m, _a, selectables_5, sel, ctx, w;
                            return ____generator_14(this, function (_b) {
                                scrollLeft = _$ui_20.ui.main.scrollLeft;
                                width = window.innerWidth - 128 /* FIXME: magic number */;
                                // Relocate each canvas
                                for (_i = 0, selectables_4 = selectables; _i < selectables_4.length; _i++) {
                                    sel = selectables_4[_i];
                                    sel.display.style.left = scrollLeft + "px";
                                    sel.display.width = width;
                                }
                                selectingRange = (selectStart !== selectEnd);
                                startPx = Math.max(Math.floor(selectStart * _$ui_20.pixelsPerSecond * _$ui_20.ui.zoom - scrollLeft), -2);
                                endPx = Math.min(Math.max(Math.ceil(selectEnd * _$ui_20.pixelsPerSecond * _$ui_20.ui.zoom - scrollLeft), startPx + 1), width + 2);
                                playHeadPx = (_$select_14.playHead === null) ? null : Math.round(_$select_14.playHead * _$ui_20.pixelsPerSecond * _$ui_20.ui.zoom - scrollLeft);
                                // Draw the timeline
                                {
                                    timeline = _$ui_20.ui.timeline;
                                    tw = timeline.width = window.innerWidth;
                                    th = 32 /* FIXME: magic number */;
                                    ctx = timeline.getContext("2d");
                                    ctx.clearRect(0, 0, tw, th);
                                    ctx.textBaseline = "top";
                                    pps = _$ui_20.pixelsPerSecond * _$ui_20.ui.zoom;
                                    labelScale = 1;
                                    if (pps >= 32) {
                                        // 32 pixels per second, enough to label every second
                                        labelScale = 1;
                                    }
                                    else if (pps >= 32 / 5) {
                                        labelScale = 5;
                                    }
                                    else if (pps >= 32 / 10) {
                                        labelScale = 10;
                                    }
                                    else if (pps >= 32 / 30) {
                                        labelScale = 30;
                                    }
                                    else {
                                        labelScale = 60;
                                    }
                                    firstSec = ~~(scrollLeft / pps);
                                    sec = void 0, x = void 0;
                                    for (sec = firstSec, x = firstSec * pps - scrollLeft + 128; x < tw; sec++, x += pps) {
                                        if (sec % labelScale === 0) {
                                            ctx.fillStyle = "#fff";
                                            ctx.fillRect(~~x, 0, 1, th / 2);
                                            ts = _$util_21.timestamp(sec, true);
                                            m = ctx.measureText(ts);
                                            ctx.fillText(ts, ~~x - m.width / 2, th / 2 + 2);
                                        }
                                        else {
                                            ctx.fillStyle = "#999";
                                            ctx.fillRect(~~x, 0, 1, th / 4);
                                        }
                                    }
                                }
                                // And draw it
                                for (_a = 0, selectables_5 = selectables; _a < selectables_5.length; _a++) {
                                    sel = selectables_5[_a];
                                    ctx = sel.display.getContext("2d");
                                    w = sel.display.width;
                                    ctx.clearRect(0, 0, w, _$ui_20.trackHeight);
                                    // Don't show the selection if we're not selected
                                    if (selectedEls.has(sel)) {
                                        if (selectingRange) {
                                            // Blur what isn't selected
                                            ctx.fillStyle = "rgba(0,0,0,0.5)";
                                            ctx.fillRect(0, 0, startPx, _$ui_20.trackHeight);
                                            ctx.fillRect(endPx, 0, w - endPx, _$ui_20.trackHeight);
                                        }
                                        else {
                                            // Just draw a line for the point selected
                                            ctx.fillStyle = "#fff";
                                            ctx.fillRect(startPx, 0, 1, _$ui_20.trackHeight);
                                        }
                                    }
                                    else {
                                        // Black it out
                                        ctx.fillStyle = "rgba(0,0,0,0.5)";
                                        ctx.fillRect(0, 0, width, _$ui_20.trackHeight);
                                    }
                                    // Also draw the play head
                                    if (playHeadPx !== null) {
                                        ctx.fillStyle = "#fff";
                                        ctx.fillRect(playHeadPx, 0, 1, _$ui_20.trackHeight);
                                    }
                                }
                                return [2 /*return*/];
                            });
                        });
                    })();
                    return [4 /*yield*/, selPromise];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Selection hotkeys
document.body.addEventListener("keydown", function (ev) {
    return ____awaiter_14(this, void 0, void 0, function () {
        return ____generator_14(this, function (_a) {
            if (selectAnchor !== null)
                return [2 /*return*/];
            if (ev.key === "Home") {
                ev.preventDefault();
                selectStart = selectEnd = 0;
                updateDisplay();
            }
            else if (ev.key === "End") {
                ev.preventDefault();
                selectStart = selectEnd = maxDuration();
                updateDisplay();
            }
            else if (ev.key === "a" && ev.ctrlKey) {
                ev.preventDefault();
                selectAll({ tracksOnly: ev.altKey });
            }
            return [2 /*return*/];
        });
    });
});
/**
 * Loader for selection. Just makes sure the graphics are updated when we scroll.
 */
function __load_14() {
    return ____awaiter_14(this, void 0, void 0, function () {
        return ____generator_14(this, function (_a) {
            _$ui_20.ui.main.addEventListener("scroll", updateDisplay);
            _$ui_20.ui.onzoom.push(updateDisplay);
            return [2 /*return*/];
        });
    });
}
_$select_14.load = __load_14;

var _$track_18 = {};
"use strict";
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
Object.defineProperty(_$track_18, "__esModule", { value: true });
_$track_18.TrackType = void 0;
/**
 * All supported track types.
 */
var TrackType;
(function (TrackType) {
    TrackType[TrackType["Audio"] = 1] = "Audio";
})(TrackType = _$track_18.TrackType || (_$track_18.TrackType = {}));

var _$ponyfill_3 = { exports: {} };
(function (global){(function (){
/**
 * web-streams-polyfill v3.1.1
 */
(function (global, factory) {
    typeof _$ponyfill_3.exports === 'object' && "object" !== 'undefined' ? factory(_$ponyfill_3.exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.WebStreamsPolyfill = {}));
}(this, (function (exports) { 'use strict';

    /// <reference lib="es2015.symbol" />
    var SymbolPolyfill = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ?
        Symbol :
        function (description) { return "Symbol(" + description + ")"; };

    /// <reference lib="dom" />
    function noop() {
        return undefined;
    }
    function getGlobals() {
        if (typeof self !== 'undefined') {
            return self;
        }
        else if (typeof window !== 'undefined') {
            return window;
        }
        else if (typeof global !== 'undefined') {
            return global;
        }
        return undefined;
    }
    var globals = getGlobals();

    function typeIsObject(x) {
        return (typeof x === 'object' && x !== null) || typeof x === 'function';
    }
    var rethrowAssertionErrorRejection = noop;

    var originalPromise = Promise;
    var originalPromiseThen = Promise.prototype.then;
    var originalPromiseResolve = Promise.resolve.bind(originalPromise);
    var originalPromiseReject = Promise.reject.bind(originalPromise);
    function newPromise(executor) {
        return new originalPromise(executor);
    }
    function promiseResolvedWith(value) {
        return originalPromiseResolve(value);
    }
    function promiseRejectedWith(reason) {
        return originalPromiseReject(reason);
    }
    function PerformPromiseThen(promise, onFulfilled, onRejected) {
        // There doesn't appear to be any way to correctly emulate the behaviour from JavaScript, so this is just an
        // approximation.
        return originalPromiseThen.call(promise, onFulfilled, onRejected);
    }
    function uponPromise(promise, onFulfilled, onRejected) {
        PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), undefined, rethrowAssertionErrorRejection);
    }
    function uponFulfillment(promise, onFulfilled) {
        uponPromise(promise, onFulfilled);
    }
    function uponRejection(promise, onRejected) {
        uponPromise(promise, undefined, onRejected);
    }
    function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
        return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
    }
    function setPromiseIsHandledToTrue(promise) {
        PerformPromiseThen(promise, undefined, rethrowAssertionErrorRejection);
    }
    var queueMicrotask = (function () {
        var globalQueueMicrotask = globals && globals.queueMicrotask;
        if (typeof globalQueueMicrotask === 'function') {
            return globalQueueMicrotask;
        }
        var resolvedPromise = promiseResolvedWith(undefined);
        return function (fn) { return PerformPromiseThen(resolvedPromise, fn); };
    })();
    function reflectCall(F, V, args) {
        if (typeof F !== 'function') {
            throw new TypeError('Argument is not a function');
        }
        return Function.prototype.apply.call(F, V, args);
    }
    function promiseCall(F, V, args) {
        try {
            return promiseResolvedWith(reflectCall(F, V, args));
        }
        catch (value) {
            return promiseRejectedWith(value);
        }
    }

    // Original from Chromium
    // https://chromium.googlesource.com/chromium/src/+/0aee4434a4dba42a42abaea9bfbc0cd196a63bc1/third_party/blink/renderer/core/streams/SimpleQueue.js
    var QUEUE_MAX_ARRAY_SIZE = 16384;
    /**
     * Simple queue structure.
     *
     * Avoids scalability issues with using a packed array directly by using
     * multiple arrays in a linked list and keeping the array size bounded.
     */
    var SimpleQueue = /** @class */ (function () {
        function SimpleQueue() {
            this._cursor = 0;
            this._size = 0;
            // _front and _back are always defined.
            this._front = {
                _elements: [],
                _next: undefined
            };
            this._back = this._front;
            // The cursor is used to avoid calling Array.shift().
            // It contains the index of the front element of the array inside the
            // front-most node. It is always in the range [0, QUEUE_MAX_ARRAY_SIZE).
            this._cursor = 0;
            // When there is only one node, size === elements.length - cursor.
            this._size = 0;
        }
        Object.defineProperty(SimpleQueue.prototype, "length", {
            get: function () {
                return this._size;
            },
            enumerable: false,
            configurable: true
        });
        // For exception safety, this method is structured in order:
        // 1. Read state
        // 2. Calculate required state mutations
        // 3. Perform state mutations
        SimpleQueue.prototype.push = function (element) {
            var oldBack = this._back;
            var newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
                newBack = {
                    _elements: [],
                    _next: undefined
                };
            }
            // push() is the mutation most likely to throw an exception, so it
            // goes first.
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
                this._back = newBack;
                oldBack._next = newBack;
            }
            ++this._size;
        };
        // Like push(), shift() follows the read -> calculate -> mutate pattern for
        // exception safety.
        SimpleQueue.prototype.shift = function () { // must not be called on an empty queue
            var oldFront = this._front;
            var newFront = oldFront;
            var oldCursor = this._cursor;
            var newCursor = oldCursor + 1;
            var elements = oldFront._elements;
            var element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
                newFront = oldFront._next;
                newCursor = 0;
            }
            // No mutations before this point.
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
                this._front = newFront;
            }
            // Permit shifted element to be garbage collected.
            elements[oldCursor] = undefined;
            return element;
        };
        // The tricky thing about forEach() is that it can be called
        // re-entrantly. The queue may be mutated inside the callback. It is easy to
        // see that push() within the callback has no negative effects since the end
        // of the queue is checked for on every iteration. If shift() is called
        // repeatedly within the callback then the next iteration may return an
        // element that has been removed. In this case the callback will be called
        // with undefined values until we either "catch up" with elements that still
        // exist or reach the back of the queue.
        SimpleQueue.prototype.forEach = function (callback) {
            var i = this._cursor;
            var node = this._front;
            var elements = node._elements;
            while (i !== elements.length || node._next !== undefined) {
                if (i === elements.length) {
                    node = node._next;
                    elements = node._elements;
                    i = 0;
                    if (elements.length === 0) {
                        break;
                    }
                }
                callback(elements[i]);
                ++i;
            }
        };
        // Return the element that would be returned if shift() was called now,
        // without modifying the queue.
        SimpleQueue.prototype.peek = function () { // must not be called on an empty queue
            var front = this._front;
            var cursor = this._cursor;
            return front._elements[cursor];
        };
        return SimpleQueue;
    }());

    function ReadableStreamReaderGenericInitialize(reader, stream) {
        reader._ownerReadableStream = stream;
        stream._reader = reader;
        if (stream._state === 'readable') {
            defaultReaderClosedPromiseInitialize(reader);
        }
        else if (stream._state === 'closed') {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
        }
        else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
        }
    }
    // A client of ReadableStreamDefaultReader and ReadableStreamBYOBReader may use these functions directly to bypass state
    // check.
    function ReadableStreamReaderGenericCancel(reader, reason) {
        var stream = reader._ownerReadableStream;
        return ReadableStreamCancel(stream, reason);
    }
    function ReadableStreamReaderGenericRelease(reader) {
        if (reader._ownerReadableStream._state === 'readable') {
            defaultReaderClosedPromiseReject(reader, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness"));
        }
        else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness"));
        }
        reader._ownerReadableStream._reader = undefined;
        reader._ownerReadableStream = undefined;
    }
    // Helper functions for the readers.
    function readerLockException(name) {
        return new TypeError('Cannot ' + name + ' a stream using a released reader');
    }
    // Helper functions for the ReadableStreamDefaultReader.
    function defaultReaderClosedPromiseInitialize(reader) {
        reader._closedPromise = newPromise(function (resolve, reject) {
            reader._closedPromise_resolve = resolve;
            reader._closedPromise_reject = reject;
        });
    }
    function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseReject(reader, reason);
    }
    function defaultReaderClosedPromiseInitializeAsResolved(reader) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseResolve(reader);
    }
    function defaultReaderClosedPromiseReject(reader, reason) {
        if (reader._closedPromise_reject === undefined) {
            return;
        }
        setPromiseIsHandledToTrue(reader._closedPromise);
        reader._closedPromise_reject(reason);
        reader._closedPromise_resolve = undefined;
        reader._closedPromise_reject = undefined;
    }
    function defaultReaderClosedPromiseResetToRejected(reader, reason) {
        defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
    }
    function defaultReaderClosedPromiseResolve(reader) {
        if (reader._closedPromise_resolve === undefined) {
            return;
        }
        reader._closedPromise_resolve(undefined);
        reader._closedPromise_resolve = undefined;
        reader._closedPromise_reject = undefined;
    }

    var AbortSteps = SymbolPolyfill('[[AbortSteps]]');
    var ErrorSteps = SymbolPolyfill('[[ErrorSteps]]');
    var CancelSteps = SymbolPolyfill('[[CancelSteps]]');
    var PullSteps = SymbolPolyfill('[[PullSteps]]');

    /// <reference lib="es2015.core" />
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite#Polyfill
    var NumberIsFinite = Number.isFinite || function (x) {
        return typeof x === 'number' && isFinite(x);
    };

    /// <reference lib="es2015.core" />
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc#Polyfill
    var MathTrunc = Math.trunc || function (v) {
        return v < 0 ? Math.ceil(v) : Math.floor(v);
    };

    // https://heycam.github.io/webidl/#idl-dictionaries
    function isDictionary(x) {
        return typeof x === 'object' || typeof x === 'function';
    }
    function assertDictionary(obj, context) {
        if (obj !== undefined && !isDictionary(obj)) {
            throw new TypeError(context + " is not an object.");
        }
    }
    // https://heycam.github.io/webidl/#idl-callback-functions
    function assertFunction(x, context) {
        if (typeof x !== 'function') {
            throw new TypeError(context + " is not a function.");
        }
    }
    // https://heycam.github.io/webidl/#idl-object
    function isObject(x) {
        return (typeof x === 'object' && x !== null) || typeof x === 'function';
    }
    function assertObject(x, context) {
        if (!isObject(x)) {
            throw new TypeError(context + " is not an object.");
        }
    }
    function assertRequiredArgument(x, position, context) {
        if (x === undefined) {
            throw new TypeError("Parameter " + position + " is required in '" + context + "'.");
        }
    }
    function assertRequiredField(x, field, context) {
        if (x === undefined) {
            throw new TypeError(field + " is required in '" + context + "'.");
        }
    }
    // https://heycam.github.io/webidl/#idl-unrestricted-double
    function convertUnrestrictedDouble(value) {
        return Number(value);
    }
    function censorNegativeZero(x) {
        return x === 0 ? 0 : x;
    }
    function integerPart(x) {
        return censorNegativeZero(MathTrunc(x));
    }
    // https://heycam.github.io/webidl/#idl-unsigned-long-long
    function convertUnsignedLongLongWithEnforceRange(value, context) {
        var lowerBound = 0;
        var upperBound = Number.MAX_SAFE_INTEGER;
        var x = Number(value);
        x = censorNegativeZero(x);
        if (!NumberIsFinite(x)) {
            throw new TypeError(context + " is not a finite number");
        }
        x = integerPart(x);
        if (x < lowerBound || x > upperBound) {
            throw new TypeError(context + " is outside the accepted range of " + lowerBound + " to " + upperBound + ", inclusive");
        }
        if (!NumberIsFinite(x) || x === 0) {
            return 0;
        }
        // TODO Use BigInt if supported?
        // let xBigInt = BigInt(integerPart(x));
        // xBigInt = BigInt.asUintN(64, xBigInt);
        // return Number(xBigInt);
        return x;
    }

    function assertReadableStream(x, context) {
        if (!IsReadableStream(x)) {
            throw new TypeError(context + " is not a ReadableStream.");
        }
    }

    // Abstract operations for the ReadableStream.
    function AcquireReadableStreamDefaultReader(stream) {
        return new ReadableStreamDefaultReader(stream);
    }
    // ReadableStream API exposed for controllers.
    function ReadableStreamAddReadRequest(stream, readRequest) {
        stream._reader._readRequests.push(readRequest);
    }
    function ReadableStreamFulfillReadRequest(stream, chunk, done) {
        var reader = stream._reader;
        var readRequest = reader._readRequests.shift();
        if (done) {
            readRequest._closeSteps();
        }
        else {
            readRequest._chunkSteps(chunk);
        }
    }
    function ReadableStreamGetNumReadRequests(stream) {
        return stream._reader._readRequests.length;
    }
    function ReadableStreamHasDefaultReader(stream) {
        var reader = stream._reader;
        if (reader === undefined) {
            return false;
        }
        if (!IsReadableStreamDefaultReader(reader)) {
            return false;
        }
        return true;
    }
    /**
     * A default reader vended by a {@link ReadableStream}.
     *
     * @public
     */
    var ReadableStreamDefaultReader = /** @class */ (function () {
        function ReadableStreamDefaultReader(stream) {
            assertRequiredArgument(stream, 1, 'ReadableStreamDefaultReader');
            assertReadableStream(stream, 'First parameter');
            if (IsReadableStreamLocked(stream)) {
                throw new TypeError('This stream has already been locked for exclusive reading by another reader');
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
        }
        Object.defineProperty(ReadableStreamDefaultReader.prototype, "closed", {
            /**
             * Returns a promise that will be fulfilled when the stream becomes closed,
             * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
             */
            get: function () {
                if (!IsReadableStreamDefaultReader(this)) {
                    return promiseRejectedWith(defaultReaderBrandCheckException('closed'));
                }
                return this._closedPromise;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        ReadableStreamDefaultReader.prototype.cancel = function (reason) {
            if (reason === void 0) { reason = undefined; }
            if (!IsReadableStreamDefaultReader(this)) {
                return promiseRejectedWith(defaultReaderBrandCheckException('cancel'));
            }
            if (this._ownerReadableStream === undefined) {
                return promiseRejectedWith(readerLockException('cancel'));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
        };
        /**
         * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
         *
         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
         */
        ReadableStreamDefaultReader.prototype.read = function () {
            if (!IsReadableStreamDefaultReader(this)) {
                return promiseRejectedWith(defaultReaderBrandCheckException('read'));
            }
            if (this._ownerReadableStream === undefined) {
                return promiseRejectedWith(readerLockException('read from'));
            }
            var resolvePromise;
            var rejectPromise;
            var promise = newPromise(function (resolve, reject) {
                resolvePromise = resolve;
                rejectPromise = reject;
            });
            var readRequest = {
                _chunkSteps: function (chunk) { return resolvePromise({ value: chunk, done: false }); },
                _closeSteps: function () { return resolvePromise({ value: undefined, done: true }); },
                _errorSteps: function (e) { return rejectPromise(e); }
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
        };
        /**
         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
         * from now on; otherwise, the reader will appear closed.
         *
         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
         * the reader's {@link ReadableStreamDefaultReader.read | read()} method has not yet been settled. Attempting to
         * do so will throw a `TypeError` and leave the reader locked to the stream.
         */
        ReadableStreamDefaultReader.prototype.releaseLock = function () {
            if (!IsReadableStreamDefaultReader(this)) {
                throw defaultReaderBrandCheckException('releaseLock');
            }
            if (this._ownerReadableStream === undefined) {
                return;
            }
            if (this._readRequests.length > 0) {
                throw new TypeError('Tried to release a reader lock when that reader has pending read() calls un-settled');
            }
            ReadableStreamReaderGenericRelease(this);
        };
        return ReadableStreamDefaultReader;
    }());
    Object.defineProperties(ReadableStreamDefaultReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: 'ReadableStreamDefaultReader',
            configurable: true
        });
    }
    // Abstract operations for the readers.
    function IsReadableStreamDefaultReader(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_readRequests')) {
            return false;
        }
        return x instanceof ReadableStreamDefaultReader;
    }
    function ReadableStreamDefaultReaderRead(reader, readRequest) {
        var stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === 'closed') {
            readRequest._closeSteps();
        }
        else if (stream._state === 'errored') {
            readRequest._errorSteps(stream._storedError);
        }
        else {
            stream._readableStreamController[PullSteps](readRequest);
        }
    }
    // Helper functions for the ReadableStreamDefaultReader.
    function defaultReaderBrandCheckException(name) {
        return new TypeError("ReadableStreamDefaultReader.prototype." + name + " can only be used on a ReadableStreamDefaultReader");
    }

    /// <reference lib="es2018.asynciterable" />
    var _a;
    var AsyncIteratorPrototype;
    if (typeof SymbolPolyfill.asyncIterator === 'symbol') {
        // We're running inside a ES2018+ environment, but we're compiling to an older syntax.
        // We cannot access %AsyncIteratorPrototype% without non-ES2018 syntax, but we can re-create it.
        AsyncIteratorPrototype = (_a = {},
            // 25.1.3.1 %AsyncIteratorPrototype% [ @@asyncIterator ] ( )
            // https://tc39.github.io/ecma262/#sec-asynciteratorprototype-asynciterator
            _a[SymbolPolyfill.asyncIterator] = function () {
                return this;
            },
            _a);
        Object.defineProperty(AsyncIteratorPrototype, SymbolPolyfill.asyncIterator, { enumerable: false });
    }

    /// <reference lib="es2018.asynciterable" />
    var ReadableStreamAsyncIteratorImpl = /** @class */ (function () {
        function ReadableStreamAsyncIteratorImpl(reader, preventCancel) {
            this._ongoingPromise = undefined;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
        }
        ReadableStreamAsyncIteratorImpl.prototype.next = function () {
            var _this = this;
            var nextSteps = function () { return _this._nextSteps(); };
            this._ongoingPromise = this._ongoingPromise ?
                transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) :
                nextSteps();
            return this._ongoingPromise;
        };
        ReadableStreamAsyncIteratorImpl.prototype.return = function (value) {
            var _this = this;
            var returnSteps = function () { return _this._returnSteps(value); };
            return this._ongoingPromise ?
                transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) :
                returnSteps();
        };
        ReadableStreamAsyncIteratorImpl.prototype._nextSteps = function () {
            var _this = this;
            if (this._isFinished) {
                return Promise.resolve({ value: undefined, done: true });
            }
            var reader = this._reader;
            if (reader._ownerReadableStream === undefined) {
                return promiseRejectedWith(readerLockException('iterate'));
            }
            var resolvePromise;
            var rejectPromise;
            var promise = newPromise(function (resolve, reject) {
                resolvePromise = resolve;
                rejectPromise = reject;
            });
            var readRequest = {
                _chunkSteps: function (chunk) {
                    _this._ongoingPromise = undefined;
                    // This needs to be delayed by one microtask, otherwise we stop pulling too early which breaks a test.
                    // FIXME Is this a bug in the specification, or in the test?
                    queueMicrotask(function () { return resolvePromise({ value: chunk, done: false }); });
                },
                _closeSteps: function () {
                    _this._ongoingPromise = undefined;
                    _this._isFinished = true;
                    ReadableStreamReaderGenericRelease(reader);
                    resolvePromise({ value: undefined, done: true });
                },
                _errorSteps: function (reason) {
                    _this._ongoingPromise = undefined;
                    _this._isFinished = true;
                    ReadableStreamReaderGenericRelease(reader);
                    rejectPromise(reason);
                }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
        };
        ReadableStreamAsyncIteratorImpl.prototype._returnSteps = function (value) {
            if (this._isFinished) {
                return Promise.resolve({ value: value, done: true });
            }
            this._isFinished = true;
            var reader = this._reader;
            if (reader._ownerReadableStream === undefined) {
                return promiseRejectedWith(readerLockException('finish iterating'));
            }
            if (!this._preventCancel) {
                var result = ReadableStreamReaderGenericCancel(reader, value);
                ReadableStreamReaderGenericRelease(reader);
                return transformPromiseWith(result, function () { return ({ value: value, done: true }); });
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value: value, done: true });
        };
        return ReadableStreamAsyncIteratorImpl;
    }());
    var ReadableStreamAsyncIteratorPrototype = {
        next: function () {
            if (!IsReadableStreamAsyncIterator(this)) {
                return promiseRejectedWith(streamAsyncIteratorBrandCheckException('next'));
            }
            return this._asyncIteratorImpl.next();
        },
        return: function (value) {
            if (!IsReadableStreamAsyncIterator(this)) {
                return promiseRejectedWith(streamAsyncIteratorBrandCheckException('return'));
            }
            return this._asyncIteratorImpl.return(value);
        }
    };
    if (AsyncIteratorPrototype !== undefined) {
        Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
    }
    // Abstract operations for the ReadableStream.
    function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
        var reader = AcquireReadableStreamDefaultReader(stream);
        var impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
        var iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
        iterator._asyncIteratorImpl = impl;
        return iterator;
    }
    function IsReadableStreamAsyncIterator(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_asyncIteratorImpl')) {
            return false;
        }
        try {
            // noinspection SuspiciousTypeOfGuard
            return x._asyncIteratorImpl instanceof
                ReadableStreamAsyncIteratorImpl;
        }
        catch (_a) {
            return false;
        }
    }
    // Helper functions for the ReadableStream.
    function streamAsyncIteratorBrandCheckException(name) {
        return new TypeError("ReadableStreamAsyncIterator." + name + " can only be used on a ReadableSteamAsyncIterator");
    }

    /// <reference lib="es2015.core" />
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#Polyfill
    var NumberIsNaN = Number.isNaN || function (x) {
        // eslint-disable-next-line no-self-compare
        return x !== x;
    };

    function CreateArrayFromList(elements) {
        // We use arrays to represent lists, so this is basically a no-op.
        // Do a slice though just in case we happen to depend on the unique-ness.
        return elements.slice();
    }
    function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
        new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
    }
    // Not implemented correctly
    function TransferArrayBuffer(O) {
        return O;
    }
    // Not implemented correctly
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function IsDetachedBuffer(O) {
        return false;
    }
    function ArrayBufferSlice(buffer, begin, end) {
        // ArrayBuffer.prototype.slice is not available on IE10
        // https://www.caniuse.com/mdn-javascript_builtins_arraybuffer_slice
        if (buffer.slice) {
            return buffer.slice(begin, end);
        }
        var length = end - begin;
        var slice = new ArrayBuffer(length);
        CopyDataBlockBytes(slice, 0, buffer, begin, length);
        return slice;
    }

    function IsNonNegativeNumber(v) {
        if (typeof v !== 'number') {
            return false;
        }
        if (NumberIsNaN(v)) {
            return false;
        }
        if (v < 0) {
            return false;
        }
        return true;
    }
    function CloneAsUint8Array(O) {
        var buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
        return new Uint8Array(buffer);
    }

    function DequeueValue(container) {
        var pair = container._queue.shift();
        container._queueTotalSize -= pair.size;
        if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
        }
        return pair.value;
    }
    function EnqueueValueWithSize(container, value, size) {
        if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError('Size must be a finite, non-NaN, non-negative number.');
        }
        container._queue.push({ value: value, size: size });
        container._queueTotalSize += size;
    }
    function PeekQueueValue(container) {
        var pair = container._queue.peek();
        return pair.value;
    }
    function ResetQueue(container) {
        container._queue = new SimpleQueue();
        container._queueTotalSize = 0;
    }

    /**
     * A pull-into request in a {@link ReadableByteStreamController}.
     *
     * @public
     */
    var ReadableStreamBYOBRequest = /** @class */ (function () {
        function ReadableStreamBYOBRequest() {
            throw new TypeError('Illegal constructor');
        }
        Object.defineProperty(ReadableStreamBYOBRequest.prototype, "view", {
            /**
             * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
             */
            get: function () {
                if (!IsReadableStreamBYOBRequest(this)) {
                    throw byobRequestBrandCheckException('view');
                }
                return this._view;
            },
            enumerable: false,
            configurable: true
        });
        ReadableStreamBYOBRequest.prototype.respond = function (bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
                throw byobRequestBrandCheckException('respond');
            }
            assertRequiredArgument(bytesWritten, 1, 'respond');
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, 'First parameter');
            if (this._associatedReadableByteStreamController === undefined) {
                throw new TypeError('This BYOB request has been invalidated');
            }
            if (IsDetachedBuffer(this._view.buffer)) ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
        };
        ReadableStreamBYOBRequest.prototype.respondWithNewView = function (view) {
            if (!IsReadableStreamBYOBRequest(this)) {
                throw byobRequestBrandCheckException('respondWithNewView');
            }
            assertRequiredArgument(view, 1, 'respondWithNewView');
            if (!ArrayBuffer.isView(view)) {
                throw new TypeError('You can only respond with array buffer views');
            }
            if (this._associatedReadableByteStreamController === undefined) {
                throw new TypeError('This BYOB request has been invalidated');
            }
            if (IsDetachedBuffer(view.buffer)) ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
        };
        return ReadableStreamBYOBRequest;
    }());
    Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
        respond: { enumerable: true },
        respondWithNewView: { enumerable: true },
        view: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: 'ReadableStreamBYOBRequest',
            configurable: true
        });
    }
    /**
     * Allows control of a {@link ReadableStream | readable byte stream}'s state and internal queue.
     *
     * @public
     */
    var ReadableByteStreamController = /** @class */ (function () {
        function ReadableByteStreamController() {
            throw new TypeError('Illegal constructor');
        }
        Object.defineProperty(ReadableByteStreamController.prototype, "byobRequest", {
            /**
             * Returns the current BYOB pull request, or `null` if there isn't one.
             */
            get: function () {
                if (!IsReadableByteStreamController(this)) {
                    throw byteStreamControllerBrandCheckException('byobRequest');
                }
                return ReadableByteStreamControllerGetBYOBRequest(this);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ReadableByteStreamController.prototype, "desiredSize", {
            /**
             * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
             * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
             */
            get: function () {
                if (!IsReadableByteStreamController(this)) {
                    throw byteStreamControllerBrandCheckException('desiredSize');
                }
                return ReadableByteStreamControllerGetDesiredSize(this);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        ReadableByteStreamController.prototype.close = function () {
            if (!IsReadableByteStreamController(this)) {
                throw byteStreamControllerBrandCheckException('close');
            }
            if (this._closeRequested) {
                throw new TypeError('The stream has already been closed; do not close it again!');
            }
            var state = this._controlledReadableByteStream._state;
            if (state !== 'readable') {
                throw new TypeError("The stream (in " + state + " state) is not in the readable state and cannot be closed");
            }
            ReadableByteStreamControllerClose(this);
        };
        ReadableByteStreamController.prototype.enqueue = function (chunk) {
            if (!IsReadableByteStreamController(this)) {
                throw byteStreamControllerBrandCheckException('enqueue');
            }
            assertRequiredArgument(chunk, 1, 'enqueue');
            if (!ArrayBuffer.isView(chunk)) {
                throw new TypeError('chunk must be an array buffer view');
            }
            if (chunk.byteLength === 0) {
                throw new TypeError('chunk must have non-zero byteLength');
            }
            if (chunk.buffer.byteLength === 0) {
                throw new TypeError("chunk's buffer must have non-zero byteLength");
            }
            if (this._closeRequested) {
                throw new TypeError('stream is closed or draining');
            }
            var state = this._controlledReadableByteStream._state;
            if (state !== 'readable') {
                throw new TypeError("The stream (in " + state + " state) is not in the readable state and cannot be enqueued to");
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
        };
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        ReadableByteStreamController.prototype.error = function (e) {
            if (e === void 0) { e = undefined; }
            if (!IsReadableByteStreamController(this)) {
                throw byteStreamControllerBrandCheckException('error');
            }
            ReadableByteStreamControllerError(this, e);
        };
        /** @internal */
        ReadableByteStreamController.prototype[CancelSteps] = function (reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            var result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
        };
        /** @internal */
        ReadableByteStreamController.prototype[PullSteps] = function (readRequest) {
            var stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
                var entry = this._queue.shift();
                this._queueTotalSize -= entry.byteLength;
                ReadableByteStreamControllerHandleQueueDrain(this);
                var view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
                readRequest._chunkSteps(view);
                return;
            }
            var autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== undefined) {
                var buffer = void 0;
                try {
                    buffer = new ArrayBuffer(autoAllocateChunkSize);
                }
                catch (bufferE) {
                    readRequest._errorSteps(bufferE);
                    return;
                }
                var pullIntoDescriptor = {
                    buffer: buffer,
                    bufferByteLength: autoAllocateChunkSize,
                    byteOffset: 0,
                    byteLength: autoAllocateChunkSize,
                    bytesFilled: 0,
                    elementSize: 1,
                    viewConstructor: Uint8Array,
                    readerType: 'default'
                };
                this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
        };
        return ReadableByteStreamController;
    }());
    Object.defineProperties(ReadableByteStreamController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        byobRequest: { enumerable: true },
        desiredSize: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: 'ReadableByteStreamController',
            configurable: true
        });
    }
    // Abstract operations for the ReadableByteStreamController.
    function IsReadableByteStreamController(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_controlledReadableByteStream')) {
            return false;
        }
        return x instanceof ReadableByteStreamController;
    }
    function IsReadableStreamBYOBRequest(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_associatedReadableByteStreamController')) {
            return false;
        }
        return x instanceof ReadableStreamBYOBRequest;
    }
    function ReadableByteStreamControllerCallPullIfNeeded(controller) {
        var shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
        if (!shouldPull) {
            return;
        }
        if (controller._pulling) {
            controller._pullAgain = true;
            return;
        }
        controller._pulling = true;
        // TODO: Test controller argument
        var pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, function () {
            controller._pulling = false;
            if (controller._pullAgain) {
                controller._pullAgain = false;
                ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
        }, function (e) {
            ReadableByteStreamControllerError(controller, e);
        });
    }
    function ReadableByteStreamControllerClearPendingPullIntos(controller) {
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        controller._pendingPullIntos = new SimpleQueue();
    }
    function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
        var done = false;
        if (stream._state === 'closed') {
            done = true;
        }
        var filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
        if (pullIntoDescriptor.readerType === 'default') {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
        }
        else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
        }
    }
    function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
        var bytesFilled = pullIntoDescriptor.bytesFilled;
        var elementSize = pullIntoDescriptor.elementSize;
        return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
    }
    function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
        controller._queue.push({ buffer: buffer, byteOffset: byteOffset, byteLength: byteLength });
        controller._queueTotalSize += byteLength;
    }
    function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
        var elementSize = pullIntoDescriptor.elementSize;
        var currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
        var maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
        var maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
        var maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
        var totalBytesToCopyRemaining = maxBytesToCopy;
        var ready = false;
        if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
        }
        var queue = controller._queue;
        while (totalBytesToCopyRemaining > 0) {
            var headOfQueue = queue.peek();
            var bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            var destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
                queue.shift();
            }
            else {
                headOfQueue.byteOffset += bytesToCopy;
                headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
        }
        return ready;
    }
    function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
        pullIntoDescriptor.bytesFilled += size;
    }
    function ReadableByteStreamControllerHandleQueueDrain(controller) {
        if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
        }
        else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
    }
    function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
        if (controller._byobRequest === null) {
            return;
        }
        controller._byobRequest._associatedReadableByteStreamController = undefined;
        controller._byobRequest._view = null;
        controller._byobRequest = null;
    }
    function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
        while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
                return;
            }
            var pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
                ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
        }
    }
    function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
        var stream = controller._controlledReadableByteStream;
        var elementSize = 1;
        if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
        }
        var ctor = view.constructor;
        // try {
        var buffer = TransferArrayBuffer(view.buffer);
        // } catch (e) {
        //   readIntoRequest._errorSteps(e);
        //   return;
        // }
        var pullIntoDescriptor = {
            buffer: buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize: elementSize,
            viewConstructor: ctor,
            readerType: 'byob'
        };
        if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            // No ReadableByteStreamControllerCallPullIfNeeded() call since:
            // - No change happens on desiredSize
            // - The source has already been notified of that there's at least 1 pending read(view)
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
        }
        if (stream._state === 'closed') {
            var emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
        }
        if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
                var filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
                ReadableByteStreamControllerHandleQueueDrain(controller);
                readIntoRequest._chunkSteps(filledView);
                return;
            }
            if (controller._closeRequested) {
                var e = new TypeError('Insufficient bytes to fill elements in the given buffer');
                ReadableByteStreamControllerError(controller, e);
                readIntoRequest._errorSteps(e);
                return;
            }
        }
        controller._pendingPullIntos.push(pullIntoDescriptor);
        ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
        ReadableByteStreamControllerCallPullIfNeeded(controller);
    }
    function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
        var stream = controller._controlledReadableByteStream;
        if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
                var pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
                ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
        }
    }
    function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
        ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
        if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
        }
        ReadableByteStreamControllerShiftPendingPullInto(controller);
        var remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
        if (remainderSize > 0) {
            var end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            var remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
        }
        pullIntoDescriptor.bytesFilled -= remainderSize;
        ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
        ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
    }
    function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
        var firstDescriptor = controller._pendingPullIntos.peek();
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        var state = controller._controlledReadableByteStream._state;
        if (state === 'closed') {
            ReadableByteStreamControllerRespondInClosedState(controller);
        }
        else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
    }
    function ReadableByteStreamControllerShiftPendingPullInto(controller) {
        var descriptor = controller._pendingPullIntos.shift();
        return descriptor;
    }
    function ReadableByteStreamControllerShouldCallPull(controller) {
        var stream = controller._controlledReadableByteStream;
        if (stream._state !== 'readable') {
            return false;
        }
        if (controller._closeRequested) {
            return false;
        }
        if (!controller._started) {
            return false;
        }
        if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
        }
        if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
        }
        var desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
            return true;
        }
        return false;
    }
    function ReadableByteStreamControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = undefined;
        controller._cancelAlgorithm = undefined;
    }
    // A client of ReadableByteStreamController may use these functions directly to bypass state check.
    function ReadableByteStreamControllerClose(controller) {
        var stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== 'readable') {
            return;
        }
        if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
        }
        if (controller._pendingPullIntos.length > 0) {
            var firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
                var e = new TypeError('Insufficient bytes to fill elements in the given buffer');
                ReadableByteStreamControllerError(controller, e);
                throw e;
            }
        }
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamClose(stream);
    }
    function ReadableByteStreamControllerEnqueue(controller, chunk) {
        var stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== 'readable') {
            return;
        }
        var buffer = chunk.buffer;
        var byteOffset = chunk.byteOffset;
        var byteLength = chunk.byteLength;
        var transferredBuffer = TransferArrayBuffer(buffer);
        if (controller._pendingPullIntos.length > 0) {
            var firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer)) ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
        }
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
                ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            }
            else {
                var transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
                ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
        }
        else if (ReadableStreamHasBYOBReader(stream)) {
            // TODO: Ideally in this branch detaching should happen only if the buffer is not consumed fully.
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
    }
    function ReadableByteStreamControllerError(controller, e) {
        var stream = controller._controlledReadableByteStream;
        if (stream._state !== 'readable') {
            return;
        }
        ReadableByteStreamControllerClearPendingPullIntos(controller);
        ResetQueue(controller);
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e);
    }
    function ReadableByteStreamControllerGetBYOBRequest(controller) {
        if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            var firstDescriptor = controller._pendingPullIntos.peek();
            var view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            var byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
        }
        return controller._byobRequest;
    }
    function ReadableByteStreamControllerGetDesiredSize(controller) {
        var state = controller._controlledReadableByteStream._state;
        if (state === 'errored') {
            return null;
        }
        if (state === 'closed') {
            return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
    }
    function ReadableByteStreamControllerRespond(controller, bytesWritten) {
        var firstDescriptor = controller._pendingPullIntos.peek();
        var state = controller._controlledReadableByteStream._state;
        if (state === 'closed') {
            if (bytesWritten !== 0) {
                throw new TypeError('bytesWritten must be 0 when calling respond() on a closed stream');
            }
        }
        else {
            if (bytesWritten === 0) {
                throw new TypeError('bytesWritten must be greater than 0 when calling respond() on a readable stream');
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
                throw new RangeError('bytesWritten out of range');
            }
        }
        firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
        ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
    }
    function ReadableByteStreamControllerRespondWithNewView(controller, view) {
        var firstDescriptor = controller._pendingPullIntos.peek();
        var state = controller._controlledReadableByteStream._state;
        if (state === 'closed') {
            if (view.byteLength !== 0) {
                throw new TypeError('The view\'s length must be 0 when calling respondWithNewView() on a closed stream');
            }
        }
        else {
            if (view.byteLength === 0) {
                throw new TypeError('The view\'s length must be greater than 0 when calling respondWithNewView() on a readable stream');
            }
        }
        if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError('The region specified by view does not match byobRequest');
        }
        if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError('The buffer of view has different capacity than byobRequest');
        }
        if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError('The region specified by view is larger than byobRequest');
        }
        firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
        ReadableByteStreamControllerRespondInternal(controller, view.byteLength);
    }
    function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
        controller._controlledReadableByteStream = stream;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._byobRequest = null;
        // Need to set the slots so that the assert doesn't fire. In the spec the slots already exist implicitly.
        controller._queue = controller._queueTotalSize = undefined;
        ResetQueue(controller);
        controller._closeRequested = false;
        controller._started = false;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        controller._autoAllocateChunkSize = autoAllocateChunkSize;
        controller._pendingPullIntos = new SimpleQueue();
        stream._readableStreamController = controller;
        var startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), function () {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
        }, function (r) {
            ReadableByteStreamControllerError(controller, r);
        });
    }
    function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
        var controller = Object.create(ReadableByteStreamController.prototype);
        var startAlgorithm = function () { return undefined; };
        var pullAlgorithm = function () { return promiseResolvedWith(undefined); };
        var cancelAlgorithm = function () { return promiseResolvedWith(undefined); };
        if (underlyingByteSource.start !== undefined) {
            startAlgorithm = function () { return underlyingByteSource.start(controller); };
        }
        if (underlyingByteSource.pull !== undefined) {
            pullAlgorithm = function () { return underlyingByteSource.pull(controller); };
        }
        if (underlyingByteSource.cancel !== undefined) {
            cancelAlgorithm = function (reason) { return underlyingByteSource.cancel(reason); };
        }
        var autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
        if (autoAllocateChunkSize === 0) {
            throw new TypeError('autoAllocateChunkSize must be greater than 0');
        }
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
    }
    function SetUpReadableStreamBYOBRequest(request, controller, view) {
        request._associatedReadableByteStreamController = controller;
        request._view = view;
    }
    // Helper functions for the ReadableStreamBYOBRequest.
    function byobRequestBrandCheckException(name) {
        return new TypeError("ReadableStreamBYOBRequest.prototype." + name + " can only be used on a ReadableStreamBYOBRequest");
    }
    // Helper functions for the ReadableByteStreamController.
    function byteStreamControllerBrandCheckException(name) {
        return new TypeError("ReadableByteStreamController.prototype." + name + " can only be used on a ReadableByteStreamController");
    }

    // Abstract operations for the ReadableStream.
    function AcquireReadableStreamBYOBReader(stream) {
        return new ReadableStreamBYOBReader(stream);
    }
    // ReadableStream API exposed for controllers.
    function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
        stream._reader._readIntoRequests.push(readIntoRequest);
    }
    function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
        var reader = stream._reader;
        var readIntoRequest = reader._readIntoRequests.shift();
        if (done) {
            readIntoRequest._closeSteps(chunk);
        }
        else {
            readIntoRequest._chunkSteps(chunk);
        }
    }
    function ReadableStreamGetNumReadIntoRequests(stream) {
        return stream._reader._readIntoRequests.length;
    }
    function ReadableStreamHasBYOBReader(stream) {
        var reader = stream._reader;
        if (reader === undefined) {
            return false;
        }
        if (!IsReadableStreamBYOBReader(reader)) {
            return false;
        }
        return true;
    }
    /**
     * A BYOB reader vended by a {@link ReadableStream}.
     *
     * @public
     */
    var ReadableStreamBYOBReader = /** @class */ (function () {
        function ReadableStreamBYOBReader(stream) {
            assertRequiredArgument(stream, 1, 'ReadableStreamBYOBReader');
            assertReadableStream(stream, 'First parameter');
            if (IsReadableStreamLocked(stream)) {
                throw new TypeError('This stream has already been locked for exclusive reading by another reader');
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
                throw new TypeError('Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte ' +
                    'source');
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
        }
        Object.defineProperty(ReadableStreamBYOBReader.prototype, "closed", {
            /**
             * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
             * the reader's lock is released before the stream finishes closing.
             */
            get: function () {
                if (!IsReadableStreamBYOBReader(this)) {
                    return promiseRejectedWith(byobReaderBrandCheckException('closed'));
                }
                return this._closedPromise;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        ReadableStreamBYOBReader.prototype.cancel = function (reason) {
            if (reason === void 0) { reason = undefined; }
            if (!IsReadableStreamBYOBReader(this)) {
                return promiseRejectedWith(byobReaderBrandCheckException('cancel'));
            }
            if (this._ownerReadableStream === undefined) {
                return promiseRejectedWith(readerLockException('cancel'));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
        };
        /**
         * Attempts to reads bytes into view, and returns a promise resolved with the result.
         *
         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
         */
        ReadableStreamBYOBReader.prototype.read = function (view) {
            if (!IsReadableStreamBYOBReader(this)) {
                return promiseRejectedWith(byobReaderBrandCheckException('read'));
            }
            if (!ArrayBuffer.isView(view)) {
                return promiseRejectedWith(new TypeError('view must be an array buffer view'));
            }
            if (view.byteLength === 0) {
                return promiseRejectedWith(new TypeError('view must have non-zero byteLength'));
            }
            if (view.buffer.byteLength === 0) {
                return promiseRejectedWith(new TypeError("view's buffer must have non-zero byteLength"));
            }
            if (IsDetachedBuffer(view.buffer)) ;
            if (this._ownerReadableStream === undefined) {
                return promiseRejectedWith(readerLockException('read from'));
            }
            var resolvePromise;
            var rejectPromise;
            var promise = newPromise(function (resolve, reject) {
                resolvePromise = resolve;
                rejectPromise = reject;
            });
            var readIntoRequest = {
                _chunkSteps: function (chunk) { return resolvePromise({ value: chunk, done: false }); },
                _closeSteps: function (chunk) { return resolvePromise({ value: chunk, done: true }); },
                _errorSteps: function (e) { return rejectPromise(e); }
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
        };
        /**
         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
         * from now on; otherwise, the reader will appear closed.
         *
         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
         * the reader's {@link ReadableStreamBYOBReader.read | read()} method has not yet been settled. Attempting to
         * do so will throw a `TypeError` and leave the reader locked to the stream.
         */
        ReadableStreamBYOBReader.prototype.releaseLock = function () {
            if (!IsReadableStreamBYOBReader(this)) {
                throw byobReaderBrandCheckException('releaseLock');
            }
            if (this._ownerReadableStream === undefined) {
                return;
            }
            if (this._readIntoRequests.length > 0) {
                throw new TypeError('Tried to release a reader lock when that reader has pending read() calls un-settled');
            }
            ReadableStreamReaderGenericRelease(this);
        };
        return ReadableStreamBYOBReader;
    }());
    Object.defineProperties(ReadableStreamBYOBReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: 'ReadableStreamBYOBReader',
            configurable: true
        });
    }
    // Abstract operations for the readers.
    function IsReadableStreamBYOBReader(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_readIntoRequests')) {
            return false;
        }
        return x instanceof ReadableStreamBYOBReader;
    }
    function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
        var stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === 'errored') {
            readIntoRequest._errorSteps(stream._storedError);
        }
        else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
        }
    }
    // Helper functions for the ReadableStreamBYOBReader.
    function byobReaderBrandCheckException(name) {
        return new TypeError("ReadableStreamBYOBReader.prototype." + name + " can only be used on a ReadableStreamBYOBReader");
    }

    function ExtractHighWaterMark(strategy, defaultHWM) {
        var highWaterMark = strategy.highWaterMark;
        if (highWaterMark === undefined) {
            return defaultHWM;
        }
        if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError('Invalid highWaterMark');
        }
        return highWaterMark;
    }
    function ExtractSizeAlgorithm(strategy) {
        var size = strategy.size;
        if (!size) {
            return function () { return 1; };
        }
        return size;
    }

    function convertQueuingStrategy(init, context) {
        assertDictionary(init, context);
        var highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
        var size = init === null || init === void 0 ? void 0 : init.size;
        return {
            highWaterMark: highWaterMark === undefined ? undefined : convertUnrestrictedDouble(highWaterMark),
            size: size === undefined ? undefined : convertQueuingStrategySize(size, context + " has member 'size' that")
        };
    }
    function convertQueuingStrategySize(fn, context) {
        assertFunction(fn, context);
        return function (chunk) { return convertUnrestrictedDouble(fn(chunk)); };
    }

    function convertUnderlyingSink(original, context) {
        assertDictionary(original, context);
        var abort = original === null || original === void 0 ? void 0 : original.abort;
        var close = original === null || original === void 0 ? void 0 : original.close;
        var start = original === null || original === void 0 ? void 0 : original.start;
        var type = original === null || original === void 0 ? void 0 : original.type;
        var write = original === null || original === void 0 ? void 0 : original.write;
        return {
            abort: abort === undefined ?
                undefined :
                convertUnderlyingSinkAbortCallback(abort, original, context + " has member 'abort' that"),
            close: close === undefined ?
                undefined :
                convertUnderlyingSinkCloseCallback(close, original, context + " has member 'close' that"),
            start: start === undefined ?
                undefined :
                convertUnderlyingSinkStartCallback(start, original, context + " has member 'start' that"),
            write: write === undefined ?
                undefined :
                convertUnderlyingSinkWriteCallback(write, original, context + " has member 'write' that"),
            type: type
        };
    }
    function convertUnderlyingSinkAbortCallback(fn, original, context) {
        assertFunction(fn, context);
        return function (reason) { return promiseCall(fn, original, [reason]); };
    }
    function convertUnderlyingSinkCloseCallback(fn, original, context) {
        assertFunction(fn, context);
        return function () { return promiseCall(fn, original, []); };
    }
    function convertUnderlyingSinkStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return function (controller) { return reflectCall(fn, original, [controller]); };
    }
    function convertUnderlyingSinkWriteCallback(fn, original, context) {
        assertFunction(fn, context);
        return function (chunk, controller) { return promiseCall(fn, original, [chunk, controller]); };
    }

    function assertWritableStream(x, context) {
        if (!IsWritableStream(x)) {
            throw new TypeError(context + " is not a WritableStream.");
        }
    }

    function isAbortSignal(value) {
        if (typeof value !== 'object' || value === null) {
            return false;
        }
        try {
            return typeof value.aborted === 'boolean';
        }
        catch (_a) {
            // AbortSignal.prototype.aborted throws if its brand check fails
            return false;
        }
    }
    var supportsAbortController = typeof AbortController === 'function';
    /**
     * Construct a new AbortController, if supported by the platform.
     *
     * @internal
     */
    function createAbortController() {
        if (supportsAbortController) {
            return new AbortController();
        }
        return undefined;
    }

    /**
     * A writable stream represents a destination for data, into which you can write.
     *
     * @public
     */
    var WritableStream = /** @class */ (function () {
        function WritableStream(rawUnderlyingSink, rawStrategy) {
            if (rawUnderlyingSink === void 0) { rawUnderlyingSink = {}; }
            if (rawStrategy === void 0) { rawStrategy = {}; }
            if (rawUnderlyingSink === undefined) {
                rawUnderlyingSink = null;
            }
            else {
                assertObject(rawUnderlyingSink, 'First parameter');
            }
            var strategy = convertQueuingStrategy(rawStrategy, 'Second parameter');
            var underlyingSink = convertUnderlyingSink(rawUnderlyingSink, 'First parameter');
            InitializeWritableStream(this);
            var type = underlyingSink.type;
            if (type !== undefined) {
                throw new RangeError('Invalid type is specified');
            }
            var sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            var highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
        }
        Object.defineProperty(WritableStream.prototype, "locked", {
            /**
             * Returns whether or not the writable stream is locked to a writer.
             */
            get: function () {
                if (!IsWritableStream(this)) {
                    throw streamBrandCheckException$2('locked');
                }
                return IsWritableStreamLocked(this);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Aborts the stream, signaling that the producer can no longer successfully write to the stream and it is to be
         * immediately moved to an errored state, with any queued-up writes discarded. This will also execute any abort
         * mechanism of the underlying sink.
         *
         * The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying sink signaled
         * that there was an error doing so. Additionally, it will reject with a `TypeError` (without attempting to cancel
         * the stream) if the stream is currently locked.
         */
        WritableStream.prototype.abort = function (reason) {
            if (reason === void 0) { reason = undefined; }
            if (!IsWritableStream(this)) {
                return promiseRejectedWith(streamBrandCheckException$2('abort'));
            }
            if (IsWritableStreamLocked(this)) {
                return promiseRejectedWith(new TypeError('Cannot abort a stream that already has a writer'));
            }
            return WritableStreamAbort(this, reason);
        };
        /**
         * Closes the stream. The underlying sink will finish processing any previously-written chunks, before invoking its
         * close behavior. During this time any further attempts to write will fail (without erroring the stream).
         *
         * The method returns a promise that will fulfill if all remaining chunks are successfully written and the stream
         * successfully closes, or rejects if an error is encountered during this process. Additionally, it will reject with
         * a `TypeError` (without attempting to cancel the stream) if the stream is currently locked.
         */
        WritableStream.prototype.close = function () {
            if (!IsWritableStream(this)) {
                return promiseRejectedWith(streamBrandCheckException$2('close'));
            }
            if (IsWritableStreamLocked(this)) {
                return promiseRejectedWith(new TypeError('Cannot close a stream that already has a writer'));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
                return promiseRejectedWith(new TypeError('Cannot close an already-closing stream'));
            }
            return WritableStreamClose(this);
        };
        /**
         * Creates a {@link WritableStreamDefaultWriter | writer} and locks the stream to the new writer. While the stream
         * is locked, no other writer can be acquired until this one is released.
         *
         * This functionality is especially useful for creating abstractions that desire the ability to write to a stream
         * without interruption or interleaving. By getting a writer for the stream, you can ensure nobody else can write at
         * the same time, which would cause the resulting written data to be unpredictable and probably useless.
         */
        WritableStream.prototype.getWriter = function () {
            if (!IsWritableStream(this)) {
                throw streamBrandCheckException$2('getWriter');
            }
            return AcquireWritableStreamDefaultWriter(this);
        };
        return WritableStream;
    }());
    Object.defineProperties(WritableStream.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        getWriter: { enumerable: true },
        locked: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: 'WritableStream',
            configurable: true
        });
    }
    // Abstract operations for the WritableStream.
    function AcquireWritableStreamDefaultWriter(stream) {
        return new WritableStreamDefaultWriter(stream);
    }
    // Throws if and only if startAlgorithm throws.
    function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
        if (highWaterMark === void 0) { highWaterMark = 1; }
        if (sizeAlgorithm === void 0) { sizeAlgorithm = function () { return 1; }; }
        var stream = Object.create(WritableStream.prototype);
        InitializeWritableStream(stream);
        var controller = Object.create(WritableStreamDefaultController.prototype);
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
    }
    function InitializeWritableStream(stream) {
        stream._state = 'writable';
        // The error that will be reported by new method calls once the state becomes errored. Only set when [[state]] is
        // 'erroring' or 'errored'. May be set to an undefined value.
        stream._storedError = undefined;
        stream._writer = undefined;
        // Initialize to undefined first because the constructor of the controller checks this
        // variable to validate the caller.
        stream._writableStreamController = undefined;
        // This queue is placed here instead of the writer class in order to allow for passing a writer to the next data
        // producer without waiting for the queued writes to finish.
        stream._writeRequests = new SimpleQueue();
        // Write requests are removed from _writeRequests when write() is called on the underlying sink. This prevents
        // them from being erroneously rejected on error. If a write() call is in-flight, the request is stored here.
        stream._inFlightWriteRequest = undefined;
        // The promise that was returned from writer.close(). Stored here because it may be fulfilled after the writer
        // has been detached.
        stream._closeRequest = undefined;
        // Close request is removed from _closeRequest when close() is called on the underlying sink. This prevents it
        // from being erroneously rejected on error. If a close() call is in-flight, the request is stored here.
        stream._inFlightCloseRequest = undefined;
        // The promise that was returned from writer.abort(). This may also be fulfilled after the writer has detached.
        stream._pendingAbortRequest = undefined;
        // The backpressure signal set by the controller.
        stream._backpressure = false;
    }
    function IsWritableStream(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_writableStreamController')) {
            return false;
        }
        return x instanceof WritableStream;
    }
    function IsWritableStreamLocked(stream) {
        if (stream._writer === undefined) {
            return false;
        }
        return true;
    }
    function WritableStreamAbort(stream, reason) {
        var _a;
        if (stream._state === 'closed' || stream._state === 'errored') {
            return promiseResolvedWith(undefined);
        }
        stream._writableStreamController._abortReason = reason;
        (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
        // TypeScript narrows the type of `stream._state` down to 'writable' | 'erroring',
        // but it doesn't know that signaling abort runs author code that might have changed the state.
        // Widen the type again by casting to WritableStreamState.
        var state = stream._state;
        if (state === 'closed' || state === 'errored') {
            return promiseResolvedWith(undefined);
        }
        if (stream._pendingAbortRequest !== undefined) {
            return stream._pendingAbortRequest._promise;
        }
        var wasAlreadyErroring = false;
        if (state === 'erroring') {
            wasAlreadyErroring = true;
            // reason will not be used, so don't keep a reference to it.
            reason = undefined;
        }
        var promise = newPromise(function (resolve, reject) {
            stream._pendingAbortRequest = {
                _promise: undefined,
                _resolve: resolve,
                _reject: reject,
                _reason: reason,
                _wasAlreadyErroring: wasAlreadyErroring
            };
        });
        stream._pendingAbortRequest._promise = promise;
        if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
        }
        return promise;
    }
    function WritableStreamClose(stream) {
        var state = stream._state;
        if (state === 'closed' || state === 'errored') {
            return promiseRejectedWith(new TypeError("The stream (in " + state + " state) is not in the writable state and cannot be closed"));
        }
        var promise = newPromise(function (resolve, reject) {
            var closeRequest = {
                _resolve: resolve,
                _reject: reject
            };
            stream._closeRequest = closeRequest;
        });
        var writer = stream._writer;
        if (writer !== undefined && stream._backpressure && state === 'writable') {
            defaultWriterReadyPromiseResolve(writer);
        }
        WritableStreamDefaultControllerClose(stream._writableStreamController);
        return promise;
    }
    // WritableStream API exposed for controllers.
    function WritableStreamAddWriteRequest(stream) {
        var promise = newPromise(function (resolve, reject) {
            var writeRequest = {
                _resolve: resolve,
                _reject: reject
            };
            stream._writeRequests.push(writeRequest);
        });
        return promise;
    }
    function WritableStreamDealWithRejection(stream, error) {
        var state = stream._state;
        if (state === 'writable') {
            WritableStreamStartErroring(stream, error);
            return;
        }
        WritableStreamFinishErroring(stream);
    }
    function WritableStreamStartErroring(stream, reason) {
        var controller = stream._writableStreamController;
        stream._state = 'erroring';
        stream._storedError = reason;
        var writer = stream._writer;
        if (writer !== undefined) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
        }
        if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
        }
    }
    function WritableStreamFinishErroring(stream) {
        stream._state = 'errored';
        stream._writableStreamController[ErrorSteps]();
        var storedError = stream._storedError;
        stream._writeRequests.forEach(function (writeRequest) {
            writeRequest._reject(storedError);
        });
        stream._writeRequests = new SimpleQueue();
        if (stream._pendingAbortRequest === undefined) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
        }
        var abortRequest = stream._pendingAbortRequest;
        stream._pendingAbortRequest = undefined;
        if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
        }
        var promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
        uponPromise(promise, function () {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
        }, function (reason) {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
        });
    }
    function WritableStreamFinishInFlightWrite(stream) {
        stream._inFlightWriteRequest._resolve(undefined);
        stream._inFlightWriteRequest = undefined;
    }
    function WritableStreamFinishInFlightWriteWithError(stream, error) {
        stream._inFlightWriteRequest._reject(error);
        stream._inFlightWriteRequest = undefined;
        WritableStreamDealWithRejection(stream, error);
    }
    function WritableStreamFinishInFlightClose(stream) {
        stream._inFlightCloseRequest._resolve(undefined);
        stream._inFlightCloseRequest = undefined;
        var state = stream._state;
        if (state === 'erroring') {
            // The error was too late to do anything, so it is ignored.
            stream._storedError = undefined;
            if (stream._pendingAbortRequest !== undefined) {
                stream._pendingAbortRequest._resolve();
                stream._pendingAbortRequest = undefined;
            }
        }
        stream._state = 'closed';
        var writer = stream._writer;
        if (writer !== undefined) {
            defaultWriterClosedPromiseResolve(writer);
        }
    }
    function WritableStreamFinishInFlightCloseWithError(stream, error) {
        stream._inFlightCloseRequest._reject(error);
        stream._inFlightCloseRequest = undefined;
        // Never execute sink abort() after sink close().
        if (stream._pendingAbortRequest !== undefined) {
            stream._pendingAbortRequest._reject(error);
            stream._pendingAbortRequest = undefined;
        }
        WritableStreamDealWithRejection(stream, error);
    }
    // TODO(ricea): Fix alphabetical order.
    function WritableStreamCloseQueuedOrInFlight(stream) {
        if (stream._closeRequest === undefined && stream._inFlightCloseRequest === undefined) {
            return false;
        }
        return true;
    }
    function WritableStreamHasOperationMarkedInFlight(stream) {
        if (stream._inFlightWriteRequest === undefined && stream._inFlightCloseRequest === undefined) {
            return false;
        }
        return true;
    }
    function WritableStreamMarkCloseRequestInFlight(stream) {
        stream._inFlightCloseRequest = stream._closeRequest;
        stream._closeRequest = undefined;
    }
    function WritableStreamMarkFirstWriteRequestInFlight(stream) {
        stream._inFlightWriteRequest = stream._writeRequests.shift();
    }
    function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
        if (stream._closeRequest !== undefined) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = undefined;
        }
        var writer = stream._writer;
        if (writer !== undefined) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
        }
    }
    function WritableStreamUpdateBackpressure(stream, backpressure) {
        var writer = stream._writer;
        if (writer !== undefined && backpressure !== stream._backpressure) {
            if (backpressure) {
                defaultWriterReadyPromiseReset(writer);
            }
            else {
                defaultWriterReadyPromiseResolve(writer);
            }
        }
        stream._backpressure = backpressure;
    }
    /**
     * A default writer vended by a {@link WritableStream}.
     *
     * @public
     */
    var WritableStreamDefaultWriter = /** @class */ (function () {
        function WritableStreamDefaultWriter(stream) {
            assertRequiredArgument(stream, 1, 'WritableStreamDefaultWriter');
            assertWritableStream(stream, 'First parameter');
            if (IsWritableStreamLocked(stream)) {
                throw new TypeError('This stream has already been locked for exclusive writing by another writer');
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            var state = stream._state;
            if (state === 'writable') {
                if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                    defaultWriterReadyPromiseInitialize(this);
                }
                else {
                    defaultWriterReadyPromiseInitializeAsResolved(this);
                }
                defaultWriterClosedPromiseInitialize(this);
            }
            else if (state === 'erroring') {
                defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
                defaultWriterClosedPromiseInitialize(this);
            }
            else if (state === 'closed') {
                defaultWriterReadyPromiseInitializeAsResolved(this);
                defaultWriterClosedPromiseInitializeAsResolved(this);
            }
            else {
                var storedError = stream._storedError;
                defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
                defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
        }
        Object.defineProperty(WritableStreamDefaultWriter.prototype, "closed", {
            /**
             * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
             * the writer’s lock is released before the stream finishes closing.
             */
            get: function () {
                if (!IsWritableStreamDefaultWriter(this)) {
                    return promiseRejectedWith(defaultWriterBrandCheckException('closed'));
                }
                return this._closedPromise;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WritableStreamDefaultWriter.prototype, "desiredSize", {
            /**
             * Returns the desired size to fill the stream’s internal queue. It can be negative, if the queue is over-full.
             * A producer can use this information to determine the right amount of data to write.
             *
             * It will be `null` if the stream cannot be successfully written to (due to either being errored, or having an abort
             * queued up). It will return zero if the stream is closed. And the getter will throw an exception if invoked when
             * the writer’s lock is released.
             */
            get: function () {
                if (!IsWritableStreamDefaultWriter(this)) {
                    throw defaultWriterBrandCheckException('desiredSize');
                }
                if (this._ownerWritableStream === undefined) {
                    throw defaultWriterLockException('desiredSize');
                }
                return WritableStreamDefaultWriterGetDesiredSize(this);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WritableStreamDefaultWriter.prototype, "ready", {
            /**
             * Returns a promise that will be fulfilled when the desired size to fill the stream’s internal queue transitions
             * from non-positive to positive, signaling that it is no longer applying backpressure. Once the desired size dips
             * back to zero or below, the getter will return a new promise that stays pending until the next transition.
             *
             * If the stream becomes errored or aborted, or the writer’s lock is released, the returned promise will become
             * rejected.
             */
            get: function () {
                if (!IsWritableStreamDefaultWriter(this)) {
                    return promiseRejectedWith(defaultWriterBrandCheckException('ready'));
                }
                return this._readyPromise;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
         */
        WritableStreamDefaultWriter.prototype.abort = function (reason) {
            if (reason === void 0) { reason = undefined; }
            if (!IsWritableStreamDefaultWriter(this)) {
                return promiseRejectedWith(defaultWriterBrandCheckException('abort'));
            }
            if (this._ownerWritableStream === undefined) {
                return promiseRejectedWith(defaultWriterLockException('abort'));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
        };
        /**
         * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
         */
        WritableStreamDefaultWriter.prototype.close = function () {
            if (!IsWritableStreamDefaultWriter(this)) {
                return promiseRejectedWith(defaultWriterBrandCheckException('close'));
            }
            var stream = this._ownerWritableStream;
            if (stream === undefined) {
                return promiseRejectedWith(defaultWriterLockException('close'));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
                return promiseRejectedWith(new TypeError('Cannot close an already-closing stream'));
            }
            return WritableStreamDefaultWriterClose(this);
        };
        /**
         * Releases the writer’s lock on the corresponding stream. After the lock is released, the writer is no longer active.
         * If the associated stream is errored when the lock is released, the writer will appear errored in the same way from
         * now on; otherwise, the writer will appear closed.
         *
         * Note that the lock can still be released even if some ongoing writes have not yet finished (i.e. even if the
         * promises returned from previous calls to {@link WritableStreamDefaultWriter.write | write()} have not yet settled).
         * It’s not necessary to hold the lock on the writer for the duration of the write; the lock instead simply prevents
         * other producers from writing in an interleaved manner.
         */
        WritableStreamDefaultWriter.prototype.releaseLock = function () {
            if (!IsWritableStreamDefaultWriter(this)) {
                throw defaultWriterBrandCheckException('releaseLock');
            }
            var stream = this._ownerWritableStream;
            if (stream === undefined) {
                return;
            }
            WritableStreamDefaultWriterRelease(this);
        };
        WritableStreamDefaultWriter.prototype.write = function (chunk) {
            if (chunk === void 0) { chunk = undefined; }
            if (!IsWritableStreamDefaultWriter(this)) {
                return promiseRejectedWith(defaultWriterBrandCheckException('write'));
            }
            if (this._ownerWritableStream === undefined) {
                return promiseRejectedWith(defaultWriterLockException('write to'));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
        };
        return WritableStreamDefaultWriter;
    }());
    Object.defineProperties(WritableStreamDefaultWriter.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        releaseLock: { enumerable: true },
        write: { enumerable: true },
        closed: { enumerable: true },
        desiredSize: { enumerable: true },
        ready: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: 'WritableStreamDefaultWriter',
            configurable: true
        });
    }
    // Abstract operations for the WritableStreamDefaultWriter.
    function IsWritableStreamDefaultWriter(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_ownerWritableStream')) {
            return false;
        }
        return x instanceof WritableStreamDefaultWriter;
    }
    // A client of WritableStreamDefaultWriter may use these functions directly to bypass state check.
    function WritableStreamDefaultWriterAbort(writer, reason) {
        var stream = writer._ownerWritableStream;
        return WritableStreamAbort(stream, reason);
    }
    function WritableStreamDefaultWriterClose(writer) {
        var stream = writer._ownerWritableStream;
        return WritableStreamClose(stream);
    }
    function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
        var stream = writer._ownerWritableStream;
        var state = stream._state;
        if (WritableStreamCloseQueuedOrInFlight(stream) || state === 'closed') {
            return promiseResolvedWith(undefined);
        }
        if (state === 'errored') {
            return promiseRejectedWith(stream._storedError);
        }
        return WritableStreamDefaultWriterClose(writer);
    }
    function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
        if (writer._closedPromiseState === 'pending') {
            defaultWriterClosedPromiseReject(writer, error);
        }
        else {
            defaultWriterClosedPromiseResetToRejected(writer, error);
        }
    }
    function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
        if (writer._readyPromiseState === 'pending') {
            defaultWriterReadyPromiseReject(writer, error);
        }
        else {
            defaultWriterReadyPromiseResetToRejected(writer, error);
        }
    }
    function WritableStreamDefaultWriterGetDesiredSize(writer) {
        var stream = writer._ownerWritableStream;
        var state = stream._state;
        if (state === 'errored' || state === 'erroring') {
            return null;
        }
        if (state === 'closed') {
            return 0;
        }
        return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
    }
    function WritableStreamDefaultWriterRelease(writer) {
        var stream = writer._ownerWritableStream;
        var releasedError = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
        WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
        // The state transitions to "errored" before the sink abort() method runs, but the writer.closed promise is not
        // rejected until afterwards. This means that simply testing state will not work.
        WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
        stream._writer = undefined;
        writer._ownerWritableStream = undefined;
    }
    function WritableStreamDefaultWriterWrite(writer, chunk) {
        var stream = writer._ownerWritableStream;
        var controller = stream._writableStreamController;
        var chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
        if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException('write to'));
        }
        var state = stream._state;
        if (state === 'errored') {
            return promiseRejectedWith(stream._storedError);
        }
        if (WritableStreamCloseQueuedOrInFlight(stream) || state === 'closed') {
            return promiseRejectedWith(new TypeError('The stream is closing or closed and cannot be written to'));
        }
        if (state === 'erroring') {
            return promiseRejectedWith(stream._storedError);
        }
        var promise = WritableStreamAddWriteRequest(stream);
        WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
        return promise;
    }
    var closeSentinel = {};
    /**
     * Allows control of a {@link WritableStream | writable stream}'s state and internal queue.
     *
     * @public
     */
    var WritableStreamDefaultController = /** @class */ (function () {
        function WritableStreamDefaultController() {
            throw new TypeError('Illegal constructor');
        }
        Object.defineProperty(WritableStreamDefaultController.prototype, "abortReason", {
            /**
             * The reason which was passed to `WritableStream.abort(reason)` when the stream was aborted.
             */
            get: function () {
                if (!IsWritableStreamDefaultController(this)) {
                    throw defaultControllerBrandCheckException$2('abortReason');
                }
                return this._abortReason;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WritableStreamDefaultController.prototype, "signal", {
            /**
             * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
             */
            get: function () {
                if (!IsWritableStreamDefaultController(this)) {
                    throw defaultControllerBrandCheckException$2('signal');
                }
                if (this._abortController === undefined) {
                    // Older browsers or older Node versions may not support `AbortController` or `AbortSignal`.
                    // We don't want to bundle and ship an `AbortController` polyfill together with our polyfill,
                    // so instead we only implement support for `signal` if we find a global `AbortController` constructor.
                    throw new TypeError('WritableStreamDefaultController.prototype.signal is not supported');
                }
                return this._abortController.signal;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Closes the controlled writable stream, making all future interactions with it fail with the given error `e`.
         *
         * This method is rarely used, since usually it suffices to return a rejected promise from one of the underlying
         * sink's methods. However, it can be useful for suddenly shutting down a stream in response to an event outside the
         * normal lifecycle of interactions with the underlying sink.
         */
        WritableStreamDefaultController.prototype.error = function (e) {
            if (e === void 0) { e = undefined; }
            if (!IsWritableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$2('error');
            }
            var state = this._controlledWritableStream._state;
            if (state !== 'writable') {
                // The stream is closed, errored or will be soon. The sink can't do anything useful if it gets an error here, so
                // just treat it as a no-op.
                return;
            }
            WritableStreamDefaultControllerError(this, e);
        };
        /** @internal */
        WritableStreamDefaultController.prototype[AbortSteps] = function (reason) {
            var result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
        };
        /** @internal */
        WritableStreamDefaultController.prototype[ErrorSteps] = function () {
            ResetQueue(this);
        };
        return WritableStreamDefaultController;
    }());
    Object.defineProperties(WritableStreamDefaultController.prototype, {
        error: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: 'WritableStreamDefaultController',
            configurable: true
        });
    }
    // Abstract operations implementing interface required by the WritableStream.
    function IsWritableStreamDefaultController(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_controlledWritableStream')) {
            return false;
        }
        return x instanceof WritableStreamDefaultController;
    }
    function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledWritableStream = stream;
        stream._writableStreamController = controller;
        // Need to set the slots so that the assert doesn't fire. In the spec the slots already exist implicitly.
        controller._queue = undefined;
        controller._queueTotalSize = undefined;
        ResetQueue(controller);
        controller._abortReason = undefined;
        controller._abortController = createAbortController();
        controller._started = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._writeAlgorithm = writeAlgorithm;
        controller._closeAlgorithm = closeAlgorithm;
        controller._abortAlgorithm = abortAlgorithm;
        var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
        WritableStreamUpdateBackpressure(stream, backpressure);
        var startResult = startAlgorithm();
        var startPromise = promiseResolvedWith(startResult);
        uponPromise(startPromise, function () {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }, function (r) {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r);
        });
    }
    function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
        var controller = Object.create(WritableStreamDefaultController.prototype);
        var startAlgorithm = function () { return undefined; };
        var writeAlgorithm = function () { return promiseResolvedWith(undefined); };
        var closeAlgorithm = function () { return promiseResolvedWith(undefined); };
        var abortAlgorithm = function () { return promiseResolvedWith(undefined); };
        if (underlyingSink.start !== undefined) {
            startAlgorithm = function () { return underlyingSink.start(controller); };
        }
        if (underlyingSink.write !== undefined) {
            writeAlgorithm = function (chunk) { return underlyingSink.write(chunk, controller); };
        }
        if (underlyingSink.close !== undefined) {
            closeAlgorithm = function () { return underlyingSink.close(); };
        }
        if (underlyingSink.abort !== undefined) {
            abortAlgorithm = function (reason) { return underlyingSink.abort(reason); };
        }
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
    }
    // ClearAlgorithms may be called twice. Erroring the same stream in multiple ways will often result in redundant calls.
    function WritableStreamDefaultControllerClearAlgorithms(controller) {
        controller._writeAlgorithm = undefined;
        controller._closeAlgorithm = undefined;
        controller._abortAlgorithm = undefined;
        controller._strategySizeAlgorithm = undefined;
    }
    function WritableStreamDefaultControllerClose(controller) {
        EnqueueValueWithSize(controller, closeSentinel, 0);
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
    }
    function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
        try {
            return controller._strategySizeAlgorithm(chunk);
        }
        catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
        }
    }
    function WritableStreamDefaultControllerGetDesiredSize(controller) {
        return controller._strategyHWM - controller._queueTotalSize;
    }
    function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
        try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
        }
        catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
        }
        var stream = controller._controlledWritableStream;
        if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === 'writable') {
            var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
        }
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
    }
    // Abstract operations for the WritableStreamDefaultController.
    function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
        var stream = controller._controlledWritableStream;
        if (!controller._started) {
            return;
        }
        if (stream._inFlightWriteRequest !== undefined) {
            return;
        }
        var state = stream._state;
        if (state === 'erroring') {
            WritableStreamFinishErroring(stream);
            return;
        }
        if (controller._queue.length === 0) {
            return;
        }
        var value = PeekQueueValue(controller);
        if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
        }
        else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
        }
    }
    function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
        if (controller._controlledWritableStream._state === 'writable') {
            WritableStreamDefaultControllerError(controller, error);
        }
    }
    function WritableStreamDefaultControllerProcessClose(controller) {
        var stream = controller._controlledWritableStream;
        WritableStreamMarkCloseRequestInFlight(stream);
        DequeueValue(controller);
        var sinkClosePromise = controller._closeAlgorithm();
        WritableStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(sinkClosePromise, function () {
            WritableStreamFinishInFlightClose(stream);
        }, function (reason) {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
        });
    }
    function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
        var stream = controller._controlledWritableStream;
        WritableStreamMarkFirstWriteRequestInFlight(stream);
        var sinkWritePromise = controller._writeAlgorithm(chunk);
        uponPromise(sinkWritePromise, function () {
            WritableStreamFinishInFlightWrite(stream);
            var state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === 'writable') {
                var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
                WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }, function (reason) {
            if (stream._state === 'writable') {
                WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
        });
    }
    function WritableStreamDefaultControllerGetBackpressure(controller) {
        var desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
        return desiredSize <= 0;
    }
    // A client of WritableStreamDefaultController may use these functions directly to bypass state check.
    function WritableStreamDefaultControllerError(controller, error) {
        var stream = controller._controlledWritableStream;
        WritableStreamDefaultControllerClearAlgorithms(controller);
        WritableStreamStartErroring(stream, error);
    }
    // Helper functions for the WritableStream.
    function streamBrandCheckException$2(name) {
        return new TypeError("WritableStream.prototype." + name + " can only be used on a WritableStream");
    }
    // Helper functions for the WritableStreamDefaultController.
    function defaultControllerBrandCheckException$2(name) {
        return new TypeError("WritableStreamDefaultController.prototype." + name + " can only be used on a WritableStreamDefaultController");
    }
    // Helper functions for the WritableStreamDefaultWriter.
    function defaultWriterBrandCheckException(name) {
        return new TypeError("WritableStreamDefaultWriter.prototype." + name + " can only be used on a WritableStreamDefaultWriter");
    }
    function defaultWriterLockException(name) {
        return new TypeError('Cannot ' + name + ' a stream using a released writer');
    }
    function defaultWriterClosedPromiseInitialize(writer) {
        writer._closedPromise = newPromise(function (resolve, reject) {
            writer._closedPromise_resolve = resolve;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = 'pending';
        });
    }
    function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseReject(writer, reason);
    }
    function defaultWriterClosedPromiseInitializeAsResolved(writer) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseResolve(writer);
    }
    function defaultWriterClosedPromiseReject(writer, reason) {
        if (writer._closedPromise_reject === undefined) {
            return;
        }
        setPromiseIsHandledToTrue(writer._closedPromise);
        writer._closedPromise_reject(reason);
        writer._closedPromise_resolve = undefined;
        writer._closedPromise_reject = undefined;
        writer._closedPromiseState = 'rejected';
    }
    function defaultWriterClosedPromiseResetToRejected(writer, reason) {
        defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
    }
    function defaultWriterClosedPromiseResolve(writer) {
        if (writer._closedPromise_resolve === undefined) {
            return;
        }
        writer._closedPromise_resolve(undefined);
        writer._closedPromise_resolve = undefined;
        writer._closedPromise_reject = undefined;
        writer._closedPromiseState = 'resolved';
    }
    function defaultWriterReadyPromiseInitialize(writer) {
        writer._readyPromise = newPromise(function (resolve, reject) {
            writer._readyPromise_resolve = resolve;
            writer._readyPromise_reject = reject;
        });
        writer._readyPromiseState = 'pending';
    }
    function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseReject(writer, reason);
    }
    function defaultWriterReadyPromiseInitializeAsResolved(writer) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseResolve(writer);
    }
    function defaultWriterReadyPromiseReject(writer, reason) {
        if (writer._readyPromise_reject === undefined) {
            return;
        }
        setPromiseIsHandledToTrue(writer._readyPromise);
        writer._readyPromise_reject(reason);
        writer._readyPromise_resolve = undefined;
        writer._readyPromise_reject = undefined;
        writer._readyPromiseState = 'rejected';
    }
    function defaultWriterReadyPromiseReset(writer) {
        defaultWriterReadyPromiseInitialize(writer);
    }
    function defaultWriterReadyPromiseResetToRejected(writer, reason) {
        defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
    }
    function defaultWriterReadyPromiseResolve(writer) {
        if (writer._readyPromise_resolve === undefined) {
            return;
        }
        writer._readyPromise_resolve(undefined);
        writer._readyPromise_resolve = undefined;
        writer._readyPromise_reject = undefined;
        writer._readyPromiseState = 'fulfilled';
    }

    /// <reference lib="dom" />
    var NativeDOMException = typeof DOMException !== 'undefined' ? DOMException : undefined;

    /// <reference types="node" />
    function isDOMExceptionConstructor(ctor) {
        if (!(typeof ctor === 'function' || typeof ctor === 'object')) {
            return false;
        }
        try {
            new ctor();
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    function createDOMExceptionPolyfill() {
        // eslint-disable-next-line no-shadow
        var ctor = function DOMException(message, name) {
            this.message = message || '';
            this.name = name || 'Error';
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, this.constructor);
            }
        };
        ctor.prototype = Object.create(Error.prototype);
        Object.defineProperty(ctor.prototype, 'constructor', { value: ctor, writable: true, configurable: true });
        return ctor;
    }
    // eslint-disable-next-line no-redeclare
    var DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();

    function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
        var reader = AcquireReadableStreamDefaultReader(source);
        var writer = AcquireWritableStreamDefaultWriter(dest);
        source._disturbed = true;
        var shuttingDown = false;
        // This is used to keep track of the spec's requirement that we wait for ongoing writes during shutdown.
        var currentWrite = promiseResolvedWith(undefined);
        return newPromise(function (resolve, reject) {
            var abortAlgorithm;
            if (signal !== undefined) {
                abortAlgorithm = function () {
                    var error = new DOMException$1('Aborted', 'AbortError');
                    var actions = [];
                    if (!preventAbort) {
                        actions.push(function () {
                            if (dest._state === 'writable') {
                                return WritableStreamAbort(dest, error);
                            }
                            return promiseResolvedWith(undefined);
                        });
                    }
                    if (!preventCancel) {
                        actions.push(function () {
                            if (source._state === 'readable') {
                                return ReadableStreamCancel(source, error);
                            }
                            return promiseResolvedWith(undefined);
                        });
                    }
                    shutdownWithAction(function () { return Promise.all(actions.map(function (action) { return action(); })); }, true, error);
                };
                if (signal.aborted) {
                    abortAlgorithm();
                    return;
                }
                signal.addEventListener('abort', abortAlgorithm);
            }
            // Using reader and writer, read all chunks from this and write them to dest
            // - Backpressure must be enforced
            // - Shutdown must stop all activity
            function pipeLoop() {
                return newPromise(function (resolveLoop, rejectLoop) {
                    function next(done) {
                        if (done) {
                            resolveLoop();
                        }
                        else {
                            // Use `PerformPromiseThen` instead of `uponPromise` to avoid
                            // adding unnecessary `.catch(rethrowAssertionErrorRejection)` handlers
                            PerformPromiseThen(pipeStep(), next, rejectLoop);
                        }
                    }
                    next(false);
                });
            }
            function pipeStep() {
                if (shuttingDown) {
                    return promiseResolvedWith(true);
                }
                return PerformPromiseThen(writer._readyPromise, function () {
                    return newPromise(function (resolveRead, rejectRead) {
                        ReadableStreamDefaultReaderRead(reader, {
                            _chunkSteps: function (chunk) {
                                currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), undefined, noop);
                                resolveRead(false);
                            },
                            _closeSteps: function () { return resolveRead(true); },
                            _errorSteps: rejectRead
                        });
                    });
                });
            }
            // Errors must be propagated forward
            isOrBecomesErrored(source, reader._closedPromise, function (storedError) {
                if (!preventAbort) {
                    shutdownWithAction(function () { return WritableStreamAbort(dest, storedError); }, true, storedError);
                }
                else {
                    shutdown(true, storedError);
                }
            });
            // Errors must be propagated backward
            isOrBecomesErrored(dest, writer._closedPromise, function (storedError) {
                if (!preventCancel) {
                    shutdownWithAction(function () { return ReadableStreamCancel(source, storedError); }, true, storedError);
                }
                else {
                    shutdown(true, storedError);
                }
            });
            // Closing must be propagated forward
            isOrBecomesClosed(source, reader._closedPromise, function () {
                if (!preventClose) {
                    shutdownWithAction(function () { return WritableStreamDefaultWriterCloseWithErrorPropagation(writer); });
                }
                else {
                    shutdown();
                }
            });
            // Closing must be propagated backward
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === 'closed') {
                var destClosed_1 = new TypeError('the destination writable stream closed before all data could be piped to it');
                if (!preventCancel) {
                    shutdownWithAction(function () { return ReadableStreamCancel(source, destClosed_1); }, true, destClosed_1);
                }
                else {
                    shutdown(true, destClosed_1);
                }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
                // Another write may have started while we were waiting on this currentWrite, so we have to be sure to wait
                // for that too.
                var oldCurrentWrite = currentWrite;
                return PerformPromiseThen(currentWrite, function () { return oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : undefined; });
            }
            function isOrBecomesErrored(stream, promise, action) {
                if (stream._state === 'errored') {
                    action(stream._storedError);
                }
                else {
                    uponRejection(promise, action);
                }
            }
            function isOrBecomesClosed(stream, promise, action) {
                if (stream._state === 'closed') {
                    action();
                }
                else {
                    uponFulfillment(promise, action);
                }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
                if (shuttingDown) {
                    return;
                }
                shuttingDown = true;
                if (dest._state === 'writable' && !WritableStreamCloseQueuedOrInFlight(dest)) {
                    uponFulfillment(waitForWritesToFinish(), doTheRest);
                }
                else {
                    doTheRest();
                }
                function doTheRest() {
                    uponPromise(action(), function () { return finalize(originalIsError, originalError); }, function (newError) { return finalize(true, newError); });
                }
            }
            function shutdown(isError, error) {
                if (shuttingDown) {
                    return;
                }
                shuttingDown = true;
                if (dest._state === 'writable' && !WritableStreamCloseQueuedOrInFlight(dest)) {
                    uponFulfillment(waitForWritesToFinish(), function () { return finalize(isError, error); });
                }
                else {
                    finalize(isError, error);
                }
            }
            function finalize(isError, error) {
                WritableStreamDefaultWriterRelease(writer);
                ReadableStreamReaderGenericRelease(reader);
                if (signal !== undefined) {
                    signal.removeEventListener('abort', abortAlgorithm);
                }
                if (isError) {
                    reject(error);
                }
                else {
                    resolve(undefined);
                }
            }
        });
    }

    /**
     * Allows control of a {@link ReadableStream | readable stream}'s state and internal queue.
     *
     * @public
     */
    var ReadableStreamDefaultController = /** @class */ (function () {
        function ReadableStreamDefaultController() {
            throw new TypeError('Illegal constructor');
        }
        Object.defineProperty(ReadableStreamDefaultController.prototype, "desiredSize", {
            /**
             * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
             * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
             */
            get: function () {
                if (!IsReadableStreamDefaultController(this)) {
                    throw defaultControllerBrandCheckException$1('desiredSize');
                }
                return ReadableStreamDefaultControllerGetDesiredSize(this);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        ReadableStreamDefaultController.prototype.close = function () {
            if (!IsReadableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$1('close');
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
                throw new TypeError('The stream is not in a state that permits close');
            }
            ReadableStreamDefaultControllerClose(this);
        };
        ReadableStreamDefaultController.prototype.enqueue = function (chunk) {
            if (chunk === void 0) { chunk = undefined; }
            if (!IsReadableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$1('enqueue');
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
                throw new TypeError('The stream is not in a state that permits enqueue');
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
        };
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        ReadableStreamDefaultController.prototype.error = function (e) {
            if (e === void 0) { e = undefined; }
            if (!IsReadableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$1('error');
            }
            ReadableStreamDefaultControllerError(this, e);
        };
        /** @internal */
        ReadableStreamDefaultController.prototype[CancelSteps] = function (reason) {
            ResetQueue(this);
            var result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
        };
        /** @internal */
        ReadableStreamDefaultController.prototype[PullSteps] = function (readRequest) {
            var stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
                var chunk = DequeueValue(this);
                if (this._closeRequested && this._queue.length === 0) {
                    ReadableStreamDefaultControllerClearAlgorithms(this);
                    ReadableStreamClose(stream);
                }
                else {
                    ReadableStreamDefaultControllerCallPullIfNeeded(this);
                }
                readRequest._chunkSteps(chunk);
            }
            else {
                ReadableStreamAddReadRequest(stream, readRequest);
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
        };
        return ReadableStreamDefaultController;
    }());
    Object.defineProperties(ReadableStreamDefaultController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        desiredSize: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: 'ReadableStreamDefaultController',
            configurable: true
        });
    }
    // Abstract operations for the ReadableStreamDefaultController.
    function IsReadableStreamDefaultController(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_controlledReadableStream')) {
            return false;
        }
        return x instanceof ReadableStreamDefaultController;
    }
    function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
        var shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
        if (!shouldPull) {
            return;
        }
        if (controller._pulling) {
            controller._pullAgain = true;
            return;
        }
        controller._pulling = true;
        var pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, function () {
            controller._pulling = false;
            if (controller._pullAgain) {
                controller._pullAgain = false;
                ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
        }, function (e) {
            ReadableStreamDefaultControllerError(controller, e);
        });
    }
    function ReadableStreamDefaultControllerShouldCallPull(controller) {
        var stream = controller._controlledReadableStream;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
        }
        if (!controller._started) {
            return false;
        }
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
        }
        var desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
            return true;
        }
        return false;
    }
    function ReadableStreamDefaultControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = undefined;
        controller._cancelAlgorithm = undefined;
        controller._strategySizeAlgorithm = undefined;
    }
    // A client of ReadableStreamDefaultController may use these functions directly to bypass state check.
    function ReadableStreamDefaultControllerClose(controller) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
        }
        var stream = controller._controlledReadableStream;
        controller._closeRequested = true;
        if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
        }
    }
    function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
        }
        var stream = controller._controlledReadableStream;
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
        }
        else {
            var chunkSize = void 0;
            try {
                chunkSize = controller._strategySizeAlgorithm(chunk);
            }
            catch (chunkSizeE) {
                ReadableStreamDefaultControllerError(controller, chunkSizeE);
                throw chunkSizeE;
            }
            try {
                EnqueueValueWithSize(controller, chunk, chunkSize);
            }
            catch (enqueueE) {
                ReadableStreamDefaultControllerError(controller, enqueueE);
                throw enqueueE;
            }
        }
        ReadableStreamDefaultControllerCallPullIfNeeded(controller);
    }
    function ReadableStreamDefaultControllerError(controller, e) {
        var stream = controller._controlledReadableStream;
        if (stream._state !== 'readable') {
            return;
        }
        ResetQueue(controller);
        ReadableStreamDefaultControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e);
    }
    function ReadableStreamDefaultControllerGetDesiredSize(controller) {
        var state = controller._controlledReadableStream._state;
        if (state === 'errored') {
            return null;
        }
        if (state === 'closed') {
            return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
    }
    // This is used in the implementation of TransformStream.
    function ReadableStreamDefaultControllerHasBackpressure(controller) {
        if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
        }
        return true;
    }
    function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
        var state = controller._controlledReadableStream._state;
        if (!controller._closeRequested && state === 'readable') {
            return true;
        }
        return false;
    }
    function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledReadableStream = stream;
        controller._queue = undefined;
        controller._queueTotalSize = undefined;
        ResetQueue(controller);
        controller._started = false;
        controller._closeRequested = false;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        stream._readableStreamController = controller;
        var startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), function () {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }, function (r) {
            ReadableStreamDefaultControllerError(controller, r);
        });
    }
    function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
        var controller = Object.create(ReadableStreamDefaultController.prototype);
        var startAlgorithm = function () { return undefined; };
        var pullAlgorithm = function () { return promiseResolvedWith(undefined); };
        var cancelAlgorithm = function () { return promiseResolvedWith(undefined); };
        if (underlyingSource.start !== undefined) {
            startAlgorithm = function () { return underlyingSource.start(controller); };
        }
        if (underlyingSource.pull !== undefined) {
            pullAlgorithm = function () { return underlyingSource.pull(controller); };
        }
        if (underlyingSource.cancel !== undefined) {
            cancelAlgorithm = function (reason) { return underlyingSource.cancel(reason); };
        }
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
    }
    // Helper functions for the ReadableStreamDefaultController.
    function defaultControllerBrandCheckException$1(name) {
        return new TypeError("ReadableStreamDefaultController.prototype." + name + " can only be used on a ReadableStreamDefaultController");
    }

    function ReadableStreamTee(stream, cloneForBranch2) {
        if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
        }
        return ReadableStreamDefaultTee(stream);
    }
    function ReadableStreamDefaultTee(stream, cloneForBranch2) {
        var reader = AcquireReadableStreamDefaultReader(stream);
        var reading = false;
        var canceled1 = false;
        var canceled2 = false;
        var reason1;
        var reason2;
        var branch1;
        var branch2;
        var resolveCancelPromise;
        var cancelPromise = newPromise(function (resolve) {
            resolveCancelPromise = resolve;
        });
        function pullAlgorithm() {
            if (reading) {
                return promiseResolvedWith(undefined);
            }
            reading = true;
            var readRequest = {
                _chunkSteps: function (chunk) {
                    // This needs to be delayed a microtask because it takes at least a microtask to detect errors (using
                    // reader._closedPromise below), and we want errors in stream to error both branches immediately. We cannot let
                    // successful synchronously-available reads get ahead of asynchronously-available errors.
                    queueMicrotask(function () {
                        reading = false;
                        var chunk1 = chunk;
                        var chunk2 = chunk;
                        // There is no way to access the cloning code right now in the reference implementation.
                        // If we add one then we'll need an implementation for serializable objects.
                        // if (!canceled2 && cloneForBranch2) {
                        //   chunk2 = StructuredDeserialize(StructuredSerialize(chunk2));
                        // }
                        if (!canceled1) {
                            ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                        }
                        if (!canceled2) {
                            ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                        }
                    });
                },
                _closeSteps: function () {
                    reading = false;
                    if (!canceled1) {
                        ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                    }
                    if (!canceled2) {
                        ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                    }
                    if (!canceled1 || !canceled2) {
                        resolveCancelPromise(undefined);
                    }
                },
                _errorSteps: function () {
                    reading = false;
                }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(undefined);
        }
        function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
                var compositeReason = CreateArrayFromList([reason1, reason2]);
                var cancelResult = ReadableStreamCancel(stream, compositeReason);
                resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
        }
        function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
                var compositeReason = CreateArrayFromList([reason1, reason2]);
                var cancelResult = ReadableStreamCancel(stream, compositeReason);
                resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
        }
        function startAlgorithm() {
            // do nothing
        }
        branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
        branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
        uponRejection(reader._closedPromise, function (r) {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r);
            if (!canceled1 || !canceled2) {
                resolveCancelPromise(undefined);
            }
        });
        return [branch1, branch2];
    }
    function ReadableByteStreamTee(stream) {
        var reader = AcquireReadableStreamDefaultReader(stream);
        var reading = false;
        var canceled1 = false;
        var canceled2 = false;
        var reason1;
        var reason2;
        var branch1;
        var branch2;
        var resolveCancelPromise;
        var cancelPromise = newPromise(function (resolve) {
            resolveCancelPromise = resolve;
        });
        function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, function (r) {
                if (thisReader !== reader) {
                    return;
                }
                ReadableByteStreamControllerError(branch1._readableStreamController, r);
                ReadableByteStreamControllerError(branch2._readableStreamController, r);
                if (!canceled1 || !canceled2) {
                    resolveCancelPromise(undefined);
                }
            });
        }
        function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
                ReadableStreamReaderGenericRelease(reader);
                reader = AcquireReadableStreamDefaultReader(stream);
                forwardReaderError(reader);
            }
            var readRequest = {
                _chunkSteps: function (chunk) {
                    // This needs to be delayed a microtask because it takes at least a microtask to detect errors (using
                    // reader._closedPromise below), and we want errors in stream to error both branches immediately. We cannot let
                    // successful synchronously-available reads get ahead of asynchronously-available errors.
                    queueMicrotask(function () {
                        reading = false;
                        var chunk1 = chunk;
                        var chunk2 = chunk;
                        if (!canceled1 && !canceled2) {
                            try {
                                chunk2 = CloneAsUint8Array(chunk);
                            }
                            catch (cloneE) {
                                ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                                ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                                resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                                return;
                            }
                        }
                        if (!canceled1) {
                            ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                        }
                        if (!canceled2) {
                            ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                        }
                    });
                },
                _closeSteps: function () {
                    reading = false;
                    if (!canceled1) {
                        ReadableByteStreamControllerClose(branch1._readableStreamController);
                    }
                    if (!canceled2) {
                        ReadableByteStreamControllerClose(branch2._readableStreamController);
                    }
                    if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                        ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                    }
                    if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                        ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                    }
                    if (!canceled1 || !canceled2) {
                        resolveCancelPromise(undefined);
                    }
                },
                _errorSteps: function () {
                    reading = false;
                }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
        }
        function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
                ReadableStreamReaderGenericRelease(reader);
                reader = AcquireReadableStreamBYOBReader(stream);
                forwardReaderError(reader);
            }
            var byobBranch = forBranch2 ? branch2 : branch1;
            var otherBranch = forBranch2 ? branch1 : branch2;
            var readIntoRequest = {
                _chunkSteps: function (chunk) {
                    // This needs to be delayed a microtask because it takes at least a microtask to detect errors (using
                    // reader._closedPromise below), and we want errors in stream to error both branches immediately. We cannot let
                    // successful synchronously-available reads get ahead of asynchronously-available errors.
                    queueMicrotask(function () {
                        reading = false;
                        var byobCanceled = forBranch2 ? canceled2 : canceled1;
                        var otherCanceled = forBranch2 ? canceled1 : canceled2;
                        if (!otherCanceled) {
                            var clonedChunk = void 0;
                            try {
                                clonedChunk = CloneAsUint8Array(chunk);
                            }
                            catch (cloneE) {
                                ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                                ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                                resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                                return;
                            }
                            if (!byobCanceled) {
                                ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                            }
                            ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                        }
                        else if (!byobCanceled) {
                            ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                        }
                    });
                },
                _closeSteps: function (chunk) {
                    reading = false;
                    var byobCanceled = forBranch2 ? canceled2 : canceled1;
                    var otherCanceled = forBranch2 ? canceled1 : canceled2;
                    if (!byobCanceled) {
                        ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                    }
                    if (!otherCanceled) {
                        ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                    }
                    if (chunk !== undefined) {
                        if (!byobCanceled) {
                            ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                        }
                        if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                            ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                        }
                    }
                    if (!byobCanceled || !otherCanceled) {
                        resolveCancelPromise(undefined);
                    }
                },
                _errorSteps: function () {
                    reading = false;
                }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
        }
        function pull1Algorithm() {
            if (reading) {
                return promiseResolvedWith(undefined);
            }
            reading = true;
            var byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
                pullWithDefaultReader();
            }
            else {
                pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(undefined);
        }
        function pull2Algorithm() {
            if (reading) {
                return promiseResolvedWith(undefined);
            }
            reading = true;
            var byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
                pullWithDefaultReader();
            }
            else {
                pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(undefined);
        }
        function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
                var compositeReason = CreateArrayFromList([reason1, reason2]);
                var cancelResult = ReadableStreamCancel(stream, compositeReason);
                resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
        }
        function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
                var compositeReason = CreateArrayFromList([reason1, reason2]);
                var cancelResult = ReadableStreamCancel(stream, compositeReason);
                resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
        }
        function startAlgorithm() {
            return;
        }
        branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
        branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
        forwardReaderError(reader);
        return [branch1, branch2];
    }

    function convertUnderlyingDefaultOrByteSource(source, context) {
        assertDictionary(source, context);
        var original = source;
        var autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
        var cancel = original === null || original === void 0 ? void 0 : original.cancel;
        var pull = original === null || original === void 0 ? void 0 : original.pull;
        var start = original === null || original === void 0 ? void 0 : original.start;
        var type = original === null || original === void 0 ? void 0 : original.type;
        return {
            autoAllocateChunkSize: autoAllocateChunkSize === undefined ?
                undefined :
                convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, context + " has member 'autoAllocateChunkSize' that"),
            cancel: cancel === undefined ?
                undefined :
                convertUnderlyingSourceCancelCallback(cancel, original, context + " has member 'cancel' that"),
            pull: pull === undefined ?
                undefined :
                convertUnderlyingSourcePullCallback(pull, original, context + " has member 'pull' that"),
            start: start === undefined ?
                undefined :
                convertUnderlyingSourceStartCallback(start, original, context + " has member 'start' that"),
            type: type === undefined ? undefined : convertReadableStreamType(type, context + " has member 'type' that")
        };
    }
    function convertUnderlyingSourceCancelCallback(fn, original, context) {
        assertFunction(fn, context);
        return function (reason) { return promiseCall(fn, original, [reason]); };
    }
    function convertUnderlyingSourcePullCallback(fn, original, context) {
        assertFunction(fn, context);
        return function (controller) { return promiseCall(fn, original, [controller]); };
    }
    function convertUnderlyingSourceStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return function (controller) { return reflectCall(fn, original, [controller]); };
    }
    function convertReadableStreamType(type, context) {
        type = "" + type;
        if (type !== 'bytes') {
            throw new TypeError(context + " '" + type + "' is not a valid enumeration value for ReadableStreamType");
        }
        return type;
    }

    function convertReaderOptions(options, context) {
        assertDictionary(options, context);
        var mode = options === null || options === void 0 ? void 0 : options.mode;
        return {
            mode: mode === undefined ? undefined : convertReadableStreamReaderMode(mode, context + " has member 'mode' that")
        };
    }
    function convertReadableStreamReaderMode(mode, context) {
        mode = "" + mode;
        if (mode !== 'byob') {
            throw new TypeError(context + " '" + mode + "' is not a valid enumeration value for ReadableStreamReaderMode");
        }
        return mode;
    }

    function convertIteratorOptions(options, context) {
        assertDictionary(options, context);
        var preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        return { preventCancel: Boolean(preventCancel) };
    }

    function convertPipeOptions(options, context) {
        assertDictionary(options, context);
        var preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
        var preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        var preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
        var signal = options === null || options === void 0 ? void 0 : options.signal;
        if (signal !== undefined) {
            assertAbortSignal(signal, context + " has member 'signal' that");
        }
        return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal: signal
        };
    }
    function assertAbortSignal(signal, context) {
        if (!isAbortSignal(signal)) {
            throw new TypeError(context + " is not an AbortSignal.");
        }
    }

    function convertReadableWritablePair(pair, context) {
        assertDictionary(pair, context);
        var readable = pair === null || pair === void 0 ? void 0 : pair.readable;
        assertRequiredField(readable, 'readable', 'ReadableWritablePair');
        assertReadableStream(readable, context + " has member 'readable' that");
        var writable = pair === null || pair === void 0 ? void 0 : pair.writable;
        assertRequiredField(writable, 'writable', 'ReadableWritablePair');
        assertWritableStream(writable, context + " has member 'writable' that");
        return { readable: readable, writable: writable };
    }

    /**
     * A readable stream represents a source of data, from which you can read.
     *
     * @public
     */
    var ReadableStream = /** @class */ (function () {
        function ReadableStream(rawUnderlyingSource, rawStrategy) {
            if (rawUnderlyingSource === void 0) { rawUnderlyingSource = {}; }
            if (rawStrategy === void 0) { rawStrategy = {}; }
            if (rawUnderlyingSource === undefined) {
                rawUnderlyingSource = null;
            }
            else {
                assertObject(rawUnderlyingSource, 'First parameter');
            }
            var strategy = convertQueuingStrategy(rawStrategy, 'Second parameter');
            var underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, 'First parameter');
            InitializeReadableStream(this);
            if (underlyingSource.type === 'bytes') {
                if (strategy.size !== undefined) {
                    throw new RangeError('The strategy for a byte stream cannot have a size function');
                }
                var highWaterMark = ExtractHighWaterMark(strategy, 0);
                SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            }
            else {
                var sizeAlgorithm = ExtractSizeAlgorithm(strategy);
                var highWaterMark = ExtractHighWaterMark(strategy, 1);
                SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
        }
        Object.defineProperty(ReadableStream.prototype, "locked", {
            /**
             * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
             */
            get: function () {
                if (!IsReadableStream(this)) {
                    throw streamBrandCheckException$1('locked');
                }
                return IsReadableStreamLocked(this);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Cancels the stream, signaling a loss of interest in the stream by a consumer.
         *
         * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
         * method, which might or might not use it.
         */
        ReadableStream.prototype.cancel = function (reason) {
            if (reason === void 0) { reason = undefined; }
            if (!IsReadableStream(this)) {
                return promiseRejectedWith(streamBrandCheckException$1('cancel'));
            }
            if (IsReadableStreamLocked(this)) {
                return promiseRejectedWith(new TypeError('Cannot cancel a stream that already has a reader'));
            }
            return ReadableStreamCancel(this, reason);
        };
        ReadableStream.prototype.getReader = function (rawOptions) {
            if (rawOptions === void 0) { rawOptions = undefined; }
            if (!IsReadableStream(this)) {
                throw streamBrandCheckException$1('getReader');
            }
            var options = convertReaderOptions(rawOptions, 'First parameter');
            if (options.mode === undefined) {
                return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
        };
        ReadableStream.prototype.pipeThrough = function (rawTransform, rawOptions) {
            if (rawOptions === void 0) { rawOptions = {}; }
            if (!IsReadableStream(this)) {
                throw streamBrandCheckException$1('pipeThrough');
            }
            assertRequiredArgument(rawTransform, 1, 'pipeThrough');
            var transform = convertReadableWritablePair(rawTransform, 'First parameter');
            var options = convertPipeOptions(rawOptions, 'Second parameter');
            if (IsReadableStreamLocked(this)) {
                throw new TypeError('ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream');
            }
            if (IsWritableStreamLocked(transform.writable)) {
                throw new TypeError('ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream');
            }
            var promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
        };
        ReadableStream.prototype.pipeTo = function (destination, rawOptions) {
            if (rawOptions === void 0) { rawOptions = {}; }
            if (!IsReadableStream(this)) {
                return promiseRejectedWith(streamBrandCheckException$1('pipeTo'));
            }
            if (destination === undefined) {
                return promiseRejectedWith("Parameter 1 is required in 'pipeTo'.");
            }
            if (!IsWritableStream(destination)) {
                return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
            }
            var options;
            try {
                options = convertPipeOptions(rawOptions, 'Second parameter');
            }
            catch (e) {
                return promiseRejectedWith(e);
            }
            if (IsReadableStreamLocked(this)) {
                return promiseRejectedWith(new TypeError('ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream'));
            }
            if (IsWritableStreamLocked(destination)) {
                return promiseRejectedWith(new TypeError('ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream'));
            }
            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
        };
        /**
         * Tees this readable stream, returning a two-element array containing the two resulting branches as
         * new {@link ReadableStream} instances.
         *
         * Teeing a stream will lock it, preventing any other consumer from acquiring a reader.
         * To cancel the stream, cancel both of the resulting branches; a composite cancellation reason will then be
         * propagated to the stream's underlying source.
         *
         * Note that the chunks seen in each branch will be the same object. If the chunks are not immutable,
         * this could allow interference between the two branches.
         */
        ReadableStream.prototype.tee = function () {
            if (!IsReadableStream(this)) {
                throw streamBrandCheckException$1('tee');
            }
            var branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
        };
        ReadableStream.prototype.values = function (rawOptions) {
            if (rawOptions === void 0) { rawOptions = undefined; }
            if (!IsReadableStream(this)) {
                throw streamBrandCheckException$1('values');
            }
            var options = convertIteratorOptions(rawOptions, 'First parameter');
            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
        };
        return ReadableStream;
    }());
    Object.defineProperties(ReadableStream.prototype, {
        cancel: { enumerable: true },
        getReader: { enumerable: true },
        pipeThrough: { enumerable: true },
        pipeTo: { enumerable: true },
        tee: { enumerable: true },
        values: { enumerable: true },
        locked: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(ReadableStream.prototype, SymbolPolyfill.toStringTag, {
            value: 'ReadableStream',
            configurable: true
        });
    }
    if (typeof SymbolPolyfill.asyncIterator === 'symbol') {
        Object.defineProperty(ReadableStream.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream.prototype.values,
            writable: true,
            configurable: true
        });
    }
    // Abstract operations for the ReadableStream.
    // Throws if and only if startAlgorithm throws.
    function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
        if (highWaterMark === void 0) { highWaterMark = 1; }
        if (sizeAlgorithm === void 0) { sizeAlgorithm = function () { return 1; }; }
        var stream = Object.create(ReadableStream.prototype);
        InitializeReadableStream(stream);
        var controller = Object.create(ReadableStreamDefaultController.prototype);
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
    }
    // Throws if and only if startAlgorithm throws.
    function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
        var stream = Object.create(ReadableStream.prototype);
        InitializeReadableStream(stream);
        var controller = Object.create(ReadableByteStreamController.prototype);
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, undefined);
        return stream;
    }
    function InitializeReadableStream(stream) {
        stream._state = 'readable';
        stream._reader = undefined;
        stream._storedError = undefined;
        stream._disturbed = false;
    }
    function IsReadableStream(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_readableStreamController')) {
            return false;
        }
        return x instanceof ReadableStream;
    }
    function IsReadableStreamLocked(stream) {
        if (stream._reader === undefined) {
            return false;
        }
        return true;
    }
    // ReadableStream API exposed for controllers.
    function ReadableStreamCancel(stream, reason) {
        stream._disturbed = true;
        if (stream._state === 'closed') {
            return promiseResolvedWith(undefined);
        }
        if (stream._state === 'errored') {
            return promiseRejectedWith(stream._storedError);
        }
        ReadableStreamClose(stream);
        var reader = stream._reader;
        if (reader !== undefined && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach(function (readIntoRequest) {
                readIntoRequest._closeSteps(undefined);
            });
            reader._readIntoRequests = new SimpleQueue();
        }
        var sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
        return transformPromiseWith(sourceCancelPromise, noop);
    }
    function ReadableStreamClose(stream) {
        stream._state = 'closed';
        var reader = stream._reader;
        if (reader === undefined) {
            return;
        }
        defaultReaderClosedPromiseResolve(reader);
        if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach(function (readRequest) {
                readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
        }
    }
    function ReadableStreamError(stream, e) {
        stream._state = 'errored';
        stream._storedError = e;
        var reader = stream._reader;
        if (reader === undefined) {
            return;
        }
        defaultReaderClosedPromiseReject(reader, e);
        if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach(function (readRequest) {
                readRequest._errorSteps(e);
            });
            reader._readRequests = new SimpleQueue();
        }
        else {
            reader._readIntoRequests.forEach(function (readIntoRequest) {
                readIntoRequest._errorSteps(e);
            });
            reader._readIntoRequests = new SimpleQueue();
        }
    }
    // Helper functions for the ReadableStream.
    function streamBrandCheckException$1(name) {
        return new TypeError("ReadableStream.prototype." + name + " can only be used on a ReadableStream");
    }

    function convertQueuingStrategyInit(init, context) {
        assertDictionary(init, context);
        var highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
        assertRequiredField(highWaterMark, 'highWaterMark', 'QueuingStrategyInit');
        return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
        };
    }

    // The size function must not have a prototype property nor be a constructor
    var byteLengthSizeFunction = function (chunk) {
        return chunk.byteLength;
    };
    Object.defineProperty(byteLengthSizeFunction, 'name', {
        value: 'size',
        configurable: true
    });
    /**
     * A queuing strategy that counts the number of bytes in each chunk.
     *
     * @public
     */
    var ByteLengthQueuingStrategy = /** @class */ (function () {
        function ByteLengthQueuingStrategy(options) {
            assertRequiredArgument(options, 1, 'ByteLengthQueuingStrategy');
            options = convertQueuingStrategyInit(options, 'First parameter');
            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        Object.defineProperty(ByteLengthQueuingStrategy.prototype, "highWaterMark", {
            /**
             * Returns the high water mark provided to the constructor.
             */
            get: function () {
                if (!IsByteLengthQueuingStrategy(this)) {
                    throw byteLengthBrandCheckException('highWaterMark');
                }
                return this._byteLengthQueuingStrategyHighWaterMark;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ByteLengthQueuingStrategy.prototype, "size", {
            /**
             * Measures the size of `chunk` by returning the value of its `byteLength` property.
             */
            get: function () {
                if (!IsByteLengthQueuingStrategy(this)) {
                    throw byteLengthBrandCheckException('size');
                }
                return byteLengthSizeFunction;
            },
            enumerable: false,
            configurable: true
        });
        return ByteLengthQueuingStrategy;
    }());
    Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: 'ByteLengthQueuingStrategy',
            configurable: true
        });
    }
    // Helper functions for the ByteLengthQueuingStrategy.
    function byteLengthBrandCheckException(name) {
        return new TypeError("ByteLengthQueuingStrategy.prototype." + name + " can only be used on a ByteLengthQueuingStrategy");
    }
    function IsByteLengthQueuingStrategy(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_byteLengthQueuingStrategyHighWaterMark')) {
            return false;
        }
        return x instanceof ByteLengthQueuingStrategy;
    }

    // The size function must not have a prototype property nor be a constructor
    var countSizeFunction = function () {
        return 1;
    };
    Object.defineProperty(countSizeFunction, 'name', {
        value: 'size',
        configurable: true
    });
    /**
     * A queuing strategy that counts the number of chunks.
     *
     * @public
     */
    var CountQueuingStrategy = /** @class */ (function () {
        function CountQueuingStrategy(options) {
            assertRequiredArgument(options, 1, 'CountQueuingStrategy');
            options = convertQueuingStrategyInit(options, 'First parameter');
            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        Object.defineProperty(CountQueuingStrategy.prototype, "highWaterMark", {
            /**
             * Returns the high water mark provided to the constructor.
             */
            get: function () {
                if (!IsCountQueuingStrategy(this)) {
                    throw countBrandCheckException('highWaterMark');
                }
                return this._countQueuingStrategyHighWaterMark;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CountQueuingStrategy.prototype, "size", {
            /**
             * Measures the size of `chunk` by always returning 1.
             * This ensures that the total queue size is a count of the number of chunks in the queue.
             */
            get: function () {
                if (!IsCountQueuingStrategy(this)) {
                    throw countBrandCheckException('size');
                }
                return countSizeFunction;
            },
            enumerable: false,
            configurable: true
        });
        return CountQueuingStrategy;
    }());
    Object.defineProperties(CountQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: 'CountQueuingStrategy',
            configurable: true
        });
    }
    // Helper functions for the CountQueuingStrategy.
    function countBrandCheckException(name) {
        return new TypeError("CountQueuingStrategy.prototype." + name + " can only be used on a CountQueuingStrategy");
    }
    function IsCountQueuingStrategy(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_countQueuingStrategyHighWaterMark')) {
            return false;
        }
        return x instanceof CountQueuingStrategy;
    }

    function convertTransformer(original, context) {
        assertDictionary(original, context);
        var flush = original === null || original === void 0 ? void 0 : original.flush;
        var readableType = original === null || original === void 0 ? void 0 : original.readableType;
        var start = original === null || original === void 0 ? void 0 : original.start;
        var transform = original === null || original === void 0 ? void 0 : original.transform;
        var writableType = original === null || original === void 0 ? void 0 : original.writableType;
        return {
            flush: flush === undefined ?
                undefined :
                convertTransformerFlushCallback(flush, original, context + " has member 'flush' that"),
            readableType: readableType,
            start: start === undefined ?
                undefined :
                convertTransformerStartCallback(start, original, context + " has member 'start' that"),
            transform: transform === undefined ?
                undefined :
                convertTransformerTransformCallback(transform, original, context + " has member 'transform' that"),
            writableType: writableType
        };
    }
    function convertTransformerFlushCallback(fn, original, context) {
        assertFunction(fn, context);
        return function (controller) { return promiseCall(fn, original, [controller]); };
    }
    function convertTransformerStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return function (controller) { return reflectCall(fn, original, [controller]); };
    }
    function convertTransformerTransformCallback(fn, original, context) {
        assertFunction(fn, context);
        return function (chunk, controller) { return promiseCall(fn, original, [chunk, controller]); };
    }

    // Class TransformStream
    /**
     * A transform stream consists of a pair of streams: a {@link WritableStream | writable stream},
     * known as its writable side, and a {@link ReadableStream | readable stream}, known as its readable side.
     * In a manner specific to the transform stream in question, writes to the writable side result in new data being
     * made available for reading from the readable side.
     *
     * @public
     */
    var TransformStream = /** @class */ (function () {
        function TransformStream(rawTransformer, rawWritableStrategy, rawReadableStrategy) {
            if (rawTransformer === void 0) { rawTransformer = {}; }
            if (rawWritableStrategy === void 0) { rawWritableStrategy = {}; }
            if (rawReadableStrategy === void 0) { rawReadableStrategy = {}; }
            if (rawTransformer === undefined) {
                rawTransformer = null;
            }
            var writableStrategy = convertQueuingStrategy(rawWritableStrategy, 'Second parameter');
            var readableStrategy = convertQueuingStrategy(rawReadableStrategy, 'Third parameter');
            var transformer = convertTransformer(rawTransformer, 'First parameter');
            if (transformer.readableType !== undefined) {
                throw new RangeError('Invalid readableType specified');
            }
            if (transformer.writableType !== undefined) {
                throw new RangeError('Invalid writableType specified');
            }
            var readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            var readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            var writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            var writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            var startPromise_resolve;
            var startPromise = newPromise(function (resolve) {
                startPromise_resolve = resolve;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== undefined) {
                startPromise_resolve(transformer.start(this._transformStreamController));
            }
            else {
                startPromise_resolve(undefined);
            }
        }
        Object.defineProperty(TransformStream.prototype, "readable", {
            /**
             * The readable side of the transform stream.
             */
            get: function () {
                if (!IsTransformStream(this)) {
                    throw streamBrandCheckException('readable');
                }
                return this._readable;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TransformStream.prototype, "writable", {
            /**
             * The writable side of the transform stream.
             */
            get: function () {
                if (!IsTransformStream(this)) {
                    throw streamBrandCheckException('writable');
                }
                return this._writable;
            },
            enumerable: false,
            configurable: true
        });
        return TransformStream;
    }());
    Object.defineProperties(TransformStream.prototype, {
        readable: { enumerable: true },
        writable: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: 'TransformStream',
            configurable: true
        });
    }
    function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
        function startAlgorithm() {
            return startPromise;
        }
        function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
        }
        function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
        }
        function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
        }
        stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
        function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
        }
        function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(undefined);
        }
        stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
        // The [[backpressure]] slot is set to undefined so that it can be initialised by TransformStreamSetBackpressure.
        stream._backpressure = undefined;
        stream._backpressureChangePromise = undefined;
        stream._backpressureChangePromise_resolve = undefined;
        TransformStreamSetBackpressure(stream, true);
        stream._transformStreamController = undefined;
    }
    function IsTransformStream(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_transformStreamController')) {
            return false;
        }
        return x instanceof TransformStream;
    }
    // This is a no-op if both sides are already errored.
    function TransformStreamError(stream, e) {
        ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e);
        TransformStreamErrorWritableAndUnblockWrite(stream, e);
    }
    function TransformStreamErrorWritableAndUnblockWrite(stream, e) {
        TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
        WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e);
        if (stream._backpressure) {
            // Pretend that pull() was called to permit any pending write() calls to complete. TransformStreamSetBackpressure()
            // cannot be called from enqueue() or pull() once the ReadableStream is errored, so this will will be the final time
            // _backpressure is set.
            TransformStreamSetBackpressure(stream, false);
        }
    }
    function TransformStreamSetBackpressure(stream, backpressure) {
        // Passes also when called during construction.
        if (stream._backpressureChangePromise !== undefined) {
            stream._backpressureChangePromise_resolve();
        }
        stream._backpressureChangePromise = newPromise(function (resolve) {
            stream._backpressureChangePromise_resolve = resolve;
        });
        stream._backpressure = backpressure;
    }
    // Class TransformStreamDefaultController
    /**
     * Allows control of the {@link ReadableStream} and {@link WritableStream} of the associated {@link TransformStream}.
     *
     * @public
     */
    var TransformStreamDefaultController = /** @class */ (function () {
        function TransformStreamDefaultController() {
            throw new TypeError('Illegal constructor');
        }
        Object.defineProperty(TransformStreamDefaultController.prototype, "desiredSize", {
            /**
             * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
             */
            get: function () {
                if (!IsTransformStreamDefaultController(this)) {
                    throw defaultControllerBrandCheckException('desiredSize');
                }
                var readableController = this._controlledTransformStream._readable._readableStreamController;
                return ReadableStreamDefaultControllerGetDesiredSize(readableController);
            },
            enumerable: false,
            configurable: true
        });
        TransformStreamDefaultController.prototype.enqueue = function (chunk) {
            if (chunk === void 0) { chunk = undefined; }
            if (!IsTransformStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException('enqueue');
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
        };
        /**
         * Errors both the readable side and the writable side of the controlled transform stream, making all future
         * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
         */
        TransformStreamDefaultController.prototype.error = function (reason) {
            if (reason === void 0) { reason = undefined; }
            if (!IsTransformStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException('error');
            }
            TransformStreamDefaultControllerError(this, reason);
        };
        /**
         * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
         * transformer only needs to consume a portion of the chunks written to the writable side.
         */
        TransformStreamDefaultController.prototype.terminate = function () {
            if (!IsTransformStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException('terminate');
            }
            TransformStreamDefaultControllerTerminate(this);
        };
        return TransformStreamDefaultController;
    }());
    Object.defineProperties(TransformStreamDefaultController.prototype, {
        enqueue: { enumerable: true },
        error: { enumerable: true },
        terminate: { enumerable: true },
        desiredSize: { enumerable: true }
    });
    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
        Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: 'TransformStreamDefaultController',
            configurable: true
        });
    }
    // Transform Stream Default Controller Abstract Operations
    function IsTransformStreamDefaultController(x) {
        if (!typeIsObject(x)) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x, '_controlledTransformStream')) {
            return false;
        }
        return x instanceof TransformStreamDefaultController;
    }
    function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
        controller._controlledTransformStream = stream;
        stream._transformStreamController = controller;
        controller._transformAlgorithm = transformAlgorithm;
        controller._flushAlgorithm = flushAlgorithm;
    }
    function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
        var controller = Object.create(TransformStreamDefaultController.prototype);
        var transformAlgorithm = function (chunk) {
            try {
                TransformStreamDefaultControllerEnqueue(controller, chunk);
                return promiseResolvedWith(undefined);
            }
            catch (transformResultE) {
                return promiseRejectedWith(transformResultE);
            }
        };
        var flushAlgorithm = function () { return promiseResolvedWith(undefined); };
        if (transformer.transform !== undefined) {
            transformAlgorithm = function (chunk) { return transformer.transform(chunk, controller); };
        }
        if (transformer.flush !== undefined) {
            flushAlgorithm = function () { return transformer.flush(controller); };
        }
        SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
    }
    function TransformStreamDefaultControllerClearAlgorithms(controller) {
        controller._transformAlgorithm = undefined;
        controller._flushAlgorithm = undefined;
    }
    function TransformStreamDefaultControllerEnqueue(controller, chunk) {
        var stream = controller._controlledTransformStream;
        var readableController = stream._readable._readableStreamController;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError('Readable side is not in a state that permits enqueue');
        }
        // We throttle transform invocations based on the backpressure of the ReadableStream, but we still
        // accept TransformStreamDefaultControllerEnqueue() calls.
        try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
        }
        catch (e) {
            // This happens when readableStrategy.size() throws.
            TransformStreamErrorWritableAndUnblockWrite(stream, e);
            throw stream._readable._storedError;
        }
        var backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
        if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
        }
    }
    function TransformStreamDefaultControllerError(controller, e) {
        TransformStreamError(controller._controlledTransformStream, e);
    }
    function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
        var transformPromise = controller._transformAlgorithm(chunk);
        return transformPromiseWith(transformPromise, undefined, function (r) {
            TransformStreamError(controller._controlledTransformStream, r);
            throw r;
        });
    }
    function TransformStreamDefaultControllerTerminate(controller) {
        var stream = controller._controlledTransformStream;
        var readableController = stream._readable._readableStreamController;
        ReadableStreamDefaultControllerClose(readableController);
        var error = new TypeError('TransformStream terminated');
        TransformStreamErrorWritableAndUnblockWrite(stream, error);
    }
    // TransformStreamDefaultSink Algorithms
    function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
        var controller = stream._transformStreamController;
        if (stream._backpressure) {
            var backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, function () {
                var writable = stream._writable;
                var state = writable._state;
                if (state === 'erroring') {
                    throw writable._storedError;
                }
                return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
        }
        return TransformStreamDefaultControllerPerformTransform(controller, chunk);
    }
    function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
        // abort() is not called synchronously, so it is possible for abort() to be called when the stream is already
        // errored.
        TransformStreamError(stream, reason);
        return promiseResolvedWith(undefined);
    }
    function TransformStreamDefaultSinkCloseAlgorithm(stream) {
        // stream._readable cannot change after construction, so caching it across a call to user code is safe.
        var readable = stream._readable;
        var controller = stream._transformStreamController;
        var flushPromise = controller._flushAlgorithm();
        TransformStreamDefaultControllerClearAlgorithms(controller);
        // Return a promise that is fulfilled with undefined on success.
        return transformPromiseWith(flushPromise, function () {
            if (readable._state === 'errored') {
                throw readable._storedError;
            }
            ReadableStreamDefaultControllerClose(readable._readableStreamController);
        }, function (r) {
            TransformStreamError(stream, r);
            throw readable._storedError;
        });
    }
    // TransformStreamDefaultSource Algorithms
    function TransformStreamDefaultSourcePullAlgorithm(stream) {
        // Invariant. Enforced by the promises returned by start() and pull().
        TransformStreamSetBackpressure(stream, false);
        // Prevent the next pull() call until there is backpressure.
        return stream._backpressureChangePromise;
    }
    // Helper functions for the TransformStreamDefaultController.
    function defaultControllerBrandCheckException(name) {
        return new TypeError("TransformStreamDefaultController.prototype." + name + " can only be used on a TransformStreamDefaultController");
    }
    // Helper functions for the TransformStream.
    function streamBrandCheckException(name) {
        return new TypeError("TransformStream.prototype." + name + " can only be used on a TransformStream");
    }

    exports.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
    exports.CountQueuingStrategy = CountQueuingStrategy;
    exports.ReadableByteStreamController = ReadableByteStreamController;
    exports.ReadableStream = ReadableStream;
    exports.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
    exports.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
    exports.ReadableStreamDefaultController = ReadableStreamDefaultController;
    exports.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
    exports.TransformStream = TransformStream;
    exports.TransformStreamDefaultController = TransformStreamDefaultController;
    exports.WritableStream = WritableStream;
    exports.WritableStreamDefaultController = WritableStreamDefaultController;
    exports.WritableStreamDefaultWriter = WritableStreamDefaultWriter;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ponyfill.js.map

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
_$ponyfill_3 = _$ponyfill_3.exports
var _$stream_17 = {};
"use strict";
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
var ____awaiter_17 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_17 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$stream_17, "__esModule", { value: true });
_$stream_17.ezStreamFrom = _$stream_17.EZStream = _$stream_17.WSPReadableStream = void 0;
/* removed: var _$ponyfill_3 = require("web-streams-polyfill/ponyfill"); */;
// Force WSP's ReadableStream type to overlap
_$stream_17.WSPReadableStream = _$ponyfill_3.ReadableStream;
/**
 * A ReadableStream paired with the ability to push back data.
 */
var EZStream = /** @class */ (function () {
    /**
     * Create an EZStream.
     * @param readableStream  The underlying ReadableStream.
     */
    function EZStream(readableStream) {
        this.readableStream = readableStream;
        this.buf = [];
        if (readableStream) {
            this.reader = readableStream.getReader();
            this.done = false;
        }
        else {
            this.reader = null;
            this.done = true;
        }
    }
    /**
     * Read an element. Returns null if the stream has ended.
     */
    EZStream.prototype.read = function () {
        return ____awaiter_17(this, void 0, void 0, function () {
            var chunk;
            return ____generator_17(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.buf.length)
                            return [2 /*return*/, this.buf.pop()];
                        if (this.done)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.reader.read()];
                    case 1:
                        chunk = _a.sent();
                        if (chunk.done) {
                            this.done = true;
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, chunk.value];
                }
            });
        });
    };
    /**
     * Cancel the stream.
     */
    EZStream.prototype.cancel = function () {
        this.readableStream.cancel();
    };
    /**
     * Push this chunk back. It will be returned eagerly by the next read.
     */
    EZStream.prototype.push = function (chunk) {
        this.buf.push(chunk);
    };
    /**
     * Is this stream finished?
     */
    EZStream.prototype.isDone = function () {
        if (this.buf.length)
            return false;
        return this.done;
    };
    return EZStream;
}());
_$stream_17.EZStream = EZStream;
// Create an EZStream from a single item
function ezStreamFrom(x) {
    var ret = new EZStream(null);
    ret.push(x);
    return ret;
}
_$stream_17.ezStreamFrom = ezStreamFrom;

var _$audioData_4 = {};
"use strict";
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
var ____awaiter_4 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_4 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$audioData_4, "__esModule", { value: true });
_$audioData_4.AudioData = _$audioData_4.AudioTrack = _$audioData_4.resample = _$audioData_4.sanitizeLibAVFrame = _$audioData_4.toChannelLayout = _$audioData_4.fromPlanar = _$audioData_4.toPlanar = _$audioData_4.LibAVSampleFormat = void 0;
/* removed: var _$avthreads_6 = require("./avthreads"); */;
/* removed: var _$id36_10 = require("./id36"); */;
/* removed: var _$select_14 = require("./select"); */;
/* removed: var _$track_18 = require("./track"); */;
/* removed: var _$stream_17 = require("./stream"); */;
/* removed: var _$ui_20 = require("./ui"); */;
/**
 * libav's sample formats.
 */
var LibAVSampleFormat;
(function (LibAVSampleFormat) {
    LibAVSampleFormat[LibAVSampleFormat["U8"] = 0] = "U8";
    LibAVSampleFormat[LibAVSampleFormat["S16"] = 1] = "S16";
    LibAVSampleFormat[LibAVSampleFormat["S32"] = 2] = "S32";
    LibAVSampleFormat[LibAVSampleFormat["FLT"] = 3] = "FLT";
    LibAVSampleFormat[LibAVSampleFormat["DBL"] = 4] = "DBL";
    LibAVSampleFormat[LibAVSampleFormat["U8P"] = 5] = "U8P";
    LibAVSampleFormat[LibAVSampleFormat["S16P"] = 6] = "S16P";
    LibAVSampleFormat[LibAVSampleFormat["S32P"] = 7] = "S32P";
    LibAVSampleFormat[LibAVSampleFormat["FLTP"] = 8] = "FLTP";
    LibAVSampleFormat[LibAVSampleFormat["DBLP"] = 9] = "DBLP";
    LibAVSampleFormat[LibAVSampleFormat["S64"] = 10] = "S64";
    LibAVSampleFormat[LibAVSampleFormat["S64P"] = 11] = "S64P";
})(LibAVSampleFormat = _$audioData_4.LibAVSampleFormat || (_$audioData_4.LibAVSampleFormat = {}));
var log2 = Math.log(2);
/**
 * Convert a (libav) format to its planar equivalent.
 * @param format  The input format, which may or may not be planar.
 */
function toPlanar(format) {
    switch (format) {
        case LibAVSampleFormat.U8:
        case LibAVSampleFormat.U8P:
            return LibAVSampleFormat.U8P;
        case LibAVSampleFormat.S16:
        case LibAVSampleFormat.S16P:
            return LibAVSampleFormat.S16P;
        case LibAVSampleFormat.S32:
        case LibAVSampleFormat.S32P:
            return LibAVSampleFormat.S32P;
        case LibAVSampleFormat.FLT:
        case LibAVSampleFormat.FLTP:
            return LibAVSampleFormat.FLTP;
        case LibAVSampleFormat.DBL:
        case LibAVSampleFormat.DBLP:
            return LibAVSampleFormat.DBLP;
        default:
            throw new Error("Unsupported format (to planar) " + format);
    }
}
_$audioData_4.toPlanar = toPlanar;
/**
 * Convert a (libav) format to its non-planar equivalent.
 * @param format  The input format, which may or may not be planar.
 */
function fromPlanar(format) {
    switch (format) {
        case LibAVSampleFormat.U8:
        case LibAVSampleFormat.U8P:
            return LibAVSampleFormat.U8;
        case LibAVSampleFormat.S16:
        case LibAVSampleFormat.S16P:
            return LibAVSampleFormat.S16;
        case LibAVSampleFormat.S32:
        case LibAVSampleFormat.S32P:
            return LibAVSampleFormat.S32;
        case LibAVSampleFormat.FLT:
        case LibAVSampleFormat.FLTP:
            return LibAVSampleFormat.FLT;
        case LibAVSampleFormat.DBL:
        case LibAVSampleFormat.DBLP:
            return LibAVSampleFormat.DBL;
        default:
            throw new Error("Unsupported format (to planar) " + format);
    }
}
_$audioData_4.fromPlanar = fromPlanar;
/**
 * Convert a number of channels to a channel layout.
 */
function toChannelLayout(channels) {
    if (channels === 1)
        return 4;
    else
        return (1 << channels) - 1;
}
_$audioData_4.toChannelLayout = toChannelLayout;
/**
 * Sanitize this libav.js frame, by setting any missing fields.
 */
function sanitizeLibAVFrame(frame) {
    if (typeof frame.channels !== "number") {
        if (typeof frame.channel_layout !== "number") {
            // BAD! One should be set!
            frame.channels = 1;
        }
        else {
            var l = frame.channel_layout;
            var c = 0;
            while (l) {
                if (l & 1)
                    c++;
                l >>>= 1;
            }
            frame.channels = c;
        }
    }
    if (typeof frame.channel_layout !== "number")
        frame.channel_layout = toChannelLayout(frame.channels);
    if (typeof frame.nb_samples !== "number")
        frame.nb_samples = ~~(frame.data.length / frame.channels);
}
_$audioData_4.sanitizeLibAVFrame = sanitizeLibAVFrame;
/**
 * Convert this LibAVFrame stream to the desired sample rate, format, and
 * channel count.
 * @param stream  Input LibAVFrame stream.
 * @param sampleRate  Desired sample rate.
 * @param format  Desired sample format.
 * @param channels  Desired channel count.
 * @param fs  Optional filter string to perform while resampling.
 */
function resample(stream, sampleRate, format, channels, fs) {
    if (fs === void 0) { fs = "anull"; }
    return ____awaiter_4(this, void 0, void 0, function () {
        var first, libav, frame, _a, buffersrc_ctx, buffersink_ctx;
        return ____generator_4(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, stream.read()];
                case 1:
                    first = _b.sent();
                    if (!first) {
                        // No need to filter nothing!
                        return [2 /*return*/, new _$stream_17.WSPReadableStream({
                                start: function (controller) {
                                    controller.close();
                                }
                            })];
                    }
                    stream.push(first);
                    // Do we need to filter?
                    sanitizeLibAVFrame(first);
                    if (first.sample_rate === sampleRate &&
                        first.format === format &&
                        first.channels === channels) {
                        // Nope, already good!
                        return [2 /*return*/, new _$stream_17.WSPReadableStream({
                                pull: function (controller) {
                                    return ____awaiter_4(this, void 0, void 0, function () {
                                        var chunk;
                                        return ____generator_4(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, stream.read()];
                                                case 1:
                                                    chunk = _a.sent();
                                                    if (chunk)
                                                        controller.enqueue(chunk);
                                                    else
                                                        controller.close();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    });
                                }
                            })];
                    }
                    return [4 /*yield*/, LibAV.LibAV()];
                case 2:
                    libav = _b.sent();
                    return [4 /*yield*/, libav.av_frame_alloc()];
                case 3:
                    frame = _b.sent();
                    return [4 /*yield*/, libav.ff_init_filter_graph(fs, {
                            sample_rate: first.sample_rate,
                            sample_fmt: first.format,
                            channel_layout: first.channel_layout
                        }, {
                            sample_rate: sampleRate,
                            sample_fmt: format,
                            channel_layout: toChannelLayout(channels)
                        })];
                case 4:
                    _a = _b.sent(), buffersrc_ctx = _a[1], buffersink_ctx = _a[2];
                    // And the stream
                    return [2 /*return*/, new _$stream_17.WSPReadableStream({
                            pull: function (controller) {
                                return ____awaiter_4(this, void 0, void 0, function () {
                                    var chunk, fframes, _i, fframes_1, frame_1;
                                    return ____generator_4(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!true) return [3 /*break*/, 3];
                                                return [4 /*yield*/, stream.read()];
                                            case 1:
                                                chunk = _a.sent();
                                                if (chunk)
                                                    chunk.node = null;
                                                return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, chunk ? [chunk] : [], !chunk)];
                                            case 2:
                                                fframes = _a.sent();
                                                for (_i = 0, fframes_1 = fframes; _i < fframes_1.length; _i++) {
                                                    frame_1 = fframes_1[_i];
                                                    controller.enqueue(frame_1);
                                                }
                                                if (!chunk) {
                                                    controller.close();
                                                    libav.terminate();
                                                }
                                                if (!chunk || fframes.length)
                                                    return [3 /*break*/, 3];
                                                return [3 /*break*/, 0];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                });
                            },
                            cancel: function () {
                                libav.terminate();
                            }
                        })];
            }
        });
    });
}
_$audioData_4.resample = resample;
/**
 * An audio track. Audio data is stored in a tree of AudioData nodes. The
 * AudioTrack itself holds information such as the format (in libav format
 * codes), sample rate, and number of channels. AudioTracks are stored as
 * audio-track-id.
 */
var AudioTrack = /** @class */ (function () {
    /**
     * Make an AudioTrack.
     * @param id  ID for this track. Must be unique in the store.
     * @param project  Project for this track. Note that the track is not
     *                 automatically added to the project's track list; this
     *                 parameter is just to know the store.
     * @param opts  Other options.
     */
    function AudioTrack(id, project, opts) {
        if (opts === void 0) { opts = {}; }
        this.id = id;
        this.project = project;
        // Main properties
        this.root = null;
        this.name = opts.name || "";
        this.format = opts.format || 4; // DBL
        this.sampleRate = opts.sampleRate || 48000;
        this.channels = opts.channels || 1;
        // UI
        this.spacer = _$ui_20.mk("div", _$ui_20.ui.main, { className: "track-spacer" });
        this.info = _$ui_20.mk("div", _$ui_20.ui.main, { className: "track-info" });
        this.display = _$ui_20.mk("div", _$ui_20.ui.main, { className: "track-display" });
        this.waveform = _$ui_20.mk("div", this.display, { className: "track-waveform" });
        _$select_14.addSelectable({
            track: this,
            wrapper: this.display,
            duration: this.duration.bind(this)
        });
    }
    /**
     * AudioTracks are track type Audio.
     */
    AudioTrack.prototype.type = function () { return _$track_18.TrackType.Audio; };
    /**
     * Save this track to the store.
     * @param opts  Other options, in particular whether to perform a deep save
     *              (save all AudioDatas too).
     */
    AudioTrack.prototype.save = function (opts) {
        if (opts === void 0) { opts = {}; }
        return ____awaiter_4(this, void 0, void 0, function () {
            var t, d, _i, d_1, el, _a, d_2, el;
            return ____generator_4(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        t = {
                            name: this.name,
                            format: this.format,
                            sampleRate: this.sampleRate,
                            channels: this.channels,
                            data: []
                        };
                        d = [];
                        if (this.root)
                            this.root.fillArray(d);
                        // Fill in the data
                        for (_i = 0, d_1 = d; _i < d_1.length; _i++) {
                            el = d_1[_i];
                            t.data.push(el.id);
                        }
                        // Save the track itself
                        return [4 /*yield*/, this.project.store.setItem("audio-track-" + this.id, t)];
                    case 1:
                        // Save the track itself
                        _b.sent();
                        if (!opts.deep) return [3 /*break*/, 5];
                        _a = 0, d_2 = d;
                        _b.label = 2;
                    case 2:
                        if (!(_a < d_2.length)) return [3 /*break*/, 5];
                        el = d_2[_a];
                        return [4 /*yield*/, el.save()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _a++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load this track from the store.
     */
    AudioTrack.prototype.load = function () {
        return ____awaiter_4(this, void 0, void 0, function () {
            var t, d, _i, _a, dataId, part;
            return ____generator_4(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.project.store.getItem("audio-track-" + this.id)];
                    case 1:
                        t = _b.sent();
                        if (!t)
                            return [2 /*return*/];
                        this.name = t.name || "";
                        this.format = t.format;
                        this.sampleRate = t.sampleRate;
                        this.channels = t.channels;
                        d = [];
                        _i = 0, _a = t.data;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        dataId = _a[_i];
                        part = new AudioData(dataId, this);
                        return [4 /*yield*/, part.load()];
                    case 3:
                        _b.sent();
                        d.push(part);
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        // Then make them a tree
                        this.root = AudioData.balanceArray(d);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete this track.
     */
    AudioTrack.prototype.del = function () {
        return ____awaiter_4(this, void 0, void 0, function () {
            var d, _i, d_3, ad;
            return ____generator_4(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        d = [];
                        if (this.root)
                            this.root.fillArray(d);
                        _i = 0, d_3 = d;
                        _a.label = 1;
                    case 1:
                        if (!(_i < d_3.length)) return [3 /*break*/, 4];
                        ad = d_3[_i];
                        return [4 /*yield*/, ad.del()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: 
                    // Then delete this
                    return [4 /*yield*/, this.project.store.removeItem("audio-track-" + this.id)];
                    case 5:
                        // Then delete this
                        _a.sent();
                        // Remove it from the DOM
                        try {
                            this.spacer.parentNode.removeChild(this.spacer);
                            this.info.parentNode.removeChild(this.info);
                            this.display.parentNode.removeChild(this.display);
                        }
                        catch (ex) { }
                        // Remove it as a selectable
                        _$select_14.removeSelectable(this);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Append data from a stream of raw data. The chunks must be LibAVFrames.
     * If they don't have the correct format, sample rate, or channel count,
     * they will be filtered, but this is only applied after the first has
     * arrived, so the caller can change the track properties before then.
     * @param rstream  The stream to read from.
     */
    AudioTrack.prototype.append = function (rstream) {
        return ____awaiter_4(this, void 0, void 0, function () {
            var store, first, stream, _a, cur, raw, chunk, _b, _c, _d, _e, remaining;
            return ____generator_4(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        store = this.project.store;
                        return [4 /*yield*/, rstream.read()];
                    case 1:
                        first = _f.sent();
                        if (first)
                            rstream.push(first);
                        _a = _$stream_17.EZStream.bind;
                        return [4 /*yield*/, resample(rstream, this.sampleRate, this.format, this.channels)];
                    case 2:
                        stream = new (_a.apply(_$stream_17.EZStream, [void 0, _f.sent()]))();
                        cur = null;
                        _f.label = 3;
                    case 3: return [4 /*yield*/, stream.read()];
                    case 4:
                        if (!((chunk = _f.sent()) !== null)) return [3 /*break*/, 15];
                        if (!!cur) return [3 /*break*/, 11];
                        if (!!this.root) return [3 /*break*/, 6];
                        _b = this;
                        _c = AudioData.bind;
                        return [4 /*yield*/, _$id36_10.genFresh(store, "audio-data-")];
                    case 5:
                        // As the root
                        cur = _b.root = new (_c.apply(AudioData, [void 0, _f.sent(), this]))();
                        return [3 /*break*/, 8];
                    case 6:
                        // As the rightmost child
                        cur = this.root;
                        while (cur.right)
                            cur = cur.right;
                        _d = cur;
                        _e = AudioData.bind;
                        return [4 /*yield*/, _$id36_10.genFresh(store, "audio-data-")];
                    case 7:
                        _d.right = new (_e.apply(AudioData, [void 0, _f.sent(), this]))();
                        cur.right.parent = cur;
                        cur = cur.right;
                        _f.label = 8;
                    case 8: return [4 /*yield*/, cur.initRaw(chunk.data)];
                    case 9:
                        // Allocate space
                        raw = _f.sent();
                        return [4 /*yield*/, cur.save()];
                    case 10:
                        _f.sent();
                        _f.label = 11;
                    case 11:
                        remaining = raw.length - cur.len;
                        if (!(remaining >= chunk.data.length)) return [3 /*break*/, 12];
                        // There's enough space for this chunk in full
                        raw.set(chunk.data, cur.len);
                        cur.len += chunk.data.length;
                        return [3 /*break*/, 14];
                    case 12:
                        // Need to take part of the chunk
                        raw.set(chunk.data.subarray(0, remaining), cur.len);
                        cur.len = raw.length;
                        if (chunk.data.length !== remaining) {
                            chunk.data = chunk.data.subarray(remaining);
                            stream.push(chunk);
                        }
                        return [4 /*yield*/, cur.closeRaw(true)];
                    case 13:
                        _f.sent();
                        cur = null;
                        raw = null;
                        _f.label = 14;
                    case 14: return [3 /*break*/, 3];
                    case 15:
                        if (!cur) return [3 /*break*/, 17];
                        return [4 /*yield*/, cur.closeRaw(true)];
                    case 16:
                        _f.sent();
                        _f.label = 17;
                    case 17:
                        // Rebalance the tree now that we're done
                        if (this.root)
                            this.root = this.root.rebalance();
                        return [4 /*yield*/, this.save()];
                    case 18:
                        _f.sent();
                        return [4 /*yield*/, _$avthreads_6.flush()];
                    case 19:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Append a single chunk of raw data.
     * @param data  The single chunk of data.
     */
    AudioTrack.prototype.appendRaw = function (data) {
        return ____awaiter_4(this, void 0, void 0, function () {
            var stream;
            return ____generator_4(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stream = new _$stream_17.EZStream(new _$stream_17.WSPReadableStream({
                            start: function (controller) {
                                controller.enqueue(data);
                                controller.close();
                            }
                        }));
                        return [4 /*yield*/, this.append(stream)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the duration, in seconds, of this track.
     */
    AudioTrack.prototype.duration = function () {
        if (!this.root)
            return 0;
        return this.sampleCount() / this.channels / this.sampleRate;
    };
    /**
     * Get the number of samples in this track. This is, in essence, the
     * duration in samples times the number of channels.
     */
    AudioTrack.prototype.sampleCount = function () {
        if (!this.root)
            return 0;
        return this.root.subtreeDuration();
    };
    /**
     * Get this data as a ReadableStream. Packets are sent roughly in libav.js
     * format, but with the AudioData node specified in a `node` field.
     * @param opts  Options. In particular, you can set the start and end time
     *              here.
     */
    AudioTrack.prototype.stream = function (opts) {
        if (opts === void 0) { opts = {}; }
        // Calculate times
        var startSec = (typeof opts.start === "number") ? opts.start : 0;
        var endSec = (typeof opts.end === "number") ? opts.end : this.duration() + 2;
        var start = Math.floor(startSec * this.sampleRate) * this.channels;
        var end = Math.ceil(endSec * this.sampleRate) * this.channels;
        var remaining = end - start;
        // Now find the AudioData for this time
        var sd = this.root ? this.root.find(start) : null;
        if (!sd) {
            // No data, just give an empty stream
            return new _$stream_17.WSPReadableStream({
                start: function (controller) {
                    controller.close();
                }
            });
        }
        var cur = sd.node;
        // Buffer the metadata
        var meta = {
            format: this.format,
            sample_rate: this.sampleRate,
            channels: this.channels,
            channel_layout: toChannelLayout(this.channels)
        };
        // Create the stream
        return new _$stream_17.WSPReadableStream({
            start: function (controller) {
                return ____awaiter_4(this, void 0, void 0, function () {
                    var buf;
                    return ____generator_4(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cur.openRaw()];
                            case 1:
                                buf = _a.sent();
                                if (!!opts.keepOpen) return [3 /*break*/, 3];
                                return [4 /*yield*/, cur.closeRaw()];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                // Chop it to the right offset
                                buf = buf.subarray(sd.offset);
                                // Possibly chop it off at the end
                                if (remaining < buf.length)
                                    buf = buf.subarray(0, remaining);
                                // And send it
                                controller.enqueue(Object.assign({
                                    data: buf,
                                    node: cur
                                }, meta));
                                remaining -= buf.length;
                                if (remaining <= 0)
                                    controller.close();
                                return [2 /*return*/];
                        }
                    });
                });
            },
            pull: function (controller) {
                return ____awaiter_4(this, void 0, void 0, function () {
                    var next, buf;
                    return ____generator_4(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                // Move to the next part
                                if (cur.right) {
                                    // Down the right subtree
                                    cur = cur.right;
                                    while (cur.left)
                                        cur = cur.left;
                                }
                                else {
                                    // Have to move up the tree
                                    while (true) {
                                        next = cur.parent;
                                        if (!next) {
                                            controller.close();
                                            return [2 /*return*/];
                                        }
                                        if (next.left === cur) {
                                            // Continue with this node
                                            cur = next;
                                            break;
                                        }
                                        else /* next.right === cur */ {
                                            // Already did this node, so keep going up
                                            cur = next;
                                        }
                                    }
                                }
                                return [4 /*yield*/, cur.openRaw()];
                            case 1:
                                buf = _a.sent();
                                if (!!opts.keepOpen) return [3 /*break*/, 3];
                                return [4 /*yield*/, cur.closeRaw()];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                if (buf.length > remaining)
                                    buf = buf.subarray(0, remaining);
                                controller.enqueue(Object.assign({
                                    data: buf,
                                    node: cur
                                }, meta));
                                // And move on
                                remaining -= buf.length;
                                if (remaining <= 0)
                                    controller.close();
                                return [2 /*return*/];
                        }
                    });
                });
            }
        });
    };
    /**
     * Overwrite a specific range of data from a ReadableStream. The stream
     * must give TypedArray chunks, and must be of the same length as is being
     * overwritten. A stream() with keepOpen and an overwrite() with closeTwice
     * creates an effective filter.
     * @param data  Input data.
     * @param opts  Options. In particular, you can set the start and end time
     *              here.
     */
    AudioTrack.prototype.overwrite = function (data, opts) {
        if (opts === void 0) { opts = {}; }
        return ____awaiter_4(this, void 0, void 0, function () {
            var curOutNode, curOutRaw, curOutPos, curOutRem, curInRaw, curInPos, curInRem, stream, dataRd, outStream, outRd, curOut, curIn, curOut, curIn;
            return ____generator_4(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        curOutNode = null;
                        curOutRaw = null;
                        curOutPos = 0;
                        curOutRem = 0;
                        curInRaw = null;
                        curInPos = 0;
                        curInRem = 0;
                        return [4 /*yield*/, resample(data, this.sampleRate, this.format, this.channels)];
                    case 1:
                        stream = _a.sent();
                        dataRd = stream.getReader();
                        outStream = this.stream({
                            start: opts.start,
                            end: opts.end,
                            keepOpen: true
                        });
                        outRd = outStream.getReader();
                        _a.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 16];
                        if (!!curOutNode) return [3 /*break*/, 4];
                        return [4 /*yield*/, outRd.read()];
                    case 3:
                        curOut = _a.sent();
                        if (curOut.done) {
                            // We read all we could
                            return [3 /*break*/, 16];
                        }
                        curOutNode = curOut.value.node;
                        curOutRaw = curOut.value.data;
                        curOutPos = 0;
                        curOutRem = curOutRaw.length;
                        _a.label = 4;
                    case 4:
                        if (!!curInRaw) return [3 /*break*/, 11];
                        return [4 /*yield*/, dataRd.read()];
                    case 5:
                        curIn = _a.sent();
                        if (!curIn.done) return [3 /*break*/, 10];
                        if (!curOutNode) return [3 /*break*/, 9];
                        return [4 /*yield*/, curOutNode.closeRaw(true)];
                    case 6:
                        _a.sent();
                        if (!opts.closeTwice) return [3 /*break*/, 8];
                        return [4 /*yield*/, curOutNode.closeRaw()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        curOutNode = curOutRaw = null;
                        _a.label = 9;
                    case 9: return [3 /*break*/, 16];
                    case 10:
                        curInRaw = curIn.value.data;
                        curInPos = 0;
                        curInRem = curInRaw.length;
                        _a.label = 11;
                    case 11:
                        // Now we can transfer some data
                        if (curInRem >= curOutRem) {
                            // Finish an out buffer
                            curOutRaw.set(curInRaw.subarray(curInPos, curInPos + curOutRem), curOutPos);
                            curInPos += curOutRem;
                            curInRem -= curOutRem;
                            curOutRem = 0;
                        }
                        else {
                            // Finish an in buffer
                            curOutRaw.set(curInRaw.subarray(curInPos), curOutPos);
                            curOutPos += curInRem;
                            curOutRem -= curInRem;
                            curInRem = 0;
                        }
                        // Close our input
                        if (curInRem === 0)
                            curInRaw = null;
                        if (!(curOutRem === 0)) return [3 /*break*/, 15];
                        return [4 /*yield*/, curOutNode.closeRaw(true)];
                    case 12:
                        _a.sent();
                        if (!opts.closeTwice) return [3 /*break*/, 14];
                        return [4 /*yield*/, curOutNode.closeRaw()];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        curOutNode = null;
                        _a.label = 15;
                    case 15: return [3 /*break*/, 2];
                    case 16:
                        if (!true) return [3 /*break*/, 21];
                        return [4 /*yield*/, outRd.read()];
                    case 17:
                        curOut = _a.sent();
                        if (curOut.done)
                            return [3 /*break*/, 21];
                        curOutNode = curOut.value.node;
                        return [4 /*yield*/, curOutNode.closeRaw()];
                    case 18:
                        _a.sent();
                        if (!opts.closeTwice) return [3 /*break*/, 20];
                        return [4 /*yield*/, curOutNode.closeRaw()];
                    case 19:
                        _a.sent();
                        _a.label = 20;
                    case 20: return [3 /*break*/, 16];
                    case 21:
                        if (!true) return [3 /*break*/, 23];
                        return [4 /*yield*/, dataRd.read()];
                    case 22:
                        curIn = _a.sent();
                        if (curIn.done)
                            return [3 /*break*/, 23];
                        return [3 /*break*/, 21];
                    case 23: return [4 /*yield*/, this.save()];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, _$avthreads_6.flush()];
                    case 25:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Replace a segment of audio data with the audio data from another track.
     * The other track will be deleted. Can clip (by not giving a replacement)
     * or insert (by replacing no time) as well.
     * @param start  Start time, in seconds.
     * @param end  End time, in seconds.
     * @param replacement  Track containing replacement data, which must be in
     *                     the same format, sample rate, number of tracks.
     */
    AudioTrack.prototype.replace = function (start, end, replacement) {
        return ____awaiter_4(this, void 0, void 0, function () {
            var _a, _b, startLoc, startNode_1, startNode, startRaw, splitNext, _c, splitNextRaw, remaining, cur, next, raw, newData, _i, newData_1, next, nnext, d, i, el;
            return ____generator_4(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!!this.root) return [3 /*break*/, 2];
                        _a = this;
                        _b = AudioData.bind;
                        return [4 /*yield*/, _$id36_10.genFresh(this.project.store, "audio-data-")];
                    case 1:
                        _a.root = new (_b.apply(AudioData, [void 0, _d.sent(), this]))();
                        this.root.initRaw(new Uint8Array(0)); /* Type doesn't matter since
                                                               * this data is being
                                                               * discarded */
                        _d.label = 2;
                    case 2:
                        // Convert times into track units
                        start = Math.floor(start * this.sampleRate) * this.channels;
                        end = Math.ceil(end * this.sampleRate) * this.channels;
                        startLoc = this.root.find(start);
                        if (!startLoc) {
                            startNode_1 = this.root;
                            while (startNode_1.right)
                                startNode_1 = startNode_1.right;
                            startLoc = { offset: startNode_1.len, node: startNode_1 };
                        }
                        startNode = startLoc.node;
                        return [4 /*yield*/, startNode.openRaw()];
                    case 3:
                        startRaw = _d.sent();
                        _c = AudioData.bind;
                        return [4 /*yield*/, _$id36_10.genFresh(this.project.store, "audio-data-")];
                    case 4:
                        splitNext = new (_c.apply(AudioData, [void 0, _d.sent(), this, { insertAfter: startNode }]))();
                        return [4 /*yield*/, splitNext.initRaw(startRaw)];
                    case 5:
                        splitNextRaw = _d.sent();
                        splitNextRaw.set(startRaw.subarray(startLoc.offset, startNode.len));
                        splitNext.len = startNode.len - startLoc.offset;
                        startNode.len = startLoc.offset;
                        return [4 /*yield*/, splitNext.closeRaw(true)];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, startNode.closeRaw(true)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, _$avthreads_6.flush()];
                    case 8:
                        _d.sent();
                        splitNext.right = startNode.right;
                        if (splitNext.right)
                            splitNext.right.parent = splitNext;
                        startNode.right = splitNext;
                        splitNext.parent = startNode;
                        remaining = end - start;
                        cur = startLoc.node;
                        _d.label = 9;
                    case 9:
                        if (!remaining) return [3 /*break*/, 12];
                        // Move to the next node
                        if (cur.right) {
                            cur = cur.right;
                            while (cur.left)
                                cur = cur.left;
                        }
                        else {
                            while (true) {
                                next = cur.parent;
                                if (!next) {
                                    cur = null;
                                    break;
                                }
                                if (next.left === cur) {
                                    // Continue with this node
                                    cur = next;
                                    break;
                                }
                                else {
                                    // Keep going up
                                    cur = next;
                                }
                            }
                            if (!cur)
                                return [3 /*break*/, 12];
                        }
                        return [4 /*yield*/, cur.openRaw()];
                    case 10:
                        raw = _d.sent();
                        if (remaining >= cur.len) {
                            // Cut out this node entirely
                            remaining -= cur.len;
                            cur.len = 0;
                        }
                        else {
                            // Just cut out part of it
                            raw.set(raw.slice(remaining));
                            cur.len -= remaining;
                            remaining = 0;
                        }
                        return [4 /*yield*/, cur.closeRaw(true)];
                    case 11:
                        _d.sent();
                        return [3 /*break*/, 9];
                    case 12:
                        newData = [];
                        if (replacement) {
                            replacement.root.fillArray(newData);
                            replacement.root = null;
                        }
                        // 5: Insert it into ours
                        cur = startLoc.node;
                        _i = 0, newData_1 = newData;
                        _d.label = 13;
                    case 13:
                        if (!(_i < newData_1.length)) return [3 /*break*/, 16];
                        next = newData_1[_i];
                        nnext = new AudioData(next.id, this, { insertAfter: cur });
                        return [4 /*yield*/, nnext.load()];
                    case 14:
                        _d.sent();
                        nnext.right = cur.right;
                        nnext.right.parent = nnext;
                        cur.right = nnext;
                        nnext.parent = cur;
                        cur = nnext;
                        _d.label = 15;
                    case 15:
                        _i++;
                        return [3 /*break*/, 13];
                    case 16:
                        if (!replacement) return [3 /*break*/, 18];
                        // FIXME: What if it's in a project?
                        return [4 /*yield*/, replacement.del()];
                    case 17:
                        // FIXME: What if it's in a project?
                        _d.sent();
                        _d.label = 18;
                    case 18:
                        d = [];
                        this.root.fillArray(d);
                        i = d.length - 1;
                        _d.label = 19;
                    case 19:
                        if (!(i >= 0)) return [3 /*break*/, 22];
                        el = d[i];
                        if (!(el.len === 0)) return [3 /*break*/, 21];
                        return [4 /*yield*/, el.del()];
                    case 20:
                        _d.sent();
                        d.splice(i, 1);
                        _d.label = 21;
                    case 21:
                        i--;
                        return [3 /*break*/, 19];
                    case 22:
                        // 8: Rebalance our data
                        this.root = AudioData.balanceArray(d);
                        return [4 /*yield*/, this.save()];
                    case 23:
                        _d.sent();
                        return [4 /*yield*/, _$avthreads_6.flush()];
                    case 24:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AudioTrack;
}());
_$audioData_4.AudioTrack = AudioTrack;
/**
 * A single piece of audio data. Stored in the store as audio-data-id,
 * audio-data-compressed-id, and audio-data-wave-id.
 */
var AudioData = /** @class */ (function () {
    /**
     * Create an AudioData.
     * @param id  ID for this AudioData. Must be unique in the store.
     * @param track  Track this AudioData belongs to. Note that setting it here
     *               does not actually add it to the track.
     */
    function AudioData(id, track, opts) {
        if (opts === void 0) { opts = {}; }
        this.id = id;
        this.track = track;
        this.pos = this.len = 0;
        this.raw = this.rawPromise = this.waveform = null;
        this.rawModified = false;
        this.readers = 0;
        this.parent = this.left = this.right = null;
        this.img = _$ui_20.mk("img", track.waveform);
        if (opts.insertAfter) {
            var before = opts.insertAfter.img.nextSibling;
            if (before && before !== this.img)
                track.waveform.insertBefore(this.img, before);
        }
    }
    /**
     * Save this AudioData. *Never* recurses: only saves *this* AudioData.
     */
    AudioData.prototype.save = function () {
        return ____awaiter_4(this, void 0, void 0, function () {
            return ____generator_4(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.track.project.store.setItem("audio-data-" + this.id, {
                            len: this.len
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load this AudioData. Does not load the raw data, which will be loaded on
     * demand.
     */
    AudioData.prototype.load = function () {
        return ____awaiter_4(this, void 0, void 0, function () {
            var store, d, _a, w;
            return ____generator_4(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        store = this.track.project.store;
                        return [4 /*yield*/, store.getItem("audio-data-" + this.id)];
                    case 1:
                        d = _b.sent();
                        if (!d)
                            return [2 /*return*/];
                        this.len = d.len;
                        // Waveform gets displayed immediately if applicable
                        _a = this;
                        return [4 /*yield*/, store.getItem("audio-data-wave-" + this.id)];
                    case 2:
                        // Waveform gets displayed immediately if applicable
                        _a.waveform = _b.sent();
                        if (this.waveform) {
                            w = ~~(this.len / this.track.channels / this.track.sampleRate * _$ui_20.pixelsPerSecond);
                            Object.assign(this.img.style, {
                                width: "calc(" + w + "px * var(--zoom-wave))",
                                height: _$ui_20.trackHeight + "px"
                            });
                            this.img.src = URL.createObjectURL(this.waveform);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete this AudioData.
     */
    AudioData.prototype.del = function () {
        return ____awaiter_4(this, void 0, void 0, function () {
            var store;
            return ____generator_4(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Make sure it doesn't get written later
                        this.readers = Infinity;
                        // Remove the image
                        try {
                            this.img.parentNode.removeChild(this.img);
                        }
                        catch (ex) { }
                        store = this.track.project.store;
                        return [4 /*yield*/, store.removeItem("audio-data-" + this.id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.removeItem("audio-data-wave-" + this.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Rebalance the tree rooted at this node.
     */
    AudioData.prototype.rebalance = function () {
        // Convert the whole tree to an array
        var tarr = [];
        this.fillArray(tarr);
        // Then turn the array back into a tree
        return AudioData.balanceArray(tarr);
    };
    /**
     * Convert this tree into an array, by filling the parameter.
     * @param arr  Array to fill.
     */
    AudioData.prototype.fillArray = function (arr) {
        if (this.left)
            this.left.fillArray(arr);
        arr.push(this);
        if (this.right)
            this.right.fillArray(arr);
    };
    /**
     * Create a balanced tree from an array of AudioData.
     */
    AudioData.balanceArray = function (arr) {
        if (arr.length === 0)
            return null;
        // Find the middle node
        var mid = ~~(arr.length / 2);
        var root = arr[mid];
        root.parent = null;
        // Sort out its left
        root.left = AudioData.balanceArray(arr.slice(0, mid));
        if (root.left)
            root.left.parent = root;
        // Figure out the left duration to get its position
        root.pos = root.left ? root.left.subtreeDuration() : 0;
        // Then sort out the right
        root.right = AudioData.balanceArray(arr.slice(mid + 1));
        if (root.right)
            root.right.parent = root;
        return root;
    };
    /**
     * Get the duration, in samples, of the subtree rooted at this node. Note
     * that since this is just in raw, non-planar samples, if there's more than
     * one track, this number will effectively be multiplied by the number of
     * tracks.
     */
    AudioData.prototype.subtreeDuration = function () {
        var cur = this;
        var res = 0;
        while (cur) {
            res += cur.pos + cur.len;
            cur = cur.right;
        }
        return res;
    };
    /**
     * Get the audio node and offset for the desired sample.
     * @param sample  The sample to find.
     */
    AudioData.prototype.find = function (sample) {
        var cur = this;
        var offset = 0;
        while (cur) {
            if (cur.pos + offset <= sample) {
                // In this node or to the right
                if (cur.pos + offset + cur.len > sample) {
                    // In this node
                    return {
                        offset: sample - offset - cur.pos,
                        node: cur
                    };
                }
                else {
                    // To the right
                    offset += cur.pos + cur.len;
                    cur = cur.right;
                }
            }
            else {
                // To the left
                cur = cur.left;
            }
        }
        // Not found!
        return null;
    };
    /**
     * Get the raw audio data for this chunk. If it's not in memory, this will
     * involve uncompressing it. Each openRaw must be balanced with a closeRaw.
     */
    AudioData.prototype.openRaw = function () {
        return ____awaiter_4(this, void 0, void 0, function () {
            var rawRes, self, rframes, len, _i, rframes_1, frame, ret, offset, _a, rframes_2, frame;
            return ____generator_4(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.readers++;
                        if (this.raw) {
                            // Already exists
                            return [2 /*return*/, this.raw];
                        }
                        if (!this.rawPromise) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.rawPromise];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, this.raw];
                    case 2:
                        rawRes = null;
                        this.rawPromise = new Promise(function (res) { return rawRes = res; });
                        self = this;
                        return [4 /*yield*/, _$avthreads_6.enqueueSync(function (libav) {
                                return ____awaiter_4(this, void 0, void 0, function () {
                                    var wavpack, fn, _a, fmt_ctx, stream, _b, c, pkt, frame, _c, packets, frames, toFormat, _d, filter_graph, buffersrc_ctx, buffersink_ctx;
                                    return ____generator_4(this, function (_e) {
                                        switch (_e.label) {
                                            case 0: return [4 /*yield*/, self.track.project.store.getItem("audio-data-compressed-" + self.id)];
                                            case 1:
                                                wavpack = _e.sent();
                                                if (!wavpack) {
                                                    // Whoops, make it up!
                                                    rframes = [{ data: new Float32Array(0) }];
                                                    return [2 /*return*/];
                                                }
                                                fn = "tmp-" + self.id + ".wv";
                                                return [4 /*yield*/, libav.writeFile(fn, wavpack)];
                                            case 2:
                                                _e.sent();
                                                return [4 /*yield*/, libav.ff_init_demuxer_file(fn)];
                                            case 3:
                                                _a = _e.sent(), fmt_ctx = _a[0], stream = _a[1][0];
                                                return [4 /*yield*/, libav.ff_init_decoder(stream.codec_id, stream.codecpar)];
                                            case 4:
                                                _b = _e.sent(), c = _b[1], pkt = _b[2], frame = _b[3];
                                                return [4 /*yield*/, libav.ff_read_multi(fmt_ctx, pkt)];
                                            case 5:
                                                _c = _e.sent(), packets = _c[1];
                                                return [4 /*yield*/, libav.ff_decode_multi(c, pkt, frame, packets[stream.index], true)];
                                            case 6:
                                                frames = _e.sent();
                                                toFormat = fromPlanar(frames[0].format);
                                                return [4 /*yield*/, libav.ff_init_filter_graph("anull", {
                                                        sample_rate: frames[0].sample_rate,
                                                        sample_fmt: frames[0].format,
                                                        channel_layout: frames[0].channel_layout
                                                    }, {
                                                        sample_rate: frames[0].sample_rate,
                                                        sample_fmt: toFormat,
                                                        channel_layout: frames[0].channel_layout
                                                    })];
                                            case 7:
                                                _d = _e.sent(), filter_graph = _d[0], buffersrc_ctx = _d[1], buffersink_ctx = _d[2];
                                                return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, frames, true)];
                                            case 8:
                                                rframes = _e.sent();
                                                // Clean up
                                                return [4 /*yield*/, libav.avfilter_graph_free_js(filter_graph)];
                                            case 9:
                                                // Clean up
                                                _e.sent();
                                                return [4 /*yield*/, libav.ff_free_decoder(c, pkt, frame)];
                                            case 10:
                                                _e.sent();
                                                return [4 /*yield*/, libav.avformat_close_input_js(fmt_ctx)];
                                            case 11:
                                                _e.sent();
                                                return [4 /*yield*/, libav.unlink(fn)];
                                            case 12:
                                                _e.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            })];
                    case 3:
                        _b.sent();
                        len = 0;
                        for (_i = 0, rframes_1 = rframes; _i < rframes_1.length; _i++) {
                            frame = rframes_1[_i];
                            len += frame.data.length;
                        }
                        ret = new rframes[0].data.constructor(len);
                        offset = 0;
                        for (_a = 0, rframes_2 = rframes; _a < rframes_2.length; _a++) {
                            frame = rframes_2[_a];
                            ret.set(frame.data, offset);
                            offset += frame.data.length;
                        }
                        this.raw = ret;
                        rawRes(null);
                        this.rawPromise = null;
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    /**
     * Initialize a new raw buffer for this AudioData, of the type of the
     * buffer given. Use when an AudioData is created completely fresh, or is
     * about to be wholly overwritten. Also opens the raw, so make sure you
     * closeRaw when you're done.
     * @param exa  Example of the correct TypedArray format.
     */
    AudioData.prototype.initRaw = function (exa) {
        return ____awaiter_4(this, void 0, void 0, function () {
            return ____generator_4(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.raw = new exa.constructor(this.track.channels * this.track.sampleRate * 30);
                        return [4 /*yield*/, this.openRaw()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Close the raw data associated with this AudioData. When the last reader
     * closes, the data is compressed and rendered.
     * @param modified  Set to true if you've modified the data.
     */
    AudioData.prototype.closeRaw = function (modified) {
        if (modified === void 0) { modified = false; }
        return ____awaiter_4(this, void 0, void 0, function () {
            return ____generator_4(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.rawModified = this.rawModified || modified;
                        if (!(--this.readers <= 0)) return [3 /*break*/, 4];
                        this.readers = 0;
                        if (!this.rawModified) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.compress()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.save()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.raw = null;
                        this.rawModified = false;
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Compress and render this data, and store it
    AudioData.prototype.compress = function () {
        return ____awaiter_4(this, void 0, void 0, function () {
            var _this = this;
            return ____generator_4(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.len) return [3 /*break*/, 3];
                        return [4 /*yield*/, _$avthreads_6.enqueue(function (libav) { return _this.wavpack(libav, _this.raw); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, _$avthreads_6.enqueue(function (libav) { return _this.render(libav, _this.raw); })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // wavpack-compress this data
    AudioData.prototype.wavpack = function (libav, raw) {
        return ____awaiter_4(this, void 0, void 0, function () {
            var track, toFormat, channel_layout, _a, c, frame, pkt, frame_size, _b, oc, pb, _c, filter_graph, buffersrc_ctx, buffersink_ctx, frames, packets, u8;
            return ____generator_4(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        track = this.track;
                        toFormat = toPlanar(track.format);
                        channel_layout = toChannelLayout(track.channels);
                        return [4 /*yield*/, libav.ff_init_encoder("wavpack", {
                                sample_fmt: toFormat,
                                sample_rate: track.sampleRate,
                                channel_layout: channel_layout
                            })];
                    case 1:
                        _a = _d.sent(), c = _a[1], frame = _a[2], pkt = _a[3], frame_size = _a[4];
                        return [4 /*yield*/, libav.ff_init_muxer({ filename: this.id + ".wv", open: true }, [[c, 1, track.sampleRate]])];
                    case 2:
                        _b = _d.sent(), oc = _b[0], pb = _b[2];
                        return [4 /*yield*/, libav.avformat_write_header(oc, 0)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, libav.ff_init_filter_graph("anull", {
                                sample_rate: track.sampleRate,
                                sample_fmt: track.format,
                                channel_layout: channel_layout
                            }, {
                                sample_rate: track.sampleRate,
                                sample_fmt: toFormat,
                                channel_layout: channel_layout,
                                frame_size: frame_size
                            })];
                    case 4:
                        _c = _d.sent(), filter_graph = _c[0], buffersrc_ctx = _c[1], buffersink_ctx = _c[2];
                        return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, [{
                                    data: raw.subarray(0, this.len),
                                    channel_layout: channel_layout,
                                    format: track.format,
                                    pts: 0,
                                    sample_rate: track.sampleRate
                                }], true)];
                    case 5:
                        frames = _d.sent();
                        return [4 /*yield*/, libav.ff_encode_multi(c, frame, pkt, frames, true)];
                    case 6:
                        packets = _d.sent();
                        return [4 /*yield*/, libav.ff_write_multi(oc, pkt, packets)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, libav.av_write_trailer(oc)];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, libav.avfilter_graph_free_js(filter_graph)];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, libav.ff_free_muxer(oc, pb)];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, libav.ff_free_encoder(c, frame, pkt)];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, libav.readFile(this.id + ".wv")];
                    case 12:
                        u8 = _d.sent();
                        return [4 /*yield*/, libav.unlink(this.id + ".wv")];
                    case 13:
                        _d.sent();
                        // And save it to the store
                        return [4 /*yield*/, track.project.store.setItem("audio-data-compressed-" + this.id, u8)];
                    case 14:
                        // And save it to the store
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Render the waveform for this data
    AudioData.prototype.render = function (libav, raw) {
        return ____awaiter_4(this, void 0, void 0, function () {
            var track, channel_layout, frame, _a, filter_graph, buffersrc_ctx, buffersink_ctx, frameD, data, spp, w, canvas, ctx, max, min, x, step, i, dbishMax, dbishMin, _b;
            return ____generator_4(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        track = this.track;
                        channel_layout = toChannelLayout(track.channels);
                        return [4 /*yield*/, libav.av_frame_alloc()];
                    case 1:
                        frame = _c.sent();
                        return [4 /*yield*/, libav.ff_init_filter_graph("anull", {
                                sample_rate: track.sampleRate,
                                sample_fmt: track.format,
                                channel_layout: channel_layout
                            }, {
                                sample_rate: track.sampleRate,
                                sample_fmt: libav.AV_SAMPLE_FMT_FLT,
                                channel_layout: 4,
                                frame_size: this.len
                            })];
                    case 2:
                        _a = _c.sent(), filter_graph = _a[0], buffersrc_ctx = _a[1], buffersink_ctx = _a[2];
                        return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, [{
                                    data: raw.subarray(0, this.len),
                                    channel_layout: channel_layout,
                                    format: track.format,
                                    pts: 0,
                                    sample_rate: track.sampleRate
                                }], true)];
                    case 3:
                        frameD = (_c.sent())[0];
                        return [4 /*yield*/, libav.avfilter_graph_free_js(filter_graph)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, libav.av_frame_free(frame)];
                    case 5:
                        _c.sent();
                        data = frameD.data;
                        spp = ~~(track.sampleRate / _$ui_20.pixelsPerSecond);
                        w = Math.max(~~(data.length / track.sampleRate * _$ui_20.pixelsPerSecond), 1);
                        canvas = _$ui_20.mk("canvas", null, { width: w, height: _$ui_20.trackHeight });
                        ctx = canvas.getContext("2d");
                        ctx.fillStyle = "#000";
                        ctx.fillRect(0, 63, w, 2);
                        ctx.fillStyle = "#0f0";
                        max = -Infinity, min = Infinity;
                        x = 0, step = 0;
                        for (i = 0; i < data.length; i++) {
                            max = Math.max(max, data[i]);
                            min = Math.min(min, data[i]);
                            if (++step === spp) {
                                dbishMax = Math.sign(max) * Math.log(Math.abs(max) + 1) / log2;
                                dbishMin = Math.sign(min) * Math.log(Math.abs(min) + 1) / log2;
                                ctx.fillRect(x, ~~(_$ui_20.trackMiddle - dbishMax * _$ui_20.trackMiddle), 1, Math.max(~~((dbishMax - dbishMin) * _$ui_20.trackMiddle), 2));
                                // Reset
                                max = -Infinity;
                                min = Infinity;
                                x++;
                                step = 0;
                            }
                        }
                        // Now make it a PNG and save it
                        _b = this;
                        return [4 /*yield*/, new Promise(function (res) { return canvas.toBlob(res); })];
                    case 6:
                        // Now make it a PNG and save it
                        _b.waveform = _c.sent();
                        return [4 /*yield*/, this.track.project.store.setItem("audio-data-wave-" + this.id, this.waveform)];
                    case 7:
                        _c.sent();
                        // And make it an image
                        Object.assign(this.img.style, {
                            width: "calc(" + w + "px * var(--zoom-wave))",
                            height: _$ui_20.trackHeight + "px"
                        });
                        this.img.src = URL.createObjectURL(this.waveform);
                        return [2 /*return*/];
                }
            });
        });
    };
    return AudioData;
}());
_$audioData_4.AudioData = AudioData;

var _$hotkeys_9 = {};
"use strict";
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
Object.defineProperty(_$hotkeys_9, "__esModule", { value: true });
_$hotkeys_9.lbl = _$hotkeys_9.btn = _$hotkeys_9.mk = _$hotkeys_9.unregisterHotkey = _$hotkeys_9.registerHotkey = void 0;
// Support for alt hotkeys
/* removed: var _$ui_20 = require("./ui"); */;
// Currently registered hotkeys
var hotkeys = Object.create(null);
// Currently registered objects
var hotkeyObjects = new Map();
// A global mutation observer removes hotkeys when objects disappear
var observer = new MutationObserver(function (muts) {
    for (var _i = 0, muts_1 = muts; _i < muts_1.length; _i++) {
        var mut = muts_1[_i];
        for (var ei = 0; ei < mut.removedNodes.length; ei++) {
            var el = mut.removedNodes[ei];
            var key = hotkeyObjects.get(el);
            if (key)
                unregisterHotkey(el);
        }
    }
});
/**
 * Register a hotkey.
 * @param el  The element to click when the hotkey is pressed.
 * @param dialog  The dialog that the hotkey element is contained in, or null
 *                if it's not in a dialog.
 * @param key  The hot key itself.
 */
function registerHotkey(el, dialog, key) {
    if (!(key in hotkeys))
        hotkeys[key] = [];
    hotkeys[key].unshift({ el: el, dialog: dialog });
    hotkeyObjects.set(el, key);
    observer.observe(el.parentNode, { childList: true });
}
_$hotkeys_9.registerHotkey = registerHotkey;
/**
 * Unregister an element's hotkey.
 * @param el  The element.
 */
function unregisterHotkey(el) {
    var key = hotkeyObjects.get(el);
    if (!key)
        return;
    var hks = hotkeys[key];
    if (!hks)
        return;
    var idx = hks.findIndex(function (x) { return x.el === el; });
    if (idx >= 0)
        hks.splice(idx, 1);
    hotkeyObjects.delete(el);
}
_$hotkeys_9.unregisterHotkey = unregisterHotkey;
/**
 * Make an element hotkeyable.
 * @param parent  The dialog that the element will be placed in (but note that
 *                it's the caller's job to place the element).
 * @param lbl  The label to be hotkey-ified. Will be passed back to the
 *             callback without its _.
 * @param callback  The function to actually create the element, and presumably
 *                  add it to the DOM (though you're free to do that later).
 */
function __mk_9(parent, lbl, callback) {
    // Find the hotkey
    var hotkey = null;
    var idx = lbl.indexOf("_");
    if (idx >= 0) {
        hotkey = lbl[idx + 1].toLowerCase();
        lbl = lbl.slice(0, idx) + "<u>" + lbl[idx + 1] + "</u>" + lbl.slice(idx + 2);
    }
    // Make the element
    var el = callback(lbl);
    // Make the hotkey
    if (hotkey)
        registerHotkey(el, parent, hotkey);
    return el;
}
_$hotkeys_9.mk = __mk_9;
/**
 * Make a button with a hotkey.
 * @param parent  The dialog to place the button in.
 * @param lbl  The label for the button, including an _ before the letter
 *             representing the hotkey.
 * @param opts  Other options.
 */
function __btn_9(parent, lbl, opts) {
    if (opts === void 0) { opts = {}; }
    return __mk_9(parent, lbl, function (lbl) { return _$ui_20.btn(parent.box, lbl, opts); });
}
_$hotkeys_9.btn = __btn_9;
/**
 * Make a <label/> with a hotkey.
 * @param parent  The dialog to place the label in.
 * @param htmlFor  ID of the element that this label corresponds to.
 * @param lbl  Text of the label.
 * @param opts  Other options.
 */
function __lbl_9(parent, htmlFor, lbl, opts) {
    if (opts === void 0) { opts = {}; }
    return __mk_9(parent, lbl, function (lbl) { return _$ui_20.lbl(parent.box, htmlFor, lbl, opts); });
}
_$hotkeys_9.lbl = __lbl_9;
// The actual hotkey handler
document.body.addEventListener("keydown", function (ev) {
    if (!ev.altKey || ev.ctrlKey || ev.shiftKey)
        return;
    // Look for a matching hotkey
    var hks = hotkeys[ev.key];
    if (!hks)
        return;
    // Look for a matching element
    for (var _i = 0, hks_1 = hks; _i < hks_1.length; _i++) {
        var hk = hks_1[_i];
        if (hk.dialog) {
            // Make sure it's the topmost dialog
            if (_$ui_20.ui.dialogs.length === 0 ||
                _$ui_20.ui.dialogs[_$ui_20.ui.dialogs.length - 1] !== hk.dialog)
                continue;
        }
        else {
            // Make sure there is no dialog
            if (_$ui_20.ui.dialogs.length !== 0)
                continue;
        }
        // Perform this hotkey
        ev.preventDefault();
        hk.el.click();
        break;
    }
});

var _$filters_8 = {};
"use strict";
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
var ____awaiter_8 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_8 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$filters_8, "__esModule", { value: true });
_$filters_8.registerCustomFilter = _$filters_8.mixTracks = _$filters_8.selectionFilter = _$filters_8.ffmpegFilter = _$filters_8.ffmpegStream = _$filters_8.resample = _$filters_8.load = void 0;
/* removed: var _$audioData_4 = require("./audio-data"); */;
/* removed: var _$hotkeys_9 = require("./hotkeys"); */;
/* removed: var _$id36_10 = require("./id36"); */;
/* removed: var _$select_14 = require("./select"); */;
/* removed: var _$stream_17 = require("./stream"); */;
/* removed: var _$track_18 = require("./track"); */;
/* removed: var _$ui_20 = require("./ui"); */;
/**
 * Load filtering options.
 */
function __load_8() {
    return ____awaiter_8(this, void 0, void 0, function () {
        return ____generator_8(this, function (_a) {
            _$ui_20.ui.menu.filters.onclick = filterMenu;
            _$hotkeys_9.registerHotkey(_$ui_20.ui.menu.filters, null, "f");
            return [2 /*return*/];
        });
    });
}
_$filters_8.load = __load_8;
// This really belongs here, but is in audioData because it needs it
_$filters_8.resample = _$audioData_4.resample;
/**
 * Standard FFmpeg filters.
 */
var standardFilters = (function () {
    function num(name, ffName, defaultNumber, opts) {
        if (opts === void 0) { opts = {}; }
        return Object.assign({ name: name, ffName: ffName, type: "number", defaultNumber: defaultNumber }, opts);
    }
    function chk(name, ffName, defaultChecked, opts) {
        if (opts === void 0) { opts = {}; }
        return Object.assign({ name: name, ffName: ffName, type: "checkbox", defaultChecked: defaultChecked }, opts);
    }
    return [
        {
            name: "_Volume",
            ffName: "volume",
            params: [
                num("_Volume (dB)", "volume", 0, { suffix: "dB" })
            ]
        },
        {
            name: "_Compressor",
            ffName: "acompressor",
            params: [
                num("_Input gain (dB)", "level_in", 0, { suffix: "dB", min: -36, max: 36 }),
                // FIXME: Mode
                num("_Threshold to apply compression (dB)", "threshold", -18, { suffix: "dB", min: -60, max: 0 }),
                num("_Ratio to compress signal", "ratio", 2, { min: 1, max: 20 }),
                num("_Attack time (ms)", "attack", 20, { min: 0.01, max: 2000 }),
                num("Re_lease time (ms)", "release", 250, { min: 0.01, max: 9000 }),
                num("_Output gain (dB)", "makeup", 0, { suffix: "dB", min: 0, max: 36 }),
                num("Curve of compressor _knee", "knee", 2.82843, { min: 1, max: 8 })
                // FIXME: Link
                // FIXME: Detection
            ]
        },
        {
            name: "Dynamic audio _normalizer (leveler)",
            ffName: "dynaudnorm",
            params: [
                num("Frame _length (ms)", "framelen", 500, { min: 10, max: 8000 }),
                // FIXME: Must be odd:
                num("_Gaussian filter window size", "gausssize", 31, { min: 3, max: 301 }),
                num("Target _peak value (dB)", "peak", -0.5, { suffix: "dB", min: -36, max: 0 }),
                num("Maximum _gain (dB)", "maxgain", 20, { suffix: "dB", min: 0, max: 40 }),
                // FIXME: This being linear is stupid:
                num("Target _RMS (linear)", "targetrms", 0, { min: 0, max: 1 }),
                // FIXME: Coupling
                // FIXME: Correct DC
                num("Traditional _compression factor", "compress", 0, { min: 0, max: 30 }),
                num("_Threshold (linear)", "threshold", 0, { min: 0, max: 1 })
            ]
        },
        {
            name: "_Echo",
            ffName: "aecho",
            changesDuration: true,
            params: [
                num("_Input gain (dB)", "in_gain", -4.5, { suffix: "dB", min: -60, max: 0 }),
                num("_Output gain (dB)", "out_gain", -10.5, { suffix: "dB", min: -60, max: 0 }),
                // FIXME: Multiple delays, decays
                num("_Delay (ms)", "delays", 1000, { min: 0, max: 90000 }),
                num("De_cay (linear)", "decays", 0.5, { min: 0, max: 1 })
            ]
        },
        {
            name: "_Limiter",
            ffName: "alimiter",
            params: [
                num("_Limit (dB)", "limit", 0, { suffix: "dB", min: -24, max: 0 }),
                num("_Input gain (dB)", "level_in", 0, { suffix: "dB", min: -36, max: 0 }),
                num("_Output gain (dB)", "level_out", 0, { suffix: "dB", min: -36, max: 0 }),
                num("_Attack time (ms)", "attack", 5, { min: 1, max: 1000 }),
                num("_Release time (ms)", "release", 50, { min: 1, max: 1000 }),
                // FIXME: ASC is what now???
                chk("Auto-le_vel", "level", true)
            ]
        },
        {
            name: "_Tempo",
            ffName: "atempo",
            changesDuration: true,
            params: [
                num("_Tempo multiplier", "tempo", 1, { min: 0.5, max: 100 })
            ]
        },
        {
            name: "_FFmpeg filter (advanced)",
            ffName: null,
            changesDuration: true,
            params: [
                {
                    name: "Filter _graph",
                    ffName: null,
                    type: "text"
                }
            ]
        }
    ];
})();
/**
 * Custom filters registered by plugins.
 */
var customFilters = [];
/**
 * Create a stream to apply the given libav filter, described by a filter
 * string.
 * @param stream  The input stream.
 * @param fs  The filter string.
 */
function ffmpegStream(stream, fs) {
    return ____awaiter_8(this, void 0, void 0, function () {
        var first, time, libav, frame, _a, buffersrc_ctx, buffersink_ctx;
        return ____generator_8(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, stream.read()];
                case 1:
                    first = _b.sent();
                    if (!first) {
                        // No data!
                        return [2 /*return*/, new _$stream_17.WSPReadableStream({
                                start: function (controller) {
                                    controller.close();
                                }
                            })];
                    }
                    stream.push(first);
                    time = 0;
                    // Make the filter
                    _$audioData_4.sanitizeLibAVFrame(first);
                    return [4 /*yield*/, LibAV.LibAV()];
                case 2:
                    libav = _b.sent();
                    return [4 /*yield*/, libav.av_frame_alloc()];
                case 3:
                    frame = _b.sent();
                    return [4 /*yield*/, libav.ff_init_filter_graph(fs, {
                            sample_rate: first.sample_rate,
                            sample_fmt: first.format,
                            channel_layout: first.channel_layout
                        }, {
                            sample_rate: first.sample_rate,
                            sample_fmt: first.format,
                            channel_layout: first.channel_layout
                        })];
                case 4:
                    _a = _b.sent(), buffersrc_ctx = _a[1], buffersink_ctx = _a[2];
                    // And the stream
                    return [2 /*return*/, new _$stream_17.WSPReadableStream({
                            pull: function (controller) {
                                return ____awaiter_8(this, void 0, void 0, function () {
                                    var chunk, fframes, _i, fframes_1, frame_1;
                                    return ____generator_8(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!true) return [3 /*break*/, 3];
                                                return [4 /*yield*/, stream.read()];
                                            case 1:
                                                chunk = _a.sent();
                                                if (chunk)
                                                    chunk.node = null;
                                                return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, chunk ? [chunk] : [], !chunk)];
                                            case 2:
                                                fframes = _a.sent();
                                                // Send it thru
                                                for (_i = 0, fframes_1 = fframes; _i < fframes_1.length; _i++) {
                                                    frame_1 = fframes_1[_i];
                                                    controller.enqueue(frame_1);
                                                }
                                                if (!chunk) {
                                                    controller.close();
                                                    libav.terminate();
                                                }
                                                if (!chunk || fframes.length)
                                                    return [3 /*break*/, 3];
                                                return [3 /*break*/, 0];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                });
                            },
                            cancel: function () {
                                libav.terminate();
                            }
                        })];
            }
        });
    });
}
_$filters_8.ffmpegStream = ffmpegStream;
/**
 * Apply an FFmpeg filter with the given options.
 * @param filter  The filter and options.
 * @param sel  The selection to filter.
 * @param d  (Optional) The dialog in which to show the status, if applicable.
 *           This dialog will *not* be closed.
 */
function ffmpegFilter(filter, sel, d) {
    return ____awaiter_8(this, void 0, void 0, function () {
        var fs;
        return ____generator_8(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fs = "";
                    if (filter.name) {
                        fs = filter.name;
                        if (filter.args.length)
                            fs += "=";
                    }
                    fs += filter.args.map(function (x) { return (x.name ? x.name + "=" : "") + x.value; }).join(":");
                    return [4 /*yield*/, selectionFilter(function (x) { return ffmpegStream(x, fs); }, !!filter.changesDuration, sel, d)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$filters_8.ffmpegFilter = ffmpegFilter;
/**
 * Apply a filter function to a selection.
 * @param ff  The filter function.
 * @param changesDuration  Set if this filter changes duration, so the process
 *                         must use a temporary track.
 * @param sel  The selection to filter.
 * @param d  (Optional) The dialog in which to show the status, if applicable.
 *           This dialog will *not* be closed.
 */
function selectionFilter(ff, changesDuration, sel, d) {
    return ____awaiter_8(this, void 0, void 0, function () {
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
            return ____awaiter_8(this, void 0, void 0, function () {
                var inStream, statusStream, filterStream, newTrack, _a, _b;
                return ____generator_8(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inStream = track.stream(Object.assign({ keepOpen: !changesDuration }, streamOpts))
                                .getReader();
                            statusStream = new _$stream_17.WSPReadableStream({
                                pull: function (controller) {
                                    return ____awaiter_8(this, void 0, void 0, function () {
                                        var chunk;
                                        return ____generator_8(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, inStream.read()];
                                                case 1:
                                                    chunk = _a.sent();
                                                    if (chunk.done) {
                                                        controller.close();
                                                    }
                                                    else {
                                                        _$audioData_4.sanitizeLibAVFrame(chunk.value);
                                                        status[idx].filtered += chunk.value.nb_samples / chunk.value.sample_rate;
                                                        showStatus();
                                                        controller.enqueue(chunk.value);
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    });
                                }
                            });
                            return [4 /*yield*/, ff(new _$stream_17.EZStream(statusStream))];
                        case 1:
                            filterStream = _c.sent();
                            if (!changesDuration) return [3 /*break*/, 5];
                            _b = (_a = _$audioData_4.AudioTrack).bind;
                            return [4 /*yield*/, _$id36_10.genFresh(track.project.store, "audio-track-")];
                        case 2:
                            newTrack = new (_b.apply(_a, [void 0, _c.sent(), track.project, {
                                    format: track.format,
                                    sampleRate: track.sampleRate,
                                    channels: track.channels
                                }]))();
                            return [4 /*yield*/, newTrack.append(new _$stream_17.EZStream(filterStream))];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, track.replace(sel.range ? sel.start : 0, sel.range ? sel.end : Infinity, newTrack)];
                        case 4:
                            _c.sent();
                            return [3 /*break*/, 7];
                        case 5: 
                        // Just overwrite it
                        return [4 /*yield*/, track.overwrite(new _$stream_17.EZStream(filterStream), Object.assign({ closeTwice: true }, streamOpts))];
                        case 6:
                            // Just overwrite it
                            _c.sent();
                            _c.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        var tracks, streamOpts, status, threads, running, toRun, _a, sel_1, idx, fin;
        return ____generator_8(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tracks = sel.tracks.filter(function (x) { return x.type() === _$track_18.TrackType.Audio; });
                    if (tracks.length === 0) {
                        // Well that was easy
                        return [2 /*return*/];
                    }
                    if (d)
                        d.box.innerHTML = "Filtering...";
                    streamOpts = {
                        start: sel.range ? sel.start : void 0,
                        end: sel.range ? sel.end : void 0
                    };
                    status = tracks.map(function (x) { return ({
                        name: x.name,
                        filtered: 0,
                        duration: x.duration()
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
_$filters_8.selectionFilter = selectionFilter;
/**
 * Mix the selected tracks into a new track.
 * @param sel  The selection to mix.
 * @param d  (Optional) The dialog in which to show the status, if applicable.
 *           This dialog will *not* be closed.
 * @param opts  Other options.
 */
function mixTracks(sel, d, opts) {
    if (opts === void 0) { opts = {}; }
    return ____awaiter_8(this, void 0, void 0, function () {
        // Function to show the current status
        function showStatus() {
            if (d)
                d.box.innerHTML = "Mixing... " + Math.round(mixed / duration * 100) + "%";
        }
        var tracks, fs, mtracks, otracks, i, gtracks, streamOpts, outTrack, _a, _b, channelLayout, duration, mixed, libav, frame, _c, buffersrc_ctx, buffersink_ctx, inRStreams, inStreams, trackDone, trackDoneCt, mixStream, outStream;
        return ____generator_8(this, function (_d) {
            switch (_d.label) {
                case 0:
                    tracks = sel.tracks.filter(function (x) { return x.type() === _$track_18.TrackType.Audio; });
                    if (tracks.length === 0) {
                        // Well that was easy
                        return [2 /*return*/, null];
                    }
                    if (d)
                        d.box.innerHTML = "Mixing...";
                    fs = tracks.map(function (x, idx) { return "[in" + idx + "]anull[aud" + idx + "]"; }).join(";");
                    mtracks = tracks.map(function (x, idx) { return "aud" + idx; });
                    while (mtracks.length > 16) {
                        otracks = [];
                        for (i = 0; i < mtracks.length; i += 16) {
                            gtracks = mtracks.slice(i, i + 16);
                            fs += ";" + gtracks.map(function (x) { return "[" + x + "]"; }).join("") +
                                "amix=" + gtracks.length + "[aud" + otracks.length + "]";
                            otracks.push("aud" + otracks.length);
                        }
                        mtracks = otracks;
                    }
                    // Then mix whatever remains as one
                    fs += ";" + mtracks.map(function (x) { return "[" + x + "]"; }).join("") +
                        "amix=" + mtracks.length + "[out]";
                    streamOpts = {
                        start: sel.range ? sel.start : void 0,
                        end: sel.range ? sel.end : void 0
                    };
                    _b = (_a = _$audioData_4.AudioTrack).bind;
                    return [4 /*yield*/, _$id36_10.genFresh(tracks[0].project.store, "audio-track-")];
                case 1:
                    outTrack = new (_b.apply(_a, [void 0, _d.sent(), tracks[0].project, {
                            name: "Mix",
                            sampleRate: Math.max.apply(Math, tracks.map(function (x) { return x.sampleRate; })),
                            format: _$audioData_4.LibAVSampleFormat.FLT,
                            channels: Math.max.apply(Math, tracks.map(function (x) { return x.channels; }))
                        }]))();
                    channelLayout = _$audioData_4.toChannelLayout(outTrack.channels);
                    duration = Math.max.apply(Math, tracks.map(function (x) { return x.duration(); }));
                    mixed = 0;
                    return [4 /*yield*/, LibAV.LibAV()];
                case 2:
                    libav = _d.sent();
                    return [4 /*yield*/, libav.av_frame_alloc()];
                case 3:
                    frame = _d.sent();
                    return [4 /*yield*/, libav.ff_init_filter_graph(fs, tracks.map(function (x) { return ({
                            sample_rate: x.sampleRate,
                            sample_fmt: x.format,
                            channel_layout: _$audioData_4.toChannelLayout(x.channels)
                        }); }), {
                            sample_rate: outTrack.sampleRate,
                            sample_fmt: outTrack.format,
                            channel_layout: channelLayout
                        })];
                case 4:
                    _c = _d.sent(), buffersrc_ctx = _c[1], buffersink_ctx = _c[2];
                    inRStreams = tracks.map(function (x) { return x.stream(streamOpts); });
                    if (!opts.preFilter) return [3 /*break*/, 6];
                    return [4 /*yield*/, Promise.all(inRStreams.map(function (x) { return opts.preFilter(new _$stream_17.EZStream(x)); }))];
                case 5:
                    inRStreams = _d.sent();
                    _d.label = 6;
                case 6:
                    inStreams = inRStreams.map(function (x) { return x.getReader(); });
                    trackDone = tracks.map(function () { return false; });
                    trackDoneCt = 0;
                    mixStream = new _$stream_17.WSPReadableStream({
                        pull: function (controller) {
                            return ____awaiter_8(this, void 0, void 0, function () {
                                var inps, outp, _i, outp_1, part;
                                return ____generator_8(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!true) return [3 /*break*/, 3];
                                            return [4 /*yield*/, Promise.all(inStreams.map(function (x, idx) {
                                                    return ____awaiter_8(this, void 0, void 0, function () {
                                                        var inp;
                                                        return ____generator_8(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    if (trackDone[idx])
                                                                        return [2 /*return*/, []];
                                                                    return [4 /*yield*/, x.read()];
                                                                case 1:
                                                                    inp = _a.sent();
                                                                    if (inp.done) {
                                                                        trackDone[idx] = true;
                                                                        trackDoneCt++;
                                                                        return [2 /*return*/, []];
                                                                    }
                                                                    inp.value.node = null;
                                                                    return [2 /*return*/, [inp.value]];
                                                            }
                                                        });
                                                    });
                                                }))];
                                        case 1:
                                            inps = _a.sent();
                                            return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, inps, trackDone)];
                                        case 2:
                                            outp = _a.sent();
                                            // Write it out
                                            if (outp.length) {
                                                for (_i = 0, outp_1 = outp; _i < outp_1.length; _i++) {
                                                    part = outp_1[_i];
                                                    controller.enqueue(part);
                                                    mixed += part.nb_samples / outTrack.sampleRate;
                                                }
                                                showStatus();
                                            }
                                            // Maybe end it
                                            if (trackDoneCt === tracks.length)
                                                controller.close();
                                            if (outp.length || trackDoneCt === tracks.length)
                                                return [3 /*break*/, 3];
                                            return [3 /*break*/, 0];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                    });
                    outStream = null;
                    if (!opts.postFilter) return [3 /*break*/, 8];
                    return [4 /*yield*/, opts.postFilter(new _$stream_17.EZStream(mixStream))];
                case 7:
                    outStream = _d.sent();
                    _d.label = 8;
                case 8: 
                // Append that to the new track
                return [4 /*yield*/, outTrack.append(new _$stream_17.EZStream(outStream || mixStream))];
                case 9:
                    // Append that to the new track
                    _d.sent();
                    // And get rid of the libav instance
                    libav.terminate();
                    return [2 /*return*/, outTrack];
            }
        });
    });
}
_$filters_8.mixTracks = mixTracks;
/**
 * Show the main filter menu.
 */
function filterMenu() {
    return ____awaiter_8(this, void 0, void 0, function () {
        return ____generator_8(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _$ui_20.dialog(function (d, show) {
                        return ____awaiter_8(this, void 0, void 0, function () {
                            var first, _loop_1, _i, standardFilters_1, filter, _loop_2, _a, customFilters_1, filter;
                            return ____generator_8(this, function (_b) {
                                first = null;
                                _loop_1 = function (filter) {
                                    var b = _$hotkeys_9.btn(d, filter.name, { className: "row small" });
                                    if (!first)
                                        first = b;
                                    b.onclick = function () { return uiFilter(d, filter); };
                                };
                                // Make a button for each filter in the standard list
                                for (_i = 0, standardFilters_1 = standardFilters; _i < standardFilters_1.length; _i++) {
                                    filter = standardFilters_1[_i];
                                    _loop_1(filter);
                                }
                                _loop_2 = function (filter) {
                                    var b = _$hotkeys_9.btn(d, filter.name, { className: "row small" });
                                    b.onclick = function () { return filter.filter(d); };
                                };
                                // And for each filter in the custom list
                                for (_a = 0, customFilters_1 = customFilters; _a < customFilters_1.length; _a++) {
                                    filter = customFilters_1[_a];
                                    _loop_2(filter);
                                }
                                show(first);
                                return [2 /*return*/];
                            });
                        });
                    }, {
                        closeable: true
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Show the user interface for a particular filter.
 * @param d  The dialog to reuse for the filter display.
 * @param filter  The filter itself.
 */
function uiFilter(d, filter) {
    return ____awaiter_8(this, void 0, void 0, function () {
        return ____generator_8(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _$ui_20.dialog(function (d, show) {
                        return ____awaiter_8(this, void 0, void 0, function () {
                            // Perform the actual filter
                            function doIt() {
                                uiFilterGo(d, filter, pels);
                            }
                            var first, pels, _loop_3, _i, _a, param, btn;
                            return ____generator_8(this, function (_b) {
                                first = null;
                                pels = Object.create(null);
                                _loop_3 = function (param) {
                                    var id = "ez-filter-param-" + filter.ffName + "-" + param.ffName;
                                    var div = _$ui_20.mk("div", d.box, { className: "row" });
                                    _$hotkeys_9.mk(d, param.name + ":&nbsp;", function (lbl) { return _$ui_20.lbl(div, id, lbl, { className: "ez" }); });
                                    var inp = pels[param.ffName] = _$ui_20.mk("input", div, {
                                        id: id,
                                        type: param.type === "number" ? "text" : param.type
                                    });
                                    if (!first)
                                        first = inp;
                                    // Set any type-specific properties
                                    if (param.type === "number") {
                                        // Default
                                        if (typeof param.defaultNumber === "number")
                                            inp.value = param.defaultNumber + "";
                                        // Range
                                        if (typeof param.min === "number" ||
                                            typeof param.max === "number") {
                                            inp.addEventListener("change", function () {
                                                var val = +inp.value;
                                                if (typeof param.min === "number" && val < param.min)
                                                    inp.value = param.min + "";
                                                else if (typeof param.max === "number" && val > param.max)
                                                    inp.value = param.max + "";
                                            });
                                        }
                                    }
                                    else if (param.type === "text") {
                                        // Default
                                        if (param.defaultText)
                                            inp.value = param.defaultText;
                                    }
                                    else if (param.type === "checkbox") {
                                        // Default
                                        inp.checked = !!param.defaultChecked;
                                    }
                                    if (param.type === "number" || param.type === "text") {
                                        // Support enter to submit
                                        inp.addEventListener("keydown", function (ev) {
                                            if (ev.key === "Enter") {
                                                ev.preventDefault();
                                                doIt();
                                            }
                                        });
                                    }
                                };
                                // Show each of the filter parameters
                                for (_i = 0, _a = filter.params; _i < _a.length; _i++) {
                                    param = _a[_i];
                                    _loop_3(param);
                                }
                                btn = _$hotkeys_9.btn(d, "_Filter", { className: "row" });
                                btn.onclick = doIt;
                                show(first);
                                return [2 /*return*/];
                            });
                        });
                    }, {
                        closeable: true,
                        reuse: d
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Perform an actual filter (from the UI).
 * @param d  The dialog to reuse for the filter display.
 * @param filter  The filter itself.
 * @param pels  Elements corresponding to the parameters.
 */
function uiFilterGo(d, filter, pels) {
    return ____awaiter_8(this, void 0, void 0, function () {
        return ____generator_8(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _$ui_20.loading(function (d) {
                        return ____awaiter_8(this, void 0, void 0, function () {
                            var args, _i, _a, param, val, v, opts, sel;
                            return ____generator_8(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        args = [];
                                        for (_i = 0, _a = filter.params; _i < _a.length; _i++) {
                                            param = _a[_i];
                                            val = "";
                                            // Get out the value
                                            switch (param.type) {
                                                case "number": {
                                                    v = +pels[param.ffName].value;
                                                    if (typeof param.min === "number" && v < param.min)
                                                        v = param.min;
                                                    else if (typeof param.max === "number" && v > param.max)
                                                        v = param.max;
                                                    val = v + "";
                                                    break;
                                                }
                                                case "checkbox":
                                                    val = pels[param.ffName].checked ? "1" : "0";
                                                    break;
                                                default:
                                                    val = pels[param.ffName].value;
                                            }
                                            // Add any suffix
                                            if (param.suffix)
                                                val += param.suffix;
                                            // Add it to the list
                                            args.push({ name: param.ffName, value: val });
                                        }
                                        opts = {
                                            name: filter.ffName,
                                            args: args,
                                            changesDuration: !!filter.changesDuration
                                        };
                                        sel = _$select_14.getSelection();
                                        if (sel.tracks.length === 0) {
                                            // Nothing to do!
                                            return [2 /*return*/];
                                        }
                                        // Prepare for undo
                                        sel.tracks[0].project.store.undoPoint();
                                        // And perform the filter
                                        return [4 /*yield*/, ffmpegFilter(opts, sel, d)];
                                    case 1:
                                        // And perform the filter
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }, {
                        reuse: d
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Register a custom filter.
 * @param filter  The filter.
 */
function registerCustomFilter(filter) {
    customFilters.push(filter);
}
_$filters_8.registerCustomFilter = registerCustomFilter;

var _$StreamSaver_2 = { exports: {} };
/* global chrome location ReadableStream define MessageChannel TransformStream */

;((name, definition) => {
  "object" !== 'undefined'
    ? _$StreamSaver_2.exports = definition()
    : typeof define === 'function' && typeof define.amd === 'object'
      ? define(definition)
      : this[name] = definition()
})('streamSaver', () => {
  'use strict'

  const global = typeof window === 'object' ? window : this
  if (!global.HTMLElement) console.warn('streamsaver is meant to run on browsers main thread')

  let mitmTransporter = null
  let supportsTransferable = false
  const test = fn => { try { fn() } catch (e) {} }
  const ponyfill = global.WebStreamsPolyfill || {}
  const isSecureContext = global.isSecureContext
  // TODO: Must come up with a real detection test (#69)
  let useBlobFallback = /constructor/i.test(global.HTMLElement) || !!global.safari || !!global.WebKitPoint
  const downloadStrategy = isSecureContext || 'MozAppearance' in document.documentElement.style
    ? 'iframe'
    : 'navigate'

  const streamSaver = {
    createWriteStream,
    WritableStream: global.WritableStream || ponyfill.WritableStream,
    supported: true,
    version: { full: '2.0.5', major: 2, minor: 0, dot: 5 },
    mitm: 'https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=2.0.0'
  }

  /**
   * create a hidden iframe and append it to the DOM (body)
   *
   * @param  {string} src page to load
   * @return {HTMLIFrameElement} page to load
   */
  function makeIframe (src) {
    if (!src) throw new Error('meh')
    const iframe = document.createElement('iframe')
    iframe.hidden = true
    iframe.src = src
    iframe.loaded = false
    iframe.name = 'iframe'
    iframe.isIframe = true
    iframe.postMessage = (...args) => iframe.contentWindow.postMessage(...args)
    iframe.addEventListener('load', () => {
      iframe.loaded = true
    }, { once: true })
    document.body.appendChild(iframe)
    return iframe
  }

  /**
   * create a popup that simulates the basic things
   * of what a iframe can do
   *
   * @param  {string} src page to load
   * @return {object}     iframe like object
   */
  function makePopup (src) {
    const options = 'width=200,height=100'
    const delegate = document.createDocumentFragment()
    const popup = {
      frame: global.open(src, 'popup', options),
      loaded: false,
      isIframe: false,
      isPopup: true,
      remove () { popup.frame.close() },
      addEventListener (...args) { delegate.addEventListener(...args) },
      dispatchEvent (...args) { delegate.dispatchEvent(...args) },
      removeEventListener (...args) { delegate.removeEventListener(...args) },
      postMessage (...args) { popup.frame.postMessage(...args) }
    }

    const onReady = evt => {
      if (evt.source === popup.frame) {
        popup.loaded = true
        global.removeEventListener('message', onReady)
        popup.dispatchEvent(new Event('load'))
      }
    }

    global.addEventListener('message', onReady)

    return popup
  }

  try {
    // We can't look for service worker since it may still work on http
    new Response(new ReadableStream())
    if (isSecureContext && !('serviceWorker' in navigator)) {
      useBlobFallback = true
    }
  } catch (err) {
    useBlobFallback = true
  }

  test(() => {
    // Transfariable stream was first enabled in chrome v73 behind a flag
    const { readable } = new TransformStream()
    const mc = new MessageChannel()
    mc.port1.postMessage(readable, [readable])
    mc.port1.close()
    mc.port2.close()
    supportsTransferable = true
    // Freeze TransformStream object (can only work with native)
    Object.defineProperty(streamSaver, 'TransformStream', {
      configurable: false,
      writable: false,
      value: TransformStream
    })
  })

  function loadTransporter () {
    if (!mitmTransporter) {
      mitmTransporter = isSecureContext
        ? makeIframe(streamSaver.mitm)
        : makePopup(streamSaver.mitm)
    }
  }

  /**
   * @param  {string} filename filename that should be used
   * @param  {object} options  [description]
   * @param  {number} size     depricated
   * @return {WritableStream<Uint8Array>}
   */
  function createWriteStream (filename, options, size) {
    let opts = {
      size: null,
      pathname: null,
      writableStrategy: undefined,
      readableStrategy: undefined
    }

    let bytesWritten = 0 // by StreamSaver.js (not the service worker)
    let downloadUrl = null
    let channel = null
    let ts = null

    // normalize arguments
    if (Number.isFinite(options)) {
      [ size, options ] = [ options, size ]
      console.warn('[StreamSaver] Depricated pass an object as 2nd argument when creating a write stream')
      opts.size = size
      opts.writableStrategy = options
    } else if (options && options.highWaterMark) {
      console.warn('[StreamSaver] Depricated pass an object as 2nd argument when creating a write stream')
      opts.size = size
      opts.writableStrategy = options
    } else {
      opts = options || {}
    }
    if (!useBlobFallback) {
      loadTransporter()

      channel = new MessageChannel()

      // Make filename RFC5987 compatible
      filename = encodeURIComponent(filename.replace(/\//g, ':'))
        .replace(/['()]/g, escape)
        .replace(/\*/g, '%2A')

      const response = {
        transferringReadable: supportsTransferable,
        pathname: opts.pathname || Math.random().toString().slice(-6) + '/' + filename,
        headers: {
          'Content-Type': 'application/octet-stream; charset=utf-8',
          'Content-Disposition': "attachment; filename*=UTF-8''" + filename
        }
      }

      if (opts.size) {
        response.headers['Content-Length'] = opts.size
      }

      const args = [ response, '*', [ channel.port2 ] ]

      if (supportsTransferable) {
        const transformer = downloadStrategy === 'iframe' ? undefined : {
          // This transformer & flush method is only used by insecure context.
          transform (chunk, controller) {
            if (!(chunk instanceof Uint8Array)) {
              throw new TypeError('Can only wirte Uint8Arrays')
            }
            bytesWritten += chunk.length
            controller.enqueue(chunk)

            if (downloadUrl) {
              location.href = downloadUrl
              downloadUrl = null
            }
          },
          flush () {
            if (downloadUrl) {
              location.href = downloadUrl
            }
          }
        }
        ts = new streamSaver.TransformStream(
          transformer,
          opts.writableStrategy,
          opts.readableStrategy
        )
        const readableStream = ts.readable

        channel.port1.postMessage({ readableStream }, [ readableStream ])
      }

      channel.port1.onmessage = evt => {
        // Service worker sent us a link that we should open.
        if (evt.data.download) {
          // Special treatment for popup...
          if (downloadStrategy === 'navigate') {
            mitmTransporter.remove()
            mitmTransporter = null
            if (bytesWritten) {
              location.href = evt.data.download
            } else {
              downloadUrl = evt.data.download
            }
          } else {
            if (mitmTransporter.isPopup) {
              mitmTransporter.remove()
              mitmTransporter = null
              // Special case for firefox, they can keep sw alive with fetch
              if (downloadStrategy === 'iframe') {
                makeIframe(streamSaver.mitm)
              }
            }

            // We never remove this iframes b/c it can interrupt saving
            makeIframe(evt.data.download)
          }
        }
      }

      if (mitmTransporter.loaded) {
        mitmTransporter.postMessage(...args)
      } else {
        mitmTransporter.addEventListener('load', () => {
          mitmTransporter.postMessage(...args)
        }, { once: true })
      }
    }

    let chunks = []

    return (!useBlobFallback && ts && ts.writable) || new streamSaver.WritableStream({
      write (chunk) {
        if (!(chunk instanceof Uint8Array)) {
          throw new TypeError('Can only wirte Uint8Arrays')
        }
        if (useBlobFallback) {
          // Safari... The new IE6
          // https://github.com/jimmywarting/StreamSaver.js/issues/69
          //
          // even doe it has everything it fails to download anything
          // that comes from the service worker..!
          chunks.push(chunk)
          return
        }

        // is called when a new chunk of data is ready to be written
        // to the underlying sink. It can return a promise to signal
        // success or failure of the write operation. The stream
        // implementation guarantees that this method will be called
        // only after previous writes have succeeded, and never after
        // close or abort is called.

        // TODO: Kind of important that service worker respond back when
        // it has been written. Otherwise we can't handle backpressure
        // EDIT: Transfarable streams solvs this...
        channel.port1.postMessage(chunk)
        bytesWritten += chunk.length

        if (downloadUrl) {
          location.href = downloadUrl
          downloadUrl = null
        }
      },
      close () {
        if (useBlobFallback) {
          const blob = new Blob(chunks, { type: 'application/octet-stream; charset=utf-8' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = filename
          link.click()
        } else {
          channel.port1.postMessage('end')
        }
      },
      abort () {
        chunks = []
        channel.port1.postMessage('abort')
        channel.port1.onmessage = null
        channel.port1.close()
        channel.port2.close()
        channel = null
      }
    }, opts.writableStrategy)
  }

  return streamSaver
})

_$StreamSaver_2 = _$StreamSaver_2.exports
var _$export_7 = {};
"use strict";
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
var ____awaiter_7 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_7 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$export_7, "__esModule", { value: true });
_$export_7.uiExport = _$export_7.exportAudio = _$export_7.standardExports = void 0;
/* removed: var _$audioData_4 = require("./audio-data"); */;
/* removed: var _$hotkeys_9 = require("./hotkeys"); */;
/* removed: var _$select_14 = require("./select"); */;
/* removed: var _$track_18 = require("./track"); */;
/* removed: var _$ui_20 = require("./ui"); */;
/* removed: var _$StreamSaver_2 = require("streamsaver"); */;
/**
 * Standard export formats.
 */
_$export_7.standardExports = [
    { name: "_FLAC", options: { format: "flac", codec: "flac", sampleFormat: _$audioData_4.LibAVSampleFormat.S32 } },
    { name: "_M4A (MPEG-4 audio)", options: { format: "ipod", ext: "m4a", codec: "aac", sampleFormat: _$audioData_4.LibAVSampleFormat.FLTP } },
    { name: "Ogg _Vorbis", options: { format: "ogg", codec: "libvorbis", sampleFormat: _$audioData_4.LibAVSampleFormat.FLTP } },
    { name: "_Opus", options: { format: "ogg", ext: "opus", codec: "libopus", sampleFormat: _$audioData_4.LibAVSampleFormat.FLT, sampleRate: 48000 } },
    { name: "_ALAC (Apple Lossless)", options: { format: "ipod", ext: "m4a", codec: "alac", sampleFormat: _$audioData_4.LibAVSampleFormat.S32P } },
    { name: "wav_pack", options: { format: "wv", codec: "wavpack", sampleFormat: _$audioData_4.LibAVSampleFormat.FLTP } },
    { name: "_wav", options: { format: "wav", codec: "pcm_s16le", sampleFormat: _$audioData_4.LibAVSampleFormat.S16 } }
];
/**
 * Export selected audio with the given options.
 * @param opts  Export options.
 * @param sel  The selection to export.
 * @param d  A dialog in which to show progress, if desired.
 */
function exportAudio(opts, sel, d) {
    return ____awaiter_7(this, void 0, void 0, function () {
        // Function to show the current status
        function showStatus() {
            if (d) {
                var statusStr = status.map(function (x) {
                    return x.name + ": " + Math.round(x.exported / x.duration * 100) + "%";
                })
                    .join("<br/>");
                d.box.innerHTML = "Exporting...<br/>" + statusStr;
            }
        }
        // The export function for each track
        function exportThread(track, idx) {
            return ____awaiter_7(this, void 0, void 0, function () {
                var channel_layout, sample_rate, fname, inStream, libav, bufLen, fileLen, writePromise, cacheName, cacheNum, cache, _a, c, frame, pkt, frame_size, oc, _b, buffersrc_ctx, buffersink_ctx, pts, inFrame, fFrames, _i, fFrames_1, frame_1, packets, writer, lastNum, lastLen, i, storeName, part;
                return ____generator_7(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            channel_layout = _$audioData_4.toChannelLayout(track.channels);
                            sample_rate = opts.sampleRate || track.sampleRate;
                            fname = opts.prefix +
                                ((tracks.length > 1 || opts.suffixTrackName) ? "-" + track.name : "") +
                                "." + (opts.ext || opts.format);
                            inStream = track.stream(streamOpts).getReader();
                            return [4 /*yield*/, LibAV.LibAV()];
                        case 1:
                            libav = _c.sent();
                            bufLen = 1024 * 1024;
                            fileLen = 0;
                            writePromise = Promise.all([]);
                            cacheName = "";
                            cacheNum = -1;
                            cache = null;
                            libav.onwrite = function (name, pos, buf) {
                                writePromise = writePromise.then(function () { return write(pos, buf); });
                                function write(pos, buf) {
                                    return ____awaiter_7(this, void 0, void 0, function () {
                                        var storeNum, storeName, storeStart, storeEnd, nextBuf, storeOff, part;
                                        return ____generator_7(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    // Make sure our length is right
                                                    fileLen = Math.max(fileLen, pos + buf.length);
                                                    storeNum = ~~(pos / bufLen);
                                                    storeName = "export-" + fname + "-" + storeNum;
                                                    storeStart = storeNum * bufLen;
                                                    storeEnd = storeStart + bufLen;
                                                    nextBuf = null;
                                                    if (pos + buf.length > storeEnd) {
                                                        nextBuf = buf.subarray(storeEnd - pos);
                                                        buf = buf.subarray(0, storeEnd - pos);
                                                    }
                                                    storeOff = pos - storeStart;
                                                    if (!(cacheNum === storeNum)) return [3 /*break*/, 1];
                                                    part = cache;
                                                    return [3 /*break*/, 5];
                                                case 1:
                                                    if (!(cacheNum >= 0)) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, store.setItem(cacheName, cache)];
                                                case 2:
                                                    _a.sent();
                                                    _a.label = 3;
                                                case 3:
                                                    cacheName = storeName;
                                                    cacheNum = storeNum;
                                                    return [4 /*yield*/, store.getItem(storeName)];
                                                case 4:
                                                    part = cache = _a.sent();
                                                    if (!part)
                                                        part = cache = new Uint8Array(bufLen);
                                                    _a.label = 5;
                                                case 5:
                                                    // Save what we're writing to it
                                                    part.set(buf, storeOff);
                                                    if (!nextBuf) return [3 /*break*/, 7];
                                                    return [4 /*yield*/, write(storeEnd, nextBuf)];
                                                case 6:
                                                    _a.sent();
                                                    _a.label = 7;
                                                case 7: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }
                            };
                            return [4 /*yield*/, libav.ff_init_encoder(opts.codec, {
                                    sample_fmt: opts.sampleFormat,
                                    sample_rate: sample_rate,
                                    channel_layout: channel_layout
                                })];
                        case 2:
                            _a = _c.sent(), c = _a[1], frame = _a[2], pkt = _a[3], frame_size = _a[4];
                            return [4 /*yield*/, libav.ff_init_muxer({ filename: fname, format_name: opts.format, open: true, device: true }, [[c, 1, sample_rate]])];
                        case 3:
                            oc = (_c.sent())[0];
                            return [4 /*yield*/, libav.avformat_write_header(oc, 0)];
                        case 4:
                            _c.sent();
                            return [4 /*yield*/, libav.ff_init_filter_graph("anull", {
                                    sample_rate: track.sampleRate,
                                    sample_fmt: track.format,
                                    channel_layout: channel_layout
                                }, {
                                    sample_rate: sample_rate,
                                    sample_fmt: opts.sampleFormat,
                                    channel_layout: channel_layout,
                                    frame_size: frame_size
                                })];
                        case 5:
                            _b = _c.sent(), buffersrc_ctx = _b[1], buffersink_ctx = _b[2];
                            pts = 0;
                            _c.label = 6;
                        case 6:
                            if (!true) return [3 /*break*/, 12];
                            return [4 /*yield*/, inStream.read()];
                        case 7:
                            inFrame = _c.sent();
                            if (inFrame.value)
                                inFrame.value.node = null;
                            return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, inFrame.done ? [] : [inFrame.value], inFrame.done)];
                        case 8:
                            fFrames = _c.sent();
                            for (_i = 0, fFrames_1 = fFrames; _i < fFrames_1.length; _i++) {
                                frame_1 = fFrames_1[_i];
                                frame_1.pts = frame_1.dts = pts;
                                frame_1.ptshi = frame_1.dtshi = 0;
                                pts += frame_1.nb_samples;
                            }
                            return [4 /*yield*/, libav.ff_encode_multi(c, frame, pkt, fFrames, inFrame.done)];
                        case 9:
                            packets = _c.sent();
                            return [4 /*yield*/, libav.ff_write_multi(oc, pkt, packets)];
                        case 10:
                            _c.sent();
                            return [4 /*yield*/, writePromise];
                        case 11:
                            _c.sent();
                            // Update the status
                            if (inFrame.done)
                                status[idx].exported = status[idx].duration;
                            else
                                status[idx].exported += inFrame.value.data.length;
                            showStatus();
                            if (inFrame.done)
                                return [3 /*break*/, 12];
                            return [3 /*break*/, 6];
                        case 12: return [4 /*yield*/, libav.av_write_trailer(oc)];
                        case 13:
                            _c.sent();
                            return [4 /*yield*/, writePromise];
                        case 14:
                            _c.sent();
                            libav.terminate();
                            if (!(cacheNum >= 0)) return [3 /*break*/, 16];
                            return [4 /*yield*/, store.setItem(cacheName, cache)];
                        case 15:
                            _c.sent();
                            cache = null;
                            _c.label = 16;
                        case 16:
                            writer = _$StreamSaver_2
                                .createWriteStream(fname, { size: fileLen })
                                .getWriter();
                            lastNum = ~~(fileLen / bufLen);
                            lastLen = fileLen % bufLen;
                            i = 0;
                            _c.label = 17;
                        case 17:
                            if (!(i <= lastNum)) return [3 /*break*/, 25];
                            storeName = "export-" + fname + "-" + i;
                            return [4 /*yield*/, store.getItem(storeName)];
                        case 18:
                            part = _c.sent();
                            if (!(i === lastNum)) return [3 /*break*/, 20];
                            return [4 /*yield*/, writer.write(part.subarray(0, lastLen))];
                        case 19:
                            _c.sent();
                            return [3 /*break*/, 22];
                        case 20: return [4 /*yield*/, writer.write(part)];
                        case 21:
                            _c.sent();
                            _c.label = 22;
                        case 22: return [4 /*yield*/, store.removeItem(storeName)];
                        case 23:
                            _c.sent();
                            _c.label = 24;
                        case 24:
                            i++;
                            return [3 /*break*/, 17];
                        case 25: return [4 /*yield*/, writer.close()];
                        case 26:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var tracks, store, range, streamOpts, status, keys, _i, keys_1, key, threads, running, toRun, _a, sel_1, idx, fin;
        return ____generator_7(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tracks = sel.tracks.filter(function (x) { return x.type() === _$track_18.TrackType.Audio; });
                    if (tracks.length === 0) {
                        // Easy!
                        return [2 /*return*/];
                    }
                    store = tracks[0].project.store;
                    if (d)
                        d.box.innerHTML = "Exporting...";
                    range = sel.range && !opts.allAudio;
                    streamOpts = {
                        start: range ? sel.start : void 0,
                        end: range ? sel.end : void 0
                    };
                    status = tracks.map(function (x) { return ({
                        name: x.name,
                        exported: 0,
                        duration: x.sampleCount()
                    }); });
                    return [4 /*yield*/, store.keys()];
                case 1:
                    keys = _b.sent();
                    _i = 0, keys_1 = keys;
                    _b.label = 2;
                case 2:
                    if (!(_i < keys_1.length)) return [3 /*break*/, 5];
                    key = keys_1[_i];
                    if (!/^export-/.test(key)) return [3 /*break*/, 4];
                    return [4 /*yield*/, store.removeItem(key)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    threads = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 2;
                    running = [];
                    toRun = tracks.map(function (x, idx) { return [x, idx]; });
                    _b.label = 6;
                case 6:
                    if (!toRun.length) return [3 /*break*/, 8];
                    // Get the right number of threads running
                    while (running.length < threads && toRun.length) {
                        _a = toRun.shift(), sel_1 = _a[0], idx = _a[1];
                        running.push(exportThread(sel_1, idx));
                    }
                    return [4 /*yield*/, Promise.race(running.map(function (x, idx) { return x.then(function () { return idx; }); }))];
                case 7:
                    fin = _b.sent();
                    running.splice(fin, 1);
                    return [3 /*break*/, 6];
                case 8: 
                // Wait for them all to finish
                return [4 /*yield*/, Promise.all(running)];
                case 9:
                    // Wait for them all to finish
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$export_7.exportAudio = exportAudio;
/**
 * Show the user interface to export audio.
 * @param d  The dialog to reuse.
 * @param name  Name prefix for export.
 */
function uiExport(d, name) {
    return ____awaiter_7(this, void 0, void 0, function () {
        return ____generator_7(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _$ui_20.dialog(function (d, show) {
                        return ____awaiter_7(this, void 0, void 0, function () {
                            var first, _loop_1, _i, standardExports_1, format;
                            return ____generator_7(this, function (_a) {
                                first = null;
                                // Label
                                _$ui_20.mk("div", d.box, { innerHTML: "Format:", className: "row" }).style.textAlign = "center";
                                _loop_1 = function (format) {
                                    var btn = _$hotkeys_9.btn(d, format.name, { className: "row small" });
                                    if (!first)
                                        first = btn;
                                    btn.onclick = function () {
                                        _$ui_20.loading(function (d) {
                                            return ____awaiter_7(this, void 0, void 0, function () {
                                                return ____generator_7(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, exportAudio(Object.assign({ prefix: name }, format.options), _$select_14.getSelection(), d)];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        }, {
                                            reuse: d
                                        });
                                    };
                                };
                                // Show each format
                                for (_i = 0, standardExports_1 = _$export_7.standardExports; _i < standardExports_1.length; _i++) {
                                    format = standardExports_1[_i];
                                    _loop_1(format);
                                }
                                show(first);
                                return [2 /*return*/];
                            });
                        });
                    }, {
                        closeable: true,
                        reuse: d
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$export_7.uiExport = uiExport;

var _$audio_5 = {};
"use strict";
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
var ____awaiter_5 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_5 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$audio_5, "__esModule", { value: true });
_$audio_5.createSource = _$audio_5.getAudioContext = void 0;
/* removed: var _$audioData_4 = require("./audio-data"); */;
/* removed: var _$ui_20 = require("./ui"); */;
var ac = null;
/**
 * Get the audio context.
 */
function getAudioContext() {
    return ____awaiter_5(this, void 0, void 0, function () {
        var ex_1, ex_2;
        return ____generator_5(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!ac) return [3 /*break*/, 12];
                    ac = new AudioContext();
                    if (!(ac.state !== "running")) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ac.resume()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    if (!(ac.state !== "running")) return [3 /*break*/, 10];
                    // OK, ask nicely
                    return [4 /*yield*/, _$ui_20.alert("This tool needs permission to play audio. Press OK to grant this permission.")];
                case 5:
                    // OK, ask nicely
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 10]);
                    return [4 /*yield*/, ac.resume()];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 8:
                    ex_2 = _a.sent();
                    return [4 /*yield*/, _$ui_20.alert(ex_2 + "")];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 10: 
                // Load in the AWP
                return [4 /*yield*/, ac.audioWorklet.addModule("awp/ennuizel-player.js")];
                case 11:
                    // Load in the AWP
                    _a.sent();
                    _a.label = 12;
                case 12: return [2 /*return*/, ac];
            }
        });
    });
}
_$audio_5.getAudioContext = getAudioContext;
/**
 * Create a source node for this stream of libav-like frames. Takes the reader,
 * so that the caller can cancel it.
 * @param stream  The input stream.
 */
function createSource(stream, opts) {
    if (opts === void 0) { opts = {}; }
    return ____awaiter_5(this, void 0, void 0, function () {
        var ac, rdr, first, libav, frame, _a, buffersrc_ctx, buffersink_ctx, finished, firstFrames, ret;
        return ____generator_5(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getAudioContext()];
                case 1:
                    ac = _b.sent();
                    rdr = stream.getReader();
                    return [4 /*yield*/, rdr.read()];
                case 2:
                    first = _b.sent();
                    if (first.done) {
                        // Useless
                        if (opts.ready)
                            opts.ready();
                        return [2 /*return*/, {
                                node: ac.createBufferSource(),
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                start: function () { },
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                stop: function () { }
                            }];
                    }
                    return [4 /*yield*/, LibAV.LibAV()];
                case 3:
                    libav = _b.sent();
                    return [4 /*yield*/, libav.av_frame_alloc()];
                case 4:
                    frame = _b.sent();
                    return [4 /*yield*/, libav.ff_init_filter_graph("anull", {
                            sample_rate: first.value.sample_rate,
                            sample_fmt: first.value.format,
                            channel_layout: first.value.channel_layout
                        }, {
                            sample_rate: ac.sampleRate,
                            sample_fmt: _$audioData_4.LibAVSampleFormat.FLTP,
                            channel_layout: 3
                        })];
                case 5:
                    _a = _b.sent(), buffersrc_ctx = _a[1], buffersink_ctx = _a[2];
                    finished = false;
                    // Filter the first bit
                    first.value.node = null;
                    return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, [first.value])];
                case 6:
                    firstFrames = _b.sent();
                    ret = new AudioWorkletNode(ac, "ennuizel-player", {
                        parameterData: {
                            sampleRate: ac.sampleRate
                        },
                        outputChannelCount: [2]
                    });
                    // Send the first bit
                    ret.port.postMessage({ c: "data", d: firstFrames.map(function (x) { return x.data; }) });
                    first = firstFrames = null;
                    // Associate its port with reading
                    ret.port.onmessage = function (ev) {
                        return ____awaiter_5(this, void 0, void 0, function () {
                            var rawData, frames_1, frames_2;
                            return ____generator_5(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (ev.data.c === "time") {
                                            // Time update
                                            if (opts.status)
                                                opts.status(ev.data.d);
                                            return [2 /*return*/];
                                        }
                                        else if (ev.data.c === "ready") {
                                            // Ready to play
                                            if (opts.ready)
                                                opts.ready();
                                            return [2 /*return*/];
                                        }
                                        else if (ev.data.c === "done") {
                                            // Stream over
                                            if (opts.end)
                                                opts.end();
                                            return [2 /*return*/];
                                        }
                                        else if (ev.data.c !== "read") {
                                            // Unknown!
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, rdr.read()];
                                    case 1:
                                        rawData = _a.sent();
                                        if (!rawData.done) return [3 /*break*/, 5];
                                        if (!!finished) return [3 /*break*/, 3];
                                        finished = true;
                                        return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, [], true)];
                                    case 2:
                                        frames_1 = _a.sent();
                                        ret.port.postMessage({
                                            c: "data",
                                            d: frames_1.length ? frames_1.map(function (x) { return x.data; }) : null
                                        });
                                        return [3 /*break*/, 4];
                                    case 3:
                                        ret.port.postMessage({ c: "data", d: null });
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 7];
                                    case 5:
                                        rawData.value.node = null;
                                        return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, [rawData.value])];
                                    case 6:
                                        frames_2 = _a.sent();
                                        ret.port.postMessage({ c: "data", d: frames_2.map(function (x) { return x.data; }) });
                                        _a.label = 7;
                                    case 7: return [2 /*return*/];
                                }
                            });
                        });
                    };
                    return [2 /*return*/, {
                            node: ret,
                            start: function () {
                                ret.port.postMessage({ c: "play" });
                            },
                            stop: function () {
                                rdr.cancel();
                                libav.terminate();
                            }
                        }];
            }
        });
    });
}
_$audio_5.createSource = createSource;

var _$status_15 = {};
"use strict";
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
Object.defineProperty(_$status_15, "__esModule", { value: true });
_$status_15.popStatus = _$status_15.pushStatus = void 0;
/* removed: var _$ui_20 = require("./ui"); */;
// Current status items
var statusKeys = [];
var statusItems = Object.create(null);
/**
 * Add a status item.
 * @param key  Name of the status item. If this name already exists, the data
 *             will be replaced.
 * @param value  The text of the status item.
 */
function pushStatus(key, value) {
    if (statusKeys.indexOf(key) < 0)
        statusKeys.push(key);
    statusItems[key] = value;
    updateStatus();
}
_$status_15.pushStatus = pushStatus;
/**
 * Remove a status item.
 * @param key  Name of the status item to remove.
 */
function popStatus(key) {
    delete statusItems[key];
    var idx = statusKeys.indexOf(key);
    if (idx >= 0)
        statusKeys.splice(idx, 1);
    updateStatus();
}
_$status_15.popStatus = popStatus;
// Update the status bar
function updateStatus() {
    // Make the full text
    var cont = [];
    for (var _i = 0, statusKeys_1 = statusKeys; _i < statusKeys_1.length; _i++) {
        var key = statusKeys_1[_i];
        cont.push(statusItems[key]);
    }
    if (cont.length === 0)
        cont.push("&nbsp;");
    // And display it
    _$ui_20.ui.status.innerHTML = cont.join("<br/>");
}

var _$bytes_1 = {};
/*!
 * bytes
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015 Jed Watson
 * MIT Licensed
 */

'use strict';

/**
 * Module exports.
 * @public
 */

_$bytes_1 = bytes;
_$bytes_1.format = format;
_$bytes_1.parse = parse;

/**
 * Module variables.
 * @private
 */

var formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;

var formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;

var map = {
  b:  1,
  kb: 1 << 10,
  mb: 1 << 20,
  gb: 1 << 30,
  tb: Math.pow(1024, 4),
  pb: Math.pow(1024, 5),
};

var parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;

/**
 * Convert the given value in bytes into a string or parse to string to an integer in bytes.
 *
 * @param {string|number} value
 * @param {{
 *  case: [string],
 *  decimalPlaces: [number]
 *  fixedDecimals: [boolean]
 *  thousandsSeparator: [string]
 *  unitSeparator: [string]
 *  }} [options] bytes options.
 *
 * @returns {string|number|null}
 */

function bytes(value, options) {
  if (typeof value === 'string') {
    return parse(value);
  }

  if (typeof value === 'number') {
    return format(value, options);
  }

  return null;
}

/**
 * Format the given value in bytes into a string.
 *
 * If the value is negative, it is kept as such. If it is a float,
 * it is rounded.
 *
 * @param {number} value
 * @param {object} [options]
 * @param {number} [options.decimalPlaces=2]
 * @param {number} [options.fixedDecimals=false]
 * @param {string} [options.thousandsSeparator=]
 * @param {string} [options.unit=]
 * @param {string} [options.unitSeparator=]
 *
 * @returns {string|null}
 * @public
 */

function format(value, options) {
  if (!Number.isFinite(value)) {
    return null;
  }

  var mag = Math.abs(value);
  var thousandsSeparator = (options && options.thousandsSeparator) || '';
  var unitSeparator = (options && options.unitSeparator) || '';
  var decimalPlaces = (options && options.decimalPlaces !== undefined) ? options.decimalPlaces : 2;
  var fixedDecimals = Boolean(options && options.fixedDecimals);
  var unit = (options && options.unit) || '';

  if (!unit || !map[unit.toLowerCase()]) {
    if (mag >= map.pb) {
      unit = 'PB';
    } else if (mag >= map.tb) {
      unit = 'TB';
    } else if (mag >= map.gb) {
      unit = 'GB';
    } else if (mag >= map.mb) {
      unit = 'MB';
    } else if (mag >= map.kb) {
      unit = 'KB';
    } else {
      unit = 'B';
    }
  }

  var val = value / map[unit.toLowerCase()];
  var str = val.toFixed(decimalPlaces);

  if (!fixedDecimals) {
    str = str.replace(formatDecimalsRegExp, '$1');
  }

  if (thousandsSeparator) {
    str = str.replace(formatThousandsRegExp, thousandsSeparator);
  }

  return str + unitSeparator + unit;
}

/**
 * Parse the string value into an integer in bytes.
 *
 * If no unit is given, it is assumed the value is in bytes.
 *
 * @param {number|string} val
 *
 * @returns {number|null}
 * @public
 */

function parse(val) {
  if (typeof val === 'number' && !isNaN(val)) {
    return val;
  }

  if (typeof val !== 'string') {
    return null;
  }

  // Test if the string passed is valid
  var results = parseRegExp.exec(val);
  var floatValue;
  var unit = 'b';

  if (!results) {
    // Nothing could be extracted from the given string
    floatValue = parseInt(val, 10);
    unit = 'b'
  } else {
    // Retrieve the value and the unit
    floatValue = parseFloat(results[1]);
    unit = results[4].toLowerCase();
  }

  return Math.floor(map[unit] * floatValue);
}

var _$store_16 = {};
"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ____awaiter_16 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_16 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$store_16, "__esModule", { value: true });
_$store_16.load = _$store_16.store = _$store_16.UndoableStore = _$store_16.Store = void 0;
/* removed: var _$status_15 = require("./status"); */;
/* removed: var _$bytes_1 = require("bytes"); */;
// We don't support undo if our local storage utilization is too high
var noUndo = false;
/**
 * For now, an Ennuizel store is just LocalForage, but eventually it will wrap
 * it with other things.
 */
var Store = /** @class */ (function () {
    function Store(localForage) {
        this.localForage = localForage;
    }
    Store.createInstance = function (opts) {
        return new Store(localforage.createInstance(opts));
    };
    Store.prototype.dropInstance = function (opts) {
        return ____awaiter_16(this, void 0, void 0, function () {
            return ____generator_16(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localForage.dropInstance(opts)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, updateIndicator()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Store.prototype.getItem = function (name) {
        return ____awaiter_16(this, void 0, void 0, function () {
            return ____generator_16(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localForage.getItem(name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Store.prototype.setItem = function (name, value) {
        return ____awaiter_16(this, void 0, void 0, function () {
            var ret;
            return ____generator_16(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localForage.setItem(name, value)];
                    case 1:
                        ret = _a.sent();
                        return [4 /*yield*/, updateIndicator()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    Store.prototype.removeItem = function (name) {
        return ____awaiter_16(this, void 0, void 0, function () {
            var ret;
            return ____generator_16(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localForage.removeItem(name)];
                    case 1:
                        ret = _a.sent();
                        return [4 /*yield*/, updateIndicator()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    Store.prototype.keys = function () {
        return ____awaiter_16(this, void 0, void 0, function () {
            return ____generator_16(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localForage.keys()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Store;
}());
_$store_16.Store = Store;
/**
 * An undoable store is a store with the ability to undo. Only one undoable
 * store can exist at any time.
 */
var UndoableStore = /** @class */ (function (_super) {
    __extends(UndoableStore, _super);
    function UndoableStore(localForage) {
        var _this = _super.call(this, localForage) || this;
        var self = _this;
        _this.undoStore = null;
        _this.undoStorePromise = (function () {
            return ____awaiter_16(this, void 0, void 0, function () {
                return ____generator_16(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, localforage.dropInstance({ name: "ez-undo" })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, updateIndicator()];
                        case 2:
                            _a.sent();
                            self.undoStore = localForage.createInstance({ name: "ez-undo" });
                            return [2 /*return*/];
                    }
                });
            });
        })();
        _this.undos = [];
        _this.ct = 0;
        _this.noUndo = noUndo;
        return _this;
    }
    /**
     * Create an undoable store.
     */
    UndoableStore.createInstance = function (opts) {
        return new UndoableStore(localforage.createInstance(opts));
    };
    /**
     * Set this as an undo point (i.e., if you undo, you'll undo to here)
     */
    UndoableStore.prototype.undoPoint = function () {
        if (!noUndo && !this.noUndo)
            this.undos.push({ c: "undo" });
    };
    /**
     * Drop the undo store.
     */
    UndoableStore.prototype.dropUndo = function () {
        return ____awaiter_16(this, void 0, void 0, function () {
            return ____generator_16(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.undoStorePromise];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, localforage.dropInstance({ name: "ez-undo" })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, updateIndicator()];
                    case 3:
                        _a.sent();
                        this.undos = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Disable undoing.
     */
    UndoableStore.prototype.disableUndo = function () {
        return ____awaiter_16(this, void 0, void 0, function () {
            return ____generator_16(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dropUndo()];
                    case 1:
                        _a.sent();
                        this.noUndo = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set an item and remember the undo steps.
     */
    UndoableStore.prototype.setItem = function (name, value) {
        return ____awaiter_16(this, void 0, void 0, function () {
            var orig, ct;
            return ____generator_16(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getItem(name)];
                    case 1:
                        orig = _a.sent();
                        if (!(!noUndo && !this.noUndo)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.undoStorePromise];
                    case 2:
                        _a.sent();
                        if (!(orig !== null)) return [3 /*break*/, 4];
                        ct = this.ct++;
                        return [4 /*yield*/, this.undoStore.setItem(ct + "", orig)];
                    case 3:
                        _a.sent();
                        this.undos.push({ c: "setItem", n: name, v: ct });
                        return [3 /*break*/, 5];
                    case 4:
                        this.undos.push({ c: "removeItem", n: name });
                        _a.label = 5;
                    case 5: return [4 /*yield*/, _super.prototype.setItem.call(this, name, value)];
                    case 6: 
                    // Then perform the replacement
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Remove an item and remember the undo steps.
     */
    UndoableStore.prototype.removeItem = function (name) {
        return ____awaiter_16(this, void 0, void 0, function () {
            var orig, ct;
            return ____generator_16(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getItem(name)];
                    case 1:
                        orig = _a.sent();
                        if (!(!noUndo && !this.noUndo && orig !== null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.undoStorePromise];
                    case 2:
                        _a.sent();
                        ct = this.ct++;
                        return [4 /*yield*/, this.undoStore.setItem(ct + "", orig)];
                    case 3:
                        _a.sent();
                        this.undos.push({ c: "setItem", n: name, v: ct });
                        _a.label = 4;
                    case 4: return [4 /*yield*/, _super.prototype.removeItem.call(this, name)];
                    case 5: 
                    // Then remove it
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Perform an undo.
     */
    UndoableStore.prototype.undo = function () {
        return ____awaiter_16(this, void 0, void 0, function () {
            var undo, val;
            return ____generator_16(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (noUndo || this.noUndo)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.undoStorePromise];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.undos.length) return [3 /*break*/, 9];
                        undo = this.undos.pop();
                        if (!(undo.c === "undo")) return [3 /*break*/, 3];
                        // An undo point, we're done
                        return [3 /*break*/, 9];
                    case 3:
                        if (!(undo.c === "setItem")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.undoStore.getItem(undo.v + "")];
                    case 4:
                        val = _a.sent();
                        return [4 /*yield*/, _super.prototype.setItem.call(this, undo.n, val)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(undo.c === "removeItem")) return [3 /*break*/, 8];
                        return [4 /*yield*/, _super.prototype.removeItem.call(this, undo.n)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 2];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return UndoableStore;
}(Store));
_$store_16.UndoableStore = UndoableStore;
/**
 * A main, global store.
 */
_$store_16.store = null;
/**
 * Load storage.
 */
function __load_16() {
    return ____awaiter_16(this, void 0, void 0, function () {
        return ____generator_16(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _$store_16.store = new Store(localforage);
                    return [4 /*yield*/, updateIndicator()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$store_16.load = __load_16;
// Update the storage space indicator.
function updateIndicator() {
    return ____awaiter_16(this, void 0, void 0, function () {
        var estimate;
        return ____generator_16(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!navigator.storage || !navigator.storage.estimate)
                        return [2 /*return*/];
                    return [4 /*yield*/, navigator.storage.estimate()];
                case 1:
                    estimate = _a.sent();
                    if (!(!noUndo && estimate.usage / estimate.quota > 0.5)) return [3 /*break*/, 3];
                    noUndo = true;
                    return [4 /*yield*/, localforage.dropInstance({ name: "ez-undo" })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _$status_15.pushStatus("storage", "Storage: " + Math.round(estimate.usage / estimate.quota * 100) + "% (" +
                        _$bytes_1(estimate.usage) + "/" +
                        _$bytes_1(estimate.quota) + ")");
                    return [2 /*return*/];
            }
        });
    });
}

var _$project_13 = {};
"use strict";
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
var ____awaiter_13 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_13 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$project_13, "__esModule", { value: true });
_$project_13.play = _$project_13.disableUndo = _$project_13.undoPoint = _$project_13.deleteProjectById = _$project_13.unloadProject = _$project_13.loadProject = _$project_13.newProject = _$project_13.getProjects = _$project_13.load = _$project_13.project = _$project_13.Project = void 0;
/* removed: var _$audio_5 = require("./audio"); */;
/* removed: var _$audioData_4 = require("./audio-data"); */;
/* removed: var _$export_7 = require("./export"); */;
/* removed: var _$filters_8 = require("./filters"); */;
/* removed: var _$hotkeys_9 = require("./hotkeys"); */;
/* removed: var _$id36_10 = require("./id36"); */;
/* removed: var _$select_14 = require("./select"); */;
/* removed: var _$store_16 = require("./store"); */;
/* removed: var _$stream_17 = require("./stream"); */;
/* removed: var _$track_18 = require("./track"); */;
/* removed: var _$ui_20 = require("./ui"); */;
/* removed: var _$util_21 = require("./util"); */;
// These buttons are disabled when no project is loaded
var projectButtons = ["edit", "tracks", "filters"];
/**
 * An Ennuizel project.
 */
var Project = /** @class */ (function () {
    /**
     * Create a Project.
     * @param id  The ID of the project. Must be unique in the global store.
     * @param opts  Other options.
     */
    function Project(id, opts) {
        if (opts === void 0) { opts = {}; }
        this.id = id;
        if (opts.store) {
            this.store = opts.store;
        }
        else {
            this.store = _$store_16.UndoableStore.createInstance({ name: "ez-project-" + id });
        }
        this.name = opts.name || "";
        this.tracks = [];
    }
    /**
     * Save this project to the store.
     * @param opts  Other options.
     */
    Project.prototype.save = function (opts) {
        if (opts === void 0) { opts = {}; }
        return ____awaiter_13(this, void 0, void 0, function () {
            var _i, _a, track_1;
            return ____generator_13(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // Save the project itself
                    return [4 /*yield*/, this.store.setItem("project-" + this.id, {
                            name: this.name,
                            tracks: this.tracks.map(function (t) { return [t.type(), t.id]; })
                        })];
                    case 1:
                        // Save the project itself
                        _b.sent();
                        if (!opts.deep) return [3 /*break*/, 5];
                        _i = 0, _a = this.tracks;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        track_1 = _a[_i];
                        return [4 /*yield*/, track_1.save({ deep: true })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load this project from the store.
     */
    Project.prototype.load = function () {
        return ____awaiter_13(this, void 0, void 0, function () {
            var p, _i, _a, _b, trackType, trackId, atrack;
            return ____generator_13(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.store.getItem("project-" + this.id)];
                    case 1:
                        p = _c.sent();
                        if (!p)
                            return [2 /*return*/];
                        this.name = p.name;
                        this.tracks = [];
                        _i = 0, _a = p.tracks;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        _b = _a[_i], trackType = _b[0], trackId = _b[1];
                        if (trackType !== _$track_18.TrackType.Audio)
                            throw new Error("Unrecognized track type " + trackType);
                        atrack = new _$audioData_4.AudioTrack(trackId, this);
                        return [4 /*yield*/, atrack.load()];
                    case 3:
                        _c.sent();
                        this.addTrack(atrack);
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete this project.
     */
    Project.prototype.del = function () {
        return ____awaiter_13(this, void 0, void 0, function () {
            return ____generator_13(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // First drop the undo store
                    return [4 /*yield*/, this.store.dropUndo()];
                    case 1:
                        // First drop the undo store
                        _a.sent();
                        // Then delete it
                        return [4 /*yield*/, deleteProjectById(this.id)];
                    case 2:
                        // Then delete it
                        _a.sent();
                        if (!(_$project_13.project === this)) return [3 /*break*/, 4];
                        _$project_13.project = null;
                        return [4 /*yield*/, unloadProject()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new audio track. The track is added to the project if it's not temporary.
     * @param opts  Options for creating the track.
     */
    Project.prototype.newAudioTrack = function (opts) {
        if (opts === void 0) { opts = {}; }
        return ____awaiter_13(this, void 0, void 0, function () {
            var track, _a, _b;
            return ____generator_13(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = _$audioData_4.AudioTrack).bind;
                        return [4 /*yield*/, _$id36_10.genFresh(this.store, "audio-track-")];
                    case 1:
                        track = new (_b.apply(_a, [void 0, _c.sent(), this, opts]))();
                        if (!!opts.temp) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.addTrack(track)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3: return [2 /*return*/, track];
                }
            });
        });
    };
    /**
     * Add a track that's already been created.
     * @param track  The track to add.
     */
    Project.prototype.addTrack = function (track) {
        return ____awaiter_13(this, void 0, void 0, function () {
            var self, name, timeout, del;
            return ____generator_13(this, function (_a) {
                self = this;
                name = _$ui_20.txt(track.info, {
                    className: "row",
                    value: track.name
                });
                timeout = null;
                name.oninput = function (ev) {
                    if (timeout !== null)
                        clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        return ____awaiter_13(this, void 0, void 0, function () {
                            return ____generator_13(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        timeout = null;
                                        return [4 /*yield*/, _$project_13.project.store.undoPoint()];
                                    case 1:
                                        _a.sent();
                                        track.name = ev.target.value;
                                        return [4 /*yield*/, track.save()];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }, 1000);
                };
                del = _$ui_20.btn(track.info, "Delete", { className: "row small" });
                del.onclick = function () {
                    _$ui_20.dialog(function (d, show) {
                        return ____awaiter_13(this, void 0, void 0, function () {
                            var yes, no;
                            return ____generator_13(this, function (_a) {
                                _$ui_20.mk("div", d.box, { innerHTML: "Are you sure?<br/><br/>" });
                                yes = _$hotkeys_9.btn(d, "_Yes, delete this track", { className: "row" });
                                no = _$hotkeys_9.btn(d, "_No, cancel", { className: "row" });
                                no.onclick = function () {
                                    _$ui_20.dialogClose(d);
                                };
                                yes.onclick = function () {
                                    _$ui_20.loading(function () {
                                        return ____awaiter_13(this, void 0, void 0, function () {
                                            return ____generator_13(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, _$project_13.project.store.undoPoint()];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, self.removeTrack(track)];
                                                    case 2:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        });
                                    }, {
                                        reuse: d
                                    });
                                };
                                show(no);
                                return [2 /*return*/];
                            });
                        });
                    }, {
                        closeable: true
                    });
                };
                // And add it to the list
                this.tracks.push(track);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Remove a track. The track is deleted even if it was never actually added
     * to the project, so this is also the way to delete a track.
     * @param track  The track to remove.
     */
    Project.prototype.removeTrack = function (track) {
        return ____awaiter_13(this, void 0, void 0, function () {
            var idx;
            return ____generator_13(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, track.del()];
                    case 1:
                        _a.sent();
                        idx = this.tracks.indexOf(track);
                        if (idx >= 0)
                            this.tracks.splice(idx, 1);
                        return [4 /*yield*/, this.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Project;
}());
_$project_13.Project = Project;
/**
 * The current project, if there is one.
 */
_$project_13.project = null;
/**
 * Load project-related behavior and UI.
 */
function __load_13() {
    return ____awaiter_13(this, void 0, void 0, function () {
        var menu;
        return ____generator_13(this, function (_a) {
            switch (_a.label) {
                case 0:
                    menu = _$ui_20.ui.menu;
                    menu.project.onclick = projectMenu;
                    _$hotkeys_9.registerHotkey(menu.project, null, "p");
                    menu.edit.onclick = editMenu;
                    _$hotkeys_9.registerHotkey(menu.edit, null, "e");
                    menu.tracks.onclick = tracksMenu;
                    _$hotkeys_9.registerHotkey(menu.tracks, null, "t");
                    menu.zoom.onclick = function () {
                        var s = _$ui_20.ui.zoomSelector.style;
                        if (s.display === "block") {
                            s.display = "none";
                        }
                        else {
                            s.display = "block";
                            _$ui_20.ui.zoomSelector.focus();
                        }
                    };
                    _$hotkeys_9.registerHotkey(menu.zoom, null, "z");
                    return [4 /*yield*/, unloadProject()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$project_13.load = __load_13;
/**
 * Get the list of projects.
 */
function getProjects() {
    return ____awaiter_13(this, void 0, void 0, function () {
        var ids, ret, _i, ids_1, id, project_1;
        return ____generator_13(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _$store_16.store.getItem("ez-projects")];
                case 1:
                    ids = (_a.sent()) || [];
                    ret = [];
                    _i = 0, ids_1 = ids;
                    _a.label = 2;
                case 2:
                    if (!(_i < ids_1.length)) return [3 /*break*/, 5];
                    id = ids_1[_i];
                    return [4 /*yield*/, _$store_16.store.getItem("ez-project-" + id)];
                case 3:
                    project_1 = _a.sent();
                    if (project_1)
                        ret.push({ id: id, name: project_1.name });
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, ret];
            }
        });
    });
}
_$project_13.getProjects = getProjects;
/**
 * Show the main project menu.
 */
function projectMenu() {
    _$ui_20.dialog(function (d, show) {
        return ____awaiter_13(this, void 0, void 0, function () {
            var newb, loadb, deleteb, exp;
            return ____generator_13(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newb = _$hotkeys_9.btn(d, "_New project", { className: "row" });
                        newb.onclick = function () { return uiNewProject(d); };
                        return [4 /*yield*/, getProjects()];
                    case 1:
                        // Show the load projects button if there are any to load
                        if ((_a.sent()).length) {
                            loadb = _$hotkeys_9.btn(d, "_Load project", { className: "row" });
                            loadb.onclick = function () { return uiLoadProject(d); };
                        }
                        // Only shown if there's a current project
                        if (_$project_13.project) {
                            deleteb = _$hotkeys_9.btn(d, "_Delete project", { className: "row" });
                            deleteb.onclick = function () { return uiDeleteProject(d); };
                            exp = _$hotkeys_9.btn(d, "_Export audio file", { className: "row" });
                            exp.onclick = function () { return _$export_7.uiExport(d, _$project_13.project.name); };
                        }
                        show(newb);
                        return [2 /*return*/];
                }
            });
        });
    }, {
        closeable: true
    });
}
/**
 * Create a new project (UI).
 */
function uiNewProject(d) {
    _$ui_20.dialog(function (d, show) {
        return ____awaiter_13(this, void 0, void 0, function () {
            function doIt() {
                return ____awaiter_13(this, void 0, void 0, function () {
                    return ____generator_13(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (nm.value.trim() === "") {
                                    nm.focus();
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, _$ui_20.loading(function () {
                                        return ____awaiter_13(this, void 0, void 0, function () {
                                            var name, existing, _i, _a, project_2;
                                            return ____generator_13(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0: return [4 /*yield*/, unloadProject()];
                                                    case 1:
                                                        _b.sent();
                                                        name = nm.value.trim();
                                                        existing = false;
                                                        _i = 0;
                                                        return [4 /*yield*/, getProjects()];
                                                    case 2:
                                                        _a = _b.sent();
                                                        _b.label = 3;
                                                    case 3:
                                                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                                                        project_2 = _a[_i];
                                                        if (project_2.name.toLowerCase() === name.toLowerCase()) {
                                                            existing = true;
                                                            return [3 /*break*/, 5];
                                                        }
                                                        _b.label = 4;
                                                    case 4:
                                                        _i++;
                                                        return [3 /*break*/, 3];
                                                    case 5:
                                                        if (!existing) return [3 /*break*/, 7];
                                                        return [4 /*yield*/, _$ui_20.alert("There's already a project with that name!")];
                                                    case 6:
                                                        _b.sent();
                                                        return [3 /*break*/, 9];
                                                    case 7: return [4 /*yield*/, newProject(name)];
                                                    case 8:
                                                        _b.sent();
                                                        _b.label = 9;
                                                    case 9: return [2 /*return*/];
                                                }
                                            });
                                        });
                                    }, {
                                        reuse: d
                                    })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            var nm, neww;
            return ____generator_13(this, function (_a) {
                _$ui_20.lbl(d.box, "project-name", "Project name:&nbsp;");
                nm = _$ui_20.txt(d.box, { id: "project-name" });
                neww = _$hotkeys_9.btn(d, "_New project");
                nm.onkeydown = function (ev) {
                    if (ev.key === "Enter") {
                        ev.preventDefault();
                        doIt();
                        return;
                    }
                };
                neww.onclick = function () {
                    doIt();
                };
                show(nm);
                return [2 /*return*/];
            });
        });
    }, {
        reuse: d,
        closeable: true
    });
}
/**
 * Create a new project.
 * @param name  Name for the project.
 */
function newProject(name) {
    return ____awaiter_13(this, void 0, void 0, function () {
        var _a, id, projects;
        return ____generator_13(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, unloadProject()];
                case 1:
                    _b.sent();
                    _a = Project.bind;
                    return [4 /*yield*/, _$id36_10.genFresh(_$store_16.store, "ez-project-")];
                case 2:
                    // Create this project
                    _$project_13.project = new (_a.apply(Project, [void 0, _b.sent()]))();
                    id = _$project_13.project.id;
                    return [4 /*yield*/, _$store_16.store.setItem("ez-project-" + id, { name: name })];
                case 3:
                    _b.sent();
                    _$project_13.project.name = name;
                    return [4 /*yield*/, _$project_13.project.save()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, _$store_16.store.getItem("ez-projects")];
                case 5:
                    projects = (_b.sent()) || [];
                    projects.push(_$project_13.project.id);
                    return [4 /*yield*/, _$store_16.store.setItem("ez-projects", projects)];
                case 6:
                    _b.sent();
                    // Then load it (since loading knows how to open it)
                    _$project_13.project = null;
                    return [4 /*yield*/, loadProject(id)];
                case 7: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
_$project_13.newProject = newProject;
/**
 * Load a project (UI).
 */
function uiLoadProject(d) {
    _$ui_20.dialog(function (d, show) {
        return ____awaiter_13(this, void 0, void 0, function () {
            var projects, first, _i, projects_1, project_3;
            return ____generator_13(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getProjects()];
                    case 1:
                        projects = _a.sent();
                        first = null;
                        for (_i = 0, projects_1 = projects; _i < projects_1.length; _i++) {
                            project_3 = projects_1[_i];
                            (function (project) {
                                var btn = _$ui_20.btn(d.box, project.name, { className: "row nouppercase" });
                                if (!first)
                                    first = btn;
                                btn.onclick = function () {
                                    return ____awaiter_13(this, void 0, void 0, function () {
                                        return ____generator_13(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, _$ui_20.loading(function () {
                                                        return ____awaiter_13(this, void 0, void 0, function () {
                                                            return ____generator_13(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, loadProject(project.id)];
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
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    });
                                };
                            })(project_3);
                        }
                        show(first);
                        return [2 /*return*/];
                }
            });
        });
    }, {
        reuse: d,
        closeable: true
    });
}
/**
 * Load a project by ID.
 * @param id  ID of the project.
 */
function loadProject(id, store) {
    return ____awaiter_13(this, void 0, void 0, function () {
        var _i, projectButtons_1, nm, b;
        return ____generator_13(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, unloadProject()];
                case 1:
                    _a.sent();
                    // Create and load this project
                    _$project_13.project = new Project(id, { store: store });
                    return [4 /*yield*/, _$project_13.project.load()];
                case 2:
                    _a.sent();
                    // Free up the buttons
                    for (_i = 0, projectButtons_1 = projectButtons; _i < projectButtons_1.length; _i++) {
                        nm = projectButtons_1[_i];
                        b = _$ui_20.ui.menu[nm];
                        b.classList.remove("off");
                        b.disabled = false;
                    }
                    return [2 /*return*/, _$project_13.project];
            }
        });
    });
}
_$project_13.loadProject = loadProject;
/**
 * Unload the current project, if one is loaded.
 */
function unloadProject() {
    return ____awaiter_13(this, void 0, void 0, function () {
        var _i, projectButtons_2, nm, b;
        return ____generator_13(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!_$project_13.project) return [3 /*break*/, 2];
                    // Remove the undo info
                    return [4 /*yield*/, _$project_13.project.store.dropUndo()];
                case 1:
                    // Remove the undo info
                    _a.sent();
                    _$project_13.project = null;
                    _a.label = 2;
                case 2:
                    // Clear out the former selections
                    _$select_14.clearSelectables();
                    // Clear out the UI
                    _$ui_20.ui.main.innerHTML = "";
                    for (_i = 0, projectButtons_2 = projectButtons; _i < projectButtons_2.length; _i++) {
                        nm = projectButtons_2[_i];
                        b = _$ui_20.ui.menu[nm];
                        b.classList.add("off");
                        b.disabled = true;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
_$project_13.unloadProject = unloadProject;
/**
 * Reload the current project. Useful for undos.
 */
function reloadProject() {
    return ____awaiter_13(this, void 0, void 0, function () {
        var id, store;
        return ____generator_13(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = _$project_13.project.id;
                    store = _$project_13.project.store;
                    _$project_13.project = null;
                    return [4 /*yield*/, unloadProject()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loadProject(id, store)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Delete a project by ID. You can delete the *current* project with
 * its del() method.
 * @param id  ID of the project to delete.
 */
function deleteProjectById(id) {
    return ____awaiter_13(this, void 0, void 0, function () {
        var projects, idx;
        return ____generator_13(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // First drop the store
                return [4 /*yield*/, _$store_16.store.dropInstance({ name: "ez-project-" + id })];
                case 1:
                    // First drop the store
                    _a.sent();
                    // Then drop the ref in the main store
                    return [4 /*yield*/, _$store_16.store.removeItem("ez-project-" + id)];
                case 2:
                    // Then drop the ref in the main store
                    _a.sent();
                    return [4 /*yield*/, _$store_16.store.getItem("ez-projects")];
                case 3:
                    projects = (_a.sent()) || [];
                    idx = projects.indexOf(id);
                    if (!(idx >= 0)) return [3 /*break*/, 5];
                    projects.splice(idx, 1);
                    return [4 /*yield*/, _$store_16.store.setItem("ez-projects", projects)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
_$project_13.deleteProjectById = deleteProjectById;
/**
 * Show the edit menu.
 */
function editMenu() {
    _$ui_20.dialog(function (d, show) {
        return ____awaiter_13(this, void 0, void 0, function () {
            var undo, selAll, selAllTracks;
            return ____generator_13(this, function (_a) {
                undo = _$hotkeys_9.btn(d, "_Undo (Ctrl+Z)", { className: "row" });
                selAll = _$hotkeys_9.btn(d, "Select _all (Ctrl+A)", { className: "row" });
                selAllTracks = _$hotkeys_9.btn(d, "Select all _tracks (Ctrl+Alt+A)", { className: "row" });
                undo.onclick = function () {
                    return ____awaiter_13(this, void 0, void 0, function () {
                        return ____generator_13(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, performUndo()];
                                case 1:
                                    _a.sent();
                                    _$ui_20.dialogClose(d);
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                selAll.onclick = function () {
                    return ____awaiter_13(this, void 0, void 0, function () {
                        return ____generator_13(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, _$select_14.selectAll()];
                                case 1:
                                    _a.sent();
                                    _$ui_20.dialogClose(d);
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                selAllTracks.onclick = function () {
                    return ____awaiter_13(this, void 0, void 0, function () {
                        return ____generator_13(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, _$select_14.selectAll({ tracksOnly: true })];
                                case 1:
                                    _a.sent();
                                    _$ui_20.dialogClose(d);
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                show(undo);
                return [2 /*return*/];
            });
        });
    }, {
        closeable: true
    });
}
/**
 * Mark this as an undo point.
 */
function undoPoint() {
    if (_$project_13.project)
        _$project_13.project.store.undoPoint();
}
_$project_13.undoPoint = undoPoint;
/**
 * Disable undo for the currently loaded project.
 */
function disableUndo() {
    return ____awaiter_13(this, void 0, void 0, function () {
        return ____generator_13(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!_$project_13.project) return [3 /*break*/, 2];
                    return [4 /*yield*/, _$project_13.project.store.disableUndo()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
_$project_13.disableUndo = disableUndo;
/**
 * Perform an undo.
 */
function performUndo() {
    return ____awaiter_13(this, void 0, void 0, function () {
        return ____generator_13(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _$ui_20.loading(function () {
                        return ____awaiter_13(this, void 0, void 0, function () {
                            return ____generator_13(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, _$project_13.project.store.undo()];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, reloadProject()];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Show the "tracks" menu.
 */
function tracksMenu() {
    function dynaudnorm(x) {
        return ____awaiter_13(this, void 0, void 0, function () {
            return ____generator_13(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _$filters_8.ffmpegStream(x, "dynaudnorm")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    _$ui_20.dialog(function (d, show) {
        return ____awaiter_13(this, void 0, void 0, function () {
            var load, mix, mixKeep, mixLevel, mixLevelKeep;
            return ____generator_13(this, function (_a) {
                load = _$hotkeys_9.btn(d, "_Load track(s) from file", { className: "row" });
                load.onclick = function () { return uiLoadFile(d); };
                mix = _$hotkeys_9.btn(d, "Mi_x selected tracks", { className: "row" });
                mix.onclick = function () { return uiMix(d, false); };
                mixKeep = _$hotkeys_9.btn(d, "_Mix selected tracks into new track", { className: "row" });
                mixKeep.onclick = function () { return uiMix(d, true); };
                mixLevel = _$hotkeys_9.btn(d, "Mix and le_vel selected tracks", { className: "row" });
                mixLevel.onclick = function () { return uiMix(d, false, { preFilter: dynaudnorm, postFilter: dynaudnorm }); };
                mixLevelKeep = _$hotkeys_9.btn(d, "M_ix and level selected tracks into new track", { className: "row" });
                mixLevelKeep.onclick = function () { return uiMix(d, true, { preFilter: dynaudnorm, postFilter: dynaudnorm }); };
                show(load);
                return [2 /*return*/];
            });
        });
    }, {
        closeable: true
    });
}
/**
 * Load a file into tracks (UI).
 */
function uiLoadFile(d) {
    _$ui_20.dialog(function (d, show) {
        return ____awaiter_13(this, void 0, void 0, function () {
            var file;
            return ____generator_13(this, function (_a) {
                _$ui_20.lbl(d.box, "load-file", "Audio file:&nbsp;");
                file = _$ui_20.mk("input", d.box, { id: "load-file", type: "file" });
                file.onchange = function () {
                    return ____awaiter_13(this, void 0, void 0, function () {
                        return ____generator_13(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!file.files.length)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, _$ui_20.loading(function (ld) {
                                            return ____awaiter_13(this, void 0, void 0, function () {
                                                var ex_1;
                                                return ____generator_13(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            // Make sure we can undo
                                                            _$project_13.project.store.undoPoint();
                                                            _a.label = 1;
                                                        case 1:
                                                            _a.trys.push([1, 3, , 9]);
                                                            return [4 /*yield*/, loadFile(file.files[0].name, file.files[0], {
                                                                    status: function (cur, duration) {
                                                                        var txt = "Loading... " + _$util_21.timestamp(cur);
                                                                        if (duration) {
                                                                            txt += "/" + _$util_21.timestamp(duration) +
                                                                                " (" + ~~(cur / duration * 100) + "%)";
                                                                        }
                                                                        ld.box.innerHTML = txt;
                                                                    }
                                                                })];
                                                        case 2:
                                                            _a.sent();
                                                            return [3 /*break*/, 9];
                                                        case 3:
                                                            ex_1 = _a.sent();
                                                            if (!ex_1.stack) return [3 /*break*/, 5];
                                                            return [4 /*yield*/, _$ui_20.alert(ex_1.stack)];
                                                        case 4:
                                                            _a.sent();
                                                            return [3 /*break*/, 7];
                                                        case 5: return [4 /*yield*/, _$ui_20.alert(ex_1 + "")];
                                                        case 6:
                                                            _a.sent();
                                                            _a.label = 7;
                                                        case 7: return [4 /*yield*/, performUndo()];
                                                        case 8:
                                                            _a.sent();
                                                            return [3 /*break*/, 9];
                                                        case 9: return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        }, {
                                            reuse: d
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                show(file);
                return [2 /*return*/];
            });
        });
    }, {
        reuse: d,
        closeable: true
    });
}
/**
 * Load a file into tracks.
 * @param fileName  The name of the file.
 * @param raw  The file, as a Blob.
 * @param opts  Other options.
 */
function loadFile(fileName, raw, opts) {
    if (opts === void 0) { opts = {}; }
    return ____awaiter_13(this, void 0, void 0, function () {
        var fileReader, header, chunk, h2, libav, _a, fmt_ctx, streams, pkt, libavReader, duration, audioStreams, demuxerControllers, demuxers, _loop_1, _i, streams_1, stream, baseName, audioTracks, trackPromises, _loop_2, _b, audioStreams_1, stream;
        return ____generator_13(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fileReader = raw.stream().getReader();
                    header = new Uint8Array(0);
                    _c.label = 1;
                case 1:
                    if (!(header.length < 1024 * 1024)) return [3 /*break*/, 3];
                    return [4 /*yield*/, fileReader.read()];
                case 2:
                    chunk = _c.sent();
                    if (chunk.done)
                        return [3 /*break*/, 3];
                    h2 = new Uint8Array(header.length + chunk.value.length);
                    h2.set(header);
                    h2.set(chunk.value, header.length);
                    header = h2;
                    return [3 /*break*/, 1];
                case 3: return [4 /*yield*/, LibAV.LibAV()];
                case 4:
                    libav = _c.sent();
                    return [4 /*yield*/, libav.mkreaderdev("tmp.in")];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, libav.ff_reader_dev_send("tmp.in", header)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, libav.ff_init_demuxer_file("tmp.in")];
                case 7:
                    _a = _c.sent(), fmt_ctx = _a[0], streams = _a[1];
                    return [4 /*yield*/, libav.av_packet_alloc()];
                case 8:
                    pkt = _c.sent();
                    libavReader = new _$stream_17.WSPReadableStream({
                        pull: function (controller) {
                            return ____awaiter_13(this, void 0, void 0, function () {
                                var _a, res, packets, done, chunk;
                                return ____generator_13(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!true) return [3 /*break*/, 7];
                                            return [4 /*yield*/, libav.ff_read_multi(fmt_ctx, pkt, "tmp.in", { devLimit: 1024 * 1024 })];
                                        case 1:
                                            _a = _b.sent(), res = _a[0], packets = _a[1];
                                            done = false;
                                            if (packets && Object.keys(packets).length) {
                                                controller.enqueue(packets);
                                                done = true;
                                            }
                                            if (!(res === -libav.EAGAIN)) return [3 /*break*/, 5];
                                            if (!!done) return [3 /*break*/, 4];
                                            return [4 /*yield*/, fileReader.read()];
                                        case 2:
                                            chunk = _b.sent();
                                            return [4 /*yield*/, libav.ff_reader_dev_send("tmp.in", chunk.done ? null : chunk.value)];
                                        case 3:
                                            _b.sent();
                                            _b.label = 4;
                                        case 4: return [3 /*break*/, 6];
                                        case 5:
                                            if (res === libav.AVERROR_EOF) {
                                                // EOF
                                                controller.close();
                                                done = true;
                                            }
                                            else if (res !== 0) {
                                                throw new Error("Error reading: " + res);
                                            }
                                            _b.label = 6;
                                        case 6:
                                            if (done)
                                                return [3 /*break*/, 7];
                                            return [3 /*break*/, 0];
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                    }, {
                        highWaterMark: 4
                    }).getReader();
                    duration = 0;
                    audioStreams = [];
                    demuxerControllers = Object.create(null);
                    demuxers = Object.create(null);
                    _loop_1 = function (stream) {
                        if (stream.codec_type !== libav.AVMEDIA_TYPE_AUDIO)
                            return "continue";
                        duration = Math.max(stream.duration, duration);
                        audioStreams.push(stream);
                        demuxers[stream.index] = new _$stream_17.WSPReadableStream({
                            start: function (controller) {
                                demuxerControllers[stream.index] = controller;
                            },
                            pull: function () {
                                return ____awaiter_13(this, void 0, void 0, function () {
                                    var packets, gotThis, idx;
                                    return ____generator_13(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!true) return [3 /*break*/, 2];
                                                return [4 /*yield*/, libavReader.read()];
                                            case 1:
                                                packets = _a.sent();
                                                if (packets.done) {
                                                    demuxerControllers[stream.index].close();
                                                    return [3 /*break*/, 2];
                                                }
                                                else {
                                                    gotThis = false;
                                                    for (idx in packets.value) {
                                                        if (demuxerControllers[+idx])
                                                            demuxerControllers[+idx].enqueue(packets.value[idx]);
                                                        if (idx === stream.index)
                                                            gotThis = true;
                                                    }
                                                    if (gotThis)
                                                        return [3 /*break*/, 2];
                                                }
                                                return [3 /*break*/, 0];
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                        }, {
                            highWaterMark: 4
                        }).getReader();
                    };
                    for (_i = 0, streams_1 = streams; _i < streams_1.length; _i++) {
                        stream = streams_1[_i];
                        _loop_1(stream);
                    }
                    baseName = fileName.replace(/\..*/, "");
                    audioTracks = Object.create(null);
                    trackPromises = [];
                    _loop_2 = function (stream) {
                        var trackName, track_2, _d, c, pkt_1, frame, filter_graph, buffersrc_ctx, buffersink_ctx, reader;
                        return ____generator_13(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    trackName = baseName + ((audioStreams.length <= 1) ? "" : ("-" + (stream.index + 1)));
                                    return [4 /*yield*/, _$project_13.project.newAudioTrack({ name: trackName })];
                                case 1:
                                    track_2 = _e.sent();
                                    audioTracks[stream.index] = track_2;
                                    return [4 /*yield*/, libav.ff_init_decoder(stream.codec_id, stream.codecpar)];
                                case 2:
                                    _d = _e.sent(), c = _d[1], pkt_1 = _d[2], frame = _d[3];
                                    reader = new _$stream_17.WSPReadableStream({
                                        pull: function (controller) {
                                            return ____awaiter_13(this, void 0, void 0, function () {
                                                var packets, frames_1, channel_layout, rframes, _i, rframes_1, frame_1;
                                                var _a;
                                                return ____generator_13(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            if (!true) return [3 /*break*/, 7];
                                                            return [4 /*yield*/, demuxers[stream.index].read()];
                                                        case 1:
                                                            packets = _b.sent();
                                                            return [4 /*yield*/, libav.ff_decode_multi(c, pkt_1, frame, packets.done ? [] : packets.value, packets.done)];
                                                        case 2:
                                                            frames_1 = _b.sent();
                                                            if (!frames_1.length) return [3 /*break*/, 6];
                                                            if (!!filter_graph) return [3 /*break*/, 4];
                                                            track_2.format = _$audioData_4.fromPlanar(frames_1[0].format);
                                                            track_2.sampleRate = frames_1[0].sample_rate;
                                                            track_2.channels = frames_1[0].channels;
                                                            channel_layout = _$audioData_4.toChannelLayout(track_2.channels);
                                                            return [4 /*yield*/, libav.ff_init_filter_graph("anull", {
                                                                    sample_rate: track_2.sampleRate,
                                                                    sample_fmt: frames_1[0].format,
                                                                    channel_layout: channel_layout
                                                                }, {
                                                                    sample_rate: track_2.sampleRate,
                                                                    sample_fmt: track_2.format,
                                                                    channel_layout: channel_layout
                                                                })];
                                                        case 3:
                                                            _a = _b.sent(), filter_graph = _a[0], buffersrc_ctx = _a[1], buffersink_ctx = _a[2];
                                                            _b.label = 4;
                                                        case 4: return [4 /*yield*/, libav.ff_filter_multi(buffersrc_ctx, buffersink_ctx, frame, frames_1, packets.done)];
                                                        case 5:
                                                            rframes = _b.sent();
                                                            for (_i = 0, rframes_1 = rframes; _i < rframes_1.length; _i++) {
                                                                frame_1 = rframes_1[_i];
                                                                controller.enqueue(frame_1);
                                                            }
                                                            // Tell the host
                                                            if (opts.status) {
                                                                opts.status(frames_1[frames_1.length - 1].pts *
                                                                    stream.time_base_num / stream.time_base_den, duration);
                                                            }
                                                            if (rframes.length) {
                                                                if (packets.done)
                                                                    controller.close();
                                                                return [3 /*break*/, 7];
                                                            }
                                                            _b.label = 6;
                                                        case 6:
                                                            if (packets.done) {
                                                                controller.close();
                                                                return [3 /*break*/, 7];
                                                            }
                                                            return [3 /*break*/, 0];
                                                        case 7: return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        }
                                    });
                                    // And start it reading
                                    trackPromises.push(track_2.append(new _$stream_17.EZStream(reader)));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b = 0, audioStreams_1 = audioStreams;
                    _c.label = 9;
                case 9:
                    if (!(_b < audioStreams_1.length)) return [3 /*break*/, 12];
                    stream = audioStreams_1[_b];
                    return [5 /*yield**/, _loop_2(stream)];
                case 10:
                    _c.sent();
                    _c.label = 11;
                case 11:
                    _b++;
                    return [3 /*break*/, 9];
                case 12: 
                // Now wait for all the tracks
                return [4 /*yield*/, Promise.all(trackPromises)];
                case 13:
                    // Now wait for all the tracks
                    _c.sent();
                    libav.terminate();
                    // And save it
                    return [4 /*yield*/, _$project_13.project.save()];
                case 14:
                    // And save it
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Mix the selected tracks (UI).
 * @param d  Optional dialog in which to show progress.
 * @param keep  Keep the original tracks (don't delete them).
 * @param opts  Other mix options.
 */
function uiMix(d, keep, opts) {
    if (opts === void 0) { opts = {}; }
    _$ui_20.loading(function (d) {
        return ____awaiter_13(this, void 0, void 0, function () {
            var sel, outTrack, _i, _a, inTrack;
            return ____generator_13(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sel = _$select_14.getSelection();
                        // This is an undo point
                        _$project_13.project.store.undoPoint();
                        return [4 /*yield*/, _$filters_8.mixTracks(sel, d, opts)];
                    case 1:
                        outTrack = _b.sent();
                        if (!outTrack)
                            return [2 /*return*/];
                        // Add the new track
                        _$project_13.project.addTrack(outTrack);
                        if (!!keep) return [3 /*break*/, 5];
                        _i = 0, _a = sel.tracks;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        inTrack = _a[_i];
                        if (!(inTrack.type() === _$track_18.TrackType.Audio)) return [3 /*break*/, 4];
                        return [4 /*yield*/, _$project_13.project.removeTrack(inTrack)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, {
        reuse: d
    });
}
/**
 * Delete a project (UI).
 */
function uiDeleteProject(d) {
    _$ui_20.dialog(function (d, show) {
        return ____awaiter_13(this, void 0, void 0, function () {
            var yesb, nob, yes;
            return ____generator_13(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _$ui_20.mk("div", d.box, { innerHTML: "Are you sure? This will delete project data in the browser (but will not delete any saved files or data on any servers).<br/><br/>" });
                        yesb = _$hotkeys_9.btn(d, "_Yes, delete the project", { className: "row" });
                        nob = _$hotkeys_9.btn(d, "_No, cancel", { className: "row" });
                        show(nob);
                        return [4 /*yield*/, new Promise(function (res) {
                                yesb.onclick = function () { return res(true); };
                                nob.onclick = function () { return res(false); };
                            })];
                    case 1:
                        yes = _a.sent();
                        if (!yes) return [3 /*break*/, 3];
                        return [4 /*yield*/, _$ui_20.loading(function () {
                                return ____awaiter_13(this, void 0, void 0, function () {
                                    return ____generator_13(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, _$project_13.project.del()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            }, {
                                reuse: d
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, {
        reuse: d
    });
}
/**
 * Callback to stop the current playback, if there is one.
 */
var stopPlayback = null;
/**
 * Play the selected audio.
 */
function play() {
    return ____awaiter_13(this, void 0, void 0, function () {
        return ____generator_13(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Override stopPlayback during loading
                    stopPlayback = function () { return void 0; };
                    return [4 /*yield*/, _$ui_20.loading(function () {
                            return ____awaiter_13(this, void 0, void 0, function () {
                                var ac, sel, streamOpts, audioTracks, longest, longestLen, _i, audioTracks_1, track_3, dur, streams, readyCt, readyRes, readyPromise, playing, sourcePromises, i, track_4, stream, ready, end, sources, _a, sources_1, source, _b, sources_2, source;
                                return ____generator_13(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, _$audio_5.getAudioContext()];
                                        case 1:
                                            ac = _c.sent();
                                            sel = _$select_14.getSelection();
                                            streamOpts = {
                                                start: sel.start
                                            };
                                            if (sel.range)
                                                streamOpts.end = sel.end;
                                            audioTracks = _$project_13.project.tracks.filter(function (x) { return x.type() === _$track_18.TrackType.Audio; });
                                            longest = null;
                                            longestLen = 0;
                                            for (_i = 0, audioTracks_1 = audioTracks; _i < audioTracks_1.length; _i++) {
                                                track_3 = audioTracks_1[_i];
                                                dur = track_3.duration();
                                                if (dur > longestLen) {
                                                    longest = track_3;
                                                    longestLen = dur;
                                                }
                                            }
                                            return [4 /*yield*/, Promise.all(audioTracks.map(function (x) { return x.stream(streamOpts); }))];
                                        case 2:
                                            streams = _c.sent();
                                            readyCt = 0;
                                            readyRes = null;
                                            readyPromise = new Promise(function (res) { return readyRes = res; });
                                            playing = streams.length;
                                            sourcePromises = [];
                                            for (i = 0; i < streams.length; i++) {
                                                track_4 = audioTracks[i];
                                                stream = streams[i];
                                                ready = function () {
                                                    if (++readyCt === streams.length)
                                                        readyRes(null);
                                                };
                                                end = function () {
                                                    if (playing) {
                                                        playing--;
                                                        if (!playing && stopPlayback)
                                                            stopPlayback();
                                                    }
                                                };
                                                if (track_4 === longest) {
                                                    // This is the longest track, so use its timestamps
                                                    sourcePromises.push(_$audio_5.createSource(stream, {
                                                        status: function (ts) {
                                                            if (playing)
                                                                _$select_14.setPlayHead(sel.start + ts / ac.sampleRate);
                                                        },
                                                        ready: ready,
                                                        end: end
                                                    }));
                                                }
                                                else {
                                                    sourcePromises.push(_$audio_5.createSource(stream, { ready: ready, end: end }));
                                                }
                                            }
                                            return [4 /*yield*/, Promise.all(sourcePromises)];
                                        case 3:
                                            sources = _c.sent();
                                            // Wait until they're all ready
                                            return [4 /*yield*/, readyPromise];
                                        case 4:
                                            // Wait until they're all ready
                                            _c.sent();
                                            // Prepare to *stop* playback
                                            stopPlayback = function () {
                                                playing = 0;
                                                for (var _i = 0, sources_3 = sources; _i < sources_3.length; _i++) {
                                                    var source = sources_3[_i];
                                                    source.node.disconnect(ac.destination);
                                                    source.stop();
                                                }
                                                _$select_14.setPlayHead(null);
                                                stopPlayback = null;
                                            };
                                            // Connect them all
                                            for (_a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
                                                source = sources_1[_a];
                                                source.node.connect(ac.destination);
                                            }
                                            // And play them all
                                            for (_b = 0, sources_2 = sources; _b < sources_2.length; _b++) {
                                                source = sources_2[_b];
                                                source.start();
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
_$project_13.play = play;
// Project-level hotkeys
window.addEventListener("keydown", function (ev) {
    return ____awaiter_13(this, void 0, void 0, function () {
        var el;
        return ____generator_13(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!_$project_13.project)
                        return [2 /*return*/];
                    // No hotkeys if dialogs are up
                    if (_$ui_20.ui.dialogs.length)
                        return [2 /*return*/];
                    if (!(ev.key === " ")) return [3 /*break*/, 4];
                    el = ev.target;
                    if (el.tagName === "BUTTON" ||
                        el.tagName === "A" ||
                        el.tagName === "INPUT")
                        return [2 /*return*/];
                    ev.preventDefault();
                    if (!stopPlayback) return [3 /*break*/, 1];
                    stopPlayback();
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, play()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    if (ev.key === "z" && ev.ctrlKey) {
                        // Undo
                        ev.preventDefault();
                        performUndo();
                    }
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
});

var _$plugins_12 = {};
"use strict";
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
var ____awaiter_12 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_12 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$plugins_12, "__esModule", { value: true });
_$plugins_12.getPlugins = _$plugins_12.loadPlugin = _$plugins_12.load = _$plugins_12.haveUserDefinedPlugins = void 0;
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../ennuizel.d.ts" />
/* removed: var _$audioData_4 = require("./audio-data"); */;
/* removed: var _$export_7 = require("./export"); */;
/* removed: var _$filters_8 = require("./filters"); */;
/* removed: var _$hotkeys_9 = require("./hotkeys"); */;
/* removed: var _$project_13 = require("./project"); */;
/* removed: var _$select_14 = require("./select"); */;
/* removed: var _$stream_17 = require("./stream"); */;
/* removed: var _$track_18 = require("./track"); */;
/* removed: var _$ui_20 = require("./ui"); */;
/* removed: var _$util_21 = require("./util"); */;
// If we have user-defined plugins, say so
_$plugins_12.haveUserDefinedPlugins = false;
// All loaded plugins
var plugins = Object.create(null);
// The URL of the plugin currently being loaded
var currentPluginURL = null;
// Most recently registered plugin
var registeredPlugin = null;
/**
 * Load the plugin API.
 */
function __load_12() {
    return ____awaiter_12(this, void 0, void 0, function () {
        return ____generator_12(this, function (_a) {
            Ennuizel = {
                registerPlugin: registerPlugin,
                loadPlugin: loadPlugin,
                getPlugin: getPlugin,
                ReadableStream: _$stream_17.WSPReadableStream,
                EZStream: _$stream_17.EZStream,
                filters: _$filters_8,
                util: _$util_21,
                hotkeys: _$hotkeys_9,
                ui: _$ui_20,
                select: _$select_14,
                TrackType: _$track_18.TrackType,
                LibAVSampleFormat: _$audioData_4.LibAVSampleFormat,
                toPlanar: _$audioData_4.toPlanar,
                fromPlanar: _$audioData_4.fromPlanar,
                newProject: _$project_13.newProject,
                getProjects: _$project_13.getProjects,
                loadProject: _$project_13.loadProject,
                unloadProject: _$project_13.unloadProject,
                deleteProjectById: _$project_13.deleteProjectById,
                undoPoint: _$project_13.undoPoint,
                disableUndo: _$project_13.disableUndo,
                standardExports: _$export_7.standardExports,
                exportAudio: _$export_7.exportAudio
            };
            return [2 /*return*/];
        });
    });
}
_$plugins_12.load = __load_12;
/**
 * Call this to register your plugin. Every plugin *must* call this.
 * @param plugin  The plugin to register.
 */
function registerPlugin(plugin) {
    registeredPlugin = plugin;
    plugin.url = currentPluginURL;
}
/**
 * Load a plugin by URL. Returns null if the plugin cannot be loaded.
 * @param url  The absolute URL (protocol optional) from which to load
 *             the plugin.
 * @param opts  Other options.
 */
function loadPlugin(url, opts) {
    if (opts === void 0) { opts = {}; }
    return ____awaiter_12(this, void 0, void 0, function () {
        var prevPlugin, prevURL, response, ex_1, ex_2, ret, ex_3;
        return ____generator_12(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (opts.userDefined)
                        _$plugins_12.haveUserDefinedPlugins = true;
                    // Sanitize the URL
                    if (url.indexOf("://") < 0)
                        url = "https://" + url;
                    prevPlugin = registeredPlugin;
                    prevURL = currentPluginURL;
                    currentPluginURL = url;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            cache: "no-cache"
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    ex_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _a.trys.push([5, 7, , 9]);
                    return [4 /*yield*/, _$ui_20.loadLibrary(url)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7:
                    ex_2 = _a.sent();
                    // Report what went wrong
                    return [4 /*yield*/, _$ui_20.alert("Error loading plugin " + url + ": " + ex_2)];
                case 8:
                    // Report what went wrong
                    _a.sent();
                    return [3 /*break*/, 9];
                case 9:
                    ret = registeredPlugin;
                    registeredPlugin = prevPlugin;
                    currentPluginURL = prevURL;
                    if (!ret) return [3 /*break*/, 15];
                    if (!ret.load) return [3 /*break*/, 14];
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, 12, , 14]);
                    return [4 /*yield*/, ret.load()];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 12:
                    ex_3 = _a.sent();
                    return [4 /*yield*/, _$ui_20.alert("Error loading plugin " + ret.name + ": " + ex_3)];
                case 13:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 14: return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, _$ui_20.alert("Plugin " + url + " failed to register itself!")];
                case 16:
                    _a.sent();
                    _a.label = 17;
                case 17:
                    plugins[ret.id] = ret;
                    return [2 /*return*/, ret];
            }
        });
    });
}
_$plugins_12.loadPlugin = loadPlugin;
/**
 * Get all loaded plugins.
 */
function getPlugins() {
    var ret = [];
    for (var id in plugins)
        ret.push(plugins[id]);
    return ret;
}
_$plugins_12.getPlugins = getPlugins;
/**
 * Get the loaded plugin with this ID, if such a plugin has been
 * loaded.
 * @param id  The ID of the plugin.
 */
function getPlugin(id) {
    return plugins[id] || null;
}

var _$main_11 = {};
"use strict";
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
var ____awaiter_11 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ____generator_11 = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(_$main_11, "__esModule", { value: true });
_$main_11.project = _$main_11.ui = void 0;
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../ennuizel.d.ts" />
// License info (for the about box)
var licenseInfo = "\nThe licenses below cover software which is compiled into ennuizel.js. For other\nincluded software, consult the licenses in their files.\n\n\n===\nEnnuizel\n===\n\nCopyright (c) 2021 Yahweasel\n\nPermission to use, copy, modify, and/or distribute this software for any\npurpose with or without fee is hereby granted, provided that the above\ncopyright notice and this permission notice appear in all copies.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\" AND THE AUTHOR DISCLAIMS ALL WARRANTIES\nWITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF\nMERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY\nSPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES\nWHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION\nOF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN\nCONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.\n\n\n===\nbytes (https://github.com/visionmedia/bytes.js)\n===\n\n(The MIT License)\n\nCopyright (c) 2012-2014 TJ Holowaychuk <tj@vision-media.ca>\nCopyright (c) 2015 Jed Watson <jed.watson@me.com>\n\nPermission is hereby granted, free of charge, to any person obtaining\na copy of this software and associated documentation files (the\n'Software'), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\nThe above copyright notice and this permission notice shall be\nincluded in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\nIN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY\nCLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,\nTORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\nSOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n===\nStreamSaver (https://github.com/jimmywarting/StreamSaver.js)\n===\n\nThe MIT License (MIT)\n\nCopyright (c) 2016-2021 Jimmy Karl Roland W\u00E4rting\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n";
/* removed: var _$avthreads_6 = require("./avthreads"); */;
/* removed: var _$filters_8 = require("./filters"); */;
/* removed: var _$plugins_12 = require("./plugins"); */;
/* removed: var _$project_13 = require("./project"); */;
_$main_11.project = _$project_13;
/* removed: var _$select_14 = require("./select"); */;
/* removed: var _$store_16 = require("./store"); */;
/* removed: var _$ui_20 = require("./ui"); */;
_$main_11.ui = _$ui_20;
/* removed: var _$StreamSaver_2 = require("streamsaver"); */;
/* removed: var _$ponyfill_3 = require("web-streams-polyfill/ponyfill"); */;
/* Ennuizel itself, as interpreted as a plugin, to make the about box easier to
 * fill */
var ennuizelPlugin = {
    name: "Ennuizel",
    id: "ennuizel",
    infoURL: "https://github.com/ennuizel/ennuizel",
    description: 'This is Ennuizel, an audio editor in your web browser! Ennuizel is not “cloud”-based: everything is saved locally in your browser\'s local storage space. Ennuizel is <a href="https://github.com/ennuizel/ennuizel">open source</a>.',
    licenseInfo: licenseInfo
};
(function () {
    return ____awaiter_11(this, void 0, void 0, function () {
        function onError(msg) {
            return ____awaiter_11(this, void 0, void 0, function () {
                var html;
                return ____generator_11(this, function (_a) {
                    html = msg
                        // eslint-disable-next-line no-useless-escape
                        .replace(/\&/g, "&nbsp;")
                        .replace(/</g, "&lt;").replace(/>/g, "&gt;")
                        .replace(/\n/g, "<br/>");
                    _$ui_20.dialog(function (d, show) {
                        return ____awaiter_11(this, void 0, void 0, function () {
                            return ____generator_11(this, function (_a) {
                                errorDialog = d;
                                d.box.innerHTML = html;
                                show(null);
                                return [2 /*return*/];
                            });
                        });
                    }, {
                        reuse: errorDialog,
                        closeable: false,
                        keepOpen: true
                    });
                    return [2 /*return*/];
                });
            });
        }
        var errorDialog;
        return ____generator_11(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _$ui_20.load();
                    errorDialog = null;
                    window.addEventListener("error", function (ev) {
                        onError(ev.message + " @ " + ev.filename + ":" + ev.lineno);
                    });
                    window.addEventListener("unhandledrejection", function (ev) {
                        onError((typeof ev.reason === "object" && ev.reason !== null && ev.reason.stack) ?
                            ("" + ev.reason + "\n" + ev.reason.stack) :
                            ("" + ev.reason));
                    });
                    return [4 /*yield*/, _$ui_20.loading(function (d) {
                            return ____awaiter_11(this, void 0, void 0, function () {
                                var persistent, wizard, response, config, _i, _a, url, plugin, ex_1;
                                return ____generator_11(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!(typeof LibAV === "undefined")) return [3 /*break*/, 2];
                                            LibAV = { base: "libav/" };
                                            return [4 /*yield*/, _$ui_20.loadLibrary("libav/libav-2.4.4.4-fat.js")];
                                        case 1:
                                            _b.sent();
                                            _b.label = 2;
                                        case 2:
                                            if (!(typeof localforage === "undefined")) return [3 /*break*/, 4];
                                            return [4 /*yield*/, _$ui_20.loadLibrary("localforage.min.js")];
                                        case 3:
                                            _b.sent();
                                            _b.label = 4;
                                        case 4:
                                            // StreamSaver.js
                                            _$StreamSaver_2.mitm = "StreamSaver/mitm.html";
                                            _$StreamSaver_2.WritableStream = _$ponyfill_3.WritableStream;
                                            persistent = false;
                                            if (!(navigator.storage && navigator.storage.persist && navigator.storage.persisted)) return [3 /*break*/, 13];
                                            return [4 /*yield*/, navigator.storage.persisted()];
                                        case 5:
                                            persistent = _b.sent();
                                            if (!!persistent) return [3 /*break*/, 8];
                                            return [4 /*yield*/, _$ui_20.alert("To handle large projects, this tool must have permission for persistent local storage. On some browsers, this permission is given through the notifications permission, so please accept that request if it is asked.")];
                                        case 6:
                                            _b.sent();
                                            return [4 /*yield*/, navigator.storage.persist()];
                                        case 7:
                                            persistent = _b.sent();
                                            _b.label = 8;
                                        case 8:
                                            if (!(!persistent && typeof Notification !== "undefined" && Notification.requestPermission)) return [3 /*break*/, 11];
                                            return [4 /*yield*/, Notification.requestPermission()];
                                        case 9:
                                            _b.sent();
                                            return [4 /*yield*/, navigator.storage.persist()];
                                        case 10:
                                            persistent = _b.sent();
                                            _b.label = 11;
                                        case 11:
                                            if (!!persistent) return [3 /*break*/, 13];
                                            return [4 /*yield*/, _$ui_20.alert("Failed to acquire permission for persistent storage. Large projects will fail.")];
                                        case 12:
                                            _b.sent();
                                            _b.label = 13;
                                        case 13: 
                                        // Load all the components that need loading
                                        return [4 /*yield*/, _$avthreads_6.load()];
                                        case 14:
                                            // Load all the components that need loading
                                            _b.sent();
                                            return [4 /*yield*/, _$filters_8.load()];
                                        case 15:
                                            _b.sent();
                                            return [4 /*yield*/, _$project_13.load()];
                                        case 16:
                                            _b.sent();
                                            return [4 /*yield*/, _$select_14.load()];
                                        case 17:
                                            _b.sent();
                                            return [4 /*yield*/, _$store_16.load()];
                                        case 18:
                                            _b.sent();
                                            return [4 /*yield*/, _$plugins_12.load()];
                                        case 19:
                                            _b.sent();
                                            wizard = null;
                                            _b.label = 20;
                                        case 20:
                                            _b.trys.push([20, 27, , 28]);
                                            return [4 /*yield*/, fetch("ennuizel.json", {
                                                    cache: "no-cache"
                                                })];
                                        case 21:
                                            response = _b.sent();
                                            return [4 /*yield*/, response.json()];
                                        case 22:
                                            config = _b.sent();
                                            _i = 0, _a = config.plugins;
                                            _b.label = 23;
                                        case 23:
                                            if (!(_i < _a.length)) return [3 /*break*/, 26];
                                            url = _a[_i];
                                            return [4 /*yield*/, _$plugins_12.loadPlugin(url)];
                                        case 24:
                                            plugin = _b.sent();
                                            if (plugin && plugin.wizard)
                                                wizard = plugin.wizard;
                                            _b.label = 25;
                                        case 25:
                                            _i++;
                                            return [3 /*break*/, 23];
                                        case 26: return [3 /*break*/, 28];
                                        case 27:
                                            ex_1 = _b.sent();
                                            console.error(ex_1);
                                            return [3 /*break*/, 28];
                                        case 28:
                                            if (!wizard) return [3 /*break*/, 30];
                                            return [4 /*yield*/, wizard(d)];
                                        case 29:
                                            _b.sent();
                                            _b.label = 30;
                                        case 30: return [2 /*return*/];
                                    }
                                });
                            });
                        })];
                case 1:
                    _a.sent();
                    // And make an about screen
                    _$ui_20.ui.menu.about.onclick = function () {
                        var plugs = _$plugins_12.getPlugins();
                        if (plugs.length === 0) {
                            // No plugins, just show the help for Ennuizel itself
                            about(null, ennuizelPlugin);
                            return;
                        }
                        // Make a dialog to ask which plugin they're querying
                        _$ui_20.dialog(function (d, show) {
                            return ____awaiter_11(this, void 0, void 0, function () {
                                var ez, _loop_1, _i, plugs_1, plug;
                                return ____generator_11(this, function (_a) {
                                    ez = _$ui_20.btn(d.box, "About Ennuizel", { className: "row small" });
                                    ez.onclick = function () { return about(d, ennuizelPlugin); };
                                    _loop_1 = function (plug) {
                                        var btn = _$ui_20.btn(d.box, "About " + plug.name, { className: "row small" });
                                        btn.onclick = function () { return about(d, plug); };
                                    };
                                    for (_i = 0, plugs_1 = plugs; _i < plugs_1.length; _i++) {
                                        plug = plugs_1[_i];
                                        _loop_1(plug);
                                    }
                                    show(ez);
                                    return [2 /*return*/];
                                });
                            });
                        }, {
                            closeable: true
                        });
                    };
                    return [2 /*return*/];
            }
        });
    });
})();
// Handler for "about" screens
function about(d, plugin) {
    _$ui_20.dialog(function (d, show) {
        return ____awaiter_11(this, void 0, void 0, function () {
            var header, about, li, ok;
            return ____generator_11(this, function (_a) {
                header = _$ui_20.mk("h2", d.box);
                _$ui_20.mk("a", header, {
                    href: plugin.infoURL,
                    innerText: plugin.name
                });
                about = _$ui_20.mk("div", d.box, {
                    innerHTML: plugin.description + "<br/><br/>License info:"
                });
                about.style.maxWidth = "45rem";
                li = _$ui_20.mk("textarea", d.box, {
                    readOnly: true,
                    innerHTML: plugin.licenseInfo,
                    className: "row"
                });
                Object.assign(li.style, {
                    display: "block",
                    width: "45rem",
                    height: "20em"
                });
                ok = _$ui_20.btn(d.box, "OK", { className: "row" });
                ok.style.width = "45rem";
                ok.onclick = function () { return _$ui_20.dialogClose(d); };
                show(ok);
                return [2 /*return*/];
            });
        });
    }, {
        closeable: true,
        reuse: d
    });
}

return _$main_11;

});

