/**
 * @file eos_port_vibrator.c
 * @brief Vibrator port implementation for PC Simulator
 */

#include "eos_port_vibrator.h"
#include "eos_dev_vibrator.h"

#include <stdio.h>

static void _on(uint8_t strength)
{
    printf("[PortVibrator] Vibrator on: %d\n", strength);
}

static void _off(void)
{
    printf("[PortVibrator] Vibrator off\n");
}

static const eos_dev_vibrator_ops_t _ops = {
    .on = _on,
    .off = _off,
};

void eos_port_vibrator_init(void)
{
    eos_dev_vibrator_register(&_ops);
}
