/**
 * lv.obj complete method coverage test
 *
 * Covers: constructor, position/size, alignment, layout, flex, hierarchy,
 *         style (set/get), flags, state, events, user-data, scroll,
 *         visibility/coords, movement, class check, lifecycle.
 *
 * Log rules: no Chinese characters. Each entry is [PASS] or [FAIL].
 */

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

let _pass = 0;
let _fail = 0;

function _log(msg) {
    eos.console.log("[obj-test] " + msg);
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

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

export function run_obj_test() {
    _pass = 0;
    _fail = 0;

    let scr = eos.view.active();
    let eventFired = false;

    /* ---- 1. Constructor ------------------------------------------- */
    let parent;
    _t("constructor new lv.obj(scr)", () => {
        parent = new lv.obj(scr);
        parent.setSize(400, 400);
        parent.align(lv.ALIGN_CENTER, 0, 0);
        if (!parent) throw new Error("null handle");
    });

    let obj;
    _t("constructor child new lv.obj(parent)", () => {
        obj = new lv.obj(parent);
        obj.setSize(200, 200);
        if (!obj) throw new Error("null handle");
    });

    // A sibling to use for alignTo and other tests
    let sib;
    _t("constructor sibling new lv.obj(parent)", () => {
        sib = new lv.obj(parent);
        sib.setSize(80, 80);
    });

    /* ---- 2. Position & Size --------------------------------------- */
    _t("setPos", () => obj.setPos(10, 20));
    _t("setX", () => obj.setX(5));
    _t("setY", () => obj.setY(5));
    _t("setSize", () => obj.setSize(180, 180));
    _t("setWidth", () => obj.setWidth(200));
    _t("setHeight", () => obj.setHeight(200));
    _t("setContentWidth", () => obj.setContentWidth(220));
    _t("setContentHeight", () => obj.setContentHeight(220));
    _t("refrSize", () => obj.refrSize());

    _t("getX -> number", () => {
        let v = obj.getX();
        if (typeof v !== "number") throw new Error("expected number, got " + typeof v);
    });
    _t("getX2 -> number", () => {
        if (typeof obj.getX2() !== "number") throw new Error("type");
    });
    _t("getY -> number", () => {
        if (typeof obj.getY() !== "number") throw new Error("type");
    });
    _t("getY2 -> number", () => {
        if (typeof obj.getY2() !== "number") throw new Error("type");
    });
    _t("getXAligned -> number", () => {
        if (typeof obj.getXAligned() !== "number") throw new Error("type");
    });
    _t("getYAligned -> number", () => {
        if (typeof obj.getYAligned() !== "number") throw new Error("type");
    });
    _t("getWidth -> number", () => {
        if (typeof obj.getWidth() !== "number") throw new Error("type");
    });
    _t("getHeight -> number", () => {
        if (typeof obj.getHeight() !== "number") throw new Error("type");
    });
    _t("getContentWidth -> number", () => {
        if (typeof obj.getContentWidth() !== "number") throw new Error("type");
    });
    _t("getContentHeight -> number", () => {
        if (typeof obj.getContentHeight() !== "number") throw new Error("type");
    });
    _t("getSelfWidth -> number", () => {
        if (typeof obj.getSelfWidth() !== "number") throw new Error("type");
    });
    _t("getSelfHeight -> number", () => {
        if (typeof obj.getSelfHeight() !== "number") throw new Error("type");
    });

    /* ---- 3. Alignment --------------------------------------------- */
    _t("center", () => obj.center());
    _t("align", () => obj.align(lv.ALIGN_TOP_MID, 0, 10));
    _t("alignTo", () => obj.alignTo(sib, lv.ALIGN_OUT_RIGHT_MID, 5, 0));
    _t("setAlign", () => obj.setAlign(lv.ALIGN_CENTER));

    /* ---- 4. Layout ------------------------------------------------- */
    _t("setLayout(NONE)", () => obj.setLayout(lv.LAYOUT_NONE));
    _t("isLayoutPositioned -> bool", () => {
        let r = obj.isLayoutPositioned();
        if (typeof r !== "boolean") throw new Error("expected boolean");
    });
    _t("markLayoutAsDirty", () => obj.markLayoutAsDirty());
    _t("updateLayout", () => obj.updateLayout());

    /* ---- 5. Flex layout ------------------------------------------- */
    let flexBox;
    _t("flex: new lv.obj for flex test", () => {
        flexBox = new lv.obj(parent);
        flexBox.setSize(200, 100);
    });
    _t("setFlexFlow", () => flexBox.setFlexFlow(lv.FLEX_FLOW_ROW));
    _t("setFlexAlign", () => flexBox.setFlexAlign(lv.FLEX_ALIGN_START, lv.FLEX_ALIGN_CENTER, lv.FLEX_ALIGN_START));
    _t("setFlexGrow", () => {
        let fc = new lv.obj(flexBox);
        fc.setFlexGrow(1);
    });

    /* ---- 6. Hierarchy --------------------------------------------- */
    _t("getParent -> obj handle", () => {
        let p = obj.getParent();
        if (!p) throw new Error("null");
    });
    _t("getScreen -> handle", () => {
        let s = obj.getScreen();
        if (!s) throw new Error("null");
    });
    _t("getDisplay -> handle", () => {
        let d = obj.getDisplay();
        if (!d) throw new Error("null");
    });
    _t("getChildCount -> number", () => {
        let n = parent.getChildCount();
        if (typeof n !== "number") throw new Error("type");
        if (n < 2) throw new Error("expected >= 2 children, got " + n);
    });
    _t("getChild(0) -> handle", () => {
        let c = parent.getChild(0);
        if (!c) throw new Error("null");
    });
    _t("getIndex -> number", () => {
        let idx = obj.getIndex();
        if (typeof idx !== "number") throw new Error("type");
    });
    _t("getSibling -> handle", () => {
        let s = obj.getSibling(1);
        // may be null if no sibling at index 1, just check no throw
    });
    _t("moveToIndex", () => obj.moveToIndex(0));
    _t("setParent", () => {
        // reparent to scr then back to parent
        obj.setParent(scr);
        obj.setParent(parent);
    });

    /* ---- 7. Style: setStyle / getStyle sample --------------------- */
    let PM = lv.PART_MAIN;

    _t("setStyleBgColor", () => obj.setStyleBgColor(0x003366, PM));
    _t("setStyleBgOpa", () => obj.setStyleBgOpa(200, PM));
    _t("setStyleBorderWidth", () => obj.setStyleBorderWidth(2, PM));
    _t("setStyleBorderColor", () => obj.setStyleBorderColor(0xFF0000, PM));
    _t("setStyleRadius", () => obj.setStyleRadius(8, PM));
    _t("setStylePadAll", () => obj.setStylePadAll(4, PM));
    _t("setStylePadTop", () => obj.setStylePadTop(2, PM));
    _t("setStylePadBottom", () => obj.setStylePadBottom(2, PM));
    _t("setStylePadLeft", () => obj.setStylePadLeft(2, PM));
    _t("setStylePadRight", () => obj.setStylePadRight(2, PM));
    _t("setStylePadRow", () => obj.setStylePadRow(2, PM));
    _t("setStylePadColumn", () => obj.setStylePadColumn(2, PM));
    _t("setStylePadHor", () => obj.setStylePadHor(2, PM));
    _t("setStylePadVer", () => obj.setStylePadVer(2, PM));
    _t("setStylePadGap", () => obj.setStylePadGap(2, PM));
    _t("setStyleMarginTop", () => obj.setStyleMarginTop(1, PM));
    _t("setStyleMarginBottom", () => obj.setStyleMarginBottom(1, PM));
    _t("setStyleMarginLeft", () => obj.setStyleMarginLeft(1, PM));
    _t("setStyleMarginRight", () => obj.setStyleMarginRight(1, PM));
    _t("setStyleMarginAll", () => obj.setStyleMarginAll(1, PM));
    _t("setStyleMarginHor", () => obj.setStyleMarginHor(1, PM));
    _t("setStyleMarginVer", () => obj.setStyleMarginVer(1, PM));
    _t("setStyleOpa", () => obj.setStyleOpa(255, PM));
    _t("setStyleOpaLayered", () => obj.setStyleOpaLayered(255, PM));
    _t("setStyleTextColor", () => obj.setStyleTextColor(0xFFFFFF, PM));
    _t("setStyleTextOpa", () => obj.setStyleTextOpa(255, PM));
    _t("setStyleTextLetterSpace", () => obj.setStyleTextLetterSpace(0, PM));
    _t("setStyleTextLineSpace", () => obj.setStyleTextLineSpace(2, PM));
    _t("setStyleTextDecor", () => obj.setStyleTextDecor(0, PM));
    _t("setStyleTextAlign", () => obj.setStyleTextAlign(0, PM));
    _t("setStyleShadowWidth", () => obj.setStyleShadowWidth(4, PM));
    _t("setStyleShadowOffsetX", () => obj.setStyleShadowOffsetX(2, PM));
    _t("setStyleShadowOffsetY", () => obj.setStyleShadowOffsetY(2, PM));
    _t("setStyleShadowSpread", () => obj.setStyleShadowSpread(1, PM));
    _t("setStyleShadowColor", () => obj.setStyleShadowColor(0x000000, PM));
    _t("setStyleShadowOpa", () => obj.setStyleShadowOpa(180, PM));
    _t("setStyleOutlineWidth", () => obj.setStyleOutlineWidth(1, PM));
    _t("setStyleOutlineColor", () => obj.setStyleOutlineColor(0x00FF00, PM));
    _t("setStyleOutlineOpa", () => obj.setStyleOutlineOpa(100, PM));
    _t("setStyleOutlinePad", () => obj.setStyleOutlinePad(0, PM));
    _t("setStyleBorderOpa", () => obj.setStyleBorderOpa(255, PM));
    _t("setStyleBorderSide", () => obj.setStyleBorderSide(0x0F, PM));
    _t("setStyleBorderPost", () => obj.setStyleBorderPost(false, PM));
    _t("setStyleBgGradColor", () => obj.setStyleBgGradColor(0x006699, PM));
    _t("setStyleBgGradDir", () => obj.setStyleBgGradDir(1, PM));
    _t("setStyleBgMainStop", () => obj.setStyleBgMainStop(0, PM));
    _t("setStyleBgGradStop", () => obj.setStyleBgGradStop(255, PM));
    _t("setStyleBgMainOpa", () => obj.setStyleBgMainOpa(255, PM));
    _t("setStyleBgGradOpa", () => obj.setStyleBgGradOpa(200, PM));
    _t("setStyleBgImageOpa", () => obj.setStyleBgImageOpa(255, PM));
    _t("setStyleBgImageRecolor", () => obj.setStyleBgImageRecolor(0x000000, PM));
    _t("setStyleBgImageRecolorOpa", () => obj.setStyleBgImageRecolorOpa(0, PM));
    _t("setStyleBgImageTiled", () => obj.setStyleBgImageTiled(false, PM));
    _t("setStyleImageOpa", () => obj.setStyleImageOpa(255, PM));
    _t("setStyleImageRecolor", () => obj.setStyleImageRecolor(0x000000, PM));
    _t("setStyleImageRecolorOpa", () => obj.setStyleImageRecolorOpa(0, PM));
    _t("setStyleLineWidth", () => obj.setStyleLineWidth(1, PM));
    _t("setStyleLineDashWidth", () => obj.setStyleLineDashWidth(4, PM));
    _t("setStyleLineDashGap", () => obj.setStyleLineDashGap(2, PM));
    _t("setStyleLineRounded", () => obj.setStyleLineRounded(false, PM));
    _t("setStyleLineColor", () => obj.setStyleLineColor(0xFFFFFF, PM));
    _t("setStyleLineOpa", () => obj.setStyleLineOpa(255, PM));
    _t("setStyleArcWidth", () => obj.setStyleArcWidth(4, PM));
    _t("setStyleArcRounded", () => obj.setStyleArcRounded(true, PM));
    _t("setStyleArcColor", () => obj.setStyleArcColor(0x00AAFF, PM));
    _t("setStyleArcOpa", () => obj.setStyleArcOpa(255, PM));
    _t("setStyleClipCorner", () => obj.setStyleClipCorner(false, PM));
    _t("setStyleBlendMode", () => obj.setStyleBlendMode(0, PM));
    _t("setStyleBaseDir", () => obj.setStyleBaseDir(0, PM));
    _t("setStyleAnimDuration", () => obj.setStyleAnimDuration(200, PM));
    _t("setStyleSize", () => obj.setStyleSize(200, 200, PM));
    _t("setStyleTransformWidth", () => obj.setStyleTransformWidth(0, PM));
    _t("setStyleTransformHeight", () => obj.setStyleTransformHeight(0, PM));
    _t("setStyleTranslateX", () => obj.setStyleTranslateX(0, PM));
    _t("setStyleTranslateY", () => obj.setStyleTranslateY(0, PM));
    _t("setStyleTransformScaleX", () => obj.setStyleTransformScaleX(256, PM));
    _t("setStyleTransformScaleY", () => obj.setStyleTransformScaleY(256, PM));
    _t("setStyleTransformRotation", () => obj.setStyleTransformRotation(0, PM));
    _t("setStyleTransformPivotX", () => obj.setStyleTransformPivotX(0, PM));
    _t("setStyleTransformPivotY", () => obj.setStyleTransformPivotY(0, PM));
    _t("setStyleTransformSkewX", () => obj.setStyleTransformSkewX(0, PM));
    _t("setStyleTransformSkewY", () => obj.setStyleTransformSkewY(0, PM));
    _t("setStyleTransformScale", () => obj.setStyleTransformScale(256, PM));
    _t("setStyleX", () => obj.setStyleX(0, PM));
    _t("setStyleY", () => obj.setStyleY(0, PM));
    _t("setStyleAlign", () => obj.setStyleAlign(lv.ALIGN_TOP_MID, PM));
    _t("setStyleWidth", () => obj.setStyleWidth(200, PM));
    _t("setStyleMinWidth", () => obj.setStyleMinWidth(0, PM));
    _t("setStyleMaxWidth", () => obj.setStyleMaxWidth(400, PM));
    _t("setStyleHeight", () => obj.setStyleHeight(200, PM));
    _t("setStyleMinHeight", () => obj.setStyleMinHeight(0, PM));
    _t("setStyleMaxHeight", () => obj.setStyleMaxHeight(400, PM));
    _t("setStyleLength", () => obj.setStyleLength(0, PM));
    _t("setStyleRotarySensitivity", () => obj.setStyleRotarySensitivity(256, PM));
    _t("setStyleLayout", () => obj.setStyleLayout(lv.LAYOUT_NONE, PM));
    _t("setStyleFlexFlow", () => obj.setStyleFlexFlow(lv.FLEX_FLOW_ROW, PM));
    _t("setStyleFlexMainPlace", () => obj.setStyleFlexMainPlace(lv.FLEX_ALIGN_START, PM));
    _t("setStyleFlexCrossPlace", () => obj.setStyleFlexCrossPlace(lv.FLEX_ALIGN_CENTER, PM));
    _t("setStyleFlexTrackPlace", () => obj.setStyleFlexTrackPlace(lv.FLEX_ALIGN_START, PM));
    _t("setStyleFlexGrow", () => obj.setStyleFlexGrow(0, PM));
    _t("setStyleGridColumnAlign", () => obj.setStyleGridColumnAlign(lv.GRID_ALIGN_START, PM));
    _t("setStyleGridRowAlign", () => obj.setStyleGridRowAlign(lv.GRID_ALIGN_START, PM));
    _t("setStyleGridCellColumnPos", () => obj.setStyleGridCellColumnPos(0, PM));
    _t("setStyleGridCellXAlign", () => obj.setStyleGridCellXAlign(lv.GRID_ALIGN_START, PM));
    _t("setStyleGridCellColumnSpan", () => obj.setStyleGridCellColumnSpan(1, PM));
    _t("setStyleGridCellRowPos", () => obj.setStyleGridCellRowPos(0, PM));
    _t("setStyleGridCellYAlign", () => obj.setStyleGridCellYAlign(lv.GRID_ALIGN_START, PM));
    _t("setStyleGridCellRowSpan", () => obj.setStyleGridCellRowSpan(1, PM));
    _t("setStyleColorFilterOpa", () => obj.setStyleColorFilterOpa(255, PM));

    /* ---- 8. Style getters (representative sample) ----------------- */
    _t("getStyleBgOpa -> number", () => {
        if (typeof obj.getStyleBgOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleRadius -> number", () => {
        if (typeof obj.getStyleRadius(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBorderWidth -> number", () => {
        if (typeof obj.getStyleBorderWidth(PM) !== "number") throw new Error("type");
    });
    _t("getStyleOpa -> number", () => {
        if (typeof obj.getStyleOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleOpaLayered -> number", () => {
        if (typeof obj.getStyleOpaLayered(PM) !== "number") throw new Error("type");
    });
    _t("getStyleWidth -> number", () => {
        if (typeof obj.getStyleWidth(PM) !== "number") throw new Error("type");
    });
    _t("getStyleHeight -> number", () => {
        if (typeof obj.getStyleHeight(PM) !== "number") throw new Error("type");
    });
    _t("getStyleMinWidth -> number", () => {
        if (typeof obj.getStyleMinWidth(PM) !== "number") throw new Error("type");
    });
    _t("getStyleMaxWidth -> number", () => {
        if (typeof obj.getStyleMaxWidth(PM) !== "number") throw new Error("type");
    });
    _t("getStyleMinHeight -> number", () => {
        if (typeof obj.getStyleMinHeight(PM) !== "number") throw new Error("type");
    });
    _t("getStyleMaxHeight -> number", () => {
        if (typeof obj.getStyleMaxHeight(PM) !== "number") throw new Error("type");
    });
    _t("getStyleLength -> number", () => {
        if (typeof obj.getStyleLength(PM) !== "number") throw new Error("type");
    });
    _t("getStyleX -> number", () => {
        if (typeof obj.getStyleX(PM) !== "number") throw new Error("type");
    });
    _t("getStyleY -> number", () => {
        if (typeof obj.getStyleY(PM) !== "number") throw new Error("type");
    });
    _t("getStyleAlign -> number", () => {
        if (typeof obj.getStyleAlign(PM) !== "number") throw new Error("type");
    });
    _t("getStylePadTop -> number", () => {
        if (typeof obj.getStylePadTop(PM) !== "number") throw new Error("type");
    });
    _t("getStylePadBottom -> number", () => {
        if (typeof obj.getStylePadBottom(PM) !== "number") throw new Error("type");
    });
    _t("getStylePadLeft -> number", () => {
        if (typeof obj.getStylePadLeft(PM) !== "number") throw new Error("type");
    });
    _t("getStylePadRight -> number", () => {
        if (typeof obj.getStylePadRight(PM) !== "number") throw new Error("type");
    });
    _t("getStylePadRow -> number", () => {
        if (typeof obj.getStylePadRow(PM) !== "number") throw new Error("type");
    });
    _t("getStylePadColumn -> number", () => {
        if (typeof obj.getStylePadColumn(PM) !== "number") throw new Error("type");
    });
    _t("getStyleMarginTop -> number", () => {
        if (typeof obj.getStyleMarginTop(PM) !== "number") throw new Error("type");
    });
    _t("getStyleMarginBottom -> number", () => {
        if (typeof obj.getStyleMarginBottom(PM) !== "number") throw new Error("type");
    });
    _t("getStyleMarginLeft -> number", () => {
        if (typeof obj.getStyleMarginLeft(PM) !== "number") throw new Error("type");
    });
    _t("getStyleMarginRight -> number", () => {
        if (typeof obj.getStyleMarginRight(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBgGradDir -> number", () => {
        if (typeof obj.getStyleBgGradDir(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBgMainStop -> number", () => {
        if (typeof obj.getStyleBgMainStop(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBgGradStop -> number", () => {
        if (typeof obj.getStyleBgGradStop(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBgMainOpa -> number", () => {
        if (typeof obj.getStyleBgMainOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBgGradOpa -> number", () => {
        if (typeof obj.getStyleBgGradOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBgImageOpa -> number", () => {
        if (typeof obj.getStyleBgImageOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBgImageTiled -> bool", () => {
        let v = obj.getStyleBgImageTiled(PM);
        if (typeof v !== "boolean") throw new Error("type");
    });
    _t("getStyleBorderOpa -> number", () => {
        if (typeof obj.getStyleBorderOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBorderSide -> number", () => {
        if (typeof obj.getStyleBorderSide(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBorderPost -> bool", () => {
        let v = obj.getStyleBorderPost(PM);
        if (typeof v !== "boolean") throw new Error("type");
    });
    _t("getStyleOutlineWidth -> number", () => {
        if (typeof obj.getStyleOutlineWidth(PM) !== "number") throw new Error("type");
    });
    _t("getStyleOutlineOpa -> number", () => {
        if (typeof obj.getStyleOutlineOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleOutlinePad -> number", () => {
        if (typeof obj.getStyleOutlinePad(PM) !== "number") throw new Error("type");
    });
    _t("getStyleShadowWidth -> number", () => {
        if (typeof obj.getStyleShadowWidth(PM) !== "number") throw new Error("type");
    });
    _t("getStyleShadowOffsetX -> number", () => {
        if (typeof obj.getStyleShadowOffsetX(PM) !== "number") throw new Error("type");
    });
    _t("getStyleShadowOffsetY -> number", () => {
        if (typeof obj.getStyleShadowOffsetY(PM) !== "number") throw new Error("type");
    });
    _t("getStyleShadowSpread -> number", () => {
        if (typeof obj.getStyleShadowSpread(PM) !== "number") throw new Error("type");
    });
    _t("getStyleShadowOpa -> number", () => {
        if (typeof obj.getStyleShadowOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleImageOpa -> number", () => {
        if (typeof obj.getStyleImageOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleLineWidth -> number", () => {
        if (typeof obj.getStyleLineWidth(PM) !== "number") throw new Error("type");
    });
    _t("getStyleLineDashWidth -> number", () => {
        if (typeof obj.getStyleLineDashWidth(PM) !== "number") throw new Error("type");
    });
    _t("getStyleLineDashGap -> number", () => {
        if (typeof obj.getStyleLineDashGap(PM) !== "number") throw new Error("type");
    });
    _t("getStyleLineRounded -> bool", () => {
        let v = obj.getStyleLineRounded(PM);
        if (typeof v !== "boolean") throw new Error("type");
    });
    _t("getStyleLineOpa -> number", () => {
        if (typeof obj.getStyleLineOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleArcWidth -> number", () => {
        if (typeof obj.getStyleArcWidth(PM) !== "number") throw new Error("type");
    });
    _t("getStyleArcRounded -> bool", () => {
        let v = obj.getStyleArcRounded(PM);
        if (typeof v !== "boolean") throw new Error("type");
    });
    _t("getStyleArcOpa -> number", () => {
        if (typeof obj.getStyleArcOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTextOpa -> number", () => {
        if (typeof obj.getStyleTextOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTextLetterSpace -> number", () => {
        if (typeof obj.getStyleTextLetterSpace(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTextLineSpace -> number", () => {
        if (typeof obj.getStyleTextLineSpace(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTextDecor -> number", () => {
        if (typeof obj.getStyleTextDecor(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTextAlign -> number", () => {
        if (typeof obj.getStyleTextAlign(PM) !== "number") throw new Error("type");
    });
    _t("getStyleClipCorner -> bool", () => {
        let v = obj.getStyleClipCorner(PM);
        if (typeof v !== "boolean") throw new Error("type");
    });
    _t("getStyleBlendMode -> number", () => {
        if (typeof obj.getStyleBlendMode(PM) !== "number") throw new Error("type");
    });
    _t("getStyleAnimDuration -> number", () => {
        if (typeof obj.getStyleAnimDuration(PM) !== "number") throw new Error("type");
    });
    _t("getStyleLayout -> number", () => {
        if (typeof obj.getStyleLayout(PM) !== "number") throw new Error("type");
    });
    _t("getStyleBaseDir -> number", () => {
        if (typeof obj.getStyleBaseDir(PM) !== "number") throw new Error("type");
    });
    _t("getStyleRotarySensitivity -> number", () => {
        if (typeof obj.getStyleRotarySensitivity(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformWidth -> number", () => {
        if (typeof obj.getStyleTransformWidth(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformHeight -> number", () => {
        if (typeof obj.getStyleTransformHeight(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTranslateX -> number", () => {
        if (typeof obj.getStyleTranslateX(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTranslateY -> number", () => {
        if (typeof obj.getStyleTranslateY(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformScaleX -> number", () => {
        if (typeof obj.getStyleTransformScaleX(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformScaleY -> number", () => {
        if (typeof obj.getStyleTransformScaleY(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformRotation -> number", () => {
        if (typeof obj.getStyleTransformRotation(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformPivotX -> number", () => {
        if (typeof obj.getStyleTransformPivotX(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformPivotY -> number", () => {
        if (typeof obj.getStyleTransformPivotY(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformSkewX -> number", () => {
        if (typeof obj.getStyleTransformSkewX(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformSkewY -> number", () => {
        if (typeof obj.getStyleTransformSkewY(PM) !== "number") throw new Error("type");
    });
    _t("getStyleSpaceLeft -> number", () => {
        if (typeof obj.getStyleSpaceLeft(PM) !== "number") throw new Error("type");
    });
    _t("getStyleSpaceRight -> number", () => {
        if (typeof obj.getStyleSpaceRight(PM) !== "number") throw new Error("type");
    });
    _t("getStyleSpaceTop -> number", () => {
        if (typeof obj.getStyleSpaceTop(PM) !== "number") throw new Error("type");
    });
    _t("getStyleSpaceBottom -> number", () => {
        if (typeof obj.getStyleSpaceBottom(PM) !== "number") throw new Error("type");
    });
    _t("getStyleColorFilterOpa -> number", () => {
        if (typeof obj.getStyleColorFilterOpa(PM) !== "number") throw new Error("type");
    });
    _t("getStyleFlexFlow -> number", () => {
        if (typeof obj.getStyleFlexFlow(PM) !== "number") throw new Error("type");
    });
    _t("getStyleFlexMainPlace -> number", () => {
        if (typeof obj.getStyleFlexMainPlace(PM) !== "number") throw new Error("type");
    });
    _t("getStyleFlexCrossPlace -> number", () => {
        if (typeof obj.getStyleFlexCrossPlace(PM) !== "number") throw new Error("type");
    });
    _t("getStyleFlexTrackPlace -> number", () => {
        if (typeof obj.getStyleFlexTrackPlace(PM) !== "number") throw new Error("type");
    });
    _t("getStyleFlexGrow -> number", () => {
        if (typeof obj.getStyleFlexGrow(PM) !== "number") throw new Error("type");
    });
    _t("getStyleGridColumnAlign -> number", () => {
        if (typeof obj.getStyleGridColumnAlign(PM) !== "number") throw new Error("type");
    });
    _t("getStyleGridRowAlign -> number", () => {
        if (typeof obj.getStyleGridRowAlign(PM) !== "number") throw new Error("type");
    });
    _t("getStyleGridCellColumnPos -> number", () => {
        if (typeof obj.getStyleGridCellColumnPos(PM) !== "number") throw new Error("type");
    });
    _t("getStyleGridCellXAlign -> number", () => {
        if (typeof obj.getStyleGridCellXAlign(PM) !== "number") throw new Error("type");
    });
    _t("getStyleGridCellColumnSpan -> number", () => {
        if (typeof obj.getStyleGridCellColumnSpan(PM) !== "number") throw new Error("type");
    });
    _t("getStyleGridCellRowPos -> number", () => {
        if (typeof obj.getStyleGridCellRowPos(PM) !== "number") throw new Error("type");
    });
    _t("getStyleGridCellYAlign -> number", () => {
        if (typeof obj.getStyleGridCellYAlign(PM) !== "number") throw new Error("type");
    });
    _t("getStyleGridCellRowSpan -> number", () => {
        if (typeof obj.getStyleGridCellRowSpan(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformScaleXSafe -> number", () => {
        if (typeof obj.getStyleTransformScaleXSafe(PM) !== "number") throw new Error("type");
    });
    _t("getStyleTransformScaleYSafe -> number", () => {
        if (typeof obj.getStyleTransformScaleYSafe(PM) !== "number") throw new Error("type");
    });
    _t("getStyleOpaRecursive -> number", () => {
        if (typeof obj.getStyleOpaRecursive(PM) !== "number") throw new Error("type");
    });
    _t("calculateStyleTextAlign -> number", () => {
        if (typeof obj.calculateStyleTextAlign(PM, "abc") !== "number") throw new Error("type");
    });

    /* ---- 9. Style ops ---------------------------------------------- */
    _t("removeStyleAll", () => obj.removeStyleAll());
    _t("refreshStyle", () => obj.refreshStyle(PM, lv.STYLE_PROP_ANY));
    _t("hasStyleProp -> bool", () => {
        let r = obj.hasStyleProp(PM, lv.STYLE_BG_COLOR);
        if (typeof r !== "boolean") throw new Error("type");
    });
    _t("calculateExtDrawSize -> number", () => {
        let v = obj.calculateExtDrawSize(PM);
        if (typeof v !== "number") throw new Error("type");
    });
    _t("refreshExtDrawSize", () => obj.refreshExtDrawSize());

    /* ---- 10. Fade -------------------------------------------------- */
    _t("fadeIn", () => obj.fadeIn(200, 0));
    _t("fadeOut", () => obj.fadeOut(200, 0));

    /* ---- 11. Flags ------------------------------------------------- */
    _t("addFlag(CLICKABLE)", () => obj.addFlag(lv.OBJ_FLAG_CLICKABLE));
    _t("hasFlag(CLICKABLE) -> true", () => {
        if (!obj.hasFlag(lv.OBJ_FLAG_CLICKABLE)) throw new Error("expected true");
    });
    _t("hasFlagAny(CLICKABLE) -> true", () => {
        if (!obj.hasFlagAny(lv.OBJ_FLAG_CLICKABLE)) throw new Error("expected true");
    });
    _t("addFlag(CHECKABLE)", () => obj.addFlag(lv.OBJ_FLAG_CHECKABLE));
    _t("removeFlag(CHECKABLE)", () => obj.removeFlag(lv.OBJ_FLAG_CHECKABLE));
    _t("hasFlag(CHECKABLE) -> false after remove", () => {
        if (obj.hasFlag(lv.OBJ_FLAG_CHECKABLE)) throw new Error("expected false");
    });
    _t("updateFlag(HIDDEN, false)", () => obj.updateFlag(lv.OBJ_FLAG_HIDDEN, false));
    _t("updateFlag(SCROLLABLE, true)", () => obj.updateFlag(lv.OBJ_FLAG_SCROLLABLE, true));

    /* ---- 12. State ------------------------------------------------- */
    _t("addState(PRESSED)", () => obj.addState(lv.STATE_PRESSED));
    _t("hasState(PRESSED) -> true", () => {
        if (!obj.hasState(lv.STATE_PRESSED)) throw new Error("expected true");
    });
    _t("removeState(PRESSED)", () => obj.removeState(lv.STATE_PRESSED));
    _t("hasState(PRESSED) -> false after remove", () => {
        if (obj.hasState(lv.STATE_PRESSED)) throw new Error("expected false");
    });
    _t("getState -> number", () => {
        if (typeof obj.getState() !== "number") throw new Error("type");
    });
    _t("setState(DEFAULT, true)", () => obj.setState(lv.STATE_DEFAULT, true));
    _t("addState(DISABLED) then removeState", () => {
        obj.addState(lv.STATE_DISABLED);
        obj.removeState(lv.STATE_DISABLED);
    });

    /* ---- 13. Events ----------------------------------------------- */
    let cbFired = false;
    let cb1 = function(e) { cbFired = true; };
    let dsc1;
    _t("addEventCb -> handle", () => {
        dsc1 = obj.addEventCb(cb1, lv.EVENT_CLICKED, null);
        if (!dsc1) throw new Error("null dsc");
    });
    _t("getEventCount -> 1", () => {
        let n = obj.getEventCount();
        if (typeof n !== "number") throw new Error("type");
        if (n < 1) throw new Error("count=" + n);
    });
    _t("getEventDsc(0) -> handle", () => {
        let d = obj.getEventDsc(0);
        if (!d) throw new Error("null");
    });
    _t("sendEvent(CLICKED) fires callback", () => {
        cbFired = false;
        obj.sendEvent(lv.EVENT_CLICKED, null);
        if (!cbFired) throw new Error("callback not fired");
    });
    _t("removeEventCb(cb) -> bool", () => {
        let r = obj.removeEventCb(cb1);
        if (typeof r !== "boolean") throw new Error("type");
    });

    // addEventCb + removeEventDsc
    let cb2 = function(e) {};
    let dsc2;
    _t("addEventCb (for dsc remove)", () => {
        dsc2 = obj.addEventCb(cb2, lv.EVENT_ALL, null);
        if (!dsc2) throw new Error("null");
    });
    _t("removeEventDsc -> bool", () => {
        let r = obj.removeEventDsc(dsc2);
        if (typeof r !== "boolean") throw new Error("type");
    });

    // addEventCb + removeEvent
    let cb3 = function(e) {};
    _t("addEventCb (for removeEvent)", () => {
        obj.addEventCb(cb3, lv.EVENT_ALL, null);
    });
    _t("removeEvent(0) -> bool", () => {
        let r = obj.removeEvent(0);
        if (typeof r !== "boolean") throw new Error("type");
    });

    // addEventCb + removeEventCbWithUserData
    let cb4 = function(e) {};
    let ud = {tag: "test"};
    _t("addEventCb with user_data", () => {
        obj.addEventCb(cb4, lv.EVENT_ALL, ud);
    });
    _t("removeEventCbWithUserData -> number", () => {
        let n = obj.removeEventCbWithUserData(cb4, ud);
        if (typeof n !== "number") throw new Error("type");
    });

    /* ---- 14. User data -------------------------------------------- */
    _t("setUserData + getUserData", () => {
        obj.setUserData({key: "value", num: 42});
        let d = obj.getUserData();
        if (typeof d !== "object") throw new Error("type " + typeof d);
    });

    /* ---- 15. Scroll ----------------------------------------------- */
    // Make parent large enough for scroll to have effect
    _t("setScrollbarMode(AUTO)", () => parent.setScrollbarMode(lv.SCROLLBAR_MODE_AUTO));
    _t("setScrollDir(ALL)", () => parent.setScrollDir(lv.DIR_ALL));
    _t("setScrollSnapX(NONE)", () => parent.setScrollSnapX(lv.SCROLL_SNAP_NONE));
    _t("setScrollSnapY(NONE)", () => parent.setScrollSnapY(lv.SCROLL_SNAP_NONE));
    _t("getScrollbarMode -> number", () => {
        if (typeof parent.getScrollbarMode() !== "number") throw new Error("type");
    });
    _t("getScrollDir -> number", () => {
        if (typeof parent.getScrollDir() !== "number") throw new Error("type");
    });
    _t("getScrollSnapX -> number", () => {
        if (typeof parent.getScrollSnapX() !== "number") throw new Error("type");
    });
    _t("getScrollSnapY -> number", () => {
        if (typeof parent.getScrollSnapY() !== "number") throw new Error("type");
    });
    _t("getScrollX -> number", () => {
        if (typeof parent.getScrollX() !== "number") throw new Error("type");
    });
    _t("getScrollY -> number", () => {
        if (typeof parent.getScrollY() !== "number") throw new Error("type");
    });
    _t("getScrollTop -> number", () => {
        if (typeof parent.getScrollTop() !== "number") throw new Error("type");
    });
    _t("getScrollBottom -> number", () => {
        if (typeof parent.getScrollBottom() !== "number") throw new Error("type");
    });
    _t("getScrollLeft -> number", () => {
        if (typeof parent.getScrollLeft() !== "number") throw new Error("type");
    });
    _t("getScrollRight -> number", () => {
        if (typeof parent.getScrollRight() !== "number") throw new Error("type");
    });
    _t("scrollBy", () => parent.scrollBy(5, 0, lv.ANIM_OFF));
    _t("scrollByBounded", () => parent.scrollByBounded(0, 5, lv.ANIM_OFF));
    _t("scrollTo", () => parent.scrollTo(0, 0, lv.ANIM_OFF));
    _t("scrollToX", () => parent.scrollToX(0, lv.ANIM_OFF));
    _t("scrollToY", () => parent.scrollToY(0, lv.ANIM_OFF));
    _t("scrollToView", () => obj.scrollToView(lv.ANIM_OFF));
    _t("scrollToViewRecursive", () => obj.scrollToViewRecursive(lv.ANIM_OFF));
    _t("isScrolling -> bool", () => {
        if (typeof parent.isScrolling() !== "boolean") throw new Error("type");
    });
    _t("updateSnap", () => parent.updateSnap(lv.ANIM_OFF));
    _t("scrollbarInvalidate", () => parent.scrollbarInvalidate());
    _t("readjustScroll", () => parent.readjustScroll(lv.ANIM_OFF));
    _t("getScrollEnd -> object", () => {
        let v = parent.getScrollEnd();
        if (typeof v !== "object") throw new Error("type");
    });
    _t("getScrollbarArea -> call no throw", () => {
        parent.getScrollbarArea();
    });

    /* ---- 16. Coords & Visibility ---------------------------------- */
    _t("getCoords -> object", () => {
        let a = obj.getCoords();
        if (typeof a !== "object") throw new Error("type");
    });
    _t("getContentCoords -> object", () => {
        let a = obj.getContentCoords();
        if (typeof a !== "object") throw new Error("type");
    });
    _t("setExtClickArea", () => obj.setExtClickArea(5));
    _t("getClickArea -> object", () => {
        let a = obj.getClickArea();
        if (typeof a !== "object") throw new Error("type");
    });
    _t("isVisible -> bool", () => {
        if (typeof obj.isVisible() !== "boolean") throw new Error("type");
    });
    _t("invalidate", () => obj.invalidate());
    _t("invalidateArea", () => {
        obj.invalidateArea({x1: 0, y1: 0, x2: 10, y2: 10});
    });
    _t("areaIsVisible -> bool", () => {
        let r = obj.areaIsVisible({x1: 0, y1: 0, x2: 10, y2: 10});
        if (typeof r !== "boolean") throw new Error("type");
    });
    _t("hitTest -> bool", () => {
        let r = obj.hitTest({x: 10, y: 10});
        if (typeof r !== "boolean") throw new Error("type");
    });

    /* ---- 17. Movement --------------------------------------------- */
    _t("moveForeground", () => obj.moveForeground());
    _t("moveBackground", () => obj.moveBackground());
    _t("moveTo", () => obj.moveTo(0, 0));
    _t("moveChildrenBy", () => obj.moveChildrenBy(0, 0, false));
    _t("refreshSelfSize", () => obj.refreshSelfSize());
    _t("refrPos", () => obj.refrPos());

    /* ---- 18. Class & validity ------------------------------------- */
    _t("isValid -> true", () => {
        if (!obj.isValid()) throw new Error("expected true");
    });
    _t("getClass -> handle", () => {
        let c = obj.getClass();
        if (!c) throw new Error("null");
    });
    _t("isEditable -> bool", () => {
        if (typeof obj.isEditable() !== "boolean") throw new Error("type");
    });
    _t("isGroupDef -> bool", () => {
        if (typeof obj.isGroupDef() !== "boolean") throw new Error("type");
    });
    _t("allocateSpecAttr", () => obj.allocateSpecAttr());

    /* ---- 19. Misc -------------------------------------------------- */
    _t("getGroup -> handle or null", () => {
        obj.getGroup(); // may return null handle when not in group
    });

    /* ---- 20. Properties (prototype getter/setter) ----------------- */
    _t("prop x get", () => {
        let v = obj.x;
        if (typeof v !== "number") throw new Error("type");
    });
    _t("prop x set", () => { obj.x = 5; });
    _t("prop y get", () => {
        if (typeof obj.y !== "number") throw new Error("type");
    });
    _t("prop y set", () => { obj.y = 5; });
    _t("prop x2 get", () => {
        if (typeof obj.x2 !== "number") throw new Error("type");
    });
    _t("prop y2 get", () => {
        if (typeof obj.y2 !== "number") throw new Error("type");
    });
    _t("prop xAligned get", () => {
        if (typeof obj.xAligned !== "number") throw new Error("type");
    });
    _t("prop yAligned get", () => {
        if (typeof obj.yAligned !== "number") throw new Error("type");
    });
    _t("prop width get", () => {
        if (typeof obj.width !== "number") throw new Error("type");
    });
    _t("prop width set", () => { obj.width = 200; });
    _t("prop height get", () => {
        if (typeof obj.height !== "number") throw new Error("type");
    });
    _t("prop height set", () => { obj.height = 200; });
    _t("prop contentWidth get", () => {
        if (typeof obj.contentWidth !== "number") throw new Error("type");
    });
    _t("prop contentWidth set", () => { obj.contentWidth = 220; });
    _t("prop contentHeight get", () => {
        if (typeof obj.contentHeight !== "number") throw new Error("type");
    });
    _t("prop contentHeight set", () => { obj.contentHeight = 220; });
    _t("prop selfWidth get", () => {
        if (typeof obj.selfWidth !== "number") throw new Error("type");
    });
    _t("prop selfHeight get", () => {
        if (typeof obj.selfHeight !== "number") throw new Error("type");
    });
    _t("prop parent get", () => {
        let p = obj.parent;
        if (!p) throw new Error("null");
    });
    _t("prop parent set (reparent)", () => {
        obj.parent = parent;
    });
    _t("prop screen get", () => {
        let s = obj.screen;
        if (!s) throw new Error("null");
    });
    _t("prop display get", () => {
        let d = obj.display;
        if (!d) throw new Error("null");
    });
    _t("prop childCount get", () => {
        if (typeof obj.childCount !== "number") throw new Error("type");
    });
    _t("prop index get", () => {
        if (typeof obj.index !== "number") throw new Error("type");
    });
    _t("prop state get", () => {
        if (typeof obj.state !== "number") throw new Error("type");
    });
    _t("prop eventCount get", () => {
        if (typeof obj.eventCount !== "number") throw new Error("type");
    });
    _t("prop group get", () => { obj.group; });
    _t("prop scrollX get", () => {
        if (typeof parent.scrollX !== "number") throw new Error("type");
    });
    _t("prop scrollY get", () => {
        if (typeof parent.scrollY !== "number") throw new Error("type");
    });
    _t("prop scrollTop get", () => {
        if (typeof parent.scrollTop !== "number") throw new Error("type");
    });
    _t("prop scrollBottom get", () => {
        if (typeof parent.scrollBottom !== "number") throw new Error("type");
    });
    _t("prop scrollLeft get", () => {
        if (typeof parent.scrollLeft !== "number") throw new Error("type");
    });
    _t("prop scrollRight get", () => {
        if (typeof parent.scrollRight !== "number") throw new Error("type");
    });
    _t("prop scrollbarMode get", () => {
        if (typeof parent.scrollbarMode !== "number") throw new Error("type");
    });
    _t("prop scrollbarMode set", () => { parent.scrollbarMode = lv.SCROLLBAR_MODE_OFF; });
    _t("prop scrollDir get", () => {
        if (typeof parent.scrollDir !== "number") throw new Error("type");
    });
    _t("prop scrollDir set", () => { parent.scrollDir = lv.DIR_ALL; });
    _t("prop scrollSnapX get", () => {
        if (typeof parent.scrollSnapX !== "number") throw new Error("type");
    });
    _t("prop scrollSnapX set", () => { parent.scrollSnapX = lv.SCROLL_SNAP_NONE; });
    _t("prop scrollSnapY get", () => {
        if (typeof parent.scrollSnapY !== "number") throw new Error("type");
    });
    _t("prop scrollSnapY set", () => { parent.scrollSnapY = lv.SCROLL_SNAP_NONE; });
    _t("prop userData get", () => {
        parent.setUserData("hello");
        let v = parent.userData;
        if (v !== "hello") throw new Error("mismatch: " + v);
    });
    _t("prop userData set", () => { parent.userData = {a: 1}; });
    _t("prop align set", () => { obj.align = lv.ALIGN_CENTER; });
    _t("prop extClickArea set", () => { obj.extClickArea = 4; });
    _t("prop layout set", () => { obj.layout = lv.LAYOUT_NONE; });
    _t("prop flexFlow set", () => { flexBox.flexFlow = lv.FLEX_FLOW_ROW; });
    _t("prop flexGrow set", () => {
        let fc = new lv.obj(flexBox);
        fc.flexGrow = 1;
    });

    /* ---- 21. Lifecycle -------------------------------------------- */
    // Add a child to obj, then clean() should remove it
    let childForClean;
    _t("clean: create child", () => {
        childForClean = new lv.obj(obj);
        if (obj.getChildCount() < 1) throw new Error("no child created");
    });
    _t("clean: removes all children", () => {
        obj.clean();
        if (obj.getChildCount() !== 0) throw new Error("children remain: " + obj.getChildCount());
    });

    // deleteDelayed
    _t("deleteDelayed: create and schedule", () => {
        let tmp = new lv.obj(parent);
        tmp.deleteDelayed(500);
    });

    // deleteAsync
    _t("deleteAsync: create and schedule", () => {
        let tmp = new lv.obj(parent);
        tmp.deleteAsync();
    });

    /* ---- 22. delete ----------------------------------------------- */
    _t("delete sibling", () => { sib.delete(); });
    _t("delete flexBox", () => { flexBox.delete(); });
    // Do NOT delete parent or obj here — leave on screen for visibility

    /* ---------------------------------------------------------------- */
    /* Summary                                                           */
    /* ---------------------------------------------------------------- */
    _log("=== SUMMARY: " + _pass + " passed, " + _fail + " failed ===");
}
