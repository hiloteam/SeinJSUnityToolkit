(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["seinjs"],{

/***/ "./node_modules/_seinjs@1.3.18@seinjs/lib/seinjs.umd.js":
/*!**************************************************************!*\
  !*** ./node_modules/_seinjs@1.3.18@seinjs/lib/seinjs.umd.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {(function (global, factory) {
   true ? factory(exports) :
  undefined;
}(this, (function (exports) { 'use strict';

  /**
   * @hidden
   */
  (function (ESpace) {
      ESpace[ESpace["BONE"] = 0] = "BONE";
      ESpace[ESpace["LOCAL"] = 1] = "LOCAL";
      ESpace[ESpace["WORLD"] = 2] = "WORLD";
      ESpace[ESpace["VIEW"] = 3] = "VIEW";
      ESpace[ESpace["NDC"] = 4] = "NDC";
      ESpace[ESpace["SCREEN"] = 5] = "SCREEN";
  })(exports.ESpace || (exports.ESpace = {}));

  /**
   * 支持的碰撞体类型枚举。
   */
  (function (EColliderType) {
      /**
       * 没有碰撞体。
       */
      EColliderType[EColliderType["Null"] = 0] = "Null";
      /**
       * 球碰撞体。
       */
      EColliderType[EColliderType["Sphere"] = 1] = "Sphere";
      /**
       * 盒碰撞体。
       */
      EColliderType[EColliderType["Box"] = 2] = "Box";
      /**
       * 平面碰撞体。
       */
      EColliderType[EColliderType["Plane"] = 3] = "Plane";
      /**
       * 柱状碰撞体。
       */
      EColliderType[EColliderType["Cylinder"] = 4] = "Cylinder";
      // todo: support terrain
      // Terrain = 5,
      // Particle = 6,
      // Mesh = 7
  })(exports.EColliderType || (exports.EColliderType = {}));
  (function (ERigidBodyType) {
      /**
       * 动态的，等同于`physicStatic = false`。
       */
      ERigidBodyType[ERigidBodyType["Dynamic"] = 1] = "Dynamic";
      /**
       * 静态的，等同于`physicStatic = true`。
       */
      ERigidBodyType[ERigidBodyType["Static"] = 2] = "Static";
  })(exports.ERigidBodyType || (exports.ERigidBodyType = {}));
  (function (EPickMode) {
      /**
       * 只拾取距离摄像机最近的刚体，性能最佳。
       *
       * @deprecated
       */
      EPickMode[EPickMode["CLOSEST"] = 1] = "CLOSEST";
      /**
       * 只拾取距离摄像机最近的刚体，性能最佳。
       */
      EPickMode[EPickMode["Closest"] = 1] = "Closest";
      /**
       * 拾取任意的刚体。
       */
      EPickMode[EPickMode["Any"] = 2] = "Any";
      /**
       * 拾取所有的刚体。
       */
      EPickMode[EPickMode["All"] = 4] = "All";
  })(exports.EPickMode || (exports.EPickMode = {}));

  /**
   * **GlTFLoader的扩展相关，不要自己使用。**
   *
   * @hidden
   */
  (function (ESeinNodeType) {
      ESeinNodeType[ESeinNodeType["Component"] = 1] = "Component";
      ESeinNodeType[ESeinNodeType["Actor"] = 2] = "Actor";
  })(exports.ESeinNodeType || (exports.ESeinNodeType = {}));

  /**
   * @File   : SName.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 2018/10/8 上午11:13:40
   * @Description:
   */
  /**
   * 判断一个实例是否为`isSName`。
   */
  function isSName(value) {
      return value.isSName;
  }
  /**
   * 一个字符串池，用于构建名字，后续可以快速拿来进行对比。
   */
  var SName = /** @class */ (function () {
      /**
       * 通过字符串创建一个实例。
       */
      function SName(name) {
          this.isSName = true;
          this._value = '';
          this._index = 0;
          this._value = name;
          if (!SName.TABLE[name]) {
              SName.INDEX += 1;
              SName.TABLE[name] = SName.INDEX;
          }
          this._index = SName.TABLE[name];
      }
      Object.defineProperty(SName.prototype, "value", {
          /**
           * 获取实例的字符串值。
           */
          get: function () {
              return this._value;
          },
          enumerable: true,
          configurable: true
      });
      SName.prototype.equalsTo = function (name) {
          if (isSName(name)) {
              return this._index === name._index;
          }
          if (!SName.TABLE[name]) {
              return false;
          }
          return SName.TABLE[name] === this._index;
      };
      /**
       * @hidden
       */
      SName.prototype.toString = function () {
          return this._value;
      };
      SName.INDEX = 0;
      SName.TABLE = {};
      return SName;
  }());

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
              t[p[i]] = s[p[i]];
      return t;
  }

  function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  function __awaiter(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function __generator(thisArg, body) {
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
  }

  /**
   * @File   : index.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 10/24/2018, 4:04:57 PM
   * @Description:
   */
  /**
   * 当前环境，一般为`development`或`production`。
   */
  var env = 'production';
  if (typeof process !== 'undefined') {
      env = "development";
  }
  /**
   * 是否是开发模式。
   */
  var devMode = env !== 'production';
  /**
   * 调试用，仅在开发环境会做出的警告。
   */
  function warn() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      if (devMode) {
          console.warn.apply(console, args);
      }
  }
  /**
   * 调试用，将一个Canvas渲染到控制台。
   */
  function logCanvas(canvas, width) {
      var height = width * canvas.height / canvas.width;
      var url = canvas.toDataURL();
      /*tslint:disable-next-line */
      console.log('%c+', "font-size: 1px; padding: " + height / 2 + "px " + width / 2 + "px; line-height: " + height + "px; background: url(" + url + "); background-size: " + width + "px " + height + "px; background-repeat: no-repeat; color: transparent;");
  }
  var Debug = { devMode: devMode, warn: warn, logCanvas: logCanvas, env: env };

  /**
   * 判断一个实例是否为`BaseException`。
   */
  function isBaseException(value) {
      return value.isBaseException;
  }
  /**
   * Sein中的异常基类，用于封装特定异常，同时也作为异常边界系统的基础。
   *
   * @noInheritDoc
   */
  var BaseException = /** @class */ (function (_super) {
      __extends(BaseException, _super);
      /**
       * 构建异常。
       *
       * @param object 触发异常的实例。
       * @param message 追加信息。
       */
      function BaseException(name, object, message) {
          if (message === void 0) { message = ''; }
          var _this = _super.call(this, message) || this;
          _this.isBaseException = true;
          /**
           * 异常涉及到的SObject堆栈，生产环境无效。
           *
           * @hidden
           */
          _this.objectStack = [];
          _this.__proto__ = BaseException.prototype;
          _this.name = name;
          _this.object = object;
          _this.type = new SName(_this.name || 'Unknown');
          if (Debug.devMode) {
              _this.objectStack = _this.initObjectStack();
          }
          return _this;
      }
      /**
       * 从一个普通错误转换为异常。
       */
      BaseException.FROM_NATIVE_JS_ERROR = function (error, object) {
          var err = new BaseException(error.name, object, error.message);
          err.stack = error.stack;
          return err;
      };
      /**
       * 手动获取错误对象栈，在错误上报时可能有用。
       */
      BaseException.prototype.initObjectStack = function () {
          var currentObj = this.object;
          var stack = [];
          while (currentObj) {
              stack.push(currentObj.constructor.CLASS_NAME.value + "(" + currentObj.name.value + ")");
              currentObj = currentObj.parent;
          }
          return stack;
      };
      return BaseException;
  }(Error));

  /**
   * @File   : throwException.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 10/17/2018, 5:24:42 PM
   * @Description:
   */
  function isBaseException$1(error) {
      return error.isBaseException;
  }
  function isFunction(value) {
      return !!value.call;
  }
  /**
   * 抛出异常函数。作为错误边界系统最重要的方法，此函数允许你抛出异常或错误，并给出错误对象的栈，进行错误边界处理。
   * 详见[Exception](../guide/exception)。
   *
   * @param error 异常实例。
   * @param errorObject 触发异常的实例。
   * @param errorDetails 异常的细节。
   * @noInheritDoc
   */
  function throwException(error, errorObject, errorDetails) {
      if (errorDetails === void 0) { errorDetails = null; }
      var err = error;
      if (!isBaseException$1(error)) {
          err = BaseException.FROM_NATIVE_JS_ERROR(error, errorObject);
      }
      if (Debug.devMode) {
          console.error(err);
          /* tslint:disable-next-line */
          console.log("%cStack: " + err.objectStack.join(' -> '), 'color: #ff0000; background: rgba(255, 0, 0, .1); padding: 16px');
      }
      var currentObj = errorObject;
      while (currentObj) {
          if (currentObj.onError && isFunction(currentObj.onError)) {
              if (currentObj.onError(err, errorDetails) === true) {
                  return;
              }
          }
          currentObj = currentObj.parent;
      }
      throw err;
  }

  /**
   * @File   : SObject.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 2018/9/25 下午5:22:43
   * @Description:
   */
  /**
   * 判断一个实例是否为`SObject`。
   */
  function isSObject(value) {
      return value.isSObject;
  }
  /**
   * Sein.js的基础类，除了单纯存在于渲染引擎的实例，比如材质、几何体等，所有类都继承自`SObject`。
   * 此基类提供了基础的`uuid`计算、序列化与反序列化等标注接口。
   */
  var SObject = /** @class */ (function () {
      function SObject(name) {
          if (name === void 0) { name = ''; }
          // for serialize and deserialize
          // user can not modify
          // public _serializableMembers: (keyof IStateTypes)[] = [];
          /**
           * 一个实例是否为SObject的判据。
           */
          this.isSObject = true;
          /**
           * 预留给编辑器（有的话）。
           *
           * @hidden
           */
          this.editable = true;
          SObject.UUID += 1;
          this._uuid = SObject.UUID;
          this.name = new SName(name || this.constructor.CLASS_NAME.value + "-" + this._uuid);
      }
      Object.defineProperty(SObject.prototype, "uuid", {
          /**
           * 所有继承自`SObject`的类的实例的唯一ID。
           */
          get: function () {
              return this._uuid;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SObject.prototype, "className", {
          /**
           * 实例的类名，代理到类的静态属性`CLASS_NAME`。
           */
          get: function () {
              return this.constructor.CLASS_NAME;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SObject.prototype, "classType", {
          /**
           * 实例的类型，代理到类的静态属性`CLASS_NAME`。
           * 预留，暂时没啥用。
           */
          get: function () {
              return this.constructor.CLASS_TYPE;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 通过字符串修改实例名字。
       */
      SObject.prototype.rename = function (name) {
          this.name = new SName(name);
      };
      /**
       * 克隆一个实例，交由子类实现。
       */
      SObject.prototype.clone = function (object) {
          throw new Error('Not implement.');
      };
      /**
       * 实例序列化，交由子类实现。
       *
       * @todo: 暂未实现，预留。
       */
      SObject.prototype.serialize = function () {
          throw new Error('Not implement.');
      };
      /**
       * 从一个json序列反序列化，交由子类实现。
       *
       * @todo: 暂未实现，预留。
       */
      SObject.prototype.deserialize = function (json) {
          throw new Error('Not implement.');
      };
      /**
       * 生命周期之一，会在实例将要销毁时被触发。
       */
      SObject.prototype.onDestroy = function () {
      };
      /**
       * @hidden
       */
      SObject.prototype.destroy = function () {
          try {
              this.onDestroy();
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * 实例的类名，用于反射，在类被实例化后有`object.className`作为代理。
       */
      SObject.CLASS_NAME = new SName('SObject');
      /**
       * 实例的类型用于反射，在类被实例化后有`object.classType`作为代理。
       * 预留，暂时没用。
       */
      SObject.CLASS_TYPE = new SName('SObject');
      SObject.UUID = 0;
      return SObject;
  }());

  /**
   * 全局单例，存储着所有`SClass`的键(`className`)和类的对应表。
   */
  var MetaSClasses = {};
  /**
   * 全局单例，存储着所有`SMaterial`的键(`className`)和类的对应表。
   */
  var MetaSMaterials = {};

  /* tslint:disable */
  /**
   * 装饰器，用于指定一个继承自`SObject`的类的类名和类型，并将其添加到全局的元信息中。
   */
  function SClass(options) {
      return function Decorator(constructor) {
          var Class = constructor;
          Class.CLASS_NAME = new SName(options.className);
          if (options.classType) {
              Class.CLASS_TYPE = new SName(options.classType);
          }
          return MetaSClasses[options.className] = Class;
      };
  }
  /**
   * 装饰器，用于指定一个继承自`RawShaderMaterial`的类的类名，并将其添加到全局的元信息中。
   */
  function SMaterial(options) {
      return function Decorator(constructor) {
          constructor.CLASS_NAME = new SName(options.className);
          MetaSMaterials[options.className] = constructor;
          return constructor;
      };
  }
  /* tslint:enable */
  /**
   * @hidden
   */
  function serialize(target, key) {
      // target._serializableMembers[key] = true;
  }
  /**
   * @hidden
   */
  function deprecated(target, key) {
  }

  /**
   * 判断一个实例是否为`Observable`。
   */
  function isObservable(value) {
      return value.isObservable;
  }
  /**
   * 可观察对象，事件机制的底层基础，维护一个观察回调队列。
   *
   * @template 队列中回调的参数类型。
   */
  var Observable = /** @class */ (function (_super) {
      __extends(Observable, _super);
      /**
       * @param parent 可选，用于构造异常链。
       */
      function Observable(parent) {
          var _this = _super.call(this) || this;
          _this.isObservable = true;
          /**
           * 当队列从非空变为空时将会被触发的回调。
           */
          _this.onEmpty = function () { };
          /**
           * 父级SObject实例。
           */
          _this.parent = null;
          _this._index = 0;
          _this._length = 0;
          _this._queue = [];
          _this.parent = parent;
          return _this;
      }
      /**
       * 添加一个回调到队列中。
       */
      Observable.prototype.add = function (callback, priority) {
          if (priority !== undefined) {
              this._queue.splice(priority, 0, { callback: callback, isOnce: false });
          }
          else {
              this._queue.push({ callback: callback, isOnce: false });
          }
          return this;
      };
      /**
       * 添加一个回调到队列中，并再被触发执行一次后自动移除。
       */
      Observable.prototype.addOnce = function (callback, priority) {
          if (priority !== undefined) {
              this._queue.splice(priority, 0, { callback: callback, isOnce: true });
          }
          else {
              this._queue.push({ callback: callback, isOnce: true });
          }
          return this;
      };
      /**
       * 清空队列。
       */
      Observable.prototype.clear = function () {
          this._queue = [];
          this.onEmpty();
          return this;
      };
      /**
       * 从队列中移除一个回调。
       */
      Observable.prototype.remove = function (callback) {
          var length = this._queue.length;
          var index = -1;
          for (var i = 0; i < length; i += 1) {
              if (this._queue[i].callback === callback) {
                  index = i;
              }
          }
          if (index < 0) {
              return;
          }
          this._queue.splice(index, 1);
          // Guard: If remove a handler while notify
          this._index -= 1;
          this._length -= 1;
          if (length === 1) {
              this.onEmpty();
          }
          return this;
      };
      /**
       * 通过一个参数触发一次广播，调用所有回调。
       */
      Observable.prototype.notify = function (params) {
          this._index = 0;
          this._length = this._queue.length;
          while (this._index < this._length) {
              var _a = this._queue[this._index], callback = _a.callback, isOnce = _a.isOnce;
              if (isOnce) {
                  this._queue.splice(this._index, 1);
                  this._length -= 1;
              }
              else {
                  this._index += 1;
              }
              try {
                  if (callback(params)) {
                      return this;
                  }
              }
              catch (error) {
                  throwException(error, this);
              }
          }
          return this;
      };
      Observable = __decorate([
          SClass({ className: 'Observable' })
      ], Observable);
      return Observable;
  }(SObject));

  /**
   * 判断一个实例是否为`MissingMemberException`。
   */
  function isMissingMemberException(value) {
      return value.isMissingMemberException;
  }
  /**
   * 成员缺失异常。
   *
   * @noInheritDoc
   */
  var MissingMemberException = /** @class */ (function (_super) {
      __extends(MissingMemberException, _super);
      /**
       * 构建异常。
       *
       * @param parent 成员父级实例。
       * @param memberType 成员类型。
       * @param memberName 成员名称。
       * @param object 触发异常的实例。
       * @param message 追加信息。
       */
      function MissingMemberException(parent, memberType, memberName, object, message) {
          if (message === void 0) { message = ''; }
          var _this = _super.call(this, 'MissingMember', object, parent.className + " \"" + parent.name + "\" does not have " + memberType + " \"" + memberName + "\". " + message) || this;
          _this.isMissingMemberException = true;
          return _this;
      }
      return MissingMemberException;
  }(BaseException));

  /**
   * 判断一个实例是否为`EventManager`。
   */
  function isEventManager(value) {
      return value.isEventManager;
  }
  /**
   * 事件管理器类。作为事件的集中管理容器，承担着引擎绝大多数部分的事件注册、分发。
   *
   * @template IDefaultEvents 用于标注所有事件的名称以及对应的事件参数类型。
   * @noInheritDoc
   */
  var EventManager = /** @class */ (function (_super) {
      __extends(EventManager, _super);
      /**
       * @param objHasGame 拥有`getGame()`方法和`onError`方法的对象。
       */
      function EventManager(objHasGame) {
          if (objHasGame === void 0) { objHasGame = null; }
          var _this = _super.call(this, 'SeinEventManager') || this;
          _this.isEventManager = true;
          _this._observables = {};
          _this._triggers = {};
          _this._caches = {};
          _this._objHasGame = null;
          _this._objHasGame = objHasGame;
          return _this;
      }
      Object.defineProperty(EventManager.prototype, "parent", {
          /**
           * 获取自身的父级实例引用，一般不需要自己使用。
           */
          get: function () {
              return this._objHasGame;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @hidden
       */
      EventManager.prototype.getGame = function () {
          return this._objHasGame.getGame();
      };
      /**
       * 生命周期，用于错误边界处理。将在游戏中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
       * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
       * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
       */
      EventManager.prototype.onError = function () {
      };
      EventManager.prototype.register = function (type, TriggerClass) {
          var _this = this;
          if (this._observables[type]) {
              Debug.warn("Event " + type + " is already registered, before re-register, please unregister it at first !");
              return this;
          }
          this._observables[type] = new Observable(this);
          this._observables[type].onEmpty = function () {
              if (_this._triggers[type] && !_this._triggers[type].paused) {
                  _this._triggers[type].pause();
              }
          };
          if (TriggerClass) {
              this._triggers[type] = new TriggerClass(type, this, this.getGame());
          }
          return this;
      };
      EventManager.prototype.unregister = function (type) {
          if (!this._observables[type]) {
              return this;
          }
          delete this._observables[type];
          if (this._triggers[type]) {
              this._triggers[type].destroy();
              delete this._triggers[type];
          }
          return this;
      };
      EventManager.prototype.add = function (type, callback, priority) {
          if (!this._observables[type]) {
              this.register(type);
          }
          this._observables[type].add(callback, priority);
          if (this._triggers[type] && this._triggers[type].paused) {
              this._triggers[type].begin();
          }
          return this;
      };
      EventManager.prototype.addOnce = function (type, callback, priority) {
          if (!this._observables[type]) {
              this.register(type);
          }
          this._observables[type].addOnce(callback, priority);
          if (this._triggers[type] && this._triggers[type].paused) {
              this._triggers[type].begin();
          }
          return this;
      };
      EventManager.prototype.remove = function (type, callback) {
          if (!this._observables[type]) {
              return this;
          }
          this._observables[type].remove(callback);
          return this;
      };
      /**
       * 判断一个事件是否被注册。
       */
      EventManager.prototype.has = function (type) {
          return !!this._observables[type];
      };
      EventManager.prototype.clear = function (type) {
          if (!this._observables[type]) {
              throwException(new MissingMemberException(this, 'Event', type, this), this);
          }
          this._observables[type].clear();
          return this;
      };
      EventManager.prototype.trigger = function (type, event, immediately) {
          if (immediately === void 0) { immediately = true; }
          if (!this._observables[type]) {
              throwException(new MissingMemberException(this, 'Event', type, this, 'Register it before trigger !'), this);
          }
          if (immediately || this.getGame().paused) {
              this._observables[type].notify(event);
              return this;
          }
          this._caches[type] = event;
          return this;
      };
      EventManager.prototype.flush = function (type) {
          if (!this._observables[type]) {
              throw new MissingMemberException(this, 'Event', type, this, 'Register it before flush !');
          }
          var event = this._caches[type];
          if (event) {
              delete this._caches[type];
              this._observables[type].notify(event);
          }
          return this;
      };
      /**
       * 分发所有缓存的事件，一般不需要自行触发。
       */
      EventManager.prototype.flushAll = function () {
          for (var type in this._caches) {
              this.flush(type);
          }
          return this;
      };
      /**
       * 销毁，继承请先`super.onDestroy()`。
       */
      EventManager.prototype.onDestroy = function () {
          for (var type in this._triggers) {
              this._triggers[type].destroy();
          }
      };
      EventManager = __decorate([
          SClass({ className: 'EventManager', classType: 'EventManager' })
      ], EventManager);
      return EventManager;
  }(SObject));

  /**
   * 判断一个实例是否为`Component`。
   */
  function isComponent(value) {
      return value.isComponent;
  }
  /**
   * 游戏实体的功能的最小抽象，是Actor实际功能的体现。
   *
   * @template IStateTypes 初始化参数类型，一般交由由继承的类定义实现多态。
   * @noInheritDoc
   */
  var Component = /** @class */ (function (_super) {
      __extends(Component, _super);
      /**
       * 构造Component，**不可自行构造！！！**请参见`actor.addComponent`方法。
       */
      function Component(name, actor, initState) {
          var _this = _super.call(this, name) || this;
          _this.isComponent = true;
          /**
           * 自身是否为根组件。
           */
          _this.isRoot = false;
          /**
           * Component是否需要在每一帧进行进行`update`调用，如果为`false`，则将不会触发`onUpdate`生命周期（包括挂载在其下的所有Component）。
           * 用于性能优化。
           */
          _this.updateOnEverTick = true;
          /**
           * 是否要将自身加入其挂载的Actor的更新队列中，同时决定自身是否要跟随Actor销毁。
           * 如果为`false`，则说明此Component是一个纯静态组件（比如单纯的图元组件，没有逻辑）。
           * 用于性能优化。
           */
          _this.needUpdateAndDestroy = true;
          /**
           * 是否允许自身在运行时被动态移除，用于保护某些特殊Component，比如根组件默认不可移除。
           */
          _this.canBeRemoved = true;
          _this._owner = null;
          _this._event = null;
          _this._initState = initState || {};
          _this._owner = actor;
          _this._event = new EventManager(_this);
          return _this;
      }
      Object.defineProperty(Component.prototype, "parent", {
          /**
           * 获取自身的父级实例，根据情况不同可能有不同的类型，一般不需要自己使用。
           */
          get: function () {
              return this._owner;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Component.prototype, "event", {
          /**
           * 获取自身的事件系统管理器。
           */
          get: function () {
              return this._event;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 用于验证一个该组件在当前状态是否可被添加，一般用于防止重复添加不可重复的组件。
       * 你可以重写此方法来达成验证，如果验证不通过请抛出异常。
       * 注意，此验证仅会在`development`环境下被执行！
       */
      Component.prototype.verifyAdding = function (initState) { };
      /**
       * 用于验证一个该组件在当前状态是否可被移除。
       * 你可以重写此方法来达成验证，如果验证不通过请抛出异常。
       * 注意，此验证仅会在`development`环境下被执行！
       */
      Component.prototype.verifyRemoving = function () { };
      /**
       * 生命周期，将在Component被创建后调用。
       */
      Component.prototype.onInit = function (initState) {
      };
      /**
       * 生命周期，将在加入了Actor并且父级Actor被正式添加到了游戏中后调用。
       */
      Component.prototype.onAdd = function (initState) {
      };
      /**
       * 生命周期，将在正式加入游戏后，并且`updateOnEverTick`与`needUpdateAndDestroy`均为`true`时在每一帧被调用。
       */
      Component.prototype.onUpdate = function (delta) {
      };
      /**
       * 生命周期，用于错误边界处理。将在游戏中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
       * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
       * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
       */
      Component.prototype.onError = function (error, details) {
      };
      /**
       * 当父级Actor被`unLink`时触发，详见[actor.unLink](../classes/actor#unlink).
       */
      Component.prototype.onUnLink = function () {
      };
      /**
       * 当父级Actor被`reLink`时触发，详见[actor.reLink](../classes/actor#relink).
       */
      Component.prototype.onReLink = function () {
      };
      /**
       * 生命周期，将在Component被销毁时触发。
       */
      Component.prototype.onDestroy = function () {
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Component.prototype.initialized = function () {
          try {
              this.onInit(this._initState);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Component.prototype.added = function () {
          try {
              this.onAdd(this._initState);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Component.prototype.update = function (delta) {
          if (!this.updateOnEverTick || !this.parent) {
              return;
          }
          try {
              this.onUpdate(delta);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Component.prototype.unLink = function () {
          try {
              this.onUnLink();
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Component.prototype.reLink = function () {
          try {
              this.onReLink();
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Component.prototype.destroy = function () {
          if (!this._owner) {
              return;
          }
          this._event.destroy();
          _super.prototype.destroy.call(this);
          this._owner = null;
      };
      /**
       * 获取当前`Game`实例。
       *
       * @template IGameState 当前游戏状态管理器的类型。
       */
      Component.prototype.getGame = function () {
          return this._owner.getGame();
      };
      /**
       * 获取当前`World`实例。
       *
       * @template IWorldState 当前世界状态管理器的类型。
       */
      Component.prototype.getWorld = function () {
          return this._owner.getWorld();
      };
      /**
       * 获取当前`Level`实例。
       *
       * @template ILevelState 当前关卡状态管理器的类型。
       */
      Component.prototype.getLevel = function () {
          return this._owner.getLevel();
      };
      /**
       * 仅在初始化了物理引擎之后，用于获取当前物理世界`PhysicWorld`实例。
       * 如何使用物理引擎请见**Guide**和**Demo**。
       */
      Component.prototype.getPhysicWorld = function () {
          return this._owner.getPhysicWorld();
      };
      /**
       * 获取当前拥有自己的`Actor`。
       *
       * @template TOwner Actor的类型。
       */
      Component.prototype.getOwner = function () {
          return this._owner;
      };
      /**
       * 获取当前拥有自己的`Actor`的根组件。
       *
       * @template TRoot 根组件的类型。
       */
      Component.prototype.getRoot = function () {
          return this._owner.root;
      };
      /**
       * 将自己从父级移除，基本等同于`destroy`方法，从Owner中销毁自身。
       */
      Component.prototype.removeFromParent = function () {
          this._owner.removeComponent(this);
      };
      Component = __decorate([
          SClass({ className: 'Component', classType: 'Component' })
      ], Component);
      return Component;
  }(SObject));

  function isT(item) {
      return item.isSObject;
  }
  /**
   * 可迭代对象基类，Sein.js封装的用于存储`SObject`实例的特殊容器。
   * 一般使用此基类的子类，不直接使用自身。
   *
   * @template T 存储的实例的类型。
   */
  var SIterable = /** @class */ (function () {
      function SIterable() {
          this._array = [];
      }
      Object.defineProperty(SIterable.prototype, "length", {
          /**
           * 存储实例的个数。
           */
          get: function () {
              return this._array.length;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SIterable.prototype, "empty", {
          /**
           * 是否为空。
           */
          get: function () {
              return this._array.length === 0;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 从一个基本的数组实例初始化SIterable。
       */
      SIterable.prototype.fromArray = function (array) {
          throw new Error('Not implemented');
      };
      /**
       * 对存储的所有实例进行迭代。
       * 通过回调的返回值设`true`，你可以终止迭代，这用于性能优化。
       */
      SIterable.prototype.forEach = function (func) {
          var length = this.length;
          for (var index = 0; index < length; index += 1) {
              if (func(this._array[index])) {
                  return this;
              }
          }
          return this;
      };
      /**
       * 清空所有存储的实例。
       */
      SIterable.prototype.clear = function () {
          this._array = [];
          return this;
      };
      SIterable.prototype.addItem = function (item) {
          this._array.push(item);
      };
      SIterable.prototype.removeItem = function (item) {
          var index;
          if (isT(item)) {
              index = this._array.indexOf(item);
              if (index < 0) {
                  return;
              }
          }
          else {
              index = item;
              item = this._array[index];
              if (!item) {
                  return;
              }
          }
          this._array.splice(index, 1);
      };
      /**
       * 根据类来查找第一个实例。
       */
      SIterable.prototype.findByClass = function (Class) {
          return this.findByFilter(function (item) { return item.className.equalsTo(Class.CLASS_NAME); });
      };
      /**
       * 根据类来查找所有实例。
       *
       * @param stopFinding 通过当前实例判断是否要继续搜索，返回`true`则停止搜索，用于性能优化。
       */
      SIterable.prototype.findAllByClass = function (Class, stopFinding) {
          return this.findAllByFilter(function (item) { return item.className.equalsTo(Class.CLASS_NAME); }, stopFinding);
      };
      /**
       * 根据类型来查找第一个实例。
       */
      SIterable.prototype.findByClassType = function (classType) {
          return this.findByFilter(function (item) { return item.classType.equalsTo(classType); });
      };
      /**
       * 根据类型来查找所有实例。
       *
       * @param stopFinding 通过当前实例判断是否要继续搜索，返回`true`则停止搜索，用于性能优化。
       */
      SIterable.prototype.findAllByClassType = function (classType, stopFinding) {
          return this.findAllByFilter(function (item) { return item.classType.equalsTo(classType); }, stopFinding);
      };
      /**
       * 通过名字查找第一个实例。
       */
      SIterable.prototype.findByName = function (name) {
          return this.findByFilter(function (item) { return item.name.equalsTo(name); });
      };
      /**
       * 通过名字查找所有实例。
       *
       * @param stopFinding 通过当前实例判断是否要继续搜索，返回`true`则停止搜索，用于性能优化。
       */
      SIterable.prototype.findAllByName = function (name, stopFinding) {
          return this.findAllByFilter(function (item) { return item.name.equalsTo(name); }, stopFinding);
      };
      /**
       * 根据给定的filter函数来查找第一个实例。
       */
      SIterable.prototype.findByFilter = function (filter) {
          var element = null;
          this.forEach(function (ele) {
              if (filter(ele)) {
                  element = ele;
                  return true;
              }
          });
          return element;
      };
      /**
       * 根据给定的filter函数来查找所有实例。
       *
       * @param stopFinding 通过当前实例判断是否要继续搜索，返回`true`则停止搜索，用于性能优化。
       */
      SIterable.prototype.findAllByFilter = function (filter, stopFinding) {
          var result = [];
          this.forEach(function (ele) {
              if (filter(ele)) {
                  result.push(ele);
                  if (stopFinding && stopFinding(ele, result)) {
                      return true;
                  }
              }
          });
          return result;
      };
      /**
       * 序列化，尚未实现。
       *
       * @hidden
       */
      SIterable.prototype.serialize = function () {
          throw new Error('Not implemented');
      };
      /**
       * 反序列化，尚未实现。
       *
       * @hidden
       */
      SIterable.prototype.deserialize = function (json) {
          throw new Error('Not implemented');
      };
      return SIterable;
  }());

  /**
   * Sein.js封装的用于存储`SObject`实例的特殊数组容器。
   *
   * @template T 存储的实例的类型。
   */
  var SArray = /** @class */ (function (_super) {
      __extends(SArray, _super);
      function SArray() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(SArray.prototype, "array", {
          /**
           * 原始基础数组。
           */
          get: function () {
              return this._array;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 添加一个实例到容器中。
       */
      SArray.prototype.add = function (item) {
          this.addItem(item);
          return this;
      };
      /**
       * 从容器中移除一个实例。
       */
      SArray.prototype.remove = function (item) {
          this.removeItem(item);
          return this;
      };
      /**
       * 修改`index`索引处的实例。
       */
      SArray.prototype.set = function (index, value) {
          this._array[index] = value;
          return this;
      };
      /**
       * 在`index`索引处后方插入一个实例。
       */
      SArray.prototype.insert = function (index, value) {
          this._array.splice(index, 0, value);
          return this;
      };
      /**
       * 获取`index`索引处的实例引用。
       */
      SArray.prototype.get = function (index) {
          return this._array[index];
      };
      /**
       * 释放容器队列中的最后一个实例。
       */
      SArray.prototype.pop = function () {
          var length = this.length;
          var item = this._array[length];
          this.removeItem(length);
          return item;
      };
      /**
       * 查找实例在容器中的索引。
       */
      SArray.prototype.indexOf = function (item) {
          return this._array.indexOf(item);
      };
      /**
       * 合并当前和另一个容器。
       */
      SArray.prototype.merge = function (array) {
          Array.prototype.push.apply(this._array, array._array);
          return this;
      };
      /**
       * 从另一个容器复制数据。
       */
      SArray.prototype.copy = function (array) {
          this._array = array.array.slice();
          return this;
      };
      /**
       * 从一个基本的数组实例初始化SIterable。
       */
      SArray.prototype.fromArray = function (array) {
          this._array = array.slice();
          return this;
      };
      return SArray;
  }(SIterable));

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var Hilo3d = createCommonjsModule(function (module, exports) {
  /**
   * Hilo3d 1.13.31
   * Copyright (c) 2017-present Alibaba Group Holding Ltd.
   * @license MIT
   */
  window.Hilo3d=function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i});},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=117)}([function(t,e,n){
  /*!
  @fileoverview gl-matrix - High performance matrix and vector operations
  @author Brandon Jones
  @author Colin MacKenzie IV
  @version 2.7.0

  Copyright (c) 2015-2018, Brandon Jones, Colin MacKenzie IV.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

  */
  t.exports=function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i});},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=10)}([function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.setMatrixArrayType=function(t){e.ARRAY_TYPE=t;},e.toRadian=function(t){return t*r},e.equals=function(t,e){return Math.abs(t-e)<=i*Math.max(1,Math.abs(t),Math.abs(e))};var i=e.EPSILON=1e-6;e.ARRAY_TYPE="undefined"!=typeof Float32Array?Float32Array:Array,e.RANDOM=Math.random;var r=Math.PI/180;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.forEach=e.sqrLen=e.len=e.sqrDist=e.dist=e.div=e.mul=e.sub=void 0,e.create=r,e.clone=function(t){var e=new i.ARRAY_TYPE(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},e.fromValues=function(t,e,n,r){var s=new i.ARRAY_TYPE(4);return s[0]=t,s[1]=e,s[2]=n,s[3]=r,s},e.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},e.set=function(t,e,n,i,r){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t},e.add=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t},e.subtract=s,e.multiply=a,e.divide=o,e.ceil=function(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t[3]=Math.ceil(e[3]),t},e.floor=function(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t[3]=Math.floor(e[3]),t},e.min=function(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t[2]=Math.min(e[2],n[2]),t[3]=Math.min(e[3],n[3]),t},e.max=function(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t[2]=Math.max(e[2],n[2]),t[3]=Math.max(e[3],n[3]),t},e.round=function(t,e){return t[0]=Math.round(e[0]),t[1]=Math.round(e[1]),t[2]=Math.round(e[2]),t[3]=Math.round(e[3]),t},e.scale=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t},e.scaleAndAdd=function(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t},e.distance=u,e.squaredDistance=c,e.length=h,e.squaredLength=f,e.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t},e.inverse=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t[3]=1/e[3],t},e.normalize=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n*n+i*i+r*r+s*s;return a>0&&(a=1/Math.sqrt(a),t[0]=n*a,t[1]=i*a,t[2]=r*a,t[3]=s*a),t},e.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]},e.lerp=function(t,e,n,i){var r=e[0],s=e[1],a=e[2],o=e[3];return t[0]=r+i*(n[0]-r),t[1]=s+i*(n[1]-s),t[2]=a+i*(n[2]-a),t[3]=o+i*(n[3]-o),t},e.random=function(t,e){var n,r,s,a,o,u;e=e||1;do{o=(n=2*i.RANDOM()-1)*n+(r=2*i.RANDOM()-1)*r;}while(o>=1);do{u=(s=2*i.RANDOM()-1)*s+(a=2*i.RANDOM()-1)*a;}while(u>=1);var c=Math.sqrt((1-o)/u);return t[0]=e*n,t[1]=e*r,t[2]=e*s*c,t[3]=e*a*c,t},e.transformMat4=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3];return t[0]=n[0]*i+n[4]*r+n[8]*s+n[12]*a,t[1]=n[1]*i+n[5]*r+n[9]*s+n[13]*a,t[2]=n[2]*i+n[6]*r+n[10]*s+n[14]*a,t[3]=n[3]*i+n[7]*r+n[11]*s+n[15]*a,t},e.transformQuat=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=n[0],o=n[1],u=n[2],c=n[3],h=c*i+o*s-u*r,f=c*r+u*i-a*s,l=c*s+a*r-o*i,d=-a*i-o*r-u*s;return t[0]=h*c+d*-a+f*-u-l*-o,t[1]=f*c+d*-o+l*-a-h*-u,t[2]=l*c+d*-u+h*-o-f*-a,t[3]=e[3],t},e.str=function(t){return "vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},e.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]},e.equals=function(t,e){var n=t[0],r=t[1],s=t[2],a=t[3],o=e[0],u=e[1],c=e[2],h=e[3];return Math.abs(n-o)<=i.EPSILON*Math.max(1,Math.abs(n),Math.abs(o))&&Math.abs(r-u)<=i.EPSILON*Math.max(1,Math.abs(r),Math.abs(u))&&Math.abs(s-c)<=i.EPSILON*Math.max(1,Math.abs(s),Math.abs(c))&&Math.abs(a-h)<=i.EPSILON*Math.max(1,Math.abs(a),Math.abs(h))};var i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0));function r(){var t=new i.ARRAY_TYPE(4);return i.ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function s(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t}function a(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t[2]=e[2]*n[2],t[3]=e[3]*n[3],t}function o(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t[2]=e[2]/n[2],t[3]=e[3]/n[3],t}function u(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2],s=e[3]-t[3];return Math.sqrt(n*n+i*i+r*r+s*s)}function c(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2],s=e[3]-t[3];return n*n+i*i+r*r+s*s}function h(t){var e=t[0],n=t[1],i=t[2],r=t[3];return Math.sqrt(e*e+n*n+i*i+r*r)}function f(t){var e=t[0],n=t[1],i=t[2],r=t[3];return e*e+n*n+i*i+r*r}e.sub=s,e.mul=a,e.div=o,e.dist=u,e.sqrDist=c,e.len=h,e.sqrLen=f,e.forEach=function(){var t=r();return function(e,n,i,r,s,a){var o,u=void 0;for(n||(n=4),i||(i=0),o=r?Math.min(r*n+i,e.length):e.length,u=i;u<o;u+=n)t[0]=e[u],t[1]=e[u+1],t[2]=e[u+2],t[3]=e[u+3],s(t,t,a),e[u]=t[0],e[u+1]=t[1],e[u+2]=t[2],e[u+3]=t[3];return e}}();},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.forEach=e.sqrLen=e.len=e.sqrDist=e.dist=e.div=e.mul=e.sub=void 0,e.create=r,e.clone=function(t){var e=new i.ARRAY_TYPE(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e},e.length=s,e.fromValues=a,e.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t},e.set=function(t,e,n,i){return t[0]=e,t[1]=n,t[2]=i,t},e.add=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t},e.subtract=o,e.multiply=u,e.divide=c,e.ceil=function(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t},e.floor=function(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t},e.min=function(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t[2]=Math.min(e[2],n[2]),t},e.max=function(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t[2]=Math.max(e[2],n[2]),t},e.round=function(t,e){return t[0]=Math.round(e[0]),t[1]=Math.round(e[1]),t[2]=Math.round(e[2]),t},e.scale=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t},e.scaleAndAdd=function(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t},e.distance=h,e.squaredDistance=f,e.squaredLength=l,e.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t},e.inverse=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t},e.normalize=d,e.dot=m,e.cross=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=n[0],o=n[1],u=n[2];return t[0]=r*u-s*o,t[1]=s*a-i*u,t[2]=i*o-r*a,t},e.lerp=function(t,e,n,i){var r=e[0],s=e[1],a=e[2];return t[0]=r+i*(n[0]-r),t[1]=s+i*(n[1]-s),t[2]=a+i*(n[2]-a),t},e.hermite=function(t,e,n,i,r,s){var a=s*s,o=a*(2*s-3)+1,u=a*(s-2)+s,c=a*(s-1),h=a*(3-2*s);return t[0]=e[0]*o+n[0]*u+i[0]*c+r[0]*h,t[1]=e[1]*o+n[1]*u+i[1]*c+r[1]*h,t[2]=e[2]*o+n[2]*u+i[2]*c+r[2]*h,t},e.bezier=function(t,e,n,i,r,s){var a=1-s,o=a*a,u=s*s,c=o*a,h=3*s*o,f=3*u*a,l=u*s;return t[0]=e[0]*c+n[0]*h+i[0]*f+r[0]*l,t[1]=e[1]*c+n[1]*h+i[1]*f+r[1]*l,t[2]=e[2]*c+n[2]*h+i[2]*f+r[2]*l,t},e.random=function(t,e){e=e||1;var n=2*i.RANDOM()*Math.PI,r=2*i.RANDOM()-1,s=Math.sqrt(1-r*r)*e;return t[0]=Math.cos(n)*s,t[1]=Math.sin(n)*s,t[2]=r*e,t},e.transformMat4=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=n[3]*i+n[7]*r+n[11]*s+n[15];return a=a||1,t[0]=(n[0]*i+n[4]*r+n[8]*s+n[12])/a,t[1]=(n[1]*i+n[5]*r+n[9]*s+n[13])/a,t[2]=(n[2]*i+n[6]*r+n[10]*s+n[14])/a,t},e.transformMat3=function(t,e,n){var i=e[0],r=e[1],s=e[2];return t[0]=i*n[0]+r*n[3]+s*n[6],t[1]=i*n[1]+r*n[4]+s*n[7],t[2]=i*n[2]+r*n[5]+s*n[8],t},e.transformQuat=function(t,e,n){var i=n[0],r=n[1],s=n[2],a=n[3],o=e[0],u=e[1],c=e[2],h=r*c-s*u,f=s*o-i*c,l=i*u-r*o,d=r*l-s*f,m=s*h-i*l,_=i*f-r*h,p=2*a;return h*=p,f*=p,l*=p,d*=2,m*=2,_*=2,t[0]=o+h+d,t[1]=u+f+m,t[2]=c+l+_,t},e.rotateX=function(t,e,n,i){var r=[],s=[];return r[0]=e[0]-n[0],r[1]=e[1]-n[1],r[2]=e[2]-n[2],s[0]=r[0],s[1]=r[1]*Math.cos(i)-r[2]*Math.sin(i),s[2]=r[1]*Math.sin(i)+r[2]*Math.cos(i),t[0]=s[0]+n[0],t[1]=s[1]+n[1],t[2]=s[2]+n[2],t},e.rotateY=function(t,e,n,i){var r=[],s=[];return r[0]=e[0]-n[0],r[1]=e[1]-n[1],r[2]=e[2]-n[2],s[0]=r[2]*Math.sin(i)+r[0]*Math.cos(i),s[1]=r[1],s[2]=r[2]*Math.cos(i)-r[0]*Math.sin(i),t[0]=s[0]+n[0],t[1]=s[1]+n[1],t[2]=s[2]+n[2],t},e.rotateZ=function(t,e,n,i){var r=[],s=[];return r[0]=e[0]-n[0],r[1]=e[1]-n[1],r[2]=e[2]-n[2],s[0]=r[0]*Math.cos(i)-r[1]*Math.sin(i),s[1]=r[0]*Math.sin(i)+r[1]*Math.cos(i),s[2]=r[2],t[0]=s[0]+n[0],t[1]=s[1]+n[1],t[2]=s[2]+n[2],t},e.angle=function(t,e){var n=a(t[0],t[1],t[2]),i=a(e[0],e[1],e[2]);d(n,n),d(i,i);var r=m(n,i);return r>1?0:r<-1?Math.PI:Math.acos(r)},e.str=function(t){return "vec3("+t[0]+", "+t[1]+", "+t[2]+")"},e.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]},e.equals=function(t,e){var n=t[0],r=t[1],s=t[2],a=e[0],o=e[1],u=e[2];return Math.abs(n-a)<=i.EPSILON*Math.max(1,Math.abs(n),Math.abs(a))&&Math.abs(r-o)<=i.EPSILON*Math.max(1,Math.abs(r),Math.abs(o))&&Math.abs(s-u)<=i.EPSILON*Math.max(1,Math.abs(s),Math.abs(u))};var i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0));function r(){var t=new i.ARRAY_TYPE(3);return i.ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function s(t){var e=t[0],n=t[1],i=t[2];return Math.sqrt(e*e+n*n+i*i)}function a(t,e,n){var r=new i.ARRAY_TYPE(3);return r[0]=t,r[1]=e,r[2]=n,r}function o(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t}function u(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t[2]=e[2]*n[2],t}function c(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t[2]=e[2]/n[2],t}function h(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2];return Math.sqrt(n*n+i*i+r*r)}function f(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2];return n*n+i*i+r*r}function l(t){var e=t[0],n=t[1],i=t[2];return e*e+n*n+i*i}function d(t,e){var n=e[0],i=e[1],r=e[2],s=n*n+i*i+r*r;return s>0&&(s=1/Math.sqrt(s),t[0]=e[0]*s,t[1]=e[1]*s,t[2]=e[2]*s),t}function m(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}e.sub=o,e.mul=u,e.div=c,e.dist=h,e.sqrDist=f,e.len=s,e.sqrLen=l,e.forEach=function(){var t=r();return function(e,n,i,r,s,a){var o,u=void 0;for(n||(n=3),i||(i=0),o=r?Math.min(r*n+i,e.length):e.length,u=i;u<o;u+=n)t[0]=e[u],t[1]=e[u+1],t[2]=e[u+2],s(t,t,a),e[u]=t[0],e[u+1]=t[1],e[u+2]=t[2];return e}}();},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.setAxes=e.sqlerp=e.rotationTo=e.equals=e.exactEquals=e.normalize=e.sqrLen=e.squaredLength=e.len=e.length=e.lerp=e.dot=e.scale=e.mul=e.add=e.set=e.copy=e.fromValues=e.clone=void 0,e.create=u,e.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},e.setAxisAngle=c,e.getAxisAngle=function(t,e){var n=2*Math.acos(e[3]),r=Math.sin(n/2);return r>i.EPSILON?(t[0]=e[0]/r,t[1]=e[1]/r,t[2]=e[2]/r):(t[0]=1,t[1]=0,t[2]=0),n},e.multiply=h,e.rotateX=function(t,e,n){n*=.5;var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),u=Math.cos(n);return t[0]=i*u+a*o,t[1]=r*u+s*o,t[2]=s*u-r*o,t[3]=a*u-i*o,t},e.rotateY=function(t,e,n){n*=.5;var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),u=Math.cos(n);return t[0]=i*u-s*o,t[1]=r*u+a*o,t[2]=s*u+i*o,t[3]=a*u-r*o,t},e.rotateZ=function(t,e,n){n*=.5;var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),u=Math.cos(n);return t[0]=i*u+r*o,t[1]=r*u-i*o,t[2]=s*u+a*o,t[3]=a*u-s*o,t},e.calculateW=function(t,e){var n=e[0],i=e[1],r=e[2];return t[0]=n,t[1]=i,t[2]=r,t[3]=Math.sqrt(Math.abs(1-n*n-i*i-r*r)),t},e.slerp=f,e.random=function(t){var e=i.RANDOM(),n=i.RANDOM(),r=i.RANDOM(),s=Math.sqrt(1-e),a=Math.sqrt(e);return t[0]=s*Math.sin(2*Math.PI*n),t[1]=s*Math.cos(2*Math.PI*n),t[2]=a*Math.sin(2*Math.PI*r),t[3]=a*Math.cos(2*Math.PI*r),t},e.invert=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n*n+i*i+r*r+s*s,o=a?1/a:0;return t[0]=-n*o,t[1]=-i*o,t[2]=-r*o,t[3]=s*o,t},e.conjugate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t},e.fromMat3=l,e.fromEuler=function(t,e,n,i){var r=.5*Math.PI/180;e*=r,n*=r,i*=r;var s=Math.sin(e),a=Math.cos(e),o=Math.sin(n),u=Math.cos(n),c=Math.sin(i),h=Math.cos(i);return t[0]=s*u*h-a*o*c,t[1]=a*o*h+s*u*c,t[2]=a*u*c-s*o*h,t[3]=a*u*h+s*o*c,t},e.str=function(t){return "quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"};var i=o(n(0)),r=o(n(5)),s=o(n(2)),a=o(n(1));function o(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}function u(){var t=new i.ARRAY_TYPE(4);return i.ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function c(t,e,n){n*=.5;var i=Math.sin(n);return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=Math.cos(n),t}function h(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[0],u=n[1],c=n[2],h=n[3];return t[0]=i*h+a*o+r*c-s*u,t[1]=r*h+a*u+s*o-i*c,t[2]=s*h+a*c+i*u-r*o,t[3]=a*h-i*o-r*u-s*c,t}function f(t,e,n,r){var s=e[0],a=e[1],o=e[2],u=e[3],c=n[0],h=n[1],f=n[2],l=n[3],d=void 0,m=void 0,_=void 0,p=void 0,g=void 0;return (m=s*c+a*h+o*f+u*l)<0&&(m=-m,c=-c,h=-h,f=-f,l=-l),1-m>i.EPSILON?(d=Math.acos(m),_=Math.sin(d),p=Math.sin((1-r)*d)/_,g=Math.sin(r*d)/_):(p=1-r,g=r),t[0]=p*s+g*c,t[1]=p*a+g*h,t[2]=p*o+g*f,t[3]=p*u+g*l,t}function l(t,e){var n=e[0]+e[4]+e[8],i=void 0;if(n>0)i=Math.sqrt(n+1),t[3]=.5*i,i=.5/i,t[0]=(e[5]-e[7])*i,t[1]=(e[6]-e[2])*i,t[2]=(e[1]-e[3])*i;else{var r=0;e[4]>e[0]&&(r=1),e[8]>e[3*r+r]&&(r=2);var s=(r+1)%3,a=(r+2)%3;i=Math.sqrt(e[3*r+r]-e[3*s+s]-e[3*a+a]+1),t[r]=.5*i,i=.5/i,t[3]=(e[3*s+a]-e[3*a+s])*i,t[s]=(e[3*s+r]+e[3*r+s])*i,t[a]=(e[3*a+r]+e[3*r+a])*i;}return t}e.clone=a.clone,e.fromValues=a.fromValues,e.copy=a.copy,e.set=a.set,e.add=a.add,e.mul=h,e.scale=a.scale,e.dot=a.dot,e.lerp=a.lerp;var d=e.length=a.length,m=(e.len=d,e.squaredLength=a.squaredLength),_=(e.sqrLen=m,e.normalize=a.normalize);e.exactEquals=a.exactEquals,e.equals=a.equals,e.rotationTo=function(){var t=s.create(),e=s.fromValues(1,0,0),n=s.fromValues(0,1,0);return function(i,r,a){var o=s.dot(r,a);return o<-.999999?(s.cross(t,e,r),s.len(t)<1e-6&&s.cross(t,n,r),s.normalize(t,t),c(i,t,Math.PI),i):o>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(s.cross(t,r,a),i[0]=t[0],i[1]=t[1],i[2]=t[2],i[3]=1+o,_(i,i))}}(),e.sqlerp=function(){var t=u(),e=u();return function(n,i,r,s,a,o){return f(t,i,a,o),f(e,r,s,o),f(n,t,e,2*o*(1-o)),n}}(),e.setAxes=function(){var t=r.create();return function(e,n,i,r){return t[0]=i[0],t[3]=i[1],t[6]=i[2],t[1]=r[0],t[4]=r[1],t[7]=r[2],t[2]=-n[0],t[5]=-n[1],t[8]=-n[2],_(e,l(e,t))}}();},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.sub=e.mul=void 0,e.create=function(){var t=new i.ARRAY_TYPE(16);return i.ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t},e.clone=function(t){var e=new i.ARRAY_TYPE(16);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e},e.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},e.fromValues=function(t,e,n,r,s,a,o,u,c,h,f,l,d,m,_,p){var g=new i.ARRAY_TYPE(16);return g[0]=t,g[1]=e,g[2]=n,g[3]=r,g[4]=s,g[5]=a,g[6]=o,g[7]=u,g[8]=c,g[9]=h,g[10]=f,g[11]=l,g[12]=d,g[13]=m,g[14]=_,g[15]=p,g},e.set=function(t,e,n,i,r,s,a,o,u,c,h,f,l,d,m,_,p){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=s,t[5]=a,t[6]=o,t[7]=u,t[8]=c,t[9]=h,t[10]=f,t[11]=l,t[12]=d,t[13]=m,t[14]=_,t[15]=p,t},e.identity=r,e.transpose=function(t,e){if(t===e){var n=e[1],i=e[2],r=e[3],s=e[6],a=e[7],o=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=n,t[6]=e[9],t[7]=e[13],t[8]=i,t[9]=s,t[11]=e[14],t[12]=r,t[13]=a,t[14]=o;}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t},e.invert=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],u=e[6],c=e[7],h=e[8],f=e[9],l=e[10],d=e[11],m=e[12],_=e[13],p=e[14],g=e[15],v=n*o-i*a,E=n*u-r*a,T=n*c-s*a,M=i*u-r*o,A=i*c-s*o,I=r*c-s*u,L=h*_-f*m,O=h*p-l*m,S=h*g-d*m,R=f*p-l*_,y=f*g-d*_,x=l*g-d*p,N=v*x-E*y+T*R+M*S-A*O+I*L;return N?(N=1/N,t[0]=(o*x-u*y+c*R)*N,t[1]=(r*y-i*x-s*R)*N,t[2]=(_*I-p*A+g*M)*N,t[3]=(l*A-f*I-d*M)*N,t[4]=(u*S-a*x-c*O)*N,t[5]=(n*x-r*S+s*O)*N,t[6]=(p*T-m*I-g*E)*N,t[7]=(h*I-l*T+d*E)*N,t[8]=(a*y-o*S+c*L)*N,t[9]=(i*S-n*y-s*L)*N,t[10]=(m*A-_*T+g*v)*N,t[11]=(f*T-h*A-d*v)*N,t[12]=(o*O-a*R-u*L)*N,t[13]=(n*R-i*O+r*L)*N,t[14]=(_*E-m*M-p*v)*N,t[15]=(h*M-f*E+l*v)*N,t):null},e.adjoint=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],u=e[6],c=e[7],h=e[8],f=e[9],l=e[10],d=e[11],m=e[12],_=e[13],p=e[14],g=e[15];return t[0]=o*(l*g-d*p)-f*(u*g-c*p)+_*(u*d-c*l),t[1]=-(i*(l*g-d*p)-f*(r*g-s*p)+_*(r*d-s*l)),t[2]=i*(u*g-c*p)-o*(r*g-s*p)+_*(r*c-s*u),t[3]=-(i*(u*d-c*l)-o*(r*d-s*l)+f*(r*c-s*u)),t[4]=-(a*(l*g-d*p)-h*(u*g-c*p)+m*(u*d-c*l)),t[5]=n*(l*g-d*p)-h*(r*g-s*p)+m*(r*d-s*l),t[6]=-(n*(u*g-c*p)-a*(r*g-s*p)+m*(r*c-s*u)),t[7]=n*(u*d-c*l)-a*(r*d-s*l)+h*(r*c-s*u),t[8]=a*(f*g-d*_)-h*(o*g-c*_)+m*(o*d-c*f),t[9]=-(n*(f*g-d*_)-h*(i*g-s*_)+m*(i*d-s*f)),t[10]=n*(o*g-c*_)-a*(i*g-s*_)+m*(i*c-s*o),t[11]=-(n*(o*d-c*f)-a*(i*d-s*f)+h*(i*c-s*o)),t[12]=-(a*(f*p-l*_)-h*(o*p-u*_)+m*(o*l-u*f)),t[13]=n*(f*p-l*_)-h*(i*p-r*_)+m*(i*l-r*f),t[14]=-(n*(o*p-u*_)-a*(i*p-r*_)+m*(i*u-r*o)),t[15]=n*(o*l-u*f)-a*(i*l-r*f)+h*(i*u-r*o),t},e.determinant=function(t){var e=t[0],n=t[1],i=t[2],r=t[3],s=t[4],a=t[5],o=t[6],u=t[7],c=t[8],h=t[9],f=t[10],l=t[11],d=t[12],m=t[13],_=t[14],p=t[15];return (e*a-n*s)*(f*p-l*_)-(e*o-i*s)*(h*p-l*m)+(e*u-r*s)*(h*_-f*m)+(n*o-i*a)*(c*p-l*d)-(n*u-r*a)*(c*_-f*d)+(i*u-r*o)*(c*m-h*d)},e.multiply=s,e.translate=function(t,e,n){var i=n[0],r=n[1],s=n[2],a=void 0,o=void 0,u=void 0,c=void 0,h=void 0,f=void 0,l=void 0,d=void 0,m=void 0,_=void 0,p=void 0,g=void 0;return e===t?(t[12]=e[0]*i+e[4]*r+e[8]*s+e[12],t[13]=e[1]*i+e[5]*r+e[9]*s+e[13],t[14]=e[2]*i+e[6]*r+e[10]*s+e[14],t[15]=e[3]*i+e[7]*r+e[11]*s+e[15]):(a=e[0],o=e[1],u=e[2],c=e[3],h=e[4],f=e[5],l=e[6],d=e[7],m=e[8],_=e[9],p=e[10],g=e[11],t[0]=a,t[1]=o,t[2]=u,t[3]=c,t[4]=h,t[5]=f,t[6]=l,t[7]=d,t[8]=m,t[9]=_,t[10]=p,t[11]=g,t[12]=a*i+h*r+m*s+e[12],t[13]=o*i+f*r+_*s+e[13],t[14]=u*i+l*r+p*s+e[14],t[15]=c*i+d*r+g*s+e[15]),t},e.scale=function(t,e,n){var i=n[0],r=n[1],s=n[2];return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*s,t[9]=e[9]*s,t[10]=e[10]*s,t[11]=e[11]*s,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},e.rotate=function(t,e,n,r){var s,a,o,u,c,h,f,l,d,m,_,p,g,v,E,T,M,A,I,L,O,S,R,y,x=r[0],N=r[1],b=r[2],w=Math.sqrt(x*x+N*N+b*b);return w<i.EPSILON?null:(x*=w=1/w,N*=w,b*=w,s=Math.sin(n),o=1-(a=Math.cos(n)),u=e[0],c=e[1],h=e[2],f=e[3],l=e[4],d=e[5],m=e[6],_=e[7],p=e[8],g=e[9],v=e[10],E=e[11],T=x*x*o+a,M=N*x*o+b*s,A=b*x*o-N*s,I=x*N*o-b*s,L=N*N*o+a,O=b*N*o+x*s,S=x*b*o+N*s,R=N*b*o-x*s,y=b*b*o+a,t[0]=u*T+l*M+p*A,t[1]=c*T+d*M+g*A,t[2]=h*T+m*M+v*A,t[3]=f*T+_*M+E*A,t[4]=u*I+l*L+p*O,t[5]=c*I+d*L+g*O,t[6]=h*I+m*L+v*O,t[7]=f*I+_*L+E*O,t[8]=u*S+l*R+p*y,t[9]=c*S+d*R+g*y,t[10]=h*S+m*R+v*y,t[11]=f*S+_*R+E*y,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)},e.rotateX=function(t,e,n){var i=Math.sin(n),r=Math.cos(n),s=e[4],a=e[5],o=e[6],u=e[7],c=e[8],h=e[9],f=e[10],l=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=s*r+c*i,t[5]=a*r+h*i,t[6]=o*r+f*i,t[7]=u*r+l*i,t[8]=c*r-s*i,t[9]=h*r-a*i,t[10]=f*r-o*i,t[11]=l*r-u*i,t},e.rotateY=function(t,e,n){var i=Math.sin(n),r=Math.cos(n),s=e[0],a=e[1],o=e[2],u=e[3],c=e[8],h=e[9],f=e[10],l=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=s*r-c*i,t[1]=a*r-h*i,t[2]=o*r-f*i,t[3]=u*r-l*i,t[8]=s*i+c*r,t[9]=a*i+h*r,t[10]=o*i+f*r,t[11]=u*i+l*r,t},e.rotateZ=function(t,e,n){var i=Math.sin(n),r=Math.cos(n),s=e[0],a=e[1],o=e[2],u=e[3],c=e[4],h=e[5],f=e[6],l=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=s*r+c*i,t[1]=a*r+h*i,t[2]=o*r+f*i,t[3]=u*r+l*i,t[4]=c*r-s*i,t[5]=h*r-a*i,t[6]=f*r-o*i,t[7]=l*r-u*i,t},e.fromTranslation=function(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=e[0],t[13]=e[1],t[14]=e[2],t[15]=1,t},e.fromScaling=function(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=e[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=e[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromRotation=function(t,e,n){var r,s,a,o=n[0],u=n[1],c=n[2],h=Math.sqrt(o*o+u*u+c*c);return h<i.EPSILON?null:(o*=h=1/h,u*=h,c*=h,r=Math.sin(e),a=1-(s=Math.cos(e)),t[0]=o*o*a+s,t[1]=u*o*a+c*r,t[2]=c*o*a-u*r,t[3]=0,t[4]=o*u*a-c*r,t[5]=u*u*a+s,t[6]=c*u*a+o*r,t[7]=0,t[8]=o*c*a+u*r,t[9]=u*c*a-o*r,t[10]=c*c*a+s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)},e.fromXRotation=function(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=i,t[6]=n,t[7]=0,t[8]=0,t[9]=-n,t[10]=i,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromYRotation=function(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=0,t[2]=-n,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=n,t[9]=0,t[10]=i,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromZRotation=function(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=0,t[3]=0,t[4]=-n,t[5]=i,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromRotationTranslation=a,e.fromQuat2=function(t,e){var n=new i.ARRAY_TYPE(3),r=-e[0],s=-e[1],o=-e[2],u=e[3],c=e[4],h=e[5],f=e[6],l=e[7],d=r*r+s*s+o*o+u*u;return d>0?(n[0]=2*(c*u+l*r+h*o-f*s)/d,n[1]=2*(h*u+l*s+f*r-c*o)/d,n[2]=2*(f*u+l*o+c*s-h*r)/d):(n[0]=2*(c*u+l*r+h*o-f*s),n[1]=2*(h*u+l*s+f*r-c*o),n[2]=2*(f*u+l*o+c*s-h*r)),a(t,e,n),t},e.getTranslation=function(t,e){return t[0]=e[12],t[1]=e[13],t[2]=e[14],t},e.getScaling=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[4],a=e[5],o=e[6],u=e[8],c=e[9],h=e[10];return t[0]=Math.sqrt(n*n+i*i+r*r),t[1]=Math.sqrt(s*s+a*a+o*o),t[2]=Math.sqrt(u*u+c*c+h*h),t},e.getRotation=function(t,e){var n=e[0]+e[5]+e[10],i=0;return n>0?(i=2*Math.sqrt(n+1),t[3]=.25*i,t[0]=(e[6]-e[9])/i,t[1]=(e[8]-e[2])/i,t[2]=(e[1]-e[4])/i):e[0]>e[5]&&e[0]>e[10]?(i=2*Math.sqrt(1+e[0]-e[5]-e[10]),t[3]=(e[6]-e[9])/i,t[0]=.25*i,t[1]=(e[1]+e[4])/i,t[2]=(e[8]+e[2])/i):e[5]>e[10]?(i=2*Math.sqrt(1+e[5]-e[0]-e[10]),t[3]=(e[8]-e[2])/i,t[0]=(e[1]+e[4])/i,t[1]=.25*i,t[2]=(e[6]+e[9])/i):(i=2*Math.sqrt(1+e[10]-e[0]-e[5]),t[3]=(e[1]-e[4])/i,t[0]=(e[8]+e[2])/i,t[1]=(e[6]+e[9])/i,t[2]=.25*i),t},e.fromRotationTranslationScale=function(t,e,n,i){var r=e[0],s=e[1],a=e[2],o=e[3],u=r+r,c=s+s,h=a+a,f=r*u,l=r*c,d=r*h,m=s*c,_=s*h,p=a*h,g=o*u,v=o*c,E=o*h,T=i[0],M=i[1],A=i[2];return t[0]=(1-(m+p))*T,t[1]=(l+E)*T,t[2]=(d-v)*T,t[3]=0,t[4]=(l-E)*M,t[5]=(1-(f+p))*M,t[6]=(_+g)*M,t[7]=0,t[8]=(d+v)*A,t[9]=(_-g)*A,t[10]=(1-(f+m))*A,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t},e.fromRotationTranslationScaleOrigin=function(t,e,n,i,r){var s=e[0],a=e[1],o=e[2],u=e[3],c=s+s,h=a+a,f=o+o,l=s*c,d=s*h,m=s*f,_=a*h,p=a*f,g=o*f,v=u*c,E=u*h,T=u*f,M=i[0],A=i[1],I=i[2],L=r[0],O=r[1],S=r[2],R=(1-(_+g))*M,y=(d+T)*M,x=(m-E)*M,N=(d-T)*A,b=(1-(l+g))*A,w=(p+v)*A,C=(m+E)*I,P=(p-v)*I,H=(1-(l+_))*I;return t[0]=R,t[1]=y,t[2]=x,t[3]=0,t[4]=N,t[5]=b,t[6]=w,t[7]=0,t[8]=C,t[9]=P,t[10]=H,t[11]=0,t[12]=n[0]+L-(R*L+N*O+C*S),t[13]=n[1]+O-(y*L+b*O+P*S),t[14]=n[2]+S-(x*L+w*O+H*S),t[15]=1,t},e.fromQuat=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n+n,o=i+i,u=r+r,c=n*a,h=i*a,f=i*o,l=r*a,d=r*o,m=r*u,_=s*a,p=s*o,g=s*u;return t[0]=1-f-m,t[1]=h+g,t[2]=l-p,t[3]=0,t[4]=h-g,t[5]=1-c-m,t[6]=d+_,t[7]=0,t[8]=l+p,t[9]=d-_,t[10]=1-c-f,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.frustum=function(t,e,n,i,r,s,a){var o=1/(n-e),u=1/(r-i),c=1/(s-a);return t[0]=2*s*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=2*s*u,t[6]=0,t[7]=0,t[8]=(n+e)*o,t[9]=(r+i)*u,t[10]=(a+s)*c,t[11]=-1,t[12]=0,t[13]=0,t[14]=a*s*2*c,t[15]=0,t},e.perspective=function(t,e,n,i,r){var s=1/Math.tan(e/2),a=void 0;return t[0]=s/n,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=s,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,null!=r&&r!==1/0?(a=1/(i-r),t[10]=(r+i)*a,t[14]=2*r*i*a):(t[10]=-1,t[14]=-2*i),t},e.perspectiveFromFieldOfView=function(t,e,n,i){var r=Math.tan(e.upDegrees*Math.PI/180),s=Math.tan(e.downDegrees*Math.PI/180),a=Math.tan(e.leftDegrees*Math.PI/180),o=Math.tan(e.rightDegrees*Math.PI/180),u=2/(a+o),c=2/(r+s);return t[0]=u,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=c,t[6]=0,t[7]=0,t[8]=-(a-o)*u*.5,t[9]=(r-s)*c*.5,t[10]=i/(n-i),t[11]=-1,t[12]=0,t[13]=0,t[14]=i*n/(n-i),t[15]=0,t},e.ortho=function(t,e,n,i,r,s,a){var o=1/(e-n),u=1/(i-r),c=1/(s-a);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*u,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*c,t[11]=0,t[12]=(e+n)*o,t[13]=(r+i)*u,t[14]=(a+s)*c,t[15]=1,t},e.lookAt=function(t,e,n,s){var a=void 0,o=void 0,u=void 0,c=void 0,h=void 0,f=void 0,l=void 0,d=void 0,m=void 0,_=void 0,p=e[0],g=e[1],v=e[2],E=s[0],T=s[1],M=s[2],A=n[0],I=n[1],L=n[2];return Math.abs(p-A)<i.EPSILON&&Math.abs(g-I)<i.EPSILON&&Math.abs(v-L)<i.EPSILON?r(t):(l=p-A,d=g-I,m=v-L,a=T*(m*=_=1/Math.sqrt(l*l+d*d+m*m))-M*(d*=_),o=M*(l*=_)-E*m,u=E*d-T*l,(_=Math.sqrt(a*a+o*o+u*u))?(a*=_=1/_,o*=_,u*=_):(a=0,o=0,u=0),c=d*u-m*o,h=m*a-l*u,f=l*o-d*a,(_=Math.sqrt(c*c+h*h+f*f))?(c*=_=1/_,h*=_,f*=_):(c=0,h=0,f=0),t[0]=a,t[1]=c,t[2]=l,t[3]=0,t[4]=o,t[5]=h,t[6]=d,t[7]=0,t[8]=u,t[9]=f,t[10]=m,t[11]=0,t[12]=-(a*p+o*g+u*v),t[13]=-(c*p+h*g+f*v),t[14]=-(l*p+d*g+m*v),t[15]=1,t)},e.targetTo=function(t,e,n,i){var r=e[0],s=e[1],a=e[2],o=i[0],u=i[1],c=i[2],h=r-n[0],f=s-n[1],l=a-n[2],d=h*h+f*f+l*l;d>0&&(h*=d=1/Math.sqrt(d),f*=d,l*=d);var m=u*l-c*f,_=c*h-o*l,p=o*f-u*h;return (d=m*m+_*_+p*p)>0&&(m*=d=1/Math.sqrt(d),_*=d,p*=d),t[0]=m,t[1]=_,t[2]=p,t[3]=0,t[4]=f*p-l*_,t[5]=l*m-h*p,t[6]=h*_-f*m,t[7]=0,t[8]=h,t[9]=f,t[10]=l,t[11]=0,t[12]=r,t[13]=s,t[14]=a,t[15]=1,t},e.str=function(t){return "mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2)+Math.pow(t[9],2)+Math.pow(t[10],2)+Math.pow(t[11],2)+Math.pow(t[12],2)+Math.pow(t[13],2)+Math.pow(t[14],2)+Math.pow(t[15],2))},e.add=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t[6]=e[6]+n[6],t[7]=e[7]+n[7],t[8]=e[8]+n[8],t[9]=e[9]+n[9],t[10]=e[10]+n[10],t[11]=e[11]+n[11],t[12]=e[12]+n[12],t[13]=e[13]+n[13],t[14]=e[14]+n[14],t[15]=e[15]+n[15],t},e.subtract=o,e.multiplyScalar=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t[8]=e[8]*n,t[9]=e[9]*n,t[10]=e[10]*n,t[11]=e[11]*n,t[12]=e[12]*n,t[13]=e[13]*n,t[14]=e[14]*n,t[15]=e[15]*n,t},e.multiplyScalarAndAdd=function(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t[4]=e[4]+n[4]*i,t[5]=e[5]+n[5]*i,t[6]=e[6]+n[6]*i,t[7]=e[7]+n[7]*i,t[8]=e[8]+n[8]*i,t[9]=e[9]+n[9]*i,t[10]=e[10]+n[10]*i,t[11]=e[11]+n[11]*i,t[12]=e[12]+n[12]*i,t[13]=e[13]+n[13]*i,t[14]=e[14]+n[14]*i,t[15]=e[15]+n[15]*i,t},e.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]&&t[9]===e[9]&&t[10]===e[10]&&t[11]===e[11]&&t[12]===e[12]&&t[13]===e[13]&&t[14]===e[14]&&t[15]===e[15]},e.equals=function(t,e){var n=t[0],r=t[1],s=t[2],a=t[3],o=t[4],u=t[5],c=t[6],h=t[7],f=t[8],l=t[9],d=t[10],m=t[11],_=t[12],p=t[13],g=t[14],v=t[15],E=e[0],T=e[1],M=e[2],A=e[3],I=e[4],L=e[5],O=e[6],S=e[7],R=e[8],y=e[9],x=e[10],N=e[11],b=e[12],w=e[13],C=e[14],P=e[15];return Math.abs(n-E)<=i.EPSILON*Math.max(1,Math.abs(n),Math.abs(E))&&Math.abs(r-T)<=i.EPSILON*Math.max(1,Math.abs(r),Math.abs(T))&&Math.abs(s-M)<=i.EPSILON*Math.max(1,Math.abs(s),Math.abs(M))&&Math.abs(a-A)<=i.EPSILON*Math.max(1,Math.abs(a),Math.abs(A))&&Math.abs(o-I)<=i.EPSILON*Math.max(1,Math.abs(o),Math.abs(I))&&Math.abs(u-L)<=i.EPSILON*Math.max(1,Math.abs(u),Math.abs(L))&&Math.abs(c-O)<=i.EPSILON*Math.max(1,Math.abs(c),Math.abs(O))&&Math.abs(h-S)<=i.EPSILON*Math.max(1,Math.abs(h),Math.abs(S))&&Math.abs(f-R)<=i.EPSILON*Math.max(1,Math.abs(f),Math.abs(R))&&Math.abs(l-y)<=i.EPSILON*Math.max(1,Math.abs(l),Math.abs(y))&&Math.abs(d-x)<=i.EPSILON*Math.max(1,Math.abs(d),Math.abs(x))&&Math.abs(m-N)<=i.EPSILON*Math.max(1,Math.abs(m),Math.abs(N))&&Math.abs(_-b)<=i.EPSILON*Math.max(1,Math.abs(_),Math.abs(b))&&Math.abs(p-w)<=i.EPSILON*Math.max(1,Math.abs(p),Math.abs(w))&&Math.abs(g-C)<=i.EPSILON*Math.max(1,Math.abs(g),Math.abs(C))&&Math.abs(v-P)<=i.EPSILON*Math.max(1,Math.abs(v),Math.abs(P))};var i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0));function r(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function s(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],u=e[5],c=e[6],h=e[7],f=e[8],l=e[9],d=e[10],m=e[11],_=e[12],p=e[13],g=e[14],v=e[15],E=n[0],T=n[1],M=n[2],A=n[3];return t[0]=E*i+T*o+M*f+A*_,t[1]=E*r+T*u+M*l+A*p,t[2]=E*s+T*c+M*d+A*g,t[3]=E*a+T*h+M*m+A*v,E=n[4],T=n[5],M=n[6],A=n[7],t[4]=E*i+T*o+M*f+A*_,t[5]=E*r+T*u+M*l+A*p,t[6]=E*s+T*c+M*d+A*g,t[7]=E*a+T*h+M*m+A*v,E=n[8],T=n[9],M=n[10],A=n[11],t[8]=E*i+T*o+M*f+A*_,t[9]=E*r+T*u+M*l+A*p,t[10]=E*s+T*c+M*d+A*g,t[11]=E*a+T*h+M*m+A*v,E=n[12],T=n[13],M=n[14],A=n[15],t[12]=E*i+T*o+M*f+A*_,t[13]=E*r+T*u+M*l+A*p,t[14]=E*s+T*c+M*d+A*g,t[15]=E*a+T*h+M*m+A*v,t}function a(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=i+i,u=r+r,c=s+s,h=i*o,f=i*u,l=i*c,d=r*u,m=r*c,_=s*c,p=a*o,g=a*u,v=a*c;return t[0]=1-(d+_),t[1]=f+v,t[2]=l-g,t[3]=0,t[4]=f-v,t[5]=1-(h+_),t[6]=m+p,t[7]=0,t[8]=l+g,t[9]=m-p,t[10]=1-(h+d),t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t}function o(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t[4]=e[4]-n[4],t[5]=e[5]-n[5],t[6]=e[6]-n[6],t[7]=e[7]-n[7],t[8]=e[8]-n[8],t[9]=e[9]-n[9],t[10]=e[10]-n[10],t[11]=e[11]-n[11],t[12]=e[12]-n[12],t[13]=e[13]-n[13],t[14]=e[14]-n[14],t[15]=e[15]-n[15],t}e.mul=s,e.sub=o;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.sub=e.mul=void 0,e.create=function(){var t=new i.ARRAY_TYPE(9);return i.ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t},e.fromMat4=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t},e.clone=function(t){var e=new i.ARRAY_TYPE(9);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e},e.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},e.fromValues=function(t,e,n,r,s,a,o,u,c){var h=new i.ARRAY_TYPE(9);return h[0]=t,h[1]=e,h[2]=n,h[3]=r,h[4]=s,h[5]=a,h[6]=o,h[7]=u,h[8]=c,h},e.set=function(t,e,n,i,r,s,a,o,u,c){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=s,t[5]=a,t[6]=o,t[7]=u,t[8]=c,t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.transpose=function(t,e){if(t===e){var n=e[1],i=e[2],r=e[5];t[1]=e[3],t[2]=e[6],t[3]=n,t[5]=e[7],t[6]=i,t[7]=r;}else t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8];return t},e.invert=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],u=e[6],c=e[7],h=e[8],f=h*a-o*c,l=-h*s+o*u,d=c*s-a*u,m=n*f+i*l+r*d;return m?(m=1/m,t[0]=f*m,t[1]=(-h*i+r*c)*m,t[2]=(o*i-r*a)*m,t[3]=l*m,t[4]=(h*n-r*u)*m,t[5]=(-o*n+r*s)*m,t[6]=d*m,t[7]=(-c*n+i*u)*m,t[8]=(a*n-i*s)*m,t):null},e.adjoint=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],u=e[6],c=e[7],h=e[8];return t[0]=a*h-o*c,t[1]=r*c-i*h,t[2]=i*o-r*a,t[3]=o*u-s*h,t[4]=n*h-r*u,t[5]=r*s-n*o,t[6]=s*c-a*u,t[7]=i*u-n*c,t[8]=n*a-i*s,t},e.determinant=function(t){var e=t[0],n=t[1],i=t[2],r=t[3],s=t[4],a=t[5],o=t[6],u=t[7],c=t[8];return e*(c*s-a*u)+n*(-c*r+a*o)+i*(u*r-s*o)},e.multiply=r,e.translate=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],u=e[5],c=e[6],h=e[7],f=e[8],l=n[0],d=n[1];return t[0]=i,t[1]=r,t[2]=s,t[3]=a,t[4]=o,t[5]=u,t[6]=l*i+d*a+c,t[7]=l*r+d*o+h,t[8]=l*s+d*u+f,t},e.rotate=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],u=e[5],c=e[6],h=e[7],f=e[8],l=Math.sin(n),d=Math.cos(n);return t[0]=d*i+l*a,t[1]=d*r+l*o,t[2]=d*s+l*u,t[3]=d*a-l*i,t[4]=d*o-l*r,t[5]=d*u-l*s,t[6]=c,t[7]=h,t[8]=f,t},e.scale=function(t,e,n){var i=n[0],r=n[1];return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=r*e[3],t[4]=r*e[4],t[5]=r*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},e.fromTranslation=function(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=e[0],t[7]=e[1],t[8]=1,t},e.fromRotation=function(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=0,t[3]=-n,t[4]=i,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.fromScaling=function(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=e[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.fromMat2d=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=0,t[3]=e[2],t[4]=e[3],t[5]=0,t[6]=e[4],t[7]=e[5],t[8]=1,t},e.fromQuat=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n+n,o=i+i,u=r+r,c=n*a,h=i*a,f=i*o,l=r*a,d=r*o,m=r*u,_=s*a,p=s*o,g=s*u;return t[0]=1-f-m,t[3]=h-g,t[6]=l+p,t[1]=h+g,t[4]=1-c-m,t[7]=d-_,t[2]=l-p,t[5]=d+_,t[8]=1-c-f,t},e.normalFromMat4=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],u=e[6],c=e[7],h=e[8],f=e[9],l=e[10],d=e[11],m=e[12],_=e[13],p=e[14],g=e[15],v=n*o-i*a,E=n*u-r*a,T=n*c-s*a,M=i*u-r*o,A=i*c-s*o,I=r*c-s*u,L=h*_-f*m,O=h*p-l*m,S=h*g-d*m,R=f*p-l*_,y=f*g-d*_,x=l*g-d*p,N=v*x-E*y+T*R+M*S-A*O+I*L;return N?(N=1/N,t[0]=(o*x-u*y+c*R)*N,t[1]=(u*S-a*x-c*O)*N,t[2]=(a*y-o*S+c*L)*N,t[3]=(r*y-i*x-s*R)*N,t[4]=(n*x-r*S+s*O)*N,t[5]=(i*S-n*y-s*L)*N,t[6]=(_*I-p*A+g*M)*N,t[7]=(p*T-m*I-g*E)*N,t[8]=(m*A-_*T+g*v)*N,t):null},e.projection=function(t,e,n){return t[0]=2/e,t[1]=0,t[2]=0,t[3]=0,t[4]=-2/n,t[5]=0,t[6]=-1,t[7]=1,t[8]=1,t},e.str=function(t){return "mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2))},e.add=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t[6]=e[6]+n[6],t[7]=e[7]+n[7],t[8]=e[8]+n[8],t},e.subtract=s,e.multiplyScalar=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t[8]=e[8]*n,t},e.multiplyScalarAndAdd=function(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t[4]=e[4]+n[4]*i,t[5]=e[5]+n[5]*i,t[6]=e[6]+n[6]*i,t[7]=e[7]+n[7]*i,t[8]=e[8]+n[8]*i,t},e.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]},e.equals=function(t,e){var n=t[0],r=t[1],s=t[2],a=t[3],o=t[4],u=t[5],c=t[6],h=t[7],f=t[8],l=e[0],d=e[1],m=e[2],_=e[3],p=e[4],g=e[5],v=e[6],E=e[7],T=e[8];return Math.abs(n-l)<=i.EPSILON*Math.max(1,Math.abs(n),Math.abs(l))&&Math.abs(r-d)<=i.EPSILON*Math.max(1,Math.abs(r),Math.abs(d))&&Math.abs(s-m)<=i.EPSILON*Math.max(1,Math.abs(s),Math.abs(m))&&Math.abs(a-_)<=i.EPSILON*Math.max(1,Math.abs(a),Math.abs(_))&&Math.abs(o-p)<=i.EPSILON*Math.max(1,Math.abs(o),Math.abs(p))&&Math.abs(u-g)<=i.EPSILON*Math.max(1,Math.abs(u),Math.abs(g))&&Math.abs(c-v)<=i.EPSILON*Math.max(1,Math.abs(c),Math.abs(v))&&Math.abs(h-E)<=i.EPSILON*Math.max(1,Math.abs(h),Math.abs(E))&&Math.abs(f-T)<=i.EPSILON*Math.max(1,Math.abs(f),Math.abs(T))};var i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0));function r(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],u=e[5],c=e[6],h=e[7],f=e[8],l=n[0],d=n[1],m=n[2],_=n[3],p=n[4],g=n[5],v=n[6],E=n[7],T=n[8];return t[0]=l*i+d*a+m*c,t[1]=l*r+d*o+m*h,t[2]=l*s+d*u+m*f,t[3]=_*i+p*a+g*c,t[4]=_*r+p*o+g*h,t[5]=_*s+p*u+g*f,t[6]=v*i+E*a+T*c,t[7]=v*r+E*o+T*h,t[8]=v*s+E*u+T*f,t}function s(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t[4]=e[4]-n[4],t[5]=e[5]-n[5],t[6]=e[6]-n[6],t[7]=e[7]-n[7],t[8]=e[8]-n[8],t}e.mul=r,e.sub=s;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.forEach=e.sqrLen=e.sqrDist=e.dist=e.div=e.mul=e.sub=e.len=void 0,e.create=r,e.clone=function(t){var e=new i.ARRAY_TYPE(2);return e[0]=t[0],e[1]=t[1],e},e.fromValues=function(t,e){var n=new i.ARRAY_TYPE(2);return n[0]=t,n[1]=e,n},e.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t},e.set=function(t,e,n){return t[0]=e,t[1]=n,t},e.add=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t},e.subtract=s,e.multiply=a,e.divide=o,e.ceil=function(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t},e.floor=function(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t},e.min=function(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t},e.max=function(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t},e.round=function(t,e){return t[0]=Math.round(e[0]),t[1]=Math.round(e[1]),t},e.scale=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t},e.scaleAndAdd=function(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t},e.distance=u,e.squaredDistance=c,e.length=h,e.squaredLength=f,e.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t},e.inverse=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t},e.normalize=function(t,e){var n=e[0],i=e[1],r=n*n+i*i;return r>0&&(r=1/Math.sqrt(r),t[0]=e[0]*r,t[1]=e[1]*r),t},e.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]},e.cross=function(t,e,n){var i=e[0]*n[1]-e[1]*n[0];return t[0]=t[1]=0,t[2]=i,t},e.lerp=function(t,e,n,i){var r=e[0],s=e[1];return t[0]=r+i*(n[0]-r),t[1]=s+i*(n[1]-s),t},e.random=function(t,e){e=e||1;var n=2*i.RANDOM()*Math.PI;return t[0]=Math.cos(n)*e,t[1]=Math.sin(n)*e,t},e.transformMat2=function(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[2]*r,t[1]=n[1]*i+n[3]*r,t},e.transformMat2d=function(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[2]*r+n[4],t[1]=n[1]*i+n[3]*r+n[5],t},e.transformMat3=function(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[3]*r+n[6],t[1]=n[1]*i+n[4]*r+n[7],t},e.transformMat4=function(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[4]*r+n[12],t[1]=n[1]*i+n[5]*r+n[13],t},e.rotate=function(t,e,n,i){var r=e[0]-n[0],s=e[1]-n[1],a=Math.sin(i),o=Math.cos(i);return t[0]=r*o-s*a+n[0],t[1]=r*a+s*o+n[1],t},e.angle=function(t,e){var n=t[0],i=t[1],r=e[0],s=e[1],a=n*n+i*i;a>0&&(a=1/Math.sqrt(a));var o=r*r+s*s;o>0&&(o=1/Math.sqrt(o));var u=(n*r+i*s)*a*o;return u>1?0:u<-1?Math.PI:Math.acos(u)},e.str=function(t){return "vec2("+t[0]+", "+t[1]+")"},e.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]},e.equals=function(t,e){var n=t[0],r=t[1],s=e[0],a=e[1];return Math.abs(n-s)<=i.EPSILON*Math.max(1,Math.abs(n),Math.abs(s))&&Math.abs(r-a)<=i.EPSILON*Math.max(1,Math.abs(r),Math.abs(a))};var i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0));function r(){var t=new i.ARRAY_TYPE(2);return i.ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0),t}function s(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t}function a(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t}function o(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t}function u(t,e){var n=e[0]-t[0],i=e[1]-t[1];return Math.sqrt(n*n+i*i)}function c(t,e){var n=e[0]-t[0],i=e[1]-t[1];return n*n+i*i}function h(t){var e=t[0],n=t[1];return Math.sqrt(e*e+n*n)}function f(t){var e=t[0],n=t[1];return e*e+n*n}e.len=h,e.sub=s,e.mul=a,e.div=o,e.dist=u,e.sqrDist=c,e.sqrLen=f,e.forEach=function(){var t=r();return function(e,n,i,r,s,a){var o,u=void 0;for(n||(n=2),i||(i=0),o=r?Math.min(r*n+i,e.length):e.length,u=i;u<o;u+=n)t[0]=e[u],t[1]=e[u+1],s(t,t,a),e[u]=t[0],e[u+1]=t[1];return e}}();},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.sqrLen=e.squaredLength=e.len=e.length=e.dot=e.mul=e.setReal=e.getReal=void 0,e.create=function(){var t=new i.ARRAY_TYPE(8);return i.ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0),t[3]=1,t},e.clone=function(t){var e=new i.ARRAY_TYPE(8);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e},e.fromValues=function(t,e,n,r,s,a,o,u){var c=new i.ARRAY_TYPE(8);return c[0]=t,c[1]=e,c[2]=n,c[3]=r,c[4]=s,c[5]=a,c[6]=o,c[7]=u,c},e.fromRotationTranslationValues=function(t,e,n,r,s,a,o){var u=new i.ARRAY_TYPE(8);u[0]=t,u[1]=e,u[2]=n,u[3]=r;var c=.5*s,h=.5*a,f=.5*o;return u[4]=c*r+h*n-f*e,u[5]=h*r+f*t-c*n,u[6]=f*r+c*e-h*t,u[7]=-c*t-h*e-f*n,u},e.fromRotationTranslation=o,e.fromTranslation=function(t,e){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=.5*e[0],t[5]=.5*e[1],t[6]=.5*e[2],t[7]=0,t},e.fromRotation=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=0,t[5]=0,t[6]=0,t[7]=0,t},e.fromMat4=function(t,e){var n=r.create();s.getRotation(n,e);var a=new i.ARRAY_TYPE(3);return s.getTranslation(a,e),o(t,n,a),t},e.copy=u,e.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t},e.set=function(t,e,n,i,r,s,a,o,u){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=s,t[5]=a,t[6]=o,t[7]=u,t},e.getDual=function(t,e){return t[0]=e[4],t[1]=e[5],t[2]=e[6],t[3]=e[7],t},e.setDual=function(t,e){return t[4]=e[0],t[5]=e[1],t[6]=e[2],t[7]=e[3],t},e.getTranslation=function(t,e){var n=e[4],i=e[5],r=e[6],s=e[7],a=-e[0],o=-e[1],u=-e[2],c=e[3];return t[0]=2*(n*c+s*a+i*u-r*o),t[1]=2*(i*c+s*o+r*a-n*u),t[2]=2*(r*c+s*u+n*o-i*a),t},e.translate=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=.5*n[0],u=.5*n[1],c=.5*n[2],h=e[4],f=e[5],l=e[6],d=e[7];return t[0]=i,t[1]=r,t[2]=s,t[3]=a,t[4]=a*o+r*c-s*u+h,t[5]=a*u+s*o-i*c+f,t[6]=a*c+i*u-r*o+l,t[7]=-i*o-r*u-s*c+d,t},e.rotateX=function(t,e,n){var i=-e[0],s=-e[1],a=-e[2],o=e[3],u=e[4],c=e[5],h=e[6],f=e[7],l=u*o+f*i+c*a-h*s,d=c*o+f*s+h*i-u*a,m=h*o+f*a+u*s-c*i,_=f*o-u*i-c*s-h*a;return r.rotateX(t,e,n),i=t[0],s=t[1],a=t[2],o=t[3],t[4]=l*o+_*i+d*a-m*s,t[5]=d*o+_*s+m*i-l*a,t[6]=m*o+_*a+l*s-d*i,t[7]=_*o-l*i-d*s-m*a,t},e.rotateY=function(t,e,n){var i=-e[0],s=-e[1],a=-e[2],o=e[3],u=e[4],c=e[5],h=e[6],f=e[7],l=u*o+f*i+c*a-h*s,d=c*o+f*s+h*i-u*a,m=h*o+f*a+u*s-c*i,_=f*o-u*i-c*s-h*a;return r.rotateY(t,e,n),i=t[0],s=t[1],a=t[2],o=t[3],t[4]=l*o+_*i+d*a-m*s,t[5]=d*o+_*s+m*i-l*a,t[6]=m*o+_*a+l*s-d*i,t[7]=_*o-l*i-d*s-m*a,t},e.rotateZ=function(t,e,n){var i=-e[0],s=-e[1],a=-e[2],o=e[3],u=e[4],c=e[5],h=e[6],f=e[7],l=u*o+f*i+c*a-h*s,d=c*o+f*s+h*i-u*a,m=h*o+f*a+u*s-c*i,_=f*o-u*i-c*s-h*a;return r.rotateZ(t,e,n),i=t[0],s=t[1],a=t[2],o=t[3],t[4]=l*o+_*i+d*a-m*s,t[5]=d*o+_*s+m*i-l*a,t[6]=m*o+_*a+l*s-d*i,t[7]=_*o-l*i-d*s-m*a,t},e.rotateByQuatAppend=function(t,e,n){var i=n[0],r=n[1],s=n[2],a=n[3],o=e[0],u=e[1],c=e[2],h=e[3];return t[0]=o*a+h*i+u*s-c*r,t[1]=u*a+h*r+c*i-o*s,t[2]=c*a+h*s+o*r-u*i,t[3]=h*a-o*i-u*r-c*s,o=e[4],u=e[5],c=e[6],h=e[7],t[4]=o*a+h*i+u*s-c*r,t[5]=u*a+h*r+c*i-o*s,t[6]=c*a+h*s+o*r-u*i,t[7]=h*a-o*i-u*r-c*s,t},e.rotateByQuatPrepend=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[0],u=n[1],c=n[2],h=n[3];return t[0]=i*h+a*o+r*c-s*u,t[1]=r*h+a*u+s*o-i*c,t[2]=s*h+a*c+i*u-r*o,t[3]=a*h-i*o-r*u-s*c,o=n[4],u=n[5],c=n[6],h=n[7],t[4]=i*h+a*o+r*c-s*u,t[5]=r*h+a*u+s*o-i*c,t[6]=s*h+a*c+i*u-r*o,t[7]=a*h-i*o-r*u-s*c,t},e.rotateAroundAxis=function(t,e,n,r){if(Math.abs(r)<i.EPSILON)return u(t,e);var s=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);r*=.5;var a=Math.sin(r),o=a*n[0]/s,c=a*n[1]/s,h=a*n[2]/s,f=Math.cos(r),l=e[0],d=e[1],m=e[2],_=e[3];t[0]=l*f+_*o+d*h-m*c,t[1]=d*f+_*c+m*o-l*h,t[2]=m*f+_*h+l*c-d*o,t[3]=_*f-l*o-d*c-m*h;var p=e[4],g=e[5],v=e[6],E=e[7];return t[4]=p*f+E*o+g*h-v*c,t[5]=g*f+E*c+v*o-p*h,t[6]=v*f+E*h+p*c-g*o,t[7]=E*f-p*o-g*c-v*h,t},e.add=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t[6]=e[6]+n[6],t[7]=e[7]+n[7],t},e.multiply=c,e.scale=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t},e.lerp=function(t,e,n,i){var r=1-i;return h(e,n)<0&&(i=-i),t[0]=e[0]*r+n[0]*i,t[1]=e[1]*r+n[1]*i,t[2]=e[2]*r+n[2]*i,t[3]=e[3]*r+n[3]*i,t[4]=e[4]*r+n[4]*i,t[5]=e[5]*r+n[5]*i,t[6]=e[6]*r+n[6]*i,t[7]=e[7]*r+n[7]*i,t},e.invert=function(t,e){var n=l(e);return t[0]=-e[0]/n,t[1]=-e[1]/n,t[2]=-e[2]/n,t[3]=e[3]/n,t[4]=-e[4]/n,t[5]=-e[5]/n,t[6]=-e[6]/n,t[7]=e[7]/n,t},e.conjugate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t[4]=-e[4],t[5]=-e[5],t[6]=-e[6],t[7]=e[7],t},e.normalize=function(t,e){var n=l(e);if(n>0){n=Math.sqrt(n);var i=e[0]/n,r=e[1]/n,s=e[2]/n,a=e[3]/n,o=e[4],u=e[5],c=e[6],h=e[7],f=i*o+r*u+s*c+a*h;t[0]=i,t[1]=r,t[2]=s,t[3]=a,t[4]=(o-i*f)/n,t[5]=(u-r*f)/n,t[6]=(c-s*f)/n,t[7]=(h-a*f)/n;}return t},e.str=function(t){return "quat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+")"},e.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]},e.equals=function(t,e){var n=t[0],r=t[1],s=t[2],a=t[3],o=t[4],u=t[5],c=t[6],h=t[7],f=e[0],l=e[1],d=e[2],m=e[3],_=e[4],p=e[5],g=e[6],v=e[7];return Math.abs(n-f)<=i.EPSILON*Math.max(1,Math.abs(n),Math.abs(f))&&Math.abs(r-l)<=i.EPSILON*Math.max(1,Math.abs(r),Math.abs(l))&&Math.abs(s-d)<=i.EPSILON*Math.max(1,Math.abs(s),Math.abs(d))&&Math.abs(a-m)<=i.EPSILON*Math.max(1,Math.abs(a),Math.abs(m))&&Math.abs(o-_)<=i.EPSILON*Math.max(1,Math.abs(o),Math.abs(_))&&Math.abs(u-p)<=i.EPSILON*Math.max(1,Math.abs(u),Math.abs(p))&&Math.abs(c-g)<=i.EPSILON*Math.max(1,Math.abs(c),Math.abs(g))&&Math.abs(h-v)<=i.EPSILON*Math.max(1,Math.abs(h),Math.abs(v))};var i=a(n(0)),r=a(n(3)),s=a(n(4));function a(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}function o(t,e,n){var i=.5*n[0],r=.5*n[1],s=.5*n[2],a=e[0],o=e[1],u=e[2],c=e[3];return t[0]=a,t[1]=o,t[2]=u,t[3]=c,t[4]=i*c+r*u-s*o,t[5]=r*c+s*a-i*u,t[6]=s*c+i*o-r*a,t[7]=-i*a-r*o-s*u,t}function u(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t}function c(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[4],u=n[5],c=n[6],h=n[7],f=e[4],l=e[5],d=e[6],m=e[7],_=n[0],p=n[1],g=n[2],v=n[3];return t[0]=i*v+a*_+r*g-s*p,t[1]=r*v+a*p+s*_-i*g,t[2]=s*v+a*g+i*p-r*_,t[3]=a*v-i*_-r*p-s*g,t[4]=i*h+a*o+r*c-s*u+f*v+m*_+l*g-d*p,t[5]=r*h+a*u+s*o-i*c+l*v+m*p+d*_-f*g,t[6]=s*h+a*c+i*u-r*o+d*v+m*g+f*p-l*_,t[7]=a*h-i*o-r*u-s*c+m*v-f*_-l*p-d*g,t}e.getReal=r.copy,e.setReal=r.copy,e.mul=c;var h=e.dot=r.dot,f=e.length=r.length,l=(e.len=f,e.squaredLength=r.squaredLength);e.sqrLen=l;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.sub=e.mul=void 0,e.create=function(){var t=new i.ARRAY_TYPE(6);return i.ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0,t[4]=0,t[5]=0),t[0]=1,t[3]=1,t},e.clone=function(t){var e=new i.ARRAY_TYPE(6);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e},e.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},e.fromValues=function(t,e,n,r,s,a){var o=new i.ARRAY_TYPE(6);return o[0]=t,o[1]=e,o[2]=n,o[3]=r,o[4]=s,o[5]=a,o},e.set=function(t,e,n,i,r,s,a){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=s,t[5]=a,t},e.invert=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],u=n*s-i*r;return u?(u=1/u,t[0]=s*u,t[1]=-i*u,t[2]=-r*u,t[3]=n*u,t[4]=(r*o-s*a)*u,t[5]=(i*a-n*o)*u,t):null},e.determinant=function(t){return t[0]*t[3]-t[1]*t[2]},e.multiply=r,e.rotate=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],u=e[5],c=Math.sin(n),h=Math.cos(n);return t[0]=i*h+s*c,t[1]=r*h+a*c,t[2]=i*-c+s*h,t[3]=r*-c+a*h,t[4]=o,t[5]=u,t},e.scale=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],u=e[5],c=n[0],h=n[1];return t[0]=i*c,t[1]=r*c,t[2]=s*h,t[3]=a*h,t[4]=o,t[5]=u,t},e.translate=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],u=e[5],c=n[0],h=n[1];return t[0]=i,t[1]=r,t[2]=s,t[3]=a,t[4]=i*c+s*h+o,t[5]=r*c+a*h+u,t},e.fromRotation=function(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=-n,t[3]=i,t[4]=0,t[5]=0,t},e.fromScaling=function(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=e[1],t[4]=0,t[5]=0,t},e.fromTranslation=function(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=e[0],t[5]=e[1],t},e.str=function(t){return "mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+1)},e.add=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t},e.subtract=s,e.multiplyScalar=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t},e.multiplyScalarAndAdd=function(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t[4]=e[4]+n[4]*i,t[5]=e[5]+n[5]*i,t},e.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]},e.equals=function(t,e){var n=t[0],r=t[1],s=t[2],a=t[3],o=t[4],u=t[5],c=e[0],h=e[1],f=e[2],l=e[3],d=e[4],m=e[5];return Math.abs(n-c)<=i.EPSILON*Math.max(1,Math.abs(n),Math.abs(c))&&Math.abs(r-h)<=i.EPSILON*Math.max(1,Math.abs(r),Math.abs(h))&&Math.abs(s-f)<=i.EPSILON*Math.max(1,Math.abs(s),Math.abs(f))&&Math.abs(a-l)<=i.EPSILON*Math.max(1,Math.abs(a),Math.abs(l))&&Math.abs(o-d)<=i.EPSILON*Math.max(1,Math.abs(o),Math.abs(d))&&Math.abs(u-m)<=i.EPSILON*Math.max(1,Math.abs(u),Math.abs(m))};var i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0));function r(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],u=e[5],c=n[0],h=n[1],f=n[2],l=n[3],d=n[4],m=n[5];return t[0]=i*c+s*h,t[1]=r*c+a*h,t[2]=i*f+s*l,t[3]=r*f+a*l,t[4]=i*d+s*m+o,t[5]=r*d+a*m+u,t}function s(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t[4]=e[4]-n[4],t[5]=e[5]-n[5],t}e.mul=r,e.sub=s;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.sub=e.mul=void 0,e.create=function(){var t=new i.ARRAY_TYPE(4);return i.ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0),t[0]=1,t[3]=1,t},e.clone=function(t){var e=new i.ARRAY_TYPE(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},e.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},e.fromValues=function(t,e,n,r){var s=new i.ARRAY_TYPE(4);return s[0]=t,s[1]=e,s[2]=n,s[3]=r,s},e.set=function(t,e,n,i,r){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t},e.transpose=function(t,e){if(t===e){var n=e[1];t[1]=e[2],t[2]=n;}else t[0]=e[0],t[1]=e[2],t[2]=e[1],t[3]=e[3];return t},e.invert=function(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n*s-r*i;return a?(a=1/a,t[0]=s*a,t[1]=-i*a,t[2]=-r*a,t[3]=n*a,t):null},e.adjoint=function(t,e){var n=e[0];return t[0]=e[3],t[1]=-e[1],t[2]=-e[2],t[3]=n,t},e.determinant=function(t){return t[0]*t[3]-t[2]*t[1]},e.multiply=r,e.rotate=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),u=Math.cos(n);return t[0]=i*u+s*o,t[1]=r*u+a*o,t[2]=i*-o+s*u,t[3]=r*-o+a*u,t},e.scale=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[0],u=n[1];return t[0]=i*o,t[1]=r*o,t[2]=s*u,t[3]=a*u,t},e.fromRotation=function(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=-n,t[3]=i,t},e.fromScaling=function(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=e[1],t},e.str=function(t){return "mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))},e.LDU=function(t,e,n,i){return t[2]=i[2]/i[0],n[0]=i[0],n[1]=i[1],n[3]=i[3]-t[2]*n[1],[t,e,n]},e.add=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t},e.subtract=s,e.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]},e.equals=function(t,e){var n=t[0],r=t[1],s=t[2],a=t[3],o=e[0],u=e[1],c=e[2],h=e[3];return Math.abs(n-o)<=i.EPSILON*Math.max(1,Math.abs(n),Math.abs(o))&&Math.abs(r-u)<=i.EPSILON*Math.max(1,Math.abs(r),Math.abs(u))&&Math.abs(s-c)<=i.EPSILON*Math.max(1,Math.abs(s),Math.abs(c))&&Math.abs(a-h)<=i.EPSILON*Math.max(1,Math.abs(a),Math.abs(h))},e.multiplyScalar=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t},e.multiplyScalarAndAdd=function(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t};var i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n(0));function r(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[0],u=n[1],c=n[2],h=n[3];return t[0]=i*o+s*u,t[1]=r*o+a*u,t[2]=i*c+s*h,t[3]=r*c+a*h,t}function s(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t}e.mul=r,e.sub=s;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.vec4=e.vec3=e.vec2=e.quat2=e.quat=e.mat4=e.mat3=e.mat2d=e.mat2=e.glMatrix=void 0;var i=d(n(0)),r=d(n(9)),s=d(n(8)),a=d(n(5)),o=d(n(4)),u=d(n(3)),c=d(n(7)),h=d(n(6)),f=d(n(2)),l=d(n(1));function d(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}e.glMatrix=i,e.mat2=r,e.mat2d=s,e.mat3=a,e.mat4=o,e.quat=u,e.quat2=c,e.vec2=h,e.vec3=f,e.vec4=l;}]);},function(t,e,n){var i=n(19),r=n.n(i);e.a=r.a;},function(t,e,n){var i={};n.r(i),n.d(i,"POSITION",function(){return u}),n.d(i,"NORMAL",function(){return c}),n.d(i,"DEPTH",function(){return h}),n.d(i,"DISTANCE",function(){return f});var r=n(35),s=n.n(r).a,a=n(36),o=n.n(a).a,u="POSITION",c="NORMAL",h="DEPTH",f="DISTANCE",l={webgl:s,webglExtensions:o,Hilo:i};Object.assign(l,s,o,i);e.a=l;},function(t,e,n){var i={},r={_cache:i,level:3,LEVEL_LOG:3,LEVEL_WARN:2,LEVEL_ERROR:1,LEVEL_NONE:0,log:function(){return this.level>=3&&console.log.apply(console,arguments),this},warn:function(){return this.level>=2&&console.warn.apply(console,arguments),this},error:function(){return this.level>=1&&console.error.apply(console,arguments),this},logOnce:function(t){return i["log_"+t]||(i["log_"+t]=!0,this.log.apply(this,Array.prototype.slice.call(arguments,1))),this},warnOnce:function(t){return i["warn_"+t]||(i["warn_"+t]=!0,this.warn.apply(this,Array.prototype.slice.call(arguments,1))),this},errorOnce:function(t){return i["error_"+t]||(i["error_"+t]=!0,this.error.apply(this,Array.prototype.slice.call(arguments,1))),this}};e.a=r;},function(t,e,n){n.r(e),n.d(e,"each",function(){return p}),n.d(e,"getRelativePath",function(){return d}),n.d(e,"convertUint8ArrayToString",function(){return m}),n.d(e,"getExtension",function(){return _}),n.d(e,"getIndexFromSortedArray",function(){return g}),n.d(e,"insertToSortedArray",function(){return v}),n.d(e,"padLeft",function(){return E}),n.d(e,"getTypedArrayClass",function(){return I}),n.d(e,"copyArrayData",function(){return L}),n.d(e,"isStrOrNumber",function(){return O}),n.d(e,"getTypedArrayGLType",function(){return T}),n.d(e,"getBlobUrl",function(){return y}),n.d(e,"isBlobUrl",function(){return S}),n.d(e,"revokeBlobUrl",function(){return R}),n.d(e,"isArrayLike",function(){return x}),n.d(e,"getElementRect",function(){return N}),n.d(e,"serialRun",function(){return b});var i=n(3),r=n(2);function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var a,o=r.a.BYTE,u=r.a.UNSIGNED_BYTE,c=r.a.SHORT,h=r.a.UNSIGNED_SHORT,f=r.a.UNSIGNED_INT,l=r.a.FLOAT;function d(t,e){if(/^(?:http|blob|data:|\/)/.test(e))return e;var n;for(t=t.replace(/\/[^\/]*?$/,"").split("/"),e=e.split("/"),n=0;n<e.length;n++){var i=e[n];if(".."===i)t.pop();else if("."!==i)break}return t.join("/")+"/"+e.slice(n).join("/")}function m(t,e){if(window.TextDecoder)return a||(a=new TextDecoder("utf-8")),t instanceof Uint8Array||(t=new Uint8Array(t)),a.decode(t);for(var n="",i=0;i<t.length;i++)n+=String.fromCharCode(t[i]);return e&&(n=decodeURIComponent(escape(n))),n}function _(t){var e=String(t).match(/\/?[^\/]+\.(\w+)(\?\S+)?$/i);return e&&e[1].toLowerCase()||null}function p(t,e){t&&(Array.isArray(t)?t.forEach(e):Object.keys(t).forEach(function(n){e(t[n],n);}));}function g(t,e,n){if(!t||!t.length)return [0,0];for(var i=0,r=t.length-1;i<=r;){var s=i+r>>1,a=n(t[s],e);if(0===a)return [s,s];a<0?i=s+1:r=s-1;}return i>r?[r,i]:[i,r]}function v(t,e,n){var i=g(t,e,n);t.splice(i[1],0,e);}function E(t,e,n){return e<=t.length?t:new Array(e-t.length+1).join(n||"0")+t}function T(t){return t instanceof Float32Array?l:t instanceof Int8Array?o:t instanceof Uint8Array?u:t instanceof Int16Array?c:t instanceof Uint16Array?h:t instanceof Uint32Array?f:l}var M,A,I=(s(M={},o,Int8Array),s(M,u,Uint8Array),s(M,c,Int16Array),s(M,h,Uint16Array),s(M,f,Uint32Array),s(M,l,Float32Array),A=M,function(t){return A[t]||Float32Array});function L(t,e,n,i,r){if(t&&e){e.isGeometryData&&(e=e.data);for(var s=0;s<r;s++)t[n+s]=e[i+s];}}function O(t){return "string"==typeof t||"number"==typeof t}function S(t){return "blob:"===t.substring(0,5)}function R(t){window.URL&&URL.revokeObjectURL(t);}function y(t,e){if(e instanceof ArrayBuffer&&(e=new Uint8Array(e)),window.Blob&&window.URL)try{var n=new Blob([e],{type:t});return window.URL.createObjectURL(n)}catch(e){i.a.warn("new Blob error",t);}return "data:".concat(t,";base64,").concat(btoa(m(e)))}function x(t){return Array.isArray(t)||t.BYTES_PER_ELEMENT||t.length}function N(t){var e,n=document.documentElement;try{e=t.getBoundingClientRect();}catch(n){e={top:t.offsetTop,left:t.offsetLeft,right:t.offsetLeft+t.offsetWidth,bottom:t.offsetTop+t.offsetHeight};}var i=(window.pageXOffset||n.scrollLeft)-(n.clientLeft||0)||0,r=(window.pageYOffset||n.scrollTop)-(n.clientTop||0)||0,s=window.getComputedStyle?getComputedStyle(t):t.currentStyle,a=parseInt,o=a(s.paddingLeft)+a(s.borderLeftWidth)||0,u=a(s.paddingTop)+a(s.borderTopWidth)||0,c=a(s.paddingRight)+a(s.borderRightWidth)||0,h=a(s.paddingBottom)+a(s.borderBottomWidth)||0,f=e.top||0,l=e.left||0;return {left:l+i+o,top:f+r+u,width:(e.right||0)-c-l-o,height:(e.bottom||0)-h-f-u}}function b(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0;return Array.isArray(t)||(t=Object.values(t)),t.reduce(function(t,n,i){return t.then(function(){return e(n,i)})},Promise.resolve())}},function(t,e,n){var i=n(0),r=n(1).a.create({className:"Vector3",isVector3:!0,constructor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;this.elements=i.vec3.fromValues(t,e,n);},copy:function(t){return i.vec3.copy(this.elements,t.elements),this},clone:function(){var t=this.elements;return new this.constructor(t[0],t[1],t[2])},toArray:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;return t[0+e]=n[0],t[1+e]=n[1],t[2+e]=n[2],t},fromArray:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;return n[0]=t[e+0],n[1]=t[e+1],n[2]=t[e+2],this},set:function(t,e,n){return i.vec3.set(this.elements,t,e,n),this},add:function(t,e){return e||(e=t,t=this),i.vec3.add(this.elements,t.elements,e.elements),this},subtract:function(t,e){return e||(e=t,t=this),i.vec3.subtract(this.elements,t.elements,e.elements),this},multiply:function(t,e){return e||(e=t,t=this),i.vec3.multiply(this.elements,t.elements,e.elements),this},divide:function(t,e){return e||(e=t,t=this),i.vec3.divide(this.elements,t.elements,e.elements),this},ceil:function(){return i.vec3.ceil(this.elements,this.elements),this},floor:function(){return i.vec3.floor(this.elements,this.elements),this},min:function(t,e){return e||(e=t,t=this),i.vec3.min(this.elements,t.elements,e.elements),this},max:function(t,e){return e||(e=t,t=this),i.vec3.max(this.elements,t.elements,e.elements),this},round:function(){return i.vec3.round(this.elements,this.elements),this},scale:function(t){return i.vec3.scale(this.elements,this.elements,t),this},scaleAndAdd:function(t,e,n){return n||(n=e,e=this),i.vec3.scaleAndAdd(this.elements,e.elements,n.elements,t),this},distance:function(t,e){return e||(e=t,t=this),i.vec3.distance(t.elements,e.elements)},squaredDistance:function(t,e){return e||(e=t,t=this),i.vec3.squaredDistance(t.elements,e.elements)},length:function(){return i.vec3.length(this.elements)},squaredLength:function(){return i.vec3.squaredLength(this.elements)},negate:function(){return i.vec3.negate(this.elements,this.elements),this},inverse:function(t){return t||(t=this),i.vec3.inverse(this.elements,t.elements),this},normalize:function(){return i.vec3.normalize(this.elements,this.elements),this},dot:function(t,e){return e||(e=t,t=this),i.vec3.dot(t.elements,e.elements)},cross:function(t,e){return e||(e=t,t=this),i.vec3.cross(this.elements,t.elements,e.elements),this},lerp:function(t,e){return i.vec3.lerp(this.elements,this.elements,t.elements,e),this},hermite:function(t,e,n,r,s){return i.vec3.hermite(this.elements,t.elements,e.elements,n.elements,r.elements,s),this},bezier:function(t,e,n,r,s){return i.vec3.bezier(this.elements,t.elements,e.elements,n.elements,r.elements,s),this},random:function(t){return i.vec3.random(this.elements,t),this},transformMat3:function(t){return i.vec3.transformMat3(this.elements,this.elements,t.elements),this},transformMat4:function(t){return i.vec3.transformMat4(this.elements,this.elements,t.elements),this},transformDirection:function(t){var e=this.elements,n=t.elements,i=e[0],r=e[1],s=e[2];return e[0]=i*n[0]+r*n[4]+s*n[8],e[1]=i*n[1]+r*n[5]+s*n[9],e[2]=i*n[2]+r*n[6]+s*n[10],this},transformQuat:function(t){return i.vec3.transformQuat(this.elements,this.elements,t.elements),this},rotateX:function(t,e){return i.vec3.rotateX(this.elements,this.elements,t.elements,e),this},rotateY:function(t,e){return i.vec3.rotateY(this.elements,this.elements,t.elements,e),this},rotateZ:function(t,e){return i.vec3.rotateZ(this.elements,this.elements,t.elements,e),this},exactEquals:function(t,e){return e||(e=t,t=this),i.vec3.exactEquals(t.elements,e.elements)},equals:function(t,e){return e||(e=t,t=this),i.vec3.equals(t.elements,e.elements)},x:{get:function(){return this.elements[0]},set:function(t){this.elements[0]=t;}},y:{get:function(){return this.elements[1]},set:function(t){this.elements[1]=t;}},z:{get:function(){return this.elements[2]},set:function(t){this.elements[2]=t;}}});r.prototype.sub=r.prototype.subtract,r.prototype.mul=r.prototype.multiply,r.prototype.div=r.prototype.divide,r.prototype.dist=r.prototype.distance,r.prototype.sqrDist=r.prototype.squaredDistance,r.prototype.len=r.prototype.length,r.prototype.sqrLen=r.prototype.squaredLength,e.a=r;},function(t,e,n){var i,r={DEG2RAD:Math.PI/180,RAD2DEG:180/Math.PI,generateUUID:(i=0,function(t){var e=++i;return t?e=t+"_"+e:e+="",e}),clamp:function(t,e,n){return Math.max(e,Math.min(n,t))},degToRad:function(t){return t*this.DEG2RAD},radToDeg:function(t){return t*this.RAD2DEG},isPowerOfTwo:function(t){return 0==(t&t-1)&&0!==t},nearestPowerOfTwo:function(t){return Math.pow(2,Math.round(Math.log(t)/Math.LN2))},nextPowerOfTwo:function(t){return t--,t|=t>>1,t|=t>>2,t|=t>>4,t|=t>>8,t|=t>>16,++t}};e.a=r;},function(t,e,n){var i,r=n(0),s=n(1),a=n(5),o=n(10),u=new a.a,c=new a.a,h=s.a.create({className:"Matrix4",isMatrix4:!0,constructor:function(){this.elements=r.mat4.create();},copy:function(t){return r.mat4.copy(this.elements,t.elements),this},clone:function(){var t=new this.constructor;return r.mat4.copy(t.elements,this.elements),t},toArray:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements,i=0;i<16;i++)t[e+i]=n[i];return t},fromArray:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements,i=0;i<16;i++)n[i]=t[e+i];return this},set:function(t,e,n,i,s,a,o,u,c,h,f,l,d,m,_,p){return r.mat4.set(this.elements,t,e,n,i,s,a,o,u,c,h,f,l,d,m,_,p),this},identity:function(){return r.mat4.identity(this.elements),this},transpose:function(){return r.mat4.transpose(this.elements,this.elements),this},invert:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;return r.mat4.invert(this.elements,t.elements),this},adjoint:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;return r.mat4.adjoint(this.elements,t.elements),this},determinant:function(){return r.mat4.determinant(this.elements)},multiply:function(t,e){return e||(e=t,t=this),r.mat4.multiply(this.elements,t.elements,e.elements),this},premultiply:function(t){return this.multiply(t,this),this},translate:function(t){return r.mat4.translate(this.elements,this.elements,t.elements),this},scale:function(t){return r.mat4.scale(this.elements,this.elements,t.elements),this},rotate:function(t,e){return r.mat4.rotate(this.elements,this.elements,t,e.elements),this},rotateX:function(t){return r.mat4.rotateX(this.elements,this.elements,t),this},rotateY:function(t){return r.mat4.rotateY(this.elements,this.elements,t),this},rotateZ:function(t){return r.mat4.rotateZ(this.elements,this.elements,t),this},fromTranslation:function(t){return r.mat4.fromTranslation(this.elements,t.elements),this},fromScaling:function(t){return r.mat4.fromScaling(this.elements,t.elements),this},fromRotation:function(t,e){return r.mat4.fromRotation(this.elements,t,e.elements),this},fromXRotation:function(t){return r.mat4.fromXRotation(this.elements,t),this},fromYRotation:function(t){return r.mat4.fromYRotation(this.elements,t),this},fromZRotation:function(t){return r.mat4.fromZRotation(this.elements,t),this},fromRotationTranslation:function(t,e){return r.mat4.fromRotationTranslation(this.elements,t.elements,e.elements),this},getTranslation:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new a.a;return r.mat4.getTranslation(t.elements,this.elements),t},getScaling:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new a.a;return r.mat4.getScaling(t.elements,this.elements),t},getRotation:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o.a;return r.mat4.getRotation(t.elements,this.elements),t},fromRotationTranslationScale:function(t,e,n){return r.mat4.fromRotationTranslationScale(this.elements,t.elements,e.elements,n.elements),this},fromRotationTranslationScaleOrigin:function(t,e,n,i){return r.mat4.fromRotationTranslationScaleOrigin(this.elements,t.elements,e.elements,n.elements,i.elements),this},fromQuat:function(t){return r.mat4.fromQuat(this.elements,t.elements),this},frustum:function(t,e,n,i,s,a){return r.mat4.frustum(this.elements,t,e,n,i,s,a),this},perspective:function(t,e,n,i){return r.mat4.perspective(this.elements,t,e,n,i),this},perspectiveFromFieldOfView:function(t,e,n){return r.mat4.perspectiveFromFieldOfView(this.elements,t,e,n),this},ortho:function(t,e,n,i,s,a){return r.mat4.ortho(this.elements,t,e,n,i,s,a),this},lookAt:function(t,e,n){return t.isVector3||(t=u.set(t.x,t.y,t.z)),e.isVector3||(e=c.set(e.x,e.y,e.z)),r.mat4.lookAt(this.elements,t.elements,e.elements,n.elements),this},targetTo:function(t,e,n){t.isVector3||(t=u.set(t.x,t.y,t.z)),e.isVector3||(e=c.set(e.x,e.y,e.z)),t=t.elements,e=e.elements,n=n.elements;var i=this.elements,r=t[0],s=t[1],a=t[2],o=n[0],h=n[1],f=n[2],l=r-e[0],d=s-e[1],m=a-e[2],_=l*l+d*d+m*m;_>0?(l*=_=1/Math.sqrt(_),d*=_,m*=_):m=1;var p=h*m-f*d,g=f*l-o*m,v=o*d-h*l;return (_=p*p+g*g+v*v)>0?(p*=_=1/Math.sqrt(_),g*=_,v*=_):(_=(p=h*m-f*d)*p+(g=f*l-(o+=1e-7)*m)*g+(v=o*d-h*l)*v,p*=_=1/Math.sqrt(_),g*=_,v*=_),i[0]=p,i[1]=g,i[2]=v,i[3]=0,i[4]=d*v-m*g,i[5]=m*p-l*v,i[6]=l*g-d*p,i[7]=0,i[8]=l,i[9]=d,i[10]=m,i[11]=0,i[12]=r,i[13]=s,i[14]=a,i[15]=1,this},frob:function(){return r.mat4.frob(this.elements)},add:function(t,e){return e||(e=t,t=this),r.mat4.add(this.elements,t.elements,e.elements),this},subtract:function(t,e){return e||(e=t,t=this),r.mat4.subtract(this.elements,t.elements,e.elements),this},exactEquals:function(t,e){return e||(e=t,t=this),r.mat4.exactEquals(t.elements,e.elements)},equals:function(t,e){return e||(e=t,t=this),r.mat4.equals(t.elements,e.elements)},compose:function(t,e,n,i){return i?this.fromRotationTranslationScaleOrigin(t,e,n,i):this.fromRotationTranslationScale(t,e,n),this},decompose:function(t,e,n,r){return this.getScaling(n),this.getTranslation(e),i||(i=new h),this.determinant()<0&&(n.x*=-1),i.copy(this),u.inverse(n),i.scale(u),t.fromMat4(i),r&&r.set(0,0,0),this}});h.prototype.sub=h.prototype.subtract,h.prototype.mul=h.prototype.multiply,e.a=h;},function(t,e,n){var i=n(1),r=n(12),s=n(4),a=i.a.create({Extends:r.a,className:"Color",isColor:!0,r:{get:function(){return this.x},set:function(t){this.x=t;}},g:{get:function(){return this.y},set:function(t){this.y=t;}},b:{get:function(){return this.z},set:function(t){this.z=t;}},a:{get:function(){return this.w},set:function(t){this.w=t;}},constructor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;a.superclass.constructor.call(this,t,e,n,i);},toRGBArray:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t},fromUintArray:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.elements[0]=t[e]/255,this.elements[1]=t[e+1]/255,this.elements[2]=t[e+2]/255,this.elements[3]=t[e+3]/255,this},fromHEX:function(t){return "number"==typeof t?t=Object(s.padLeft)(t.toString(16),6):("#"===t[0]&&(t=t.slice(1)),3===t.length&&(t=t.replace(/(\w)/g,"$1$1"))),this.elements[0]=parseInt(t.slice(0,2),16)/255,this.elements[1]=parseInt(t.slice(2,4),16)/255,this.elements[2]=parseInt(t.slice(4,6),16)/255,this},toHEX:function(){for(var t="",e=0;e<3;e++)t+=Object(s.padLeft)(Math.floor(255*this.elements[e]).toString(16),2);return t}});e.a=a;},function(t,e,n){var i=n(37),r=n.n(i);e.a=r.a;},function(t,e,n){var i=n(0),r=n(11),s=n(1),a=n(9),o=new r.a,u=s.a.create({Mixes:a.a,className:"Quaternion",isQuaternion:!0,constructor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;this.elements=i.quat.fromValues(t,e,n,r);},copy:function(t,e){return i.quat.copy(this.elements,t.elements),e||this.fire("update"),this},clone:function(){var t=this.elements;return new this.constructor(t[0],t[1],t[2],t[3])},toArray:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t},fromArray:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2?arguments[2]:void 0,i=this.elements;return i[0]=t[e],i[1]=t[e+1],i[2]=t[e+2],i[3]=t[e+3],n||this.fire("update"),this},set:function(t,e,n,r,s){return i.quat.set(this.elements,t,e,n,r),s||this.fire("update"),this},identity:function(t){return i.quat.identity(this.elements),t||this.fire("update"),this},rotationTo:function(t,e,n){return i.quat.rotationTo(this.elements,t.elements,e.elements),n||this.fire("update"),this},setAxes:function(t,e,n,r){return i.quat.setAxes(this.elements,t.elements,e.elements,n.elements),r||this.fire("update"),this},setAxisAngle:function(t,e,n){return i.quat.setAxisAngle(this.elements,t.elements,e),n||this.fire("update"),this},getAxisAngle:function(t){return i.quat.getAxisAngle(t.elements,this.elements)},add:function(t,e){return i.quat.add(this.elements,this.elements,t.elements),e||this.fire("update"),this},multiply:function(t,e){return i.quat.multiply(this.elements,this.elements,t.elements),e||this.fire("update"),this},premultiply:function(t,e){return i.quat.multiply(this.elements,t.elements,this.elements),e||this.fire("update"),this},scale:function(t,e){return i.quat.scale(this.elements,this.elements,t),e||this.fire("update"),this},rotateX:function(t,e){return i.quat.rotateX(this.elements,this.elements,t),e||this.fire("update"),this},rotateY:function(t,e){return i.quat.rotateY(this.elements,this.elements,t),e||this.fire("update"),this},rotateZ:function(t,e){return i.quat.rotateZ(this.elements,this.elements,t),e||this.fire("update"),this},calculateW:function(t){return i.quat.calculateW(this.elements,this.elements),t||this.fire("update"),this},dot:function(t){return i.quat.dot(this.elements,t.elements)},lerp:function(t,e,n){return i.quat.lerp(this.elements,this.elements,t.elements,e),n||this.fire("update"),this},slerp:function(t,e,n){return i.quat.slerp(this.elements,this.elements,t.elements,e),n||this.fire("update"),this},sqlerp:function(t,e,n,r,s,a){return i.quat.sqlerp(this.elements,t.elements,e.elements,n.elements,r.elements,s),a||this.fire("update"),this},invert:function(t){return i.quat.invert(this.elements,this.elements),t||this.fire("update"),this},conjugate:function(t){return i.quat.conjugate(this.elements,this.elements),t||this.fire("update"),this},length:function(){return i.quat.length(this.elements)},squaredLength:function(){return i.quat.squaredLength(this.elements)},normalize:function(t){return i.quat.normalize(this.elements,this.elements),t||this.fire("update"),this},fromMat3:function(t,e){return i.quat.fromMat3(this.elements,t.elements),e||this.fire("update"),this},fromMat4:function(t,e){return o.fromMat4(t),this.fromMat3(o,e),this},exactEquals:function(t){return i.quat.exactEquals(this.elements,t.elements)},equals:function(t){return i.quat.equals(this.elements,t.elements)},fromEuler:function(t,e){var n=.5*t.x,i=.5*t.y,r=.5*t.z,s=t.order||"ZYX",a=Math.sin(n),o=Math.cos(n),u=Math.sin(i),c=Math.cos(i),h=Math.sin(r),f=Math.cos(r),l=this.elements;return "XYZ"===s?(l[0]=a*c*f+o*u*h,l[1]=o*u*f-a*c*h,l[2]=o*c*h+a*u*f,l[3]=o*c*f-a*u*h):"YXZ"===s?(l[0]=a*c*f+o*u*h,l[1]=o*u*f-a*c*h,l[2]=o*c*h-a*u*f,l[3]=o*c*f+a*u*h):"ZXY"===s?(l[0]=a*c*f-o*u*h,l[1]=o*u*f+a*c*h,l[2]=o*c*h+a*u*f,l[3]=o*c*f-a*u*h):"ZYX"===s?(l[0]=a*c*f-o*u*h,l[1]=o*u*f+a*c*h,l[2]=o*c*h-a*u*f,l[3]=o*c*f+a*u*h):"YZX"===s?(l[0]=a*c*f+o*u*h,l[1]=o*u*f+a*c*h,l[2]=o*c*h-a*u*f,l[3]=o*c*f-a*u*h):"XZY"===s&&(l[0]=a*c*f-o*u*h,l[1]=o*u*f-a*c*h,l[2]=o*c*h+a*u*f,l[3]=o*c*f+a*u*h),e||this.fire("update"),this},x:{get:function(){return this.elements[0]},set:function(t){this.elements[0]=t,this.fire("update");}},y:{get:function(){return this.elements[1]},set:function(t){this.elements[1]=t,this.fire("update");}},z:{get:function(){return this.elements[2]},set:function(t){this.elements[2]=t,this.fire("update");}},w:{get:function(){return this.elements[3]},set:function(t){this.elements[3]=t,this.fire("update");}}});u.prototype.mul=u.prototype.multiply,u.prototype.len=u.prototype.length,u.prototype.sqrLen=u.prototype.squaredLength,e.a=u;},function(t,e,n){var i=n(0),r=n(1).a.create({className:"Matrix3",isMatrix3:!0,constructor:function(){this.elements=i.mat3.create();},copy:function(t){return i.mat3.copy(this.elements,t.elements),this},clone:function(){var t=new this.constructor;return i.mat3.copy(t.elements,this.elements),t},toArray:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements,i=0;i<9;i++)t[e+i]=n[i];return t},fromArray:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements,i=0;i<9;i++)n[i]=t[e+i];return this},set:function(t,e,n,r,s,a,o,u,c){return i.mat3.set(this.elements,t,e,n,r,s,a,o,u,c),this},identity:function(){return i.mat3.identity(this.elements),this},transpose:function(){return i.mat3.transpose(this.elements,this.elements),this},invert:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;return i.mat3.invert(this.elements,t.elements),this},adjoint:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;return i.mat3.adjoint(this.elements,t.elements),this},determinant:function(){return i.mat3.determinant(this.elements)},multiply:function(t,e){return e||(e=t,t=this),i.mat3.multiply(this.elements,t.elements,e.elements),this},premultiply:function(t){return this.multiply(t,this),this},translate:function(t){return i.mat3.translate(this.elements,this.elements,t.elements),this},rotate:function(t){return i.mat3.rotate(this.elements,this.elements,t),this},scale:function(t){return i.mat3.scale(this.elements,this.elements,t.elements),this},fromTranslation:function(t){return i.mat3.fromTranslation(this.elements,t.elements),this},fromRotation:function(t){return i.mat3.fromRotation(this.elements,t),this},fromScaling:function(t){return i.mat3.fromScaling(this.elements,t.elements),this},fromQuat:function(t){return i.mat3.fromQuat(this.elements,t.elements),this},normalFromMat4:function(t){return i.mat3.normalFromMat4(this.elements,t.elements),this},fromMat4:function(t){return i.mat3.fromMat4(this.elements,t.elements),this},frob:function(){return i.mat3.frob(this.elements)},add:function(t,e){return e||(e=t,t=this),i.mat3.add(this.elements,t.elements,e.elements),this},subtract:function(t,e){return e||(e=t,t=this),i.mat3.subtract(this.elements,t.elements,e.elements),this},exactEquals:function(t,e){return e||(e=t,t=this),i.mat3.exactEquals(t.elements,e.elements)},equals:function(t,e){return e||(e=t,t=this),i.mat3.equals(t.elements,e.elements)},fromRotationTranslationScale:function(t,e,n,i,r){var s=Math.cos(t),a=Math.sin(t);return this.set(i*s,-r*a,0,i*a,r*s,0,e,n,1),this}});r.prototype.sub=r.prototype.subtract,r.prototype.mul=r.prototype.multiply,e.a=r;},function(t,e,n){var i=n(0),r=n(1).a.create({className:"Vector4",isVector4:!0,constructor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;this.elements=i.vec4.fromValues(t,e,n,r);},copy:function(t){return i.vec4.copy(this.elements,t.elements),this},clone:function(){var t=this.elements;return new this.constructor(t[0],t[1],t[2],t[3])},toArray:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;return t[0+e]=n[0],t[1+e]=n[1],t[2+e]=n[2],t[3+e]=n[3],t},fromArray:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;return n[0]=t[e+0],n[1]=t[e+1],n[2]=t[e+2],n[3]=t[e+3],this},set:function(t,e,n,r){return i.vec4.set(this.elements,t,e,n,r),this},add:function(t,e){return e||(e=t,t=this),i.vec4.add(this.elements,t.elements,e.elements),this},subtract:function(t,e){return e||(e=t,t=this),i.vec4.subtract(this.elements,t.elements,e.elements),this},multiply:function(t,e){return e||(e=t,t=this),i.vec4.multiply(this.elements,t.elements,e.elements),this},divide:function(t,e){return e||(e=t,t=this),i.vec4.divide(this.elements,t.elements,e.elements),this},ceil:function(){return i.vec4.ceil(this.elements,this.elements),this},floor:function(){return i.vec4.floor(this.elements,this.elements),this},min:function(t,e){return e||(e=t,t=this),i.vec4.min(this.elements,t.elements,e.elements),this},max:function(t,e){return e||(e=t,t=this),i.vec4.max(this.elements,t.elements,e.elements),this},round:function(){return i.vec4.round(this.elements,this.elements),this},scale:function(t){return i.vec4.scale(this.elements,this.elements,t),this},scaleAndAdd:function(t,e,n){return n||(n=e,e=this),i.vec4.scaleAndAdd(this.elements,e.elements,n.elements,t),this},distance:function(t,e){return e||(e=t,t=this),i.vec4.distance(t.elements,e.elements)},squaredDistance:function(t,e){return e||(e=t,t=this),i.vec4.squaredDistance(t.elements,e.elements)},length:function(){return i.vec4.length(this.elements)},squaredLength:function(){return i.vec4.squaredLength(this.elements)},negate:function(){return i.vec4.negate(this.elements,this.elements),this},inverse:function(t){return t||(t=this),i.vec4.inverse(this.elements,t.elements),this},normalize:function(){return i.vec4.normalize(this.elements,this.elements),this},dot:function(t,e){return e||(e=t,t=this),i.vec4.dot(t.elements,e.elements)},lerp:function(t,e){return i.vec4.lerp(this.elements,this.elements,t.elements,e),this},random:function(t){return t=t||1,this.elements[0]=Math.random(),this.elements[1]=Math.random(),this.elements[2]=Math.random(),this.elements[3]=Math.random(),this.normalize(),this.scale(t),this},transformMat4:function(t){return i.vec4.transformMat4(this.elements,this.elements,t.elements),this},transformQuat:function(t){return i.vec4.transformQuat(this.elements,this.elements,t.elements),this},exactEquals:function(t,e){return e||(e=t,t=this),i.vec4.exactEquals(t.elements,e.elements)},equals:function(t,e){return e||(e=t,t=this),i.vec4.equals(t.elements,e.elements)},x:{get:function(){return this.elements[0]},set:function(t){this.elements[0]=t;}},y:{get:function(){return this.elements[1]},set:function(t){this.elements[1]=t;}},z:{get:function(){return this.elements[2]},set:function(t){this.elements[2]=t;}},w:{get:function(){return this.elements[3]},set:function(t){this.elements[3]=t;}}});r.prototype.sub=r.prototype.subtract,r.prototype.mul=r.prototype.multiply,r.prototype.div=r.prototype.divide,r.prototype.dist=r.prototype.distance,r.prototype.sqrDist=r.prototype.squaredDistance,r.prototype.len=r.prototype.length,r.prototype.sqrLen=r.prototype.squaredLength,e.a=r;},function(t,e,n){var i=n(1),r=n(6),s=n(7),a=n(3),o=new s.a,u=r.a.DEG2RAD,c=r.a.RAD2DEG,h=i.a.create({className:"Euler",isEuler:!0,order:"ZYX",constructor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;this.elements=new Float32Array([t,e,n]),this.updateDegrees();},clone:function(){var t=new this.constructor;return t.copy(this),t},copy:function(t){return this.elements[0]=t.x,this.elements[1]=t.y,this.elements[2]=t.z,this.order=t.order,this.updateDegrees(),this},set:function(t,e,n){return this.elements[0]=t,this.elements[1]=e,this.elements[2]=n,this.updateDegrees(),this},setDegree:function(t,e,n){return this._degX=t,this._degY=e,this._degZ=n,this.updateRadians(),this},fromArray:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.elements[0]=t[e],this.elements[1]=t[e+1],this.elements[2]=t[e+2],this.updateDegrees(),this},toArray:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[e]=this.elements[0],t[e+1]=this.elements[1],t[e+2]=this.elements[2],t},fromMat4:function(t,e){var n=t.elements,i=n[0],s=n[1],o=n[2],u=n[4],c=n[5],h=n[6],f=n[8],l=n[9],d=n[10];e=e||this.order,this.order=e;var m=r.a.clamp;return "XYZ"===e?(this.elements[1]=Math.asin(m(f,-1,1)),Math.abs(f)<.99999?(this.elements[0]=Math.atan2(-l,d),this.elements[2]=Math.atan2(-u,i)):(this.elements[0]=Math.atan2(h,c),this.elements[2]=0)):"YXZ"===e?(this.elements[0]=Math.asin(-m(l,-1,1)),Math.abs(l)<.99999?(this.elements[1]=Math.atan2(f,d),this.elements[2]=Math.atan2(s,c)):(this.elements[1]=Math.atan2(-o,i),this.elements[2]=0)):"ZXY"===e?(this.elements[0]=Math.asin(m(h,-1,1)),Math.abs(h)<.99999?(this.elements[1]=Math.atan2(-o,d),this.elements[2]=Math.atan2(-u,c)):(this.elements[1]=0,this.elements[2]=Math.atan2(s,i))):"ZYX"===e?(this.elements[1]=Math.asin(-m(o,-1,1)),Math.abs(o)<.99999?(this.elements[0]=Math.atan2(h,d),this.elements[2]=Math.atan2(s,i)):(this.elements[0]=0,this.elements[2]=Math.atan2(-u,c))):"YZX"===e?(this.elements[2]=Math.asin(m(s,-1,1)),Math.abs(s)<.99999?(this.elements[0]=Math.atan2(-l,c),this.elements[1]=Math.atan2(-o,i)):(this.elements[0]=0,this.elements[1]=Math.atan2(f,d))):"XZY"===e?(this.elements[2]=Math.asin(-m(u,-1,1)),Math.abs(u)<.99999?(this.elements[0]=Math.atan2(h,c),this.elements[1]=Math.atan2(f,i)):(this.elements[0]=Math.atan2(-l,d),this.elements[1]=0)):a.a.warn("Euler fromMat4() unsupported order: "+e),this.updateDegrees(),this},fromQuat:function(t,e){return o.fromQuat(t),this.fromMat4(o,e)},updateDegrees:function(){return this._degX=this.elements[0]*c,this._degY=this.elements[1]*c,this._degZ=this.elements[2]*c,this},updateRadians:function(){return this.elements[0]=this._degX*u,this.elements[1]=this._degY*u,this.elements[2]=this._degZ*u,this},degX:{get:function(){return this._degX},set:function(t){this._degX=t,this.elements[0]=t*u;}},degY:{get:function(){return this._degY},set:function(t){this._degY=t,this.elements[1]=t*u;}},degZ:{get:function(){return this._degZ},set:function(t){this._degZ=t,this.elements[2]=t*u;}},x:{get:function(){return this.elements[0]},set:function(t){this.elements[0]=t,this._degX=t*c;}},y:{get:function(){return this.elements[1]},set:function(t){this.elements[1]=t,this._degY=t*c;}},z:{get:function(){return this.elements[2]},set:function(t){this.elements[2]=t,this._degZ=t*c;}}});e.a=h;},function(t,e,n){var i=n(0),r=n(1).a.create({className:"Vector2",isVector2:!0,constructor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this.elements=i.vec2.fromValues(t,e);},copy:function(t){return i.vec2.copy(this.elements,t.elements),this},clone:function(){var t=this.elements;return new this.constructor(t[0],t[1])},toArray:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;return t[0+e]=n[0],t[1+e]=n[1],t},fromArray:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;return n[0]=t[e+0],n[1]=t[e+1],this},set:function(t,e){return i.vec2.set(this.elements,t,e),this},add:function(t,e){return e||(e=t,t=this),i.vec2.add(this.elements,t.elements,e.elements),this},subtract:function(t,e){return e||(e=t,t=this),i.vec2.subtract(this.elements,t.elements,e.elements),this},multiply:function(t,e){return e||(e=t,t=this),i.vec2.multiply(this.elements,t.elements,e.elements),this},divide:function(t,e){return e||(e=t,t=this),i.vec2.divide(this.elements,t.elements,e.elements),this},ceil:function(){return i.vec2.ceil(this.elements,this.elements),this},floor:function(){return i.vec2.floor(this.elements,this.elements),this},min:function(t,e){return e||(e=t,t=this),i.vec2.min(this.elements,t.elements,e.elements),this},max:function(t,e){return e||(e=t,t=this),i.vec2.max(this.elements,t.elements,e.elements),this},round:function(){return i.vec2.round(this.elements,this.elements),this},scale:function(t){return i.vec2.scale(this.elements,this.elements,t),this},scaleAndAdd:function(t,e,n){return n||(n=e,e=this),i.vec2.scaleAndAdd(this.elements,e.elements,n.elements,t),this},distance:function(t,e){return e||(e=t,t=this),i.vec2.distance(t.elements,e.elements)},squaredDistance:function(t,e){return e||(e=t,t=this),i.vec2.squaredDistance(t.elements,e.elements)},length:function(){return i.vec2.length(this.elements)},squaredLength:function(){return i.vec2.squaredLength(this.elements)},negate:function(){return i.vec2.negate(this.elements,this.elements),this},inverse:function(t){return t||(t=this),i.vec2.inverse(this.elements,t.elements),this},normalize:function(){return i.vec2.normalize(this.elements,this.elements),this},dot:function(t,e){return e||(e=t,t=this),i.vec2.dot(t.elements,e.elements)},cross:function(t,e){return e||(e=t,t=this),i.vec2.cross(this.elements,t.elements,e.elements),this},lerp:function(t,e){return i.vec2.lerp(this.elements,this.elements,t.elements,e),this},random:function(t){return i.vec2.random(this.elements,t),this},transformMat3:function(t){return i.vec2.transformMat3(this.elements,this.elements,t.elements),this},transformMat4:function(t){return i.vec2.transformMat4(this.elements,this.elements,t.elements),this},exactEquals:function(t,e){return e||(e=t,t=this),i.vec2.exactEquals(t.elements,e.elements)},equals:function(t,e){return e||(e=t,t=this),i.vec2.equals(t.elements,e.elements)},x:{get:function(){return this.elements[0]},set:function(t){this.elements[0]=t;}},y:{get:function(){return this.elements[1]},set:function(t){this.elements[1]=t;}}});r.prototype.sub=r.prototype.subtract,r.prototype.mul=r.prototype.multiply,r.prototype.div=r.prototype.divide,r.prototype.dist=r.prototype.distance,r.prototype.sqrDist=r.prototype.squaredDistance,r.prototype.len=r.prototype.length,r.prototype.sqrLen=r.prototype.squaredLength,e.a=r;},function(t,e){t.exports=function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i});},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}function r(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}var s=n(1),a={POSITION:"POSITION",NORMAL:"NORMAL",COLOR:"COLOR",COLOR_0:"COLOR",COLOR_1:"COLOR_1",TEXCOORD:"TEXCOORD",TEXCOORD_0:"TEXCOORD",TEXCOORD_1:"TEXCOORD_1",TEXCOORD_2:"TEXCOORD_2",TANGENT:"TANGENT",JOINT:"JOINT",JOINTS_0:"JOINT",WEIGHT:"WEIGHT",WEIGHTS_0:"WEIGHT"},o=["POSITION","NORMAL","COLOR","TEXCOORD","TANGENT","JOINT","WEIGHT","OTHER","TEXCOORD_1","TEXCOORD_2","COLOR_1"],u={POSITION:0,NORMAL:1,COLOR:2,TEXCOORD:3,TANGENT:4,JOINT:5,WEIGHT:6,OTHER:7,TEXCOORD_1:8,TEXCOORD_2:9,COLOR_1:10},c={POSITION:"vertices",NORMAL:"normals",COLOR:"colors",TEXCOORD:"uvs",TEXCOORD_1:"uvs1",TEXCOORD_2:"uvs2",TANGENT:"tangents",JOINT:"skinIndices",WEIGHT:"skinWeights"},h={vertices:"POSITION",_normals:"NORMAL",colors:"COLOR",uvs:"TEXCOORD",uvs1:"TEXCOORD_1",uvs2:"TEXCOORD_2",_tangents:"TANGENT",skinIndices:"JOINT",skinWeights:"WEIGHT"},f={POSITION:3,NORMAL:3,COLOR:3,COLOR_1:3,TEXCOORD:2,TEXCOORD_1:2,TEXCOORD_2:2,TANGENT:4,JOINT:4,WEIGHT:4},l=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:4;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.indices=e,this.mode=n,this.attrs=[],this.attrIndexMap={};}return r(t,null,[{key:"cp",value:function(t){return t}},{key:"minus",value:function(t,e){return t-e}},{key:"plus",value:function(t,e){return t+e}},{key:"pp",value:function(t,e,n,i){return i-e-n+t}},{key:"depp",value:function(t,e,n,i){return e+n-t+i}},{key:"ATTR",get:function(){return a}},{key:"ATTR_NAME_ID",get:function(){return u}}]),r(t,[{key:"getAttrLength",value:function(){return this.attrs[0].data.length/this.attrs[0].itemCount}},{key:"attrIdToName",value:function(t){return o[t]||"OTHER"}},{key:"addAttr",value:function(t,e,n){a[t]?(this.attrIndexMap[t]=this.attrs.length,n||(n=f[t])):n||(n=1),this.attrs.push({name:t,itemCount:n,data:e});}},{key:"getAttr",value:function(t){if(this.attrIndexMap[t])return this.attrs[this.attrIndexMap[t]];for(var e=this.attrs.length-1;e>=0;e--){var n=this.attrs[e];if(n.name===t)return n}}},{key:"cal",value:function(t,e,n){for(var i=arguments.length,r=new Array(i>3?i-3:0),s=3;s<i;s++)r[s-3]=arguments[s];this.attrs.forEach(function(i,s){for(var a=i.data,o=t.attrs[s].data,u=e*i.itemCount,c=i.itemCount-1;c>=0;c--)o[u+c]=n.apply(null,r.map(function(t){return a[t*i.itemCount+c]}));});}},{key:"quantize",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.attrs.forEach(function(e){if("JOINT"!==e.name&&0!=t[e.name]){var n=s.encode(e.data,t[e.name]||12);e.quantizationBit=n.quantizationBit,e.min=n.min,e.max=n.max,e.data=n.data;}});}},{key:"dequantize",value:function(){this.attrs.forEach(function(t){t.quantizationBit&&(t.data=s.decode(t.data,t.quantizationBit,t.min,t.max));});}},{key:"convertTypedArray",value:function(){!this.indices||this.indices instanceof Array||(this.indices=Array.from(this.indices)),this.attrs.forEach(function(t){t.data instanceof Array||t.data instanceof Float32Array||(t.data=Array.from(t.data));});}},{key:"clearEBAttrs",value:function(){delete this.clers,delete this.holes,delete this.handles;}},{key:"convertToTypedArray",value:function(){this.indices instanceof Array&&(this.getAttrLength()>65535?this.indices=new Uint32Array(this.indices):this.indices=new Uint16Array(this.indices)),this.attrs.forEach(function(t){t.data instanceof Array&&(t.data=new Float32Array(t.data));});}},{key:"prepareToWorkerSend",value:function(){return this.clearEBAttrs(),this.convertToTypedArray(),this.getAllBuffers()}},{key:"clone",value:function(){var e=new t(Array.from(this.indices),this.mode);return Object.assign(e.attrIndexMap,this.attrIndexMap),e.attrs=this.attrs.map(function(t){var e=Object.assign({},t);return e.data=Array.from(e.data),e}),e}},{key:"cloneStruct",value:function(){var e=new t;return e.mode=this.mode,this.indices&&(e.indices=[]),Object.assign(e.attrIndexMap,this.attrIndexMap),e.attrs=this.attrs.map(function(t){var e=Object.assign({},t);return e.data=[],e}),e}},{key:"toHilo3dGeometry",value:function(t,e){var n=e||new t.Geometry;return this.indices&&(this.indices.BYTES_PER_ELEMENT?n.indices=new t.GeometryData(this.indices,1):this.getAttrLength()>65535?n.indices=new t.GeometryData(new Uint32Array(this.indices),1):n.indices=new t.GeometryData(new Uint16Array(this.indices),1)),this.attrs.forEach(function(e){var i=c[e.name];i&&(e.data.BYTES_PER_ELEMENT?n[i]=new t.GeometryData(e.data,e.itemCount):n[i]=new t.GeometryData(new Float32Array(e.data),e.itemCount));}),n}},{key:"getAllBuffers",value:function(){var t=[];return this.indices.BYTES_PER_ELEMENT&&t.push(this.indices.buffer),this.attrs.forEach(function(e){e.data&&e.data.BYTES_PER_ELEMENT&&t.push(e.data.buffer);}),t}}],[{key:"fromGLTFPrimitive",value:function(e){var n=new t(e.indices,e.mode),i=e.attributes,r=0;for(var s in i.POSITION&&(r=i.POSITION.length/3),i)if(a[s]){var o=f[a[s]];r&&(o=i[s].length/r),n.addAttr(a[s],i[s],o);}else console.warn("Dont support attribute",s);return n}},{key:"fromHilo3dGeometry",value:function(e){var n=new t(e.indices.data,e.mode);for(var i in h)e[i]&&n.addAttr(h[i],e[i].data,e[i].size);return n}}]),t}();t.exports=l;},function(t,e){var n={};function i(t){return n[t]||(n[t]=Math.pow(2,t)-1),n[t]}t.exports={cal:function(t,e,n,r){var s=i(r),a=n-e;return Math.round((t-e)/a*s)},encode:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8,n=t.length,r=i(e),s=1/0,a=-1/0,o=0;o<n;o++)s=Math.min(s,t[o]),a=Math.max(a,t[o]);var u=a-s||1,c=[];for(o=0;o<n;o++)c[o]=Math.round((t[o]-s)/u*r);return {min:s,max:a,quantizationBit:e,data:c}},encodeWithMinAndMax:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:8,a=t.length,o=i(s),u=r-n||1,c=0;c<a;c++)e[c]=Math.round((t[c]-n)/u*o);return e},decode:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8,n=arguments.length>2?arguments[2]:void 0,r=arguments.length>3?arguments[3]:void 0,s=t.length,a=i(e),o=r-n,u=new Float32Array(s),c=0;c<s;c++)u[c]=n+o*(t[c]/a);return u},normalize:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3,i=t.length,r=0;r<i;r+=n){for(var s=0,a=0;a<n;a++)s+=t[r+a]*t[r+a];for(s=Math.sqrt(s),a=0;a<n;a++)e[r+a]=t[r+a]/s;}return e}};},function(t,e,n){t.exports=n(3);},function(t,e,n){var i=n(4);i.Geometry=n(0),t.exports=i;},function(t,e,n){var i=n(0),r=n(5),s=n(7),a=n(8),o=n(9),u=[r],c=[s];function h(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t instanceof Uint8Array&&(e=t.byteOffset,t=t.buffer),function(t){return new u[t.type](t).decompress()}(function(t,e){var n=new Uint8Array(t,e,4);if(65!==n[0]||77!==n[1]||67!==n[2])throw new Error("The file is not AMC format!");var i=c[n[3]].read(t,e+4);return i.geometry.type=n[3],i.geometry}(t,e))}var f,l=null,d=null;function m(t,e){return !l&&o()?(l=new a({wasmURL:t,memPages:e}),d=l.init()):d||Promise.resolve()}function _(t,e,n){if(l||m(e,n),!l||!l.isReady)return h(t);try{return l.decompress(t)}catch(e){return console.warn("wasm decompress error",e),h(t)}}var p=null;function g(t){return t=t||"https://g.alicdn.com/hilo/amc/0.1.26/worker.js",p||(!1===f||"undefined"==typeof Worker?Promise.reject("dont support web worker"):p=/^(?:http|blob|data:|\/\/)/.test(t)?new Promise(function(e,n){var i=new XMLHttpRequest;i.addEventListener("load",function(){if("undefined"==typeof URL||"undefined"==typeof Blob)f=new Worker("data:application/javascript, ".concat(this.responseText));else{var t=URL.createObjectURL(new Blob([this.responseText]));f=new Worker(t);}f.onerror=function(t){console.log("web worker error",t),f=!1,n(t);},e(f);}),i.addEventListener("error",function(t){return n(t)}),i.open("get",t,!0),i.send();}):new Promise(function(e,n){(f=new Worker(t)).onerror=function(t){console.log("web worker init error",t),f=!1,n(t);},e(f);}))}var v=0;function E(t,e,n,r){return e=e&&o(),t=new Uint8Array(t),g(r).then(function(r){return new Promise(function(s,a){var o=v++,u=function(e){if(e.data.id===o)if(r.removeEventListener("message",u),u=null,e.data.data){var n=e.data.data;n.constructor=i,n.__proto__=i.prototype,s(n);}else s(h(t));};r.addEventListener("message",u),r.postMessage({id:o,data:t,useWASM:e,wasmURL:n},[t.buffer]);})}).catch(function(i){return e?_(t,n):h(t)})}t.exports={initWASM:m,initWorker:g,decompress:function(t,e,n){var i=o();return !i||t.byteLength>1048576?E(t,i,e,n):i?Promise.resolve(_(t,e)):Promise.resolve(h(t))},decompressWithJS:h,decompressWithWASM:_,decompressWithWorker:E};},function(t,e,n){function i(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function r(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}var a=n(0),o=(n(1),n(6)),u=o.map,c=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.geometry=e,this.faceCount=e.clers.length,this.clers=e.clers,this.holes=e.holes,this.handles=e.handles,this.createHandleMap(this.handles),this.vertexCount=e.getAttrLength(),this.noParallelogramPrediction=!!e.noParallelogramPrediction;}var e,n;return e=t,(n=[{key:"nextCorner",value:function(t){return t<0?-1:t+(t%3==2?-2:1)}},{key:"prevCorner",value:function(t){return t<0?-1:t+(t%3?-1:2)}},{key:"createHandleMap",value:function(t){var e=this.handlesMap={};if(t)for(var n=t.length-1;n>=0;n-=2)e[t[n]]=t[n-1];}},{key:"mapBoundary",value:function(t){for(var e=this.indices,n=t.length,i=this.currentVertex,r=this.currentVertex-n+1,s=n-1;s>=0;s--)e[this.nextCorner(t[s])]=i,i=r,e[this.prevCorner(t[s])]=r++;this.currentVertex-=n;}},{key:"mapHoleBoundary",value:function(t){for(var e=this.indices,n=t.length,i=this.currentVertex-n+1,r=i,s=n-1;s>=0;s--)e[this.nextCorner(t[s])]=i++,e[this.prevCorner(t[s])]=s?i:r;this.currentVertex-=n;}},{key:"fixNegativeIndex",value:function(t){for(var e=t,n=this.indices;n[t]<0;){if(e===-n[-n[t]]||n[t]===n[-n[t]]){console.warn("dead loop bug!!"),n[s]=0;break}n[t]=n[-n[t]];}}},{key:"fixIndicesAndReadVertice",value:function(){for(var t,e=this.indices,n=this.handlesMap,i=this.clers,r=i.length,s=-1,a=[],u=0,c=0;u<r;u++,c+=3)-1===s?(this.fixNegativeIndex(c+1),this.fixNegativeIndex(c+2)):(e[c+1]=e[this.prevCorner(s)],e[c+2]=e[this.nextCorner(s)]),this.fixNegativeIndex(c),-1===s?(this.readVertex(e[c+2]),this.readVertex(e[c+1]),this.readVertex(e[c])):this.readVertex(e[c],s),s=c+1,(t=i[u])!==o.S||n[u]?t===o.E||t===o.F?s=a.pop():t===o.R&&(s=c+2):a.push(c+2),t===o.F&&(s=-1,delete this.lastReadVertexIndex),this._onDecompressFace(u,t);}},{key:"readVertex",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;if(!this.readedVertexMap[t]&&(this.readedVertexMap[t]=1,!this.noParallelogramPrediction)){var n=this.indices,i=this.geometry;-1===e?void 0!==this.lastReadVertexIndex&&i.cal(i,t,a.plus,this.lastReadVertexIndex,t):i.cal(i,t,a.depp,n[e],n[this.prevCorner(e)],n[this.nextCorner(e)],t),this.lastReadVertexIndex=t;}}},{key:"markCorner",value:function(t,e){var n=this.indices;void 0===n[this.nextCorner(t)]&&(n[this.nextCorner(t)]=-this.prevCorner(e[0])),void 0===n[this.prevCorner(t)]&&(n[this.prevCorner(t)]=-this.nextCorner(e[e.length-1]));}},{key:"onFaceC",value:function(t){var e=this.indices,n=3*this.currentFace,i=this.currentVertex--;e[n]=i;var r=t.pop();return e[this.nextCorner(r)]=i,e[this.prevCorner(r)]=-this.nextCorner(t[t.length-1]),r=t.shift(),e[this.prevCorner(r)]=i,e[this.nextCorner(r)]=-this.prevCorner(t[0]),t.push(n),t}},{key:"onFaceL",value:function(t){var e=3*this.currentFace;return this.markCorner(t.pop(),t),t.unshift(e+2),t.push(e),t}},{key:"onFaceF",value:function(t,e){return t&&this.mapBoundary(t),this.onFaceE(null,e)}},{key:"onFaceE",value:function(t,e){var n=3*this.currentFace;return t&&e.push(t),[n+2,n+1,n]}},{key:"onFaceR",value:function(t){var e=3*this.currentFace;return this.markCorner(t.pop(),t),t.push(e+1,e),t}},{key:"onHandleEnd",value:function(t,e,n){var i=this.indices,r=3*this.currentFace,s=this.handlesMap[this.currentFace],a=e.splice(0,t);return e.shift(),n.push(a),i[this.nextCorner(s)]=-(r+1),i[this.prevCorner(s)]=-this.nextCorner(a[a.length-1]),i[r]=-this.prevCorner(a[0]),e.push(r),e}},{key:"onHandleStart",value:function(t,e){for(var n,r=this.indices,s=3*this.currentFace,a=this.handlesMap[this.currentFace],o=e.length-1;o>=0;o--){var u=e[o].indexOf(a);if(u>=0){var c,h=(n=e.splice(o,1)[0]).splice(0,u);n.shift(),(c=n).push.apply(c,i(h));break}}return r[this.nextCorner(a)]=-(s+1),r[this.prevCorner(a)]=-this.nextCorner(n[n.length-1]),r[s]=-this.prevCorner(t[0]),(t=n.concat(t)).push(s),t}},{key:"onFaceS",value:function(t,e,n){var i=this.handlesMap,r=this.indices,s=3*this.currentFace;if(i[this.currentFace]){this.markCorner(t.pop(),t);var a=t.indexOf(i[this.currentFace]);t=a>=0?this.onHandleEnd(a,t,n):this.onHandleStart(t,n);}else{var o=t.pop();this.markCorner(o,t),r[s]=-this.nextCorner(o);var u=e.pop();this.markCorner(u.pop(),u),(t=u.concat(t)).push(s);}return t}},{key:"onFaceM",value:function(t,e,n){var i=this.indices,r=3*this.currentFace,s=t.splice(0,this.holes[this.currentHole--]);this.mapHoleBoundary(s);var a=i[this.prevCorner(s[0])];i[r]=a;var o=t.pop();return i[this.prevCorner(o)]=-this.nextCorner(t[t.length-1]),i[this.nextCorner(o)]=a,o=t.shift(),i[this.prevCorner(o)]=a,i[this.nextCorner(o)]=-this.prevCorner(t[0]),t.push(r),t}},{key:"decompress",value:function(){this.readedVertexMap=new Uint8Array(this.vertexCount);var t=this.faceCount,e=this.indices=new Array(3*t);this.currentFace=t-1,this.currentVertex=this.vertexCount-1,this.currentHole=this.holes.length-1;for(var n,i=this.clers,r=[],s=[];this.currentFace>=0;){var a="onFace"+u[i[this.currentFace]];this[a]?n=this[a](n,r,s):console.warn("has no ".concat(a)),this.currentFace--;}return this.mapBoundary(n),this.fixIndicesAndReadVertice(this.indices),this.geometry.indices=e,this.geometry.dequantize(),this.geometry}},{key:"_onDecompressFace",value:function(t,e){this.onDecompressFace&&this.onDecompressFace(t,e);}}])&&r(e.prototype,n),t}();t.exports=c;},function(t,e){var n={C:0,R:1,L:2,S:3,E:4,M:5,F:6},i=[];for(var r in n)i[n[r]]=r;n.map=i,t.exports=n;},function(t,e,n){var i=n(0);function r(t,e,n,i){return new t(e.slice(n,n+i*t.BYTES_PER_ELEMENT))}t.exports={read:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=new DataView(t),s=new i,a=function(t,e){var n={};return n.version=t.getUint8(e++),n.faceCount=t.getUint32(e,!0),e+=4,n.vertexCount=t.getUint32(e,!0),e+=4,n.attrCount=t.getUint8(e++),n.noParallelogramPrediction=t.getUint8(e++),n.holesCount=t.getUint16(e,!0),e+=2,n.handlesCount=t.getUint16(e,!0),e+=2,n.headerBytes=15,n}(n,e);return e+=a.headerBytes,s.mode="CLERS",e=function(t,e,n,i){return s.clers=new Uint8Array(e.buffer,n,i.faceCount),n+i.faceCount}(0,n,e=function(t,e,n,i){return i.handlesCount?(t.handles=r(Uint32Array,e.buffer,n,2*i.handlesCount),n+8*i.handlesCount):(t.handles=[],n)}(s,n,e=function(t,e,n,i){return i.holesCount?(t.holes=r(Uint16Array,e.buffer,n,i.holesCount),n+2*i.holesCount):(t.holes=[],n)}(s,n,e,a),a),a),e=function(t,e,n,i){for(var s=0;s<i.attrCount;s++){var a={},o=e.getUint16(n,!0);n+=2,a.name=t.attrIdToName(o),a.itemCount=e.getUint8(n++),a.quantizationBit=e.getUint8(n++),a.min=e.getFloat32(n,!0),n+=4,a.max=e.getFloat32(n,!0),n+=4,a.data=r(Int16Array,e.buffer,n,a.itemCount*i.vertexCount),n+=a.itemCount*i.vertexCount*2,t.attrs.push(a);}return n}(s,n,e,a),{header:a,geometry:s,offset:e}}};},function(t,e,n){function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}var r=n(0),s=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.wasmURL=e.wasmURL||"https://ossgw.alicdn.com/tmall-c3/tmx/70b8d82ccf33e97a124e54c2d6a3e0c7.wasm",this.memPages=e.memPages||256,this.memPages<256&&(this.memPages=256),this.isReady=!1;}var e,n;return e=t,(n=[{key:"initASMJS",value:function(){this.isReady=!0,this.dv=new DataView(HEAP8.buffer),this.heap8=HEAP8,this.ins={exports:{__Z7AMCinitj:Module.__Z7AMCinitj,__Z12AMDecompressv:Module.__Z12AMDecompressv}};}},{key:"init",value:function(){var t=this,e=this.memory=new WebAssembly.Memory({initial:this.memPages});this.dv=new DataView(e.buffer);var n=this.heap8=new Uint8Array(e.buffer),i={global:{NaN:5,Infinity:6},env:{memoryBase:0,memory:e,_malloc:function(){return 2097152},_memset:function(t,e,i){return n.fill(e,t,t+i),t},_printf:function(t,e){for(var i=t;n[i];)i++;var r=String.fromCharCode.apply(String,function(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}(n.slice(t,i))),s=0;r=r.replace(/%([duf])/g,function(t,n){return "d"===n||"u"===n?dv.getInt32(e+4*s++,!0):"f"===n?dv.getFloat32(e+4*s++,!0):void 0}),console.log(r);}}};return fetch(this.wasmURL).then(function(t){return t.arrayBuffer()}).then(function(t){return WebAssembly.instantiate(t,i)}).then(function(e){t.module=e,t.ins=e.instance,t.isReady=!0;}).catch(function(t){return console.log("wasm load error, use js ver")})}},{key:"getDataAddr",value:function(t){return this.ins.exports.__Z7AMCinitj(t)}},{key:"decompress",value:function(t){t instanceof ArrayBuffer&&(t=new Uint8Array(t));var e=this.dv,n=this.heap8,i=this.getDataAddr(t.length);n.set(t,i);var s=this.ins.exports.__Z12AMDecompressv();if(s<=0)throw console.error("decompression error code: "+s),new Error("decompression error code: "+s);for(var a=e.getUint32(s,!0),o=e.getUint32(s+4,!0),u=e.getUint32(s+8,!0),c=e.getUint32(s+12,!0),h=[],f=0;f<c;f++){var l=s+16+12*f;h.push([e.getUint32(l,!0),e.getUint32(l+4,!0),e.getUint32(l+8,!0)]);}var d=new Uint32Array(e.buffer,o,3*a);d=u>65536?new Uint32Array(d):new Uint16Array(d);var m=new r(d);return h.forEach(function(t){var n=function(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],i=!0,r=!1,s=void 0;try{for(var a,o=t[Symbol.iterator]();!(i=(a=o.next()).done)&&(n.push(a.value),!e||n.length!==e);i=!0);}catch(t){r=!0,s=t;}finally{try{i||null==o.return||o.return();}finally{if(r)throw s}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(t,3),i=n[0],r=n[1],s=n[2],a=new Float32Array(e.buffer.slice(s,s+u*r*4));m.addAttr(m.attrIdToName(i),a,r);}),m}}])&&i(e.prototype,n),t}();t.exports=s;},function(t,e){var n;t.exports=function(){return void 0===n&&(n=function(){if("undefined"==typeof WebAssembly||"undefined"==typeof fetch||function(){if(!/iPad|iPhone|iPod/i.test(navigator.userAgent))return !1;if(/OS (\d+)_(\d+)_?(\d+)?/i.test(navigator.userAgent)){var t=Number(RegExp.$1),e=Number(RegExp.$2);if(11===t&&e>=3||t>11)return !1}return !0}())return !1;try{var t=new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,1,127,1,127,3,2,1,0,5,3,1,0,1,7,8,1,4,116,101,115,116,0,0,10,16,1,14,0,32,0,65,1,54,2,0,32,0,40,2,0,11]),e=new WebAssembly.Module(t);return 0!==new WebAssembly.Instance(e,{}).exports.test(4)}catch(t){return console.log("err while check WebAssembly",t),!1}}()),n};}]);},function(t,e,n){var i=n(38),r=n.n(i),s=n(1),a=n(5),o=s.a.create({className:"Ray",isRay:!0,origin:{get:function(){return this._origin},set:function(t){this._origin=t,this._ray.origin=t.elements;}},direction:{get:function(){return this._direction},set:function(t){this._direction=t,this._ray.direction=t.elements;}},constructor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this._ray=new r.a,this.origin=t.origin||new a.a(0,0,0),this.direction=t.direction||new a.a(0,0,-1);},set:function(t,e){return this.origin=t,this.direction=e,this},copy:function(t){this.origin.copy(t.origin),this.direction.copy(t.direction);},clone:function(){return new this.constructor({origin:this.origin.clone(),direction:this.direction.clone()})},fromCamera:function(t,e,n,i,r){t.isPerspectiveCamera?(t.worldMatrix.getTranslation(this.origin),this.direction.set(e,n,0),this.direction.copy(t.unprojectVector(this.direction,i,r)),this.direction.sub(this.origin).normalize()):t.isOrthographicCamera&&(this.origin.set(e,n,(t.near+t.far)/(t.near-t.far)),this.origin.copy(t.unprojectVector(this.origin,i,r)),this.direction.set(0,0,-1).transformDirection(t.worldMatrix).normalize());},transformMat4:function(t){this.origin.transformMat4(t),this.direction.transformDirection(t).normalize();},sortPoints:function(t,e){var n=this;e?t.sort(function(t,i){return n.squaredDistance(t[e])-n.squaredDistance(i[e])}):t.sort(function(t,e){return n.squaredDistance(t)-n.squaredDistance(e)});},squaredDistance:function(t){return this.origin.squaredDistance(t)},distance:function(t){return this.origin.distance(t)},intersectsSphere:function(t,e){var n=this._ray.intersectsSphere(t,e);return this._getRes(n)},intersectsPlane:function(t,e){var n=this._ray.intersectsPlane(t,e);return this._getRes(n)},intersectsTriangle:function(t){var e=this._ray.intersectsTriangle(t);return this._getRes(e)},intersectsBox:function(t){var e=this._ray.intersectsBox(t);return this._getRes(e)},intersectsTriangleCell:function(t,e){var n=this._ray.intersectsTriangleCell(t,e);return this._getRes(n)},_getRes:function(t){return t?new a.a(t[0],t[1],t[2]):null}});e.a=o;},function(t,e,n){var i=n(0),r=n(1),s=n(9),a=n(5),o=r.a.create({Mixes:s.a,Extends:a.a,className:"Vector3Notifier",isVector3Notifier:!0,constructor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;this.elements=i.vec3.fromValues(t,e,n);},copy:function(t){return i.vec3.copy(this.elements,t.elements),this.fire("update"),this},clone:function(){var t=this.elements;return new this.constructor(t[0],t[1],t[2])},toArray:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;return t[0+e]=n[0],t[1+e]=n[1],t[2+e]=n[2],t},fromArray:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;return n[0]=t[e+0],n[1]=t[e+1],n[2]=t[e+2],this.fire("update"),this},set:function(t,e,n){return i.vec3.set(this.elements,t,e,n),this.fire("update"),this},add:function(t,e){return e||(e=t,t=this),i.vec3.add(this.elements,t.elements,e.elements),this.fire("update"),this},subtract:function(t,e){return e||(e=t,t=this),i.vec3.subtract(this.elements,t.elements,e.elements),this.fire("update"),this},multiply:function(t,e){return e||(e=t,t=this),i.vec3.multiply(this.elements,t.elements,e.elements),this.fire("update"),this},divide:function(t,e){return e||(e=t,t=this),i.vec3.divide(this.elements,t.elements,e.elements),this.fire("update"),this},ceil:function(){return i.vec3.ceil(this.elements,this.elements),this.fire("update"),this},floor:function(){return i.vec3.floor(this.elements,this.elements),this.fire("update"),this},min:function(t,e){return e||(e=t,t=this),i.vec3.min(this.elements,t.elements,e.elements),this.fire("update"),this},max:function(t,e){return e||(e=t,t=this),i.vec3.max(this.elements,t.elements,e.elements),this.fire("update"),this},round:function(){return i.vec3.round(this.elements,this.elements),this.fire("update"),this},scale:function(t){return i.vec3.scale(this.elements,this.elements,t),this.fire("update"),this},scaleAndAdd:function(t,e,n){return n||(n=e,e=this),i.vec3.scaleAndAdd(this.elements,e.elements,n.elements,t),this.fire("update"),this},distance:function(t,e){return e||(e=t,t=this),i.vec3.distance(t.elements,e.elements)},squaredDistance:function(t,e){return e||(e=t,t=this),i.vec3.squaredDistance(t.elements,e.elements)},length:function(){return i.vec3.length(this.elements)},squaredLength:function(){return i.vec3.squaredLength(this.elements)},negate:function(){return i.vec3.negate(this.elements,this.elements),this.fire("update"),this},inverse:function(t){return t||(t=this),i.vec3.inverse(this.elements,t.elements),this.fire("update"),this},normalize:function(){return i.vec3.normalize(this.elements,this.elements),this.fire("update"),this},dot:function(t,e){return e||(e=t,t=this),i.vec3.dot(t.elements,e.elements)},cross:function(t,e){return e||(e=t,t=this),i.vec3.cross(this.elements,t.elements,e.elements),this.fire("update"),this},lerp:function(t,e){return i.vec3.lerp(this.elements,this.elements,t.elements,e),this.fire("update"),this},hermite:function(t,e,n,r,s){return i.vec3.hermite(this.elements,t.elements,e.elements,n.elements,r.elements,s),this.fire("update"),this},bezier:function(t,e,n,r,s){return i.vec3.bezier(this.elements,t.elements,e.elements,n.elements,r.elements,s),this.fire("update"),this},random:function(t){return i.vec3.random(this.elements,t),this.fire("update"),this},transformMat3:function(t){return i.vec3.transformMat3(this.elements,this.elements,t.elements),this.fire("update"),this},transformMat4:function(t){return i.vec3.transformMat4(this.elements,this.elements,t.elements),this.fire("update"),this},transformDirection:function(t){var e=this.elements,n=t.elements,i=e[0],r=e[1],s=e[2];return e[0]=i*n[0]+r*n[4]+s*n[8],e[1]=i*n[1]+r*n[5]+s*n[9],e[2]=i*n[2]+r*n[6]+s*n[10],this.fire("update"),this},transformQuat:function(t){return i.vec3.transformQuat(this.elements,this.elements,t.elements),this.fire("update"),this},rotateX:function(t,e){return i.vec3.rotateX(this.elements,this.elements,t.elements,e),this.fire("update"),this},rotateY:function(t,e){return i.vec3.rotateY(this.elements,this.elements,t.elements,e),this.fire("update"),this},rotateZ:function(t,e){return i.vec3.rotateZ(this.elements,this.elements,t.elements,e),this.fire("update"),this},exactEquals:function(t,e){return e||(e=t,t=this),i.vec3.exactEquals(t.elements,e.elements)},equals:function(t,e){return e||(e=t,t=this),i.vec3.equals(t.elements,e.elements)},x:{get:function(){return this.elements[0]},set:function(t){this.elements[0]=t,this.fire("update");}},y:{get:function(){return this.elements[1]},set:function(t){this.elements[1]=t,this.fire("update");}},z:{get:function(){return this.elements[2]},set:function(t){this.elements[2]=t,this.fire("update");}}});e.a=o;},function(t,e){t.exports="#define GLSLIFY 1\n#define HILO_FRONT_SIDE 1028\n#define HILO_BACK_SIDE 1029\n#define HILO_FRONT_AND_BACK_SIDE 1032\n#define HILO_PI 3.141592653589793\n#define HILO_INVERSE_PI 0.3183098861837907";},function(t,e){var n=function(){var t,e,n=function(t){var e,n,r={};for(e in t)n=t[e],i.hasOwnProperty(e)?i[e].call(this,n):r[e]=n;s(this.prototype,r);},i={Extends:function(t){var e=this.prototype,n=r(t.prototype);s(this,t),s(n,e),n.constructor=this,this.prototype=n,this.superclass=t.prototype;},Mixes:function(t){t instanceof Array||(t=[t]);for(var e,n=this.prototype;e=t.shift();)s(n,e.prototype||e);},Statics:function(t){s(this,t);}},r=function(){if(Object.__proto__)return function(t){return {__proto__:t}};var t=function(){};return function(e){return t.prototype=e,new t}}(),s=function(t){for(var n=1,i=arguments.length;n<i;n++){var r,s=arguments[n];for(var a in s){var o=s[a];!o||"object"!=typeof o||void 0===o.value&&"function"!=typeof o.get&&"function"!=typeof o.set?t[a]=o:(r=r||{})[a]=o;}r&&e(t,r);}return t};try{t=Object.defineProperty,e=Object.defineProperties,t({},"$",{value:0});}catch(n){"__defineGetter__"in Object&&(t=function(t,e,n){return "value"in n&&(t[e]=n.value),"get"in n&&t.__defineGetter__(e,n.get),"set"in n&&t.__defineSetter__(e,n.set),t},e=function(e,n){for(var i in n)n.hasOwnProperty(i)&&t(e,i,n[i]);return e});}return {create:function(t){var e=(t=t||{}).hasOwnProperty("constructor")?t.constructor:function(){};return n.call(e,t),e},mix:s}}();t.exports=n;},function(t,e,n){var i=n(1),r=n(5),s=i.a.create({className:"Plane",isPlane:!0,constructor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new r.a,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this.normal=t,this.distance=e;},copy:function(t){return this.normal.copy(t.normal),this.distance=t.distance,this},clone:function(){return new this.constructor(this.normal.clone(),this.distance)},set:function(t,e,n,i){return this.normal.set(t,e,n),this.distance=i,this},normalize:function(){var t=1/this.normal.length();return this.normal.scale(t),this.distance*=t,this},distanceToPoint:function(t){return this.normal.dot(t)+this.distance},projectPoint:function(t){return (new r.a).copy(this.normal).scale(-this.distanceToPoint(t)).add(t)}});e.a=s;},function(t,e,n){var i=n(1),r=n(5),s=new r.a,a=i.a.create({className:"Sphere",isSphere:!0,radius:0,constructor:function(t){Object.assign(this,t),this.center||(this.center=new r.a(0,0,0));},clone:function(){var t=new this.constructor;return t.copy(this),t},copy:function(t){return this.center.copy(t.center),this.radius=t.radius,this},fromPoints:function(t){for(var e=this.center,n=0,i=0;i<t.length;i+=3){var r=t[i]-e.x,s=t[i+1]-e.y,a=t[i+2]-e.z;n=Math.max(r*r+s*s+a*a,n);}return this.radius=Math.sqrt(n),this},fromGeometryData:function(t){var e=this.center,n=0;return t.traverse(function(t){var i=t.x-e.x,r=t.y-e.y,s=t.z-e.z;n=Math.max(i*i+r*r+s*s,n);}),this.radius=Math.sqrt(n),this},transformMat4:function(t){this.center.transformMat4(t);var e=t.getScaling(s);return this.radius*=Math.max(e.x,e.y,e.z),this}});e.a=a;},function(t,e,n){var i,r=n(0),s=n(1),a=n(9),o=n(5),u=n(7),c=n(10),h=new o.a,f=new o.a,l=s.a.create({Mixes:a.a,Extends:u.a,className:"Matrix4Notifier",isMatrix4Notifier:!0,constructor:function(){this.elements=r.mat4.create();},copy:function(t){return r.mat4.copy(this.elements,t.elements),this.fire("update"),this},fromArray:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.elements,i=0;i<16;i++)n[i]=t[e+i];return this.fire("update"),this},set:function(t,e,n,i,s,a,o,u,c,h,f,l,d,m,_,p){return r.mat4.set(this.elements,t,e,n,i,s,a,o,u,c,h,f,l,d,m,_,p),this.fire("update"),this},identity:function(){return r.mat4.identity(this.elements),this.fire("update"),this},transpose:function(){return r.mat4.transpose(this.elements,this.elements),this.fire("update"),this},invert:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;return r.mat4.invert(this.elements,t.elements),this.fire("update"),this},adjoint:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;return r.mat4.adjoint(this.elements,t.elements),this.fire("update"),this},determinant:function(){return r.mat4.determinant(this.elements)},multiply:function(t,e){return e||(e=t,t=this),r.mat4.multiply(this.elements,t.elements,e.elements),this.fire("update"),this},premultiply:function(t){return this.multiply(t,this),this.fire("update"),this},translate:function(t){return r.mat4.translate(this.elements,this.elements,t.elements),this.fire("update"),this},scale:function(t){return r.mat4.scale(this.elements,this.elements,t.elements),this.fire("update"),this},rotate:function(t,e){return r.mat4.rotate(this.elements,this.elements,t,e.elements),this.fire("update"),this},rotateX:function(t){return r.mat4.rotateX(this.elements,this.elements,t),this.fire("update"),this},rotateY:function(t){return r.mat4.rotateY(this.elements,this.elements,t),this.fire("update"),this},rotateZ:function(t){return r.mat4.rotateZ(this.elements,this.elements,t),this.fire("update"),this},fromTranslation:function(t){return r.mat4.fromTranslation(this.elements,t.elements),this.fire("update"),this},fromScaling:function(t){return r.mat4.fromScaling(this.elements,t.elements),this.fire("update"),this},fromRotation:function(t,e){return r.mat4.fromRotation(this.elements,t,e.elements),this.fire("update"),this},fromXRotation:function(t){return r.mat4.fromXRotation(this.elements,t),this.fire("update"),this},fromYRotation:function(t){return r.mat4.fromYRotation(this.elements,t),this.fire("update"),this},fromZRotation:function(t){return r.mat4.fromZRotation(this.elements,t),this.fire("update"),this},fromRotationTranslation:function(t,e){return r.mat4.fromRotationTranslation(this.elements,t.elements,e.elements),this.fire("update"),this},getTranslation:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o.a;return r.mat4.getTranslation(t.elements,this.elements),t},getScaling:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o.a;return r.mat4.getScaling(t.elements,this.elements),t},getRotation:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new c.a;return r.mat4.getRotation(t.elements,this.elements),t},fromRotationTranslationScale:function(t,e,n){return r.mat4.fromRotationTranslationScale(this.elements,t.elements,e.elements,n.elements),this.fire("update"),this},fromRotationTranslationScaleOrigin:function(t,e,n,i,s){return r.mat4.fromRotationTranslationScaleOrigin(this.elements,t.elements,e.elements,n.elements,i.elements),s||this.fire("update"),this},fromQuat:function(t){return r.mat4.fromQuat(this.elements,t.elements),this.fire("update"),this},frustum:function(t,e,n,i,s,a){return r.mat4.frustum(this.elements,t,e,n,i,s,a),this.fire("update"),this},perspective:function(t,e,n,i){return r.mat4.perspective(this.elements,t,e,n,i),this.fire("update"),this},perspectiveFromFieldOfView:function(t,e,n){return r.mat4.perspectiveFromFieldOfView(this.elements,t,e,n),this.fire("update"),this},ortho:function(t,e,n,i,s,a){return r.mat4.ortho(this.elements,t,e,n,i,s,a),this.fire("update"),this},lookAt:function(t,e,n){return t.isVector3||(t=h.set(t.x,t.y,t.z)),e.isVector3||(e=f.set(e.x,e.y,e.z)),r.mat4.lookAt(this.elements,t.elements,e.elements,n.elements),this.fire("update"),this},targetTo:function(t,e,n){t.isVector3||(t=h.set(t.x,t.y,t.z)),e.isVector3||(e=f.set(e.x,e.y,e.z)),t=t.elements,e=e.elements,n=n.elements;var i=this.elements,r=t[0],s=t[1],a=t[2],o=n[0],u=n[1],c=n[2],l=r-e[0],d=s-e[1],m=a-e[2],_=l*l+d*d+m*m;_>0?(l*=_=1/Math.sqrt(_),d*=_,m*=_):m=1;var p=u*m-c*d,g=c*l-o*m,v=o*d-u*l;return (_=p*p+g*g+v*v)>0?(p*=_=1/Math.sqrt(_),g*=_,v*=_):(_=(p=u*m-c*d)*p+(g=c*l-(o+=1e-7)*m)*g+(v=o*d-u*l)*v,p*=_=1/Math.sqrt(_),g*=_,v*=_),i[0]=p,i[1]=g,i[2]=v,i[3]=0,i[4]=d*v-m*g,i[5]=m*p-l*v,i[6]=l*g-d*p,i[7]=0,i[8]=l,i[9]=d,i[10]=m,i[11]=0,i[12]=r,i[13]=s,i[14]=a,i[15]=1,this.fire("update"),this},frob:function(){return r.mat4.frob(this.elements)},add:function(t,e){return e||(e=t,t=this),r.mat4.add(this.elements,t.elements,e.elements),this.fire("update"),this},subtract:function(t,e){return e||(e=t,t=this),r.mat4.subtract(this.elements,t.elements,e.elements),this.fire("update"),this},exactEquals:function(t,e){return e||(e=t,t=this),r.mat4.exactEquals(t.elements,e.elements)},equals:function(t,e){return e||(e=t,t=this),r.mat4.equals(t.elements,e.elements)},compose:function(t,e,n,i){return i?this.fromRotationTranslationScaleOrigin(t,e,n,i):this.fromRotationTranslationScale(t,e,n),this},decompose:function(t,e,n,r){return this.getScaling(n),this.getTranslation(e),i||(i=new u.a),this.determinant()<0&&(n.x*=-1),i.copy(this),h.inverse(n),i.scale(h),t.fromMat4(i),r&&r.set(0,0,0),this}});e.a=l;},function(t,e,n){var i=n(1),r=n(9),s=n(6),a=n(13),o=s.a.DEG2RAD,u=s.a.RAD2DEG,c=i.a.create({Mixes:r.a,Extends:a.a,className:"EulerNotifier",isEulerNotifier:!0,constructor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;a.a.call(this,t,e,n);},updateDegrees:function(){return c.superclass.updateDegrees.call(this),this.fire("update"),this},updateRadians:function(){return c.superclass.updateRadians.call(this),this.fire("update"),this},degX:{get:function(){return this._degX},set:function(t){this._degX=t,this.elements[0]=t*o,this.fire("update");}},degY:{get:function(){return this._degY},set:function(t){this._degY=t,this.elements[1]=t*o,this.fire("update");}},degZ:{get:function(){return this._degZ},set:function(t){this._degZ=t,this.elements[2]=t*o,this.fire("update");}},x:{get:function(){return this.elements[0]},set:function(t){this.elements[0]=t,this._degX=t*u,this.fire("update");}},y:{get:function(){return this.elements[1]},set:function(t){this.elements[1]=t,this._degY=t*u,this.fire("update");}},z:{get:function(){return this.elements[2]},set:function(t){this.elements[2]=t,this._degZ=t*u,this.fire("update");}}});e.a=c;},function(t,e,n){var i=n(1),r=n(20),s=i.a.create({className:"Frustum",isFrustum:!0,constructor:function(){this.planes=[];for(var t=6;t--;)this.planes.push(new r.a);},copy:function(t){var e=t.planes;return this.planes.forEach(function(t,n){t.copy(e[n]);}),this},clone:function(){var t=new this.constructor;return t.copy(this),t},fromMatrix:function(t){var e=this.planes,n=t.elements,i=n[0],r=n[1],s=n[2],a=n[3],o=n[4],u=n[5],c=n[6],h=n[7],f=n[8],l=n[9],d=n[10],m=n[11],_=n[12],p=n[13],g=n[14],v=n[15];return e[0].set(a-i,h-o,m-f,v-_).normalize(),e[1].set(a+i,h+o,m+f,v+_).normalize(),e[2].set(a+r,h+u,m+l,v+p).normalize(),e[3].set(a-r,h-u,m-l,v-p).normalize(),e[4].set(a-s,h-c,m-d,v-g).normalize(),e[5].set(a+s,h+c,m+d,v+g).normalize(),this},intersectsSphere:function(t){for(var e=this.planes,n=t.center,i=-t.radius,r=0;r<6;r++){if(e[r].distanceToPoint(n)<i)return !1}return !0}});e.a=s;},function(t,e){t.exports="#ifdef HILO_USE_SHADER_TEXTURE_LOD\n#extension GL_EXT_shader_texture_lod: enable\n#endif\n\n#ifdef HILO_USE_EXT_FRAG_DEPTH\n#extension GL_EXT_frag_depth: enable\n#define GLSLIFY 1\n#endif";},function(t,e){t.exports="#ifdef GL_ES\nprecision HILO_MAX_FRAGMENT_PRECISION float;\n#define GLSLIFY 1\n#endif";},function(t,e){t.exports=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]};},function(t,e,n){n.r(e);var i=n(8),r=n(13),s=n(23),a=n(24),o=n(6),u=n(11),c=n(7),h=n(22),f=n(20),l=n(10),d=n(16),m=n(21),_=n(1),p=n(5),g=new Float32Array(27),v=_.a.create({className:"SphericalHarmonics3",isSphericalHarmonics3:!0,Statics:{SH3_SCALE:[Math.sqrt(1/(4*Math.PI)),-Math.sqrt(3/(4*Math.PI)),Math.sqrt(3/(4*Math.PI)),-Math.sqrt(3/(4*Math.PI)),Math.sqrt(15/(4*Math.PI)),-Math.sqrt(15/(4*Math.PI)),Math.sqrt(5/(16*Math.PI)),-Math.sqrt(15/(4*Math.PI)),Math.sqrt(15/(16*Math.PI))]},constructor:function(){this.coefficients=[];for(var t=0;t<9;t++)this.coefficients.push(new p.a);},scale:function(t){return this.coefficients.forEach(function(e){e.scale(t);}),this},fromArray:function(t){return 9===t.length?this.coefficients.forEach(function(e,n){e.fromArray(t[n]);}):27===t.length&&this.coefficients.forEach(function(e,n){e.fromArray(t,3*n);}),this},scaleForRender:function(){var t=v.SH3_SCALE;return this.coefficients.forEach(function(e,n){e.scale(t[n]);}),this.scale(1/Math.PI),this},toArray:function(){return this.coefficients.forEach(function(t,e){t.toArray(g,3*e);}),g},clone:function(){var t=new this.constructor;return t.copy(this),t},copy:function(t){var e=t.coefficients;return this.coefficients.forEach(function(t,n){t.copy(e[n]);}),this}}),E=v,T=n(14),M=n(17),A=n(12);n.d(e,"Color",function(){return i.a}),n.d(e,"Euler",function(){return r.a}),n.d(e,"EulerNotifier",function(){return s.a}),n.d(e,"Frustum",function(){return a.a}),n.d(e,"math",function(){return o.a}),n.d(e,"Matrix3",function(){return u.a}),n.d(e,"Matrix4",function(){return c.a}),n.d(e,"Matrix4Notifier",function(){return h.a}),n.d(e,"Plane",function(){return f.a}),n.d(e,"Quaternion",function(){return l.a}),n.d(e,"Ray",function(){return d.a}),n.d(e,"Sphere",function(){return m.a}),n.d(e,"SphericalHarmonics3",function(){return E}),n.d(e,"Vector2",function(){return T.a}),n.d(e,"Vector3",function(){return p.a}),n.d(e,"Vector3Notifier",function(){return M.a}),n.d(e,"Vector4",function(){return A.a});},function(t,e){t.exports="#define GLSLIFY 1\n#if defined(HILO_USE_LOG_DEPTH) && defined(HILO_USE_EXT_FRAG_DEPTH)\nuniform float u_logDepth;\nvarying float v_fragDepth;\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#if defined(HILO_USE_LOG_DEPTH) && defined(HILO_USE_EXT_FRAG_DEPTH)\ngl_FragDepthEXT = log2( v_fragDepth ) * u_logDepth * 0.5;\n#endif";},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t};},function(t,e){t.exports=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t};},function(t,e){t.exports={ACTIVE_ATTRIBUTES:35721,ACTIVE_ATTRIBUTE_MAX_LENGTH:35722,ACTIVE_TEXTURE:34016,ACTIVE_UNIFORMS:35718,ACTIVE_UNIFORM_MAX_LENGTH:35719,ALIASED_LINE_WIDTH_RANGE:33902,ALIASED_POINT_SIZE_RANGE:33901,ALPHA:6406,ALPHA_BITS:3413,ALWAYS:519,ARRAY_BUFFER:34962,ARRAY_BUFFER_BINDING:34964,ATTACHED_SHADERS:35717,BACK:1029,BLEND:3042,BLEND_COLOR:32773,BLEND_DST_ALPHA:32970,BLEND_DST_RGB:32968,BLEND_EQUATION:32777,BLEND_EQUATION_ALPHA:34877,BLEND_EQUATION_RGB:32777,BLEND_SRC_ALPHA:32971,BLEND_SRC_RGB:32969,BLUE_BITS:3412,BOOL:35670,BOOL_VEC2:35671,BOOL_VEC3:35672,BOOL_VEC4:35673,BROWSER_DEFAULT_WEBGL:37444,BUFFER_SIZE:34660,BUFFER_USAGE:34661,BYTE:5120,CCW:2305,CLAMP_TO_EDGE:33071,COLOR_ATTACHMENT0:36064,COLOR_BUFFER_BIT:16384,COLOR_CLEAR_VALUE:3106,COLOR_WRITEMASK:3107,COMPILE_STATUS:35713,COMPRESSED_TEXTURE_FORMATS:34467,CONSTANT_ALPHA:32771,CONSTANT_COLOR:32769,CONTEXT_LOST_WEBGL:37442,CULL_FACE:2884,CULL_FACE_MODE:2885,CURRENT_PROGRAM:35725,CURRENT_VERTEX_ATTRIB:34342,CW:2304,DECR:7683,DECR_WRAP:34056,DELETE_STATUS:35712,DEPTH_ATTACHMENT:36096,DEPTH_BITS:3414,DEPTH_BUFFER_BIT:256,DEPTH_CLEAR_VALUE:2931,DEPTH_COMPONENT:6402,DEPTH_COMPONENT16:33189,DEPTH_FUNC:2932,DEPTH_RANGE:2928,DEPTH_STENCIL:34041,DEPTH_STENCIL_ATTACHMENT:33306,DEPTH_TEST:2929,DEPTH_WRITEMASK:2930,DITHER:3024,DONT_CARE:4352,DST_ALPHA:772,DST_COLOR:774,DYNAMIC_DRAW:35048,ELEMENT_ARRAY_BUFFER:34963,ELEMENT_ARRAY_BUFFER_BINDING:34965,EQUAL:514,FASTEST:4353,FLOAT:5126,FLOAT_MAT2:35674,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,FRAGMENT_SHADER:35632,FRAMEBUFFER:36160,FRAMEBUFFER_ATTACHMENT_OBJECT_NAME:36049,FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE:36048,FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE:36051,FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL:36050,FRAMEBUFFER_BINDING:36006,FRAMEBUFFER_COMPLETE:36053,FRAMEBUFFER_INCOMPLETE_ATTACHMENT:36054,FRAMEBUFFER_INCOMPLETE_DIMENSIONS:36057,FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:36055,FRAMEBUFFER_UNSUPPORTED:36061,FRONT:1028,FRONT_AND_BACK:1032,FRONT_FACE:2886,FUNC_ADD:32774,FUNC_REVERSE_SUBTRACT:32779,FUNC_SUBTRACT:32778,GENERATE_MIPMAP_HINT:33170,GEQUAL:518,GREATER:516,GREEN_BITS:3411,HIGH_FLOAT:36338,HIGH_INT:36341,INCR:7682,INCR_WRAP:34055,INFO_LOG_LENGTH:35716,INT:5124,INT_VEC2:35667,INT_VEC3:35668,INT_VEC4:35669,INVALID_ENUM:1280,INVALID_FRAMEBUFFER_OPERATION:1286,INVALID_OPERATION:1282,INVALID_VALUE:1281,INVERT:5386,KEEP:7680,LEQUAL:515,LESS:513,LINEAR:9729,LINEAR_MIPMAP_LINEAR:9987,LINEAR_MIPMAP_NEAREST:9985,LINES:1,LINE_LOOP:2,LINE_STRIP:3,LINE_WIDTH:2849,LINK_STATUS:35714,LOW_FLOAT:36336,LOW_INT:36339,LUMINANCE:6409,LUMINANCE_ALPHA:6410,MAX_COMBINED_TEXTURE_IMAGE_UNITS:35661,MAX_CUBE_MAP_TEXTURE_SIZE:34076,MAX_FRAGMENT_UNIFORM_VECTORS:36349,MAX_RENDERBUFFER_SIZE:34024,MAX_TEXTURE_IMAGE_UNITS:34930,MAX_TEXTURE_SIZE:3379,MAX_VARYING_VECTORS:36348,MAX_VERTEX_ATTRIBS:34921,MAX_VERTEX_TEXTURE_IMAGE_UNITS:35660,MAX_VERTEX_UNIFORM_VECTORS:36347,MAX_VIEWPORT_DIMS:3386,MEDIUM_FLOAT:36337,MEDIUM_INT:36340,MIRRORED_REPEAT:33648,NEAREST:9728,NEAREST_MIPMAP_LINEAR:9986,NEAREST_MIPMAP_NEAREST:9984,NEVER:512,NICEST:4354,NONE:0,NOTEQUAL:517,NO_ERROR:0,NUM_COMPRESSED_TEXTURE_FORMATS:34466,ONE:1,ONE_MINUS_CONSTANT_ALPHA:32772,ONE_MINUS_CONSTANT_COLOR:32770,ONE_MINUS_DST_ALPHA:773,ONE_MINUS_DST_COLOR:775,ONE_MINUS_SRC_ALPHA:771,ONE_MINUS_SRC_COLOR:769,OUT_OF_MEMORY:1285,PACK_ALIGNMENT:3333,POINTS:0,POLYGON_OFFSET_FACTOR:32824,POLYGON_OFFSET_FILL:32823,POLYGON_OFFSET_UNITS:10752,RED_BITS:3410,RENDERBUFFER:36161,RENDERBUFFER_ALPHA_SIZE:36179,RENDERBUFFER_BINDING:36007,RENDERBUFFER_BLUE_SIZE:36178,RENDERBUFFER_DEPTH_SIZE:36180,RENDERBUFFER_GREEN_SIZE:36177,RENDERBUFFER_HEIGHT:36163,RENDERBUFFER_INTERNAL_FORMAT:36164,RENDERBUFFER_RED_SIZE:36176,RENDERBUFFER_STENCIL_SIZE:36181,RENDERBUFFER_WIDTH:36162,RENDERER:7937,REPEAT:10497,REPLACE:7681,RGB:6407,RGB5_A1:32855,RGB565:36194,RGBA:6408,RGBA4:32854,SAMPLER_2D:35678,SAMPLER_CUBE:35680,SAMPLES:32937,SAMPLE_ALPHA_TO_COVERAGE:32926,SAMPLE_BUFFERS:32936,SAMPLE_COVERAGE:32928,SAMPLE_COVERAGE_INVERT:32939,SAMPLE_COVERAGE_VALUE:32938,SCISSOR_BOX:3088,SCISSOR_TEST:3089,SHADER_COMPILER:36346,SHADER_SOURCE_LENGTH:35720,SHADER_TYPE:35663,SHADING_LANGUAGE_VERSION:35724,SHORT:5122,SRC_ALPHA:770,SRC_ALPHA_SATURATE:776,SRC_COLOR:768,STATIC_DRAW:35044,STENCIL_ATTACHMENT:36128,STENCIL_BACK_FAIL:34817,STENCIL_BACK_FUNC:34816,STENCIL_BACK_PASS_DEPTH_FAIL:34818,STENCIL_BACK_PASS_DEPTH_PASS:34819,STENCIL_BACK_REF:36003,STENCIL_BACK_VALUE_MASK:36004,STENCIL_BACK_WRITEMASK:36005,STENCIL_BITS:3415,STENCIL_BUFFER_BIT:1024,STENCIL_CLEAR_VALUE:2961,STENCIL_FAIL:2964,STENCIL_FUNC:2962,STENCIL_INDEX:6401,STENCIL_INDEX8:36168,STENCIL_PASS_DEPTH_FAIL:2965,STENCIL_PASS_DEPTH_PASS:2966,STENCIL_REF:2967,STENCIL_TEST:2960,STENCIL_VALUE_MASK:2963,STENCIL_WRITEMASK:2968,STREAM_DRAW:35040,SUBPIXEL_BITS:3408,TEXTURE:5890,TEXTURE0:33984,TEXTURE1:33985,TEXTURE2:33986,TEXTURE3:33987,TEXTURE4:33988,TEXTURE5:33989,TEXTURE6:33990,TEXTURE7:33991,TEXTURE8:33992,TEXTURE9:33993,TEXTURE10:33994,TEXTURE11:33995,TEXTURE12:33996,TEXTURE13:33997,TEXTURE14:33998,TEXTURE15:33999,TEXTURE16:34e3,TEXTURE17:34001,TEXTURE18:34002,TEXTURE19:34003,TEXTURE20:34004,TEXTURE21:34005,TEXTURE22:34006,TEXTURE23:34007,TEXTURE24:34008,TEXTURE25:34009,TEXTURE26:34010,TEXTURE27:34011,TEXTURE28:34012,TEXTURE29:34013,TEXTURE30:34014,TEXTURE31:34015,TEXTURE_2D:3553,TEXTURE_BINDING_2D:32873,TEXTURE_BINDING_CUBE_MAP:34068,TEXTURE_CUBE_MAP:34067,TEXTURE_CUBE_MAP_NEGATIVE_X:34070,TEXTURE_CUBE_MAP_NEGATIVE_Y:34072,TEXTURE_CUBE_MAP_NEGATIVE_Z:34074,TEXTURE_CUBE_MAP_POSITIVE_X:34069,TEXTURE_CUBE_MAP_POSITIVE_Y:34071,TEXTURE_CUBE_MAP_POSITIVE_Z:34073,TEXTURE_MAG_FILTER:10240,TEXTURE_MIN_FILTER:10241,TEXTURE_WRAP_S:10242,TEXTURE_WRAP_T:10243,TRIANGLES:4,TRIANGLE_FAN:6,TRIANGLE_STRIP:5,UNPACK_ALIGNMENT:3317,UNPACK_COLORSPACE_CONVERSION_WEBGL:37443,UNPACK_FLIP_Y_WEBGL:37440,UNPACK_PREMULTIPLY_ALPHA_WEBGL:37441,UNSIGNED_BYTE:5121,UNSIGNED_INT:5125,UNSIGNED_SHORT:5123,UNSIGNED_SHORT_4_4_4_4:32819,UNSIGNED_SHORT_5_5_5_1:32820,UNSIGNED_SHORT_5_6_5:33635,VALIDATE_STATUS:35715,VENDOR:7936,VERSION:7938,VERTEX_ATTRIB_ARRAY_BUFFER_BINDING:34975,VERTEX_ATTRIB_ARRAY_ENABLED:34338,VERTEX_ATTRIB_ARRAY_NORMALIZED:34922,VERTEX_ATTRIB_ARRAY_POINTER:34373,VERTEX_ATTRIB_ARRAY_SIZE:34339,VERTEX_ATTRIB_ARRAY_STRIDE:34340,VERTEX_ATTRIB_ARRAY_TYPE:34341,VERTEX_SHADER:35633,VIEWPORT:2978,ZERO:0};},function(t,e,n){t.exports={VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE:35070,UNMASKED_VENDOR_WEBGL:37445,UNMASKED_RENDERER_WEBGL:37446,MAX_TEXTURE_MAX_ANISOTROPY_EXT:34047,TEXTURE_MAX_ANISOTROPY_EXT:34046,COMPRESSED_RGB_S3TC_DXT1_EXT:33776,COMPRESSED_RGBA_S3TC_DXT1_EXT:33777,COMPRESSED_RGBA_S3TC_DXT3_EXT:33778,COMPRESSED_RGBA_S3TC_DXT5_EXT:33779,COMPRESSED_R11_EAC:37488,COMPRESSED_SIGNED_R11_EAC:37489,COMPRESSED_RG11_EAC:37490,COMPRESSED_SIGNED_RG11_EAC:37491,COMPRESSED_RGB8_ETC2:37492,COMPRESSED_RGBA8_ETC2_EAC:37493,COMPRESSED_SRGB8_ETC2:37494,COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:37495,COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2:37496,COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2:37497,COMPRESSED_RGB_PVRTC_4BPPV1_IMG:35840,COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:35842,COMPRESSED_RGB_PVRTC_2BPPV1_IMG:35841,COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:35843,COMPRESSED_RGB_ETC1_WEBGL:36196,COMPRESSED_RGB_ATC_WEBGL:35986,COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL:35986,COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL:34798,UNSIGNED_INT_24_8_WEBGL:34042,HALF_FLOAT_OES:36193,RGBA32F_EXT:34836,RGB32F_EXT:34837,FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT:33297,UNSIGNED_NORMALIZED_EXT:35863,MIN_EXT:32775,MAX_EXT:32776,SRGB_EXT:35904,SRGB_ALPHA_EXT:35906,SRGB8_ALPHA8_EXT:35907,FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT:33296,FRAGMENT_SHADER_DERIVATIVE_HINT_OES:35723,COLOR_ATTACHMENT0_WEBGL:36064,COLOR_ATTACHMENT1_WEBGL:36065,COLOR_ATTACHMENT2_WEBGL:36066,COLOR_ATTACHMENT3_WEBGL:36067,COLOR_ATTACHMENT4_WEBGL:36068,COLOR_ATTACHMENT5_WEBGL:36069,COLOR_ATTACHMENT6_WEBGL:36070,COLOR_ATTACHMENT7_WEBGL:36071,COLOR_ATTACHMENT8_WEBGL:36072,COLOR_ATTACHMENT9_WEBGL:36073,COLOR_ATTACHMENT10_WEBGL:36074,COLOR_ATTACHMENT11_WEBGL:36075,COLOR_ATTACHMENT12_WEBGL:36076,COLOR_ATTACHMENT13_WEBGL:36077,COLOR_ATTACHMENT14_WEBGL:36078,COLOR_ATTACHMENT15_WEBGL:36079,DRAW_BUFFER0_WEBGL:34853,DRAW_BUFFER1_WEBGL:34854,DRAW_BUFFER2_WEBGL:34855,DRAW_BUFFER3_WEBGL:34856,DRAW_BUFFER4_WEBGL:34857,DRAW_BUFFER5_WEBGL:34858,DRAW_BUFFER6_WEBGL:34859,DRAW_BUFFER7_WEBGL:34860,DRAW_BUFFER8_WEBGL:34861,DRAW_BUFFER9_WEBGL:34862,DRAW_BUFFER10_WEBGL:34863,DRAW_BUFFER11_WEBGL:34864,DRAW_BUFFER12_WEBGL:34865,DRAW_BUFFER13_WEBGL:34866,DRAW_BUFFER14_WEBGL:34867,DRAW_BUFFER15_WEBGL:34868,MAX_COLOR_ATTACHMENTS_WEBGL:36063,MAX_DRAW_BUFFERS_WEBGL:34852,VERTEX_ARRAY_BINDING_OES:34229,QUERY_COUNTER_BITS_EXT:34916,CURRENT_QUERY_EXT:34917,QUERY_RESULT_EXT:34918,QUERY_RESULT_AVAILABLE_EXT:34919,TIME_ELAPSED_EXT:35007,TIMESTAMP_EXT:36392,GPU_DISJOINT_EXT:36795};},function(t,e,n){var i={_listeners:null,on:function(t,e,n){for(var i=this._listeners=this._listeners||{},r=i[t]=i[t]||[],s=0,a=r.length;s<a;s++){if(r[s].listener===e)return}return r.push({listener:e,once:n}),this},off:function(t,e){if(0==arguments.length)return this._listeners=null,this;var n=this._listeners&&this._listeners[t];if(n){if(1==arguments.length)return delete this._listeners[t],this;for(var i=0,r=n.length;i<r;i++){var s=n[i];if(s.listener===e){n.splice(i,1),0===n.length&&delete this._listeners[t];break}}}return this},fire:function(t,e){var n,i;"string"==typeof t?i=t:(n=t,i=t.type);var s=this._listeners;if(!s)return !1;var a=s[i];if(a){var o=a.slice(0);if((n=n||new r(i,this,e))._stopped)return !1;for(var u=0;u<o.length;u++){var c=o[u];if(c.listener.call(this,n),c.once){var h=a.indexOf(c);h>-1&&a.splice(h,1);}}return 0==a.length&&delete s[i],!0}return !1}},r=n(19).create({constructor:function(t,e,n){this.type=t,this.target=e,this.detail=n,this.timeStamp=+new Date;},type:null,target:null,detail:null,timeStamp:0,stopImmediatePropagation:function(){this._stopped=!0;}}),s=window.Event;if(s){var a=s.prototype,o=a.stopImmediatePropagation;a.stopImmediatePropagation=function(){o&&o.call(this),this._stopped=!0;};}t.exports=i;},function(t,e,n){var i=n(94),r=n(96),s=n(97),a=n(100),o=n(34),u=[[0,0,0],[0,0,0],[0,0,0]],c=[0,0,0];function h(t,e){this.origin=t||[0,0,0],this.direction=e||[0,0,-1];}t.exports=h,h.prototype.set=function(t,e){this.origin=t,this.direction=e;},h.prototype.copy=function(t){o(this.origin,t.origin),o(this.direction,t.direction);},h.prototype.clone=function(){var t=new h;return t.copy(this),t},h.prototype.intersectsSphere=function(t,e){return s(c,this.origin,this.direction,t,e)},h.prototype.intersectsPlane=function(t,e){return r(c,this.origin,this.direction,t,e)},h.prototype.intersectsTriangle=function(t){return i(c,this.origin,this.direction,t)},h.prototype.intersectsBox=function(t){return a(c,this.origin,this.direction,t)},h.prototype.intersectsTriangleCell=function(t,e){var n=t[0],i=t[1],r=t[2];return u[0]=e[n],u[1]=e[i],u[2]=e[r],this.intersectsTriangle(u)};},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")();}catch(t){"object"==typeof window&&(n=window);}t.exports=n;},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_COLOR\nvarying vec4 v_color;\n#endif\n\n#ifdef HILO_USE_HDR\nuniform float u_exposure;\n#endif\n\n#ifdef HILO_GAMMA_CORRECTION\nuniform float u_gammaFactor;\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_TEXCOORD0\nvarying vec2 v_texcoord0;\n#endif\n\n#ifdef HILO_HAS_TEXCOORD1\nvarying vec2 v_texcoord1;\n#endif\n\n#if defined(HILO_HAS_TEXCOORD0) || defined(HILO_HAS_TEXCOORD1)\n#if defined(HILO_HAS_TEXCOORD0) && defined(HILO_HAS_TEXCOORD1)\n#define HILO_SAMPLER_2D hiloSampler2D\n// https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Opaque_types\n#define HILO_TEXTURE_2D(HILO_SAMPLER_2D)  hiloTexture2D(HILO_SAMPLER_2D.texture, HILO_SAMPLER_2D.uv)\nstruct hiloSampler2D{\nsampler2D texture;\nint uv; \n};\n\nvec4 hiloTexture2D(sampler2D texture, int uv){\nif(uv == 0){\nreturn texture2D(texture, v_texcoord0);\n}\nelse{\nreturn texture2D(texture, v_texcoord1);\n}\n}\n#else\n#ifdef HILO_HAS_TEXCOORD1\n#define HILO_V_TEXCOORD v_texcoord1\n#else\n#define HILO_V_TEXCOORD v_texcoord0\n#endif\n#define HILO_SAMPLER_2D sampler2D\n#define HILO_TEXTURE_2D(HILO_SAMPLER_2D)  texture2D(HILO_SAMPLER_2D, HILO_V_TEXCOORD)\n#endif\n#endif\n\n\n#ifdef HILO_DIFFUSE_CUBE_MAP\nvarying vec3 v_position;\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_NORMAL\nvarying vec3 v_normal;\n#ifdef HILO_NORMAL_MAP\nuniform HILO_SAMPLER_2D u_normalMap;\nvarying mat3 v_TBN;\n\n#ifdef HILO_NORMAL_MAP_SCALE\nuniform float u_normalMapScale;\n#endif\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#if defined(HILO_HAS_LIGHT) || defined(HILO_HAS_FRAG_POS)\nvarying vec3 v_fragPos;\n#endif";},function(t,e,n){t.exports="#define GLSLIFY 1\n#ifdef HILO_DIRECTIONAL_LIGHTS\nuniform vec3 u_directionalLightsColor[HILO_DIRECTIONAL_LIGHTS];\nuniform vec3 u_directionalLightsInfo[HILO_DIRECTIONAL_LIGHTS];\n#ifdef HILO_DIRECTIONAL_LIGHTS_SMC\nuniform sampler2D u_directionalLightsShadowMap[HILO_DIRECTIONAL_LIGHTS_SMC];\nuniform vec2 u_directionalLightsShadowMapSize[HILO_DIRECTIONAL_LIGHTS_SMC];\nuniform mat4 u_directionalLightSpaceMatrix[HILO_DIRECTIONAL_LIGHTS_SMC];\nuniform vec2 u_directionalLightsShadowBias[HILO_DIRECTIONAL_LIGHTS_SMC];\n#endif\n#endif\n\n#ifdef HILO_SPOT_LIGHTS\nuniform vec3 u_spotLightsPos[HILO_SPOT_LIGHTS];\nuniform vec3 u_spotLightsDir[HILO_SPOT_LIGHTS];\nuniform vec3 u_spotLightsColor[HILO_SPOT_LIGHTS];\nuniform vec2 u_spotLightsCutoffs[HILO_SPOT_LIGHTS];\nuniform vec3 u_spotLightsInfo[HILO_SPOT_LIGHTS];\nuniform float u_spotLightsRange[HILO_SPOT_LIGHTS];\n#ifdef HILO_SPOT_LIGHTS_SMC\nuniform sampler2D u_spotLightsShadowMap[HILO_SPOT_LIGHTS_SMC];\nuniform vec2 u_spotLightsShadowMapSize[HILO_SPOT_LIGHTS_SMC];\nuniform mat4 u_spotLightSpaceMatrix[HILO_SPOT_LIGHTS_SMC];\nuniform vec2 u_spotLightsShadowBias[HILO_SPOT_LIGHTS_SMC];\n#endif\n#endif\n\n#ifdef HILO_POINT_LIGHTS\nuniform vec3 u_pointLightsPos[HILO_POINT_LIGHTS];\nuniform vec3 u_pointLightsColor[HILO_POINT_LIGHTS];\nuniform vec3 u_pointLightsInfo[HILO_POINT_LIGHTS];\nuniform float u_pointLightsRange[HILO_POINT_LIGHTS];\n#ifdef HILO_POINT_LIGHTS_SMC\nuniform samplerCube u_pointLightsShadowMap[HILO_POINT_LIGHTS_SMC];\nuniform mat4 u_pointLightSpaceMatrix[HILO_POINT_LIGHTS_SMC];\nuniform vec2 u_pointLightsShadowBias[HILO_POINT_LIGHTS_SMC];\nuniform vec2 u_pointLightCamera[HILO_POINT_LIGHTS_SMC];\n#endif\n#endif\n\n#ifdef HILO_AREA_LIGHTS\nuniform vec3 u_areaLightsPos[HILO_AREA_LIGHTS];\nuniform vec3 u_areaLightsColor[HILO_AREA_LIGHTS];\nuniform vec3 u_areaLightsWidth[HILO_AREA_LIGHTS];\nuniform vec3 u_areaLightsHeight[HILO_AREA_LIGHTS];\nuniform sampler2D u_areaLightsLtcTexture1;\nuniform sampler2D u_areaLightsLtcTexture2;\n\n"+n(113)+"\n#endif\n\n#ifdef HILO_AMBIENT_LIGHTS\nuniform vec3 u_ambientLightsColor;\n#endif\n\n"+n(64)+"\n"+n(65)+"\n"+n(66)+"\n"+n(67)+"\n"+n(68);},function(t,e){t.exports="#define GLSLIFY 1\nvec4 textureEnvMap(sampler2D texture, vec3 position){\nreturn texture2D(texture, vec2(atan(position.x, position.z) * HILO_INVERSE_PI * 0.5+0.5,  acos(position.y) * HILO_INVERSE_PI));\n}\n\nvec4 textureEnvMap(samplerCube texture, vec3 position){\nreturn textureCube(texture, position);\n}\n\n#ifdef HILO_USE_SHADER_TEXTURE_LOD\nvec4 textureEnvMapLod(sampler2D texture, vec3 position, float lod){\nreturn texture2DLodEXT(texture, vec2(atan(position.x, position.z) * HILO_INVERSE_PI * 0.5+0.5,  acos(position.y) * HILO_INVERSE_PI), lod);\n}\n\nvec4 textureEnvMapLod(samplerCube texture, vec3 position, float lod){\nreturn textureCubeLodEXT(texture, position, lod);\n}\n#endif\n\n";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_TRANSPARENCY_MAP\nuniform HILO_SAMPLER_2D u_transparency;\n#else\nuniform float u_transparency;\n#endif\n\n#ifdef HILO_ALPHA_CUTOFF\nuniform float u_alphaCutoff;\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_FOG\nvarying float v_dist;\nuniform vec4 u_fogColor;\n\n#ifdef HILO_FOG_LINEAR\nuniform vec2 u_fogInfo;\n#else\nuniform float u_fogInfo;\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_NORMAL_MAP\nvec3 normal = HILO_TEXTURE_2D(u_normalMap).rgb * 2.0 - 1.0;\n#ifdef HILO_NORMAL_MAP_SCALE\nnormal.xy *= u_normalMapScale;\n#endif\nnormal = normalize(v_TBN * normal);\n#elif defined(HILO_HAS_NORMAL)\nvec3 normal = normalize(v_normal);\n#else\nvec3 normal = vec3(0, 0, 1);\n#endif\n\n#if HILO_SIDE == HILO_BACK_SIDE\nnormal = -normal;\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_LIGHT\n#if HILO_SIDE == HILO_FRONT_AND_BACK_SIDE\nnormal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\nfloat transparency = 1.0;\n#ifdef HILO_TRANSPARENCY_MAP\ntransparency = HILO_TEXTURE_2D(u_transparency).r;\n#else\ntransparency = u_transparency;\n#endif\ncolor.a *= transparency;\n#ifdef HILO_ALPHA_CUTOFF\nif (color.a < u_alphaCutoff) {\ndiscard;\n} else {\ncolor.a = 1.0;\n}\n#endif";},function(t,e,n){t.exports="#define GLSLIFY 1\n#ifdef HILO_IGNORE_TRANSPARENT\ncolor.a = 1.0;\n#endif\n\n#ifdef HILO_USE_HDR\ncolor.rgb = vec3(1.0) - exp(-color.rgb * u_exposure);\n#endif\n\n#ifdef HILO_GAMMA_CORRECTION\ncolor.rgb = pow(color.rgb, vec3(1.0 / u_gammaFactor));\n#endif\n\n"+n(73)+"\n\n#ifdef HILO_PREMULTIPLY_ALPHA\ncolor.rgb *= color.a;\n#endif\n\ngl_FragColor = color;";},function(t,e){t.exports="#define GLSLIFY 1\n";},function(t,e){t.exports="#ifdef GL_ES\nprecision HILO_MAX_VERTEX_PRECISION float;\n#define GLSLIFY 1\n#endif";},function(t,e,n){t.exports="#define GLSLIFY 1\n"+n(25)+"\n"+n(18)+"\n"+n(26)+"\n\n"+n(40)+"\n"+n(41)+"\n"+n(42)+"\n"+n(43)+"\n"+n(62)+"\n"+n(44)+"\n"+n(69)+"\n"+n(46)+"\n"+n(47)+"\n"+n(29)+"\n\nvoid main(void) {\nvec4 diffuse = vec4(0., 0., 0., 1.);\nvec4 color = vec4(0., 0., 0., 1.);\n\n"+n(48)+"\n"+n(49)+"\n"+n(71)+"\n"+n(72)+"\n"+n(50)+"\n"+n(51)+"\n"+n(30)+"\n}";},function(t,e,n){t.exports="#define GLSLIFY 1\n"+n(52)+"\n"+n(18)+"\n"+n(53)+"\n\nattribute vec3 a_position;\nuniform mat4 u_modelViewProjectionMatrix;\n\n"+n(74)+"\n"+n(75)+"\n"+n(76)+"\n"+n(77)+"\n"+n(78)+"\n"+n(79)+"\n"+n(80)+"\n"+n(81)+"\nvoid main(void) {\nvec4 pos = vec4(a_position, 1.0);\n#ifdef HILO_HAS_TEXCOORD0\nvec2 uv = a_texcoord0;\n#endif\n#ifdef HILO_HAS_TEXCOORD1\nvec2 uv1 = a_texcoord1;\n#endif\n#ifdef HILO_HAS_NORMAL\nvec3 normal = a_normal;\n#endif\n\n#ifdef HILO_NORMAL_MAP\nvec4 tangent = a_tangent;\n#endif\n\n"+n(82)+"\n"+n(83)+"\n"+n(84)+"\n"+n(85)+"\n"+n(86)+"\n"+n(87)+"\n"+n(88)+"\n\ngl_Position = u_modelViewProjectionMatrix * pos;\n\n"+n(89)+"\n}";},function(t,e,n){t.exports="#define GLSLIFY 1\n"+n(25)+"\n"+n(18)+"\n"+n(26)+"\n\n#if defined(HILO_VERTEX_TYPE_POSITION)\nvarying vec3 v_fragPos;\n#elif defined(HILO_VERTEX_TYPE_NORMAL)\nvarying vec3 v_normal;\n#elif defined(HILO_VERTEX_TYPE_DEPTH)\nuniform float u_cameraFar;\nuniform float u_cameraNear;\nuniform float u_cameraType;\n#elif defined(HILO_VERTEX_TYPE_DISTANCE)\n"+n(90)+"\n\nuniform float u_cameraFar;\nuniform float u_cameraNear;\nvarying vec3 v_fragPos;\n#endif\n\nvec4 transformDataToColor(vec3 data){\n#ifdef HILO_WRITE_ORIGIN_DATA\nreturn vec4(data, 1.0);\n#else\nreturn vec4(data * 0.5 + 0.5, 1.0);\n#endif\n}\n\n"+n(29)+"\n\nvoid main(void) {\n#if defined(HILO_VERTEX_TYPE_POSITION)\ngl_FragColor = transformDataToColor(v_fragPos);\n#elif defined(HILO_VERTEX_TYPE_NORMAL)\ngl_FragColor = transformDataToColor(v_normal);\n#elif defined(HILO_VERTEX_TYPE_DEPTH)\nfloat z;\n#ifdef HILO_WRITE_ORIGIN_DATA\nz = gl_FragCoord.z;\n#else\n// OrthographicCamera\nif(u_cameraType < 1.0){\nz = gl_FragCoord.z;\n}\n// PerspectiveCamera\nelse{\nz = gl_FragCoord.z * 2.0 - 1.0;\nz = (2.0 * u_cameraNear * u_cameraFar) / (u_cameraFar + u_cameraNear - z * (u_cameraFar - u_cameraNear));\n}\n#endif\ngl_FragColor = vec4(z, z, z, 1.0);\n#elif defined(HILO_VERTEX_TYPE_DISTANCE)\nfloat distance = length(v_fragPos);\n#ifdef HILO_WRITE_ORIGIN_DATA\ngl_FragColor = vec4(distance, distance, distance, 1.0);\n#else\ngl_FragColor = packFloat((distance - u_cameraNear)/(u_cameraFar - u_cameraNear));\n#endif\n#endif\n"+n(30)+"\n}";},function(t,e,n){t.exports="#define GLSLIFY 1\n"+n(25)+"\n"+n(18)+"\n"+n(26)+"\n\n"+n(40)+"\n"+n(41)+"\n"+n(42)+"\n"+n(43)+"\n"+n(91)+"\n"+n(44)+"\n"+n(46)+"\n"+n(47)+"\n"+n(29)+"\n\nvoid main(void) {\nvec4 color = vec4(0., 0., 0., 1.);\n\n"+n(48)+"\n"+n(49)+"\n"+n(93)+"\n"+n(51)+"\n"+n(30)+"\n}";},function(t,e,n){t.exports="#define GLSLIFY 1\n"+n(25)+"\n"+n(18)+"\n"+n(26)+"\n\nvarying vec2 v_texcoord0;\nuniform sampler2D u_diffuse;\n\nvoid main(void) {  \ngl_FragColor = texture2D(u_diffuse, v_texcoord0);\n}";},function(t,e,n){t.exports="#define GLSLIFY 1\n"+n(52)+"\n"+n(18)+"\n"+n(53)+"\n\nattribute vec2 a_position;\nattribute vec2 a_texcoord0;\nvarying vec2 v_texcoord0;\n\n\nvoid main(void) {\nvec4 pos = vec4(a_position, 0.0, 1.0);\ngl_Position = pos;\nv_texcoord0 = a_texcoord0;\n}";},function(t,e){var n=function(){var t=navigator.userAgent,e=document,n=window,i=e.documentElement,r={iphone:/iphone/i.test(t),ipad:/ipad/i.test(t),ipod:/ipod/i.test(t),ios:/iphone|ipad|ipod/i.test(t),android:/android/i.test(t),webkit:/webkit/i.test(t),chrome:/chrome/i.test(t),safari:/safari/i.test(t),firefox:/firefox/i.test(t),ie:/msie/i.test(t),opera:/opera/i.test(t),supportTouch:"ontouchstart"in n,supportCanvas:null!=e.createElement("canvas").getContext,supportStorage:!1,supportOrientation:"orientation"in n||"orientation"in n.screen,supportDeviceMotion:"ondevicemotion"in n};try{localStorage.setItem("hilo","hilo"),localStorage.removeItem("hilo"),r.supportStorage=!0;}catch(t){}var s=r.jsVendor=r.webkit?"webkit":r.firefox?"webkit":r.opera?"o":r.ie?"ms":"",a=r.cssVendor="-"+s+"-",o=e.createElement("div"),u=o.style,c=null!=u[s+"Transform"],h=null!=u[s+"Perspective"];h&&(o.id="test3d",(u=e.createElement("style")).textContent="@media ("+a+"transform-3d){#test3d{height:3px}}",e.head.appendChild(u),i.appendChild(o),h=3==o.offsetHeight,e.head.removeChild(u),i.removeChild(o)),r.supportTransform=c,r.supportTransform3D=h;var f=r.supportTouch,l=f?"touchstart":"mousedown",d=f?"touchmove":"mousemove",m=f?"touchend":"mouseup";return r.POINTER_START=l,r.POINTER_MOVE=d,r.POINTER_END=m,r}();t.exports=n;},function(t,e,n){var i=n(19),r=function(){function t(){return +new Date}return i.create({constructor:function(t,e,n,i){var r=this;for(var s in r.target=t,r._startTime=0,r._seekTime=0,r._pausedTime=0,r._pausedStartTime=0,r._reverseFlag=1,r._repeatCount=0,3==arguments.length&&(i=n,n=e,e=null),i)r[s]=i[s];r._fromProps=e,r._toProps=n,!i.duration&&i.time&&(r.duration=i.time||0,r.time=0);},target:null,duration:1e3,delay:0,paused:!1,loop:!1,reverse:!1,repeat:0,repeatDelay:0,ease:null,time:0,isStart:!1,isComplete:!1,onStart:null,onUpdate:null,onComplete:null,setProps:function(t,e){var n=this.target,i=t||e,r=this._fromProps={},s=this._toProps={};for(var a in t=t||n,e=e||n,i)s[a]=e[a]||0,n[a]=r[a]=t[a]||0;return this},start:function(){var e=this;return e._startTime=t()+e.delay,e._seekTime=0,e._pausedTime=0,e._reverseFlag=1,e._repeatCount=0,e.paused=!1,e.isStart=!1,e.isComplete=!1,r.add(e),e},stop:function(){return r.remove(this),this},pause:function(){return this.paused=!0,this._pausedStartTime=t(),this},resume:function(){var e=this;return e.paused=!1,e._pausedStartTime&&(e._pausedTime+=t()-e._pausedStartTime),e._pausedStartTime=0,e},seek:function(e,n){var i=this,s=t();return i._startTime=s,i._seekTime=e,i._pausedTime=0,void 0!==n&&(i.paused=n),i._update(s,!0),r.add(i),i},link:function(t){var e,n,i=t.delay,s=this._startTime;return "string"==typeof i&&(e=0==i.indexOf("+"),n=0==i.indexOf("-"),i=e||n?Number(i.substr(1))*(e?1:-1):Number(i)),t.delay=i,t._startTime=e||n?s+this.duration+i:s+i,this._next=t,r.remove(t),t},_render:function(t){var e,n=this.target,i=this._fromProps;for(e in i)n[e]=i[e]+(this._toProps[e]-i[e])*t;},_update:function(e,n){var i=this;if(!i.paused||n){if(i.isComplete)return !0;var s=e-i._startTime-i._pausedTime+i._seekTime;if(!(s<0)){var a,o=s/i.duration;o=o<=0?0:o>=1?1:o;var u=i.ease?i.ease(o):o;i.reverse&&i.isStart&&(i._reverseFlag<0&&(o=1-o,u=1-u),o<1e-7&&(i.repeat>0&&i._repeatCount++>=i.repeat||0==i.repeat&&!i.loop?!0:(i._startTime=t(),i._pausedTime=0,i._reverseFlag*=-1))),i.isStart||(i.setProps(i._fromProps,i._toProps),i.isStart=!0,i.onStart&&i.onStart.call(i,i)),i.time=s,i._render(u),(a=i.onUpdate)&&a.call(i,o,i),o>=1&&(i.reverse?(i._startTime=t(),i._pausedTime=0,i._reverseFlag*=-1):i.loop||i.repeat>0&&i._repeatCount++<i.repeat?(i._startTime=t()+i.repeatDelay,i._pausedTime=0):i.isComplete=!0);var c=i._next;if(c&&c.time<=0){var h=c._startTime;h>0&&h<=e?(c._render(o),c.time=s,r.add(c)):i.isComplete&&(h<0||h>e)&&c.start();}return i.isComplete?((a=i.onComplete)&&a.call(i,i),!0):void 0}}},Statics:{_tweens:[],tick:function(){var e,n,i=r._tweens,s=i.length;for(n=0;n<s;n++)(e=i[n])&&e._update(t())&&(i.splice(n,1),n--);return r},add:function(t){var e=r._tweens;return -1==e.indexOf(t)&&e.push(t),r},remove:function(t){var e,n;if(t instanceof Array){for(e=0,n=t.length;e<n;e++)r.remove(t[e]);return r}var i=r._tweens;if(t instanceof r)(e=i.indexOf(t))>-1&&i.splice(e,1);else for(e=0;e<i.length;e++)i[e].target===t&&(i.splice(e,1),e--);return r},removeAll:function(){return r._tweens.length=0,r},fromTo:function(t,e,n,i){i=i||{};var s=t instanceof Array;t=s?t:[t];var a,o,u=i.stagger,c=[];for(o=0;o<t.length;o++)a=new r(t[o],e,n,i),u&&(a.delay=(i.delay||0)+(o*u||0)),a.start(),c.push(a);return s?c:a},to:function(t,e,n){return r.fromTo(t,null,e,n)},from:function(t,e,n){return r.fromTo(t,e,null,n)}}})}();t.exports=r;},function(t,e){t.exports="#define GLSLIFY 1\n#if defined(HILO_DIFFUSE_MAP)\nuniform HILO_SAMPLER_2D u_diffuse;\n#elif defined(HILO_DIFFUSE_CUBE_MAP)\nuniform samplerCube u_diffuse;\n#else\nuniform vec4 u_diffuse;\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\nfloat transpose(float m) {\nreturn m;\n}\n\nmat2 transpose(mat2 m) {\nreturn mat2(m[0][0], m[1][0],\nm[0][1], m[1][1]);\n}\n\nmat3 transpose(mat3 m) {\nreturn mat3(m[0][0], m[1][0], m[2][0],\nm[0][1], m[1][1], m[2][1],\nm[0][2], m[1][2], m[2][2]);\n}\n\nmat4 transpose(mat4 m) {\nreturn mat4(m[0][0], m[1][0], m[2][0], m[3][0],\nm[0][1], m[1][1], m[2][1], m[3][1],\nm[0][2], m[1][2], m[2][2], m[3][2],\nm[0][3], m[1][3], m[2][3], m[3][3]);\n}";},function(t,e){t.exports="#define GLSLIFY 1\nfloat getDiffuse(vec3 normal, vec3 lightDir){\nreturn max(dot(normal, lightDir), 0.0);\n}\n\n";},function(t,e){t.exports="#define GLSLIFY 1\nfloat getSpecular(vec3 cameraPos, vec3 fragPos, vec3 lightDir, vec3 normal, float shininess){\nvec3 viewDir = normalize(cameraPos - fragPos);\n#ifdef LIGHT_TYPE_PHONG\nreturn pow(max(dot(viewDir, reflect(-lightDir, normal), 0.0), shininess);\n#else\nreturn pow(max(dot(normal, normalize(lightDir + viewDir)), 0.0), shininess);\n#endif\n}\n\n";},function(t,e){t.exports="#define GLSLIFY 1\nfloat getLightAttenuation(vec3 distanceVec, vec3 info, float range){\nfloat distance = length(distanceVec);\nfloat attenuation = 1.0;\n#ifdef HILO_USE_PHYSICS_LIGHT\nattenuation = max(1.0 / (distance * distance), 0.001);\nif (range > 0.0) {\nattenuation *= max(min(1.0 - pow( distance / range, 4.0 ), 1.0), 0.0);\n}\n#else\nattenuation = 1.0/(info.x + info.y * distance + info.z * distance * distance);\n#endif\n\nreturn attenuation;\n}\n\n";},function(t,e){t.exports="#define GLSLIFY 1\nfloat unpackFloat(vec4 rgbaDepth) {\nconst vec4 bitShift = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0);\nfloat depth = dot(rgbaDepth, bitShift);\nreturn depth;\n}\n\n";},function(t,e){t.exports="#define GLSLIFY 1\nbool isOutOfRange(vec2 pos) {\nif (pos.x < 0.0 || pos.x > 1.0 || pos.y < 0.0 || pos.y > 1.0) {\nreturn true;\n}\nreturn false;\n}\n\nfloat getShadow(sampler2D shadowMap, vec2 shadowMapSize, float bias, vec3 fragPos, mat4 lightSpaceMatrix) {\nvec4 fragPosLightSpace = lightSpaceMatrix * vec4(fragPos, 1.0);\nvec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;\nprojCoords = projCoords * 0.5 + 0.5;\nif (isOutOfRange(projCoords.xy)) {\nreturn 1.0;\n}\nfloat currentDepth = projCoords.z;\nfloat shadow = 0.0;\nvec2 texelSize = 1.0 / shadowMapSize;\nfor (int x = -1; x <= 1; ++x) {\nfor (int y = -1; y <= 1; ++y) {\nvec2 pos = projCoords.xy + vec2(x, y) * texelSize;\nif (isOutOfRange(pos)) {\nshadow += 1.0;\n} else {\nfloat pcfDepth = texture2D(shadowMap, pos).r;\nshadow += currentDepth - bias > pcfDepth ? 1.0 : 0.0;\n}\n}\n}\nreturn 1.0 - shadow / 9.0;\n}\n\nfloat getShadow(samplerCube shadowMap, float bias, vec3 lightPos, vec3 position, vec2 camera, mat4 lightSpaceMatrix) {\nvec4 distanceVec = lightSpaceMatrix * vec4(position, 1.0) - lightSpaceMatrix * vec4(lightPos, 1.0);\nfloat currentDistance = length(distanceVec);\nvec3 direction = normalize(distanceVec).xyz;\n\nfloat shadow = 0.0;\nconst float samples = 2.0;\nconst float offset = 0.01;\nconst float step = offset / (samples * 0.5);\nfor(float x = -offset; x < offset; x +=step)\n{\nfor(float y = -offset; y < offset; y +=step)\n{\nfor(float z = -offset; z < offset; z +=step)\n{\nfloat closestDistance = camera[0] + (camera[1] - camera[0]) * unpackFloat(textureCube(shadowMap, direction + vec3(x, y, z)));\nif (closestDistance == camera[0]) {\ncontinue;\n}\nelse if(currentDistance - bias > closestDistance)\nshadow += 1.0;\n}\n}\n}\nshadow /= (samples * samples * samples);\n\nreturn 1.0 - shadow;\n}\n\n";},function(t,e,n){t.exports="#define GLSLIFY 1\n"+n(45)+"\n"+n(70)+"\n\n#ifdef HILO_HAS_LIGHT\n#ifdef HILO_HAS_SPECULAR\nuniform float u_shininess;\n#ifdef HILO_SPECULAR_MAP\nuniform HILO_SAMPLER_2D u_specular;\n#else\nuniform vec4 u_specular;\n#endif\n#endif\n#ifdef HILO_EMISSION_MAP\nuniform HILO_SAMPLER_2D u_emission;\n#else\nuniform vec4 u_emission;\n#endif\n#ifdef HILO_AMBIENT_MAP\nuniform HILO_SAMPLER_2D u_ambient;\n#endif\n#ifdef HILO_SPECULAR_ENV_MAP\n#ifdef HILO_SPECULAR_ENV_MAP_CUBE\nuniform samplerCube u_specularEnvMap;\n#else\nuniform sampler2D u_specularEnvMap;\n#endif\nuniform mat4 u_specularEnvMatrix;\nuniform float u_reflectivity;\nuniform float u_refractRatio;\nuniform float u_refractivity;\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_FIX_MAX_BUG\nfloat hilo_max(float a, float b){\nif (a > b) {\nreturn a;\n}\nreturn b;\n}\n#define HILO_MAX(a, b) hilo_max(a, b);\n#else\n#define HILO_MAX(a, b) max(a, b);\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#if defined(HILO_DIFFUSE_MAP)\ndiffuse = HILO_TEXTURE_2D(u_diffuse);\n#elif defined(HILO_DIFFUSE_CUBE_MAP)\ndiffuse = textureCube(u_diffuse, v_position);\n#elif defined(HILO_HAS_COLOR)\ndiffuse = v_color;\n#else\ndiffuse = u_diffuse;\n#endif\ncolor.a = diffuse.a;";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_LIGHT\nvec3 lightDiffuse = vec3(0, 0, 0);\nvec3 lightAmbient = vec3(0, 0, 0);\nvec3 viewPos = vec3(0, 0, 0);\n\n#ifdef HILO_AMBIENT_MAP\nlightAmbient = HILO_TEXTURE_2D(u_ambient).rgb;\n#else\nlightAmbient = diffuse.rgb;\n#endif\n\n#ifdef HILO_HAS_SPECULAR\nvec3 lightSpecular = vec3(0, 0, 0);\n#ifdef HILO_SPECULAR_MAP\nvec4 specular = HILO_TEXTURE_2D(u_specular);\n#else\nvec4 specular = u_specular;\n#endif\n#endif\n\n#ifdef HILO_EMISSION_MAP\nvec4 emission = HILO_TEXTURE_2D(u_emission);\n#else\nvec4 emission = u_emission;\n#endif\n\n#ifdef HILO_DIRECTIONAL_LIGHTS\nfor(int i = 0;i < HILO_DIRECTIONAL_LIGHTS;i++){\nvec3 lightDir = -u_directionalLightsInfo[i];\n\nfloat shadow = 1.0;\n#ifdef HILO_DIRECTIONAL_LIGHTS_SMC\nif (i < HILO_DIRECTIONAL_LIGHTS_SMC) {\nfloat bias = HILO_MAX(u_directionalLightsShadowBias[i][1] * (1.0 - dot(normal, lightDir)), u_directionalLightsShadowBias[i][0]);\nshadow = getShadow(u_directionalLightsShadowMap[i], u_directionalLightsShadowMapSize[i], bias, v_fragPos, u_directionalLightSpaceMatrix[i]);\n}\n#endif\n\nfloat diff = getDiffuse(normal, lightDir);\nlightDiffuse += diff * u_directionalLightsColor[i] * shadow;\n\n#ifdef HILO_HAS_SPECULAR\nfloat spec = getSpecular(viewPos, v_fragPos, lightDir, normal, u_shininess);\nlightSpecular += spec * u_directionalLightsColor[i] * shadow;\n#endif\n}\n#endif\n\n#ifdef HILO_SPOT_LIGHTS\nfor(int i = 0; i < HILO_SPOT_LIGHTS; i++){\nvec3 lightDir = -u_spotLightsDir[i];\nvec3 distanceVec = u_spotLightsPos[i] - v_fragPos;\n\nfloat shadow = 1.0;\n#ifdef HILO_SPOT_LIGHTS_SMC\nif (i < HILO_SPOT_LIGHTS_SMC) {\nfloat bias = HILO_MAX(u_spotLightsShadowBias[i][1] * (1.0 - dot(normal, lightDir)), u_spotLightsShadowBias[i][0]);\nshadow = getShadow(u_spotLightsShadowMap[i], u_spotLightsShadowMapSize[i], bias, v_fragPos, u_spotLightSpaceMatrix[i]);\n}\n#endif\n\nfloat diff = getDiffuse(normal, normalize(distanceVec));\nfloat theta = dot(normalize(distanceVec), lightDir);\nfloat epsilon = u_spotLightsCutoffs[i][0] - u_spotLightsCutoffs[i][1];\nfloat intensity = clamp((theta - u_spotLightsCutoffs[i][1]) / epsilon, 0.0, 1.0);\nfloat attenuation = getLightAttenuation(distanceVec, u_spotLightsInfo[i], u_spotLightsRange[i]);\n\nlightDiffuse += intensity * attenuation * shadow * diff * u_spotLightsColor[i];\n\n#ifdef HILO_HAS_SPECULAR\nfloat spec = getSpecular(viewPos, v_fragPos, lightDir, normal, u_shininess);\nlightSpecular += intensity * attenuation * shadow * spec * u_spotLightsColor[i];\n#endif\n}\n#endif\n\n#ifdef HILO_POINT_LIGHTS\nfor(int i = 0;i < HILO_POINT_LIGHTS;i++){\nvec3 distanceVec = u_pointLightsPos[i] - v_fragPos;\nvec3 lightDir = normalize(distanceVec);\n\nfloat shadow = 1.0;\n#ifdef HILO_POINT_LIGHTS_SMC\nif (i < HILO_POINT_LIGHTS_SMC) {\nfloat bias = HILO_MAX(u_pointLightsShadowBias[i][1] * (1.0 - dot(normal, lightDir)), u_pointLightsShadowBias[i][0]);\nshadow = getShadow(u_pointLightsShadowMap[i], bias, u_pointLightsPos[i], v_fragPos, u_pointLightCamera[i], u_pointLightSpaceMatrix[i]);\n}\n#endif\n\nfloat diff = getDiffuse(normal, lightDir);\nfloat attenuation = getLightAttenuation(distanceVec, u_pointLightsInfo[i], u_pointLightsRange[i]);\nlightDiffuse += diff * attenuation * u_pointLightsColor[i] * shadow;\n\n#ifdef HILO_HAS_SPECULAR\nfloat spec = getSpecular(viewPos, v_fragPos, lightDir, normal, u_shininess);\nlightSpecular += spec * attenuation * u_pointLightsColor[i] * shadow;\n#endif\n}\n#endif\n\n#ifdef HILO_AREA_LIGHTS\n#ifndef HILO_HAS_SPECULAR\nvec4 specular = vec4(0.0, 0.0, 0.0, 0.0);\n#endif\nvec3 viewDir = normalize(vec3(0, 0, 0) - v_fragPos);\nfor(int i = 0; i < HILO_AREA_LIGHTS; i++){\ncolor.rgb += getAreaLight(diffuse.rgb, specular.rgb, sqrt(2.0/(u_shininess+2.0)), normal, viewDir, v_fragPos, u_areaLightsPos[i], u_areaLightsColor[i], u_areaLightsWidth[i], u_areaLightsHeight[i], u_areaLightsLtcTexture1, u_areaLightsLtcTexture2);\n}\n#endif\n\n#ifdef HILO_AMBIENT_LIGHTS\ncolor.rgb += u_ambientLightsColor * lightAmbient;\n#endif\n\n#if defined(HILO_SPECULAR_ENV_MAP) && defined(HILO_HAS_SPECULAR)\nvec3 I = normalize(v_fragPos - viewPos);\nif (u_reflectivity > 0.0) {\nvec3 R = reflect(I, normal);\nR = normalize(vec3(u_specularEnvMatrix * vec4(R, 1.0)));\nlightSpecular += textureEnvMap(u_specularEnvMap, R).rgb * u_reflectivity;\n}\nif (u_refractivity > 0.0) {\nvec3 R = refract(I, normal, u_refractRatio);\nR = normalize(vec3(u_specularEnvMatrix * vec4(R, 1.0)));\nlightSpecular += textureEnvMap(u_specularEnvMap, R).rgb * u_refractivity;\n}\n#endif\n\ncolor.rgb += lightDiffuse * diffuse.rgb;\n#ifdef HILO_HAS_SPECULAR\ncolor.rgb += lightSpecular * specular.rgb;\n#endif\n\ncolor.rgb += emission.rgb;\n#else\ncolor = diffuse;\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_FOG\nfloat fogFactor = 1.0;\n\n#ifdef HILO_FOG_LINEAR\nfogFactor = (u_fogInfo.y - v_dist)/(u_fogInfo.y - u_fogInfo.x);\n#elif defined(HILO_FOG_EXP)\nfogFactor = exp(-abs(u_fogInfo * v_dist));\n#elif defined(HILO_FOG_EXP2)\nfogFactor = exp(-(u_fogInfo * v_dist) * (u_fogInfo * v_dist)); \n#endif\n\nfogFactor = clamp(fogFactor, 0.0, 1.0);\ncolor = mix(u_fogColor, color, fogFactor);\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_QUANTIZED\n#ifdef HILO_POSITION_QUANTIZED\nuniform mat4 u_positionDecodeMat;\n#endif\n#ifdef HILO_NORMAL_QUANTIZED\nuniform mat4 u_normalDecodeMat;\n#endif\n#ifdef HILO_UV_QUANTIZED\nuniform mat3 u_uvDecodeMat;\n#endif\n#ifdef HILO_UV1_QUANTIZED\nuniform mat3 u_uv1DecodeMat;\n#endif\n\nvec2 unQuantize(vec2 data, mat3 decodeMat) {\nvec3 result = vec3(data, 1.0);\nresult = decodeMat * result;\nreturn result.xy;\n}\n\nvec3 unQuantize(vec3 data, mat4 decodeMat) {\nvec4 result = vec4(data, 1.0);\nresult = decodeMat * result;\nreturn result.xyz;\n}\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_JOINT_COUNT\nattribute vec4 a_skinIndices;\nattribute vec4 a_skinWeights;\n#ifdef HILO_JOINT_MAT_MAP\nuniform sampler2D u_jointMatTexture;\nuniform vec2 u_jointMatTextureSize;\nmat4 getJointMat(float index) {\nindex *= 4.0;\nfloat x = float(mod(index, u_jointMatTextureSize.x));\nfloat y = float(floor(index / u_jointMatTextureSize.x));\nfloat dx = 1.0 / float(u_jointMatTextureSize.x);\nfloat dy = 1.0 / float(u_jointMatTextureSize.y);\ny = dy * (y + 0.5);\nvec4 v1 = texture2D(u_jointMatTexture, vec2(dx * (x + 0.5), y));\nvec4 v2 = texture2D(u_jointMatTexture, vec2(dx * (x + 1.5), y));\nvec4 v3 = texture2D(u_jointMatTexture, vec2(dx * (x + 2.5), y));\nvec4 v4 = texture2D(u_jointMatTexture, vec2(dx * (x + 3.5), y));\nmat4 mat = mat4(v1, v2, v3, v4);\nreturn mat;\n}\n\nmat4 getJointMat(vec4 weights, vec4 indices) {\nmat4 mat = weights.x * getJointMat(indices.x);\nmat += weights.y * getJointMat(indices.y);\nmat += weights.z * getJointMat(indices.z);\nmat += weights.w * getJointMat(indices.w);\nreturn mat;\n}\n#else\nuniform mat4 u_jointMat[HILO_JOINT_COUNT];\n\nmat4 getJointMat(vec4 weights, vec4 indices) {\nmat4 mat = weights.x * u_jointMat[int(indices.x)];\nmat += weights.y * u_jointMat[int(indices.y)];\nmat += weights.z * u_jointMat[int(indices.z)];\nmat += weights.w * u_jointMat[int(indices.w)];\nreturn mat;\n}\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_TEXCOORD0\nattribute vec2 a_texcoord0;\nvarying vec2 v_texcoord0;\n#ifdef HILO_UV_MATRIX\nuniform mat3 u_uvMatrix;\n#endif\n#endif\n\n#ifdef HILO_HAS_TEXCOORD1\nattribute vec2 a_texcoord1;\nvarying vec2 v_texcoord1;\n#ifdef HILO_UV_MATRIX1\nuniform mat3 u_uvMatrix1;\n#endif\n#endif\n\n#ifdef HILO_DIFFUSE_CUBE_MAP\nvarying vec3 v_position;\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_NORMAL\nattribute vec3 a_normal;\nuniform mat3 u_normalMatrix;\nvarying vec3 v_normal;\n\n#ifdef HILO_NORMAL_MAP\nattribute vec4 a_tangent;\nvarying mat3 v_TBN;\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#if defined(HILO_HAS_LIGHT) || defined(HILO_HAS_FOG) || defined(HILO_HAS_FRAG_POS)\nuniform mat4 u_modelViewMatrix;\n#ifdef HILO_HAS_FOG\nvarying float v_dist;\n#endif\n\n#if defined(HILO_HAS_LIGHT) || defined(HILO_HAS_FRAG_POS) \nvarying vec3 v_fragPos;\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_MORPH_TARGET_COUNT\nuniform float u_morphWeights[HILO_MORPH_TARGET_COUNT];\n\n#if HILO_MORPH_TARGET_COUNT > 0\n#ifdef HILO_MORPH_HAS_POSITION\nattribute vec3 a_morphPosition0;\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nattribute vec3 a_morphNormal0;\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\nattribute vec3 a_morphTangent0;\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 1\n#ifdef HILO_MORPH_HAS_POSITION\nattribute vec3 a_morphPosition1;\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nattribute vec3 a_morphNormal1;\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\nattribute vec3 a_morphTangent1;\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 2\n#ifdef HILO_MORPH_HAS_POSITION\nattribute vec3 a_morphPosition2;\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nattribute vec3 a_morphNormal2;\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\nattribute vec3 a_morphTangent2;\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 3\n#ifdef HILO_MORPH_HAS_POSITION\nattribute vec3 a_morphPosition3;\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nattribute vec3 a_morphNormal3;\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\nattribute vec3 a_morphTangent3;\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 4\n#ifdef HILO_MORPH_HAS_POSITION\nattribute vec3 a_morphPosition4;\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nattribute vec3 a_morphNormal4;\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\nattribute vec3 a_morphTangent4;\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 5\n#ifdef HILO_MORPH_HAS_POSITION\nattribute vec3 a_morphPosition5;\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nattribute vec3 a_morphNormal5;\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\nattribute vec3 a_morphTangent5;\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 6\n#ifdef HILO_MORPH_HAS_POSITION\nattribute vec3 a_morphPosition6;\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nattribute vec3 a_morphNormal6;\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\nattribute vec3 a_morphTangent6;\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 7\n#ifdef HILO_MORPH_HAS_POSITION\nattribute vec3 a_morphPosition7;\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nattribute vec3 a_morphNormal7;\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\nattribute vec3 a_morphTangent7;\n#endif\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_COLOR\n#if HILO_COLOR_SIZE == 3\nattribute vec3 a_color;\n#elif HILO_COLOR_SIZE == 4\nattribute vec4 a_color;\n#endif\nvarying vec4 v_color;\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_USE_LOG_DEPTH\n#ifdef HILO_USE_EXT_FRAG_DEPTH\nvarying float v_fragDepth;\n#else\nuniform float u_logDepth;\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_COLOR\n#if HILO_COLOR_SIZE == 3\nv_color = vec4(a_color, 1.0);\n#elif HILO_COLOR_SIZE == 4\nv_color = a_color;\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_QUANTIZED\n#ifdef HILO_POSITION_QUANTIZED\npos.xyz = unQuantize(pos.xyz, u_positionDecodeMat);\n#endif\n#if defined(HILO_HAS_TEXCOORD0) && defined(HILO_UV_QUANTIZED)\nuv = unQuantize(uv, u_uvDecodeMat);\n#endif\n#if defined(HILO_HAS_TEXCOORD1) && defined(HILO_UV1_QUANTIZED)\nuv1 = unQuantize(uv1, u_uv1DecodeMat);\n#endif\n#if defined(HILO_HAS_NORMAL) && defined(HILO_NORMAL_QUANTIZED)\nnormal = unQuantize(normal, u_normalDecodeMat);\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_MORPH_TARGET_COUNT\n#if HILO_MORPH_TARGET_COUNT > 0\n#ifdef HILO_MORPH_HAS_POSITION\npos.xyz += a_morphPosition0 * u_morphWeights[0];\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nnormal += a_morphNormal0 * u_morphWeights[0];\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\ntangent.xyz += a_morphTangent0 * u_morphWeights[0];\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 1\n#ifdef HILO_MORPH_HAS_POSITION\npos.xyz += a_morphPosition1 * u_morphWeights[1];\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nnormal += a_morphNormal1 * u_morphWeights[1];\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\ntangent.xyz += a_morphTangent1 * u_morphWeights[1];\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 2\n#ifdef HILO_MORPH_HAS_POSITION\npos.xyz += a_morphPosition2 * u_morphWeights[2];\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nnormal += a_morphNormal2 * u_morphWeights[2];\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\ntangent.xyz += a_morphTangent2 * u_morphWeights[2];\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 3\n#ifdef HILO_MORPH_HAS_POSITION\npos.xyz += a_morphPosition3 * u_morphWeights[3];\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nnormal += a_morphNormal3 * u_morphWeights[3];\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\ntangent.xyz += a_morphTangent3 * u_morphWeights[3];\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 4\n#ifdef HILO_MORPH_HAS_POSITION\npos.xyz += a_morphPosition4 * u_morphWeights[4];\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nnormal += a_morphNormal4 * u_morphWeights[4];\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\ntangent.xyz += a_morphTangent4 * u_morphWeights[4];\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 5\n#ifdef HILO_MORPH_HAS_POSITION\npos.xyz += a_morphPosition5 * u_morphWeights[5];\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nnormal += a_morphNormal5 * u_morphWeights[5];\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\ntangent.xyz += a_morphTangent5 * u_morphWeights[5];\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 6\n#ifdef HILO_MORPH_HAS_POSITION\npos.xyz += a_morphPosition6 * u_morphWeights[6];\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nnormal += a_morphNormal6 * u_morphWeights[6];\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\ntangent.xyz += a_morphTangent6 * u_morphWeights[6];\n#endif\n#endif\n\n#if HILO_MORPH_TARGET_COUNT > 7\n#ifdef HILO_MORPH_HAS_POSITION\npos.xyz += a_morphPosition7 * u_morphWeights[7];\n#endif\n#if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)\nnormal += a_morphNormal7 * u_morphWeights[7];\n#endif\n#if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)\ntangent.xyz += a_morphTangent7 * u_morphWeights[7];\n#endif\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_JOINT_COUNT\nmat4 skinMat = getJointMat(a_skinWeights, a_skinIndices);\npos = skinMat * pos;\n\n#ifdef HILO_HAS_NORMAL\nnormal = mat3(skinMat) * normal;\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_TEXCOORD0\n#ifdef HILO_UV_MATRIX\nv_texcoord0 = (u_uvMatrix * vec3(uv, 1.0)).xy;\n#else\nv_texcoord0 = uv;\n#endif\n#endif\n#ifdef HILO_HAS_TEXCOORD1\n#ifdef HILO_UV_MATRIX1\nv_texcoord1 = (u_uvMatrix1 * vec3(uv1, 1.0)).xy;\n#else\nv_texcoord1 = uv1;\n#endif\n#endif\n#ifdef HILO_DIFFUSE_CUBE_MAP\nv_position = pos.xyz;\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_HAS_NORMAL\n#ifdef HILO_NORMAL_MAP\nvec3 T = normalize(u_normalMatrix * tangent.xyz);\nvec3 N = normalize(u_normalMatrix * normal);\nT = normalize(T - dot(T, N) * N);\nvec3 B = cross(N, T) * tangent.w;\nv_TBN = mat3(T, B, N);\n#endif\nv_normal = normalize(u_normalMatrix * normal);\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#if defined(HILO_HAS_LIGHT) || defined(HILO_HAS_FOG) || defined(HILO_HAS_FRAG_POS)\nvec3 fragPos = (u_modelViewMatrix * pos).xyz;\n\n#if defined(HILO_HAS_LIGHT) || defined(HILO_HAS_FRAG_POS)\nv_fragPos = fragPos;\n#endif\n\n#ifdef HILO_HAS_FOG\nv_dist = length(fragPos);\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n#ifdef HILO_USE_LOG_DEPTH\n#ifdef HILO_USE_EXT_FRAG_DEPTH\nv_fragDepth = 1.0 + gl_Position.w;\n#else\ngl_Position.z = log2( max( 1e-6, gl_Position.w + 1.0 ) ) * u_logDepth - 1.0;\ngl_Position.z *= gl_Position.w;\n#endif\n#endif";},function(t,e){t.exports="#define GLSLIFY 1\n// https://github.com/playcanvas/engine/blob/master/src/graphics/program-lib/chunks/packDepth.frag\n// Packing a float in GLSL with multiplication and mod\n// http://blog.gradientstudios.com/2012/08/23/shadow-map-improvement\nvec4 packFloat(float depth) {\nconst vec4 bit_shift = vec4(256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0);\nconst vec4 bit_mask  = vec4(0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0);\n\n// combination of mod and multiplication and division works better\nvec4 res = mod(depth * bit_shift * vec4(255), vec4(256) ) / vec4(255);\nres -= res.xxyz * bit_mask;\nreturn res;\n}\n\n\n\n";},function(t,e,n){t.exports="#define GLSLIFY 1\n"+n(45)+"\n"+n(92)+"\n"+n(70)+'\n\nuniform vec4 u_baseColor;\n#ifdef HILO_BASE_COLOR_MAP\nuniform HILO_SAMPLER_2D u_baseColorMap;\n#endif\n\n#ifdef HILO_NEED_WORLD_NORMAL\nuniform mat3 u_viewInverseNormalMatrix;\n#endif\n\n#ifdef HILO_HAS_LIGHT\nuniform float u_metallic;\n#ifdef HILO_METALLIC_MAP\nuniform HILO_SAMPLER_2D u_metallicMap;\n#endif\nuniform float u_roughness;\n#ifdef HILO_ROUGHNESS_MAP\nuniform HILO_SAMPLER_2D u_roughnessMap;\n#endif\n#ifdef HILO_METALLIC_ROUGHNESS_MAP\nuniform HILO_SAMPLER_2D u_metallicRoughnessMap;\n#endif\n#ifdef HILO_OCCLUSION_MAP\nuniform HILO_SAMPLER_2D u_occlusionMap;\n#endif\n\n#ifdef HILO_OCCLUSION_STRENGTH\nuniform float u_occlusionStrength;\n#endif\n\n#ifdef HILO_DIFFUSE_ENV_MAP\n#ifdef HILO_DIFFUSE_ENV_MAP_CUBE\nuniform samplerCube u_diffuseEnvMap;\n#else\nuniform sampler2D u_diffuseEnvMap;\n#endif\nuniform float u_diffuseEnvIntensity;\n#elif defined(HILO_DIFFUSE_ENV_SPHERE_HARMONICS3)\nuniform vec3 u_diffuseEnvSphereHarmonics3[9];\nuniform float u_diffuseEnvIntensity;\n#endif\n#ifdef HILO_SPECULAR_ENV_MAP\nuniform sampler2D u_brdfLUT;\n#ifdef HILO_SPECULAR_ENV_MAP_CUBE\nuniform samplerCube u_specularEnvMap;\n#else\nuniform sampler2D u_specularEnvMap;\n#endif\nuniform float u_specularEnvIntensity;\n\n#ifdef HILO_USE_SHADER_TEXTURE_LOD\nuniform float u_specularEnvMapMipCount;\n#endif\n#endif\n\n#ifdef HILO_EMISSION_MAP\nuniform HILO_SAMPLER_2D u_emission;\n#endif\n\n#ifdef HILO_PBR_SPECULAR_GLOSSINESS\nuniform vec4 u_specular;\nuniform float u_glossiness;\n#ifdef HILO_SPECULAR_GLOSSINESS_MAP\nuniform HILO_SAMPLER_2D u_specularGlossinessMap;\n#endif\n#endif\n\n#ifdef HILO_LIGHT_MAP\nuniform HILO_SAMPLER_2D u_lightMap;\n#endif\n\n\n// PBR Based on https://github.com/KhronosGroup/glTF-WebGL-PBR\n\n// Basic Lambertian diffuse\n// Implementation from Lambert\'s Photometria https://archive.org/details/lambertsphotome00lambgoog\n// See also [1], Equation 1\nvec3 diffuse(vec3 diffuseColor) {\nreturn diffuseColor * HILO_INVERSE_PI;\n}\n\n// The following equation models the Fresnel reflectance term of the spec equation (aka F())\n// Implementation of fresnel from [4], Equation 15\nvec3 specularReflection(vec3 reflectance0, vec3 reflectance90, float VdotH) {\nreturn reflectance0 + (reflectance90 - reflectance0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);\n}\n\n// This calculates the specular geometric attenuation (aka G()),\n// where rougher material will reflect less light back to the viewer.\n// This implementation is based on [1] Equation 4, and we adopt their modifications to\n// alphaRoughness as input as originally proposed in [2].\nfloat geometricOcclusion(float NdotL, float NdotV, float alphaRoughness) {\nfloat r = alphaRoughness * alphaRoughness;\n\nfloat attenuationL = 2.0 * NdotL / (NdotL + sqrt(r + (1.0 - r) * (NdotL * NdotL)));\nfloat attenuationV = 2.0 * NdotV / (NdotV + sqrt(r + (1.0 - r) * (NdotV * NdotV)));\nreturn attenuationL * attenuationV;\n}\n\n// The following equation(s) model the distribution of microfacet normals across the area being drawn (aka D())\n// Implementation from "Average Irregularity Representation of a Roughened Surface for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz\n// Follows the distribution function recommended in the SIGGRAPH 2013 course notes from EPIC Games [1], Equation 3.\nfloat microfacetDistribution(float alphaRoughness, float NdotH) {\nfloat roughnessSq = alphaRoughness * alphaRoughness;\nfloat f = (NdotH * roughnessSq - NdotH) * NdotH + 1.0;\nreturn roughnessSq * HILO_INVERSE_PI / (f * f);\n}\n\nvec3 computeDiffuseSHLight(vec3 normal, in vec3 sh[9]) {\nreturn sh[0] +\nsh[1] * (normal.y) +\nsh[2] * (normal.z) +\nsh[3] * (normal.x) +\nsh[4] * (normal.y * normal.x) +\nsh[5] * (normal.y * normal.z) +\nsh[6] * ((3.0 * normal.z * normal.z) - 1.0) +\nsh[7] * (normal.z * normal.x) +\nsh[8] * (normal.x * normal.x - (normal.y * normal.y));\n}\n\n// https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_lights_image_based/README.md#rgbd\nvec3 decodeRGBD(in vec4 color){\nreturn color.rgb / color.a;\n}\n\nvec3 getIBLContribution(in vec3 N, in vec3 V, vec3 diffuseColor, vec3 specularColor, float ao, float NdotV, float perceptualRoughness) {\nvec3 color = vec3(.0, .0, .0);\n#ifdef HILO_NEED_WORLD_NORMAL\nN = u_viewInverseNormalMatrix * N;\nV = u_viewInverseNormalMatrix * V;\n#endif\n#if defined(HILO_DIFFUSE_ENV_MAP) || defined(HILO_DIFFUSE_ENV_SPHERE_HARMONICS3)\n#ifdef HILO_DIFFUSE_ENV_MAP\n#ifdef HILO_GAMMA_CORRECTION\nvec3 diffuseLight = sRGBToLinear(textureEnvMap(u_diffuseEnvMap, N)).rgb;\n#else\nvec3 diffuseLight = textureEnvMap(u_diffuseEnvMap, N).rgb;\n#endif\n#elif defined(HILO_DIFFUSE_ENV_SPHERE_HARMONICS3)\nvec3 diffuseLight = computeDiffuseSHLight(N, u_diffuseEnvSphereHarmonics3);\n#endif\ncolor.rgb += diffuseLight * diffuseColor * ao * u_diffuseEnvIntensity;\n#endif\n\n#ifdef HILO_SPECULAR_ENV_MAP\nvec3 R = -normalize(reflect(V, N));\nvec3 brdf = texture2D(u_brdfLUT, vec2(NdotV, 1.0 - perceptualRoughness)).rgb;\n#ifdef HILO_USE_SHADER_TEXTURE_LOD\nfloat lod = clamp(perceptualRoughness * u_specularEnvMapMipCount, 0.0, u_specularEnvMapMipCount);\nvec4 specularEnvMap = textureEnvMapLod(u_specularEnvMap, R, lod);\n#else\nvec4 specularEnvMap = textureEnvMap(u_specularEnvMap, R);\n#endif\n\nvec3 specularLight = decodeRGBD(specularEnvMap);\n\n#ifdef HILO_GAMMA_CORRECTION\nspecularLight = sRGBToLinear(specularLight);\n#endif\ncolor.rgb += specularLight * (specularColor * brdf.x + brdf.y) * u_specularEnvIntensity;\n#endif\nreturn color;\n}\n\nvec3 calculateLo(vec3 N, vec3 V, vec3 L, vec3 reflectance0, vec3 reflectance90, float alphaRoughness, vec3 diffuseColor, float NdotV) {\nvec3 H = normalize(L + V);\nfloat NdotL = clamp(dot(N, L), 0.001, 1.0);\nfloat NdotH = clamp(dot(N, H), 0.0, 1.0);\nfloat LdotH = clamp(dot(L, H), 0.0, 1.0);\nfloat VdotH = clamp(dot(V, H), 0.0, 1.0);\n// Calculate the shading terms for the microfacet specular shading model\nvec3 F = specularReflection(reflectance0, reflectance90, VdotH);\nfloat G = geometricOcclusion(NdotL, NdotV, alphaRoughness);\nfloat D = microfacetDistribution(alphaRoughness, NdotH);\n\nvec3 diffuseContrib;\n\n#ifdef HILO_LIGHT_MAP\ndiffuseContrib = vec3(0.0);\n#else\ndiffuseContrib = (1.0 - F) * diffuse(diffuseColor);\n#endif\nvec3 specContrib = F * G * D / (4.0 * NdotL * NdotV);\n// Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)\nreturn NdotL * (diffuseContrib + specContrib);\n}\n#endif';},function(t,e){t.exports="#define GLSLIFY 1\nvec4 sRGBToLinear( in vec4 value ) {\nreturn vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );\n}\n\nvec3 sRGBToLinear( in vec3 value ) {\nreturn vec3( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ));\n}\n\n";},function(t,e,n){t.exports="#define GLSLIFY 1\nvec4 baseColor = u_baseColor;\n\n#ifdef HILO_BASE_COLOR_MAP\n#ifdef HILO_GAMMA_CORRECTION\nbaseColor *= sRGBToLinear(HILO_TEXTURE_2D(u_baseColorMap));\n#else\nbaseColor *= HILO_TEXTURE_2D(u_baseColorMap);\n#endif\n#endif\n\n#if defined(HILO_HAS_COLOR)\nbaseColor *= v_color;\n#endif\n\ncolor.a = baseColor.a;\n\n"+n(50)+"\n\n#ifdef HILO_HAS_LIGHT\nvec3 viewPos = vec3(0, 0, 0);\nvec3 N = normal;\nvec3 V = normalize(viewPos - v_fragPos);\n\n#ifdef HILO_OCCLUSION_MAP\nfloat ao  = HILO_TEXTURE_2D(u_occlusionMap).r;\n#else\nfloat ao = 1.0;\n#endif\n\n#ifdef HILO_PBR_SPECULAR_GLOSSINESS\nvec3 specular = u_specular.rgb;\nfloat glossiness = u_glossiness;\n#ifdef HILO_SPECULAR_GLOSSINESS_MAP\nvec4 specularGlossiness = sRGBToLinear(HILO_TEXTURE_2D(u_specularGlossinessMap));\nspecular = specularGlossiness.rgb * specular;\nglossiness = specularGlossiness.a * glossiness;\n#endif\nfloat roughness = 1.0 - glossiness;\nfloat metallic = 0.0;\nvec3 diffuseColor = baseColor.rgb * (1.0 - max(max(specular.r, specular.g), specular.b));\nvec3 specularColor = specular;\n#else\nfloat metallic = u_metallic;\nfloat roughness = u_roughness;\n#ifdef HILO_METALLIC_MAP\nmetallic = HILO_TEXTURE_2D(u_metallicMap).r * u_metallic;\n#endif\n#ifdef HILO_ROUGHNESS_MAP\nroughness  = HILO_TEXTURE_2D(u_roughnessMap).r * u_roughness;\n#endif\n#ifdef HILO_METALLIC_ROUGHNESS_MAP\nvec4 metallicRoughnessMap = HILO_TEXTURE_2D(u_metallicRoughnessMap);\n#ifdef HILO_IS_OCCLUSION_MAP_IN_METALLIC_ROUGHNESS_MAP\nao = metallicRoughnessMap.r;\n#endif\nroughness = metallicRoughnessMap.g * u_roughness;\nmetallic = metallicRoughnessMap.b * u_metallic;\n#endif\nroughness = clamp(roughness, 0.04, 1.0);\nmetallic = clamp(metallic, 0.0, 1.0);\nvec3 f0 = vec3(0.04);\nvec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0);\ndiffuseColor *= 1.0 - metallic;\nvec3 specularColor = mix(f0, baseColor.rgb, metallic);\n#endif\n\n#ifdef HILO_OCCLUSION_STRENGTH\nao = mix(1.0, ao, u_occlusionStrength);\n#endif\n\nfloat reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);\n// For typical incident reflectance range (between 4% to 100%) set the grazing reflectance to 100% for typical fresnel effect.\n// For very low reflectance range on highly diffuse objects (below 4%), incrementally reduce grazing reflecance to 0%.\nfloat reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);\nvec3 specularEnvironmentR0 = specularColor.rgb;\nvec3 specularEnvironmentR90 = vec3(1.0, 1.0, 1.0) * reflectance90;\n\nfloat NdotV = clamp(abs(dot(N, V)), 0.001, 1.0);\nfloat alphaRoughness = roughness * roughness;\n\n#ifdef HILO_DIRECTIONAL_LIGHTS\nfor(int i = 0;i < HILO_DIRECTIONAL_LIGHTS;i++){\nvec3 lightDir = normalize(-u_directionalLightsInfo[i]);\nvec3 radiance = u_directionalLightsColor[i];\nfloat shadow = 1.0;\n#ifdef HILO_DIRECTIONAL_LIGHTS_SMC\nif (i < HILO_DIRECTIONAL_LIGHTS_SMC) {\nfloat bias = HILO_MAX(u_directionalLightsShadowBias[i][1] * (1.0 - dot(N, lightDir)), u_directionalLightsShadowBias[i][0]);\nshadow = getShadow(u_directionalLightsShadowMap[i], u_directionalLightsShadowMapSize[i], bias, v_fragPos, u_directionalLightSpaceMatrix[i]);\n}\n#endif\ncolor.rgb += shadow * radiance * calculateLo(N, V, lightDir, specularEnvironmentR0, specularEnvironmentR90, alphaRoughness, diffuseColor, NdotV);\n}\n#endif\n\n#ifdef HILO_SPOT_LIGHTS\nfor(int i = 0; i < HILO_SPOT_LIGHTS; i++){\nvec3 lightDir = normalize(-u_spotLightsDir[i]);\nvec3 distanceVec = u_spotLightsPos[i] - v_fragPos;\n\nfloat theta = dot(normalize(distanceVec), lightDir);\nfloat epsilon = u_spotLightsCutoffs[i][0] - u_spotLightsCutoffs[i][1];\nfloat intensity = clamp((theta - u_spotLightsCutoffs[i][1]) / epsilon, 0.0, 1.0);\nfloat attenuation = getLightAttenuation(distanceVec, u_spotLightsInfo[i], u_spotLightsRange[i]);\nvec3 radiance = intensity * attenuation * u_spotLightsColor[i];\n\nfloat shadow = 1.0;\n#ifdef HILO_SPOT_LIGHTS_SMC\nif (i < HILO_SPOT_LIGHTS_SMC) {\nfloat bias = HILO_MAX(u_spotLightsShadowBias[i][1] * (1.0 - dot(N, lightDir)), u_spotLightsShadowBias[i][0]);\nshadow = getShadow(u_spotLightsShadowMap[i], u_spotLightsShadowMapSize[i], bias, v_fragPos, u_spotLightSpaceMatrix[i]);\n}\n#endif\ncolor.rgb += shadow * radiance * calculateLo(N, V, lightDir, specularEnvironmentR0, specularEnvironmentR90, alphaRoughness, diffuseColor, NdotV);\n}\n#endif\n\n#ifdef HILO_POINT_LIGHTS\nfor(int i = 0; i < HILO_POINT_LIGHTS; i++){\nvec3 distanceVec = u_pointLightsPos[i] - v_fragPos;\nvec3 lightDir = normalize(distanceVec);\n\nfloat shadow = 1.0;\n#ifdef HILO_POINT_LIGHTS_SMC\nif (i < HILO_POINT_LIGHTS_SMC) {\nfloat bias = HILO_MAX(u_pointLightsShadowBias[i][1] * (1.0 - dot(normal, lightDir)), u_pointLightsShadowBias[i][0]);\nshadow = getShadow(u_pointLightsShadowMap[i], bias, u_pointLightsPos[i], v_fragPos, u_pointLightCamera[i], u_pointLightSpaceMatrix[i]);\n}\n#endif\n\nfloat attenuation = getLightAttenuation(distanceVec, u_pointLightsInfo[i], u_pointLightsRange[i]);\nvec3 radiance = attenuation * u_pointLightsColor[i];\n\ncolor.rgb += shadow * radiance * calculateLo(N, V, lightDir, specularEnvironmentR0, specularEnvironmentR90, alphaRoughness, diffuseColor, NdotV);\n}\n#endif\n\n#ifdef HILO_AREA_LIGHTS\nfor(int i = 0; i < HILO_AREA_LIGHTS; i++){\ncolor.rgb += getAreaLight(diffuseColor, specularColor, roughness, N, V, v_fragPos, u_areaLightsPos[i], u_areaLightsColor[i], u_areaLightsWidth[i], u_areaLightsHeight[i], u_areaLightsLtcTexture1, u_areaLightsLtcTexture2);\n}\n#endif\n\n#ifdef HILO_LIGHT_MAP\nvec4 lightMapColor = HILO_TEXTURE_2D(u_lightMap);\n// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_lights_image_based#rgbd\ncolor.rgb += baseColor.rgb * decodeRGBD(lightMapColor);\n#endif\n\n// IBL\ncolor.rgb += getIBLContribution(N, V, diffuseColor, specularColor, ao, NdotV, roughness);\n\n#if defined(HILO_AMBIENT_LIGHTS) && (defined(HILO_IS_DIFFUESENV_AND_AMBIENTLIGHT_WORK_TOGETHER) || (!defined(HILO_DIFFUSE_ENV_MAP) && !defined(HILO_DIFFUSE_ENV_SPHERE_HARMONICS3)))\ncolor.rgb += u_ambientLightsColor * baseColor.rgb * ao;\n#endif\n\n#ifdef HILO_EMISSION_MAP\n#ifdef HILO_GAMMA_CORRECTION\ncolor.rgb += sRGBToLinear(HILO_TEXTURE_2D(u_emission)).rgb;\n#else\ncolor.rgb += HILO_TEXTURE_2D(u_emission).rgb;\n#endif\n#endif\n#else\ncolor = baseColor;\n#endif";},function(t,e,n){var i=n(95),r=n(27),s=n(31),a=1e-6,o=[0,0,0],u=[0,0,0],c=[0,0,0],h=[0,0,0],f=[0,0,0];t.exports=function(t,e,n,l){s(o,l[1],l[0]),s(u,l[2],l[0]),i(h,n,u);var d=r(o,h);if(d<a)return null;s(c,e,l[0]);var m=r(c,h);if(m<0||m>d)return null;i(f,c,o);var _=r(n,f);if(_<0||m+_>d)return null;var p=r(u,f)/d;return t[0]=e[0]+p*n[0],t[1]=e[1]+p*n[1],t[2]=e[2]+p*n[2],t};},function(t,e){t.exports=function(t,e,n){var i=e[0],r=e[1],s=e[2],a=n[0],o=n[1],u=n[2];return t[0]=r*u-s*o,t[1]=s*a-i*u,t[2]=i*o-r*a,t};},function(t,e,n){var i=n(27),r=n(32),s=n(33),a=n(34);t.exports=function(t,e,n,u,c){var h=i(n,u);if(0!==h){var f=-(i(e,u)+c)/h;return f<0?null:(s(o,n,f),r(t,e,o))}return i(u,e)+c===0?a(t,e):null};var o=[0,0,0];},function(t,e,n){var i=n(98),r=n(27),s=n(31),a=n(99),o=n(33),u=n(32),c=[0,0,0];t.exports=function(t,e,n,h,f){s(c,h,e);var l=r(n,c);if(l<0)return null;a(c,e,n,l);var d=i(h,c),m=f*f;if(d>m)return null;return o(t,n,l-Math.sqrt(m-d)),u(t,t,e)};},function(t,e){t.exports=function(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2];return n*n+i*i+r*r};},function(t,e){t.exports=function(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t};},function(t,e){function n(t,e,n){for(var i=t.length,r=-1/0,s=1/0,a=0;a<i;a++){var o=(n[0][a]-t[a])/e[a],u=(n[1][a]-t[a])/e[a];if(o>u){var c=o;o=u,u=c;}if(u<r||o>s)return 1/0;o>r&&(r=o),u<s&&(s=u);}return r>s?1/0:r}t.exports=function(t,e,i,r){var s=n(e,i,r);if(s===1/0)t=null;else{t=t||[];for(var a=0;a<e.length;a++)t[a]=e[a]+i[a]*s;}return t},t.exports.distance=n;},function(t,e,n){/*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */var i=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable;function a(t){if(null==t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}t.exports=function(){try{if(!Object.assign)return !1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return !1;for(var e={},n=0;n<10;n++)e["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(e).map(function(t){return e[t]}).join(""))return !1;var i={};return "abcdefghijklmnopqrst".split("").forEach(function(t){i[t]=t;}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},i)).join("")}catch(t){return !1}}()?Object.assign:function(t,e){for(var n,o,u=a(t),c=1;c<arguments.length;c++){for(var h in n=Object(arguments[c]))r.call(n,h)&&(u[h]=n[h]);if(i){o=i(n);for(var f=0;f<o.length;f++)s.call(n,o[f])&&(u[o[f]]=n[o[f]]);}}return u};},function(t,e,n){var i,r,s,a;Object.keys||(Object.keys=(i=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),a=(s=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(t){if("object"!=typeof t&&("function"!=typeof t||null===t))throw new TypeError("Object.keys called on non-object");var e,n,o=[];for(e in t)i.call(t,e)&&o.push(e);if(r)for(n=0;n<a;n++)i.call(t,s[n])&&o.push(s[n]);return o}));},function(t,e,n){t.exports=function(t){return Object.keys(t).map(function(e){return t[e]})};},function(t,e,n){t.exports="function"==typeof Promise?Promise:n(109);},function(t,e){var n=function(){function t(t,e,n,i,r){return t=t||{},e&&(t.EaseIn=e),n&&(t.EaseOut=n),i&&(t.EaseInOut=i),r&&(t.EaseNone=r),t}var e=t(null,null,null,null,function(t){return t}),n=t(null,function(t){return t*t},function(t){return -t*(t-2)},function(t){return (t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)}),i=t(null,function(t){return t*t*t},function(t){return --t*t*t+1},function(t){return (t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)}),r=t(null,function(t){return t*t*t*t},function(t){return -(--t*t*t*t-1)},function(t){return (t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)}),s=t(null,function(t){return t*t*t*t*t},function(t){return (t-=1)*t*t*t*t+1},function(t){return (t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)}),a=Math,o=a.PI,u=.5*o,c=a.sin,h=a.cos,f=a.pow,l=a.sqrt,d=t(null,function(t){return 1-h(t*u)},function(t){return c(t*u)},function(t){return -.5*(h(o*t)-1)}),m=t(null,function(t){return 0==t?0:f(2,10*(t-1))},function(t){return 1==t?1:1-f(2,-10*t)},function(t){return 0==t||1==t?t:(t*=2)<1?.5*f(2,10*(t-1)):.5*(2-f(2,-10*(t-1)))}),_=t(null,function(t){return -(l(1-t*t)-1)},function(t){return l(1- --t*t)},function(t){return (t/=.5)<1?-.5*(l(1-t*t)-1):.5*(l(1-(t-=2)*t)+1)}),p=t({a:1,p:.4,s:.1,config:function(t,e){p.a=t,p.p=e,p.s=e/(2*o)*Math.asin(1/t)||0;}},function(t){return -p.a*f(2,10*(t-=1))*c((t-p.s)*(2*o)/p.p)},function(t){return p.a*f(2,-10*t)*c((t-p.s)*(2*o)/p.p)+1},function(t){return (t*=2)<1?p.a*f(2,10*(t-=1))*c((t-p.s)*(2*o)/p.p)*-.5:p.a*f(2,-10*(t-=1))*c((t-p.s)*(2*o)/p.p)*.5+1}),g=t({o:1.70158,s:2.59491,config:function(t){g.o=t,g.s=1.525*t;}},function(t){return t*t*((g.o+1)*t-g.o)},function(t){return (t-=1)*t*((g.o+1)*t+g.o)+1},function(t){return (t*=2)<1?t*t*((g.s+1)*t-g.s)*.5:.5*((t-=2)*t*((g.s+1)*t+g.s)+2)}),v=t(null,function(t){return 1-v.EaseOut(1-t)},function(t){return (t/=1)<.36364?7.5625*t*t:t<.72727?7.5625*(t-=.54545)*t+.75:t<.90909?7.5625*(t-=.81818)*t+.9375:7.5625*(t-=.95455)*t+.984375},function(t){return t<.5?.5*v.EaseIn(2*t):.5*v.EaseOut(2*t-1)+.5});return {Linear:e,Quad:n,Cubic:i,Quart:r,Quint:s,Sine:d,Expo:m,Circ:_,Elastic:p,Back:g,Bounce:v}}();t.exports=n;},function(t,e){var n="#\\?RADIANCE",i="#.*",r="EXPOSURE=\\s*([0-9]*[.][0-9]*)",s="FORMAT=32-bit_rle_rgbe",a="-Y ([0-9]+) \\+X ([0-9]+)";t.exports=function(t){t instanceof ArrayBuffer&&(t=new Uint8Array(t));var e=0,o=t.length,u=10;function c(){var n="";do{var i=t[e];if(i==u){++e;break}n+=String.fromCharCode(i);}while(++e<o);return n}for(var h=0,f=0,l=1,d=!1,m=0;m<20;m++){var _,p=c();if(_=p.match(n));else if(_=p.match(s))d=!0;else if(_=p.match(r))l=Number(_[1]);else if(_=p.match(i));else if(_=p.match(a)){f=Number(_[1]),h=Number(_[2]);break}}if(!d)throw new Error("File is not run length encoded!");var g=new Uint8Array(h*f*4);!function(t,e,n,i,r,s){var a,o,u,c=new Array(4),h=null,f=new Array(2),l=t.length;function d(e){var n=0;do{e[n++]=t[i];}while(++i<l&&n<e.length);return n}function m(e,n,r){var s=0;do{e[n+s++]=t[i];}while(++i<l&&s<r);return s}function _(t,e,n,i){var r=4*i,s=m(e,n,r);if(s<r)throw new Error("Error reading raw pixels: got "+s+" bytes, expected "+r)}for(;s>0;){if(d(c)<c.length)throw new Error("Error reading bytes: expected "+c.length);if(2!=c[0]||2!=c[1]||0!=(128&c[2]))return e[n++]=c[0],e[n++]=c[1],e[n++]=c[2],e[n++]=c[3],void _(0,e,n,r*s-1);if(((255&c[2])<<8|255&c[3])!=r)throw new Error("Wrong scanline width "+((255&c[2])<<8|255&c[3])+", expected "+r);null==h&&(h=new Array(4*r)),a=0;for(var p=0;p<4;p++)for(o=(p+1)*r;a<o;){if(d(f)<f.length)throw new Error("Error reading 2-byte buffer");if((255&f[0])>128){if(0==(u=(255&f[0])-128)||u>o-a)throw new Error("Bad scanline data");for(;u-- >0;)h[a++]=f[1];}else{if(0==(u=255&f[0])||u>o-a)throw new Error("Bad scanline data");if(h[a++]=f[1],--u>0){if(m(h,a,u)<u)throw new Error("Error reading non-run data");a+=u;}}}for(p=0;p<r;p++)e[n+0]=h[p],e[n+1]=h[p+r],e[n+2]=h[p+2*r],e[n+3]=h[p+3*r],n+=4;s--;}}(t,g,0,e,h,f);for(var v=new Float32Array(h*f*4),E=0;E<g.length;E+=4){var T=g[E+0]/255,M=g[E+1]/255,A=g[E+2]/255,I=g[E+3],L=Math.pow(2,I-128);T*=L,M*=L,A*=L;var O=E;v[O+0]=T,v[O+1]=M,v[O+2]=A,v[O+3]=1;}return {shape:[h,f],exposure:l,gamma:1,data:v}};},function(t,e,n){var i=n(19),r=n(60),s=i.create({constructor:function(t){this._targetFPS=t||60,this._interval=1e3/this._targetFPS,this._tickers=[];},_paused:!1,_targetFPS:0,_interval:0,_intervalId:null,_tickers:null,_lastTime:0,_tickCount:0,_tickTime:0,_measuredFPS:0,start:function(t){if(void 0===t&&(t=!0),!this._intervalId){this._lastTime=+new Date;var e,n=this,i=this._interval,s=window.requestAnimationFrame||window[r.jsVendor+"RequestAnimationFrame"];t&&s&&i<17?(this._useRAF=!0,e=function(){n._intervalId=s(e),n._tick();}):e=function(){n._intervalId=setTimeout(e,i),n._tick();},this._paused=!1,e();}},stop:function(){this._useRAF?(window.cancelAnimationFrame||window[r.jsVendor+"CancelAnimationFrame"])(this._intervalId):clearTimeout(this._intervalId);this._intervalId=null,this._lastTime=0,this._paused=!0;},pause:function(){this._paused=!0;},resume:function(){this._paused=!1;},_tick:function(){if(!this._paused){var t=+new Date,e=t-this._lastTime,n=this._tickers;++this._tickCount>=this._targetFPS?(this._measuredFPS=1e3/(this._tickTime/this._tickCount)+.5>>0,this._tickCount=0,this._tickTime=0):this._tickTime+=t-this._lastTime,this._lastTime=t;for(var i=n.slice(0),r=0,s=i.length;r<s;r++)i[r].tick(e);}},getMeasuredFPS:function(){return Math.min(this._measuredFPS,this._targetFPS)},addTick:function(t){if(!t||"function"!=typeof t.tick)throw new Error("Ticker: The tick object must implement the tick method.");this._tickers.push(t);},removeTick:function(t){var e=this._tickers,n=e.indexOf(t);n>=0&&e.splice(n,1);},nextTick:function(t){var e=this,n={tick:function(i){e.removeTick(n),t();}};return e.addTick(n),n},timeout:function(t,e){var n=this,i=(new Date).getTime()+e,r={tick:function(){(new Date).getTime()-i>=0&&(n.removeTick(r),t());}};return n.addTick(r),r},interval:function(t,e){var n=(new Date).getTime()+e,i={tick:function(){var i=(new Date).getTime(),r=i-n;r>=0&&(r<e&&(i-=r),n=i+e,t());}};return this.addTick(i),i}});t.exports=s;},function(t,e,n){n.r(e);var i=n(101),r=n.n(i),s=n(102),a=n.n(s),o=n(103),u=n.n(o),c=n(104),h=n.n(c);Object.assign||(Object.assign=r.a),Object.keys||(Object.keys=a.a),Object.values||(Object.values=u.a),"undefined"==typeof Promise&&(window.Promise=h.a);},function(t,e,n){(function(e,n){var i,r="pending",s="settled",a="fulfilled",o="rejected",u=function(){},c=void 0!==e&&void 0!==e.process&&"function"==typeof e.process.emit,h=void 0===n?setTimeout:n,f=[];function l(){for(var t=0;t<f.length;t++)f[t][0](f[t][1]);f=[],i=!1;}function d(t,e){f.push([t,e]),i||(i=!0,h(l,0));}function m(t){var e=t.owner,n=e._state,i=e._data,r=t[n],s=t.then;if("function"==typeof r){n=a;try{i=r(i);}catch(t){v(s,t);}}_(s,i)||(n===a&&p(s,i),n===o&&v(s,i));}function _(t,e){var n;try{if(t===e)throw new TypeError("A promises callback cannot return that same promise.");if(e&&("function"==typeof e||"object"==typeof e)){var i=e.then;if("function"==typeof i)return i.call(e,function(i){n||(n=!0,e===i?g(t,i):p(t,i));},function(e){n||(n=!0,v(t,e));}),!0}}catch(e){return n||v(t,e),!0}return !1}function p(t,e){t!==e&&_(t,e)||g(t,e);}function g(t,e){t._state===r&&(t._state=s,t._data=e,d(T,t));}function v(t,e){t._state===r&&(t._state=s,t._data=e,d(M,t));}function E(t){t._then=t._then.forEach(m);}function T(t){t._state=a,E(t);}function M(t){t._state=o,E(t),!t._handled&&c&&e.process.emit("unhandledRejection",t._data,t);}function A(t){e.process.emit("rejectionHandled",t);}function I(t){if("function"!=typeof t)throw new TypeError("Promise resolver "+t+" is not a function");if(this instanceof I==!1)throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this._then=[],function(t,e){function n(t){v(e,t);}try{t(function(t){p(e,t);},n);}catch(t){n(t);}}(t,this);}I.prototype={constructor:I,_state:r,_then:null,_data:void 0,_handled:!1,then:function(t,e){var n={owner:this,then:new this.constructor(u),fulfilled:t,rejected:e};return !e&&!t||this._handled||(this._handled=!0,this._state===o&&c&&d(A,this)),this._state===a||this._state===o?d(m,n):this._then.push(n),n.then},catch:function(t){return this.then(null,t)}},I.all=function(t){if(!Array.isArray(t))throw new TypeError("You must pass an array to Promise.all().");return new I(function(e,n){var i=[],r=0;function s(t){return r++,function(n){i[t]=n,--r||e(i);}}for(var a,o=0;o<t.length;o++)(a=t[o])&&"function"==typeof a.then?a.then(s(o),n):i[o]=a;r||e(i);})},I.race=function(t){if(!Array.isArray(t))throw new TypeError("You must pass an array to Promise.race().");return new I(function(e,n){for(var i,r=0;r<t.length;r++)(i=t[r])&&"function"==typeof i.then?i.then(e,n):e(i);})},I.resolve=function(t){return t&&"object"==typeof t&&t.constructor===I?t:new I(function(e){e(t);})},I.reject=function(t){return new I(function(e,n){n(t);})},t.exports=I;}).call(this,n(39),n(110).setImmediate);},function(t,e,n){(function(t){var i=void 0!==t&&t||"undefined"!=typeof self&&self||window,r=Function.prototype.apply;function s(t,e){this._id=t,this._clearFn=e;}e.setTimeout=function(){return new s(r.call(setTimeout,i,arguments),clearTimeout)},e.setInterval=function(){return new s(r.call(setInterval,i,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close();},s.prototype.unref=s.prototype.ref=function(){},s.prototype.close=function(){this._clearFn.call(i,this._id);},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e;},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1;},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout();},e));},n(111),e.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==t&&t.setImmediate||this&&this.setImmediate,e.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==t&&t.clearImmediate||this&&this.clearImmediate;}).call(this,n(39));},function(t,e,n){(function(t,e){!function(t,n){if(!t.setImmediate){var i,r,s,a,o,u=1,c={},h=!1,f=t.document,l=Object.getPrototypeOf&&Object.getPrototypeOf(t);l=l&&l.setTimeout?l:t,"[object process]"==={}.toString.call(t.process)?i=function(t){e.nextTick(function(){m(t);});}:!function(){if(t.postMessage&&!t.importScripts){var e=!0,n=t.onmessage;return t.onmessage=function(){e=!1;},t.postMessage("","*"),t.onmessage=n,e}}()?t.MessageChannel?((s=new MessageChannel).port1.onmessage=function(t){m(t.data);},i=function(t){s.port2.postMessage(t);}):f&&"onreadystatechange"in f.createElement("script")?(r=f.documentElement,i=function(t){var e=f.createElement("script");e.onreadystatechange=function(){m(t),e.onreadystatechange=null,r.removeChild(e),e=null;},r.appendChild(e);}):i=function(t){setTimeout(m,0,t);}:(a="setImmediate$"+Math.random()+"$",o=function(e){e.source===t&&"string"==typeof e.data&&0===e.data.indexOf(a)&&m(+e.data.slice(a.length));},t.addEventListener?t.addEventListener("message",o,!1):t.attachEvent("onmessage",o),i=function(e){t.postMessage(a+e,"*");}),l.setImmediate=function(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var r={callback:t,args:e};return c[u]=r,i(u),u++},l.clearImmediate=d;}function d(t){delete c[t];}function m(t){if(h)setTimeout(m,0,t);else{var e=c[t];if(e){h=!0;try{!function(t){var e=t.callback,i=t.args;switch(i.length){case 0:e();break;case 1:e(i[0]);break;case 2:e(i[0],i[1]);break;case 3:e(i[0],i[1],i[2]);break;default:e.apply(n,i);}}(e);}finally{d(t),h=!1;}}}}}("undefined"==typeof self?void 0===t?this:t:self);}).call(this,n(39),n(112));},function(t,e){var n,i,r=t.exports={};function s(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function o(t){if(n===setTimeout)return setTimeout(t,0);if((n===s||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:s;}catch(t){n=s;}try{i="function"==typeof clearTimeout?clearTimeout:a;}catch(t){i=a;}}();var u,c=[],h=!1,f=-1;function l(){h&&u&&(h=!1,u.length?c=u.concat(c):f=-1,c.length&&d());}function d(){if(!h){var t=o(l);h=!0;for(var e=c.length;e;){for(u=c,c=[];++f<e;)u&&u[f].run();f=-1,e=c.length;}u=null,h=!1,function(t){if(i===clearTimeout)return clearTimeout(t);if((i===a||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(t);try{i(t);}catch(e){try{return i.call(null,t)}catch(e){return i.call(this,t)}}}(t);}}function m(t,e){this.fun=t,this.array=e;}function _(){}r.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];c.push(new m(t,e)),1!==c.length||h||o(d);},m.prototype.run=function(){this.fun.apply(null,this.array);},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=_,r.addListener=_,r.once=_,r.off=_,r.removeListener=_,r.removeAllListeners=_,r.emit=_,r.prependListener=_,r.prependOnceListener=_,r.listeners=function(t){return []},r.binding=function(t){throw new Error("process.binding is not supported")},r.cwd=function(){return "/"},r.chdir=function(t){throw new Error("process.chdir is not supported")},r.umask=function(){return 0};},function(t,e,n){t.exports="#define GLSLIFY 1\n// modified from https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/lights_physical_pars_fragment.glsl#L26\n\n"+n(63)+"\n\nvec2 LTC_Uv(const in vec3 N, const in vec3 V, const in float roughness) {\nconst float LUT_SIZE = 64.0;\nconst float LUT_SCALE = (LUT_SIZE - 1.0) / LUT_SIZE;\nconst float LUT_BIAS = 0.5 / LUT_SIZE;\nfloat dotNV = clamp(dot(N, V), 0.0, 1.0);\nvec2 uv = vec2(roughness, sqrt(1.0 - dotNV));\nuv = (uv * LUT_SCALE) + LUT_BIAS;\nreturn uv;\n}\n\nfloat LTC_ClippedSphereFormFactor(const in vec3 f) {\nfloat l = length(f);\nreturn max(((l * l) + f.z) / (l + 1.0), 0.0);\n}\n\nvec3 LTC_EdgeVectorFormFactor(const in vec3 v1, const in vec3 v2) {\nfloat x = dot(v1, v2);\nfloat y = abs(x);\nfloat a = 0.8543985 + ((0.4965155 + (0.0145206 * y)) * y);\nfloat b = 3.4175940 + ((4.1616724 + y) * y);\nfloat v = a / b;\nfloat theta_sintheta = x > 0.0 ? v : (0.5 * inversesqrt(max(1.0 - (x * x), 1e-7))) - v;\nreturn cross(v1, v2) * theta_sintheta;\n}\n\nvec3 LTC_Evaluate(const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[4]) {\nvec3 v1 = rectCoords[1] - rectCoords[0];\nvec3 v2 = rectCoords[3] - rectCoords[0];\nvec3 lightNormal = cross(v1, v2);\nif (dot(lightNormal, P - rectCoords[0]) < 0.0)\nreturn vec3(0.0);\nvec3 T1, T2;\nT1 = normalize(V - (N * dot(V, N)));\nT2 = -cross(N, T1);\nmat3 mat = mInv * transpose(mat3(T1, T2, N));\nvec3 coords[4];\ncoords[0] = mat * (rectCoords[0] - P);\ncoords[1] = mat * (rectCoords[1] - P);\ncoords[2] = mat * (rectCoords[2] - P);\ncoords[3] = mat * (rectCoords[3] - P);\ncoords[0] = normalize(coords[0]);\ncoords[1] = normalize(coords[1]);\ncoords[2] = normalize(coords[2]);\ncoords[3] = normalize(coords[3]);\nvec3 vectorFormFactor = vec3(0.0);\nvectorFormFactor += LTC_EdgeVectorFormFactor(coords[0], coords[1]);\nvectorFormFactor += LTC_EdgeVectorFormFactor(coords[1], coords[2]);\nvectorFormFactor += LTC_EdgeVectorFormFactor(coords[2], coords[3]);\nvectorFormFactor += LTC_EdgeVectorFormFactor(coords[3], coords[0]);\nfloat result = LTC_ClippedSphereFormFactor(vectorFormFactor);\nreturn vec3(result);\n}\n\nvec3 getAreaLight(const in vec3 diffuseColor, const in vec3 specularColor, const in float roughness, const in vec3 normal, const in vec3 viewDir, const in vec3 position, const in vec3 lightPos, const in vec3 lightColor, const in vec3 halfWidth, const in vec3 halfHeight, const in sampler2D areaLightsLtcTexture1, const in sampler2D areaLightsLtcTexture2){\nvec3 rectCoords[4];\nrectCoords[0] = (lightPos - halfWidth) - halfHeight;\nrectCoords[1] = (lightPos + halfWidth) - halfHeight;\nrectCoords[2] = (lightPos + halfWidth) + halfHeight;\nrectCoords[3] = (lightPos - halfWidth) + halfHeight;\n\nvec2 uv = LTC_Uv(normal, viewDir, roughness);\nvec4 t1 = texture2D(areaLightsLtcTexture1, uv);\nvec4 t2 = texture2D(areaLightsLtcTexture2, uv);\n\nmat3 mInv = mat3(vec3(t1.x, 0, t1.y), vec3(0, 1, 0), vec3(t1.z, 0, t1.w));\nvec3 fresnel = (specularColor * t2.x) + ((vec3(1.0) - specularColor) * t2.y);\n\nvec3 color = vec3(0.0, 0.0, 0.0);\ncolor += ((lightColor * fresnel) * LTC_Evaluate(normal, viewDir, position, mInv, rectCoords));\ncolor += ((lightColor * diffuseColor) * LTC_Evaluate(normal, viewDir, position, mat3(1.0), rectCoords));\nreturn color;\n}\n\n";},function(t,e,n){n.r(e);var i={};n.r(i),n.d(i,"ALI_amc_mesh_compression",function(){return jn}),n.d(i,"WEB3D_quantized_attributes",function(){return zn}),n.d(i,"HILO_animation_clips",function(){return qn}),n.d(i,"ALI_animation_clips",function(){return Wn}),n.d(i,"ALI_bounding_box",function(){return Yn}),n.d(i,"KHR_materials_pbrSpecularGlossiness",function(){return Zn}),n.d(i,"KHR_lights_punctual",function(){return Kn}),n.d(i,"KHR_techniques_webgl",function(){return Qn});var r=n(4),s=n(1),a=n(9),o=n(7),u=n(22),c=n(5),h=n(17),f=n(23),l=n(10),d=n(6),m=n(3),_=new c.a(0,1,0),p=new o.a,g=s.a.create({Statics:{TRAVERSE_STOP_NONE:!1,TRAVERSE_STOP_CHILDREN:1,TRAVERSE_STOP_ALL:!0},Mixes:a.a,isNode:!0,className:"Node",name:"",animationId:"",autoUpdateWorldMatrix:!0,autoUpdateChildWorldMatrix:!0,parent:null,_quatDirty:!1,_matrixDirty:!1,needCallChildUpdate:!0,visible:!0,pointerEnabled:!0,pointerChildren:!0,useHandCursor:!1,__forceUseParentWorldMatrix:!1,constructor:function(t){var e=this;this.id=d.a.generateUUID(this.className),this.up=_.clone(),this.children=[],this.worldMatrix=new o.a,this._matrix=new u.a,this._position=new h.a(0,0,0),this._scale=new h.a(1,1,1),this._pivot=new h.a(0,0,0),this._rotation=new f.a,this._quaternion=new l.a,this._matrix.on("update",function(){e._onMatrixUpdate();}),this._position.on("update",function(){e._onPositionUpdate();}),this._scale.on("update",function(){e._onScaleUpdate();}),this._pivot.on("update",function(){e._onPivotUpdate();}),this._rotation.on("update",function(){e._onRotationUpdate();}),this._quaternion.on("update",function(){e._onQuaternionUpdate();}),Object.assign(this,t);},clone:function(t){var e=new this.constructor;return e.name=this.name,e.jointName=this.jointName,e.animationId=this.animationId,e.setPosition(this.x,this.y,this.z),e.setScale(this.scaleX,this.scaleY,this.scaleZ),e.setRotation(this.rotationX,this.rotationY,this.rotationZ),this.children.forEach(function(t){e.addChild(t.clone(!0));}),t||(this.anim&&(e.anim=this.anim.clone(e)),e.resetSkinedMeshRootNode()),e},setAnim:function(t){return this.anim=t,t.rootNode=this,this},resetSkinedMeshRootNode:function(){var t=this;this.traverse(function(e){e.isSkinedMesh&&e.jointNames&&(e.rootNode=t);},!0);},getChildrenNameMap:function(){var t={};return this.traverse(function(e){t[e.name]=e;var n=e._originName;void 0===n||t[n]||(t[n]=e);},!0),t},addChild:function(t){return t.parent&&t.removeFromParent(),t.parent=this,this.children.push(t),this},removeChild:function(t){var e=this.children.indexOf(t);return e>-1&&(this.children.splice(e,1),t.parent=null),this},addTo:function(t){return t.addChild(this),this},removeFromParent:function(){return this.parent&&this.parent.removeChild(this),this},updateMatrix:function(){return this._matrixDirty&&(this._matrixDirty=!1,this.matrixVersion++,this._matrix.fromRotationTranslationScaleOrigin(this.quaternion,this._position,this._scale,this._pivot,!0)),this},updateQuaternion:function(){return this._quatDirty&&(this._quatDirty=!1,this._quaternion.fromEuler(this._rotation,!0)),this},updateTransform:function(){return this._matrix.decompose(this._quaternion,this._position,this._scale,this._pivot),this._onQuaternionUpdate(),this._matrixDirty=!1,this},updateMatrixWorld:function(t){return this.traverse(function(e){return (e.autoUpdateWorldMatrix||t)&&(e.parent?e.__forceUseParentWorldMatrix?e.worldMatrix.copy(e.parent.worldMatrix):e.worldMatrix.multiply(e.parent.worldMatrix,e.matrix):e.worldMatrix.copy(e.matrix)),!e.autoUpdateChildWorldMatrix&&!t&&1}),this},getConcatenatedMatrix:function(t){for(var e=new o.a,n=this;n&&n!==t;n=n.parent)e.multiply(n.matrix,e);return e},_traverse:function(t,e){if(!e){var n=t(this);if(n)return n}for(var i=this.children,r=0,s=i.length;r<s;r++){var a=i[r]._traverse(t,!1);if(!0===a)return a}return !1},traverse:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return this._traverse(t,e),this},traverseBFS:function(t){var e,n,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];for(n=i?this.children:[this];n.length;){e=n,n=[];for(var r=0,s=e.length;r<s;r++){var a=e[r],o=t(a);if(o){if(!0===o)return this}else n=n.concat(a.children);}}return this},getChildByFnBFS:function(t){var e=null;return this.traverseBFS(function(n){return !!t(n)&&(e=n,!0)},!0),e},getChildByNamePath:function(t){for(var e=this,n=function(n,i){var r=t[n],s=e.getChildByFnBFS(function(t){return t.name===r});if(!s)return {v:null};e=s;},i=0,r=t.length;i<r;i++){var s=n(i);if("object"==typeof s)return s.v}return e},traverseUpdate:function(t){return this.traverse(function(e){return e.onUpdate&&e.onUpdate(t),!e.needCallChildUpdate&&1}),this},getChildByFn:function(t){var e=null;return this.traverse(function(n){return !!t(n)&&(e=n,!0)},!0),e},getChildrenByFn:function(t){var e=[];return this.traverse(function(n){t(n)&&e.push(n);},!0),e},getChildByName:function(t){return this.getChildByFn(function(e){return e.name===t})},getChildrenByName:function(t){return this.getChildrenByFn(function(e){return e.name===t})},getChildById:function(t){return this.getChildByFn(function(e){return e.id===t})},getChildrenByClassName:function(t){return this.getChildrenByFn(function(e){return e.className===t})},getChildrenByBaseClassName:function(t){return this.getChildrenByFn(function(e){return e["is"+t]})},setScale:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e;return this._scale.set(t,e,n),this},setPosition:function(t,e,n){return this._position.set(t,e,n),this},setRotation:function(t,e,n){return this._rotation.setDegree(t,e,n),this},setPivot:function(t,e,n){return this._pivot.set(t,e,n),this},lookAt:function(t){return this.isCamera?p.targetTo(this,t,this.up):p.targetTo(t,this,this.up),this._quaternion.fromMat4(p),this},raycast:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!this.visible)return null;var r=[];return this.traverse(function(n){if(i&&!n.pointerEnabled)return 1;if(n.isMesh){var s=n.raycast(t,!1);s&&(r=r.concat(s.map(function(t){return {mesh:n,point:t}})));}return !(!i||e.pointerChildren)&&1}),r.length?(n&&t.sortPoints(r,"point"),r):null},matrix:{get:function(){return this.updateMatrix(),this._matrix},set:function(t){m.a.warnOnce("Node.matrix.set","node.matrix is readOnly.Use node.matrix.copy instead."),this._matrix.copy(t);}},position:{get:function(){return this._position},set:function(t){m.a.warnOnce("Node.position.set","node.position is readOnly.Use node.position.copy instead."),this._position.copy(t);}},x:{get:function(){return this._position.elements[0]},set:function(t){this._position.elements[0]=t,this._matrixDirty=!0;}},y:{get:function(){return this._position.elements[1]},set:function(t){this._position.elements[1]=t,this._matrixDirty=!0;}},z:{get:function(){return this._position.elements[2]},set:function(t){this._position.elements[2]=t,this._matrixDirty=!0;}},scale:{get:function(){return this._scale},set:function(t){m.a.warnOnce("Node.scale.set","node.scale is readOnly.Use node.scale.copy instead."),this._scale.copy(t);}},scaleX:{get:function(){return this._scale.elements[0]},set:function(t){this._scale.elements[0]=t,this._matrixDirty=!0;}},scaleY:{get:function(){return this._scale.elements[1]},set:function(t){this._scale.elements[1]=t,this._matrixDirty=!0;}},scaleZ:{get:function(){return this._scale.elements[2]},set:function(t){this._scale.elements[2]=t,this._matrixDirty=!0;}},pivot:{get:function(){return this._pivot},set:function(t){m.a.warnOnce("Node.pivot.set","node.pivot is readOnly.Use node.pivot.copy instead."),this._pivot.copy(t);}},pivotX:{get:function(){return this._pivot.elements[0]},set:function(t){this._pivot.elements[0]=t,this._matrixDirty=!0;}},pivotY:{get:function(){return this._pivot.elements[1]},set:function(t){this._pivot.elements[1]=t,this._matrixDirty=!0;}},pivotZ:{get:function(){return this._pivot.elements[2]},set:function(t){this._pivot.elements[2]=t,this._matrixDirty=!0;}},rotation:{get:function(){return this._rotation},set:function(t){m.a.warnOnce("Node.rotation.set","node.rotation is readOnly.Use node.rotation.copy instead."),this._rotation.copy(t);}},rotationX:{get:function(){return this._rotation.degX},set:function(t){this._rotation.degX=t;}},rotationY:{get:function(){return this._rotation.degY},set:function(t){this._rotation.degY=t;}},rotationZ:{get:function(){return this._rotation.degZ},set:function(t){this._rotation.degZ=t;}},quaternion:{get:function(){return this.updateQuaternion(),this._quaternion},set:function(t){m.a.warnOnce("Node.quaternion.set","node.quaternion is readOnly.Use node.quaternion.copy instead."),this._quaternion.copy(t);}},matrixVersion:0,getBounds:function(t,e,n){return e?e.multiply(this.matrix):e=this.getConcatenatedMatrix(t),this.children.forEach(function(t){n=t.getBounds(null,e.clone(),n);}),this.isMesh&&(n=this.geometry.getBounds(e,n)),n},_fireMouseEvent:function(t){if(t.eventCurrentTarget=this,this.fire(t),"mousemove"===t.type){if(!this.__mouseOver){this.__mouseOver=!0;var e=Object.assign({},t);e.type="mouseover",this.fire(e);}}else"mouseout"===t.type&&(this.__mouseOver=!1);var n=this.parent;t._stopped||t._stopPropagationed||!n||n._fireMouseEvent(t);},destroy:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=this.getChildrenByBaseClassName("Node");return this.off(),n.forEach(function(n){n.isMesh?n.destroy(t,e):(n.off(),n.removeFromParent());}),this.removeFromParent(),this},_onMatrixUpdate:function(){this.matrixVersion++,this.updateTransform();},_onPositionUpdate:function(){this._matrixDirty=!0;},_onScaleUpdate:function(){this._matrixDirty=!0;},_onPivotUpdate:function(){this._matrixDirty=!0;},_onRotationUpdate:function(){this._quatDirty=!0,this._matrixDirty=!0;},_onQuaternionUpdate:function(){this._rotation.fromQuat(this._quaternion),this._quatDirty=!1;}}),v=n(8),E=new v.a,T=s.a.create({Extends:g,isLight:!0,className:"Light",amount:1,enabled:!0,constantAttenuation:1,linearAttenuation:0,quadraticAttenuation:0,_range:0,range:{get:function(){return this._range},set:function(t){this.constantAttenuation=1,t<=0?(this.linearAttenuation=0,this.quadraticAttenuation=0):(this.linearAttenuation=4.5/t,this.quadraticAttenuation=75/(t*t)),this._range=t;}},constructor:function(t){this.color=new v.a(1,1,1),T.superclass.constructor.call(this,t);},toInfoArray:function(t,e){return t[e+0]=this.constantAttenuation,t[e+1]=this.linearAttenuation,t[e+2]=this.quadraticAttenuation,this},getRealColor:function(){return E.copy(this.color).scale(this.amount)},createShadowMap:function(t,e){}}),M=T,A=n(24),I=new o.a,L=s.a.create({Extends:g,isCamera:!0,className:"Camera",_needUpdateProjectionMatrix:!0,_isGeometryDirty:!1,constructor:function(t){this.viewMatrix=new o.a,this.projectionMatrix=new o.a,this.viewProjectionMatrix=new o.a,this._frustum=new A.a,L.superclass.constructor.call(this,t);},updateViewMatrix:function(){return this.updateMatrixWorld(!0),this.viewMatrix.invert(this.worldMatrix),this},updateProjectionMatrix:function(){},getGeometry:function(t){},updateViewProjectionMatrix:function(){return this._needUpdateProjectionMatrix&&(this.updateProjectionMatrix(),this._needUpdateProjectionMatrix=!1),this.updateViewMatrix(),this.viewProjectionMatrix.multiply(this.projectionMatrix,this.viewMatrix),this.updateFrustum(this.viewProjectionMatrix),this},getModelViewMatrix:function(t,e){return (e=e||new o.a).multiply(this.viewMatrix,t.worldMatrix),e},getModelProjectionMatrix:function(t,e){return (e=e||new o.a).multiply(this.viewProjectionMatrix,t.worldMatrix),e},projectVector:function(t,e,n){var i=t.clone();return i.transformMat4(this.viewProjectionMatrix),e&&n&&(i.x=(i.x+1)/2*e,i.y=n-(i.y+1)/2*n),i},unprojectVector:function(t,e,n){var i=t.clone();return e&&n&&(i.x=i.x/e*2-1,i.y=1-i.y/n*2),I.invert(this.viewProjectionMatrix),i.transformMat4(I),i},isPointVisible:function(t){return !!this._frustum.intersectsSphere({center:t,radius:0})},isMeshVisible:function(t){var e=t.geometry;if(e){var n=e.getSphereBounds(t.worldMatrix);if(this._frustum.intersectsSphere(n))return !0}return !1},updateFrustum:function(t){return this._frustum.fromMatrix(t),this}}),O=L,S=n(14),R=n(12),y=n(11),x=n(21),N={2:new S.a,3:new c.a,4:new R.a,16:new o.a},b=s.a.create({className:"GeometryData",isGeometryData:!0,size:void 0,normalized:!1,type:void 0,isDirty:!0,bufferViewId:void 0,glBuffer:null,constructor:function(t,e,n){this.id=d.a.generateUUID(this.className),this.data=t,this.size=e,Object.assign(this,n),this.bufferViewId||(this.bufferViewId=this.id),this.size||m.a.warn("GeometryData.constructor: geometryData must set size!",this);},_stride:0,stride:{get:function(){return this._stride},set:function(t){this._stride=t,this.strideSize=0===t?0:t/this.data.BYTES_PER_ELEMENT;}},strideSize:0,_offset:0,offset:{get:function(){return this._offset},set:function(t){this._offset=t,this.offsetSize=t/this.data.BYTES_PER_ELEMENT;}},offsetSize:0,data:{set:function(t){t&&(this._data=t,this.type=Object(r.getTypedArrayGLType)(t),this.stride=this._stride,this.offset=this._offset,this.isDirty=!0);},get:function(){return this._data}},length:{get:function(){return this._data.length}},realLength:{get:function(){return 0===this.strideSize?this._data.length:this._data.length/this.strideSize*this.size}},count:{get:function(){return 0===this.strideSize?this._data.length/this.size:this._data.length/this.strideSize}},clone:function(){var t=new b(null,1);return t.copy(this),t},copy:function(t){var e=t.data;this.data=new e.constructor(e),this.size=t.size,this.stride=t.stride,this.normalized=t.normalized,this.type=t.type,this.offset=t.offset;},getOffset:function(t){var e=this.strideSize;return 0===e?t*this.size:t*e+this.offsetSize},get:function(t){var e=this.getOffset(t);return this.getByOffset(e)},set:function(t,e){var n=this.getOffset(t);return this.setByOffset(n,e),n},getByOffset:function(t){var e=this.size;return e>1?N[e].fromArray(this._data,t):this._data[t]},setByOffset:function(t,e){var n=this.size,i=this._data;n>1?e.toArray(i,t):i[t]=e,this.isDirty=!0;},traverse:function(t){for(var e=this.count,n=0;n<e;n++){var i=this.getOffset(n);if(t(this.getByOffset(i),n,i))return !0}return !1},traverseByComponent:function(t){for(var e=this.count,n=this.size,i=this._data,r=0;r<e;r++)for(var s=this.getOffset(r),a=r*n,o=0;o<n;o++){var u=s+o;if(t(i[u],a+o,u))return !0}return !1},merge:function(t,e){if(t.type!==this.type||t.size!==this.size)return m.a.warn("geometryData type or size not same, cannot merge!",this,t),this;var n=Object(r.getTypedArrayClass)(this.type),i=this.realLength,s=t.realLength,a=new n(i+s);return this.traverseByComponent(function(t,e){a[e]=t;}),t.traverseByComponent(function(t,n){e&&(t=e(t,n)),a[i+n]=t;}),this.stride=0,this.offset=0,this.data=a,this}}),w=b,C=n(2),P=C.a.TRIANGLES,H=C.a.LINES,D=C.a.FRONT,F=C.a.BACK,U=C.a.FRONT_AND_BACK,G=new c.a,B=new c.a,V=new c.a,X=new R.a,j=new S.a,k=new S.a,z=new S.a,q=new y.a,W=new o.a,Y=new l.a,Z=s.a.create({isGeometry:!0,className:"Geometry",vertices:null,uvs:null,uvs1:null,colors:null,indices:null,skinIndices:null,skinWeights:null,mode:P,isStatic:!0,isDirty:!0,useAABBRaycast:!1,constructor:function(t){this.id=d.a.generateUUID(this.className),Object.assign(this,t),this.currentVerticesCount=0,this.currentIndicesCount=0;},_needUpdateNormals:!1,normals:{get:function(){return !this._needUpdateNormals&&this._normals||this.calculateNormals(),this._normals},set:function(t){this._normals=t,this._needUpdateNormals=!1;}},calculateNormals:function(){var t=this.vertices;if(t){this._normals||(this._normals=new w(new Float32Array(t.realLength),3));var e,n=this._normals;if(this.indices)e=this.indices.data;else{var i=t.length/3;e=new Array(i);for(var r=0;r<i;r++)e[r]=r;}for(var s=0,a=new Uint8Array(t.count),o=0;o<e.length;o+=3){s=e[o],G.copy(t.get(s)),s=e[o+1],B.copy(t.get(s)),s=e[o+2],V.copy(t.get(s)),B.sub(G),V.sub(G),B.cross(V);for(var u=0;u<3;u++){if(a[s=e[o+u]]){var c=n.get(s);c.scale(a[s]),c.add(B),c.scale(1/(a[s]+1)),n.set(s,c);}else n.set(s,B);a[s]++;}}n.isDirty=!0,this._needUpdateNormals=!1;}else m.a.warnOnce("geometry.calculateNormals","geometry.calculateNormals error:no vertices data.");},tangents:{get:function(){return this._tangents||this.calculateTangents(this.uvs,"_tangents"),this._tangents},set:function(t){this._tangents=t;}},tangents1:{get:function(){return this._tangents1||this.calculateTangents(this.uvs1,"_tangents1"),this._tangents1},set:function(t){this._tangents1=t;}},calculateTangents:function(t,e){var n=this.vertices;if(n){this[e]||(this[e]=new w(new Float32Array(4*n.count),4));var i,r=this[e];if(this.indices)i=this.indices.data;else{var s=n.length/3;i=new Array(s);for(var a=0;a<s;a++)i[a]=a;}for(var o=0,u=0;u<i.length;u+=3){o=i[u],G.copy(n.get(o)),j.copy(t.get(o)),o=i[u+1],B.copy(n.get(o)),k.copy(t.get(o)),o=i[u+2],V.copy(n.get(o)),z.copy(t.get(o)),B.sub(G),V.sub(G),k.sub(j),z.sub(j);var c=1/(k.x*z.y-z.x*k.y);Number.isFinite(c)?(G.x=c*(z.y*B.x-k.y*V.x),G.y=c*(z.y*B.y-k.y*V.y),G.z=c*(z.y*B.z-k.y*V.z)):(G.x=0,G.y=0,G.z=1),X.set(G.x,G.y,G.z,1),r.set(i[u],X),r.set(i[u+1],X),r.set(i[u+2],X);}}else m.a.warnOnce("geometry.calculateTangents","geometry.calculateTangents error:no vertices data.");},convertToLinesMode:function(){if(this.mode===P)if(this.indices){for(var t=new Uint16Array(2*this.indices.length),e=this.indices.data,n=0;n<e.length;n+=3)t[2*n]=e[n],t[2*n+1]=e[n+1],t[2*n+2]=e[n+1],t[2*n+3]=e[n+2],t[2*n+4]=e[n+2],t[2*n+5]=e[n];this.indices.data=t,this.mode=H;}else m.a.warn("Has no indices!");else m.a.warn("Only support convert triangles to lines mode!");},translate:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return this.transformMat4(W.fromTranslation(G.set(t,e,n))),this},scale:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return this.transformMat4(W.fromScaling(G.set(t,e,n))),this},rotate:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return this.transformMat4(W.fromQuat(Y.fromEuler({x:t*d.a.DEG2RAD,y:e*d.a.DEG2RAD,z:n*d.a.DEG2RAD}))),this},transformMat4:function(t){var e=this.vertices;if(e&&e.traverse(function(n,i,r){e.setByOffset(r,n.transformMat4(t));}),q.normalFromMat4(t),this._normals){var n=this.normals;n.traverse(function(t,e,i){n.setByOffset(i,t.transformMat3(q).normalize());});}if(this._tangents){var i=this.tangents;i.traverse(function(t,e,n){i.setByOffset(n,t.transformMat3(q).normalize());});}return this.isDirty=!0,this},merge:function(t,e){var n=t.vertices;if(n&&this.vertices){var i=this.vertices.count;e&&(n=t.vertices.clone()).traverse(function(t,i,r){n.setByOffset(r,t.transformMat4(e));}),this.vertices.merge(n),this.indices&&t.indices?this.indices.merge(t.indices,function(t){return t+i}):this.indices=null;}return this.uvs&&t.uvs?this.uvs.merge(t.uvs):this.uvs=null,this.uvs1&&t.uvs1?this.uvs1.merge(t.uvs1):this.uvs1=null,this.colors&&t.colors?this.colors.merge(t.colors):this.colors=null,this._normals&&(this._normals=null),this._tangents&&(this._tangents=null),this._tangents1&&(this._tangents1=null),this.isDirty=!0,this},ensureData:function(t,e,n,i){var r=this[t];if(!r||n>r.length){var s=new i(n);r?(s.set(r.data),r.data=s):this[t]=new w(s,e);}},addPoints:function(){var t=this,e=[].slice.call(arguments),n=3*(this.currentVerticesCount+e.length);this.ensureData("vertices",3,n,Float32Array);var i=this.vertices.data;return e.forEach(function(e){var n=3*t.currentVerticesCount++;i[n]=e[0],i[n+1]=e[1],i[n+2]=e[2];}),this.currentVerticesCount-e.length},addIndices:function(){var t=this,e=[].slice.call(arguments),n=this.currentIndicesCount+e.length;this.ensureData("indices",1,n,Uint16Array);var i=this.indices.data;e.forEach(function(e){i[t.currentIndicesCount++]=e;}),this._needUpdateNormals=!0;},addLine:function(t,e){var n=this.addPoints(t,e);this.addIndices(n,n+1);},addFace:function(t,e,n){var i=this.addPoints(t,e,n);this.addIndices(i,i+1,i+2);},addRect:function(t,e,n,i){var r=this.addPoints(t,e,n,i);this.addIndices(r,r+1,r+2,r,r+2,r+3);},setVertexUV:function(t,e){this.ensureData("uvs",2,this.vertices.length/3*2,Float32Array);for(var n=this.uvs.data,i=0;i<e.length;i++)n[t+2*i]=e[i][0],n[t+2*i+1]=e[i][1];},setFaceUV:function(t,e,n,i){this.setVertexUV(t,[e,n,i]);},setRectUV:function(t,e,n,i,r){this.setVertexUV(t,[e,n,i,r]);},getBounds:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1?arguments[1]:void 0;e||(e={xMin:1/0,xMax:-1/0,yMin:1/0,yMax:-1/0,zMin:1/0,zMax:-1/0});var n=this.vertices;return n?(n.traverse(function(n){t&&n.transformMat4(t),e.xMax=Math.max(e.xMax,n.x),e.yMax=Math.max(e.yMax,n.y),e.zMax=Math.max(e.zMax,n.z),e.xMin=Math.min(e.xMin,n.x),e.yMin=Math.min(e.yMin,n.y),e.zMin=Math.min(e.zMin,n.z);}),e.width=e.xMax-e.xMin,e.height=e.yMax-e.yMin,e.depth=e.zMax-e.zMin,e.x=(e.xMin+e.xMax)/2,e.y=(e.yMin+e.yMax)/2,e.z=(e.zMin+e.zMax)/2,e):(m.a.warnOnce("geometry.getBounds","geometry has no vertices data, geometry.getBounds will return Infinity bounds."),e)},getLocalBounds:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return this._localBounds&&!t||(this._localBounds=this.getBounds()),this._localBounds},getSphereBounds:function(t){this._sphereBounds||(this._sphereBounds=new x.a);var e=this._sphereBounds;return e.copy(this.getLocalSphereBounds()),t&&e.transformMat4(t),e},getLocalSphereBounds:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(!this._localSphereBounds||t){var e=this.getLocalBounds(t),n=new x.a({center:new c.a(e.x,e.y,e.z)}),i=this.vertices;i?n.fromGeometryData(i):(m.a.warnOnce("geometry.getLocalSphereBounds","geometry has no vertices data, geometry.getLocalSphereBounds will return Infinity bounds."),n.radius=1/0),this._localSphereBounds=n;}return this._localSphereBounds},convertToNoIndices:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3;if(this.mode===P)if(this.indices){for(var e=this.indices.data,n=e.length,i=new Float32Array(n*t),s=this.uvs?new Float32Array(2*n):null,a=new Float32Array(3*n),o=this.colors?new Float32Array(this.colors.size*n):null,u=this.skinIndices?new Float32Array(4*n):null,c=this.skinWeights?new Float32Array(4*n):null,h=0;h<n;h++){var f=e[h];Object(r.copyArrayData)(i,this.vertices,h*t,3*f,3),4===t&&(i[4*h+3]=1),Object(r.copyArrayData)(s,this.uvs,2*h,2*f,2),Object(r.copyArrayData)(a,this.normals,3*h,3*f,3),Object(r.copyArrayData)(u,this.skinIndices,4*h,4*f,4),Object(r.copyArrayData)(c,this.skinWeights,4*h,4*f,4),this.colors&&Object(r.copyArrayData)(o,this.colors,h*this.colors.size,f*this.colors.size,this.colors.size);}delete this.indices,this.vertices.data=i,this.uvs&&(this.uvs.data=s),this.normals&&(this.normals.data=a),this.colors&&(this.colors.data=o),this.skinIndices&&(this.skinIndices.data=u),this.skinWeights&&(this.skinWeights.data=c);}else m.a.warn("Has no indices!");else m.a.warn("Only support convert triangles to lines mode!");},clone:function(){var t=new this.constructor({mode:this.mode});return this.vertices&&(t.vertices=this.vertices.clone()),this.uvs&&(t.uvs=this.uvs.clone()),this.uvs1&&(t.uvs1=this.uvs1.clone()),this.colors&&(t.colors=this.colors.clone()),this.indices&&(t.indices=this.indices.clone()),this.skinWeights&&(t.skinWeights=this.skinWeights.clone()),this.skinIndices&&(t.skinIndices=this.skinIndices.clone()),this._normals&&(t._normals=this._normals.clone()),this._tangents&&(t._tangents=this._tangents.clone()),this._tangents1&&(t._tangents1=this._tangents1.clone()),this.positionDecodeMat&&(t.positionDecodeMat=this.positionDecodeMat),this.uvDecodeMat&&(t.uvDecodeMat=this.uvDecodeMat),this.uv1DecodeMat&&(t.uv1DecodeMat=this.uv1DecodeMat),this.normalDecodeMat&&(t.normalDecodeMat=this.normalDecodeMat),t},_aabbRaycast:function(t){var e=this.getLocalBounds(),n=t.intersectsBox([[e.xMin,e.yMin,e.zMin],[e.xMax,e.yMax,e.zMax]]);return n?[n]:null},_raycast:function(t,e){var n=this.vertices;if(!n)return null;var i,r=this.indices,s=[],a=[];i=r?r.realLength:n.realLength/3;for(var o=0;o<i;o+=3){var u=r?r.get(o):o;G.copy(n.get(u)),u=r?r.get(o+1):o+1,B.copy(n.get(u)),u=r?r.get(o+2):o+2,V.copy(n.get(u));var c=void 0;e===D?(s[0]=G.elements,s[1]=B.elements,s[2]=V.elements,c=t.intersectsTriangle(s)):e===F?(s[1]=G.elements,s[0]=B.elements,s[2]=V.elements,c=t.intersectsTriangle(s)):e===U&&(s[0]=G.elements,s[1]=B.elements,s[2]=V.elements,(c=t.intersectsTriangle(s))||(s[1]=G.elements,s[0]=B.elements,s[2]=V.elements,c=t.intersectsTriangle(s))),c&&a.push(c);}return a.length?a:null},raycast:function(t,e){var n,i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return (n=this.useAABBRaycast?this._aabbRaycast(t):this._raycast(t,e))&&i&&t.sortPoints(n),n},getRenderOption:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this.positionDecodeMat&&(t.QUANTIZED=1,t.POSITION_QUANTIZED=1),this.normalDecodeMat&&(t.QUANTIZED=1,t.NORMAL_QUANTIZED=1),this.uvDecodeMat&&(t.QUANTIZED=1,t.UV_QUANTIZED=1),this.uv1DecodeMat&&(t.QUANTIZED=1,t.UV1_QUANTIZED=1),this.colors&&(t.HAS_COLOR=1,t.COLOR_SIZE=this.colors.size),t},getShaderKey:function(){return void 0===this._shaderKey&&(this._shaderKey="geometry",this.isMorphGeometry?this._shaderKey+="_id_".concat(this.id):(this.colors&&(this._shaderKey+="_colors"),this.positionDecodeMat&&(this._shaderKey+="positionDecodeMat"))),this._shaderKey},destroy:function(){m.a.warn("Geometry.destroy has been deprecated, use mesh.destroy(renderer) instead.");}}),K=s.a.create({Extends:O,isPerspectiveCamera:!0,className:"PerspectiveCamera",_near:.1,near:{get:function(){return this._near},set:function(t){this._needUpdateProjectionMatrix=!0,this._isGeometryDirty=!0,this._near=t;}},_far:null,far:{get:function(){return this._far},set:function(t){this._needUpdateProjectionMatrix=!0,this._isGeometryDirty=!0,this._far=t;}},_fov:50,fov:{get:function(){return this._fov},set:function(t){this._needUpdateProjectionMatrix=!0,this._isGeometryDirty=!0,this._fov=t;}},_aspect:1,aspect:{get:function(){return this._aspect},set:function(t){this._needUpdateProjectionMatrix=!0,this._isGeometryDirty=!0,this._aspect=t;}},constructor:function(t){K.superclass.constructor.call(this,t),this.updateProjectionMatrix();},updateProjectionMatrix:function(){var t=this.projectionMatrix.elements,e=this.near,n=this.far,i=this.aspect,r=this.fov,s=1/Math.tan(.5*d.a.degToRad(r));if(t[0]=s/i,t[5]=s,t[11]=-1,t[15]=0,n){var a=1/(e-n);t[10]=(e+n)*a,t[14]=2*n*e*a;}else t[10]=-1,t[14]=-2*e;},getGeometry:function(t){if(t||!this._geometry||this._isGeometryDirty){this._isGeometryDirty=!1;var e=new Z,n=Math.tan(this.fov/2*Math.PI/180),i=this.near,r=this.far,s=i*n,a=r*n,o=this.aspect*s,u=this.aspect*a,c=[-o,-s,-i],h=[o,-s,-i],f=[o,s,-i],l=[-o,s,-i],d=[-u,-a,-r],m=[u,-a,-r],_=[u,a,-r],p=[-u,a,-r];e.addRect(d,m,_,p),e.addRect(m,h,f,_),e.addRect(h,c,l,f),e.addRect(c,d,p,l),e.addRect(p,_,f,l),e.addRect(c,h,m,d),this._geometry=e;}return this._geometry}}),Q=K,J=s.a.create({constructor:function(){this._cache={};},get:function(t){return this._cache[t]},getObject:function(t){return this._cache[t.__cacheId]},add:function(t,e){"object"==typeof e&&(e.__cacheId=t),this._cache[t]=e;},remove:function(t){delete this._cache[t];},removeObject:function(t){delete this._cache[t.__cacheId];},removeAll:function(){this._cache={};},each:function(t){var e=this._cache;for(var n in e)t(e[n],n);}}),$={instanced:void 0,vao:void 0,texFloat:void 0,loseContext:void 0,textureFilterAnisotropic:void 0,_usedExtensions:{},_disabledExtensions:{},init:function(t){this.reset(t);},reset:function(t){this.gl=t;var e=this._usedExtensions;for(var n in e){var i=e[n];this[i]=void 0,this.get(n,i);}},use:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t;this.gl?this.get(t,e):this._usedExtensions[t]=e;},get:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t;if(this._disabledExtensions[t])return null;var n=this[e];return void 0===n&&(n=this._getExtension(t),this[e]=n),n},disable:function(t){this._disabledExtensions[t]=!0;},enable:function(t){this._disabledExtensions[t]=!1;},_getExtension:function(t){var e=this.gl;return e&&e.getExtension&&(e.getExtension(t)||e.getExtension("WEBKIT_"+t)||e.getExtension("MOZ_"+t))||null}};$.use("ANGLE_instanced_arrays","instanced"),$.use("OES_vertex_array_object","vao"),$.use("OES_texture_float","texFloat"),$.use("WEBGL_lose_context","loseContext"),$.use("OES_element_index_uint","uintIndices"),$.use("EXT_shader_texture_lod","shaderTextureLod"),$.use("EXT_texture_filter_anisotropic","textureFilterAnisotropic");var tt=$,et={MAX_TEXTURE_INDEX:null,MAX_PRECISION:null,MAX_VERTEX_PRECISION:null,MAX_FRAGMENT_PRECISION:null,VERTEX_TEXTURE_FLOAT:null,FRAGMENT_TEXTURE_FLOAT:null,MAX_TEXTURE_MAX_ANISOTROPY:1,init:function(t){var e=this;this.gl=t;["MAX_RENDERBUFFER_SIZE","MAX_COMBINED_TEXTURE_IMAGE_UNITS","MAX_CUBE_MAP_TEXTURE_SIZE","MAX_FRAGMENT_UNIFORM_VECTORS","MAX_TEXTURE_IMAGE_UNITS","MAX_TEXTURE_SIZE","MAX_VARYING_VECTORS","MAX_VERTEX_ATTRIBS","MAX_VERTEX_TEXTURE_IMAGE_UNITS","MAX_VERTEX_UNIFORM_VECTORS","MAX_COMBINED_TEXTURE_IMAGE_UNITS"].forEach(function(t){e.get(t);}),this.MAX_TEXTURE_INDEX=this.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1,this.MAX_VERTEX_PRECISION=this._getMaxSupportPrecision(t.VERTEX_SHADER),this.MAX_FRAGMENT_PRECISION=this._getMaxSupportPrecision(t.FRAGMENT_SHADER),this.MAX_PRECISION=this.getMaxPrecision(this.MAX_FRAGMENT_PRECISION,this.MAX_VERTEX_PRECISION),this.VERTEX_TEXTURE_FLOAT=!!tt.texFloat&&this.MAX_VERTEX_TEXTURE_IMAGE_UNITS>0,this.FRAGMENT_TEXTURE_FLOAT=!!tt.texFloat,this.EXT_FRAG_DEPTH=tt.get("EXT_frag_depth"),this.SHADER_TEXTURE_LOD=!!tt.shaderTextureLod,tt.textureFilterAnisotropic&&(this.MAX_TEXTURE_MAX_ANISOTROPY=t.getParameter(tt.textureFilterAnisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT));},get:function(t){var e=this.gl,n=this[t];return void 0===n&&(n=this[t]=e.getParameter(e[t])),n},_getMaxSupportPrecision:function(t){var e=this.gl,n="lowp";if(e.getShaderPrecisionFormat)for(var i=[{name:"highp",type:e.HIGH_FLOAT},{name:"mediump",type:e.MEDIUM_FLOAT}],r=0;r<i.length;r++){var s=i[r];if((e.getShaderPrecisionFormat(t,s.type)||{}).precision>0){n=s.name;break}}else n="mediump";return n},getMaxPrecision:function(t,e){return "highp"===t||"mediump"===t&&"lowp"===e?e:t}},nt=n(54),it=n.n(nt),rt=n(55),st=n.n(rt),at=n(56),ot=n.n(at),ut=n(57),ct=n.n(ut),ht=new J,ft=new J,lt=s.a.create({isShader:!0,className:"Shader",vs:"",fs:"",Statics:{commonOptions:{},shaders:{"chunk/baseDefine.glsl":n(18),"chunk/color.frag":n(40),"chunk/color.vert":n(80),"chunk/color_main.vert":n(82),"chunk/diffuse.frag":n(62),"chunk/diffuse_main.frag":n(71),"chunk/extensions.frag":n(25),"chunk/extensions.vert":n(52),"chunk/fog.frag":n(47),"chunk/fog_main.frag":n(73),"chunk/frag_color.frag":n(51),"chunk/joint.vert":n(75),"chunk/joint_main.vert":n(85),"chunk/light.frag":n(44),"chunk/lightFog.frag":n(43),"chunk/lightFog.vert":n(78),"chunk/lightFog_main.frag":n(49),"chunk/lightFog_main.vert":n(88),"chunk/logDepth.frag":n(29),"chunk/logDepth_main.frag":n(30),"chunk/logDepth.vert":n(81),"chunk/logDepth_main.vert":n(89),"chunk/morph.vert":n(79),"chunk/morph_main.vert":n(84),"chunk/normal.frag":n(42),"chunk/normal.vert":n(77),"chunk/normal_main.frag":n(48),"chunk/normal_main.vert":n(87),"chunk/pbr.frag":n(91),"chunk/pbr_main.frag":n(93),"chunk/phong.frag":n(69),"chunk/phong_main.frag":n(72),"chunk/precision.frag":n(26),"chunk/precision.vert":n(53),"chunk/transparency.frag":n(46),"chunk/transparency_main.frag":n(50),"chunk/unQuantize.vert":n(74),"chunk/unQuantize_main.vert":n(83),"chunk/uv.frag":n(41),"chunk/uv.vert":n(76),"chunk/uv_main.vert":n(86),"method/encoding.glsl":n(92),"method/getDiffuse.glsl":n(64),"method/getLightAttenuation.glsl":n(66),"method/getShadow.glsl":n(68),"method/getSpecular.glsl":n(65),"method/packFloat.glsl":n(90),"method/textureEnvMap.glsl":n(45),"method/transpose.glsl":n(63),"method/unpackFloat.glsl":n(67),"basic.frag":n(54),"basic.vert":n(55),"geometry.frag":n(56),"pbr.frag":n(57),"screen.frag":n(58),"screen.vert":n(59)},init:function(t){this.renderer=t,this.commonHeader=this._getCommonHeader(this.renderer);},cache:{get:function(){return ht}},headerCache:{get:function(){return ft}},reset:function(t){ht.removeAll();},getHeaderKey:function(t,e,n,i,r){var s="header_"+e.id+"_"+n.lightInfo.uid;return t.isSkinedMesh&&(s+="_joint"+t.jointNames.length),i&&(s+="_fog_"+i.mode),s+="_"+t.geometry.getShaderKey(),r&&(s+="_fogDepth"),s},getHeader:function(t,e,n,i,r){var s=this.getHeaderKey(t,e,n,i),a=ft.get(s);if(!a||e.isDirty){var o={};Object.assign(o,this.commonOptions);var u=e.lightType;u&&"NONE"!==u&&n.getRenderOption(o),e.getRenderOption(o),t.getRenderOption(o),i&&(o.HAS_FOG=1,i.getRenderOption(o)),r&&(o.USE_LOG_DEPTH=1,et.EXT_FRAG_DEPTH&&(o.USE_EXT_FRAG_DEPTH=1)),o.HAS_NORMAL&&o.NORMAL_MAP&&(o.HAS_TANGENT=1),o.RECEIVE_SHADOWS||(delete o.DIRECTIONAL_LIGHTS_SMC,delete o.SPOT_LIGHTS_SMC,delete o.POINT_LIGHTS_SMC),a="#define SHADER_NAME ".concat(e.className,"\n"),a+=Object.keys(o).map(function(t){return t.indexOf("HILO_CUSTUM_OPTION_")>-1?"#define ".concat(t.replace("HILO_CUSTUM_OPTION_","")," ").concat(o[t]):"#define HILO_".concat(t," ").concat(o[t])}).join("\n")+"\n",ft.add(s,a);}return a},_getCommonHeader:function(t){var e=et.getMaxPrecision(et.MAX_VERTEX_PRECISION,t.vertexPrecision),n=et.getMaxPrecision(et.MAX_FRAGMENT_PRECISION,t.fragmentPrecision),i=et.getMaxPrecision(e,n);return "\n#define HILO_MAX_PRECISION ".concat(i,"\n#define HILO_MAX_VERTEX_PRECISION ").concat(e,"\n#define HILO_MAX_FRAGMENT_PRECISION ").concat(n,"\n")},getShader:function(t,e,n,i,r,s){var a=this.getHeader(t,e,i,r,s);return e.isBasicMaterial||e.isPBRMaterial?this.getBasicShader(e,n,a):e.isShaderMaterial?this.getCustomShader(e.vs,e.fs,a,e.shaderCacheId||e.id,e.useHeaderCache):null},getBasicShader:function(t,e,n){var i="";e&&(i=(i=t.getInstancedUniforms().map(function(t){return t.name})).join("|"));var r=t.className+":"+i;t.onBeforeCompile&&(r+=":"+(t.shaderCacheId||t.id));var s=ht.get(r);if(!s){var a="",o=st.a;if(t.isBasicMaterial?t.isGeometryMaterial?a+=ot.a:a+=it.a:t.isPBRMaterial&&(a+=ct.a),t.onBeforeCompile){var u=t.onBeforeCompile(o,a);a=u.fs,o=u.vs;}if(i){var c=new RegExp("^\\s*uniform\\s+(\\w+)\\s+(".concat(i,");"),"gm");o=o.replace(c,"attribute $1 $2;");}s=this.getCustomShader(o,a,n,r,!0);}if(s){var h=this._getNumId(s);null!==h&&(t._shaderNumId=h);}return s},_getNumId:function(t){var e=t.id.match(/_(\d+)/);return e&&e[1]?parseInt(e[1],10):null},getCustomShader:function(t,e,n,i,r){var s,a=this.commonHeader;return i&&(r&&(i+=":"+n),s=ht.get(i)),s||(s=new lt({vs:a+n+t,fs:a+n+e}),i&&ht.add(i,s)),s}},constructor:function(t){this.id=d.a.generateUUID(this.className),Object.assign(this,t);},destroyIfNoRef:function(t){return t.resourceManager.destroyIfNoRef(this),this},destroy:function(){return this._isDestroyed?this:(ht.removeObject(this),this._isDestroyed=!0,this)}}),dt=lt,mt=n(59),_t=n.n(mt),pt=n(58),gt=n.n(pt),vt=[{name:"FLOAT",byteSize:4,uniformFuncName:"uniform1f",type:"Scalar",size:1},{name:"FLOAT_VEC2",byteSize:8,uniformFuncName:"uniform2f",type:"Vector",size:2},{name:"FLOAT_VEC3",byteSize:12,uniformFuncName:"uniform3f",type:"Vector",size:3},{name:"FLOAT_VEC4",byteSize:16,uniformFuncName:"uniform4f",type:"Vector",size:4},{name:"FLOAT_MAT2",byteSize:16,uniformFuncName:"uniformMatrix2fv",type:"Matrix",size:4},{name:"FLOAT_MAT3",byteSize:36,uniformFuncName:"uniformMatrix3fv",type:"Matrix",size:9},{name:"FLOAT_MAT4",byteSize:64,uniformFuncName:"uniformMatrix4fv",type:"Matrix",size:16},{name:"INT",byteSize:4,uniformFuncName:"uniform1i",type:"Scalar",size:1},{name:"INT_VEC2",byteSize:8,uniformFuncName:"uniform2i",type:"Vector",size:2},{name:"INT_VEC3",byteSize:12,uniformFuncName:"uniform3i",type:"Vector",size:3},{name:"INT_VEC4",byteSize:16,uniformFuncName:"uniform4i",type:"Vector",size:4},{name:"BOOL",byteSize:4,uniformFuncName:"uniform1i",type:"Scalar",size:1},{name:"BOOL_VEC2",byteSize:8,uniformFuncName:"uniform2i",type:"Vector",size:2},{name:"BOOL_VEC3",byteSize:12,uniformFuncName:"uniform3i",type:"Vector",size:3},{name:"BOOL_VEC4",byteSize:16,uniformFuncName:"uniform4i",type:"Vector",size:4},{name:"SAMPLER_2D",byteSize:4,uniformFuncName:"uniform1i",type:"Scalar",size:1},{name:"SAMPLER_CUBE",byteSize:4,uniformFuncName:"uniform1i",type:"Scalar",size:1}],Et={},Tt={dict:Et,init:function(t){vt.forEach(function(e){var n,i,r=e.name,s=e.uniformFuncName,a=s+"v";"Matrix"===e.type?n=i=function(e,n){void 0!==n&&t[s](e,!1,n);}:(n=function(e,n){void 0!==n&&t[s](e,n);},i=function(e,n){t[a](e,n);}),Et[t[r]]=Object.assign(e,{glValue:t[r],uniform:n,uniformArray:i});});},get:function(t){return Et[t]}},Mt=new J,At=s.a.create({Statics:{cache:{get:function(){return Mt}},reset:function(t){Mt.each(function(t){t.destroy();});},getProgram:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=t.id,r=Mt.get(i);return r||(r=new At({state:e,vertexShader:t.vs,fragShader:t.fs,ignoreError:n}),Mt.add(i,r)),r},getBlankProgram:function(t){var e=dt.getCustomShader("void main(){}","precision HILO_MAX_FRAGMENT_PRECISION float;void main(){gl_FragColor = vec4(0.0);}","","__hiloBlankShader");return this.getProgram(e,t,!0)}},className:"Program",isProgram:!0,fragShader:"",vertexShader:"",attributes:null,uniforms:null,program:null,gl:null,state:null,constructor:function(t){return this.id=d.a.generateUUID(this.className),Object.assign(this,t),this._dict={},this.attributes={},this.uniforms={},this.gl=this.state.gl,this.program=this.createProgram(),this.program?(this.initAttributes(),this.initUniforms(),this):this.ignoreError?this:At.getBlankProgram(t.state)},createProgram:function(){var t=this.gl,e=t.createProgram(),n=this.createShader(t.VERTEX_SHADER,this.vertexShader),i=this.createShader(t.FRAGMENT_SHADER,this.fragShader);if(n&&i){if(t.attachShader(e,n),t.attachShader(e,i),t.linkProgram(e),t.deleteShader(n),t.deleteShader(i),!t.getProgramParameter(e,t.LINK_STATUS)){var r=t.getProgramInfoLog(e);return m.a.error("compileProgramError: "+r,this),t.deleteProgram(e),null}return e}return null},useProgram:function(){this.state.useProgram(this.program);},createShader:function(t,e){var n=this.gl,i=n.createShader(t);if(n.shaderSource(i,e),n.compileShader(i),!n.getShaderParameter(i,n.COMPILE_STATUS)){var r=n.getShaderInfoLog(i);return m.a.error("compileShaderError: "+r,e.split("\n").map(function(t,e){return "".concat(e+1," ").concat(t)}).join("\n")),null}return i},initAttributes:function(){for(var t=this,e=this.gl,n=this.program,i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES),r=tt.instanced,s=function(i){var s=e.getActiveAttrib(n,i),a=s.name,o=s.type,u=s.size,c=e.getAttribLocation(n,a),h=Tt.get(o),f=function(t){var n=t.type,i=void 0===n?e.FLOAT:n,r=t.normalized,s=void 0!==r&&r,a=t.stride,o=void 0===a?0:a,u=t.offset,f=void 0===u?0:u;e.vertexAttribPointer(c,h.size,i,s,o,f);},l=function(){e.enableVertexAttribArray(c);},d=function(){},m=function(t,e){t[c]=e;};if(r&&(d=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;r.vertexAttribDivisorANGLE(c,t);}),"Matrix"===h.type){var _=h.byteSize,p=h.size,g=Math.sqrt(p),v=4*g,E=function(t){for(var e=0;e<g;e++)t(c+e,e);};f=function(t){var n,i=t.type,r=void 0===i?e.FLOAT:i,s=t.normalized,a=void 0!==s&&s,o=t.stride,u=void 0===o?0:o,c=t.offset,h=void 0===c?0:c;n=0===u?_:u,E(function(t,i){e.vertexAttribPointer(t,g,r,a,n,h+v*i);});},l=function(){E(function(t){e.enableVertexAttribArray(t);});},m=function(t,e){E(function(n){t[n]=e;});},r&&(d=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;E(function(e){r.vertexAttribDivisorANGLE(e,t);});});}t.attributes[a]={name:a,location:c,type:o,size:u,glTypeInfo:h,pointer:f,enable:l,divisor:d,addTo:m};},a=0;a<i;a++)s(a);},initUniforms:function(){for(var t=this,e=this.gl,n=this.program,i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS),r=0,s=function(i){var s=e.getActiveUniform(n,i),a=s.name,o=s.size,u=s.type;a=a.replace(/\[0\]$/,"");var c=e.getUniformLocation(n,a),h=Tt.get(u),f=h.uniformArray,l=h.uniform;t.uniforms[a]={name:a,location:c,type:u,size:o,glTypeInfo:h},u!==e.SAMPLER_2D&&u!==e.SAMPLER_CUBE||(t.uniforms[a].textureIndex=r,r+=o),Object.defineProperty(t,a,{set:h.size>1||o>1?function(t){f(c,t);}:function(e){t._dict[a]!==e&&(t._dict[a]=e,l(c,e));}});},a=0;a<i;a++)s(a);},destroyIfNoRef:function(t){return t.resourceManager.destroyIfNoRef(this),this},destroy:function(){return this._isDestroyed?this:(this.gl.deleteProgram(this.program),this.uniforms=null,this.attributes=null,this.program=null,this.gl=null,this.state=null,this._dict=null,Mt.removeObject(this),this._isDestroyed=!0,this)}}),It=At,Lt=C.a.ARRAY_BUFFER,Ot=C.a.ELEMENT_ARRAY_BUFFER,St=C.a.STATIC_DRAW,Rt=new J,yt=s.a.create({Statics:{cache:{get:function(){return Rt}},reset:function(t){Rt.each(function(t){t.destroy();});},createVertexBuffer:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:St;return this.createBuffer(t,Lt,e,n)},createBuffer:function(t,e,n,i){var r=n.bufferViewId,s=Rt.get(r);return s||(s=new yt(t,e,n.data,i),Rt.add(r,s),s)},createIndexBuffer:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:St;return this.createBuffer(t,Ot,e,n)}},className:"Buffer",isBuffer:!0,constructor:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Lt,n=arguments.length>2?arguments[2]:void 0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:St;this.id=d.a.generateUUID(this.className),this.gl=t,this.target=e,this.usage=i,this.buffer=t.createBuffer(),n&&this.upload(n);},bind:function(){return this.gl.bindBuffer(this.target,this.buffer),this},upload:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.gl,i=this.target,r=this.usage;return this.bind(),!this.data||this.data.byteLength<t.byteLength?n.bufferData(i,t,r):n.bufferSubData(i,e,t),this.data=t,this},destroyIfNoRef:function(t){return t.resourceManager.destroyIfNoRef(this),this},destroy:function(){return this._isDestroyed?this:(this.gl.deleteBuffer(this.buffer),this.data=null,Rt.removeObject(this),this._isDestroyed=!0,this)}}),xt=yt,Nt=new ArrayBuffer(1),bt={getTypedArray:function(t,e){return this._updateBuffer(e*t.BYTES_PER_ELEMENT),new t(Nt,0,e)},fillArrayData:function(t,e){for(var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=0,r=e.length;i<r;i++)t[n+i]=e[i];},_updateBuffer:function(t){Nt.byteLength<t&&(Nt=new ArrayBuffer(2*t));}},wt=C.a.TRIANGLES,Ct=[],Pt=null,Ht=new J,Dt=s.a.create({Statics:{cache:{get:function(){return Ht}},getVao:function(t,e,n){var i=Ht.get(e);return i?n.mode&&n.mode!==i.mode&&(i.mode=n.mode):(i=new Dt(t,e,n),Ht.add(e,i)),i},reset:function(t){Pt=null,Ct=[],this.bindSystemVao(),Ht.each(function(e){e.destroy(t);});},bindSystemVao:function(){tt.vao&&tt.vao.bindVertexArrayOES(null),Pt=null;}},className:"VertexArrayObject",isVertexArrayObject:!0,vertexCount:null,useVao:!1,useInstanced:!1,mode:wt,isDirty:!0,constructor:function(t,e,n){this.gl=t,this.id=e,this.vaoExtension=tt.vao,this.instancedExtension=tt.instanced,Object.assign(this,n),this.vaoExtension||(this.useVao=!1),this.instancedExtension||(this.useInstanced=!1),this.useVao&&(this.vao=this.vaoExtension.createVertexArrayOES()),this.attributes=[],this.activeStates=[],this.indexBuffer=null;},bind:function(){Pt!==this&&(this.useVao?this.vaoExtension.bindVertexArrayOES(this.vao):this.bindSystemVao(),Pt=this);},bindSystemVao:function(){var t=this.gl;Pt&&Pt.useVao&&Pt.unbind();var e,n=this.activeStates;this.attributes.forEach(function(t){var n=t.buffer,i=t.attribute,r=t.geometryData;e!==n&&(e=n,n.bind()),i.enable(),i.pointer(r),t.useInstanced?i.divisor(1):i.divisor(0);}),Ct.forEach(function(e,i){var r=n[i];e&&!r&&(e.attribute.divisor(0),t.disableVertexAttribArray(i));}),this.indexBuffer&&this.indexBuffer.bind(),Ct=n;},unbind:function(){this.useVao&&this.vaoExtension.bindVertexArrayOES(null),Pt=null;},draw:function(){this.bind();var t=this.gl,e=this.mode;this.indexBuffer?t.drawElements(e,this.vertexCount,this.indexType,0):t.drawArrays(e,0,this.getVertexCount());},getVertexCount:function(){if(null===this.vertexCount){var t=this.attributes[0];this.vertexCount=t?t.geometryData.count:0;}return this.vertexCount},drawInstance:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.bind();var e=this.gl,n=this.mode;this.useInstanced&&(this.indexBuffer?this.instancedExtension.drawElementsInstancedANGLE(n,this.vertexCount,e.UNSIGNED_SHORT,0,t):this.instancedExtension.drawArraysInstancedANGLE(n,0,this.getVertexCount(),t));},addIndexBuffer:function(t,e){this.bind();var n=this.gl,i=this.indexBuffer;return this.indexType=t.type,i?t.isDirty&&(t.isDirty=!1,i.upload(t.data),this.vertexCount=t.length):((i=xt.createIndexBuffer(n,t,e)).bind(),this.indexBuffer=i,this.vertexCount=t.length,t.isDirty=!1),i},addAttribute:function(t,e,n,i){this.bind();var r=this.gl,s=e.name,a=this[s];if(a)t.isDirty&&(t.isDirty=!1,a.buffer.upload(t.data));else{t.isDirty=!1;var o=xt.createVertexBuffer(r,t,n);o.bind(),e.enable(),e.pointer(t),a={attribute:e,buffer:o,geometryData:t},this.attributes.push(a),this[s]=a,e.addTo(this.activeStates,a),i&&i(a);}return a},addInstancedAttribute:function(t,e,n){this.bind();var i=this.gl,r=t.name,s=t.glTypeInfo,a=bt.getTypedArray(Float32Array,e.length*s.size);e.forEach(function(t,e){void 0!==n(t)?bt.fillArrayData(a,n(t),e*s.size):m.a.warn("no attributeData:"+r+"-"+t.name);});var o,u=this[r];return u?(o=u.geometryData).data=a:o=new w(a,1),this.addAttribute(o,t,i.DYNAMIC_DRAW,function(e){t.divisor(1),e.useInstanced=!0;})},useResource:function(t,e){return this.attributes.forEach(function(n){t.useResource(n.buffer,e);}),this.indexBuffer&&t.useResource(this.indexBuffer,e),this},destroyIfNoRef:function(t){return t.resourceManager.destroyIfNoRef(this),this},destroy:function(){var t=this;return this._isDestroyed?this:(this.useVao&&this.vaoExtension.deleteVertexArrayOES(this.vao),this.gl=null,this.indexBuffer=null,this.attributes.forEach(function(e){t[e.name]=null;}),this.attributes=null,this.activeStates=null,Ht.removeObject(this),this._isDestroyed=!0,this)}}),Ft=Dt,Ut=C.a.TEXTURE_2D,Gt=C.a.RGBA,Bt=C.a.LINEAR,Vt=C.a.NEAREST,Xt=C.a.REPEAT,jt=C.a.CLAMP_TO_EDGE,kt=C.a.UNSIGNED_BYTE,zt=new J,qt=s.a.create({Statics:{cache:{get:function(){return zt}},reset:function(t){zt.each(function(e,n){t.deleteTexture(e),zt.remove(n);});}},isTexture:!0,className:"Texture",image:null,mipmaps:null,target:Ut,internalFormat:Gt,format:Gt,type:kt,width:0,height:0,border:0,magFilter:Bt,minFilter:Bt,wrapS:Xt,wrapT:Xt,name:"",premultiplyAlpha:!1,flipY:!1,compressed:!1,needUpdate:!0,needDestory:!1,autoUpdate:!1,uv:0,anisotropic:1,origWidth:{get:function(){return this._originImage?this._originImage.width:this.image?this.image.width:this.width}},origHeight:{get:function(){return this.originImage?this._originImage.height:this.image?this.image.height:this.height}},useMipmap:{get:function(){return this.minFilter!==Bt&&this.minFilter!==Vt},set:function(){m.a.warn("texture.useMipmap is readOnly!");}},useRepeat:{get:function(){return this.wrapS!==jt||this.wrapT!==jt},set:function(){m.a.warn("texture.useRepeat is readOnly!");}},mipmapCount:{get:function(){return Math.floor(Math.log2(Math.max(this.width,this.height))+1)},set:function(){m.a.warn("texture.mipmapCount is readOnly!");}},constructor:function(t){this.id=d.a.generateUUID(this.className),Object.assign(this,t);},isImgPowerOfTwo:function(t){return d.a.isPowerOfTwo(t.width)&&d.a.isPowerOfTwo(t.height)},getSupportSize:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=t.width,i=t.height;e&&!this.isImgPowerOfTwo(t)&&(n=d.a.nextPowerOfTwo(n),i=d.a.nextPowerOfTwo(i));var r=et.MAX_TEXTURE_SIZE;return r&&(n>r&&(n=r),i>r&&(i=r)),{width:n,height:i}},resizeImgToPowerOfTwo:function(t){var e=this.getSupportSize(t,!0);return this.resizeImg(t,e.width,e.height)},resizeImg:function(t,e,n){if(t.width===e&&t.height===n)return t;var i=this._canvasImage;return i?(i.width=e,i.height=n,this._canvasCtx=i.getContext("2d")):((i=document.createElement("canvas")).width=e,i.height=n,this._canvasImage=i,this._canvasCtx=i.getContext("2d")),this._canvasCtx.drawImage(t,0,0,t.width,t.height,0,0,e,n),m.a.warnOnce("Texture.resizeImg(".concat(this.id,")"),"image size(".concat(t.width,"x").concat(t.height,") is not support. Resized to ").concat(i.width,"x").concat(i.height),t.src),this._originImage=t,i},_glUploadTexture:function(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:this.width,s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:this.height,a=t.gl;return this.compressed?a.compressedTexImage2D(e,i,this.internalFormat,r,s,this.border,n):n&&void 0!==n.width?a.texImage2D(e,i,this.internalFormat,this.format,this.type,n):a.texImage2D(e,i,this.internalFormat,r,s,this.border,this.format,this.type,n),this},_uploadTexture:function(t){var e=this;return this.useMipmap&&this.mipmaps?this.mipmaps.forEach(function(n,i){e._glUploadTexture(t,e.target,n.data,i,n.width,n.height);}):this._glUploadTexture(t,this.target,this.image,0),this},updateTexture:function(t,e){var n=t.gl;if(this.needUpdate||this.autoUpdate){this._originImage&&this.image===this._canvasImage&&(this.image=this._originImage);var i=this.useMipmap,r=this.useRepeat;if(this.image&&!this.image.length){var s=r||i,a=this.getSupportSize(this.image,s);this.image=this.resizeImg(this.image,a.width,a.height),this.width=this.image.width,this.height=this.image.height;}t.activeTexture(n.TEXTURE0+et.MAX_TEXTURE_INDEX),t.bindTexture(this.target,e),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha),t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!!this.flipY);var o=tt.textureFilterAnisotropic;o&&this.anisotropic>1&&n.texParameterf(this.target,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(this.anisotropic,et.MAX_TEXTURE_MAX_ANISOTROPY)),this._uploadTexture(t),i&&(this.compressed?this.mipmaps||(m.a.warn("Compressed texture has no mipmips, changed the minFilter from ".concat(this.minFilter," to Linear!"),this),this.minFilter=Bt):n.generateMipmap(this.target)),n.texParameterf(this.target,n.TEXTURE_MAG_FILTER,this.magFilter),n.texParameterf(this.target,n.TEXTURE_MIN_FILTER,this.minFilter),n.texParameterf(this.target,n.TEXTURE_WRAP_S,this.wrapS),n.texParameterf(this.target,n.TEXTURE_WRAP_T,this.wrapT),this.needUpdate=!1;}return this._needUpdateSubTexture&&(this._uploadSubTextures(t,e),this._needUpdateSubTexture=!1),this},_uploadSubTextures:function(t,e){var n=this;if(this._subTextureList&&this._subTextureList.length>0){var i=t.gl;t.activeTexture(i.TEXTURE0+et.MAX_TEXTURE_INDEX),t.bindTexture(this.target,e),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha),t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!!this.flipY),this._subTextureList.forEach(function(t){var e=t[0],r=t[1],s=t[2];i.texSubImage2D(n.target,0,e,r,n.format,n.type,s);}),this._subTextureList.length=0;}},_needUpdateSubTexture:!1,_subTextureList:null,updateSubTexture:function(t,e,n){this._subTextureList||(this._subTextureList=[]),this._subTextureList.push([t,e,n]),this._needUpdateSubTexture=!0;},getGLTexture:function(t){this.state=t;var e=this.gl=t.gl,n=this.id;this.needDestory&&(this.destroy(),this.needDestory=!1);var i=zt.get(n);return i?this.updateTexture(t,i):(i=e.createTexture(),zt.add(n,i),this.needUpdate=!0,this.updateTexture(t,i)),i},setGLTexture:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return e&&this.destroy(),zt.add(this.id,t),this},destroy:function(){var t=this.id,e=zt.get(t);return e&&this.gl&&(this.gl.deleteTexture(e),zt.remove(t)),this},clone:function(){var t=Object.assign({},this);return delete t.id,new this.constructor(t)}}),Wt=C.a.TEXTURE_2D,Yt=C.a.RGBA,Zt=C.a.UNSIGNED_BYTE,Kt=C.a.COLOR_ATTACHMENT0,Qt=C.a.DEPTH_STENCIL,Jt=C.a.DEPTH_TEST,$t=C.a.CULL_FACE,te=C.a.TRIANGLE_STRIP,ee=C.a.NEAREST,ne=C.a.CLAMP_TO_EDGE,ie=new J,re=s.a.create({Statics:{cache:{get:function(){return ie}},reset:function(t){ie.each(function(t){t.reset();});},destroy:function(t){ie.each(function(t){t.destroy();});}},className:"Framebuffer",isFramebuffer:!0,bufferInternalFormat:Qt,target:Wt,format:Yt,internalFormat:Yt,type:Zt,minFilter:ee,magFilter:ee,data:null,attachment:Kt,needRenderbuffer:!0,useVao:!0,renderer:null,texture:null,renderbuffer:null,framebuffer:null,_isInit:!1,constructor:function(t,e){this.id=d.a.generateUUID(this.className),this.renderer=t,Object.assign(this,e),this.width||(this.width=t.width),this.height||(this.height=t.height),ie.add(this.id,this);},init:function(){if(!this._isInit&&this.renderer.isInit){this._isInit=!0;var t=this.renderer;this.gl=t.gl,this.state=t.state,this.reset();}},reset:function(){this.destroyResource();var t=this.gl;this.framebuffer=t.createFramebuffer(),this.bind(),this.needRenderbuffer&&(this.renderbuffer=this.createRenderbuffer()),this.texture=this.createTexture(),this.isComplete()||m.a.warn("Framebuffer is not complete => "+t.checkFramebufferStatus(t.FRAMEBUFFER)),this.unbind();},isComplete:function(){var t=this.gl;return !(!t||t.checkFramebufferStatus(t.FRAMEBUFFER)!==t.FRAMEBUFFER_COMPLETE)},bind:function(){this.init(),this._isInit&&this.state.bindFramebuffer(this.gl.FRAMEBUFFER,this.framebuffer);},unbind:function(){if(this.init(),this._isInit){var t=this.state;t.bindFramebuffer(this.gl.FRAMEBUFFER,t.preFramebuffer);}},clear:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new v.a(0,0,0,0);if(this._isInit){var e=this.gl;e.clearColor(t.r,t.g,t.b,t.a),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT);}},render:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,r=arguments.length>4?arguments[4]:void 0;if(this._isInit){var s=this.gl,a=this.state;a.disable(Jt),a.disable($t),r&&this.clear(r);var o=dt.getCustomShader(_t.a,gt.a,"","FramebufferTextureShader"),u=It.getProgram(o,a);u.useProgram();var c="".concat(t,"_").concat(e,"_").concat(n,"_").concat(i,"_").concat(u.id),h=Ft.getVao(s,c,{useVao:this.useVao,useInstanced:!1,mode:te});if(h.isDirty){h.isDirty=!1;var f=[t=2*t-1,e=1-2*e,t+(n*=2),e,t,e-(i*=2),t+n,e-i];h.addAttribute(new w(new Float32Array(f),2),u.attributes.a_position),h.addAttribute(new w(new Float32Array([0,1,1,1,0,0,1,0]),2),u.attributes.a_texcoord0);}a.activeTexture(s.TEXTURE0),a.bindTexture(s.TEXTURE_2D,this.texture.getGLTexture(a)),h.draw();}},createRenderbuffer:function(){var t=this.gl,e=this.width,n=this.height,i=t.createRenderbuffer();return t.bindRenderbuffer(t.RENDERBUFFER,i),t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_STENCIL,e,n),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,i),i},createTexture:function(){var t=this.state,e=t.gl,n=new qt({minFilter:this.minFilter,magFilter:this.magFilter,internalFormat:this.internalFormat,format:this.format,type:this.type,width:this.width,height:this.height,image:this.data,wrapS:ne,wrapT:ne}),i=n.getGLTexture(t);return e.framebufferTexture2D(e.FRAMEBUFFER,this.attachment,this.target,i,0),n},resize:function(t,e,n){(n||this.width!==t||this.height!==e)&&(this.width=t,this.height=e,this._isInit&&this.reset());},readPixels:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,s=Object(r.getTypedArrayClass)(this.type),a=new s(n*i*4);if(this._isInit){var o=this.gl;e=this.height-e-i,this.bind(),o.readPixels(t,e,n,i,this.format,this.type,a),this.unbind();}return a},destroy:function(){this.destroyResource(),this.gl=null,ie.removeObject(this);},destroyResource:function(){var t=this.gl;t&&(this.framebuffer&&(t.deleteFramebuffer(this.framebuffer),this.framebuffer=null),this.renderbuffer&&(t.deleteRenderbuffer(this.renderbuffer),this.renderbuffer=null),this.texture&&(this.texture.destroy(),this.texture=null));}}),se=C.a.TEXTURE_CUBE_MAP,ae=C.a.RGB,oe=C.a.LINEAR,ue=C.a.CLAMP_TO_EDGE,ce=C.a.TEXTURE_CUBE_MAP_POSITIVE_X,he=s.a.create({Extends:qt,isCubeTexture:!0,className:"CubeTexture",target:se,internalFormat:ae,format:ae,magFilter:oe,minFilter:oe,wrapS:ue,wrapT:ue,constructor:function(t){he.superclass.constructor.call(this,t),this.image=this.image||[];},_uploadTexture:function(t){var e=this,n=this.image;Array.isArray(n)&&6===n.length?(n[0]&&n[0].width&&(this.width=n[0].width,this.height=n[0].height),n.forEach(function(n,i){e._glUploadTexture(t,ce+i,n,0);})):m.a.error("CubeTexture image must be an Array of length 6",n);},right:{get:function(){return this.image[0]},set:function(t){this.image[0]=t;}},left:{get:function(){return this.image[1]},set:function(t){this.image[1]=t;}},top:{get:function(){return this.image[2]},set:function(t){this.image[2]=t;}},bottom:{get:function(){return this.image[3]},set:function(t){this.image[3]=t;}},front:{get:function(){return this.image[4]},set:function(t){this.image[4]=t;}},back:{get:function(){return this.image[5]},set:function(t){this.image[5]=t;}}}),fe=he,le=C.a.TEXTURE_2D,de=C.a.RGBA,me=C.a.NEAREST,_e=C.a.CLAMP_TO_EDGE,pe=C.a.FLOAT,ge=s.a.create({Extends:qt,isDataTexture:!0,className:"DataTexture",target:le,internalFormat:de,format:de,type:pe,magFilter:me,minFilter:me,wrapS:_e,wrapT:_e,dataLength:0,resetSize:function(t){if(t!==this.dataLength){this.dataLength=t;var e=d.a.nextPowerOfTwo(t/4),n=Math.max(Math.log2(e),4),i=Math.floor(n/2),s=n-i;this.width=Math.pow(2,i),this.height=Math.pow(2,s),this.DataClass=Object(r.getTypedArrayClass)(this.type);}},data:{get:function(){return this.image},set:function(t){if(this.image!==t){this.resetSize(t.length);var e=this.width*this.height*4;e===t.length&&t instanceof this.DataClass?this.image=t:(this.image&&this.image.length===e||(this.image=new this.DataClass(e)),this.image.set(t,0)),this.needUpdate=!0;}}},constructor:function(t){ge.superclass.constructor.call(this,t);}}),ve=ge;function Ee(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],i=!0,r=!1,s=void 0;try{for(var a,o=t[Symbol.iterator]();!(i=(a=o.next()).done)&&(n.push(a.value),!e||n.length!==e);i=!0);}catch(t){r=!0,s=t;}finally{try{i||null==o.return||o.return();}finally{if(r)throw s}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var Te,Me,Ae,Ie,Le,Oe,Se=new c.a,Re=new y.a,ye=new o.a,xe=new Float32Array([.5,.5,.5,1]),Ne=new Float32Array([0,0]),be={state:null,camera:null,lightManager:null,fog:null,gl:null,renderer:null,blankInfo:{get:function(){}},init:function(t,e,n,i,r){Oe=this._renderer=t,Ie=this.state=e,Te=this.camera=n,Ae=this.lightManager=i,Le=this.fog=r,Me=this.gl=Ie.gl;},setCamera:function(t){Te=this.camera=t;},handlerColorOrTexture:function(t,e){return t&&t.isTexture?this.handlerTexture(t,e):(t&&t.isColor?t.toArray(xe):xe[0]=xe[1]=xe[2]=.5,xe)},handlerTexture:function(t,e){if(t&&t.isTexture)return this.handlerGLTexture(t.target,t.getGLTexture(Ie),e)},handlerGLTexture:function(t,e,n){if(e)return Ie.activeTexture(Me.TEXTURE0+n),Ie.bindTexture(t,e),n},handlerUV:function(t){return t&&t.isTexture&&t.uv||0},POSITION:{get:function(t,e,n){return t.geometry.vertices}},NORMAL:{get:function(t,e,n){return t.geometry.normals}},TANGENT:{get:function(t,e,n){var i=e.normalMap;if(i&&i.isTexture)return 1===Number(i.uv)?t.geometry.tangents1:t.geometry.tangents}},TEXCOORD_0:{get:function(t,e,n){if(t.geometry.uvs)return t.geometry.uvs}},TEXCOORD_1:{get:function(t,e,n){if(t.geometry.uvs1)return t.geometry.uvs1}},UVMATRIX_0:{get:function(t,e,n){if(e.uvMatrix)return e.uvMatrix.elements}},UVMATRIX_1:{get:function(t,e,n){if(e.uvMatrix1)return e.uvMatrix1.elements}},CAMERAFAR:{get:function(t,e,n){if(Te.isPerspectiveCamera)return Te.far}},CAMERANEAR:{get:function(t,e,n){if(Te.isPerspectiveCamera)return Te.near}},CAMERATYPE:{get:function(t,e,n){return Te.isPerspectiveCamera?1:0}},CAMERAPOSITION:{get:function(t,e,n){return Te.worldMatrix.getTranslation(Se).elements}},COLOR_0:{get:function(t,e,n){if(t.geometry.colors)return t.geometry.colors}},SKININDICES:{get:function(t,e,n){return t.geometry.skinIndices}},SKINWEIGHTS:{get:function(t,e,n){return t.geometry.skinWeights}},RENDERERSIZE:{get:function(t,e,n){return Ne[0]=Oe.width,Ne[1]=Oe.height,Ne}},LOCAL:{get:function(t,e,n){return t.matrix.elements},isDependMesh:!0},MODEL:{get:function(t,e,n){return t.worldMatrix.elements},isDependMesh:!0},VIEW:{get:function(t,e,n){return Te.viewMatrix.elements}},PROJECTION:{get:function(t,e,n){return Te.projectionMatrix.elements}},VIEWPROJECTION:{get:function(t,e,n){return Te.viewProjectionMatrix.elements}},MODELVIEW:{get:function(t,e,n){return Te.getModelViewMatrix(t,ye).elements},isDependMesh:!0},MODELVIEWPROJECTION:{get:function(t,e,n){return Te.getModelProjectionMatrix(t,ye).elements},isDependMesh:!0},MODELINVERSE:{get:function(t,e,n){return ye.invert(t.worldMatrix).elements},isDependMesh:!0},VIEWINVERSE:{get:function(t,e,n){return Te.worldMatrix.elements}},VIEWINVERSEINVERSETRANSPOSE:{get:function(t,e,n){return Re.normalFromMat4(Te.worldMatrix).elements}},PROJECTIONINVERSE:{get:function(t,e,n){return ye.invert(Te.projectionMatrix).elements}},MODELVIEWINVERSE:{get:function(t,e,n){return ye.invert(Te.getModelViewMatrix(t,ye)).elements},isDependMesh:!0},MODELVIEWPROJECTIONINVERSE:{get:function(t,e,n){return ye.invert(Te.getModelProjectionMatrix(t,ye)).elements},isDependMesh:!0},MODELINVERSETRANSPOSE:{get:function(t,e,n){return Re.normalFromMat4(t.worldMatrix).elements},isDependMesh:!0},MODELVIEWINVERSETRANSPOSE:{get:function(t,e,n){return Re.normalFromMat4(Te.getModelViewMatrix(t,ye)).elements},isDependMesh:!0},VIEWPORT:void 0,JOINTMATRIX:{get:function(t,e,n){if(t.isSkinedMesh)return t.getJointMat();m.a.warnOnce("semantic.JOINTMATRIX(".concat(t.id,")"),"Current mesh is not SkinedMesh!",t.id);},isDependMesh:!0,notSupportInstanced:!0},JOINTMATRIXTEXTURE:{get:function(t,e,n){if(t.isSkinedMesh)return t.updateJointMatTexture(),be.handlerTexture(t.jointMatTexture,n.textureIndex);m.a.warnOnce("semantic.JOINTMATRIXTEXTURE(".concat(t.id,")"),"Current mesh is not SkinedMesh!",t.id);},isDependMesh:!0,notSupportInstanced:!0},JOINTMATRIXTEXTURESIZE:{get:function(t,e,n){if(t.isSkinedMesh)return t.initJointMatTexture(),[t.jointMatTexture.width,t.jointMatTexture.height];m.a.warnOnce("semantic.JOINTMATRIXTEXTURESIZE(".concat(t.id,")"),"Current mesh is not SkinedMesh!",t.id);},isDependMesh:!0,notSupportInstanced:!0},NORMALMAPSCALE:{get:function(t,e,n){return e.normalMapScale}},OCCLUSIONSTRENGTH:{get:function(t,e,n){return e.occlusionStrength}},SHININESS:{get:function(t,e,n){return e.shininess}},SPECULARENVMATRIX:{get:function(t,e,n){return e.specularEnvMatrix&&e.specularEnvMap?e.specularEnvMatrix.elements:(ye.identity(),ye.elements)}},REFLECTIVITY:{get:function(t,e,n){return e.reflectivity}},REFRACTRATIO:{get:function(t,e,n){return e.refractRatio}},REFRACTIVITY:{get:function(t,e,n){return e.refractivity}},LOGDEPTH:{get:function(t,e,n){return 2/(Math.log(Te.far+1)/Math.LN2)}},AMBIENTLIGHTSCOLOR:{get:function(t,e,n){return Ae.ambientInfo}},DIRECTIONALLIGHTSCOLOR:{get:function(t,e,n){return Ae.directionalInfo.colors}},DIRECTIONALLIGHTSINFO:{get:function(t,e,n){return Ae.directionalInfo.infos}},DIRECTIONALLIGHTSSHADOWMAP:{get:function(t,e,n){return Ae.directionalInfo.shadowMap.map(function(t,e){return be.handlerTexture(t,n.textureIndex+e)})}},DIRECTIONALLIGHTSSHADOWMAPSIZE:{get:function(t,e,n){return Ae.directionalInfo.shadowMapSize}},DIRECTIONALLIGHTSSHADOWBIAS:{get:function(t,e,n){return Ae.directionalInfo.shadowBias}},DIRECTIONALLIGHTSPACEMATRIX:{get:function(t,e,n){return Ae.directionalInfo.lightSpaceMatrix}},POINTLIGHTSPOS:{get:function(t,e,n){return Ae.pointInfo.poses}},POINTLIGHTSCOLOR:{get:function(t,e,n){return Ae.pointInfo.colors}},POINTLIGHTSINFO:{get:function(t,e,n){return Ae.pointInfo.infos}},POINTLIGHTSRANGE:{get:function(t,e,n){return Ae.pointInfo.ranges}},POINTLIGHTSSHADOWMAP:{get:function(t,e,n){return Ae.pointInfo.shadowMap.map(function(t,e){return be.handlerTexture(t,n.textureIndex+e)})}},POINTLIGHTSSHADOWBIAS:{get:function(t,e,n){return Ae.pointInfo.shadowBias}},POINTLIGHTSPACEMATRIX:{get:function(t,e,n){return Ae.pointInfo.lightSpaceMatrix}},POINTLIGHTCAMERA:{get:function(t,e,n){return Ae.pointInfo.cameras}},SPOTLIGHTSPOS:{get:function(t,e,n){return Ae.spotInfo.poses}},SPOTLIGHTSDIR:{get:function(t,e,n){return Ae.spotInfo.dirs}},SPOTLIGHTSCOLOR:{get:function(t,e,n){return Ae.spotInfo.colors}},SPOTLIGHTSCUTOFFS:{get:function(t,e,n){return Ae.spotInfo.cutoffs}},SPOTLIGHTSINFO:{get:function(t,e,n){return Ae.spotInfo.infos}},SPOTLIGHTSRANGE:{get:function(t,e,n){return Ae.spotInfo.ranges}},SPOTLIGHTSSHADOWMAP:{get:function(t,e,n){return Ae.spotInfo.shadowMap.map(function(t,e){return be.handlerTexture(t,n.textureIndex+e)})}},SPOTLIGHTSSHADOWMAPSIZE:{get:function(t,e,n){return Ae.spotInfo.shadowMapSize}},SPOTLIGHTSSHADOWBIAS:{get:function(t,e,n){return Ae.spotInfo.shadowBias}},SPOTLIGHTSPACEMATRIX:{get:function(t,e,n){return Ae.spotInfo.lightSpaceMatrix}},AREALIGHTSCOLOR:{get:function(t,e,n){return Ae.areaInfo.colors}},AREALIGHTSPOS:{get:function(t,e,n){return Ae.areaInfo.poses}},AREALIGHTSWIDTH:{get:function(t,e,n){return Ae.areaInfo.width}},AREALIGHTSHEIGHT:{get:function(t,e,n){return Ae.areaInfo.height}},AREALIGHTSLTCTEXTURE1:{get:function(t,e,n){return be.handlerTexture(Ae.areaInfo.ltcTexture1,n.textureIndex)}},AREALIGHTSLTCTEXTURE2:{get:function(t,e,n){return be.handlerTexture(Ae.areaInfo.ltcTexture2,n.textureIndex)}},FOGCOLOR:{get:function(t,e,n){if(Le)return Le.color.elements}},FOGINFO:{get:function(t,e,n){if(Le)return Le.getInfo()}},POSITIONDECODEMAT:{get:function(t,e,n){return t.geometry.positionDecodeMat},isDependMesh:!0},NORMALDECODEMAT:{get:function(t,e,n){return t.geometry.normalDecodeMat},isDependMesh:!0},UVDECODEMAT:{get:function(t,e,n){return t.geometry.uvDecodeMat},isDependMesh:!0},UV1DECODEMAT:{get:function(t,e,n){return t.geometry.uv1DecodeMat},isDependMesh:!0},BASECOLOR:{get:function(t,e,n){return e.baseColor.elements}},METALLIC:{get:function(t,e,n){return e.metallic}},ROUGHNESS:{get:function(t,e,n){return e.roughness}},DIFFUSEENVMAP:{get:function(t,e,n){return be.handlerTexture(e.diffuseEnvMap,n.textureIndex)}},DIFFUSEENVINTENSITY:{get:function(t,e,n){return e.diffuseEnvIntensity}},DIFFUSEENVSPHEREHARMONICS3:{get:function(t,e,n){var i=e.diffuseEnvSphereHarmonics3;if(i)return i.toArray()}},BRDFLUT:{get:function(t,e,n){return be.handlerTexture(e.brdfLUT,n.textureIndex)}},SPECULARENVMAP:{get:function(t,e,n){return be.handlerTexture(e.specularEnvMap,n.textureIndex)}},SPECULARENVINTENSITY:{get:function(t,e,n){return e.specularEnvIntensity}},SPECULARENVMAPMIPCOUNT:{get:function(t,e,n){var i=e.specularEnvMap;return i?i.mipmapCount:1}},GLOSSINESS:{get:function(t,e,n){return e.glossiness}},ALPHACUTOFF:{get:function(t,e,n){return e.alphaCutoff}},EXPOSURE:{get:function(t,e,n){return e.exposure}},GAMMAFACTOR:{get:function(t,e,n){return e.gammaFactor}},MORPHWEIGHTS:{isDependMesh:!0,notSupportInstanced:!0,get:function(t,e,n){var i=t.geometry;if(i.isMorphGeometry&&i.weights)return i.weights}}};[["POSITION","vertices"],["NORMAL","normals"],["TANGENT","tangents"]].forEach(function(t){for(var e=0;e<8;e++)be["MORPH"+t[0]+e]={get:function(t,e){return function(n,i,r){var s=n.geometry;if(s.isMorphGeometry&&s.targets&&s.targets[t]){var a=s._originalMorphIndices?s._originalMorphIndices[e]:e,o=s.targets[t][a],u="_target_".concat(t,"_").concat(e);return s[u]!==a&&o&&(o.isDirty=!0,s[u]=a),o}}}(t[1],e)};}),[["DIFFUSE","diffuse"],["SPECULAR","specular"],["EMISSION","emission"],["AMBIENT","ambient"]].forEach(function(t){var e=Ee(t,2),n=e[0],i=e[1];be[n]={get:function(t,e,n){return be.handlerColorOrTexture(e[i],n.textureIndex)}},be["".concat(n,"UV")]={get:function(t,e,n){return be.handlerUV(e[i])}};}),[["NORMALMAP","normalMap"],["PARALLAXMAP","parallaxMap"],["BASECOLORMAP","baseColorMap"],["METALLICMAP","metallicMap"],["ROUGHNESSMAP","roughnessMap"],["METALLICROUGHNESSMAP","metallicRoughnessMap"],["OCCLUSIONMAP","occlusionMap"],["SPECULARGLOSSINESSMAP","specularGlossinessMap"],["LIGHTMAP","lightMap"]].forEach(function(t){var e=Ee(t,2),n=e[0],i=e[1];be[n]={get:function(t,e,n){return be.handlerTexture(e[i],n.textureIndex)}},be["".concat(n,"UV")]={get:function(t,e,n){return be.handlerUV(e[i])}};}),[["TRANSPARENCY","transparency"]].forEach(function(t){var e=Ee(t,2),n=e[0],i=e[1];be[n]={get:function(t,e,n){var r=e[i];return r&&r.isTexture?be.handlerTexture(r,n.textureIndex):null!=r?r:1}},be["".concat(n,"UV")]={get:function(t,e,n){return be.handlerUV(e[i])}};});var we=be,Ce=C.a.LEQUAL,Pe=C.a.BACK,He=C.a.FRONT,De=C.a.FRONT_AND_BACK,Fe=C.a.ZERO,Ue=C.a.FUNC_ADD,Ge=C.a.ONE,Be=C.a.SRC_ALPHA,Ve=C.a.ONE_MINUS_SRC_ALPHA,Xe={isBlankInfo:!0,get:function(){}},je=s.a.create({isMaterial:!0,className:"Material",shaderCacheId:null,lightType:"NONE",wireframe:!1,depthTest:!0,sampleAlphaToCoverage:!1,depthMask:!0,depthRange:[0,1],depthFunc:Ce,_cullFace:!0,normalMap:null,parallaxMap:null,normalMapScale:1,ignoreTranparent:!1,gammaCorrection:!1,usePhysicsLight:!1,isDiffuesEnvAndAmbientLightWorkTogether:!1,renderOrder:0,_premultiplyAlpha:!0,premultiplyAlpha:{get:function(){return this._premultiplyAlpha},set:function(t){this._premultiplyAlpha=t,this.transparent&&this.setDefaultTransparentBlend();}},gammaOutput:{get:function(){return m.a.warnOnce("Matrial.gammaOutput","material.gammaOutput has deprecated. Use material.gammaCorrection instead."),this.gammaCorrection},set:function(t){m.a.warnOnce("Matrial.gammaOutput","material.gammaOutput has deprecated. Use material.gammaCorrection instead."),this.gammaCorrection=t;}},gammaFactor:2.2,castShadows:!0,receiveShadows:!0,uvMatrix:null,uvMatrix1:null,cullFace:{get:function(){return this._cullFace},set:function(t){this._cullFace=t,t?this.cullFaceType=this._cullFaceType:this._side=De;}},_cullFaceType:Pe,cullFaceType:{get:function(){return this._cullFaceType},set:function(t){this._cullFaceType=t,this._cullFace&&(t===Pe?this._side=He:t===He&&(this._side=Pe));}},_side:He,side:{get:function(){return this._side},set:function(t){this._side!==t&&(this._side=t,t===De?this._cullFace=!1:(this._cullFace=!0,t===He?this._cullFaceType=Pe:t===Pe&&(this._cullFaceType=He)));}},blend:!1,blendEquation:Ue,blendEquationAlpha:Ue,blendSrc:Ge,blendDst:Fe,blendSrcAlpha:Ge,blendDstAlpha:Fe,isDirty:!1,transparency:1,_transparent:!1,transparent:{get:function(){return this._transparent},set:function(t){this._transparent!==t&&(this._transparent=t,t?this.setDefaultTransparentBlend():(this.blend=!1,this.depthMask=!0));}},setDefaultTransparentBlend:function(){this.blend=!0,this.depthMask=!1,this.premultiplyAlpha?(this.blendSrc=Ge,this.blendDst=Ve,this.blendSrcAlpha=Ge,this.blendDstAlpha=Ve):(this.blendSrc=Be,this.blendDst=Ve,this.blendSrcAlpha=Be,this.blendDstAlpha=Ve);},alphaCutoff:0,useHDR:!1,exposure:1,needBasicUnifroms:!0,needBasicAttributes:!0,constructor:function(t){this.id=d.a.generateUUID(this.className),this.uniforms={},this.attributes={},Object.assign(this,t),this.needBasicAttributes&&this.addBasicAttributes(),this.needBasicUnifroms&&this.addBasicUniforms();},addBasicAttributes:function(){var t=this.attributes;this._copyProps(t,{a_position:"POSITION",a_normal:"NORMAL",a_tangent:"TANGENT",a_texcoord0:"TEXCOORD_0",a_texcoord1:"TEXCOORD_1",a_color:"COLOR_0",a_skinIndices:"SKININDICES",a_skinWeights:"SKINWEIGHTS"}),["POSITION","NORMAL","TANGENT"].forEach(function(e){for(var n=e.slice(0,1)+e.slice(1).toLowerCase(),i=0;i<8;i++){var r="a_morph"+n+i;void 0===t[r]&&(t[r]="MORPH"+e+i);}});},addBasicUniforms:function(){this._copyProps(this.uniforms,{u_modelMatrix:"MODEL",u_viewMatrix:"VIEW",u_projectionMatrix:"PROJECTION",u_modelViewMatrix:"MODELVIEW",u_modelViewProjectionMatrix:"MODELVIEWPROJECTION",u_viewInverseNormalMatrix:"VIEWINVERSEINVERSETRANSPOSE",u_normalMatrix:"MODELVIEWINVERSETRANSPOSE",u_normalWorldMatrix:"MODELINVERSETRANSPOSE",u_cameraPosition:"CAMERAPOSITION",u_rendererSize:"RENDERERSIZE",u_logDepth:"LOGDEPTH",u_ambientLightsColor:"AMBIENTLIGHTSCOLOR",u_directionalLightsColor:"DIRECTIONALLIGHTSCOLOR",u_directionalLightsInfo:"DIRECTIONALLIGHTSINFO",u_directionalLightsShadowMap:"DIRECTIONALLIGHTSSHADOWMAP",u_directionalLightsShadowMapSize:"DIRECTIONALLIGHTSSHADOWMAPSIZE",u_directionalLightsShadowBias:"DIRECTIONALLIGHTSSHADOWBIAS",u_directionalLightSpaceMatrix:"DIRECTIONALLIGHTSPACEMATRIX",u_pointLightsPos:"POINTLIGHTSPOS",u_pointLightsColor:"POINTLIGHTSCOLOR",u_pointLightsInfo:"POINTLIGHTSINFO",u_pointLightsRange:"POINTLIGHTSRANGE",u_pointLightsShadowBias:"POINTLIGHTSSHADOWBIAS",u_pointLightsShadowMap:"POINTLIGHTSSHADOWMAP",u_pointLightSpaceMatrix:"POINTLIGHTSPACEMATRIX",u_pointLightCamera:"POINTLIGHTCAMERA",u_spotLightsPos:"SPOTLIGHTSPOS",u_spotLightsDir:"SPOTLIGHTSDIR",u_spotLightsColor:"SPOTLIGHTSCOLOR",u_spotLightsCutoffs:"SPOTLIGHTSCUTOFFS",u_spotLightsInfo:"SPOTLIGHTSINFO",u_spotLightsRange:"SPOTLIGHTSRANGE",u_spotLightsShadowMap:"SPOTLIGHTSSHADOWMAP",u_spotLightsShadowMapSize:"SPOTLIGHTSSHADOWMAPSIZE",u_spotLightsShadowBias:"SPOTLIGHTSSHADOWBIAS",u_spotLightSpaceMatrix:"SPOTLIGHTSPACEMATRIX",u_areaLightsPos:"AREALIGHTSPOS",u_areaLightsColor:"AREALIGHTSCOLOR",u_areaLightsWidth:"AREALIGHTSWIDTH",u_areaLightsHeight:"AREALIGHTSHEIGHT",u_areaLightsLtcTexture1:"AREALIGHTSLTCTEXTURE1",u_areaLightsLtcTexture2:"AREALIGHTSLTCTEXTURE2",u_jointMat:"JOINTMATRIX",u_jointMatTexture:"JOINTMATRIXTEXTURE",u_jointMatTextureSize:"JOINTMATRIXTEXTURESIZE",u_positionDecodeMat:"POSITIONDECODEMAT",u_normalDecodeMat:"NORMALDECODEMAT",u_uvDecodeMat:"UVDECODEMAT",u_uv1DecodeMat:"UV1DECODEMAT",u_morphWeights:"MORPHWEIGHTS",u_normalMapScale:"NORMALMAPSCALE",u_emission:"EMISSION",u_transparency:"TRANSPARENCY",u_uvMatrix:"UVMATRIX_0",u_uvMatrix1:"UVMATRIX_1",u_fogColor:"FOGCOLOR",u_fogInfo:"FOGINFO",u_alphaCutoff:"ALPHACUTOFF",u_exposure:"EXPOSURE",u_gammaFactor:"GAMMAFACTOR"}),this.addTextureUniforms({u_normalMap:"NORMALMAP",u_parallaxMap:"PARALLAXMAP",u_emission:"EMISSION",u_transparency:"TRANSPARENCY"});},addTextureUniforms:function(t){var e={};for(var n in t){var i=t[n];e[n]=i,e["".concat(n,".texture")]=i,e["".concat(n,".uv")]="".concat(i,"UV");}this._copyProps(this.uniforms,e);},getRenderOption:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=this.lightType;e["LIGHT_TYPE_".concat(n)]=1,e.SIDE=this.side,this.premultiplyAlpha&&(e.PREMULTIPLY_ALPHA=1);var i=this._textureOption.reset(e);return e.HAS_LIGHT&&(e.HAS_NORMAL=1,i.add(this.normalMap,"NORMAL_MAP",function(){1!==t.normalMapScale&&(e.NORMAL_MAP_SCALE=1);})),i.add(this.parallaxMap,"PARALLAX_MAP"),i.add(this.emission,"EMISSION_MAP"),i.add(this.transparency,"TRANSPARENCY_MAP"),this.ignoreTranparent&&(e.IGNORE_TRANSPARENT=1),this.alphaCutoff>0&&(e.ALPHA_CUTOFF=1),this.useHDR&&(e.USE_HDR=1),this.gammaCorrection&&(e.GAMMA_CORRECTION=1),this.receiveShadows&&(e.RECEIVE_SHADOWS=1),this.castShadows&&(e.CAST_SHADOWS=1),this.uvMatrix&&(e.UV_MATRIX=1),this.uvMatrix1&&(e.UV_MATRIX1=1),this.usePhysicsLight&&(e.USE_PHYSICS_LIGHT=1),this.isDiffuesEnvAndAmbientLightWorkTogether&&(e.IS_DIFFUESENV_AND_AMBIENTLIGHT_WORK_TOGETHER=1),i.update(),e},_textureOption:{uvTypes:null,option:null,reset:function(t){return this.option=t,this.uvTypes={},this},add:function(t,e,n){if(t&&t.isTexture){var i=this.uvTypes,r=this.option,s=t.uv||0;i[s]=1,r[e]=s,t.isCubeTexture&&(r["".concat(e,"_CUBE")]=1),n&&n(t);}return this},update:function(){var t=[0,1],e=this.uvTypes,n=this.option;for(var i in e)-1!==t.indexOf(Number(i))?n["HAS_TEXCOORD".concat(i)]=1:(m.a.warnOnce("Material._textureOption.update(".concat(i,")"),"uv_".concat(i," not support!")),n.HAS_TEXCOORD0=1);return this}},getInstancedUniforms:function(){var t=this._instancedUniforms;if(!this._instancedUniforms){var e=this.uniforms;for(var n in t=this._instancedUniforms=[],e){var i=this.getUniformInfo(n);i.isDependMesh&&!i.notSupportInstanced&&t.push({name:n,info:i});}}return t},getUniformData:function(t,e,n){return this.getUniformInfo(t).get(e,this,n)},getAttributeData:function(t,e,n){return this.getAttributeInfo(t).get(e,this,n)},getUniformInfo:function(t){return this.getInfo("uniforms",t)},getAttributeInfo:function(t){return this.getInfo("attributes",t)},getInfo:function(t,e){var n=this[t][e];return "string"==typeof n&&(n=we[n]),n&&n.get||(m.a.warnOnce("material.getInfo-"+e,"Material.getInfo: no this semantic:"+e),n=Xe),n},clone:function(){var t=new this.constructor;for(var e in this)"id"!==e&&(t[e]=this[e]);return t},destroyTextures:function(){this.getTextures().forEach(function(t){t.destroy();});},getTextures:function(){var t=[];for(var e in this){var n=this[e];n&&n.isTexture&&t.push(n);}return t},_copyProps:function(t,e){for(var n in e)void 0===t[n]&&(t[n]=e[n]);}}),ke=s.a.create({Extends:je,isBasicMaterial:!0,className:"BasicMaterial",lightType:"BLINN-PHONG",diffuse:null,ambient:null,specular:null,emission:null,specularEnvMap:null,specularEnvMatrix:null,reflectivity:0,refractRatio:0,refractivity:0,shininess:32,usedUniformVectors:11,constructor:function(t){this.diffuse=new v.a(.5,.5,.5),this.specular=new v.a(1,1,1),this.emission=new v.a(0,0,0),ke.superclass.constructor.call(this,t),Object.assign(this.uniforms,{u_diffuse:"DIFFUSE",u_specular:"SPECULAR",u_ambient:"AMBIENT",u_shininess:"SHININESS",u_reflectivity:"REFLECTIVITY",u_refractRatio:"REFRACTRATIO",u_refractivity:"REFRACTIVITY",u_specularEnvMap:"SPECULARENVMAP",u_specularEnvMatrix:"SPECULARENVMATRIX"}),this.addTextureUniforms({u_diffuse:"DIFFUSE",u_specular:"SPECULAR",u_ambient:"AMBIENT"});},getRenderOption:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};ke.superclass.getRenderOption.call(this,t);var e=this._textureOption.reset(t),n=this.lightType;"PHONG"!==n&&"BLINN-PHONG"!==n||(t.HAS_SPECULAR=1);var i=this.diffuse;return i&&i.isTexture&&(i.isCubeTexture?t.DIFFUSE_CUBE_MAP=1:e.add(this.diffuse,"DIFFUSE_MAP")),t.HAS_LIGHT&&(e.add(this.specular,"SPECULAR_MAP"),e.add(this.ambient,"AMBIENT_MAP"),e.add(this.specularEnvMap,"SPECULAR_ENV_MAP")),e.update(),t}}),ze=ke,qe=C.a.POSITION,We=C.a.NORMAL,Ye=C.a.DEPTH,Ze=C.a.DISTANCE,Ke=C.a.NONE,Qe=s.a.create({Extends:ze,isGeometryMaterial:!0,className:"GeometryMaterial",vertexType:qe,lightType:Ke,writeOriginData:!1,constructor:function(t){Qe.superclass.constructor.call(this,t),Object.assign(this.uniforms,{u_cameraFar:"CAMERAFAR",u_cameraNear:"CAMERANEAR",u_cameraType:"CAMERATYPE"});},getRenderOption:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};switch(Qe.superclass.getRenderOption.call(this,t),t["VERTEX_TYPE_".concat(this.vertexType)]=1,this.vertexType){case qe:t.HAS_FRAG_POS=1;break;case We:t.HAS_NORMAL=1;break;case Ye:break;case Ze:t.HAS_FRAG_POS=1;}return this.writeOriginData&&(t.WRITE_ORIGIN_DATA=1),t}}),Je=Qe,$e=s.a.create({Extends:O,isOrthographicCamera:!0,className:"OrthographicCamera",_left:-1,left:{get:function(){return this._left},set:function(t){this._needUpdateProjectionMatrix=!0,this._isGeometryDirty=!0,this._left=t;}},_right:1,right:{get:function(){return this._right},set:function(t){this._needUpdateProjectionMatrix=!0,this._isGeometryDirty=!0,this._right=t;}},_bottom:-1,bottom:{get:function(){return this._bottom},set:function(t){this._needUpdateProjectionMatrix=!0,this._isGeometryDirty=!0,this._bottom=t;}},_top:1,top:{get:function(){return this._top},set:function(t){this._needUpdateProjectionMatrix=!0,this._isGeometryDirty=!0,this._top=t;}},_near:.1,near:{get:function(){return this._near},set:function(t){this._needUpdateProjectionMatrix=!0,this._isGeometryDirty=!0,this._near=t;}},_far:1,far:{get:function(){return this._far},set:function(t){this._needUpdateProjectionMatrix=!0,this._isGeometryDirty=!0,this._far=t;}},constructor:function(t){$e.superclass.constructor.call(this,t),this.updateProjectionMatrix();},updateProjectionMatrix:function(){this.projectionMatrix.ortho(this.left,this.right,this.bottom,this.top,this.near,this.far);},getGeometry:function(t){if(t||!this._geometry||this._isGeometryDirty){this._isGeometryDirty=!1;var e=new Z,n=[this.left,this.bottom,-this.near],i=[this.right,this.bottom,-this.near],r=[this.right,this.top,-this.near],s=[this.left,this.top,-this.near],a=[this.left,this.bottom,-this.far],o=[this.right,this.bottom,-this.far],u=[this.right,this.top,-this.far],c=[this.left,this.top,-this.far];e.addRect(a,o,u,c),e.addRect(o,i,r,u),e.addRect(i,n,s,r),e.addRect(n,a,c,s),e.addRect(c,u,r,s),e.addRect(n,i,o,a),this._geometry=e;}return this._geometry}}),tn=$e,en=C.a.DEPTH,nn=C.a.BACK,rn=null,sn=new v.a(1,1,1),an=new o.a,on=function(t){return t.material.castShadows},un=s.a.create({isLightShadow:!0,className:"LightShadow",light:null,renderer:null,framebuffer:null,camera:null,width:1024,height:1024,maxBias:.05,minBias:.005,cameraInfo:null,debug:!1,constructor:function(t){this.id=d.a.generateUUID(this.className),Object.assign(this,t);},createFramebuffer:function(){this.framebuffer||(this.framebuffer=new re(this.renderer,{width:this.width,height:this.height}),this.debug&&this.showShadowMap());},updateLightCamera:function(t){this.light.isDirectionalLight?this.updateDirectionalLightCamera(t):this.light.isSpotLight&&this.updateSpotLightCamera(t);},updateDirectionalLightCamera:function(t){var e=this.light;if(this.camera.lookAt(e.direction),this.cameraInfo)this.updateCustumCamera(this.cameraInfo);else{var n=t.getGeometry();if(n){this.camera.updateViewMatrix(),an.multiply(this.camera.viewMatrix,t.worldMatrix);var i=n.getBounds(an);this.camera.near=-i.zMax,this.camera.far=-i.zMin,this.camera.left=i.xMin,this.camera.right=i.xMax,this.camera.bottom=i.yMin,this.camera.top=i.yMax;}}this.camera.updateViewMatrix();},updateCustumCamera:function(t){for(var e in t)this.camera[e]=t[e];},updateSpotLightCamera:function(t){var e=this.light;this.camera.lookAt(e.direction),this.cameraInfo?this.updateCustumCamera(this.cameraInfo):(this.camera.fov=2*e.outerCutoff,this.camera.near=.01,this.camera.far=t.far,this.camera.aspect=1),this.camera.updateViewMatrix();},createCamera:function(t){this.camera||(this.light.isDirectionalLight?this.camera=new tn:this.light.isSpotLight&&(this.camera=new Q),this.camera.addTo(this.light)),this._cameraMatrixVersion!==t.matrixVersion&&(this.updateLightCamera(t),this._cameraMatrixVersion=t.matrixVersion);},createShadowMap:function(t){this.createFramebuffer(),this.createCamera(t);var e=this.renderer,n=this.framebuffer,i=this.camera;rn||(rn=new Je({vertexType:en,side:nn,writeOriginData:!0})),n.bind(),e.state.viewport(0,0,this.width,this.height),e.clear(sn),i.updateViewProjectionMatrix(),we.setCamera(i),e.forceMaterial=rn,this.renderShadowScene(e),delete e.forceMaterial,n.unbind(),we.setCamera(t),e.viewport();},renderShadowScene:function(t){t.renderList.traverse(function(e){on(e)&&t.renderMesh(e);},function(e){t.renderInstancedMeshes(e.filter(function(t){return on(t)}));});},showShadowMap:function(){var t=this;this.renderer.on("afterRender",function(){t.framebuffer.render(0,.7,.3,.3);});}}),cn=C.a.DISTANCE,hn=C.a.BACK,fn=C.a.TEXTURE_CUBE_MAP,ln=C.a.TEXTURE0,dn=C.a.TEXTURE_CUBE_MAP_POSITIVE_X,mn=C.a.NEAREST,_n=C.a.FRAMEBUFFER,pn=C.a.FRAMEBUFFER_COMPLETE,gn=null,vn=new v.a(0,0,0,0),En=new c.a,Tn=[[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,-1,0,0,-1,0,0,0,1,0,0,-1,0,-1,0,0,-1,0]],Mn=function(t,e){if(t.material.castShadows){if(!t.frustumTest)return !0;if(e.isMeshVisible(t))return !0}return !1},An=s.a.create({isLightShadow:!0,className:"CubeLightShadow",Extends:un,light:null,renderer:null,framebuffer:null,camera:null,width:1024,height:1024,maxBias:.05,minBias:.005,debug:!1,constructor:function(t){An.superclass.constructor.call(this,t);},createFramebuffer:function(){if(!this.framebuffer){this.framebuffer=new re(this.renderer,{target:fn,width:1024,height:1024,createTexture:function(){var t=this.state.gl,e=new fe({image:[null,null,null,null,null,null],type:this.type,format:this.format,internalFormat:this.internalFormat,magFilter:mn,minFilter:mn,width:1024,height:1024});return t.checkFramebufferStatus(_n)!==pn&&m.a.warn("Framebuffer is not complete",t.checkFramebufferStatus(_n)),e},bindTexture:function(t){t=t||0;var e=this.state,n=e.gl,i=this.texture.getGLTexture(e);e.activeTexture(ln+et.MAX_TEXTURE_INDEX),e.bindTexture(this.target,i),n.framebufferTexture2D(_n,this.attachment,dn+t,i,0);}});}},updateLightCamera:function(t){this.camera.fov=90,this.camera.near=t.near,this.camera.far=t.far,this.camera.aspect=1,this.camera.updateViewMatrix();},createCamera:function(t){this.camera||(this.camera=new Q,this.updateLightCamera(t));},createShadowMap:function(t){this.createFramebuffer(),this.createCamera(t);var e=this.renderer,n=this.framebuffer,i=this.camera;gn||(gn=new Je({vertexType:cn,side:hn,writeOriginData:!1})),n.bind(),e.state.viewport(0,0,n.width,n.height),this.light.worldMatrix.getTranslation(i.position);for(var r=0;r<6;r++)n.bindTexture(r),En.fromArray(Tn[0],3*r).add(i.position),i.up.fromArray(Tn[1],3*r),i.lookAt(En),i.updateViewProjectionMatrix(),e.clear(vn),we.setCamera(i),e.forceMaterial=gn,this.renderShadowScene(e);i.matrix.identity(),i.updateViewProjectionMatrix(),delete e.forceMaterial,n.unbind(),we.setCamera(t),e.viewport();},renderShadowScene:function(t){var e=t.renderList,n=this.camera;e.traverse(function(e){Mn(e,n)&&t.renderMesh(e);},function(e){var i=e.filter(function(t){return Mn(t,n)});t.renderInstancedMeshes(i);});}}),In=An,Ln=s.a.create({Extends:M,isPointLight:!0,className:"PointLight",constructor:function(t){Ln.superclass.constructor.call(this,t);},createShadowMap:function(t,e){this.shadow&&(this.lightShadow||(this.lightShadow=new In({light:this,renderer:t}),"minBias"in this.shadow&&(this.lightShadow.minBias=this.shadow.minBias),"maxBias"in this.shadow&&(this.lightShadow.maxBias=this.shadow.maxBias)),this.lightShadow.createShadowMap(e));}}),On=Ln,Sn=new o.a,Rn=new c.a,yn=s.a.create({Extends:M,isDirectionalLight:!0,className:"DirectionalLight",shadow:null,constructor:function(t){this.direction=new c.a(0,0,1),yn.superclass.constructor.call(this,t);},createShadowMap:function(t,e){this.shadow&&(this.lightShadow||(this.lightShadow=new un({light:this,renderer:t,width:this.shadow.width||t.width,height:this.shadow.height||t.height,debug:this.shadow.debug,cameraInfo:this.shadow.cameraInfo}),"minBias"in this.shadow&&(this.lightShadow.minBias=this.shadow.minBias),"maxBias"in this.shadow&&(this.lightShadow.maxBias=this.shadow.maxBias)),this.lightShadow.createShadowMap(e));},getWorldDirection:function(){return Rn.copy(this.direction).transformDirection(this.worldMatrix).normalize(),Rn},getViewDirection:function(t){var e=t.getModelViewMatrix(this,Sn);return Rn.copy(this.direction).transformDirection(e).normalize(),Rn}}),xn=yn,Nn=new o.a,bn=new c.a,wn=s.a.create({Extends:M,isSpotLight:!0,className:"SpotLight",shadow:null,_cutoffCos:.9763,_cutoff:12.5,cutoff:{get:function(){return this._cutoff},set:function(t){this._cutoff=t,this._cutoffCos=Math.cos(d.a.degToRad(t));}},_outerCutoffCos:.9537,_outerCutoff:17.5,outerCutoff:{get:function(){return this._outerCutoff},set:function(t){this._outerCutoff=t,this._outerCutoffCos=Math.cos(d.a.degToRad(t));}},constructor:function(t){this.direction=new c.a(0,0,1),wn.superclass.constructor.call(this,t);},createShadowMap:function(t,e){this.shadow&&(this.lightShadow||(this.lightShadow=new un({light:this,renderer:t,width:this.shadow.width||t.width,height:this.shadow.height||t.height,debug:this.shadow.debug,cameraInfo:this.shadow.cameraInfo}),"minBias"in this.shadow&&(this.lightShadow.minBias=this.shadow.minBias),"maxBias"in this.shadow&&(this.lightShadow.maxBias=this.shadow.maxBias)),this.lightShadow.createShadowMap(e));},getWorldDirection:function(){return bn.copy(this.direction).transformDirection(this.worldMatrix).normalize(),bn},getViewDirection:function(t){var e=t.getModelViewMatrix(this,Nn);return bn.copy(this.direction).transformDirection(e).normalize(),bn}}),Cn=wn,Pn=s.a.create({Extends:je,isShaderMaterial:!0,className:"ShaderMaterial",vs:"",fs:"",useHeaderCache:!1,constructor:function(t){Pn.superclass.constructor.call(this,t);},getRenderOption:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(Pn.superclass.getRenderOption.call(this,t),this.getCustomRenderOption){var e=this.getCustomRenderOption({});for(var n in e)t["HILO_CUSTUM_OPTION_".concat(n)]=e[n];}return t},getCustomRenderOption:null}),Hn=Pn,Dn=n(15),Fn=n.n(Dn),Un=s.a.create({Extends:Z,isMorphGeometry:!0,className:"MorphGeometry",isStatic:!1,weights:[],targets:null,constructor:function(t){Un.superclass.constructor.call(this,t),this.weights=this.weights||[];},update:function(t,e){this.weights=t,this._originalMorphIndices=e;},clone:function(){return Z.prototype.clone.call(this,{targets:this.targets,weights:this.weights})},getRenderOption:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return Un.superclass.getRenderOption.call(this,e),this.targets&&(this._maxMorphTargetCount||(this._maxMorphTargetCount=Math.floor(8/Object.keys(this.targets).length)),Object(r.each)(this.targets,function(n,i){e.MORPH_TARGET_COUNT=Math.min(n.length,t._maxMorphTargetCount),"vertices"===i?e.MORPH_HAS_POSITION=1:"normals"===i?e.MORPH_HAS_NORMAL=1:"tangents"===i&&(e.MORPH_HAS_TANGENT=1);})),e}}),Gn=Un,Bn={POSITION:{name:"vertices",decodeMatName:"positionDecodeMat"},TEXCOORD_0:{name:"uvs",decodeMatName:"uvDecodeMat"},TEXCOORD_1:{name:"uvs1",decodeMatName:"uv1DecodeMat"},NORMAL:{name:"normals",decodeMatName:"normalDecodeMat"},JOINT:{name:"skinIndices"},JOINTS_0:{name:"skinIndices"},WEIGHT:{name:"skinWeights"},WEIGHTS_0:{name:"skinWeights"},TANGENT:{name:"tangents"},COLOR_0:{name:"colors"}},Vn={Geometry:Z,GeometryData:w};var Xn={_decodeTotalTime:0,wasmURL:"",workerURL:"",useWASM:!0,useWebWorker:!0,useAuto:!0,init:function(){return Xn.useAuto?Fn.a.initWASM(Xn.wasmURL,Xn.memPages):Xn.useWebWorker?Fn.a.initWorker(Xn.workerURL):Xn.useWASM?Fn.a.initWASM(Xn.wasmURL,Xn.memPages):Promise.resolve()},parse:function(t,e,n,i){var r=Date.now(),s=e.bufferViews[t.bufferView],a=Xn.wasmURL,o=Xn.workerURL,u=Xn.useAuto,c=Xn.useWASM,h=Xn.useWebWorker,f=new Uint8Array(s.buffer,s.byteOffset,s.byteLength);function l(e){Xn._decodeTotalTime+=Date.now()-r;var n=e.toHilo3dGeometry(Vn,i.primitive._geometry);return t.targets&&(n=function(t,e,n){if(!n.isMorphGeometry){var i=new Gn;for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&"id"!==r&&(i[r]=n[r]);i.targets={},n=i;}for(var s=n.targets,a=0;a<t.targets.length;a++){var o=t.targets[a];for(var u in o)if(u in Bn){var c=o[u],h=Bn[u].name;s[h]||(s[h]=[]);var f=e.attrs[c];s[h].push(new w(f.data,f.itemCount));}}return t.weights?n.weights=t.weights:n.weights=new Float32Array(t.targets.length),n}(t,e,n)),n}return u?Fn.a.decompress(f,a,o).then(l):h?Fn.a.decompressWithWorker(f,c,a,o).then(l):l(c?Fn.a.decompressWithWASM(f,a):Fn.a.decompressWithJS(f))}},jn=Xn,kn=C.a.SAMPLER_2D,zn={unQuantizeData:function(t,e){if(!e)return t;var n=Math.sqrt(e.length),i=n-1,r=new Float32Array(t.length),s=[];return t.traverse(function(t,a){t.toArray?t.toArray(s):s[0]=t;for(var o=a*i,u=0;u<n;u++){r[o+u]=0;for(var c=0;c<n;c++){var h=c===i?1:s[c];r[o+u]+=e[c*n+u]*h;}}}),t.data=r,t.stride=0,t.offset=0,t},parse:function(t,e,n,i){var r=t.decodeMatrix;return i.isDecode?n=zn.unQuantizeData(n,r):n.decodeMat=r,n}},qn={parse:function(t,e,n){if(!n.anim||e.isMultiAnim)return n;for(var i in t){var r=t[i];n.anim.addClip(i,r[0],r[1]);}return n}},Wn=qn,Yn={parse:function(t,e,n){return t.center=t.max.map(function(e,n){return (e+t.min[n])/2}),t.width=t.max[0]-t.min[0],t.height=t.max[1]-t.min[1],t.depth=t.max[2]-t.min[2],t.size=Math.sqrt(Math.pow(t.width,2)+Math.pow(t.height,2)+Math.pow(t.depth,2)),n.bounds=t,n}},Zn={getUsedTextureNameMap:function(t,e){t.diffuseTexture&&(e[t.diffuseTexture.index]=!0),t.specularGlossinessTexture&&(e[t.specularGlossinessTexture.index]=!0);},parse:function(t,e,n){return t.diffuseFactor&&n.baseColor.fromArray(t.diffuseFactor),t.diffuseTexture&&(n.baseColorMap=e.getTexture(t.diffuseTexture)),t.specularFactor&&(n.specular.fromArray(t.specularFactor),n.specular.a=1),"glossinessFactor"in t&&(n.glossiness=t.glossinessFactor),t.specularGlossinessTexture&&(n.specularGlossinessMap=e.getTexture(t.specularGlossinessTexture)),n.isSpecularGlossiness=!0,n}},Kn={parse:function(t,e,n,i){if(i.isGlobalExtension)return n;if(!e.isUseExtension(e.json,"KHR_lights_punctual")||!e.json.extensions.KHR_lights_punctual.lights)return n;var r,s=e.json.extensions.KHR_lights_punctual.lights[t.light];if(!s)return n;var a=new v.a(1,1,1,1);s.color&&(a.r=s.color[0],a.g=s.color[1],a.b=s.color[2]);var o=void 0!==s.intensity?s.intensity:1,u=s.name||"",c=s.spot||{},h=void 0!==c.innerConeAngle?d.a.radToDeg(c.innerConeAngle):0,f=void 0!==c.outerConeAngle?d.a.radToDeg(c.outerConeAngle):45,l=s.range||0;switch(s.type){case"directional":(r=new xn({color:a,amount:o,name:u,range:l})).direction.set(0,0,-1);break;case"point":r=new On({color:a,amount:o,name:u,range:l});break;case"spot":(r=new Cn({color:a,amount:o,name:u,range:l,cutoff:h,outerCutoff:f})).direction.set(0,0,-1);break;default:return n}return r&&(n.addChild(r),e.lights.push(r)),n}},Qn={init:function(t,e){var n=[],i=(e.json.extensions||{}).KHR_techniques_webgl||{},s=i.programs||[],a=i.shaders||[],o=i.techniques||[];return e.shaders={},a.forEach(function(i,s){var a=r.getRelativePath(e.src,i.uri);e.preHandlerShaderURI&&(a=e.preHandlerShaderURI(a,s,i)),n.push(t.loadRes(a).then(function(t){e.shaders[s]=t;}));}),e.programs={},s.forEach(function(t,n){e.programs[n]=Object.assign({},t);}),e.techniques={},o.forEach(function(t,n){var i=(e.techniques[n]=Object.assign({},t)).textureInfos={},r=t.uniforms||{};for(var s in r){var a=r[s];a.type===kn&&(i[s]=a.value||{});}}),Promise.all(n)},getUsedTextureNameMap:function(t,e,n){var i=n.techniques[t.technique],r=t.values||{};if(i){var s=i.textureInfos;for(var a in s){var o=void 0;r[a]&&void 0!==r[a].index?o=r[a].index:void 0!==s[a].index&&(o=s[a].index),void 0!==o&&(e[s[a].index]=!0);}}},parse:function(t,e,n,i){if(i.isGlobalExtension)return n;var r=e.textures||[],s=e.techniques[t.technique];if(!s)return n;var a=e.programs[s.program];if(!a)return n;var o=e.shaders[a.fragmentShader],u=e.shaders[a.vertexShader],c=s.uniforms||{},h=s.attributes||{},f=t.values||{},l={},d={},_=function(t){var n=c[t]||{},i=f[t];void 0===i&&(i=n.value);var s=void 0;if(void 0!==i)if(n.type===kn){var a=i.index||0;s={get:function(t,e,n){return we.handlerTexture(r[a],n.textureIndex)}};}else s={get:function(){return i}};else if(n.semantic&&we[n.semantic]){var o,u=we[n.semantic],h=n.node;s=void 0!==h?{get:function(t,n,i){return void 0===o&&(o=e.node.getChildByFn(function(t){return t.animationId===h})||t),u.get(o,n,i)}}:n.semantic;}else m.a.warn("KHR_techniques_webgl: no ".concat(t," value found!")),s=we.blankInfo;d[t]=s;};for(var p in c)_(p);for(var g in h){var v=h[g]||{};v.semantic&&(l[g]=v.semantic);}return new Hn({needBasicUnifroms:!1,needBasicAttributes:!1,vs:u,fs:o,attributes:l,uniforms:d})}},Jn=new Float32Array(2),$n=s.a.create({isFog:!0,className:"Fog",mode:"LINEAR",start:5,end:10,density:.1,constructor:function(t){this.id=d.a.generateUUID(this.className),this.color=new v.a(1,1,1,1),Object.assign(this,t);},getInfo:function(){return "LINEAR"===this.mode?(Jn[0]=this.start,Jn[1]=this.end,Jn):this.density},getRenderOption:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return t["FOG_".concat(this.mode)]=1,t}}),ti=n(16),ei=new ti.a,ni=new o.a,ii=s.a.create({Extends:g,isMesh:!0,className:"Mesh",geometry:null,material:null,useInstanced:!1,frustumTest:!0,constructor:function(t){ii.superclass.constructor.call(this,t),this._usedResourceDict={};},clone:function(t){var e=g.prototype.clone.call(this,t);return Object.assign(e,{geometry:this.geometry,material:this.material}),e},raycast:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(!this.visible)return null;var n=this.geometry,i=this.material,r=this.worldMatrix;if(n&&i){ni.invert(r),ei.copy(t),ei.transformMat4(ni);var s=n.raycast(ei,i.side,e);if(s)return s.forEach(function(t){t.transformMat4(r);}),s}return null},getRenderOption:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this.geometry.getRenderOption(t),t},useResource:function(t){t&&(this._usedResourceDict[t.className+":"+t.id]=t);},destroy:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(this._isDestroyed)return this;this.removeFromParent();var n=t.resourceManager,i=this._usedResourceDict;for(var r in i)n.destroyIfNoRef(i[r]);return this.material&&e&&this.material.destroyTextures(),this.off(),this._usedResourceDict=null,this.geometry=null,this.material=null,this._isDestroyed=!0,this}}),ri=ii,si=new o.a,ai=new o.a,oi=s.a.create({Extends:ri,isSkinedMesh:!0,className:"SkinedMesh",_rootNode:null,rootNode:{get:function(){return this._rootNode},set:function(t){this._rootNode=t,this.initJointNodeList();}},jointNodeList:null,useInstanced:!1,jointMatTexture:null,frustumTest:!1,constructor:function(t){this.jointNames=[],this.inverseBindMatrices=[],oi.superclass.constructor.call(this,t);},initJointNodeList:function(){var t=this;if(this._rootNode){var e={};this._rootNode.traverse(function(t){"jointName"in t&&(e[t.jointName]=t);}),this.jointNodeList=[],this.jointNames.forEach(function(n){t.jointNodeList.push(e[n]);});}},getJointMat:function(){var t=this;if(this.jointNodeList)return this.jointMat||(this.jointMat=new Float32Array(16*this.jointNodeList.length)),this._rootNode||!this.clonedFrom?ai.invert(this.worldMatrix):ai.invert(this.clonedFrom.worldMatrix),this.jointNodeList.forEach(function(e,n){si.copy(ai),si.multiply(e.worldMatrix),si.multiply(t.inverseBindMatrices[n]),si.toArray(t.jointMat,16*n);}),this.jointMat},initJointMatTexture:function(){if(!this.jointMatTexture){var t=this.getJointMat();this.jointMatTexture=new ve({data:t});}return this.jointMatTexture},updateJointMatTexture:function(){if(this.jointMatTexture){var t=this.getJointMat();this.jointMatTexture.data.set(t,0),this.jointMatTexture.needUpdate=!0;}else this.initJointMatTexture();},clone:function(t){var e=ri.prototype.clone.call(this,t);return Object.assign(e,{useInstanced:this.useInstanced,jointNames:this.jointNames.slice(),inverseBindMatrices:this.inverseBindMatrices.map(function(t){return t.clone()}),jointNodeList:this.jointNodeList}),e.clonedFrom=this,e},getRenderOption:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};oi.superclass.getRenderOption.call(this,t);var e=this.jointNames.length;if(e&&(t.JOINT_COUNT=e,et.VERTEX_TEXTURE_FLOAT)){var n=(et.MAX_VERTEX_UNIFORM_VECTORS-22)/4;e>n&&(t.JOINT_MAT_MAP=1);}return t}}),ui=oi,ci=s.a.create({className:"RenderInfo",isRenderInfo:!0,constructor:function(){this.reset();},addFaceCount:function(t){this._currentFaceCount+=t;},addDrawCount:function(t){this._currentDrawCount+=t;},reset:function(){this.faceCount=Math.floor(this._currentFaceCount),this.drawCount=Math.floor(this._currentDrawCount),this._currentFaceCount=0,this._currentDrawCount=0;}}),hi=new c.a,fi=function(t,e){var n=t.material.renderOrder,i=e.material.renderOrder;if(n!==i)return n-i;var r=t.material._shaderNumId||0,s=e.material._shaderNumId||0;return r!==s?r-s:t._sortRenderZ-e._sortRenderZ},li=function(t,e){var n=t.material.renderOrder,i=e.material.renderOrder;return n!==i?n-i:e._sortRenderZ-t._sortRenderZ},di=s.a.create({className:"RenderList",isRenderList:!0,useInstanced:!1,constructor:function(){this.opaqueList=[],this.transparentList=[],this.instancedDict={};},reset:function(){this.opaqueList.length=0,this.transparentList.length=0,this.instancedDict={};},traverse:function(t,e){this.opaqueList.forEach(function(e){t(e);});var n=this.instancedDict;for(var i in n){var r=n[i];r.length>2&&e?e(r):r.forEach(function(e){t(e);});}this.transparentList.forEach(function(e){t(e);});},sort:function(){this.transparentList.sort(li),this.opaqueList.sort(fi);},addMesh:function(t,e){var n=t.material,i=t.geometry;if(n&&i){if(t.frustumTest&&!e.isMeshVisible(t))return;if(this.useInstanced&&t.useInstanced){var r=this.instancedDict,s=n.id+"_"+i.id,a=r[s];r[s]||(a=r[s]=[]),a.push(t);}else t.worldMatrix.getTranslation(hi),hi.transformMat4(e.viewProjectionMatrix),t._sortRenderZ=hi.z,n.transparent?this.transparentList.push(t):this.opaqueList.push(t);}else m.a.warnOnce("RenderList.addMesh(".concat(t.id,")"),"Mesh must have material and geometry",t);}}),mi=s.a.create({className:"WebGLState",isWebGLState:!0,systemFramebuffer:null,constructor:function(t){this.gl=t,this.reset();},reset:function(){this._dict={},this.activeTextureIndex=null,this.textureUnitDict={},this.currentFramebuffer=null,this.preFramebuffer=null,this._pixelStorei={};},enable:function(t){!0!==this._dict[t]&&(this._dict[t]=!0,this.gl.enable(t));},disable:function(t){!1!==this._dict[t]&&(this._dict[t]=!1,this.gl.disable(t));},bindFramebuffer:function(t,e){this.currentFramebuffer!==e&&(this.preFramebuffer=this.currentFramebuffer,this.currentFramebuffer=e,this.gl.bindFramebuffer(t,e));},bindSystemFramebuffer:function(){this.bindFramebuffer(this.gl.FRAMEBUFFER,this.systemFramebuffer);},useProgram:function(t){this.set1("useProgram",t);},depthFunc:function(t){this.set1("depthFunc",t);},depthMask:function(t){this.set1("depthMask",t);},clear:function(t){this.gl.clear(t);},depthRange:function(t,e){this.set2("depthRange",t,e);},stencilFunc:function(t,e,n){this.set3("stencilFunc",t,e,n);},stencilMask:function(t){this.set1("stencilMask",t);},stencilOp:function(t,e,n){this.set3("stencilOp",t,e,n);},colorMask:function(t,e,n,i){this.set4("colorMask",t,e,n,i);},cullFace:function(t){this.set1("cullFace",t);},frontFace:function(t){this.set1("frontFace",t);},blendFuncSeparate:function(t,e,n,i){this.set4("blendFuncSeparate",t,e,n,i);},blendEquationSeparate:function(t,e){this.set2("blendEquationSeparate",t,e);},pixelStorei:function(t,e){this._pixelStorei[t]!==e&&(this._pixelStorei[t]=e,this.gl.pixelStorei(t,e));},viewport:function(t,e,n,i){this.set4("viewport",t,e,n,i);},activeTexture:function(t){this.activeTextureIndex!==t&&(this.activeTextureIndex=t,this.gl.activeTexture(t));},bindTexture:function(t,e){var n=this.getActiveTextureUnit();n[t]!==e&&(n[t]=e,this.gl.bindTexture(t,e));},getActiveTextureUnit:function(){var t=this.textureUnitDict[this.activeTextureIndex];return t||(t=this.textureUnitDict[this.activeTextureIndex]={}),t},set1:function(t,e){this._dict[t]!==e&&(this._dict[t]=e,this.gl[t](e));},set2:function(t,e,n){var i=this._dict[t];i||(i=this._dict[t]=[]),i[0]===e&&i[1]===n||(i[0]=e,i[1]=n,this.gl[t](e,n));},set3:function(t,e,n,i){var r=this._dict[t];r||(r=this._dict[t]=[]),r[0]===e&&r[1]===n&&r[2]===i||(r[0]=e,r[1]=n,r[2]=i,this.gl[t](e,n,i));},set4:function(t,e,n,i,r){var s=this._dict[t];s||(s=this._dict[t]=[]),s[0]===e&&s[1]===n&&s[2]===i&&s[3]===r||(s[0]=e,s[1]=n,s[2]=i,s[3]=r,this.gl[t](e,n,i,r));},get:function(t){return this._dict[t]}}),_i=s.a.create({className:"WebGLResourceManager",isWebGLResourceManager:!0,hasNeedDestroyResource:!1,constructor:function(t){Object.assign(this,t);},useResource:function(t,e){if(t){var n=t.className+":"+t.id;this._usedResourceDict[n]||(this._usedResourceDict[n]=t,t.useResource&&t.useResource(this,e));}return e&&e.useResource(t),this},destroyIfNoRef:function(t){return this._needDestroyDict||(this._needDestroyDict={}),t&&(this.hasNeedDestroyResource=!0,this._needDestroyDict[t.className+":"+t.id]=t),this},destroyUnsuedResource:function(){if(!this.hasNeedDestroyResource)return this;var t=this._needDestroyDict,e=this._usedResourceDict;for(var n in t)if(!e[n]){var i=t[n];i&&i.destroy&&i.destroy();}return this._needDestroyDict={},this.hasNeedDestroyResource=!1,this},reset:function(){return this._usedResourceDict={},this}}),pi=new o.a,gi=new c.a,vi=new Float32Array([0,0,0]),Ei=s.a.create({isLightManager:!0,className:"LightManager",constructor:function(t){this.ambientLights=[],this.directionalLights=[],this.pointLights=[],this.spotLights=[],this.areaLights=[],this.lightInfo={AMBIENT_LIGHTS:0,POINT_LIGHTS:0,DIRECTIONAL_LIGHTS:0,SPOT_LIGHTS:0,AREA_LIGHTS:0,uid:0},Object.assign(this,t);},getRenderOption:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=!1;return Object(r.each)(this.lightInfo,function(i,r){if("uid"!==r&&i){e[r]=i,n=!0;var s=t.getShadowMapCount(r);s&&(e[r+"_SMC"]=s);}}),n&&(e.HAS_LIGHT=1),e},addLight:function(t){var e=null;return t.enabled?(t.isAmbientLight?e=this.ambientLights:t.isDirectionalLight?e=this.directionalLights:t.isPointLight?e=this.pointLights:t.isSpotLight?e=this.spotLights:t.isAreaLight?e=this.areaLights:m.a.warnOnce("LightManager.addLight(".concat(t.id,")"),"Not support this light:",t),e&&(t.shadow?e.unshift(t):e.push(t)),this):this},getDirectionalInfo:function(t){var e=[],n=[],i=[],r=[],s=[],a=[];this.directionalLights.forEach(function(o,u){var c=3*u;o.getRealColor().toRGBArray(e,c),o.getViewDirection(t).toArray(n,c),o.shadow&&o.lightShadow&&(i.push(o.lightShadow.framebuffer.texture),r.push(o.lightShadow.width),r.push(o.lightShadow.height),a.push(o.lightShadow.minBias,o.lightShadow.maxBias),pi.copy(t.worldMatrix),pi.premultiply(o.lightShadow.camera.viewProjectionMatrix),pi.toArray(s,16*u));});var o={colors:new Float32Array(e),infos:new Float32Array(n)};return i.length&&(o.shadowMap=i,o.shadowMapSize=new Float32Array(r),o.shadowBias=new Float32Array(a),o.lightSpaceMatrix=new Float32Array(s)),o},getSpotInfo:function(t){var e=[],n=[],i=[],r=[],s=[],a=[],o=[],u=[],c=[],h=[];this.spotLights.forEach(function(f,l){var d=3*l;f.getRealColor().toRGBArray(e,d),f.toInfoArray(n,d),f.getViewDirection(t).toArray(r,d),h.push(f.range),s.push(f._cutoffCos,f._outerCutoffCos),t.getModelViewMatrix(f,pi),pi.getTranslation(gi),gi.toArray(i,d),f.shadow&&f.lightShadow&&(a.push(f.lightShadow.framebuffer.texture),o.push(f.lightShadow.width),o.push(f.lightShadow.height),c.push(f.lightShadow.minBias,f.lightShadow.maxBias),pi.multiply(f.lightShadow.camera.viewProjectionMatrix,t.worldMatrix),pi.toArray(u,16*l));});var f={colors:new Float32Array(e),infos:new Float32Array(n),poses:new Float32Array(i),dirs:new Float32Array(r),cutoffs:new Float32Array(s),ranges:new Float32Array(h)};return a.length&&(f.shadowMap=a,f.shadowMapSize=new Float32Array(o),f.shadowBias=new Float32Array(c),f.lightSpaceMatrix=new Float32Array(u)),f},getPointInfo:function(t){var e=[],n=[],i=[],r=[],s=[],a=[],o=[],u=[];this.pointLights.forEach(function(c,h){var f=3*h;c.getRealColor().toRGBArray(e,f),c.toInfoArray(n,f),u.push(c.range),t.getModelViewMatrix(c,pi),pi.getTranslation(gi),gi.toArray(i,f),c.shadow&&c.lightShadow&&(r.push(c.lightShadow.framebuffer.texture),a.push(c.lightShadow.minBias,c.lightShadow.maxBias),t.worldMatrix.toArray(s,16*h),o[2*h]=c.lightShadow.camera.near,o[2*h+1]=c.lightShadow.camera.far);});var c={colors:new Float32Array(e),infos:new Float32Array(n),poses:new Float32Array(i),ranges:new Float32Array(u)};return r.length&&(c.shadowMap=r,c.shadowBias=new Float32Array(a),c.lightSpaceMatrix=new Float32Array(s),c.cameras=new Float32Array(o)),c},getAreaInfo:function(t){var e,n,i=[],r=[],s=[],a=[];return this.areaLights.forEach(function(o,u){var c=3*u;o.getRealColor().toRGBArray(i,c),t.getModelViewMatrix(o,pi),pi.getTranslation(gi),gi.toArray(r,c);var h=pi.getRotation();pi.fromQuat(h),gi.set(.5*o.width,0,0),gi.transformMat4(pi),gi.toArray(s,c),gi.set(0,.5*o.height,0),gi.transformMat4(pi),gi.toArray(a,c),e=o.ltcTexture1,n=o.ltcTexture2;}),{colors:new Float32Array(i),poses:new Float32Array(r),width:new Float32Array(s),height:new Float32Array(a),ltcTexture1:e,ltcTexture2:n}},getAmbientInfo:function(){return vi[0]=vi[1]=vi[2]=0,this.ambientLights.forEach(function(t){var e=t.getRealColor();vi[0]+=e.r,vi[1]+=e.g,vi[2]+=e.b;}),vi[0]=Math.min(1,vi[0]),vi[1]=Math.min(1,vi[1]),vi[2]=Math.min(1,vi[2]),vi},updateInfo:function(t){var e=this.lightInfo,n=this.ambientLights,i=this.directionalLights,r=this.pointLights,s=this.spotLights,a=this.areaLights;e.AMBIENT_LIGHTS=n.length,e.POINT_LIGHTS=r.length,e.DIRECTIONAL_LIGHTS=i.length,e.SPOT_LIGHTS=s.length,e.AREA_LIGHTS=a.length;var o=function(t){return !!t.shadow};e.SHADOW_POINT_LIGHTS=r.filter(o).length,e.SHADOW_SPOT_LIGHTS=s.filter(o).length,e.SHADOW_DIRECTIONAL_LIGHTS=i.filter(o).length,e.uid=[e.AMBIENT_LIGHTS,e.POINT_LIGHTS,e.SHADOW_POINT_LIGHTS,e.DIRECTIONAL_LIGHTS,e.SHADOW_DIRECTIONAL_LIGHTS,e.SPOT_LIGHTS,e.SHADOW_SPOT_LIGHTS,e.AREA_LIGHTS].join("_"),this.directionalInfo=this.getDirectionalInfo(t),this.pointInfo=this.getPointInfo(t),this.spotInfo=this.getSpotInfo(t),this.areaInfo=this.getAreaInfo(t),this.ambientInfo=this.getAmbientInfo();},getInfo:function(){return this.lightInfo},reset:function(){this.ambientLights.length=0,this.directionalLights.length=0,this.pointLights.length=0,this.spotLights.length=0,this.areaLights.length=0;},getShadowMapCount:function(t){var e=[];"POINT_LIGHTS"===t?e=this.pointLights:"DIRECTIONAL_LIGHTS"===t?e=this.directionalLights:"SPOT_LIGHTS"===t?e=this.spotLights:"AREA_LIGHTS"===t&&(e=this.spotLights);var n=0;return e.forEach(function(t){n+=t.shadow?1:0;}),n},createShadowMap:function(t,e){this.directionalLights.forEach(function(n){n.createShadowMap(t,e);}),this.spotLights.forEach(function(n){n.createShadowMap(t,e);}),this.pointLights.forEach(function(n){n.createShadowMap(t,e);}),this.areaLights.forEach(function(n){n.createShadowMap(t,e);});}}),Ti=C.a.DEPTH_TEST,Mi=C.a.SAMPLE_ALPHA_TO_COVERAGE,Ai=C.a.CULL_FACE,Ii=C.a.FRONT_AND_BACK,Li=C.a.BLEND,Oi=C.a.LINES,Si=C.a.STATIC_DRAW,Ri=C.a.DYNAMIC_DRAW,yi=s.a.create({Mixes:a.a,className:"WebGLRenderer",isWebGLRenderer:!0,gl:null,width:0,height:0,pixelRatio:1,domElement:null,useInstanced:!1,useVao:!0,alpha:!1,depth:!0,stencil:!1,antialias:!0,premultipliedAlpha:!0,preserveDrawingBuffer:!1,failIfMajorPerformanceCaveat:!1,gameMode:!1,useFramebuffer:!1,framebufferOption:{},useLogDepth:!1,vertexPrecision:"highp",fragmentPrecision:"highp",fog:null,offsetX:0,offsetY:0,isInitFailed:!1,_isInit:!1,_isContextLost:!1,constructor:function(t){this.clearColor=new v.a(1,1,1),Object.assign(this,t),this.renderInfo=new ci,this.renderList=new di,this.lightManager=new Ei,this.resourceManager=new _i;},resize:function(t,e,n){if(n||this.width!==t||this.height!==e){var i=this.domElement;this.width=t,this.height=e,i.width=t,i.height=e,this.framebuffer&&this.framebuffer.resize(this.width,this.height,n),this.viewport();}},setOffset:function(t,e){this.offsetX===t&&this.offsetY===e||(this.offsetX=t,this.offsetY=e,this.viewport());},viewport:function(t,e,n,i){var r=this.state,s=this.gl;r&&(void 0===t?t=this.offsetX:this.offsetX=t,void 0===e?e=this.offsetY:this.offsetY=e,void 0===n&&(n=s.drawingBufferWidth),void 0===i&&(i=s.drawingBufferHeight),r.viewport(t,e,n,i));},isInit:{get:function(){return this._isInit&&!this.isInitFailed}},onInit:function(t){var e=this;this._isInit?t(this):this.on("init",function(){t(e);},!0);},initContext:function(){if(!this._isInit){this._isInit=!0;try{this._initContext(),this.fire("init");}catch(t){this.isInitFailed=!0,this.fire("initFailed",t);}}},_initContext:function(){var t=this,e={alpha:this.alpha,depth:this.depth,stencil:this.stencil,antialias:this.antialias,premultipliedAlpha:this.premultipliedAlpha,failIfMajorPerformanceCaveat:this.failIfMajorPerformanceCaveat};!0===this.preserveDrawingBuffer&&(e.preserveDrawingBuffer=!0),!0===this.gameMode&&(e.gameMode=!0);var n=this.gl=this.domElement.getContext("webgl",e);n.viewport(0,0,this.width,this.height),Tt.init(n),tt.init(n),et.init(n),dt.init(this),this.state=new mi(n),tt.instanced||(this.useInstanced=!1),this.renderList.useInstanced=this.useInstanced,tt.vao||(this.useVao=!1),this.useFramebuffer&&(this.framebuffer=new re(this,Object.assign({useVao:this.useVao,width:this.width,height:this.height},this.framebufferOption))),this.domElement.addEventListener("webglcontextlost",function(e){t._onContextLost(e);},!1),this.domElement.addEventListener("webglcontextrestored",function(e){t._onContextRestore(e);},!1);},_onContextLost:function(t){this.fire("webglContextLost");var e=this.gl;this._isContextLost=!0,t.preventDefault(),It.reset(e),dt.reset(e),qt.reset(e),xt.reset(e),Ft.reset(e),this.state.reset(e),this._lastMaterial=null,this._lastProgram=null;},_onContextRestore:function(t){this.fire("webglContextRestored");var e=this.gl;this._isContextLost=!1,tt.reset(e),re.reset(e);},setupDepthTest:function(t){var e=this.state;t.depthTest?(e.enable(Ti),e.depthFunc(t.depthFunc),e.depthMask(t.depthMask),e.depthRange(t.depthRange[0],t.depthRange[1])):e.disable(Ti);},setupSampleAlphaToCoverage:function(t){var e=this.state;t.sampleAlphaToCoverage?e.enable(Mi):e.disable(Mi);},setupCullFace:function(t){var e=this.state;t.cullFace&&t.cullFaceType!==Ii?(e.enable(Ai),e.cullFace(t.cullFaceType)):e.disable(Ai);},setupBlend:function(t){var e=this.state;t.blend?(e.enable(Li),e.blendFuncSeparate(t.blendSrc,t.blendDst,t.blendSrcAlpha,t.blendDstAlpha),e.blendEquationSeparate(t.blendEquation,t.blendEquationAlpha)):e.disable(Li);},setupUniforms:function(t,e,n,i){var r=this.forceMaterial||e.material;for(var s in t.uniforms){var a=r.getUniformInfo(s),o=t.uniforms[s];if(!a.isBlankInfo&&(i||a.isDependMesh&&!n)){var u=a.get(e,r,o);null!=u&&(t[s]=u);}}},setupVao:function(t,e,n){var i=n.geometry,r=i.isStatic;if(t.isDirty||!r||i.isDirty){t.isDirty=!1;var s=this.forceMaterial||n.material,a=s.attributes,o=r?Si:Ri;for(var u in a){var c=e.attributes[u];if(c){var h=s.getAttributeData(u,n,c);null!=h&&t.addAttribute(h,c,o);}}i.indices&&t.addIndexBuffer(i.indices,o),i.isDirty=!1;}i.vertexCount&&(t.vertexCount=i.vertexCount);},setupMaterial:function(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]&&arguments[3],r=this.forceMaterial||e.material;(r.isDirty||this._lastMaterial!==r)&&(this.setupDepthTest(r),this.setupSampleAlphaToCoverage(r),this.setupCullFace(r),this.setupBlend(r),i=!0),this.setupUniforms(t,e,n,i),r.isDirty=!1,this._lastMaterial=r;},setupMesh:function(t,e){var n=this.gl,i=this.state,r=this.lightManager,s=this.resourceManager,a=t.geometry,o=this.forceMaterial||t.material,u=dt.getShader(t,o,e,r,this.fog,this.useLogDepth),c=It.getProgram(u,i);c.useProgram(),this.setupMaterial(c,t,e,this._lastProgram!==c),this._lastProgram=c,t.material.wireframe&&a.mode!==Oi&&a.convertToLinesMode();var h=a.id+c.id,f=Ft.getVao(n,h,{useInstanced:e,useVao:this.useVao,mode:a.mode});return this.setupVao(f,c,t),s.useResource(f,t).useResource(u,t).useResource(c,t),{vao:f,program:c,geometry:a}},addRenderInfo:function(t,e){var n=this.renderInfo;n.addFaceCount(t),n.addDrawCount(e);},render:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(this.initContext(),!this.isInitFailed&&!this._isContextLost){var i=this.renderList,r=this.renderInfo,s=this.lightManager,a=this.resourceManager,o=this.state;this.fog=t.fog,s.reset(),r.reset(),i.reset(),a.reset(),we.init(this,o,e,s,this.fog),t.updateMatrixWorld(),e.updateViewProjectionMatrix(),t.traverse(function(t){return t.visible?(t.isMesh?i.addMesh(t,e):t.isLight&&s.addLight(t),g.TRAVERSE_STOP_NONE):g.TRAVERSE_STOP_CHILDREN}),i.sort(),s.createShadowMap(this,e),s.updateInfo(e),n&&this.fire("beforeRender"),this.useFramebuffer&&this.framebuffer.bind(),this.clear(),n&&this.fire("beforeRenderScene"),this.renderScene(),this.useFramebuffer&&this.renderToScreen(this.framebuffer),n&&this.fire("afterRender"),a.destroyUnsuedResource();}},renderScene:function(){var t=this;this.renderList.traverse(function(e){t.renderMesh(e);},function(e){t.renderInstancedMeshes(e);}),this._gameModeSumbit();},_gameModeSumbit:function(){var t=this.gl;this.gameMode&&t&&t.submit&&t.submit();},clear:function(t){var e=this.gl,n=this.state;t=t||this.clearColor,n.depthMask(!0),this._lastMaterial=null,this._lastProgram=null,e.clearColor(t.r,t.g,t.b,t.a),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT);},clearDepth:function(){var t=this.gl;this.state.depthMask(!0),t.clear(t.DEPTH_BUFFER_BIT);},renderToScreen:function(t){this.state.bindSystemFramebuffer(),t.render(0,0,1,1,this.clearColor);},renderMesh:function(t){var e=this.setupMesh(t,!1).vao;e.draw(),this.addRenderInfo(e.vertexCount/3,1);},renderInstancedMeshes:function(t){var e=t[0];if(e){var n=this.forceMaterial||e.material,i=this.setupMesh(e,!0),r=i.vao,s=i.program;n.getInstancedUniforms().forEach(function(e){var n=e.name,i=e.info,a=s.attributes[n];a&&r.addInstancedAttribute(a,t,function(t){return i.get(t)});}),r.drawInstance(t.length),this.addRenderInfo(r.vertexCount/3*t.length,1);}},renderMultipleMeshes:function(t){var e=this;t.forEach(function(t){e.renderMesh(t);});},releaseGLResource:function(){var t=this.gl;t&&(It.reset(t),dt.reset(t),xt.reset(t),Ft.reset(t),this.state.reset(t),qt.reset(t),re.destroy(t));}}),xi=n(60),Ni=n.n(xi).a,bi=s.a.create({Extends:g,isStage:!0,className:"Stage",renderer:null,camera:null,pixelRatio:null,offsetX:0,offsetY:0,constructor:function(t){if(t.width||(t.width=window.innerWidth),t.height||(t.height=window.innerHeight),!t.pixelRatio){var e=window.devicePixelRatio||1;e=Math.min(e,1024/Math.max(t.width,t.height),2),e=Math.max(e,1),t.pixelRatio=e;}bi.superclass.constructor.call(this,t),this.initRenderer(t),m.a.log("Hilo3d version: ".concat("1.13.31"));},initRenderer:function(t){var e=this.canvas=this.createCanvas(t);this.renderer=new yi(Object.assign(t,{domElement:e})),this.resize(this.width,this.height,this.pixelRatio,!0);},createCanvas:function(t){var e;return e=t.canvas?t.canvas:document.createElement("canvas"),t.container&&t.container.appendChild(e),e},resize:function(t,e,n,i){if(void 0===n&&(n=this.pixelRatio),i||this.width!==t||this.height!==e||this.pixelRatio!==n){this.width=t,this.height=e,this.pixelRatio=n,this.rendererWidth=t*n,this.rendererHeight=e*n;var r=this.canvas;this.renderer.resize(this.rendererWidth,this.rendererHeight,i),r.style.width=this.width+"px",r.style.height=this.height+"px",this.updateDomViewport();}return this},setOffset:function(t,e){if(this.offsetX!==t||this.offsetY!==e){this.offsetX=t,this.offsetY=e;var n=this.pixelRatio;this.renderer.setOffset(t*n,e*n);}return this},viewport:function(t,e,n,i){return this.resize(n,i,this.pixelRatio,!0),this.setOffset(t,e),this},tick:function(t){return this.traverseUpdate(t),this.camera&&this.renderer.render(this,this.camera,!0),this},enableDOMEvent:function(t){var e=this,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=this.canvas,r=this._domListener||(this._domListener=function(t){e._onDOMEvent(t);});return (t="string"==typeof t?[t]:t).forEach(function(t){n?i.addEventListener(t,r,!1):i.removeEventListener(t,r);}),this},_onDOMEvent:function(t){var e=this.canvas,n=this._eventTarget,i=t.type,r=0===i.indexOf("touch"),s=t;if(r){var a=t.touches,o=t.changedTouches;a&&a.length?s=a[0]:o&&o.length&&(s=o[0]);}var u=this.domViewport||this.updateDomViewport(),c=(s.pageX||s.clientX)-u.left,h=(s.pageY||s.clientY)-u.top;t.stageX=c,t.stageY=h,t.stopPropagation=function(){this._stopPropagationed=!0;};var f=this.getMeshResultAtPoint(c,h,!0),l=f.mesh;t.hitPoint=f.point;var d="mouseout"===i;if(n&&(n!==l&&(!n.contains||!n.contains(l))||d)){var m=!1;if("touchmove"===i?m="touchout":"mousemove"!==i&&!d&&l||(m="mouseout"),m){var _=Object.assign({},t);_.type=m,_.eventTarget=n,n._fireMouseEvent(_);}t.lastEventTarget=n,this._eventTarget=null;}if(l&&l.pointerEnabled&&"mouseout"!==i&&(t.eventTarget=this._eventTarget=l,l._fireMouseEvent(t)),!r){var p=l&&l.pointerEnabled&&l.useHandCursor?"pointer":"";e.style.cursor=p;}Ni.android&&"touchmove"===i&&t.preventDefault();},updateDomViewport:function(){var t=this.canvas,e=null;return t.parentNode&&(e=this.domViewport=Object(r.getElementRect)(t)),e},getMeshResultAtPoint:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=this.camera,r=this._ray;r||(r=this._ray=new ti.a),r.fromCamera(i,t,e,this.width,this.height);var s=this.raycast(r,!0,n);if(s)return s[0];this._stageResultAtPoint||(this._stageResultAtPoint={mesh:this,point:new c.a});var a=this._stageResultAtPoint.point;return a.copy(i.unprojectVector(a.set(t,e,0),this.width,this.height)),this._stageResultAtPoint},releaseGLResource:function(){return this.renderer.releaseGLResource(),this},destroy:function(){return this.releaseGLResource(),this.traverse(function(t){t.off(),t.parent=null;}),this.children.length=0,this.renderer.off(),this}}),wi=bi,Ci=n(61),Pi=n.n(Ci),Hi=n(105),Di=n.n(Hi);Pi.a.Ease=Di.a;var Fi=Pi.a,Ui=s.a.create({Extends:Z,isBoxGeometry:!0,className:"BoxGeometry",width:1,height:1,depth:1,widthSegments:1,heightSegments:1,depthSegments:1,constructor:function(t){Ui.superclass.constructor.call(this,t),this.isSegments()?this.buildWithSegments():this.build();},buildWithSegments:function(){var t=this.width,e=this.height,n=this.depth,i=this.widthSegments,r=this.heightSegments,s=this.depthSegments,a=r*s*6,o=i*s*6,u=i*r*6,c=2*((r+1)*(s+1)+(i+1)*(s+1)+(i+1)*(r+1)),h=new Float32Array(3*c),f=new Float32Array(3*c),l=new Float32Array(2*c),d=new Uint16Array(2*(a+o+u));this.vertices=new w(h,3),this.normals=new w(f,3),this.uvs=new w(l,2),this.indices=new w(d,1);var m=[0,0];this.buildPlane(m,2,1,0,-1,1,n,e,t/2,s,r),this.buildPlane(m,2,1,0,1,1,n,e,-t/2,s,r),this.buildPlane(m,0,2,1,1,-1,t,n,e/2,i,s),this.buildPlane(m,0,2,1,1,1,t,n,-e/2,i,s),this.buildPlane(m,0,1,2,1,1,t,e,n/2,i,r),this.buildPlane(m,0,1,2,-1,1,t,e,-n/2,i,r);},buildPlane:function(t,e,n,i,r,s,a,o,u,c,h){for(var f=a/c,l=o/h,d=a/2,m=o/2,_=t[0],p=t[1],g=this.vertices.data,v=this.normals.data,E=this.uvs.data,T=this.indices.data,M=0;M<=h;M++)for(var A=(M*l-m)*s,I=0;I<=c;I++){if(g[3*_+e]=(I*f-d)*r,g[3*_+n]=A,g[3*_+i]=u,v[3*_+e]=0,v[3*_+n]=0,v[3*_+i]=u<0?-1:1,E[2*_]=I/c,E[2*_+1]=1-M/h,I<c&&M<h){var L=t[0]+(M+1)*(c+1)+I;T[p++]=L,T[p++]=_,T[p++]=L+1,T[p++]=L+1,T[p++]=_,T[p++]=_+1;}_++;}t[0]=_,t[1]=p;},build:function(){var t=new Float32Array(72),e=new Uint16Array(36);this.vertices=new w(t,3),this.indices=new w(e,1);var n=this.width/2,i=this.height/2,r=this.depth/2,s=[-n,-i,-r],a=[n,-i,-r],o=[n,i,-r],u=[-n,i,-r],c=[-n,-i,r],h=[n,-i,r],f=[n,i,r],l=[-n,i,r];this.addRect(h,a,o,f),this.addRect(s,c,l,u),this.addRect(l,f,o,u),this.addRect(s,a,h,c),this.addRect(c,h,f,l),this.addRect(a,s,u,o);},isSegments:function(){return this.widthSegments>1||this.heightSegments>1||this.depthSegments>1},setFrontUV:function(t){this.isSegments()?m.a.warn("segmented BoxGeometry dont support setFrontUV!"):this.setVertexUV(32,t);},setRightUV:function(t){this.isSegments()?m.a.warn("segmented BoxGeometry dont support setRightUV!"):this.setVertexUV(0,t);},setBackUV:function(t){this.isSegments()?m.a.warn("segmented BoxGeometry dont support setBackUV!"):this.setVertexUV(40,t);},setLeftUV:function(t){this.isSegments()?m.a.warn("segmented BoxGeometry dont support setLeftUV!"):this.setVertexUV(8,t);},setTopUV:function(t){this.isSegments()?m.a.warn("segmented BoxGeometry dont support setTopUV!"):this.setVertexUV(16,t);},setBottomUV:function(t){this.isSegments()?m.a.warn("segmented BoxGeometry dont support setBottomUV!"):this.setVertexUV(24,t);},setAllRectUV:function(t){if(this.isSegments())return m.a.warn("segmented BoxGeometry dont support setAllRectUV!"),null;for(var e=0;e<6;e++)this.setVertexUV(8*e,t);return this},_raycast:function(t,e){return Ui.superclass._raycast.call(this,t,e)}}),Gi=Ui,Bi=C.a.FRONT,Vi=C.a.BACK,Xi=[0,0,1],ji=s.a.create({Extends:Z,isPlaneGeometry:!0,className:"PlaneGeometry",width:1,height:1,widthSegments:1,heightSegments:1,constructor:function(t){ji.superclass.constructor.call(this,t),this.build();},build:function(){for(var t=this.widthSegments,e=this.heightSegments,n=(t+1)*(e+1),i=this.width/t,r=this.height/e,s=new Float32Array(3*n),a=new Float32Array(3*n),o=new Float32Array(2*n),u=new Uint16Array(t*e*6),c=0,h=0;h<=e;h++)for(var f=0;f<=t;f++){var l=h*(t+1)+f;if(s[3*l]=f*i-this.width/2,s[3*l+1]=this.height/2-h*r,a[3*l]=0,a[3*l+1]=0,a[3*l+2]=1,o[2*l]=f/t,o[2*l+1]=1-h/e,h<e&&f<t){var d=(h+1)*(t+1)+f;u[c++]=l,u[c++]=d,u[c++]=d+1,u[c++]=l,u[c++]=d+1,u[c++]=l+1;}}this.vertices=new w(s,3),this.indices=new w(u,1),this.normals=new w(a,3),this.uvs=new w(o,2);},_raycast:function(t,e){var n=t.origin.z,i=t.direction.z;if(e===Bi&&(i>0||n<0))return null;if(e===Vi&&(i<0||n>0))return null;var r=t.intersectsPlane(Xi,0);if(r){var s=r.x,a=r.y,o=.5*this.width,u=.5*this.height;if(s>=-o&&s<=o&&a>=-u&&a<=u)return [r]}return null}}),ki=ji,zi=s.a.create({Extends:Z,isSphereGeometry:!0,className:"SphereGeometry",radius:1,heightSegments:16,widthSegments:32,constructor:function(t){zi.superclass.constructor.call(this,t),this.build();},build:function(){for(var t=this.radius,e=this.heightSegments,n=this.widthSegments,i=(n+1)*(e+1),r=n*e,s=new Float32Array(3*i),a=new Float32Array(4*i),o=new Float32Array(2*i),u=new Uint16Array(6*r),c=0,h=0,f=0,l=0,d=0,m=2*Math.PI,_=Math.PI,p=0;p<=e;p++)for(var g=p/e,v=_*g,E=Math.cos(v)*t,T=Math.sin(v)*t,M=0;M<=n;M++){var A=M/n,I=m*A,L=Math.cos(I),O=Math.sin(I),S=L*T,R=O*T,y=O,x=-L;if(a[f++]=y,a[f++]=0,a[f++]=x,a[f++]=1,s[h++]=S,s[h++]=E,s[h++]=R,o[l++]=A,o[l++]=g,p>0&&M>0){var N=d,b=N-1,C=b-n-1,P=N-n-1;u[c++]=C,u[c++]=P,u[c++]=N,u[c++]=C,u[c++]=N,u[c++]=b;}d++;}this.vertices=new w(s,3),this.indices=new w(u,1),this.uvs=new w(o,2),this.tangents=new w(a,4),this.normals=new w(new Float32Array(s),3);},_raycast:function(t,e){return zi.superclass._raycast.call(this,t,e)}}),qi=zi,Wi=[dt,It,xt,Ft,qt],Yi=function(){var t="";Wi.forEach(function(e){t+="".concat(e.prototype.className,":").concat(Object.keys(e.cache._cache).length," ");}),m.a.log(t);},Zi=s.a.create({Mixes:a.a,isLoadCache:!0,className:"LoadCache",Statics:{PENDING:1,LOADED:2,FAILED:3},enabled:!0,constructor:function(){this._files={};},update:function(t,e,n){if(this.enabled){var i={key:t,state:e,data:n};this._files[t]=i,this.fire("update",i),this.fire("update:".concat(i.key),i);}},get:function(t){return this.enabled?this._files[t]:null},remove:function(t){delete this._files[t];},clear:function(){this._files={};},wait:function(t){var e=this;return t?t.state===Zi.LOADED?Promise.resolve(t.data):t.state===Zi.FAILED?Promise.reject():new Promise(function(n,i){e.on("update:".concat(t.key),function(t){var e=t.detail;e.state===Zi.LOADED?n(e.data):e.state===Zi.FAILED&&i(e.data);},!0);}):Promise.reject()}}),Ki=Zi,Qi=new Ki,Ji=s.a.create({Mixes:a.a,isBasicLoader:!0,className:"BasicLoader",Statics:{_cache:Qi,enalbeCache:function(){Qi.enabled=!0;},disableCache:function(){Qi.enabled=!1;},deleteCache:function(t){Qi.remove(t);},clearCache:function(){Qi.clear();},cache:{get:function(){return Qi},set:function(){m.a.warn("BasicLoader.cache is readonly!");}}},load:function(t){var e=t.src,n=t.type;if(!n){var i=Object(r.getExtension)(e);/^(?:png|jpe?g|gif|webp|bmp)$/i.test(i)&&(n="img"),n||(n=t.defaultType);}return "img"===n?this.loadImg(e,t.crossOrigin):this.loadRes(e,n)},isCrossOrigin:function(t){var e=window.location,n=document.createElement("a");return n.href=t,n.hostname!==e.hostname||n.port!==e.port||n.protocol!==e.protocol},isBase64:function(t){return /^data:(.+?);base64,/.test(t)},Uint8ArrayFrom:function(t,e){if(Uint8Array.from)return Uint8Array.from(t,e);for(var n=t.length,i=new Uint8Array(n),r=0;r<n;r++)i[r]=e(t[r]);return i},loadImg:function(t,e){var n=this,i=Qi.get(t);return i?Qi.wait(i):new Promise(function(i,r){var s=new Image;Qi.update(t,Ki.PENDING),s.onload=function(){s.onerror=null,s.onabort=null,s.onload=null,Qi.update(t,Ki.LOADED,s),i(s);},s.onerror=function(){s.onerror=null,s.onabort=null,s.onload=null;var e=new Error("Image load failed for ".concat(t.slice(0,100)));Qi.update(t,Ki.FAILED,e),r(e);},s.onabort=s.onerror,(e||n.isCrossOrigin(t))&&(n.isBase64(t)||(s.crossOrigin="anonymous")),s.src=t;})},loadRes:function(t,e){var n=this;if(this.isBase64(t)){var i=RegExp.$1,r=t.slice(13+i.length),s=atob(r);return "json"===e?s=JSON.parse(s):"buffer"===e&&(s=this.Uint8ArrayFrom(s,function(t){return t.charCodeAt(0)}).buffer),Promise.resolve(s)}var a=Qi.get(t);return a?Qi.wait(a):(Qi.update(t,Ki.PENDING),this.fire("beforeload"),this.request({url:t,type:e}).then(function(e){return n.fire("loaded"),Qi.update(t,Ki.LOADED,e),e},function(e){throw n.fire("failed",e),Qi.update(t,Ki.FAILED),new Error("Resource load failed for ".concat(t,", ").concat(e))}))},request:function(t){var e=this;return new Promise(function(n,i){var s=new XMLHttpRequest;s.onload=function(){if(s.status<200||s.status>=300)i(new TypeError("Network request failed for ".concat(s.status)));else{var e="response"in s?s.response:s.responseText;if("json"===t.type)try{e=JSON.parse(e);}catch(t){return void i(new TypeError("JSON.parse error"+t))}n(e);}},s.onprogress=function(n){e.fire("progress",{url:t.url,loaded:n.loaded,total:n.total});},s.onerror=function(){i(new TypeError("Network request failed"));},s.ontimeout=function(){i(new TypeError("Network request timed out"));},s.open(t.method||"GET",t.url,!0),"include"===t.credentials&&(s.withCredentials=!0),"buffer"===t.type&&(s.responseType="arraybuffer"),Object(r.each)(t.headers,function(t,e){s.setRequestHeader(e,t);}),s.send(t.body||null);})}}),$i=s.a.create({isLoader:!0,className:"Loader",maxConnections:2,Statics:{_loaderClassMap:{},_loaders:{},addLoader:function(t,e){$i._loaderClassMap[t]=e;},getLoader:function(t){if(!$i._loaders[t]){var e=$i._loaderClassMap[t]?$i._loaderClassMap[t]:Ji;$i._loaders[t]=new e;}return $i._loaders[t]}},load:function(t){var e=this;if(t instanceof Array)return Promise.all(t.map(function(t){return e.load(t)}));var n=t.type||Object(r.getExtension)(t.src);return $i.getLoader(n).load(t)}}),tr=$i,er=s.a.create({Extends:Ji,isCubeTextureLoader:!0,className:"CubeTextureLoader",constructor:function(){er.superclass.constructor.call(this);},load:function(t){var e,n=this;return e=t.images&&Array.isArray(t.images)?t.images:[t.right,t.left,t.top,t.bottom,t.front,t.back],Promise.all(e.map(function(e){return n.loadImg(e,t.crossOrigin)})).then(function(e){var n=Object.assign({},t);return delete n.images,delete n.type,delete n.right,delete n.left,delete n.top,delete n.bottom,delete n.front,delete n.back,n.image=e,new fe(n)}).catch(function(t){throw m.a.error("load CubeTexture failed",t.message,t.stack),t})}});tr.addLoader("CubeTexture",er);var nr=er,ir=s.a.create({Extends:je,isPBRMaterial:!0,className:"PBRMaterial",lightType:"PBR",gammaCorrection:!0,usePhysicsLight:!0,baseColor:null,baseColorMap:null,metallic:1,metallicMap:null,roughness:1,roughnessMap:null,metallicRoughnessMap:null,occlusionMap:null,occlusionStrength:1,isOcclusionInMetallicRoughnessMap:!1,diffuseEnvMap:null,diffuseEnvSphereHarmonics3:null,diffuseEnvIntensity:1,brdfLUT:null,specularEnvIntensity:1,specularEnv:null,emission:null,isSpecularGlossiness:!1,specular:null,glossiness:1,specularGlossinessMap:null,usedUniformVectors:11,constructor:function(t){this.baseColor=new v.a(1,1,1),this.specular=new v.a(1,1,1),ir.superclass.constructor.call(this,t),Object.assign(this.uniforms,{u_baseColor:"BASECOLOR",u_metallic:"METALLIC",u_roughness:"ROUGHNESS",u_specular:"SPECULAR",u_glossiness:"GLOSSINESS",u_brdfLUT:"BRDFLUT",u_diffuseEnvMap:"DIFFUSEENVMAP",u_diffuseEnvIntensity:"DIFFUSEENVINTENSITY",u_occlusionStrength:"OCCLUSIONSTRENGTH",u_specularEnvMap:"SPECULARENVMAP",u_specularEnvIntensity:"SPECULARENVINTENSITY",u_specularEnvMapMipCount:"SPECULARENVMAPMIPCOUNT",u_diffuseEnvSphereHarmonics3:"DIFFUSEENVSPHEREHARMONICS3"}),this.addTextureUniforms({u_baseColorMap:"BASECOLORMAP",u_metallicMap:"METALLICMAP",u_roughnessMap:"ROUGHNESSMAP",u_metallicRoughnessMap:"METALLICROUGHNESSMAP",u_occlusionMap:"OCCLUSIONMAP",u_specularGlossinessMap:"SPECULARGLOSSINESSMAP",u_lightMap:"LIGHTMAP"});},getRenderOption:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};ir.superclass.getRenderOption.call(this,t);var e=this._textureOption.reset(t);return e.add(this.baseColorMap,"BASE_COLOR_MAP"),e.add(this.metallicMap,"METALLIC_MAP"),e.add(this.roughnessMap,"ROUGHNESS_MAP"),e.add(this.metallicRoughnessMap,"METALLIC_ROUGHNESS_MAP"),e.add(this.diffuseEnvMap,"DIFFUSE_ENV_MAP"),e.add(this.occlusionMap,"OCCLUSION_MAP"),e.add(this.lightMap,"LIGHT_MAP"),this.brdfLUT&&(e.add(this.specularEnvMap,"SPECULAR_ENV_MAP"),et.SHADER_TEXTURE_LOD&&this.specularEnvMap&&(t.USE_SHADER_TEXTURE_LOD=1)),this.isSpecularGlossiness&&(t.PBR_SPECULAR_GLOSSINESS=1,e.add(this.specularGlossinessMap,"SPECULAR_GLOSSINESS_MAP")),this.isOcclusionInMetallicRoughnessMap&&(t.IS_OCCLUSION_MAP_IN_METALLIC_ROUGHNESS_MAP=1),1!==this.occlusionStrength&&(t.OCCLUSION_STRENGTH=1),this.diffuseEnvSphereHarmonics3&&(t.DIFFUSE_ENV_SPHERE_HARMONICS3=1),(this.specularEnvMap||this.diffuseEnvSphereHarmonics3||this.specularEnvMap)&&(t.NEED_WORLD_NORMAL=1),e.update(),t}}),rr=ir,sr=new Image;sr.src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";var ar=s.a.create({Extends:qt,Mixes:a.a,isLazyTexture:!0,className:"LazyTexture",_src:"",crossOrigin:!1,autoLoad:!0,src:{get:function(){return this._src},set:function(t){this._src!==t&&(this._src=t,this.autoLoad&&this.load());}},constructor:function(t){t&&("crossOrigin"in t&&(this.crossOrigin=t.crossOrigin),"autoLoad"in t&&(this.autoLoad=t.autoLoad)),ar.superclass.constructor.call(this,t),this.image=this.placeHolder||sr;},load:function(t){var e=this;return ar.loader=ar.loader||new tr,ar.loader.load({src:this.src,crossOrigin:this.crossOrigin,defaultType:"img"}).then(function(t){t.isTexture?(Object.assign(e,t),e.needUpdate=!0,e.needDestory=!0,e.fire("load")):(e.image=t,e.needUpdate=!0,e.fire("load"));},function(n){if(e.fire("error"),t)throw new Error("LazyTexture Failed ".concat(n));m.a.warn("LazyTexture Failed ".concat(n));})}}),or=ar,ur=n(13);function cr(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],i=!0,r=!1,s=void 0;try{for(var a,o=t[Symbol.iterator]();!(i=(a=o.next()).done)&&(n.push(a.value),!e||n.length!==e);i=!0);}catch(t){r=!0,s=t;}finally{try{i||null==o.return||o.return();}finally{if(r)throw s}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var hr=new l.a,fr=new l.a,lr=new l.a,dr=new l.a,mr=new l.a,_r=new l.a,pr=new ur.a,gr=[];function vr(t,e){return t-e}var Er=s.a.create({Statics:{interpolation:{LINEAR:function(t,e,n){if(void 0===e)return t;if(t.slerp)return t.slerp(e,n);if(t.lerp)return t.lerp(e,n);if(Object(r.isArrayLike)(t)){gr.length=0;for(var i=t.length-1;i>=0;i--)gr[i]=t[i]+n*(e[i]-t[i]);return gr}return t+n*(e-t)},STEP:function(t,e,n){return t},CUBICSPLINE:function(t,e,n,i){var s=t.length/3;if(void 0===e)return 1===s?t[1]:t.slice(s,-s);var a=t[1],o=t[2],u=e[1],c=e[0];if(s>1&&(a=t.slice(s,-s),o=t.slice(-s),u=e.slice(s,-s),c=e.slice(0,s)),a.hermite)a.hermite(a,o.scale(i),u,c.scale(i),n);else if(a.sqlerp)a.sqlerp(a,o.scale(i),u,c.scale(i),n);else{Object(r.isArrayLike)(a)||(a=[a],o=[o],u=[u],c=[c]);var h=n*n,f=h*n,l=2*f-3*h+1,d=f-2*h+n,m=-2*f+3*h,_=f-h;gr.length=0;for(var p=a.length-1;p>=0;p--)gr[p]=a[p]*l+d*o[p]*i+u[p]*m+_*c[p]*i;a=gr;}return a}},StateType:{TRANSLATE:"Translation",POSITION:"Translation",TRANSLATION:"Translation",SCALE:"Scale",ROTATE:"Rotation",ROTATION:"Rotation",QUATERNION:"Quaternion",WEIGHTS:"Weights"},getType:function(t){return t=String(t).toUpperCase(),Er.StateType[t]}},isAnimationStates:!0,className:"AnimationStates",nodeName:"",type:"",interpolationType:"LINEAR",constructor:function(t){this.id=d.a.generateUUID(this.className),this.keyTime=[],this.states=[],Object.assign(this,t);},findIndexByTime:function(t){return Object(r.getIndexFromSortedArray)(this.keyTime,t,vr)},getStateByIndex:function(t){var e=this.states.length/this.keyTime.length;return 1===e?this.states[t]:this.states.slice(t*e,t*e+e)},getState:function(t){var e=cr(this.findIndexByTime(t),2),n=e[0],i=e[1];if(n<0||i>=this.keyTime.length)return null;var s=this.keyTime[n],a=this.keyTime[i],o=this.getStateByIndex(n);if(n===i){var u=this.interpolation(o);return this.type===Er.StateType.ROTATION&&(u=hr.fromEuler(pr.fromArray(u))),u.elements||u}var c=this.getStateByIndex(i),h=a-s,f=(t-s)/h;this.type===Er.StateType.ROTATION?Object(r.isArrayLike)(o[0])?(o[0]=hr.fromEuler(pr.fromArray(o[0])),o[1]=fr.fromEuler(pr.fromArray(o[1])),o[2]=lr.fromEuler(pr.fromArray(o[2])),c[0]=dr.fromEuler(pr.fromArray(c[0])),c[1]=mr.fromEuler(pr.fromArray(c[1])),c[2]=_r.fromEuler(pr.fromArray(c[2]))):(o=hr.fromEuler(pr.fromArray(o)),c=fr.fromEuler(pr.fromArray(c))):this.type===Er.StateType.QUATERNION&&(Object(r.isArrayLike)(o[0])?(o[0]=hr.fromArray(o[0]),o[1]=fr.fromArray(o[1]),o[2]=lr.fromArray(o[2]),c[0]=dr.fromArray(c[0]),c[1]=mr.fromArray(c[1]),c[2]=_r.fromArray(c[2])):(o=hr.fromArray(o),c=fr.fromArray(c)));var l=this.interpolation(o,c,f,h);return l.elements||l},interpolation:function(t,e,n,i){return Er.interpolation[this.interpolationType](t,e,n,i)},updateNodeTranslation:function(t,e){t.x=e[0],t.y=e[1],t.z=e[2];},updateNodeScale:function(t,e){t.scaleX=e[0],t.scaleY=e[1],t.scaleZ=e[2];},updateNodeQuaternion:function(t,e){t.quaternion.fromArray(e);},updateNodeWeights:function(t,e){var n=this._originalWeightIndices=this._originalWeightIndices||[],i=e.length;e=e.slice();for(var r=0;r<i;r++)n[r]=r;for(var s=0;s<i;s++)for(var a=s+1;a<i;a++)if(e[a]>e[s]){var o=e[s];e[s]=e[a],e[a]=o,o=n[s],n[s]=n[a],n[a]=o;}t.traverse(function(t){t.isMesh&&t.geometry&&t.geometry.isMorphGeometry&&t.geometry.update(e,n);});},updateNodeState:function(t,e){if(e){var n=this.type;n===Er.StateType.ROTATION&&(n=Er.StateType.QUATERNION);var i=this.getState(t);i&&this["updateNode".concat(n)](e,i);}},clone:function(){return new this.constructor({keyTime:this.keyTime,states:this.states,type:this.type,nodeName:this.nodeName})}}),Tr=Er,Mr=s.a.create({Statics:{_anims:[],tick:function(t){this._anims.forEach(function(e){return e.tick(t)});}},Mixes:a.a,isAnimation:!0,className:"Animation",paused:!1,currentLoopCount:0,loop:1/0,currentTime:0,timeScale:1,startTime:0,endTime:0,clipStartTime:0,clipEndTime:0,nodeNameMap:null,_rootNode:null,rootNode:{get:function(){return this._rootNode},set:function(t){this._rootNode=t,this.initNodeNameMap();}},validAnimationIds:null,constructor:function(t){this.id=d.a.generateUUID(this.className),this.animStatesList=[],this.clips={},Object.assign(this,t),this.initClipTime();},addClip:function(t,e,n,i){this.clips[t]={start:e,end:n,animStatesList:i};},removeClip:function(t){this.clips[t]=null;},getAnimStatesListTimeInfo:function(t){var e=0,n=1/0;return t.forEach(function(t){e=Math.max(t.keyTime[t.keyTime.length-1],e),n=Math.min(t.keyTime[0],n);}),{startTime:n,endTime:e}},initClipTime:function(){var t=this.getAnimStatesListTimeInfo(this.animStatesList);this.clipStartTime=t.startTime,this.clipEndTime=t.endTime;},initNodeNameMap:function(){if(this._rootNode){var t=this.nodeNameMap={};this._rootNode.traverse(function(e){t[e.animationId]=e;var n=e.name;void 0===n||t[n]||(t[n]=e);},!1);}},tick:function(t){this.paused||(this.currentTime+=t/1e3*this.timeScale,this.currentTime>=this.endTime?(this.currentLoopCount++,this.currentTime=this.endTime,this.updateAnimStates(),this.fire("loopEnd"),!this.loop||this.currentLoopCount>=this.loop?(this.stop(),this.fire("end")):this.currentTime=this.startTime):this.updateAnimStates());},updateAnimStates:function(){var t=this;return this.animStatesList.forEach(function(e){e.updateNodeState(t.currentTime,t.nodeNameMap[e.nodeName]);}),this},play:function(t,e){var n;if("string"==typeof t){var i=this.clips[t];i?(n=i.start,e=i.end,i.animStatesList&&(this.animStatesList=i.animStatesList,this.initClipTime())):m.a.warn("no this animation clip name:"+t);}else n=t;void 0===n&&(n=this.clipStartTime),void 0===e&&(e=this.clipEndTime),this.endTime=Math.min(e,this.clipEndTime),this.startTime=Math.min(n,this.endTime),this.currentTime=this.startTime,this.currentLoopCount=0,this.stop(),this.paused=!1,Mr._anims.push(this);},stop:function(){this.paused=!0;var t=Mr._anims,e=t.indexOf(this);-1!==e&&t.splice(e,1);},pause:function(){this.paused=!0;},resume:function(){this.paused=!1;},clone:function(t){var e=new this.constructor({rootNode:t,animStatesList:this.animStatesList,timeScale:this.timeScale,loop:this.loop,paused:this.paused,currentTime:this.currentTime,startTime:this.startTime,endTime:this.endTime,clips:this.clips});return this.paused||e.play(),e}}),Ar=Mr;function Ir(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],i=!0,r=!1,s=void 0;try{for(var a,o=t[Symbol.iterator]();!(i=(a=o.next()).done)&&(n.push(a.value),!e||n.length!==e);i=!0);}catch(t){r=!0,s=t;}finally{try{i||null==o.return||o.return();}finally{if(r)throw s}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var Lr=C.a.BLEND,Or=C.a.DEPTH_TEST,Sr=C.a.CULL_FACE,Rr=C.a.FRONT,yr=C.a.BACK,xr=C.a.FRONT_AND_BACK,Nr={5120:[1,Int8Array],5121:[1,Uint8Array],5122:[2,Int16Array],5123:[2,Uint16Array],5125:[4,Uint32Array],5126:[4,Float32Array]},br={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},wr={POSITION:{name:"vertices",decodeMatName:"positionDecodeMat"},TEXCOORD_0:{name:"uvs",decodeMatName:"uvDecodeMat"},TEXCOORD_1:{name:"uvs1",decodeMatName:"uv1DecodeMat"},NORMAL:{name:"normals",decodeMatName:"normalDecodeMat"},JOINT:{name:"skinIndices"},JOINTS_0:{name:"skinIndices"},WEIGHT:{name:"skinWeights"},WEIGHTS_0:{name:"skinWeights"},TANGENT:{name:"tangents"},COLOR_0:{name:"colors"}},Cr=s.a.create({isGLTFParser:!0,className:"GLTFParser",Statics:{MAGIC:"glTF",extensionHandlers:i,registerExtensionHandler:function(t,e){this.extensionHandlers[t]=e;},unregisterExtensionHandler:function(t){this.extensionHandlers[t]&&delete this.extensionHandlers[t];}},isMultiAnim:!0,isProgressive:!1,isUnQuantizeInShader:!0,isLoadAllTextures:!1,preHandlerImageURI:null,preHandlerBufferURI:null,customMaterialCreator:null,ignoreTextureError:!1,src:"",constructor:function(t,e){Object.assign(this,e),this.content=t;},parse:function(t){var e=this;if(this.content instanceof ArrayBuffer){var n=this.content;if(r.convertUint8ArrayToString(new Uint8Array(n,0,4))===Cr.MAGIC)this.parseBinary(n);else{var i=r.convertUint8ArrayToString(new Uint8Array(n),!0);this.json=JSON.parse(i);}}else this.json=JSON.parse(this.content);return this.glTFVersion=parseFloat(this.json.asset.version),this.glTFVersion>=2&&(this.isGLTF2=!0),this.parseExtensionUsed(),this.loadResources(t).then(function(){return e.parseGeometries()}).then(function(){return e.parseScene()})},parseExtensionUsed:function(){var t=this;this.extensionsUsed={},r.each(this.json.extensionsUsed,function(e){t.extensionsUsed[e]=!0;}),this.extensionsUsed.WEB3D_quantized_attributes||(this.isUnQuantizeInShader=!1);},getExtensionHandler:function(t){return this.extensionHandlers&&this.extensionHandlers[t]||Cr.extensionHandlers[t]},parseExtension:function(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},r=t[e],s=this.getExtensionHandler(e);return s&&s.parse?s.parse(r,this,n,i):n},parseExtensions:function(t,e){var n=this,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return r.each(t,function(t,r){if(!i.ignoreExtensions||!i.ignoreExtensions[r]){var s=n.getExtensionHandler(r);s&&s.parse&&(e=s.parse(t,n,e,i));}}),e},isUseExtension:function(t,e){return !!(t&&t.extensions&&t.extensions[e])},parseBinary:function(t){this.isBinary=!0;var e,n=new DataView(t),i=n.getUint32(4,!0),s=n.getUint32(8,!0),a=12;if(i<2){var o=n.getUint32(a,!0);e=new Uint8Array(t,20,o),e=r.convertUint8ArrayToString(e,!0),this.json=JSON.parse(e),this.binaryBody=t.slice(20+o);}else{if(2!==i)throw new Error("Dont support glTF version ".concat(i));for(;a<s;){var u=n.getUint32(a,!0),c=n.getUint32(a+4,!0);1313821514===c?(e=new Uint8Array(t,a+8,u),e=r.convertUint8ArrayToString(e,!0),this.json=JSON.parse(e)):5130562===c&&(this.binaryBody=t.slice(a+8,a+8+u)),a+=8+u;}}},loadResources:function(t){var e=this,n=[];for(var i in this.extensionsUsed){var r=this.getExtensionHandler(i);r&&r.init&&n.push(r.init(t,this));}return this.isBinary?n.push(this.loadBuffers(t).then(function(){return e.loadTextures(t)})):(n.push(this.loadBuffers(t)),n.push(this.loadTextures(t))),Promise.all(n)},getBufferUri:function(t){var e=r.getRelativePath(this.src,this.json.buffers[t].uri);return this.preHandlerBufferURI&&(e=this.preHandlerBufferURI(e,this.json.buffers[t])),e},loadBuffers:function(t){var e=this;return this.buffers={},this.isBinary?(this.isGLTF2?this.buffers[0]=this.binaryBody:this.buffers.binary_glTF=this.binaryBody,this.parseBufferViews(),Promise.resolve()):Promise.all(Object.keys(this.json.buffers||[]).map(function(n){var i=e.getBufferUri(n);return t.loadRes(i,"buffer").then(function(t){e.buffers[n]=t;})})).then(function(){e.parseBufferViews();})},getImageUri:function(t){var e=this.json.images[t],n=e.uri;if(this.isUseExtension(e,"KHR_binary_glTF")){var i=e.extensions.KHR_binary_glTF,s=this.bufferViews[i.bufferView],a=new Uint8Array(s.buffer,s.byteOffset,s.byteLength);n=r.getBlobUrl(i.mimeType,a);}else if(n)n=r.getRelativePath(this.src,n);else if("bufferView"in e){var o=this.bufferViews[e.bufferView],u=new Uint8Array(o.buffer,o.byteOffset,o.byteLength);n=r.getBlobUrl(e.mimeType,u);}return this.preHandlerImageURI&&(n=this.preHandlerImageURI(n,e)),n},getUsedTextureNameMap:function(){var t=this,e={};return r.each(this.json.materials,function(n){var i=n,s=!1;if(t.isUseExtension(n,"KHR_materials_common")&&(s=!0,i=n.extensions.KHR_materials_common.values),t.isGLTF2&&!s){if(i.normalTexture&&(e[i.normalTexture.index]=!0),i.occlusionTexture&&(e[i.occlusionTexture.index]=!0),i.emissiveTexture&&(e[i.emissiveTexture.index]=!0),i.transparencyTexture&&(e[i.transparencyTexture.index]=!0),t.isUseExtension(i,"KHR_materials_pbrSpecularGlossiness")){var a=i.extensions.KHR_materials_pbrSpecularGlossiness;t.getExtensionHandler("KHR_materials_pbrSpecularGlossiness").getUsedTextureNameMap(a,e,t);}else if(t.isUseExtension(i,"KHR_techniques_webgl")){var o=i.extensions.KHR_techniques_webgl;t.getExtensionHandler("KHR_techniques_webgl").getUsedTextureNameMap(o,e,t);}else if(i.pbrMetallicRoughness){var u=i.pbrMetallicRoughness;u.baseColorTexture&&(e[u.baseColorTexture.index]=!0),u.metallicRoughnessTexture&&(e[u.metallicRoughnessTexture.index]=!0);}}else s||(i=n.values),["diffuse","specular","emission","ambient","transparency","normalMap"].forEach(function(n){var s=i[n];s instanceof Object&&"index"in s&&(s=s.index),r.isStrOrNumber(s)&&t.json.textures[s]&&(e[s]=!0);});}),e},loadTextures:function(){var t=this;if(this.textures={},!this.json.textures)return Promise.resolve();var e=Object.keys(this.json.textures);if(!this.isLoadAllTextures){var n=this.getUsedTextureNameMap();e=e.filter(function(t){return n[t]});}return Promise.all(e.map(function(e){var n=t.json.textures[e],i=t.getImageUri(n.source),s=new or(n);if(s.uv=void 0,s.autoLoad=t.isProgressive,s.crossOrigin=!0,s.src=i,s.name=n.name||e,r.isBlobUrl(i)){var a=function t(){r.revokeBlobUrl(i),s.off("load",t),s.off("error",t);};s.on("load",a,!0),s.on("error",a,!0);}return t.json.samplers&&Object.assign(s,t.json.samplers[n.sampler]),t.textures[e]=s,t.isProgressive?Promise.resolve():s.load(!t.ignoreTextureError)}))},parseBufferViews:function(){var t=this;this.bufferViews={},r.each(this.json.bufferViews,function(e,n){var i=t.buffers[e.buffer],r=e.byteOffset||0,s=e.byteLength;t.bufferViews[n]={id:d.a.generateUUID("bufferView"),byteOffset:r,byteLength:s,buffer:i,byteStride:e.byteStride};}),this.isBinary||delete this.buffers;},getTexture:function(t){var e=this.textures[t.index];if(!e)return null;var n=t.texCoord||0,i=t.index+"_"+n;return this.textures[i]?e=this.textures[i]:"number"==typeof e.uv&&e.uv!==n&&(e=e.clone(),this.textures[i]=e),e.uv=n,e.__gltfTextureInfo=t,e},getColorOrTexture:function(t){return Array.isArray(t)?new v.a(t[0],t[1],t[2]):(t instanceof Object&&"index"in t&&(t=t.index),this.textures[t])},parseMaterialCommonProps:function(t,e){switch(e.alphaMode){case"BLEND":t.transparent=!0;break;case"MASK":t.alphaCutoff="alphaCutoff"in e?e.alphaCutoff:.5;break;case"OPAQUE":default:t.ignoreTranparent=!0;}e.doubleSided?t.side=xr:t.side=Rr,e.transparencyTexture&&(t.transparency=this.getTexture(e.transparencyTexture));},createPBRMaterial:function(t){var e=new rr,n=t,i=!this.isUseExtension(n,"KHR_materials_unlit");if(i){var r=n.normalTexture;r&&(e.normalMap=this.getTexture(r),void 0!==r.scale?e.normalMapScale=r.scale:e.normalMapScale=1);var s=n.occlusionTexture;s&&(e.occlusionMap=this.getTexture(s),void 0!==s.strength?e.occlusionStrength=s.strength:e.occlusionStrength=1);var a=n.emissiveTexture;a&&(e.emission=this.getTexture(a));}else e.lightType="NONE";if(this.isUseExtension(n,"KHR_materials_pbrSpecularGlossiness"))this.parseExtension(n.extensions,"KHR_materials_pbrSpecularGlossiness",e);else if(n.pbrMetallicRoughness){var o=n.pbrMetallicRoughness;o.baseColorFactor&&e.baseColor.fromArray(o.baseColorFactor),o.baseColorTexture&&(e.baseColorMap=this.getTexture(o.baseColorTexture)),i&&(o.metallicRoughnessTexture&&(e.metallicRoughnessMap=this.getTexture(o.metallicRoughnessTexture),e.occlusionMap===e.metallicRoughnessMap&&(e.occlusionMap=null,e.isOcclusionInMetallicRoughnessMap=!0)),"roughnessFactor"in o&&(e.roughness=o.roughnessFactor),"metallicFactor"in o&&(e.metallic=o.metallicFactor));}return e.baseColorMap&&this._parseTextureTransform(e,e.baseColorMap),e},_parseTextureTransform:function(t,e){var n=e.__gltfTextureInfo;if(this.isUseExtension(n,"KHR_texture_transform")){var i=n.extensions.KHR_texture_transform;if(void 0!==i.texCoord&&(e.uv=i.texCoord),i.offset||i.rotation||i.scale){var r=i.offset||[0,0],s=i.rotation||0,a=i.scale||[1,1],o=(new y.a).fromRotationTranslationScale(s,r[0],r[1],a[0],a[1]);0===e.uv?t.uvMatrix=o:1===e.uv&&(t.uvMatrix1=o);}}},createKMCMaterial:function(t,e){var n,i=new ze;return e?(n=e.values,i.lightType=e.technique):n=t.values,i.diffuse=this.getColorOrTexture(n.diffuse)||i.diffuse,i.specular=this.getColorOrTexture(n.specular)||i.specular,i.emission=this.getColorOrTexture(n.emission)||i.emission,i.ambient=this.getColorOrTexture(n.ambient)||i.ambient,n.normalMap&&(i.normalMap=this.getColorOrTexture(n.normalMap)),"number"==typeof n.transparency?(i.transparency=n.transparency,i.transparency<1&&(i.transparent=!0)):"string"==typeof n.transparency&&(i.transparency=this.getColorOrTexture(n.transparency),i.transparent=!0),!0===n.transparent&&(i.transparent=!0),"shininess"in n&&(i.shininess=n.shininess),this._parseTextureTransform(i,i.diffuse),i},parseMaterials:function(){var t=this;this.materials={},r.each(this.json.materials,function(e,n){if(t.customMaterialCreator){var i=t.customMaterialCreator(n,e,t.json,t);if(i)return void(t.materials[n]=i)}var r,s=null;t.isUseExtension(e,"KHR_materials_common")&&(s=e.extensions.KHR_materials_common),t.isGLTF2&&!s?(r=t.isUseExtension(e,"KHR_techniques_webgl")?t.parseExtension(e.extensions,"KHR_techniques_webgl"):t.createPBRMaterial(e),t.parseMaterialCommonProps(r,e)):r=t.createKMCMaterial(e,s),(r=t.parseExtensions(e.extensions,r,{ignoreExtensions:{KHR_techniques_webgl:1,KHR_materials_common:1,KHR_materials_pbrSpecularGlossiness:1},isMaterial:!0})).name=e.name||n,t.materials[n]=r,t.parseTechnique(e,r);});},sparseAccessorHandler:function(t,e){if(!e)return t;var n=e.count,i=t.data.constructor,s=new i(t.realLength);s.set(t.data),t.data=s;for(var a=this.bufferViews[e.values.bufferView],o=new i(a.buffer,a.byteOffset+(e.values.byteOffset||0),n*t.size),u=new(i=Nr[e.indices.componentType][1])((a=this.bufferViews[e.indices.bufferView]).buffer,a.byteOffset+(e.indices.byteOffset||0),n),c=0;c<n;c++)r.copyArrayData(s,o,u[c]*t.size,c*t.size,t.size);return t},getAccessorData:function(t,e){var n=this.json.accessors[t];if(n.data)return n.data;var i,r=Ir(Nr[n.componentType],2)[1],s=br[n.type],a=this.bufferViews[n.bufferView],o=n.count*s;if(a)if(a.byteStride&&a.byteStride>s*r.BYTES_PER_ELEMENT)a.array=new r(a.buffer,a.byteOffset,a.byteLength/r.BYTES_PER_ELEMENT),i=new w(a.array,s,{offset:n.byteOffset||0,stride:a.byteStride,bufferViewId:a.id});else{var u,c=(n.byteOffset||0)+a.byteOffset;if(c%r.BYTES_PER_ELEMENT)u=new r(a.buffer.slice(c,c+o*r.BYTES_PER_ELEMENT));else u=new r(a.buffer,c,o);i=new w(u,s);}return n.sparse&&(i||(i=new w(new r(o),s)),i=this.sparseAccessorHandler(i,n.sparse)),i=this.parseExtensions(n.extensions,i,{isDecode:e,isAccessor:!0}),n.data=i,n.normalized&&(i.normalized=!0),i},getArrayByAccessor:function(t,e){var n=this.json.accessors[t];if(n.array)return n.array;var i=this.getAccessorData(t,e);if(!i.stride&&!i.offset&&1===i.size)return i.data;var r=[];return i.traverse(function(t){r.push(t.toArray?t.toArray():t);}),n.array=r,r},parseTechnique:function(t,e){var n=null;this.json.techniques&&(n=this.json.techniques[t.technique]),n&&n.states&&(n.states.enable.forEach(function(t){switch(t){case Lr:e.blend=!0;break;case Or:e.depthTest=!0;break;case Sr:e.cullFace=!0;}}),r.each(n.states.functions,function(t,n){switch(n){case"blendEquationSeparate":e.blendEquation=t[0],e.blendEquationAlpha=t[1];break;case"blendFuncSeparate":e.blendSrc=t[0],e.blendDst=t[1],e.blendSrcAlpha=t[2],e.blendDstAlpha=t[3];break;case"depthMask":e.depthMask=t[0];break;case"cullFace":e.cullFaceType=t[0];break;default:e[n]=t;}}),e.cullFace?e.side=e.cullFaceType===Rr?yr:Rr:e.side=xr);},createMorphGeometry:function(t,e){var n=this,i=new Gn,s=i.targets={};return r.each(t.targets,function(t){r.each(t,function(t,e){var i=wr[e].name;s[i]||(s[i]=[]);var r=n.getAccessorData(t,!0);s[i].push(r);});}),i.weights=e||new Float32Array(t.targets.length),i},handlerGeometry:function(t,e){var n=void 0===e.mode?4:e.mode;if(e.extensions){var i=this.parseExtensions(e.extensions,null,{primitive:e,isPrimitive:!0});if(i)return i.mode=n,i}t||(t=new Z({mode:n})),"indices"in e&&(t.indices=this.getAccessorData(e.indices));var r=e.attributes;for(var s in r){var a=wr[s];if(a){var o=!(this.isUnQuantizeInShader&&a.decodeMatName);t[a.name]=this.getAccessorData(r[s],o),o||(t[a.decodeMatName]=t[a.name].decodeMat,delete t[a.name].decodeMat);}else m.a.warn("Unknow attribute named ".concat(s,"!"));}return t},handlerSkinedMesh:function(t,e){if(e){var n,i=(e.jointNames||e.joints).length;e.bindShapeMatrix&&(n=(new o.a).fromArray(e.bindShapeMatrix));for(var r=this.getArrayByAccessor(e.inverseBindMatrices,!0),s=0;s<i;s++){var a=(new o.a).fromArray(r[s]);n&&a.multiply(n),t.inverseBindMatrices.push(a);}t.jointNames=e.jointNames||e.joints,this.useInstanced&&(t.useInstanced=!0);}},fixProgressiveGeometry:function(t,e){t._geometry=e,this.isProgressive&&t._meshes&&t._meshes.forEach(function(t){t.visible=!0,t.geometry=e;});},parseGeometries:function(){var t=this,e=r.serialRun(this.json.meshes,function(e){return r.serialRun(e.primitives,function(n){var i;n.targets&&n.targets.length&&(i=t.createMorphGeometry(n,e.weights)),n._geometry=i;var r=t.handlerGeometry(i,n);return r&&r.then?r.then(function(e){t.fixProgressiveGeometry(n,e);},function(t){m.a.error("geometry parse error",t);}):(t.fixProgressiveGeometry(n,r),r)})});return this.isProgressive?null:e},parseMesh:function(t,e,n){var i=this,r=this.json.meshes[t];r.primitives.forEach(function(s){var a,o=i.json.skins&&i.json.skins[n.skin];if(s.meshNode)a=s.meshNode.clone();else{var u=i.materials[s.material]||new ze;a=new(o?ui:ri)({geometry:s._geometry,material:u,name:"mesh-"+(r.name||t)}),s.meshNode=a;}i.handlerSkinedMesh(a,o),i.isProgressive&&!a.geometry&&(a.visible=!1,s._meshes=s._meshes||[],s._meshes.push(a)),e.addChild(a),i.meshes.push(a);});},parseCameras:function(){var t=this;this.cameras={};var e=window.innerWidth/window.innerHeight;r.each(this.json.cameras,function(n,i){var r;"perspective"===n.type&&n.perspective?((r=new Q).fov=d.a.radToDeg(n.perspective.yfov),r.near=n.perspective.znear,r.far=n.perspective.zfar,n.aspectRatio?r.aspect=n.aspectRatio:r.aspect=e):"orthographic"===n.type&&n.orthographic&&((r=new tn).near=n.orthographic.znear,r.far=n.orthographic.zfar,r.right=n.orthographic.xmag,r.left=-1*r.right,r.top=n.orthographic.ymag,r.bottom=-1*r.top),r&&(r.name=n.name||i,t.cameras[i]=r);});},handlerNodeTransform:function(t,e){e.matrix?t.matrix.fromArray(e.matrix):(e.rotation&&t.quaternion.fromArray(e.rotation),e.scale&&t.setScale(e.scale[0],e.scale[1],e.scale[2]),e.translation&&(t.x=e.translation[0],t.y=e.translation[1],t.z=e.translation[2]));},parseNode:function(t,e){var n,i=this,r=this.json.nodes[t];r||m.a.warn("GLTFParser.parseNode: nodes[".concat(t,"] has nothing.")),n=new g({name:r.name,animationId:t}),n=this.parseExtensions(r.extensions,n,{isNode:!0}),"camera"in r&&this.cameras[r.camera]&&n.addChild(this.cameras[r.camera]),this.handlerNodeTransform(n,r),r.jointName?(n.jointName=r.jointName,this.jointMap[n.jointName]=n):this.isGLTF2&&(n.jointName=t,this.jointMap[t]=n),r.meshes?r.meshes.forEach(function(t){return i.parseMesh(t,n,r)}):"mesh"in r&&this.parseMesh(r.mesh,n,r),r.children&&r.children.forEach(function(t){return i.parseNode(t,n)}),e.addChild(n);},parseAnimations:function(){var t=this;if(!this.json.animations)return null;var e=this.isMultiAnim,n={},i=[],s={};return r.each(this.json.animations,function(r){r.channels.forEach(function(e){var n=e.target.path,a=e.target.id;t.isGLTF2&&(a=e.target.node);var o=r.samplers[e.sampler],u=t.isGLTF2?o.input:r.parameters[o.input],c=t.isGLTF2?o.output:r.parameters[n],h=t.getArrayByAccessor(u,!0),f=t.getArrayByAccessor(c,!0);"rotation"===n&&(n="quaternion");var l=new Tr({interpolationType:o.interpolation||"LINEAR",nodeName:a,keyTime:h,states:f,type:Tr.getType(n)});i.push(l),s[a]=!0;}),e&&i.length&&(n[r.name]={animStatesList:i},i=[]);}),e&&Object.keys(n).length>0&&(i=Object.values(n)[0].animStatesList),i.length?new Ar({rootNode:this.node,animStatesList:i,validAnimationIds:s,clips:n}):null},parseScene:function(){var t=this;this.parseMaterials(),this.jointMap={},this.meshes=[],this.lights=[],this.node=new g({needCallChildUpdate:!1}),this.parseCameras();var e=this.json.scenes[this.getDefaultSceneName()];if(!e)return m.a.warn("GLTFParser:no scene!"),{node:this.node,meshes:[],cameras:[],lights:[],textures:[],materials:[]};e.nodes.forEach(function(e){return t.parseNode(e,t.node)}),this.node.resetSkinedMeshRootNode();var n={node:this.node,scene:this.node,meshes:this.meshes,json:this.json,cameras:Object.values(this.cameras),lights:this.lights,textures:Object.values(this.textures),materials:Object.values(this.materials)},i=this.parseAnimations();return i&&(this.node.setAnim(i),i.play(),n.anim=i),this.parseExtensions(e.extensions,null,{isScene:!0}),this.parseExtensions(this.json.extensions,n,{isGlobalExtension:!0}),n},getDefaultSceneName:function(){return void 0!==this.defaultScene?this.defaultScene:this.json.scenes?Object.keys(this.json.scenes)[0]:null}}),Pr=Cr,Hr=s.a.create({Extends:Ji,isGLTFLoader:!0,className:"GLTFLoader",constructor:function(){Hr.superclass.constructor.call(this);},load:function(t){var e=this;return this.loadRes(t.src,"buffer").then(function(n){return new Pr(n,t).parse(e)}).catch(function(t){throw m.a.error("load gltf failed",t.message,t.stack),t})}});tr.addLoader("gltf",Hr),tr.addLoader("glb",Hr);var Dr=Hr,Fr=n(106),Ur=n.n(Fr),Gr=C.a.RGBA,Br=C.a.NEAREST,Vr=C.a.CLAMP_TO_EDGE,Xr=C.a.FLOAT,jr=s.a.create({Extends:Ji,isHDRLoader:!0,className:"HDRLoader",constructor:function(){jr.superclass.constructor.call(this);},load:function(t){return this.loadRes(t.src,"buffer").then(function(e){try{var n=Ur()(e),i=n.shape,r=n.data,s=new qt({width:i[0],height:i[1],flipY:t.flipY||!1,image:r,type:Xr,magFilter:Br,minFilter:Br,wrapS:Vr,wrapT:Vr,internalFormat:Gr,format:Gr});return Object.assign(s,t),s}catch(t){m.a.error("HDRLoader:parse error => ",t);}return null})}});tr.addLoader("hdr",jr);var kr=jr,zr=s.a.create({Statics:{HEADER_LEN:64,COMPRESSED_2D:0,COMPRESSED_3D:1,TEX_2D:2,TEX_3D:3},isKhronosTextureContainer:!0,className:"KhronosTextureContainer",constructor:function(t,e){this.arrayBuffer=t;var n=new Uint8Array(this.arrayBuffer,0,12);if(171===n[0]&&75===n[1]&&84===n[2]&&88===n[3]&&32===n[4]&&49===n[5]&&49===n[6]&&187===n[7]&&13===n[8]&&10===n[9]&&26===n[10]&&10===n[11]){var i=Uint32Array.BYTES_PER_ELEMENT,r=new DataView(this.arrayBuffer,12,13*i),s=67305985===r.getUint32(0,!0);this.glType=r.getUint32(1*i,s),this.glTypeSize=r.getUint32(2*i,s),this.glFormat=r.getUint32(3*i,s),this.glInternalFormat=r.getUint32(4*i,s),this.glBaseInternalFormat=r.getUint32(5*i,s),this.pixelWidth=r.getUint32(6*i,s),this.pixelHeight=r.getUint32(7*i,s),this.pixelDepth=r.getUint32(8*i,s),this.numberOfArrayElements=r.getUint32(9*i,s),this.numberOfFaces=r.getUint32(10*i,s),this.numberOfMipmapLevels=r.getUint32(11*i,s),this.bytesOfKeyValueData=r.getUint32(12*i,s),this.numberOfMipmapLevels=Math.max(1,this.numberOfMipmapLevels),0!==this.pixelHeight&&0===this.pixelDepth?0===this.numberOfArrayElements?this.numberOfFaces===e?0===this.glType?this.loadType=zr.COMPRESSED_2D:this.loadType=zr.TEX_2D:m.a.warn("number of faces expected"+e+", but found "+this.numberOfFaces):m.a.warn("texture arrays not currently supported"):m.a.warn("only 2D textures currently supported");}else m.a.error("texture missing KTX identifier");},mipmaps:function(t){for(var e=[],n=zr.HEADER_LEN+this.bytesOfKeyValueData,i=this.pixelWidth,r=this.pixelHeight,s=t?this.numberOfMipmapLevels:1,a=0;a<s;a++){for(var o=new Int32Array(this.arrayBuffer,n,1)[0],u=0;u<this.numberOfFaces;u++){var c=new Uint8Array(this.arrayBuffer,n+4,o);e.push({data:c,width:i,height:r}),n+=o+4,n+=3-(o+3)%4;}i=Math.max(1,.5*i),r=Math.max(1,.5*r);}return e}}),qr=s.a.create({Extends:Ji,Statics:{astc:"WEBGL_compressed_texture_astc",etc:"WEBGL_compressed_texture_etc",etc1:"WEBGL_compressed_texture_etc1",pvrtc:"WEBGL_compressed_texture_pvrtc",s3tc:"WEBGL_compressed_texture_s3tc"},isKTXLoader:!0,className:"KTXLoader",constructor:function(){tt.use(qr.astc),tt.use(qr.atc),tt.use(qr.etc),tt.use(qr.etc1),tt.use(qr.pvrtc),tt.use(qr.s3tc),tt.use(qr.s3tc_srgb),qr.superclass.constructor.call(this);},load:function(t){return this.loadRes(t.src,"buffer").then(function(t){var e=new zr(t,1),n={compressed:0===e.glType,type:e.glType,width:e.pixelWidth,height:e.pixelHeight,internalFormat:e.glInternalFormat,format:e.glFormat,isCubemap:6===e.numberOfFaces};return e.numberOfMipmapLevels>=Math.floor(Math.log2(Math.max(n.width,n.height))+1)?(n.mipmaps=e.mipmaps(!0),n.image=n.mipmaps[0].data):(n.mipmaps=null,n.image=e.mipmaps(!1)[0].data),new qt(n)})}});tr.addLoader("ktx",qr);var Wr=qr,Yr=s.a.create({Mixes:a.a,isLoadQueue:!0,className:"LoadQueue",Statics:{addLoader:function(t,e){m.a.warn("LoadQueue.addLoader is duplicated, please use Loader.addLoader"),tr.addLoader(t,e);}},constructor:function(t){this._source=[],this.add(t);},maxConnections:2,_source:null,_loaded:0,_connections:0,_currentIndex:-1,add:function(t){return t&&(t=Array.isArray(t)?t:[t],this._source=this._source.concat(t)),this},get:function(t){if(!t)return null;for(var e=this._source,n=0;n<e.length;n++){var i=e[n];if(i.id===t||i.src===t)return i}return null},getContent:function(t){var e=this.get(t);return e&&e.content},start:function(){return this._loader||(this._loader=new tr),this._loadNext(),this},_loadNext:function(){var t=this,e=this._source,n=e.length;if(this._loaded>=n)this.fire("complete");else if(this._currentIndex<n-1&&this._connections<this.maxConnections){var i=++this._currentIndex,r=e[i];this._connections++,this._loader.load(r).then(function(e){t._onItemLoad(i,e);},function(e){t._onItemError(i,e);});}},_onItemLoad:function(t,e){var n=this._source[t];n.loaded=!0,n.content=e,this._connections--,this._loaded++,this.fire("load",n),this._loadNext();},_onItemError:function(t,e){var n=this._source[t];n.error=e,this._connections--,this._loaded++,this.fire("error",n),this._loadNext();},getSize:function(t){for(var e=0,n=this._source,i=0;i<n.length;i++){var r=n[i];e+=(t?r.loaded&&r.size:r.size)||0;}return e},getLoaded:function(){return this._loaded},getTotal:function(){return this._source.length},getAllContent:function(){return this._source.map(function(t){return t.content})}}),Zr=s.a.create({Extends:Ji,isShaderMaterialLoader:!0,className:"ShaderMaterialLoader",constructor:function(){Zr.superclass.constructor.call(this);},load:function(t){var e=[this.loadRes(t.fs),this.loadRes(t.vs)],n=Object.assign({},t);return Promise.all(e).then(function(t){return n.fs=t[0],n.vs=t[1],new Hn(n)},function(t){m.a.warn("ShaderMaterial Loader Failed for ".concat(t));})}}),Kr=Zr,Qr=s.a.create({Extends:Ji,isTextureLoader:!0,className:"TextureLoader",constructor:function(){Qr.superclass.constructor.call(this);},load:function(t){return this.loadImg(t.src,t.crossOrigin).then(function(e){var n=Object.assign({},t);return n.image=e,delete n.type,new qt(n)}).catch(function(t){throw m.a.error("load Texture failed",t.message,t.stack),t})}});tr.addLoader("Texture",Qr);var Jr=Qr,$r=C.a.LINES,ts={x:[0,0,0,1,0,0],y:[0,0,0,0,1,0],z:[0,0,0,0,0,1]},es=s.a.create({Extends:g,isAxisHelper:!0,className:"AxisHelper",size:1,constructor:function(t){es.superclass.constructor.call(this,t),this.init();},addAxis:function(t){var e=new ri({name:"AxisHelper_"+t,geometry:new Z({mode:$r,vertices:new w(new Float32Array(ts[t]),3),indices:new w(new Uint16Array([0,1]),1)}),material:new ze({diffuse:new v.a(ts[t][3],ts[t][4],ts[t][5]),lightType:"NONE"})});this.addChild(e);},init:function(){this.setScale(this.size),this.addAxis("x"),this.addAxis("y"),this.addAxis("z");}}),ns=es,is=C.a.LINES,rs=s.a.create({Extends:ri,isAxisNetHelper:!0,className:"AxisNetHelper",size:5,constructor:function(t){rs.superclass.constructor.call(this,t),this.color=this.color||new v.a(.5,.5,.5);for(var e=new Z({mode:is}),n=this.size,i=2*n+1,r=0;r<i;r++){var s=r/n-1;e.addLine([s,0,-1],[s,0,1]),e.addLine([-1,0,s],[1,0,s]);}this.geometry=e,this.material=new ze({diffuse:this.color,lightType:"NONE"});}}),ss=rs,as=C.a.LINES,os=new c.a,us=s.a.create({Extends:ri,isCameraHelper:!0,className:"CameraHelper",camera:null,color:null,constructor:function(t){us.superclass.constructor.call(this,t),this.color||(this.color=new v.a(.3,.9,.6)),this.material=new ze({lightType:"NONE",diffuse:this.color||new v.a(.5,.5,.5,1)}),this.geometry=new Z({mode:as,isStatic:!1,vertices:new w(new Float32Array(27),3),indices:new w(new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7,8,4,8,5,8,6,8,7]),1)});},onUpdate:function(){this.camera&&(this.camera.updateViewProjectionMatrix(),this._buildGeometry());},_buildGeometry:function(){var t=this.camera,e=this.geometry;e.vertices.set(0,t.unprojectVector(os.set(-1,-1,1))),e.vertices.set(1,t.unprojectVector(os.set(-1,1,1))),e.vertices.set(2,t.unprojectVector(os.set(1,1,1))),e.vertices.set(3,t.unprojectVector(os.set(1,-1,1))),e.vertices.set(4,t.unprojectVector(os.set(-1,-1,-1))),e.vertices.set(5,t.unprojectVector(os.set(-1,1,-1))),e.vertices.set(6,t.unprojectVector(os.set(1,1,-1))),e.vertices.set(7,t.unprojectVector(os.set(1,-1,-1))),e.vertices.set(8,t.worldMatrix.getTranslation(os)),e.vertices.isDirty=!0;}}),cs=us,hs=s.a.create({Extends:M,isAmbientLight:!0,className:"AmbientLight",autoUpdateWorldMatrix:!1,constructor:function(t){hs.superclass.constructor.call(this,t);}}),fs=hs,ls=s.a.create({Statics:{ltcTexture1:null,ltcTexture2:null,ltcTextureReady:!1,ltcTextureUrl:"//g.alicdn.com/tmapp/static/4.0.63/ltcTexture.js",loadLtcTexture:function(){var t=this;this.ltcTextureReady||void 0===this._loader&&(this._loader=new tr,this._loader.load({type:"json",src:this.ltcTextureUrl}).then(function(e){t._loader=null,t.ltcTexture1=new ve({data:e.ltcTexture1}),t.ltcTexture2=new ve({data:e.ltcTexture2}),t.ltcTextureReady=!0;}));}},Extends:M,isAreaLight:!0,className:"AreaLight",width:10,height:10,_enabled:!0,enabled:{get:function(){return this._enabled&&ls.ltcTextureReady},set:function(t){this._enabled=t;}},constructor:function(t){ls.superclass.constructor.call(this,t),ls.loadLtcTexture();},ltcTexture1:{get:function(){return ls.ltcTexture1},set:function(t){ls.ltcTexture1=t;}},ltcTexture2:{get:function(){return ls.ltcTexture2},set:function(t){ls.ltcTexture2=t;}}}),ds=ls,ms=new ze({lightType:"NONE"}),_s=new v.a(1,1,1),ps=new v.a,gs=s.a.create({isMeshPicker:!0,className:"MeshPicker",debug:!1,renderer:null,colorMeshMap:null,constructor:function(t){Object.assign(this,t),this.colorMeshMap={},this.init();},createFramebuffer:function(){if(!this.framebuffer){var t=this.renderer;this.framebuffer=new re(t,{useVao:t.useVao,width:t.width,height:t.height});}},renderDebug:function(){this.framebuffer.render(0,.7,.3,.3);},createMeshNumberId:function(t){"numberId"in t||(t.numberId=10*Number(t.id.replace(/^.*_(\d+)$/,"$1")),t.color=Object(r.padLeft)(t.numberId.toString(16),6),this.colorMeshMap[t.color]=t);},renderColoredMeshes:function(){var t=this,e=this.renderer,n=this.framebuffer;n.bind(),e.clear(_s);var i=e.forceMaterial;e.forceMaterial=ms,e.renderList.traverse(function(n){t.createMeshNumberId(n),ms.diffuse.fromHEX(n.color),ms.isDirty=!0,e.renderMesh(n);}),e.forceMaterial=i,n.unbind();},getSelection:function(t,e){for(var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,r=this.renderer.pixelRatio,s=[],a=this.framebuffer.readPixels(t*r,e*r,n*r,i*r),o=0;o<a.length;o+=4){var u=ps.fromUintArray(a,o).toHEX();this.colorMeshMap[u]&&s.push(this.colorMeshMap[u]);}return s},init:function(){var t=this;this.createFramebuffer(),this.renderer.on("afterRender",function(){t.renderColoredMeshes(),t.debug&&t.renderDebug();});}}),vs=n(107),Es=n.n(vs).a,Ts={get:function(){if(void 0===this._isWebGLSupport)try{var t=document.createElement("canvas"),e=t.getContext("webgl");e.clearColor(0,1,0,1),e.clear(e.COLOR_BUFFER_BIT);var n=new Uint8Array(4);e.readPixels(0,0,1,1,e.RGBA,e.UNSIGNED_BYTE,n),0===n[0]&&255===n[1]&&0===n[2]&&255===n[3]?this._isWebGLSupport=!0:this._isWebGLSupport=!1,t=null,e=null,n=null;}catch(t){this._isWebGLSupport=!1;}return this._isWebGLSupport}},Ms=n(28);n.d(e,"util",function(){return r}),n.d(e,"GLTFExtensions",function(){return i}),n.d(e,"Class",function(){return s.a}),n.d(e,"EventMixin",function(){return a.a}),n.d(e,"Fog",function(){return $n}),n.d(e,"Mesh",function(){return ri}),n.d(e,"Node",function(){return g}),n.d(e,"SkinedMesh",function(){return ui}),n.d(e,"Stage",function(){return wi}),n.d(e,"Tween",function(){return Fi}),n.d(e,"version",function(){return "1.13.31"}),n.d(e,"BoxGeometry",function(){return Gi}),n.d(e,"Geometry",function(){return Z}),n.d(e,"GeometryData",function(){return w}),n.d(e,"MorphGeometry",function(){return Gn}),n.d(e,"PlaneGeometry",function(){return ki}),n.d(e,"SphereGeometry",function(){return qi}),n.d(e,"Camera",function(){return O}),n.d(e,"PerspectiveCamera",function(){return Q}),n.d(e,"OrthographicCamera",function(){return tn}),n.d(e,"Buffer",function(){return xt}),n.d(e,"capabilities",function(){return et}),n.d(e,"extensions",function(){return tt}),n.d(e,"Framebuffer",function(){return re}),n.d(e,"glType",function(){return Tt}),n.d(e,"logGLResource",function(){return Yi}),n.d(e,"Program",function(){return It}),n.d(e,"RenderInfo",function(){return ci}),n.d(e,"RenderList",function(){return di}),n.d(e,"VertexArrayObject",function(){return Ft}),n.d(e,"WebGLRenderer",function(){return yi}),n.d(e,"WebGLResourceManager",function(){return _i}),n.d(e,"WebGLState",function(){return mi}),n.d(e,"BasicLoader",function(){return Ji}),n.d(e,"CubeTextureLoader",function(){return nr}),n.d(e,"GLTFLoader",function(){return Dr}),n.d(e,"GLTFParser",function(){return Pr}),n.d(e,"AliAMCExtension",function(){return jn}),n.d(e,"HDRLoader",function(){return kr}),n.d(e,"KTXLoader",function(){return Wr}),n.d(e,"LoadCache",function(){return Ki}),n.d(e,"LoadQueue",function(){return Yr}),n.d(e,"ShaderMaterialLoader",function(){return Kr}),n.d(e,"TextureLoader",function(){return Jr}),n.d(e,"Loader",function(){return tr}),n.d(e,"Texture",function(){return qt}),n.d(e,"LazyTexture",function(){return or}),n.d(e,"CubeTexture",function(){return fe}),n.d(e,"DataTexture",function(){return ve}),n.d(e,"Shader",function(){return dt}),n.d(e,"BasicMaterial",function(){return ze}),n.d(e,"GeometryMaterial",function(){return Je}),n.d(e,"Material",function(){return je}),n.d(e,"PBRMaterial",function(){return rr}),n.d(e,"semantic",function(){return we}),n.d(e,"ShaderMaterial",function(){return Hn}),n.d(e,"AxisHelper",function(){return ns}),n.d(e,"AxisNetHelper",function(){return ss}),n.d(e,"CameraHelper",function(){return cs}),n.d(e,"AmbientLight",function(){return fs}),n.d(e,"AreaLight",function(){return ds}),n.d(e,"DirectionalLight",function(){return xn}),n.d(e,"CubeLightShadow",function(){return In}),n.d(e,"Light",function(){return M}),n.d(e,"LightManager",function(){return Ei}),n.d(e,"LightShadow",function(){return un}),n.d(e,"PointLight",function(){return On}),n.d(e,"SpotLight",function(){return Cn}),n.d(e,"Animation",function(){return Ar}),n.d(e,"AnimationStates",function(){return Tr}),n.d(e,"MeshPicker",function(){return gs}),n.d(e,"Ticker",function(){return Es}),n.d(e,"log",function(){return m.a}),n.d(e,"Cache",function(){return J}),n.d(e,"browser",function(){return Ni}),n.d(e,"WebGLSupport",function(){return Ts}),n.d(e,"constants",function(){return C.a}),n.d(e,"Color",function(){return Ms.Color}),n.d(e,"Euler",function(){return Ms.Euler}),n.d(e,"EulerNotifier",function(){return Ms.EulerNotifier}),n.d(e,"Frustum",function(){return Ms.Frustum}),n.d(e,"math",function(){return Ms.math}),n.d(e,"Matrix3",function(){return Ms.Matrix3}),n.d(e,"Matrix4",function(){return Ms.Matrix4}),n.d(e,"Matrix4Notifier",function(){return Ms.Matrix4Notifier}),n.d(e,"Plane",function(){return Ms.Plane}),n.d(e,"Quaternion",function(){return Ms.Quaternion}),n.d(e,"Ray",function(){return Ms.Ray}),n.d(e,"Sphere",function(){return Ms.Sphere}),n.d(e,"SphericalHarmonics3",function(){return Ms.SphericalHarmonics3}),n.d(e,"Vector2",function(){return Ms.Vector2}),n.d(e,"Vector3",function(){return Ms.Vector3}),n.d(e,"Vector3Notifier",function(){return Ms.Vector3Notifier}),n.d(e,"Vector4",function(){return Ms.Vector4});},,,function(t,e,n){n(108),t.exports=n(114);}]),"undefined"!=typeof window&&window.Hilo3d&&"object"=='object'&&"object"=='object'&&(module.exports=window.Hilo3d);
  });

  var Hilo3d$1 = unwrapExports(Hilo3d);
  var Hilo3d_1 = Hilo3d.util;
  var Hilo3d_2 = Hilo3d.GLTFExtensions;
  var Hilo3d_3 = Hilo3d.Class;
  var Hilo3d_4 = Hilo3d.EventMixin;
  var Hilo3d_5 = Hilo3d.Fog;
  var Hilo3d_6 = Hilo3d.Mesh;
  var Hilo3d_7 = Hilo3d.Node;
  var Hilo3d_8 = Hilo3d.SkinedMesh;
  var Hilo3d_9 = Hilo3d.Stage;
  var Hilo3d_10 = Hilo3d.Tween;
  var Hilo3d_11 = Hilo3d.version;
  var Hilo3d_12 = Hilo3d.BoxGeometry;
  var Hilo3d_13 = Hilo3d.Geometry;
  var Hilo3d_14 = Hilo3d.GeometryData;
  var Hilo3d_15 = Hilo3d.MorphGeometry;
  var Hilo3d_16 = Hilo3d.PlaneGeometry;
  var Hilo3d_17 = Hilo3d.SphereGeometry;
  var Hilo3d_18 = Hilo3d.Camera;
  var Hilo3d_19 = Hilo3d.PerspectiveCamera;
  var Hilo3d_20 = Hilo3d.OrthographicCamera;
  var Hilo3d_21 = Hilo3d.Buffer;
  var Hilo3d_22 = Hilo3d.capabilities;
  var Hilo3d_23 = Hilo3d.extensions;
  var Hilo3d_24 = Hilo3d.Framebuffer;
  var Hilo3d_25 = Hilo3d.glType;
  var Hilo3d_26 = Hilo3d.Program;
  var Hilo3d_27 = Hilo3d.RenderInfo;
  var Hilo3d_28 = Hilo3d.RenderList;
  var Hilo3d_29 = Hilo3d.VertexArrayObject;
  var Hilo3d_30 = Hilo3d.WebGLRenderer;
  var Hilo3d_31 = Hilo3d.WebGLResourceManager;
  var Hilo3d_32 = Hilo3d.WebGLState;
  var Hilo3d_33 = Hilo3d.BasicLoader;
  var Hilo3d_34 = Hilo3d.CubeTextureLoader;
  var Hilo3d_35 = Hilo3d.GLTFLoader;
  var Hilo3d_36 = Hilo3d.GLTFParser;
  var Hilo3d_37 = Hilo3d.AliAMCExtension;
  var Hilo3d_38 = Hilo3d.HDRLoader;
  var Hilo3d_39 = Hilo3d.KTXLoader;
  var Hilo3d_40 = Hilo3d.LoadCache;
  var Hilo3d_41 = Hilo3d.LoadQueue;
  var Hilo3d_42 = Hilo3d.ShaderMaterialLoader;
  var Hilo3d_43 = Hilo3d.TextureLoader;
  var Hilo3d_44 = Hilo3d.Loader;
  var Hilo3d_45 = Hilo3d.Texture;
  var Hilo3d_46 = Hilo3d.LazyTexture;
  var Hilo3d_47 = Hilo3d.CubeTexture;
  var Hilo3d_48 = Hilo3d.DataTexture;
  var Hilo3d_49 = Hilo3d.Shader;
  var Hilo3d_50 = Hilo3d.BasicMaterial;
  var Hilo3d_51 = Hilo3d.GeometryMaterial;
  var Hilo3d_52 = Hilo3d.Material;
  var Hilo3d_53 = Hilo3d.PBRMaterial;
  var Hilo3d_54 = Hilo3d.semantic;
  var Hilo3d_55 = Hilo3d.ShaderMaterial;
  var Hilo3d_56 = Hilo3d.AxisHelper;
  var Hilo3d_57 = Hilo3d.AxisNetHelper;
  var Hilo3d_58 = Hilo3d.CameraHelper;
  var Hilo3d_59 = Hilo3d.AmbientLight;
  var Hilo3d_60 = Hilo3d.AreaLight;
  var Hilo3d_61 = Hilo3d.DirectionalLight;
  var Hilo3d_62 = Hilo3d.CubeLightShadow;
  var Hilo3d_63 = Hilo3d.Light;
  var Hilo3d_64 = Hilo3d.LightManager;
  var Hilo3d_65 = Hilo3d.LightShadow;
  var Hilo3d_66 = Hilo3d.PointLight;
  var Hilo3d_67 = Hilo3d.SpotLight;
  var Hilo3d_68 = Hilo3d.Animation;
  var Hilo3d_69 = Hilo3d.AnimationStates;
  var Hilo3d_70 = Hilo3d.MeshPicker;
  var Hilo3d_71 = Hilo3d.Ticker;
  var Hilo3d_72 = Hilo3d.log;
  var Hilo3d_73 = Hilo3d.Cache;
  var Hilo3d_74 = Hilo3d.browser;
  var Hilo3d_75 = Hilo3d.WebGLSupport;
  var Hilo3d_76 = Hilo3d.constants;
  var Hilo3d_77 = Hilo3d.Color;
  var Hilo3d_78 = Hilo3d.Euler;
  var Hilo3d_79 = Hilo3d.EulerNotifier;
  var Hilo3d_80 = Hilo3d.Frustum;
  var Hilo3d_81 = Hilo3d.math;
  var Hilo3d_82 = Hilo3d.Matrix3;
  var Hilo3d_83 = Hilo3d.Matrix4;
  var Hilo3d_84 = Hilo3d.Matrix4Notifier;
  var Hilo3d_85 = Hilo3d.Plane;
  var Hilo3d_86 = Hilo3d.Quaternion;
  var Hilo3d_87 = Hilo3d.Ray;
  var Hilo3d_88 = Hilo3d.Sphere;
  var Hilo3d_89 = Hilo3d.Vector2;
  var Hilo3d_90 = Hilo3d.Vector3;
  var Hilo3d_91 = Hilo3d.Vector3Notifier;
  var Hilo3d_92 = Hilo3d.Vector4;
  var Hilo3d_93 = Hilo3d.SphericalHarmonics3;

  var Hilo3d$2 = /*#__PURE__*/Object.freeze({
    default: Hilo3d$1,
    __moduleExports: Hilo3d,
    util: Hilo3d_1,
    GLTFExtensions: Hilo3d_2,
    Class: Hilo3d_3,
    EventMixin: Hilo3d_4,
    Fog: Hilo3d_5,
    Mesh: Hilo3d_6,
    Node: Hilo3d_7,
    SkinedMesh: Hilo3d_8,
    Stage: Hilo3d_9,
    Tween: Hilo3d_10,
    version: Hilo3d_11,
    BoxGeometry: Hilo3d_12,
    Geometry: Hilo3d_13,
    GeometryData: Hilo3d_14,
    MorphGeometry: Hilo3d_15,
    PlaneGeometry: Hilo3d_16,
    SphereGeometry: Hilo3d_17,
    Camera: Hilo3d_18,
    PerspectiveCamera: Hilo3d_19,
    OrthographicCamera: Hilo3d_20,
    Buffer: Hilo3d_21,
    capabilities: Hilo3d_22,
    extensions: Hilo3d_23,
    Framebuffer: Hilo3d_24,
    glType: Hilo3d_25,
    Program: Hilo3d_26,
    RenderInfo: Hilo3d_27,
    RenderList: Hilo3d_28,
    VertexArrayObject: Hilo3d_29,
    WebGLRenderer: Hilo3d_30,
    WebGLResourceManager: Hilo3d_31,
    WebGLState: Hilo3d_32,
    BasicLoader: Hilo3d_33,
    CubeTextureLoader: Hilo3d_34,
    GLTFLoader: Hilo3d_35,
    GLTFParser: Hilo3d_36,
    AliAMCExtension: Hilo3d_37,
    HDRLoader: Hilo3d_38,
    KTXLoader: Hilo3d_39,
    LoadCache: Hilo3d_40,
    LoadQueue: Hilo3d_41,
    ShaderMaterialLoader: Hilo3d_42,
    TextureLoader: Hilo3d_43,
    Loader: Hilo3d_44,
    Texture: Hilo3d_45,
    LazyTexture: Hilo3d_46,
    CubeTexture: Hilo3d_47,
    DataTexture: Hilo3d_48,
    Shader: Hilo3d_49,
    BasicMaterial: Hilo3d_50,
    GeometryMaterial: Hilo3d_51,
    Material: Hilo3d_52,
    PBRMaterial: Hilo3d_53,
    semantic: Hilo3d_54,
    ShaderMaterial: Hilo3d_55,
    AxisHelper: Hilo3d_56,
    AxisNetHelper: Hilo3d_57,
    CameraHelper: Hilo3d_58,
    AmbientLight: Hilo3d_59,
    AreaLight: Hilo3d_60,
    DirectionalLight: Hilo3d_61,
    CubeLightShadow: Hilo3d_62,
    Light: Hilo3d_63,
    LightManager: Hilo3d_64,
    LightShadow: Hilo3d_65,
    PointLight: Hilo3d_66,
    SpotLight: Hilo3d_67,
    Animation: Hilo3d_68,
    AnimationStates: Hilo3d_69,
    MeshPicker: Hilo3d_70,
    Ticker: Hilo3d_71,
    log: Hilo3d_72,
    Cache: Hilo3d_73,
    browser: Hilo3d_74,
    WebGLSupport: Hilo3d_75,
    constants: Hilo3d_76,
    Color: Hilo3d_77,
    Euler: Hilo3d_78,
    EulerNotifier: Hilo3d_79,
    Frustum: Hilo3d_80,
    math: Hilo3d_81,
    Matrix3: Hilo3d_82,
    Matrix4: Hilo3d_83,
    Matrix4Notifier: Hilo3d_84,
    Plane: Hilo3d_85,
    Quaternion: Hilo3d_86,
    Ray: Hilo3d_87,
    Sphere: Hilo3d_88,
    Vector2: Hilo3d_89,
    Vector3: Hilo3d_90,
    Vector3Notifier: Hilo3d_91,
    Vector4: Hilo3d_92,
    SphericalHarmonics3: Hilo3d_93
  });

  /**
   * @File   : Hilo3d.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 2018/9/29 下午1:26:08
   * @Description:
   */

  /**
   * @hidden
   */
  var math = Hilo3d$2.math;
  var clamp = math.clamp;
  var DEG2RAD = math.DEG2RAD;
  var degToRad = math.degToRad;
  var isPowerOfTwo = math.isPowerOfTwo;
  var nearestPowerOfTwo = math.nearestPowerOfTwo;
  var nextPowerOfTwo = math.nextPowerOfTwo;
  var RAD2DEG = math.RAD2DEG;
  var radToDeg = math.radToDeg;
  /**
   * 判断一个实例是否为`Vector2`。
   */
  function isVector2(value) {
      return value.isVector2;
  }
  /**
   * 判断一个实例是否为`Vector3`。
   */
  function isVector3(value) {
      return value.isVector3;
  }
  /**
   * 判断一个实例是否为`Vector4`。
   */
  function isVector4(value) {
      return value.isVector4;
  }
  /**
   * 判断一个实例是否为`Matrix3`。
   */
  function isMatrix3(value) {
      return value.isMatrix3;
  }
  /**
   * 判断一个实例是否为`Matrix4`。
   */
  function isMatrix4(value) {
      return value.isMatrix4;
  }
  /**
   * 判断一个实例是否为`Quaternion`。
   */
  function isQuaternion(value) {
      return value.isQuaternion;
  }
  /**
   * 判断一个实例是否为`Color`。
   */
  function isColor(value) {
      return value.isColor;
  }
  /**
   * 判断一个实例是否为`Euler`。
   */
  function isEuler(value) {
      return value.isEuler;
  }
  /**
   * 判断一个实例是否为`SphericalHarmonics3`。
   */
  function isSphericalHarmonics3(value) {
      return value.isSphericalHarmonics3;
  }
  var Vector2 = /** @class */ (function (_super) {
      __extends(Vector2, _super);
      function Vector2() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Vector2;
  }(Hilo3d$2.Vector2));
  var Vector3 = /** @class */ (function (_super) {
      __extends(Vector3, _super);
      function Vector3() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Vector3;
  }(Hilo3d$2.Vector3));
  var Vector4 = /** @class */ (function (_super) {
      __extends(Vector4, _super);
      function Vector4() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Vector4;
  }(Hilo3d$2.Vector4));
  var Matrix3 = /** @class */ (function (_super) {
      __extends(Matrix3, _super);
      function Matrix3() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Matrix3;
  }(Hilo3d$2.Matrix3));
  var Matrix4 = /** @class */ (function (_super) {
      __extends(Matrix4, _super);
      function Matrix4() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Matrix4;
  }(Hilo3d$2.Matrix4));
  var Quaternion = /** @class */ (function (_super) {
      __extends(Quaternion, _super);
      function Quaternion() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Quaternion;
  }(Hilo3d$2.Quaternion));
  var Color = /** @class */ (function (_super) {
      __extends(Color, _super);
      function Color() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Color;
  }(Hilo3d$2.Color));
  var Euler = /** @class */ (function (_super) {
      __extends(Euler, _super);
      function Euler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Euler;
  }(Hilo3d$2.Euler));
  var SphericalHarmonics3 = /** @class */ (function (_super) {
      __extends(SphericalHarmonics3, _super);
      function SphericalHarmonics3() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return SphericalHarmonics3;
  }(Hilo3d$2.SphericalHarmonics3));
  /**
   * 判断一个实例是否为`Spherical`。
   */
  function isSpherical(value) {
      return value.isSpherical;
  }
  /**
   * 球面坐标系。
   */
  var Spherical = /** @class */ (function () {
      function Spherical(radius, phi, theta) {
          this.isSpherical = true;
          /**
           * 球面球心。
           */
          this.center = new Vector3();
          this.radius = radius || 0;
          this.phi = phi || 0;
          this.theta = theta || 0;
      }
      Spherical.prototype.set = function (radius, phi, theta) {
          this.radius = radius;
          this.phi = phi;
          this.theta = theta;
          return this;
      };
      Spherical.prototype.clone = function () {
          return new Spherical().copy(this);
      };
      Spherical.prototype.copy = function (other) {
          this.radius = other.radius;
          this.phi = other.phi;
          this.theta = other.theta;
          return this;
      };
      /**
       * restrict phi to be between EPS and PI-EPS。
       */
      Spherical.prototype.makeSafe = function () {
          var EPS = Spherical.EPS;
          this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));
          return this;
      };
      /**
       * 从笛卡尔坐标系的Vector3转换。
       */
      Spherical.prototype.setFromVector3 = function (vector) {
          return this.setFromCartesianCoords(vector.x, vector.y, vector.z);
      };
      /**
       * 从笛卡尔坐标系的x、y、z转换。
       */
      Spherical.prototype.setFromCartesianCoords = function (x, y, z) {
          this.radius = Math.sqrt(x * x + y * y + z * z);
          if (this.radius === 0) {
              this.theta = 0;
              this.phi = 0;
          }
          else {
              this.theta = Math.atan2(x, z);
              this.phi = Math.acos(clamp(y / this.radius, -1, 1));
          }
          return this;
      };
      /**
       * 转换到笛卡尔坐标系的Vector3。
       */
      Spherical.prototype.toVector3 = function (vector) {
          vector = vector || new Vector3();
          var _a = this, radius = _a.radius, phi = _a.phi, theta = _a.theta, center = _a.center;
          vector.x = radius * Math.sin(phi) * Math.sin(theta) + center.x;
          vector.y = radius * Math.cos(phi) + center.y;
          vector.z = radius * Math.sin(phi) * Math.cos(theta) + center.z;
          return vector;
      };
      Spherical.EPS = 0.000001;
      return Spherical;
  }());

  var Tween = /** @class */ (function (_super) {
      __extends(Tween, _super);
      function Tween() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Tween;
  }(Hilo3d$2.Tween));

  /**
   * 判断一个实例是否为`Level`。
   */
  function isLevel(value) {
      return value.isLevel;
  }
  /**
   * 关卡类，单个关卡的逻辑容器，挂载在`World`下，也是存储`SceneActor`的实际容器，通常使用`getLevel`获取。
   * 一般来讲，我们不建议直接使用`Level`中的一些方法，而是使用`World`进行代理，更符合直觉。
   * 它的实际游戏逻辑由[LevelScriptActor](../levelscriptactor)描述。
   *
   * @template IState Level的状态Actor类型，用于存储当前关卡的状态数据。
   * @noInheritDoc
   */
  var Level = /** @class */ (function (_super) {
      __extends(Level, _super);
      /**
       * 创建Level，不要自己创建！
       *
       * @hidden
       */
      function Level(name, LevelScript, world) {
          var _this = _super.call(this, name) || this;
          _this.isLevel = true;
          /**
           * 开放世界游戏，end用于无缝自动切换关卡，先占位，待完成
           */
          _this.bound = {
              start: new Vector3(0, 0, 0),
              end: null
          };
          _this._world = null;
          _this._actors = new SArray();
          _this._actorsForUpdate = new SArray();
          _this._actorsNeedUpdate = false;
          _this._script = null;
          _this._updatable = false;
          _this.handleLoading = function (params) {
              try {
                  _this._script.onLoading(params);
              }
              catch (error) {
                  throwException(error, _this._script);
              }
              _this.game.event.trigger('LevelIsPreloading', { level: _this, state: params });
          };
          _this.handleLoadError = function (_a) {
              var error = _a.error, state = _a.state;
              throwException(error, _this._script, state);
          };
          _this.handleLoadDone = function () {
              _this.game.resource.onLoading.remove(_this.handleLoading);
              _this.game.resource.onError.remove(_this.handleLoadError);
              _this.game.event.trigger('LevelDidPreload', { level: _this });
              try {
                  _this._script.onCreate();
              }
              catch (error) {
                  throwException(error, _this._script);
              }
              _this._state.updateOnEverTick = true;
              _this._script.updateOnEverTick = true;
              _this.game.event.trigger('LevelDidCreateActors', { level: _this });
          };
          _this._world = world;
          _this._ScriptClass = LevelScript;
          return _this;
      }
      Object.defineProperty(Level.prototype, "state", {
          /**
           * Level状态Actor实例引用。
           */
          get: function () {
              return this._state;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Level.prototype, "game", {
          /**
           * 当前`Game`实例引用。一般不直接使用，而是用`actor.getGame()`或`component.getGame`，提供更好的泛型类型推断。
           */
          get: function () {
              return this._world.game;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Level.prototype, "world", {
          /**
           * 当前`World`实例引用。一般不直接使用，而是用`actor.getWorld()`或`component.getWorld`，提供更好的泛型类型推断。
           */
          get: function () {
              return this._world;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Level.prototype, "parent", {
          /**
           * Level的父级World实例引用。
           */
          get: function () {
              return this._world;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Level.prototype, "actors", {
          /**
           * 当前所有的actors，建议使用`world.actors`获取。
           */
          get: function () {
              return this._actors;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 生命周期，用于错误边界处理。将在Game中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
       * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
       * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
       */
      Level.prototype.onError = function (error, details) {
          return this._script.onError(error, details);
      };
      /**
       * 用于继承上个挂卡的actors，**不要自己调用！！**
       *
       * @hidden
       */
      Level.prototype.inherit = function (inheritActors) {
          var _this = this;
          this._actors.merge(inheritActors);
          inheritActors.forEach(function (actor) {
              if (isLevel(actor.parent)) {
                  actor._parent = _this;
              }
          });
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Level.prototype.init = function (initState) {
          return __awaiter(this, void 0, void 0, function () {
              var error_1;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          this._script = this.game.addActor(this.name + "-level-script", this._ScriptClass);
                          this._script.updateOnEverTick = false;
                          this._state = this.game.addActor('level-state', this._ScriptClass.LevelStateClass);
                          this._state.copy(initState);
                          this._state.updateOnEverTick = false;
                          this._script._parent = this;
                          this._state.copy(initState);
                          _a.label = 1;
                      case 1:
                          _a.trys.push([1, 3, , 4]);
                          return [4 /*yield*/, this._script.onLogin()];
                      case 2:
                          _a.sent();
                          return [3 /*break*/, 4];
                      case 3:
                          error_1 = _a.sent();
                          throwException(error_1, this._script);
                          return [3 /*break*/, 4];
                      case 4:
                          this._updatable = true;
                          this.game.event.trigger('LevelDidInit', { level: this });
                          return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Level.prototype.startLoading = function () {
          this.game.event.trigger('LevelWillPreload', { level: this });
          try {
              this._script.onPreload();
          }
          catch (error) {
              throwException(error, this._script);
          }
          if (this.game.resource.loadDone) {
              this.handleLoadDone();
              return;
          }
          this.game.resource.onLoading.add(this.handleLoading);
          this.game.resource.onError.add(this.handleLoadError);
          this.game.resource.onLoaded.addOnce(this.handleLoadDone);
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Level.prototype.update = function (delta) {
          if (!this._updatable) {
              return;
          }
          if (this._actorsNeedUpdate) {
              this._actorsForUpdate.copy(this._actors);
              this._actorsNeedUpdate = false;
          }
          this._actorsForUpdate.forEach(function (actor) { return actor.update(delta); });
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Level.prototype.destroy = function (forceClear) {
          if (forceClear === void 0) { forceClear = false; }
          _super.prototype.destroy.call(this);
          this.game.event.trigger('LevelWillDestroy', { level: this });
          /**
           * 销毁时同时取消所有资源加载逻辑。
           */
          this.game.resource.onLoading.remove(this.handleLoading);
          this.game.resource.onError.remove(this.handleLoadError);
          this.game.resource.onLoaded.remove(this.handleLoadDone);
          /**
           * 取消所有Tween动画。
           */
          Tween.removeAll();
          var inheritActors = new SArray();
          if (!forceClear) {
              this._actorsForUpdate.forEach(function (actor) {
                  if (actor.persistent) {
                      inheritActors.add(actor);
                  }
                  else {
                      actor.destroy();
                  }
              });
          }
          else {
              this._actorsForUpdate.forEach(function (actor) {
                  actor.destroy();
              });
          }
          // parent is not right, do not use removeFromParent
          this.game.removeActor(this._script);
          this.game.removeActor(this._state);
          return inheritActors;
      };
      /**
       * 通过指定的Actor类`ActorClass`和初始化参数`initOptions`，向Level中添加一个`SceneActor`。
       * 一般使用`world.addActor`进行代理。
       */
      Level.prototype.addActor = function (name, ActorClass, initOptions, parent) {
          var actor = new ActorClass(name, this.game, initOptions);
          if (this.game.devMode) {
              try {
                  actor.verifyAdding(initOptions);
              }
              catch (error) {
                  throwException(error, actor);
                  return;
              }
          }
          actor.initialized();
          this._actors.add(actor);
          if (!parent) {
              actor._parent = this;
          }
          else {
              parent.addChild(actor);
          }
          actor.added();
          this._actorsNeedUpdate = true;
          return actor;
      };
      /**
       * 从Level中移除一个SceneActor。
       * 一般使用`world.removeActor`进行代理。
       */
      Level.prototype.removeActor = function (actor) {
          // debugger;
          actor.destroy();
          actor._parent = null;
          this._actors.remove(actor);
          this._actorsNeedUpdate = true;
          return this;
      };
      Level = __decorate([
          SClass({ className: 'Level', classType: 'Level' })
      ], Level);
      return Level;
  }(SObject));

  function isSceneActor(value) {
      return value.isSceneActor;
  }

  /**
   * @File   : Layers.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 1/28/2019, 7:58:47 PM
   * @Description:
   */
  /**
   * 图层类。用于在开启`World`的图层功能时，快速切换可视对象。
   * 图层是根据一个32通道的mask设定的，你可以通过这个类的一些方法开启或关闭某个或某些通道。
   * 图层可以给每个`Actor`设定，其中包含当前主相机的`Actor`负责测试所有实例是否可见。
   *
   * 实例请见[Layers](../../example/render/layers)。
   */
  var Layers = /** @class */ (function () {
      function Layers() {
          this._mask = 0xffffffff;
      }
      /**
       * 强制设置为某些通道。
       */
      Layers.prototype.set = function (channel) {
          this._mask = 1 << channel | 0;
      };
      /**
       * 切换某些通道。
       */
      Layers.prototype.toggle = function (channel) {
          this._mask ^= (1 << channel | 0);
      };
      /**
       * 开启某些通道。
       */
      Layers.prototype.enable = function (channel) {
          this._mask |= (1 << channel | 0);
      };
      /**
       * 关闭某些通道。
       */
      Layers.prototype.disable = function (channel) {
          this._mask &= ~(1 << channel | 0);
      };
      /**
       * 通道复位。
       */
      Layers.prototype.reset = function () {
          this._mask = 0xffffffff;
      };
      /**
       * 和另一个图层进行测试。
       */
      Layers.prototype.test = function (layers) {
          return (this._mask & layers._mask) !== 0;
      };
      return Layers;
  }());

  /**
   * @hidden
   */
  var tmpVec3 = new Vector3();
  /**
   * 判断一个实例是否为`SceneComponent`。
   */
  function isSceneComponent(value) {
      return value.isSceneComponent;
  }
  /**
   * 场景Component类，作为`SceneActor`的根组件，即为实际拥有3D变换功能的一类特殊Component。
   * 你可以直接使用它，也可以使用继承自它的那些类（比如`PrimitiveComponent`，图元组件，用于承载模型数据）。
   * SceneComponent实例可以以树状结构嵌套，但处于性能考虑，原则上一旦生成就不建议再去动态插拔子级实例。
   *
   * @template IStateTypes 初始化参数类型，必须继承自[ISceneComponentState](../interfaces/iscenecomponentstate)。
   * @noInheritDoc
   */
  var SceneComponent = /** @class */ (function (_super) {
      __extends(SceneComponent, _super);
      function SceneComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isSceneComponent = true;
          /**
           * 是否需要在销毁时释放Gl资源，如果确定以后还会使用相同的材质、几何体等，可以设为`false`，性能优化。
           * 对于GlTF模型实例化的资源默认会设为`false`，而在资源释放时统一释放Gl资源。
           *
           * @default true
           */
          _this.needReleaseGlRes = true;
          /**
           * 图层属性，详见[Layers](../layers)。
           */
          _this.layers = new Layers();
          _this._children = new SArray();
          _this._tmpQuat = new Quaternion();
          return _this;
      }
      Object.defineProperty(SceneComponent.prototype, "parent", {
          /**
           * 获取自身的父级实例，根据情况不同可能有不同的类型，一般不需要自己使用。
           */
          get: function () {
              return this._parent || this._owner;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "children", {
          /**
           * 获取自身的所有子级SceneComponent，一般不需要自己使用。
           */
          get: function () {
              return this._children;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "hiloNode", {
          /**
           * 底层hilo3d的节点，内部随时可能变更实现，**不要自己使用**。
           *
           * @hidden
           */
          get: function () {
              return this._node;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "visible", {
          /**
           * 获取该组件在世界中是否可见。
           */
          get: function () {
              return this._node.visible;
          },
          /**
           * 设置该组件在世界中是否可见。
           */
          set: function (value) {
              this._node.visible = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "isStatic", {
          /**
           * 获取是否为静态对象，若是，则从此层开始的所有子级实例都不会在每一帧更新`WorldMatrix`。
           * 用于性能优化。
           */
          get: function () {
              return !this._node.autoUpdateWorldMatrix;
          },
          /**
           * 设置是否为静态对象，若是，则从此层开始的所有子级实例都不会在每一帧更新`WorldMatrix`。
           * 用于性能优化。
           */
          set: function (value) {
              this._node.autoUpdateWorldMatrix = !value;
              this._node.autoUpdateChildWorldMatrix = !value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "position", {
          /**
           * 获取本地空间位置数据。
           */
          get: function () {
              return this._node.position;
          },
          /**
           * 设置本地空间位置数据。
           */
          set: function (position) {
              this._node.position.copy(position);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "rotation", {
          /**
           * 获取本地空间旋转数据。
           */
          get: function () {
              return this._node.rotation;
          },
          /**
           * 设置本地空间旋转数据。
           */
          set: function (rotation) {
              this._node.rotation.copy(rotation);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "scale", {
          /**
           * 获取本地空间缩放数据。
           */
          get: function () {
              return this._node.scale;
          },
          /**
           * 设置本地空间缩放数据。
           */
          set: function (scale) {
              this._node.scale.copy(scale);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "pivot", {
          /**
           * 获取本地空间锚点数据。
           */
          get: function () {
              return this._node.pivot;
          },
          /**
           * 设置本地空间锚点数据。
           */
          set: function (pivot) {
              this._node.pivot.copy(pivot);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "quaternion", {
          /**
           * 获取本地空间四元数数据。
           */
          get: function () {
              return this._node.quaternion;
          },
          /**
           * 设置本地空间四元数数据。
           */
          set: function (quaternion) {
              this._node.quaternion.copy(quaternion);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "matrix", {
          /**
           * 获取本地矩阵数据。
           */
          get: function () {
              return this._node.matrix;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "x", {
          get: function () {
              return this.position.x;
          },
          set: function (value) {
              this.position.x = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "y", {
          get: function () {
              return this.position.y;
          },
          set: function (value) {
              this.position.y = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "z", {
          get: function () {
              return this.position.z;
          },
          set: function (value) {
              this.position.z = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "rotationX", {
          get: function () {
              return this.rotation.x;
          },
          set: function (value) {
              this.rotation.x = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "rotationY", {
          get: function () {
              return this.rotation.y;
          },
          set: function (value) {
              this.rotation.y = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "rotationZ", {
          get: function () {
              return this.rotation.z;
          },
          set: function (value) {
              this.rotation.z = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "scaleX", {
          get: function () {
              return this.scale.x;
          },
          set: function (value) {
              this.scale.x = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "scaleY", {
          get: function () {
              return this.scale.y;
          },
          set: function (value) {
              this.scale.y = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "scaleZ", {
          get: function () {
              return this.scale.z;
          },
          set: function (value) {
              this.scale.z = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "pivotX", {
          get: function () {
              return this.pivot.x;
          },
          set: function (value) {
              this.pivot.x = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "pivotY", {
          get: function () {
              return this.pivot.y;
          },
          set: function (value) {
              this.pivot.y = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "pivotZ", {
          get: function () {
              return this.pivot.z;
          },
          set: function (value) {
              this.pivot.z = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "worldMatrix", {
          /**
           * 直接获取世界矩阵的数据。
           */
          get: function () {
              return this._node.worldMatrix;
          },
          /**
           * 直接设置世界矩阵的数据。
           */
          set: function (matrix) {
              this._node.worldMatrix.copy(matrix);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "absolutePosition", {
          /**
           * 直接获取组件在世界空间的位置数据。
           */
          get: function () {
              return this._node.worldMatrix.getTranslation();
          },
          /**
           * 直接设置组件在世界空间的位置数据。
           *
           * **注意此设置会涉及矩阵的clone和乘法，有一些性能开销，**
           */
          set: function (value) {
              var parent = this._node.parent;
              if (parent) {
                  var invertParentWorldMatrix = parent.worldMatrix.clone();
                  invertParentWorldMatrix.invert();
                  this.position = value.transformMat4(invertParentWorldMatrix);
              }
              else {
                  this.position = value;
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "absoluteRotation", {
          /**
           * 直接获取组件在世界空间的旋转数据。
           *
           * **注意此值从世界矩阵实时计算而来，有一些性能消耗。**
           */
          get: function () {
              var quat = new Quaternion();
              return this._node.worldMatrix.getRotation(quat);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "ndcPosition", {
          /**
           * 直接获取组件在**当前摄像机**下标准设备空间的位置数据。
           *
           * **注意此值从世界矩阵和视图矩阵实时计算而来，有一些性能消耗。**
           */
          get: function () {
              var mainCamera = this.getWorld().mainCamera;
              if (!mainCamera) {
                  return null;
              }
              return this.absolutePosition.transformMat4(mainCamera.viewProjectionMatrix);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "forwardVector", {
          /**
           * 直接获取组件在本地空间的forward向量。
           */
          get: function () {
              return new Vector3(0, 0, 1).transformQuat(this.quaternion);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "upVector", {
          /**
           * 直接获取组件在本地空间的up向量。
           */
          get: function () {
              return new Vector3(0, 1, 0).transformQuat(this.quaternion);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "rightVector", {
          /**
           * 直接获取组件在本地空间的right向量。
           */
          get: function () {
              return new Vector3(1, 0, 0).transformQuat(this.quaternion);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "worldForwardVector", {
          /**
           * 直接获取组件在世界空间的forward向量。
           *
           * **注意会先获取`absoluteRotation`，有一定开销！**
           */
          get: function () {
              return new Vector3(0, 0, 1).transformQuat(this.absoluteRotation);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "worldUpVector", {
          /**
           * 直接获取组件在世界空间的up向量。
           *
           * **注意会先获取`absoluteRotation`，有一定开销！**
           */
          get: function () {
              return new Vector3(0, 1, 0).transformQuat(this.absoluteRotation);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "worldRightVector", {
          /**
           * 直接获取组件在世界空间的right向量。
           *
           * **注意会先获取`absoluteRotation`，有一定开销！**
           */
          get: function () {
              return new Vector3(1, 0, 0).transformQuat(this.absoluteRotation);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneComponent.prototype, "up", {
          /**
           * 直接获取组件的UP向量。
           *
           * **注意这是一个可修改的值，如果没有特殊需求以防万一请用`upVector`！**
           */
          get: function () {
              return this._node.up;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 直接获取组件在**指定摄像机**下标准设备空间的位置数据。
       *
       * **注意此值从世界矩阵和视图矩阵实时计算而来，有一些性能消耗。**
       */
      SceneComponent.prototype.getNdcPosition = function (camera) {
          return this.absolutePosition.transformMat4(camera.viewProjectionMatrix);
      };
      /**
       * 初始化，继承请先`super.onInit()`。
       */
      SceneComponent.prototype.onInit = function (initState) {
          this._node = new Hilo3d$2.Node();
          if (!initState) {
              return;
          }
          var initTransform = initState;
          if (initTransform.position) {
              this._node.position.copy(initTransform.position);
              delete initTransform['position'];
          }
          if (initTransform.rotation) {
              this._node.rotation.copy(initTransform.rotation);
              delete initTransform['rotation'];
          }
          if (initTransform.pivot) {
              this._node.pivot.copy(initTransform.pivot);
              delete initTransform['pivot'];
          }
          if (initTransform.quaternion) {
              this._node.quaternion.copy(initTransform.quaternion);
              delete initTransform['quaternion'];
          }
          if (initTransform.matrix) {
              this._node.matrix.copy(initTransform.matrix);
              delete initTransform['matrix'];
          }
          if (initTransform.visible !== undefined) {
              this._node.visible = initTransform.visible;
          }
      };
      /**
       * 销毁，继承请先`super.onDestroy()`。
       */
      SceneComponent.prototype.onDestroy = function () {
          if (this.needReleaseGlRes) {
              this._node.destroy(this.getGame().renderer, true);
          }
          else {
              this._node.removeFromParent();
          }
      };
      /**
       * 获取组件的的包围盒(AABB)信息。
       * @param bounds 当前计算的包围盒信息，可用于节省开销
       * @param currentMatrix 当前计算的矩阵，可用于节省开销
       */
      SceneComponent.prototype.getBounds = function (bounds, currentMatrix) {
          return this._node.getBounds(null, currentMatrix, bounds);
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      SceneComponent.prototype.addChild = function (component) {
          this._children.add(component);
          component._parent = this;
          component._node.addTo(this._node);
          return this;
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      SceneComponent.prototype.removeChild = function (component) {
          var index = this._children.indexOf(component);
          if (index < 0) {
              return;
          }
          component._parent = null;
          this._children.remove(index);
          return this;
      };
      /**
       * 设置本地空间位置数据。
       */
      SceneComponent.prototype.setPosition = function (x, y, z) {
          this._node.setPosition(x, y, z);
          return this;
      };
      /**
       * 设置本地空间旋转数据。
       */
      SceneComponent.prototype.setRotation = function (x, y, z) {
          this._node.setRotation(x, y, z);
          return this;
      };
      /**
       * 设置本地空间位移数据。
       */
      SceneComponent.prototype.setScale = function (x, y, z) {
          this._node.setScale(x, y, z);
          return this;
      };
      /**
       * 设置本地空间锚点数据。
       */
      SceneComponent.prototype.setPivot = function (x, y, z) {
          this._node.setPivot(x, y, z);
          return this;
      };
      /**
       * 设置本地空间四元数数据。
       */
      SceneComponent.prototype.setQuaternion = function (x, y, z, w) {
          this._node.quaternion.x = x;
          this._node.quaternion.y = y;
          this._node.quaternion.z = z;
          this._node.quaternion.w = w;
          return this;
      };
      /**
       * 设置世界空间位置数据。
       */
      SceneComponent.prototype.setAbsolutePosition = function (x, y, z) {
          this.absolutePosition = new Vector3(x, y, z);
          return this;
      };
      /**
       * 沿着某个轴`axis`平移`distance`距离。
       */
      SceneComponent.prototype.translate = function (axis, distance) {
          tmpVec3.copy(axis).scale(distance);
          this.position.add(tmpVec3);
          // this.absolutePosition = this.absolutePosition.add(tmpVec3);
          return this;
      };
      /**
       * 绕着某个轴`axis`旋转`rad`弧度。
       */
      SceneComponent.prototype.rotate = function (axis, rad) {
          this._tmpQuat.setAxisAngle(axis, rad);
          this.quaternion.multiply(this._tmpQuat);
          return this;
      };
      /**
       * 更新当前实例以及子级组件的世界矩阵。
       */
      SceneComponent.prototype.updateMatrixWorld = function (force) {
          var node = this._node;
          while (node) {
              if (node.parent && node.parent.isStage) {
                  node.updateMatrixWorld(force);
                  break;
              }
              node = node.parent;
          }
          return this;
      };
      /**
       * 将自己从父级移除，基本等同于`destroy`方法，从Owner中销毁自身，同时递归移除所有子级组件。
       * 若父级也为`SceneComponent`，则会将自身从父级`children`中移除。
       */
      SceneComponent.prototype.removeFromParent = function () {
          if (!isSceneActor(this._parent)) {
              this._parent.removeChild(this);
          }
          this._owner.removeComponent(this);
          return this;
      };
      /**
       * 修改自身的朝向。
       */
      SceneComponent.prototype.lookAt = function (target) {
          if (isVector3(target)) {
              this._node.lookAt(target);
              return this;
          }
          if (isSceneActor(target)) {
              this._node.lookAt(target.transform.absolutePosition);
              return this;
          }
          this._node.lookAt(target.absolutePosition);
          return this;
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      SceneComponent.prototype.cloneFromHiloNode = function (node) {
          this._node.gltfExtensions = node.gltfExtensions;
          this._node.jointName = node.jointName;
          this._node.animationId = node.animationId;
          this._node.setPosition(node.x, node.y, node.z);
          this._node.setScale(node.scaleX, node.scaleY, node.scaleZ);
          this._node.setRotation(node.rotationX, node.rotationY, node.rotationZ);
          // if (node.anim) {
          //   this._node.anim = node.anim.clone(this._node);
          //   const animator = this._owner.animator;
          //   if (animator) {
          //     animator.clear();
          //     animator.initFromComponent();
          //   } else {
          //     this._owner.addComponent('animator', AnimatorComponent, {componentName: this.name.value});
          //   }
          //   this._node.resetSkinedMeshRootNode();
          // }
      };
      SceneComponent = __decorate([
          SClass({ className: 'SceneComponent' })
      ], SceneComponent);
      return SceneComponent;
  }(Component));

  /**
   * 判断一个实例是否为`CameraComponent`。
   */
  function isCameraComponent(value) {
      return value.isCameraComponent;
  }
  /**
   * 判断一个实例是否为`CameraActor`。
   */
  function isCameraActor(value) {
      return isSceneActor(value) && isCameraComponent(value.root);
  }
  /**
   * 摄像机Component基类，承担着场景摄像机的实际功能。
   * 一般不直接使用，而是使用各个派生类。
   *
   * @noInheritDoc
   */
  var CameraComponent = /** @class */ (function (_super) {
      __extends(CameraComponent, _super);
      function CameraComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isCameraComponent = true;
          _this._isMainCamera = false;
          _this._rendererAlive = false;
          return _this;
      }
      Object.defineProperty(CameraComponent.prototype, "isMainCamera", {
          /**
           * 是否为当前World的主摄像机。
           */
          get: function () {
              return this._isMainCamera;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CameraComponent.prototype, "viewMatrix", {
          /**
           * 视图矩阵。
           */
          get: function () {
              return this._camera.viewMatrix;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CameraComponent.prototype, "projectionMatrix", {
          /**
           * 投影矩阵。
           */
          get: function () {
              return this._camera.projectionMatrix;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CameraComponent.prototype, "viewProjectionMatrix", {
          /**
           * 视图投影矩阵。
           */
          get: function () {
              return this._camera.viewProjectionMatrix;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CameraComponent.prototype, "rendererAlive", {
          /**
           * 渲染器是否在正常活动。
           */
          get: function () {
              return this._rendererAlive;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 初始化，继承请先`super.onInit()`。
       */
      CameraComponent.prototype.onInit = function (initState) {
          _super.prototype.onInit.call(this, initState);
          this._camera = this.onCreateCamera(initState);
          this._camera.__forceUseParentWorldMatrix = true;
          this._node.addChild(this._camera);
          this._node._rotation.order = 'XYZ';
          this._node.isCamera = true;
      };
      CameraComponent.prototype.onCreateCamera = function (initState) {
          return null;
      };
      /**
       * 特殊生命周期，当摄像机被作为World的主摄像机时被触发。
       */
      CameraComponent.prototype.onAsMainCamera = function (isMain) {
          var game = this.getGame();
          if (isMain) {
              game.hiloStage.camera = this._camera;
              this._isMainCamera = true;
          }
          else if (this._isMainCamera) {
              game.hiloStage.camera = null;
              this._isMainCamera = false;
          }
      };
      /**
       * 加入World，继承请先`super.onAdd()`。
       */
      CameraComponent.prototype.onAdd = function () {
          if (!this.getWorld().mainCamera) {
              this.getWorld().setMainCamera(this);
          }
      };
      /**
       * 每一帧更新，继承请先`super.onUpdate()`。
       */
      CameraComponent.prototype.onUpdate = function () {
          this._rendererAlive = false;
      };
      /**
       * 销毁，继承请先`super.onDestroy()`。
       */
      CameraComponent.prototype.onDestroy = function () {
          this.onAsMainCamera(false);
          if (this.getWorld().mainCamera === this) {
              this.getWorld().removeMainCamera();
          }
          _super.prototype.onDestroy.call(this);
      };
      /**
       * 计算向量`vector`从世界空间被该相机投影到二维画布上的位置。
       * 若不传容器的`width`和`height`，则返回`0 ~ 1`的值。
       */
      CameraComponent.prototype.projectVector = function (vector, width, height) {
          return this._camera.projectVector(vector, width, height);
      };
      /**
       * 计算向量`vector`从屏幕空间反变换到世界空间后的位置。
       * 若不传容器的`width`和`height`，则认为`vector`是NDC的坐标。
       */
      CameraComponent.prototype.unprojectVector = function (vector, width, height) {
          return this._camera.unprojectVector(vector, width, height);
      };
      /**
       * 更新视图投影矩阵
       */
      CameraComponent.prototype.updateViewProjectionMatrix = function () {
          this._camera.updateProjectionMatrix();
      };
      /**
       * 根据容器上的一个点`(x, y)`以及容器的宽度`width`和高度`height`，还有射线长度`rayLength`生成世界空间的一条射线。
       * 射线起点和终点将会被存储到传入的`outFrom`和`outTo`中。
       */
      CameraComponent.prototype.generateRay = function (x, y, width, height, outFrom, outTo, rayLength) {
          if (rayLength === void 0) { rayLength = 100; }
          throw new Error('Not implements');
      };
      /**
       * 渲染当前摄像机对应的画面。如果没有特殊需求（比如后处理、镜面等）不需要自己调用。
       *
       * @param frameBuffer 如果指定，则将会渲染到这个FrameBuffer，不会输出到屏幕上。
       * @param fireEvent 开发者无需关心，**不要自己使用！**。
       */
      CameraComponent.prototype.render = function (frameBuffer, fireEvent) {
          var _this = this;
          if (fireEvent === void 0) { fireEvent = false; }
          var game = this.getGame();
          var world = this.getWorld();
          var renderer = game.renderer;
          if (this._isMainCamera && fireEvent) {
              game.event.trigger('MainRendererWillStart');
          }
          if (!this._isMainCamera) {
              game.hiloStage.camera = this._camera;
          }
          if (world.enableLayers) {
              world.actors.forEach(function (actor) {
                  actor.visible = _this.layers.test(actor.layers);
              });
          }
          try {
              if (frameBuffer) {
                  frameBuffer.bind();
                  renderer.render(game.hiloStage, this._camera, false);
                  frameBuffer.unbind();
              }
              else {
                  renderer.render(game.hiloStage, this._camera, fireEvent);
              }
              this._rendererAlive = true;
          }
          catch (error) {
              throwException(error, this);
              this._rendererAlive = false;
          }
          if (!this._isMainCamera) {
              game.hiloStage.camera = world.mainCamera._camera;
          }
          if (this._isMainCamera && fireEvent) {
              game.event.trigger('MainRendererIsFinished');
          }
      };
      CameraComponent = __decorate([
          SClass({ className: 'CameraComponent' })
      ], CameraComponent);
      return CameraComponent;
  }(SceneComponent));

  /**
   * 判断一个实例是否为`UnmetRequireException`。
   */
  function isUnmetRequireException(value) {
      return value.isUnmetRequireException;
  }
  /**
   * 前置功能缺失异常。
   *
   * @noInheritDoc
   */
  var UnmetRequireException = /** @class */ (function (_super) {
      __extends(UnmetRequireException, _super);
      /**
       * 构建异常。
       *
       * @param object 触发异常的实例。
       * @param message 追加信息。
       */
      function UnmetRequireException(object, message) {
          if (message === void 0) { message = ''; }
          var _this = _super.call(this, 'UnmetRequire', object, message) || this;
          _this.isUnmetRequireException = true;
          return _this;
      }
      return UnmetRequireException;
  }(BaseException));

  /**
   * 判断一个实例是否为`PerspectiveCameraComponent`。
   */
  function isPerspectiveCameraComponent(value) {
      return value.isPerspectiveCameraComponent;
  }
  /**
   * 判断一个实例是否为`PerspectiveCameraActor`。
   */
  function isPerspectiveCameraActor(value) {
      return isSceneActor(value) && isPerspectiveCameraComponent(value.root);
  }
  /**
   * 透视摄像机组件。
   *
   * @noInheritDoc
   */
  var PerspectiveCameraComponent = /** @class */ (function (_super) {
      __extends(PerspectiveCameraComponent, _super);
      function PerspectiveCameraComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isPerspectiveCameraComponent = true;
          return _this;
      }
      PerspectiveCameraComponent.prototype.onCreateCamera = function (initState) {
          return new Hilo3d$2.PerspectiveCamera(initState);
      };
      Object.defineProperty(PerspectiveCameraComponent.prototype, "near", {
          /**
           * 摄像机近裁剪面。
           */
          get: function () {
              return this._camera.near;
          },
          /**
           * 摄像机近裁剪面。
           */
          set: function (near) {
              this._camera.near = near;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(PerspectiveCameraComponent.prototype, "far", {
          /**
           * 摄像机远裁剪面。
           */
          get: function () {
              return this._camera.far;
          },
          /**
           * 摄像机远裁剪面。
           */
          set: function (far) {
              this._camera.far = far;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(PerspectiveCameraComponent.prototype, "fov", {
          /**
           * 摄像机俯仰角。
           */
          get: function () {
              return this._camera.fov;
          },
          /**
           * 摄像机俯仰角。
           */
          set: function (fov) {
              this._camera.fov = fov;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(PerspectiveCameraComponent.prototype, "aspect", {
          /**
           * 摄像机视场纵横比。
           */
          get: function () {
              return this._camera.aspect;
          },
          /**
           * 摄像机视场纵横比。
           */
          set: function (aspect) {
              this._camera.aspect = aspect;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 根据容器上的一个点`(x, y)`以及容器的宽度`width`和高度`height`，还有射线长度`rayLength`生成世界空间的一条射线。
       * 射线起点和终点将会被存储到传入的`outFrom`和`outTo`中。
       */
      PerspectiveCameraComponent.prototype.generateRay = function (x, y, width, height, outFrom, outTo, rayLength) {
          if (rayLength === void 0) { rayLength = 100; }
          this._node.worldMatrix.getTranslation(outFrom);
          outTo.set(x, y, 1);
          outTo.copy(this._camera.unprojectVector(outTo, width, height).subtract(outFrom)).normalize().scale(rayLength).add(outFrom);
          return this;
      };
      PerspectiveCameraComponent = __decorate([
          SClass({ className: 'PerspectiveCameraComponent' })
      ], PerspectiveCameraComponent);
      return PerspectiveCameraComponent;
  }(CameraComponent));

  /**
   * 判断一个实例是否为`OrthographicCameraComponent`。
   */
  function isOrthographicCameraComponent(value) {
      return value.isOrthographicCameraComponent;
  }
  /**
   * 判断一个实例是否为`OrthographicCameraActor`。
   */
  function isOrthographicCameraActor(value) {
      return isSceneActor(value) && isOrthographicCameraComponent(value.root);
  }
  /**
   * 正交摄像机组件。
   *
   * @noInheritDoc
   */
  var OrthographicCameraComponent = /** @class */ (function (_super) {
      __extends(OrthographicCameraComponent, _super);
      function OrthographicCameraComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isOrthographicCameraComponent = true;
          return _this;
      }
      OrthographicCameraComponent.prototype.onCreateCamera = function (initState) {
          return new Hilo3d$2.OrthographicCamera(initState);
      };
      Object.defineProperty(OrthographicCameraComponent.prototype, "near", {
          /**
           * 摄像机近裁剪面。
           */
          get: function () {
              return this._camera.near;
          },
          /**
           * 摄像机近裁剪面。
           */
          set: function (near) {
              this._camera.near = near;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(OrthographicCameraComponent.prototype, "far", {
          /**
           * 摄像机远裁剪面。
           */
          get: function () {
              return this._camera.far;
          },
          /**
           * 摄像机远裁剪面。
           */
          set: function (far) {
              this._camera.far = far;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(OrthographicCameraComponent.prototype, "left", {
          /**
           * 摄像机左裁剪面。
           */
          get: function () {
              return this._camera.left;
          },
          /**
           * 摄像机左裁剪面。
           */
          set: function (left) {
              this._camera.left = left;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(OrthographicCameraComponent.prototype, "right", {
          /**
           * 摄像机右裁剪面。
           */
          get: function () {
              return this._camera.right;
          },
          /**
           * 摄像机右裁剪面。
           */
          set: function (right) {
              this._camera.right = right;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(OrthographicCameraComponent.prototype, "top", {
          /**
           * 摄像机上裁剪面。
           */
          get: function () {
              return this._camera.top;
          },
          /**
           * 摄像机上裁剪面。
           */
          set: function (top) {
              this._camera.top = top;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(OrthographicCameraComponent.prototype, "bottom", {
          /**
           * 摄像机下裁剪面。
           */
          get: function () {
              return this._camera.bottom;
          },
          /**
           * 摄像机下裁剪面。
           */
          set: function (bottom) {
              this._camera.bottom = bottom;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 根据容器上的一个点`(x, y)`以及容器的宽度`width`和高度`height`，还有射线长度`rayLength`生成世界空间的一条射线。
       * 射线起点和终点将会被存储到传入的`outFrom`和`outTo`中。
       */
      OrthographicCameraComponent.prototype.generateRay = function (x, y, width, height, outFrom, outTo, rayLength) {
          if (rayLength === void 0) { rayLength = 100; }
          var camera = this._camera;
          outFrom.set(x, y, (camera.near + camera.far) / (camera.near - camera.far));
          outFrom.copy(this._camera.unprojectVector(outFrom, width, height));
          var forwardVector = this.forwardVector;
          outTo.copy(outFrom).add(forwardVector.scale(-rayLength));
          return this;
      };
      OrthographicCameraComponent = __decorate([
          SClass({ className: 'OrthographicCameraComponent' })
      ], OrthographicCameraComponent);
      return OrthographicCameraComponent;
  }(CameraComponent));

  /**
   * 判断一个实例是否为`World`。
   */
  function isWorld(value) {
      return value.isWorld;
  }
  /**
   * 世界类，单个世界的逻辑容器，挂载在`Game`下，通常使用`getWorld`获取。
   * 一般来讲，我们不建议直接使用`Level`中的一些方法，而是使用`World`进行代理，更符合直觉。
   * 它的实际游戏逻辑由[GameModeActor](../gamemodeactor)描述。
   *
   * @template IState World的状态Actor类型，用于存储当前世界的状态数据。
   * @noInheritDoc
   */
  var World = /** @class */ (function (_super) {
      __extends(World, _super);
      /**
       * 创建World，不要自己创建！
       *
       * @hidden
       */
      function World(name, GameMode, levels, game) {
          var _this = _super.call(this, name) || this;
          _this.isWorld = true;
          /**
           * 开启图层功能，若开启，可以通过给每个`Actor`指定`layers`，之后通过摄像机的`layers`来控制显示内容。
           * 详见示例**[Layers](../../example/renderer/layers)**。
           */
          _this.enableLayers = false;
          _this._game = null;
          _this._script = null;
          _this._level = null;
          _this._levels = {};
          _this._mainCamera = null;
          // use for splitting screen mode, waiting.....
          _this._mainCameras = [];
          _this._physicWorld = null;
          _this._updatable = false;
          _this._game = game;
          _this._levels = levels;
          _this._GameModeClass = GameMode;
          return _this;
      }
      Object.defineProperty(World, "UP", {
          /**
           * 世界的up单位向量。
           */
          get: function () {
              return new Vector3(0, 1, 0);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World, "DOWN", {
          /**
           * 世界的down单位向量。
           */
          get: function () {
              return new Vector3(0, -1, 0);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World, "RIGHT", {
          /**
           * 世界的right单位向量。
           */
          get: function () {
              return new Vector3(1, 0, 0);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World, "LEFT", {
          /**
           * 世界的left单位向量。
           */
          get: function () {
              return new Vector3(-1, 0, 0);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World, "FORWARD", {
          /**
           * 世界的forward单位向量。
           */
          get: function () {
              return new Vector3(0, 0, -1);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World, "BACK", {
          /**
           * 世界的back单位向量。
           */
          get: function () {
              return new Vector3(0, 0, 1);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "state", {
          /**
           * World状态Actor实例引用。
           */
          get: function () {
              return this._state;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "game", {
          /**
           * 当前`Game`实例引用。一般不直接使用，而是用`actor.getGame()`或`component.getGame`，提供更好的泛型类型推断。
           */
          get: function () {
              return this._game;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "level", {
          /**
           * 当前`Level`实例引用。一般不直接使用，而是用`actor.getLevel()`或`component.getLevel`，提供更好的泛型类型推断。
           */
          get: function () {
              return this._level;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "parent", {
          /**
           * Wolrd的父级Game实例引用。
           */
          get: function () {
              return this._game;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "actors", {
          /**
           * 当前Level所有的actors，建议从这里获取。
           */
          get: function () {
              return this._level.actors;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "mainCamera", {
          /**
           * 当前的摄像机组件实例引用。
           */
          get: function () {
              return this._mainCamera;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "physicWorld", {
          /**
           * 当前的物理世界实例引用，需要使用[enablePhysic](#enablephysic)开启后获取。
           */
          get: function () {
              return this._physicWorld;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "upVector", {
          /**
           * 当前世界的up单位向量。
           *
           * @deprecated
           */
          get: function () {
              return new Vector3(0, 1, 0);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "downVector", {
          /**
           * 当前世界的down单位向量。
           *
           * @deprecated
           */
          get: function () {
              return new Vector3(0, -1, 0);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "rightVector", {
          /**
           * 当前世界的right单位向量。
           *
           * @deprecated
           */
          get: function () {
              return new Vector3(1, 0, 0);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "leftVector", {
          /**
           * 当前世界的left单位向量。
           *
           * @deprecated
           */
          get: function () {
              return new Vector3(-1, 0, 0);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "forwardVector", {
          /**
           * 当前世界的forward单位向量。
           *
           * @deprecated
           */
          get: function () {
              return new Vector3(0, 0, -1);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(World.prototype, "backVector", {
          /**
           * 当前世界的back单位向量。
           *
           * @deprecated
           */
          get: function () {
              return new Vector3(0, 0, 1);
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 生命周期，用于错误边界处理。将在Game中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
       * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
       * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
       */
      World.prototype.onError = function (error, details) {
          return this._script.onError(error, details);
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      World.prototype.init = function (initState) {
          return __awaiter(this, void 0, void 0, function () {
              var error_1;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          this._script = this._game.addActor(this.name + "-game-mode", this._GameModeClass);
                          this._script.updateOnEverTick = false;
                          this._state = this._game.addActor('world-state', this._GameModeClass.WorldStateClass);
                          this._state.copy(initState);
                          this._state.updateOnEverTick = false;
                          this._script._parent = this;
                          this._state.copy(initState);
                          this._game.event.trigger('WorldDidInit', { world: this });
                          _a.label = 1;
                      case 1:
                          _a.trys.push([1, 3, , 4]);
                          return [4 /*yield*/, this._script.onLogin()];
                      case 2:
                          _a.sent();
                          return [3 /*break*/, 4];
                      case 3:
                          error_1 = _a.sent();
                          throwException(error_1, this._script);
                          return [3 /*break*/, 4];
                      case 4:
                          try {
                              this._script.onCreatePlayers();
                          }
                          catch (error) {
                              throwException(error, this._script);
                          }
                          this._game.event.trigger('WorldDidCreatePlayers', { world: this });
                          if (this._game.players.length < 1) {
                              throw new UnmetRequireException(this, 'You must give at least one player !');
                          }
                          this._script.updateOnEverTick = true;
                          this._state.updateOnEverTick = true;
                          this._updatable = true;
                          return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      World.prototype.update = function (delta) {
          if (!this._updatable) {
              return;
          }
          if (this._level) {
              this._level.update(delta);
          }
          if (!this.mainCamera) {
              return;
          }
          this.mainCamera.render(null, true);
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      World.prototype.destroy = function (forceClear) {
          if (forceClear === void 0) { forceClear = true; }
          _super.prototype.destroy.call(this);
          this._game.event.trigger('WorldWillDestroy', { world: this });
          try {
              this._script.onDestroyPlayers();
          }
          catch (error) {
              throwException(error, this._script);
          }
          var inheritActors = this._level.destroy(forceClear);
          // parent is not right, do not use removeFromParent
          this.game.removeActor(this._script);
          this.game.removeActor(this._state);
          if (this._physicWorld) {
              this._physicWorld.destroy();
          }
          this._game.players.forEach(function (player) {
              player.releaseController();
          });
          return inheritActors;
      };
      /**
       * 实际上的关卡切换逻辑，一般使用`game.switchLevel`进行代理。
       */
      World.prototype.switchLevel = function (name, initState, 
      // from world, for persistent level
      initActors) {
          if (initState === void 0) { initState = null; }
          return __awaiter(this, void 0, void 0, function () {
              var inheritActors, level, Script;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          if (!this._levels[name]) {
                              throwException(new MissingMemberException(this, 'Level', name, this), this);
                          }
                          level = this._level;
                          Script = this._levels[name].Script;
                          this._level = new Level(name, Script, this);
                          this.addActor = this._level.addActor.bind(this._level);
                          this.removeActor = this._level.removeActor.bind(this._level);
                          // 先销毁当前关卡
                          if (level) {
                              inheritActors = level.destroy();
                          }
                          // 再继承Actor
                          this._level.inherit(inheritActors || initActors || new SArray());
                          // 然后当前关卡的onInit/onAdd/onLogin
                          return [4 /*yield*/, this._level.init(initState)];
                      case 1:
                          // 然后当前关卡的onInit/onAdd/onLogin
                          _a.sent();
                          // 最后加载资源
                          this._level.startLoading();
                          return [2 /*return*/, this];
                  }
              });
          });
      };
      /**
       * 开启物理世界，具体使用见示例[Physic](../../example/physic/base)。
       *
       * @enableContactEvents 是否要启用高级碰撞事件，这可以让你拥有对碰撞更细致的控制，但会有一些性能损耗，默认不开启。
       */
      World.prototype.enablePhysic = function (physicWorld, enableContactEvents) {
          if (enableContactEvents === void 0) { enableContactEvents = false; }
          this._physicWorld = physicWorld;
          if (enableContactEvents) {
              this._physicWorld.initContactEvents();
          }
          return this;
      };
      World.prototype.setMainCamera = function (obj) {
          if (this._mainCamera) {
              this._mainCamera.onAsMainCamera(false);
          }
          if (isSObject(obj) && isCameraComponent(obj)) {
              this._mainCamera = obj;
          }
          else {
              this._mainCamera = obj.camera;
          }
          this._mainCamera.onAsMainCamera(true);
          return this.resizeMainCamera();
      };
      /**
       * 重置当前摄像机相关的尺寸参数，一般不需要自己调用。
       */
      World.prototype.resizeMainCamera = function () {
          if (!this._mainCamera) {
              return this;
          }
          var _a = this._game.bound, width = _a.width, height = _a.height;
          var aspect = width / height;
          if (isPerspectiveCameraComponent(this._mainCamera)) {
              this._mainCamera.aspect = aspect;
              return this;
          }
          if (isOrthographicCameraComponent(this._mainCamera)) {
              this._mainCamera.top = this._mainCamera.right / aspect;
              this._mainCamera.bottom = -this._mainCamera.top;
          }
          return this;
      };
      /**
       * 移除当前世界的主摄像机引用，一般在主摄像机销毁时调用，比如关卡切换时。
       */
      World.prototype.removeMainCamera = function () {
          this._mainCamera = null;
          this._mainCameras = [];
      };
      World = __decorate([
          SClass({ className: 'World', classType: 'World' })
      ], World);
      return World;
  }(SObject));

  /**
   * 判断一个实例是否为`ChildActorComponent`。
   */
  function isChildActorComponent(value) {
      return value.isChildActorComponent;
  }
  /**
   * 用于给一个Actor挂载一个子级Actor的组件。
   * 注意此组件仅仅是建立了渲染层以及逻辑上的父子关系，但子级Actor仍然存在于`Game`或者`World`中，并不按照bfs顺序更新。
   *
   * @template TActor 要挂载的子级Actor的类型。
   * @noInheritDoc
   */
  var ChildActorComponent = /** @class */ (function (_super) {
      __extends(ChildActorComponent, _super);
      function ChildActorComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isChildActorComponent = true;
          /**
           * 声明通过该Component挂载的Actor是否随着父级的销毁而自动销毁。
           * 没有十足把握请不要修改！
           * 若想变更Actor的父级，请使用`SceneActor`下的`changeParent`方法。
           */
          _this.autoDestroyActor = true;
          return _this;
      }
      Object.defineProperty(ChildActorComponent.prototype, "actor", {
          /**
           * 挂载的Actor的引用。
           */
          get: function () {
              return this._actor;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @hidden
       */
      ChildActorComponent.prototype.onInit = function (initState) {
          this._actor = initState.actor;
          if (!isSceneActor(this._actor) || !isSceneActor(this._owner)) {
              return;
          }
          this._actor.root.hiloNode.removeFromParent();
          this._actor._parent = this;
          this._owner.root.hiloNode.addChild(this._actor.root.hiloNode);
      };
      /**
       * @hidden
       */
      ChildActorComponent.prototype.onDestroy = function () {
          if (!this._actor) {
              return;
          }
          this._actor._parent = null;
          if (isSceneActor(this._actor)) {
              this._actor.root.hiloNode.removeFromParent();
              if (this.autoDestroyActor) {
                  this.getWorld().removeActor(this._actor);
              }
          }
          else {
              if (this.autoDestroyActor) {
                  this.getGame().removeActor(this._actor);
              }
          }
      };
      /**
       * @hidden
       */
      ChildActorComponent.prototype.removeActor = function (actor) {
          this.removeFromParent();
      };
      ChildActorComponent = __decorate([
          SClass({ className: 'ChildActorComponent' })
      ], ChildActorComponent);
      return ChildActorComponent;
  }(Component));

  /**
   * 判断一个实例是否为`BreakGuardException`。
   */
  function isBreakGuardException(value) {
      return value.isBreakGuardException;
  }
  /**
   * 破坏守护机制的异常。
   *
   * @noInheritDoc
   */
  var BreakGuardException = /** @class */ (function (_super) {
      __extends(BreakGuardException, _super);
      /**
       * 构建异常。
       *
       * @param object 触发异常的实例。
       * @param message 追加信息。
       */
      function BreakGuardException(object, message) {
          if (message === void 0) { message = ''; }
          var _this = _super.call(this, 'BreakGuard', object, message) || this;
          _this.isBreakGuardException = true;
          return _this;
      }
      return BreakGuardException;
  }(BaseException));

  /**
   * 判断一个实例是否为`MemberConflictException`。
   */
  function isMemberConflictException(value) {
      return value.isMemberConflictException;
  }
  /**
   * 成员冲突异常。
   *
   * @noInheritDoc
   */
  var MemberConflictException = /** @class */ (function (_super) {
      __extends(MemberConflictException, _super);
      /**
       * 构建异常。
       *
       * @param parent 成员父级实例。
       * @param memberType 成员类型。
       * @param memberName 成员名称。
       * @param object 触发异常的实例。
       * @param message 追加信息。
       */
      function MemberConflictException(parent, memberType, memberName, object, message) {
          if (message === void 0) { message = ''; }
          var _this = _super.call(this, 'MemberConflict', object, memberType + " \"" + memberName + "\" is already in " + parent.className + " \"" + parent.name + "\". " + message) || this;
          _this.isMemberConflictException = true;
          return _this;
      }
      return MemberConflictException;
  }(BaseException));

  function isSceneComponent$1(value) {
      return value.isSceneComponent;
  }

  /**
   * Sein.js封装的用于存储`SObject`实例的特殊Map容器。
   *
   * @template T 存储的实例的类型。
   */
  var SMap = /** @class */ (function (_super) {
      __extends(SMap, _super);
      function SMap() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._table = {};
          _this._tableReflect = {};
          return _this;
      }
      Object.defineProperty(SMap.prototype, "array", {
          /**
           * 原始基础数组。
           */
          get: function () {
              return this._array;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 设置对应键的实例引用。
       */
      SMap.prototype.set = function (key, item) {
          var oldItem = this._table[key];
          if (oldItem) {
              this.removeItem(oldItem);
              delete this._tableReflect[oldItem.uuid];
          }
          this.addItem(item);
          this._table[key] = item;
          this._tableReflect[item.uuid] = key;
          return this;
      };
      /**
       * 判断键是否在容器内。
       */
      SMap.prototype.has = function (key) {
          return !!this._table[key];
      };
      /**
       * 通过键从容器中移除一个实例。
       */
      SMap.prototype.remove = function (key) {
          var oldItem = this._table[key];
          if (!oldItem) {
              return;
          }
          this.removeItem(oldItem);
          delete this._table[key];
          delete this._tableReflect[oldItem.uuid];
          return oldItem;
      };
      /**
       * 通过键获取一个实例。
       */
      SMap.prototype.get = function (key) {
          return this.findByName(key);
      };
      /**
       * 通过索引从容器中获取一个实例。
       */
      SMap.prototype.getAtIndex = function (index) {
          return this._array[index];
      };
      /**
       * 清空所有存储的实例。
       */
      SMap.prototype.clear = function () {
          _super.prototype.clear.call(this);
          this._table = {};
          this._tableReflect = {};
          return this;
      };
      /**
       * 遍历所有键值对。
       * 通过回调的返回值设`true`，你可以终止迭代，这用于性能优化。
       */
      SMap.prototype.forEachEntities = function (func) {
          var length = this.length;
          for (var index = 0; index < length; index += 1) {
              var item = this._array[index];
              if (func(this._tableReflect[item.uuid], item)) {
                  return this;
              }
          }
          return this;
      };
      /**
       * 从一个基本的数组实例初始化SIterable。
       */
      SMap.prototype.fromArray = function (array) {
          this.clear();
          var length = array.length;
          for (var index = 0; index < length; index += 1) {
              this.set(array[index].name.value, array[index]);
          }
          return this;
      };
      /**
       * 通过名字查找第一个实例。
       */
      SMap.prototype.findByName = function (name) {
          return this._table[name];
      };
      /**
       * 通过名字查找所有实例。
       */
      SMap.prototype.findAllByName = function (name) {
          return [this._table[name]];
      };
      return SMap;
  }(SIterable));

  /**
   * 判断一个实例是否为`Actor`。
   */
  function isActor(value) {
      return value.isActor;
  }
  /**
   * 游戏世界的基石，作为Components的封装容器。
   * 自身可以包含一定程度的业务逻辑，但不推荐，推荐在专用Actor中编写业务逻辑，比如`GameModeActor`和`LevelScriptActor`。
   *
   * @template IOptionTypes 初始化参数类型，一般交由由继承的类定义实现多态。
   * @template TRootComponent 根级组件类型，一般交由由继承的类定义实现多态。
   *
   * @noInheritDoc
   */
  var Actor = /** @class */ (function (_super) {
      __extends(Actor, _super);
      /**
       * 构造Actor，**不可自行构造！！！**请参见`game.addActor`或`world.addActor`方法。
       */
      function Actor(name, game, initOptions) {
          var _this = _super.call(this, name) || this;
          _this.isActor = true;
          /**
           * Actor是否需要在每一帧进行进行`update`调用，如果为`false`，则将不会触发`onUpdate`生命周期（包括挂载在其下的所有Component）。
           * 用于性能优化。
           */
          _this.updateOnEverTick = true;
          /**
           * 在Actor自身销毁时，是否同时需要触发其下挂载的所有Component的销毁，也就是`onDestroy`生命周期的调用。
           * 用于性能优化。
           */
          _this.emitComponentsDestroy = true;
          /**
           * 用于给Actor归类的标签，可以用于后续的快速索引。
           */
          _this.tag = new SName('UnTagged');
          _this._game = null;
          _this._root = null;
          _this._components = new SMap();
          _this._componentsForUpdate = new SArray();
          _this._componentsNeedUpdate = false;
          _this._parent = null;
          _this._inWorld = false;
          _this._linked = false;
          _this._game = game;
          _this._initOptions = initOptions;
          return _this;
      }
      Object.defineProperty(Actor.prototype, "parent", {
          /**
           * 获取自身的父级实例，根据情况不同可能有不同的类型，一般不需要自己使用。
           */
          get: function () {
              return this._parent;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Actor.prototype, "linked", {
          /**
           * Actor是否被连接到了舞台上。
           */
          get: function () {
              return this._linked;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Actor.prototype, "event", {
          /**
           * Actor自身范围内的事件系统管理器，将会直接代理到其的根组件`root`。
           */
          get: function () {
              return this._root.event;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Actor.prototype, "root", {
          /**
           * Actor自身的根组件。一般来讲创建后就不会变更。
           */
          get: function () {
              return this._root;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 用于验证改Actor在当前状态是否可被添加，一般用于防止重复添加不可重复的系统Actor等。
       * 你可以重写此方法来达成验证，如果验证不通过请抛出异常。
       * 注意，此验证仅会在`development`环境下被执行！
       */
      Actor.prototype.verifyAdding = function (initOptions) { };
      /**
       * 用于验证该Actor在当前状态是否可被移除。
       * 你可以重写此方法来达成验证，如果验证不通过请抛出异常。
       * 注意，此验证仅会在`development`环境下被执行！
       */
      Actor.prototype.verifyRemoving = function () { };
      /**
       * 生命周期，将在Actor被创建时最先调用，用于创建从属于该Actor的根组件。
       * 在原生Actor中均有默认值，你可以用此周期来定义你自己的Actor。
       */
      Actor.prototype.onCreateRoot = function (initOptions) {
          return this.addComponent('root', Component);
      };
      /**
       * 生命周期，将在Actor创建了根组件后、在正式被添加到游戏中之前被调用。
       */
      Actor.prototype.onInit = function (initOptions) {
      };
      /**
       * 生命周期，将在Actor被正式加入到游戏中之后被调用。
       */
      Actor.prototype.onAdd = function (initOptions) {
      };
      /**
       * 生命周期，将在Actor被正式加入到游戏中之后，并且`updateOnEverTick`为`true`时在每一帧被调用。
       */
      Actor.prototype.onUpdate = function (delta) {
      };
      /**
       * 生命周期，用于错误边界处理。将在游戏中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
       * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
       * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
       */
      Actor.prototype.onError = function (error, details) {
      };
      /**
       * 生命周期，将在调用`actor.unLink`方法后触发。
       */
      Actor.prototype.onUnLink = function () {
      };
      /**
       * 生命周期，将在调用`actor.reLink`方法后触发。
       *
       * @param parent 要恢复连接到的父级。
       */
      Actor.prototype.onReLink = function (parent) {
      };
      /**
       * 生命周期，将在Actor被销毁时触发。
       */
      Actor.prototype.onDestroy = function () {
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Actor.prototype.initialized = function () {
          try {
              this._root = this.onCreateRoot(this._initOptions);
              this._componentsForUpdate.add(this._root);
          }
          catch (error) {
              throwException(error, this);
          }
          this._root.isRoot = true;
          try {
              this.onInit(this._initOptions);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Actor.prototype.added = function () {
          if (this._inWorld) {
              return;
          }
          this._inWorld = true;
          this._linked = true;
          this._components.forEach(function (component) {
              component.added();
          });
          try {
              this.onAdd(this._initOptions);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Actor.prototype.update = function (delta) {
          this.syncComponentsNeedUpdate();
          if (!this.updateOnEverTick || !this._inWorld || !this._parent) {
              return;
          }
          try {
              this.onUpdate(delta);
          }
          catch (error) {
              throwException(error, this);
          }
          this._componentsForUpdate.forEach(function (component) {
              component.update(delta);
          });
      };
      /**
       * 将一个已经创建的`actor`从游戏世界中移除，但仍然保留其状态。之后可以用`reLink`方法让其重新和游戏世界建立连接。
       * 注意如果有子级`actor`，并不会自动`unLink`！
       * 这一般用于性能优化，比如对象池的创建。
       */
      Actor.prototype.unLink = function () {
          if (!this._linked) {
              return this;
          }
          try {
              this.onUnLink();
          }
          catch (error) {
              throwException(error, this);
          }
          this.syncComponentsNeedUpdate();
          this._componentsForUpdate.forEach(function (component) { return component.unLink(); });
          var parent = this._parent;
          var realParent;
          if (isChildActorComponent(parent)) {
              parent.autoDestroyActor = false;
              parent.removeFromParent();
              this._parent = parent.getOwner();
              realParent = !isSceneActor(parent.getOwner()) ? parent.getGame() : parent.getWorld();
          }
          else {
              realParent = parent;
          }
          /**
           * @todo: fix types
           */
          realParent.actors.remove(this);
          realParent._actorsNeedUpdate = true;
          this._linked = false;
          return this;
      };
      /**
       * 将一个已经使用`unLink`方法和游戏世界断开连接的`actor`恢复连接，将其重新加入世界中。
       * 这一般用于性能优化，比如对象池的创建。
       *
       * @param parent 指定要恢复连接到的父级，不指定则使用上一次的父级。
       */
      Actor.prototype.reLink = function (parent) {
          if (this._linked) {
              return this;
          }
          parent = parent || this._parent;
          var realParent;
          if (isActor(parent)) {
              realParent = !isSceneActor(parent) ? parent.getGame() : parent.getWorld();
          }
          else {
              realParent = parent;
          }
          if (isWorld(realParent) && this.getGame().world !== realParent) {
              throw new Error("ReLink error! Current world is different from pre world !");
          }
          /**
           * @todo: fix types
           */
          realParent.actors.add(this);
          realParent._actorsNeedUpdate = true;
          if (isActor(parent)) {
              parent.addChild(this);
          }
          try {
              this.onReLink(parent);
          }
          catch (error) {
              throwException(error, this);
          }
          this.syncComponentsNeedUpdate();
          this._componentsForUpdate.forEach(function (component) { return component.reLink(); });
          this._linked = true;
          return this;
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Actor.prototype.destroy = function () {
          if (this.emitComponentsDestroy) {
              this.syncComponentsNeedUpdate();
              this._componentsForUpdate.forEach(function (component) { return component.destroy(); });
          }
          else {
              this._root.destroy();
          }
          _super.prototype.destroy.call(this);
          this._parent = null;
      };
      Actor.prototype.syncComponentsNeedUpdate = function () {
          var _this = this;
          if (this._componentsNeedUpdate) {
              this._componentsForUpdate.clear();
              this._components.forEach(function (item) {
                  if (item.isRoot || item.needUpdateAndDestroy) {
                      _this._componentsForUpdate.add(item);
                  }
              });
              this._componentsNeedUpdate = false;
          }
      };
      /**
       * 获取当前`Game`实例。
       *
       * @template IGameState 当前游戏状态管理器的类型。
       */
      Actor.prototype.getGame = function () {
          return this._game;
      };
      /**
       * 获取当前`World`实例。
       *
       * @template IWorldState 当前世界状态管理器的类型。
       */
      Actor.prototype.getWorld = function () {
          return this._game.world;
      };
      /**
       * 获取当前`Level`实例。
       *
       * @template ILevelState 当前关卡状态管理器的类型。
       */
      Actor.prototype.getLevel = function () {
          return this._game.level;
      };
      /**
       * 仅在初始化了物理引擎之后，用于获取当前物理世界`PhysicWorld`实例。
       * 如何使用物理引擎请见**Guide**和**Demo**。
       */
      Actor.prototype.getPhysicWorld = function () {
          return this._game.world.physicWorld;
      };
      /**
       * 将自己从父级移除，基本等同于`destroy`方法，从游戏中销毁自身。
       */
      Actor.prototype.removeFromParent = function () {
          if (!this._parent) {
              throwException(new Error("Actor " + this.name + " has no parent, is it an invalid reference to an actor is already removed from world ?"), this);
          }
          this._parent.removeActor(this);
      };
      /**
       * 根据指定的`ComponentClass`和其初始化参数`initState`来添加一个Component。**注意这里要求每个Component的名字`name`是唯一的**。
       * 如果是在`world`中添加一个`SceneComponent`，你可以指定一个`parent`作为要添加的Component的父级，让它们在渲染层连接起来。
       */
      Actor.prototype.addComponent = function (name, ComponentClass, initState, parent) {
          if (this._components.has(name)) {
              throw new MemberConflictException(this, 'Component', name, this);
          }
          if (parent && parent.getOwner() !== this) {
              throw new BreakGuardException(this, "Owner of parent component " + parent.name + " must be same to owner of child " + this.name);
          }
          var component = new ComponentClass(name, this, initState);
          if (parent && (!isSceneComponent$1(parent) || !isSceneComponent$1(component))) {
              throw new BreakGuardException(this, "Only SceneComponent could have child SceneComponent ! \nCurrent parent: " + parent.name + "(" + parent.className + "), child: " + component.name + "(" + component.className + ")");
          }
          if (Debug.devMode) {
              try {
                  component.verifyAdding(initState);
              }
              catch (error) {
                  throwException(error, component);
                  return;
              }
          }
          this._components.set(name, component);
          component.initialized();
          if (isSceneComponent$1(component)) {
              if (parent) {
                  parent.addChild(component);
              }
              else if (this._root && isSceneComponent$1(this._root)) {
                  this._root.addChild(component);
              }
              else {
                  component._parent = this;
              }
          }
          else {
              component._parent = this;
          }
          if (this._inWorld) {
              component.added();
          }
          if (component.needUpdateAndDestroy) {
              this._componentsNeedUpdate = true;
          }
          return component;
      };
      Actor.prototype.removeComponent = function (value) {
          var component;
          if (isSObject(value) && isComponent(value)) {
              component = value;
          }
          else {
              component = this._components.get(value);
          }
          if (!component) {
              return this;
          }
          if (!component.canBeRemoved || component.isRoot) {
              throw new BreakGuardException(this, "In actor " + this.name + ", component " + component.name + " can not be removed.\nIt's one of '!canBeRemoved', 'root'");
          }
          if (Debug.devMode) {
              try {
                  component.verifyRemoving();
              }
              catch (error) {
                  throwException(error, component);
                  return;
              }
          }
          if (component.parent && isSceneComponent$1(component.parent)) {
              component.parent.removeChild(component);
              this.clearSceneComponent(component);
          }
          component.destroy();
          this._components.remove(component.name.value);
          if (component.needUpdateAndDestroy) {
              this._componentsNeedUpdate = true;
          }
          return this;
      };
      /**
       * 将一个Actor作为自身的子级，注意子级Actor将仍然存在于`game`或者`world`中，并拥有自身独立的生命周期，这里只是建立了一个连接关系。
       * 如果父子为`SceneActor`，那么这层链接关系还会反映到渲染层。
       */
      Actor.prototype.addChild = function (actor) {
          if (actor.parent && isChildActorComponent(actor.parent)) {
              actor.parent.getOwner().removeComponent(actor.parent);
          }
          this.addComponent(actor.name.value, ChildActorComponent, { actor: actor });
      };
      /**
       * 解除自身和一个子级Actor的链接。注意此方法也会直接将子级Actor从游戏中销毁！
       * 如果只是想要改变一个SceneActor的归属，请使用`SceneActor`下的`changeParent`方法。
       */
      Actor.prototype.removeChild = function (actor) {
          if (!actor.parent || !isChildActorComponent(actor.parent)) {
              return;
          }
          this.removeComponent(actor.parent);
      };
      // todo: 级联将导致所有子组件递归销毁
      // 性能会不会有问题？
      // 这个情况还要考虑更完美的处理方式？
      Actor.prototype.clearSceneComponent = function (component) {
          var _this = this;
          component.children.forEach(function (child) {
              component.destroy();
              _this._components.remove(child.name.value);
              _this.clearSceneComponent(child);
          });
      };
      /**
       * 根据名字查找一个Component。
       */
      Actor.prototype.findComponentByName = function (name) {
          return this._components.get(name);
      };
      /**
       * 根据某个类查找一个Component。
       */
      Actor.prototype.findComponentByClass = function (ComponentClass) {
          return this._components.findByClass(ComponentClass);
      };
      /**
       * 查找某个类的所有实例Component。
       */
      Actor.prototype.findComponentsByClass = function (ComponentClass) {
          return this._components.findAllByClass(ComponentClass);
      };
      /**
       * 通过一个Filter来查找组件。
       */
      Actor.prototype.findComponentByFilter = function (filter) {
          return this._components.findByFilter(filter);
      };
      /**
       * 通过一个Filter来查找所有。
       */
      Actor.prototype.findComponentsByFilter = function (filter) {
          return this._components.findAllByFilter(filter);
      };
      Actor = __decorate([
          SClass({ className: 'Actor', classType: 'Actor' })
      ], Actor);
      return Actor;
  }(SObject));

  /**
   * 判断一个实例是否为`Ticker`。
   */
  function isTicker(value) {
      return value.isTicker;
  }
  /**
   * 维护一个监听器队列，在每一帧调用队列里的回调。
   *
   * @noInheritDoc
   */
  var Ticker = /** @class */ (function (_super) {
      __extends(Ticker, _super);
      /**
       * 指定锁定帧率，创建一个Ticker。
       * 若不指定则不锁帧。
       */
      function Ticker(fps) {
          var _this = _super.call(this, 'SeinTimer') || this;
          _this.isTicker = true;
          _this._lockFrame = false;
          _this._fps = 0;
          _this._spf = 0;
          _this._pre = 0;
          _this._delta = 0;
          _this._actualPre = 0;
          _this._tickers = [];
          _this._tickersQueue = [];
          _this._needUpdate = false;
          _this._paused = true;
          _this.update = function (ts) {
              if (_this._paused) {
                  return;
              }
              requestAnimationFrame(_this.update);
              if (_this._pre === 0) {
                  _this._pre = ts;
                  _this._actualPre = Date.now();
                  return;
              }
              if (_this._needUpdate) {
                  _this._tickersQueue = _this._tickers.slice();
                  _this._needUpdate = false;
              }
              var delta = ts - _this._pre;
              _this._pre = ts;
              if (!_this._lockFrame) {
                  var length_1 = _this._tickersQueue.length;
                  for (var i = 0; i < length_1; i += 1) {
                      _this._tickersQueue[i](delta);
                  }
                  return;
              }
              if (_this._delta >= _this._spf) {
                  var now = Date.now();
                  var actualDelta = now - _this._actualPre;
                  _this._actualPre = now;
                  _this._delta -= _this._spf * ~~(_this._delta / _this._spf);
                  var length_2 = _this._tickersQueue.length;
                  for (var i = 0; i < length_2; i += 1) {
                      _this._tickersQueue[i](actualDelta);
                  }
              }
              _this._delta += delta;
          };
          if (fps !== undefined && fps !== null) {
              _this.fps = fps;
          }
          return _this;
      }
      Object.defineProperty(Ticker.prototype, "fps", {
          /**
           * 获取锁定帧率。
           */
          get: function () {
              return this._fps;
          },
          /**
           * 修改锁定帧率。
           */
          set: function (fps) {
              if (60 % fps !== 0) {
                  Debug.warn(fps + "fps is not safe, you can only choice 60, 30, 20(not in low-power mode in safari), 15, 10 or 5 !");
              }
              this._fps = fps;
              this._spf = 1000 / fps;
              this._lockFrame = true;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Ticker.prototype, "paused", {
          /**
           * Ticker是否暂停。
           */
          get: function () {
              return this._paused;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Ticker.prototype, "lockFrame", {
          /**
           * 获取是否开启锁帧。
           */
          get: function () {
              return this._lockFrame;
          },
          /**
           * 设置是否开启锁帧。
           */
          set: function (value) {
              this._lockFrame = value;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 添加一个ticker监听器到队列中。
       */
      Ticker.prototype.add = function (listener) {
          this._tickers.push(listener);
          this._needUpdate = true;
          return this;
      };
      /**
       * 从队列中移除一个监听器。
       */
      Ticker.prototype.remove = function (listener) {
          this._tickers.splice(this._tickers.indexOf(listener), 1);
          this._needUpdate = true;
          return this;
      };
      /**
       * 启动Ticker。
       */
      Ticker.prototype.start = function () {
          this._paused = false;
          this._pre = 0;
          this._delta = 0;
          this._actualPre = 0;
          requestAnimationFrame(this.update);
          return this;
      };
      /**
       * 暂停Ticker。
       */
      Ticker.prototype.pause = function () {
          this._paused = true;
          return this;
      };
      Ticker = __decorate([
          SClass({ className: 'Ticker', classType: 'Ticker' })
      ], Ticker);
      return Ticker;
  }(SObject));

  /**
   * 判断一个实例是否为`Engine`。
   */
  function isEngine(value) {
      return value.isEngine;
  }
  /**
   * 顶层引擎类，一般除了初始化游戏不需要直接控制。
   *
   * @noInheritDoc
   */
  var Engine = /** @class */ (function (_super) {
      __extends(Engine, _super);
      function Engine(options) {
          var _this = _super.call(this, 'SeinEngine') || this;
          _this.isEngine = true;
          _this._options = null;
          _this._ticker = null;
          _this._games = [];
          _this._runningGames = [];
          _this.update = function (delta) {
              var length = _this._runningGames.length;
              Tween.tick();
              for (var i = 0; i < length; i += 1) {
                  _this._runningGames[i].update(delta);
              }
          };
          Engine_1.RUNNING_ENGINES.push(_this);
          _this._options = options || {};
          _this._ticker = new Ticker(_this._options.fps);
          _this._ticker.add(_this.update);
          return _this;
      }
      Engine_1 = Engine;
      /**
       * 获取当前运行的Engine实例。
       *
       * @param index 索引，不传则取回第一个，一般也就是唯一的一个。
       */
      Engine.GET_RUNNING_ENGINE = function (index) {
          if (index === void 0) { index = 0; }
          return Engine_1.RUNNING_ENGINES[index];
      };
      Object.defineProperty(Engine.prototype, "options", {
          /**
           * 当前参数。
           */
          get: function () {
              return this._options;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Engine.prototype, "ticker", {
          /**
           * 全局Ticker。
           */
          get: function () {
              return this._ticker;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Engine.prototype, "env", {
          /**
           * 当前运行环境，一般为`development`或`production`。
           */
          get: function () {
              return Debug.env;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Engine.prototype, "devMode", {
          /**
           * `env`不为`production`时，判定为开发环境。
           */
          get: function () {
              return Debug.devMode;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 生命周期，用于错误边界处理。将在游戏中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
       * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
       * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
       */
      Engine.prototype.onError = function (error, details) {
          Debug.warn("Error '" + error.message + "' reaches engine, try to catch it in exception chain !");
      };
      /**
       * 添加一个游戏实例到引擎中。
       */
      Engine.prototype.addGame = function (game) {
          game._engine = this;
          this._games.push(game);
          try {
              game.onAdd();
          }
          catch (error) {
              throwException(error, game);
          }
          return this;
      };
      /**
       * 将一个游戏实例从引擎中移除。
       */
      Engine.prototype.removeGame = function (game) {
          var index = this._runningGames.indexOf(game);
          if (index >= 0) {
              this.destroyGame(game);
          }
          index = this._games.indexOf(game);
          if (index >= 0) {
              this._games.splice(index, 1);
          }
          game._engine = null;
          return this;
      };
      /**
       * 获取当前运行的某个Game实例。
       *
       * @param index 索引，不传则取回第一个，一般也就是唯一的一个。
       */
      Engine.prototype.getRunningGame = function (index) {
          if (index === void 0) { index = 0; }
          return this._runningGames[index];
      };
      /**
       * @hidden
       */
      Engine.prototype.startGame = function (game) {
          if (this._runningGames.indexOf(game) < 0) {
              this._runningGames.push(game);
              try {
                  game.onStart();
              }
              catch (error) {
                  throwException(error, game);
              }
          }
          if (this._ticker.paused) {
              this._ticker.start();
          }
          return this;
      };
      /**
       * @hidden
       */
      Engine.prototype.pauseGame = function (game) {
          try {
              game.onPause();
          }
          catch (error) {
              throwException(error, game);
          }
          this._runningGames.splice(this._runningGames.indexOf(game), 1);
          if (this._runningGames.length === 0) {
              this._ticker.pause();
          }
          return this;
      };
      /**
       * @hidden
       */
      Engine.prototype.resumeGame = function (game) {
          if (this._runningGames.indexOf(game) < 0) {
              this._runningGames.push(game);
          }
          try {
              game.onResume();
          }
          catch (error) {
              throwException(error, game);
          }
          if (this._ticker.paused) {
              this._ticker.start();
          }
          return this;
      };
      /**
       * @hidden
       */
      Engine.prototype.restartGame = function (game) {
          this.destroyGame(game);
          this.startGame(game);
          return this;
      };
      /**
       * @hidden
       */
      Engine.prototype.destroyGame = function (game) {
          var index = this._runningGames.indexOf(game);
          if (index >= 0) {
              this._runningGames.splice(index, 1);
              try {
                  game.onDestroy();
              }
              catch (error) {
                  throwException(error, game);
              }
          }
          if (this._runningGames.length === 0) {
              this._ticker.pause();
          }
          this.removeGame(game);
          return this;
      };
      /**
       * 启动所有游戏，一般使用`game.start()`作为替代，启动特定游戏。
       */
      Engine.prototype.start = function () {
          this._games.forEach(function (game) { return game.start(); });
          return this;
      };
      /**
       * 暂停所有游戏，一般使用`game.pause()`作为替代，暂停特定游戏。
       */
      Engine.prototype.pause = function () {
          this._runningGames.forEach(function (game) { return game.pause(); });
          return this;
      };
      /**
       * 唤醒所有游戏，一般使用`game.resume()`作为替代，唤醒特定游戏。
       */
      Engine.prototype.resume = function () {
          this._games.forEach(function (game) { return game.resume(); });
          return this;
      };
      /**
       * 重启所有游戏，一般使用`game.restart()`作为替代，重启特定游戏。
       */
      Engine.prototype.restart = function () {
          this._runningGames.forEach(function (game) { return game.restart(); });
          return this;
      };
      /**
       * 销毁所有游戏，一般使用`game.destroy()`作为替代，销毁特定游戏。
       */
      Engine.prototype.destroy = function () {
          this._runningGames.forEach(function (game) { return game.destroy(); });
          this._games = [];
          Engine_1.RUNNING_ENGINES.splice(Engine_1.RUNNING_ENGINES.indexOf(this), 1);
      };
      var Engine_1;
      /**
       * 当前所有正在运行的Engine，一般情况下只有一个。
       */
      Engine.RUNNING_ENGINES = [];
      Engine = Engine_1 = __decorate([
          SClass({ className: 'Engine', classType: 'Engine' })
      ], Engine);
      return Engine;
  }(SObject));

  /**
   * 判断一个实例是否为`ResourceLoadException`。
   */
  function isResourceLoadException(value) {
      return value.isResourceLoadException;
  }
  /**
   * 资源加载异常。
   *
   * @noInheritDoc
   */
  var ResourceLoadException = /** @class */ (function (_super) {
      __extends(ResourceLoadException, _super);
      /**
       * 构建异常。
       *
       * @param parent 成员父级实例。
       * @param memberType 成员类型。
       * @param memberName 成员名称。
       * @param object 触发异常的实例。
       * @param message 追加信息。
       */
      function ResourceLoadException(resourceName, resourceManager, message) {
          if (message === void 0) { message = ''; }
          var _this = _super.call(this, 'ResourceLoad', resourceManager, "Error occured when load resource \"" + resourceName + "\". " + message) || this;
          _this.isResourceLoadException = true;
          _this.resourceName = resourceName;
          return _this;
      }
      return ResourceLoadException;
  }(BaseException));

  /**
   * @hidden
   */
  function getExt(url) {
      return '.' + url.split('.').pop();
  }
  /**
   * 判断一个实例是否为`ResourceManager`。
   */
  function isResourceManager(value) {
      return value.isResourceManager;
  }
  /**
   * 资源管理器类。作为资源的集中管理容器，承担着引擎所有的资源加载器的注册、销毁，以及资源的添加、加载和释放。
   *
   * @template IDefaultLoaders 用于标注所有资源的名称以及对应的事件参数类型。
   * @noInheritDoc
   */
  var ResourceManager = /** @class */ (function (_super) {
      __extends(ResourceManager, _super);
      /**
       * @hidden
       */
      function ResourceManager(game) {
          var _this = _super.call(this) || this;
          _this.isResourceManager = true;
          _this._onError = new Observable(_this);
          _this._onLoading = new Observable(_this);
          _this._onLoaded = new Observable(_this);
          _this._loaders = {};
          _this._loadersFormat = {};
          _this._queue = {};
          _this._store = {};
          _this._state = {
              totalCount: 0,
              loadedCount: 0,
              progress: 0,
              totalWeight: 0,
              loadDone: true,
              current: null
          };
          _this.handleLoadingOne = function (entity, progress) {
              // resource has been canceled
              if (!_this._queue[entity.name]) {
                  return;
              }
              var weight = entity.weight, preProgress = entity.preProgress;
              entity.preProgress = progress;
              _this._state.current = entity;
              _this._state.progress += (weight * (progress - preProgress) / _this._state.totalWeight);
              _this.onLoading.notify(Object.assign({}, _this._state));
          };
          _this.handleLoadedOne = function (entity, error) {
              if (error === void 0) { error = null; }
              var weight = entity.weight, preProgress = entity.preProgress;
              var progress = 1;
              entity.preProgress = progress;
              _this._state.current = entity;
              _this._state.progress += (weight * (progress - preProgress) / _this._state.totalWeight);
              _this._state.loadedCount += 1;
              delete _this._queue[entity.name];
              if (!error) {
                  _this._store[entity.name] = entity;
              }
              else {
                  _this.onError.notify({ error: error, state: Object.assign({}, _this._state) });
              }
              _this.onLoading.notify(Object.assign(error ? { error: error } : {}, _this._state));
              if (_this._state.loadedCount === _this._state.totalCount) {
                  _this.handleLoadDone();
              }
          };
          _this._game = game;
          return _this;
      }
      Object.defineProperty(ResourceManager.prototype, "loadDone", {
          /**
           * 此批资源是否加载完毕。
           */
          get: function () {
              return this._state.loadDone;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ResourceManager.prototype, "parent", {
          /**
           * 获取父级Game实例。
           */
          get: function () {
              return this._game;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ResourceManager.prototype, "onError", {
          /**
           * 此批资源加载错误时的可观察实例。
           */
          get: function () {
              return this._onError;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ResourceManager.prototype, "onLoading", {
          /**
           * 此批资源加载进度更新时的可观察实例。
           */
          get: function () {
              return this._onLoading;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ResourceManager.prototype, "onLoaded", {
          /**
           * 此批资源加载完毕时的可观察实例。
           */
          get: function () {
              return this._onLoaded;
          },
          enumerable: true,
          configurable: true
      });
      ResourceManager.prototype.getLoader = function (type) {
          return this._loaders[type];
      };
      /**
       * 获取一个指定格式的Loader。
       *
       * **指定格式需要在`ResourceLoader.EXTENSIONS`静态变量中定义！**
       */
      ResourceManager.prototype.getLoaderByFormat = function (format) {
          return this.getLoader(this._loadersFormat[format]);
      };
      ResourceManager.prototype.register = function (type, LoaderClass) {
          var _this = this;
          if (this._loaders[type]) {
              throw new MemberConflictException(this, 'Loader', type, this, 'You should unregister it at first !');
          }
          var loader = new LoaderClass();
          loader.game = this._game;
          this._loaders[type] = loader;
          (LoaderClass.FORMATS || []).forEach(function (format) {
              _this._loadersFormat[format] = type;
          });
          return this;
      };
      ResourceManager.prototype.unregister = function (type) {
          var _this = this;
          if (!this._loaders[type]) {
              return;
          }
          (this._loaders[type].constructor || []).FORMATS.forEach(function (format) {
              delete _this._loadersFormat[format];
          });
          delete this._loaders[type];
          return this;
      };
      ResourceManager.prototype.add = function (type, name, resource) {
          if (!this._loaders[type]) {
              throw new MissingMemberException(this, 'Loader', type, this, 'Register it before adding resource !');
          }
          if (this._store[name]) {
              return;
          }
          this._store[name] = { name: name, result: resource, type: type, url: '' };
          return this;
      };
      /**
       * 判断一个资源是否已经存在。
       */
      ResourceManager.prototype.has = function (name) {
          return !!this._store[name];
      };
      ResourceManager.prototype.get = function (name) {
          if (!this._store[name]) {
              Debug.warn("Resource " + name + " is not existed !");
              return null;
          }
          return this._store[name].result;
      };
      /**
       * 释放一个指定的资源。
       */
      ResourceManager.prototype.release = function (name) {
          var entity = this._store[name];
          if (!entity) {
              throw new MissingMemberException(this, 'Entity', name, this);
          }
          this._loaders[entity.type].release(entity);
          delete this._store[name];
          return this;
      };
      /**
       * 清除所有资源。
       */
      ResourceManager.prototype.clear = function () {
          for (var name_1 in this._store) {
              this.release(name_1);
          }
          return this;
      };
      /**
       * 取消特定资源加载。
       */
      ResourceManager.prototype.cancel = function (name) {
          if (!this._queue[name]) {
              return;
          }
          var entity = this._queue[name].entity;
          delete this._queue[name];
          this._loaders[entity.type].cancel(entity);
          this._state.loadedCount += 1;
          if (this._state.loadedCount === this._state.totalCount) {
              this.handleLoadDone();
          }
          return this;
      };
      /**
       * 取消当前所有资源加载。
       */
      ResourceManager.prototype.cancelAll = function () {
          for (var key in this._queue) {
              this.cancel(key);
          }
          return this;
      };
      ResourceManager.prototype.load = function (entity) {
          return __awaiter(this, void 0, void 0, function () {
              var type, loader, pending;
              var _this = this;
              return __generator(this, function (_a) {
                  type = entity.type || this._loadersFormat[getExt(entity.url)];
                  if (!this._loaders[type]) {
                      throw new MissingMemberException(this, 'Loader', type, this, 'Register it before adding resource !');
                  }
                  if (this._store[entity.name]) {
                      return [2 /*return*/, this._store[entity.name]];
                  }
                  if (this._queue[entity.name]) {
                      return [2 /*return*/, this._queue[entity.name]];
                  }
                  loader = this._loaders[type];
                  entity.type = type;
                  entity.weight = entity.weight || 1;
                  entity.preProgress = 0;
                  entity.canceled = false;
                  this._state.totalCount += 1;
                  this._state.totalWeight += entity.weight;
                  this._state.loadDone = false;
                  pending = new Promise(function (resolve, reject) {
                      loader.load(entity, {
                          onLoading: _this.handleLoadingOne,
                          onLoaded: function () {
                              // resource has been canceled
                              if (!_this._queue[entity.name]) {
                                  return;
                              }
                              _this.handleLoadedOne(entity);
                              resolve(entity.result);
                          },
                          onError: function (_, error) {
                              // resource has been canceled
                              if (!_this._queue[entity.name]) {
                                  return;
                              }
                              var stack = error.stack;
                              error = new ResourceLoadException(entity.name, _this, error.message);
                              error.stack = stack;
                              _this.handleLoadedOne(entity, error);
                              reject(error);
                          }
                      });
                  });
                  this._queue[entity.name] = { pending: pending, entity: entity };
                  return [2 /*return*/, this._queue[entity.name].pending];
              });
          });
      };
      ResourceManager.prototype.instantiate = function (resourceName, options) {
          var entity = this._store[resourceName];
          if (!entity) {
              throw new MissingMemberException(this, 'Entity', resourceName, this);
          }
          return this._loaders[entity.type].instantiate(entity, options || {});
      };
      ResourceManager.prototype.handleLoadDone = function () {
          this._state.loadDone = true;
          this._state.progress = 1;
          var state = Object.assign({}, this._state);
          this._state.totalCount = 0;
          this._state.loadedCount = 0;
          this._state.totalWeight = 0;
          this._state.progress = 0;
          this._state.current = null;
          this.onLoaded.notify(state);
      };
      /**
       * 销毁，继承请先`super.onDestroy()`。
       */
      ResourceManager.prototype.onDestroy = function () {
          if (!this._state.loadDone) {
              this.cancelAll();
          }
          this.clear();
          this._loaders = {};
      };
      ResourceManager = __decorate([
          SClass({ className: 'ResourceManager' })
      ], ResourceManager);
      return ResourceManager;
  }(SObject));

  /**
   * 判断一个实例是否为`ResourceLoader`。
   */
  function isResourceLoader(value) {
      return value.isResourceLoader;
  }
  /**
   * 资源加载器。加载器用于在资源管理器[ResourceManager](../eesourcemanager)注册加载器时。
   * 你可以继承此基类来派生自己的加载器。
   *
   * @template IResource 此加载器对应的实体参数类型。
   * @noInheritDoc
   */
  var ResourceLoader = /** @class */ (function (_super) {
      __extends(ResourceLoader, _super);
      function ResourceLoader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isResourceLoader = true;
          return _this;
      }
      /**
       * 加载一个资源，并根据情况执行`callbacks`中的回调。
       */
      ResourceLoader.prototype.load = function (entity, callbacks) {
          setTimeout(function () { return callbacks.onLoaded(entity); }, 0);
      };
      /**
       * 取消加载特定实体。一般不需要自己编写逻辑，而是使用`entity.canceled`在加载终点丢弃。
       * 注意`entity.canceled`是在这里赋值的，所以一般继承请务必先执行`super.cancel()`！
       */
      ResourceLoader.prototype.cancel = function (entity) {
          entity.canceled = true;
      };
      /**
       * 通过指定资源实体实例化出一个具体的对象。
       */
      ResourceLoader.prototype.instantiate = function (entity, options) {
          throw new Error('Not implemented !');
      };
      /**
       * 释放资源时将会调用，用于自定义释放逻辑。
       */
      ResourceLoader.prototype.release = function (entity) {
      };
      /**
       * 此加载器所关联的后缀，例如`.png`。
       *
       * 注意后面的会覆盖前面的！
       */
      ResourceLoader.EXTENSIONS = [];
      ResourceLoader = __decorate([
          SClass({ className: 'ResourceLoader' })
      ], ResourceLoader);
      return ResourceLoader;
  }(SObject));

  /**
   * 判断一个实例是否为`RigidBodyComponent`。
   */
  function isRigidBodyComponent(value) {
      return value.isRigidBodyComponent;
  }
  /**
   * @hidden
   */
  var vec3Unit = new Vector3(1, 1, 1);
  /**
   * @hidden
   */
  var vec3Zero = new Vector3(0, 0, 0);
  /**
   * 刚体组件类，为Actor添加物理引擎和碰撞检测、拾取的基本功能。
   * **当挂载到Actor后，你可以直接通过`actor.rigidBody`来访问它。**
   *
   * @noInheritDoc
   */
  var RigidBodyComponent = /** @class */ (function (_super) {
      __extends(RigidBodyComponent, _super);
      function RigidBodyComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isRigidBodyComponent = true;
          /**
           * 不要自己使用。
           *
           * @hidden
           */
          _this.needUpdateCollider = false;
          _this._disabled = false;
          _this._sleeping = false;
          _this._valid = false;
          _this._tmpQuat = new Quaternion();
          _this._tmpQuat2 = new Quaternion();
          _this._tmpScale = new Vector3(1, 1, 1);
          _this._tmpScale2 = new Vector3(1, 1, 1);
          /**
           * **不要自己调用！！**
           *
           * @hidden
           */
          _this.handleCollision = function (_a) {
              var body = _a.body, contact = _a.contact;
              var other;
              var self;
              if (body.id === contact.bi.id) {
                  self = contact.bj;
                  other = contact.bi;
              }
              else {
                  self = contact.bi;
                  other = contact.bj;
              }
              if (!_this._valid || !other.component.valid) {
                  return;
              }
              _this.event.trigger('Collision', {
                  selfBody: self.component,
                  otherBody: other.component,
                  selfActor: self.component.getOwner(),
                  otherActor: other.component.getOwner()
              });
          };
          /**
           * **不要自己调用！！**
           *
           * @hidden
           */
          _this.handleBodyEnter = function (selfBody, otherBody) {
              if (!_this._valid || !otherBody.valid) {
                  return;
              }
              _this.event.trigger('BodyEnter', { selfBody: selfBody, otherBody: otherBody, selfActor: selfBody.getOwner(), otherActor: otherBody.getOwner() });
          };
          /**
           * **不要自己调用！！**
           *
           * @hidden
           */
          _this.handleBodyLeave = function (selfBody, otherBody) {
              if (!_this._valid || !otherBody.valid) {
                  return;
              }
              _this.event.trigger('BodyLeave', { selfBody: selfBody, otherBody: otherBody, selfActor: selfBody.getOwner(), otherActor: otherBody.getOwner() });
          };
          /**
           * **不要自己调用！！**
           *
           * @hidden
           */
          _this.handleColliderEnter = function (selfBody, otherBody, selfCollider, otherCollider) {
              if (!_this._valid || !otherBody.valid) {
                  return;
              }
              _this.event.trigger('ColliderEnter', {
                  selfBody: selfBody, otherBody: otherBody, selfCollider: selfCollider, otherCollider: otherCollider,
                  selfActor: selfBody.getOwner(), otherActor: otherBody.getOwner()
              });
          };
          /**
           * **不要自己调用！！**
           *
           * @hidden
           */
          _this.handleColliderLeave = function (selfBody, otherBody, selfCollider, otherCollider) {
              if (!_this._valid || !otherBody.valid) {
                  return;
              }
              _this.event.trigger('ColliderLeave', {
                  selfBody: selfBody, otherBody: otherBody, selfCollider: selfCollider, otherCollider: otherCollider,
                  selfActor: selfBody.getOwner(), otherActor: otherBody.getOwner()
              });
          };
          /**
           * **不要自己调用！！**
           *
           * @hidden
           */
          _this.handleBeforeStep = function (_, forceSync) {
              if (forceSync === void 0) { forceSync = false; }
              if (!_this._valid) {
                  return;
              }
              if (_this._physicStatic && !_this._sleeping && _this.mass !== 0) {
                  _this.setAngularVelocity(vec3Zero);
                  _this.setLinearVelocity(vec3Zero);
              }
              _this.syncTransformToRigidBody(forceSync);
              _this.event.trigger('BeforeStep', _this);
          };
          /**
           * **不要自己调用！！**
           *
           * @hidden
           */
          _this.handleAfterStep = function () {
              if (!_this.valid) {
                  return;
              }
              if (_this._physicStatic || _this._sleeping) {
                  return;
              }
              var transform = _this._owner.transform;
              _this.event.trigger('AfterStep', _this);
              _this.getPhysicWorld().setRootTransform(_this);
              // object has now its world rotation. needs to be converted to local.
              if (_this._owner.parent) {
                  _this.getParentsRotationAndScale();
                  _this._tmpQuat.conjugate();
                  transform.quaternion = _this._tmpQuat.multiply(transform.quaternion);
              }
              // take the position set and make it the absolute position of this object.
              transform.absolutePosition = transform.position;
          };
          /**
           * **不要自己调用！！**
           *
           * @hidden
           */
          _this.handlePick = function (result) {
              _this.event.trigger('Pick', result);
          };
          return _this;
      }
      RigidBodyComponent_1 = RigidBodyComponent;
      Object.defineProperty(RigidBodyComponent.prototype, "rigidBody", {
          /**
           * 获取物理世界的刚体，不需要自己使用。
           *
           * @hidden
           */
          get: function () {
              return this._rigidBody;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RigidBodyComponent.prototype, "valid", {
          /**
           * 刚体当前是否有效，不需要自己使用。
           *
           * @hidden
           */
          get: function () {
              return this._valid;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RigidBodyComponent.prototype, "event", {
          /**
           * RigidBodyComponent的事件管理器。
           */
          get: function () {
              return this._event;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RigidBodyComponent.prototype, "mass", {
          /**
           * 获取重力。
           */
          get: function () {
              return this.getPhysicWorld().getBodyMass(this);
          },
          /**
           * 设置重力。
           */
          set: function (value) {
              this.getPhysicWorld().setBodyMass(this, value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RigidBodyComponent.prototype, "filterGroup", {
          /**
           * 获取filterGroup。
           */
          get: function () {
              return this.getPhysicWorld().getFilterGroup(this);
          },
          /**
           * 设置filterGroup，一个32bits的整数，用于给刚体分组。
           */
          set: function (value) {
              this.getPhysicWorld().setFilterGroup(this, value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RigidBodyComponent.prototype, "filterMask", {
          /**
           * 获取filterMask。
           */
          get: function () {
              return this.getPhysicWorld().getFilterMask(this);
          },
          /**
           * 设置filterMask，一个32bits的整数，用于给分组后的刚体设置碰撞对象范围。
           */
          set: function (value) {
              this.getPhysicWorld().setFilterMask(this, value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RigidBodyComponent.prototype, "friction", {
          /**
           * 获取刚体摩擦力。
           */
          get: function () {
              return this.getPhysicWorld().getBodyFriction(this);
          },
          /**
           * 设置刚体摩擦力。
           */
          set: function (value) {
              this.getPhysicWorld().setBodyFriction(this, value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RigidBodyComponent.prototype, "restitution", {
          /**
           * 获取刚体弹性系数。
           */
          get: function () {
              return this.getPhysicWorld().getBodyRestitution(this);
          },
          /**
           * 设置刚体弹性系数。
           */
          set: function (value) {
              this.getPhysicWorld().setBodyRestitution(this, value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RigidBodyComponent.prototype, "unControl", {
          /**
           * 获取刚体是否处于不可控状态，详见[IRigidBodyComponentState](../interfaces/irigidbodycomponentstate)。
           */
          get: function () {
              return this._unControl;
          },
          /**
           * 设置刚体是否处于不可控状态，详见[IRigidBodyComponentState](../interfaces/irigidbodycomponentstate)。
           */
          set: function (value) {
              this._unControl = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RigidBodyComponent.prototype, "physicStatic", {
          /**
           * 获取刚体是否处于物理静止状态，详见[IRigidBodyComponentState](../interfaces/irigidbodycomponentstate)。
           */
          get: function () {
              return this._physicStatic;
          },
          /**
           * 设置刚体是否处于物理静止状态，详见[IRigidBodyComponentState](../interfaces/irigidbodycomponentstate)。
           */
          set: function (value) {
              this._physicStatic = value;
              this.getPhysicWorld().setBodyType(this, value ? exports.ERigidBodyType.Static : exports.ERigidBodyType.Dynamic);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RigidBodyComponent.prototype, "disabled", {
          /**
           * 刚体组件目前是否停止运作。
           */
          get: function () {
              return this._disabled;
          },
          enumerable: true,
          configurable: true
      });
      RigidBodyComponent.prototype.verifyAdding = function () {
          if (!this.getPhysicWorld()) {
              throw new UnmetRequireException(this, 'Physic world is required for adding RigidBodyComponent !');
          }
          if (this._owner.findComponentByClass(RigidBodyComponent_1)) {
              throw new MemberConflictException(this._owner, 'RigidBodyComponent', this.name, this);
          }
      };
      RigidBodyComponent.prototype.onInit = function (initState) {
          this._unControl = initState.unControl || false;
          this._physicStatic = initState.physicStatic || false;
          this._event.register('Pick');
          this._event.register('Collision');
          this._event.register('BodyEnter');
          this._event.register('BodyLeave');
          this._event.register('ColliderEnter');
          this._event.register('ColliderLeave');
          this._event.register('BeforeStep');
          this._event.register('AfterStep');
          // fixme: hack for performance
          this._owner._rigidBody = this;
      };
      /**
       * 添加到世界，继承请先`super.onAdd()`。
       */
      RigidBodyComponent.prototype.onAdd = function (initState) {
          this._rigidBody = this.getPhysicWorld().createRigidBody(this, initState);
          this.getPhysicWorld().initEvents(this);
          this._valid = true;
          if (initState.sleeping === true) {
              this.sleep();
          }
      };
      /**
       * 从世界中暂时移除，继承请先`super.onUnLink()`。
       */
      RigidBodyComponent.prototype.onUnLink = function () {
          this.disable();
      };
      /**
       * 重连世界，继承请先`super.onReLink()`。
       */
      RigidBodyComponent.prototype.onReLink = function () {
          this.enable();
      };
      /**
       * 销毁，继承请先`super.onDestroy()`。
       */
      RigidBodyComponent.prototype.onDestroy = function () {
          var _this = this;
          this._valid = false;
          var physicWorld = this.getPhysicWorld();
          setTimeout(function () { return physicWorld.removeRigidBody(_this); }, 0);
          if (this._owner.rigidBody === this) {
              this._owner._rigidBody = null;
          }
      };
      /**
       * 暂时使得刚体失去效应，可以用`enable`恢复。
       */
      RigidBodyComponent.prototype.disable = function () {
          this.getPhysicWorld().disableRigidBody(this);
          this._disabled = true;
      };
      /**
       * 使得一个暂时失去效应的刚体恢复。
       */
      RigidBodyComponent.prototype.enable = function () {
          this.getPhysicWorld().enableRigidBody(this);
          this._disabled = false;
      };
      /**
       * 获取质心。
       */
      RigidBodyComponent.prototype.getMassCenter = function () {
          return this._owner.transform.position;
      };
      /**
       * 设置刚体的父级Actor的`transform`。
       */
      RigidBodyComponent.prototype.setRootTransform = function () {
          this.getPhysicWorld().setRootTransform(this);
          return this;
      };
      /**
       * 设置刚体的`transform`。
       */
      RigidBodyComponent.prototype.setRigidBodyTransform = function (newPosition, newRotation) {
          this.getPhysicWorld().setRigidBodyTransform(this, newPosition, newRotation);
          return this;
      };
      /**
       * 设置线速度。
       */
      RigidBodyComponent.prototype.setLinearVelocity = function (velocity) {
          this.getPhysicWorld().setLinearVelocity(this, velocity);
          return this;
      };
      /**
       * 设置角速度。
       */
      RigidBodyComponent.prototype.setAngularVelocity = function (velocity) {
          this.getPhysicWorld().setAngularVelocity(this, velocity);
          return this;
      };
      /**
       * 获取线速度。
       */
      RigidBodyComponent.prototype.getLinearVelocity = function () {
          return this.getPhysicWorld().getLinearVelocity(this);
      };
      /**
       * 获取角速度。
       */
      RigidBodyComponent.prototype.getAngularVelocity = function () {
          return this.getPhysicWorld().getAngularVelocity(this);
      };
      /**
       * 使刚体进入睡眠状态，不会触发任何碰撞事件，但可以正确响应拾取操作。
       */
      RigidBodyComponent.prototype.sleep = function () {
          this.getPhysicWorld().sleepBody(this);
          this._sleeping = true;
          return this;
      };
      /**
       * 唤醒刚体。
       */
      RigidBodyComponent.prototype.wakeUp = function () {
          this.getPhysicWorld().wakeUpBody(this);
          this._sleeping = false;
          return this;
      };
      /**
       * 强制同步物理刚体的transform到组件父级Actor。
       */
      RigidBodyComponent.prototype.forceSync = function () {
          this.handleBeforeStep(null, true);
          return this;
      };
      RigidBodyComponent.prototype.getParentsRotationAndScale = function (updateScale) {
          if (updateScale === void 0) { updateScale = true; }
          var parent = this._owner.parent;
          this._tmpQuat.set(0, 0, 0, 1);
          if (updateScale) {
              this._tmpScale.set(1, 1, 1);
          }
          while (parent && !isLevel(parent)) {
              var actor = parent.getOwner();
              this._tmpQuat2.copy(actor.transform.quaternion);
              this._tmpQuat.multiply(this._tmpQuat2);
              if (updateScale) {
                  this._tmpScale2.copy(actor.transform.scale);
                  this._tmpScale.multiply(this._tmpScale2);
              }
              parent = actor.parent;
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      RigidBodyComponent.prototype.getCurrentTransform = function () {
          var transform = this._owner.transform;
          transform.updateMatrixWorld(true);
          if (this._owner.parent && !isLevel(this._owner.parent)) {
              this.getParentsRotationAndScale(true);
              this._tmpQuat.multiply(transform.quaternion);
              this._tmpScale.multiply(transform.scale);
          }
          else {
              this._tmpQuat.copy(transform.quaternion);
              this._tmpScale.copy(transform.scale);
          }
          return [transform.absolutePosition, this._tmpQuat, this._tmpScale];
      };
      RigidBodyComponent.prototype.syncTransformToRigidBody = function (forceSync) {
          // todo: bug: change this.box.transform.position & change this.box.transform.scale.x = .3;
          var transform = this._owner.transform;
          if (this.needUpdateCollider) {
              this.getPhysicWorld().updateBounding(this);
              this.needUpdateCollider = false;
          }
          if (!forceSync && this._unControl) {
              return;
          }
          if (forceSync) {
              transform.updateMatrixWorld(true);
          }
          var updateScale = (forceSync && !transform.scale.equals(vec3Unit)) || !this._tmpScale.equals(transform.scale);
          if (this._owner.parent && !isLevel(this._owner.parent)) {
              this.getParentsRotationAndScale(updateScale);
              this._tmpQuat.multiply(transform.quaternion);
              if (updateScale) {
                  this._tmpScale.multiply(transform.scale);
              }
          }
          else {
              this._tmpQuat.copy(transform.quaternion);
              if (updateScale) {
                  this._tmpScale.copy(transform.scale);
              }
          }
          this.getPhysicWorld().setRigidBodyTransform(this, transform.absolutePosition, this._tmpQuat, updateScale ? this._tmpScale : null);
          if (forceSync) {
              this.getPhysicWorld().updateBounding(this);
          }
      };
      var RigidBodyComponent_1;
      RigidBodyComponent = RigidBodyComponent_1 = __decorate([
          SClass({ className: 'RigidBodyComponent', classType: 'RigidBody' })
      ], RigidBodyComponent);
      return RigidBodyComponent;
  }(Component));

  /**
   * 判断一个实例是否为`ColliderComponent`。
   */
  function isColliderComponent(value) {
      return value.isColliderComponent;
  }
  /**
   * 碰撞体组件基类。一般不自己使用，而是交由继承的类实现多态。
   *
   * @template IStateTypes 初始化参数类型，一般交由由继承的类定义实现多态。
   * @noInheritDoc
   */
  var ColliderComponent = /** @class */ (function (_super) {
      __extends(ColliderComponent, _super);
      function ColliderComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isColliderComponent = true;
          _this._type = exports.EColliderType.Null;
          return _this;
      }
      Object.defineProperty(ColliderComponent.prototype, "collider", {
          /**
           * 获取物理世界的碰撞体，不要自己操作。
           *
           * @hidden
           */
          get: function () {
              return this._collider;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ColliderComponent.prototype, "type", {
          /**
           * 获取碰撞体类型。
           */
          get: function () {
              return this._type;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ColliderComponent.prototype, "initState", {
          /**
           * 获取初始化参数实例引用。
           */
          get: function () {
              return this._initState;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ColliderComponent.prototype, "isTrigger", {
          /**
           * 获取是否是触发器。
           */
          get: function () {
              return this.getPhysicWorld().getColliderIsTrigger(this);
          },
          // set friction(value: number) {
          //   this.getPhysicWorld().setColliderFriction(this, value);
          // }
          // get friction() {
          //   return this.getPhysicWorld().getColliderFriction(this);
          // }
          // set restitution(value: number) {
          //   this.getPhysicWorld().setColliderRestitution(this, value);
          // }
          // get restitution() {
          //   return this.getPhysicWorld().getColliderRestitution(this);
          // }
          /**
           * 设置是否是触发器。
           */
          set: function (value) {
              this.getPhysicWorld().setColliderIsTrigger(this, value);
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 开发环境下，验证可添加性。
       */
      ColliderComponent.prototype.verifyAdding = function () {
          var rigidBody = this._owner.rigidBody;
          if (!rigidBody) {
              throw new BreakGuardException(this, 'RigidBodyComponent must be added before adding ColliderComponent !');
          }
      };
      /**
       * 添加到世界，继承请先`super.onInit()`。
       */
      ColliderComponent.prototype.onAdd = function (initState) {
          var rigidBody = this._owner.rigidBody;
          var options = this._initState = initState || this.getDefaultOptions();
          options.offset = options.offset || [0, 0, 0];
          options.quaternion = options.quaternion || [0, 0, 0, 1];
          this._collider = this.getPhysicWorld().createCollider(rigidBody, this, { type: this._type, options: options });
      };
      /**
       * 销毁，继承请先`super.onInit()`。
       */
      ColliderComponent.prototype.onDestroy = function () {
          var _this = this;
          var physicWorld = this.getPhysicWorld();
          setTimeout(function () {
              if (_this._owner && _this._owner.rigidBody) {
                  physicWorld.removeCollider(_this._owner.rigidBody, _this);
              }
          }, 0);
      };
      ColliderComponent.prototype.getDefaultOptions = function () {
          return null;
      };
      ColliderComponent = __decorate([
          SClass({ className: 'ColliderComponent' })
      ], ColliderComponent);
      return ColliderComponent;
  }(Component));

  /**
   * 判断一个实例是否为`BoxColliderComponent`。
   */
  function isBoxColliderComponent(value) {
      return value.isBoxColliderComponent;
  }
  /**
   * 盒碰撞体，最常见的碰撞体之一。
   *
   * @noInheritDoc
   */
  var BoxColliderComponent = /** @class */ (function (_super) {
      __extends(BoxColliderComponent, _super);
      function BoxColliderComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isBoxColliderComponent = true;
          _this._type = exports.EColliderType.Box;
          return _this;
      }
      BoxColliderComponent.prototype.getDefaultOptions = function () {
          return null;
      };
      BoxColliderComponent = __decorate([
          SClass({ className: 'BoxColliderComponent', classType: 'Collider' })
      ], BoxColliderComponent);
      return BoxColliderComponent;
  }(ColliderComponent));

  /**
   * 判断一个实例是否为`SphereColliderComponent`。
   */
  function isSphereColliderComponent(value) {
      return value.isSphereColliderComponent;
  }
  /**
   * 球碰撞体，最常见的碰撞体之一。
   *
   * @noInheritDoc
   */
  var SphereColliderComponent = /** @class */ (function (_super) {
      __extends(SphereColliderComponent, _super);
      function SphereColliderComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isSphereColliderComponent = true;
          _this._type = exports.EColliderType.Sphere;
          return _this;
      }
      SphereColliderComponent.prototype.getDefaultOptions = function () {
          return null;
      };
      SphereColliderComponent = __decorate([
          SClass({ className: 'SphereColliderComponent', classType: 'Collider' })
      ], SphereColliderComponent);
      return SphereColliderComponent;
  }(ColliderComponent));

  /**
   * @File   : Constants.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 10/9/2018, 11:43:07 PM
   * @Description:
   */
  /**
   * WebGL相关的静态约束。
   */
  var Constants = Hilo3d$2.constants;

  /**
   * 判断一个实例是否为`Texture`。
   */
  function isTexture(value) {
      return value.isTexture;
  }
  var Texture = /** @class */ (function (_super) {
      __extends(Texture, _super);
      function Texture() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Texture;
  }(Hilo3d$2.Texture));

  /**
   * @hidden
   */
  function isIMaterialUniform(value) {
      return !value.substr && 'value' in value;
  }
  /**
   * @hidden
   */
  function isIMaterialAttribute(value) {
      return value.name !== undefined;
  }
  /**
   * @hidden
   */
  function isNumber(value) {
      return !!value.toPrecision;
  }
  /**
   * @hidden
   */
  function isNumberArray(value) {
      return !!value.push;
  }
  /**
   * @hidden
   */
  function isString(value) {
      return !!value.toLowerCase;
  }
  /**
   * 判断一个实例是否为`RawShaderMaterial`。
   */
  function isRawShaderMaterial(value) {
      return value.isRawShaderMaterial;
  }
  /**
   * 纯净的自定义材质类，允许你创建属于自己的Shader材质。
   *
   * @noInheritDoc
   */
  var RawShaderMaterial = /** @class */ (function (_super) {
      __extends(RawShaderMaterial, _super);
      function RawShaderMaterial(options) {
          var _this = _super.call(this, { useHeaderCache: true }) || this;
          _this.isRawShaderMaterial = true;
          /**
           * 类名。
           */
          _this.className = 'RawShaderMaterial';
          /**
           * 当材质作为模型中的自定义材质时，每次创建一个新模型实例时是否要对材质进行`clone`。
           * 这通常用于可能有多个实例的、具有材质动画的模型。
           */
          _this.cloneForInst = false;
          _this._chuckDefines = [];
          _this._chuckVs = [];
          _this._chuckFs = [];
          _this._uniforms = {};
          _this._initOptions = options;
          if (!options) {
              return _this;
          }
          _this.className = _this.constructor.CLASS_NAME.value;
          options.shaderCacheId = options.id;
          if (!options.id && _this.className !== 'RawShaderMaterial' && _this.className !== 'ShaderMaterial') {
              options.shaderCacheId = _this.className;
          }
          delete options.id;
          _this.init(options);
          return _this;
      }
      RawShaderMaterial_1 = RawShaderMaterial;
      /**
       * 获取特定的Uniform实例引用，可以获取后直接用`value`来设置它。
       */
      RawShaderMaterial.prototype.getUniform = function (key) {
          return this._uniforms[key];
      };
      /**
       * 直接设置某个特定uniform的`value`。
       */
      RawShaderMaterial.prototype.setUniform = function (key, value) {
          var uniform = this._uniforms[key];
          if (uniform.value === null || uniform.value === undefined) {
              this.initUniform(key, { value: value });
              return this;
          }
          uniform.value = value;
          return this;
      };
      /**
       * 通过一个回调函数以及其传入的uniform当前值，设置某个特定uniform的`value`。
       */
      RawShaderMaterial.prototype.changeUniform = function (key, handler) {
          var value = handler(this._uniforms[key].value);
          return this.setUniform(key, value);
      };
      RawShaderMaterial.prototype.init = function (options) {
          if (!options.id) {
              delete options.id;
          }
          Object.assign(this, options);
          this.uniforms = {};
          this.attributes = {};
          this.vs = '';
          this.fs = '';
          this.initChunks(options);
          this.initAttributes(options);
          this.initUniforms(options);
          this.initShaders(options);
      };
      RawShaderMaterial.prototype.initChunks = function (options) {
          options.attributes = options.attributes || {};
          options.uniforms = options.uniforms || {};
          if (options.chunks) {
              var length_1 = options.chunks.length;
              for (var index = 0; index < length_1; index += 1) {
                  var chuck = options.chunks[index];
                  if (Debug.devMode) {
                      this.checkChuck(chuck, options);
                  }
                  Object.assign(options.attributes, chuck.attributes);
                  Object.assign(options.uniforms, chuck.uniforms);
                  if (chuck.vs) {
                      this._chuckVs.push(chuck.vs);
                      if (chuck.isMain && chuck.hasVsOut) {
                          this._mainVsChunkName = chuck.vsEntryName;
                      }
                  }
                  if (chuck.fs) {
                      this._chuckFs.push(chuck.fs);
                      if (chuck.isMain && chuck.hasFsOut) {
                          this._mainFsChunkName = chuck.fsEntryName;
                      }
                  }
                  if (chuck.defines) {
                      this._chuckDefines.push(chuck.defines);
                  }
              }
          }
          if (options.vs) {
              if (isString(options.vs)) {
                  this._chuckVs.push({ main: options.vs, header: '' });
              }
              else {
                  this._chuckVs.push(options.vs);
              }
              this._mainVsChunkName = '';
          }
          if (options.fs) {
              if (isString(options.fs)) {
                  this._chuckFs.push({ main: options.fs, header: '' });
              }
              else if (options.fs) {
                  this._chuckFs.push(options.fs);
              }
              this._mainFsChunkName = '';
          }
          if (options.defines) {
              this._chuckDefines.push(options.defines);
          }
      };
      RawShaderMaterial.prototype.checkChuck = function (chuck, options) {
          var requiredUniforms = chuck.requiredUniforms, requiredAttributes = chuck.requiredAttributes, uniforms = chuck.uniforms, attributes = chuck.attributes;
          // check requiredAttributes
          for (var _i = 0, requiredAttributes_1 = requiredAttributes; _i < requiredAttributes_1.length; _i++) {
              var key = requiredAttributes_1[_i];
              if (!options.attributes[key]) {
                  throw new Error("Shader chuck \"" + chuck.name + "\" requires attribute \"" + key + "\" !");
              }
          }
          // check requiredUniforms
          for (var _a = 0, requiredUniforms_1 = requiredUniforms; _a < requiredUniforms_1.length; _a++) {
              var key = requiredUniforms_1[_a];
              if (!options.uniforms[key]) {
                  throw new Error("Shader chuck \"" + chuck.name + "\" requires uniform \"" + key + "\" !");
              }
          }
          // check conflict
          for (var key in attributes) {
              if (options.attributes[key]) {
                  throw new Error("Attribute \"" + key + "\" is already existed, re-defined in shader chuck \"" + chuck.name + "\" !");
              }
          }
          for (var key in uniforms) {
              if (options.uniforms[key]) {
                  throw new Error("Uniform \"" + key + "\" is already existed, re-defined in shader chuck \"" + chuck.name + "\" !");
              }
          }
      };
      RawShaderMaterial.prototype.initAttributes = function (options) {
          var attributes = options.attributes;
          this.attributes = {};
          var _loop_1 = function (key) {
              var attribute = attributes[key];
              if (!isIMaterialAttribute(attribute)) {
                  this_1.attributes[key] = attribute;
              }
              else {
                  this_1.attributes[key] = {
                      get: function (mesh) { return mesh.geometry[attribute.name]; }
                  };
              }
          };
          var this_1 = this;
          for (var key in attributes) {
              _loop_1(key);
          }
      };
      RawShaderMaterial.prototype.initUniforms = function (options) {
          var uniforms = options.uniforms;
          for (var key in uniforms) {
              var uniform = uniforms[key];
              if (!isIMaterialUniform(uniform)) {
                  this.uniforms[key] = uniform;
                  continue;
              }
              this.initUniform(key, uniform);
          }
      };
      RawShaderMaterial.prototype.initUniform = function (key, uniform) {
          var _uniforms = this._uniforms;
          if (uniform.isGlobal) {
              _uniforms[key] = uniform;
          }
          else {
              _uniforms[key] = { value: uniform.value };
          }
          var value = _uniforms[key].value;
          this.isDirty = true;
          if (value === null || value === undefined) {
              this.uniforms[key] = {
                  get: function () {
                      return null;
                  }
              };
              return;
          }
          if (isTexture(value)) {
              this.uniforms[key] = {
                  get: function (_, __, programInfo) {
                      return Hilo3d$2.semantic.handlerTexture(_uniforms[key].value, programInfo.textureIndex);
                  }
              };
              return;
          }
          if (isNumber(value) || isNumberArray(value)) {
              this.uniforms[key] = {
                  get: function () {
                      return _uniforms[key].value;
                  }
              };
              return;
          }
          this.uniforms[key] = {
              get: function () {
                  return _uniforms[key].value.elements;
              }
          };
      };
      RawShaderMaterial.prototype.initShaders = function (options) {
          var definesChuck = this._chuckDefines.join('\n') + '\n';
          this.vs += definesChuck;
          this.fs += definesChuck;
          this.vs += this.generateShader(this._chuckVs);
          this.fs += this.generateShader(this._chuckFs);
          if (this._mainVsChunkName) {
              this.vs += "\nvoid main() {\ngl_Position = " + this._mainVsChunkName + "();\n}\n";
          }
          if (this._mainFsChunkName) {
              this.fs += "\nvoid main() {\ngl_FragColor = " + this._mainFsChunkName + "();\n}\n";
          }
          this.initCommonOptions(options);
      };
      /**
       * 不需要自己使用！
       *
       * @hidden
       */
      RawShaderMaterial.prototype.initCommonOptions = function (options, fromLoader) {
          if (fromLoader === void 0) { fromLoader = false; }
          if (options.alphaMode && (!fromLoader || !this._initOptions.alphaMode)) {
              switch (options.alphaMode) {
                  case 'BLEND':
                      this.transparent = true;
                      this.blend = true;
                      if (!fromLoader) {
                          this.blendSrc = options.blendSrc || Constants.SRC_ALPHA;
                          this.blendDst = options.blendDst || Constants.ONE_MINUS_SRC_ALPHA;
                          this.blendEquationAlpha = options.blendEquationAlpha || Constants.FUNC_ADD;
                      }
                      break;
                  case 'MASK':
                      if ('alphaCutoff' in options) {
                          this.alphaCutoff = options.alphaCutoff;
                      }
                      else {
                          this.alphaCutoff = 0.5;
                      }
                      break;
                  case 'OPAQUE':
                  default:
                      this.ignoreTranparent = true;
                      break;
              }
              this._initOptions.alphaMode = options.alphaMode;
          }
          if ((options.doubleSided && !fromLoader) || (options.doubleSided && !this._initOptions.doubleSided)) {
              this.side = Constants.FRONT_AND_BACK;
              this._initOptions.doubleSided = true;
          }
          this.lightType = options.unlit ? 'NONE' : 'ENABLE';
      };
      RawShaderMaterial.prototype.generateShader = function (chucks) {
          var headerCode = '';
          var mainCode = '';
          var length = chucks.length;
          for (var index = 0; index < length; index += 1) {
              var _a = chucks[index], header = _a.header, main = _a.main;
              headerCode += header + '\n';
              mainCode += main + '\n';
          }
          return headerCode + '\n' + mainCode + '\n';
      };
      /**
       * 获取定制的渲染参数，一般用于宏开关。
       */
      RawShaderMaterial.prototype.getCustomRenderOption = function (options) {
      };
      /**
       * clone一个材质，一般不会重新编译program，但会生成一份新的`uniforms`。
       */
      RawShaderMaterial.prototype.clone = function () {
          var material = new this.constructor(this._initOptions);
          material.initCommonOptions(this._initOptions);
          return material;
      };
      RawShaderMaterial.prototype.destroyTextures = function () {
          _super.prototype.destroyTextures.call(this);
          for (var propName in this._uniforms) {
              var texture = this._uniforms[propName].value;
              if (texture && isTexture(texture)) {
                  texture.destroy();
              }
          }
      };
      var RawShaderMaterial_1;
      /**
       * 类名。
       */
      RawShaderMaterial.CLASS_NAME = new SName('RawShaderMaterial');
      RawShaderMaterial = RawShaderMaterial_1 = __decorate([
          SMaterial({ className: 'RawShaderMaterial' })
      ], RawShaderMaterial);
      return RawShaderMaterial;
  }(Hilo3d$2.ShaderMaterial));

  /**
   * 判断一个实例是否为`SceneActor`。
   */
  function isSceneActor$1(value) {
      return value.isSceneActor;
  }
  /**
   * 场景Actor类，如果你想将一个`Actor`放入World(Level)，那么它必须为`SceneActor`。
   * 简而言之，这就是一个可以被赋予`transform`的Actor，它的根组件也必须为`SceneComponent`。
   *
   * @template IOptionTypes 初始化参数类型，必须继承自[ISceneComponentState](../interfaces/iscenecomponentstate)。
   * @template TRootComponent 根级组件类型，必须继承自[ISceneComponent](../interfaces/iscenecomponent)。
   * @noInheritDoc
   */
  var SceneActor = /** @class */ (function (_super) {
      __extends(SceneActor, _super);
      function SceneActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isSceneActor = true;
          /**
           * 指定此实例是否为**持久的**，如果是，则此实例可以在关卡切换时被继承，或者在特殊状况时再世界切换时被继承。
           */
          _this.persistent = false;
          _this._rigidBody = null;
          _this._animator = null;
          _this._controller = null;
          return _this;
      }
      Object.defineProperty(SceneActor.prototype, "parent", {
          /**
           * 获取自身的父级实例，根据情况不同可能有不同的类型，一般不需要自己使用。
           */
          get: function () {
              return this._parent;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneActor.prototype, "transform", {
          /**
           * 获取自身的`transform`实例引用，本质上是根组件的一个代理。
           */
          get: function () {
              return this._root;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneActor.prototype, "rigidBody", {
          /**
           * 获取自身的刚体组件实例引用，需要开启物理引擎并初始化刚体，详见[RigidBodyComponent](../rigidbodycomponent)。
           */
          get: function () {
              return this._rigidBody;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneActor.prototype, "animator", {
          /**
           * 获取自身的动画组件实例引用，需要有模型动画或自己创建，详见[AnimatorComponent](../animatorcomponent)。
           */
          get: function () {
              return this._animator;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneActor.prototype, "layers", {
          /**
           * 图层属性，详见[Layers](../layers)。
           */
          get: function () {
              return this._root.layers;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneActor.prototype, "visible", {
          /**
           * 获取是否可见，代理到根组件的同属性。详见`SceneComponent`的同属性。
           */
          get: function () {
              return this.root.visible;
          },
          /**
           * 设置是否可见，代理到根组件的同属性。详见`SceneComponent`的同属性。
           */
          set: function (value) {
              this.root.visible = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneActor.prototype, "isStatic", {
          /**
           * 获取是否为静态对象，代理到根组件的同属性。详见`SceneComponent`的同属性。
           */
          get: function () {
              return this._root.isStatic;
          },
          /**
           * 设置是否为静态对象，代理到根组件的同属性。详见`SceneComponent`的同属性。
           */
          set: function (value) {
              this._root.isStatic = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SceneActor.prototype, "needReleaseGlRes", {
          /**
           * 代理到根节点的同名属性，决定其下所有SceneComponent销毁时是否要同时释放Gl资源。
           */
          get: function () {
              return this._root.needReleaseGlRes;
          },
          /**
           * 代理到根节点的同名属性，决定其下所有SceneComponent销毁时是否要同时释放Gl资源。
           */
          set: function (value) {
              this._root.needReleaseGlRes = value;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 生命周期，创建默认的`SceneComponent`根组件，可以覆盖。
       */
      SceneActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', SceneComponent, options);
      };
      /**
       * 专属于`SceneActor`的生命周期，一般用于从GlTF模型中实例化对象(使用`resource.instantiate`方法)的情景。
       * 如果不是从资源中实例化的，将按顺序正常触发。
       * 此回调将在真正完成实例化后被触发，时机在`onAdd`之后，确保实例已经完全就绪（包括世界矩阵的首次运算）。
       */
      SceneActor.prototype.onInstantiate = function (options) {
      };
      /**
       * 取消链接，继承请先`super.onUnLink()`。
       */
      SceneActor.prototype.onUnLink = function () {
          this._root.hiloNode.removeFromParent();
      };
      /**
       * 重新链接，继承请先`super.onReLink()`。
       */
      SceneActor.prototype.onReLink = function (parent) {
          if (!isSceneActor$1(parent)) {
              this._root.hiloNode.addTo(parent.game.hiloStage);
          }
      };
      /**
       * 获取自身的`Controller`实例，涉及到玩家系统，详见[Player](./player)。
       */
      SceneActor.prototype.getController = function () {
          return this._controller;
      };
      /**
       * 获取根组件的的包围盒(AABB)信息。
       * @param bounds 当前计算的包围盒信息，可用于节省开销
       * @param currentMatrix 当前计算的矩阵，可用于节省开销
       */
      SceneActor.prototype.getBounds = function (bounds, currentMatrix) {
          return this._root.getBounds(bounds, currentMatrix);
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      SceneActor.prototype.added = function () {
          if (this._inWorld) {
              return;
          }
          this._inWorld = true;
          if (isLevel(this._parent)) {
              this._game.hiloStage.addChild(this._root.hiloNode);
          }
          this._components.forEach(function (component) {
              component.added();
          });
          try {
              this.onAdd(this._initOptions);
          }
          catch (error) {
              throwException(error, this);
          }
          if (!(this._initOptions && this._initOptions.__fromGlTF)) {
              this.instantiated();
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      SceneActor.prototype.instantiated = function () {
          this._root.updateMatrixWorld(true);
          try {
              this.onInstantiate(this._initOptions);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      SceneActor.prototype.destroy = function () {
          if (this._controller) {
              this._controller.dispossessActor();
          }
          if (this._parent && !isLevel(this._parent)) {
              this._parent.removeActor(this);
          }
          _super.prototype.destroy.call(this);
      };
      /**
       * 修改自身的父级实例，通常用于Actor的复用。
       * **注意修改了之后自身的渲染节点也会重新挂载！**
       */
      SceneActor.prototype.changeParent = function (parent) {
          var game = this._game;
          if (isLevel(parent) || isWorld(parent)) {
              if (isLevel(this._parent)) {
                  return this;
              }
              this._parent.autoDestroyActor = false;
              this._parent.removeFromParent();
              game.hiloStage.addChild(this._root.hiloNode);
              this._parent = game.level;
              return this;
          }
          if (isLevel(this._parent)) {
              parent.addChild(this);
              return this;
          }
          this._parent.autoDestroyActor = false;
          this._parent.removeFromParent();
          parent.addChild(this);
          return this;
      };
      /**
       * 修改自身的朝向，直接代理到根组件的同名方法。
       */
      SceneActor.prototype.lookAt = function (target) {
          this._root.lookAt(target);
          return this;
      };
      SceneActor = __decorate([
          SClass({ className: 'SceneActor' })
      ], SceneActor);
      return SceneActor;
  }(Actor));

  /**
   * 判断一个实例是否为`PrimitiveComponent`。
   */
  function isPrimitiveComponent(value) {
      return value.isPrimitiveComponent;
  }
  /**
   * 判断一个实例是否为`PrimitiveActor`。
   */
  function isPrimitiveActor(value) {
      return isSceneActor$1(value) && isPrimitiveComponent(value.root);
  }
  /**
   * 图元Component类，是拥有图元的组件的基类。
   * 这个Component拥有将Mesh添加到World中的能力，基本等同于模型，但一般不直接使用，而是使用其派生的类。
   *
   * @template IStateTypes 初始化参数类型，必须继承自[IPrimitiveComponentState](../interfaces/iprimitivecomponentstate)。
   * @noInheritDoc
   */
  var PrimitiveComponent = /** @class */ (function (_super) {
      __extends(PrimitiveComponent, _super);
      function PrimitiveComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isPrimitiveComponent = true;
          _this.needUpdateAndDestroy = false;
          _this.__multiPrimitive = false;
          return _this;
      }
      /**
       * 初始化，继承请先`super.onInit()`。
       */
      PrimitiveComponent.prototype.onInit = function (state) {
          _super.prototype.onInit.call(this, state);
          this.__multiPrimitive = state.__doNotUseMultiPrimitiveYourself && state.__doNotUseMultiPrimitiveYourself.length > 1;
          if (state.material && state.material.cloneForInst) {
              state.material = state.material.clone();
          }
          var defaultMesh = this._mesh = this.onCreateMesh(state);
          this._mesh.__forceUseParentWorldMatrix = true;
          if (this.__multiPrimitive) {
              this._list = [];
              this._table = {};
              var length_1 = state.__doNotUseMultiPrimitiveYourself.length;
              for (var index = 0; index < length_1; index += 1) {
                  var _a = state.__doNotUseMultiPrimitiveYourself[index], geometry = _a.geometry, material = _a.material;
                  var mesh = index === 0 ? defaultMesh : this.onCreateMesh({
                      geometry: geometry,
                      material: material.cloneForInst ? material.clone() : material
                  });
                  mesh.__forceUseParentWorldMatrix = false;
                  this._list.push(mesh);
                  this._table[material.name] = mesh;
                  if (state.frustumTest !== undefined) {
                      mesh.frustumTest = state.frustumTest;
                  }
                  this._node.addChild(mesh);
              }
          }
          else {
              if (state.frustumTest !== undefined) {
                  this._mesh.frustumTest = state.frustumTest;
              }
              this._node.addChild(this._mesh);
          }
          var root = this.getRoot();
          if (root) {
              root.hiloNode.addChild(this._node);
          }
      };
      Object.defineProperty(PrimitiveComponent.prototype, "material", {
          /**
           * 获取材质实例引用。
           */
          get: function () {
              return this._mesh.material;
          },
          /**
           * 设置材质。
           */
          set: function (material) {
              this._mesh.material = material;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 当GlTF模型数据中一个Mesh拥有多个Primitive时（对应Unity中一个GameObject拥有多个材质测场景），为了进行对应，一个PrimitiveComponent可能拥有多个Mesh。
       * 这种状况时，你可以通过`materialName`来修改一个具体的材质。**但不提供自行创建这种特殊组件的方式，谨慎使用！务必清楚多材质Mesh等价于多个Mesh！**
       */
      PrimitiveComponent.prototype.setMaterial = function (value, materialName) {
          if (!this.__multiPrimitive) {
              this._mesh.material = value;
              return this;
          }
          if (materialName && this._table[materialName]) {
              this._table[materialName].material = value;
          }
          return this;
      };
      /**
       * 当GlTF模型数据中一个Mesh拥有多个Primitive时（对应Unity中一个GameObject拥有多个材质测场景），为了进行对应，一个PrimitiveComponent可能拥有多个Mesh。
       * 这种状况时，你可以通过`materialName`来获取一个具体的材质。**但不提供自行创建这种特殊组件的方式，谨慎使用！务必清楚多材质Mesh等价于多个Mesh！**
       */
      PrimitiveComponent.prototype.getMaterial = function (materialName) {
          if (!materialName || !this.__multiPrimitive) {
              return this._mesh.material;
          }
          if (this._table[materialName]) {
              return this._table[materialName].material;
          }
          return null;
      };
      /**
       * 当GlTF模型数据中一个Mesh拥有多个Primitive时（对应Unity中一个GameObject拥有多个材质测场景），为了进行对应，一个PrimitiveComponent可能拥有多个Mesh。
       * 这种状况时，你可以通过此方法获取所有材质。**但不提供自行创建这种特殊组件的方式，谨慎使用！务必清楚多材质Mesh等价于多个Mesh！**
       */
      PrimitiveComponent.prototype.getMaterials = function () {
          return (!this.__multiPrimitive ? [this.material] : this._list.map(function (mesh) { return mesh.material; }));
      };
      Object.defineProperty(PrimitiveComponent.prototype, "geometry", {
          /**
           * 设置几何体实例引用。
           */
          get: function () {
              return this._mesh.geometry;
          },
          /**
           * 获取几何体实例引用。
           */
          set: function (geometry) {
              this._mesh.geometry = geometry;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 适用于多图元（材质）Mesh，详细基本等同于`setMaterial`方法。
       */
      PrimitiveComponent.prototype.setGeometry = function (value, materialName) {
          if (!this.__multiPrimitive) {
              this._mesh.geometry = value;
              return this;
          }
          if (materialName && this._table[materialName]) {
              this._table[materialName].geometry = value;
          }
          return this;
      };
      /**
       * 适用于多图元（材质）Mesh，详细基本等同于`getMaterial`方法。
       */
      PrimitiveComponent.prototype.getGeometry = function (materialName) {
          if (!materialName || !this.__multiPrimitive) {
              return this._mesh.geometry;
          }
          if (this._table[materialName]) {
              return this._table[materialName].geometry;
          }
          return null;
      };
      /**
       * 适用于多图元（材质）Mesh。
       */
      PrimitiveComponent.prototype.getSubMesh = function (materialName) {
          if (!materialName || !this.__multiPrimitive) {
              return this._mesh;
          }
          if (this._table[materialName]) {
              return this._table[materialName];
          }
          return null;
      };
      Object.defineProperty(PrimitiveComponent.prototype, "frustumTest", {
          /**
           * 是否需要视椎体裁剪。
           */
          get: function () {
              return this._mesh.frustumTest;
          },
          /**
           * 是否需要视椎体裁剪。
           */
          set: function (value) {
              this.setMeshProperty('frustumTest', value);
          },
          enumerable: true,
          configurable: true
      });
      PrimitiveComponent.prototype.setMeshProperty = function (name, value) {
          if (this.__multiPrimitive) {
              var length_2 = this._list.length;
              for (var index = 0; index < length_2; index += 1) {
                  this._list[index][name] = value;
              }
              return;
          }
          this._mesh[name] = value;
      };
      PrimitiveComponent.prototype.onCreateMesh = function (state) {
          return null;
      };
      PrimitiveComponent = __decorate([
          SClass({ className: 'PrimitiveComponent' })
      ], PrimitiveComponent);
      return PrimitiveComponent;
  }(SceneComponent));

  /**
   * 判断一个实例是否为`Mesh`。
   */
  function isMesh(value) {
      return value.isMesh;
  }
  /**
   * 曲面类。封装几何体`Geometry`和材质`Material`。
   */
  var Mesh = /** @class */ (function (_super) {
      __extends(Mesh, _super);
      function Mesh() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      /**
       * 获取指定类型的材质。
       */
      Mesh.prototype.getMaterial = function () {
          return this.material;
      };
      /**
       * 克隆。
       */
      Mesh.prototype.clone = function (isChild) {
          return _super.prototype.clone.call(this, isChild);
      };
      return Mesh;
  }(Hilo3d$2.Mesh));

  /**
   * 判断一个实例是否为`StaticMeshComponent`。
   */
  function isStaticMeshComponent(value) {
      return value.isStaticMeshComponent;
  }
  /**
   * 判断一个实例是否为`StaticMeshActor`。
   */
  function isStaticMeshActor(value) {
      return isSceneActor(value) && isStaticMeshComponent(value.root);
  }
  /**
   * 静态Component类，承载纯粹静态的模型。
   *
   * @template IStateTypes 初始化参数类型，必须继承自[IStaticMeshComponentState](../interfaces/istaticmeshcomponentstate)。
   * @noInheritDoc
   */
  var StaticMeshComponent = /** @class */ (function (_super) {
      __extends(StaticMeshComponent, _super);
      function StaticMeshComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isStaticMeshComponent = true;
          return _this;
      }
      StaticMeshComponent.prototype.onCreateMesh = function (state) {
          return new Mesh({
              geometry: state ? state.geometry : null,
              material: state ? state.material : null
          });
      };
      StaticMeshComponent = __decorate([
          SClass({ className: 'StaticMeshComponent' })
      ], StaticMeshComponent);
      return StaticMeshComponent;
  }(PrimitiveComponent));

  /**
   * 判断一个实例是否为`PBRMaterial`。
   */
  function isPBRMaterial(value) {
      return value.isPBRMaterial;
  }
  var PBRMaterial = /** @class */ (function (_super) {
      __extends(PBRMaterial, _super);
      function PBRMaterial() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return PBRMaterial;
  }(Hilo3d$2.PBRMaterial));

  /**
   * @hidden
   */
  var getDefaultParse = function (name) { return function (info, parser, node) {
      if (node) {
          node.gltfExtensions = node.gltfExtensions || {};
          node.gltfExtensions[name] = info;
          return node;
      }
  }; };
  /**
   * 模型解压缩扩展的配置实例。
   */
  var AliAMCExtension = Hilo3d$2.AliAMCExtension;
  /**
   * @hidden
   */
  var SeinNodeExtension = {
      name: 'Sein_node',
      optionParsers: {},
      registerOptionParsers: function (type, parser) {
          SeinNodeExtension.optionParsers[type] = parser;
      },
      unregisterOptionParsers: function (type) {
          delete SeinNodeExtension.optionParsers[type];
      },
      parseOption: function (option, parser, info) {
          var type = option.type, value = option.value;
          if (type && SeinNodeExtension.optionParsers[type]) {
              return SeinNodeExtension.optionParsers[type](value, parser, info);
          }
          else {
              throw new Error("You must register parser for type '" + type + "' in Sein_node.initOptions !");
          }
      },
      parse: function (info, parser, node, options) {
          node.gltfExtensions = node.gltfExtensions || {};
          node.gltfExtensions[SeinNodeExtension.name] = info;
          if (!info.initOptions) {
              return node;
          }
          var initOptions = info.initOptions;
          Object.keys(initOptions).forEach(function (name) {
              initOptions[name] = SeinNodeExtension.parseOption(initOptions[name], parser, info);
          });
          return node;
      },
      instantiate: function (entity, info) {
          if (info.updateOnEverTick !== undefined) {
              entity.updateOnEverTick = info.updateOnEverTick;
          }
          if (info.neverTransform !== undefined) {
              entity.isStatic = info.neverTransform;
          }
          if (isSceneActor(entity)) {
              if (info.tag) {
                  entity.tag = new SName(info.tag);
              }
              if (info.layers) {
                  entity.layers.set(info.layers);
              }
              if (info.persistent !== undefined) {
                  entity.persistent = info.persistent;
              }
              if (info.emitComponentsDestroy !== undefined) {
                  entity.emitComponentsDestroy = info.emitComponentsDestroy;
              }
          }
      }
  };
  ['Float', 'Int', 'String', 'Bool'].forEach(function (type) {
      SeinNodeExtension.registerOptionParsers(type, function (value) { return value; });
  });
  SeinNodeExtension.registerOptionParsers('Vec2', function (value) { return new Vector2().fromArray(value); });
  SeinNodeExtension.registerOptionParsers('Vec3', function (value) { return new Vector3().fromArray(value); });
  SeinNodeExtension.registerOptionParsers('Vec4', function (value) { return new Vector4().fromArray(value); });
  SeinNodeExtension.registerOptionParsers('Mat4', function (value) { return new Matrix4().fromArray(value); });
  SeinNodeExtension.registerOptionParsers('Quat', function (value) { return new Quaternion().fromArray(value); });
  SeinNodeExtension.registerOptionParsers('Color', function (value) { return new Color().fromArray(value); });
  SeinNodeExtension.registerOptionParsers('Tex2D', function (value, parser) { return parser.textures[value.index]; });
  SeinNodeExtension.registerOptionParsers('Array', function (value, parser, info) {
      return value.map(function (v) { return SeinNodeExtension.parseOption(v, parser, info); });
  });
  SeinNodeExtension.registerOptionParsers('Object', function (value, parser, info) {
      var result = {};
      Object.keys(value).forEach(function (name) {
          result[name] = SeinNodeExtension.parseOption(value[name], parser, info);
      });
      return result;
  });
  // /**
  //  * @hidden
  //  */
  // function parse
  /**
   * @hidden
   */
  var SeinPhysicBodyExtension = {
      name: 'Sein_physicBody',
      instantiate: function (entity, info, game) {
          if (!isSceneActor(entity)) {
              Debug.warn("You could not add physicBody to a component: " + entity.name + ", ignore...");
              return;
          }
          var physicBody = info;
          if (!game.world.physicWorld) {
              Debug.warn("Model " + entity.name + " in gltf file has physicBody, but \"PhysicWorld\" is not found in current world, ignore...");
              return;
          }
          var body = entity.addComponent('rigidBody', RigidBodyComponent, {
              mass: physicBody.mass,
              friction: physicBody.friction,
              restitution: physicBody.restitution,
              unControl: physicBody.unControl,
              physicStatic: physicBody.physicStatic
          });
          if (info.sleeping) {
              entity.rigidBody.sleep();
          }
          physicBody.colliders.forEach(function (collider, index) {
              var name = "collider-" + (collider.name || (collider.type + index));
              switch (collider.type) {
                  case 'BOX':
                      entity.addComponent(name, BoxColliderComponent, collider);
                      break;
                  case 'SPHERE':
                      entity.addComponent(name, SphereColliderComponent, collider);
                      break;
                  default:
                      break;
              }
          });
          if (physicBody.colliders.length) {
              body.forceSync();
          }
      }
  };
  /**
   * @hidden
   */
  var SeinAnimatorExtension = {
      name: 'Sein_animator',
      instantiate: function (entity) {
          if (!isSceneActor(entity)) {
              Debug.warn("You could not add animator to a component: " + entity.name + ", ignore...");
              return;
          }
      }
  };
  /**
   * @hidden
   */
  var SeinRendererExtension = {
      name: 'Sein_renderer',
      instantiate: function (entity, info, _, __, resource) {
          var root = isSceneActor(entity) ? entity.root : entity;
          if (!isStaticMeshComponent(root) && !isPrimitiveComponent(root)) {
              return;
          }
          root.getMaterials().forEach(function (material) {
              if (isStaticMeshComponent(root) && info.lightMap) {
                  var matName = material.name;
                  material = material.clone();
                  root.setMaterial(material, matName);
                  var _a = info.lightMap, lightMapIndex = _a.lightMapIndex, uvChannel = _a.uvChannel, uvRotation = _a.uvRotation, uvScale = _a.uvScale, uvOffset = _a.uvOffset;
                  var texture = resource.textures[lightMapIndex];
                  texture.uv = uvChannel;
                  if (isPBRMaterial(material)) {
                      material.lightMap = texture;
                  }
                  else if (isRawShaderMaterial(material)) {
                      material.setUniform('u_lightMap', texture);
                  }
                  if (uvChannel === 0) {
                      material.uvMatrix = new Matrix3().fromRotationTranslationScale(uvRotation, uvOffset[0], uvOffset[1], uvScale[0], uvScale[1]);
                  }
                  else {
                      material.uvMatrix1 = new Matrix3().fromRotationTranslationScale(uvRotation, uvOffset[0], uvOffset[1], uvScale[0], uvScale[1]);
                  }
                  material.useHDR = true;
                  material.exposure = .7;
              }
              material.receiveShadows = info.castShadows || false;
              material.castShadows = info.receiveShadows || false;
              material.gammaCorrection = info.gammaCorrection === true ? true : false;
          });
      }
  };
  /**
   * @hidden
   */
  var SeinAmbientLightExtension = {
      name: 'Sein_ambientLight',
      parse: function (info, parser, node) {
          var color = info.color, intensity = info.intensity;
          var light = new Hilo3d$2.AmbientLight({
              color: new Color(color[0], color[1], color[2]),
              amount: intensity
          });
          node.addChild(light);
          parser.lights.push(light);
          return node;
      }
  };
  function getRelativePath(basePath, path) {
      if (/^(?:http|blob|data:|\/)/.test(path)) {
          return path;
      }
      var basePaths = basePath.replace(/\/[^/]*?$/, '').split('/');
      var paths = path.split('/');
      var i = 0;
      for (i = 0; i < paths.length; i += 1) {
          var p = paths[i];
          if (p === '..') {
              basePaths.pop();
          }
          else if (p !== '.') {
              break;
          }
      }
      return basePaths.join('/') + '/' + paths.slice(i).join('/');
  }
  /**
   * @hidden
   */
  var SeinImageBasedLightingExtension = {
      name: 'Sein_imageBasedLighting',
      init: function (_, parser) {
          var game = parser.game;
          var actions = [];
          var extensions = parser.json.extensions || {};
          var iblSources = extensions.Sein_imageBasedLighting || {};
          var lights = iblSources.lights || [];
          var imageBasedLights = [];
          parser.imageBasedLights = imageBasedLights;
          lights.forEach(function (light, index) {
              imageBasedLights.push({
                  diffuse: {
                      type: light.diffuse.type,
                      intensity: light.diffuse.intensity,
                      coefficients: new SphericalHarmonics3().fromArray(light.diffuse.coefficients).scaleForRender(),
                  },
                  specular: {
                      type: light.specular.type,
                      intensity: light.specular.intensity,
                      brdfLUTIndex: light.specular.brdfLUT,
                      brdfLUT: null,
                      cubeMap: null
                  }
              });
              var specular = imageBasedLights[index].specular;
              if (light.specular.type == '2D') {
                  specular.mapIndex = light.specular.faces[0];
              }
              else {
                  var images_1 = light.specular.faces.map(function (imageIndex) {
                      var uri = parser.getImageUri(imageIndex);
                      uri = getRelativePath(parser.src, uri);
                      return uri;
                  });
                  actions.push(new Promise(function (resolve, reject) {
                      game.resource.getLoader('CubeTexture').load({ type: 'CubeTexture', url: '', images: {
                              right: images_1[0],
                              left: images_1[1],
                              top: images_1[2],
                              bottom: images_1[3],
                              front: images_1[4],
                              back: images_1[5]
                          }, name: '' }, {
                          onLoading: function (_, progress) { },
                          onLoaded: function (entity) {
                              specular.cubeMap = entity.result;
                              specular.cubeMap.minFilter = Constants.LINEAR_MIPMAP_LINEAR;
                              resolve();
                          },
                          onError: function (_, error) { return reject(error); }
                      });
                  }));
              }
          });
          return Promise.all(actions).then(function () {
              parser.imageBasedLights.forEach(function (light) {
                  light.specular.brdfLUT = parser.textures[light.specular.brdfLUTIndex];
                  if (light.specular.type == '2D') {
                      light.specular.map = parser.textures[light.specular.mapIndex];
                  }
              });
          });
      },
      parse: function (info, parser, entity) {
          if (info.type) {
              // material extension
              var material = entity;
              var lIndex = info.light, type = info.type;
              var light = parser.imageBasedLights[lIndex];
              if (isPBRMaterial(material)) {
                  if (type == 'ALL') {
                    material.brdfLUT = light.specular.brdfLUT;
                    material.specularEnvIntensity = light.specular.intensity;
                    if (light.specular.type == 'CUBE') {
                        material.specularEnvMap = light.specular.cubeMap;
                    }
                    else {
                        material.specularEnvMap = light.specular.map;
                    } 
                  }

                  material.diffuseEnvIntensity = light.diffuse.intensity;
                    if (light.diffuse.type == 'SH') {
                        material.diffuseEnvSphereHarmonics3 = light.diffuse.coefficients;
                    }
                  material.useHDR = true;
              }
              else if (isRawShaderMaterial(material)) {
                  /**
                   * @todo: support SeinCustomMaterial
                   */
                  if (type == 'ALL') {
                      material.setUniform('u_diffuseEnvIntensity', light.diffuse.intensity);
                      if (light.diffuse.type == 'SH') {
                          material.setUniform('u_diffuseEnvSphereHarmonics3', light.diffuse.coefficients);
                      }
                  }
                  material.setUniform('u_brdfLUT', light.specular.brdfLUT);
                  material.setUniform('u_specularEnvIntensity', light.specular.intensity);
                  if (light.specular.type == 'CUBE') {
                      material.setUniform('u_specularEnvMap', light.specular.cubeMap);
                  }
                  else {
                      material.setUniform('u_specularEnvMap', light.specular.map);
                  }
                  material.useHDR = true;
              }
              return material;
          }
          else {
              var model = entity;
              // global extension
              model.imageBasedLights = parser.imageBasedLights;
              return model;
          }
      }
  };
  /**
   * @hidden
   */
  function parse(info, parser, material, options) {
      if (options.isGlobalExtension) {
          return null;
      }
      var textures = parser.textures || [];
      var techniqueInfo = parser.techniques[info.technique];
      if (!techniqueInfo) {
          return null;
      }
      var programInfo = parser.programs[techniqueInfo.program];
      if (!programInfo) {
          return null;
      }
      var fragmentText = parser.shaders[programInfo.fragmentShader];
      var vertexText = parser.shaders[programInfo.vertexShader];
      var uniformsInfo = techniqueInfo.uniforms || {};
      var attributesInfo = techniqueInfo.attributes || {};
      var valuesInfo = info.values || {};
      var attributes = {};
      var uniforms = {};
      for (var uniformName in uniformsInfo) {
          var uniformDef = uniformsInfo[uniformName] || {};
          var uniformValue = valuesInfo[uniformName] !== undefined ? valuesInfo[uniformName] : uniformDef.value;
          var uniformObject = void 0;
          if (uniformValue !== undefined) {
              if (uniformDef.type === Constants.SAMPLER_2D) {
                  var textureIndex = uniformValue.index || 0;
                  uniformObject = { value: textures[textureIndex] };
              }
              else {
                  uniformObject = { value: uniformValue };
              }
          }
          else if (uniformDef.semantic && Hilo3d$2.semantic[uniformDef.semantic]) {
              // const semanticFunc = Hilo3d.semantic[uniformDef.semantic];
              // const nodeIndex = uniformDef.node;
              // let node;
              // if (nodeIndex !== undefined) {
              //   uniformObject = {
              //     get(mesh, material, programInfo) {
              //       if (node === undefined) {
              //         node = parser.node.getChildByFn((node) => {
              //           return node.animationId === nodeIndex;
              //         }) || mesh;
              //       }
              //       return semanticFunc.get(node, material, programInfo);
              //     }
              //   };
              // } else {
              //   uniformObject = uniformDef.semantic;
              // }
              uniformObject = uniformDef.semantic;
          }
          else {
              uniformObject = Hilo3d$2.semantic.blankInfo;
          }
          uniforms[uniformName] = uniformObject;
      }
      for (var attributeName in attributesInfo) {
          var attributeValue = attributesInfo[attributeName] || {};
          if (attributeValue.semantic) {
              attributes[attributeName] = attributeValue.semantic;
          }
      }
      var shaderMaterial = new RawShaderMaterial({
          vs: vertexText,
          fs: fragmentText,
          attributes: attributes,
          uniforms: uniforms
      });
      return shaderMaterial;
  }
  Hilo3d$2.GLTFExtensions.KHR_techniques_webgl.parse = parse;

  /**
   * 判断一个实例是否为`SkeletalMesh`。
   */
  function isSkeletalMesh(value) {
      return value.isSkeletalMesh;
  }
  /**
   * 带有骨骼的曲面类。封装几何体`Geometry`和材质`Material`。
   */
  var SkeletalMesh = /** @class */ (function (_super) {
      __extends(SkeletalMesh, _super);
      function SkeletalMesh() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isSkeletalMesh = true;
          return _this;
      }
      /**
       * 获取指定类型的材质。
       */
      SkeletalMesh.prototype.getMaterial = function () {
          return this.material;
      };
      /**
       * 克隆。
       */
      SkeletalMesh.prototype.clone = function (isChild) {
          return _super.prototype.clone.call(this, isChild);
      };
      return SkeletalMesh;
  }(Hilo3d$2.SkinedMesh));

  /**
   * 判断一个实例是否为`SkeletalMeshComponent`。
   */
  function isSkeletalMeshComponent(value) {
      return value.isSkeletalMeshComponent;
  }
  /**
   * 判断一个实例是否为`SkeletalMeshActor`。
   */
  function isSkeletalMeshActor(value) {
      return isSceneActor(value) && isSkeletalMeshComponent(value.root);
  }
  /**
   * 骨架Component类，是拥有骨架的图元组件。
   * 此Component在图元基础之上添加了骨骼动画的能力，拥有骨骼动画的模型实例化后即为此类的实例。
   *
   * @template IStateTypes 初始化参数类型，必须继承自[ISkeletalMeshComponentState](../interfaces/iskeletalmeshcomponentstate)。
   * @noInheritDoc
   */
  var SkeletalMeshComponent = /** @class */ (function (_super) {
      __extends(SkeletalMeshComponent, _super);
      function SkeletalMeshComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isSkeletalMeshComponent = true;
          return _this;
      }
      SkeletalMeshComponent.prototype.onCreateMesh = function (state) {
          return new SkeletalMesh({
              geometry: state ? state.geometry : null,
              material: state ? state.material : null
          });
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      SkeletalMeshComponent.prototype.cloneSkinningFromHilo = function (mesh, jointNameMap, index) {
          var _this = this;
          var m = this._mesh;
          if (this.__multiPrimitive) {
              m = this._list[index];
              if (m.material) {
                  delete this._table[m.material.name];
              }
          }
          if (mesh.jointMatTexture) {
              m.jointMatTexture = mesh.jointMatTexture;
          }
          if (mesh.jointMat) {
              m.jointMat = mesh.jointMat.slice();
          }
          m.inverseBindMatrices = [];
          m.jointNames = mesh.jointNames.slice();
          m.jointName = mesh.jointName;
          m.jointNodeList = mesh.jointNodeList.map(function (_a, i) {
              var jointName = _a.jointName;
              m.inverseBindMatrices.push(mesh.inverseBindMatrices[i].clone());
              if (!jointNameMap[jointName]) {
                  throwException(new Error('An error is occurred when adding joints for SkeletalMeshComponent'), _this, { jointNameMap: jointNameMap, jointName: jointName });
              }
              return jointNameMap[jointName];
          });
      };
      SkeletalMeshComponent = __decorate([
          SClass({ className: 'SkeletalMeshComponent' })
      ], SkeletalMeshComponent);
      return SkeletalMeshComponent;
  }(PrimitiveComponent));

  /**
   * [SkeletalMeshComponent](../skeletalmeshcomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var SkeletalMeshActor = /** @class */ (function (_super) {
      __extends(SkeletalMeshActor, _super);
      function SkeletalMeshActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      SkeletalMeshActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', SkeletalMeshComponent, options);
      };
      SkeletalMeshActor = __decorate([
          SClass({ className: 'SkeletalMeshActor', classType: 'Primitive' })
      ], SkeletalMeshActor);
      return SkeletalMeshActor;
  }(SceneActor));

  /**
   * [StaticMeshComponent](../staticmeshcomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var StaticMeshActor = /** @class */ (function (_super) {
      __extends(StaticMeshActor, _super);
      function StaticMeshActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      StaticMeshActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', StaticMeshComponent, options);
      };
      StaticMeshActor = __decorate([
          SClass({ className: 'StaticMeshActor' })
      ], StaticMeshActor);
      return StaticMeshActor;
  }(SceneActor));

  /**
   * [OrthographicCameraComponent](../orthographiccameracomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var OrthographicCameraActor = /** @class */ (function (_super) {
      __extends(OrthographicCameraActor, _super);
      function OrthographicCameraActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(OrthographicCameraActor.prototype, "camera", {
          get: function () {
              return this._root;
          },
          enumerable: true,
          configurable: true
      });
      OrthographicCameraActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', OrthographicCameraComponent, options);
      };
      OrthographicCameraActor = __decorate([
          SClass({ className: 'OrthographicCameraActor' })
      ], OrthographicCameraActor);
      return OrthographicCameraActor;
  }(SceneActor));

  /**
   * [PerspectiveCameraComponent](../perspectivecameracomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var PerspectiveCameraActor = /** @class */ (function (_super) {
      __extends(PerspectiveCameraActor, _super);
      function PerspectiveCameraActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(PerspectiveCameraActor.prototype, "camera", {
          get: function () {
              return this._root;
          },
          enumerable: true,
          configurable: true
      });
      PerspectiveCameraActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', PerspectiveCameraComponent, options);
      };
      PerspectiveCameraActor = __decorate([
          SClass({ className: 'PerspectiveCameraActor' })
      ], PerspectiveCameraActor);
      return PerspectiveCameraActor;
  }(SceneActor));

  /**
   * 判断一个实例是否为`LightComponent`。
   */
  function isLightComponent(value) {
      return value.isLightComponent;
  }
  /**
   * 判断一个实例是否为`AmbientLightActor`。
   */
  function isLightActor(value) {
      return isSceneActor(value) && isLightComponent(value.root);
  }
  /**
   * 环境光组件。
   *
   * @noInheritDoc
   */
  var LightComponent = /** @class */ (function (_super) {
      __extends(LightComponent, _super);
      function LightComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isLightComponent = true;
          _this.needUpdateAndDestroy = false;
          return _this;
      }
      LightComponent.prototype.onCreateLight = function (options) {
          throw new Error('Not Implement !');
      };
      /**
       * 初始化，继承请先`super.onInit()`。
       */
      LightComponent.prototype.onInit = function (options) {
          _super.prototype.onInit.call(this, options);
          this._light = this.onCreateLight(options);
          this._light.__forceUseParentWorldMatrix = true;
          this._node.addChild(this._light);
      };
      Object.defineProperty(LightComponent.prototype, "amount", {
          /**
           * 获取光照强度。
           */
          get: function () {
              return this._light.amount;
          },
          /**
           * 设置光照强度。
           */
          set: function (value) {
              this._light.amount = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(LightComponent.prototype, "color", {
          /**
           * 获取光照颜色。
           */
          get: function () {
              return this._light.color;
          },
          /**
           * 设置光照颜色。
           */
          set: function (value) {
              this._light.color.copy(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(LightComponent.prototype, "shadow", {
          /**
           * 获取阴影参数。
           */
          get: function () {
              return this._light.shadow;
          },
          /**
           * 设置阴影参数。
           */
          set: function (value) {
              this._light.shadow = value;
          },
          enumerable: true,
          configurable: true
      });
      LightComponent = __decorate([
          SClass({ className: 'LightComponent' })
      ], LightComponent);
      return LightComponent;
  }(SceneComponent));

  /**
   * 判断一个实例是否为`AmbientLightComponent`。
   */
  function isAmbientLightComponent(value) {
      return value.isAmbientLightComponent;
  }
  /**
   * 判断一个实例是否为`AmbientLightActor`。
   */
  function isAmbientLightActor(value) {
      return isSceneActor(value) && isAmbientLightComponent(value.root);
  }
  /**
   * 环境光组件。
   *
   * @noInheritDoc
   */
  var AmbientLightComponent = /** @class */ (function (_super) {
      __extends(AmbientLightComponent, _super);
      function AmbientLightComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isAmbientLightComponent = true;
          _this.needUpdateAndDestroy = false;
          return _this;
      }
      AmbientLightComponent.prototype.onCreateLight = function (options) {
          return new Hilo3d$2.AmbientLight(options);
      };
      AmbientLightComponent = __decorate([
          SClass({ className: 'AmbientLightComponent' })
      ], AmbientLightComponent);
      return AmbientLightComponent;
  }(LightComponent));

  /**
   * [AmbientLightComponent](../ambientlightcomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var AmbientLightActor = /** @class */ (function (_super) {
      __extends(AmbientLightActor, _super);
      function AmbientLightActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      AmbientLightActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', AmbientLightComponent, options);
      };
      AmbientLightActor = __decorate([
          SClass({ className: 'AmbientLightActor' })
      ], AmbientLightActor);
      return AmbientLightActor;
  }(SceneActor));

  /**
   * 判断一个实例是否为`DirectionalLightComponent`。
   */
  function isDirectionalLightComponent(value) {
      return value.isDirectionalLightComponent;
  }
  /**
   * 判断一个实例是否为`DirectionalLightActor`。
   */
  function isDirectionalLightActor(value) {
      return isSceneActor(value) && isDirectionalLightComponent(value.root);
  }
  /**
   * 平行光组件。
   *
   * @noInheritDoc
   */
  var DirectionalLightComponent = /** @class */ (function (_super) {
      __extends(DirectionalLightComponent, _super);
      function DirectionalLightComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isDirectionalLightComponent = true;
          _this.needUpdateAndDestroy = false;
          return _this;
      }
      DirectionalLightComponent.prototype.onCreateLight = function (options) {
          return new Hilo3d$2.DirectionalLight(options);
      };
      Object.defineProperty(DirectionalLightComponent.prototype, "direction", {
          /**
           * 获取光照方向。
           */
          get: function () {
              return this._light.direction;
          },
          /**
           * 设置光照方向。
           */
          set: function (value) {
              this._light.direction.copy(value);
          },
          enumerable: true,
          configurable: true
      });
      DirectionalLightComponent = __decorate([
          SClass({ className: 'DirectionalLightComponent' })
      ], DirectionalLightComponent);
      return DirectionalLightComponent;
  }(LightComponent));

  /**
   * [DirectionalLightComponent](../directionallightcomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var DirectionalLightActor = /** @class */ (function (_super) {
      __extends(DirectionalLightActor, _super);
      function DirectionalLightActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      DirectionalLightActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', DirectionalLightComponent, options);
      };
      DirectionalLightActor = __decorate([
          SClass({ className: 'DirectionalLightActor' })
      ], DirectionalLightActor);
      return DirectionalLightActor;
  }(SceneActor));

  /**
   * 判断一个实例是否为`PointLightComponent`。
   */
  function isPointLightComponent(value) {
      return value.isPointLightComponent;
  }
  /**
   * 判断一个实例是否为`PointLightActor`。
   */
  function isPointLightActor(value) {
      return isSceneActor(value) && isPointLightComponent(value.root);
  }
  var PointLightComponent = /** @class */ (function (_super) {
      __extends(PointLightComponent, _super);
      function PointLightComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isPointLightComponent = true;
          _this.needUpdateAndDestroy = false;
          return _this;
      }
      PointLightComponent.prototype.onCreateLight = function (options) {
          return new Hilo3d$2.PointLight(options);
      };
      Object.defineProperty(PointLightComponent.prototype, "range", {
          /**
           * 获取光照范围。
           */
          get: function () {
              return this._light.range;
          },
          /**
           * 设置光照范围。
           */
          set: function (value) {
              this._light.range = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(PointLightComponent.prototype, "constantAttenuation", {
          /**
           * 获取固定衰减系数。
           */
          get: function () {
              return this._light.constantAttenuation;
          },
          /**
           * 设置固定衰减系数。
           */
          set: function (value) {
              this._light.constantAttenuation = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(PointLightComponent.prototype, "linearAttenuation", {
          /**
           * 获取线性衰减系数。
           */
          get: function () {
              return this._light.linearAttenuation;
          },
          /**
           * 设置线性衰减系数。
           */
          set: function (value) {
              this._light.linearAttenuation = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(PointLightComponent.prototype, "quadraticAttenuation", {
          /**
           * 获取二次衰减系数。
           */
          get: function () {
              return this._light.quadraticAttenuation;
          },
          /**
           * 设置二次衰减系数。
           */
          set: function (value) {
              this._light.quadraticAttenuation = value;
          },
          enumerable: true,
          configurable: true
      });
      PointLightComponent = __decorate([
          SClass({ className: 'PointLightComponent' })
      ], PointLightComponent);
      return PointLightComponent;
  }(LightComponent));

  /**
   * [PointLightComponent](../pointlightcomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var PointLightActor = /** @class */ (function (_super) {
      __extends(PointLightActor, _super);
      function PointLightActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      PointLightActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', PointLightComponent, options);
      };
      PointLightActor = __decorate([
          SClass({ className: 'PointLightActor' })
      ], PointLightActor);
      return PointLightActor;
  }(SceneActor));

  /**
   * 判断一个实例是否为`SpotLightComponent`。
   */
  function isSpotLightComponent(value) {
      return value.isSpotLightComponent;
  }
  /**
   * 判断一个实例是否为`SpotLightActor`。
   */
  function isSpotLightActor(value) {
      return isSceneActor(value) && isSpotLightComponent(value.root);
  }
  var SpotLightComponent = /** @class */ (function (_super) {
      __extends(SpotLightComponent, _super);
      function SpotLightComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isLightComponent = true;
          _this.isSpotLightComponent = true;
          _this.needUpdateAndDestroy = false;
          return _this;
      }
      SpotLightComponent.prototype.onCreateLight = function (options) {
          return new Hilo3d$2.SpotLight(options);
      };
      Object.defineProperty(SpotLightComponent.prototype, "direction", {
          /**
           * 获取光照方向。
           */
          get: function () {
              return this._light.direction;
          },
          /**
           * 设置光照方向。
           */
          set: function (value) {
              this._light.direction.copy(value);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpotLightComponent.prototype, "range", {
          /**
           * 获取光照范围。
           */
          get: function () {
              return this._light.range;
          },
          /**
           * 设置光照范围。
           */
          set: function (value) {
              this._light.range = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpotLightComponent.prototype, "cutoff", {
          /**
           * 获取内裁剪范围。
           */
          get: function () {
              return this._light.cutoff;
          },
          /**
           * 设置内裁剪范围。
           */
          set: function (value) {
              this._light.cutoff = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpotLightComponent.prototype, "outerCutoff", {
          /**
           * 获取外裁剪范围。
           */
          get: function () {
              return this._light.outerCutoff;
          },
          /**
           * 设置外裁剪范围。
           */
          set: function (value) {
              this._light.outerCutoff = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpotLightComponent.prototype, "constantAttenuation", {
          /**
           * 获取固定衰减系数。
           */
          get: function () {
              return this._light.constantAttenuation;
          },
          /**
           * 设置固定衰减系数。
           */
          set: function (value) {
              this._light.constantAttenuation = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpotLightComponent.prototype, "linearAttenuation", {
          /**
           * 获取线性衰减系数。
           */
          get: function () {
              return this._light.linearAttenuation;
          },
          /**
           * 设置线性衰减系数。
           */
          set: function (value) {
              this._light.linearAttenuation = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpotLightComponent.prototype, "quadraticAttenuation", {
          /**
           * 获取二次衰减系数。
           */
          get: function () {
              return this._light.quadraticAttenuation;
          },
          /**
           * 设置二次衰减系数。
           */
          set: function (value) {
              this._light.quadraticAttenuation = value;
          },
          enumerable: true,
          configurable: true
      });
      SpotLightComponent = __decorate([
          SClass({ className: 'SpotLightComponent' })
      ], SpotLightComponent);
      return SpotLightComponent;
  }(LightComponent));

  /**
   * [SpotLightComponent](../spotlightcomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var SpotLightActor = /** @class */ (function (_super) {
      __extends(SpotLightActor, _super);
      function SpotLightActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      SpotLightActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', SpotLightComponent, options);
      };
      SpotLightActor = __decorate([
          SClass({ className: 'SpotLightActor' })
      ], SpotLightActor);
      return SpotLightActor;
  }(SceneActor));

  /**
   * 判断一个实例是否为`Animation`。
   */
  function isAnimation(value) {
      return value.isAnimation;
  }
  /**
   * @hidden
   */
  function nop() { }
  /**
   * 动画基类，作为动画组件的组成基本单元。
   * 一般不直接使用，而是使用各个派生类。
   *
   * @noInheritDoc
   */
  var Animation = /** @class */ (function (_super) {
      __extends(Animation, _super);
      function Animation(initState) {
          var _this = _super.call(this) || this;
          _this.isAnimation = true;
          _this.animator = null;
          /**
           * 播放速度，具体交由每个动画自行实现。
           */
          _this.speed = 1;
          /**
           * 播放开始时的回调，一般不需要自己使用。
           */
          _this.handleStart = nop;
          /**
           * 播放结束后的回调，**作为终止行为，请在动画结束时自行调用！**。
           */
          _this.handleEnd = nop;
          /**
           * 播放暂停时的回调，一般不需要自己使用。。
           */
          _this.handlePause = nop;
          /**
           * 播放唤醒时的回调，一般不需要自己使用。。
           */
          _this.handleResume = nop;
          _this._initState = null;
          _this._paused = true;
          initState.speed = initState.speed || 1;
          _this.speed = initState.speed;
          _this._initState = initState;
          return _this;
      }
      Object.defineProperty(Animation.prototype, "parent", {
          /**
           * 获取自身的父级动画组件实例引用，一般不需要自己使用。
           */
          get: function () {
              return this.animator;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Animation.prototype, "actor", {
          /**
           * 获取自身的父级动画组件的Onwer实例引用。
           */
          get: function () {
              return this.animator.getOwner();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Animation.prototype, "fsm", {
          /**
           * 获取自身动画组件的状态机实例引用。
           */
          get: function () {
              return this.animator.fsm;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Animation.prototype, "currentTime", {
          /**
           * 获取当前播放时间。
           */
          get: function () {
              throw new Error('Not implemented !');
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Animation.prototype, "duration", {
          /**
           * 获取当前播放总时长。
           */
          get: function () {
              throw new Error('Not implemented !');
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Animation.prototype, "paused", {
          /**
           * 获取当前是否处于暂停状态。
           */
          get: function () {
              return this._paused;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 获取当前`Game`实例。
       *
       * @template IGameState 当前游戏状态管理器的类型。
       */
      Animation.prototype.getGame = function () {
          return this.actor.getGame();
      };
      /**
       * 获取当前`World`实例。
       *
       * @template IWorldState 当前世界状态管理器的类型。
       */
      Animation.prototype.getWorld = function () {
          return this.actor.getWorld();
      };
      /**
       * 获取当前`Level`实例。
       *
       * @template ILevelState 当前关卡状态管理器的类型。
       */
      Animation.prototype.getLevel = function () {
          return this.actor.getLevel();
      };
      /**
       * 生命周期，将在初始化时触发，你可以重写此方法来实现自定义动画。
       */
      Animation.prototype.onInit = function (initState) {
      };
      /**
       * 生命周期，将在`play`时触发，你可以重写此方法来实现自定义动画。
       *
       * @param loopCount 当前循环次数
       */
      Animation.prototype.onPlay = function (loopCount) {
      };
      /**
       * 生命周期，将在`pause`时触发，你可以重写此方法来实现自定义动画。
       */
      Animation.prototype.onPause = function () {
      };
      /**
       * 生命周期，将在`resume`时触发，你可以重写此方法来实现自定义动画。
       */
      Animation.prototype.onResume = function () {
      };
      /**
       * 生命周期，将在`stop`时触发，你可以重写此方法来实现自定义动画。
       */
      Animation.prototype.onStop = function () {
      };
      /**
       * 生命周期，将在每一帧`update`时触发，你可以重写此方法来实现自定义动画。
       */
      Animation.prototype.onUpdate = function (delta) {
      };
      /**
       * 生命周期，用于错误边界处理。将在游戏中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
       * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
       * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
       */
      Animation.prototype.onError = function (error, details) {
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Animation.prototype.initialize = function () {
          try {
              this.onInit(this._initState);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Animation.prototype.play = function (loopCount) {
          this._paused = false;
          try {
              this.onPlay(loopCount);
              this.handleStart(this, this.actor);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Animation.prototype.pause = function () {
          this._paused = true;
          try {
              this.onPause();
              this.handlePause(this, this.actor);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Animation.prototype.resume = function () {
          this._paused = false;
          try {
              this.onResume();
              this.handleResume(this, this.actor);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Animation.prototype.stop = function () {
          this._paused = true;
          try {
              this.onStop();
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Animation.prototype.update = function (delta) {
          try {
              this.onUpdate(delta);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      Animation = __decorate([
          SClass({ className: 'Animation', classType: 'Animation' })
      ], Animation);
      return Animation;
  }(SObject));

  /**
   * 判断一个实例是否为`ModelAnimation`。
   */
  function isModelAnimation(value) {
      return value.isModelAnimation;
  }
  /**
   * 模型动画类，用于存储模型动画。
   * 一般在模型实例化时已经自动生成，不需要自己初始化。
   *
   * @noInheritDoc
   */
  var ModelAnimation = /** @class */ (function (_super) {
      __extends(ModelAnimation, _super);
      function ModelAnimation() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isModelAnimation = true;
          _this._startTime = 0;
          _this._endTime = 0;
          _this._duration = 0;
          _this._currentEndHandler = function () { };
          return _this;
      }
      Object.defineProperty(ModelAnimation.prototype, "duration", {
          /**
           * 获取当前播放总时长。
           */
          get: function () {
              return this._duration;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ModelAnimation.prototype, "currentTime", {
          /**
           * 获取当前播放时间。
           */
          get: function () {
              return this._anim.currentTime;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ModelAnimation.prototype, "paused", {
          /**
           * 获取当前是否处于暂停状态。
           */
          get: function () {
              return this._anim.paused;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @hidden
       */
      ModelAnimation.prototype.onInit = function (initState) {
          var component = this.actor.findComponentByName(initState.componentName)
              || this.actor.root;
          var animation = component.hiloNode.anim;
          if (!animation) {
              throw new BreakGuardException(this, "Model of " + component.name + "->" + this.actor.name + " has no animations !");
          }
          var clip = animation.clips[initState.clipName];
          if (!clip) {
              throw new BreakGuardException(this, "Clip " + this.className + " is not existed in model of " + component.name + "->" + this.actor.name + " !");
          }
          this._anim = animation;
          this._clipName = initState.clipName;
          this._anim.loop = 0;
          var info = this._anim.getAnimStatesListTimeInfo(clip.animStatesList);
          this._duration = info.endTime - info.startTime;
      };
      /**
       * @hidden
       */
      ModelAnimation.prototype.onPlay = function (loopCount) {
          var _this = this;
          // this callback may be re-registered before it was removed, so we must use lambda function to avoid it
          this._currentEndHandler = function () { return _this.handleEnd(_this, _this.actor); };
          this._anim.on('end', this._currentEndHandler, true);
          this._anim.play(this._clipName);
      };
      /**
       * @hidden
       */
      ModelAnimation.prototype.onPause = function () {
          this._anim.off('end', this._currentEndHandler);
          this._anim.pause();
      };
      /**
       * @hidden
       */
      ModelAnimation.prototype.onResume = function () {
          this._anim.on('end', this._currentEndHandler, true);
          this._anim.resume();
      };
      /**
       * @hidden
       */
      ModelAnimation.prototype.onStop = function () {
          this._anim.off('end', this._currentEndHandler);
          this._currentEndHandler = function () { };
          this._anim.stop();
      };
      /**
       * @hidden
       */
      ModelAnimation.prototype.onUpdate = function (delta) {
          if (!this.paused) {
              this._anim.tick(delta);
          }
      };
      ModelAnimation = __decorate([
          SClass({ className: 'ModelAnimation' })
      ], ModelAnimation);
      return ModelAnimation;
  }(Animation));

  /**
   * 判断一个实例是否为`FSMState`。
   */
  function isFSMState(value) {
      return value.isFSMState;
  }
  /**
   * 状态机的状态类，用于存储状态以及行为。
   *
   * @noInheritDoc
   */
  var FSMState = /** @class */ (function (_super) {
      __extends(FSMState, _super);
      function FSMState(name, options, parent) {
          var _this = _super.call(this, name) || this;
          _this.isFSMState = true;
          _this._fsm = parent;
          _this.onEnter = options.onEnter;
          _this.onUpdate = options.onUpdate;
          _this.onExit = options.onExit;
          _this.actions = {};
          _this.next = {};
          return _this;
      }
      Object.defineProperty(FSMState.prototype, "fsm", {
          /**
           * 获取父级状态机。
           */
          get: function () {
              return this._fsm;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 进入此状态，将会触发对应回调。
       */
      FSMState.prototype.enter = function () {
          if (this.onEnter) {
              this.onEnter(this);
          }
      };
      /**
       * 每一帧更新，将会触发对应回调。
       */
      FSMState.prototype.update = function (delta) {
          if (this.onUpdate) {
              this.onUpdate(delta, this);
          }
      };
      /**
       * 退出此状态，将会触发对应回调。
       */
      FSMState.prototype.exit = function () {
          if (this.onExit) {
              this.onExit(this);
          }
      };
      FSMState = __decorate([
          SClass({ className: 'FSMState', classType: 'FSMState' })
      ], FSMState);
      return FSMState;
  }(SObject));

  /**
   * 判断一个实例是否为`FSMComponent`。
   */
  function isFSMComponent(value) {
      return value.isFSMComponent;
  }
  function isArray(value) {
      return !!value.push;
  }
  /**
   * 有限状态机组件类，一种通用的游戏逻辑编程模型。
   * 默认拥有`enter`和`exit`两个状态。
   *
   * @noInheritDoc
   */
  var FSMComponent = /** @class */ (function (_super) {
      __extends(FSMComponent, _super);
      /**
       * @hidden
       */
      function FSMComponent(name) {
          var _this = _super.call(this, name, null) || this;
          _this.isFSMComponent = true;
          /**
           * 退出一个状态时的回调。
           */
          _this.onExit = new Observable();
          _this._states = {};
          _this._current = 'enter';
          _this._default = null;
          _this.handleExit = function () {
              _this.dispatch('reset');
              if (_this.onExit) {
                  _this.onExit.parent = _this;
                  _this.onExit.notify(_this);
              }
          };
          _this.addState('enter');
          _this.addState('exit', { onEnter: _this.handleExit });
          _this.addTransition('reset', 'exit', 'enter');
          return _this;
      }
      Object.defineProperty(FSMComponent.prototype, "defaultState", {
          /**
           * 获取默认状态名称。
           */
          get: function () {
              return this._default;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(FSMComponent.prototype, "current", {
          /**
           * 获取当前状态名称。
           */
          get: function () {
              return this._current;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(FSMComponent.prototype, "currentState", {
          /**
           * 获取当前状态实例引用。
           */
          get: function () {
              return this._states[this._current];
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(FSMComponent.prototype, "parent", {
          /**
           * 获取父级实例引用。
           */
          get: function () {
              return this._parent || this._owner;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 获取当前状态实例引用。
       */
      FSMComponent.prototype.getCurrentState = function () {
          return this._states[this._current];
      };
      /**
       * 通过名字获取状态实例引用。
       */
      FSMComponent.prototype.getState = function (name) {
          return this._states[name];
      };
      /**
       * 添加一个实例。
       *
       * @param isDefault 是否为默认状态
       */
      FSMComponent.prototype.addState = function (name, options, isDefault) {
          if (options === void 0) { options = {}; }
          if (isDefault === void 0) { isDefault = false; }
          if (this._states[name]) {
              throw new MemberConflictException(this, 'State', name, this);
          }
          this._states[name] = new FSMState(name, options, this);
          if (isDefault) {
              this.setDefault(name);
          }
          return this;
      };
      /**
       * 修改默认状态。
       */
      FSMComponent.prototype.setDefault = function (name) {
          this._default = name;
          this.addTransition('enter', 'enter', name);
          return this;
      };
      /**
       * 判断是否拥有某个状态。
       */
      FSMComponent.prototype.has = function (name) {
          return !!this._states[name];
      };
      /**
       * 移除一个状态。
       */
      FSMComponent.prototype.removeState = function (name) {
          var state = this._states[name];
          if (!state) {
              return;
          }
          delete this._states[name];
          return this;
      };
      /**
       * 重置状态机到`enter`状态。
       */
      FSMComponent.prototype.reset = function () {
          this._current = 'enter';
          return this;
      };
      /**
       * 添加一个一对一或一对多的转换。
       */
      FSMComponent.prototype.addTransition = function (action, from, to) {
          var _this = this;
          var toState = this._states[to];
          if (!toState) {
              throwException(new MissingMemberException(this, 'State', to, this), this);
          }
          if (!isArray(from)) {
              from = [from];
          }
          from.forEach(function (fromName) {
              var fromState = _this._states[fromName];
              if (!fromState) {
                  throwException(new MissingMemberException(_this, 'State', fromName, _this), _this);
              }
              if (fromState.next[to]) {
                  throwException(new MemberConflictException(_this, 'State', fromName, _this), _this);
              }
              fromState.next[to] = action;
              fromState.actions[action] = to;
          });
          return this;
      };
      FSMComponent.prototype.removeTransition = function (from, to) {
          var _this = this;
          if (!isArray(from) && !isArray(to)) {
              this.removeOneTransition(from, to);
          }
          if (isArray(from) && !isArray(to)) {
              from.forEach(function (name) { return _this.removeOneTransition(name, to); });
          }
          if (isArray(to) && !isArray(from)) {
              to.forEach(function (name) { return _this.removeOneTransition(from, name); });
          }
          return this;
      };
      FSMComponent.prototype.removeOneTransition = function (from, to) {
          var fromState = this._states[from];
          if (!fromState || !fromState.next[to]) {
              return;
          }
          var action = fromState.next[to];
          delete fromState.next[to];
          delete fromState.actions[action];
          return this;
      };
      /**
       * 添加多对转换。
       */
      FSMComponent.prototype.addTransitions = function (options) {
          var _this = this;
          options.forEach(function (option) { return _this.addTransition(option.action, option.from, option.to); });
          return this;
      };
      /**
       * 移除多对转换。
       */
      FSMComponent.prototype.removeTransitions = function (options) {
          var _this = this;
          options.forEach(function (option) { return _this.removeTransition(option.from, option.to); });
          return this;
      };
      /**
       * 判断是否拥有某对转换。
       */
      FSMComponent.prototype.hasTransition = function (from, action) {
          var state = this._states[from];
          if (!state) {
              return false;
          }
          return !!state.actions[action];
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      FSMComponent.prototype.enter = function () {
          this.dispatch('enter');
      };
      /**
       * 每一帧更新，继承请先`super.onUpdate()`。
       */
      FSMComponent.prototype.onUpdate = function (delta) {
          if (!this._current) {
              return;
          }
          var state = this._states[this._current];
          if (state) {
              state.update(delta);
          }
      };
      /**
       * 执行某个动作`action`，触发转换。
       */
      FSMComponent.prototype.dispatch = function (action) {
          if (!this._current || !this._states[this._current]) {
              throwException(new Error("State \"" + this._current + "\" does not in this fsm now: \"" + this.name + "\"!"), this);
          }
          var currentState = this._states[this._current];
          currentState.exit();
          var nextName = currentState.actions[action];
          if (!nextName || !this._states[nextName]) {
              throwException(new Error("FromState \"" + this._current + "\" does not have action \"" + action + "\"!"), this);
          }
          this._current = nextName;
          this._states[nextName].enter();
          return this;
      };
      /**
       * 销毁，继承请先`super.onDestroy()`。
       */
      FSMComponent.prototype.onDestroy = function () {
          this.reset();
      };
      FSMComponent = __decorate([
          SClass({ className: 'FSMComponent' })
      ], FSMComponent);
      return FSMComponent;
  }(Component));

  /**
   * 判断一个实例是否为`AnimatorComponent`。
   */
  function isAnimatorComponent(value) {
      return value.isAnimatorComponent;
  }
  /**
   * 动画组件类，管理着一个Actor下的所有动画。
   * **当挂载到Actor后，你可以直接通过`actor.animator`来访问它。**
   *
   * @template IParameters 用于指定动画状态机参数的类型。
   * @noInheritDoc
   */
  var AnimatorComponent = /** @class */ (function (_super) {
      __extends(AnimatorComponent, _super);
      function AnimatorComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isAnimatorComponent = true;
          _this._fsm = new FSMComponent('fsm');
          _this._loop = 0;
          _this._animations = {};
          _this._transitions = {};
          _this._parameters = {};
          _this.handleElementEnd = function (animation) {
              var from = animation.name.value;
              if (!_this._transitions[from]) {
                  _this._fsm.dispatch('exit');
                  return;
              }
              var _a = _this._transitions[from], conditions = _a.conditions, length = _a.length, array = _a.array;
              for (var index = 0; index < length; index += 1) {
                  var to = array[index];
                  if (conditions[to](_this._parameters)) {
                      _this._fsm.dispatch(to);
                      return;
                  }
              }
              _this._fsm.dispatch('exit');
          };
          _this.handleEnd = function () {
              if (!_this._loop || _this._loop <= 0) {
                  _this._event.trigger('End', { name: _this.current, animation: _this._currentAnimation, actor: _this._owner });
                  _this._currentAnimation = null;
                  return;
              }
              _this._event.trigger('Loop', { animation: _this._currentAnimation, name: _this._current, actor: _this._owner });
              _this._fsm.dispatch(_this._current);
              _this._loop -= 1;
          };
          return _this;
      }
      Object.defineProperty(AnimatorComponent.prototype, "event", {
          /**
           * AnimatorComponent的事件管理器。
           *
           * ```ts
           * EventManager<{
           *  Start: IAnimatorEvent;
           *  Pause: IAnimatorEvent;
           *  Resume: IAnimatorEvent;
           *  Loop: IAnimatorEvent;
           *  End: IAnimatorEvent;
           * }>
           * ```
           *
           * [IAnimatorEvent](../interfaces/ianimatorevent)
           */
          get: function () {
              return this._event;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AnimatorComponent.prototype, "current", {
          /**
           * 获取当前播放的动画名称。
           */
          get: function () {
              return this._current;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AnimatorComponent.prototype, "fsm", {
          /**
           * 获取状态机实例引用。
           */
          get: function () {
              return this._fsm;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AnimatorComponent.prototype, "parameters", {
          /**
           * 获取当前的状态机控制参数引用。
           */
          get: function () {
              return this._parameters;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AnimatorComponent.prototype, "animationNames", {
          get: function () {
              return Object.keys(this._fsm.getState('enter').next);
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 初始化，继承请先`super.onInit()`。
       */
      AnimatorComponent.prototype.onInit = function () {
          this._event.register('Start');
          this._event.register('Pause');
          this._event.register('Resume');
          this._event.register('Loop');
          this._event.register('End');
          this._fsm._parent = this;
          this._fsm.onExit.add(this.handleEnd);
      };
      /**
       * 添加到世界，继承请先`super.onAdd()`。
       */
      AnimatorComponent.prototype.onAdd = function (initState) {
          this.initFromComponent(initState.componentName);
          // fixme: hack for performance
          this._owner._animator = this;
      };
      /**
       * 修改状态参数的值。
       */
      AnimatorComponent.prototype.setParameter = function (key, value) {
          this._parameters[key] = value;
          return this;
      };
      /**
       * 获取状态参数的值。
       */
      AnimatorComponent.prototype.getParameter = function (key) {
          return this._parameters[key];
      };
      /**
       * 通过名字获取动画实例引用。
       */
      AnimatorComponent.prototype.getAnimation = function (name) {
          if (!this._animations[name]) {
              Debug.warn("Animation " + name + " is not existed in " + (this._owner && this._owner.name));
          }
          return this._animations[name];
      };
      /**
       * 通过组件名称添加其下的所有动画。
       */
      AnimatorComponent.prototype.initFromComponent = function (name) {
          var _this = this;
          if (name === void 0) { name = 'root'; }
          var component = this._owner.findComponentByName(name);
          if (!component.hiloNode.anim) {
              return;
          }
          var oldPrefix = this._owner.name.value + '@';
          var clips = component.hiloNode.anim.clips;
          Object.keys(clips).forEach(function (clipName) {
              _this.register(clipName.replace(oldPrefix, ''), new ModelAnimation({ componentName: name, clipName: clipName }));
          });
      };
      /**
       * 每一帧更新，继承请先`super.onUpdate()`。
       */
      AnimatorComponent.prototype.onUpdate = function (delta) {
          this._fsm.update(delta);
      };
      AnimatorComponent.prototype.onUnLink = function () {
          this.stop();
      };
      /**
       * 销毁，继承请先`super.onDestroy()`。
       */
      AnimatorComponent.prototype.onDestroy = function () {
          if (this._currentAnimation && !this._currentAnimation.paused) {
              this._currentAnimation.pause();
          }
          if (this._owner.animator === this) {
              this._owner._animator = null;
          }
          this._fsm.reset();
          this._animations = {};
      };
      /**
       * 注册一个动画为一个名称，通过`isDefault`指定其是否为默认动画。
       */
      AnimatorComponent.prototype.register = function (name, animation, isDefault) {
          var _this = this;
          if (isDefault === void 0) { isDefault = false; }
          if (isDefault || !this._default) {
              this._default = name;
          }
          animation.name = new SName(name);
          animation.animator = this;
          animation.handleEnd = this.handleElementEnd;
          animation.handlePause = function () { return _this._event.trigger('Pause', { animation: animation, name: _this._current, actor: _this._owner }); };
          animation.handleResume = function () { return _this._event.trigger('Resume', { animation: animation, name: _this._current, actor: _this._owner }); };
          this._fsm.addState(name, {
              onEnter: function () {
                  _this._currentAnimation = animation;
                  animation.play(_this._loop);
              },
              onUpdate: function (delta) { return animation.update(delta); }
          });
          this.addTransition('enter', name, function () { return true; });
          this._fsm.addTransition('exit', name, 'exit');
          this._animations[name] = animation;
          animation.initialize();
          return this;
      };
      /**
       * 取消注册一个动画。
       */
      AnimatorComponent.prototype.unregister = function (name) {
          this._fsm.removeState(name);
          this._fsm.removeTransition('enter', name);
          if (this._animations[name]) {
              this._animations[name].destroy();
              delete this._animations[name];
          }
          return this;
      };
      /**
       * 设置默认的动画。
       */
      AnimatorComponent.prototype.setDefault = function (name) {
          this._default = name;
      };
      /**
       * 添加一个动画到另一个动画的链接。
       *
       * @param condition 通过当前状态参数决定此刻是否要执行这个转换，用于当一个动画拥有多个下一步的指向时。
       */
      AnimatorComponent.prototype.addTransition = function (from, to, condition) {
          this._fsm.addTransition(to, from, to);
          this._transitions[from] = this._transitions[from] || { conditions: {}, array: [], length: 0 };
          this._transitions[from].conditions[to] = condition || (function () { return true; });
          this._transitions[from].array.push(to);
          this._transitions[from].length += 1;
          return this;
      };
      /**
       * 修改一个动画到下一个动画的转换判定函数。
       */
      AnimatorComponent.prototype.setTransitionCondition = function (from, to, condition) {
          this._transitions[from].conditions[to] = condition;
          return this;
      };
      /**
       * 移除一个转换。
       */
      AnimatorComponent.prototype.removeTransition = function (from, to) {
          this._fsm.removeTransition(from, to);
          if (!this._transitions[from].conditions[to]) {
              return this;
          }
          delete this._transitions[from].conditions[to];
          var index = this._transitions[from].array.indexOf(to);
          this._transitions[from].array.splice(index, 1);
          this._transitions[from].length -= 1;
          return this;
      };
      /**
       * 清空所有动画。
       */
      AnimatorComponent.prototype.clear = function () {
          this.stop();
          this._fsm = new FSMComponent('fsm');
          return this;
      };
      /**
       * 判定一个动画是否已被注册。
       */
      AnimatorComponent.prototype.has = function (name) {
          return this._fsm.hasTransition('enter', name);
      };
      /**
       * 播放某个动画，不指定`name`将播放默认动画。`loop`用于指定循环次数。
       */
      AnimatorComponent.prototype.play = function (name, loop) {
          if (!this._fsm.getCurrentState().name.equalsTo('enter')) {
              this.stop();
          }
          name = name || this._default;
          if (!name) {
              return this;
          }
          this._loop = loop || 0;
          this._current = name;
          this._fsm.dispatch(name);
          this._event.trigger('Start', { animation: this._currentAnimation, name: this._current, actor: this._owner });
          return this;
      };
      /**
       * 暂停动画播放。
       */
      AnimatorComponent.prototype.pause = function () {
          this._currentAnimation.pause();
          return this;
      };
      /**
       * 唤醒动画播放。
       */
      AnimatorComponent.prototype.resume = function () {
          this._currentAnimation.resume();
          return this;
      };
      /**
       * 停止动画播放。
       */
      AnimatorComponent.prototype.stop = function () {
          if (this._currentAnimation && !this._currentAnimation.paused) {
              this._currentAnimation.stop();
          }
          this._loop = 0;
          this._fsm.reset();
          this.handleEnd();
          return this;
      };
      AnimatorComponent = __decorate([
          SClass({ className: 'AnimatorComponent' })
      ], AnimatorComponent);
      return AnimatorComponent;
  }(Component));

  /**
   * 判断一个实例是否为`MorphGeometry`。
   */
  function isMorphGeometry(value) {
      return value.isMorphGeometry;
  }
  var MorphGeometry = /** @class */ (function (_super) {
      __extends(MorphGeometry, _super);
      function MorphGeometry() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return MorphGeometry;
  }(Hilo3d$2.MorphGeometry));

  /**
   * 判断一个实例是否为`BSPComponent`。
   */
  function isBSPComponent(value) {
      return value.isBSPComponent;
  }
  /**
   * 判断一个实例是否为`BSPActor`。
   */
  function isBSPActor(value) {
      return isSceneActor(value) && isBSPComponent(value.root);
  }
  /**
   * 基础几何体基类，一般不直接使用，而是使用派生类。
   *
   * @noInheritDoc
   */
  var BSPComponent = /** @class */ (function (_super) {
      __extends(BSPComponent, _super);
      function BSPComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isBSPComponent = true;
          _this.needUpdateAndDestroy = false;
          return _this;
      }
      /**
       * 初始化，继承请先`super.onInit()`。
       */
      BSPComponent.prototype.onInit = function (initState) {
          var state = this.convertState(initState);
          _super.prototype.onInit.call(this, state);
      };
      BSPComponent.prototype.convertState = function (initState) {
          return initState;
      };
      BSPComponent = __decorate([
          SClass({ className: 'BSPComponent' })
      ], BSPComponent);
      return BSPComponent;
  }(StaticMeshComponent));

  /**
   * 判断一个实例是否为`BSPMorphComponent`。
   */
  function isBSPMorphComponent(value) {
      return value.isBSPMorphComponent;
  }
  /**
   * 判断一个实例是否为`BSPMorphActor`。
   */
  function isBSPMorphActor(value) {
      return isSceneActor(value) && isBSPMorphComponent(value.root);
  }
  /**
   * 基础Morph几何体。
   *
   * @noInheritDoc
   */
  var BSPMorphComponent = /** @class */ (function (_super) {
      __extends(BSPMorphComponent, _super);
      function BSPMorphComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isBSPMorphComponent = true;
          return _this;
      }
      Object.defineProperty(BSPMorphComponent.prototype, "geometry", {
          /**
           * 获取几何体。
           */
          get: function () {
              return this._mesh.geometry;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(BSPMorphComponent.prototype, "targets", {
          /**
           * 设置targets。
           */
          get: function () {
              return this.geometry.targets;
          },
          /**
           * 获取targets。
           */
          set: function (value) {
              this.geometry.targets = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(BSPMorphComponent.prototype, "weights", {
          /**
           * 获取权重。
           */
          get: function () {
              return this.geometry.weights;
          },
          /**
           * 设置权重。
           */
          set: function (value) {
              this.geometry.weights = value;
          },
          enumerable: true,
          configurable: true
      });
      BSPMorphComponent.prototype.convertState = function (initState) {
          var weights = initState.weights, targets = initState.targets, geometry = initState.geometry, others = __rest(initState, ["weights", "targets", "geometry"]);
          var result = others;
          var attrs = {};
          Object.keys(geometry).forEach(function (key) {
              if (geometry[key].isGeometryData) {
                  attrs[key] = geometry[key];
              }
          });
          result.geometry = new MorphGeometry(attrs);
          if (geometry.isMorphGeometry) {
              result.geometry.targets = targets || geometry.targets;
              result.geometry.weights = weights || geometry.weights.slice();
          }
          else {
              result.geometry.weights = weights || [];
              result.geometry.targets = targets || {};
          }
          return result;
      };
      BSPMorphComponent = __decorate([
          SClass({ className: 'BSPMorphComponent' })
      ], BSPMorphComponent);
      return BSPMorphComponent;
  }(BSPComponent));

  /**
   * [BSPMorphComponent](../bspmorphcomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var BSPMorphActor = /** @class */ (function (_super) {
      __extends(BSPMorphActor, _super);
      function BSPMorphActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      BSPMorphActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', BSPMorphComponent, options);
      };
      BSPMorphActor = __decorate([
          SClass({ className: 'BSPMorphActor' })
      ], BSPMorphActor);
      return BSPMorphActor;
  }(SceneActor));

  /* tslint:disable */
  /**
   * @hidden
   */
  function generateActorOrComponentFromNode(node, parentActor, parent, isComponent, resource, world) {
      var child = node.children[0];
      var result = null;
      var root = null;
      var Class;
      var initOptions = { __fromGlTF: true };
      if (node.gltfExtensions.Sein_node && node.gltfExtensions.Sein_node.className) {
          var className = node.gltfExtensions.Sein_node.className;
          Class = MetaSClasses[className];
          if (!Class) {
              Debug.warn("No class named '" + className + "', no effect, you must use decorator 'SClass' to annotate your class before use it !");
          }
          else {
              Object.assign(initOptions, node.gltfExtensions.Sein_node.initOptions || {});
          }
      }
      if (!child) {
          if (isComponent) {
              root = result = parentActor.addComponent(node.name, Class || SceneComponent, initOptions, parent);
          }
          else {
              root = (result = world.addActor(node.name, Class || SceneActor, initOptions, parentActor)).root;
          }
      }
      else if (child.isSkinedMesh) {
          var length_1 = node.children.length;
          var meshes = [];
          for (var index = 0; index < length_1; index += 1) {
              var mesh = node.children[index];
              if (!mesh.isSkinedMesh) {
                  break;
              }
              mesh.material.gammaCorrection = false;
              meshes.push(mesh);
              node.childrenOffset += 1;
          }
          length_1 = meshes.length;
          var _a = child, geometry = _a.geometry, material = _a.material;
          Object.assign(initOptions, { __doNotUseMultiPrimitiveYourself: meshes, geometry: geometry, material: material });
          if (isComponent) {
              root = result = parentActor.addComponent(node.name, Class || SkeletalMeshComponent, initOptions, parent);
              parentActor.skeletalMeshComponents.push([root, meshes]);
          }
          else {
              root = (result = world.addActor(node.name, Class || SkeletalMeshActor, initOptions, parentActor)).root;
              parentActor.skeletalMeshComponents = [[root, meshes]];
          }
      }
      else if (child.isMesh) {
          var length_2 = node.children.length;
          var meshes = [];
          for (var index = 0; index < length_2; index += 1) {
              var mesh = node.children[index];
              if (!mesh.isMesh) {
                  break;
              }
              mesh.material.gammaCorrection = false;
              meshes.push(mesh);
              node.childrenOffset += 1;
          }
          length_2 = meshes.length;
          var _b = child, geometry = _b.geometry, material = _b.material;
          Object.assign(initOptions, { __doNotUseMultiPrimitiveYourself: meshes, geometry: geometry, material: material });
          if (geometry.isMorphGeometry) {
              if (isComponent) {
                  root = result = parentActor.addComponent(node.name, Class || BSPMorphComponent, initOptions, parent);
              }
              else {
                  root = (result = world.addActor(node.name, Class || BSPMorphActor, initOptions, parentActor)).root;
              }
          }
          else {
              if (isComponent) {
                  root = result = parentActor.addComponent(node.name, Class || StaticMeshComponent, initOptions, parent);
              }
              else {
                  root = (result = world.addActor(node.name, Class || StaticMeshActor, initOptions, parentActor)).root;
              }
          }
      }
      else if (child.isOrthographicCamera) {
          var _c = child, far = _c.far, near = _c.near, left = _c.left, right = _c.right, top_1 = _c.top, bottom = _c.bottom;
          Object.assign(initOptions, { far: far, near: near, left: left, right: right, top: top_1, bottom: bottom });
          if (isComponent) {
              root = result = parentActor.addComponent(node.name, Class || OrthographicCameraComponent, initOptions, parent);
          }
          else {
              root = (result = world.addActor(node.name, Class || OrthographicCameraActor, initOptions, parentActor)).root;
          }
          node.childrenOffset += 1;
      }
      else if (child.isPerspectiveCamera) {
          var _d = child, far = _d.far, near = _d.near, fov = _d.fov, aspect = _d.aspect;
          Object.assign(initOptions, { far: far, near: near, fov: fov, aspect: aspect });
          if (isComponent) {
              root = result = parentActor.addComponent(node.name, Class || PerspectiveCameraComponent, initOptions, parent);
          }
          else {
              root = (result = world.addActor(node.name, Class || PerspectiveCameraActor, initOptions, parentActor)).root;
          }
          node.childrenOffset += 1;
      }
      else if (child.isAmbientLight) {
          var _e = child, amount = _e.amount, color = _e.color, shadow = _e.shadow;
          Object.assign(initOptions, { amount: amount, color: color, shadow: shadow });
          if (isComponent) {
              root = result = parentActor.addComponent(node.name, Class || AmbientLightComponent, initOptions, parent);
          }
          else {
              root = (result = world.addActor(node.name, Class || AmbientLightActor, initOptions, parentActor)).root;
          }
          node.childrenOffset += 1;
      }
      else if (child.isDirectionalLight) {
          var _f = child, amount = _f.amount, color = _f.color, shadow = _f.shadow, direction = _f.direction;
          Object.assign(initOptions, { amount: amount, color: color, shadow: shadow, direction: direction });
          if (isComponent) {
              root = result = parentActor.addComponent(node.name, Class || DirectionalLightComponent, initOptions, parent);
          }
          else {
              root = (result = world.addActor(node.name, Class || DirectionalLightActor, initOptions, parentActor)).root;
          }
          node.childrenOffset += 1;
      }
      else if (child.isPointLight) {
          var _g = child, amount = _g.amount, color = _g.color, shadow = _g.shadow, range = _g.range, constantAttenuation = _g.constantAttenuation, linearAttenuation = _g.linearAttenuation, quadraticAttenuation = _g.quadraticAttenuation;
          Object.assign(initOptions, { amount: amount, color: color, shadow: shadow, range: range, constantAttenuation: constantAttenuation, linearAttenuation: linearAttenuation, quadraticAttenuation: quadraticAttenuation });
          if (isComponent) {
              root = result = parentActor.addComponent(node.name, Class || PointLightComponent, initOptions, parent);
          }
          else {
              root = (result = world.addActor(node.name, Class || PointLightActor, initOptions, parentActor)).root;
          }
          node.childrenOffset += 1;
      }
      else if (child.isSpotLight) {
          var _h = child, amount = _h.amount, color = _h.color, shadow = _h.shadow, range = _h.range, constantAttenuation = _h.constantAttenuation, linearAttenuation = _h.linearAttenuation, quadraticAttenuation = _h.quadraticAttenuation, cutoff = _h.cutoff, outerCutoff = _h.outerCutoff, direction = _h.direction;
          Object.assign(initOptions, { amount: amount, color: color, shadow: shadow, range: range, constantAttenuation: constantAttenuation, linearAttenuation: linearAttenuation, quadraticAttenuation: quadraticAttenuation, cutoff: cutoff, outerCutoff: outerCutoff, direction: direction });
          if (isComponent) {
              root = result = parentActor.addComponent(node.name, Class || SpotLightComponent, initOptions, parent);
          }
          else {
              root = (result = world.addActor(node.name, Class || SpotLightActor, initOptions, parentActor)).root;
          }
          node.childrenOffset += 1;
      }
      else {
          if (isComponent) {
              root = result = parentActor.addComponent(node.name, Class || SceneComponent, initOptions, parent);
          }
          else {
              root = (result = world.addActor(node.name, Class || SceneActor, initOptions, parentActor)).root;
          }
      }
      root.cloneFromHiloNode(node);
      root.needReleaseGlRes = false;
      var animationId = root.hiloNode.animationId;
      if (isComponent && resource.anim && resource.anim.validAnimationIds[animationId]) {
          parentActor.animNameMap[animationId] = root.hiloNode;
          parentActor.animCount += 1;
      }
      if (isComponent && parentActor.jointNameMap && root.hiloNode.jointName !== undefined) {
          parentActor.jointNameMap[root.hiloNode.jointName] = root.hiloNode;
      }
      return result;
  }
  /**
   * @hidden
   */
  function convert(game, parent, children, actors, resource, forceAsComponent, className) {
      if (forceAsComponent === void 0) { forceAsComponent = false; }
      if (className === void 0) { className = null; }
      // if parent is null
      var isComponent = false;
      var parentNode = null;
      var parentSeinNode = null;
      if (parent) {
          if (isSceneActor$1(parent)) {
              parentNode = parent.root.hiloNode;
          }
          else {
              parentNode = parent.hiloNode;
              // parent is component, child must be component
              isComponent = true;
          }
      }
      if (parentNode && parentNode.gltfExtensions && parentNode.gltfExtensions.Sein_node) {
          parentSeinNode = parentNode.gltfExtensions.Sein_node;
      }
      else {
          parentSeinNode = {};
      }
      var length = children.length;
      var _loop_1 = function (i) {
          var child = children[i];
          child.gltfExtensions = child.gltfExtensions || {};
          child.childrenOffset = 0;
          var childSeinNode = void 0;
          var skipThisNode = false;
          if (child.gltfExtensions.Sein_node) {
              childSeinNode = child.gltfExtensions.Sein_node;
              skipThisNode = childSeinNode.skipThisNode;
          }
          if (forceAsComponent || className) {
              childSeinNode = childSeinNode || {
                  selfType: exports.ESeinNodeType.Actor,
                  childrenType: exports.ESeinNodeType.Component
              };
          }
          if (forceAsComponent) {
              childSeinNode.selfType = exports.ESeinNodeType.Component;
          }
          if (className) {
              childSeinNode.className = className;
          }
          // parent is actor, childrenType is component and selfType of child is component
          if (childSeinNode && childSeinNode.selfType === exports.ESeinNodeType.Actor) {
              isComponent = false;
          }
          else if (!isComponent
              && parentSeinNode.childrenType === exports.ESeinNodeType.Component
              && (!childSeinNode || childSeinNode.selfType !== exports.ESeinNodeType.Actor)) {
              isComponent = true;
          }
          else if (childSeinNode && childSeinNode.selfType === exports.ESeinNodeType.Component) {
              isComponent = true;
          }
          var result = parent;
          if (!skipThisNode) {
              result = generateActorOrComponentFromNode(child, (parent && !isSceneActor$1(parent)) ? parent.getOwner() : parent, (parent && isSceneActor$1(parent)) ? null : parent, isComponent, resource, game.world);
              if (isSceneActor$1(result)) {
                  var actor = result;
                  actor.animNameMap = {};
                  actor.jointNameMap = {};
                  actor.animCount = 0;
                  actor.skeletalMeshComponents = actor.skeletalMeshComponents || [];
                  var animationId = actor.root.hiloNode.animationId;
                  if (resource.anim && resource.anim.validAnimationIds[animationId]) {
                      actor.animNameMap[animationId] = actor.root.hiloNode;
                      actor.animCount += 1;
                  }
                  if (actor.root.hiloNode.jointName !== undefined) {
                      actor.jointNameMap[actor.root.hiloNode.jointName] = actor.root.hiloNode;
                  }
                  actors.add(actor);
              }
              Object.keys(child.gltfExtensions).forEach(function (name) {
                  // 避免循环依赖，临时解决方案
                  var handler = Hilo3d$2.GLTFParser.extensionHandlers[name];
                  if (handler && handler.instantiate) {
                      handler.instantiate(result, child.gltfExtensions[name], game, child, resource);
                  }
              });
          }
          var offset = child.childrenOffset || 0;
          // Leaf node
          if (!child.children || child.children.length === offset) {
              return "continue";
          }
          // const grandson = child.children[offset];
          // if (child.children.length === offset + 1 && (!grandson.children || grandson.children.length === 0)) {
          //   console.log(child, child.jointName);
          //   continue;
          // }
          convert(game, result, child.children.slice(offset), actors, resource);
      };
      for (var i = 0; i < length; i += 1) {
          _loop_1(i);
      }
  }
  /* tslint:enable */
  /**
   * @hidden
   */
  function addActorsFromGlTF(game, entity, options) {
      var resource = entity.result;
      var node = resource.node;
      if (options && options.nodePath && options.nodePath.length !== 0) {
          node = resource.node.getChildByNamePath(options.nodePath);
          if (!node) {
              throw new Error("Resource \"" + entity.name + "\" in type \"GlTF\" dose not has node \"" + options.nodePath.toString() + "\" !");
          }
      }
      var children = null;
      var actors = new SArray();
      if (node !== resource.node) {
          children = [node];
      }
      else {
          children = node.children.slice();
      }
      if (options && options.name && children.length === 1) {
          var child = children[0];
          child.name = options.name;
      }
      convert(game, options && (options.parentActor || options.parentComponent), children, actors, resource, options && options.asComponent, options && (options.className || (options.Class && options.Class.CLASS_NAME.value)));
      actors.forEach(function (a) {
          var _a = a, animCount = _a.animCount, animNameMap = _a.animNameMap, jointNameMap = _a.jointNameMap, skeletalMeshComponents = _a.skeletalMeshComponents;
          var length = skeletalMeshComponents.length;
          for (var i = 0; i < length; i += 1) {
              var _b = skeletalMeshComponents[i], component = _b[0], meshes = _b[1];
              var len = meshes.length;
              for (var index = 0; index < len; index += 1) {
                  component.cloneSkinningFromHilo(meshes[index], jointNameMap, index);
              }
          }
          delete a.animCount;
          delete a.animNameMap;
          delete a.jointNameMap;
          delete a.skeletalMeshComponents;
          if (animCount > 0) {
              var hiloNode = a.root.hiloNode;
              hiloNode.anim = resource.anim.clone(null);
              hiloNode.anim.nodeNameMap = animNameMap;
              if (hiloNode.gltfExtensions.Sein_animator) {
                  var _c = hiloNode.gltfExtensions.Sein_animator, modelAnimations = _c.modelAnimations, prefix = _c.prefix, prefixes = _c.prefixes;
                  length = modelAnimations.length;
                  if (length !== 0) {
                      var originClips = hiloNode.anim.clips;
                      var clips = hiloNode.anim.clips = {};
                      for (var index = 0; index < length; index += 1) {
                          var name_1 = modelAnimations[index];
                          var finalPrefix = prefixes ? (prefixes[index] || prefix) : prefix;
                          clips[name_1] = originClips[finalPrefix ? finalPrefix + "@" + name_1 : name_1];
                      }
                  }
              }
              a.addComponent('animator', AnimatorComponent);
              if (hiloNode.gltfExtensions.Sein_animator) {
                  var defaultAnimation = hiloNode.gltfExtensions.Sein_animator.defaultAnimation;
                  if (defaultAnimation) {
                      a.animator.setDefault(defaultAnimation);
                  }
              }
          }
          a.instantiated();
      });
      return actors;
  }

  /**
   * @hidden
   */
  function materialCreator(name, metaData, json, parser) {
      if (!metaData || !metaData.extensions || !metaData.extensions['Sein_customMaterial']) {
          return;
      }
      var extensions = metaData.extensions, alphaMode = metaData.alphaMode, doubleSided = metaData.doubleSided;
      var _a = extensions['Sein_customMaterial'], className = _a.className, uniforms = _a.uniforms, cloneForInst = _a.cloneForInst, renderOrder = _a.renderOrder;
      var MaterialClass = MetaSMaterials[className];
      if (!MaterialClass) {
          if (parser.ignoreMaterialError) {
              Debug.warn("ShaderMaterial \"" + className + "\" is not existed, Please ensure your material is decorated with 'Sein.SMaterial' !");
              return;
          }
          else {
              throw new Error("ShaderMaterial \"" + className + "\" is not existed, Please ensure your material is decorated with 'Sein.SMaterial' !");
          }
      }
      var options = { uniforms: {}, doubleSided: doubleSided, alphaMode: alphaMode, renderOrder: renderOrder };
      if (uniforms) {
          for (var key in uniforms) {
              var _b = uniforms[key], type = _b.type, value = _b.value;
              var v = null;
              switch (type) {
                  case Constants.SAMPLER_2D:
                      v = parser.textures[value.index];
                      break;
                  case Constants.FLOAT_VEC2:
                  case Constants.INT_VEC2:
                      v = new Vector2();
                      v.fromArray(value);
                      break;
                  case Constants.FLOAT_VEC3:
                  case Constants.INT_VEC3:
                      v = new Vector3();
                      v.fromArray(value);
                      break;
                  case Constants.FLOAT_VEC4:
                  case Constants.INT_VEC4:
                      v = new Color();
                      v.fromArray(value);
                      break;
                  case Constants.FLOAT_MAT3:
                      v = new Matrix3();
                      v.fromArray(value);
                      break;
                  case Constants.FLOAT_MAT4:
                      v = new Matrix4();
                      v.fromArray(value);
                      break;
                  default:
                      v = uniforms[key].value;
                      break;
              }
              options.uniforms[key] = { value: v };
          }
      }
      var material = new MaterialClass(options);
      if (cloneForInst !== undefined) {
          material.cloneForInst = cloneForInst;
      }
      material.initCommonOptions(options, true);
      var Sein_customMaterial = extensions.Sein_customMaterial, others = __rest(extensions, ["Sein_customMaterial"]);
      parser.parseExtensions(others, material, { isMaterial: true });
      return material;
  }
  /**
   * 判断一个实例是否为`GlTFLoader`。
   */
  function isGlTFLoader(value) {
      return value.isGlTFLoader;
  }
  /**
   * GlTF加载器。
   *
   * @noInheritDoc
   */
  var GlTFLoader = /** @class */ (function (_super) {
      __extends(GlTFLoader, _super);
      function GlTFLoader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isGlTFLoader = true;
          return _this;
      }
      /**
       * 注册GlTFLoader的扩展。
       */
      GlTFLoader.REGISTER_EXTENSION = function (hander) {
          if (!hander.parse) {
              hander.parse = getDefaultParse(hander.name);
          }
          else {
              var parse_1 = hander.parse;
              hander.parse = function (info, parser, entity, options) {
                  getDefaultParse(hander.name);
                  return parse_1(info, parser, entity, options);
              };
          }
          Hilo3d$2.GLTFParser.registerExtensionHandler(hander.name, hander);
      };
      /**
       * 取消注册GlTFLoader的扩展。
       */
      GlTFLoader.UNREGISTER_EXTENSION = function (hander) {
          Hilo3d$2.GLTFParser.unregisterExtensionHandler(hander.name);
      };
      /**
       * 获取GlTFLoader的扩展。
       */
      GlTFLoader.GET_EXTENSION_HANDLER = function (name) {
          return Hilo3d$2.GLTFParser.extensionHandlers[name];
      };
      GlTFLoader.prototype.load = function (entity, callbacks) {
          var loader = new Hilo3d$2.GLTFLoader();
          loader.game = this.game;
          loader.on('progress', function (event) {
              var _a = event.detail, loaded = _a.loaded, total = _a.total;
              if (total > 0) {
                  callbacks.onLoading(entity, loaded / total);
              }
          });
          loader.load({
              src: entity.url,
              isProgressive: entity.isProgressive || false,
              customMaterialCreator: materialCreator,
              isLoadAllTextures: true,
              ignoreTextureError: entity.ignoreTextureError,
              game: this.game,
              ignoreMaterialError: entity.ignoreMaterialError || false
          })
              .then(function (result) {
              entity.result = result;
              callbacks.onLoaded(entity);
          })
              .catch(function (error) { return callbacks.onError(entity, error); });
      };
      /**
       * 将GlTF资源实例化为Actor或者Component。
       */
      GlTFLoader.prototype.instantiate = function (entity, options) {
          return addActorsFromGlTF(this.game, entity, options);
      };
      /**
       * 释放资源时将会调用，用于自定义释放逻辑。
       */
      GlTFLoader.prototype.release = function (entity) {
          entity.result.node.destroy(this.game.renderer, true);
      };
      GlTFLoader.FORMATS = ['.gltf', '.glb'];
      GlTFLoader = __decorate([
          SClass({ className: 'GlTFLoader' })
      ], GlTFLoader);
      return GlTFLoader;
  }(ResourceLoader));
  GlTFLoader.REGISTER_EXTENSION(SeinNodeExtension);
  GlTFLoader.REGISTER_EXTENSION(SeinPhysicBodyExtension);
  GlTFLoader.REGISTER_EXTENSION(SeinAnimatorExtension);
  GlTFLoader.REGISTER_EXTENSION(SeinRendererExtension);
  GlTFLoader.REGISTER_EXTENSION(SeinAmbientLightExtension);
  GlTFLoader.REGISTER_EXTENSION(SeinImageBasedLightingExtension);

  /**
   * 判断一个实例是否为`ImageLoader`。
   */
  function isImageLoader(value) {
      return value.isImageLoader;
  }
  /**
   * 图片加载器。
   *
   * @noInheritDoc
   */
  var ImageLoader = /** @class */ (function (_super) {
      __extends(ImageLoader, _super);
      function ImageLoader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isImageLoader = true;
          return _this;
      }
      ImageLoader.prototype.load = function (entity, callbacks) {
          return __awaiter(this, void 0, void 0, function () {
              var image;
              return __generator(this, function (_a) {
                  image = document.createElement('img');
                  image.onload = function () {
                      image.onerror = null;
                      image.onabort = null;
                      image.onload = null;
                      if (entity.canceled) {
                          return;
                      }
                      entity.result = image;
                      callbacks.onLoaded(entity);
                  };
                  image.onerror = function () {
                      callbacks.onError(entity, new Error("Error when loading " + entity.url));
                  };
                  image.crossOrigin = (entity.crossOrigin || false) ? 'Anonymous' : '';
                  image.src = entity.url;
                  return [2 /*return*/];
              });
          });
      };
      ImageLoader = __decorate([
          SClass({ className: 'ImageLoader' })
      ], ImageLoader);
      return ImageLoader;
  }(ResourceLoader));

  /**
   * 判断一个实例是否为`TextureLoader`。
   */
  function isTextureLoader(value) {
      return value.isTextureLoader;
  }
  /**
   * @hidden
   */
  var loader = new Hilo3d$2.TextureLoader();
  /**
   * @hidden
   */
  var hdrLoader = new Hilo3d$2.HDRLoader;
  /**
   * @hidden
   */
  var ktxLoader = new Hilo3d$2.KTXLoader;
  /**
   * 纹理加载器。
   *
   * @noInheritDoc
   */
  var TextureLoader = /** @class */ (function (_super) {
      __extends(TextureLoader, _super);
      function TextureLoader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isTextureLoader = true;
          return _this;
      }
      TextureLoader.prototype.load = function (entity, callbacks) {
          var realLoader = (entity.hdr || /.hdr$/.test(entity.url)) ? hdrLoader : (entity.ktx || /.ktx$/.test(entity.url)) ? ktxLoader : loader;
          realLoader.load({
              src: entity.url,
              crossOrigin: entity.crossOrigin || false,
              uv: entity.uv || 0,
              flipY: entity.flipY
          })
              .then(function (result) {
              entity.result = result;
              callbacks.onLoaded(entity);
          })
              .catch(function (error) { return callbacks.onError(entity, error); });
      };
      /**
       * 释放资源时将会调用，用于自定义释放逻辑。
       */
      TextureLoader.prototype.release = function (entity) {
          entity.result.destroy();
      };
      TextureLoader.EXTENSIONS = ['.png', '.jpg', '.bmp', '.hdr', '.ktx'];
      TextureLoader = __decorate([
          SClass({ className: 'TextureLoader' })
      ], TextureLoader);
      return TextureLoader;
  }(ResourceLoader));

  var axios = createCommonjsModule(function (module, exports) {
  /* axios v0.18.1 | (c) 2019 by Matt Zabriskie */
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory();
  })(commonjsGlobal, function() {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId])
  /******/ 			return installedModules[moduleId].exports;
  /******/
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			exports: {},
  /******/ 			id: moduleId,
  /******/ 			loaded: false
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.loaded = true;
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
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(0);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ (function(module, exports, __webpack_require__) {

  	module.exports = __webpack_require__(1);

  /***/ }),
  /* 1 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var bind = __webpack_require__(3);
  	var Axios = __webpack_require__(5);
  	var defaults = __webpack_require__(6);
  	
  	/**
  	 * Create an instance of Axios
  	 *
  	 * @param {Object} defaultConfig The default config for the instance
  	 * @return {Axios} A new instance of Axios
  	 */
  	function createInstance(defaultConfig) {
  	  var context = new Axios(defaultConfig);
  	  var instance = bind(Axios.prototype.request, context);
  	
  	  // Copy axios.prototype to instance
  	  utils.extend(instance, Axios.prototype, context);
  	
  	  // Copy context to instance
  	  utils.extend(instance, context);
  	
  	  return instance;
  	}
  	
  	// Create the default instance to be exported
  	var axios = createInstance(defaults);
  	
  	// Expose Axios class to allow class inheritance
  	axios.Axios = Axios;
  	
  	// Factory for creating new instances
  	axios.create = function create(instanceConfig) {
  	  return createInstance(utils.merge(defaults, instanceConfig));
  	};
  	
  	// Expose Cancel & CancelToken
  	axios.Cancel = __webpack_require__(22);
  	axios.CancelToken = __webpack_require__(23);
  	axios.isCancel = __webpack_require__(19);
  	
  	// Expose all/spread
  	axios.all = function all(promises) {
  	  return Promise.all(promises);
  	};
  	axios.spread = __webpack_require__(24);
  	
  	module.exports = axios;
  	
  	// Allow use of default import syntax in TypeScript
  	module.exports.default = axios;


  /***/ }),
  /* 2 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var bind = __webpack_require__(3);
  	var isBuffer = __webpack_require__(4);
  	
  	/*global toString:true*/
  	
  	// utils is a library of generic helper functions non-specific to axios
  	
  	var toString = Object.prototype.toString;
  	
  	/**
  	 * Determine if a value is an Array
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an Array, otherwise false
  	 */
  	function isArray(val) {
  	  return toString.call(val) === '[object Array]';
  	}
  	
  	/**
  	 * Determine if a value is an ArrayBuffer
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
  	 */
  	function isArrayBuffer(val) {
  	  return toString.call(val) === '[object ArrayBuffer]';
  	}
  	
  	/**
  	 * Determine if a value is a FormData
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an FormData, otherwise false
  	 */
  	function isFormData(val) {
  	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
  	}
  	
  	/**
  	 * Determine if a value is a view on an ArrayBuffer
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
  	 */
  	function isArrayBufferView(val) {
  	  var result;
  	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
  	    result = ArrayBuffer.isView(val);
  	  } else {
  	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  	  }
  	  return result;
  	}
  	
  	/**
  	 * Determine if a value is a String
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a String, otherwise false
  	 */
  	function isString(val) {
  	  return typeof val === 'string';
  	}
  	
  	/**
  	 * Determine if a value is a Number
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Number, otherwise false
  	 */
  	function isNumber(val) {
  	  return typeof val === 'number';
  	}
  	
  	/**
  	 * Determine if a value is undefined
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if the value is undefined, otherwise false
  	 */
  	function isUndefined(val) {
  	  return typeof val === 'undefined';
  	}
  	
  	/**
  	 * Determine if a value is an Object
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an Object, otherwise false
  	 */
  	function isObject(val) {
  	  return val !== null && typeof val === 'object';
  	}
  	
  	/**
  	 * Determine if a value is a Date
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Date, otherwise false
  	 */
  	function isDate(val) {
  	  return toString.call(val) === '[object Date]';
  	}
  	
  	/**
  	 * Determine if a value is a File
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a File, otherwise false
  	 */
  	function isFile(val) {
  	  return toString.call(val) === '[object File]';
  	}
  	
  	/**
  	 * Determine if a value is a Blob
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Blob, otherwise false
  	 */
  	function isBlob(val) {
  	  return toString.call(val) === '[object Blob]';
  	}
  	
  	/**
  	 * Determine if a value is a Function
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Function, otherwise false
  	 */
  	function isFunction(val) {
  	  return toString.call(val) === '[object Function]';
  	}
  	
  	/**
  	 * Determine if a value is a Stream
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Stream, otherwise false
  	 */
  	function isStream(val) {
  	  return isObject(val) && isFunction(val.pipe);
  	}
  	
  	/**
  	 * Determine if a value is a URLSearchParams object
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
  	 */
  	function isURLSearchParams(val) {
  	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  	}
  	
  	/**
  	 * Trim excess whitespace off the beginning and end of a string
  	 *
  	 * @param {String} str The String to trim
  	 * @returns {String} The String freed of excess whitespace
  	 */
  	function trim(str) {
  	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
  	}
  	
  	/**
  	 * Determine if we're running in a standard browser environment
  	 *
  	 * This allows axios to run in a web worker, and react-native.
  	 * Both environments support XMLHttpRequest, but not fully standard globals.
  	 *
  	 * web workers:
  	 *  typeof window -> undefined
  	 *  typeof document -> undefined
  	 *
  	 * react-native:
  	 *  navigator.product -> 'ReactNative'
  	 */
  	function isStandardBrowserEnv() {
  	  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  	    return false;
  	  }
  	  return (
  	    typeof window !== 'undefined' &&
  	    typeof document !== 'undefined'
  	  );
  	}
  	
  	/**
  	 * Iterate over an Array or an Object invoking a function for each item.
  	 *
  	 * If `obj` is an Array callback will be called passing
  	 * the value, index, and complete array for each item.
  	 *
  	 * If 'obj' is an Object callback will be called passing
  	 * the value, key, and complete object for each property.
  	 *
  	 * @param {Object|Array} obj The object to iterate
  	 * @param {Function} fn The callback to invoke for each item
  	 */
  	function forEach(obj, fn) {
  	  // Don't bother if no value provided
  	  if (obj === null || typeof obj === 'undefined') {
  	    return;
  	  }
  	
  	  // Force an array if not already something iterable
  	  if (typeof obj !== 'object') {
  	    /*eslint no-param-reassign:0*/
  	    obj = [obj];
  	  }
  	
  	  if (isArray(obj)) {
  	    // Iterate over array values
  	    for (var i = 0, l = obj.length; i < l; i++) {
  	      fn.call(null, obj[i], i, obj);
  	    }
  	  } else {
  	    // Iterate over object keys
  	    for (var key in obj) {
  	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
  	        fn.call(null, obj[key], key, obj);
  	      }
  	    }
  	  }
  	}
  	
  	/**
  	 * Accepts varargs expecting each argument to be an object, then
  	 * immutably merges the properties of each object and returns result.
  	 *
  	 * When multiple objects contain the same key the later object in
  	 * the arguments list will take precedence.
  	 *
  	 * Example:
  	 *
  	 * ```js
  	 * var result = merge({foo: 123}, {foo: 456});
  	 * console.log(result.foo); // outputs 456
  	 * ```
  	 *
  	 * @param {Object} obj1 Object to merge
  	 * @returns {Object} Result of all merge properties
  	 */
  	function merge(/* obj1, obj2, obj3, ... */) {
  	  var result = {};
  	  function assignValue(val, key) {
  	    if (typeof result[key] === 'object' && typeof val === 'object') {
  	      result[key] = merge(result[key], val);
  	    } else {
  	      result[key] = val;
  	    }
  	  }
  	
  	  for (var i = 0, l = arguments.length; i < l; i++) {
  	    forEach(arguments[i], assignValue);
  	  }
  	  return result;
  	}
  	
  	/**
  	 * Extends object a by mutably adding to it the properties of object b.
  	 *
  	 * @param {Object} a The object to be extended
  	 * @param {Object} b The object to copy properties from
  	 * @param {Object} thisArg The object to bind function to
  	 * @return {Object} The resulting value of object a
  	 */
  	function extend(a, b, thisArg) {
  	  forEach(b, function assignValue(val, key) {
  	    if (thisArg && typeof val === 'function') {
  	      a[key] = bind(val, thisArg);
  	    } else {
  	      a[key] = val;
  	    }
  	  });
  	  return a;
  	}
  	
  	module.exports = {
  	  isArray: isArray,
  	  isArrayBuffer: isArrayBuffer,
  	  isBuffer: isBuffer,
  	  isFormData: isFormData,
  	  isArrayBufferView: isArrayBufferView,
  	  isString: isString,
  	  isNumber: isNumber,
  	  isObject: isObject,
  	  isUndefined: isUndefined,
  	  isDate: isDate,
  	  isFile: isFile,
  	  isBlob: isBlob,
  	  isFunction: isFunction,
  	  isStream: isStream,
  	  isURLSearchParams: isURLSearchParams,
  	  isStandardBrowserEnv: isStandardBrowserEnv,
  	  forEach: forEach,
  	  merge: merge,
  	  extend: extend,
  	  trim: trim
  	};


  /***/ }),
  /* 3 */
  /***/ (function(module, exports) {
  	
  	module.exports = function bind(fn, thisArg) {
  	  return function wrap() {
  	    var args = new Array(arguments.length);
  	    for (var i = 0; i < args.length; i++) {
  	      args[i] = arguments[i];
  	    }
  	    return fn.apply(thisArg, args);
  	  };
  	};


  /***/ }),
  /* 4 */
  /***/ (function(module, exports) {

  	/*!
  	 * Determine if an object is a Buffer
  	 *
  	 * @author   Feross Aboukhadijeh <https://feross.org>
  	 * @license  MIT
  	 */
  	
  	module.exports = function isBuffer (obj) {
  	  return obj != null && obj.constructor != null &&
  	    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  	};


  /***/ }),
  /* 5 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var defaults = __webpack_require__(6);
  	var utils = __webpack_require__(2);
  	var InterceptorManager = __webpack_require__(16);
  	var dispatchRequest = __webpack_require__(17);
  	
  	/**
  	 * Create a new instance of Axios
  	 *
  	 * @param {Object} instanceConfig The default config for the instance
  	 */
  	function Axios(instanceConfig) {
  	  this.defaults = instanceConfig;
  	  this.interceptors = {
  	    request: new InterceptorManager(),
  	    response: new InterceptorManager()
  	  };
  	}
  	
  	/**
  	 * Dispatch a request
  	 *
  	 * @param {Object} config The config specific for this request (merged with this.defaults)
  	 */
  	Axios.prototype.request = function request(config) {
  	  /*eslint no-param-reassign:0*/
  	  // Allow for axios('example/url'[, config]) a la fetch API
  	  if (typeof config === 'string') {
  	    config = utils.merge({
  	      url: arguments[0]
  	    }, arguments[1]);
  	  }
  	
  	  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  	  config.method = config.method.toLowerCase();
  	
  	  // Hook up interceptors middleware
  	  var chain = [dispatchRequest, undefined];
  	  var promise = Promise.resolve(config);
  	
  	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
  	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  	  });
  	
  	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
  	    chain.push(interceptor.fulfilled, interceptor.rejected);
  	  });
  	
  	  while (chain.length) {
  	    promise = promise.then(chain.shift(), chain.shift());
  	  }
  	
  	  return promise;
  	};
  	
  	// Provide aliases for supported request methods
  	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  	  /*eslint func-names:0*/
  	  Axios.prototype[method] = function(url, config) {
  	    return this.request(utils.merge(config || {}, {
  	      method: method,
  	      url: url
  	    }));
  	  };
  	});
  	
  	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  	  /*eslint func-names:0*/
  	  Axios.prototype[method] = function(url, data, config) {
  	    return this.request(utils.merge(config || {}, {
  	      method: method,
  	      url: url,
  	      data: data
  	    }));
  	  };
  	});
  	
  	module.exports = Axios;


  /***/ }),
  /* 6 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var normalizeHeaderName = __webpack_require__(7);
  	
  	var DEFAULT_CONTENT_TYPE = {
  	  'Content-Type': 'application/x-www-form-urlencoded'
  	};
  	
  	function setContentTypeIfUnset(headers, value) {
  	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
  	    headers['Content-Type'] = value;
  	  }
  	}
  	
  	function getDefaultAdapter() {
  	  var adapter;
  	  if (typeof XMLHttpRequest !== 'undefined') {
  	    // For browsers use XHR adapter
  	    adapter = __webpack_require__(8);
  	  } else if (typeof process !== 'undefined') {
  	    // For node use HTTP adapter
  	    adapter = __webpack_require__(8);
  	  }
  	  return adapter;
  	}
  	
  	var defaults = {
  	  adapter: getDefaultAdapter(),
  	
  	  transformRequest: [function transformRequest(data, headers) {
  	    normalizeHeaderName(headers, 'Content-Type');
  	    if (utils.isFormData(data) ||
  	      utils.isArrayBuffer(data) ||
  	      utils.isBuffer(data) ||
  	      utils.isStream(data) ||
  	      utils.isFile(data) ||
  	      utils.isBlob(data)
  	    ) {
  	      return data;
  	    }
  	    if (utils.isArrayBufferView(data)) {
  	      return data.buffer;
  	    }
  	    if (utils.isURLSearchParams(data)) {
  	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
  	      return data.toString();
  	    }
  	    if (utils.isObject(data)) {
  	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
  	      return JSON.stringify(data);
  	    }
  	    return data;
  	  }],
  	
  	  transformResponse: [function transformResponse(data) {
  	    /*eslint no-param-reassign:0*/
  	    if (typeof data === 'string') {
  	      try {
  	        data = JSON.parse(data);
  	      } catch (e) { /* Ignore */ }
  	    }
  	    return data;
  	  }],
  	
  	  /**
  	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
  	   * timeout is not created.
  	   */
  	  timeout: 0,
  	
  	  xsrfCookieName: 'XSRF-TOKEN',
  	  xsrfHeaderName: 'X-XSRF-TOKEN',
  	
  	  maxContentLength: -1,
  	
  	  validateStatus: function validateStatus(status) {
  	    return status >= 200 && status < 300;
  	  }
  	};
  	
  	defaults.headers = {
  	  common: {
  	    'Accept': 'application/json, text/plain, */*'
  	  }
  	};
  	
  	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  	  defaults.headers[method] = {};
  	});
  	
  	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  	});
  	
  	module.exports = defaults;


  /***/ }),
  /* 7 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	module.exports = function normalizeHeaderName(headers, normalizedName) {
  	  utils.forEach(headers, function processHeader(value, name) {
  	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
  	      headers[normalizedName] = value;
  	      delete headers[name];
  	    }
  	  });
  	};


  /***/ }),
  /* 8 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var settle = __webpack_require__(9);
  	var buildURL = __webpack_require__(12);
  	var parseHeaders = __webpack_require__(13);
  	var isURLSameOrigin = __webpack_require__(14);
  	var createError = __webpack_require__(10);
  	
  	module.exports = function xhrAdapter(config) {
  	  return new Promise(function dispatchXhrRequest(resolve, reject) {
  	    var requestData = config.data;
  	    var requestHeaders = config.headers;
  	
  	    if (utils.isFormData(requestData)) {
  	      delete requestHeaders['Content-Type']; // Let the browser set it
  	    }
  	
  	    var request = new XMLHttpRequest();
  	
  	    // HTTP basic authentication
  	    if (config.auth) {
  	      var username = config.auth.username || '';
  	      var password = config.auth.password || '';
  	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
  	    }
  	
  	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
  	
  	    // Set the request timeout in MS
  	    request.timeout = config.timeout;
  	
  	    // Listen for ready state
  	    request.onreadystatechange = function handleLoad() {
  	      if (!request || request.readyState !== 4) {
  	        return;
  	      }
  	
  	      // The request errored out and we didn't get a response, this will be
  	      // handled by onerror instead
  	      // With one exception: request that using file: protocol, most browsers
  	      // will return status as 0 even though it's a successful request
  	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
  	        return;
  	      }
  	
  	      // Prepare the response
  	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
  	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
  	      var response = {
  	        data: responseData,
  	        status: request.status,
  	        statusText: request.statusText,
  	        headers: responseHeaders,
  	        config: config,
  	        request: request
  	      };
  	
  	      settle(resolve, reject, response);
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Handle low level network errors
  	    request.onerror = function handleError() {
  	      // Real errors are hidden from us by the browser
  	      // onerror should only fire if it's a network error
  	      reject(createError('Network Error', config, null, request));
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Handle timeout
  	    request.ontimeout = function handleTimeout() {
  	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
  	        request));
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Add xsrf header
  	    // This is only done if running in a standard browser environment.
  	    // Specifically not if we're in a web worker, or react-native.
  	    if (utils.isStandardBrowserEnv()) {
  	      var cookies = __webpack_require__(15);
  	
  	      // Add xsrf header
  	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
  	          cookies.read(config.xsrfCookieName) :
  	          undefined;
  	
  	      if (xsrfValue) {
  	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
  	      }
  	    }
  	
  	    // Add headers to the request
  	    if ('setRequestHeader' in request) {
  	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
  	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
  	          // Remove Content-Type if data is undefined
  	          delete requestHeaders[key];
  	        } else {
  	          // Otherwise add header to the request
  	          request.setRequestHeader(key, val);
  	        }
  	      });
  	    }
  	
  	    // Add withCredentials to request if needed
  	    if (config.withCredentials) {
  	      request.withCredentials = true;
  	    }
  	
  	    // Add responseType to request if needed
  	    if (config.responseType) {
  	      try {
  	        request.responseType = config.responseType;
  	      } catch (e) {
  	        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
  	        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
  	        if (config.responseType !== 'json') {
  	          throw e;
  	        }
  	      }
  	    }
  	
  	    // Handle progress if needed
  	    if (typeof config.onDownloadProgress === 'function') {
  	      request.addEventListener('progress', config.onDownloadProgress);
  	    }
  	
  	    // Not all browsers support upload events
  	    if (typeof config.onUploadProgress === 'function' && request.upload) {
  	      request.upload.addEventListener('progress', config.onUploadProgress);
  	    }
  	
  	    if (config.cancelToken) {
  	      // Handle cancellation
  	      config.cancelToken.promise.then(function onCanceled(cancel) {
  	        if (!request) {
  	          return;
  	        }
  	
  	        request.abort();
  	        reject(cancel);
  	        // Clean up request
  	        request = null;
  	      });
  	    }
  	
  	    if (requestData === undefined) {
  	      requestData = null;
  	    }
  	
  	    // Send the request
  	    request.send(requestData);
  	  });
  	};


  /***/ }),
  /* 9 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var createError = __webpack_require__(10);
  	
  	/**
  	 * Resolve or reject a Promise based on response status.
  	 *
  	 * @param {Function} resolve A function that resolves the promise.
  	 * @param {Function} reject A function that rejects the promise.
  	 * @param {object} response The response.
  	 */
  	module.exports = function settle(resolve, reject, response) {
  	  var validateStatus = response.config.validateStatus;
  	  // Note: status is not exposed by XDomainRequest
  	  if (!response.status || !validateStatus || validateStatus(response.status)) {
  	    resolve(response);
  	  } else {
  	    reject(createError(
  	      'Request failed with status code ' + response.status,
  	      response.config,
  	      null,
  	      response.request,
  	      response
  	    ));
  	  }
  	};


  /***/ }),
  /* 10 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var enhanceError = __webpack_require__(11);
  	
  	/**
  	 * Create an Error with the specified message, config, error code, request and response.
  	 *
  	 * @param {string} message The error message.
  	 * @param {Object} config The config.
  	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
  	 * @param {Object} [request] The request.
  	 * @param {Object} [response] The response.
  	 * @returns {Error} The created error.
  	 */
  	module.exports = function createError(message, config, code, request, response) {
  	  var error = new Error(message);
  	  return enhanceError(error, config, code, request, response);
  	};


  /***/ }),
  /* 11 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Update an Error with the specified config, error code, and response.
  	 *
  	 * @param {Error} error The error to update.
  	 * @param {Object} config The config.
  	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
  	 * @param {Object} [request] The request.
  	 * @param {Object} [response] The response.
  	 * @returns {Error} The error.
  	 */
  	module.exports = function enhanceError(error, config, code, request, response) {
  	  error.config = config;
  	  if (code) {
  	    error.code = code;
  	  }
  	  error.request = request;
  	  error.response = response;
  	  return error;
  	};


  /***/ }),
  /* 12 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	function encode(val) {
  	  return encodeURIComponent(val).
  	    replace(/%40/gi, '@').
  	    replace(/%3A/gi, ':').
  	    replace(/%24/g, '$').
  	    replace(/%2C/gi, ',').
  	    replace(/%20/g, '+').
  	    replace(/%5B/gi, '[').
  	    replace(/%5D/gi, ']');
  	}
  	
  	/**
  	 * Build a URL by appending params to the end
  	 *
  	 * @param {string} url The base of the url (e.g., http://www.google.com)
  	 * @param {object} [params] The params to be appended
  	 * @returns {string} The formatted url
  	 */
  	module.exports = function buildURL(url, params, paramsSerializer) {
  	  /*eslint no-param-reassign:0*/
  	  if (!params) {
  	    return url;
  	  }
  	
  	  var serializedParams;
  	  if (paramsSerializer) {
  	    serializedParams = paramsSerializer(params);
  	  } else if (utils.isURLSearchParams(params)) {
  	    serializedParams = params.toString();
  	  } else {
  	    var parts = [];
  	
  	    utils.forEach(params, function serialize(val, key) {
  	      if (val === null || typeof val === 'undefined') {
  	        return;
  	      }
  	
  	      if (utils.isArray(val)) {
  	        key = key + '[]';
  	      } else {
  	        val = [val];
  	      }
  	
  	      utils.forEach(val, function parseValue(v) {
  	        if (utils.isDate(v)) {
  	          v = v.toISOString();
  	        } else if (utils.isObject(v)) {
  	          v = JSON.stringify(v);
  	        }
  	        parts.push(encode(key) + '=' + encode(v));
  	      });
  	    });
  	
  	    serializedParams = parts.join('&');
  	  }
  	
  	  if (serializedParams) {
  	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  	  }
  	
  	  return url;
  	};


  /***/ }),
  /* 13 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	// Headers whose duplicates are ignored by node
  	// c.f. https://nodejs.org/api/http.html#http_message_headers
  	var ignoreDuplicateOf = [
  	  'age', 'authorization', 'content-length', 'content-type', 'etag',
  	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  	  'referer', 'retry-after', 'user-agent'
  	];
  	
  	/**
  	 * Parse headers into an object
  	 *
  	 * ```
  	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
  	 * Content-Type: application/json
  	 * Connection: keep-alive
  	 * Transfer-Encoding: chunked
  	 * ```
  	 *
  	 * @param {String} headers Headers needing to be parsed
  	 * @returns {Object} Headers parsed into an object
  	 */
  	module.exports = function parseHeaders(headers) {
  	  var parsed = {};
  	  var key;
  	  var val;
  	  var i;
  	
  	  if (!headers) { return parsed; }
  	
  	  utils.forEach(headers.split('\n'), function parser(line) {
  	    i = line.indexOf(':');
  	    key = utils.trim(line.substr(0, i)).toLowerCase();
  	    val = utils.trim(line.substr(i + 1));
  	
  	    if (key) {
  	      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
  	        return;
  	      }
  	      if (key === 'set-cookie') {
  	        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
  	      } else {
  	        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
  	      }
  	    }
  	  });
  	
  	  return parsed;
  	};


  /***/ }),
  /* 14 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	module.exports = (
  	  utils.isStandardBrowserEnv() ?
  	
  	  // Standard browser envs have full support of the APIs needed to test
  	  // whether the request URL is of the same origin as current location.
  	  (function standardBrowserEnv() {
  	    var msie = /(msie|trident)/i.test(navigator.userAgent);
  	    var urlParsingNode = document.createElement('a');
  	    var originURL;
  	
  	    /**
  	    * Parse a URL to discover it's components
  	    *
  	    * @param {String} url The URL to be parsed
  	    * @returns {Object}
  	    */
  	    function resolveURL(url) {
  	      var href = url;
  	
  	      if (msie) {
  	        // IE needs attribute set twice to normalize properties
  	        urlParsingNode.setAttribute('href', href);
  	        href = urlParsingNode.href;
  	      }
  	
  	      urlParsingNode.setAttribute('href', href);
  	
  	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
  	      return {
  	        href: urlParsingNode.href,
  	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
  	        host: urlParsingNode.host,
  	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
  	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
  	        hostname: urlParsingNode.hostname,
  	        port: urlParsingNode.port,
  	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
  	                  urlParsingNode.pathname :
  	                  '/' + urlParsingNode.pathname
  	      };
  	    }
  	
  	    originURL = resolveURL(window.location.href);
  	
  	    /**
  	    * Determine if a URL shares the same origin as the current location
  	    *
  	    * @param {String} requestURL The URL to test
  	    * @returns {boolean} True if URL shares the same origin, otherwise false
  	    */
  	    return function isURLSameOrigin(requestURL) {
  	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
  	      return (parsed.protocol === originURL.protocol &&
  	            parsed.host === originURL.host);
  	    };
  	  })() :
  	
  	  // Non standard browser envs (web workers, react-native) lack needed support.
  	  (function nonStandardBrowserEnv() {
  	    return function isURLSameOrigin() {
  	      return true;
  	    };
  	  })()
  	);


  /***/ }),
  /* 15 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	module.exports = (
  	  utils.isStandardBrowserEnv() ?
  	
  	  // Standard browser envs support document.cookie
  	  (function standardBrowserEnv() {
  	    return {
  	      write: function write(name, value, expires, path, domain, secure) {
  	        var cookie = [];
  	        cookie.push(name + '=' + encodeURIComponent(value));
  	
  	        if (utils.isNumber(expires)) {
  	          cookie.push('expires=' + new Date(expires).toGMTString());
  	        }
  	
  	        if (utils.isString(path)) {
  	          cookie.push('path=' + path);
  	        }
  	
  	        if (utils.isString(domain)) {
  	          cookie.push('domain=' + domain);
  	        }
  	
  	        if (secure === true) {
  	          cookie.push('secure');
  	        }
  	
  	        document.cookie = cookie.join('; ');
  	      },
  	
  	      read: function read(name) {
  	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  	        return (match ? decodeURIComponent(match[3]) : null);
  	      },
  	
  	      remove: function remove(name) {
  	        this.write(name, '', Date.now() - 86400000);
  	      }
  	    };
  	  })() :
  	
  	  // Non standard browser env (web workers, react-native) lack needed support.
  	  (function nonStandardBrowserEnv() {
  	    return {
  	      write: function write() {},
  	      read: function read() { return null; },
  	      remove: function remove() {}
  	    };
  	  })()
  	);


  /***/ }),
  /* 16 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	function InterceptorManager() {
  	  this.handlers = [];
  	}
  	
  	/**
  	 * Add a new interceptor to the stack
  	 *
  	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
  	 * @param {Function} rejected The function to handle `reject` for a `Promise`
  	 *
  	 * @return {Number} An ID used to remove interceptor later
  	 */
  	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  	  this.handlers.push({
  	    fulfilled: fulfilled,
  	    rejected: rejected
  	  });
  	  return this.handlers.length - 1;
  	};
  	
  	/**
  	 * Remove an interceptor from the stack
  	 *
  	 * @param {Number} id The ID that was returned by `use`
  	 */
  	InterceptorManager.prototype.eject = function eject(id) {
  	  if (this.handlers[id]) {
  	    this.handlers[id] = null;
  	  }
  	};
  	
  	/**
  	 * Iterate over all the registered interceptors
  	 *
  	 * This method is particularly useful for skipping over any
  	 * interceptors that may have become `null` calling `eject`.
  	 *
  	 * @param {Function} fn The function to call for each interceptor
  	 */
  	InterceptorManager.prototype.forEach = function forEach(fn) {
  	  utils.forEach(this.handlers, function forEachHandler(h) {
  	    if (h !== null) {
  	      fn(h);
  	    }
  	  });
  	};
  	
  	module.exports = InterceptorManager;


  /***/ }),
  /* 17 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var transformData = __webpack_require__(18);
  	var isCancel = __webpack_require__(19);
  	var defaults = __webpack_require__(6);
  	var isAbsoluteURL = __webpack_require__(20);
  	var combineURLs = __webpack_require__(21);
  	
  	/**
  	 * Throws a `Cancel` if cancellation has been requested.
  	 */
  	function throwIfCancellationRequested(config) {
  	  if (config.cancelToken) {
  	    config.cancelToken.throwIfRequested();
  	  }
  	}
  	
  	/**
  	 * Dispatch a request to the server using the configured adapter.
  	 *
  	 * @param {object} config The config that is to be used for the request
  	 * @returns {Promise} The Promise to be fulfilled
  	 */
  	module.exports = function dispatchRequest(config) {
  	  throwIfCancellationRequested(config);
  	
  	  // Support baseURL config
  	  if (config.baseURL && !isAbsoluteURL(config.url)) {
  	    config.url = combineURLs(config.baseURL, config.url);
  	  }
  	
  	  // Ensure headers exist
  	  config.headers = config.headers || {};
  	
  	  // Transform request data
  	  config.data = transformData(
  	    config.data,
  	    config.headers,
  	    config.transformRequest
  	  );
  	
  	  // Flatten headers
  	  config.headers = utils.merge(
  	    config.headers.common || {},
  	    config.headers[config.method] || {},
  	    config.headers || {}
  	  );
  	
  	  utils.forEach(
  	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
  	    function cleanHeaderConfig(method) {
  	      delete config.headers[method];
  	    }
  	  );
  	
  	  var adapter = config.adapter || defaults.adapter;
  	
  	  return adapter(config).then(function onAdapterResolution(response) {
  	    throwIfCancellationRequested(config);
  	
  	    // Transform response data
  	    response.data = transformData(
  	      response.data,
  	      response.headers,
  	      config.transformResponse
  	    );
  	
  	    return response;
  	  }, function onAdapterRejection(reason) {
  	    if (!isCancel(reason)) {
  	      throwIfCancellationRequested(config);
  	
  	      // Transform response data
  	      if (reason && reason.response) {
  	        reason.response.data = transformData(
  	          reason.response.data,
  	          reason.response.headers,
  	          config.transformResponse
  	        );
  	      }
  	    }
  	
  	    return Promise.reject(reason);
  	  });
  	};


  /***/ }),
  /* 18 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	/**
  	 * Transform the data for a request or a response
  	 *
  	 * @param {Object|String} data The data to be transformed
  	 * @param {Array} headers The headers for the request or response
  	 * @param {Array|Function} fns A single function or Array of functions
  	 * @returns {*} The resulting transformed data
  	 */
  	module.exports = function transformData(data, headers, fns) {
  	  /*eslint no-param-reassign:0*/
  	  utils.forEach(fns, function transform(fn) {
  	    data = fn(data, headers);
  	  });
  	
  	  return data;
  	};


  /***/ }),
  /* 19 */
  /***/ (function(module, exports) {
  	
  	module.exports = function isCancel(value) {
  	  return !!(value && value.__CANCEL__);
  	};


  /***/ }),
  /* 20 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Determines whether the specified URL is absolute
  	 *
  	 * @param {string} url The URL to test
  	 * @returns {boolean} True if the specified URL is absolute, otherwise false
  	 */
  	module.exports = function isAbsoluteURL(url) {
  	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  	  // by any combination of letters, digits, plus, period, or hyphen.
  	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  	};


  /***/ }),
  /* 21 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Creates a new URL by combining the specified URLs
  	 *
  	 * @param {string} baseURL The base URL
  	 * @param {string} relativeURL The relative URL
  	 * @returns {string} The combined URL
  	 */
  	module.exports = function combineURLs(baseURL, relativeURL) {
  	  return relativeURL
  	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
  	    : baseURL;
  	};


  /***/ }),
  /* 22 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * A `Cancel` is an object that is thrown when an operation is canceled.
  	 *
  	 * @class
  	 * @param {string=} message The message.
  	 */
  	function Cancel(message) {
  	  this.message = message;
  	}
  	
  	Cancel.prototype.toString = function toString() {
  	  return 'Cancel' + (this.message ? ': ' + this.message : '');
  	};
  	
  	Cancel.prototype.__CANCEL__ = true;
  	
  	module.exports = Cancel;


  /***/ }),
  /* 23 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var Cancel = __webpack_require__(22);
  	
  	/**
  	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
  	 *
  	 * @class
  	 * @param {Function} executor The executor function.
  	 */
  	function CancelToken(executor) {
  	  if (typeof executor !== 'function') {
  	    throw new TypeError('executor must be a function.');
  	  }
  	
  	  var resolvePromise;
  	  this.promise = new Promise(function promiseExecutor(resolve) {
  	    resolvePromise = resolve;
  	  });
  	
  	  var token = this;
  	  executor(function cancel(message) {
  	    if (token.reason) {
  	      // Cancellation has already been requested
  	      return;
  	    }
  	
  	    token.reason = new Cancel(message);
  	    resolvePromise(token.reason);
  	  });
  	}
  	
  	/**
  	 * Throws a `Cancel` if cancellation has been requested.
  	 */
  	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  	  if (this.reason) {
  	    throw this.reason;
  	  }
  	};
  	
  	/**
  	 * Returns an object that contains a new `CancelToken` and a function that, when called,
  	 * cancels the `CancelToken`.
  	 */
  	CancelToken.source = function source() {
  	  var cancel;
  	  var token = new CancelToken(function executor(c) {
  	    cancel = c;
  	  });
  	  return {
  	    token: token,
  	    cancel: cancel
  	  };
  	};
  	
  	module.exports = CancelToken;


  /***/ }),
  /* 24 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Syntactic sugar for invoking a function and expanding an array for arguments.
  	 *
  	 * Common use case would be to use `Function.prototype.apply`.
  	 *
  	 *  ```js
  	 *  function f(x, y, z) {}
  	 *  var args = [1, 2, 3];
  	 *  f.apply(null, args);
  	 *  ```
  	 *
  	 * With `spread` this example can be re-written.
  	 *
  	 *  ```js
  	 *  spread(function(x, y, z) {})([1, 2, 3]);
  	 *  ```
  	 *
  	 * @param {Function} callback
  	 * @returns {Function}
  	 */
  	module.exports = function spread(callback) {
  	  return function wrap(arr) {
  	    return callback.apply(null, arr);
  	  };
  	};


  /***/ })
  /******/ ])
  });

  });

  /**
   * @File   : HTTP.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 2018/9/27 下午11:23:59
   * @Description:
   */
  /**
   * 提供基本的HTTP请求能力。
   */
  var HTTP = /** @class */ (function () {
      function HTTP() {
      }
      HTTP.get = axios.get;
      HTTP.post = axios.post;
      HTTP.delete = axios.delete;
      HTTP.put = axios.put;
      HTTP.patch = axios.patch;
      HTTP.request = axios.request;
      return HTTP;
  }());

  /**
   * 判断一个实例是否为`AtlasManager`。
   */
  function isAtlasManager(value) {
      return value.isAtlasManager;
  }
  function isPowerOfTwo$1(x) {
      return (Math.log(x) / Math.log(2)) % 1 === 0;
  }
  /**
   * 图集管理器。
   * 一般通过`AtlasLoader`加载自动生成。
   *
   * @noInheritDoc
   */
  var AtlasManager = /** @class */ (function (_super) {
      __extends(AtlasManager, _super);
      /**
       * 构建一个图集。
       *
       * @param options 初始化参数。
       * @param updatable 是否是一个可更新的图集，若不是则不可调用`updateFrame`等方法。注意`updatable`的图集本身容器的宽高都必须为**2的幂！**比如512、1024、2048等等。
       */
      function AtlasManager(options, updatable) {
          if (updatable === void 0) { updatable = true; }
          var _this = _super.call(this) || this;
          _this.isAtlasManager = true;
          _this._AUTO_ID = 0;
          _this._area = 0;
          _this._needReBuild = false;
          _this._frames = options.frames;
          _this._meta = options.meta;
          _this._canvases = {};
          _this._textures = {};
          _this._updatable = updatable;
          if (options.texture) {
              _this._image = options.texture.image;
              _this._texture = options.texture;
          }
          else if (options.image instanceof HTMLCanvasElement) {
              _this._image = options.image;
              _this._ctx = _this._image.getContext('2d');
          }
          else if (updatable) {
              if (Debug.devMode && !(isPowerOfTwo$1(_this._meta.size.w) && isPowerOfTwo$1(_this._meta.size.h))) {
                  throw new Error("Atlas " + _this.name + " is updatable but it size is not power of two !");
              }
              _this._image = document.createElement('canvas');
              _this._image.width = _this._meta.size.w;
              _this._image.height = _this._meta.size.h;
              _this._ctx = _this._image.getContext('2d');
              _this._ctx.drawImage(options.image, 0, 0);
          }
          else {
              _this._image = options.image;
          }
          return _this;
      }
      AtlasManager_1 = AtlasManager;
      /**
       * 根据宽高创建一个空的图集，可自由申请或释放帧。
       */
      AtlasManager.CREATE_EMPTY = function (options) {
          var width = options.width, height = options.height;
          var canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          var context = canvas.getContext('2d');
          context.fillStyle = 'rgba(255, 255, 255, 0)';
          context.fillRect(0, 0, width, height);
          return new AtlasManager_1({ image: canvas, frames: {}, meta: { size: { w: width, h: height } } }, true);
      };
      /**
       * 根据宽高和行数、列数来创建一个空的图集。
       * 这个图集将被行列分成若干个格子帧，开发者可以根据实际状况去使用`updateFrame`更新这些格子。
       * 自动生成的帧的名字为`${row}${col}`，比如第一行第一列为`'11'`。
       *
       * @param onDraw 初始化时的回调，可以用于一开始绘制图像
       */
      AtlasManager.CREATE_FROM_GRIDS = function (options, onDraw) {
          var width = options.width, height = options.height, rows = options.rows, cols = options.cols, space = options.space;
          space = space || 0;
          var canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          var context = canvas.getContext('2d');
          context.fillStyle = 'rgba(255, 255, 255, 0)';
          context.fillRect(0, 0, width, height);
          var w = ~~(width / cols) - space;
          var h = ~~(height / rows) - space;
          var frames = {};
          for (var row = 0; row < rows; row += 1) {
              for (var col = 0; col < cols; col += 1) {
                  var frameName = "" + row + col;
                  var x = col * (w + space);
                  var y = row * (h + space);
                  frames[frameName] = {
                      frame: { x: x, y: y, w: w, h: h },
                      space: space
                  };
              }
          }
          var atlas = new AtlasManager_1({ image: canvas, frames: frames, meta: { size: { w: width, h: height } } }, true);
          if (onDraw) {
              for (var row = 0; row < rows; row += 1) {
                  for (var col = 0; col < cols; col += 1) {
                      var frameName = "" + row + col;
                      var _a = atlas.getFrame(frameName), x = _a.x, y = _a.y, w_1 = _a.w, h_1 = _a.h;
                      onDraw(atlas, context, { x: x, y: y, w: w_1, h: h_1, row: row, col: col }, frameName);
                  }
              }
          }
          return atlas;
      };
      /**
       * 根据纹理和配置，来通过纹理创建一个不可修改的图集。通常用于精灵动画。
       * 这个图集将被行列分成若干个格子帧，每一帧的名字为`0`、`1`、`2`......
       */
      AtlasManager.CREATE_FROM_TEXTURE = function (texture, options) {
          var w = options.cellWidth;
          var h = options.cellHeight;
          var width = texture.origWidth, height = texture.origHeight;
          var spacing = options.spacing || 0;
          var framesPerLine = options.framesPerLine;
          var frameStart = options.frameStart, frameCount = options.frameCount;
          if (frameStart === undefined) {
              frameStart = 0;
          }
          if (frameCount === undefined) {
              frameCount = Infinity;
          }
          var frames = {};
          var i = frameStart;
          while (true) {
              var row = framesPerLine === 1 ? i : ~~(i / framesPerLine);
              var col = framesPerLine === 1 ? 0 : i % framesPerLine;
              var x = col * (w + spacing);
              var y = row * (h + spacing);
              if (i >= frameCount || (y + h + spacing >= height)) {
                  break;
              }
              frames[i] = {
                  frame: { x: x, y: y, w: w, h: h }
              };
              i += 1;
          }
          return new AtlasManager_1({ texture: texture, frames: frames, meta: { size: { w: width, h: height } } }, false);
      };
      Object.defineProperty(AtlasManager.prototype, "image", {
          /**
           * 获取整体图片数据。
           */
          get: function () {
              return this._image;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AtlasManager.prototype, "meta", {
          /**
           * 获取元信息。
           */
          get: function () {
              return this._meta;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AtlasManager.prototype, "frames", {
          /**
           * 获取帧集合。
           */
          get: function () {
              return this._frames;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AtlasManager.prototype, "texture", {
          /**
           * 获取整体的纹理，也可以使用`getWholeTexture`。
           */
          get: function () {
              return this.getWholeTexture();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AtlasManager.prototype, "usage", {
          /**
           * 获取当前图集的使用率，仅在**动态图集**的状况下有效。
           */
          get: function () {
              var _a = this._meta.size, w = _a.w, h = _a.h;
              return this._area / (w * h);
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 获取某一帧的数据。
       */
      AtlasManager.prototype.getFrame = function (frameName) {
          return this._frames[frameName].frame;
      };
      /**
       * @deprecated
       *
       * 请用`getUVMatrix`
       * 获取某一帧的uv。
       */
      AtlasManager.prototype.getUV = function (frameName) {
          throw new Error('`getUV` is deprecated, please use `getUVMatrix`!');
      };
      /**
       * 获取某一帧的uv变换矩阵。
       */
      AtlasManager.prototype.getUVMatrix = function (frameName) {
          var f = this._frames[frameName];
          if (!f) {
              throw new Error("Frame " + frameName + " is not existed!");
          }
          var uvMatrix = f.uvMatrix, frame = f.frame;
          if (!uvMatrix) {
              f.uvMatrix = this.buildUVMatrix(frame);
          }
          return f.uvMatrix;
      };
      AtlasManager.prototype.buildUVMatrix = function (frame) {
          var _a = this._meta.size, w = _a.w, h = _a.h;
          var matrix = new Matrix3();
          // flipY
          matrix.set(frame.w / w, 0, 0, 0, -frame.h / h, 0, frame.x / w, (frame.y + frame.h) / h, 1);
          return matrix;
      };
      /**
       * 获取某一帧的图片数据，**会创建独立的canvas，慎重使用！**。建议使用`getTexture`。
       */
      AtlasManager.prototype.getFrameImage = function (frameName) {
          if (!this._canvases[frameName]) {
              var canvas = document.createElement('canvas');
              var context = canvas.getContext('2d');
              var _a = this._frames[frameName].frame, x = _a.x, y = _a.y, w = _a.w, h = _a.h;
              canvas.width = w;
              canvas.height = h;
              context.drawImage(this._image, x, y, w, h);
              this._canvases[frameName] = canvas;
          }
          return this._canvases[frameName];
      };
      /**
       * 获取某一帧的纹理数据，**会创建独立的canvas，慎重使用！**。建议使用`getWholeTexture`。
       */
      AtlasManager.prototype.getTexture = function (frameName, options) {
          var image = this.getFrameImage(frameName);
          if (options) {
              return new Texture(__assign({ image: image }, options));
          }
          if (!this._textures[frameName]) {
              this._textures[frameName] = new Texture({ image: image });
          }
          return this._textures[frameName];
      };
      /**
       * 获取整体纹理数据，建议配合`getFrame`或`getUVMatrix`在shader中使用。
       */
      AtlasManager.prototype.getWholeTexture = function (options) {
          if (options) {
              if (this._texture) {
                  this._texture.destroy();
              }
              return this._texture = new Texture(__assign({ image: this._image }, options));
          }
          if (!this._texture) {
              this._texture = new Texture({ image: this._image });
          }
          return this._texture;
      };
      /**
       * 更新某一frame，通过`onDraw`方法参数中的`context`和`region`来更新`canvas`画布上此帧所占据区域内的图像，并同步到GPU。
       */
      AtlasManager.prototype.updateFrame = function (frameName, onDraw) {
          if (!this._updatable) {
              throw new Error("Atlas " + this.name + " is not updatable !");
          }
          if (this._canvases[frameName]) {
              delete this._canvases[frameName];
          }
          if (this._textures[frameName]) {
              delete this._textures[frameName];
          }
          var _a = this.getFrame(frameName), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
          onDraw(this._ctx, { x: x, y: y, w: w, h: h }, frameName);
          this.updateGlSubBuffer(x, y, w, h);
      };
      /**
       * 申请分配指定的`region`大小的一帧，其中`frameName`是你想要赋予的名字，若不传会自动生成。
       * 如果分配成功，则会通过`onDraw`的参数返回`context`、实际区域`region`和被分配的帧名`frameName`，你可以在这个方法中绘制。
       *
       * @returns [string] 若成功，将返回分配的`frame`的名字，否则返回`null`。
       */
      AtlasManager.prototype.allocateFrame = function (region, onDraw) {
          if (!this._updatable) {
              throw new Error("Atlas " + this.name + " is not updatable !");
          }
          var frameName = region.frameName;
          if (frameName && this._frames[frameName]) {
              throw new Error("Frame named " + frameName + " is not already existed !");
          }
          if (this._needReBuild) {
              this.rebuildFrames();
          }
          frameName = this.generateFrame(this._root, region);
          if (!frameName) {
              return null;
          }
          this._area += region.w * region.h;
          if (onDraw) {
              var _a = this.getFrame(frameName), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
              onDraw(this._ctx, { x: x, y: y, w: w, h: h }, frameName);
              this.updateGlSubBuffer(x, y, w, h);
          }
          return frameName;
      };
      AtlasManager.prototype.generateFrame = function (rootFrame, region, bottom) {
          var w = region.w, h = region.h, _a = region.space, space = _a === void 0 ? 0 : _a, frameName = region.frameName;
          var size = this._meta.size;
          if (bottom === undefined) {
              bottom = this._meta.size.h;
          }
          if (!this._root) {
              return this._root = this.addFrame(0, 0, w, h, frameName);
          }
          var root = this._frames[rootFrame];
          var right = root.right, down = root.down, frame = root.frame;
          var x = frame.x + frame.w + space;
          var y = frame.y + frame.h + space;
          var aW = size.w - x;
          var aH = bottom - y;
          if (!right && !down && w <= aW && h <= frame.h) {
              return root.right = this.addFrame(x, frame.y, w, h, frameName, space);
          }
          if (!right && w <= aW && h <= frame.h) {
              return root.right = this.addFrame(x, frame.y, w, h, frameName, space);
          }
          if (!down && w <= (size.w - frame.x) && h <= aH) {
              return root.down = this.addFrame(frame.x, y, w, h, frameName, space);
          }
          if (right && (frameName = this.generateFrame(right, region, y))) {
              return frameName;
          }
          if (down && (frameName = this.generateFrame(down, region, bottom))) {
              return frameName;
          }
          return null;
      };
      AtlasManager.prototype.rebuildFrames = function () {
          var _this = this;
          var size = this._meta.size;
          if (!this._tmpCanvas) {
              var tmp = this._tmpCanvas = document.createElement('canvas');
              tmp.width = size.w;
              tmp.height = size.h;
          }
          var tmpCtx = this._tmpCanvas.getContext('2d');
          tmpCtx.drawImage(this._image, 0, 0);
          this._ctx.clearRect(0, 0, size.w, size.h);
          this._ctx.fillStyle = 'rgba(255, 255, 255, 0)';
          this._ctx.fillRect(0, 0, size.w, size.h);
          var frames = Object.assign({}, this._frames);
          this._frames = {};
          this._root = null;
          var keys = Object.keys(frames).sort(function (a, b) {
              return frames[b].frame.h - frames[a].frame.h;
          });
          keys.forEach(function (frameName) {
              var frame = frames[frameName];
              var _a = frame.frame, w = _a.w, h = _a.h;
              _this.generateFrame(_this._root, { w: w, h: h, frameName: frameName, space: frame.space });
              var _b = _this._frames[frameName].frame, x = _b.x, y = _b.y;
              var orig = frames[frameName].frame;
              _this._ctx.drawImage(_this._tmpCanvas, orig.x, orig.y, w, h, x, y, w, h);
          });
          this.updateGlSubBuffer(0, 0, size.w, size.h);
          this._needReBuild = false;
      };
      AtlasManager.prototype.addFrame = function (x, y, w, h, frameName, space) {
          frameName = frameName || "AUTO-" + this._AUTO_ID++;
          this._frames[frameName] = { frame: { x: x, y: y, w: w, h: h }, space: space };
          return frameName;
      };
      /**
       * 释放一帧的空间，将其标记为可分配状态。
       */
      AtlasManager.prototype.releaseFrame = function (frameName) {
          if (!this._updatable) {
              throw new Error("Atlas " + this.name + " is not updatable !");
          }
          var frame = this._frames[frameName];
          if (frame) {
              if (this._texture[frameName]) {
                  this._texture.destroy();
              }
              if (this._canvases[frameName]) {
                  delete this._canvases[frameName];
              }
              delete this._frames[frameName];
              this._area -= frame.frame.h * frame.frame.w;
              this._needReBuild = true;
          }
      };
      AtlasManager.prototype.updateGlSubBuffer = function (x, y, w, h) {
          if (!this._texture) {
              return;
          }
          this._texture.updateSubTexture(x, this._texture.flipY ? this._meta.size.h - y - h : y, this._ctx.getImageData(x, y, w, h));
      };
      /**
       * 完全销毁释放图集。
       */
      AtlasManager.prototype.destroy = function () {
          for (var key in this._textures) {
              this._textures[key].destroy();
          }
          if (this._texture) {
              this._texture.destroy();
          }
      };
      var AtlasManager_1;
      AtlasManager = AtlasManager_1 = __decorate([
          SClass({ className: 'AtlasManager' })
      ], AtlasManager);
      return AtlasManager;
  }(SObject));

  /**
   * 判断一个实例是否为`AtlasLoader`。
   */
  function isAtlasLoader(value) {
      return value.isAtlasLoader;
  }
  /**
   * @hidden
   */
  function isBase64(url) {
      return /^data:(.+?);base64,/.test(url);
  }
  /**
   * @hidden
   */
  function isAbsolute(url) {
      return url[0] === '/' || /^(http|https):\/\//.test(url);
  }
  /**
   * 图集加载器。
   *
   * @noInheritDoc
   */
  var AtlasLoader = /** @class */ (function (_super) {
      __extends(AtlasLoader, _super);
      function AtlasLoader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isAtlasLoader = true;
          return _this;
      }
      AtlasLoader.prototype.load = function (entity, callbacks) {
          return __awaiter(this, void 0, void 0, function () {
              var meta_1, url, fileName, image_1, error_1;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [4 /*yield*/, HTTP.get(entity.url)];
                      case 1:
                          meta_1 = (_a.sent()).data;
                          if (!meta_1) {
                              throw new Error("Load resource error: " + entity.name);
                          }
                          callbacks.onLoading(entity, .1);
                          url = meta_1.meta.image;
                          if (!isAbsolute(url) && !isBase64(url)) {
                              fileName = entity.url.split('/').pop();
                              url = "" + entity.url.replace(fileName, '') + meta_1.meta.image;
                          }
                          image_1 = document.createElement('img');
                          image_1.onload = function () {
                              image_1.onerror = null;
                              image_1.onabort = null;
                              image_1.onload = null;
                              if (entity.canceled) {
                                  return;
                              }
                              entity.result = new AtlasManager({
                                  image: image_1,
                                  frames: meta_1.frames,
                                  meta: meta_1.meta
                              }, entity.updatable || false);
                              callbacks.onLoaded(entity);
                          };
                          image_1.onerror = function () {
                              callbacks.onError(entity, new Error("Error when loading " + entity.name));
                          };
                          image_1.crossOrigin = (entity.crossOrigin || false) ? 'Anonymous' : '';
                          image_1.src = url;
                          return [3 /*break*/, 3];
                      case 2:
                          error_1 = _a.sent();
                          callbacks.onError(entity, error_1);
                          return [3 /*break*/, 3];
                      case 3: return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * **尚未实现**。
       */
      AtlasLoader.prototype.instantiate = function (entity, options) {
          throw new Error('Not implemented !');
      };
      /**
       * 释放资源时将会调用，用于自定义释放逻辑。
       */
      AtlasLoader.prototype.release = function (entity) {
          entity.result.destroy();
      };
      AtlasLoader.EXTENSIONS = ['.atlas'];
      AtlasLoader = __decorate([
          SClass({ className: 'AtlasLoader' })
      ], AtlasLoader);
      return AtlasLoader;
  }(ResourceLoader));

  /**
   * 判断一个实例是否为`EventTrigger`。
   */
  function isEventTrigger(value) {
      return value.isEventTrigger;
  }
  /**
   * 事件触发器类。触发器用于在事件管理器[EventManager](../eventmanager)注册事件时，添加特殊的自动分发功能。
   * 你可以继承此基类来派生自己的触发器，之后触发器便会自动得完成一些特殊事件的分发工作，比如HID（用户输入）。
   * 详细例子请看[CustomTrigger](../../example/event/custom-trigger)。
   *
   * @template TEvent 此触发器对应的事件参数类型。
   * @noInheritDoc
   */
  var EventTrigger = /** @class */ (function (_super) {
      __extends(EventTrigger, _super);
      /**
       * 一般不需要自己调用。
       */
      function EventTrigger(type, eventManager, objHasGame) {
          if (objHasGame === void 0) { objHasGame = null; }
          var _this = _super.call(this) || this;
          _this.isEventTrigger = true;
          /**
           * 此触发器是否要在每一次事件触发时立即分发，如果不，怎会先缓存之后在每一帧更新之前统一分发。
           */
          _this.autoFlush = true;
          _this._type = null;
          _this._eventManager = null;
          _this._paused = true;
          _this._objHasGame = null;
          /**
           * **不要自己调用！！**
           *
           * @hidden
           */
          _this.trigger = function (event) {
              try {
                  _this.onTrigger(event);
              }
              catch (error) {
                  throwException(error, _this);
              }
              return _this;
          };
          _this._type = new SName(type);
          _this._eventManager = eventManager;
          _this._objHasGame = objHasGame;
          return _this;
      }
      Object.defineProperty(EventTrigger.prototype, "paused", {
          /**
           * 该触发器是否已暂停触发。
           */
          get: function () {
              return this._paused;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(EventTrigger.prototype, "parent", {
          /**
           * 获取自身的父级实例引用，一般不需要自己使用。
           */
          get: function () {
              return this._eventManager;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 获取游戏实例引用。
       */
      EventTrigger.prototype.getGame = function () {
          return this._objHasGame.getGame();
      };
      /**
       * 生命周期，触发器开始运作时调用，你可以在这里初始化你的触发器。
       * 比如`window.addEventListener(eventName, this.trigger);`。
       */
      EventTrigger.prototype.onBegin = function () {
      };
      /**
       * 生命周期，触发器停止运作时调用，你可以在这里释放你的触发器。
       */
      EventTrigger.prototype.onPause = function () {
      };
      /**
       * 生命周期，触发器被触发前调用，你可以在这里。
       * 注意别忘了调用`super.onTrigger`来保证默认行为。
       */
      EventTrigger.prototype.onTrigger = function (event) {
          this._eventManager.trigger(this._type.value, event, this.autoFlush);
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      EventTrigger.prototype.begin = function () {
          this._paused = false;
          try {
              this.onBegin();
          }
          catch (error) {
              throwException(error, this);
          }
          return this;
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      EventTrigger.prototype.pause = function () {
          this._paused = true;
          try {
              this.onPause();
          }
          catch (error) {
              throwException(error, this);
          }
          return this;
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      EventTrigger.prototype.destroy = function () {
          this.pause();
      };
      EventTrigger = __decorate([
          SClass({ className: 'EventTrigger', classType: 'EventTrigger' })
      ], EventTrigger);
      return EventTrigger;
  }(SObject));

  /**
   * @hidden
   */
  function createKeyboardTrigger(className, eventName) {
      var KeyBoardEventTrigger = /** @class */ (function (_super) {
          __extends(KeyBoardEventTrigger, _super);
          function KeyBoardEventTrigger() {
              var _this = _super !== null && _super.apply(this, arguments) || this;
              _this.isKeyBoardEventTrigger = true;
              _this.autoFlush = false;
              return _this;
          }
          KeyBoardEventTrigger.prototype.onBegin = function () {
              window.addEventListener(eventName, this.trigger);
          };
          KeyBoardEventTrigger.prototype.onTrigger = function (event) {
              if (className !== 'KeyDownTrigger') {
                  event.preventDefault();
              }
              event.stopPropagation();
              _super.prototype.onTrigger.call(this, event);
          };
          KeyBoardEventTrigger.prototype.onPause = function () {
              window.removeEventListener(eventName, this.trigger);
          };
          KeyBoardEventTrigger = __decorate([
              SClass({ className: className })
          ], KeyBoardEventTrigger);
          return KeyBoardEventTrigger;
      }(EventTrigger));
      return KeyBoardEventTrigger;
  }
  var KeyDownTrigger = createKeyboardTrigger('KeyDownTrigger', 'keydown');
  var KeyPressTrigger = createKeyboardTrigger('KeyPressTrigger', 'keypress');
  var KeyUpTrigger = createKeyboardTrigger('KeyUpTrigger', 'keyup');

  /**
   * @hidden
   */
  function createTouchTrigger(className, eventName) {
      var TouchEventTrigger = /** @class */ (function (_super) {
          __extends(TouchEventTrigger, _super);
          function TouchEventTrigger() {
              var _this = _super !== null && _super.apply(this, arguments) || this;
              _this.isTouchEventTrigger = true;
              _this.autoFlush = false;
              return _this;
          }
          TouchEventTrigger.prototype.onBegin = function () {
              this.getGame().canvas.addEventListener(eventName, this.trigger);
          };
          TouchEventTrigger.prototype.onTrigger = function (event) {
              event.preventDefault();
              event.stopPropagation();
              _super.prototype.onTrigger.call(this, event);
          };
          TouchEventTrigger.prototype.onPause = function () {
              this.getGame().canvas.removeEventListener(eventName, this.trigger);
          };
          TouchEventTrigger = __decorate([
              SClass({ className: className })
          ], TouchEventTrigger);
          return TouchEventTrigger;
      }(EventTrigger));
      return TouchEventTrigger;
  }
  var TouchStartTrigger = createTouchTrigger('TouchStartTrigger', 'touchstart');
  var TouchEndTrigger = createTouchTrigger('TouchEndTrigger', 'touchend');
  var TouchMoveTrigger = createTouchTrigger('TouchMoveTrigger', 'touchmove');
  var TouchCancelTrigger = createTouchTrigger('TouchCancelTrigger', 'touchcancel');

  /**
   * @hidden
   */
  function createMouseTrigger(className, eventName) {
      var MouseEventTrigger = /** @class */ (function (_super) {
          __extends(MouseEventTrigger, _super);
          function MouseEventTrigger() {
              var _this = _super !== null && _super.apply(this, arguments) || this;
              _this.isMouseEventTrigger = true;
              _this.autoFlush = false;
              return _this;
          }
          MouseEventTrigger.prototype.onBegin = function () {
              this.getGame().canvas.addEventListener(eventName, this.trigger);
          };
          MouseEventTrigger.prototype.onTrigger = function (event) {
              event.preventDefault();
              event.stopPropagation();
              _super.prototype.onTrigger.call(this, event);
          };
          MouseEventTrigger.prototype.onPause = function () {
              this.getGame().canvas.removeEventListener(eventName, this.trigger);
          };
          MouseEventTrigger = __decorate([
              SClass({ className: className })
          ], MouseEventTrigger);
          return MouseEventTrigger;
      }(EventTrigger));
      return MouseEventTrigger;
  }
  var MouseClickTrigger = createMouseTrigger('MouseClickTrigger', 'click');
  var MouseDownTrigger = createMouseTrigger('MouseDownTrigger', 'mousedown');
  var MouseUpTrigger = createMouseTrigger('MouseUpTrigger', 'mouseup');
  var MouseEnterTrigger = createMouseTrigger('MouseEnterTrigger', 'mouseenter');
  var MouseLeaveTrigger = createMouseTrigger('MouseLeaveTrigger', 'mouseleave');
  var MouseMoveTrigger = createMouseTrigger('MouseMoveTrigger', 'mousemove');
  var MouseOutTrigger = createMouseTrigger('MouseOutTrigger', 'mouseout');
  var MouseOverTrigger = createMouseTrigger('MouseOverTrigger', 'mouseover');
  var MouseWheelTrigger = createMouseTrigger('MouseWheelTrigger', 'mousewheel');
  var WheelTrigger = createMouseTrigger('WheelTrigger', 'wheel');
  var ContextMenuTrigger = createMouseTrigger('ContextMenuTrigger', 'contextmenu');

  /**
   * 窗口大小改变时的触发器。
   *
   * @noInheritDoc
   */
  var WindowResizeTrigger = /** @class */ (function (_super) {
      __extends(WindowResizeTrigger, _super);
      function WindowResizeTrigger() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isMouseEventTrigger = true;
          _this.autoFlush = false;
          return _this;
      }
      WindowResizeTrigger.prototype.onBegin = function () {
          window.addEventListener('resize', this.trigger);
      };
      WindowResizeTrigger.prototype.onPause = function () {
          window.removeEventListener('resize', this.trigger);
      };
      WindowResizeTrigger = __decorate([
          SClass({ className: 'WindowResizeTrigger' })
      ], WindowResizeTrigger);
      return WindowResizeTrigger;
  }(EventTrigger));

  /**
   * 判断一个实例是否为`Player`。
   */
  function isPlayer(value) {
      return value.isPlayer;
  }
  /**
   * 玩家类，用于管理玩家的逻辑。
   * 一般不直接用于控制实例，而是使用其在`World`中的代理`PlayerControllerActor`。
   * 可以对齐进行继承扩展，来达到一种自顶向下的设计理念，详见[Player](../../guide/player)。
   *
   * @noInheritDoc
   */
  var Player = /** @class */ (function (_super) {
      __extends(Player, _super);
      function Player(name, game) {
          var _this = _super.call(this, name) || this;
          _this.isPlayer = true;
          _this._game = game;
          return _this;
      }
      Object.defineProperty(Player.prototype, "parent", {
          /**
           * 父级为Game。
           */
          get: function () {
              return this._game;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Player.prototype, "controller", {
          /**
           * 直接获取无类型的控制器实例引用，建议使用`getController`替代。
           */
          get: function () {
              return this._controller;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Player.prototype, "state", {
          /**
           * 直接获取无类型的状态实例引用，建议使用`getState`替代。
           */
          get: function () {
              return this._controller.state;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 生命周期，在实例创建后触发。
       */
      Player.prototype.onInit = function () {
      };
      /**
       * 生命周期，在实例获取到控制器的所有权时触发。
       */
      Player.prototype.onSwitchController = function (controller) {
      };
      /**
       * 生命周期，在实例释放控制器的所有权时触发。
       */
      Player.prototype.onReleaseController = function (controller) {
      };
      /**
       * 生命周期，在每一帧更新时触发。
       */
      Player.prototype.onUpdate = function (delta) {
      };
      /**
       * 生命周期，用于错误边界处理。将在Game中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
       * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
       * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
       */
      Player.prototype.onError = function (error, details) {
      };
      /**
       * 切换自身在World中代理的Controller。
       */
      Player.prototype.switchController = function (controller) {
          if (controller.player) {
              throw new BreakGuardException(this, "Controller " + controller.name + " already owned by player " + controller.parent.name + " !");
          }
          this._controller = controller;
          controller._player = this;
          try {
              this.onSwitchController(controller);
          }
          catch (error) {
              throwException(error, this);
          }
          return this;
      };
      /**
       * 释放当前自身在World中代理的Controller。
       */
      Player.prototype.releaseController = function () {
          try {
              this.onReleaseController(this._controller);
          }
          catch (error) {
              throwException(error, this);
          }
          if (this._controller) {
              this._controller._player = null;
          }
          this._controller = null;
          return this;
      };
      /**
       * 获取当前自身在World中代理的Controller。
       */
      Player.prototype.getController = function () {
          return this._controller;
      };
      /**
       * 获取当前自身在World中代理的Controller的状态。
       */
      Player.prototype.getState = function () {
          return this._controller.getState();
      };
      /**
       * 获取当前`Game`实例。
       *
       * @template IGameState 当前游戏状态管理器的类型。
       */
      Player.prototype.getGame = function () {
          return this._game;
      };
      /**
       * 获取当前`World`实例。
       *
       * @template IWorldState 当前世界状态管理器的类型。
       */
      Player.prototype.getWorld = function () {
          return this._game.world;
      };
      /**
       * 获取当前`Level`实例。
       *
       * @template ILevelState 当前关卡状态管理器的类型。
       */
      Player.prototype.getLevel = function () {
          return this._game.level;
      };
      /**
       * 仅在初始化了物理引擎之后，用于获取当前物理世界`PhysicWorld`实例。
       * 如何使用物理引擎请见**Guide**和**Demo**。
       */
      Player.prototype.getPhysicWorld = function () {
          return this._game.world.physicWorld;
      };
      /**
       * **不要自行调用！**
       *
       * @hidden
       */
      Player.prototype.update = function (delta) {
          try {
              this.onUpdate(delta);
          }
          catch (error) {
              throwException(error, this);
          }
      };
      /**
       * **不要自行调用！**
       *
       * @hidden
       */
      Player.prototype.destroy = function () {
          if (this._controller) {
              this._controller._player = null;
          }
          this._controller = null;
          this._game = null;
          _super.prototype.destroy.call(this);
      };
      Player = __decorate([
          SClass({ className: 'Player' })
      ], Player);
      return Player;
  }(SObject));

  /**
   * 判断一个实例是否为`InfoActor`。
   */
  function isInfoActor(value) {
      return value.isInfoActor;
  }
  /**
   * 信息管理Actor基类。单纯的书记官，不放入场景内，仅仅作为信息的记录者。
   * 一般不直接使用，而是使用其派生类。
   *
   * @template IOptionTypes 初始化参数类型，一般交由由继承的类定义实现多态。
   * @template TRootComponent 根组件类型。
   *
   * @noInheritDoc
   */
  var InfoActor = /** @class */ (function (_super) {
      __extends(InfoActor, _super);
      function InfoActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isInfoActor = true;
          /**
           * 更新优先级，只可在派生时指定，不可在初始化后的运行时修改！
           */
          _this.updatePriority = InfoActor_1.UPDATE_PRIORITY.Others;
          return _this;
      }
      InfoActor_1 = InfoActor;
      var InfoActor_1;
      /**
       * 默认的更新优先级。
       *
       * @member System 约定占用1000 ~ 2000
       * @member GameMode 约定占用2000 ~ 3000
       * @member LevelScript 约定占用3000 ~ 4000
       * @member State 约定占用4000 ~ 5000
       * @member Others 其他，默认直接追加到最后
       */
      InfoActor.UPDATE_PRIORITY = {
          System: 1000,
          GameMode: 2000,
          LevelScript: 3000,
          State: 4000,
          Others: -1
      };
      InfoActor = InfoActor_1 = __decorate([
          SClass({ className: 'InfoActor' })
      ], InfoActor);
      return InfoActor;
  }(Actor));

  /**
   * 判断一个实例是否为`StateActor`。
   */
  function isStateActor(value) {
      return value.isStateActor;
  }
  /**
   * 状态管理Actor类。记录一些状态，比如`Game`所用的`GameState`、`World`所用的`WorldState`。
   *
   * @template IOptionTypes 初始化参数类型，一般交由由继承的类定义实现多态。
   *
   * @noInheritDoc
   */
  var StateActor = /** @class */ (function (_super) {
      __extends(StateActor, _super);
      function StateActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isStateActor = true;
          _this.updatePriority = InfoActor.UPDATE_PRIORITY.State;
          return _this;
      }
      StateActor.prototype.copy = function (state) {
          if (!state) {
              return;
          }
          return this;
      };
      StateActor = __decorate([
          SClass({ className: 'StateActor' })
      ], StateActor);
      return StateActor;
  }(InfoActor));

  /**
   * 判断一个实例是否为`SystemActor`。
   */
  function isSystemActor(value) {
      return value.isSystemActor;
  }
  /**
   * 系统Actor基类，派生一些系统类，比如物理引擎管理、声音系统等全局规则型Actor，它们在更新队列的最先端。
   *
   * @template IOptionTypes 初始化参数类型，一般交由由继承的类定义实现多态。
   *
   * @noInheritDoc
   */
  var SystemActor = /** @class */ (function (_super) {
      __extends(SystemActor, _super);
      function SystemActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isSystemActor = true;
          _this.updatePriority = InfoActor.UPDATE_PRIORITY.System;
          return _this;
      }
      SystemActor = __decorate([
          SClass({ className: 'SystemActor' })
      ], SystemActor);
      return SystemActor;
  }(InfoActor));

  /**
   * 物理系统Actor，负责更新物理世界。
   *
   * @hidden
   * @noInheritDoc
   */
  var PhysicSystemActor = /** @class */ (function (_super) {
      __extends(PhysicSystemActor, _super);
      function PhysicSystemActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isPhysicSystemActor = true;
          return _this;
      }
      PhysicSystemActor.prototype.onUpdate = function (delta) {
          var world = this.getWorld();
          if (world && world.physicWorld) {
              world.physicWorld.update(delta);
          }
      };
      PhysicSystemActor = __decorate([
          SClass({ className: 'PhysicSystemActor' })
      ], PhysicSystemActor);
      return PhysicSystemActor;
  }(SystemActor));

  /**
   * 判断一个实例是否为`CubeTextureLoader`。
   */
  function isCubeTextureLoader(value) {
      return value.isCubeTextureLoader;
  }
  /**
   * @hidden
   */
  var loader$1 = new Hilo3d$2.CubeTextureLoader();
  /**
   * 纹理加载器。
   *
   * @noInheritDoc
   */
  var CubeTextureLoader = /** @class */ (function (_super) {
      __extends(CubeTextureLoader, _super);
      function CubeTextureLoader() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isCubeTextureLoader = true;
          return _this;
      }
      CubeTextureLoader.prototype.load = function (entity, callbacks) {
          var url = entity.url, images = entity.images;
          var baseUrl = (!url || url[url.length - 1] === '/') ? entity.url : entity.url + '/';
          loader$1.load({
              left: baseUrl + images.left,
              right: baseUrl + images.right,
              front: baseUrl + images.front,
              back: baseUrl + images.back,
              top: baseUrl + images.top,
              bottom: baseUrl + images.bottom,
              crossOrigin: entity.crossOrigin || false,
              uv: entity.uv || 0,
              flipY: entity.flipY
          })
              .then(function (result) {
              entity.result = result;
              callbacks.onLoaded(entity);
          })
              .catch(function (error) { return callbacks.onError(entity, error); });
      };
      /**
       * 释放资源时将会调用，用于自定义释放逻辑。
       */
      CubeTextureLoader.prototype.release = function (entity) {
          entity.result.destroy();
      };
      CubeTextureLoader = __decorate([
          SClass({ className: 'TextureLoader' })
      ], CubeTextureLoader);
      return CubeTextureLoader;
  }(ResourceLoader));

  /**
   * 判断一个实例是否为`Game`。
   */
  function isGame(value) {
      return value.isGame;
  }
  /**
   * 游戏类，整个Game逻辑中实际的顶层类，将作为一个单例存在于整个Game中，通常使用`getGame`获取。
   *
   * @template IState Game的状态Actor类型，用于存储整个Game的全局状态。
   * @noInheritDoc
   */
  var Game = /** @class */ (function (_super) {
      __extends(Game, _super);
      /**
       * @param StateClass 游戏全局状态实例的类
       * @param initState 游戏全局状态实例的初始值，若存在，将在初始化时从它clone
       */
      function Game(name, options, StateClass, initState) {
          if (StateClass === void 0) { StateClass = StateActor; }
          if (initState === void 0) { initState = null; }
          var _this = _super.call(this, name) || this;
          _this.isGame = true;
          /**
           * 当前的一些设备信息。
           */
          _this.deviceInfo = {
              touchable: !!(window && ('ontouchstart' in window))
          };
          _this._engine = null;
          _this._resource = null;
          _this._event = null;
          _this._hid = null;
          _this._worldsMeta = {};
          _this._defaultWorldName = null;
          _this._world = null;
          _this._actors = new SArray();
          _this._actorsForUpdate = new SArray();
          _this._actorsNeedUpdate = false;
          _this._actorsPriorities = [];
          _this._actorsPriorityCount = {};
          _this._players = new SMap();
          _this._defaultPlayer = null;
          _this._paused = true;
          _this._hiloStage = null;
          _this._initState = initState;
          _this._hiloStage = new Hilo3d$2.Stage(options);
          _this._hiloStage.needCallChildUpdate = false;
          _this._resource = new ResourceManager(_this);
          _this._event = new EventManager(_this);
          _this._hid = new EventManager(_this);
          _this._state = _this.addActor('game-state', StateClass);
          _this._state.copy(_this._initState);
          _this.canvas.style.width = '';
          _this.canvas.style.height = '';
          _this.initEvents();
          _this.initLoaders(options);
          _this.initSystems();
          try {
              _this.onInit();
          }
          catch (error) {
              throwException(error, _this);
          }
          _this._event.trigger('GameDidInit', { game: _this });
          return _this;
      }
      Object.defineProperty(Game.prototype, "state", {
          /**
           * Game状态Actor实例引用。
           */
          get: function () {
              return this._state;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "event", {
          /**
           * Game全局事件管理器实例引用。
           * 默认事件列表见[IGlobalDefaultEvents](../interfaces/iglobaldefaultevents`)。
           */
          get: function () {
              return this._event;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "hid", {
          /**
           * Game全局HID管理器全局实例引用。
           * 这实际上是一个特化过的事件管理器，默认事件列表见[IGlobalHIDDefaultEvents](../interfaces/iglobalhiddefaultevents`)。
           */
          get: function () {
              return this._hid;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "fps", {
          /**
           * 当前Game锁帧帧率。
           */
          get: function () {
              return this._engine.options.fps;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "paused", {
          /**
           * 当前游戏是否处于暂停状态。
           */
          get: function () {
              return this._paused;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "parent", {
          /**
           * Game的父级引擎实例引用。
           */
          get: function () {
              return this._engine;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "game", {
          /**
           * @hidden
           */
          get: function () {
              return this;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "world", {
          /**
           * 当前`World`实例引用。一般不直接使用，而是用`actor.getWorld()`或`component.getWorld`，提供更好的泛型类型推断。
           */
          get: function () {
              return this._world;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "level", {
          /**
           * 当前`Level`实例引用。一般不直接使用，而是用`actor.getLevel()`或`component.getLevel`，提供更好的泛型类型推断。
           */
          get: function () {
              return this._world.level;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "players", {
          /**
           * 当前的玩家列表，要结合玩家系统，详见[Player](./player)。
           */
          get: function () {
              return this._players;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "actors", {
          /**
           * 当前`Game`实例下的所有Actor列表，注意列表中的`Actor`必须为`InfoActor`，单纯负责逻辑而没有`transform`。
           * 如果你需要实际上可视的Actor的列表，请参考`world.actors`。
           */
          get: function () {
              return this._actors;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "resource", {
          /**
           * Game的全局资源管理器实例引用，用于加载和管理所有的Game资源。
           */
          get: function () {
              return this._resource;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "ticker", {
          /**
           * Game的全局Ticker，来自`Engine`类，所有Game共用。
           */
          get: function () {
              return this._engine.ticker;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "canvas", {
          /**
           * 当前的`canvas`实例引用。
           */
          get: function () {
              return this._hiloStage.canvas;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "screenWidth", {
          /**
           * 当前视口的实际像素宽度。
           */
          get: function () {
              return this.canvas.offsetWidth;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "screenHeight", {
          /**
           * 当前视口的实际像素高度。
           */
          get: function () {
              return this.canvas.offsetHeight;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "bound", {
          /**
           * 当前视口的实际边界属性。
           */
          get: function () {
              return this.canvas.getBoundingClientRect();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "screenAspect", {
          /**
           * 当前视口实际的纵横比。
           */
          get: function () {
              var _a = this.canvas, offsetWidth = _a.offsetWidth, offsetHeight = _a.offsetHeight;
              return offsetWidth / offsetHeight;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "env", {
          /**
           * 当前运行环境，一般为`development`或`production`。
           */
          get: function () {
              return Debug.env;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "devMode", {
          /**
           * `env`不为`production`时，判定为开发环境。
           */
          get: function () {
              return Debug.devMode;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "renderer", {
          /**
           * @hidden
           */
          get: function () {
              return this._hiloStage.renderer;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "hiloStage", {
          /**
           * @hidden
           */
          get: function () {
              return this._hiloStage;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @hidden
       */
      Game.prototype.getGame = function () {
          return this;
      };
      /**
       * 获取全局事件管理器引用。
       */
      Game.prototype.getEvent = function () {
          return this._event;
      };
      /**
       * 获取全局HID管理器引用。
       */
      Game.prototype.getHID = function () {
          return this._hid;
      };
      /**
       * 获取全局资源管理器引用。
       */
      Game.prototype.getResource = function () {
          return this._resource;
      };
      /**
       * 设定特定渲染配置。
       */
      Game.prototype.setOption = function (key, value) {
          this._hiloStage.renderer[key] = value;
          this._initState[key] = value;
      };
      /**
       * 获取特定渲染配置。
       */
      Game.prototype.getOption = function (key) {
          return this._initState[key];
      };
      /**
       * 生命周期，在Game初始化时被触发。
       * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
       */
      Game.prototype.onInit = function () {
      };
      /**
       * 生命周期，在Game被添加到引擎成功后被触发。
       * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
       */
      Game.prototype.onAdd = function () {
      };
      /**
       * 生命周期，在Game启动后被处罚。
       * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
       */
      Game.prototype.onStart = function () {
      };
      /**
       * 生命周期，在Game被暂停前触发。
       * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
       */
      Game.prototype.onPause = function () {
      };
      /**
       * 生命周期，在Game被唤醒后触发。
       * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
       */
      Game.prototype.onResume = function () {
      };
      /**
       * 生命周期，在Game被重启后触发。
       * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
       */
      Game.prototype.onRestart = function () {
      };
      /**
       * 生命周期，用于错误边界处理。将在Game中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
       * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
       * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
       */
      Game.prototype.onError = function (error, details) {
      };
      /**
       * 生命周期，在Game每一帧更新时被触发。
       * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
       */
      Game.prototype.onUpdate = function (delta) {
      };
      /**
       * 生命周期，在Game销毁时被触发。
       * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
       */
      Game.prototype.onDestroy = function () {
      };
      /**
       * 向Game类添加一个`World`。
       *
       * @param GameMode 承载World逻辑的Actor，需继承自`GameModeActor`，此World所有的Level都将共有这一个GameMode。
       * @param PersistentLevelScript World至少有一个默认的Level，在添加World时必须指定一个入口Level。
       * @param isDefault 此World是否是游戏默认的World，在游戏开始前至少有一个默认的World。
       */
      Game.prototype.addWorld = function (name, GameMode, PersistentLevelScript, isDefault) {
          if (isDefault === void 0) { isDefault = false; }
          this._worldsMeta[name] = {
              GameMode: GameMode,
              levels: {
                  persistent: {
                      Script: PersistentLevelScript
                  }
              }
          };
          if (isDefault || Object.keys(this._worldsMeta).length < 2) {
              this._defaultWorldName = name;
          }
          return this;
      };
      /**
       * 从Game类中移除一个`World`。
       *
       * 注意不能移除当前正在运作的World。
       */
      Game.prototype.removeWorld = function (name) {
          if (this._world.name.equalsTo(name)) {
              throw new BreakGuardException(this, "World " + name + " is running could not be removed !");
          }
          this._world.destroy();
          delete this._worldsMeta[name];
          return this;
      };
      /**
       * 切换当前正在运行的`World`。
       *
       * @param initState 如果需要，指定初始化状态，将会被clone，传`null`则没有效果。
       * @param needInheritActors 是否需要从上一个World继承Actors。
       */
      Game.prototype.switchWorld = function (name, initState, needInheritActors) {
          if (initState === void 0) { initState = null; }
          if (needInheritActors === void 0) { needInheritActors = false; }
          return __awaiter(this, void 0, void 0, function () {
              var inheritActors, oldWorld, _a, GameMode, levels;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          if (!this._worldsMeta[name]) {
                              throw new MissingMemberException(this, 'World', name, this);
                          }
                          oldWorld = this._world;
                          // todo: inherit actors from pre world
                          if (oldWorld) {
                              inheritActors = oldWorld.destroy(!needInheritActors);
                          }
                          _a = this._worldsMeta[name], GameMode = _a.GameMode, levels = _a.levels;
                          this._world = new World(name, GameMode, levels, this);
                          return [4 /*yield*/, this._world.init(initState)];
                      case 1:
                          _b.sent();
                          if (!(inheritActors && needInheritActors)) return [3 /*break*/, 3];
                          return [4 /*yield*/, this._world.switchLevel('persistent', null, inheritActors)];
                      case 2:
                          _b.sent();
                          return [3 /*break*/, 5];
                      case 3: return [4 /*yield*/, this.switchLevel('persistent')];
                      case 4:
                          _b.sent();
                          _b.label = 5;
                      case 5: return [2 /*return*/];
                  }
              });
          });
      };
      /**
       * 向指定World添加一个`Level`。
       *
       * @param Script 承载Level逻辑的Actor，需继承自`LevelScriptActor`。
       */
      Game.prototype.addLevel = function (worldName, levelName, Script) {
          if (!this._worldsMeta[worldName]) {
              throw new MissingMemberException(this, 'World', worldName, this);
          }
          if (this._worldsMeta[worldName].levels[levelName]) {
              throw new MemberConflictException(this, "Level of world " + worldName, levelName, this);
          }
          this._worldsMeta[worldName].levels[levelName] = { Script: Script };
          return this;
      };
      /**
       * 从指定World中移除一个`Level`。
       */
      Game.prototype.removeLevel = function (worldName, levelName) {
          if (!this._worldsMeta[worldName]) {
              return;
          }
          if (this._world.name.equalsTo(worldName) && this.level.name.equalsTo(levelName)) {
              throw new BreakGuardException(this, "Level " + worldName + " in world " + this._world.name + " is running could not be removed !");
          }
          delete this._worldsMeta[worldName].levels[levelName];
          return this;
      };
      /**
       * 切换当前World中运行的`Level`。
       * 注意Level之间的actors是会默认进入继承逻辑的。
       */
      Game.prototype.switchLevel = function (name, initState) {
          if (initState === void 0) { initState = null; }
          return this._world.switchLevel(name, initState);
      };
      /**
       * 通过指定的InfoActor类`ActorClass`和初始化参数`initOptions`，向Game中添加一个actor。
       * 注意继承自`SceneActor`或根组件为`SceneComponent`的Actor应当被添加到`World`中，而不是`Game`中。
       */
      Game.prototype.addActor = function (name, ActorClass, initOptions) {
          var actor = new ActorClass(name, this, initOptions);
          if (this.devMode) {
              try {
                  actor.verifyAdding(initOptions);
              }
              catch (error) {
                  throwException(error, actor);
                  return;
              }
          }
          actor.initialized();
          var updatePriority = actor.updatePriority;
          var priorities = this._actorsPriorities;
          var priorityCount = this._actorsPriorityCount;
          var count = priorityCount[updatePriority];
          if (updatePriority === InfoActor.UPDATE_PRIORITY.Others) {
              this._actors.add(actor);
          }
          else {
              var length_1 = priorities.length;
              var index = 0;
              for (var i = 0; i < length_1; i += 1) {
                  var p = priorities[i];
                  if (updatePriority < p) {
                      break;
                  }
                  index += priorityCount[p];
              }
              if (count === undefined) {
                  count = 0;
                  priorities.push(updatePriority);
                  /**
                   * @todo: change to insert sorting?
                   */
                  priorities.sort();
              }
              priorityCount[updatePriority] = count + 1;
              this._actors.insert(index, actor);
          }
          actor._parent = this;
          actor.added();
          this._actorsNeedUpdate = true;
          return actor;
      };
      /**
       * 从Game中移除一个actor。
       */
      Game.prototype.removeActor = function (actor) {
          actor.destroy();
          actor._parent = null;
          var updatePriority = actor.updatePriority;
          var priorities = this._actorsPriorities;
          var priorityCount = this._actorsPriorityCount;
          var count = priorityCount[updatePriority];
          if (updatePriority === InfoActor.UPDATE_PRIORITY.Others) {
              this._actors.remove(actor);
          }
          else {
              count -= 1;
          }
          if (count === 0) {
              delete priorityCount[count];
              priorities.splice(priorities.indexOf(updatePriority), 1);
          }
          this._actorsNeedUpdate = true;
          return this;
      };
      /**
       * 通过指定的玩家类`PlayerClass`，向Game中创建一个Player。
       * 要结合玩家系统，详见[Player](./player)。
       */
      Game.prototype.createPlayer = function (name, PlayerClass, isDefault) {
          if (isDefault === void 0) { isDefault = false; }
          if (PlayerClass) {
              this._players.set(name, new PlayerClass(name, this));
          }
          else {
              this._players.set(name, new Player(name, this));
          }
          if (isDefault || this._players.empty) {
              this._defaultPlayer = name;
          }
          return this._players.get(name);
      };
      /**
       * 获取一个指定的Player实例引用。
       */
      Game.prototype.getPlayer = function (name) {
          if (!name && this._defaultPlayer) {
              name = this._defaultPlayer;
          }
          return this._players.get(name);
      };
      /**
       * 移除一个指定的Player。
       */
      Game.prototype.removePlayer = function (name) {
          var player = this._players.remove(name);
          player.releaseController();
          return this;
      };
      /**
       * 清空Player列表。
       */
      Game.prototype.clearPlayers = function () {
          this._players.forEach(function (player) {
              player.releaseController();
          });
          this._players.clear();
          return this;
      };
      Game.prototype.initLoaders = function (options) {
          this._resource.register('GlTF', GlTFLoader);
          this._resource.register('Image', ImageLoader);
          this._resource.register('Texture', TextureLoader);
          this._resource.register('CubeTexture', CubeTextureLoader);
          this._resource.register('Atlas', AtlasLoader);
          if (options.amcMemPages) {
              GlTFLoader.GET_EXTENSION_HANDLER('ALI_amc_mesh_compression').memPages = options.amcMemPages;
          }
      };
      Game.prototype.initEvents = function () {
          var _this = this;
          this._hid.register('MouseClick', MouseClickTrigger);
          this._hid.register('MouseDown', MouseDownTrigger);
          this._hid.register('MouseEnter', MouseEnterTrigger);
          this._hid.register('MouseLeave', MouseLeaveTrigger);
          this._hid.register('MouseMove', MouseMoveTrigger);
          this._hid.register('MouseOut', MouseOutTrigger);
          this._hid.register('MouseOver', MouseOverTrigger);
          this._hid.register('MouseUp', MouseUpTrigger);
          this._hid.register('MouseWheel', MouseWheelTrigger);
          this._hid.register('Wheel', WheelTrigger);
          this._hid.register('ContextMenu', ContextMenuTrigger);
          this._hid.register('KeyDown', KeyDownTrigger);
          this._hid.register('KeyUp', KeyUpTrigger);
          this._hid.register('KeyPress', KeyPressTrigger);
          this._hid.register('TouchStart', TouchStartTrigger);
          this._hid.register('TouchEnd', TouchEndTrigger);
          this._hid.register('TouchMove', TouchMoveTrigger);
          this._hid.register('TouchCancel', TouchCancelTrigger);
          this._event.register('Resize', WindowResizeTrigger);
          this._event.register('GameDidInit');
          this._event.register('GameDidStart');
          this._event.register('GameWillPause');
          this._event.register('GameDidResume');
          this._event.register('GameWillDestroy');
          this._event.register('WorldDidInit');
          this._event.register('WorldDidCreatePlayers');
          this._event.register('WorldWillDestroy');
          this._event.register('LevelDidInit');
          this._event.register('LevelWillPreload');
          this._event.register('LevelIsPreloading');
          this._event.register('LevelDidPreload');
          this._event.register('LevelDidCreateActors');
          this._event.register('LevelWillDestroy');
          this._event.register('WebglContextLost');
          this._event.register('WebglContextRestored');
          this._event.register('MainRendererWillStart');
          this._event.register('MainRendererIsCleared');
          this._event.register('MainRendererIsFinished');
          this._hiloStage.renderer.on('webglContextLost', function () { return _this._event.trigger('WebglContextLost'); });
          this._hiloStage.renderer.on('webglContextRestored', function () { return _this._event.trigger('WebglContextRestored'); });
          this._hiloStage.renderer.on('beforeRenderScene', function () { return _this._event.trigger('MainRendererIsCleared'); });
          this.event.add('Resize', function () { return _this.resize(); });
      };
      Game.prototype.initSystems = function () {
          this.game.addActor('physicSystem', PhysicSystemActor);
      };
      /**
       * 重置画布容器尺寸。
       */
      Game.prototype.resize = function (bound) {
          var _this = this;
          bound = bound || this.bound;
          var width = bound.width, height = bound.height;
          var _a = this._hiloStage, pixelRatio = _a.pixelRatio, renderer = _a.renderer;
          this._hiloStage.width = width;
          this._hiloStage.height = height;
          renderer.resize(width * pixelRatio, height * pixelRatio, true);
          if (this.world) {
              setTimeout(function () { return _this.world.resizeMainCamera(); }, 0);
          }
          return this;
      };
      /**
       * 启动这个游戏。
       */
      Game.prototype.start = function () {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          if (!this._defaultWorldName) {
                              throw new UnmetRequireException(this, 'A default world must be specified !');
                          }
                          this.resize();
                          return [4 /*yield*/, this.switchWorld(this._defaultWorldName)];
                      case 1:
                          _a.sent();
                          this._engine.startGame(this);
                          this._paused = false;
                          this._event.trigger('GameDidStart', { game: this });
                          return [2 /*return*/, this];
                  }
              });
          });
      };
      /**
       * 暂停这个游戏。
       */
      Game.prototype.pause = function () {
          this._event.trigger('GameWillPause', { game: this });
          this._engine.pauseGame(this);
          this._paused = true;
          return this;
      };
      /**
       * 唤醒这个游戏。
       */
      Game.prototype.resume = function () {
          this._engine.resumeGame(this);
          this._paused = false;
          this._event.trigger('GameDidResume', { game: this });
          return this;
      };
      /**
       * 重启这个游戏。
       */
      Game.prototype.restart = function () {
          this._engine.restartGame(this);
          this._paused = false;
          return this;
      };
      /**
       * 销毁这个游戏。
       */
      Game.prototype.destroy = function () {
          _super.prototype.destroy.call(this);
          this._paused = true;
          this._event.trigger('GameWillDestroy', { game: this });
          this._engine.destroyGame(this);
          this._engine = null;
          this._hid.destroy();
          this._event.destroy();
          this._world.destroy();
          this.removeActor(this._state);
          this._actors.forEach(function (actor) { return actor.destroy(); });
          this._actors.clear();
          this._hiloStage.destroy();
          this._resource.destroy();
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      Game.prototype.update = function (delta) {
          this._hid.flushAll();
          this._event.flushAll();
          try {
              this.onUpdate(delta);
          }
          catch (error) {
              throwException(error, this);
          }
          if (this._actorsNeedUpdate) {
              this._actorsForUpdate.copy(this._actors);
              this._actorsNeedUpdate = false;
          }
          this._actorsForUpdate.forEach(function (actor) { return actor.update(delta); });
          this._players.forEach(function (player) { return player.update(delta); });
          if (this.world) {
              this.world.update(delta);
          }
      };
      Game = __decorate([
          SClass({ className: 'Game', classType: 'Game' })
      ], Game);
      return Game;
  }(SObject));

  /**
   * 判断一个实例是否为`GameModeActor`。
   */
  function isGameModeActor(value) {
      return value.isGameModeActor;
  }
  /**
   * 游戏玩法逻辑Actor类。此类承载着一个`World`的整体玩法逻辑，适用于其下的所有`Level`。
   *
   * @template IWorldState 世界状态参数类型。
   *
   * @noInheritDoc
   */
  var GameModeActor = /** @class */ (function (_super) {
      __extends(GameModeActor, _super);
      function GameModeActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isGameModeActor = true;
          _this.updatePriority = InfoActor.UPDATE_PRIORITY.GameMode;
          return _this;
      }
      Object.defineProperty(GameModeActor.prototype, "parent", {
          /**
           * 此实例的父级实际指向`Game`。
           */
          get: function () {
              return this._game;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(GameModeActor.prototype, "state", {
          /**
           * 获取当前`World`的状态。
           */
          get: function () {
              return this.getWorld().state;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 一个特殊的生命周期，在`onAdd`之后触发，只有在此生命周期内，你可以**执行阻塞的异步逻辑**。
       * 这个生命周期一般用于用户登录、获取异步状态等逻辑，谨慎使用！
       */
      GameModeActor.prototype.onLogin = function () {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  return [2 /*return*/];
              });
          });
      };
      /**
       * 生命周期，在`onLogin`之后触发。
       * 用于创建游戏玩家`Player`，默认会创建一个名为`'player'`的玩家。
       */
      GameModeActor.prototype.onCreatePlayers = function () {
          this._game.createPlayer('player', null, true);
      };
      /**
       * 生命周期，在`onDestroy`之后触发。
       * 用于销毁玩家，默认不执行销毁，即保留玩家。
       */
      GameModeActor.prototype.onDestroyPlayers = function () {
      };
      /**
       * 指定一个状态类，在此类所从属的`World`实例化时，会由其生成默认的`WorldState`实例。
       */
      GameModeActor.WorldStateClass = StateActor;
      GameModeActor = __decorate([
          SClass({ className: 'GameModeActor' })
      ], GameModeActor);
      return GameModeActor;
  }(InfoActor));

  /**
   * 判断一个实例是否为`LevelScriptActor`。
   */
  function isLevelScriptActor(value) {
      return value.isLevelScriptActor;
  }
  /**
   * 游戏关卡逻辑Actor类。此类承载着一个`Level`的具体逻辑。
   *
   * @template ILevelState 关卡状态参数类型。
   *
   * @noInheritDoc
   */
  var LevelScriptActor = /** @class */ (function (_super) {
      __extends(LevelScriptActor, _super);
      function LevelScriptActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isLevelScriptActor = true;
          _this.updatePriority = InfoActor.UPDATE_PRIORITY.LevelScript;
          return _this;
      }
      Object.defineProperty(LevelScriptActor.prototype, "parent", {
          /**
           * 此实例的父级实际指向`World`。
           */
          get: function () {
              return this._game.world;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(LevelScriptActor.prototype, "state", {
          /**
           * 获取当前`Level`的状态。
           */
          get: function () {
              return this.getLevel().state;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 一个特殊的生命周期，在`onAdd`之后触发，只有在此生命周期内，你可以**执行阻塞的异步逻辑**。
       * 这个生命周期一般用于用户登录、获取异步状态等逻辑，谨慎使用！
       */
      LevelScriptActor.prototype.onLogin = function () {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  return [2 /*return*/];
              });
          });
      };
      /**
       * 生命周期，在`onLogin`之后触发。
       * 这个生命周期用于关卡资源初始化，你也可以在这里直接创建一些Actor用于加载动画等。
       */
      LevelScriptActor.prototype.onPreload = function () {
      };
      /**
       * 生命周期，在`onPreload`之后、每一次资源加载进度更新时触发。
       * 你可以在这里更新你的家在进度。
       */
      LevelScriptActor.prototype.onLoading = function (state) {
      };
      /**
       * 生命周期，在`onLoading`结束之后触发。
       * 到了这个生命周期，所有的资源已经加载完毕就位，你可以执行实际上场景的创建了。
       */
      LevelScriptActor.prototype.onCreate = function () {
      };
      /**
       * 指定一个状态类，在此类所从属的`Level`实例化时，会由其生成默认的`LevelState`实例。
       */
      LevelScriptActor.LevelStateClass = StateActor;
      LevelScriptActor = __decorate([
          SClass({ className: 'LevelScriptActor' })
      ], LevelScriptActor);
      return LevelScriptActor;
  }(InfoActor));

  /**
   * 判断一个实例是否为`Timer`。
   */
  function isTimerActor(value) {
      return value.isTimerActor;
  }
  /**
   * 定时器。
   *
   * @noInheritDoc
   */
  var TimerActor = /** @class */ (function (_super) {
      __extends(TimerActor, _super);
      function TimerActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isTimerActor = true;
          _this._state = {
              times: 0,
              timeStep: 0,
              current: 0
          };
          _this._delta = 0;
          _this._paused = false;
          _this._stopped = false;
          return _this;
      }
      Object.defineProperty(TimerActor.prototype, "event", {
          /**
           * Timer的事件管理器。
           *
           * ```ts
           * EventManager<{
           *  Start: ITimerState;
           *  Pause: ITimerState;
           *  Resume: ITimerState;
           *  Step: ITimerState;
           *  End: ITimerState;
           * }>
           * ```
           *
           * [ITimerState](../interfaces/itimerstate)
           */
          get: function () {
              return this._root.event;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 初始化，继承请先`super.onInit()`。
       */
      TimerActor.prototype.onInit = function () {
          this.event.register('Start');
          this.event.register('Pause');
          this.event.register('Resume');
          this.event.register('Step');
          this.event.register('End');
      };
      /**
       * 每帧更新，继承请先`super.onUpdate()`。
       */
      TimerActor.prototype.onUpdate = function (delta) {
          if (this._stopped) {
              this._delta = 0;
              return;
          }
          if (this._delta < this._state.timeStep) {
              this._delta += delta;
              return;
          }
          this._delta = 0;
          if (this._state.current === this._state.times) {
              this.stop();
              return;
          }
          this._state.current += 1;
          this.event.trigger('Step', this._state);
      };
      /**
       * 启动Timer。
       *
       * @param times 此次倒计时总步数。
       * @param timeStep 此次倒计每次步长。
       */
      TimerActor.prototype.start = function (times, timeStep) {
          this._state.times = times;
          this._state.timeStep = timeStep;
          this._state.current = 0;
          this.event.trigger('Start', this._state);
          this._paused = false;
          this._stopped = false;
          return this;
      };
      /**
       * 暂停Timer。
       */
      TimerActor.prototype.pause = function () {
          if (this._paused || this._stopped) {
              return;
          }
          this._paused = true;
          this.event.trigger('Pause', this._state);
          return this;
      };
      /**
       * 唤醒Timer。
       */
      TimerActor.prototype.resume = function () {
          if (this._stopped || !this._paused) {
              return;
          }
          this._delta = 0;
          this.event.trigger('Resume', this._state);
          this._paused = false;
          return this;
      };
      /**
       * 停止Timer。
       */
      TimerActor.prototype.stop = function () {
          this._stopped = true;
          this.event.trigger('End', this._state);
          return this;
      };
      TimerActor = __decorate([
          SClass({ className: 'Timer', classType: 'Timer' })
      ], TimerActor);
      return TimerActor;
  }(InfoActor));

  /**
   * Sein.js封装的用于存储`SObject`实例的特殊Set容器。
   * 通过实例的`uuid`表征唯一性。
   *
   * @template T 存储的实例的类型。
   */
  var SSet = /** @class */ (function (_super) {
      __extends(SSet, _super);
      function SSet() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._table = {};
          return _this;
      }
      /**
       * 添加一个实例到SArray中。
       */
      SSet.prototype.add = function (item) {
          if (this._table[item.uuid]) {
              return;
          }
          this.addItem(item);
          this._table[item.uuid] = item;
          return this;
      };
      /**
       * 从容器中移除一个实例。
       */
      SSet.prototype.remove = function (item) {
          if (!this._table[item.uuid]) {
              return;
          }
          this.removeItem(item);
          delete this._table[item.uuid];
          return this;
      };
      /**
       * 清空所有存储的实例。
       */
      SSet.prototype.clear = function () {
          _super.prototype.clear.call(this);
          this._table = {};
          return this;
      };
      /**
       * 从一个基本的数组实例初始化SIterable。
       */
      SSet.prototype.fromArray = function (array) {
          this.clear();
          var length = array.length;
          for (var index = 0; index < length; index += 1) {
              this.add(array[index]);
          }
          return this;
      };
      return SSet;
  }(SIterable));

  /**
   * 判断一个实例是否为`TypeConflictException`。
   */
  function isTypeConflictException(value) {
      return value.isTypeConflictException;
  }
  /**
   * 类型冲突异常。
   *
   * @noInheritDoc
   */
  var TypeConflictException = /** @class */ (function (_super) {
      __extends(TypeConflictException, _super);
      /**
       * 构建异常。
       *
       * @param member 成员实例。
       * @param requireType 需求的类型。
       * @param object 触发异常的实例。
       * @param message 追加信息。
       */
      function TypeConflictException(member, requireType, object, message) {
          if (message === void 0) { message = ''; }
          var _this = _super.call(this, 'TypeConflict', object, "Type of \"" + member.name + "\" is \"" + member.classType + "\", but type \"" + requireType + "\" is required. \"" + parent.name + "\". " + message) || this;
          _this.isTypeConflictException = true;
          return _this;
      }
      return TypeConflictException;
  }(BaseException));

  /**
   * 判断一个实例是否为`ControllerActor`。
   */
  function isControllerActor(value) {
      return value.isControllerActor;
  }
  /**
   * 控制器类，作为`World`中棋子SceneActor的抽象逻辑控制代理。
   * 一般不直接使用，而是使用其派生类`PlayerControllerActor`和`AIControllerActor`。
   * 和玩家系统有关，详见[Player](./player)。
   *
   * @template IState 指定状态的类型。
   * @template IActor 指定允许控制的Actor的类型。
   * @noInheritDoc
   */
  var ControllerActor = /** @class */ (function (_super) {
      __extends(ControllerActor, _super);
      function ControllerActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isControllerActor = true;
          _this._follow = false;
          return _this;
      }
      Object.defineProperty(ControllerActor.prototype, "actor", {
          /**
           * 获取当前控制的actor。
           */
          get: function () {
              return this._actor;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ControllerActor.prototype, "state", {
          /**
           * 获取当前关联的状态。
           */
          get: function () {
              return this._state;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 生命周期，将在获得了一个actor的控制权时呗触发。
       */
      ControllerActor.prototype.onPossesActor = function (actor) {
      };
      /**
       * 生命周期，将在失去了一个actor的控制权时呗触发。
       */
      ControllerActor.prototype.onDisPossesActor = function (actor) {
      };
      /**
       * 控制一个actor。
       */
      ControllerActor.prototype.possessActor = function (actor) {
          if (this._actor) {
              throw new BreakGuardException(this, "Controller " + this.name + " already has actor " + this.actor.name + " !");
          }
          if (actor._controller) {
              throw new BreakGuardException(this, "Actor " + actor.name + " already controlled by controller " + actor.getController().name + " !");
          }
          this._actor = actor;
          this._actor._controller = this;
          try {
              this.onPossesActor(actor);
          }
          catch (error) {
              throwException(error, this);
          }
          return this;
      };
      /**
       * 解除一个actor的控制。
       *
       * @param transferTo 如果存在，将当前控制的actor的控制权移交。
       */
      ControllerActor.prototype.dispossessActor = function (transferTo) {
          try {
              this.onDisPossesActor(this._actor);
          }
          catch (error) {
              throwException(error, this);
          }
          if (this._actor) {
              this._actor.controller = null;
          }
          this._actor = null;
          if (transferTo) {
              transferTo.possessActor(this);
          }
          return this;
      };
      /**
       * 获取当前控制的actor，可用于类型推断。
       */
      ControllerActor.prototype.getActor = function () {
          return this._actor;
      };
      ControllerActor.prototype.switchState = function (state) {
          if (state.controller) {
              state.controller._state = null;
          }
          this._state = state;
          state._controller = this;
          return this;
      };
      /**
       * 获取当前关联的状态，可用于类型推断。
       */
      ControllerActor.prototype.getState = function () {
          return this._state;
      };
      /**
       * 跟随actor，由于ControllerActor自身也是`SceneActor`，所以其自己也有`transform`。
       * 你可以给其添加一个摄像机组件来达成一些有意思的玩法。
       */
      ControllerActor.prototype.followActor = function () {
          this._follow = true;
          return this;
      };
      /**
       * 取消跟随`Actor`。
       */
      ControllerActor.prototype.unFollowActor = function () {
          this._follow = false;
          return this;
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      ControllerActor.prototype.added = function () {
          _super.prototype.added.call(this);
          var initState = this._initOptions;
          if (initState.state) {
              this.switchState(initState.state);
          }
          if (initState.actor) {
              this.possessActor(initState.actor);
          }
          this._follow = !!initState.followActor;
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      ControllerActor.prototype.update = function (delta) {
          _super.prototype.update.call(this, delta);
          if (this._follow && this._actor) {
              this.transform.matrix.copy(this._actor.transform.matrix);
          }
      };
      ControllerActor = __decorate([
          SClass({ className: 'ControllerActor', classType: 'Controller' })
      ], ControllerActor);
      return ControllerActor;
  }(SceneActor));

  /**
   * 判断一个实例是否为`PlayerControllerActor`。
   */
  function isPlayerControllerActor(value) {
      return value.isPlayerControllerActor;
  }
  /**
   * 玩家控制器类，区别于AI控制器，和玩家系统有关，详见[Player](./player)。
   *
   * @template IState 指定状态的类型。
   * @template IActor 指定允许控制的Actor的类型。
   * @noInheritDoc
   */
  var PlayerControllerActor = /** @class */ (function (_super) {
      __extends(PlayerControllerActor, _super);
      function PlayerControllerActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isPlayerControllerActor = true;
          _this.persistent = true;
          return _this;
      }
      Object.defineProperty(PlayerControllerActor.prototype, "player", {
          /**
           * 获取当前拥有自身的玩家。
           */
          get: function () {
              return this._player;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 设置当前拥有自身的玩家。
       */
      PlayerControllerActor.prototype.setPlayer = function (player) {
          player.switchController(this);
          return this;
      };
      /**
       * 销毁，继承请先`super.onDestroy()`。
       */
      PlayerControllerActor.prototype.onDestroy = function () {
          if (this._player) {
              this._player.releaseController();
          }
          _super.prototype.onDestroy.call(this);
      };
      PlayerControllerActor = __decorate([
          SClass({ className: 'PlayerControllerActor' })
      ], PlayerControllerActor);
      return PlayerControllerActor;
  }(ControllerActor));

  /**
   * 判断一个实例是否为`PlayerStateActor`。
   */
  function isPlayerStateActor(value) {
      return value.isPlayerStateActor;
  }
  /**
   * 用户状态类，可被`ControllerActor`关联。
   * 和玩家系统有关，详见[Player](./player)。
   *
   * @template IOptionTypes 初始化参数类型。
   * @noInheritDoc
   */
  var PlayerStateActor = /** @class */ (function (_super) {
      __extends(PlayerStateActor, _super);
      function PlayerStateActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isPlayerStateActor = true;
          return _this;
      }
      /**
       * 获取当前关联的Controller。
       */
      PlayerStateActor.prototype.getController = function () {
          return this._controller;
      };
      PlayerStateActor = __decorate([
          SClass({ className: 'PlayerStateActor' })
      ], PlayerStateActor);
      return PlayerStateActor;
  }(StateActor));

  /**
   * 判断一个实例是否为`AIControllerActor`。
   */
  function isAIControllerActor(value) {
      return value.isAIControllerActor;
  }
  /**
   * AI控制器类，区别于玩家控制器，完全由代码逻辑控制。
   * 和玩家系统有关，详见[Player](./player)。
   *
   * @template IState 指定状态的类型。
   * @template IActor 指定允许控制的Actor的类型。
   * @noInheritDoc
   */
  var AIControllerActor = /** @class */ (function (_super) {
      __extends(AIControllerActor, _super);
      function AIControllerActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isAIControllerActor = true;
          return _this;
          // todo: 添加默认行为树
      }
      AIControllerActor = __decorate([
          SClass({ className: 'AIControllerActor' })
      ], AIControllerActor);
      return AIControllerActor;
  }(ControllerActor));

  /**
   * 用于2D精灵的材质。
   *
   * @noInheritDoc
   */
  var SpriteMaterial = /** @class */ (function (_super) {
      __extends(SpriteMaterial, _super);
      function SpriteMaterial(params) {
          var _this = _super.call(this) || this;
          _this.isSpriteMaterial = true;
          var options = params;
          var uvMatrix = options.uvMatrix, texture = options.texture;
          _this._uvMatrix = uvMatrix;
          options.attributes = {
              a_position: 'POSITION',
              a_uv: 'TEXCOORD_0'
          };
          options.uniforms = {
              u_modelViewProjectionMatrix: 'MODELVIEWPROJECTION',
              u_texture: { value: texture },
              u_uvMatrix: { value: uvMatrix }
          };
          options.vs = "\nprecision HILO_MAX_VERTEX_PRECISION float;\nattribute vec3 a_position;\nattribute vec2 a_uv;\nuniform mat4 u_modelViewProjectionMatrix;\nuniform mat3 u_uvMatrix;\nvarying vec2 v_uv;\n\nvoid main() {\nv_uv = (u_uvMatrix * vec3(a_uv, 1.)).xy;\n\ngl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.0);\n}\n";
          options.fs = "\nprecision HILO_MAX_FRAGMENT_PRECISION float;\nuniform sampler2D u_texture;\nvarying vec2 v_uv;\n\nvoid main() {\ngl_FragColor = texture2D(u_texture, v_uv);\n}\n";
          options.side = Constants.FRONT_AND_BACK;
          delete options.texture;
          delete options.uvMatrix;
          _this._initOptions = options;
          _this.init(options);
          return _this;
      }
      Object.defineProperty(SpriteMaterial.prototype, "uvMatrix", {
          /**
           * 获取单元。
           */
          get: function () {
              return this._uvMatrix;
          },
          /**
           * 设置单元。
           */
          set: function (matrix) {
              this._uvMatrix = matrix;
              // console.log(new Vector2().transformMat3(matrix).elements);
              this.changeUniform('u_uvMatrix', function (value) { return value.copy(matrix); });
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpriteMaterial.prototype, "texture", {
          /**
           * 获取纹理。
           */
          get: function () {
              return this.getUniform('u_texture').value;
          },
          /**
           * 设置纹理。
           */
          set: function (value) {
              this.setUniform('u_texture', value);
          },
          enumerable: true,
          configurable: true
      });
      SpriteMaterial = __decorate([
          SMaterial({ className: 'SpriteMaterial' })
      ], SpriteMaterial);
      return SpriteMaterial;
  }(RawShaderMaterial));

  /**
   * 判断一个实例是否为`SpriteComponent`。
   */
  function isSpriteComponent(value) {
      return value.isSpriteComponent;
  }
  /**
   * 判断一个实例是否为`SpriteActor`。
   */
  function isSpriteActor(value) {
      return isSceneActor(value) && isSpriteComponent(value.root);
  }
  /**
   * 精灵组件类，是展示2D图元的基本组件。
   *
   * @noInheritDoc
   */
  var SpriteComponent = /** @class */ (function (_super) {
      __extends(SpriteComponent, _super);
      function SpriteComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isSpriteComponent = true;
          /**
           * 是否开启`Billboard`模式，若开启，则精灵始终面向摄像机。
           */
          _this.isBillboard = false;
          return _this;
      }
      /**
       * 初始化，继承请先`super.onInit()`。
       */
      SpriteComponent.prototype.onInit = function (state) {
          _super.prototype.onInit.call(this, state);
          var texture;
          var uvMatrix = new Matrix3();
          if (state.atlas) {
              texture = state.atlas.texture;
              this._atlas = state.atlas;
              uvMatrix.copy(this._atlas.getUVMatrix(state.frameName));
          }
          else {
              texture = state.texture;
          }
          texture.width = texture.origWidth;
          texture.height = texture.origHeight;
          var geometry = new Hilo3d$2.PlaneGeometry({ width: state.width, height: state.height });
          var material = new SpriteMaterial(__assign({ texture: texture,
              uvMatrix: uvMatrix }, state.materialOptions));
          this._mesh = new Hilo3d$2.Mesh({ geometry: geometry, material: material });
          this._mesh.__forceUseParentWorldMatrix = true;
          if (state.frustumTest !== undefined) {
              this._mesh.frustumTest = state.frustumTest;
          }
          this.isBillboard = state.isBillboard || false;
          this._node.addChild(this._mesh);
          var root = this.getRoot();
          if (root) {
              root.hiloNode.addChild(this._node);
          }
      };
      Object.defineProperty(SpriteComponent.prototype, "width", {
          /**
           * 获取精灵宽度。
           */
          get: function () {
              return this._initState.width;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpriteComponent.prototype, "height", {
          /**
           * 获取精灵高度。
           */
          get: function () {
              return this._initState.height;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpriteComponent.prototype, "texture", {
          /**
           * 获取当前纹理。
           */
          get: function () {
              return this._mesh.material.texture;
          },
          /**
           * 设置纹理。
           */
          set: function (texture) {
              this._mesh.material.texture = texture;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpriteComponent.prototype, "atlas", {
          /**
           * 获取当前图集。
           */
          get: function () {
              return this._atlas;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpriteComponent.prototype, "frustumTest", {
          /**
           * 是否需要视椎体裁剪。
           */
          get: function () {
              return this._mesh.frustumTest;
          },
          /**
           * 是否需要视椎体裁剪。
           */
          set: function (frustumTest) {
              this._mesh.frustumTest = frustumTest;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpriteComponent.prototype, "material", {
          /**
           * 获取材质数据。
           */
          get: function () {
              return this._mesh.material;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 仅当图集`atlas`模式下，设置要显示哪一帧。
       */
      SpriteComponent.prototype.setFrame = function (name) {
          this._mesh.material.uvMatrix = this._atlas.getUVMatrix(name);
          return this;
      };
      /**
       * 每帧更新，继承请先`super.onUpdate()`。
       */
      SpriteComponent.prototype.onUpdate = function () {
          if (this.isBillboard) {
              this.quaternion = this.getWorld().mainCamera.quaternion;
          }
      };
      SpriteComponent = __decorate([
          SClass({ className: 'SpriteComponent' })
      ], SpriteComponent);
      return SpriteComponent;
  }(SceneComponent));

  /**
   * [SpriteComponent](../spritecomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var SpriteActor = /** @class */ (function (_super) {
      __extends(SpriteActor, _super);
      function SpriteActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      SpriteActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', SpriteComponent, options);
      };
      SpriteActor = __decorate([
          SClass({ className: 'SpriteActor' })
      ], SpriteActor);
      return SpriteActor;
  }(SceneActor));

  var Fog = /** @class */ (function (_super) {
      __extends(Fog, _super);
      function Fog() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Fog;
  }(Hilo3d$2.Fog));

  /**
   * 判断一个实例是否为`FrameBuffer`。
   */
  function isFrameBuffer(value) {
      return value.isFramebuffer;
  }
  /**
   * FrameBuffer。可以作为渲染的目标对象。
   */
  var FrameBuffer = /** @class */ (function (_super) {
      __extends(FrameBuffer, _super);
      function FrameBuffer(game, options) {
          return _super.call(this, game.renderer, options) || this;
      }
      return FrameBuffer;
  }(Hilo3d$2.Framebuffer));

  /**
   * 判断一个实例是否为`RenderSystemActor`。
   */
  function isRenderSystemActor(value) {
      return value.isRenderSystemActor;
  }
  /**
   * 渲染系统，可以用于精确控制整个渲染流程，达到需要多个PASS的渲染的效果（例如镜面、后处理等等）。
   *
   * 实例请见[进阶渲染](../../example/render/advance)。
   */
  var RenderSystemActor = /** @class */ (function (_super) {
      __extends(RenderSystemActor, _super);
      function RenderSystemActor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isRenderSystemActor = true;
          _this.handlePreRender = function () { return _this.onPreRender(_this._initOptions); };
          _this.handlePostClear = function () { return _this.onPostClear(_this._initOptions); };
          _this.handlePostRender = function () { return _this.onPostRender(_this._initOptions); };
          return _this;
      }
      /**
       * 初始化，继承请先调用`super.onInit`。
       */
      RenderSystemActor.prototype.onInit = function (initOptions) {
          this.bindEvents();
      };
      /**
       * 取消链接，将会暂时让功能失效，继承请先调用`super.onUnLink`。
       */
      RenderSystemActor.prototype.onUnLink = function () {
          this.unBindEvents();
      };
      /**
       * 取消链接，将会让功能恢复，继承请先调用`super.onReLink`。
       */
      RenderSystemActor.prototype.onReLink = function () {
          this.bindEvents();
      };
      /**
       * 在整个世界中的所有物体被默认渲染前触发。
       * **注意不要在这里切换主相机！**
       */
      RenderSystemActor.prototype.onPreRender = function (initOptions) {
      };
      /**
       * 在整个画面被`Clear`后触发。
       * 如果想默认渲染到`Renderer`内置的`Frame`或者插入一些类似于手机相机的画面等，可以在这里完成。
       * **注意不要在这里修改任何图层！也不要在这里切换主相机！**
       */
      RenderSystemActor.prototype.onPostClear = function (initOptions) {
      };
      /**
       * 在整个所有的模型被默认渲染到屏幕后触发。
       * **注意不要在这里切换主相机！**
       */
      RenderSystemActor.prototype.onPostRender = function (initOptions) {
      };
      /**
       * 销毁逻辑，继承请先调用`super.onDestroy`。
       */
      RenderSystemActor.prototype.onDestroy = function () {
          this.unBindEvents();
      };
      RenderSystemActor.prototype.bindEvents = function () {
          var game = this.getGame();
          game.event.add('MainRendererWillStart', this.handlePreRender);
          game.event.add('MainRendererIsCleared', this.handlePostClear);
          game.event.add('MainRendererIsFinished', this.handlePostRender);
      };
      RenderSystemActor.prototype.unBindEvents = function () {
          var game = this.getGame();
          game.event.remove('MainRendererWillStart', this.handlePreRender);
          game.event.remove('MainRendererIsCleared', this.handlePostClear);
          game.event.remove('MainRendererIsFinished', this.handlePostRender);
      };
      RenderSystemActor = __decorate([
          SClass({ className: 'RenderSystemActor' })
      ], RenderSystemActor);
      return RenderSystemActor;
  }(SystemActor));

  var VertexArrayObject = /** @class */ (function (_super) {
      __extends(VertexArrayObject, _super);
      function VertexArrayObject() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return VertexArrayObject;
  }(Hilo3d$2.VertexArrayObject));

  var Program = /** @class */ (function (_super) {
      __extends(Program, _super);
      function Program() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Program;
  }(Hilo3d$2.Program));

  var Shader = /** @class */ (function (_super) {
      __extends(Shader, _super);
      function Shader() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Shader;
  }(Hilo3d$2.Shader));

  /**
   * @File   : GLCapabilities.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 6/10/2019, 10:40:17 PM
   * @Description:
   */
  var GLCapabilities = Hilo3d$2.capabilities;

  /**
   * @File   : GLExtensions.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 6/10/2019, 10:40:59 PM
   * @Description:
   */
  var GLExtensions = Hilo3d$2.extensions;

  var Buffer = /** @class */ (function (_super) {
      __extends(Buffer, _super);
      function Buffer() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Buffer;
  }(Hilo3d$2.Buffer));

  /**
   * 判断一个实例是否为`BoxGeometry`。
   */
  function isBoxGeometry(value) {
      return value.isBoxGeometry;
  }
  var BoxGeometry = /** @class */ (function (_super) {
      __extends(BoxGeometry, _super);
      function BoxGeometry() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return BoxGeometry;
  }(Hilo3d$2.BoxGeometry));

  /**
   * 判断一个实例是否为`BSPBoxComponent`。
   */
  function isBSPBoxComponent(value) {
      return value.isBSPBoxComponent;
  }
  /**
   * 判断一个实例是否为`BSPBoxActor`。
   */
  function isBSPBoxActor(value) {
      return isSceneActor(value) && isBSPBoxComponent(value.root);
  }
  /**
   * 基础立方体。
   *
   * @noInheritDoc
   */
  var BSPBoxComponent = /** @class */ (function (_super) {
      __extends(BSPBoxComponent, _super);
      function BSPBoxComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isBSPBoxComponent = true;
          return _this;
      }
      BSPBoxComponent.prototype.convertState = function (initState) {
          var width = initState.width, height = initState.height, depth = initState.depth, widthSegments = initState.widthSegments, heightSegments = initState.heightSegments, depthSegments = initState.depthSegments, others = __rest(initState, ["width", "height", "depth", "widthSegments", "heightSegments", "depthSegments"]);
          var result = others;
          result.geometry = new BoxGeometry(initState);
          return result;
      };
      BSPBoxComponent = __decorate([
          SClass({ className: 'BSPBoxComponent' })
      ], BSPBoxComponent);
      return BSPBoxComponent;
  }(BSPComponent));

  /**
   * 判断一个实例是否为`PlaneGeometry`。
   */
  function isPlaneGeometry(value) {
      return value.isPlaneGeometry;
  }
  var PlaneGeometry = /** @class */ (function (_super) {
      __extends(PlaneGeometry, _super);
      function PlaneGeometry() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return PlaneGeometry;
  }(Hilo3d$2.PlaneGeometry));

  /**
   * 判断一个实例是否为`BSPPlaneComponent`。
   */
  function isBSPPlaneComponent(value) {
      return value.isBSPPlaneComponent;
  }
  /**
   * 判断一个实例是否为`BSPPlaneActor`。
   */
  function isBSPPlaneActor(value) {
      return isSceneActor(value) && isBSPPlaneComponent(value.root);
  }
  /**
   * 基础平面。
   *
   * @noInheritDoc
   */
  var BSPPlaneComponent = /** @class */ (function (_super) {
      __extends(BSPPlaneComponent, _super);
      function BSPPlaneComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isBSPPlaneComponent = true;
          return _this;
      }
      BSPPlaneComponent.prototype.convertState = function (initState) {
          var width = initState.width, height = initState.height, widthSegments = initState.widthSegments, heightSegments = initState.heightSegments, others = __rest(initState, ["width", "height", "widthSegments", "heightSegments"]);
          var result = others;
          result.geometry = new PlaneGeometry(initState);
          return result;
      };
      BSPPlaneComponent = __decorate([
          SClass({ className: 'BSPPlaneComponent' })
      ], BSPPlaneComponent);
      return BSPPlaneComponent;
  }(BSPComponent));

  /**
   * 判断一个实例是否为`SphereGeometry`。
   */
  function isSphereGeometry(value) {
      return value.isSphereGeometry;
  }
  var SphereGeometry = /** @class */ (function (_super) {
      __extends(SphereGeometry, _super);
      function SphereGeometry() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return SphereGeometry;
  }(Hilo3d$2.SphereGeometry));

  /**
   * 判断一个实例是否为`BSPSphereComponent`。
   */
  function isBSPSphereComponent(value) {
      return value.isBSPSphereComponent;
  }
  /**
   * 判断一个实例是否为`BSPSphereActor`。
   */
  function isBSPSphereActor(value) {
      return isSceneActor(value) && isBSPSphereComponent(value.root);
  }
  /**
   * 基础球体。
   *
   * @noInheritDoc
   */
  var BSPSphereComponent = /** @class */ (function (_super) {
      __extends(BSPSphereComponent, _super);
      function BSPSphereComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isBSPSphereComponent = true;
          return _this;
      }
      BSPSphereComponent.prototype.convertState = function (initState) {
          var radius = initState.radius, widthSegments = initState.widthSegments, heightSegments = initState.heightSegments, others = __rest(initState, ["radius", "widthSegments", "heightSegments"]);
          var result = others;
          result.geometry = new SphereGeometry(initState);
          return result;
      };
      BSPSphereComponent = __decorate([
          SClass({ className: 'BSPSphereComponent' })
      ], BSPSphereComponent);
      return BSPSphereComponent;
  }(BSPComponent));

  /**
   * 判断一个实例是否为`Geometry`。
   */
  function isGeometry(value) {
      return value.isGeometry;
  }
  var Geometry = /** @class */ (function (_super) {
      __extends(Geometry, _super);
      function Geometry() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Geometry;
  }(Hilo3d$2.Geometry));

  var GeometryData = /** @class */ (function (_super) {
      __extends(GeometryData, _super);
      function GeometryData(data, size, params) {
          return _super.call(this, data, size, params) || this;
      }
      return GeometryData;
  }(Hilo3d$2.GeometryData));

  /**
   * 判断一个实例是否为`CylinderGeometry`。
   */
  function isCylinderGeometry(value) {
      return value.isCylinderGeometry;
  }
  /**
   * 圆柱几何体。
   *
   * @noInheritDoc
   */
  var CylinderGeometry = /** @class */ (function (_super) {
      __extends(CylinderGeometry, _super);
      function CylinderGeometry(params) {
          var _this = _super.call(this, params) || this;
          _this.isCylinderGeometry = true;
          _this.className = 'CylinderGeometry';
          _this._options = {
              radiusTop: 1,
              radiusBottom: 1,
              height: 1,
              radialSegments: 8,
              heightSegments: 1,
              openEnded: false,
              thetaStart: 0,
              thetaLength: Math.PI * 2
          };
          Object.assign(_this._options, params);
          _this.build();
          return _this;
      }
      /* tslint:disable */
      CylinderGeometry.prototype.build = function () {
          var _a = this._options, radiusTop = _a.radiusTop, radiusBottom = _a.radiusBottom, height = _a.height, radialSegments = _a.radialSegments, heightSegments = _a.heightSegments, openEnded = _a.openEnded, thetaStart = _a.thetaStart, thetaLength = _a.thetaLength;
          var indices = [];
          var vertices = [];
          var normals = [];
          var uvs = [];
          var index = 0;
          var indexArray = [];
          var halfHeight = height / 2;
          generateTorso();
          if (openEnded === false) {
              if (radiusTop > 0) {
                  generateCap(true);
              }
              if (radiusBottom > 0) {
                  generateCap(false);
              }
          }
          this.vertices = new GeometryData(new Float32Array(vertices), 3, null);
          this.indices = new GeometryData(new Uint16Array(indices), 1, null);
          this.uvs = new GeometryData(new Float32Array(uvs), 2, null);
          this.normals = new GeometryData(new Float32Array(normals), 3, null);
          function generateTorso() {
              var x;
              var y;
              var normal = new Vector3();
              var vertex = new Vector3();
              // this will be used to calculate the normal
              var slope = (radiusBottom - radiusTop) / height;
              // generate vertices, normals and uvs
              for (y = 0; y <= heightSegments; y++) {
                  var indexRow = [];
                  var v = y / heightSegments;
                  // calculate the radius of the current row
                  var radius = v * (radiusBottom - radiusTop) + radiusTop;
                  for (x = 0; x <= radialSegments; x++) {
                      var u = x / radialSegments;
                      var theta = u * thetaLength + thetaStart;
                      var sinTheta = Math.sin(theta);
                      var cosTheta = Math.cos(theta);
                      // vertex
                      vertex.x = radius * sinTheta;
                      vertex.y = -v * height + halfHeight;
                      vertex.z = radius * cosTheta;
                      vertices.push(vertex.x, vertex.y, vertex.z);
                      // normal
                      normal.set(sinTheta, slope, cosTheta).normalize();
                      normals.push(normal.x, normal.y, normal.z);
                      // uv
                      uvs.push(u, 1 - v);
                      // save index of vertex in respective row
                      indexRow.push(index++);
                  }
                  // now save vertices of the row in our index array
                  indexArray.push(indexRow);
              }
              // generate indices
              for (x = 0; x < radialSegments; x++) {
                  for (y = 0; y < heightSegments; y++) {
                      // we use the index array to access the correct indices
                      var a = indexArray[y][x];
                      var b = indexArray[y + 1][x];
                      var c = indexArray[y + 1][x + 1];
                      var d = indexArray[y][x + 1];
                      // faces
                      indices.push(a, b, d);
                      indices.push(b, c, d);
                  }
              }
          }
          function generateCap(top) {
              var x;
              var centerIndexStart;
              var centerIndexEnd;
              var uv = new Vector2();
              var vertex = new Vector3();
              var radius = (top === true) ? radiusTop : radiusBottom;
              var sign = (top === true) ? 1 : -1;
              // save the index of the first center vertex
              centerIndexStart = index;
              // first we generate the center vertex data of the cap.
              // because the geometry needs one set of uvs per face,
              // we must generate a center vertex per face/segment
              for (x = 1; x <= radialSegments; x++) {
                  // vertex
                  vertices.push(0, halfHeight * sign, 0);
                  // normal
                  normals.push(0, sign, 0);
                  // uv
                  uvs.push(0.5, 0.5);
                  // increase index
                  index++;
              }
              // save the index of the last center vertex
              centerIndexEnd = index;
              // now we generate the surrounding vertices, normals and uvs
              for (x = 0; x <= radialSegments; x++) {
                  var u = x / radialSegments;
                  var theta = u * thetaLength + thetaStart;
                  var cosTheta = Math.cos(theta);
                  var sinTheta = Math.sin(theta);
                  // vertex
                  vertex.x = radius * sinTheta;
                  vertex.y = halfHeight * sign;
                  vertex.z = radius * cosTheta;
                  vertices.push(vertex.x, vertex.y, vertex.z);
                  // normal
                  normals.push(0, sign, 0);
                  // uv
                  uv.x = (cosTheta * 0.5) + 0.5;
                  uv.y = (sinTheta * 0.5 * sign) + 0.5;
                  uvs.push(uv.x, uv.y);
                  // increase index
                  index++;
              }
              // generate indices
              for (x = 0; x < radialSegments; x++) {
                  var c = centerIndexStart + x;
                  var i = centerIndexEnd + x;
                  if (top === true) {
                      // face top
                      indices.push(i, i + 1, c);
                  }
                  else {
                      // face bottom
                      indices.push(i + 1, i, c);
                  }
              }
          }
      };
      return CylinderGeometry;
  }(Geometry));

  /**
   * 判断一个实例是否为`BSPCylinderComponent`。
   */
  function isBSPCylinderComponent(value) {
      return value.isBSPCylinderComponent;
  }
  /**
   * 判断一个实例是否为`BSPCylinderActor`。
   */
  function isBSPCylinderActor(value) {
      return isSceneActor(value) && isBSPCylinderComponent(value.root);
  }
  /**
   * 基础圆柱体。
   *
   * @noInheritDoc
   */
  var BSPCylinderComponent = /** @class */ (function (_super) {
      __extends(BSPCylinderComponent, _super);
      function BSPCylinderComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isBSPCylinderComponent = true;
          return _this;
      }
      BSPCylinderComponent.prototype.convertState = function (initState) {
          var radiusTop = initState.radiusTop, radiusBottom = initState.radiusBottom, height = initState.height, radialSegments = initState.radialSegments, heightSegments = initState.heightSegments, openEnded = initState.openEnded, thetaStart = initState.thetaStart, thetaLength = initState.thetaLength, others = __rest(initState, ["radiusTop", "radiusBottom", "height", "radialSegments", "heightSegments", "openEnded", "thetaStart", "thetaLength"]);
          var result = others;
          result.geometry = new CylinderGeometry(initState);
          return result;
      };
      BSPCylinderComponent = __decorate([
          SClass({ className: 'BSPCylinderComponent' })
      ], BSPCylinderComponent);
      return BSPCylinderComponent;
  }(BSPComponent));

  /**
   * [BSPBoxComponent](../bspboxcomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var BSPBoxActor = /** @class */ (function (_super) {
      __extends(BSPBoxActor, _super);
      function BSPBoxActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      BSPBoxActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', BSPBoxComponent, options);
      };
      BSPBoxActor = __decorate([
          SClass({ className: 'BSPBoxActor' })
      ], BSPBoxActor);
      return BSPBoxActor;
  }(SceneActor));

  /**
   * [BSPCylinderComponent](../bspcylindercomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var BSPCylinderActor = /** @class */ (function (_super) {
      __extends(BSPCylinderActor, _super);
      function BSPCylinderActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      BSPCylinderActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', BSPCylinderComponent, options);
      };
      BSPCylinderActor = __decorate([
          SClass({ className: 'BSPCylinderActor' })
      ], BSPCylinderActor);
      return BSPCylinderActor;
  }(SceneActor));

  /**
   * [BSPPlaneComponent](../bspplanecomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var BSPPlaneActor = /** @class */ (function (_super) {
      __extends(BSPPlaneActor, _super);
      function BSPPlaneActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      BSPPlaneActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', BSPPlaneComponent, options);
      };
      BSPPlaneActor = __decorate([
          SClass({ className: 'BSPPlaneActor' })
      ], BSPPlaneActor);
      return BSPPlaneActor;
  }(SceneActor));

  /**
   * [BSPSphereComponent](../bspspherecomponent)的一个包装容器。
   *
   * @noInheritDoc
   */
  var BSPSphereActor = /** @class */ (function (_super) {
      __extends(BSPSphereActor, _super);
      function BSPSphereActor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      BSPSphereActor.prototype.onCreateRoot = function (options) {
          return this.addComponent('root', BSPSphereComponent, options);
      };
      BSPSphereActor = __decorate([
          SClass({ className: 'BSPSphereActor' })
      ], BSPSphereActor);
      return BSPSphereActor;
  }(SceneActor));

  /**
   * 判断一个实例是否为`CubeTexture`。
   */
  function isCubeTexture(value) {
      return value.isCubeTexture;
  }
  var CubeTexture = /** @class */ (function (_super) {
      __extends(CubeTexture, _super);
      function CubeTexture() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return CubeTexture;
  }(Hilo3d$2.CubeTexture));

  /**
   * 判断一个实例是否为`LazyTexture`。
   */
  function isLazyTexture(value) {
      return value.isLazyTexture;
  }
  var LazyTexture = /** @class */ (function (_super) {
      __extends(LazyTexture, _super);
      function LazyTexture() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return LazyTexture;
  }(Hilo3d$2.LazyTexture));

  /**
   * 判断一个实例是否为`DataTexture`。
   */
  function isDataTexture(value) {
      return value.isDataTexture;
  }
  var DataTexture = /** @class */ (function (_super) {
      __extends(DataTexture, _super);
      function DataTexture() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return DataTexture;
  }(Hilo3d$2.DataTexture));

  /**
   * 判断一个实例是否为`DynamicTexture`。
   */
  function isDynamicTexture(value) {
      return value.isDynamicTexture;
  }
  /**
   * 动态纹理类。
   *
   * @template IDynamicTextureOptions 动态纹理的初始化参数类型。
   * @noInheritDoc
   */
  var DynamicTexture = /** @class */ (function (_super) {
      __extends(DynamicTexture, _super);
      function DynamicTexture(options) {
          var _this = _super.call(this, options) || this;
          _this.isDynamicTexture = true;
          _this.image = _this._canvas = document.createElement('canvas');
          _this._canvas.width = options.width;
          _this._canvas.height = options.height;
          _this._context = _this._canvas.getContext('2d');
          var needUpdate = _this.onInit(_this._context, options);
          _this.needUpdate = needUpdate === false ? false : true;
          return _this;
      }
      Object.defineProperty(DynamicTexture.prototype, "context", {
          get: function () {
              return this._context;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 纹理初始化时调用的函数，你可以在这里通过canvas初始化绘制你的贴图。
       * 通过返回值来决定是否要更新buffer，返回`false`不更新，默认更新。
       */
      DynamicTexture.prototype.onInit = function (context, initOptions) {
          return false;
      };
      /**
       * 纹理在每次被绘制时调用的函数，你可以在这里通过canvas绘制你的纹理。
       * 通过返回值来决定是否要更新buffer，返回`false`不更新，默认更新。
       */
      DynamicTexture.prototype.onDraw = function (context) {
          return false;
      };
      /**
       * 触发绘制回调。
       */
      DynamicTexture.prototype.draw = function () {
          var needUpdate = this.onDraw(this._context);
          this.needUpdate = needUpdate === false ? false : true;
      };
      return DynamicTexture;
  }(Texture));

  /**
   * 判断一个实例是否为`Material`。
   */
  function isMaterial(value) {
      return value.isMaterial;
  }
  /**
   * **材质基类，不要直接使用！想自定义请使用`RawShaderMaterial`**
   */
  var Material = /** @class */ (function (_super) {
      __extends(Material, _super);
      function Material() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Material;
  }(Hilo3d$2.Material));
  Hilo3d$2.Material.prototype.getUniform = function getUniform(key) {
      /* tslint:disable-next-line */
      var self = this;
      return {
          get value() {
              return self[key];
          },
          set value(v) {
              self.setUniform(key, v);
          }
      };
  };
  Hilo3d$2.Material.prototype.setUniform = function setUniform(key, value) {
      this[key] = value;
      return this;
  };
  Hilo3d$2.Material.prototype.changeUniform = function changeUniform(key, handler) {
      this[key] = handler(this[key]);
      return this;
  };

  /**
   * 判断一个实例是否为`BasicMaterial`。
   */
  function isBasicMaterial(value) {
      return value.isBasicMaterial;
  }
  var BasicMaterial = /** @class */ (function (_super) {
      __extends(BasicMaterial, _super);
      function BasicMaterial() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return BasicMaterial;
  }(Hilo3d$2.BasicMaterial));

  function isGeometryMaterial(value) {
      return value.isGeometryMaterial;
  }
  var GeometryMaterial = /** @class */ (function (_super) {
      __extends(GeometryMaterial, _super);
      function GeometryMaterial() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return GeometryMaterial;
  }(Hilo3d$2.GeometryMaterial));

  /**
   * 判断一个实例是否为`ShaderChunk`。
   */
  function isShaderChunk(value) {
      return value.isShaderChuck;
  }
  /**
   * Shader材质块类，可用于shader复用，快速拼接效果。
   * 详细使用间[Material](../../guide/material)。
   *
   * @template IOptions 初始化参数类型。
   * @noInheritDoc
   */
  var ShaderChunk = /** @class */ (function () {
      /**
       * 构造器。
       *
       * @param isMain 此chuck是否做为材质的最终输出。
       */
      function ShaderChunk(name, options, isMain) {
          if (isMain === void 0) { isMain = false; }
          this.name = name;
          this.isMain = isMain;
          this.isShaderChuck = true;
          /**
           * 顶点着色器函数入口名称，若指定并使用了`MixChunkChuck`，则会在最后的shader中调用。
           */
          this.vsEntryName = '';
          /**
           * 片段着色器主函数入口名称，若指定并使用了`MixChunkChuck`，则会在最后的shader中调用。
           */
          this.fsEntryName = '';
          /**
           * 此chuck主函数是否拥有顶点着色器的输出。
           */
          this.hasVsOut = false;
          /**
           * 此chuck主函数是否拥有片段着色器的输出。
           */
          this.hasFsOut = false;
          this.requiredAttributes = [];
          this.requiredUniforms = [];
          this.attributes = {};
          this.uniforms = {};
          this.defines = '';
          this.vs = { header: '', main: '' };
          this.fs = { header: '', main: '' };
          this.onInit(name, options);
      }
      /**
       * 生命周期，将在chuck初始化的时候被调用。
       */
      ShaderChunk.prototype.onInit = function (name, options) {
      };
      return ShaderChunk;
  }());

  /**
   * @hidden
   */
  var defines = [
      Hilo3d$2.Shader.shaders['chunk/baseDefine.glsl'],
      '#define HILO_HAS_NORMAL 1',
      '#define HILO_HAS_TEXCOORD0 1',
      '#define HILO_HAS_TEXCOORD1 1'
  ].join('\n');
  /**
   * @hidden
   */
  var attributes = {
      a_position: 'POSITION',
      a_normal: 'NORMAL',
      a_tangent: 'TANGENT',
      a_texcoord0: 'TEXCOORD_0',
      a_texcoord1: 'TEXCOORD_1',
      a_color: 'COLOR_0',
      a_skinIndices: 'SKININDICES',
      a_skinWeights: 'SKINWEIGHTS'
  };
  ['POSITION', 'NORMAL', 'TANGENT'].forEach(function (name) {
      var camelName = name.slice(0, 1) + name.slice(1).toLowerCase();
      for (var i = 0; i < 8; i += 1) {
          attributes['a_morph' + camelName + i] = ('MORPH' + name + i);
      }
  });
  /**
   * @hidden
   */
  var uniforms = {
      u_normalMatrix: 'MODELVIEWINVERSETRANSPOSE',
      u_modelViewMatrix: 'MODELVIEW',
      u_modelViewProjectionMatrix: 'MODELVIEWPROJECTION',
      u_logDepth: 'LOGDEPTH',
      // light
      u_ambientLightsColor: 'AMBIENTLIGHTSCOLOR',
      u_directionalLightsColor: 'DIRECTIONALLIGHTSCOLOR',
      u_directionalLightsInfo: 'DIRECTIONALLIGHTSINFO',
      u_directionalLightsShadowMap: 'DIRECTIONALLIGHTSSHADOWMAP',
      u_directionalLightsShadowMapSize: 'DIRECTIONALLIGHTSSHADOWMAPSIZE',
      u_directionalLightsShadowBias: 'DIRECTIONALLIGHTSSHADOWBIAS',
      u_directionalLightSpaceMatrix: 'DIRECTIONALLIGHTSPACEMATRIX',
      u_pointLightsPos: 'POINTLIGHTSPOS',
      u_pointLightsColor: 'POINTLIGHTSCOLOR',
      u_pointLightsInfo: 'POINTLIGHTSINFO',
      u_pointLightsShadowBias: 'POINTLIGHTSSHADOWBIAS',
      u_pointLightsShadowMap: 'POINTLIGHTSSHADOWMAP',
      u_pointLightSpaceMatrix: 'POINTLIGHTSPACEMATRIX',
      u_pointLightCamera: 'POINTLIGHTCAMERA',
      u_spotLightsPos: 'SPOTLIGHTSPOS',
      u_spotLightsDir: 'SPOTLIGHTSDIR',
      u_spotLightsColor: 'SPOTLIGHTSCOLOR',
      u_spotLightsCutoffs: 'SPOTLIGHTSCUTOFFS',
      u_spotLightsInfo: 'SPOTLIGHTSINFO',
      u_spotLightsShadowMap: 'SPOTLIGHTSSHADOWMAP',
      u_spotLightsShadowMapSize: 'SPOTLIGHTSSHADOWMAPSIZE',
      u_spotLightsShadowBias: 'SPOTLIGHTSSHADOWBIAS',
      u_spotLightSpaceMatrix: 'SPOTLIGHTSPACEMATRIX',
      u_areaLightsPos: 'AREALIGHTSPOS',
      u_areaLightsColor: 'AREALIGHTSCOLOR',
      u_areaLightsWidth: 'AREALIGHTSWIDTH',
      u_areaLightsHeight: 'AREALIGHTSHEIGHT',
      u_areaLightsLtcTexture1: 'AREALIGHTSLTCTEXTURE1',
      u_areaLightsLtcTexture2: 'AREALIGHTSLTCTEXTURE2',
      // joint
      u_jointMat: 'JOINTMATRIX',
      u_jointMatTexture: 'JOINTMATRIXTEXTURE',
      u_jointMatTextureSize: 'JOINTMATRIXTEXTURESIZE',
      // quantization
      u_positionDecodeMat: 'POSITIONDECODEMAT',
      u_normalDecodeMat: 'NORMALDECODEMAT',
      u_uvDecodeMat: 'UVDECODEMAT',
      u_uv1DecodeMat: 'UV1DECODEMAT',
      // morph
      u_morphWeights: 'MORPHWEIGHTS',
      u_normalMapScale: 'NORMALMAPSCALE',
      u_emission: 'EMISSION',
      u_transparency: 'TRANSPARENCY',
      // uv matrix
      u_uvMatrix: 'UVMATRIX_0',
      u_uvMatrix1: 'UVMATRIX_1',
      // other info
      u_fogColor: 'FOGCOLOR',
      u_fogInfo: 'FOGINFO',
      u_alphaCutoff: 'ALPHACUTOFF',
      u_exposure: 'EXPOSURE',
      u_gammaFactor: 'GAMMAFACTOR'
  };
  /**
   * @hidden
   */
  var vs = {
      header: [
          Hilo3d$2.Shader.shaders['chunk/extensions.vert'],
          Hilo3d$2.Shader.shaders['chunk/precision.vert'],
          'attribute vec3 a_position;',
          'uniform mat4 u_modelViewProjectionMatrix;',
          Hilo3d$2.Shader.shaders['chunk/unQuantize.vert'],
          Hilo3d$2.Shader.shaders['chunk/joint.vert'],
          Hilo3d$2.Shader.shaders['chunk/uv.vert'],
          Hilo3d$2.Shader.shaders['chunk/normal.vert'],
          Hilo3d$2.Shader.shaders['chunk/lightFog.vert'],
          Hilo3d$2.Shader.shaders['chunk/morph.vert'],
          Hilo3d$2.Shader.shaders['chunk/color.vert'],
          Hilo3d$2.Shader.shaders['chunk/logDepth.vert']
      ].join('\n'),
      main: ''
  };
  /**
   * @hidden
   */
  var fs = {
      header: [
          Hilo3d$2.Shader.shaders['chunk/extensions.frag'],
          Hilo3d$2.Shader.shaders['chunk/precision.frag'],
          Hilo3d$2.Shader.shaders['./chunk/color.frag'],
          Hilo3d$2.Shader.shaders['./chunk/uv.frag'],
          Hilo3d$2.Shader.shaders['./chunk/normal.frag'],
          Hilo3d$2.Shader.shaders['./chunk/lightFog.frag'],
          Hilo3d$2.Shader.shaders['./chunk/light.frag'],
          Hilo3d$2.Shader.shaders['./chunk/transparency.frag'],
          Hilo3d$2.Shader.shaders['./chunk/fog.frag'],
          Hilo3d$2.Shader.shaders['./chunk/logDepth.frag']
      ].join('\n'),
      main: ''
  };
  /**
   * 基础材质定义，用于指定一些基础的材质变量。
   * `ShaderMaterial`就在`RawShaderMaterial`基础上用到了这个chuck。
   *
   * @noInheritDoc
   */
  var BasicDefinitionChunk = /** @class */ (function (_super) {
      __extends(BasicDefinitionChunk, _super);
      function BasicDefinitionChunk() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      BasicDefinitionChunk.prototype.onInit = function () {
          this.attributes = attributes;
          this.uniforms = uniforms;
          this.defines = defines;
          this.vs = vs;
          this.fs = fs;
      };
      return BasicDefinitionChunk;
  }(ShaderChunk));

  /**
   * 判断一个实例是否为`ShaderMaterial`。
   */
  function isShaderMaterial(value) {
      return value.isShaderMaterial;
  }
  /**
   * 自定义材质类，在`RawShaderMaterial`基础上增加了基本的`attributes`和`uniforms`定义。
   * 基础的定义请见[BasicDefinitionChunk](../basicdefinitionchunk)
   *
   * @noInheritDoc
   */
  var ShaderMaterial = /** @class */ (function (_super) {
      __extends(ShaderMaterial, _super);
      function ShaderMaterial(options) {
          var _this = _super.call(this) || this;
          _this.isShaderMaterial = true;
          options.chunks = options.chunks || [];
          options.chunks.splice(0, 0, new BasicDefinitionChunk('basicDefinition'));
          _this.init(options);
          return _this;
      }
      ShaderMaterial = __decorate([
          SMaterial({ className: 'ShaderMaterial' })
      ], ShaderMaterial);
      return ShaderMaterial;
  }(RawShaderMaterial));

  /**
   * @hidden
   */
  var requiredAttributes = [
      'a_position',
      'a_normal',
      'a_texcoord0'
  ];
  /**
   * @hidden
   */
  var requiredUniforms = [
      'u_normalMatrix',
      'u_viewVector'
  ];
  /**
   * @hidden
   */
  var uniforms$1 = {
      u_fresnelC: { value: 1 },
      u_fresnelP: { value: 1 },
      u_fresnelColor: { value: new Color(1, 1, 1, 1) }
  };
  /**
   * @hidden
   */
  var vs$1 = {
      header: "\nuniform vec3 u_viewVector;\nuniform float u_fresnelC;\nuniform float u_fresnelP;\n\nvarying vec2 v_fresnelUv;\nvarying float v_fresnelIntensity;\n",
      main: "\nvoid fresnelEffect() {\nvec3 v_normal = normalize(u_normalMatrix * a_normal);\nvec3 v_view = normalize(u_normalMatrix * u_viewVector);\n\nv_fresnelIntensity = pow(u_fresnelC - dot(v_normal, v_view), u_fresnelP);\nv_fresnelUv = a_texcoord0;\n}  \n"
  };
  /**
   * @hidden
   */
  var fs$1 = {
      header: "\nuniform vec4 u_fresnelColor;\n\nvarying float v_fresnelIntensity;\nvarying vec2 v_fresnelUv;\n",
      main: "\nvec4 fresnelEffect() {\nvec4 glow = u_fresnelColor * v_fresnelIntensity;\n\nreturn glow;\n}  \n"
  };
  /**
   * 菲涅尔效应chuck。
   *
   * @noInheritDoc
   */
  var FresnelEffectChuck = /** @class */ (function (_super) {
      __extends(FresnelEffectChuck, _super);
      function FresnelEffectChuck() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.vsEntryName = 'fresnelEffect';
          _this.fsEntryName = 'fresnelEffect';
          _this.hasVsOut = false;
          _this.hasFsOut = true;
          return _this;
      }
      FresnelEffectChuck.prototype.onInit = function () {
          this.requiredAttributes = requiredAttributes;
          this.requiredUniforms = requiredUniforms;
          this.uniforms = uniforms$1;
          this.vs = vs$1;
          this.fs = fs$1;
      };
      return FresnelEffectChuck;
  }(ShaderChunk));

  /**
   * 混合多个chuck的chuck，可以作为一个材质最终的输出。
   *
   * @noInheritDoc
   */
  var MixChunksChunk = /** @class */ (function (_super) {
      __extends(MixChunksChunk, _super);
      function MixChunksChunk() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.hasVsOut = true;
          _this.hasFsOut = true;
          return _this;
      }
      MixChunksChunk.prototype.onInit = function (name, options) {
          var chunks = options.chunks, _a = options.vsWeights, vsWeights = _a === void 0 ? {} : _a, _b = options.fsWeights, fsWeights = _b === void 0 ? {} : _b;
          var vsRes = [];
          var fsRes = [];
          if (name) {
              this.vsEntryName = this.fsEntryName = name;
          }
          else {
              this.vsEntryName = this.fsEntryName = 'mixChunks';
          }
          this.vs.main = this.fs.main = "vec4 " + this.vsEntryName + "() {\n";
          var length = options.chunks.length;
          for (var index = 0; index < length; index += 1) {
              var chuck = chunks[index];
              if (chuck.vsEntryName) {
                  if (chuck.hasVsOut) {
                      var weight = vsWeights[chuck.name] || 0;
                      var weightName = "u_" + chuck.vsEntryName + "VsWeight";
                      var resName = chuck.vsEntryName + "Res";
                      vsRes.push(resName);
                      this.vs.main += "vec4 " + resName + " = " + chuck.vsEntryName + "() * " + weightName + ";\n";
                      this.uniforms[weightName] = { value: weight };
                      this.vs.header += "uniform float " + weightName + ";\n";
                  }
                  else {
                      this.vs.main += chuck.vsEntryName + "();\n";
                  }
              }
              if (chuck.fsEntryName) {
                  if (chuck.hasFsOut) {
                      var weight = fsWeights[chuck.name] || 0;
                      var weightName = "u_" + chuck.fsEntryName + "FsWeight";
                      var resName = chuck.fsEntryName + "Res";
                      fsRes.push(resName);
                      this.fs.main += "vec4 " + resName + " = " + chuck.fsEntryName + "() * " + weightName + ";\n";
                      this.uniforms[weightName] = { value: weight };
                      this.fs.header += "uniform float " + weightName + ";\n";
                  }
                  else {
                      this.fs.main += chuck.fsEntryName + "();\n";
                  }
              }
          }
          this.vs.main += 'return ' + vsRes.join(' + ') + ';\n}';
          this.fs.main += 'return ' + fsRes.join(' + ') + ';\n}';
      };
      return MixChunksChunk;
  }(ShaderChunk));

  /**
   * @File   : index.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 11/21/2018, 11:33:39 AM
   * @Description:
   */
  var shaderChunks = {
      BasicDefinitionChunk: BasicDefinitionChunk,
      FresnelEffectChuck: FresnelEffectChuck,
      MixChunksChunk: MixChunksChunk
  };

  /**
   * @File   : Semantic.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 4/2/2019, 8:24:52 PM
   * @Description:
   */
  var S = Hilo3d$2.semantic;
  S.register = function (semantic, object) {
      if (S[semantic]) {
          throw new Error("Sematic " + semantic + " has already existed !");
      }
      S[semantic] = object;
  };
  S.get = function (semantic) {
      return S[semantic];
  };
  S.unregister = function (semantic) {
      if (S[semantic]) {
          delete S[semantic];
      }
  };
  var Semantic = S;

  /**
   * 判断一个实例是否为`SpriteAnimation`。
   */
  function isSpriteAnimation(value) {
      return value.isSpriteAnimation;
  }
  /**
   * 2D精灵动画类，用于管理2D精灵动画的播放。根据初始化参数的不同，拥有两种模式。
   * 一种是基于帧序列的，指定单元尺寸和空隙以及帧数队列来进行播放。
   * 另一种是基于图集Atlas的，指定帧名队列来进行播放。
   *
   *
   * @noInheritDoc
   */
  var SpriteAnimation = /** @class */ (function (_super) {
      __extends(SpriteAnimation, _super);
      function SpriteAnimation() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isSpriteAnimation = true;
          _this._paused = true;
          _this._delta = 0;
          _this.handleElementEnd = function () {
              _this.handleEnd(_this, _this.actor);
          };
          return _this;
      }
      Object.defineProperty(SpriteAnimation.prototype, "duration", {
          /**
           * 获取当前播放总时长。
           */
          get: function () {
              return this._length * 1000 / (this._fps || this.parent.getGame().fps);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpriteAnimation.prototype, "frameCount", {
          /**
           * 获取当前播放总帧数。
           */
          get: function () {
              return this._length;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpriteAnimation.prototype, "currentFrame", {
          /**
           * 获取当前播放帧。
           */
          get: function () {
              return this._current;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SpriteAnimation.prototype, "currentTime", {
          /**
           * 获取当前播放时间。
           */
          get: function () {
              return this._current * 1000 / (this._fps || this.parent.getGame().fps);
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @hidden
       */
      SpriteAnimation.prototype.onInit = function (initState) {
          var component = this._component = this.actor.findComponentByName(initState.componentName || 'root');
          if (!component.isSpriteComponent) {
              throw new TypeConflictException(component, 'SpriteComponent', this);
          }
          this._fps = initState.fps;
          var atlas = this._atlas = initState.atlas || component.atlas;
          this._texture = atlas.getWholeTexture();
          this._frames = initState.frameNames;
          if (!initState.frameNames) {
              this._frames = Object.keys(atlas.frames);
          }
          this._length = this._frames.length;
      };
      /**
       * @hidden
       */
      SpriteAnimation.prototype.onPlay = function (loopCount) {
          this._current = 0;
          this._delta = 0;
          this._paused = false;
          if (this._component.texture !== this._texture) {
              this._component.texture = this._texture;
          }
      };
      /**
       * @hidden
       */
      SpriteAnimation.prototype.onPause = function () {
          this._paused = true;
      };
      /**
       * @hidden
       */
      SpriteAnimation.prototype.onResume = function () {
          this._paused = false;
          this._delta = 0;
          this._component.texture = this._texture;
      };
      /**
       * @hidden
       */
      SpriteAnimation.prototype.onStop = function () {
          this._current = 0;
          this._paused = true;
      };
      /**
       * @hidden
       */
      SpriteAnimation.prototype.onUpdate = function (delta) {
          if (this._paused) {
              return;
          }
          var fps = this._fps || this.parent.getGame().fps;
          if (this._delta < 1000 / fps) {
              this._delta += delta;
              return;
          }
          else {
              this._delta = 0;
          }
          this._component.setFrame(this._frames[this._current]);
          this._current += 1;
          if (this._current === this._length) {
              this.stop();
              this.handleElementEnd();
          }
      };
      SpriteAnimation = __decorate([
          SClass({ className: 'SpriteAnimation' })
      ], SpriteAnimation);
      return SpriteAnimation;
  }(Animation));

  /**
   * 判断一个实例是否为`TweenAnimation`。
   */
  function isTweenAnimation(value) {
      return value.isTweenAnimation;
  }
  /**
   * 模型动画类，用于存储模型动画。
   * 一般在模型实例化时已经自动生成，不需要自己初始化。
   *
   * @noInheritDoc
   */
  var TweenAnimation = /** @class */ (function (_super) {
      __extends(TweenAnimation, _super);
      function TweenAnimation() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isTweenAnimation = true;
          _this.handleElementPause = function () {
              _this.pause();
          };
          _this.handleElementResume = function () {
              _this.resume();
          };
          _this.handleComplete = function () {
              _this.handleEnd(_this, _this.actor);
          };
          return _this;
      }
      Object.defineProperty(TweenAnimation.prototype, "currentTime", {
          /**
           * 获取当前播放时间。
           */
          get: function () {
              return this._tween.time;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(TweenAnimation.prototype, "duration", {
          /**
           * 获取当前播放总时长。
           */
          get: function () {
              return this._tween.duration;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(TweenAnimation.prototype, "paused", {
          /**
           * 获取当前是否处于暂停状态。
           */
          get: function () {
              return this._tween.paused;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @hidden
       */
      TweenAnimation.prototype.onInit = function (_a) {
          var create = _a.create;
          this._tween = create(this.handleComplete);
          this._tween.stop();
          this.getGame().event.add('GameWillPause', this.handleElementPause);
          this.getGame().event.add('GameDidResume', this.handleElementResume);
      };
      /**
       * @hidden
       */
      TweenAnimation.prototype.onPlay = function (loopCount) {
          this._tween.start();
      };
      /**
       * @hidden
       */
      TweenAnimation.prototype.onPause = function () {
          this._tween.pause();
      };
      /**
       * @hidden
       */
      TweenAnimation.prototype.onResume = function () {
          this._tween.resume();
      };
      /**
       * @hidden
       */
      TweenAnimation.prototype.onStop = function () {
          this._tween.stop();
      };
      /**
       * @hidden
       */
      TweenAnimation.prototype.onDestroy = function () {
          this.stop();
          this.getGame().event.remove('GameWillPause', this.handleElementPause);
          this.getGame().event.remove('GameDidResume', this.handleElementResume);
      };
      TweenAnimation = __decorate([
          SClass({ className: 'TweenAnimation' })
      ], TweenAnimation);
      return TweenAnimation;
  }(Animation));

  /**
   * 判断一个实例是否为`CombineAnimation`。
   */
  function isCombineAnimation(value) {
      return value.isCombineAnimation;
  }
  /**
   * 组合动画类，可以并行播放多个动画，结束以最后一个结束的为准。
   *
   * @noInheritDoc
   */
  var CombineAnimation = /** @class */ (function (_super) {
      __extends(CombineAnimation, _super);
      function CombineAnimation() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isCombineAnimation = true;
          _this._count = 0;
          _this._length = 0;
          _this.handleElementEnd = function () {
              _this._count += 1;
              if (_this._count === _this._length) {
                  _this.handleEnd(_this, _this.actor);
              }
          };
          return _this;
      }
      /**
       * @hidden
       */
      CombineAnimation.prototype.onInit = function (options) {
          this._animations = options.animations;
          this._length = this._animations.length;
          for (var index = 0; index < this._length; index += 1) {
              var animation = this._animations[index];
              animation.handleEnd = this.handleElementEnd;
              animation.animator = this.animator;
              animation.initialize();
          }
      };
      /**
       * @hidden
       */
      CombineAnimation.prototype.onPlay = function (loopCount) {
          this._count = 0;
          for (var index = 0; index < this._length; index += 1) {
              this._animations[index].play(loopCount);
          }
      };
      /**
       * @hidden
       */
      CombineAnimation.prototype.onPause = function () {
          for (var index = 0; index < this._length; index += 1) {
              this._animations[index].pause();
          }
      };
      /**
       * @hidden
       */
      CombineAnimation.prototype.onResume = function () {
          for (var index = 0; index < this._length; index += 1) {
              this._animations[index].resume();
          }
      };
      /**
       * @hidden
       */
      CombineAnimation.prototype.onStop = function () {
          for (var index = 0; index < this._length; index += 1) {
              this._animations[index].stop();
          }
      };
      /**
       * @hidden
       */
      CombineAnimation.prototype.onUpdate = function (delta) {
          for (var index = 0; index < this._length; index += 1) {
              this._animations[index].onUpdate(delta);
          }
      };
      /**
       * @hidden
       */
      CombineAnimation.prototype.onDestroy = function () {
          for (var index = 0; index < this._length; index += 1) {
              this._animations[index].destroy();
          }
      };
      CombineAnimation = __decorate([
          SClass({ className: 'CombineAnimation' })
      ], CombineAnimation);
      return CombineAnimation;
  }(Animation));

  /**
   * @hidden
   */
  function bfs(parent, func) {
      var children = parent.findComponentsByClass(ChildActorComponent);
      var length = children.length;
      var tmp = [];
      for (var i = 0; i < length; i += 1) {
          var actor = children[i].actor;
          if (func(actor)) {
              return;
          }
          Array.prototype.push.apply(tmp, actor.findComponentsByClass(ChildActorComponent));
          if (i === length - 1) {
              children = tmp;
              length = children.length;
              i = 0;
              tmp = [];
          }
      }
  }
  /**
   * 迭代`parent`下的所有`actors`。
   *
   * @param func 迭代回调函数，若返回`true`，则立即停止迭代，用于性能优化。
   */
  function iterateActors(parent, func) {
      if (isActor(parent)) {
          bfs(parent, func);
          return;
      }
      parent.actors.forEach(func);
  }
  /**
   * 迭代`parent`下的所有名字为`name`的`actors`。
   *
   * @param func 迭代回调函数，若返回`true`，则立即停止迭代，用于性能优化。
   */
  function iterateActorsByName(parent, name, func) {
      iterateActors(parent, function (actor) {
          if (!actor.name.equalsTo(name)) {
              return false;
          }
          return func(actor);
      });
  }
  /**
   * 迭代`parent`下的所有标签为`tag`的`actors`。
   *
   * @param func 迭代回调函数，若返回`true`，则立即停止迭代，用于性能优化。
   */
  function iterateActorsByTag(parent, tag, func) {
      iterateActors(parent, function (actor) {
          if (!actor.tag.equalsTo(tag)) {
              return false;
          }
          return func(actor);
      });
  }
  /**
   * **暂时没用。**
   * 迭代`parent`下的所有类的类型为`classType`的`actors`。
   *
   * @param func 迭代回调函数，若返回`true`，则立即停止迭代，用于性能优化。
   */
  function iterateActorsByClassType(parent, classType, func) {
      iterateActors(parent, function (actor) {
          if (!actor.classType.equalsTo(classType)) {
              return false;
          }
          return func(actor);
      });
  }
  /**
   * 迭代`parent`下的所有类型为`Class`的`actors`。
   *
   * @param func 迭代回调函数，若返回`true`，则立即停止迭代，用于性能优化。
   */
  function iterateActorsByClass(parent, Class, func) {
      iterateActors(parent, function (actor) {
          if (!actor.className.equalsTo(Class.CLASS_NAME)) {
              return false;
          }
          return func(actor);
      });
  }

  /**
   * 基于cannon.js的物理世界类，完成了CANNON到Sein.js的物理引擎的桥接。
   * **一般情况下你并不需要直接操作这个实例，而是使用刚体和碰撞体组件！**
   * CANNON的工程（魔改过的）请见这里：[https://github.com/dtysky/cannon.js](https://github.com/dtysky/cannon.js)，可以使用`npm i cannon-dtysky`获取。
   * 详细使用请见[Physic](../../guide/physic)。
   *
   * @noInheritDoc
   */
  var CannonPhysicWorld = /** @class */ (function (_super) {
      __extends(CannonPhysicWorld, _super);
      /**
       * 构造器。
       *
       * @param Cannon CANNON模块引用`Cannon`。
       * @param gravity 世界重力。
       * @param iterations 迭代次数。
       */
      function CannonPhysicWorld(Cannon, gravity, iterations) {
          if (gravity === void 0) { gravity = new Vector3(0, -9.81, 0); }
          if (iterations === void 0) { iterations = 10; }
          var _this = _super.call(this, 'SeinCannonPhysicWorld') || this;
          _this.isPhysicWorld = true;
          _this.isCannonPhysicWorld = true;
          _this._fixedTimeStep = 1 / 60;
          _this._physicsMaterials = [];
          if (!Cannon) {
              throw new UnmetRequireException(_this, 'The newest version Cannonjs is required ! Goto "https://github.com/dtysky/cannon.js/tree/master/build" get it !');
          }
          _this.CANNON = Cannon;
          _this._world = new _this.CANNON.World();
          _this._world.broadphase = new _this.CANNON.NaiveBroadphase();
          _this._world.solver.iterations = iterations;
          _this._world.gravity.set(gravity.x, gravity.y, gravity.z);
          _this._ray = new _this.CANNON.Ray();
          _this._rayResult = new _this.CANNON.RaycastResult();
          return _this;
      }
      Object.defineProperty(CannonPhysicWorld.prototype, "timeStep", {
          /**
           * 获取固定步长（秒）。
           */
          get: function () {
              return this._fixedTimeStep;
          },
          /**
           * 设置固定步长（秒）。
           */
          set: function (value) {
              this._fixedTimeStep = value;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CannonPhysicWorld.prototype, "gravity", {
          /**
           * 获取重力。
           */
          get: function () {
              var _a = this._world.gravity, x = _a.x, y = _a.y, z = _a.z;
              return new Vector3(x, y, z);
          },
          /**
           * 设置重力。
           */
          set: function (gravity) {
              this._world.gravity.set(gravity.x, gravity.y, gravity.z);
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 启用高级碰撞事件，这可以让你拥有对碰撞更细致的控制，但会有一些性能损耗。
       */
      CannonPhysicWorld.prototype.initContactEvents = function () {
          this._world.addEventListener('beginContact', function (args) {
              if (!args.bodyA || !args.bodyB) {
                  return;
              }
              if (args.bodyA.component.valid) {
                  args.bodyA.component.handleBodyEnter(args.bodyA.component, args.bodyB.component);
              }
              if (args.bodyB.component.valid) {
                  args.bodyB.component.handleBodyEnter(args.bodyB.component, args.bodyA.component);
              }
          });
          this._world.addEventListener('endContact', function (args) {
              if (!args.bodyA || !args.bodyB) {
                  return;
              }
              if (args.bodyA.component.valid) {
                  args.bodyA.component.handleBodyLeave(args.bodyA.component, args.bodyB.component);
              }
              if (args.bodyB.component.valid) {
                  args.bodyB.component.handleBodyLeave(args.bodyB.component, args.bodyA.component);
              }
          });
          this._world.addEventListener('beginShapeContact', function (args) {
              if (!args.bodyA || !args.bodyB) {
                  return;
              }
              if (args.bodyA.component.valid) {
                  args.bodyA.component.handleColliderEnter(args.bodyA.component, args.bodyB.component, args.shapeA.component, args.shapeB.component);
              }
              if (args.bodyB.component.valid) {
                  args.bodyB.component.handleColliderEnter(args.bodyB.component, args.bodyA.component, args.shapeB.component, args.shapeA.component);
              }
          });
          this._world.addEventListener('endShapeContact', function (args) {
              if (!args.bodyA || !args.bodyB) {
                  return;
              }
              if (args.bodyA.component.valid) {
                  args.bodyA.component.handleColliderLeave(args.bodyA.component, args.bodyB.component, args.shapeA.component, args.shapeB.component);
              }
              if (args.bodyB.component.valid) {
                  args.bodyB.component.handleColliderLeave(args.bodyB.component, args.bodyA.component, args.shapeB.component, args.shapeA.component);
              }
          });
      };
      /**
       * 设置重力。
       */
      CannonPhysicWorld.prototype.setGravity = function (gravity) {
          this._world.gravity.x = gravity.x;
          this._world.gravity.y = gravity.y;
          this._world.gravity.z = gravity.z;
          return this;
      };
      /**
       * **不要自己调用！！**
       *
       * @hidden
       */
      CannonPhysicWorld.prototype.update = function (delta, components) {
          if (delta === void 0) { delta = 0; }
          if (components === void 0) { components = []; }
          this._world.step(this._fixedTimeStep, delta, 3);
      };
      /**
       * 添加脉冲力。
       */
      CannonPhysicWorld.prototype.applyImpulse = function (component, force, contactPoint) {
          var worldPoint = new this.CANNON.Vec3(contactPoint.x, contactPoint.y, contactPoint.z);
          var impulse = new this.CANNON.Vec3(force.x, force.y, force.z);
          component.rigidBody.applyImpulse(impulse, worldPoint);
      };
      /**
       * 添加力。
       */
      CannonPhysicWorld.prototype.applyForce = function (component, force, contactPoint) {
          var worldPoint = new this.CANNON.Vec3(contactPoint.x, contactPoint.y, contactPoint.z);
          var impulse = new this.CANNON.Vec3(force.x, force.y, force.z);
          component.rigidBody.applyForce(impulse, worldPoint);
      };
      /**
       * 拾取操作。
       */
      CannonPhysicWorld.prototype.pick = function (from, to, onPick, origOptions) {
          var _this = this;
          if (origOptions === void 0) { origOptions = {}; }
          var options = __assign({}, origOptions);
          this._ray.from.copy(from);
          this._ray.to.copy(to);
          this._ray.checkCollisionResponse = options.checkCollisionResponse === true ? true : false;
          switch (options.mode) {
              case exports.EPickMode.All:
                  options.mode = this.CANNON.Ray.ALL;
                  break;
              case exports.EPickMode.Any:
                  options.mode = this.CANNON.Ray.ANY;
                  break;
              case exports.EPickMode.Closest:
                  options.mode = this.CANNON.Ray.CLOSEST;
              default:
                  options.mode = this.CANNON.Ray.CLOSEST;
                  break;
          }
          options.skipBackfaces = options.skipBackfaces === false ? false : true;
          options.result = this._rayResult;
          var result = [];
          options.callback = function () {
              var _a = _this._rayResult, body = _a.body, shape = _a.shape, distance = _a.distance, hitPointWorld = _a.hitPointWorld;
              if (!body.component.valid) {
                  return;
              }
              result.push({ rigidBody: body.component, collider: shape.component, actor: body.component.getOwner(), distance: distance, point: new Vector3(hitPointWorld.x, hitPointWorld.y, hitPointWorld.z) });
          };
          if (options.bodies) {
              options.bodies = options.bodies.map(function (body) { return body.rigidBody; });
          }
          var hit = this._ray.intersectWorld(this._world, options);
          if (hit) {
              if (options.mode === exports.EPickMode.CLOSEST) {
                  var _a = this._rayResult, body = _a.body, shape = _a.shape, distance = _a.distance, hitPointWorld = _a.hitPointWorld;
                  result.push({ rigidBody: body.component, collider: shape.component, actor: body.component.getOwner(), distance: distance, point: new Vector3(hitPointWorld.x, hitPointWorld.y, hitPointWorld.z) });
              }
              onPick(result);
          }
          return hit;
      };
      /**
       * 创建一个刚体。
       */
      CannonPhysicWorld.prototype.createRigidBody = function (component, options) {
          var material = this.addMaterial("mat-" + component.uuid, options.friction, options.restitution);
          var bodyCreationObject = {
              mass: options.mass,
              material: material
          };
          for (var key in options.nativeOptions) {
              bodyCreationObject[key] = options.nativeOptions[key];
          }
          var rigidBody = new this.CANNON.Body(bodyCreationObject);
          rigidBody.component = component;
          var _a = component.getCurrentTransform(), position = _a[0], rotation = _a[1], scale = _a[2];
          this.setBodyTransform(rigidBody, position, rotation, scale);
          rigidBody.updateMassProperties();
          rigidBody.updateBoundingRadius();
          if (Debug.devMode) {
              this.checkNest(component);
          }
          this._world.addBody(rigidBody);
          return rigidBody;
      };
      /**
       * 暂时使得刚体失去效应，可以用`enableRigidBody`恢复。
       */
      CannonPhysicWorld.prototype.disableRigidBody = function (component) {
          this._world.remove(component.rigidBody);
      };
      /**
       * 使得一个暂时失去效应的刚体恢复。
       */
      CannonPhysicWorld.prototype.enableRigidBody = function (component) {
          this._world.add(component.rigidBody);
      };
      /**
       * 在开发环境下，检测是否有物理嵌套。
       */
      CannonPhysicWorld.prototype.checkNest = function (component) {
          var actor = component.getOwner();
          var parent = actor.parent;
          while (parent) {
              if (parent.rigidBody) {
                  Debug.warn('You should never have a parent and child "none isTrigger and 0 mass" rigidBody together', actor, parent);
                  break;
              }
              parent = parent.parent;
          }
          bfs(actor, function (child) {
              if (child.rigidBody) {
                  Debug.warn('You should never have a parent and child "none isTrigger and 0 mass" rigidBody together', actor, child);
                  return false;
              }
              return true;
          });
      };
      /**
       * 初始化基本事件。
       */
      CannonPhysicWorld.prototype.initEvents = function (component) {
          this._world.addEventListener('preStep', component.handleBeforeStep);
          this._world.addEventListener('postStep', component.handleAfterStep);
          component.rigidBody.addEventListener('collide', component.handleCollision);
      };
      /**
       * 移除一个刚体。
       */
      CannonPhysicWorld.prototype.removeRigidBody = function (component) {
          this._world.removeEventListener('preStep', component.handleBeforeStep);
          this._world.removeEventListener('postStep', component.handleAfterStep);
          component.rigidBody.removeEventListener('collision', component.handleCollision);
          this._world.remove(component.rigidBody);
      };
      /**
       * 清空物理世界。
       */
      CannonPhysicWorld.prototype.clear = function () {
          this._world._listeners.preStep = [];
          this._world._listeners.postStep = [];
          this._world.bodies = [];
      };
      // public generateJoint(componentJoint: PhysicsImpostorJoint) {
      //   const mainBody = componentJoint.mainImpostor.rigidBody;
      //   const connectedBody = componentJoint.connectedImpostor.rigidBody;
      //   if (!mainBody || !connectedBody) {
      //     return;
      //   }
      //   const constraint: any;
      //   const jointData = componentJoint.joint.jointData;
      //   //TODO - https://github.com/schteppe/this.BJSCANNON.js/blob/gh-pages/demos/collisionFilter.html
      //   const constraintData = {
      //     pivotA: jointData.mainPivot ? new this.BJSCANNON.Vec3().copy(jointData.mainPivot) : null,
      //     pivotB: jointData.connectedPivot ? new this.BJSCANNON.Vec3().copy(jointData.connectedPivot) : null,
      //     axisA: jointData.mainAxis ? new this.BJSCANNON.Vec3().copy(jointData.mainAxis) : null,
      //     axisB: jointData.connectedAxis ? new this.BJSCANNON.Vec3().copy(jointData.connectedAxis) : null,
      //     maxForce: jointData.nativeParams.maxForce,
      //     collideConnected: !!jointData.collision
      //   };
      //   switch (componentJoint.joint.type) {
      //     case PhysicsJoint.HingeJoint:
      //     case PhysicsJoint.Hinge2Joint:
      //       constraint = new this.BJSCANNON.HingeConstraint(mainBody, connectedBody, constraintData);
      //       break;
      //     case PhysicsJoint.DistanceJoint:
      //       constraint = new this.BJSCANNON.DistanceConstraint(mainBody, connectedBody, (<DistanceJointData>jointData).maxDistance || 2);
      //       break;
      //     case PhysicsJoint.SpringJoint:
      //       const springData = <SpringJointData>jointData;
      //       constraint = new this.BJSCANNON.Spring(mainBody, connectedBody, {
      //         restLength: springData.length,
      //         stiffness: springData.stiffness,
      //         damping: springData.damping,
      //         localAnchorA: constraintData.pivotA,
      //         localAnchorB: constraintData.pivotB
      //       });
      //       break;
      //     case PhysicsJoint.LockJoint:
      //       constraint = new this.BJSCANNON.LockConstraint(mainBody, connectedBody, constraintData);
      //       break;
      //     case PhysicsJoint.PointToPointJoint:
      //     case PhysicsJoint.BallAndSocketJoint:
      //     default:
      //       constraint = new this.BJSCANNON.PointToPointConstraint(mainBody, constraintData.pivotA, connectedBody, constraintData.pivotA, constraintData.maxForce);
      //       break;
      //   }
      //   //set the collideConnected flag after the creation, since DistanceJoint ignores it.
      //   constraint.collideConnected = !!jointData.collision;
      //   componentJoint.joint.physicsJoint = constraint;
      //   //don't add spring as constraint, as it is not one.
      //   if (componentJoint.joint.type !== PhysicsJoint.SpringJoint) {
      //     this.world.addConstraint(constraint);
      //   } else {
      //     (<SpringJointData>componentJoint.joint.jointData).forceApplicationCallback = (<SpringJointData>componentJoint.joint.jointData).forceApplicationCallback || function () {
      //       constraint.applyForce();
      //     };
      //     componentJoint.mainImpostor.registerAfterPhysicsStep((<SpringJointData>componentJoint.joint.jointData).forceApplicationCallback);
      //   }
      // }
      // public removeJoint(componentJoint: PhysicsImpostorJoint) {
      //   if (componentJoint.joint.type !== PhysicsJoint.SpringJoint) {
      //     this.world.removeConstraint(componentJoint.joint.physicsJoint);
      //   } else {
      //     componentJoint.mainImpostor.unregisterAfterPhysicsStep((<SpringJointData>componentJoint.joint.jointData).forceApplicationCallback);
      //   }
      // }
      CannonPhysicWorld.prototype.addMaterial = function (name, friction, restitution) {
          var index;
          var mat;
          for (index = 0; index < this._physicsMaterials.length; index += 1) {
              mat = this._physicsMaterials[index];
              if (mat.friction === friction && mat.restitution === restitution) {
                  return mat;
              }
          }
          var currentMat = new this.CANNON.Material(name);
          currentMat.friction = friction;
          currentMat.restitution = restitution;
          this._physicsMaterials.push(currentMat);
          return currentMat;
      };
      /**
       * 创建碰撞体。
       */
      CannonPhysicWorld.prototype.createCollider = function (bodyComp, colliderComp, params) {
          var _a, _b;
          var shape;
          switch (params.type) {
              case exports.EColliderType.Sphere:
                  shape = new this.CANNON.Sphere(params.options.radius);
                  break;
              case exports.EColliderType.Cylinder:
                  shape = new this.CANNON.Cylinder(params.options.radiusTop, params.options.radiusBottom, params.options.height, params.options.numSegments);
                  break;
              case exports.EColliderType.Box:
                  shape = new this.CANNON.Box(new this.CANNON.Vec3(params.options.size[0] / 2, params.options.size[1] / 2, params.options.size[2] / 2));
                  break;
              case exports.EColliderType.Plane:
                  Debug.warn('Attention, PlaneCollider might not behave as you expect. Consider using BoxCollider instead');
                  shape = new this.CANNON.Plane();
                  break;
              // case EColliderType.Heightmap:
              //   let oldPosition2 = object.position.clone();
              //   let oldRotation2 = object.rotation && object.rotation.clone();
              //   let oldQuaternion2 = object.rotationQuaternion && object.rotationQuaternion.clone();
              //   object.position.copyFromFloats(0, 0, 0);
              //   object.rotation && object.rotation.copyFromFloats(0, 0, 0);
              //   object.rotationQuaternion && object.rotationQuaternion.copyFrom(component.getParentsRotation());
              //   object.rotationQuaternion && object.parent && object.rotationQuaternion.conjugateInPlace();
              //   object.rotationQuaternion && object.rotationQuaternion.multiplyInPlace(this._minus90X);
              //   shape = this._createHeightmap(object);
              //   object.position.copyFrom(oldPosition2);
              //   oldRotation2 && object.rotation && object.rotation.copyFrom(oldRotation2);
              //   oldQuaternion2 && object.rotationQuaternion && object.rotationQuaternion.copyFrom(oldQuaternion2);
              //   object.computeWorldMatrix(true);
              //   break;
              // case EColliderType.Particle:
              //   shape = new this.CANNON.Particle();
              // break;
              default:
                  break;
          }
          var _c = params.options, offset = _c.offset, quaternion = _c.quaternion, isTrigger = _c.isTrigger;
          var rigidBody = bodyComp.rigidBody;
          offset = offset || [0, 0, 0];
          quaternion = quaternion || [0, 0, 0, 1];
          isTrigger = isTrigger || false;
          rigidBody.addShape(shape, new ((_a = this.CANNON.Vec3).bind.apply(_a, [void 0].concat(offset)))(), new ((_b = this.CANNON.Quaternion).bind.apply(_b, [void 0].concat(quaternion)))());
          shape.collisionResponse = !isTrigger;
          shape.component = colliderComp;
          return shape;
      };
      /**
       * 移除碰撞体。
       */
      CannonPhysicWorld.prototype.removeCollider = function (rigidBodyComp, colliderComp) {
          var rigidBody = rigidBodyComp.rigidBody;
          var collider = colliderComp.collider;
          var index = rigidBody.shapes.indexOf(collider);
          rigidBody.shapes.splice(index, 1);
          rigidBody.shapeOffsets.splice(index, 1);
          rigidBody.shapeOrientations.splice(index, 1);
      };
      // private _createHeightmap(object: IPhysicsEnabledObject, pointDepth?: number) {
      //   const pos = <FloatArray>(object.getVerticesData(VertexBuffer.PositionKind));
      //   let transform = object.computeWorldMatrix(true);
      //   // convert rawVerts to object space
      //   const temp = new Array<number>();
      //   const index: number;
      //   for (index = 0; index < pos.length; index += 3) {
      //     Vector3.TransformCoordinates(Vector3.FromArray(pos, index), transform).toArray(temp, index);
      //   }
      //   pos = temp;
      //   const matrix = new Array<Array<any>>();
      //   //For now pointDepth will not be used and will be automatically calculated.
      //   //Future reference - try and find the best place to add a reference to the pointDepth constiable.
      //   const arraySize = pointDepth || ~~(Math.sqrt(pos.length / 3) - 1);
      //   let boundingInfo = object.getBoundingInfo();
      //   const dim = Math.min(boundingInfo.boundingBox.extendSizeWorld.x, boundingInfo.boundingBox.extendSizeWorld.y);
      //   const minY = boundingInfo.boundingBox.extendSizeWorld.z;
      //   const elementSize = dim * 2 / arraySize;
      //   for (const i = 0; i < pos.length; i = i + 3) {
      //     const x = Math.round((pos[i + 0]) / elementSize + arraySize / 2);
      //     const z = Math.round(((pos[i + 1]) / elementSize - arraySize / 2) * -1);
      //     const y = -pos[i + 2] + minY;
      //     if (!matrix[x]) {
      //       matrix[x] = [];
      //     }
      //     if (!matrix[x][z]) {
      //       matrix[x][z] = y;
      //     }
      //     matrix[x][z] = Math.max(y, matrix[x][z]);
      //   }
      //   for (const x = 0; x <= arraySize; ++x) {
      //     if (!matrix[x]) {
      //       const loc = 1;
      //       while (!matrix[(x + loc) % arraySize]) {
      //         loc++;
      //       }
      //       matrix[x] = matrix[(x + loc) % arraySize].slice();
      //       //console.log("missing x", x);
      //     }
      //     for (const z = 0; z <= arraySize; ++z) {
      //       if (!matrix[x][z]) {
      //         const loc = 1;
      //         const newValue;
      //         while (newValue === undefined) {
      //           newValue = matrix[x][(z + loc++) % arraySize];
      //         }
      //         matrix[x][z] = newValue;
      //       }
      //     }
      //   }
      //   const shape = new this.BJSCANNON.Heightfield(matrix, {
      //     elementSize: elementSize
      //   });
      //   //For future reference, needed for body transformation
      //   shape.minY = minY;
      //   return shape;
      // }
      /**
       * 设置某个刚体的父级Actor的`transform`。
       */
      CannonPhysicWorld.prototype.setRootTransform = function (component) {
          var transform = component.getOwner().transform;
          var _a = component.rigidBody, position = _a.position, quaternion = _a.quaternion;
          transform.setPosition(position.x, position.y, position.z);
          transform.setQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      };
      /**
       * 设置某个刚体的`transform`。
       */
      CannonPhysicWorld.prototype.setRigidBodyTransform = function (component, newPosition, newRotation, 
      // only for sphere, box, cylinder
      newScale) {
          this.setBodyTransform(component.rigidBody, newPosition, newRotation, newScale);
      };
      CannonPhysicWorld.prototype.setBodyTransform = function (body, newPosition, newRotation, newScale) {
          var _this = this;
          if (newPosition) {
              body.position.copy(newPosition);
          }
          if (newRotation) {
              body.quaternion.copy(newRotation);
          }
          if (newScale && body.shapes) {
              body.shapes.forEach(function (collider, index) {
                  _this.setColliderScale(collider.component, body.component, newScale, index);
              });
          }
      };
      CannonPhysicWorld.prototype.setColliderTransform = function (component, 
      // note: position and rotation not working in current time
      newPosition, newRotation, 
      // only for sphere, box, capsule
      newScale) {
          if (!component) {
              return;
          }
          var collider = component.collider;
          var rigidBody = component.getOwner().rigidBody;
          var index = rigidBody.rigidBody.shapes.indexOf(collider);
          if (newScale) {
              this.setColliderScale(component, rigidBody, newScale, index);
          }
          // if want to change qrientation, change the shapeOrientations and rigidBody.updateBoundingRadius
          rigidBody.needUpdateCollider = true;
      };
      CannonPhysicWorld.prototype.setColliderScale = function (component, rigidBodyComp, newScale, index) {
          var collider = component.collider;
          var options = component.initState;
          // todo: better scale for multiple collider
          switch (component.type) {
              case exports.EColliderType.Box:
                  collider.halfExtents.set(options.size[0] / 2 * newScale.x, options.size[1] / 2 * newScale.y, options.size[2] / 2 * newScale.z);
                  break;
              case exports.EColliderType.Sphere:
                  collider.radius = options.radius * newScale.x;
                  break;
              default:
                  break;
          }
          if (component.type !== exports.EColliderType.Sphere) {
              collider.updateConvexPolyhedronRepresentation();
          }
          var offset = options.offset;
          if (offset[0] !== 0 || offset[1] !== 0 || offset[2] !== 0) {
              var off = rigidBodyComp.rigidBody.shapeOffsets[index];
              off.x = offset[0] * newScale.x;
              off.y = offset[1] * newScale.y;
              off.z = -offset[2] * newScale.z;
          }
      };
      /**
       * 强制更新包围盒。
       */
      CannonPhysicWorld.prototype.updateBounding = function (component) {
          component.rigidBody.updateMassProperties();
          component.rigidBody.updateBoundingRadius();
      };
      /**
       * 设置线速度。
       */
      CannonPhysicWorld.prototype.setLinearVelocity = function (component, velocity) {
          component.rigidBody.velocity.copy(velocity);
      };
      /**
       * 设置角速度。
       */
      CannonPhysicWorld.prototype.setAngularVelocity = function (component, velocity) {
          component.rigidBody.angularVelocity.copy(velocity);
      };
      /**
       * 获取线速度。
       */
      CannonPhysicWorld.prototype.getLinearVelocity = function (component) {
          var v = component.rigidBody.velocity;
          if (!v) {
              return null;
          }
          return new Vector3(v.x, v.y, v.z);
      };
      /**
       * 获取角速度。
       */
      CannonPhysicWorld.prototype.getAngularVelocity = function (component) {
          var v = component.rigidBody.angularVelocity;
          if (!v) {
              return null;
          }
          return new Vector3(v.x, v.y, v.z);
      };
      /**
       * 设置重力。
       */
      CannonPhysicWorld.prototype.setBodyMass = function (component, mass) {
          component.rigidBody.mass = mass;
          if (!component.physicStatic && mass > 0) {
              this.setBodyType(component, exports.ERigidBodyType.Dynamic);
          }
          component.rigidBody.updateMassProperties();
      };
      /**
       * 获取重力。
       */
      CannonPhysicWorld.prototype.getBodyMass = function (component) {
          return component.rigidBody.mass;
      };
      /**
       * 设置filterGroup，一个32bits的整数，用于给刚体分组。
       */
      CannonPhysicWorld.prototype.setFilterGroup = function (component, group) {
          component.rigidBody.collisionFilterGroup = group;
      };
      /**
       * 获取filterGroup。
       */
      CannonPhysicWorld.prototype.getFilterGroup = function (component) {
          return component.rigidBody.collisionFilterGroup;
      };
      /**
       * 设置filterMask，一个32bits的整数，用于给分组后的刚体设置碰撞对象范围。
       */
      CannonPhysicWorld.prototype.setFilterMask = function (component, mask) {
          component.rigidBody.collisionFilterMask = mask;
      };
      /**
       * 获取filterMask。
       */
      CannonPhysicWorld.prototype.getFilterMask = function (component) {
          return component.rigidBody.collisionFilterMask;
      };
      /**
       * 设置刚体摩擦力。
       */
      CannonPhysicWorld.prototype.getBodyFriction = function (component) {
          return component.rigidBody.material.friction;
      };
      /**
       * 获取刚体摩擦力。
       */
      CannonPhysicWorld.prototype.setBodyFriction = function (component, friction) {
          component.rigidBody.material.friction = friction;
      };
      /**
       * 获取刚体弹性系数。
       */
      CannonPhysicWorld.prototype.getBodyRestitution = function (component) {
          return component.rigidBody.material.restitution;
      };
      /**
       * 设置刚体弹性系数。
       */
      CannonPhysicWorld.prototype.setBodyRestitution = function (component, restitution) {
          component.rigidBody.material.restitution = restitution;
      };
      /**
       * 使刚体进入睡眠状态，不会触发任何碰撞事件，但可以正确响应拾取操作。
       */
      CannonPhysicWorld.prototype.sleepBody = function (component) {
          component.rigidBody.sleep();
      };
      /**
       * 唤醒刚体。
       */
      CannonPhysicWorld.prototype.wakeUpBody = function (component) {
          component.rigidBody.wakeUp();
      };
      /**
       * 设置刚体类型。
       */
      CannonPhysicWorld.prototype.setBodyType = function (component, type) {
          component.rigidBody.type = type;
      };
      /**
       * 设置碰撞体为触发器。
       */
      CannonPhysicWorld.prototype.setColliderIsTrigger = function (component, isTrigger) {
          component.collider.collisionResponse = !isTrigger;
          component.collider.updateMassProperties();
      };
      /**
       * 获取碰撞体是否为触发器。
       */
      CannonPhysicWorld.prototype.getColliderIsTrigger = function (component) {
          return !component.collider.collisionResponse;
      };
      CannonPhysicWorld = __decorate([
          SClass({ className: 'CannonPhysicWorld', classType: 'PhysicWorld' })
      ], CannonPhysicWorld);
      return CannonPhysicWorld;
  }(SObject));

  /**
   * 判断一个实例是否为`CylinderColliderComponent`。
   */
  function isCylinderColliderComponent(value) {
      return value.isCylinderColliderComponent;
  }
  /**
   * 圆柱碰撞体，不太常用。
   *
   * @noInheritDoc
   */
  var CylinderColliderComponent = /** @class */ (function (_super) {
      __extends(CylinderColliderComponent, _super);
      function CylinderColliderComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isCylinderColliderComponent = true;
          _this._type = exports.EColliderType.Cylinder;
          return _this;
      }
      CylinderColliderComponent.prototype.getDefaultOptions = function () {
          return null;
      };
      CylinderColliderComponent = __decorate([
          SClass({ className: 'CylinderColliderComponent', classType: 'Collider' })
      ], CylinderColliderComponent);
      return CylinderColliderComponent;
  }(ColliderComponent));

  /**
   * 判断一个实例是否为`PlaneColliderComponent`。
   */
  function isPlaneColliderComponent(value) {
      return value.isPlaneColliderComponent;
  }
  /**
   * 平面碰撞体，不建议使用。
   *
   * @noInheritDoc
   */
  var PlaneColliderComponent = /** @class */ (function (_super) {
      __extends(PlaneColliderComponent, _super);
      function PlaneColliderComponent() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.isPlaneColliderComponent = true;
          _this._type = exports.EColliderType.Plane;
          return _this;
      }
      PlaneColliderComponent.prototype.getDefaultOptions = function () {
          return null;
      };
      PlaneColliderComponent = __decorate([
          SClass({ className: 'PlaneColliderComponent', classType: 'Collider' })
      ], PlaneColliderComponent);
      return PlaneColliderComponent;
  }(ColliderComponent));

  /**
   * 判断一个实例是否为`PhysicPicker`。
   */
  function isPhysicPicker(value) {
      return value.isPhysicPicker;
  }
  /**
   * 物理拾取器，用于拾取已经挂载了刚体和碰撞体的Actor。
   *
   * @noInheritDoc
   */
  var PhysicPicker = /** @class */ (function (_super) {
      __extends(PhysicPicker, _super);
      function PhysicPicker(game) {
          var _this = _super.call(this) || this;
          _this.isPhysicPicker = true;
          _this._active = false;
          _this._tmpTo = new Vector3();
          _this._tmpFrom = new Vector3();
          _this.handleMouse = function (event) {
              var _a = _this._game.bound, left = _a.left, top = _a.top;
              _this._tmpX = event.clientX - left;
              _this._tmpY = event.clientY - top;
              _this.pick(_this._tmpX, _this._tmpY);
          };
          _this.handleTouch = function (event) {
              var touch = event.changedTouches[0];
              if (!touch) {
                  return;
              }
              var _a = _this._game.bound, left = _a.left, top = _a.top;
              _this._tmpX = touch.clientX - left;
              _this._tmpY = touch.clientY - top;
              _this.pick(_this._tmpX, _this._tmpY);
          };
          _this.onPick = function (results) {
              if (_this._options.filter) {
                  results = _this._options.filter(results);
              }
              results.forEach(function (result) {
                  result.rigidBody.handlePick(result);
              });
          };
          _this._game = game;
          return _this;
      }
      Object.defineProperty(PhysicPicker.prototype, "options", {
          /**
           * 获取当前配置，你可以随时修改它。
           */
          get: function () {
              return this._options;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * 开启拾取功能，你可以通过选项来设定不同模式。
       */
      PhysicPicker.prototype.enablePicking = function (options) {
          if (!this._game.world.physicWorld) {
              throw new UnmetRequireException(this, 'Physic world is required for enable physic picking !');
          }
          if (this._active) {
              return;
          }
          this._options = options || {};
          this._options.type = this._options.type || 'down';
          this._active = true;
          if (this._options.type === 'up') {
              this._game.hid.add('MouseUp', this.handleMouse);
              this._game.hid.add('TouchEnd', this.handleTouch);
          }
          else if (this._options.type === 'down') {
              this._game.hid.add('MouseDown', this.handleMouse);
              this._game.hid.add('TouchStart', this.handleTouch);
          }
      };
      /**
       * 关闭拾取功能。
       */
      PhysicPicker.prototype.disablePicking = function () {
          if (!this._game.world.physicWorld) {
              throw new UnmetRequireException(this, 'Physic world is required for enable physic picking !');
          }
          if (this._options.type === 'up') {
              this._game.hid.remove('MouseUp', this.handleMouse);
              this._game.hid.remove('TouchEnd', this.handleTouch);
          }
          else if (this._options.type === 'down') {
              this._game.hid.remove('MouseDown', this.handleMouse);
              this._game.hid.remove('TouchStart', this.handleTouch);
          }
      };
      /**
       * 通过屏幕空间的`x`和`y`触发一次拾取。
       * 这通常用于开发者想自定义拾取模式的时候，即`options.type === 'custom'`。
       */
      PhysicPicker.prototype.pick = function (x, y) {
          var _a = this._game, screenWidth = _a.screenWidth, screenHeight = _a.screenHeight;
          var physicWorld = this._game.world.physicWorld;
          var camera = this._game.world.mainCamera;
          if (!camera) {
              Debug.warn('Can not pick, world has no camera now !');
              return;
          }
          camera.generateRay(x, y, screenWidth, screenHeight, this._tmpFrom, this._tmpTo, this._options.rayLength);
          physicWorld.pick(this._tmpFrom, this._tmpTo, this.onPick, this._options);
      };
      PhysicPicker = __decorate([
          SClass({ className: 'PhysicPicker' })
      ], PhysicPicker);
      return PhysicPicker;
  }(SObject));

  /**
   * 通过筛选函数`filter`查找`parent`下的首个`actor`。
   *
   * @param filter 筛选函数，若返回`true`。
   */
  function findActorByFilter(parent, filter) {
      var result = null;
      iterateActors(parent, function (actor) {
          if (filter(actor)) {
              result = actor;
              return true;
          }
          return false;
      });
      return result;
  }
  /**
   * 通过删选函数`filter`查找`parent`下的所有`actor`。
   *
   * @param filter 筛选函数。
   * @param stopFinding 停止测试函数，若返回`true`，则立即查找，用于性能优化。
   */
  function findActorsByFilter(parent, filter, stopFinding) {
      var result = [];
      iterateActors(parent, function (actor) {
          if (filter(actor)) {
              result.push(actor);
          }
          if (stopFinding && stopFinding(actor, result)) {
              return true;
          }
      });
      return result;
  }
  /**
   * 通过名字`name`查找`parent`下的首个`actor`。
   */
  function findActorByName(parent, name) {
      return findActorByFilter(parent, function (actor) { return actor.name.equalsTo(name); });
  }
  /**
   * 通过名字路径`namePath`查找`parent`下的首个`actor`。
   */
  function findActorByNamePath(parent, namePath) {
      var length = namePath.length;
      if (isGame(parent) || isWorld(parent)) {
          parent = parent.actors.findByName(namePath[0]);
      }
      if (!parent) {
          return null;
      }
      if (length === 1) {
          return parent;
      }
      namePath.splice(0, 1);
      length -= 1;
      if (length === 0) {
          return null;
      }
      var current = parent;
      var name;
      for (var index = 0; index < length; index += 1) {
          name = namePath[index];
          bfs(current, function (actor) {
              if (actor.name.equalsTo(name)) {
                  current = actor;
                  return true;
              }
              current = null;
              return false;
          });
          if (!current) {
              return null;
          }
      }
      if (current === parent) {
          return null;
      }
      return current;
  }
  /**
   * 通过名称`name`查找`parent`下的所有`actor`。
   *
   * @param stopFinding 停止测试函数，若返回`true`，则立即查找，用于性能优化。
   */
  function findActorsByName(parent, name, stopFinding) {
      return findActorsByFilter(parent, function (actor) { return actor.name.equalsTo(name); }, stopFinding);
  }
  /**
   * 通过标签`tag`查找`parent`下的首个`actor`。
   */
  function findActorByTag(parent, tag) {
      return findActorByFilter(parent, function (actor) { return actor.tag.equalsTo(tag); });
  }
  /**
   * 通过标签`tag`查找`parent`下的所有`actor`。
   *
   * @param stopFinding 停止测试函数，若返回`true`，则立即查找，用于性能优化。
   */
  function findActorsByTag(parent, tag, stopFinding) {
      return findActorsByFilter(parent, function (actor) { return actor.tag.equalsTo(tag); }, stopFinding);
  }
  /**
   * 通过位移ID`uuid`查找`parent`下的首个`actor`。
   */
  function findActorByUUID(parent, uuid) {
      return findActorByFilter(parent, function (actor) { return actor.uuid === uuid; });
  }
  /**
   * 通过类的类型`className`查找`parent`下的首个`actor`。
   */
  function findActorByClassName(parent, className) {
      return findActorByFilter(parent, function (actor) { return actor.className.equalsTo(className); });
  }
  /**
   * 通过类的类型`className`查找`parent`下的所有`actor`。
   *
   * @param stopFinding 停止测试函数，若返回`true`，则立即查找，用于性能优化。
   */
  function findActorsByClassName(parent, className, stopFinding) {
      return findActorsByFilter(parent, function (actor) { return actor.className.equalsTo(className); }, stopFinding);
  }
  /**
   * 通过类型`Class`查找`parent`下的首个`actor`。
   */
  function findActorByClass(parent, Class) {
      return findActorByFilter(parent, function (actor) { return actor.className.equalsTo(Class.CLASS_NAME); });
  }
  /**
   * 通过类型`Class`查找`parent`下的所有`actor`。
   *
   * @param stopFinding 停止测试函数，若返回`true`，则立即查找，用于性能优化。
   */
  function findActorsByClass(parent, Class, stopFinding) {
      return findActorsByFilter(parent, function (actor) { return actor.className.equalsTo(Class.CLASS_NAME); }, stopFinding);
  }

  /**
   * @File   : index.ts
   * @Author : dtysky (dtysky@outlook.com)
   * @Date   : 2018-7-28 13:54:12
   * @Description:
   */
  var version = '1.3.18';
  var author = 'Tianyu Dai <dtysky@outlook.com>';
  /* tslint:disable-line */
  console.log("Sein.js verison: " + version);
  if (typeof window !== 'undefined' && !window['Sein']) {
      window['Sein'] = module.exports;
  }

  exports.version = version;
  exports.author = author;
  exports.SName = SName;
  exports.SObject = SObject;
  exports.isSObject = isSObject;
  exports.Actor = Actor;
  exports.isActor = isActor;
  exports.Component = Component;
  exports.isComponent = isComponent;
  exports.ChildActorComponent = ChildActorComponent;
  exports.Engine = Engine;
  exports.isEngine = isEngine;
  exports.Game = Game;
  exports.isGame = isGame;
  exports.World = World;
  exports.isWorld = isWorld;
  exports.Level = Level;
  exports.isLevel = isLevel;
  exports.Ticker = Ticker;
  exports.isTicker = isTicker;
  exports.Tween = Tween;
  exports.Observable = Observable;
  exports.isObservable = isObservable;
  exports.Constants = Constants;
  exports.InfoActor = InfoActor;
  exports.isInfoActor = isInfoActor;
  exports.GameModeActor = GameModeActor;
  exports.isGameModeActor = isGameModeActor;
  exports.LevelScriptActor = LevelScriptActor;
  exports.isLevelScriptActor = isLevelScriptActor;
  exports.SystemActor = SystemActor;
  exports.isSystemActor = isSystemActor;
  exports.StateActor = StateActor;
  exports.isStateActor = isStateActor;
  exports.TimerActor = TimerActor;
  exports.isTimerActor = isTimerActor;
  exports.SIterable = SIterable;
  exports.SArray = SArray;
  exports.SMap = SMap;
  exports.SSet = SSet;
  exports.BaseException = BaseException;
  exports.isBaseException = isBaseException;
  exports.BreakGuardException = BreakGuardException;
  exports.isBreakGuardException = isBreakGuardException;
  exports.MemberConflictException = MemberConflictException;
  exports.isMemberConflictException = isMemberConflictException;
  exports.MissingMemberException = MissingMemberException;
  exports.isMissingMemberException = isMissingMemberException;
  exports.TypeConflictException = TypeConflictException;
  exports.isTypeConflictException = isTypeConflictException;
  exports.UnmetRequireException = UnmetRequireException;
  exports.isUnmetRequireException = isUnmetRequireException;
  exports.ResourceLoadException = ResourceLoadException;
  exports.isResourceLoadException = isResourceLoadException;
  exports.throwException = throwException;
  exports.Player = Player;
  exports.isPlayer = isPlayer;
  exports.ControllerActor = ControllerActor;
  exports.isControllerActor = isControllerActor;
  exports.PlayerControllerActor = PlayerControllerActor;
  exports.isPlayerControllerActor = isPlayerControllerActor;
  exports.PlayerStateActor = PlayerStateActor;
  exports.isPlayerStateActor = isPlayerStateActor;
  exports.AIControllerActor = AIControllerActor;
  exports.isAIControllerActor = isAIControllerActor;
  exports.FSMComponent = FSMComponent;
  exports.isFSMComponent = isFSMComponent;
  exports.FSMState = FSMState;
  exports.isFSMState = isFSMState;
  exports.SceneComponent = SceneComponent;
  exports.isSceneComponent = isSceneComponent;
  exports.SceneActor = SceneActor;
  exports.isSceneActor = isSceneActor$1;
  exports.PrimitiveComponent = PrimitiveComponent;
  exports.isPrimitiveComponent = isPrimitiveComponent;
  exports.isPrimitiveActor = isPrimitiveActor;
  exports.StaticMeshComponent = StaticMeshComponent;
  exports.isStaticMeshActor = isStaticMeshActor;
  exports.isStaticMeshComponent = isStaticMeshComponent;
  exports.StaticMeshActor = StaticMeshActor;
  exports.SkeletalMeshComponent = SkeletalMeshComponent;
  exports.isSkeletalMeshActor = isSkeletalMeshActor;
  exports.isSkeletalMeshComponent = isSkeletalMeshComponent;
  exports.SkeletalMeshActor = SkeletalMeshActor;
  exports.SpriteComponent = SpriteComponent;
  exports.isSpriteActor = isSpriteActor;
  exports.isSpriteComponent = isSpriteComponent;
  exports.SpriteActor = SpriteActor;
  exports.Layers = Layers;
  exports.Fog = Fog;
  exports.FrameBuffer = FrameBuffer;
  exports.isFrameBuffer = isFrameBuffer;
  exports.RenderSystemActor = RenderSystemActor;
  exports.isRenderSystemActor = isRenderSystemActor;
  exports.VertexArrayObject = VertexArrayObject;
  exports.Program = Program;
  exports.Shader = Shader;
  exports.GLCapabilities = GLCapabilities;
  exports.GLExtensions = GLExtensions;
  exports.Buffer = Buffer;
  exports.BSPComponent = BSPComponent;
  exports.isBSPActor = isBSPActor;
  exports.isBSPComponent = isBSPComponent;
  exports.BSPBoxComponent = BSPBoxComponent;
  exports.isBSPBoxActor = isBSPBoxActor;
  exports.isBSPBoxComponent = isBSPBoxComponent;
  exports.BSPPlaneComponent = BSPPlaneComponent;
  exports.isBSPPlaneActor = isBSPPlaneActor;
  exports.isBSPPlaneComponent = isBSPPlaneComponent;
  exports.BSPSphereComponent = BSPSphereComponent;
  exports.isBSPSphereActor = isBSPSphereActor;
  exports.isBSPSphereComponent = isBSPSphereComponent;
  exports.BSPMorphComponent = BSPMorphComponent;
  exports.isBSPMorphActor = isBSPMorphActor;
  exports.isBSPMorphComponent = isBSPMorphComponent;
  exports.BSPCylinderComponent = BSPCylinderComponent;
  exports.isBSPCylinderActor = isBSPCylinderActor;
  exports.isBSPCylinderComponent = isBSPCylinderComponent;
  exports.BSPBoxActor = BSPBoxActor;
  exports.BSPCylinderActor = BSPCylinderActor;
  exports.BSPMorphActor = BSPMorphActor;
  exports.BSPPlaneActor = BSPPlaneActor;
  exports.BSPSphereActor = BSPSphereActor;
  exports.Texture = Texture;
  exports.isTexture = isTexture;
  exports.CubeTexture = CubeTexture;
  exports.isCubeTexture = isCubeTexture;
  exports.LazyTexture = LazyTexture;
  exports.isLazyTexture = isLazyTexture;
  exports.DataTexture = DataTexture;
  exports.isDataTexture = isDataTexture;
  exports.DynamicTexture = DynamicTexture;
  exports.isDynamicTexture = isDynamicTexture;
  exports.AtlasManager = AtlasManager;
  exports.isAtlasManager = isAtlasManager;
  exports.Material = Material;
  exports.isMaterial = isMaterial;
  exports.BasicMaterial = BasicMaterial;
  exports.isBasicMaterial = isBasicMaterial;
  exports.GeometryMaterial = GeometryMaterial;
  exports.isGeometryMaterial = isGeometryMaterial;
  exports.PBRMaterial = PBRMaterial;
  exports.isPBRMaterial = isPBRMaterial;
  exports.RawShaderMaterial = RawShaderMaterial;
  exports.isRawShaderMaterial = isRawShaderMaterial;
  exports.ShaderMaterial = ShaderMaterial;
  exports.isShaderMaterial = isShaderMaterial;
  exports.ShaderChunk = ShaderChunk;
  exports.isShaderChunk = isShaderChunk;
  exports.shaderChunks = shaderChunks;
  exports.Semantic = Semantic;
  exports.GeometryData = GeometryData;
  exports.Geometry = Geometry;
  exports.isGeometry = isGeometry;
  exports.BoxGeometry = BoxGeometry;
  exports.isBoxGeometry = isBoxGeometry;
  exports.SphereGeometry = SphereGeometry;
  exports.isSphereGeometry = isSphereGeometry;
  exports.PlaneGeometry = PlaneGeometry;
  exports.isPlaneGeometry = isPlaneGeometry;
  exports.CylinderGeometry = CylinderGeometry;
  exports.isCylinderGeometry = isCylinderGeometry;
  exports.MorphGeometry = MorphGeometry;
  exports.isMorphGeometry = isMorphGeometry;
  exports.Mesh = Mesh;
  exports.isMesh = isMesh;
  exports.SkeletalMesh = SkeletalMesh;
  exports.isSkeletalMesh = isSkeletalMesh;
  exports.CameraComponent = CameraComponent;
  exports.isCameraActor = isCameraActor;
  exports.PerspectiveCameraComponent = PerspectiveCameraComponent;
  exports.isPerspectiveCameraActor = isPerspectiveCameraActor;
  exports.isPerspectiveCameraComponent = isPerspectiveCameraComponent;
  exports.PerspectiveCameraActor = PerspectiveCameraActor;
  exports.OrthographicCameraComponent = OrthographicCameraComponent;
  exports.isOrthographicCameraActor = isOrthographicCameraActor;
  exports.isOrthographicCameraComponent = isOrthographicCameraComponent;
  exports.OrthographicCameraActor = OrthographicCameraActor;
  exports.LightComponent = LightComponent;
  exports.isLightComponent = isLightComponent;
  exports.isLightActor = isLightActor;
  exports.AmbientLightComponent = AmbientLightComponent;
  exports.isAmbientLightComponent = isAmbientLightComponent;
  exports.isAmbientLightActor = isAmbientLightActor;
  exports.DirectionalLightComponent = DirectionalLightComponent;
  exports.isDirectionalLightActor = isDirectionalLightActor;
  exports.isDirectionalLightComponent = isDirectionalLightComponent;
  exports.PointLightComponent = PointLightComponent;
  exports.isPointLightActor = isPointLightActor;
  exports.isPointLightComponent = isPointLightComponent;
  exports.SpotLightComponent = SpotLightComponent;
  exports.isSpotLightActor = isSpotLightActor;
  exports.isSpotLightComponent = isSpotLightComponent;
  exports.AmbientLightActor = AmbientLightActor;
  exports.DirectionalLightActor = DirectionalLightActor;
  exports.PointLightActor = PointLightActor;
  exports.SpotLightActor = SpotLightActor;
  exports.AnimatorComponent = AnimatorComponent;
  exports.isAnimatorComponent = isAnimatorComponent;
  exports.Animation = Animation;
  exports.isAnimation = isAnimation;
  exports.ModelAnimation = ModelAnimation;
  exports.isModelAnimation = isModelAnimation;
  exports.SpriteAnimation = SpriteAnimation;
  exports.isSpriteAnimation = isSpriteAnimation;
  exports.TweenAnimation = TweenAnimation;
  exports.isTweenAnimation = isTweenAnimation;
  exports.CombineAnimation = CombineAnimation;
  exports.isCombineAnimation = isCombineAnimation;
  exports.CannonPhysicWorld = CannonPhysicWorld;
  exports.RigidBodyComponent = RigidBodyComponent;
  exports.isRigidBodyComponent = isRigidBodyComponent;
  exports.ColliderComponent = ColliderComponent;
  exports.isColliderComponent = isColliderComponent;
  exports.BoxColliderComponent = BoxColliderComponent;
  exports.isBoxColliderComponent = isBoxColliderComponent;
  exports.CylinderColliderComponent = CylinderColliderComponent;
  exports.isCylinderColliderComponent = isCylinderColliderComponent;
  exports.PlaneColliderComponent = PlaneColliderComponent;
  exports.isPlaneColliderComponent = isPlaneColliderComponent;
  exports.SphereColliderComponent = SphereColliderComponent;
  exports.isSphereColliderComponent = isSphereColliderComponent;
  exports.PhysicPicker = PhysicPicker;
  exports.isPhysicPicker = isPhysicPicker;
  exports.EventManager = EventManager;
  exports.isEventManager = isEventManager;
  exports.EventTrigger = EventTrigger;
  exports.isEventTrigger = isEventTrigger;
  exports.WindowResizeTrigger = WindowResizeTrigger;
  exports.ResourceManager = ResourceManager;
  exports.isResourceManager = isResourceManager;
  exports.ResourceLoader = ResourceLoader;
  exports.isResourceLoader = isResourceLoader;
  exports.GlTFLoader = GlTFLoader;
  exports.isGlTFLoader = isGlTFLoader;
  exports.ImageLoader = ImageLoader;
  exports.isImageLoader = isImageLoader;
  exports.TextureLoader = TextureLoader;
  exports.isTextureLoader = isTextureLoader;
  exports.CubeTextureLoader = CubeTextureLoader;
  exports.isCubeTextureLoader = isCubeTextureLoader;
  exports.AtlasLoader = AtlasLoader;
  exports.isAtlasLoader = isAtlasLoader;
  exports.AliAMCExtension = AliAMCExtension;
  exports.HTTP = HTTP;
  exports.Debug = Debug;
  exports.SClass = SClass;
  exports.SMaterial = SMaterial;
  exports.serialize = serialize;
  exports.deprecated = deprecated;
  exports.MetaSClasses = MetaSClasses;
  exports.MetaSMaterials = MetaSMaterials;
  exports.clamp = clamp;
  exports.DEG2RAD = DEG2RAD;
  exports.degToRad = degToRad;
  exports.isPowerOfTwo = isPowerOfTwo;
  exports.nearestPowerOfTwo = nearestPowerOfTwo;
  exports.nextPowerOfTwo = nextPowerOfTwo;
  exports.RAD2DEG = RAD2DEG;
  exports.radToDeg = radToDeg;
  exports.isVector2 = isVector2;
  exports.isVector3 = isVector3;
  exports.isVector4 = isVector4;
  exports.isMatrix3 = isMatrix3;
  exports.isMatrix4 = isMatrix4;
  exports.isQuaternion = isQuaternion;
  exports.isColor = isColor;
  exports.isEuler = isEuler;
  exports.isSphericalHarmonics3 = isSphericalHarmonics3;
  exports.Vector2 = Vector2;
  exports.Vector3 = Vector3;
  exports.Vector4 = Vector4;
  exports.Matrix3 = Matrix3;
  exports.Matrix4 = Matrix4;
  exports.Quaternion = Quaternion;
  exports.Color = Color;
  exports.Euler = Euler;
  exports.SphericalHarmonics3 = SphericalHarmonics3;
  exports.isSpherical = isSpherical;
  exports.Spherical = Spherical;
  exports.MouseClickTrigger = MouseClickTrigger;
  exports.MouseDownTrigger = MouseDownTrigger;
  exports.MouseUpTrigger = MouseUpTrigger;
  exports.MouseEnterTrigger = MouseEnterTrigger;
  exports.MouseLeaveTrigger = MouseLeaveTrigger;
  exports.MouseMoveTrigger = MouseMoveTrigger;
  exports.MouseOutTrigger = MouseOutTrigger;
  exports.MouseOverTrigger = MouseOverTrigger;
  exports.MouseWheelTrigger = MouseWheelTrigger;
  exports.WheelTrigger = WheelTrigger;
  exports.ContextMenuTrigger = ContextMenuTrigger;
  exports.TouchStartTrigger = TouchStartTrigger;
  exports.TouchEndTrigger = TouchEndTrigger;
  exports.TouchMoveTrigger = TouchMoveTrigger;
  exports.TouchCancelTrigger = TouchCancelTrigger;
  exports.KeyDownTrigger = KeyDownTrigger;
  exports.KeyPressTrigger = KeyPressTrigger;
  exports.KeyUpTrigger = KeyUpTrigger;
  exports.bfs = bfs;
  exports.iterateActors = iterateActors;
  exports.iterateActorsByName = iterateActorsByName;
  exports.iterateActorsByTag = iterateActorsByTag;
  exports.iterateActorsByClassType = iterateActorsByClassType;
  exports.iterateActorsByClass = iterateActorsByClass;
  exports.findActorByFilter = findActorByFilter;
  exports.findActorsByFilter = findActorsByFilter;
  exports.findActorByName = findActorByName;
  exports.findActorByNamePath = findActorByNamePath;
  exports.findActorsByName = findActorsByName;
  exports.findActorByTag = findActorByTag;
  exports.findActorsByTag = findActorsByTag;
  exports.findActorByUUID = findActorByUUID;
  exports.findActorByClassName = findActorByClassName;
  exports.findActorsByClassName = findActorsByClassName;
  exports.findActorByClass = findActorByClass;
  exports.findActorsByClass = findActorsByClass;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../_process@0.11.10@process/browser.js */ "./node_modules/_process@0.11.10@process/browser.js"), __webpack_require__(/*! ./../../_webpack@4.41.2@webpack/buildin/global.js */ "./node_modules/_webpack@4.41.2@webpack/buildin/global.js")))

/***/ })

}]);