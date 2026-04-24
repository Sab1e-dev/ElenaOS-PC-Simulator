/**
 * @file jerry_port.c
 * @brief JerryScript Port for ElenixOS PC Simulator
 */

// Includes
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include "jerryscript-port.h"

// Macros and Definitions

// Variables

// Function Implementations

double jerry_port_current_time(void)
{
    return (double)0;
}

int32_t jerry_port_local_tza(double unix_ms)
{

    return 480 * (int32_t)unix_ms;
}

void jerry_port_fatal(jerry_fatal_code_t code)
{
    printf("[JerryScript] Fatal error occurred!\r\n Code: %d\n Desc:", code);
    switch (code)
    {
    case JERRY_FATAL_OUT_OF_MEMORY:
        printf("Out of memory\r\n");
        break;
    case JERRY_FATAL_REF_COUNT_LIMIT:
        printf("Reference count limit reached\r\n");
        break;
    case JERRY_FATAL_DISABLED_BYTE_CODE:
        printf("Executed disabled instruction\r\n");
        break;
    case JERRY_FATAL_UNTERMINATED_GC_LOOPS:
        printf("Garbage collection loop limit reached\r\n");
        break;
    case JERRY_FATAL_FAILED_ASSERTION:
        printf("Assertion failed (Undefined variable or function)\r\n");
        break;
    default:
        printf("Unknown error\r\n");
        break;
    }
    printf("JerryScript engine terminated.\r\n");

    if (code != 0 && code != JERRY_FATAL_OUT_OF_MEMORY)
    {
        abort();
    }

    exit((int)code);
}
