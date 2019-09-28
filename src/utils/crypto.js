// Depends on jsbn.js and rng.js
// Version 1.1: support utf-8 encoding in pkcs1pad2
// convert a (hex) string to a bignum object
function parseBigInt(str, r) {
    return new BigInteger(str, r);
}

function linebrk(s, n) {
    var ret = "";
    var i = 0;
    while (i + n < s.length) {
        ret += s.substring(i, i + n) + "\n";
        i += n;
    }
    return ret + s.substring(i, s.length);
}

function byte2Hex(b) {
    if (b < 0x10) return "0" + b.toString(16);
    else return b.toString(16);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
    if (n < s.length + 11) { // TODO: fix for utf-8
        alert("Message too long for RSA");
        return null;
    }
    var ba = new Array();
    var i = s.length - 1;
    while (i >= 0 && n > 0) {
        var c = s.charCodeAt(i--);
        if (c < 128) { // encode using utf-8
            ba[--n] = c;
        } else if ((c > 127) && (c < 2048)) {
            ba[--n] = (c & 63) | 128;
            ba[--n] = (c >> 6) | 192;
        } else {
            ba[--n] = (c & 63) | 128;
            ba[--n] = ((c >> 6) & 63) | 128;
            ba[--n] = (c >> 12) | 224;
        }
    }
    ba[--n] = 0;
    var rng = new SecureRandom();
    var x = new Array();
    while (n > 2) { // random non-zero pad
        x[0] = 0;
        while (x[0] == 0) rng.nextBytes(x);
        ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new BigInteger(ba);
}

// "empty" RSA key constructor
function RSAKey() {
    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N, E) {
    if (N != null && E != null && N.length > 0 && E.length > 0) {
        this.n = new BigInteger(N);
        this.e = new BigInteger(E);
    } else alert("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
    return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
    var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
    if (m == null) return null;
    var c = this.doPublic(m);
    if (c == null) return null;
    var h = c.toString(16);
    if ((h.length & 1) == 0) return h;
    else return "0" + h;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}
// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;
// Random number generator - requires a PRNG backend, e.g. prng4.js
// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.
var rng_state;
var rng_pool;
var rng_pptr;

// Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
    rng_pool[rng_pptr++] ^= x & 255;
    rng_pool[rng_pptr++] ^= (x >> 8) & 255;
    rng_pool[rng_pptr++] ^= (x >> 16) & 255;
    rng_pool[rng_pptr++] ^= (x >> 24) & 255;
    if (rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}

// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
    rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if (rng_pool == null) {
    rng_pool = new Array();
    rng_pptr = 0;
    var t;
    if (window.crypto && window.crypto.getRandomValues) {
        // Use webcrypto if available
        var ua = new Uint8Array(32);
        window.crypto.getRandomValues(ua);
        for (t = 0; t < 32; ++t) rng_pool[rng_pptr++] = ua[t];
    }
    if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
        // Extract entropy (256 bits) from NS4 RNG if available
        var z = window.crypto.random(32);
        for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
    }
    while (rng_pptr < rng_psize) { // extract some randomness from Math.random()
        t = Math.floor(65536 * Math.random());
        rng_pool[rng_pptr++] = t >>> 8;
        rng_pool[rng_pptr++] = t & 255;
    }
    rng_pptr = 0;
    rng_seed_time();
    //rng_seed_int(window.screenX);
    //rng_seed_int(window.screenY);
}

function rng_get_byte() {
    if (rng_state == null) {
        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) rng_pool[rng_pptr] = 0;
        rng_pptr = 0;
        //rng_pool = null;
    }
    // TODO: allow reseeding after first request
    return rng_state.next();
}

function rng_get_bytes(ba) {
    var i;
    for (i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}

function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;

// prng4.js - uses Arcfour as a PRNG
function Arcfour() {
    this.i = 0;
    this.j = 0;
    this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
    var i, j, t;
    for (i = 0; i < 256; ++i) this.S[i] = i;
    j = 0;
    for (i = 0; i < 256; ++i) {
        j = (j + this.S[i] + key[i % key.length]) & 255;
        t = this.S[i];
        this.S[i] = this.S[j];
        this.S[j] = t;
    }
    this.i = 0;
    this.j = 0;
}

function ARC4next() {
    var t;
    this.i = (this.i + 1) & 255;
    this.j = (this.j + this.S[this.i]) & 255;
    t = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = t;
    return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
    return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Basic JavaScript BN library - subset useful for RSA encryption.
// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);

// (public) Constructor
function BigInteger(a, b, c) {
    if (a != null) if ("number" == typeof a) this.fromNumber(a, b, c);
    else if (b == null && "string" != typeof a) this.fromString(a, 256);
    else this.fromString(a, b);
}

// return new, unset BigInteger
function nbi() {
    return new BigInteger(null);
}

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.
// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
        var v = x * this[i++] + w[j] + c;
        c = Math.floor(v / 0x4000000);
        w[j++] = v & 0x3ffffff;
    }
    return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
    var xl = x & 0x7fff,
    xh = x >> 15;
    while (--n >= 0) {
        var l = this[i] & 0x7fff;
        var h = this[i++] >> 15;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
        c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
        w[j++] = l & 0x3fffffff;
    }
    return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
    var xl = x & 0x3fff,
    xh = x >> 14;
    while (--n >= 0) {
        var l = this[i] & 0x3fff;
        var h = this[i++] >> 14;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
        c = (l >> 28) + (m >> 14) + xh * h;
        w[j++] = l & 0xfffffff;
    }
    return c;
}
var inBrowser = typeof navigator !== "undefined";
if (inBrowser && j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
} else if (inBrowser && j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
} else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) {
    return BI_RM.charAt(n);
}
function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c == null) ? -1 : c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
    for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
    this.t = 1;
    this.s = (x < 0) ? -1 : 0;
    if (x > 0) this[0] = x;
    else if (x < -1) this[0] = x + DV;
    else this.t = 0;
}

// return bigint initialized to value
function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
}

