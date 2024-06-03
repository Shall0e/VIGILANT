import { customList, config, checkConfig, updateConfig, world, system } from "./main.js"
import { ModalFormData, ActionFormData } from '@minecraft/server-ui';
import {
    isMod,
    addSuspicion,
    messageAllAdmins,
    messageAllPlayers,
    kickPlayer
} from "./built_in.js";

async function forceShow(form, player) {
    const res = await form.show(player);
    if (res.cancelationReason !== "UserBusy" || !player.isValid()) return res;
    return await forceShow(form, player);
}; async function showActionForm(player) {
    let form = new ActionFormData()
        .title(`§2VIGILANT§r Staff Menu`)
        .body('Special Settings for Staff')
        .button('Anticheat Toggles §8(admin)')
        .button('Staff Settings §8(admin)')
        .button('Moderator Tools')
    forceShow(form, player).then((response) => {
        if (response.selection == 0) {
            function showAnticheatForm(player) {
                let form = new ActionFormData()
                    .title(`§2VIGILANT§r Toggles`)
                    .body('Settings for detection and warnings.')
                    .button('Anti-CommandBlockExploit')
                    .button('Nuke/Grief Protection')
                    .button('Anti-Flying')
                    .button('Anti-Speed')
                    .button('Y-Velocity')
                    .button('Restrict Gamemode')
                    .button('AFK Player')
                    .button('§8Go Back')
                    .show(player).then((response) => {
                        if (response.selection == 0) { // ANTI-CBE
                            checkConfig();
                            var innerForm = new ModalFormData()
                                .title(`§2VIGILANT§r AntiCBE`)
                                .toggle('Anti-CommandBlockExploit', config.cbe.toggle)
                                .slider('Warning Display Threshold', 1, 100, 1, config.cbe.threshold)
                                .slider('Suspicion Amount', 0, 100, 1, config.cbe.suspicionAdd)
                                .submitButton('§8Save & Go Back')
                                .show(player).then(formData => {
                                    config.cbe = {
                                        "toggle": formData.formValues[0],
                                        "threshold": formData.formValues[1],
                                        "suspicionAdd": formData.formValues[2]
                                    };
                                    world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
                                    checkConfig();
                                    showAnticheatForm(player);
                                }
                                );
                        } else if (response.selection == 1) { // NUKER
                            checkConfig();
                            var innerForm = new ModalFormData()
                                .title(`§2VIGILANT§r AntiNuker`)
                                .toggle('Nuker/Grief Protection', config.nuker.toggle)
                                .slider('Warning Display Threshold', 1, 100, 1, config.nuker.threshold)
                                .slider('Suspicion Amount', 0, 100, 1, config.nuker.suspicionAdd)
                                .submitButton('§8Save & Go Back')
                                .show(player).then(formData => {
                                    config.nuker = {
                                        "toggle": formData.formValues[0],
                                        "threshold": formData.formValues[1],
                                        "suspicionAdd": formData.formValues[2]
                                    };
                                    world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
                                    checkConfig();
                                    showAnticheatForm(player);
                                }
                                );
                        } else if (response.selection == 2) { // FLYING
                            checkConfig();
                            var innerForm = new ModalFormData()
                                .title(`§2VIGILANT§r AntiFFly`)
                                .toggle('Block ForceFlying', config.flying.toggle)
                                .slider('Warning Display Threshold', 1, 100, 1, config.flying.threshold)
                                .slider('Suspicion Amount', 0, 100, 1, config.flying.suspicionAdd)
                                .submitButton('§8Save & Go Back')
                                .show(player).then(formData => {
                                    config.flying = {
                                        "toggle": formData.formValues[0],
                                        "threshold": formData.formValues[1],
                                        "suspicionAdd": formData.formValues[2]
                                    };
                                    world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
                                    checkConfig();
                                    showAnticheatForm(player);
                                }
                                );
                        } else if (response.selection == 3) { // SPEED
                            checkConfig();
                            var innerForm = new ModalFormData()
                                .title(`§2VIGILANT§r Speed/Flying`)
                                .toggle('Block ', config.speed.toggle)
                                .slider('Warning Display Threshold', 1, 100, 1, config.speed.threshold)
                                .slider('Suspicion Amount', 0, 100, 1, config.speed.suspicionAdd)
                                .submitButton('§8Save & Go Back')
                                .show(player).then(formData => {
                                    config.speed = {
                                        "toggle": formData.formValues[0],
                                        "threshold": formData.formValues[1],
                                        "suspicionAdd": formData.formValues[2]
                                    };
                                    world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
                                    checkConfig();
                                    showAnticheatForm(player);
                                }
                                );
                        } else if (response.selection == 4) { // STEP
                            checkConfig();
                            var innerForm = new ModalFormData()
                                .title(`§2VIGILANT§r BadYvel`)
                                .toggle('Block High Y-Velocity', config.step.toggle)
                                .slider('Warning Display Threshold', 1, 100, 1, config.step.threshold)
                                .slider('Suspicion Amount', 0, 100, 1, config.step.suspicionAdd)
                                .submitButton('§8Save & Go Back')
                                .show(player).then(formData => {
                                    config.step = {
                                        "toggle": formData.formValues[0],
                                        "threshold": formData.formValues[1],
                                        "suspicionAdd": formData.formValues[2]
                                    };
                                    world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
                                    checkConfig();
                                    showAnticheatForm(player);
                                }
                                );
                        } else if (response.selection == 5) { // GAMEMODERESTRICT
                            checkConfig();
                            var innerForm = new ModalFormData()
                                .title(`§2VIGILANT§r AntiGM`)
                                .toggle('Restrict Gamemode', config.gm.toggle)
                                .dropdown('Restrict To:', ["Adventure", "Creative", "Default", "Spectator", "Survival"], config.gm.gamemode)
                                .slider('Warning Display Threshold', 1, 100, 1, config.gm.threshold)
                                .slider('Suspicion Amount', 0, 100, 1, config.gm.suspicionAdd)
                                .submitButton('§8Save & Go Back')
                                .show(player).then(formData => {
                                    config.gm = {
                                        "toggle": formData.formValues[0],
                                        "gamemode": formData.formValues[1],
                                        "threshold": formData.formValues[2],
                                        "suspicionAdd": formData.formValues[3]
                                    };
                                    world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
                                    checkConfig();
                                    showAnticheatForm(player);
                                }
                                );
                        } else if (response.selection == 6) { // AFK
                            checkConfig();
                            var innerForm = new ModalFormData()
                                .title(`§2VIGILANT§r AntiAFK`)
                                .toggle('Anti-AFK', config.afk.toggle)
                                .slider('Time before Action (In Ticks)', 200, 1200, 40, config.afk.time)
                                .textField('Run Command', 'runCommand from Entity', config.afk.runCommand)
                                .submitButton('§8Save & Go Back')
                                .show(player).then(formData => {
                                    config.afk = {
                                        "toggle": formData.formValues[0],
                                        "time": formData.formValues[1],
                                        "runCommand": formData.formValues[2]
                                    };
                                    world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
                                    checkConfig();
                                    showAnticheatForm(player);
                                }
                                );
                        } else if (response.selection == 7) { // Go back
                            checkConfig();
                            var innerForm = new ModalFormData()
                                .title(`§2VIGILANT§r AntiLag`)
                                .toggle('Anti-AFK', config.afk.toggle)
                                .slider('Time before Action (In Ticks)', 200, 1200, 40, config.afk.time)
                                .textField('Run Command', 'runCommand from Entity', config.afk.runCommand)
                                .submitButton('§8Save & Go Back')
                                .show(player).then(formData => {
                                    config.afk = {
                                        "toggle": formData.formValues[0],
                                    };
                                    world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
                                    checkConfig();
                                    showAnticheatForm(player);
                                }
                                );
                        } else if (response.selection == 7) { // Go back
                            showActionForm(player)
                        };
                    })
            }; showAnticheatForm(player)
        } else if (response.selection == 1) {
            if (player.isOp()) {
                var innerForm = new ModalFormData()
                    .textField('Mod List', 'Separate names with Commas', (config.STAFF.modList).join(","))
                    .textField('Banned Players', 'Separate names with Commas', (config.STAFF.bannedPlayers).join(","))
                    .textField('Muted Players', 'Separate names with Commas', (config.STAFF.bannedPlayers).join(",").replaceAll(',', ', '))
                    .submitButton('§8Save & Go Back')
                    .show(player).then(formData => {
                        config.STAFF = {
                            "modList": (formData.formValues[1]).split(', '),
                            "bannedPlayers": (formData.formValues[2]).split(', '),
                            "mutedPlayers": (formData.formValues[3]).split(', ')
                        };
                        world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
                        checkConfig();
                        showActionForm(player);
                    }
                    );
            } else {
                showActionForm(player);
            }
        } else if (response.selection == 2) {

        }
    })
}

export {
    showActionForm,
    forceShow
}