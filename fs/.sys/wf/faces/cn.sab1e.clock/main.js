const scr = eos.view.active();
const results = [];

function pass(name) {
    results.push("PASS " + name);
    eos.console.log("PASS", name);
}

function fail(name, err) {
    const msg = err && err.message ? err.message : String(err);
    results.push("FAIL " + name + " -> " + msg);
    eos.console.error("FAIL", name, msg);
}

function run(name, fn) {
    try {
        fn();
        pass(name);
    } catch (err) {
        fail(name, err);
    }
}

function expect(cond, msg) {
    if (!cond) {
        throw new Error(msg);
    }
}

run("time.getNow shape", function () {
    const now = eos.time.getNow();
    expect(now !== undefined, "time is undefined");
    expect(typeof now.year === "number", "year invalid");
    expect(typeof now.month === "number", "month invalid");
    expect(typeof now.day === "number", "day invalid");
    expect(typeof now.hour === "number", "hour invalid");
    expect(typeof now.min === "number", "min invalid");
    expect(typeof now.sec === "number", "sec invalid");
    expect(typeof now.day_of_week === "number", "day_of_week invalid");
});

// run("config set/get str", function () {
//     const key = "sni_test_str";
//     const val = "hello_sni";
//     eos.config.setStr(key, val);
//     expect(eos.config.getStr(key) === val, "config.getStr mismatch");
// });

// run("config set/get bool", function () {
//     const key = "sni_test_bool";
//     eos.config.setBool(key, true);
//     expect(eos.config.getBool(key) === true, "config.getBool mismatch");
// });

run("config set/get number", function () {
    const key = "sni_test_num";
    const val = 123.45;
    eos.config.setNumber(key, val);
    expect(eos.config.getNumber(key) === val, "config.getNumber mismatch");
});

run("Activity basic getters", function () {
    const current = eos.Activity.current();
    const visible = eos.Activity.visible();
    const bottom = eos.Activity.bottom();
    const watchface = eos.Activity.watchface();

    expect(current !== undefined, "current is undefined");
    expect(visible !== undefined, "visible is undefined");
    expect(bottom !== undefined, "bottom is undefined");
    expect(watchface !== undefined, "watchface is undefined");
    expect(eos.Activity.getView(current) === scr, "Activity.getView(current) mismatch");
    expect(typeof eos.Activity.getType(current) === "number", "Activity.getType invalid");
    expect(typeof eos.Activity.isTransitionInProgress() === "boolean", "transition flag invalid");
});

run("Activity title and appHeader visibility", function () {
    const current = eos.Activity.current();
    const oldTitle = eos.Activity.getTitle(current);
    const newTitle = "SNI API TEST";

    eos.Activity.setTitle(current, newTitle);
    expect(eos.Activity.getTitle(current) === newTitle, "Activity.setTitle failed");

    // eos.appHeader.setTitle(scr, "HEADER API TEST");
    // eos.appHeader.hide();
    // eos.appHeader.show();

    eos.Activity.setAppHeaderVisible(current, true);
    expect(eos.Activity.isAppHeaderVisible(current) === true, "setAppHeaderVisible(true) failed");

    if (oldTitle !== undefined) {
        eos.Activity.setTitle(current, oldTitle);
    }
});

run("clockHand create/center/placePivot", function () {
    const hand = eos.clockHand.create(scr, "clock_hand.bin", eos.CLOCK_HAND_SECOND, 10, 176);
    expect(hand !== undefined, "clockHand.create returned undefined");
    eos.clockHand.center(hand);
    eos.clockHand.placePivot(hand, 120, 120);
});

run("Activity.back API exists", function () {
    expect(typeof eos.Activity.back === "function", "Activity.back should be function");
});

const panel = new lv.label(scr);
panel.width = 220;
panel.longMode = lv.LABEL_LONG_WRAP;
panel.text = results.join("\n");
panel.align(lv.ALIGN_TOP_LEFT, 8, 8);

eos.console.log("SNI EOS API test done. total=", results.length);
