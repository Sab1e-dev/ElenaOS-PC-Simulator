/**
 * @file eos_port_sensor.c
 * @brief Sensor port implementation for PC Simulator
 * @note Device layer pushes data to service layer via eos_sensor_notify()
 */

#include "eos_port_sensor.h"
#include "eos_dev_sensor.h"
#include "eos_service_sensor.h"
#include "lvgl.h"
#include "mac_api.h"

#include <stdlib.h>
#include <stdio.h>
#include <time.h>

#define RAND_RANGE(min, max) ((min) + rand() % ((max) - (min) + 1))

typedef struct {
    eos_sensor_type_t type;
    bool enabled;
    uint32_t sample_rate;
    eos_sensor_data_t (*generate_data)(void);
} _sensor_config_t;

static eos_sensor_data_t _generate_acce(void)
{
    eos_sensor_data_t data = {0};
    data.acce.x = RAND_RANGE(-500, 500);
    data.acce.y = RAND_RANGE(-500, 500);
    data.acce.z = RAND_RANGE(900, 1100);
    return data;
}

static eos_sensor_data_t _generate_gyro(void)
{
    eos_sensor_data_t data = {0};
    data.gyro.x = RAND_RANGE(-100, 100);
    data.gyro.y = RAND_RANGE(-100, 100);
    data.gyro.z = RAND_RANGE(-100, 100);
    return data;
}

static eos_sensor_data_t _generate_mag(void)
{
    eos_sensor_data_t data = {0};
    data.mag.x = RAND_RANGE(-300, 300);
    data.mag.y = RAND_RANGE(-300, 300);
    data.mag.z = RAND_RANGE(-300, 300);
    return data;
}

static eos_sensor_data_t _generate_hr(void)
{
    eos_sensor_data_t data = {0};
    data.hr.heart_rate = RAND_RANGE(60, 100);
    return data;
}

static eos_sensor_data_t _generate_light(void)
{
    eos_sensor_data_t data = {0};
    data.light.lux = RAND_RANGE(0, 10000);
    return data;
}

static eos_sensor_data_t _generate_proximity(void)
{
    eos_sensor_data_t data = {0};
    data.proximity.distance_mm = RAND_RANGE(0, 100);
    return data;
}

static eos_sensor_data_t _generate_temp(void)
{
    eos_sensor_data_t data = {0};
    data.temp.temp = RAND_RANGE(2500, 4000);
    return data;
}

static eos_sensor_data_t _generate_baro(void)
{
    eos_sensor_data_t data = {0};
    data.baro.pressure = RAND_RANGE(99000, 101000);
    return data;
}

static eos_sensor_data_t _generate_spo2(void)
{
    eos_sensor_data_t data = {0};
    data.spo2.spo2 = RAND_RANGE(95, 100);
    return data;
}

static eos_sensor_data_t _generate_step(void)
{
    eos_sensor_data_t data = {0};
    data.step.steps = RAND_RANGE(0, 10000);
    return data;
}

static _sensor_config_t _sensors[] = {
    {EOS_SENSOR_TYPE_ACCE,      false, 25, _generate_acce},
    {EOS_SENSOR_TYPE_GYRO,      false, 25, _generate_gyro},
    {EOS_SENSOR_TYPE_MAG,       false, 25, _generate_mag},
    {EOS_SENSOR_TYPE_HR,        false, 1,  _generate_hr},
    {EOS_SENSOR_TYPE_LIGHT,     false, 10, _generate_light},
    {EOS_SENSOR_TYPE_PROXIMITY, false, 10, _generate_proximity},
    {EOS_SENSOR_TYPE_TEMP,      false, 1,  _generate_temp},
    {EOS_SENSOR_TYPE_BARO,      false, 1,  _generate_baro},
    {EOS_SENSOR_TYPE_SPO2,      false, 1,  _generate_spo2},
    {EOS_SENSOR_TYPE_STEP,      false, 1,  _generate_step},
};

#define SENSOR_COUNT (sizeof(_sensors) / sizeof(_sensors[0]))

static void _acce_init(eos_dev_sensor_t *dev)
{
    (void)dev;
    printf("[PortSensor] Accelerometer initialized\n");
}

static void _acce_deinit(eos_dev_sensor_t *dev)
{
    (void)dev;
    printf("[PortSensor] Accelerometer deinitialized\n");
}