// (protected) set from string and radix
function bnpFromString(s, b) {
    var k;
    if (b == 16) k = 4;
    else if (b == 8) k = 3;
    else if (b == 256) k = 8; // byte array
    else if (b == 2) k = 1;
    else if (b == 32) k = 5;
    else if (b == 4) k = 2;
    else {
        this.fromRadix(s, b);
        return;
    }
    this.t = 0;
    this.s = 0;
    var i = s.length,
    mi = false,
    sh = 0;
    while (--i >= 0) {
        var x = (k == 8) ? s[i] & 0xff: intAt(s, i);
        if (x < 0) {
            if (s.charAt(i) == "-") mi = true;
            continue;
        }
        mi = false;
        if (sh == 0) this[this.t++] = x;
        else if (sh + k > this.DB) {
            this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
            this[this.t++] = (x >> (this.DB - sh));
        } else this[this.t - 1] |= x << sh;
        sh += k;
        if (sh >= this.DB) sh -= this.DB;
    }
    if (k == 8 && (s[0] & 0x80) != 0) {
        this.s = -1;
        if (sh > 0) this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
    }
    this.clamp();
    if (mi) BigInteger.ZERO.subTo(this, this);
}

// (protected) clamp off excess high words
function bnpClamp() {
    var c = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == c)--this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
    if (this.s < 0) return "-" + this.negate().toString(b);
    var k;
    if (b == 16) k = 4;
    else if (b == 8) k = 3;
    else if (b == 2) k = 1;
    else if (b == 32) k = 5;
    else if (b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1 << k) - 1,
    d,
    m = false,
    r = "",
    i = this.t;
    var p = this.DB - (i * this.DB) % k;
    if (i-->0) {
        if (p < this.DB && (d = this[i] >> p) > 0) {
            m = true;
            r = int2char(d);
        }
        while (i >= 0) {
            if (p < k) {
                d = (this[i] & ((1 << p) - 1)) << (k - p);
                d |= this[--i] >> (p += this.DB - k);
            } else {
                d = (this[i] >> (p -= k)) & km;
                if (p <= 0) {
                    p += this.DB; --i;
                }
            }
            if (d > 0) m = true;
            if (m) r += int2char(d);
        }
    }
    return m ? r: "0";
}

// (public) -this
function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r;
}

// (public) |this|
function bnAbs() {
    return (this.s < 0) ? this.negate() : this;
}

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0) return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0) return (this.s < 0) ? -r: r;
    while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;
    return 0;
}

// returns bit length of the integer x
function nbits(x) {
    var r = 1,
    t;
    if ((t = x >>> 16) != 0) {
        x = t;
        r += 16;
    }
    if ((t = x >> 8) != 0) {
        x = t;
        r += 8;
    }
    if ((t = x >> 4) != 0) {
        x = t;
        r += 4;
    }
    if ((t = x >> 2) != 0) {
        x = t;
        r += 2;
    }
    if ((t = x >> 1) != 0) {
        x = t;
        r += 1;
    }
    return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
    if (this.t <= 0) return 0;
    return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n, r) {
    var i;
    for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
    for (i = n - 1; i >= 0; --i) r[i] = 0;
    r.t = this.t + n;
    r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n, r) {
    for (var i = n; i < this.t; ++i) r[i - n] = this[i];
    r.t = Math.max(this.t - n, 0);
    r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n, r) {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB),
    c = (this.s << bs) & this.DM,
    i;
    for (i = this.t - 1; i >= 0; --i) {
        r[i + ds + 1] = (this[i] >> cbs) | c;
        c = (this[i] & bm) << bs;
    }
    for (i = ds - 1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n, r) {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);
    if (ds >= this.t) {
        r.t = 0;
        return;
    }
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r[0] = this[ds] >> bs;
    for (var i = ds + 1; i < this.t; ++i) {
        r[i - ds - 1] |= (this[i] & bm) << cbs;
        r[i - ds] = this[i] >> bs;
    }
    if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a, r) {
    var i = 0,
    c = 0,
    m = Math.min(a.t, this.t);
    while (i < m) {
        c += this[i] - a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
    }
    if (a.t < this.t) {
        c -= a.s;
        while (i < this.t) {
            c += this[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        c += this.s;
    } else {
        c += this.s;
        while (i < a.t) {
            c -= a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        c -= a.s;
    }
    r.s = (c < 0) ? -1 : 0;
    if (c < -1) r[i++] = this.DV + c;
    else if (c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a, r) {
    var x = this.abs(),
    y = a.abs();
    var i = x.t;
    r.t = i + y.t;
    while (--i >= 0) r[i] = 0;
    for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
    r.s = 0;
    r.clamp();
    if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;
    while (--i >= 0) r[i] = 0;
    for (i = 0; i < x.t - 1; ++i) {
        var c = x.am(i, x[i], r, 2 * i, 0, 1);
        if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
            r[i + x.t] -= x.DV;
            r[i + x.t + 1] = 1;
        }
    }
    if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m, q, r) {
    var pm = m.abs();
    if (pm.t <= 0) return;
    var pt = this.abs();
    if (pt.t < pm.t) {
        if (q != null) q.fromInt(0);
        if (r != null) this.copyTo(r);
        return;
    }
    if (r == null) r = nbi();
    var y = nbi(),
    ts = this.s,
    ms = m.s;
    var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
    if (nsh > 0) {
        pm.lShiftTo(nsh, y);
        pt.lShiftTo(nsh, r);
    } else {
        pm.copyTo(y);
        pt.copyTo(r);
    }
    var ys = y.t;
    var y0 = y[ys - 1];
    if (y0 == 0) return;
    var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2: 0);
    var d1 = this.FV / yt,
    d2 = (1 << this.F1) / yt,
    e = 1 << this.F2;
    var i = r.t,
    j = i - ys,
    t = (q == null) ? nbi() : q;
    y.dlShiftTo(j, t);
    if (r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t, r);
    }
    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y); // "negative" y so we can replace sub with am later
    while (y.t < ys) y[y.t++] = 0;
    while (--j >= 0) {
        // Estimate quotient digit
        var qd = (r[--i] == y0) ? this.DM: Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
        if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
            y.dlShiftTo(j, t);
            r.subTo(t, r);
            while (r[i] < --qd) r.subTo(t, r);
        }
    }
    if (q != null) {
        r.drShiftTo(ys, q);
        if (ts != ms) BigInteger.ZERO.subTo(q, q);
    }
    r.t = ys;
    r.clamp();
    if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
    if (ts < 0) BigInteger.ZERO.subTo(r, r);
}

