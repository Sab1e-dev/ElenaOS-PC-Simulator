/**
 * lv.label coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[label-test] " + msg);
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

export function run_label_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let label;

    _t("constructor new lv.label(scr)", () => {
        label = new lv.label(scr);
        label.setWidth(220);
        label.align(lv.ALIGN_TOP_MID, 0, 8);
        if (!label) throw new Error("null label");
    });

    _t("setText + getText", () => {
        label.setText("Hello label");
        let text = label.getText();
        if (typeof text !== "string") throw new Error("type=" + typeof text);
    });

    _t("setLongMode + getLongMode", () => {
        label.setLongMode(lv.LABEL_LONG_WRAP);
        let mode = label.getLongMode();
        if (typeof mode !== "number") throw new Error("type=" + typeof mode);
    });

    _t("setTextSelectionStart + getTextSelectionStart", () => {
        label.setText("Selectable text");
        label.setTextSelectionStart(0);
        let value = label.getTextSelectionStart();
        if (typeof value !== "number") throw new Error("type=" + typeof value);
    });

    _t("setTextSelectionEnd + getTextSelectionEnd", () => {
        label.setTextSelectionEnd(4);
        let value = label.getTextSelectionEnd();
        if (typeof value !== "number") throw new Error("type=" + typeof value);
    });

    _t("insText", () => {
        label.setText("Helo");
        label.insText(2, "l");
    });

    _t("cutText", () => {
        label.setText("123456");
        label.cutText(2, 2);
    });

    _t("getLetterPos", () => {
        label.setText("abcdef");
        let pos = {};
        label.getLetterPos(2, pos);
        if (typeof pos.x !== "number" || typeof pos.y !== "number") {
            throw new Error("invalid point");
        }
    });

    _t("getLetterOn", () => {
        let pos = { x: 1, y: 1 };
        let index = label.getLetterOn(pos, false);
        if (typeof index !== "number") throw new Error("type=" + typeof index);
    });

    _t("isCharUnderPos", () => {
        let pos = { x: 1, y: 1 };
        let value = label.isCharUnderPos(pos);
        if (typeof value !== "boolean") throw new Error("type=" + typeof value);
    });

    _t("prop text", () => {
        label.text = "Text property";
        if (typeof label.text !== "string") throw new Error("type=" + typeof label.text);
    });

    _t("prop longMode", () => {
        label.longMode = lv.LABEL_LONG_CLIP;
        if (typeof label.longMode !== "number") throw new Error("type=" + typeof label.longMode);
    });

    _t("prop textSelectionStart", () => {
        label.textSelectionStart = 1;
        if (typeof label.textSelectionStart !== "number") throw new Error("type=" + typeof label.textSelectionStart);
    });

    _t("prop textSelectionEnd", () => {
        label.textSelectionEnd = 3;
        if (typeof label.textSelectionEnd !== "number") throw new Error("type=" + typeof label.textSelectionEnd);
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
