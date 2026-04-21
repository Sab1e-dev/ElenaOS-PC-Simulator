/**
 * lv.checkbox coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[checkbox-test] " + msg);
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

export function run_checkbox_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let host;
    let title;
    let checkbox;
    let cbFired = false;

    _t("constructor host new lv.obj(scr)", () => {
        host = new lv.obj(scr);
        host.setSize(360, 220);
        host.align(lv.ALIGN_CENTER, 0, 0);
        if (!host) throw new Error("null host");
    });

    _t("title new lv.label(host)", () => {
        title = new lv.label(host);
        title.setText("lv.checkbox test");
        title.align(lv.ALIGN_TOP_MID, 0, 10);
    });

    _t("constructor new lv.checkbox(host)", () => {
        checkbox = new lv.checkbox(host);
        checkbox.align(lv.ALIGN_TOP_LEFT, 24, 56);
        if (!checkbox) throw new Error("null checkbox");
    });

    _t("setText + getText", () => {
        checkbox.setText("Enable feature");
        let text = checkbox.getText();
        if (typeof text !== "string") throw new Error("type=" + typeof text);
        if (text.indexOf("Enable") < 0) throw new Error("unexpected text=" + text);
    });

    _t("prop text get/set", () => {
        checkbox.text = "Remember me";
        let text = checkbox.text;
        if (typeof text !== "string") throw new Error("type=" + typeof text);
        if (text !== "Remember me") throw new Error("unexpected text=" + text);
    });

    _t("checked state add/remove", () => {
        checkbox.addState(lv.STATE_CHECKED);
        if (!checkbox.hasState(lv.STATE_CHECKED)) {
            throw new Error("expected checked=true");
        }

        checkbox.removeState(lv.STATE_CHECKED);
        if (checkbox.hasState(lv.STATE_CHECKED)) {
            throw new Error("expected checked=false");
        }
    });

    let cb = function (e) {
        cbFired = true;
        eos.console.log("[checkbox-test] callback fired");
    };

    _t("addEventCb(VALUE_CHANGED) -> handle", () => {
        let dsc = checkbox.addEventCb(cb, lv.EVENT_VALUE_CHANGED, null);
        if (!dsc) throw new Error("null dsc");
    });

    _t("sendEvent(VALUE_CHANGED) fires callback", () => {
        cbFired = false;
        checkbox.sendEvent(lv.EVENT_VALUE_CHANGED, null);
        if (!cbFired) throw new Error("callback not fired");
    });

    _t("removeEventCb(cb) -> bool", () => {
        let r = checkbox.removeEventCb(cb);
        if (typeof r !== "boolean") throw new Error("type=" + typeof r);
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