// (public) this mod a
function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
    return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) {
    this.m = m;
}
function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
}
function cRevert(x) {
    return x;
}
function cReduce(x) {
    x.divRemTo(this.m, null, x);
}
function cMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
}
function cSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
}

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
    if (this.t < 1) return 0;
    var x = this[0];
    if ((x & 1) == 0) return 0;
    var y = x & 3; // y == 1/x mod 2^2
    y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
    y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
    y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y > 0) ? this.DV - y: -y;
}

// Montgomery reduction
function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << (m.DB - 15)) - 1;
    this.mt2 = 2 * m.t;
}

// xR mod m
function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
    return r;
}

// x/R mod m
function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
    while (x.t <= this.mt2) // pad x so am has enough room later
    x[x.t++] = 0;
    for (var i = 0; i < this.m.t; ++i) {
        // faster way of calculating u0 = x[i]*mp mod DV
        var j = x[i] & 0x7fff;
        var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
        // use am to combine the multiply-shift-add into one call
        j = i + this.m.t;
        x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
        // propagate carry
        while (x[j] >= x.DV) {
            x[j] -= x.DV;
            x[++j]++;
        }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
}

// r = "xy/R mod m"; x,y != r
function montMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
}

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() {
    return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
}

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e, z) {
    if (e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(),
    r2 = nbi(),
    g = z.convert(this),
    i = nbits(e) - 1;
    g.copyTo(r);
    while (--i >= 0) {
        z.sqrTo(r, r2);
        if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
        else {
            var t = r;
            r = r2;
            r2 = t;
        }
    }
    return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven()) z = new Classic(m);
    else z = new Montgomery(m);
    return this.exp(e, z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Extended JavaScript BN functions, required for RSA private ops.
// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix
// (public)
function bnClone() {
    var r = nbi();
    this.copyTo(r);
    return r;
}

// (public) return value as integer
function bnIntValue() {
    if (this.s < 0) {
        if (this.t == 1) return this[0] - this.DV;
        else if (this.t == 0) return - 1;
    } else if (this.t == 1) return this[0];
    else if (this.t == 0) return 0;
    // assumes 16 < DB < 32
    return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
}

// (public) return value as byte
function bnByteValue() {
    return (this.t == 0) ? this.s: (this[0] << 24) >> 24;
}

// (public) return value as short (assumes DB>=16)
function bnShortValue() {
    return (this.t == 0) ? this.s: (this[0] << 16) >> 16;
}

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) {
    return Math.floor(Math.LN2 * this.DB / Math.log(r));
}

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
    if (this.s < 0) return - 1;
    else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
    else return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
    if (b == null) b = 10;
    if (this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b, cs);
    var d = nbv(a),
    y = nbi(),
    z = nbi(),
    r = "";
    this.divRemTo(d, y, z);
    while (y.signum() > 0) {
        r = (a + z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d, y, z);
    }
    return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s, b) {
    this.fromInt(0);
    if (b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b, cs),
    mi = false,
    j = 0,
    w = 0;
    for (var i = 0; i < s.length; ++i) {
        var x = intAt(s, i);
        if (x < 0) {
            if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
            continue;
        }
        w = b * w + x;
        if (++j >= cs) {
            this.dMultiply(d);
            this.dAddOffset(w, 0);
            j = 0;
            w = 0;
        }
    }
    if (j > 0) {
        this.dMultiply(Math.pow(b, j));
        this.dAddOffset(w, 0);
    }
    if (mi) BigInteger.ZERO.subTo(this, this);
}

// (protected) alternate constructor
function bnpFromNumber(a, b, c) {
    if ("number" == typeof b) {
        // new BigInteger(int,int,RNG)
        if (a < 2) this.fromInt(1);
        else {
            this.fromNumber(a, c);
            if (!this.testBit(a - 1)) // force MSB set
            this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
            if (this.isEven()) this.dAddOffset(1, 0); // force odd
            while (!this.isProbablePrime(b)) {
                this.dAddOffset(2, 0);
                if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
            }
        }
    } else {
        // new BigInteger(int,RNG)
        var x = new Array(),
        t = a & 7;
        x.length = (a >> 3) + 1;
        b.nextBytes(x);
        if (t > 0) x[0] &= ((1 << t) - 1);
        else x[0] = 0;
        this.fromString(x, 256);
    }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
    var i = this.t,
    r = new Array();
    r[0] = this.s;
    var p = this.DB - (i * this.DB) % 8,
    d,
    k = 0;
    if (i-->0) {
        if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) r[k++] = d | (this.s << (this.DB - p));
        while (i >= 0) {
            if (p < 8) {
                d = (this[i] & ((1 << p) - 1)) << (8 - p);
                d |= this[--i] >> (p += this.DB - 8);
            } else {
                d = (this[i] >> (p -= 8)) & 0xff;
                if (p <= 0) {
                    p += this.DB; --i;
                }
            }
            if ((d & 0x80) != 0) d |= -256;
            if (k == 0 && (this.s & 0x80) != (d & 0x80))++k;
            if (k > 0 || d != this.s) r[k++] = d;
        }
    }
    return r;
}

function bnEquals(a) {
    return (this.compareTo(a) == 0);
}
function bnMin(a) {
    return (this.compareTo(a) < 0) ? this: a;
}
function bnMax(a) {
    return (this.compareTo(a) > 0) ? this: a;
}

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a, op, r) {
    var i, f, m = Math.min(a.t, this.t);
    for (i = 0; i < m; ++i) r[i] = op(this[i], a[i]);
    if (a.t < this.t) {
        f = a.s & this.DM;
        for (i = m; i < this.t; ++i) r[i] = op(this[i], f);
        r.t = this.t;
    } else {
        f = this.s & this.DM;
        for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);
        r.t = a.t;
    }
    r.s = op(this.s, a.s);
    r.clamp();
}

// (public) this & a
function op_and(x, y) {
    return x & y;
}
function bnAnd(a) {
    var r = nbi();
    this.bitwiseTo(a, op_and, r);
    return r;
}

// (public) this | a
function op_or(x, y) {
    return x | y;
}
function bnOr(a) {
    var r = nbi();
    this.bitwiseTo(a, op_or, r);
    return r;
}

// (public) this ^ a
function op_xor(x, y) {
    return x ^ y;
}
function bnXor(a) {
    var r = nbi();
    this.bitwiseTo(a, op_xor, r);
    return r;
}

// (public) this & ~a
function op_andnot(x, y) {
    return x & ~y;
}
function bnAndNot(a) {
    var r = nbi();
    this.bitwiseTo(a, op_andnot, r);
    return r;
}

