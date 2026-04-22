/**
 * @file elena_os_port.c
 * @brief ElenaOS 移植
 * @author Sab1e
 * @date 2025-08-21
 */

#include "elena_os_port.h"

// Includes
#define _DEFAULT_SOURCE /* needed for usleep() */
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>
#include <string.h>
#include "lvgl/lvgl.h"
#include "lvgl/examples/lv_examples.h"
#include "lvgl/demos/lv_demos.h"
#include "time.h"
#include <sys/time.h>
#if LV_USE_OS == LV_OS_ELENAOS
#include "elena_os_core.h"
#include "elena_os_time.h"
#endif
#include "elena_os_config.h"
#include "mac_api.h"

// Macros and Definitions

// Variables
extern lv_obj_t *brightness_mask;
struct eos_sem_t
{
    pthread_mutex_t mutex;
};
// Function Implementations

eos_sem_t *eos_sem_create(uint32_t initial_count, uint32_t max_count)
{
    (void)initial_count;
    (void)max_count;

    eos_sem_t *sem = malloc(sizeof(eos_sem_t));
    if (!sem)
        return NULL;

    if (pthread_mutex_init(&sem->mutex, NULL) != 0)
    {
        free(sem);
        return NULL;
    }

    return sem;
}

void eos_sem_destroy(eos_sem_t *sem)
{
    if (!sem)
        return;

    pthread_mutex_destroy(&sem->mutex);
    free(sem);
}

bool eos_sem_take(eos_sem_t *sem, uint32_t timeout_ms)
{
    (void)timeout_ms;
    if (!sem)
        return false;

    return pthread_mutex_lock(&sem->mutex) == 0;
}

void eos_sem_give(eos_sem_t *sem)
{
    if (!sem)
        return;

    pthread_mutex_unlock(&sem->mutex);
}

void *eos_malloc_core(size_t size)
{
    return malloc(size);
}

void *eos_malloc_zeroed_core(size_t size)
{
    return calloc(1, size);
}

void eos_free_core(void *ptr)
{
    free(ptr);
}

void *eos_realloc_core(void *ptr, size_t new_size)
{
    return realloc(ptr, new_size);
}

void eos_vibrator_on(uint8_t strength)
{
    (void)strength;
}

void eos_vibrator_off(void)
{
}

void *eos_malloc_large(size_t size)
{
    return malloc(size);
}

void eos_free_large(void *ptr)
{
    free(ptr);
}

void eos_delay(uint32_t ms)
{
    usleep(ms * 1000);
}

void eos_cpu_reset(void)
{
    return;
}

void eos_bluetooth_enable(void)
{
    return;
}

void eos_bluetooth_disable(void)
{
    return;
}

eos_datetime_t eos_time_get_core(void)
{
    eos_datetime_t dt = {0};
    struct timeval tv;
    gettimeofday(&tv, NULL); // 获取秒和微秒
    time_t now = (time_t)tv.tv_sec;
    struct tm *tm_info = localtime(&now);
    dt.year = tm_info->tm_year + 1900;
    dt.month = tm_info->tm_mon + 1;
    dt.day = tm_info->tm_mday;
    dt.hour = tm_info->tm_hour;
    dt.min = tm_info->tm_min;
    dt.sec = tm_info->tm_sec;
    dt.day_of_week = tm_info->tm_wday;
    return dt;
}

void eos_display_set_brightness(uint8_t brightness)
{
    float b = (float)((100.0 - (float)brightness) / 100.0 * 255.0);
    printf("raw: %d - brightness: %.2f\n", brightness, b);
    if (!brightness_mask || !lv_obj_is_valid(brightness_mask))
        return;
    lv_obj_set_style_opa(brightness_mask, b, 0);
    return;
}

