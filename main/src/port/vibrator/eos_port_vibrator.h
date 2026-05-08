/**
 * @file eos_port_vibrator.h
 * @brief Vibrator port interface for PC Simulator
 */

#ifndef EOS_PORT_VIBRATOR_H
#define EOS_PORT_VIBRATOR_H

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
 * @brief Initialize vibrator port and register device
 */
void eos_port_vibrator_init(void);

#ifdef __cplusplus
}
#endif

#endif /* EOS_PORT_VIBRATOR_H */
