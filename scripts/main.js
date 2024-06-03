// hi
import * as Minecraft from "@minecraft/server";
import { ModalFormData, ActionFormData } from '@minecraft/server-ui';
import {
   isMod,
   addSuspicion,
   messageAllAdmins,
   messageAllPlayers,
   kickPlayer,
   handleCommand
} from "./built_in.js";
import {
   showActionForm,
   forceShow
} from "./gui.js";
import {
   antiFly,
   antiSpeed,
   badStep,
   antiNuker,
   gameMode,
   antiAFK,
   antiLag
} from "./modules.js";
const world = Minecraft.world;
const system = Minecraft.system;
function isEmpty(value) { return (value == undefined || value == null || value == "" || Number.isNaN(value) || (typeof value == "object" && Object.keys(value).length == 0)) };
const fallbackconfig = {
   "cbe": {
      "toggle": false,
      "threshold": 1,
      "suspicionAdd": 0
   },
   "nuker": {
      "toggle": false,
      "threshold": 1,
      "suspicionAdd": 0
   },
   "flying": {
      "toggle": false,
      "threshold": 1,
      "suspicionAdd": 0
   },
   "speed": {
      "toggle": false,
      "threshold": 1,
      "suspicionAdd": 0
   },
   "step": {
      "toggle": false,
      "threshold": 1,
      "suspicionAdd": 0
   },
   "gm": {
      "toggle": false,
      "gamemode": 4,
      "threshold": 1,
      "suspicionAdd": 0
   },
   "afk": {
      "toggle": false,
      "time": 1200,
      "runCommand": null
   },
   "STAFF": {
      "ownerName": null,
      "modList": [],
      "bannedPlayers": []
   }
}; var config = {};
// config init
async function checkConfig() {
   try {
      let checkAndTest = world.getDynamicProperty('VIGILANTtoggles');
   } catch (error) {
      console.warn("An error occurred while accessing the property, resetting config...");
      world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(fallbackconfig));
      config = fallbackconfig
   }

   if (!isEmpty(world.getDynamicProperty('VIGILANTtoggles'))) {
      config = JSON.parse(world.getDynamicProperty('VIGILANTtoggles'));
   } else {
      console.warn("empty property, resetting config");
      config = fallbackconfig;
      world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config));
   }
};
checkConfig();
function updateConfig() {
   world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(config))
}
function getNewConfig() {
   config = world.getDynamicProperty('VIGILANTtoggles')
}




world.afterEvents.playerJoin.subscribe(player => {
   console.warn('new player!')
   let regex = /[^A-Za-z0-9_\-() ]/gm;
   if (regex.test(player.name)) {
      kickPlayer(player, '§cNon-UTF8 Username')
   }

})

world.beforeEvents.chatSend.subscribe(msg => {
   let player = msg.sender;
   let text = msg.message;
   console.warn()
   if (text.toLowerCase().startsWith('v.')) { handleCommand(player, text); msg.cancel = true };
})

world.afterEvents.playerBreakBlock.subscribe((blockBreak) => {
   if (config.nuker.toggle == true) {
      if (antiNuker(blockBreak) == true && !isMod(blockBreak.player)) {
         addSuspicion(blockBreak.player, config.nuker.suspicionAdd, 'Griefing/Nuking', config.nuker.threshold)
      }
   }
});




const customList = {}
system.runInterval(() => {
   for (let player of world.getPlayers()) {
      if (player.name in customList) { } else {
         customList[player.name] = {
            suspicion: 0,
            banned: false,
            warnReason: null,
            timeJoined: Date.now(),
            permissions: {
               admin: player.isOp(),
               owner: false,
               staff: false
            },
            components: {
               x: [player.location.x, player.location.x],
               y: [player.location.y, player.location.y],
               z: [player.location.z, player.location.z],
               newDate: Date.now()
            },
            velocity: {
               x: 0,
               y: 0,
               z: 0
            }
         }
      }
      if ((config.STAFF.bannedPlayers).includes(player.name)) {
         kickPlayer(player, `§2<§aVIGILANT§2>§r §cYou have been §cbanned§r.`)
      };
      (customList[player.name]).components.x[0] = (customList[player.name]).components.x[1]; (customList[player.name]).components.x[1] = player.location.x;
      (customList[player.name]).components.y[0] = (customList[player.name]).components.y[1]; (customList[player.name]).components.y[1] = player.location.y;
      (customList[player.name]).components.z[0] = (customList[player.name]).components.z[1]; (customList[player.name]).components.z[1] = player.location.z;
      (customList[player.name]).velocity.x = 0 - ((customList[player.name]).components.x[0] - (customList[player.name]).components.x[1]);
      (customList[player.name]).velocity.y = 0 - ((customList[player.name]).components.y[0] - (customList[player.name]).components.y[1]);
      (customList[player.name]).velocity.z = 0 - ((customList[player.name]).components.z[0] - (customList[player.name]).components.z[1]);


      checkConfig();
      if (config.speed.toggle == true && !(isMod(player))) { antiSpeed(player) };
      if (config.flying.toggle == true && !(isMod(player))) { antiFly(player) };
      if (config.step.toggle == true && !(isMod(player))) { badStep(player) };
      if (config.gm.toggle == true && !(isMod(player))) { gameMode(player) };

      if ((config.STAFF.modList).includes(player.name)) {
         player.runCommandAsync('/tag @s add staff')
         player.sendMessage(`§2<§aVIGILANT§2>§r you have been §agiven§r staff!`)
      } else if (player.hasTag('staff')) {
         player.runCommandAsync('/tag @s remove staff')
         player.sendMessage(`§2<§aVIGILANT§2>§r you have been §cremoved§r from staff.`)
      }
      if (player.hasTag(`staff`)) {
         if (!(config.STAFF.modList).includes(player.name)) {
            player.runCommandAsync(`/tag @s remove staff`);
            addSuspicion(player, 101, 'FakeStaff', 0);
         }
      };
      if ((customList[player.name]).suspicion > 100) {
         (customList[player.name]).suspicion = 100;
         (customList[player.name]).banned = true;
         if (!(config.STAFF.bannedPlayers).includes(player.name)) {
            messageAllAdmins(`§2<§aVIGILANT§2>§r ${player.name} has been §cbanned§r for: §6${(customList[player.name]).warnReason}§r`);
            (config.STAFF.bannedPlayers).push(player.name);
            updateConfig();
         }
         kickPlayer(player, `§2<§aVIGILANT§2>§r You have been §cbanned§r for: §6${(customList[player.name]).warnReason}§r`);
      };
      player.runCommandAsync('/gamerule sendcommandfeedback false')
      player.runCommandAsync('/gamerule commandblockoutput false')
   }
   antiLag() // Finish antilag, add to gui DUMBASS.
});




export { customList, config, checkConfig, updateConfig, world, system }