/**
 * @file eos_port_time.c
 * @brief Time port implementation for PC Simulator
 */

#include "eos_port_time.h"
#include "eos_dev_time.h"

#include <stdio.h>
#include <sys/time.h>
#include <time.h>

static eos_datetime_t _get_datetime(void)
{
    eos_datetime_t dt = {0};
    struct timeval tv;
    gettimeofday(&tv, NULL);
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

static const eos_dev_time_ops_t _ops = {
    .get_datetime = _get_datetime,
};

void eos_port_time_init(void)
{
    eos_dev_time_register(&_ops);
}