#include "debug_ui.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "debug_var.h"

typedef struct
{
    const debug_var_entry_t *entry;
    lv_obj_t *label;
    lv_obj_t *input;
    bool updating;
    char text_cache[96];
} debug_ui_row_t;

typedef struct
{
    lv_obj_t *panel;
    lv_obj_t *list;
    debug_ui_row_t rows[DEBUG_VAR_MAX_COUNT];
    size_t row_count;
} debug_ui_ctx_t;

static debug_ui_ctx_t s_ctx;

static int32_t debug_ui_clamp(int32_t value, int32_t min_value, int32_t max_value)
{
    if (value < min_value)
    {
        return min_value;
    }
    if (value > max_value)
    {
        return max_value;
    }
    return value;
}

static bool debug_ui_parse_int32(const char *text, int32_t *value_out)
{
    if (text == NULL || value_out == NULL)
    {
        return false;
    }

    char *end_ptr = NULL;
    long value = strtol(text, &end_ptr, 10);
    if (end_ptr == text)
    {
        return false;
    }

    while (end_ptr != NULL && (*end_ptr == ' ' || *end_ptr == '\t'))
    {
        ++end_ptr;
    }

    if (end_ptr == NULL || *end_ptr != '\0')
    {
        return false;
    }

    if (value < INT32_MIN || value > INT32_MAX)
    {
        return false;
    }

    *value_out = (int32_t)value;
    return true;
}

static void debug_ui_update_row_text(debug_ui_row_t *row)
{
    if (row == NULL || row->entry == NULL || row->label == NULL || row->entry->value_ptr == NULL)
    {
        return;
    }

    (void)snprintf(row->text_cache,
                   sizeof(row->text_cache),
                   "%s = %ld",
                   row->entry->name,
                   (long)*row->entry->value_ptr);
    lv_label_set_text(row->label, row->text_cache);
}

static void debug_ui_sync_row_input(debug_ui_row_t *row)
{
    if (row == NULL || row->entry == NULL || row->input == NULL || row->entry->value_ptr == NULL)
    {
        return;
    }

    if (lv_obj_has_state(row->input, LV_STATE_FOCUSED))
    {
        return;
    }

    row->updating = true;

    (void)snprintf(row->text_cache,
                   sizeof(row->text_cache),
                   "%ld",
                   (long)*row->entry->value_ptr);
    lv_textarea_set_text(row->input, row->text_cache);
    lv_textarea_set_cursor_pos(row->input, LV_TEXTAREA_CURSOR_LAST);

    row->updating = false;
}

static bool debug_ui_commit_row(debug_ui_row_t *row, bool revert_on_invalid)
{
    if (row == NULL || row->entry == NULL || row->input == NULL || row->entry->value_ptr == NULL)
    {
        return false;
    }

    int32_t value = 0;
    if (!debug_ui_parse_int32(lv_textarea_get_text(row->input), &value))
    {
        if (revert_on_invalid)
        {
            debug_ui_sync_row_input(row);
        }
        return false;
    }

    value = debug_ui_clamp(value, row->entry->min_value, row->entry->max_value);
    *row->entry->value_ptr = value;
    debug_ui_update_row_text(row);
    debug_ui_sync_row_input(row);
    return true;
}

static void debug_ui_input_changed_cb(lv_event_t *e)
{
    debug_ui_row_t *row = (debug_ui_row_t *)lv_event_get_user_data(e);
    if (row == NULL || row->updating)
    {
        return;
    }

    const lv_event_code_t code = lv_event_get_code(e);
    if (code == LV_EVENT_VALUE_CHANGED)
    {
        (void)debug_ui_commit_row(row, false);
        return;
    }

    if (code == LV_EVENT_READY || code == LV_EVENT_DEFOCUSED)
    {
        (void)debug_ui_commit_row(row, true);
    }
}

