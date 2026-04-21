import {
    lv_arc_simple_arc,
    loader_with_arc,
    pie_chart_with_clickable_slices_using_arcs
} from './examples/lv_arc.mjs';
import { timer_example } from './examples/lv_timer.mjs';
import { animation_example } from './examples/lv_anim.mjs';
import {
    simple_bar,
    styled_bar,
    temperature_meter,
    stripe_pattern_and_range_value,
    bar_with_ltr_and_rtl_base_direction,
    custom_drawer_to_show_the_current_value,
    bar_with_opposite_direction,
} from './examples/lv_bar.mjs';

eos.print("LVGL Examples App Started");

// lv_arc_simple_arc();
// loader_with_arc();
// pie_chart_with_clickable_slices_using_arcs();

// timer_example();
// animation_example();

// custom_drawer_to_show_the_current_value();
// bar_with_opposite_direction();

lv.obj.create(eos.screen.getActive());
