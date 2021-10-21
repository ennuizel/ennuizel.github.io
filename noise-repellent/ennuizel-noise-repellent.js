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
var licenseInfo = "\nThis software is compiled from several sources, the licenses for which are\nincluded herein. The complete source code is available at\nhttps://ecastr.com/src/ .\n\n---\n\nnoise-repellent and fftw3:\n\nCopyright 2016 Luciano Dato <lucianodato@gmail.com>\nCopyright (c) 2003, 2007-14 Matteo Frigo\nCopyright (c) 2003, 2007-14 Massachusetts Institute of Technology\n\n                   GNU LESSER GENERAL PUBLIC LICENSE\n                       Version 3, 29 June 2007\n\n Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>\n Everyone is permitted to copy and distribute verbatim copies\n of this license document, but changing it is not allowed.\n\n\n  This version of the GNU Lesser General Public License incorporates\nthe terms and conditions of version 3 of the GNU General Public\nLicense, supplemented by the additional permissions listed below.\n\n  0. Additional Definitions.\n\n  As used herein, \"this License\" refers to version 3 of the GNU Lesser\nGeneral Public License, and the \"GNU GPL\" refers to version 3 of the GNU\nGeneral Public License.\n\n  \"The Library\" refers to a covered work governed by this License,\nother than an Application or a Combined Work as defined below.\n\n  An \"Application\" is any work that makes use of an interface provided\nby the Library, but which is not otherwise based on the Library.\nDefining a subclass of a class defined by the Library is deemed a mode\nof using an interface provided by the Library.\n\n  A \"Combined Work\" is a work produced by combining or linking an\nApplication with the Library.  The particular version of the Library\nwith which the Combined Work was made is also called the \"Linked\nVersion\".\n\n  The \"Minimal Corresponding Source\" for a Combined Work means the\nCorresponding Source for the Combined Work, excluding any source code\nfor portions of the Combined Work that, considered in isolation, are\nbased on the Application, and not on the Linked Version.\n\n  The \"Corresponding Application Code\" for a Combined Work means the\nobject code and/or source code for the Application, including any data\nand utility programs needed for reproducing the Combined Work from the\nApplication, but excluding the System Libraries of the Combined Work.\n\n  1. Exception to Section 3 of the GNU GPL.\n\n  You may convey a covered work under sections 3 and 4 of this License\nwithout being bound by section 3 of the GNU GPL.\n\n  2. Conveying Modified Versions.\n\n  If you modify a copy of the Library, and, in your modifications, a\nfacility refers to a function or data to be supplied by an Application\nthat uses the facility (other than as an argument passed when the\nfacility is invoked), then you may convey a copy of the modified\nversion:\n\n   a) under this License, provided that you make a good faith effort to\n   ensure that, in the event an Application does not supply the\n   function or data, the facility still operates, and performs\n   whatever part of its purpose remains meaningful, or\n\n   b) under the GNU GPL, with none of the additional permissions of\n   this License applicable to that copy.\n\n  3. Object Code Incorporating Material from Library Header Files.\n\n  The object code form of an Application may incorporate material from\na header file that is part of the Library.  You may convey such object\ncode under terms of your choice, provided that, if the incorporated\nmaterial is not limited to numerical parameters, data structure\nlayouts and accessors, or small macros, inline functions and templates\n(ten or fewer lines in length), you do both of the following:\n\n   a) Give prominent notice with each copy of the object code that the\n   Library is used in it and that the Library and its use are\n   covered by this License.\n\n   b) Accompany the object code with a copy of the GNU GPL and this license\n   document.\n\n  4. Combined Works.\n\n  You may convey a Combined Work under terms of your choice that,\ntaken together, effectively do not restrict modification of the\nportions of the Library contained in the Combined Work and reverse\nengineering for debugging such modifications, if you also do each of\nthe following:\n\n   a) Give prominent notice with each copy of the Combined Work that\n   the Library is used in it and that the Library and its use are\n   covered by this License.\n\n   b) Accompany the Combined Work with a copy of the GNU GPL and this license\n   document.\n\n   c) For a Combined Work that displays copyright notices during\n   execution, include the copyright notice for the Library among\n   these notices, as well as a reference directing the user to the\n   copies of the GNU GPL and this license document.\n\n   d) Do one of the following:\n\n       0) Convey the Minimal Corresponding Source under the terms of this\n       License, and the Corresponding Application Code in a form\n       suitable for, and under terms that permit, the user to\n       recombine or relink the Application with a modified version of\n       the Linked Version to produce a modified Combined Work, in the\n       manner specified by section 6 of the GNU GPL for conveying\n       Corresponding Source.\n\n       1) Use a suitable shared library mechanism for linking with the\n       Library.  A suitable mechanism is one that (a) uses at run time\n       a copy of the Library already present on the user's computer\n       system, and (b) will operate properly with a modified version\n       of the Library that is interface-compatible with the Linked\n       Version.\n\n   e) Provide Installation Information, but only if you would otherwise\n   be required to provide such information under section 6 of the\n   GNU GPL, and only to the extent that such information is\n   necessary to install and execute a modified version of the\n   Combined Work produced by recombining or relinking the\n   Application with a modified version of the Linked Version. (If\n   you use option 4d0, the Installation Information must accompany\n   the Minimal Corresponding Source and Corresponding Application\n   Code. If you use option 4d1, you must provide the Installation\n   Information in the manner specified by section 6 of the GNU GPL\n   for conveying Corresponding Source.)\n\n  5. Combined Libraries.\n\n  You may place library facilities that are a work based on the\nLibrary side by side in a single library together with other library\nfacilities that are not Applications and are not covered by this\nLicense, and convey such a combined library under terms of your\nchoice, if you do both of the following:\n\n   a) Accompany the combined library with a copy of the same work based\n   on the Library, uncombined with any other library facilities,\n   conveyed under the terms of this License.\n\n   b) Give prominent notice with the combined library that part of it\n   is a work based on the Library, and explaining where to find the\n   accompanying uncombined form of the same work.\n\n  6. Revised Versions of the GNU Lesser General Public License.\n\n  The Free Software Foundation may publish revised and/or new versions\nof the GNU Lesser General Public License from time to time. Such new\nversions will be similar in spirit to the present version, but may\ndiffer in detail to address new problems or concerns.\n\n  Each version is given a distinguishing version number. If the\nLibrary as you received it specifies that a certain numbered version\nof the GNU Lesser General Public License \"or any later version\"\napplies to it, you have the option of following the terms and\nconditions either of that published version or of any later version\npublished by the Free Software Foundation. If the Library as you\nreceived it does not specify a version number of the GNU Lesser\nGeneral Public License, you may choose any version of the GNU Lesser\nGeneral Public License ever published by the Free Software Foundation.\n\n  If the Library as you received it specifies that a proxy can decide\nwhether future versions of the GNU Lesser General Public License shall\napply, that proxy's public statement of acceptance of any version is\npermanent authorization for you to choose that version for the\nLibrary.\n\n\n---\n\nemscripten and musl:\n\nCopyright (c) 2010-2014 Emscripten authors, see AUTHORS file.\nCopyright \u00A9 2005-2014 Rich Felker, et al.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to\ndeal in the Software without restriction, including without limitation the\nrights to use, copy, modify, merge, publish, distribute, sublicense, and/or\nsell copies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\nFROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS\nIN THE SOFTWARE.\n";
// The plugin info
var plugin = {
    name: "Noise Repellent",
    id: "noise-repellent",
    infoURL: "https://github.com/ennuizel/ennuizel-noise-repellent-plugin",
    description: 'This plugin adds support for the <a href="https://github.com/Yahweasel/noise-repellent.js">noise-repellent.js</a> noise reducer.',
    licenseInfo: licenseInfo,
    load: load,
    api: {
        noiseRepellent: noiseRepellent
    }
};
// Register the plugin
Ennuizel.registerPlugin(plugin);
/**
 * Noise Repellent options.
 */
