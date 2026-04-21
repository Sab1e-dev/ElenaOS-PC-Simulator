export function animation_example() {
    let obj = lv.obj.create(scr);
    lv.obj.setSize(obj, 100, 100);
    lv.obj.setStyleBgColor(obj, lv.color.hex(0xFF0000), 0);
    lv.obj.setY(obj, 200);
    let anim = lv.anim.create();
    anim.duration = 1000;
    anim.var = obj;
    anim.startValue = 0;
    anim.endValue = 250;
    anim.repeatCnt = 1;
    anim.customExecCb = function (a, v) {
        eos.print("Value = " + v);
        lv.obj.setX(obj, v);
    };
    anim.startCb = function (a) {
        eos.print("Anim start");
    };
    anim.deletedCb = function (a) {
        eos.print("Anim deleted");
    };
    anim.completedCb = function (a) {
        eos.print("Anim completed");
    };
    anim.getValue = function (a) {
        eos.print("Get Value");
        return 100;
    };

    anim.pathCb = lv.ANIM_PATH_CUSTOM_BEZIER3;

    anim.bezier3.x1 = 1024;
    anim.bezier3.y1 = 0;
    anim.bezier3.x2 = 594;
    anim.bezier3.y2 = 1024;

    lv.anim.start(anim);
}
