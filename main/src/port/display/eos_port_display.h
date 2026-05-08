/**
 * @file eos_port_display.h
 * @brief Display port interface for PC Simulator
 */

#ifndef EOS_PORT_DISPLAY_H
#define EOS_PORT_DISPLAY_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ---------------------------------------------------*/
#include <stdint.h>
#include <stdbool.h>

/* Public macros ----------------------------------------------*/

/* Public typedefs --------------------------------------------*/

/* Public function prototypes --------------------------------*/

/**
 * @brief Initialize display port and register device
 */
void eos_port_display_init(void);

#ifdef __cplusplus
}
#endif

#endif /* EOS_PORT_DISPLAY_H */
