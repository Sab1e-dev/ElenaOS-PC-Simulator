#ifndef DEBUG_VAR_DEFS_H
#define DEBUG_VAR_DEFS_H

#include <stddef.h>
#include <stdint.h>

#include "debug_var.h"

#ifdef __cplusplus
extern "C" {
#endif

#ifdef DEBUG_VAR_DEFS_IMPLEMENTATION
#define DEBUG_VAR_DEFS_EXTERN
#else
#define DEBUG_VAR_DEFS_EXTERN extern
#endif

DEBUG_VAR_DEFS_EXTERN int32_t dbg_app_list_anim_duration;
DEBUG_VAR_DEFS_EXTERN int32_t dbg_app_list_anim_focus_scale;
DEBUG_VAR_DEFS_EXTERN int32_t dbg_app_list_anim_min_scale;
DEBUG_VAR_DEFS_EXTERN int32_t dbg_app_list_anim_split_pct;
DEBUG_VAR_DEFS_EXTERN int32_t dbg_app_list_anim_from_opa_start;
DEBUG_VAR_DEFS_EXTERN int32_t dbg_app_list_anim_from_opa_end;
DEBUG_VAR_DEFS_EXTERN int32_t dbg_app_list_anim_to_opa_start;
DEBUG_VAR_DEFS_EXTERN int32_t dbg_app_list_anim_to_opa_end;

#ifdef DEBUG_VAR_DEFS_IMPLEMENTATION
int32_t dbg_app_list_anim_duration = 360;
int32_t dbg_app_list_anim_focus_scale = 384;
int32_t dbg_app_list_anim_min_scale = 64;
int32_t dbg_app_list_anim_split_pct = 35;
int32_t dbg_app_list_anim_from_opa_start = 255;
int32_t dbg_app_list_anim_from_opa_end = 0;
int32_t dbg_app_list_anim_to_opa_start = 0;
int32_t dbg_app_list_anim_to_opa_end = 255;
#endif

static const debug_var_desc_t debug_var_defs_descs[] = {
	{
		.name = "应用列表转场持续时间",
		.value_ptr = &dbg_app_list_anim_duration,
		.default_value = 360,
		.min_value = 0,
		.max_value = 2000,
		.group = "Anim"
	},
	{
		.name = "应用列表聚焦放大系数",
		.value_ptr = &dbg_app_list_anim_focus_scale,
		.default_value = 384,
		.min_value = 256,
		.max_value = 1024,
		.group = "Anim"
	},
	{
		.name = "应用列表最小缩放系数",
		.value_ptr = &dbg_app_list_anim_min_scale,
		.default_value = 64,
		.min_value = 16,
		.max_value = 256,
		.group = "Anim"
	},
	{
		.name = "应用列表NextView启动百分比",
		.value_ptr = &dbg_app_list_anim_split_pct,
		.default_value = 35,
		.min_value = 0,
		.max_value = 100,
		.group = "Anim"
	},
	{
		.name = "应用列表源透明度初值",
		.value_ptr = &dbg_app_list_anim_from_opa_start,
		.default_value = 255,
		.min_value = 0,
		.max_value = 255,
		.group = "Anim"
	},
	{
		.name = "应用列表源透明度终值",
		.value_ptr = &dbg_app_list_anim_from_opa_end,
		.default_value = 0,
		.min_value = 0,
		.max_value = 255,
		.group = "Anim"
	},
	{
		.name = "应用列表目标透明度初值",
		.value_ptr = &dbg_app_list_anim_to_opa_start,
		.default_value = 0,
		.min_value = 0,
		.max_value = 255,
		.group = "Anim"
	},
	{
		.name = "应用列表目标透明度终值",
		.value_ptr = &dbg_app_list_anim_to_opa_end,
		.default_value = 255,
		.min_value = 0,
		.max_value = 255,
		.group = "Anim"
    }
};

static inline void debug_var_defs_init(void)
{
	debug_var_reset();
	for (size_t i = 0; i < (sizeof(debug_var_defs_descs) / sizeof(debug_var_defs_descs[0])); ++i)
	{
		(void)debug_var_register_desc(&debug_var_defs_descs[i]);
	}
}

#ifdef __cplusplus
}
#endif

#undef DEBUG_VAR_DEFS_EXTERN

#endif /* DEBUG_VAR_DEFS_H */
