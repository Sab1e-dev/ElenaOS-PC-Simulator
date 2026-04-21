/**
 * lv.bar coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[bar-test] " + msg);
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

export function run_bar_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let bar;

    _t("constructor new lv.bar(scr)", () => {
        bar = new lv.bar(scr);
        bar.setSize(220, 20);
        bar.align(lv.ALIGN_TOP_MID, 0, 12);
        if (!bar) throw new Error("null bar");
    });

    _t("setRange", () => {
        bar.setRange(0, 100);
    });

    _t("setValue", () => {
        bar.setValue(40, lv.ANIM_OFF);
    });

    _t("setStartValue", () => {
        bar.setStartValue(10, lv.ANIM_OFF);
    });

    _t("setMode", () => {
        bar.setMode(0);
    });

    _t("setOrientation", () => {
        bar.setOrientation(0);
    });

    _t("getValue/getStartValue", () => {
        if (typeof bar.getValue() !== "number") throw new Error("value");
        if (typeof bar.getStartValue() !== "number") throw new Error("startValue");
    });

    _t("getRange getters", () => {
        if (typeof bar.getMinValue() !== "number") throw new Error("minValue");
        if (typeof bar.getMaxValue() !== "number") throw new Error("maxValue");
    });

    _t("getMode/getOrientation/isSymmetrical", () => {
        if (typeof bar.getMode() !== "number") throw new Error("mode");
        if (typeof bar.getOrientation() !== "number") throw new Error("orientation");
        if (typeof bar.isSymmetrical() !== "boolean") throw new Error("symmetrical");
    });

    _t("prop mode", () => {
        bar.mode = 0;
        if (typeof bar.mode !== "number") throw new Error("type=" + typeof bar.mode);
    });

    _t("prop orientation", () => {
        bar.orientation = 0;
        if (typeof bar.orientation !== "number") throw new Error("type=" + typeof bar.orientation);
    });

    _t("prop read-only values", () => {
        if (typeof bar.value !== "number") throw new Error("value");
        if (typeof bar.startValue !== "number") throw new Error("startValue");
        if (typeof bar.minValue !== "number") throw new Error("minValue");
        if (typeof bar.maxValue !== "number") throw new Error("maxValue");
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
