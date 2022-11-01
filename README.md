# YoutubePlays
A nodeJS program to control a game using Youtube Chat. Works the same way as Twitch Plays programs, without using Google's shitty API (no limitations !)

# Setup
- Clone the repository (or download with the green button)
- Install NodeJS (version 16 and up)
- Open a terminal, and use the `cd` command with the path to access the folder containing the project. example: `cd C:/Users/XLuma/Desktop/YoutubePlays` (hint: you can right click the folder selector in Window's file explorer, and copy the path as text and paste it)
- In your terminal, run `npm install`. It may take a couple minutes to finish.
- Run `npx tsc --p tsconfig.json`. A new file main.js will be created.
- Edit the file in the config folder to your liking, and configure your game's button mapping.
- Run `node main.js`.
- Soon messages will start appearing in the terminal, this is your chat. Configure your game's input, leave the window in focus, and sit back :)

# Making the program receive messages faster
PS: Since 10/7/2022: A configurable queue has been implemented, therefore rendering those patches a little bit useless. You can still apply it if you wish to though.

Because the program is essentially fetching messages the same way a normal viewer would, sometimes the program will hang a bit before receiving more data (about a couple seconds). This might break the immersion. To fix this, a patch is included that when applied, virtually makes the program 20x faster. I highly recommend this, but be warned **it will also consume a lot more bandwidth**. This should not be an issue for most people, unless you have slow internet or plan to run this on a server (which you shouldnt). To apply the patch, simply open a terminal in the project's directory, and run these commands:
- `npx patch-package`
- `npx tsc --p tsconfig.json`
- `node main.js`

# Config
A configuration file is present in the config folder. This file allows you to change a few settings like the message/button mapping, live id's and such. Here is a table: 
```
liveId: Before starting the program, paste your liveId in this field. It will be used at startup to fetch messages.

streamerName: Type your YOUTUBE username in this field. In doing so, you can type "control" in chat to switch between chat control or your control

delayStartButton: Set to false by default. Set it to true if you want to apply a restriction on the start button to avoid chat spamming start and doing shit.

startButton: Type here the key that is used for the start button. This option is only useful if delayStartButton is set to true.

keyboardDelay: This setting sets how much type the program waits before pressing a new key. Default is 10 milliseconds, the lower it is the faster keys will be pressed. I don't recommend setting it to 0, nor changing it.

messageInterval: This setting configures the interval between each message to be processed, in milliseconds. The lower the number, the faster messages will be processed but the delay to fetch new messages will be very noticeable. Default is 500 (0.5s).

democraticDelay: This setting configures the behavior of the "Democratic" mode. When activated by the streamer with the "democratic" command, chat inputs will no longer be executed; rather, all inputs will be put into a queue that will determine the command with the highest rate of messages in the given time determined by this parameter, and execute it. Default is 5000 ms (5 seconds), adjust to taste.

buttons: This is the message and button layout. Editing the left side allows to edit messages to analyze (must be lowercase), the right side if to set which keys should be pressed when the associated message is processed.
```

# Troubleshooting
On windows, running npm install might fail. This is because of the dependency RobotJS needing Visual Studio build tools to be installed. If you get a giant wall of errors when running npm install, download the buildtools from Microsoft at this [link]. Once it is done preparing, tick "Visual C++ Build Tools" in the top right, and proceed with the installation. Once it is done, rerun npm install and everything should work.


# TODO
- ~~Add configuration files for button layouts and other important settings(High prio, getting it done asap)~~ DONE
- ~~Add options to configure how many messages to process, the timing per batch... Controlling the chat chaos essentially (High prio)~~ DONE
- Remove patches (Delay bug fixed in new version of youtube.js)
- Add Electron support -> Create UI for the program (either React or NX)
- Integrate the whole thing with Truffle.vip
- Joysticks ?? (unlikely)

# Credits
* [**LuanRT (YouTube.js)**][YouTube.js]
* **Chooks22 (speed patch)**
* **TimerClock14 for help with frontend and general fixes**

[YouTube.js]: https://github.com/LuanRT/YouTube.js
[link]: https://aka.ms/vs/15/release/vs_buildtools.exe
