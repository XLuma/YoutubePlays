import { Innertube, UniversalCache } from 'youtubei.js';
import { LiveChatContinuation } from 'youtubei.js/dist/src/parser';

import LiveChat, { ChatAction, LiveMetadata } from 'youtubei.js/dist/src/parser/youtube/LiveChat';

import Video from 'youtubei.js/dist/src/parser/classes/Video';
import AddChatItemAction from 'youtubei.js/dist/src/parser/classes/livechat/AddChatItemAction';
import MarkChatItemAsDeletedAction from 'youtubei.js/dist/src/parser/classes/livechat/MarkChatItemAsDeletedAction';

import LiveChatTextMessage from 'youtubei.js/dist/src/parser/classes/livechat/items/LiveChatTextMessage';
import LiveChatPaidMessage from 'youtubei.js/dist/src/parser/classes/livechat/items/LiveChatPaidMessage';
import { Key, keyboard } from '@nut-tree/nut-js';
import { exit } from 'process';
const robot = require("robotjs");
const prompt = require("prompt-sync")({ sigint: true });
const fs = require('fs');

console.log("\nWelcome to YoutubePlays, by XLuma!\n");

keyboard.config.autoDelayMs = 0;
function randomIntFromInterval(min: any, max: any) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min)
}

var streamerControl = 0; //kind of a switch to let the streamer take control of chat


(async () => {
	var config: any;
	fs.readFile('config/config.json', 'utf8', function (err: any, data: any) {
		if (err) throw err; // we'll not consider error handling for now
		config = JSON.parse(data);
		if (config.liveId == "")
		{
			console.log("No liveId found ! Add your liveId to the config.json file inside the config folder");
			exit(1);
		}
	});
	const yt = await Innertube.create({ cache: new UniversalCache() });
	const info = await yt.getInfo(config.liveId);

	const livechat = await info.getLiveChat();
	
	
	livechat.on('start', (initial_data: LiveChatContinuation) => {
		/**
		 * Initial info is what you see when you first open a Live Chat — this is; inital actions (pinned messages, top donations..), account's info and so on.
		 */
		 
		console.info(`Hey ${initial_data.viewer_name || 'N/A'}, welcome to Live Chat!`);
		
	});
	
	livechat.on('chat-update', (action: ChatAction) => {
		/**
		 * An action represents what is being added to
		 * the live chat. All actions have a `type` property,
		 * including their item (if the action has an item).
		 *
		 * Below are a few examples of how this can be used.
		 */

		if (action.is(AddChatItemAction)) {
			const item = action.as(AddChatItemAction).item;
	 
			if (!item)
				return console.info('Action did not have an item.', action);
			
			const hours = new Date(item.hasKey('timestamp') ? item.timestamp : Date.now()).toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit'
			});
			
			switch (item.type) {
				case 'LiveChatTextMessage':
					console.info(
						`${hours} - ${item.as(LiveChatTextMessage).author?.name.toString()}:\n` +
						`${item.as(LiveChatTextMessage).message.toString()}\n`
					);
					var text = item.as(LiveChatTextMessage).message.toString().toLowerCase();
					if (text in config.buttons && streamerControl == 0)
					{
                        if (text == "start" && config.delayStartButton == "true")
                        {
                            if (randomIntFromInterval(1, 25) == 10) //inspired from twitch plays program doug made for alpharad to prevent stupid trolling. comment this line to disable
                                robot.keyTap(config.buttons[text]);
                        }
                        else
                            robot.keyTap(config.buttons[text]);
					}
					if (text == "control" && item.as(LiveChatTextMessage).author?.name.toString() == config.streamerName)
					{
						if (streamerControl == 1)
							streamerControl = 0; //lets chat take control of game
						else
							streamerControl = 1; //pauses message processing
					}
					break;
				case 'LiveChatPaidMessage':
					console.info(
						`${hours} - ${item.as(LiveChatPaidMessage).author.name.toString()}:\n` +
						`${item.as(LiveChatPaidMessage).purchase_amount}\n`
					);
					break;
				default:
					console.debug(action);
					break;
			}
		}
			
		if (action.is(MarkChatItemAsDeletedAction)) {
			console.warn(`Message ${action.target_item_id} just got deleted and should be replaced with ${action.deleted_state_message.toString()}!`, '\n');
		}
	});

	livechat.start();
})();