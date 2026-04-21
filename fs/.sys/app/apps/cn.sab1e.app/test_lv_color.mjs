/**
 * lv.color coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[color-test] " + msg);
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

export function run_color_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let obj;
    let color;

    _t("constructor helper obj", () => {
        obj = new lv.obj(scr);
        obj.setSize(80, 80);
        obj.align(lv.ALIGN_TOP_MID, 0, 12);
    });

    _t("static hex returns object", () => {
        color = lv.color.hex(0x336699);
        if (!color || typeof color !== "object") throw new Error("type=" + typeof color);
    });

    _t("color usable in setStyleBgColor", () => {
        obj.setStyleBgColor(color, lv.PART_MAIN);
    });

    _t("second hex color usable in setStyleBorderColor", () => {
        obj.setStyleBorderWidth(2, lv.PART_MAIN);
        obj.setStyleBorderColor(lv.color.hex(0xFF6600), lv.PART_MAIN);
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