// (public) ~this
function bnNot() {
    var r = nbi();
    for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];
    r.t = this.t;
    r.s = ~this.s;
    return r;
}

// (public) this << n
function bnShiftLeft(n) {
    var r = nbi();
    if (n < 0) this.rShiftTo( - n, r);
    else this.lShiftTo(n, r);
    return r;
}

// (public) this >> n
function bnShiftRight(n) {
    var r = nbi();
    if (n < 0) this.lShiftTo( - n, r);
    else this.rShiftTo(n, r);
    return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
    if (x == 0) return - 1;
    var r = 0;
    if ((x & 0xffff) == 0) {
        x >>= 16;
        r += 16;
    }
    if ((x & 0xff) == 0) {
        x >>= 8;
        r += 8;
    }
    if ((x & 0xf) == 0) {
        x >>= 4;
        r += 4;
    }
    if ((x & 3) == 0) {
        x >>= 2;
        r += 2;
    }
    if ((x & 1) == 0)++r;
    return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
    for (var i = 0; i < this.t; ++i) if (this[i] != 0) return i * this.DB + lbit(this[i]);
    if (this.s < 0) return this.t * this.DB;
    return - 1;
}

// return number of 1 bits in x
function cbit(x) {
    var r = 0;
    while (x != 0) {
        x &= x - 1; ++r;
    }
    return r;
}

// (public) return number of set bits
function bnBitCount() {
    var r = 0,
    x = this.s & this.DM;
    for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);
    return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
    var j = Math.floor(n / this.DB);
    if (j >= this.t) return (this.s != 0);
    return ((this[j] & (1 << (n % this.DB))) != 0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n, op) {
    var r = BigInteger.ONE.shiftLeft(n);
    this.bitwiseTo(r, op, r);
    return r;
}

// (public) this | (1<<n)
function bnSetBit(n) {
    return this.changeBit(n, op_or);
}

// (public) this & ~(1<<n)
function bnClearBit(n) {
    return this.changeBit(n, op_andnot);
}

// (public) this ^ (1<<n)
function bnFlipBit(n) {
    return this.changeBit(n, op_xor);
}

// (protected) r = this + a
function bnpAddTo(a, r) {
    var i = 0,
    c = 0,
    m = Math.min(a.t, this.t);
    while (i < m) {
        c += this[i] + a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
    }
    if (a.t < this.t) {
        c += a.s;
        while (i < this.t) {
            c += this[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        c += this.s;
    } else {
        c += this.s;
        while (i < a.t) {
            c += a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        c += a.s;
    }
    r.s = (c < 0) ? -1 : 0;
    if (c > 0) r[i++] = c;
    else if (c < -1) r[i++] = this.DV + c;
    r.t = i;
    r.clamp();
}

// (public) this + a
function bnAdd(a) {
    var r = nbi();
    this.addTo(a, r);
    return r;
}

// (public) this - a
function bnSubtract(a) {
    var r = nbi();
    this.subTo(a, r);
    return r;
}

// (public) this * a
function bnMultiply(a) {
    var r = nbi();
    this.multiplyTo(a, r);
    return r;
}

// (public) this^2
function bnSquare() {
    var r = nbi();
    this.squareTo(r);
    return r;
}

// (public) this / a
function bnDivide(a) {
    var r = nbi();
    this.divRemTo(a, r, null);
    return r;
}

// (public) this % a
function bnRemainder(a) {
    var r = nbi();
    this.divRemTo(a, null, r);
    return r;
}

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
    var q = nbi(),
    r = nbi();
    this.divRemTo(a, q, r);
    return new Array(q, r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
    this[this.t] = this.am(0, n - 1, this, 0, 0, this.t); ++this.t;
    this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n, w) {
    if (n == 0) return;
    while (this.t <= w) this[this.t++] = 0;
    this[w] += n;
    while (this[w] >= this.DV) {
        this[w] -= this.DV;
        if (++w >= this.t) this[this.t++] = 0; ++this[w];
    }
}

// A "null" reducer
function NullExp() {}
function nNop(x) {
    return x;
}
function nMulTo(x, y, r) {
    x.multiplyTo(y, r);
}
function nSqrTo(x, r) {
    x.squareTo(r);
}

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) {
    return this.exp(e, new NullExp());
}

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a, n, r) {
    var i = Math.min(this.t + a.t, n);
    r.s = 0; // assumes a,this >= 0
    r.t = i;
    while (i > 0) r[--i] = 0;
    var j;
    for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
    for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);
    r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a, n, r) {--n;
    var i = r.t = this.t + a.t - n;
    r.s = 0; // assumes a,this >= 0
    while (--i >= 0) r[i] = 0;
    for (i = Math.max(n - this.t, 0); i < a.t; ++i) r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
    r.clamp();
    r.drShiftTo(1, r);
}

// Barrett modular reduction
function Barrett(m) {
    // setup Barrett
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m;
}

function barrettConvert(x) {
    if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
    else if (x.compareTo(this.m) < 0) return x;
    else {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    }
}

function barrettRevert(x) {
    return x;
}

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
    x.drShiftTo(this.m.t - 1, this.r2);
    if (x.t > this.m.t + 1) {
        x.t = this.m.t + 1;
        x.clamp();
    }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
    x.subTo(this.r2, x);
    while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
}

