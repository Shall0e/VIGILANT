import { customList, config, checkConfig, updateConfig, world, system } from "./main.js"
import {
    showActionForm,
    forceShow
} from "./gui.js";

function kickPlayer(player, reason) {
    player.runCommandAsync(`/kick ${player.name} ${reason}`)
}

function banPlayer(player, reason) {

}




function messageAllPlayers(message) {
    for (let player of world.getPlayers()) {
        player.sendMessage(message)
    }
};
function messageAllAdmins(message) {
    for (let player of world.getPlayers()) {
        if (player.isOp()) {
            player.sendMessage(`§8<admin only>§r ` + message);
        }
    }
};




function addSuspicion(player, suspicion, reason, threshold) {
    customList[player.name].suspicion += suspicion;
    customList[player.name].warnReason = reason;
    if (customList[player.name].suspicion >= threshold) {
        messageAllAdmins(`§2<§aVIGILANT§2>§r §4Warning for §6${player.name}§c: §cSuspicion of §6${Math.min(customList[player.name].suspicion, 100)}§c for §6${customList[player.name].warnReason}§r`)
    }
};
function isMod(player) {
    return (config.STAFF.modList).includes(player.name);
}
function isBanned(player) {
    return (config.STAFF.bannedPlayers).includes(player.name);
}
function isMuted(player) {
    return (config.STAFF.mutedPlayers).includes(player.name);
}




function handleCommand(player, message) {
    let commands = {
        menu: (args) => system.run(() => {
            if (player.isOp) {
                showActionForm(player); player.sendMessage(`§2<§aVIGILANT§2>§c Opened Toggle Menu, please close the chat menu!`)
            }
        }),
        set: (args) => {
            if (player.isOp) {
                (customList[args[0]])[args[1]] = args[2]
            }
        },
        eval: (args) => {
            if (player.isOp) {
                eval(args[0])
            }
        },
        resetconfig: (args) => {
            if (player.isOp) {
                world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
                checkConfig();
            }
        }
    };
    let parts = message.slice(2).split(' ');
    let command = parts[0].toLowerCase();
    let args = parts.slice(1);
    if (commands[command]) {
        commands[command](args);
    } else {
        player.sendMessage(`Command "${command}" not recognized.`);
    }
}




export {
    isMod,
    isBanned,
    isMuted,
    addSuspicion,
    messageAllAdmins,
    messageAllPlayers,
    kickPlayer,
    handleCommand
}
