import { Innertube, UniversalCache } from 'youtubei.js';
import { LiveChatContinuation } from 'youtubei.js/dist/src/parser';

import LiveChat, { ChatAction, LiveMetadata } from 'youtubei.js/dist/src/parser/youtube/LiveChat';

import Video from 'youtubei.js/dist/src/parser/classes/Video';
import AddChatItemAction from 'youtubei.js/dist/src/parser/classes/livechat/AddChatItemAction';
import MarkChatItemAsDeletedAction from 'youtubei.js/dist/src/parser/classes/livechat/MarkChatItemAsDeletedAction';

import LiveChatTextMessage from 'youtubei.js/dist/src/parser/classes/livechat/items/LiveChatTextMessage';
import LiveChatPaidMessage from 'youtubei.js/dist/src/parser/classes/livechat/items/LiveChatPaidMessage';
import { exit } from 'process';
import Actions from 'youtubei.js/dist/src/core/Actions';
import { emitKeypressEvents } from 'readline';
import config from './config/config.json'
const robot = require("robotjs");
const prompt = require("prompt-sync")({ sigint: true });

const buttons = config.buttons as Record<string, string>

function randomIntFromInterval(min: any, max: any) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function processQueueDemocratic(){
	let tempQueue: Array<string> = [ ];
	tempQueue = queueDemocratic.sort();
	//empty current queue
	queueDemocratic = []; //should work
	//gotta figure out which word in the current queue has been spammed the most
	const maxValue = tempQueue.reduce((previous, current, i, arr) => {
		if (
		  arr.filter(item => item === previous).length >
		  arr.filter(item => item === current).length
		) {
		  return previous;
		} else {
		  return current;
		}
	  });
	robot.keyTap(buttons[maxValue]);
	tempQueue = [ ];
}
function processQueueNormal(){
	//queue is adding new things at the bottom, so here we need to use index 0 and then remove with shift
	if (!queue[0])
		return;
	let text = queue[0].message.toString().toLowerCase();
					
	if (text in config.buttons && streamerControl == 0)
	{
		if (text == config.startButton && config.delayStartButton == "true")
		{
			if (randomIntFromInterval(1, 25) == 10) //inspired from twitch plays program doug made for alpharad to prevent stupid trolling. comment this line to disable
				robot.keyTap(buttons[text]);
		}
		else
			robot.keyTap(buttons[text]);
	}
	if (text == "control" && queue[0].author?.name.toString() == config.streamerName)
	{
		if (streamerControl == 1)
			streamerControl = 0; //lets chat take control of game
		else
			streamerControl = 1; //pauses message processing
	}
	else if (text == "democratic" && queue[0].author?.name.toString() == config.streamerName)
	{
		//enable democratic mode
		clearInterval(task);
		setTimeout(processQueueDemocratic, config.democraticDelay);
		toggleDemocraticMode = 1;
	}
	console.log(queue[0].author?.name.toString() +": " + text);
	queue.shift();
}


console.log("\nWelcome to YoutubePlays, by XLuma!\n");

let streamerControl = 0; //kind of a switch to let the streamer take control of chat
let queue: Array<LiveChatTextMessage> = [ ];
let queueDemocratic: Array<string> = [ ];
let queueLength: number;
let task: NodeJS.Timer;
let toggleDemocraticMode = 0;

(async () => {
	if (!config.liveId || config.liveId.trim().length === 0) {
		console.log("No liveId found ! Add your liveId to the config.json file inside the config folder");
		exit(1);
	}
	robot.setKeyboardDelay(config.keyboardDelay);
	const yt = await Innertube.create({ cache: new UniversalCache() });
	const info = await yt.getInfo(config.liveId);
	const livechat = info.getLiveChat();
	
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
					if (!task)
					{
						if (toggleDemocraticMode == 1)
						{
							task = setTimeout(processQueueDemocratic, config.democraticDelay); //this should let the queue fill up for 5 seconds and then sort it, and make a move
						}
						else
							task = setInterval(processQueueNormal, config.messageInterval);
					}
					if (toggleDemocraticMode == 1)
					{
						if (item.as(LiveChatTextMessage).message.toString().toLowerCase() == "anarchy" && item.as(LiveChatTextMessage).author?.name.toString() == config.streamerName)
						{
							clearInterval(task);
							task = setInterval(processQueueNormal, config.messageInterval);
						}
						queueLength = queueDemocratic.push(item.as(LiveChatTextMessage).message.toString().toLowerCase());
					}
					queueLength = queue.push(item.as(LiveChatTextMessage));
					console.log(queueLength);
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