const ioHook = require('iohook');
const OBSWebSocket = require('obs-websocket-js');
const obs=new OBSWebSocket()
const axios=require('axios')
const ColorRNA=require('color-rna')
var cp = require("child_process");
const config=require("./settings.json")
const loudness = require('loudness');
const { copyFile } = require('fs');
const hideConsole=require('node-hide-console-window')
const {app,BrowserWindow,Menu} = require('electron')
const URL=require('url')
const path=require('path')
const processExists = require('process-exists');
const { Client } = require('whatsapp-web.js');
const client = new Client();
var QRCode = require('qrcode')

var hidden=1;
obs.connect({ address: config.OBSLocalHost,password:config.OBSPassword}).catch(console.log);
ioHook.start()

var shiftKet
var altKey
var ctrlKey

ioHook.on("keyup",function(msg){
    shiftKey = (msg["shiftKey"]);
    altKey = (msg["altKey"]);
    ctrlKey = (msg["ctrlKey"]);
});

ioHook.on('keydown',(msg)=>{
    if (msg["keycode"]===29||msg["keycode"]===42||msg["keycode"]===56) return
    shiftKey=(msg["shiftKey"]);
    altKey= (msg["altKey"]);
    ctrlKey= (msg["ctrlKey"]);

    // CTRL+NP
    if (ctrlKey===true&&altKey===false&&shiftKey===false){
        if (msg["keycode"]==82){//CTRL+NP0
            if (obs._connected){
                obs.send("GetSourceFilters",{
                    sourceName:"cam"
                })
                .then(data=>{
                    let aux=0
                    data.filters.forEach(element =>{
                        if (element.name=="Render Delay")
                            aux=element
                    });
                    return aux
                })
                .then(data=>{
                    if (data!=0)
                        obsFilter("cam","Render Delay",!data.enabled)  
                })
                obsFilterDelaySet("cam","Render Delay",0)
            }
            else{
                console.log("ERROR: OBS not connected")
            }
        }else if (msg["keycode"]===79){//CTRL+NP1
            switchON(1)
        }else if (msg["keycode"]===80){//CTRL+NP2
            changeLights(1,undefined,[0.2511,0.2701])
        }else if (msg["keycode"]===81){//CTRL+NP3
            changeLights(1,undefined,constructColor(255,255,255))
            changeLights(3,undefined,constructColor(255,255,255))
        }else if (msg["keycode"]===75){//CTRL+NP4
            changeLights(1,undefined,constructColor(201,22,22))
            changeLights(3,undefined,constructColor(201,22,22))
        }else if (msg["keycode"]===76){//CTRL+NP5
            changeLights(1,undefined,constructColor(0,255,0))
            changeLights(3,undefined,constructColor(0,255,0))
        }else if (msg["keycode"]===77){//CTRL+NP6
            changeLights(1,undefined,constructColor(0,0,255))
            changeLights(3,undefined,constructColor(0,0,255))
        }else if (msg["keycode"]===71){//CTRL+NP7
            changeLights(1,undefined,constructColor(5,180,255))
            changeLights(3,undefined,constructColor(5,180,255))
        }else if (msg["keycode"]===72){//CTRL+NP8
            changeLights(1,undefined,constructColor(81,23,230))
            changeLights(3,undefined,constructColor(81,23,230))
        }else if (msg["keycode"]===73){//CTRL+NP9
            changeLights(3,undefined,[0.4574,0.41])
            changeLights(1,undefined,[0.4574,0.41])
        }
    // SHIFT+NP
    }else if (ctrlKey===false&&altKey===false&&shiftKey===false){//SHIFT+NP0
        if (msg["keycode"]===3666)
            if (hidden){
                hideConsole.showConsole()
                hidden=0;
            }
            else{
                hideConsole.hideConsole()
                hidden=1;
            }
        else if (msg["keycode"]===3663){//SHIFT+NP1
            processExists("csgo.exe").then(data=>{
                console.log(data)
            }).catch("ERROR")
        }else if (msg["keycode"]===57424){//SHIFT+NP2

        }else if (msg["keycode"]===3665){//SHIFT+NP3

        }else if (msg["keycode"]===57419){//SHIFT+NP4

        }else if (msg["keycode"]===57420){//SHIFT+NP5

        }else if (msg["keycode"]===57421){//SHIFT+NP6

        }else if (msg["keycode"]===3655){//SHIFT+NP7

        }else if (msg["keycode"]===57416){//SHIFT+NP8

        }else if (msg["keycode"]===3657){//SHIFT+NP9

        }
    //ALT+NP
    }else if (ctrlKey===false&&altKey===true&&shiftKey===false){
        if (msg["keycode"]===82){//ALT+NP0
            obs.send("GetCurrentScene")
            .then(data=>{
                let scene
                if (data.name=="Pantalla"){
                    scene=data
                }
                return scene
            })
            .then(data=>{
                let source
                data.sources.forEach(element=>{
                    if (element.name=="Marco w/cam"){
                        source=element
                    }
                })
                return source
            })
            .then(data=>{
                obs.send("SetSourceSettings",{
                    sourceName:data.name,
                    sourceType:data.type,
                    sourceSettings:{
                        "cx":0,
                        "cy":0
                    }
                })
                return data
            })
            .then(data=>{
                obs.send("GetSourceSettings",{
                    sourceName:data.name,
                    sourceType:data.type
                })
                .then(data=>{
                    console.log(data)
                })
            })
            }else if (msg["keycode"]===79){//ALT+NP1
                loudness.getMuted()
                .then(data=>{
                    loudness.setMuted(!data)
                }).catch(err=>{
                    console.log(err)
                })
            }else if (msg["keycode"]===80){//ALT+NP2
                device.getDeviceList()
            }else if (msg["keycode"]===81){//ALT+NP3
                
            }else if (msg["keycode"]===75){//ALT+NP4

            }else if (msg["keycode"]===76){//ALT+NP5

            }else if (msg["keycode"]===77){//ALT+NP6

            }else if (msg["keycode"]===71){//ALT+NP7

            }else if (msg["keycode"]===72){//ALT+NP8

            }else if (msg["keycode"]===73){//ALT+NP9

            }else if (msg["keycode"]===26){//ALT+'
                if (obs._connected){
                    obs.send("GetMute",{
                        source:"Mic/Aux",
                    })
                    .then(data=>{
                        obs.send("SetMute",{
                            source:"Mic/Aux",
                            mute:!data.muted
                        })
                    })
                }
                else{
                    console.log("ERROR: OBS not connected")
                }
                
            }else if (msg["keycode"]===53){ //ALT+}
                if (obs._connected){
                    obs.send("GetStreamingStatus")
                    .then(data=>{
                        return data.recording
                    })
                    .then(data=>{
                        if (!data){
                            obs.sendCallback('StartRecording',(error)=>{})
                        }else{  
                            obs.sendCallback('StopRecording',(error)=>{})
                        }
                    })
                }
                else{
                    console.log("ERROR: OBS not connected")
                }
            }else if (msg["keycode"]===40){//ALT+{
                if (obs._connected){
                    obs.send("GetStreamingStatus")
                    .then(data=>{
                        if (data.recording){
                            return data
                        }
                    })
                    .then(data=>{
                        if (data!==undefined){
                            if (data['recording-paused']){
                                obs.send("ResumeRecording");
                            }else{
                                obs.send("PauseRecording");
                            }
                        }
                    })
                }
                else{
                    console.log("ERROR: OBS not connected")
                }
            }
    }
    else if (ctrlKey===true&&altKey===false&&shiftKey===true){    //SHIFT+CTRL+NP //WORKING
        if (msg["keycode"]===82){//SHIFT+CTRL+NP0
        
        }else if (msg["keycode"]===79){//SHIFT+CTRL+NP1

        }else if (msg["keycode"]===80){//SHIFT+CTRL+NP2

        }else if (msg["keycode"]===81){//SHIFT+CTRL+NP3

        }else if (msg["keycode"]===75){//SHIFT+CTRL+NP4

        }else if (msg["keycode"]===76){//SHIFT+CTRL+NP5

        }else if (msg["keycode"]===77){//SHIFT+CTRL+NP6

        }else if (msg["keycode"]===71){//SHIFT+CTRL+NP7

        }else if (msg["keycode"]===72){//SHIFT+CTRL+NP8

        }else if (msg["keycode"]===73){//SHIFT+CTRL+NP9

        }
    }
    else if (ctrlKey===true&&altKey===true&&shiftKey===false){//CTRL+ALT+NP
        if (msg["keycode"]===82){//CTRL+ALT+NP0
            exec('C:/WINDOWS/system32/mspaint.exe')
        }else if (msg["keycode"]===79){//CTRL+ALT+NP1
            exec('C:/WINDOWS/system32/cmd.exe')
        }else if (msg["keycode"]===80){//CTRL+ALT+NP2
            exec ('C:/Windows/System32/calc.exe')
        }else if (msg["keycode"]===81){//CTRL+ALT+NP3
            exec ('C:/WINDOWS/system32/notepad.exe')
        }else if (msg["keycode"]===75){//CTRL+ALT+NP4
            //exec ('C:/Microsoft VS Code/code.exe')//Not Working
        }else if (msg["keycode"]===76){//CTRL+ALT+NP5
            //exec ("C:/Program Files/obs-studio/bin/64bit/obs64.exe") Not Working
        }else if (msg["keycode"]===77){//CTRL+ALT+NP6

        }else if (msg["keycode"]===71){//CTRL+ALT+NP7

        }else if (msg["keycode"]===72){//CTRL+ALT+NP8

        }else if (msg["keycode"]===73){//CTRL+ALT+NP9

        }
    }
})

async function changeLights(lightID,on,xy,bri){
    try{
        return await axios.put(
            `${config.HUEApi}/lights/${lightID}/state`,
            {"on":on,
            "bri":bri,
            "xy":xy,
            });
    }catch(err){
        console.error(err)
    }
}

async function switchON(lightID){
    const data=await axios.get(`${config.HUEApi}/lights/`)
    const on=data.data[`${lightID}`].state.on
    changeLights(lightID,!on)
}

function constructColor(r,g,b){
    color=new ColorRNA()
    var array=color.rgb(r,g,b).xyY()
    return array.splice(0,2)
}

function exec(string){
    i=0;a=0
    while (a!="/"){
        a=string.slice(string.length-i,string.length-i+1)
        i++;
    }
    executable=string.slice(string.length-i+2);
    string=string.slice(0,string.length-i+1);
    cp.exec(`cd /d ${string}`, function (err, stdout, stderr) {
        if (err) {
            throw err;
        }
    })
    cp.exec(`start ${executable}`,function(err,stdout,srderr){
        if (err){
            throw err;
        }
    })
}