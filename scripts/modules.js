import { customList, config, checkConfig, updateConfig, world, system } from "./main.js"
import {
    isMod,
    addSuspicion,
    messageAllAdmins,
    messageAllPlayers,
    kickPlayer
} from "./built_in.js";


// FFly

function antiFly(player) {
    if (!player.onGround && !(player.getGameMode() == 'creative' || player.getGameMode() == 'spectator') && player.isFlying && !(customList[player.name]).banned) {
        player.runCommand(`execute as ${player.name} at ${player.name} run /tp @s ~${0 - (customList[player.name]).velocity.x} ~${0 - (customList[player.name]).velocity.y} ~${0 - (customList[player.name]).velocity.z}`);
        player.runCommand(`gamemode spectator ${player.name}`);
        (customList[player.name]).components.x = [player.location.x, player.location.x];
        (customList[player.name]).components.y = [player.location.x, player.location.y];
        (customList[player.name]).components.z = [player.location.x, player.location.z];
        (customList[player.name]).velocity.x = 0;
        (customList[player.name]).velocity.y = 0;
        (customList[player.name]).velocity.z = 0;
        player.runCommand(`gamemode s ${player.name}`);
        addSuspicion(player, config.flying.suspicionAdd, 'ForceFlying', config.flying.threshold)
    }
};


// Anti-Speed

function antiSpeed(player) {
    if (!(player.getGameMode() == 'creative' || player.getGameMode() == 'spectator') && !(customList[player.name]).banned) {
        if (Math.abs(
            (Math.abs((customList[player.name]).velocity.x) +
                Math.abs((customList[player.name]).velocity.z)) / 3
        ) > 1.8) {
            if (player.onGround) {
                addSuspicion(player, config.speed.suspicionAdd, 'Speed', config.speed.threshold);
            } else {
                addSuspicion(player, config.speed.suspicionAdd, 'Flying/Speed', config.speed.threshold);
            };
            player.runCommand(`execute as ${player.name} at ${player.name} run /tp @s ~${0 - (customList[player.name]).velocity.x} ~${0 - (customList[player.name]).velocity.y} ~${0 - (customList[player.name]).velocity.z}`);
            (customList[player.name]).components.x = [player.location.x, player.location.x];
            (customList[player.name]).components.y = [player.location.x, player.location.y];
            (customList[player.name]).components.z = [player.location.x, player.location.z];
            (customList[player.name]).velocity.x = 0;
            (customList[player.name]).velocity.y = 0;
            (customList[player.name]).velocity.z = 0;
        }
    }
};


// Bad Step

function badStep(player) {
    if ((customList[player.name]).velocity.y > 1.5 && !(customList[player.name]).banned) {
        player.runCommandAsync(`tp @s ~${0 - (customList[player.name]).velocity.x} ~${0 - (customList[player.name]).velocity.y} ~${0 - (customList[player.name]).velocity.z}`);
        (customList[player.name]).components.x = [player.location.x, player.location.x];
        (customList[player.name]).components.y = [player.location.x, player.location.y];
        (customList[player.name]).components.z = [player.location.x, player.location.z];
        (customList[player.name]).velocity.x = 0;
        (customList[player.name]).velocity.y = 0;
        (customList[player.name]).velocity.z = 0;
        addSuspicion(player, config.step.suspicionAdd, 'Step/HighJump', config.step.threshold);
    }
}


// Anti-Nuker

function antiNuker(blockBreak) {
    let block = blockBreak;
    oldDate = newDate;
    newDate = parseInt(Date.now());
    if ((newDate - oldDate) == 0) {
        if ([
            "minecraft:dirt",
            "minecraft:grass_block",
            "minecraft:stone",
            "minecraft:cobblestone",
            "minecraft:sand",
            "minecraft:gravel"
        ].includes(blockBreak.brokenBlockPermutation.type.id)) {
            blockBreak.block.setPermutation(blockBreak.brokenBlockPermutation);
            blockBreak.cancel = true;
            return true
        } else {
            return false
        }
    } else {
        return false
    }
};


// GameMode

function gameMode(player) {
    let gamemodes = ["Adventure", "Creative", "Default", "Spectator", "Survival"]
    if (!(player.getGameMode() == (gamemodes[Number(config.gm.gamemode)]).toString().toLowerCase())) {
        player.runCommandAsync(`/gamemode ${(gamemodes[Number(config.gm.gamemode)]).toString().toLowerCase()} @s`);
        addSuspicion(player, config.gm.suspicionAdd, "Changing GameModes", config.gm.threshold);
    }
};


// Anti-AFK

function antiAFK(player) {
    if (!(customList[player.name]).velocity.x == 0 || !(customList[player.name]).velocity.y == 0 || !(customList[player.name]).velocity.z == 0) {
        lastPlayerLocation = player.location;
        lastMovedTime = Date.now();
    };
    if (!(lastPlayerLocation == player.location)) {
        if (Date.now() > (lastMovedTime + 1000)) {
            messageAllAdmins('hello!')
        }
    }
}


// Anti-Lag

function antiLag() {
    let overworld = world.getDimension('overworld')
    let amountOfEntities = (overworld.getEntities()).length
    if (amountOfEntities > 300) {
        overworld.runCommandAsync(`/kill @e[family=mob,type=!player,c=13]`)
        overworld.runCommandAsync(`/kill @e[type=item,c=25]`)
    }
    if (amountOfEntities > 600) {
        overworld.runCommandAsync(`/kill @e[family=mob,type=!player,c=50]`)
        overworld.runCommandAsync(`/kill @e[type=item,c=100]`)
    }
    if (amountOfEntities > 1000) {
        overworld.runCommandAsync(`/kill @e[family=mob,type=!player,c=100]`)
        overworld.runCommandAsync(`/kill @e[type=item,c=200]`)
    }
}




export {
    antiFly,
    antiSpeed,
    badStep,
    antiNuker,
    gameMode,
    antiAFK,
    antiLag
}