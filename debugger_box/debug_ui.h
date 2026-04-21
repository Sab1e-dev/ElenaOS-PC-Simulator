#ifndef DEBUG_UI_H
#define DEBUG_UI_H

#include "lvgl.h"

#ifdef __cplusplus
extern "C" {
#endif

lv_obj_t *debug_ui_create(lv_obj_t *parent);
void debug_ui_rebuild(void);
void debug_ui_refresh(void);

#ifdef __cplusplus
}
#endif

#endif /* DEBUG_UI_H */
