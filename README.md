# KeyEvents
I´m using this program for programming diferents keybinds:

For now I have only programed it to use with my Hue Lights, OBS, and open files with custom shotcuts.

Open Files with shotcuts:

I created *exec* method for opening any file, this needs Child Processes.

OBS:

I just installed *OBS Websockets* for connecting with my obs client (https://github.com/Palakis/obs-websocket/releases/tag/4.9.1)

Hue Lights:

I used *Axios* (https://github.com/axios/axios) for control *Hue Api* (https://developers.meethue.com/), then I code some methods for make it easyest, like *switchON* for switch lights,
*changeLights* for change color of lights, then I created *constructColor* method with *Color-RNA* (https://github.com/nullice/ColorRNA) for change into color formats.
