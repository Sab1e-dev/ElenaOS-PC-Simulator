/**
 * lv.timer coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[timer-test] " + msg);
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

export function run_timer_test() {
    _pass = 0;
    _fail = 0;

    let fireCount = 0;
    let cb1 = function () {
        fireCount++;
        eos.console.log("[timer-test] cb1 fired count=" + fireCount);
    };
    let cb2 = function () {
        fireCount++;
        eos.console.log("[timer-test] cb2 fired count=" + fireCount);
    };

    let timer;

    _t("constructor new lv.timer(cb, period, null)", () => {
        timer = new lv.timer(cb1, 1000, null);
        if (!timer) throw new Error("null timer");
    });

    _t("pause + getPaused", () => {
        timer.pause();
        if (typeof timer.getPaused() !== "boolean") throw new Error("type");
    });

    _t("resume + getPaused", () => {
        timer.resume();
        if (typeof timer.getPaused() !== "boolean") throw new Error("type");
    });

    _t("setPeriod", () => {
        timer.setPeriod(500);
    });

    _t("setRepeatCount", () => {
        timer.setRepeatCount(2);
    });

    _t("setAutoDelete", () => {
        timer.setAutoDelete(false);
    });

    _t("reset", () => {
        timer.reset();
    });

    _t("ready", () => {
        timer.ready();
    });

    _t("getNext", () => {
        timer.getNext();
    });

    _t("prop cb", () => {
        timer.cb = cb2;
    });

    _t("prop period", () => {
        timer.period = 250;
    });

    _t("prop repeatCount", () => {
        timer.repeatCount = 1;
    });

    _t("prop autoDelete", () => {
        timer.autoDelete = false;
    });

    _t("prop paused/next", () => {
        if (typeof timer.paused !== "boolean") throw new Error("paused");
        timer.next;
    });

    _t("delete", () => {
        timer.delete();
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
