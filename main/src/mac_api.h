/**
 * @file mac_api.h
 * @brief MacOS API for macOS Tahoe 26
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

/**
 * @brief Get the system volume object
 * @return float
 */
float get_system_volume(void);
/**
 * @brief Set the system volume object
 * @param volume
 */
void set_system_volume(float volume);
/**
 * @brief Get the system battery level object
 * @return float
 */
float get_system_battery_level(void);
/**
 * @brief Get the system charging status
 * @return int
 */
int get_system_charging(void);
#ifdef __cplusplus
}
#endif

#endif /* MAC_API_H */
