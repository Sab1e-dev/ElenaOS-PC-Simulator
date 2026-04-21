export function lv_arc_simple_arc() {
    let scr = eos.screen.getActive();
    let label = lv.label.create(scr);
    let arc = lv.arc.create(scr);
    lv.obj.setSize(arc, 150, 150);
    lv.arc.setRotation(arc, 135);
    lv.arc.setBgAngles(arc, 0, 270);
    lv.arc.setValue(arc, 10);
    lv.obj.center(arc);
    lv.obj.addEventCb(arc, function (e) {
        eos.print("VALUECHANGED");
        let str = lv.arc.getValue(arc) + "%";
        lv.label.setText(label, str);
        lv.arc.rotateObjToAngle(arc, label, 25);
    }, lv.EVENT_VALUE_CHANGED, null);
    lv.obj.sendEvent(arc, lv.EVENT_VALUE_CHANGED, null);
}

export function loader_with_arc() {
    let scr = eos.screen.getActive();
    let arc = lv.arc.create(scr);
    lv.arc.setRotation(arc, 270);
    lv.arc.setBgAngles(arc, 0, 360);
    lv.obj.removeStyle(arc, null, lv.PART_KNOB);   /*Be sure the knob is not displayed*/
    lv.obj.removeFlag(arc, lv.OBJ_FLAG_CLICKABLE);  /*To not allow adjusting by click*/
    lv.obj.center(arc);

    let a = lv.anim.create();
    a.var = arc;
    a.customExecCb = function (a, v) {
        lv.arc.setValue(arc, v);
    };
    a.duration = 1000;
    a.repeatCnt = lv.ANIM_REPEAT_INFINITE;
    a.repeatDelay = 500;
    a.startValue = 0;
    a.endValue = 100;

    lv.anim.start(a);
}

