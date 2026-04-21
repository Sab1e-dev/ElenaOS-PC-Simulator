export function simple_bar() {
    let bar = lv.bar.create(scr);
    lv.obj.setSize(bar, 200, 50);
    lv.obj.center(bar);
    lv.bar.setValue(bar, 50, lv.ANIM_ON);
}

export function styled_bar() {
    let styleBg = lv.style.create();
    let styleIndic = lv.style.create();

    lv.style.init(styleBg);
    lv.style.setBorderColor(styleBg, lv.palette.main(lv.PALETTE_BLUE));
    lv.style.setBorderWidth(styleBg, 2);
    lv.style.setPadAll(styleBg, 6); // To make the indicator smaller
    lv.style.setRadius(styleBg, 6);
    lv.style.setAnimDuration(styleBg, 1000);

    lv.style.init(styleIndic);
    lv.style.setBgOpa(styleIndic, lv.OPA_COVER);
    lv.style.setBgColor(styleIndic, lv.palette.main(lv.PALETTE_BLUE));
    lv.style.setRadius(styleIndic, 3);

    let bar = lv.bar.create(eos.screen.getActive());

    lv.obj.removeStyleAll(bar); // To have a clean start
    lv.obj.addStyle(bar, styleBg, 0);
    lv.obj.addStyle(bar, styleIndic, lv.PART_INDICATOR);

    lv.obj.setSize(bar, 200, 20);
    lv.obj.center(bar);
    lv.bar.setValue(bar, 100, lv.ANIM_ON);
    styleBg = null;
    styleIndic = null;
    eos.print("Bar 2 created");
}

export function temperature_meter() {
    let styleIndic = lv.style.create();

    lv.style.init(styleIndic);
    lv.style.setBgOpa(styleIndic, lv.OPA_COVER);
    lv.style.setBgColor(styleIndic, lv.palette.main(lv.PALETTE_RED));
    lv.style.setBgGradColor(styleIndic, lv.palette.main(lv.PALETTE_BLUE));
    lv.style.setBgGradDir(styleIndic, lv.GRAD_DIR_VER);

    let bar = lv.bar.create(eos.screen.getActive());
    lv.obj.addStyle(bar, styleIndic, lv.PART_INDICATOR);
    lv.obj.setSize(bar, 20, 200);
    lv.obj.center(bar);
    lv.bar.setRange(bar, -20, 40);

    let anim = lv.anim.create();
    lv.anim.setCustomExecCb(anim, function (a, v) {
        lv.bar.setValue(bar, v, lv.ANIM_ON);
    });
    lv.anim.setDuration(anim, 3000);
    lv.anim.setPlaybackDuration(anim, 3000);
    lv.anim.setVar(anim, bar);
    lv.anim.setValues(anim, -20, 40);
    lv.anim.setRepeatCount(anim, lv.ANIM_REPEAT_INFINITE);
    lv.anim.start(anim);
}

export function stripe_pattern_and_range_value() {
    let styleIndic = lv.style.create();

    lv.style.init(styleIndic);
    lv.style.setBgImageSrc(styleIndic, "img_skew_strip");
    lv.style.setBgImageTiled(styleIndic, true);
    lv.style.setBgImageOpa(styleIndic, lv.OPA_30);

    let bar = lv.bar.create(eos.screen.getActive());
    lv.obj.addStyle(bar, styleIndic, lv.PART_INDICATOR);

    lv.obj.setSize(bar, 260, 20);
    lv.obj.center(bar);
    lv.bar.setMode(bar, lv.BAR_MODE_RANGE);
    lv.bar.setValue(bar, 90, lv.ANIM_OFF);
    lv.bar.setStartValue(bar, 20, lv.ANIM_OFF);
    styleIndic = null;
}

export function bar_with_ltr_and_rtl_base_direction() {
    let label;

    let barLtr = lv.bar.create(eos.screen.getActive());
    lv.obj.setSize(barLtr, 200, 20);
    lv.bar.setValue(barLtr, 70, lv.ANIM_OFF);
    lv.obj.align(barLtr, lv.ALIGN_CENTER, 0, -30);

    label = lv.label.create(eos.screen.getActive());
    lv.label.setText(label, "Left to Right base direction");
    lv.obj.alignTo(label, barLtr, lv.ALIGN_OUT_TOP_MID, 0, -5);

    let barRtl = lv.bar.create(eos.screen.getActive());
    lv.obj.setStyleBaseDir(barRtl, lv.BASE_DIR_RTL, 0);
    lv.obj.setSize(barRtl, 200, 20);
    lv.bar.setValue(barRtl, 70, lv.ANIM_OFF);
    lv.obj.align(barRtl, lv.ALIGN_CENTER, 0, 30);

    label = lv.label.create(eos.screen.getActive());
    lv.label.setText(label, "Right to Left base direction");
    lv.obj.alignTo(label, barRtl, lv.ALIGN_OUT_TOP_MID, 0, -5);
}

