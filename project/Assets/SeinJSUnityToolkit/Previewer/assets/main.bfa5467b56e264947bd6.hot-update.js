webpackHotUpdate("main",{

/***/ "./src/game/script.ts":
/*!****************************!*\
  !*** ./src/game/script.ts ***!
  \****************************/
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
 * @File   : script.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Tue Oct 15 2019
 * @Description: script.
 */
var Sein = __webpack_require__(/*! seinjs */ "./node_modules/_seinjs@1.3.14@seinjs/lib/seinjs.es.js");
__webpack_require__(/*! seinjs-camera-controls */ "./node_modules/_seinjs-camera-controls@0.8.12@seinjs-camera-controls/lib/index.js");
var types_1 = __webpack_require__(/*! ./types */ "./src/game/types.ts");
function initEvents(game) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Register model events
            game.event.register(types_1.EModelEvents.New);
            game.event.register(types_1.EModelEvents.LoadStart);
            game.event.register(types_1.EModelEvents.Loading);
            game.event.register(types_1.EModelEvents.LoadEnd);
            game.event.register(types_1.EModelEvents.Error);
            return [2 /*return*/];
        });
    });
}
exports.initEvents = initEvents;
function createNewModels(game, sources, oldModels) {
    return __awaiter(this, void 0, void 0, function () {
        var world, newModels, index, _a, name_1, url, index, actors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    world = game.world;
                    newModels = [];
                    index = 0;
                    _b.label = 1;
                case 1:
                    if (!(index < sources.length)) return [3 /*break*/, 4];
                    _a = sources[index], name_1 = _a.name, url = _a.url;
                    game.event.trigger(types_1.EModelEvents.Loading, { source: { name: name_1, url: url } });
                    return [4 /*yield*/, game.resource.load({ type: 'GlTF', name: name_1, url: url })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    index += 1;
                    return [3 /*break*/, 1];
                case 4:
                    // Remove all old models
                    oldModels.forEach(function (actor) { return world.removeActor(actor); });
                    // Instantiate all new modes
                    for (index = 0; index < sources.length; index += 1) {
                        actors = game.resource.instantiate(sources[index].name);
                        newModels.push.apply(newModels, actors.array);
                    }
                    return [2 /*return*/, newModels];
            }
        });
    });
}
exports.createNewModels = createNewModels;
function bindCameraControl(camera, models) {
    camera.addComponent('control', Sein.CameraControls.CameraFreeControlComponent, {
        enableDamping: true,
        dampingFactor: .2,
        zoomMax: 100,
        zoomMin: .1
    });
    camera.getWorld().setMainCamera(camera);
}
exports.bindCameraControl = bindCameraControl;
function createDefaultCamera(game, actors) {
    return __awaiter(this, void 0, void 0, function () {
        var world, camera, target, bounds, radius;
        return __generator(this, function (_a) {
            world = game.world;
            camera = world.addActor('camera', Sein.PerspectiveCameraActor, {
                far: 1000,
                near: .01,
                fov: 60,
                aspect: game.screenWidth / game.screenHeight,
                position: new Sein.Vector3(0, 0, 5)
            });
            bounds = {
                x0: 0, x1: 0, y0: 0, y1: 0, z0: 0, z1: 0,
            };
            actors.forEach(function (actor) {
                var b = actor.getBounds();
                if (!b) {
                    return;
                }
                bounds.x0 = b.xMin < bounds.x0 ? b.xMin : bounds.x0;
                bounds.x1 = b.xMax > bounds.x1 ? b.xMax : bounds.x1;
                bounds.y0 = b.yMin < bounds.y0 ? b.yMin : bounds.y0;
                bounds.y1 = b.yMax > bounds.y1 ? b.yMax : bounds.y1;
                bounds.z0 = b.zMin < bounds.z0 ? b.zMin : bounds.z0;
                bounds.z1 = b.zMax > bounds.z1 ? b.zMax : bounds.z1;
            });
            radius = Math.sqrt((Math.pow(((bounds.x1 - bounds.x0) / 2), 2))
                + (Math.pow(((bounds.y1 - bounds.y0) / 2), 2))
                + (Math.pow(((bounds.z1 - bounds.z0) / 2), 2))) * 2;
            camera.transform.setPosition((bounds.x0 + bounds.x1) / 2, (bounds.y0 + bounds.y1) / 2, (bounds.z0 + bounds.z1) + radius);
            target = new Sein.Vector3(camera.transform.x, camera.transform.y, (bounds.z0 + bounds.z1) / 2);
            camera.lookAt(target);
            camera.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
                enableDamping: true,
                dampingFactor: .2,
                zoomMax: 100,
                zoomMin: .1,
                target: target
            });
            return [2 /*return*/];
        });
    });
}
exports.createDefaultCamera = createDefaultCamera;
function createDefaultLights(game) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            world = game.world;
            world.addActor('aLight', Sein.AmbientLightActor, {
                color: new Sein.Color(1, 1, 1),
                amount: .5
            });
            world.addActor('dLight', Sein.DirectionalLightActor, {
                direction: new Sein.Vector3(0, -1, 1),
                color: new Sein.Color(1, 1, 1),
                amount: 2
            });
            return [2 /*return*/];
        });
    });
}
exports.createDefaultLights = createDefaultLights;


/***/ })

})