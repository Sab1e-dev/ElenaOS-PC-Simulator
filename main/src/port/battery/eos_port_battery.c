/**
 * @file eos_port_battery.c
 * @brief Battery port implementation for PC Simulator
 * @note This module implements the battery device layer for the simulator
 */

#include "eos_port_battery.h"
#include "eos_dev_battery.h"
#include "eos_service_battery.h"
#include "mac_api.h"

#include <stdio.h>

static void _request_update(void)
{
    float level = get_system_battery_level();
    int charging = get_system_charging();

    eos_battery_raw_t raw = {
        .percent = (int8_t)((level >= 0.0f) ? (int)(level * 100.0f + 0.5f) : -1),
        .voltage_mv = -1,
        .current_ma = 0,
        .charging = (charging == 1),
    };
    eos_battery_report_raw(&raw);
}

static const eos_battery_dev_ops_t _battery_ops = {
    .request_update = _request_update,
};

void eos_port_battery_init(void)
{
    eos_dev_battery_register(&_battery_ops, 500);

    printf("[PortBattery] Battery device registered, design capacity: 500 mAh\n");
}
