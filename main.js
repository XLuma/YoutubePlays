"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtubei_js_1 = require("youtubei.js");
const AddChatItemAction_1 = __importDefault(require("youtubei.js/dist/src/parser/classes/livechat/AddChatItemAction"));
const MarkChatItemAsDeletedAction_1 = __importDefault(require("youtubei.js/dist/src/parser/classes/livechat/MarkChatItemAsDeletedAction"));
const LiveChatTextMessage_1 = __importDefault(require("youtubei.js/dist/src/parser/classes/livechat/items/LiveChatTextMessage"));
const LiveChatPaidMessage_1 = __importDefault(require("youtubei.js/dist/src/parser/classes/livechat/items/LiveChatPaidMessage"));
const nut_js_1 = require("@nut-tree/nut-js");
const robot = require("robotjs");
const prompt = require("prompt-sync")({ sigint: true });
console.log("\nWelcome to YoutubePlays, by XLuma!\n");
const liveId = prompt("Enter a livestream video id (hint: you can get it from the url, after the 'watch?'");
nut_js_1.keyboard.config.autoDelayMs = 0;
(() => __awaiter(void 0, void 0, void 0, function* () {
    const yt = yield youtubei_js_1.Innertube.create({ cache: new youtubei_js_1.UniversalCache() });
    const info = yield yt.getInfo(liveId);
    const livechat = yield info.getLiveChat();
    livechat.on('start', (initial_data) => {
        /**
         * Initial info is what you see when you first open a Live Chat — this is; inital actions (pinned messages, top donations..), account's info and so on.
         */
        console.info(`Hey ${initial_data.viewer_name || 'N/A'}, welcome to Live Chat!`);
    });
    livechat.on('chat-update', (action) => {
        /**
         * An action represents what is being added to
         * the live chat. All actions have a `type` property,
         * including their item (if the action has an item).
         *
         * Below are a few examples of how this can be used.
         */
        var _a;
        if (action.is(AddChatItemAction_1.default)) {
            const item = action.as(AddChatItemAction_1.default).item;
            if (!item)
                return console.info('Action did not have an item.', action);
            const hours = new Date(item.hasKey('timestamp') ? item.timestamp : Date.now()).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            switch (item.type) {
                case 'LiveChatTextMessage':
                    console.info(`${hours} - ${(_a = item.as(LiveChatTextMessage_1.default).author) === null || _a === void 0 ? void 0 : _a.name.toString()}:\n` +
                        `${item.as(LiveChatTextMessage_1.default).message.toString()}\n`);
                    var text = item.as(LiveChatTextMessage_1.default).message.toString();
                    switch (text) {
                        case "up":
                            //keyboard.pressKey(Key.Up);
                            robot.keyTap("up");
                            break;
                        case "down":
                            robot.keyTap("down");
                            break;
                        case "left":
                            robot.keyTap("left");
                            break;
                        case "right":
                            robot.keyTap("right");
                            break;
                        case "a":
                            robot.keyTap("a");
                            break;
                        case "b":
                            robot.keyTap("b");
                            break;
                        case "start":
                            robot.keyTap("s");
                            break;
                        case "select":
                            robot.keyTap("x");
                            break;
                        case "RS":
                            robot.keyTap("r");
                            break;
                        case "LS":
                            robot.keyTap("l");
                            break;
                        default:
                            break;
                    }
                    break;
                case 'LiveChatPaidMessage':
                    console.info(`${hours} - ${item.as(LiveChatPaidMessage_1.default).author.name.toString()}:\n` +
                        `${item.as(LiveChatPaidMessage_1.default).purchase_amount}\n`);
                    break;
                default:
                    console.debug(action);
                    break;
            }
        }
        if (action.is(MarkChatItemAsDeletedAction_1.default)) {
            console.warn(`Message ${action.target_item_id} just got deleted and should be replaced with ${action.deleted_state_message.toString()}!`, '\n');
        }
    });
    /*
    livechat.on('metadata-update', (metadata: LiveMetadata) => {
      console.info(`
        VIEWS: ${metadata.views?.view_count.toString()}
        LIKES: ${metadata.likes?.default_text}
        DATE: ${metadata.date?.date_text}
      `);
    });
    */
    livechat.start();
}))();