lv_obj_t *debug_ui_create(lv_obj_t *parent)
{
    if (parent == NULL)
    {
        return NULL;
    }

    s_ctx.panel = parent;

    if (s_ctx.list == NULL)
    {
        s_ctx.list = lv_obj_create(parent);
        lv_obj_set_size(s_ctx.list, lv_pct(100), lv_pct(100));
        lv_obj_center(s_ctx.list);
        lv_obj_set_style_pad_all(s_ctx.list, 10, 0);
        lv_obj_set_style_pad_row(s_ctx.list, 8, 0);
        lv_obj_set_style_border_width(s_ctx.list, 0, 0);
        lv_obj_set_style_bg_opa(s_ctx.list, LV_OPA_TRANSP, 0);
        lv_obj_set_flex_flow(s_ctx.list, LV_FLEX_FLOW_COLUMN);
    }

    debug_ui_rebuild();
    return s_ctx.list;
}

void debug_ui_rebuild(void)
{
    if (s_ctx.list == NULL)
    {
        return;
    }

    lv_obj_clean(s_ctx.list);
    s_ctx.row_count = 0U;

    const char *last_group = NULL;
    const size_t count = debug_var_count();

    for (size_t i = 0U; i < count && s_ctx.row_count < DEBUG_VAR_MAX_COUNT; ++i)
    {
        const debug_var_entry_t *entry = debug_var_get(i);
        if (entry == NULL || entry->value_ptr == NULL)
        {
            continue;
        }

        const char *group = entry->group;
        if (group != NULL)
        {
            if (last_group == NULL || strcmp(last_group, group) != 0)
            {
                lv_obj_t *group_label = lv_label_create(s_ctx.list);
                lv_label_set_text(group_label, group);
                lv_obj_set_style_text_font(group_label, &lv_font_montserrat_16, 0);
                lv_obj_set_style_text_color(group_label, lv_color_hex(0x444444), 0);
                last_group = group;
            }
        }

        debug_ui_row_t *row = &s_ctx.rows[s_ctx.row_count++];
        row->entry = entry;

        lv_obj_t *item = lv_obj_create(s_ctx.list);
        lv_obj_set_width(item, lv_pct(100));
        lv_obj_set_height(item, LV_SIZE_CONTENT);
        lv_obj_set_style_border_width(item, 1, 0);
        lv_obj_set_style_border_color(item, lv_color_hex(0xe1e1e1), 0);
        lv_obj_set_style_radius(item, 10, 0);
        lv_obj_set_style_pad_all(item, 8, 0);
        lv_obj_set_style_pad_row(item, 6, 0);
        lv_obj_set_flex_flow(item, LV_FLEX_FLOW_COLUMN);

        row->label = lv_label_create(item);
        lv_label_set_long_mode(row->label, LV_LABEL_LONG_WRAP);
        lv_obj_set_width(row->label, lv_pct(100));

        row->input = lv_textarea_create(item);
        lv_obj_set_width(row->input, lv_pct(100));
        lv_textarea_set_one_line(row->input, true);
        lv_textarea_set_accepted_chars(row->input, "-0123456789");
        lv_obj_add_event_cb(row->input, debug_ui_input_changed_cb, LV_EVENT_VALUE_CHANGED, row);
        lv_obj_add_event_cb(row->input, debug_ui_input_changed_cb, LV_EVENT_READY, row);
        lv_obj_add_event_cb(row->input, debug_ui_input_changed_cb, LV_EVENT_DEFOCUSED, row);

        debug_ui_sync_row_input(row);
        debug_ui_update_row_text(row);
    }
}

void debug_ui_refresh(void)
{
    for (size_t i = 0U; i < s_ctx.row_count; ++i)
    {
        debug_ui_row_t *row = &s_ctx.rows[i];
        if (row->entry == NULL || row->entry->value_ptr == NULL || row->input == NULL)
        {
            continue;
        }

        int32_t value = *row->entry->value_ptr;
        value = debug_ui_clamp(value, row->entry->min_value, row->entry->max_value);
        *row->entry->value_ptr = value;

        debug_ui_update_row_text(row);
        debug_ui_sync_row_input(row);
    }
}
