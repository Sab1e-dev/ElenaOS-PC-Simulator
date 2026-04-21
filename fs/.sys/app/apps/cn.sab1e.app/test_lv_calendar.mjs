/**
 * lv.calendar coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[calendar-test] " + msg);
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

export function run_calendar_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let calendar;

    let dayNames = ["日", "一", "二", "三", "四", "五", "六"];
    let highlighted = [
        { year: 2026, month: 3, day: 15 },
        { year: 2026, month: 3, day: 20 },
        { year: 2026, month: 3, day: 28 },
    ];

    _t("constructor new lv.calendar(scr)", () => {
        calendar = new lv.calendar(scr);
        calendar.setSize(300, 220);
        calendar.align(lv.ALIGN_TOP_MID, 0, 8);
        if (!calendar) throw new Error("null calendar");
    });

    _t("setTodayDate", () => {
        calendar.setTodayDate(2026, 3, 15);
    });

    _t("setShowedDate", () => {
        calendar.setShowedDate(2026, 3);
    });

    _t("special method setDayNames", () => {
        calendar.setDayNames(dayNames);
    });

    _t("special method setHighlightedDates", () => {
        calendar.setHighlightedDates(highlighted, highlighted.length);
    });

    _t("getBtnmatrix", () => {
        let btnm = calendar.getBtnmatrix();
        if (!btnm) throw new Error("null btnmatrix");
    });

    _t("prop dayNames", () => {
        calendar.dayNames = dayNames;
    });

    _t("prop btnmatrix getter", () => {
        let btnm = calendar.btnmatrix;
        if (!btnm) throw new Error("null btnmatrix prop");
    });

    _t("prop highlightedDatesNum getter", () => {
        let count = calendar.highlightedDatesNum;
        if (typeof count !== "number") throw new Error("type=" + typeof count);
        if (count < 0) throw new Error("negative count");
    });

    _t("chinese mode anti-overlap layout tuning", () => {
        let btnm = calendar.getBtnmatrix();
        let PM = lv.PART_MAIN;

        // Chinese lunar labels are denser; increase cell space to avoid overlaps.
        calendar.setSize(360, 420);
        btnm.setStylePadRow(4, PM);
        btnm.setStylePadVer(4, PM);
        btnm.setStyleTextLineSpace(4, PM);
        btnm.setStyleTextLetterSpace(0, PM);
    });

    _t("prop chineseMode true/false with feature gate", () => {
        let threw = false;
        let errMsg = "";

        try {
            calendar.chineseMode = false;
            calendar.setFontSize(22);
            calendar.chineseMode = true;
        } catch (e) {
            threw = true;
            errMsg = String(e);
        }

        // Runtime behavior is the source of truth here.
        // Some builds may expose USE_CALENDAR_CHINESE constants that do not match the final linked path.
        if (threw && errMsg.indexOf("Calendar Chinese mode is disabled") < 0) {
            throw new Error("unexpected error: " + errMsg);
        }
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
