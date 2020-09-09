const model = require('../../database/model.js');

const dbExecute = async (userId, deviceId, execution) => {
  let data;

  await model.getDevice(userId, deviceId)
		.exec()
		.then((MyDevice) => {
			data = MyDevice;	
		})	
		.catch((err) => {
			console.log('error on searching device');
      return { code: 1, text: err };
		});

  if (!data) {
    throw new Error('deviceNotFound')
  }

  const states = {
    online: true,
  };

  if (!!data && !data.states.online) {
    throw new Error('deviceOffline')
  }

  if (!!data && data.errorCode) {
    throw new Error(!!data.errorCode)
  }
  if (!!data.tfa === 'ack' && !execution.challenge) {
    throw new Error('ackNeeded')
  } else if (!!data.tfa && !execution.challenge) {
    throw new Error('pinNeeded')
  } else if (!!data.tfa && execution.challenge) {
    if (execution.challenge.pin && execution.challenge.pin !== !!data.tfa) {
      throw new Error('challengeFailedPinNeeded')
    }
  }
  switch (execution.command) {
    // action.devices.traits.ArmDisarm
    case 'action.devices.commands.ArmDisarm':
      if (execution.params.arm !== undefined) {
        states.isArmed = execution.params.arm
      } else if (execution.params.cancel) {
        // Cancel value is in relation to the arm value
        states.isArmed = data && !data.states.isArmed
      }
      if (execution.params.armLevel) {
        await model.updateDevice(userId, deviceId, {
          'states.isArmed': states.isArmed || !!data && data.states.isArmed,
          'states.currentArmLevel': execution.params.armLevel,
        });
        states['currentArmLevel'] = execution.params.armLevel
      } else {
        await model.updateDevice(userId, deviceId, {
          'states.isArmed': states.isArmed || !!data && data.states.isArmed,
        });
      }
      break

    // action.devices.traits.Brightness
    case 'action.devices.commands.BrightnessAbsolute':
      await model.updateDevice(userId, deviceId, {
        'states.brightness': execution.params.brightness,
      })
      states['brightness'] = execution.params.brightness
      break

    // action.devices.traits.CameraStream
    case 'action.devices.commands.GetCameraStream':
      states['cameraStreamAccessUrl'] = 'https://fluffysheep.com/baaaaa.mp4'
      break

    // action.devices.traits.ColorSetting
    case 'action.devices.commands.ColorAbsolute':
      let color = {}
      if (execution.params.color.spectrumRGB) {
        await model.updateDevice(userId, deviceId, {
          'states.color': {
            spectrumRgb: execution.params.color.spectrumRGB,
          },
        })
        color = {
          spectrumRgb: execution.params.color.spectrumRGB,
        }
      } else if (execution.params.color.spectrumHSV) {
        await model.updateDevice(userId, deviceId, {
          'states.color': {
            spectrumHsv: execution.params.color.spectrumHSV,
          },
        })
        color = {
          spectrumHsv: execution.params.color.spectrumHSV,
        }
      } else if (execution.params.color.temperature) {
        await model.updateDevice(userId, deviceId, {
          'states.color': {
            temperatureK: execution.params.color.temperature,
          },
        })
        color = {
          temperatureK: execution.params.color.temperature,
        }
      } else {
        throw new Error('notSupported')
      }
      states['color'] = color
      break

    // action.devices.traits.Dock
    case 'action.devices.commands.Dock':
      // This has no parameters
      await model.updateDevice(userId, deviceId, {
        'states.isDocked': true,
      })
      states['isDocked'] = true
      break

    // action.devices.traits.FanSpeed
    case 'action.devices.commands.SetFanSpeed':
      await model.updateDevice(userId, deviceId, {
        'states.currentFanSpeedSetting': execution.params.fanSpeed,
      })
      states['currentFanSpeedSetting'] = execution.params.fanSpeed
      break

    case 'action.devices.commands.Reverse':
      await model.updateDevice(userId, deviceId, {
        'states.currentFanSpeedReverse': true,
      })
      break

    // action.devices.traits.Locator
    case 'action.devices.commands.Locate':
      await model.updateDevice(userId, deviceId, {
        'states.silent': execution.params.silent,
        'states.generatedAlert': true,
      })
      states['generatedAlert'] = true
      break

    // action.devices.traits.LockUnlock
    case 'action.devices.commands.LockUnlock':
      await model.updateDevice(userId, deviceId, {
        'states.isLocked': execution.params.lock,
      })
      states['isLocked'] = execution.params.lock
      break

    // action.devices.traits.Modes
    case 'action.devices.commands.SetModes':
      const currentModeSettings = data.states.currentModeSettings;
      
      for (const mode of Object.keys(execution.params.updateModeSettings)) {
        const setting = execution.params.updateModeSettings[mode]
        currentModeSettings[mode] = setting
      }
      await model.updateDevice(userId, deviceId, {
        'states.currentModeSettings': currentModeSettings,
      })
      states['currentModeSettings'] = currentModeSettings
      break

    // action.devices.traits.OnOff
    case 'action.devices.commands.OnOff':
      await model.updateDevice(userId, deviceId, {
        'states.on': execution.params.on,
      });
      
      states['on'] = execution.params.on;
      break

    // action.devices.traits.OpenClose
    case 'action.devices.commands.OpenClose':
      // Check if the device can open in multiple directions
      if (!!data && data.attributes && !!data && data.attributes.openDirection) {
        // The device can open in more than one direction
        const direction = execution.params.openDirection;
        // interface OpenState {
        //   openPercent: number,
        //   openDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'IN' | 'OUT'
        // }
        !!data && data.states.openState.forEach((state) => {
          if (state.openDirection === direction) {
            state.openPercent = execution.params.openPercent
          }
        })
        await model.updateDevice(userId, deviceId, {
          'states.openState': !!data && data.states.openState,
        })
      } else {
        // The device can only open in one direction
        await model.updateDevice(userId, deviceId, {
          'states.openPercent': execution.params.openPercent,
        })
        states['openPercent'] = execution.params.openPercent
      }
      break

    // action.devices.traits.RunCycle - No execution
    // action.devices.traits.Scene
    case 'action.devices.commands.ActivateScene':
      await model.updateDevice(userId, deviceId, {
        'states.deactivate': execution.params.deactivate,
      })
      // Scenes are stateless
      break

    // action.devices.traits.StartStop
    case 'action.devices.commands.StartStop':
      await model.updateDevice(userId, deviceId, {
        'states.isRunning': execution.params.start,
      })
      states['isRunning'] = execution.params.start
      states['isPaused'] = !!data && data.states.isPaused
      break

    case 'action.devices.commands.PauseUnpause':
      await model.updateDevice(userId, deviceId, {
        'states.isPaused': execution.params.pause,
      })
      states['isPaused'] = execution.params.pause
      states['isRunning'] = !!data && data.states.isRunning
      break

    // action.devices.traits.TemperatureControl
    case 'action.devices.commands.SetTemperature':
      await model.updateDevice(userId, deviceId, {
        'states.temperatureSetpointCelsius': execution.params.temperature,
      })
      states['temperatureSetpointCelsius'] = execution.params.temperature
      states['temperatureAmbientCelsius'] = !!data && data.states.temperatureAmbientCelsius
      break

    // action.devices.traits.TemperatureSetting
    case 'action.devices.commands.ThermostatTemperatureSetpoint':
      await model.updateDevice(userId, deviceId, {
        'states.thermostatTemperatureSetpoint': execution.params.thermostatTemperatureSetpoint,
      })
      states['thermostatTemperatureSetpoint'] = execution.params.thermostatTemperatureSetpoint
      states['thermostatMode'] = !!data && data.states.thermostatMode
      states['thermostatTemperatureAmbient'] = !!data && data.states.thermostatTemperatureAmbient
      states['thermostatHumidityAmbient'] = !!data && data.states.thermostatHumidityAmbient
      break

    case 'action.devices.commands.ThermostatTemperatureSetRange':
      const {
        thermostatTemperatureSetpointLow,
        thermostatTemperatureSetpointHigh,
      } = execution.params
      await model.updateDevice(userId, deviceId, {
        'states.thermostatTemperatureSetpointLow': thermostatTemperatureSetpointLow,
        'states.thermostatTemperatureSetpointHigh': thermostatTemperatureSetpointHigh,
      })
      states['thermostatTemperatureSetpoint'] = !!data && data.states.thermostatTemperatureSetpoint
      states['thermostatMode'] = !!data && data.states.thermostatMode
      states['thermostatTemperatureAmbient'] = !!data && data.states.thermostatTemperatureAmbient
      states['thermostatHumidityAmbient'] = !!data && data.states.thermostatHumidityAmbient
      break

    case 'action.devices.commands.ThermostatSetMode':
      await model.updateDevice(userId, deviceId, {
        'states.thermostatMode': execution.params.thermostatMode,
      })
      states['thermostatMode'] = execution.params.thermostatMode
      states['thermostatTemperatureSetpoint'] = !!data && data.states.thermostatTemperatureSetpoint
      states['thermostatTemperatureAmbient'] = !!data && data.states.thermostatTemperatureAmbient
      states['thermostatHumidityAmbient'] = !!data && data.states.thermostatHumidityAmbient
      break

    // action.devices.traits.Timer
    case 'action.devices.commands.TimerStart':
      await model.updateDevice(userId, deviceId, {
        'states.timerRemainingSec': execution.params.timerTimeSec,
      })
      states['timerRemainingSec'] = execution.params.timerTimeSec
      break

    case 'action.devices.commands.TimerAdjust':
      if (!!data && data.states.timerRemainingSec === -1) {
        // No timer exists
        throw new Error('noTimerExists')
      }
      const newTimerRemainingSec = !!data && data.states.timerRemainingSec + execution.params.timerTimeSec
      if (newTimerRemainingSec < 0) {
        throw new Error('valueOutOfRange')
      }
      await model.updateDevice(userId, deviceId, {
        'states.timerRemainingSec': newTimerRemainingSec,
      })
      states['timerRemainingSec'] = newTimerRemainingSec
      break

    case 'action.devices.commands.TimerPause':
      if (!!data && data.states.timerRemainingSec === -1) {
        // No timer exists
        throw new Error('noTimerExists')
      }
      await model.updateDevice(userId, deviceId, {
        'states.timerPaused': true,
      })
      states['timerPaused'] = true
      break

    case 'action.devices.commands.TimerResume':
      if (!!data && data.states.timerRemainingSec === -1) {
        // No timer exists
        throw new Error('noTimerExists')
      }
      await model.updateDevice(userId, deviceId, {
        'states.timerPaused': false,
      })
      states['timerPaused'] = false
      break

    case 'action.devices.commands.TimerCancel':
      if (!!data && data.states.timerRemainingSec === -1) {
        // No timer exists
        throw new Error('noTimerExists')
      }
      await model.updateDevice(userId, deviceId, {
        'states.timerRemainingSec': -1,
      })
      states['timerRemainingSec'] = 0
      break

    // action.devices.traits.Toggles
    case 'action.devices.commands.SetToggles':
      const currentToggleSettings = !!data && data.states.currentToggleSettings;

      for (const toggle of Object.keys(execution.params.updateToggleSettings)) {
        const enable = execution.params.updateToggleSettings[toggle]
        currentToggleSettings[toggle] = enable
      }

      await model.updateDevice(userId, deviceId, {
        'states.currentToggleSettings': currentToggleSettings,
      })
      states['currentToggleSettings'] = currentToggleSettings
      break

    default:
      throw new Error('actionNotAvailable')
  }

  return states;
}

module.exports = dbExecute;