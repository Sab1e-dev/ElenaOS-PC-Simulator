/**
 * @file mac_api.h
 * @brief MacOS API
 * @author Sab1e
 * @date 2025-10-13
 */

#ifndef MAC_API_H
#define MAC_API_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ---------------------------------------------------*/
#include <stdint.h>
#include <stdbool.h>

/* Public macros ----------------------------------------------*/

/* Public typedefs --------------------------------------------*/

/* Public function prototypes --------------------------------*/
float get_system_volume(void);
void set_system_volume(float volume);
float get_system_battery_level(void);
int get_system_charging(void);
#ifdef __cplusplus
}
#endif

#endif /* MAC_API_H */