// r = x*y mod m; x,y != r
function barrettMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
}

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e, m) {
    var i = e.bitLength(),
    k,
    r = nbv(1),
    z;
    if (i <= 0) return r;
    else if (i < 18) k = 1;
    else if (i < 48) k = 3;
    else if (i < 144) k = 4;
    else if (i < 768) k = 5;
    else k = 6;
    if (i < 8) z = new Classic(m);
    else if (m.isEven()) z = new Barrett(m);
    else z = new Montgomery(m);

    // precomputation
    var g = new Array(),
    n = 3,
    k1 = k - 1,
    km = (1 << k) - 1;
    g[1] = z.convert(this);
    if (k > 1) {
        var g2 = nbi();
        z.sqrTo(g[1], g2);
        while (n <= km) {
            g[n] = nbi();
            z.mulTo(g2, g[n - 2], g[n]);
            n += 2;
        }
    }

    var j = e.t - 1,
    w, is1 = true,
    r2 = nbi(),
    t;
    i = nbits(e[j]) - 1;
    while (j >= 0) {
        if (i >= k1) w = (e[j] >> (i - k1)) & km;
        else {
            w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
            if (j > 0) w |= e[j - 1] >> (this.DB + i - k1);
        }

        n = k;
        while ((w & 1) == 0) {
            w >>= 1; --n;
        }
        if ((i -= n) < 0) {
            i += this.DB; --j;
        }
        if (is1) { // ret == 1, don't bother squaring or multiplying it
            g[w].copyTo(r);
            is1 = false;
        } else {
            while (n > 1) {
                z.sqrTo(r, r2);
                z.sqrTo(r2, r);
                n -= 2;
            }
            if (n > 0) z.sqrTo(r, r2);
            else {
                t = r;
                r = r2;
                r2 = t;
            }
            z.mulTo(r2, g[w], r);
        }

        while (j >= 0 && (e[j] & (1 << i)) == 0) {
            z.sqrTo(r, r2);
            t = r;
            r = r2;
            r2 = t;
            if (--i < 0) {
                i = this.DB - 1; --j;
            }
        }
    }
    return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
    var x = (this.s < 0) ? this.negate() : this.clone();
    var y = (a.s < 0) ? a.negate() : a.clone();
    if (x.compareTo(y) < 0) {
        var t = x;
        x = y;
        y = t;
    }
    var i = x.getLowestSetBit(),
    g = y.getLowestSetBit();
    if (g < 0) return x;
    if (i < g) g = i;
    if (g > 0) {
        x.rShiftTo(g, x);
        y.rShiftTo(g, y);
    }
    while (x.signum() > 0) {
        if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
        if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
        if (x.compareTo(y) >= 0) {
            x.subTo(y, x);
            x.rShiftTo(1, x);
        } else {
            y.subTo(x, y);
            y.rShiftTo(1, y);
        }
    }
    if (g > 0) y.lShiftTo(g, y);
    return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
    if (n <= 0) return 0;
    var d = this.DV % n,
    r = (this.s < 0) ? n - 1 : 0;
    if (this.t > 0) if (d == 0) r = this[0] % n;
    else for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
    return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
    var ac = m.isEven();
    if ((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
    var u = m.clone(),
    v = this.clone();
    var a = nbv(1),
    b = nbv(0),
    c = nbv(0),
    d = nbv(1);
    while (u.signum() != 0) {
        while (u.isEven()) {
            u.rShiftTo(1, u);
            if (ac) {
                if (!a.isEven() || !b.isEven()) {
                    a.addTo(this, a);
                    b.subTo(m, b);
                }
                a.rShiftTo(1, a);
            } else if (!b.isEven()) b.subTo(m, b);
            b.rShiftTo(1, b);
        }
        while (v.isEven()) {
            v.rShiftTo(1, v);
            if (ac) {
                if (!c.isEven() || !d.isEven()) {
                    c.addTo(this, c);
                    d.subTo(m, d);
                }
                c.rShiftTo(1, c);
            } else if (!d.isEven()) d.subTo(m, d);
            d.rShiftTo(1, d);
        }
        if (u.compareTo(v) >= 0) {
            u.subTo(v, u);
            if (ac) a.subTo(c, a);
            b.subTo(d, b);
        } else {
            v.subTo(u, v);
            if (ac) c.subTo(a, c);
            d.subTo(b, d);
        }
    }
    if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
    if (d.compareTo(m) >= 0) return d.subtract(m);
    if (d.signum() < 0) d.addTo(m, d);
    else return d;
    if (d.signum() < 0) return d.add(m);
    else return d;
}

var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
    var i, x = this.abs();
    if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
        for (i = 0; i < lowprimes.length; ++i) if (x[0] == lowprimes[i]) return true;
        return false;
    }
    if (x.isEven()) return false;
    i = 1;
    while (i < lowprimes.length) {
        var m = lowprimes[i],
        j = i + 1;
        while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
        m = x.modInt(m);
        while (i < j) if (m % lowprimes[i++] == 0) return false;
    }
    return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
    var n1 = this.subtract(BigInteger.ONE);
    var k = n1.getLowestSetBit();
    if (k <= 0) return false;
    var r = n1.shiftRight(k);
    t = (t + 1) >> 1;
    if (t > lowprimes.length) t = lowprimes.length;
    var a = nbi();
    for (var i = 0; i < t; ++i) {
        //Pick bases at random, instead of starting at 2
        a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
        var y = a.modPow(r, this);
        if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
            var j = 1;
            while (j++<k && y.compareTo(n1) != 0) {
                y = y.modPowInt(2, this);
                if (y.compareTo(BigInteger.ONE) == 0) return false;
            }
            if (y.compareTo(n1) != 0) return false;
        }
    }
    return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// JSBN-specific extension
BigInteger.prototype.square = bnSquare;

// BigInteger interfaces not implemented in jsbn:
// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)
if (typeof exports !== 'undefined') {
    exports = module.exports = BigInteger;
} else {
    this.BigInteger = BigInteger;
}

//convert a 8-bit value to a string
function cvt_hex8(val) {
    var vh = (val >>> 4) & 0x0f;
    return vh.toString(16) + (val & 0x0f).toString(16);
}

// convert a 32-bit value to a 8-char hex string
function cvt_hex32(val) {
    var str = "";
    var i;
    var v;

    for (i = 7; i >= 0; i--) {
        v = (val >>> (i * 4)) & 0x0f;
        str += v.toString(16);
    }
    return str;
}

// convert a two-digit hex value to a number
function cvt_byte(str) {
    // get the first hex digit
    var val1 = str.charCodeAt(0);

    // do some error checking
    if (val1 >= 48 && val1 <= 57)
    // have a valid digit 0-9
    val1 -= 48;
    else if (val1 >= 65 && val1 <= 70)
    // have a valid digit A-F
    val1 -= 55;
    else if (val1 >= 97 && val1 <= 102)
    // have a valid digit A-F
    val1 -= 87;
    else {
        // not 0-9 or A-F, complain
        window.alert(str.charAt(1) + " is not a valid hex digit");
        return - 1;
    }

    // get the second hex digit
    var val2 = str.charCodeAt(1);

    // do some error checking
    if (val2 >= 48 && val2 <= 57)
    // have a valid digit 0-9
    val2 -= 48;
    else if (val2 >= 65 && val2 <= 70)
    // have a valid digit A-F
    val2 -= 55;
    else if (val2 >= 97 && val2 <= 102)
    // have a valid digit A-F
    val2 -= 87;
    else {
        // not 0-9 or A-F, complain
        window.alert(str.charAt(2) + " is not a valid hex digit");
        return - 1;
    }

    // all is ok, return the value
    return val1 * 16 + val2;
}

