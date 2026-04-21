/**
 * lv.screen coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[screen-test] " + msg);
}

function _t(name, fn) {
    try {
        fn();
        _pass++;
        _log("[PASS] " + name);
    } catch (e) {
        _fail++;
        _log("[FAIL] " + name + " => " + e);
    }
}

export function run_screen_test() {
    _pass = 0;
    _fail = 0;

    let scr;

    _t("static active", () => {
        scr = lv.screen.active();
        if (!scr) throw new Error("null screen");
    });

    _t("screen behaves as obj handle", () => {
        if (typeof scr.getWidth() !== "number") throw new Error("width");
        if (typeof scr.getHeight() !== "number") throw new Error("height");
    });

    _t("screen child create", () => {
        let obj = new lv.obj(scr);
        obj.setSize(40, 40);
        obj.align(lv.ALIGN_TOP_LEFT, 0, 0);
        obj.delete();
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
