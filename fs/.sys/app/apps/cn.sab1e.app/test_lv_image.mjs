/**
 * lv.image coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[image-test] " + msg);
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

export function run_image_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let host;
    let img;
    let canvas;
    let imgDsc;

    _t("constructor host new lv.obj(scr)", () => {
        host = new lv.obj(scr);
        host.setSize(360, 240);
        host.align(lv.ALIGN_CENTER, 0, 0);
        if (!host) throw new Error("null host");
    });

    _t("constructor new lv.image(host)", () => {
        img = new lv.image(host);
        img.align(lv.ALIGN_TOP_LEFT, 12, 12);
        if (!img) throw new Error("null image");
    });

    _t("setSrc(path string)", () => {
        img.setSrc("Kiriko.png");
    });

    _t("property src(path string)", () => {
        img.src = "Kiriko.png";
    });

    _t("getSrc type", () => {
        let src = img.getSrc();
        if (src !== null && typeof src !== "object" && typeof src !== "number" && typeof src !== "string") {
            throw new Error("unexpected src type=" + typeof src);
        }
    });

    _t("build canvas image descriptor", () => {
        canvas = new lv.canvas(host);
        canvas.setSize(32, 32);
        canvas.initBuffer(32, 32, lv.COLOR_FORMAT_NATIVE);
        canvas.fillBg(lv.color.hex(0x2E7D32), 255);
        imgDsc = canvas.image;
        if (!imgDsc || typeof imgDsc !== "object") {
            throw new Error("invalid image descriptor");
        }
    });

    _t("setSrc(image_dsc)", () => {
        img.setSrc(imgDsc);
    });

    _t("property src set/get with image_dsc", () => {
        img.src = imgDsc;
        let src = img.src;
        if (src !== null && typeof src !== "object" && typeof src !== "number" && typeof src !== "string") {
            throw new Error("unexpected src type=" + typeof src);
        }
    });

    _t("setSrc(null)", () => {
        img.setSrc(null);
    });

    _t("property src = null", () => {
        img.src = null;
    });

    _t("set/get offset", () => {
        img.setOffsetX(3);
        img.setOffsetY(4);
        if (typeof img.getOffsetX() !== "number") throw new Error("offsetX type");
        if (typeof img.getOffsetY() !== "number") throw new Error("offsetY type");
    });

    _t("set/get rotation scale", () => {
        img.setRotation(120);
        img.setScale(280);
        img.setScaleX(300);
        img.setScaleY(260);
        if (typeof img.getRotation() !== "number") throw new Error("rotation type");
        if (typeof img.getScale() !== "number") throw new Error("scale type");
        if (typeof img.getScaleX() !== "number") throw new Error("scaleX type");
        if (typeof img.getScaleY() !== "number") throw new Error("scaleY type");
    });

    _t("set/get pivot", () => {
        img.setPivot(12, 14);
        let p = { x: 0, y: 0 };
        img.getPivot(p);
        if (typeof p.x !== "number" || typeof p.y !== "number") {
            throw new Error("invalid pivot");
        }
    });

    _t("set/get antialias", () => {
        img.setAntialias(true);
        let aa = img.getAntialias();
        if (typeof aa !== "boolean") throw new Error("antialias type");
        img.antialias = false;
        if (typeof img.antialias !== "boolean") throw new Error("prop antialias type");
    });

    _t("property offsets/rotation/scale", () => {
        img.offsetX = 2;
        img.offsetY = 3;
        img.rotation = 60;
        img.scale = 256;
        img.scaleX = 260;
        img.scaleY = 252;
        if (typeof img.offsetX !== "number") throw new Error("prop offsetX type");
        if (typeof img.offsetY !== "number") throw new Error("prop offsetY type");
        if (typeof img.rotation !== "number") throw new Error("prop rotation type");
        if (typeof img.scale !== "number") throw new Error("prop scale type");
        if (typeof img.scaleX !== "number") throw new Error("prop scaleX type");
        if (typeof img.scaleY !== "number") throw new Error("prop scaleY type");
    });
    _log("summary pass=" + _pass + " fail=" + _fail);
}
