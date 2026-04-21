/**
 * lv.buttonmatrix coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[buttonmatrix-test] " + msg);
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

export function run_buttonmatrix_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let btnm;
    let rows = [
        ["1", "2", "3"],
        ["A", "B", "C"],
        ["OK", "Cancel"]
    ];
    let buttonCount = 8;
    let ctrlCheckable = 128;

    _t("constructor new lv.buttonmatrix(scr)", () => {
        btnm = new lv.buttonmatrix(scr);
        btnm.setSize(300, 150);
        btnm.align(lv.ALIGN_TOP_MID, 0, 12);
        if (!btnm) throw new Error("null buttonmatrix");
    });

    _t("setMap", () => {
        btnm.setMap(rows);
    });

    _t("setCtrlMap", () => {
        let ctrlMap = [];
        for (let i = 0; i < buttonCount; i++) ctrlMap.push(0);
        btnm.setCtrlMap(ctrlMap);
    });

    _t("setSelectedButton", () => {
        btnm.setSelectedButton(0);
    });

    _t("setButtonCtrl + hasButtonCtrl", () => {
        btnm.setButtonCtrl(0, ctrlCheckable);
        let value = btnm.hasButtonCtrl(0, ctrlCheckable);
        if (typeof value !== "boolean") throw new Error("type=" + typeof value);
    });

    _t("clearButtonCtrl", () => {
        btnm.clearButtonCtrl(0, ctrlCheckable);
    });

    _t("setButtonCtrlAll + clearButtonCtrlAll", () => {
        btnm.setButtonCtrlAll(ctrlCheckable);
        btnm.clearButtonCtrlAll(ctrlCheckable);
    });

    _t("setButtonWidth", () => {
        btnm.setButtonWidth(0, 2);
    });

    _t("setOneChecked + getOneChecked", () => {
        btnm.setOneChecked(true);
        let value = btnm.getOneChecked();
        if (typeof value !== "boolean") throw new Error("type=" + typeof value);
    });

    _t("getSelectedButton + getButtonText", () => {
        let id = btnm.getSelectedButton();
        if (typeof id !== "number") throw new Error("id");
        let text = btnm.getButtonText(0);
        if (typeof text !== "string") throw new Error("text");
    });

    _t("prop map", () => {
        btnm.map = rows;
    });

    _t("prop ctrlMap", () => {
        let ctrlMap = [];
        for (let i = 0; i < buttonCount; i++) ctrlMap.push(0);
        btnm.ctrlMap = ctrlMap;
    });

    _t("prop selectedButton", () => {
        btnm.selectedButton = 1;
        if (typeof btnm.selectedButton !== "number") throw new Error("type=" + typeof btnm.selectedButton);
    });

    _t("prop oneChecked", () => {
        btnm.oneChecked = true;
        if (typeof btnm.oneChecked !== "boolean") throw new Error("type=" + typeof btnm.oneChecked);
    });

    _t("prop buttonCtrlAll", () => {
        btnm.buttonCtrlAll = ctrlCheckable;
    });

    _t("callback registration", () => {
        let dsc = btnm.addEventCb(function () {
            eos.console.log("[buttonmatrix-test] callback fired");
        }, lv.EVENT_VALUE_CHANGED, null);
        if (!dsc) throw new Error("null dsc");
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