// S-Box substitution table
var S_enc = new Array(0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16);

// inverse S-Box for decryptions
var S_dec = new Array(0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d);

// convert two-dimensional indicies to one-dim array indices
var I00 = 0;
var I01 = 1;
var I02 = 2;
var I03 = 3;
var I10 = 4;
var I11 = 5;
var I12 = 6;
var I13 = 7;
var I20 = 8;
var I21 = 9;
var I22 = 10;
var I23 = 11;
var I30 = 12;
var I31 = 13;
var I32 = 14;
var I33 = 15;
// conversion function for non-constant subscripts
// assume subscript range 0..3
function I(x, y) {
    return (x * 4) + y;
}

// remove spaces from input
function remove_spaces(instr) {
    var i;
    var outstr = "";

    for (i = 0; i < instr.length; i++) if (instr.charAt(i) != " ")
    // not a space, include it
    outstr += instr.charAt(i);

    return outstr;
}

//do the AES GF(2**8) multiplication
// do this by the shift-and-"add" approach
function aes_mul(a, b) {
    var res = 0;

    while (a > 0) {
        if ((a & 1) != 0) res = res ^ b; // "add" to the result
        a >>>= 1; // shift a to get next higher-order bit
        b <<= 1; // shift multiplier also
    }

    // now reduce it modulo x**8 + x**4 + x**3 + x + 1
    var hbit = 0x10000; // bit to test if we need to take action
    var modulus = 0x11b00; // modulus - XOR by this to change value
    while (hbit >= 0x100) {
        if ((res & hbit) != 0) // if the high-order bit is set
        res ^= modulus; // XOR with the modulus
        // prepare for the next loop
        hbit >>= 1;
        modulus >>= 1;
    }

    return res;
}

// apply the S-box substitution to the key expansion
function SubWord(word_ary) {
    var i;

    for (i = 0; i < 16; i++) {
        word_ary[i] = S_enc[word_ary[i]];
    }

    return word_ary;
}

// rotate the bytes in a word
function RotWord(word_ary) {
    return new Array(word_ary[1], word_ary[2], word_ary[3], word_ary[0]);
}

// calculate the first item Rcon[i] = { x^(i-1), 0, 0, 0 }
// note we only return the first item
function Rcon(exp) {
    var val = 2;
    var result = 1;

    // remember to calculate x^(exp-1)
    exp--;

    // process the exponent using normal shift and multiply
    while (exp > 0) {
        if ((exp & 1) != 0) result = aes_mul(result, val);

        // square the value
        val = aes_mul(val, val);

        // move to the next bit
        exp >>= 1;
    }

    return result;
}

// round key generation
// return a byte array with the expanded key information
//added by Dumbbell Yang for AES192 and AES256
function key_expand(key) {
    var temp = new Array(4);
    var i, j;
    var Nb = 4;
    var Nk = key.length / Nb;
    var Nr = Nk + 6;
    var w = new Array(Nb * (Nr + 1));

    // copy initial key stuff
    for (i = 0; i < key.length; i++) {
        w[i] = key[i];
    }

    // generate rest of key schedule using 32-bit words
    i = Nk;
    // blocksize * ( rounds + 1 )
    while (i < Nb * (Nr + 1)) {
        // copy word W[i-1] to temp
        for (j = 0; j < 4; j++) temp[j] = w[(i - 1) * 4 + j];

        if (i % Nk == 0) {
            temp = RotWord(temp);
            temp = SubWord(temp);

            temp[0] ^= Rcon(i / Nk);
        } else if ((Nk > 6) && (i % Nk == 4)) {
            temp = SubWord(temp);
        }

        // word = word ^ temp
        for (j = 0; j < 4; j++) {
            w[i * 4 + j] = w[(i - Nk) * 4 + j] ^ temp[j];
        }

        i++;
    }

    return w;
}

// do S-Box substitution
function SubBytes(state, Sbox) {
    var i;

    for (i = 0; i < 16; i++) state[i] = Sbox[state[i]];

    return state;
}

// shift each row as appropriate
function ShiftRows(state) {
    var t0, t1, t2, t3;

    // top row (row 0) isn't shifted
    // next row (row 1) rotated left 1 place
    t0 = state[I10];
    t1 = state[I11];
    t2 = state[I12];
    t3 = state[I13];
    state[I10] = t1;
    state[I11] = t2;
    state[I12] = t3;
    state[I13] = t0;

    // next row (row 2) rotated left 2 places
    t0 = state[I20];
    t1 = state[I21];
    t2 = state[I22];
    t3 = state[I23];
    state[I20] = t2;
    state[I21] = t3;
    state[I22] = t0;
    state[I23] = t1;

    // bottom row (row 3) rotated left 3 places
    t0 = state[I30];
    t1 = state[I31];
    t2 = state[I32];
    t3 = state[I33];
    state[I30] = t3;
    state[I31] = t0;
    state[I32] = t1;
    state[I33] = t2;

    return state;
}

// inverset shift each row as appropriate
function InvShiftRows(state) {
    var t0, t1, t2, t3;

    // top row (row 0) isn't shifted
    // next row (row 1) rotated left 1 place
    t0 = state[I10];
    t1 = state[I11];
    t2 = state[I12];
    t3 = state[I13];
    state[I10] = t3;
    state[I11] = t0;
    state[I12] = t1;
    state[I13] = t2;

    // next row (row 2) rotated left 2 places
    t0 = state[I20];
    t1 = state[I21];
    t2 = state[I22];
    t3 = state[I23];
    state[I20] = t2;
    state[I21] = t3;
    state[I22] = t0;
    state[I23] = t1;

    // bottom row (row 3) rotated left 3 places
    t0 = state[I30];
    t1 = state[I31];
    t2 = state[I32];
    t3 = state[I33];
    state[I30] = t1;
    state[I31] = t2;
    state[I32] = t3;
    state[I33] = t0;

    return state;
}

