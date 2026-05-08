/**
 * @file eos_port_power.h
 * @brief Power port interface for PC Simulator
 */

#ifndef EOS_PORT_POWER_H
#define EOS_PORT_POWER_H

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
 * @brief Initialize power port and register device
 */
void eos_port_power_init(void);

#ifdef __cplusplus
}
#endif

#endif /* EOS_PORT_POWER_H */