export function pie_chart_with_clickable_slices_using_arcs() {

    const CHART_SIZE = 250;
    const SLICE_OFFSET = 30;

    // 结构体定义转换为对象
    class SliceInfo {
        constructor(start_angle, end_angle, mid_angle, home, out) {
            this.start_angle = start_angle;
            this.end_angle = end_angle;
            this.mid_angle = mid_angle;
            this.home = home;  // {x, y}对象
            this.out = out;
        }
    }

    class SliceAnimData {
        constructor(obj, start_x, start_y, end_x, end_y) {
            this.obj = obj;
            this.start_x = start_x;
            this.start_y = start_y;
            this.end_x = end_x;
            this.end_y = end_y;
        }
    }

    // 静态变量
    let angle_accum = 0.0;
    let active_info = null;
    let active_arc = null;

    function anim_move_cb(var_data, v) {
        let d = var_data;  // 已经是SliceAnimData对象

        let x = d.start_x + Math.floor(((d.end_x - d.start_x) * v) / 100);
        let y = d.start_y + Math.floor(((d.end_y - d.start_y) * v) / 100);
        lv.obj.setPos(d.obj, x, y);
    }

    function create_slice(parent, percentage, color) {
        if (percentage <= 0) return;

        let slice_angle = (percentage * 360.0) / 100.0;
        let start = Math.floor(angle_accum + 0.5);
        angle_accum += slice_angle;
        let end = Math.floor(angle_accum + 0.5);
        if (end > 360) end = 360;

        let arc = lv.arc.create(parent);
        lv.obj.setSize(arc, CHART_SIZE, CHART_SIZE);
        lv.obj.center(arc);

        lv.arc.setMode(arc, lv.ARC_MODE_NORMAL);
        lv.arc.setBgStartAngle(arc, start);
        lv.arc.setBgEndAngle(arc, end);

        lv.obj.setStyleArcWidth(arc, CHART_SIZE / 2, lv.PART_MAIN);
        lv.obj.setStyleArcWidth(arc, 0, lv.PART_INDICATOR);

        lv.obj.setStyleArcColor(arc, color, lv.PART_MAIN);
        lv.obj.setStyleArcRounded(arc, false, lv.PART_MAIN);
        lv.obj.removeStyle(arc, null, lv.PART_KNOB);
        lv.obj.addFlag(arc, lv.OBJ_FLAG_ADV_HITTEST);

        let label = lv.label.create(arc);
        lv.label.setText(label, percentage + "%");
        let mid_angle = start + Math.floor((end - start) / 2);
        let radius = CHART_SIZE / 4;
        let x_offset = Math.floor((radius * lv.trigo.cos(mid_angle)) / (1 << lv.TRIGO_SHIFT));
        let y_offset = Math.floor((radius * lv.trigo.sin(mid_angle)) / (1 << lv.TRIGO_SHIFT));

        lv.obj.align(label, lv.ALIGN_CENTER, x_offset, y_offset);

        let info = new SliceInfo(
            start,
            end,
            mid_angle,
            { x: lv.obj.getX(arc), y: lv.obj.getY(arc) },
            false
        );

        lv.obj.addEventCb(arc, function (e) {

            // 注意：JavaScript中没有位运算右移，我们使用Math.floor代替
            let x_off = Math.floor((SLICE_OFFSET * lv.trigo.cos(info.mid_angle)) / (1 << lv.TRIGO_SHIFT));
            let y_off = Math.floor((SLICE_OFFSET * lv.trigo.sin(info.mid_angle)) / (1 << lv.TRIGO_SHIFT));

            if (active_info && active_info !== info && active_info.out) {
                let anim_back = new SliceAnimData(
                    active_arc,
                    lv.obj.getX(active_arc) - SLICE_OFFSET,
                    lv.obj.getY(active_arc) - SLICE_OFFSET,
                    active_info.home.x,
                    active_info.home.y
                );

                active_info.out = false;

                let a = lv.anim.create();
                a.var = anim_back;
                a.customExecCb = function (a, v) {
                    anim_move_cb(anim_back, v);
                };
                a.duration = 200;
                a.startValue = 0;
                a.endValue = 100;
                lv.anim.start(a);
            }

            let target_x, target_y;
            if (info.out) {
                target_x = info.home.x;
                target_y = info.home.y;
                info.out = false;
                active_info = null;
                active_arc = null;
            } else {
                target_x = info.home.x + x_off;
                target_y = info.home.y + y_off;
                info.out = true;
                active_info = info;
                active_arc = arc;
            }

            let anim_data = new SliceAnimData(
                arc,
                lv.obj.getX(arc) - SLICE_OFFSET,
                lv.obj.getY(arc) - SLICE_OFFSET,
                target_x,
                target_y
            );

            let a2 = lv.anim.create();
            a2.var = anim_data;
            a2.customExecCb = function (a, v) {
                anim_move_cb(anim_data, v);
            };
            a2.duration = 200;
            a2.startValue = 0;
            a2.endValue = 100;
            lv.anim.start(a2);
        }, lv.EVENT_CLICKED, info);
    }

    function lv_example_arc_3() {
        // 获取活动屏幕
        let scr = eos.screen.getActive();

        // 根容器：flex row
        let root = lv.obj.create(scr);
        lv.obj.setSize(root, lv.SIZE_CONTENT, lv.SIZE_CONTENT);
        lv.obj.center(root);
        lv.obj.setFlexFlow(root, lv.FLEX_FLOW_ROW);
        lv.obj.setFlexAlign(root, lv.FLEX_ALIGN_CENTER, lv.FLEX_ALIGN_CENTER, lv.FLEX_ALIGN_CENTER);

        lv.obj.setStylePadAll(root, 0, lv.PART_MAIN);
        lv.obj.setStyleBorderWidth(root, 0, lv.PART_MAIN);
        lv.obj.setStyleBorderColor(root, lv.palette.main(lv.PALETTE_RED), lv.PART_MAIN);
        lv.obj.setStyleBgOpa(root, lv.OPA_TRANSP, lv.PART_MAIN);
        lv.obj.removeFlag(root, lv.OBJ_FLAG_SCROLLABLE);

        // 切片容器
        let slices_container = lv.obj.create(root);
        lv.obj.setSize(slices_container, CHART_SIZE + 2 * SLICE_OFFSET, CHART_SIZE + 2 * SLICE_OFFSET);
        lv.obj.setStylePadAll(slices_container, 0, lv.PART_MAIN);
        lv.obj.setStyleMarginAll(slices_container, 0, lv.PART_MAIN);
        lv.obj.setStyleBorderWidth(slices_container, 0, lv.PART_MAIN);
        lv.obj.setStyleBorderColor(slices_container, lv.palette.main(lv.PALETTE_BLUE), lv.PART_MAIN);
        lv.obj.setStyleBgOpa(slices_container, lv.OPA_TRANSP, lv.PART_MAIN);
        lv.obj.removeFlag(slices_container, lv.OBJ_FLAG_SCROLLABLE);

        // // 创建切片
        angle_accum = 0.0;
        create_slice(slices_container, 12, lv.palette.main(lv.PALETTE_RED));
        create_slice(slices_container, 18, lv.palette.main(lv.PALETTE_BLUE));
        create_slice(slices_container, 26, lv.palette.main(lv.PALETTE_GREEN));
        create_slice(slices_container, 24, lv.palette.main(lv.PALETTE_ORANGE));
        create_slice(slices_container, 20, lv.palette.main(lv.PALETTE_BLUE_GREY));
    }

    // 调用示例函数
    lv_example_arc_3();
}