// process column info
function MixColumns(state) {
    var col;
    var c0, c1, c2, c3;

    for (col = 0; col < 4; col++) {
        c0 = state[I(0, col)];
        c1 = state[I(1, col)];
        c2 = state[I(2, col)];
        c3 = state[I(3, col)];

        // do mixing, and put back into array
        state[I(0, col)] = aes_mul(2, c0) ^ aes_mul(3, c1) ^ c2 ^ c3;
        state[I(1, col)] = c0 ^ aes_mul(2, c1) ^ aes_mul(3, c2) ^ c3;
        state[I(2, col)] = c0 ^ c1 ^ aes_mul(2, c2) ^ aes_mul(3, c3);
        state[I(3, col)] = aes_mul(3, c0) ^ c1 ^ c2 ^ aes_mul(2, c3);
    }

    return state;
}

// inverse process column info
function InvMixColumns(state) {
    var col;
    var c0, c1, c2, c3;

    for (col = 0; col < 4; col++) {
        c0 = state[I(0, col)];
        c1 = state[I(1, col)];
        c2 = state[I(2, col)];
        c3 = state[I(3, col)];

        // do inverse mixing, and put back into array
        state[I(0, col)] = aes_mul(0x0e, c0) ^ aes_mul(0x0b, c1) ^ aes_mul(0x0d, c2) ^ aes_mul(0x09, c3);
        state[I(1, col)] = aes_mul(0x09, c0) ^ aes_mul(0x0e, c1) ^ aes_mul(0x0b, c2) ^ aes_mul(0x0d, c3);
        state[I(2, col)] = aes_mul(0x0d, c0) ^ aes_mul(0x09, c1) ^ aes_mul(0x0e, c2) ^ aes_mul(0x0b, c3);
        state[I(3, col)] = aes_mul(0x0b, c0) ^ aes_mul(0x0d, c1) ^ aes_mul(0x09, c2) ^ aes_mul(0x0e, c3);
    }

    return state;
}

// insert subkey information
function AddRoundKey(state, w, base) {
    var col;

    for (col = 0; col < 4; col++) {
        state[I(0, col)] ^= w[base + col * 4];
        state[I(1, col)] ^= w[base + col * 4 + 1];
        state[I(2, col)] ^= w[base + col * 4 + 2];
        state[I(3, col)] ^= w[base + col * 4 + 3];
    }

    return state;
}

// return a transposed array
function transpose(msg) {
    var row, col;
    var state = new Array(16);

    for (row = 0; row < 4; row++) {
        for (col = 0; col < 4; col++) {
            state[I(row, col)] = msg[I(col, row)];
        }
    }
    return state;
}

// final AES state
var AES_output = new Array(16);

// do encrytion
function aes_encrypt(key, msg) {
    var w = new Array(44); // subkey information
    var state = new Array(16); // working state
    var round;
    // problems??
    if (msg[0] < 0) {
        return;
    }

    // problems??
    if (key[0] < 0) {
        return;
    }

    // expand the key
    w = key_expand(key);
    //added by Dumbbell yang at 2011-04-30
    var Nk = key.length / 4;
    var Nr = Nk + 6;

    // initial state = message in columns (transposed from what we input)
    state = transpose(msg);
    state = AddRoundKey(state, w, 0);
    for (round = 1; round < Nr; round++) {
        state = SubBytes(state, S_enc);
        state = ShiftRows(state);
        state = MixColumns(state);

        // note here the spec uses 32-bit words, we are using bytes, so an extra *4
        state = AddRoundKey(state, w, round * 4 * 4);
    }

    SubBytes(state, S_enc);
    ShiftRows(state);
    AddRoundKey(state, w, Nr * 4 * 4);

    // process output
    AES_output = transpose(state);

    var str = cvt_hex8(AES_output[0]);
    for (var i = 1; i < 16; i++) {
        str += cvt_hex8(AES_output[i]);
    }

    return str;
}

// do decryption
function aes_decrypt(key, msg) {
    var w = new Array(44); // subkey information
    var state = new Array(16); // working state
    var round;

    //msg = hexStr2Byte(msg);
    // problems??
    if (msg[0] < 0) {
        return;
    }

    // problems??
    if (key[0] < 0) {
        return;
    }

    // expand the key
    w = key_expand(key);

    //added by Dumbbell yang at 2011-04-30
    var Nk = key.length / 4;
    var Nr = Nk + 6;

    // initial state = message
    state = transpose(msg);
    state = AddRoundKey(state, w, Nr * 4 * 4);
    for (round = Nr - 1; round >= 1; round--) {
        state = InvShiftRows(state);
        state = SubBytes(state, S_dec);

        // note here the spec uses 32-bit words, we are using bytes, so an extra *4
        state = AddRoundKey(state, w, round * 4 * 4);
        state = InvMixColumns(state);
    }

    InvShiftRows(state);
    SubBytes(state, S_dec);
    AddRoundKey(state, w, 0);

    // process output
    AES_output = transpose(state);
    // output hex byte string
    //var str = cvt_hex8( AES_output[0] );
    //for( i=1; i<16; i++ ){
    //    str += " " + cvt_hex8( AES_output[i] );
    //}
    // output ascii string
    var str = "";
    for (var i = 0; i < 16; i++) {
        str += String.fromCharCode(AES_output[i]);
    }

    return str;
}

function str2HexByte(str) {
    var dbyte = new Array(16);
    if (str.length > 16) {
        dbyte = new Array(str.length);
    }
    var i;

    // have ASCII data
    // 16 characters?
    if (str.length >= 16) {
        // 16 or more characters
        for (i = 0; i < str.length; i++) {
            dbyte[i] = str.charCodeAt(i);
        }
    } else {
        // less than 16 characters - fill with NULLs
        for (i = 0; i < str.length; i++) {
            dbyte[i] = str.charCodeAt(i);
        }
        for (i = str.length; i < 16; i++) {
            //padding 8 for Java
            dbyte[i] = 0;
        }
    }

    // return successful conversion
    return dbyte;
}

function hexStr2Byte(str) {
    var dbyte = new Array(str.length / 2);
    for (var i = 0; i < str.length / 2; i++) {
        // isolate and convert this substring
        dbyte[i] = cvt_byte(str.substr(i * 2, 2));
        if (dbyte[i] < 0) {
            // have an error
            dbyte[0] = -1;
            return dbyte;
        }
    } // for i
    return dbyte;
}

