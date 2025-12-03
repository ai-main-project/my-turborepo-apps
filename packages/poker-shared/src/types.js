"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionType = exports.GameStage = exports.PlayerStatus = void 0;
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus["Active"] = "active";
    PlayerStatus["Folded"] = "folded";
    PlayerStatus["AllIn"] = "all_in";
    PlayerStatus["SittingOut"] = "sitting_out";
})(PlayerStatus || (exports.PlayerStatus = PlayerStatus = {}));
var GameStage;
(function (GameStage) {
    GameStage["PreFlop"] = "pre_flop";
    GameStage["Flop"] = "flop";
    GameStage["Turn"] = "turn";
    GameStage["River"] = "river";
    GameStage["Showdown"] = "showdown";
})(GameStage || (exports.GameStage = GameStage = {}));
var ActionType;
(function (ActionType) {
    ActionType["Check"] = "check";
    ActionType["Call"] = "call";
    ActionType["Raise"] = "raise";
    ActionType["Fold"] = "fold";
    ActionType["AllIn"] = "all_in";
})(ActionType || (exports.ActionType = ActionType = {}));
