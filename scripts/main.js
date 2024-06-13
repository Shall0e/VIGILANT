// hi
import * as Minecraft from "@minecraft/server";
import { ModalFormData, ActionFormData } from '@minecraft/server-ui';
import {
   isMod,
   isBanned,
   isMuted,
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
function sha256($){let f=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];function x($,f){return f>>>$|f<<32-$}let _=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],c=Math.ceil((($+="\x80").length/4+2)/16),e=Array(c);for(let a=0;a<c;a++){e[a]=Array(16);for(let b=0;b<16;b++)e[a][b]=$.charCodeAt(64*a+4*b)<<24|$.charCodeAt(64*a+4*b+1)<<16|$.charCodeAt(64*a+4*b+2)<<8|$.charCodeAt(64*a+4*b+3)}e[c-1][14]=($.length-1)*8/4294967296,e[c-1][14]=Math.floor(e[c-1][14]),e[c-1][15]=($.length-1)*8&4294967295;for(let t=0;t<c;t++){let d=Array(64);for(let l=0;l<16;l++)d[l]=e[t][l];for(let o=16;o<64;o++)d[o]=(x(2,d[o-2])^x(13,d[o-2])^x(22,d[o-2]))+d[o-7]+(x(6,d[o-15])^x(11,d[o-15])^x(25,d[o-15]))+d[o-16];let r=_[0],n=_[1],h=_[2],i=_[3],g=_[4],u=_[5],A=_[6],C=_[7];for(let s=0;s<64;s++){let S=C+((x(14,g)^x(18,g)^x(41,g))+(g&u^~g&A)+f[s]+d[s]),j=(x(28,r)^x(34,r)^x(39,r))+(r&n^r&h^n&h);C=A,A=u,u=g,g=i+S&4294967295,i=h,h=n,n=r,r=S+j&4294967295}_[0]=_[0]+r&4294967295,_[1]=_[1]+n&4294967295,_[2]=_[2]+h&4294967295,_[3]=_[3]+i&4294967295,_[4]=_[4]+g&4294967295,_[5]=_[5]+u&4294967295,_[6]=_[6]+A&4294967295,_[7]=_[7]+C&4294967295}let k="";for(let m of _)k+=("00000000"+m.toString(16)).slice(-8);return k};
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
   },
   "SYSTEM": {
      "version": [1, 0, 1],
      "lastUpdate": Date.now(),
      "updaterKey": sha256('hello!').substring(0,16)
   }
}; var config = {};
world.setDynamicProperty('VIGILANTtoggles', JSON.stringify(fallbackconfig));


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
         player.sendMessage(`§2<only you>§r §2<§aVIGILANT§2>§r you have been §agiven§r staff!`)
      } else if (player.hasTag('staff')) {
         player.runCommandAsync('/tag @s remove staff')
         player.sendMessage(`§2<only you>§r §2<§aVIGILANT§2>§r you have been §cremoved§r from staff.`)
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
         if (!isBanned(player)) {
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