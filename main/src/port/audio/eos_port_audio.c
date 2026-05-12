/**
 * @file eos_port_audio.c
 * @brief Audio port implementation for PC Simulator
 * @note This module implements the audio device layer for the simulator
 */

#include "eos_port_audio.h"
#include "eos_port.h"

#include <stdio.h>

eos_audio_state_t eos_audio_get_state(void)
{
    return EOS_AUDIO_STATE_UNAVAILABLE;
}

bool eos_speaker_detect(void)
{
    return false;
}

bool eos_microphone_detect(void)
{
    return false;
}

int eos_audio_play_file(const char *file_path)
{
    (void)file_path;
    return -1;
}

int eos_audio_stop(void)
{
    return -1;
}

void eos_port_audio_init(void)
{
    printf("[PortAudio] Audio device initialized (stub)\n");
}