var Crypto = (function() {
    return {
        setRSAPublicKey: function(N) {
            this.rsa = new RSAKey();
            this.rsa.setPublic(N, "65537");
        },
        generateCipher: function() {
            var $this = this;
            var base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            return {
                generateAESKey: function() {
                    var key = new Array(16);
                    var r = new SecureRandom();
                    r.nextBytes(key);
                    return key;
                },
                aesEncrypt: function(plaintext, keyByte) {
                    var plaintextBytes = str2HexByte(plaintext);
                    var str = "";
                    var count = plaintextBytes.length / 16;
                    for (var i = 0; i < count; i++) {
                        str += aes_encrypt(keyByte, plaintextBytes.slice(i * 16, (i + 1) * 16));
                    }

                    return remove_spaces(str);
                },
                aesDecrypt: function(ciphertext, keyByte) {
                    var plaintext = "";
                    //ciphertext = remove_spaces(ciphertext);
                    var count = ciphertext.length / 16;
                    for (var i = 0; i < count; i++) {
                        plaintext += aes_decrypt(keyByte, ciphertext.slice(i * 16, (i + 1) * 16));
                    }
                    var i;
                    for (i = plaintext.length - 1; i >= 0; i--) {
                        if ((plaintext.charCodeAt(i) > 31) && (plaintext.charCodeAt(i) < 128)) {
                            break;
                        }
                    }

                    return plaintext.substring(0, i + 1);
                },
                encrypt: function(plaintext) {
                    this.aesKey = this.generateAESKey();
                    //console.log(this.aesKey);
                    //console.log('"'+this.bytes2string(this.aesKey)+'"');
                    var publickey = this.b16to64($this.rsa.encrypt(this.bytes2string(this.aesKey)));
                    var ciphertext = this.b16to64(this.aesEncrypt(plaintext, this.aesKey));

                    return publickey + "?" + ciphertext;
                },
                decrypt: function(ciphertext) {
                    if (!ciphertext) {
                        return null;
                    }
                    try {
                    	return this.aesDecrypt(this.string2bytes(this.b64to256(ciphertext)), this.aesKey);
                    } catch(e) {
                        alert("Invalid AES key");
                        return null;
                    }
                },
                pad16: function(bytes) {
                    var newBytes = bytes.slice(0);
                    var padding = (16 - (bytes.length % 16)) % 16;
                    for (var i = bytes.length; i < bytes.length + padding; i++) {
                        newBytes.push(0);
                    }
                    return newBytes;
                },
                b256to64: function(t) {
                    var a, c, n;
                    var r = '',
                    l = 0,
                    s = 0;
                    var tl = t.length;
                    for (n = 0; n < tl; n++) {
                        c = t.charCodeAt(n);
                        if (s == 0) {
                            r += base64Chars.charAt((c >> 2) & 63);
                            a = (c & 3) << 4;
                        } else if (s == 1) {
                            r += base64Chars.charAt((a | (c >> 4) & 15));
                            a = (c & 15) << 2;
                        } else if (s == 2) {
                            r += base64Chars.charAt(a | ((c >> 6) & 3));
                            l += 1;
                            r += base64Chars.charAt(c & 63);
                        }
                        l += 1;
                        s += 1;
                        if (s == 3) s = 0;
                    }
                    if (s > 0) {
                        r += base64Chars.charAt(a);
                        l += 1;
                        r += '=';
                        l += 1;
                    }
                    if (s == 1) {
                        r += '=';
                    }
                    return r;
                },
                b64to256: function(t) {
                    var c, n;
                    var r = '',
                    s = 0,
                    a = 0;
                    var tl = t.length;
                    for (n = 0; n < tl; n++) {
                        c = base64Chars.indexOf(t.charAt(n));
                        if (c >= 0) {
                            if (s) r += String.fromCharCode(a | (c >> (6 - s)) & 255);
                            s = (s + 2) & 7;
                            a = (c << s) & 255;
                        }
                    }
                    return r;
                },
                b16to64: function(h) {
                    var i;
                    var c;
                    var ret = "";
                    if (h.length % 2 == 1) {
                        h = "0" + h;
                    }
                    for (i = 0; i + 3 <= h.length; i += 3) {
                        c = parseInt(h.substring(i, i + 3), 16);
                        ret += base64Chars.charAt(c >> 6) + base64Chars.charAt(c & 63);
                    }
                    if (i + 1 == h.length) {
                        c = parseInt(h.substring(i, i + 1), 16);
                        ret += base64Chars.charAt(c << 2);
                    } else if (i + 2 == h.length) {
                        c = parseInt(h.substring(i, i + 2), 16);
                        ret += base64Chars.charAt(c >> 2) + base64Chars.charAt((c & 3) << 4);
                    }
                    while ((ret.length & 3) > 0) ret += "=";
                    return ret;
                },
                b64to16: function(s) {
                    var ret = "";
                    var i;
                    var k = 0;
                    var slop;
                    for (i = 0; i < s.length; ++i) {
                        if (s.charAt(i) == "=") break;
                        v = base64Chars.indexOf(s.charAt(i));
                        if (v < 0) continue;
                        if (k == 0) {
                            ret += int2char(v >> 2);
                            slop = v & 3;
                            k = 1;
                        } else if (k == 1) {
                            ret += int2char((slop << 2) | (v >> 4));
                            slop = v & 0xf;
                            k = 2;
                        } else if (k == 2) {
                            ret += int2char(slop);
                            ret += int2char(v >> 2);
                            slop = v & 3;
                            k = 3;
                        } else {
                            ret += int2char((slop << 2) | (v >> 4));
                            ret += int2char(v & 0xf);
                            k = 0;
                        }
                    }
                    if (k == 1) ret += int2char(slop << 2);
                    return ret;
                },
                // Converts a string to a byte array.
                string2bytes: function(string) {
                    var bytes = new Array();
                    for (var i = 0; i < string.length; i++) {
                        bytes.push(string.charCodeAt(i));
                    }
                    return bytes;
                },
                // Converts a byte array to a string.
                bytes2string: function(bytes) {
                    var string = "";
                    for (var i = 0; i < bytes.length; i++) {
                        string += String.fromCharCode(bytes[i]);
                    }
                    return string;
                },
                byte2HexStr: function(arrBytes) {
                    // output hexdecimal data (insert spaces)
                    var str = cvt_hex8(arrBytes[0]);
                    for (var i = 1; i < arrBytes.length; i++) {
                        str += cvt_hex8(arrBytes[i]);
                    }
                    return str;
                }
            };
        }
    };
})();

export default Crypto;