void *_thread_sensor(void *arg)
{
    eos_sensor_type_t type = *(eos_sensor_type_t *)arg;
    eos_sensor_t *s = eos_sensor_get(type);
    if (!s)
        return NULL;
    // sleep(rand() % 10);
    // sleep(2);
    switch (type)
    {
    case EOS_SENSOR_TYPE_ACCE: /**< 加速度传感器 */
        s->type = EOS_SENSOR_TYPE_ACCE;
        s->data.acce.x = (rand() % 4000) - 2000; // ±2g 模拟值
        s->data.acce.y = (rand() % 4000) - 2000;
        s->data.acce.z = (rand() % 4000) - 2000;
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_GYRO: /**< 陀螺仪传感器 */
        s->type = EOS_SENSOR_TYPE_GYRO;
        s->data.gyro.x = (rand() % 500) - 250; // ±250 dps
        s->data.gyro.y = (rand() % 500) - 250;
        s->data.gyro.z = (rand() % 500) - 250;
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_MAG: /**< 磁传感器 */
        s->type = EOS_SENSOR_TYPE_MAG;
        s->data.mag.x = (rand() % 2000) - 1000;
        s->data.mag.y = (rand() % 2000) - 1000;
        s->data.mag.z = (rand() % 2000) - 1000;
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_TEMP: /**< 温度传感器 */
        s->type = EOS_SENSOR_TYPE_TEMP;
        s->data.temp.temp = (rand() % 3500) + 1500; // 15.00°C ~ 50.00°C
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_HUMI: /**< 相对湿度传感器 */
        s->type = EOS_SENSOR_TYPE_HUMI;
        s->data.humi.humidity = (rand() % 10000); // 0~100.00% RH
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_BARO: /**< 气压传感器 */
        s->type = EOS_SENSOR_TYPE_BARO;
        s->data.baro.pressure = 101325 + (rand() % 2000 - 1000); // 1013.25 ±10 hPa
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_LIGHT: /**< 环境光传感器 */
        s->type = EOS_SENSOR_TYPE_LIGHT;
        s->data.light.lux = rand() % 10000; // 0~10000 lx
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_PROXIMITY: /**< 距离传感器 */
        s->type = EOS_SENSOR_TYPE_PROXIMITY;
        s->data.proximity.distance_mm = rand() % 500; // 0~500 mm
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_HR: /**< 心率传感器 */
        s->type = EOS_SENSOR_TYPE_HR;
        s->data.hr.heart_rate = rand() % 100;
        s->data.hr.spo2 = rand() % 100;
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_TVOC: /**< TVOC传感器 */
        s->type = EOS_SENSOR_TYPE_TVOC;
        s->data.tvoc.tvoc = rand() % 500; // 0~500 ppb
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_NOISE: /**< 噪声传感器 */
        s->type = EOS_SENSOR_TYPE_NOISE;
        s->data.noise.noise_db = (rand() % 7000) + 3000; // 30.00~100.00 dB
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_STEP: /**< 计步传感器 */
        s->type = EOS_SENSOR_TYPE_STEP;
        s->data.step.steps += rand() % 5; // 随机增加步数
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_FORCE: /**< 力传感器 */
        s->type = EOS_SENSOR_TYPE_FORCE;
        s->data.force.force = rand() % 10000; // 0~100.00 N
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_BAT: /**< 电池电量传感器 */
        s->type = EOS_SENSOR_TYPE_BAT;
        s->data.bat.level = get_system_battery_level() * 100;
        s->data.bat.charging = get_system_charging() == 1 ? true : false;
        eos_sensor_report(s);
        break;

    case EOS_SENSOR_TYPE_UNKNOWN:
    default:
        printf("未知传感器类型: %d\n", type);
        break;
    }
}

void eos_sensor_read_async(eos_sensor_type_t type)
{
    pthread_t thread;

    eos_sensor_type_t *arg = malloc(sizeof(eos_sensor_type_t));
    *arg = type;

    int ret = pthread_create(&thread, NULL, _thread_sensor, arg);
    if (ret != 0)
    {
        perror("pthread_create failed");
        free(arg);
    }
}

void eos_sensor_read_sync(eos_sensor_type_t type, eos_sensor_t *out)
{
    eos_sensor_t sensor = {.type = type};

    switch (type)
    {
    case EOS_SENSOR_TYPE_HR:
        // 触发心率测量函数
        sensor.type = EOS_SENSOR_TYPE_HR;
        sensor.data.hr.heart_rate = rand() % 100;
        sensor.data.hr.spo2 = rand() % 100;
        break;
    case EOS_SENSOR_TYPE_BAT:
        sensor.type = EOS_SENSOR_TYPE_BAT;
        sensor.data.bat.level = get_system_battery_level() * 100;
        sensor.data.bat.charging = get_system_charging() == 1 ? true : false;
        break;
    default:
        break;
    }

    if (out)
        memcpy(out, &sensor, sizeof(eos_sensor_t));
}

void eos_locate_phone(void)
{
    printf("Locate phone\n");
}

void eos_speaker_set_volume(uint8_t volume)
{
    set_system_volume(volume * 0.01);
}

void eos_sys_sleep(void)
{
    eos_display_set_brightness(0);
}

void eos_sys_wake(void)
{
    eos_display_set_brightness(100);
}
