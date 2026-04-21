/**
 * lv.button coverage test
 *
 * Current binding note:
 * - lv.button has no button-exclusive instance methods.
 * - This file tests the button constructor and callback behavior on a button
 *   instance via inherited lv.obj event APIs.
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[button-test] " + msg);
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

export function run_button_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();

    let host;
    let btn;
    let title;
    let info;

    let cbFired = false;
    let eventCountBefore = 0;

    _log("info: lv.button exposes constructor only in current binding");
    _log("info: callback check uses inherited obj event APIs");

    _t("constructor host new lv.obj(scr)", () => {
        host = new lv.obj(scr);
        host.setSize(360, 220);
        host.align(lv.ALIGN_CENTER, 0, 0);
        if (!host) throw new Error("null host");
    });

    _t("title new lv.label(host)", () => {
        title = new lv.label(host);
        title.setText("lv.button test");
        title.align(lv.ALIGN_TOP_MID, 0, 10);
    });

    _t("info new lv.label(host)", () => {
        info = new lv.label(host);
        info.setText("last: none");
        info.align(lv.ALIGN_TOP_MID, 0, 36);
    });

    _t("constructor new lv.button(host)", () => {
        btn = new lv.button(host);
        btn.setSize(180, 64);
        btn.align(lv.ALIGN_CENTER, 0, 20);
        if (!btn) throw new Error("null button");
    });

    _t("button child label", () => {
        let text = new lv.label(btn);
        text.setText("Click Me");
        text.center();
    });

    _t("addFlag(CLICKABLE)", () => {
        btn.addFlag(lv.OBJ_FLAG_CLICKABLE);
    });

    _t("hasFlag(CLICKABLE) -> true", () => {
        if (!btn.hasFlag(lv.OBJ_FLAG_CLICKABLE)) {
            throw new Error("expected clickable");
        }
    });

    _t("addFlag(CHECKABLE)", () => {
        btn.addFlag(lv.OBJ_FLAG_CHECKABLE);
    });

    _t("hasFlag(CHECKABLE) -> true", () => {
        if (!btn.hasFlag(lv.OBJ_FLAG_CHECKABLE)) {
            throw new Error("expected checkable");
        }
    });

    _t("getEventCount before add -> number", () => {
        eventCountBefore = btn.getEventCount();
        if (typeof eventCountBefore !== "number") {
            throw new Error("type=" + typeof eventCountBefore);
        }
    });

    let cb = function (e) {
        cbFired = true;
        info.setText("last: clicked");
        eos.console.log("[button-test] callback fired");
    };

    _t("addEventCb(CLICKED) -> handle", () => {
        let dsc = btn.addEventCb(cb, lv.EVENT_CLICKED, null);
        if (!dsc) throw new Error("null dsc");
    });

    _t("getEventCount after add -> increased", () => {
        let n = btn.getEventCount();
        if (typeof n !== "number") throw new Error("type=" + typeof n);
        if (n < eventCountBefore + 1) {
            throw new Error("count=" + n + ", before=" + eventCountBefore);
        }
    });

    _t("sendEvent(CLICKED) fires callback", () => {
        cbFired = false;
        btn.sendEvent(lv.EVENT_CLICKED, null);
        if (!cbFired) throw new Error("callback not fired");
    });

    _t("removeEventCb(cb) -> bool", () => {
        let r = btn.removeEventCb(cb);
        if (typeof r !== "boolean") throw new Error("type=" + typeof r);
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
