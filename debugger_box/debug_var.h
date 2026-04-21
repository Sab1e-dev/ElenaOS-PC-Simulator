#ifndef DEBUG_VAR_H
#define DEBUG_VAR_H

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

#ifndef DEBUG_VAR_MAX_COUNT
#define DEBUG_VAR_MAX_COUNT 128
#endif

typedef struct
{
    const char *name;
    int32_t *value_ptr;
    int32_t min_value;
    int32_t max_value;
    const char *group;
} debug_var_entry_t;

typedef struct
{
    const char *name;
    int32_t *value_ptr;
    int32_t default_value;
    int32_t min_value;
    int32_t max_value;
    const char *group;
} debug_var_desc_t;

void debug_var_reset(void);
bool debug_var_register_desc(const debug_var_desc_t *desc);
size_t debug_var_count(void);
const debug_var_entry_t *debug_var_get(size_t index);

#ifdef __cplusplus
}
#endif

#endif /* DEBUG_VAR_H */