export function custom_drawer_to_show_the_current_value() {

    const MAX_VALUE = 100;
    const MIN_VALUE = 0;

    /* 事件回调 */
    function eventCb(e) {
        try {
            //TODO: 支持此功能
            const obj = lv.event.getTarget(e);

            /* label 描述符 */
            let labelDsc = {};
            // lv.drawLabelDsc.init(labelDsc);
            // labelDsc.font = lv.FONT_DEFAULT;

            // /* 获取 bar 的值并转成字符串 */
            // const value = lv.bar.getValue(obj);
            // const buf = String(value);

            // /* 计算文本尺寸 */
            // let txtSize = {};
            // lv.text.getSize(
            //     txtSize,
            //     buf,
            //     labelDsc.font,
            //     labelDsc.letterSpace,
            //     labelDsc.lineSpace,
            //     lv.COORD_MAX,
            //     labelDsc.flag
            // );

            // /* 文本区域 */
            // let txtArea = {
            //     x1: 0,
            //     y1: 0,
            //     x2: txtSize.x - 1,
            //     y2: txtSize.y - 1
            // };

            // /* 指示器区域 */
            // let indicArea = {};
            // lv.obj.getCoords(obj, indicArea);

            // lv.area.setWidth(
            //     indicArea,
            //     lv.area.getWidth(indicArea) * value / MAX_VALUE
            // );

            // /* 根据指示器长度决定文字位置和颜色 */
            // if (lv.area.getWidth(indicArea) > txtSize.x + 20) {
            //     lv.area.align(
            //         indicArea,
            //         txtArea,
            //         lv.ALIGN_RIGHT_MID,
            //         -10,
            //         0
            //     );
            //     labelDsc.color = lv.color.hex(0xFFFFFF);
            // } else {
            //     lv.area.align(
            //         indicArea,
            //         txtArea,
            //         lv.ALIGN_OUT_RIGHT_MID,
            //         10,
            //         0
            //     );
            //     labelDsc.color = lv.color.hex(0x000000);
            // }

            // labelDsc.text = buf;
            // labelDsc.textLocal = true;

            // const layer = lv.event.getLayer(e);
            // lv.drawLabel(layer, labelDsc, txtArea);
        } catch (error) {
            eos.print(error);
        }
    }

    /**
     * Custom drawer on the bar to display the current value
     */
    function custom_drawer_to_show_the_current_value() {
        const bar = lv.bar.create(eos.screen.getActive());

        lv.bar.setRange(bar, MIN_VALUE, MAX_VALUE);
        lv.obj.setSize(bar, 200, 20);
        lv.obj.center(bar);

        lv.obj.addEventCb(
            bar,
            eventCb,
            lv.EVENT_DRAW_MAIN_END,
            null
        );

        /* 动画 */
        let a = {};
        lv.anim.init(a);
        lv.anim.setVar(a, bar);
        lv.anim.setValues(a, 0, 100);

        lv.anim.setCustomExecCb(a, function (anim, v) {
            lv.bar.setValue(bar, v, lv.ANIM_OFF);
        });

        lv.anim.setDuration(a, 4000);
        lv.anim.setPlaybackDuration(a, 4000);
        lv.anim.setRepeatCount(a, lv.ANIM_REPEAT_INFINITE);
        lv.anim.start(a);
    }

    custom_drawer_to_show_the_current_value();
}

export function bar_with_opposite_direction() {
    let label;

    const barTob = lv.bar.create(eos.screen.getActive());
    lv.obj.setSize(barTob, 20, 200);
    lv.bar.setRange(barTob, 100, 0);
    lv.bar.setValue(barTob, 70, lv.ANIM_OFF);
    lv.obj.align(barTob, lv.ALIGN_CENTER, 0, -30);

    label = lv.label.create(eos.screen.getActive());
    lv.label.setText(label, "From top to bottom");
    lv.obj.alignTo(
        label,
        barTob,
        lv.ALIGN_OUT_BOTTOM_MID,
        0,
        20
    );
}
