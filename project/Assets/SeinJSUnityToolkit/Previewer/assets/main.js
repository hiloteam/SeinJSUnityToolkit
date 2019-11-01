/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/previewer/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"seinjs","common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/_css-loader@0.28.11@css-loader/index.js!./node_modules/_postcss-loader@2.1.6@postcss-loader/lib/index.js!./node_modules/_sass-loader@6.0.7@sass-loader/lib/loader.js!./src/base.scss":
/*!*****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_css-loader@0.28.11@css-loader!./node_modules/_postcss-loader@2.1.6@postcss-loader/lib!./node_modules/_sass-loader@6.0.7@sass-loader/lib/loader.js!./src/base.scss ***!
  \*****************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/_css-loader@0.28.11@css-loader/lib/css-base.js */ "./node_modules/_css-loader@0.28.11@css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/**\n * @File   : base.scss\n * @Author : dtysky (dtysky@outlook.com)\n * @Date   : Tue Oct 15 2019\n * @Description: Style.\n */\nhtml, body, #container {\n  position: relative;\n  padding: 0;\n  margin: 0;\n  outline: none;\n  width: 100%;\n  height: 100%; }\n.game {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%; }\n", ""]);

// exports


/***/ }),

/***/ "./src/base.scss":
/*!***********************!*\
  !*** ./src/base.scss ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../node_modules/_css-loader@0.28.11@css-loader!../node_modules/_postcss-loader@2.1.6@postcss-loader/lib!../node_modules/_sass-loader@6.0.7@sass-loader/lib/loader.js!./base.scss */ "./node_modules/_css-loader@0.28.11@css-loader/index.js!./node_modules/_postcss-loader@2.1.6@postcss-loader/lib/index.js!./node_modules/_sass-loader@6.0.7@sass-loader/lib/loader.js!./src/base.scss");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(/*! ../node_modules/_style-loader@0.19.1@style-loader/lib/addStyles.js */ "./node_modules/_style-loader@0.19.1@style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),

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
var Sein = __webpack_require__(/*! seinjs */ "./node_modules/_seinjs@1.3.18@seinjs/lib/seinjs.umd.js");
__webpack_require__(/*! seinjs-audio */ "./node_modules/_seinjs-audio@0.8.10@seinjs-audio/lib/index.js");
__webpack_require__(/*! seinjs-inspector */ "./node_modules/_seinjs-inspector@0.8.10@seinjs-inspector/lib/index.js");
var CANNON = __webpack_require__(/*! cannon-dtysky */ "./node_modules/_cannon-dtysky@0.6.4@cannon-dtysky/build/cannon.js");
var types_1 = __webpack_require__(/*! ./types */ "./src/game/types.ts");
exports.EModelEvents = types_1.EModelEvents;
var script_1 = __webpack_require__(/*! ./script */ "./src/game/script.ts");
var preModels = [];
function main(canvas) {
    return __awaiter(this, void 0, void 0, function () {
        var engine, game, inspector, loading;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = new Sein.Engine();
                    game = new Sein.Game('intro-game', {
                        canvas: canvas,
                        clearColor: new Sein.Color(.5, .5, .5, 1),
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
                    inspector = game.addActor('inspector', Sein.Inspector.Actor, {
                        dom: document.getElementById('container'),
                        updateRate: 10
                    });
                    game.world.enablePhysic(new Sein.CannonPhysicWorld(CANNON));
                    game.resource.register('Audio', Sein.Audio.Loader);
                    game.addActor('audioSystem', Sein.Audio.SystemActor);
                    return [4 /*yield*/, script_1.initEvents(game)];
                case 2:
                    _a.sent();
                    loading = document.getElementById('loading');
                    game.event.add(types_1.EModelEvents.New, function (sources) { return __awaiter(_this, void 0, void 0, function () {
                        var newModels;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    loading.style.display = 'block';
                                    return [4 /*yield*/, script_1.createNewModels(game, sources, preModels)];
                                case 1:
                                    newModels = _a.sent();
                                    loading.style.display = 'none';
                                    preModels.slice(0, 0);
                                    game.event.trigger(types_1.EModelEvents.LoadStart);
                                    preModels.push.apply(preModels, newModels);
                                    game.event.trigger(types_1.EModelEvents.LoadEnd, { models: newModels });
                                    console.log(newModels);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    game.event.add(types_1.EModelEvents.Loading, function (state) {
                        loading.innerText = "Loading: " + state.source.name;
                    });
                    game.event.add(types_1.EModelEvents.LoadEnd, function (params) {
                        var models = params.models;
                        var hasCamera = false;
                        models.forEach(function (actor) {
                            if (Sein.isPerspectiveCameraActor(actor) || Sein.isOrthographicCameraActor(actor)) {
                                script_1.bindCameraControl(actor, models);
                                hasCamera = true;
                            }
                        });
                        if (!hasCamera) {
                            script_1.createDefaultCamera(game, models);
                        }
                        inspector.syncVerticesInfo();
                    });
                    game.event.trigger(types_1.EModelEvents.New, [{ name: 'scene.gltf', url: '/previewer/scene.gltf' }]);
                    if (location.search.indexOf('qrcode=true') < 0) {
                        script_1.checkUpdate();
                    }
                    return [2 /*return*/, game];
            }
        });
    });
}
exports.main = main;


/***/ }),

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
var Sein = __webpack_require__(/*! seinjs */ "./node_modules/_seinjs@1.3.18@seinjs/lib/seinjs.umd.js");
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
function bindCameraControl(camera, actors) {
    var bounds = calcModelsBound(actors);
    var target = new Sein.Vector3((bounds.x0 + bounds.x1) / 2, (bounds.y0 + bounds.y1) / 2, (bounds.z0 + bounds.z1) / 2);
    camera.lookAt(target);
    camera.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
        enableDamping: true,
        dampingFactor: .2,
        zoomMax: 1000,
        zoomMin: .01,
        target: target
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
            bounds = calcModelsBound(actors);
            radius = Math.sqrt((Math.pow(((bounds.x1 - bounds.x0) / 2), 2))
                + (Math.pow(((bounds.y1 - bounds.y0) / 2), 2))
                + (Math.pow(((bounds.z1 - bounds.z0) / 2), 2))) * 2;
            camera.transform.setPosition((bounds.x0 + bounds.x1) / 2, (bounds.y0 + bounds.y1) / 2, (bounds.z0 + bounds.z1) + radius);
            target = new Sein.Vector3(camera.transform.x, camera.transform.y, (bounds.z0 + bounds.z1) / 2);
            camera.lookAt(target);
            camera.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
                enableDamping: true,
                dampingFactor: .2,
                zoomMax: 1000,
                zoomMin: .01,
                target: target
            });
            return [2 /*return*/];
        });
    });
}
exports.createDefaultCamera = createDefaultCamera;
function calcModelsBound(actors) {
    var bounds = {
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
    return bounds;
}
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
function checkUpdate() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Sein.HTTP.get('/heart-beat-and-update')];
                case 1:
                    res = _a.sent();
                    if (res.data && res.data.update) {
                        location.reload();
                    }
                    setTimeout(function () { return checkUpdate(); }, 1000);
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkUpdate = checkUpdate;


/***/ }),

/***/ "./src/game/types.ts":
/*!***************************!*\
  !*** ./src/game/types.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @File   : types.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Tue Oct 15 2019
 * @Description: types.
 */
var EModelEvents;
(function (EModelEvents) {
    EModelEvents["New"] = "New";
    EModelEvents["LoadStart"] = "LoadStart";
    EModelEvents["Loading"] = "Loading";
    EModelEvents["LoadEnd"] = "LoadEnd";
    EModelEvents["Error"] = "Error";
})(EModelEvents = exports.EModelEvents || (exports.EModelEvents = {}));


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Tue Oct 15 2019
 * @Description: Component.
 */
var game_1 = __webpack_require__(/*! ./game */ "./src/game/index.ts");
__webpack_require__(/*! ./base.scss */ "./src/base.scss");
var canvas = document.createElement('canvas');
canvas.className = 'game';
document.getElementById('container').appendChild(canvas);
game_1.main(canvas);


/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/dtysky/Projects/dtysky/SeinJSUnityToolkit/previewer/src/index.ts */"./src/index.ts");


/***/ })

/******/ });