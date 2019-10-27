webpackHotUpdate("main",{

/***/ "./src/game/index.ts":
/*!***************************!*\
  !*** ./src/game/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @File   : main.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Tue Oct 15 2019
 * @Description: main.
 */
var Sein = __webpack_require__(/*! seinjs */ "./node_modules/_seinjs@1.3.14@seinjs/lib/seinjs.es.js");
var CANNON = __webpack_require__(/*! cannon-dtysky */ "./node_modules/_cannon-dtysky@0.6.4@cannon-dtysky/build/cannon.js");
__webpack_require__(/*! seinjs-audio */ "./node_modules/_seinjs-audio@0.8.8@seinjs-audio/lib/index.js");
var types_1 = __webpack_require__(/*! ./types */ "./src/game/types.ts");
exports.EModelEvents = types_1.EModelEvents;
var script_1 = __webpack_require__(/*! ./script */ "./src/game/script.ts");
var preModels = [];
function main(canvas) {
    return __awaiter(this, void 0, void 0, function () {
        var engine, game;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = new Sein.Engine();
                    game = new Sein.Game('intro-game', {
                        canvas: canvas,
                        clearColor: new Sein.Color(0, .6, .9, 1),
                        width: canvas.offsetWidth,
                        height: canvas.offsetHeight,
                        pixelRatio: window.devicePixelRatio
                    });
                    engine.addGame(game);
                    game.onError = function (error, details) {
                        game.event.trigger(types_1.EModelEvents.Error, { error: error, details: details });
                    };
                    game.addWorld('main', Sein.GameModeActor, Sein.LevelScriptActor);
                    return [4 /*yield*/, game.start()];
                case 1:
                    _a.sent();
                    game.world.enablePhysic(new Sein.CannonPhysicWorld(CANNON));
                    game.resource.register('Audio', Sein.Audio.Loader);
                    game.addActor('audioSystem', Sein.Audio.SystemActor);
                    return [4 /*yield*/, script_1.initEvents(game)];
                case 2:
                    _a.sent();
                    game.event.add(types_1.EModelEvents.New, function (sources) { return __awaiter(_this, void 0, void 0, function () {
                        var newModels;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, script_1.createNewModels(game, sources, preModels)];
                                case 1:
                                    newModels = _a.sent();
                                    preModels.slice(0, 0);
                                    game.event.trigger(types_1.EModelEvents.LoadStart);
                                    preModels.push.apply(preModels, newModels);
                                    game.event.trigger(types_1.EModelEvents.LoadEnd, { models: newModels });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    game.event.add(types_1.EModelEvents.LoadEnd, function (params) {
                        var models = params.models;
                        console.log(models);
                        models.forEach(function (actor) {
                            if (Sein.isPerspectiveCameraActor(actor) || Sein.isOrthographicCameraActor(actor)) {
                                script_1.bindCameraControl(actor, models);
                            }
                        });
                    });
                    game.event.trigger(types_1.EModelEvents.New, [{ name: 'miku.gltf', url: '/previewer/scene.gltf' }]);
                    return [2 /*return*/, game];
            }
        });
    });
}
exports.main = main;


/***/ })

})