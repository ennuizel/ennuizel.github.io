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
// Buffering playback processor
class EnnuizelPlayer extends AudioWorkletProcessor {
    constructor(options) {
        super(options);
        this.buf = [];
        this.bufSz = 0;
        this.played = 0;
        this.threshold = options.parameterData.sampleRate * 30;
        this.playing = this.done = false;
        this.resume = null;
        this.reader();
    }
    reader() {
        return __awaiter(this, void 0, void 0, function* () {
            let recv = null;
            // Our message handler
            this.port.onmessage = ev => {
                if (ev.data.c === "play") {
                    this.playing = true;
                }
                else if (ev.data.c !== "data") {
                    return;
                }
                if (!ev.data.d) {
                    // No more data!
                    recv(false);
                    return;
                }
                const len = ev.data.d.map(x => x[0].length).reduce((x, y) => x + y);
                this.buf = this.buf.concat(ev.data.d);
                this.bufSz += len;
                recv(true);
            };
            // Expect our first piece of data
            yield new Promise(res => recv = res);
            // Inform the host that we're ready only once
            let informedReady = false;
            // We expect data at the start
            while (true) {
                if (this.bufSz < this.threshold) {
                    // Too little data. Request more.
                    this.port.postMessage({ c: "read" });
                    if (!(yield new Promise(res => recv = res))) {
                        // No more data!
                        this.done = true;
                        break;
                    }
                }
                else {
                    // Enough data. Wait until we've played down.
                    if (!informedReady) {
                        this.port.postMessage({ c: "ready" });
                        informedReady = true;
                    }
                    yield new Promise(res => this.resume = res);
                    this.resume = null;
                }
            }
            if (!informedReady)
                this.port.postMessage({ c: "ready" });
        });
    }
    process(inputs, outputs, parameters) {
        if (!this.playing)
            return true;
        const output = outputs[0];
        let offset = 0;
        let remaining = output[0].length;
        while (remaining) {
            if (!this.buf.length) {
                // Not enough data!
                break;
            }
            const d = this.buf[0];
            if (d[0].length > remaining) {
                // More than enough data
                for (let i = 0; i < d.length; i++) {
                    output[i].set(d[i].subarray(0, remaining), offset);
                    d[i] = d[i].subarray(remaining);
                }
                this.bufSz -= remaining;
                this.played += remaining;
                remaining = 0;
            }
            else {
                // Not enough (or exactly enough) data
                for (let i = 0; i < d.length; i++)
                    output[i].set(d[i], offset);
                this.bufSz -= d[0].length;
                this.buf.shift();
                offset += d[0].length;
                this.played += d[0].length;
                remaining -= d[0].length;
            }
        }
        // Tell the host where we are
        this.port.postMessage({ c: "time", d: this.played });
        // Maybe ask for more
        if (this.bufSz < this.threshold && this.resume) {
            this.resume(null);
        }
        else if (this.done && this.buf.length === 0) {
            // We're done!
            this.port.postMessage({ c: "done" });
            return false;
        }
        return true;
    }
}
registerProcessor("ennuizel-player", EnnuizelPlayer);
