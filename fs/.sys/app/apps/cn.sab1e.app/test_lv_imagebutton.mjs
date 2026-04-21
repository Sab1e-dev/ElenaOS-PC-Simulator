/**
 * lv.imagebutton coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[imagebutton-test] " + msg);
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

export function run_imagebutton_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let host;
    let title;
    let btn;
    let canvas;
    let imgDsc;
    let clicked = false;

    _t("constructor host new lv.obj(scr)", () => {
        host = new lv.obj(scr);
        host.setSize(360, 240);
        host.align(lv.ALIGN_CENTER, 0, 0);
        if (!host) throw new Error("null host");
    });

    _t("title new lv.label(host)", () => {
        title = new lv.label(host);
        title.setText("lv.imagebutton test");
        title.align(lv.ALIGN_TOP_MID, 0, 10);
    });

    _t("constructor new lv.imagebutton(host)", () => {
        btn = new lv.imagebutton(host);
        btn.align(lv.ALIGN_TOP_MID, 0, 54);
        if (!btn) throw new Error("null imagebutton");
    });

    _t("build canvas image descriptor", () => {
        canvas = new lv.canvas(host);
        canvas.setSize(32, 32);
        canvas.initBuffer(32, 32, lv.COLOR_FORMAT_NATIVE);
        canvas.fillBg(lv.color.hex(0x1565C0), 255);
        imgDsc = canvas.image;
        if (!imgDsc || typeof imgDsc !== "object") {
            throw new Error("invalid image descriptor");
        }
    });

    _t("setSrc(released, path middle)", () => {
        btn.setSrc(lv.IMAGEBUTTON_STATE_RELEASED, null, "Kiriko.png", null);
    });

    _t("getSrcMiddle(released)", () => {
        let src = btn.getSrcMiddle(lv.IMAGEBUTTON_STATE_RELEASED);
        if (src === undefined) throw new Error("undefined middle src");
    });

    _t("setSrc(pressed, descriptor middle)", () => {
        btn.setSrc(lv.IMAGEBUTTON_STATE_PRESSED, null, imgDsc, null);
    });

    _t("getSrcMiddle(pressed)", () => {
        let src = btn.getSrcMiddle(lv.IMAGEBUTTON_STATE_PRESSED);
        if (src === undefined) throw new Error("undefined pressed src");
    });

    _t("getSrcLeft/getSrcRight allow null", () => {
        let left = btn.getSrcLeft(lv.IMAGEBUTTON_STATE_RELEASED);
        let right = btn.getSrcRight(lv.IMAGEBUTTON_STATE_RELEASED);
        if (left === undefined) throw new Error("undefined left src");
        if (right === undefined) throw new Error("undefined right src");
    });

    _t("setState(method)", () => {
        btn.setState(lv.IMAGEBUTTON_STATE_PRESSED);
    });

    _t("state property set", () => {
        btn.state = lv.IMAGEBUTTON_STATE_RELEASED;
    });

    let cb = function (e) {
        clicked = true;
        eos.console.log("[imagebutton-test] callback fired");
    };

    _t("addEventCb(CLICKED)", () => {
        let dsc = btn.addEventCb(cb, lv.EVENT_CLICKED, null);
        if (!dsc) throw new Error("null dsc");
    });

    _t("sendEvent(CLICKED) fires callback", () => {
        clicked = false;
        btn.sendEvent(lv.EVENT_CLICKED, null);
        if (!clicked) throw new Error("callback not fired");
    });

    _t("removeEventCb(cb)", () => {
        let r = btn.removeEventCb(cb);
        if (typeof r !== "boolean") throw new Error("type=" + typeof r);
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