static void _acce_enable(eos_dev_sensor_t *dev)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_ACCE) {
            _sensors[i].enabled = true;
            break;
        }
    }
    printf("[PortSensor] Accelerometer enabled\n");
}

static void _acce_disable(eos_dev_sensor_t *dev)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_ACCE) {
            _sensors[i].enabled = false;
            break;
        }
    }
    printf("[PortSensor] Accelerometer disabled\n");
}

static void _acce_set_sample_rate(eos_dev_sensor_t *dev, uint32_t hz)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_ACCE) {
            _sensors[i].sample_rate = hz;
            break;
        }
    }
    printf("[PortSensor] Accelerometer sample rate set to %u Hz\n", hz);
}

static void _acce_get_sample_rate(eos_dev_sensor_t *dev, uint32_t *hz)
{
    (void)dev;
    *hz = 25;
}

static void _gyro_init(eos_dev_sensor_t *dev)
{
    (void)dev;
    printf("[PortSensor] Gyroscope initialized\n");
}

static void _gyro_deinit(eos_dev_sensor_t *dev)
{
    (void)dev;
    printf("[PortSensor] Gyroscope deinitialized\n");
}

static void _gyro_enable(eos_dev_sensor_t *dev)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_GYRO) {
            _sensors[i].enabled = true;
            break;
        }
    }
    printf("[PortSensor] Gyroscope enabled\n");
}

static void _gyro_disable(eos_dev_sensor_t *dev)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_GYRO) {
            _sensors[i].enabled = false;
            break;
        }
    }
    printf("[PortSensor] Gyroscope disabled\n");
}

static void _gyro_set_sample_rate(eos_dev_sensor_t *dev, uint32_t hz)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_GYRO) {
            _sensors[i].sample_rate = hz;
            break;
        }
    }
    printf("[PortSensor] Gyroscope sample rate set to %u Hz\n", hz);
}

static void _gyro_get_sample_rate(eos_dev_sensor_t *dev, uint32_t *hz)
{
    (void)dev;
    *hz = 25;
}

static void _mag_init(eos_dev_sensor_t *dev)
{
    (void)dev;
    printf("[PortSensor] Magnetometer initialized\n");
}

static void _mag_deinit(eos_dev_sensor_t *dev)
{
    (void)dev;
    printf("[PortSensor] Magnetometer deinitialized\n");
}

static void _mag_enable(eos_dev_sensor_t *dev)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_MAG) {
            _sensors[i].enabled = true;
            break;
        }
    }
    printf("[PortSensor] Magnetometer enabled\n");
}

static void _mag_disable(eos_dev_sensor_t *dev)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_MAG) {
            _sensors[i].enabled = false;
            break;
        }
    }
    printf("[PortSensor] Magnetometer disabled\n");
}

static void _mag_set_sample_rate(eos_dev_sensor_t *dev, uint32_t hz)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_MAG) {
            _sensors[i].sample_rate = hz;
            break;
        }
    }
    printf("[PortSensor] Magnetometer sample rate set to %u Hz\n", hz);
}

static void _mag_get_sample_rate(eos_dev_sensor_t *dev, uint32_t *hz)
{
    (void)dev;
    *hz = 25;
}

static void _hr_init(eos_dev_sensor_t *dev)
{
    (void)dev;
    printf("[PortSensor] Heart Rate initialized\n");
}

static void _hr_deinit(eos_dev_sensor_t *dev)
{
    (void)dev;
    printf("[PortSensor] Heart Rate deinitialized\n");
}

static void _hr_enable(eos_dev_sensor_t *dev)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_HR) {
            _sensors[i].enabled = true;
            break;
        }
    }
    printf("[PortSensor] Heart Rate enabled\n");
}

static void _hr_disable(eos_dev_sensor_t *dev)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_HR) {
            _sensors[i].enabled = false;
            break;
        }
    }
    printf("[PortSensor] Heart Rate disabled\n");
}

static void _hr_set_sample_rate(eos_dev_sensor_t *dev, uint32_t hz)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_HR) {
            _sensors[i].sample_rate = hz;
            break;
        }
    }
    printf("[PortSensor] Heart Rate sample rate set to %u Hz\n", hz);
}

static void _hr_get_sample_rate(eos_dev_sensor_t *dev, uint32_t *hz)
{
    (void)dev;
    *hz = 1;
}

