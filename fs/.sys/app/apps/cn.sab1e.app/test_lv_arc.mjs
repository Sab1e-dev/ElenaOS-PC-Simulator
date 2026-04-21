/**
 * lv.arc coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[arc-test] " + msg);
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

export function run_arc_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let arc;

    _t("constructor new lv.arc(scr)", () => {
        arc = new lv.arc(scr);
        arc.setSize(180, 180);
        arc.center();
        if (!arc) throw new Error("null arc");
    });

    _t("prop bgStartAngle", () => {
        arc.bgStartAngle = 15;
    });

    _t("prop bgEndAngle", () => {
        arc.bgEndAngle = 300;
    });

    _t("prop changeRate", () => {
        arc.changeRate = 720;
    });

    _t("prop startAngle", () => {
        arc.startAngle = 30;
    });

    _t("prop endAngle", () => {
        arc.endAngle = 240;
    });

    _t("prop knobOffset", () => {
        arc.knobOffset = 6;
        if (typeof arc.knobOffset !== "number") throw new Error("type=" + typeof arc.knobOffset);
    });

    _t("prop mode", () => {
        arc.mode = 0;
        if (typeof arc.mode !== "number") throw new Error("type=" + typeof arc.mode);
    });

    _t("prop rotation", () => {
        arc.rotation = 90;
        if (typeof arc.rotation !== "number") throw new Error("type=" + typeof arc.rotation);
    });

    _t("prop value", () => {
        arc.value = 50;
        if (typeof arc.value !== "number") throw new Error("type=" + typeof arc.value);
    });

    _t("getters angle/value/range", () => {
        if (typeof arc.angleStart !== "number") throw new Error("angleStart");
        if (typeof arc.angleEnd !== "number") throw new Error("angleEnd");
        if (typeof arc.bgAngleStart !== "number") throw new Error("bgAngleStart");
        if (typeof arc.bgAngleEnd !== "number") throw new Error("bgAngleEnd");
        if (typeof arc.minValue !== "number") throw new Error("minValue");
        if (typeof arc.maxValue !== "number") throw new Error("maxValue");
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
