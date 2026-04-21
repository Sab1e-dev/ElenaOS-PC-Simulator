/**
 * lv.chart coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[chart-test] " + msg);
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

export function run_chart_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let chart;
    let ser;
    let cursor;

    _t("constructor new lv.chart(scr)", () => {
        chart = new lv.chart(scr);
        chart.setSize(320, 180);
        chart.align(lv.ALIGN_TOP_MID, 0, 8);
        if (!chart) throw new Error("null chart");
    });

    _t("setType", () => {
        chart.setType(lv.CHART_TYPE_LINE);
    });

    _t("setPointCount", () => {
        chart.setPointCount(12);
    });

    _t("setRange", () => {
        chart.setRange(lv.CHART_AXIS_PRIMARY_Y, 0, 100);
    });

    _t("setUpdateMode", () => {
        chart.setUpdateMode(lv.CHART_UPDATE_MODE_SHIFT);
    });

    _t("setDivLineCount", () => {
        chart.setDivLineCount(5, 5);
    });

    _t("addSeries", () => {
        ser = chart.addSeries(lv.color.hex(0x33AA66), lv.CHART_AXIS_PRIMARY_Y);
        if (!ser) throw new Error("null series");
    });

    _t("setAllValue", () => {
        chart.setAllValue(ser, 10);
    });

    _t("setNextValue", () => {
        chart.setNextValue(ser, 40);
        chart.setNextValue(ser, 70);
    });

    _t("setXStartPoint/getXStartPoint", () => {
        chart.setXStartPoint(ser, 2);
        let start = chart.getXStartPoint(ser);
        if (typeof start !== "number") throw new Error("type=" + typeof start);
    });

    _t("addCursor", () => {
        cursor = chart.addCursor(lv.color.hex(0xFF6633), lv.DIR_TOP);
        if (!cursor) throw new Error("null cursor");
    });

    _t("setNextValue2 (x,y)", () => {
        chart.setNextValue2(ser, 30, 60);
    });

    _t("getYArray/getXArray", () => {
        let yArr = chart.getYArray(ser);
        let xArr = chart.getXArray(ser);
        if (!yArr) throw new Error("null y array");
        if (chart.getType() === lv.CHART_TYPE_SCATTER && !xArr) {
            throw new Error("null x array in scatter mode");
        }
    });

    _t("getType/getPointCount", () => {
        if (typeof chart.getType() !== "number") throw new Error("type getter");
        if (typeof chart.getPointCount() !== "number") throw new Error("count getter");
    });

    _t("getPressedPoint/getFirstPointCenterOffset", () => {
        if (typeof chart.getPressedPoint() !== "number") throw new Error("pressedPoint");
        if (typeof chart.getFirstPointCenterOffset() !== "number") throw new Error("offset");
    });

    _t("refresh", () => {
        chart.refresh();
    });

    _t("prop pointCount", () => {
        chart.pointCount = 16;
        if (typeof chart.pointCount !== "number") throw new Error("type=" + typeof chart.pointCount);
    });

    _t("prop type", () => {
        chart.type = lv.CHART_TYPE_BAR;
        if (typeof chart.type !== "number") throw new Error("type=" + typeof chart.type);
    });

    _t("prop updateMode", () => {
        chart.updateMode = lv.CHART_UPDATE_MODE_CIRCULAR;
    });

    _t("prop read-only values", () => {
        if (typeof chart.pressedPoint !== "number") throw new Error("pressedPoint");
        if (typeof chart.firstPointCenterOffset !== "number") throw new Error("firstPointCenterOffset");
    });

    _t("removeSeries", () => {
        chart.removeSeries(ser);
    });

    _log("summary pass=" + _pass + " fail=" + _fail);
}