static void _light_init(eos_dev_sensor_t *dev)
{
    (void)dev;
    printf("[PortSensor] Light sensor initialized\n");
}

static void _light_deinit(eos_dev_sensor_t *dev)
{
    (void)dev;
    printf("[PortSensor] Light sensor deinitialized\n");
}

static void _light_enable(eos_dev_sensor_t *dev)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_LIGHT) {
            _sensors[i].enabled = true;
            break;
        }
    }
    printf("[PortSensor] Light sensor enabled\n");
}

static void _light_disable(eos_dev_sensor_t *dev)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_LIGHT) {
            _sensors[i].enabled = false;
            break;
        }
    }
    printf("[PortSensor] Light sensor disabled\n");
}

static void _light_set_sample_rate(eos_dev_sensor_t *dev, uint32_t hz)
{
    (void)dev;
    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].type == EOS_SENSOR_TYPE_LIGHT) {
            _sensors[i].sample_rate = hz;
            break;
        }
    }
    printf("[PortSensor] Light sensor sample rate set to %u Hz\n", hz);
}

static void _light_get_sample_rate(eos_dev_sensor_t *dev, uint32_t *hz)
{
    (void)dev;
    *hz = 10;
}

static const eos_dev_sensor_ops_t _acce_ops = {
    .init = _acce_init,
    .deinit = _acce_deinit,
    .enable = _acce_enable,
    .disable = _acce_disable,
    .set_sample_rate = _acce_set_sample_rate,
    .get_sample_rate = _acce_get_sample_rate,
};

static const eos_dev_sensor_ops_t _gyro_ops = {
    .init = _gyro_init,
    .deinit = _gyro_deinit,
    .enable = _gyro_enable,
    .disable = _gyro_disable,
    .set_sample_rate = _gyro_set_sample_rate,
    .get_sample_rate = _gyro_get_sample_rate,
};

static const eos_dev_sensor_ops_t _mag_ops = {
    .init = _mag_init,
    .deinit = _mag_deinit,
    .enable = _mag_enable,
    .disable = _mag_disable,
    .set_sample_rate = _mag_set_sample_rate,
    .get_sample_rate = _mag_get_sample_rate,
};

static const eos_dev_sensor_ops_t _hr_ops = {
    .init = _hr_init,
    .deinit = _hr_deinit,
    .enable = _hr_enable,
    .disable = _hr_disable,
    .set_sample_rate = _hr_set_sample_rate,
    .get_sample_rate = _hr_get_sample_rate,
};

static const eos_dev_sensor_ops_t _light_ops = {
    .init = _light_init,
    .deinit = _light_deinit,
    .enable = _light_enable,
    .disable = _light_disable,
    .set_sample_rate = _light_set_sample_rate,
    .get_sample_rate = _light_get_sample_rate,
};

static void _sensor_poll_cb(lv_timer_t *t)
{
    (void)t;
    uint32_t timestamp = lv_tick_get();

    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        if (_sensors[i].enabled && _sensors[i].generate_data) {
            eos_sensor_data_t data = _sensors[i].generate_data();
            eos_sensor_notify(_sensors[i].type, &data, timestamp);
        }
    }
}

static lv_timer_t *_poll_timer = NULL;

void eos_port_sensor_init(void)
{
    srand((unsigned int)time(NULL));

    eos_dev_sensor_register("sim_acce", EOS_SENSOR_TYPE_ACCE, &_acce_ops);
    eos_dev_sensor_register("sim_gyro", EOS_SENSOR_TYPE_GYRO, &_gyro_ops);
    eos_dev_sensor_register("sim_mag", EOS_SENSOR_TYPE_MAG, &_mag_ops);
    eos_dev_sensor_register("sim_hr", EOS_SENSOR_TYPE_HR, &_hr_ops);
    eos_dev_sensor_register("sim_light", EOS_SENSOR_TYPE_LIGHT, &_light_ops);

    for (size_t i = 0; i < SENSOR_COUNT; i++) {
        _sensors[i].enabled = true;
    }

    _poll_timer = lv_timer_create(_sensor_poll_cb, 40, NULL);
    if (_poll_timer) {
        lv_timer_set_repeat_count(_poll_timer, -1);
    }

    printf("[PortSensor] All sensors registered, poll timer started (40ms)\n");
}
