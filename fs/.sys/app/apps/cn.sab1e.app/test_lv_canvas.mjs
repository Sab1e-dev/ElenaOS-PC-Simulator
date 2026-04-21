/**
 * lv.canvas coverage test
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[canvas-test] " + msg);
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

export function run_canvas_test() {
    _pass = 0;
    _fail = 0;

    // Keep buffer by default so the drawing stays visible on screen.
    // Set to true only when explicitly testing release logic.
    const AUTO_FREE_BUFFER = false;

    let scr = eos.view.active();
    let container;
    let canvas;

    _t("constructor new lv.canvas(scr)", () => {
        container = new lv.obj(scr);
        container.setSize(200, 200);
        container.setStyleBorderWidth(2, lv.PART_MAIN);
        container.setStyleBorderColor(lv.color.hex(0x222222), lv.PART_MAIN);
        container.setStyleBgColor(lv.color.hex(0xFFFFFF), lv.PART_MAIN);
        container.setStyleBgOpa(255, lv.PART_MAIN);
        canvas = new lv.canvas(container);
        canvas.setSize(200, 200);
        canvas.center();
        container.center();
        if (!canvas) throw new Error("null canvas");
    });

    _t("initBuffer", () => {
        canvas.initBuffer(200, 200, lv.COLOR_FORMAT_NATIVE);
    });

    _t("fillBg", () => {
        canvas.fillBg(lv.color.hex(0x1E88E5), 255);
    });

    _t("setPx + getPx", () => {
        canvas.setPx(2, 2, lv.color.hex(0xFFCC00), 255);
        let px = canvas.getPx(2, 2);
        if (!px || typeof px !== "object") throw new Error("invalid px");
    });

    _t("draw heart", () => {
        let color = lv.color.hex(0xE53935);
        let hit = 0;

        // Heart equation:
        // (x^2 + y^2 - 1)^3 - x^2*y^3 <= 0
        // Map normalized coordinates to a 200x200 canvas.
        let cx = 100;
        let cy = 108;
        let scale = 34;
        let step = 0.01; // smaller step for smoother edges

        for (let ny = -1.3; ny <= 1.3; ny += step) {
            for (let nx = -1.3; nx <= 1.3; nx += step) {
                let a = nx * nx + ny * ny - 1;
                let heart = a * a * a - nx * nx * ny * ny * ny;
                if (heart <= 0) {
                    let px = cx + Math.floor(nx * scale);
                    let py = cy - Math.floor(ny * scale);

                    if (px >= 0 && px < 200 && py >= 0 && py < 200) {
                        canvas.setPx(px, py, color, 255);
                        hit++;
                    }
                }
            }
        }

        if (hit < 500) throw new Error("too few painted pixels: " + hit);

        // Force refresh so the heart is visible immediately.
        canvas.invalidate();
        container.invalidate();
        scr.invalidate();
    });

    if (AUTO_FREE_BUFFER) {
        _t("freeBuffer", () => {
            canvas.freeBuffer();
        });
    } else {
        _log("[INFO] keep draw buffer for visual check (AUTO_FREE_BUFFER=false)");
    }

    _log("summary pass=" + _pass + " fail=" + _fail);
}
