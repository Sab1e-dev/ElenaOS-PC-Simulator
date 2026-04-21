/**
 * lv.anim coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[anim-test] " + msg);
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

export function run_anim_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let target = new lv.obj(scr);
    target.setSize(40, 40);
    target.align(lv.ALIGN_TOP_LEFT, 8, 8);

    let anim;

    let execCalled = 0;
    let startCalled = 0;
    let doneCalled = 0;
    let deletedCalled = 0;

    // custom_exec callback signature is (animObj, value)
    function execCb(animObj, value) {
        execCalled++;
        if (typeof value === "number") {
            target.setX(value);
        }
    }

    function startCb() {
        startCalled++;
    }

    function completedCb() {
        doneCalled++;
    }

    function deletedCb() {
        deletedCalled++;
    }

    _t("constructor new lv.anim()", () => {
        anim = new lv.anim();
        if (!anim) throw new Error("null anim");
    });

    _t("init", () => {
        anim.init();
    });

    _t("setVar", () => {
        anim.setVar(target);
    });

    _t("setDuration + setTime", () => {
        anim.setDuration(300);
        anim.setTime(300);
    });

    _t("setDelay", () => {
        anim.setDelay(10);
    });

    _t("setValues", () => {
        anim.setValues(0, 60);
    });

    _t("set callbacks", () => {
        anim.setCustomExecCb(execCb);
        anim.setStartCb(startCb);
        anim.setCompletedCb(completedCb);
        anim.setDeletedCb(deletedCb);
    });

    _t("set playback/repeat options", () => {
        anim.setPlaybackDuration(50);
        anim.setPlaybackTime(50);
        anim.setPlaybackDelay(5);
        anim.setRepeatCount(1);
        anim.setRepeatDelay(5);
        anim.setEarlyApply(true);
        anim.setBezier3Param(0, 0, 255, 255);
    });

    _t("path methods", () => {
        if (typeof anim.pathLinear() !== "number") throw new Error("pathLinear");
        if (typeof anim.pathEaseIn() !== "number") throw new Error("pathEaseIn");
        if (typeof anim.pathEaseOut() !== "number") throw new Error("pathEaseOut");
        if (typeof anim.pathEaseInOut() !== "number") throw new Error("pathEaseInOut");
        if (typeof anim.pathOvershoot() !== "number") throw new Error("pathOvershoot");
        if (typeof anim.pathBounce() !== "number") throw new Error("pathBounce");
        if (typeof anim.pathStep() !== "number") throw new Error("pathStep");
        if (typeof anim.pathCustomBezier3() !== "number") throw new Error("pathCustomBezier3");
    });

    _t("getters", () => {
        if (typeof anim.getDelay() !== "number") throw new Error("delay");
        if (typeof anim.getPlaytime() !== "number") throw new Error("playtime");
        if (typeof anim.getTime() !== "number") throw new Error("time");
        if (typeof anim.getRepeatCount() !== "number") throw new Error("repeatCount");
    });

    _t("prop setters/getters", () => {
        anim.var = target;
        anim.duration = 280;
        anim.delay = 15;
        anim.time = 280;
        anim.playbackDuration = 40;
        anim.playbackDelay = 4;
        anim.playbackTime = 40;
        anim.repeatCount = 1;
        anim.repeatDelay = 4;
        anim.earlyApply = true;
        anim.customExecCb = execCb;
        anim.startCb = startCb;
        anim.completedCb = completedCb;
        anim.deletedCb = deletedCb;
        if (typeof anim.delay !== "number") throw new Error("delay getter");
        if (typeof anim.time !== "number") throw new Error("time getter");
        if (typeof anim.playtime !== "number") throw new Error("playtime getter");
        if (typeof anim.repeatCount !== "number") throw new Error("repeatCount getter");
    });

    _t("start", () => {
        anim.start();
    });

    _t("callback counters readable", () => {
        if (typeof execCalled !== "number") throw new Error("execCalled");
        if (typeof startCalled !== "number") throw new Error("startCalled");
        if (typeof doneCalled !== "number") throw new Error("doneCalled");
        if (typeof deletedCalled !== "number") throw new Error("deletedCalled");
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
