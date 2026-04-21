#include "debug_var.h"

static debug_var_entry_t s_entries[DEBUG_VAR_MAX_COUNT];
static size_t s_entry_count = 0U;

static int32_t debug_var_clamp(int32_t value, int32_t min_value, int32_t max_value)
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

void debug_var_reset(void)
{
    s_entry_count = 0U;
}

bool debug_var_register_desc(const debug_var_desc_t *desc)
{
    if (desc == NULL || desc->name == NULL || desc->value_ptr == NULL)
    {
        return false;
    }

    int32_t min_value = desc->min_value;
    int32_t max_value = desc->max_value;
    if (min_value > max_value)
    {
        int32_t temp = min_value;
        min_value = max_value;
        max_value = temp;
    }

    for (size_t i = 0U; i < s_entry_count; ++i)
    {
        if (s_entries[i].value_ptr == desc->value_ptr)
        {
            s_entries[i].min_value = min_value;
            s_entries[i].max_value = max_value;
            s_entries[i].group = desc->group;
            *s_entries[i].value_ptr = debug_var_clamp(*s_entries[i].value_ptr, min_value, max_value);
            return true;
        }
    }

    if (s_entry_count >= DEBUG_VAR_MAX_COUNT)
    {
        return false;
    }

    debug_var_entry_t *entry = &s_entries[s_entry_count++];
    entry->name = desc->name;
    entry->value_ptr = desc->value_ptr;
    entry->min_value = min_value;
    entry->max_value = max_value;
    entry->group = desc->group;

    *entry->value_ptr = debug_var_clamp(*entry->value_ptr, min_value, max_value);
    return true;
}

size_t debug_var_count(void)
{
    return s_entry_count;
}

const debug_var_entry_t *debug_var_get(size_t index)
{
    if (index >= s_entry_count)
    {
        return NULL;
    }
    return &s_entries[index];
}
