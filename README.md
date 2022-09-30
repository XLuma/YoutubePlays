# YoutubePlays
A nodeJS program to control a game using Youtube Chat. Works the same way as Twitch Plays programs, without using Google's shitty API (no limitations !)

# Setup
- Clone the repository (or download with the green button)
- Install NodeJS (version 16 and up)
- Open a terminal, and use the `cd` command with the path to access the folder containing the project. example: `cd C:/Users/XLuma/Desktop/YoutubePlays` (hint: you can right click the folder selector in Window's file explorer, and copy the path as text and paste it)
- In your terminal, run `npm install`. It may take a couple minutes to finish.
- Run `npx tsc --p tsconfig.json`. A new file main.js will be created.
- Run `node main.js`. The program will ask for an ID. This ID is your video ID, which you can get from the url of a livestream in a web browser.
- Soon messages will start appearing in the terminal, this is your chat. Configure your game's input, leave the window in focus, and sit back :)

# Making the program receive messages faster
Because the program is essentially fetching messages the same way a normal viewer would, sometimes the program will hang a bit before receiving more data (about a couple seconds). This might break the immersion. To fix this, a patch is included that when applied, virtually makes the program 20x faster. I highly recommend this, but be warned **it will also consume a lot more bandwidth**. This should not be an issue for most people, unless you have slow internet or plan to run this on a server (which you shouldnt). To apply the patch, simply open a terminal in the project's directory, and run these commands:
- `npx patch-package`
- `npx tsc --p tsconfig.json`
- `node main.js`

# Button Layout
The button layout can be edited in the json file present in the config folder. the right hand side defines the chat message, and the left hand side defines the key to press when said message is detected. Feel free to edit those parameters to your liking. Make sure your game is configured to the same keys you set the config to press.

# TODO
- ~~Add configuration files for button layouts and other important settings(High prio, getting it done asap)~~ DONE
- Add options to configure how many messages to process, the timing per batch... Controlling the chat chaos essentially (High prio)
- Integrate the whole thing with Truffle.vip
- Try and include a patch that removes the modifications
- Joysticks ?? (unlikely)

# Credits
* [**LuanRT (YouTube.js)**][YouTube.js]
* **Chooks22 (speed patch)**

[YouTube.js]: https://github.com/LuanRT/YouTube.js