var NoiseRepellentOptions = [
    {
        name: "Reduction _amount",
        id: "AMOUNT",
        min: 0,
        max: 48,
        value: 10
    },
    {
        name: "_Thresholds offset",
        id: "NOFFSET",
        min: -12,
        max: 12,
        value: 0
    },
    {
        name: "_Release",
        id: "RELEASE",
        min: 1,
        max: 10,
        value: 5
    },
    {
        name: "_Masking",
        id: "MASKING",
        min: 1,
        max: 10,
        value: 5
    },
    {
        name: "_Protect transients",
        id: "T_PROTECT",
        min: 1,
        max: 6,
        value: 1
    },
    {
        name: "Residual _whitening",
        id: "WHITENING",
        min: 0,
        max: 100,
        value: 0
    }
];
/**
 * Load the plugin.
 */
function load() {
    return __awaiter(this, void 0, void 0, function () {
        var nrURL, base;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nrURL = new URL(plugin.url);
                    base = nrURL.pathname.replace(/\/[^\/]*$/, "");
                    nrURL.pathname = base;
                    NoiseRepellent = { base: nrURL.toString() };
                    nrURL.pathname = base + "/noise-repellent-m.js";
                    // Load it
                    return [4 /*yield*/, Ennuizel.ui.loadLibrary(nrURL.toString())];
                case 1:
                    // Load it
                    _a.sent();
                    // And register the filter
                    Ennuizel.filters.registerCustomFilter({
                        name: "Noise _Repellent",
                        filter: uiNoiseRepellent
                    });
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * User interface to the noise repellent filter.
 * @param d  Dialog to show filter options.
 */
function uiNoiseRepellent(d) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Ennuizel.ui.dialog(function (d, show) {
                        return __awaiter(this, void 0, void 0, function () {
                            var pels, first, _loop_1, _i, NoiseRepellentOptions_1, opt, btn;
                            return __generator(this, function (_a) {
                                pels = Object.create(null);
                                first = null;
                                _loop_1 = function (opt) {
                                    // Make the UI
                                    var id = "noise-repellent-" + opt.id;
                                    var div = Ennuizel.ui.mk("div", d.box, { className: "row" });
                                    Ennuizel.hotkeys.mk(d, opt.name + ":&nbsp;", function (lbl) { return Ennuizel.ui.lbl(div, id, lbl, { className: "ez" }); });
                                    var inp = pels[opt.id] = Ennuizel.ui.mk("input", div, {
                                        id: id,
                                        type: (typeof opt.value === "boolean") ? "checkbox" : "text"
                                    });
                                    if (!first)
                                        first = inp;
                                    // Set the default values
                                    if (typeof opt.value === "boolean") {
                                        inp.checked = opt.value;
                                    }
                                    else {
                                        inp.value = opt.value + "";
                                        inp.onchange = function () {
                                            var val = +inp.value;
                                            if (val < opt.min)
                                                inp.value = opt.min + "";
                                            else if (val > opt.max)
                                                inp.value = opt.max + "";
                                        };
                                    }
                                };
                                for (_i = 0, NoiseRepellentOptions_1 = NoiseRepellentOptions; _i < NoiseRepellentOptions_1.length; _i++) {
                                    opt = NoiseRepellentOptions_1[_i];
                                    _loop_1(opt);
                                }
                                btn = Ennuizel.hotkeys.btn(d, "_Filter", { className: "row" });
                                btn.onclick = function () {
                                    Ennuizel.ui.loading(function (d) {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var opts, key, el;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        opts = Object.create(null);
                                                        for (key in pels) {
                                                            el = pels[key];
                                                            if (el.type === "checkbox")
                                                                opts[key] = +el.checked;
                                                            else
                                                                opts[key] = +el.value;
                                                        }
                                                        Ennuizel.undoPoint();
                                                        return [4 /*yield*/, Ennuizel.filters.selectionFilter(function (x) { return noiseRepellent(x, opts); }, false, Ennuizel.select.getSelection(), d)];
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
 * Noise repellent filter implementation.
 * @param stream  Stream to filter.
 * @param opts  Noise repellent options.
 */
function noiseRepellent(stream, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var first, nrs, i, _a, _b, _i, nrs_1, nr, _c, NoiseRepellentOptions_2, opt, latency, toFltStr, toFlt, filterStream, fromFlt;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, stream.read()];
                case 1:
                    first = _d.sent();
                    if (!first) {
                        return [2 /*return*/, new Ennuizel.ReadableStream({
                                start: function (controller) {
                                    controller.close();
                                }
                            })];
                    }
                    stream.push(first);
                    nrs = [];
                    i = 0;
                    _d.label = 2;
                case 2:
                    if (!(i < first.channels)) return [3 /*break*/, 5];
                    _b = (_a = nrs).push;
                    return [4 /*yield*/, NoiseRepellent.NoiseRepellent(first.sample_rate)];
                case 3:
                    _b.apply(_a, [_d.sent()]);
                    _d.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    // Initialize them
                    for (_i = 0, nrs_1 = nrs; _i < nrs_1.length; _i++) {
                        nr = nrs_1[_i];
                        for (_c = 0, NoiseRepellentOptions_2 = NoiseRepellentOptions; _c < NoiseRepellentOptions_2.length; _c++) {
                            opt = NoiseRepellentOptions_2[_c];
                            if (opt.id in opts)
                                nr.set(NoiseRepellent[opt.id], opts[opt.id]);
                            else
                                nr.set(NoiseRepellent[opt.id], opt.value);
                        }
                        nr.set(NoiseRepellent.N_ADAPTIVE, 1);
                        nr.set(NoiseRepellent.ENABLE, 1);
                    }
                    // Figure out the latency
                    nrs[0].run(new Float32Array(first.sample_rate));
                    latency = nrs[0].latency;
                    return [4 /*yield*/, Ennuizel.filters.resample(stream, first.sample_rate, Ennuizel.LibAVSampleFormat.FLTP, first.channels, "apad=pad_len=" + latency)];
                case 6:
                    toFltStr = _d.sent();
                    toFlt = toFltStr.getReader();
                    filterStream = new Ennuizel.ReadableStream({
                        pull: function (controller) {
                            return __awaiter(this, void 0, void 0, function () {
                                var inp, frame, i, data, j;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!true) return [3 /*break*/, 2];
                                            return [4 /*yield*/, toFlt.read()];
                                        case 1:
                                            inp = _a.sent();
                                            if (inp.done) {
                                                controller.close();
                                                return [3 /*break*/, 2];
                                            }
                                            frame = inp.value;
                                            // Noise reduction
                                            for (i = 0; i < first.channels; i++) {
                                                data = frame.data[i];
                                                for (j = 0; j < data.length; j += first.sample_rate) {
                                                    data.set(nrs[i].run(data.subarray(j, j + first.sample_rate)), j);
                                                }
                                            }
                                            // Write it out
                                            controller.enqueue(frame);
                                            return [3 /*break*/, 2];
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                    });
                    return [4 /*yield*/, Ennuizel.filters.resample(new Ennuizel.EZStream(filterStream), first.sample_rate, first.format, first.channels, "atrim=start_pts=" + latency)];
                case 7:
                    fromFlt = _d.sent();
                    return [2 /*return*/, fromFlt];
            }
        });
    });
}
