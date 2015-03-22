(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SerialiSON = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// We want only what we need to reduce the size of the final output
"use strict";

require("core-js/src/es6.symbol");
require("core-js/src/es6.object.statics");
require("core-js/src/es6.array.statics");
require("core-js/src/es6.collections");
require("regenerator-babel/runtime");

// Export the library
module.exports = require("../lib/serialison");

},{"../lib/serialison":4,"core-js/src/es6.array.statics":21,"core-js/src/es6.collections":22,"core-js/src/es6.object.statics":24,"core-js/src/es6.symbol":25,"regenerator-babel/runtime":26}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require("./utils");

var each = _utils.each;
var isDefined = _utils.isDefined;
var isString = _utils.isString;

var Mapper = exports.Mapper = (function () {
    function Mapper() {
        var options = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Mapper);

        this.options = Object.assign({
            throwErrorsForDuplicateIDs: true,
            throwErrorsForDuplicateUrlTemplates: true
        }, options);

        this.resources = {};
        this.resourcePaths = {};
    }

    _createClass(Mapper, {
        getType: {

            /**
             * Returns the real type of the resources by checking the "type" property in each resource
             */

            value: function getType(resourceType) {
                for (var _len = arguments.length, resources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    resources[_key - 1] = arguments[_key];
                }

                var typesSet = new Set();

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = each(resources)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var resource = _step.value.value;

                        if (resource.type) {
                            typesSet.add(resource.type);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                            _iterator["return"]();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                if (typesSet.size == 1) {
                    resourceType = Array.from(typesSet.values())[0];
                } else if (typesSet.size > 1) {
                    var types = JSON.stringify(Array.from(typesSet.values()));
                    throw new Error("Multiple types found in the provided resources: " + types);
                }

                return resourceType;
            }
        },
        addUrlTemplate: {

            /**
             * Adds an URL template
             */

            value: function addUrlTemplate(resourcePath, urlTemplate) {
                var _this = this;

                if (this.resourcePaths[resourcePath] && this.options.throwErrorsForDuplicateUrlTemplates) {
                    throw new Error("Multiple URL templates with the same path found: \"" + resourcePath + "\"");
                }

                if (isString(urlTemplate.type)) {
                    // We must declare a getter since the resource type isn't necessarily created at the moment.
                    // We don't use a native getter but a function so we can test its existence just above.
                    this.resourcePaths[resourcePath] = function () {
                        return _this.resources[urlTemplate.type];
                    };
                }

                return this;
            }
        },
        addResources: {

            /**
             * Adds multiple resources with the same type to the map
             */

            value: function addResources(resourceKey) {
                for (var _len = arguments.length, resources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    resources[_key - 1] = arguments[_key];
                }

                // If the resource key is undefined, abort the execution.
                if (!resourceKey) {
                    return this;
                }

                // Get the real type of the resources
                var resourceType = this.getType.apply(this, [resourceKey].concat(resources));

                // Add the resource type if it doesn't exist in the map
                var mappedType = this.resources[resourceType] = this.resources[resourceType] || {};

                // Iterate over each resource and add it to the map
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = each(resources)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var resource = _step.value.value;

                        // Ignore the resource if undefined or if it hasn't any ID
                        if (!isDefined(resource) || !isDefined(resource.id)) {
                            continue;
                        }

                        // Add the resource if the ID doesn't already exist
                        if (!isDefined(mappedType[resource.id.toString()])) {
                            mappedType[resource.id.toString()] = resource;
                        } else if (this.options.throwErrorsForDuplicateIDs) {
                            throw new Error("A resource with the same type and ID already exists");
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                            _iterator["return"]();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return this;
            }
        },
        getResource: {

            /**
             * Retrieves a resource from its path, type and ID
             */

            value: function getResource(resourcePath, resourceType, id) {
                var mappedType = (this.resourcePaths[resourcePath] || function () {})() || this.resources[resourceType] || {};

                return mappedType[id.toString()] || null;
            }
        }
    });

    return Mapper;
})();

;

},{"./utils":5}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require("./utils");

var each = _utils.each;
var transform = _utils.transform;
var isString = _utils.isString;

var Resolver = exports.Resolver = (function () {
    function Resolver(mapperInstance) {
        var options = arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Resolver);

        this.options = Object.assign({
            maxNestingDepth: 4,
            stripLinksProperty: true,
            resourceTransformers: []
        }, options);

        this.mapper = mapperInstance;

        this.nestingPath = [];
    }

    _createClass(Resolver, {
        resolve: {

            /**
             * Returns the resource(s) once all the links are resolved
             */

            value: function resolve(resourceKey, resources) {
                if (this.nestingPath.length < this.options.maxNestingDepth) {
                    // If we have a collection of resources, call recursively the resolve() method for each resource.
                    if (Array.isArray(resources)) {
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = each(resources)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var _step$value = _step.value;
                                var resourceIndex = _step$value.key;
                                var resource = _step$value.value;

                                resources[resourceIndex] = this.resolve(resourceKey, resource);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator["return"]) {
                                    _iterator["return"]();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }

                    // Link the relationships of the current resource
                    else if (resources) {
                        this.nestingPath.push(resourceKey);

                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = each(resources.links || {})[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _step2$value = _step2.value;
                                var relationshipKey = _step2$value.key;
                                var relationship = _step2$value.value;

                                var relatedResources = this.link(relationshipKey, relationshipKey, relationship);

                                if (relatedResources != null) {
                                    resources[relationshipKey] = relatedResources;
                                }
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                                    _iterator2["return"]();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        resources = transform(resources, [this.defaultTransformer()].concat(this.options.resourceTransformers));

                        this.nestingPath.pop();
                    }
                }

                return resources;
            }
        },
        link: {

            /**
             * Returns the related resource(s) once they have been resolved
             */

            value: function link(relationshipKey, relationshipType, relationships) {
                // If the relationship contains an array of IDs, call recursively the link method() for each ID.
                if (Array.isArray(relationships)) {
                    return this.linkMultipleIds(relationshipKey, relationshipType, relationships);
                }

                // If the relationship is not a string, assume it's a resource object.
                else if (!isString(relationships)) {
                    // Get the real type of the resource
                    var _relationshipType = relationships.type || relationshipKey;

                    // Only one ID
                    if (relationships.id) {
                        return this.link(relationshipKey, _relationshipType, relationships.id.toString());
                    }

                    // Multiples IDs
                    else if (relationships.ids) {
                        return this.linkMultipleIds(relationshipKey, _relationshipType, relationships);
                    }

                    return null;
                }

                // If the relationship is a string, we can retrieve the resource.
                else {
                    var relationshipPath = this.nestingPath.concat(relationshipKey).join("."),
                        resource = this.mapper.getResource(relationshipPath, relationshipType, relationships);

                    return this.resolve(relationshipKey, resource);
                }
            }
        },
        linkMultipleIds: {

            /**
             * Returns the related collection of resources
             */

            value: function linkMultipleIds(relationshipKey, relationshipType, relationships) {
                var resources = [];

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = each(relationships)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var relationshipID = _step.value.value;

                        var resource = this.link(relationshipKey, relationshipType, relationshipID.toString());

                        if (resource) {
                            resources.push(resource);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                            _iterator["return"]();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return resources.length ? resources : null;
            }
        },
        defaultTransformer: {

            /**
             * Returns the default transformer used to strip the `links` property of each resource
             */

            value: function defaultTransformer() {
                var self = this;

                return function (resource) {
                    if (self.options.stripLinksProperty) {
                        delete resource.links;
                    }

                    return resource;
                };
            }
        }
    });

    return Resolver;
})();

;

},{"./utils":5}],4:[function(require,module,exports){
"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Mapper = require("./mapper").Mapper;

var Resolver = require("./resolver").Resolver;

var _utils = require("./utils");

var each = _utils.each;
var transform = _utils.transform;
var isObject = _utils.isObject;

/**
 * Provides an entry point to configure and run JSON resolving
 */

var SerialiSON = (function () {
    function SerialiSON(mainDocument) {
        var options = arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, SerialiSON);

        this.options = Object.assign({
            topLevelProperties: ["meta", "links", "linked"],
            stripTopLinkingProperties: true,
            mainDocumentTransformers: []
        }, options);

        this.mapper = new Mapper(options);
        this.resolver = new Resolver(this.mapper, options);

        // Save the main document and add it to the internal map
        if (!isObject(mainDocument)) {
            throw new Error("The main document must be a valid object");
        }

        this.mainDocument = mainDocument;
        this.addDocument(mainDocument);
    }

    _createClass(SerialiSON, {
        getPrimaryResourceKey: {

            /**
             * Returns the primary resource key of a document
             */

            value: function getPrimaryResourceKey(document) {
                var _this = this;

                return document.data ? "data" : Object.keys(document).filter(function (key) {
                    return ! ~_this.options.topLevelProperties.indexOf(key);
                })[0];
            }
        },
        addDocument: {

            /**
             * Retrieves all the resources of a document and adds them to the internal map
             */

            value: function addDocument(document) {
                var _mapper;

                if (!isObject(document)) {
                    return this;
                }

                var primaryResourceKey = this.getPrimaryResourceKey(document),
                    primaryResource = document[primaryResourceKey];

                // Map the main resource(s)
                (_mapper = this.mapper).addResources.apply(_mapper, [primaryResourceKey].concat(_toConsumableArray(primaryResource || {})));

                // Map the linked resources
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = each(document.linked || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _mapper2;

                        var _step$value = _step.value;
                        var resourceType = _step$value.key;
                        var resources = _step$value.value;

                        (_mapper2 = this.mapper).addResources.apply(_mapper2, [resourceType].concat(_toConsumableArray(resources)));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                            _iterator["return"]();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                // Map the URL templates
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = each(document.links || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _step2$value = _step2.value;
                        var resourcePath = _step2$value.key;
                        var urlTemplate = _step2$value.value;

                        this.mapper.addUrlTemplate(resourcePath, urlTemplate);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                            _iterator2["return"]();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return this;
            }
        },
        resolve: {

            /**
             * Returns the main document once all the links are resolved
             */

            value: function resolve() {
                var mainDocument = JSON.parse(JSON.stringify(this.mainDocument)),
                    // Create a copy of the document
                primaryResourceKey = this.getPrimaryResourceKey(mainDocument),
                    primaryResource = mainDocument[primaryResourceKey];

                if (primaryResource) {
                    mainDocument[primaryResourceKey] = this.resolver.resolve(primaryResourceKey, primaryResource);
                }

                mainDocument = transform(mainDocument, [this.defaultTransformer()].concat(this.options.mainDocumentTransformers));

                return mainDocument;
            }
        },
        defaultTransformer: {

            /**
             * Returns the default transformer used to strip the top linking properties of the main document
             */

            value: function defaultTransformer() {
                var self = this;

                return function (mainDocument) {
                    if (self.options.stripTopLinkingProperties) {
                        delete mainDocument.links;
                        delete mainDocument.linked;
                    }

                    return mainDocument;
                };
            }
        }
    });

    return SerialiSON;
})();

;

// Export the SerialiSON class for Node/Browserify
if (isObject(module)) {
    module.exports = SerialiSON;
}

},{"./mapper":2,"./resolver":3,"./utils":5}],5:[function(require,module,exports){
"use strict";

var each = regeneratorRuntime.mark( /**
                                     * Returns a generator used to iterate over object or array properties
                                     */
function each(collection) {
    var index, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

    return regeneratorRuntime.wrap(function each$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                if (!Array.isArray(collection)) {
                    context$1$0.next = 10;
                    break;
                }

                index = 0;

            case 2:
                if (!(index < collection.length)) {
                    context$1$0.next = 8;
                    break;
                }

                context$1$0.next = 5;
                return { key: index, value: collection[index] };

            case 5:
                index++;
                context$1$0.next = 2;
                break;

            case 8:
                context$1$0.next = 40;
                break;

            case 10:
                if (!isObject(collection)) {
                    context$1$0.next = 39;
                    break;
                }

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                context$1$0.prev = 14;
                _iterator = Object.keys(collection)[Symbol.iterator]();

            case 16:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    context$1$0.next = 23;
                    break;
                }

                key = _step.value;
                context$1$0.next = 20;
                return { key: key, value: collection[key] };

            case 20:
                _iteratorNormalCompletion = true;
                context$1$0.next = 16;
                break;

            case 23:
                context$1$0.next = 29;
                break;

            case 25:
                context$1$0.prev = 25;
                context$1$0.t0 = context$1$0["catch"](14);
                _didIteratorError = true;
                _iteratorError = context$1$0.t0;

            case 29:
                context$1$0.prev = 29;
                context$1$0.prev = 30;

                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }

            case 32:
                context$1$0.prev = 32;

                if (!_didIteratorError) {
                    context$1$0.next = 35;
                    break;
                }

                throw _iteratorError;

            case 35:
                return context$1$0.finish(32);

            case 36:
                return context$1$0.finish(29);

            case 37:
                context$1$0.next = 40;
                break;

            case 39:
                throw new Error("First parameter should be an Object or an Array");

            case 40:
            case "end":
                return context$1$0.stop();
        }
    }, each, this, [[14, 25, 29, 37], [30,, 32, 36]]);
});
exports.each = each;

/**
 * Transforms an object
 */
exports.transform = transform;

/**
 * Returns true if the value is defined
 */
exports.isDefined = isDefined;

/**
 * Returns true if the value is an object
 */
exports.isObject = isObject;

/**
 * Returns true if the value is a string
 */
exports.isString = isString;
Object.defineProperty(exports, "__esModule", {
    value: true
});
;
function transform(object, transformers) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = each(transformers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _transform = _step.value.value;

            if (typeof _transform == "function") {
                object = _transform(object);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return object;
}

function isDefined(value) {
    return typeof value !== "undefined";
}

;
function isObject(value) {
    return value !== null && isDefined(value) && typeof value.valueOf() === "object";
}

;
function isString(value) {
    return value !== null && isDefined(value) && typeof value.valueOf() === "string";
}

;

},{}],6:[function(require,module,exports){
var $ = require('./$');
function assert(condition, msg1, msg2){
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
};
assert.def = $.assertDefined;
assert.fn = function(it){
  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
  return it;
};
assert.obj = function(it){
  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
assert.inst = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
module.exports = assert;
},{"./$":13}],7:[function(require,module,exports){
var $ = require('./$');
// 19.1.2.1 Object.assign(target, source, ...)
module.exports = Object.assign || function(target, source){
  var T = Object($.assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = $.ES5Object(arguments[i++])
      , keys   = $.getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
}
},{"./$":13}],8:[function(require,module,exports){
var $        = require('./$')
  , TAG      = require('./$.wks')('toStringTag')
  , toString = {}.toString;
function cof(it){
  return toString.call(it).slice(8, -1);
}
cof.classof = function(it){
  var O, T;
  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
}
cof.set = function(it, tag, stat){
  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
}
module.exports = cof;
},{"./$":13,"./$.wks":20}],9:[function(require,module,exports){
// Optional / simple context binding
var assertFunction = require('./$.assert').fn;
module.exports = function(fn, that, length){
  assertFunction(fn);
  if(~length && that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    }
    case 2: return function(a, b){
      return fn.call(that, a, b);
    }
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    }
  } return function(/* ...args */){
      return fn.apply(that, arguments);
  }
}
},{"./$.assert":6}],10:[function(require,module,exports){
var $          = require('./$')
  , global     = $.g
  , core       = $.core
  , isFunction = $.isFunction;
function ctx(fn, that){
  return function(){
    return fn.apply(that, arguments);
  }
}
if($.FW)global.core = core;
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
function $def(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , target   = isGlobal ? global : (type & $def.S)
        ? global[name] : (global[name] || {}).prototype
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // prevent global pollution for namespaces
    if(!$.FW && isGlobal && !isFunction(target[key]))exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && !$.FW && target[key] == out)!function(out){
      exp = function(param){
        return this instanceof out ? new out(param) : out(param);
      }
      exp.prototype = out.prototype;
    }(out);
    else exp = type & $def.P && isFunction(out) ? ctx(Function.call, out) : out;
    // extend global
    if($.FW && target && !own){
      if(isGlobal)target[key] = out;
      else delete target[key] && $.hide(target, key, out);
    }
    // export
    if(exports[key] != out)$.hide(exports, key, exp);
  }
}
module.exports = $def;
},{"./$":13}],11:[function(require,module,exports){
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
  } return              fn.apply(that, args);
}
},{}],12:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , ctx               = require('./$.ctx')
  , cof               = require('./$.cof')
  , $def              = require('./$.def')
  , assertObject      = require('./$.assert').obj
  , SYMBOL_ITERATOR   = require('./$.wks')('iterator')
  , FF_ITERATOR       = '@@iterator'
  , Iterators         = {}
  , IteratorPrototype = {};
// Safari has byggy iterators w/o `next`
var BUGGY = 'keys' in [] && !('next' in [].keys());
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, $.that);
function setIterator(O, value){
  $.hide(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
}
function createIterator(Constructor, NAME, next, proto){
  Constructor.prototype = $.create(proto || $iter.prototype, {next: $.desc(1, next)});
  cof.set(Constructor, NAME + ' Iterator');
}
function defineIterator(Constructor, NAME, value, DEFAULT){
  var proto = Constructor.prototype
    , iter  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || (DEFAULT && proto[DEFAULT]) || value;
  if($.FW){
    // Define iterator
    setIterator(proto, iter);
    if(iter !== value){
      var iterProto = $.getProto(iter.call(new Constructor));
      // Set @@toStringTag to native iterators
      cof.set(iterProto, NAME + ' Iterator', true);
      // FF fix
      $.has(proto, FF_ITERATOR) && setIterator(iterProto, $.that);
    }
  }
  // Plug for library
  Iterators[NAME] = iter;
  // FF & v8 fix
  Iterators[NAME + ' Iterator'] = $.that;
  return iter;
}
function getIterator(it){
  var Symbol  = $.g.Symbol
    , ext     = it[Symbol && Symbol.iterator || FF_ITERATOR]
    , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[cof.classof(it)];
  return assertObject(getIter.call(it));
}
function closeIterator(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)ret.call(iterator);
}
function stepCall(iterator, fn, value, entries){
  try {
    return entries ? fn(value[0], value[1]) : fn(value);
  } catch(e){
    closeIterator(iterator);
    throw e;
  }
}
var DANGER_CLOSING = true;
try {
  var iter = [1].keys();
  iter['return'] = function(){ DANGER_CLOSING = false };
  Array.from(iter, function(){ throw 2 });
} catch(e){}
var $iter = module.exports = {
  BUGGY: BUGGY,
  DANGER_CLOSING: DANGER_CLOSING,
  Iterators: Iterators,
  prototype: IteratorPrototype,
  step: function(done, value){
    return {value: value, done: !!done};
  },
  stepCall: stepCall,
  close: closeIterator,
  is: function(it){
    var O      = Object(it)
      , Symbol = $.g.Symbol
      , SYM    = Symbol && Symbol.iterator || FF_ITERATOR;
    return SYM in O || SYMBOL_ITERATOR in O || $.has(Iterators, cof.classof(O));
  },
  get: getIterator,
  set: setIterator,
  create: createIterator,
  define: defineIterator,
  std: function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
    function createIter(kind){
      return function(){
        return new Constructor(this, kind);
      }
    }
    createIterator(Constructor, NAME, next);
    var entries = createIter('key+value')
      , values  = createIter('value')
      , proto   = Base.prototype
      , methods, key;
    if(DEFAULT == 'value')values = defineIterator(Base, NAME, values, 'values');
    else entries = defineIterator(Base, NAME, entries, 'entries');
    if(DEFAULT){
      methods = {
        entries: entries,
        keys:    IS_SET ? values : createIter('key'),
        values:  values
      }
      $def($def.P + $def.F * BUGGY, NAME, methods);
      if(FORCE)for(key in methods){
        if(!(key in proto))$.hide(proto, key, methods[key]);
      }
    }
  },
  forOf: function(iterable, entries, fn, that){
    var iterator = getIterator(iterable)
      , f = ctx(fn, that, entries ? 2 : 1)
      , step;
    while(!(step = iterator.next()).done){
      if(stepCall(iterator, f, step.value, entries) === false){
        return closeIterator(iterator);
      }
    }
  }
};
},{"./$":13,"./$.assert":6,"./$.cof":8,"./$.ctx":9,"./$.def":10,"./$.wks":20}],13:[function(require,module,exports){
'use strict';
var global = typeof self != 'undefined' ? self : Function('return this')()
  , core   = {}
  , defineProperty = Object.defineProperty
  , hasOwnProperty = {}.hasOwnProperty
  , ceil  = Math.ceil
  , floor = Math.floor
  , max   = Math.max
  , min   = Math.min;
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC = !!function(){try {
  return defineProperty({}, 'a', {get: function(){ return 2 }}).a == 2;
} catch(e){}}();
var hide = createDefiner(1);
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
}
function desc(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  }
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return $.setDesc(object, key, desc(bitmap, value));
  } : simpleSet;
}

function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
function assertDefined(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
}

var $ = module.exports = {
  g: global,
  FW: true,
  path: global,
  core: core,
  html: global.document && document.documentElement,
  // http://jsperf.com/core-js-isobject
  isObject:   isObject,
  isFunction: isFunction,
  it: function(it){
    return it;
  },
  that: function(){
    return this;
  },
  // 7.1.4 ToInteger
  toInteger: toInteger,
  // 7.1.15 ToLength
  toLength: function(it){
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  },
  toIndex: function(index, length){
    var index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  },
  has: function(it, key){
    return hasOwnProperty.call(it, key);
  },
  create:     Object.create,
  getProto:   Object.getPrototypeOf,
  DESC:       DESC,
  desc:       desc,
  getDesc:    Object.getOwnPropertyDescriptor,
  setDesc:    defineProperty,
  getKeys:    Object.keys,
  getNames:   Object.getOwnPropertyNames,
  getSymbols: Object.getOwnPropertySymbols,
  // Dummy, fix for not array-like ES3 string in es5 module
  assertDefined: assertDefined,
  ES5Object: Object,
  toObject: function(it){
    return $.ES5Object(assertDefined(it));
  },
  hide: hide,
  def: createDefiner(0),
  set: global.Symbol ? simpleSet : hide,
  mix: function(target, src){
    for(var key in src)hide(target, key, src[key]);
    return target;
  },
  // $.a('str1,str2,str3') => ['str1', 'str2', 'str3']
  a: function(it){
    return String(it).split(',');
  },
  each: [].forEach
};
if(typeof __e != 'undefined')__e = core;
if(typeof __g != 'undefined')__g = global;
},{}],14:[function(require,module,exports){
var $ = require('./$');
module.exports = function(object, el){
  var O      = $.toObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
}
},{"./$":13}],15:[function(require,module,exports){
'use strict';
var $      = require('./$')
  , invoke = require('./$.invoke')
  , assertFunction = require('./$.assert').fn;
module.exports = function(/* ...pargs */){
  var fn     = assertFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = $.path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that    = this
      , _length = arguments.length
      , i = 0, j = 0, args;
    if(!holder && !_length)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > i; i++)if(args[i] === _)args[i] = arguments[j++];
    while(_length > j)args.push(arguments[j++]);
    return invoke(fn, args, that);
  }
}
},{"./$":13,"./$.assert":6,"./$.invoke":11}],16:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't works with null proto objects.
var $      = require('./$')
  , assert = require('./$.assert');
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function(buggy, set){
  try {
    set = require('./$.ctx')(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
    set({}, []);
  } catch(e){ buggy = true }
  return function(O, proto){
    assert.obj(O);
    assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
    if(buggy)O.__proto__ = proto;
    else set(O, proto);
    return O;
  }
}() : undefined);
},{"./$":13,"./$.assert":6,"./$.ctx":9}],17:[function(require,module,exports){
var $ = require('./$');
module.exports = function(C){
  if($.DESC && $.FW)$.setDesc(C, require('./$.wks')('species'), {
    configurable: true,
    get: $.that
  });
}
},{"./$":13,"./$.wks":20}],18:[function(require,module,exports){
'use strict';
// true  -> String#codePointAt
// false -> String#at
var $ = require('./$');
module.exports = function(TO_STRING){
  return function(pos){
    var s = String($.assertDefined(this))
      , i = $.toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  }
}
},{"./$":13}],19:[function(require,module,exports){
var sid = 0
function uid(key){
  return 'Symbol(' + key + ')_' + (++sid + Math.random()).toString(36);
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":13}],20:[function(require,module,exports){
var global = require('./$').g
  , store  = {};
module.exports = function(name){
  return store[name] || (store[name] =
    (global.Symbol && global.Symbol[name]) || require('./$.uid').safe('Symbol.' + name));
}
},{"./$":13,"./$.uid":19}],21:[function(require,module,exports){
require('./es6.iterators');
var $     = require('./$')
  , ctx   = require('./$.ctx')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , stepCall = $iter.stepCall
  , assertDefined = $.assertDefined;
function generic(A, B){
  // strange IE quirks mode bug -> use typeof instead of isFunction
  return typeof A == 'function' ? A : B;
}
$def($def.S + $def.F * $iter.DANGER_CLOSING, 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = Object(assertDefined(arrayLike))
      , mapfn   = arguments[1]
      , mapping = mapfn !== undefined
      , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
      , index   = 0
      , length, result, step, iterator;
    if($iter.is(O)){
      iterator = $iter.get(O);
      result   = new (generic(this, Array));
      for(; !(step = iterator.next()).done; index++){
        result[index] = mapping ? stepCall(iterator, f, [step.value, index], true) : step.value;
      }
    } else {
      result = new (generic(this, Array))(length = $.toLength(O.length));
      for(; length > index; index++){
        result[index] = mapping ? f(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

$def($def.S, 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function(/* ...args */){
    var index  = 0
      , length = arguments.length
      , result = new (generic(this, Array))(length);
    while(length > index)result[index] = arguments[index++];
    result.length = length;
    return result;
  }
});

require('./$.species')(Array);
},{"./$":13,"./$.ctx":9,"./$.def":10,"./$.iter":12,"./$.species":17,"./es6.iterators":23}],22:[function(require,module,exports){
'use strict';
require('./es6.iterators');
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , cof      = require('./$.cof')
  , $def     = require('./$.def')
  , safe     = require('./$.uid').safe
  , $iter    = require('./$.iter')
  , assert   = require('./$.assert')
  , assertInstanse = assert.inst
  , has      = $.has
  , set      = $.set
  , isObject = $.isObject
  , hide     = $.hide
  , step     = $iter.step
  , isFrozen = Object.isFrozen || $.core.Object.isFrozen
  , CID      = safe('cid')
  , O1       = safe('O1')
  , WEAK     = safe('weak')
  , LEAK     = safe('leak')
  , LAST     = safe('last')
  , FIRST    = safe('first')
  , ITER     = safe('iter')
  , SIZE     = $.DESC ? safe('size') : 'size'
  , cid      = 0
  , tmp      = {};

function getCollection(NAME, methods, commonMethods, isMap, isWeak){
  var Base  = $.g[NAME]
    , C     = Base
    , ADDER = isMap ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  function initFromIterable(that, iterable){
    if(iterable != undefined)$iter.forOf(iterable, isMap, that[ADDER], that);
    return that;
  }
  function fixSVZ(key, chain){
    var method = proto[key];
    if($.FW)proto[key] = function(a, b){
      var result = method.call(this, a === 0 ? 0 : a, b);
      return chain ? this : result;
    };
  }
  function checkIter(){
    var done = false;
    var O = {next: function(){
      done = true;
      return step(1);
    }};
    O[SYMBOL_ITERATOR] = $.that;
    try { new C(O) } catch(e){}
    return done;
  }
  if(!$.isFunction(C) || !(isWeak || (!$iter.BUGGY && proto.forEach && proto.entries))){
    // create collection constructor
    C = isWeak
      ? function(iterable){
          set(assertInstanse(this, C, NAME), CID, cid++);
          initFromIterable(this, iterable);
        }
      : function(iterable){
          var that = assertInstanse(this, C, NAME);
          set(that, O1, $.create(null));
          set(that, SIZE, 0);
          set(that, LAST, undefined);
          set(that, FIRST, undefined);
          initFromIterable(that, iterable);
        };
    $.mix($.mix(C.prototype, methods), commonMethods);
    isWeak || !$.DESC || $.setDesc(C.prototype, 'size', {get: function(){
      return assert.def(this[SIZE]);
    }});
  } else {
    var Native = C
      , inst   = new C
      , chain  = inst[ADDER](isWeak ? {} : -0, 1)
      , buggyZero;
    // wrap to init collections from iterable
    if($iter.DANGER_CLOSING || !checkIter()){
      C = function(iterable){
        assertInstanse(this, C, NAME);
        return initFromIterable(new Native, iterable);
      }
      C.prototype = proto;
      if($.FW)proto.constructor = C;
    }
    isWeak || inst.forEach(function(val, key){
      buggyZero = 1 / key === -Infinity;
    });
    // fix converting -0 key to +0
    if(buggyZero){
      fixSVZ('delete');
      fixSVZ('has');
      isMap && fixSVZ('get');
    }
    // + fix .add & .set for chaining
    if(buggyZero || chain !== inst)fixSVZ(ADDER, true);
  }
  cof.set(C, NAME);
  require('./$.species')(C);
  
  O[NAME] = C;
  $def($def.G + $def.W + $def.F * (C != Base), O);
  
  // add .keys, .values, .entries, [@@iterator]
  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
  isWeak || $iter.std(C, NAME, function(iterated, kind){
    set(this, ITER, {o: iterated, k: kind});
  }, function(){
    var iter  = this[ITER]
      , kind  = iter.k
      , entry = iter.l;
    // revert to the last existing entry
    while(entry && entry.r)entry = entry.p;
    // get next entry
    if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
      // or finish the iteration
      iter.o = undefined;
      return step(1);
    }
    // return step by kind
    if(kind == 'key')   return step(0, entry.k);
    if(kind == 'value') return step(0, entry.v);
                        return step(0, [entry.k, entry.v]);   
  }, isMap ? 'key+value' : 'value', !isMap, true);
  
  return C;
}

function fastKey(it, create){
  // return primitive with prefix
  if(!isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;
  // can't set id to frozen object
  if(isFrozen(it))return 'F';
  if(!has(it, CID)){
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, CID, ++cid);
  // return object id with prefix
  } return 'O' + it[CID];
}
function getEntry(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index != 'F')return that[O1][index];
  // frozen object case
  for(entry = that[FIRST]; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
}
function def(that, key, value){
  var entry = getEntry(that, key)
    , prev, index;
  // change existing entry
  if(entry)entry.v = value;
  // create new entry
  else {
    that[LAST] = entry = {
      i: index = fastKey(key, true), // <- index
      k: key,                        // <- key
      v: value,                      // <- value
      p: prev = that[LAST],          // <- previous entry
      n: undefined,                  // <- next entry
      r: false                       // <- removed
    };
    if(!that[FIRST])that[FIRST] = entry;
    if(prev)prev.n = entry;
    that[SIZE]++;
    // add to index
    if(index != 'F')that[O1][index] = entry;
  } return that;
}

var collectionMethods = {
  // 23.1.3.1 Map.prototype.clear()
  // 23.2.3.2 Set.prototype.clear()
  clear: function(){
    for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
      entry.r = true;
      if(entry.p)entry.p = entry.p.n = undefined;
      delete data[entry.i];
    }
    that[FIRST] = that[LAST] = undefined;
    that[SIZE] = 0;
  },
  // 23.1.3.3 Map.prototype.delete(key)
  // 23.2.3.4 Set.prototype.delete(value)
  'delete': function(key){
    var that  = this
      , entry = getEntry(that, key);
    if(entry){
      var next = entry.n
        , prev = entry.p;
      delete that[O1][entry.i];
      entry.r = true;
      if(prev)prev.n = next;
      if(next)next.p = prev;
      if(that[FIRST] == entry)that[FIRST] = next;
      if(that[LAST] == entry)that[LAST] = prev;
      that[SIZE]--;
    } return !!entry;
  },
  // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
  // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
  forEach: function(callbackfn /*, that = undefined */){
    var f = ctx(callbackfn, arguments[1], 3)
      , entry;
    while(entry = entry ? entry.n : this[FIRST]){
      f(entry.v, entry.k, this);
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
    }
  },
  // 23.1.3.7 Map.prototype.has(key)
  // 23.2.3.7 Set.prototype.has(value)
  has: function(key){
    return !!getEntry(this, key);
  }
}

// 23.1 Map Objects
var Map = getCollection('Map', {
  // 23.1.3.6 Map.prototype.get(key)
  get: function(key){
    var entry = getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function(key, value){
    return def(this, key === 0 ? 0 : key, value);
  }
}, collectionMethods, true);

// 23.2 Set Objects
getCollection('Set', {
  // 23.2.3.1 Set.prototype.add(value)
  add: function(value){
    return def(this, value = value === 0 ? 0 : value, value);
  }
}, collectionMethods);

function defWeak(that, key, value){
  if(isFrozen(assert.obj(key)))leakStore(that).set(key, value);
  else {
    has(key, WEAK) || hide(key, WEAK, {});
    key[WEAK][that[CID]] = value;
  } return that;
}
function leakStore(that){
  return that[LEAK] || hide(that, LEAK, new Map)[LEAK];
}

var weakMethods = {
  // 23.3.3.2 WeakMap.prototype.delete(key)
  // 23.4.3.3 WeakSet.prototype.delete(value)
  'delete': function(key){
    if(!isObject(key))return false;
    if(isFrozen(key))return leakStore(this)['delete'](key);
    return has(key, WEAK) && has(key[WEAK], this[CID]) && delete key[WEAK][this[CID]];
  },
  // 23.3.3.4 WeakMap.prototype.has(key)
  // 23.4.3.4 WeakSet.prototype.has(value)
  has: function(key){
    if(!isObject(key))return false;
    if(isFrozen(key))return leakStore(this).has(key);
    return has(key, WEAK) && has(key[WEAK], this[CID]);
  }
};

// 23.3 WeakMap Objects
var WeakMap = getCollection('WeakMap', {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function(key){
    if(isObject(key)){
      if(isFrozen(key))return leakStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this[CID]];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function(key, value){
    return defWeak(this, key, value);
  }
}, weakMethods, true, true);

// IE11 WeakMap frozen keys fix
if($.FW && new WeakMap().set(Object.freeze(tmp), 7).get(tmp) != 7){
  $.each.call($.a('delete,has,get,set'), function(key){
    var method = WeakMap.prototype[key];
    WeakMap.prototype[key] = function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && isFrozen(a)){
        var result = leakStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    };
  });
}

// 23.4 WeakSet Objects
getCollection('WeakSet', {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function(value){
    return defWeak(this, value, true);
  }
}, weakMethods, false, true);
},{"./$":13,"./$.assert":6,"./$.cof":8,"./$.ctx":9,"./$.def":10,"./$.iter":12,"./$.species":17,"./$.uid":19,"./es6.iterators":23}],23:[function(require,module,exports){
var $     = require('./$')
  , at    = require('./$.string-at')(true)
  , ITER  = require('./$.uid').safe('iter')
  , $iter = require('./$.iter')
  , step  = $iter.step
  , Iterators = $iter.Iterators;
// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
$iter.std(Array, 'Array', function(iterated, kind){
  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , kind  = iter.k
    , index = iter.i++;
  if(!O || index >= O.length){
    iter.o = undefined;
    return step(1);
  }
  if(kind == 'key')   return step(0, index);
  if(kind == 'value') return step(0, O[index]);
                      return step(0, [index, O[index]]);
}, 'value');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

// 21.1.3.27 String.prototype[@@iterator]()
$iter.std(String, 'String', function(iterated){
  $.set(this, ITER, {o: String(iterated), i: 0});
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , index = iter.i
    , point;
  if(index >= O.length)return step(1);
  point = at.call(O, index);
  iter.i += point.length;
  return step(0, point);
});
},{"./$":13,"./$.iter":12,"./$.string-at":18,"./$.uid":19}],24:[function(require,module,exports){
var $def     = require('./$.def')
  , setProto = require('./$.set-proto');
var objectStatic = {
  // 19.1.3.1 Object.assign(target, source)
  assign: require('./$.assign'),
  // 19.1.3.10 Object.is(value1, value2)
  is: function(x, y){
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  }
};
// 19.1.3.19 Object.setPrototypeOf(O, proto)
if(setProto)objectStatic.setPrototypeOf = setProto;
$def($def.S, 'Object', objectStatic);
},{"./$.assign":7,"./$.def":10,"./$.set-proto":16}],25:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , $def     = require('./$.def')
  , assert   = require('./$.assert')
  , has      = $.has
  , hide     = $.hide
  , getNames = $.getNames
  , toObject = $.toObject
  , Symbol   = $.g.Symbol
  , Base     = Symbol
  , setter   = true
  , TAG      = uid.safe('tag')
  , SymbolRegistry = {}
  , AllSymbols     = {};
// 19.4.1.1 Symbol([description])
if(!$.isFunction(Symbol)){
  Symbol = function(description){
    assert(!(this instanceof Symbol), 'Symbol is not a constructor');
    var tag = uid(description)
      , sym = $.set($.create(Symbol.prototype), TAG, tag);
    AllSymbols[tag] = sym;
    $.DESC && setter && $.setDesc(Object.prototype, tag, {
      configurable: true,
      set: function(value){
        hide(this, tag, value);
      }
    });
    return sym;
  }
  hide(Symbol.prototype, 'toString', function(){
    return this[TAG];
  });
}
$def($def.G + $def.W, {Symbol: Symbol});

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: require('./$.partial').call(require('./$.keyof'), SymbolRegistry, 0),
  pure: uid.safe,
  set: $.set,
  useSetter: function(){ setter = true },
  useSimple: function(){ setter = false }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call($.a('hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'),
  function(it){
    symbolStatics[it] = require('./$.wks')(it);
  }
);

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * (Symbol != Base), 'Object', {
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: function(it){
    var names = getNames(toObject(it)), result = [], key, i = 0;
    while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);
    return result;
  },
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: function(it){
    var names = getNames(toObject(it)), result = [], key, i = 0;
    while(names.length > i)has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
    return result;
  }
});

setTag(Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag($.g.JSON, 'JSON', true);
},{"./$":13,"./$.assert":6,"./$.cof":8,"./$.def":10,"./$.keyof":14,"./$.partial":15,"./$.uid":19,"./$.wks":20}],26:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    return new Generator(innerFn, outerFn, self || null, tryLocsList || []);
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    return new Promise(function(resolve, reject) {
      var generator = wrap(innerFn, outerFn, self, tryLocsList);
      var callNext = step.bind(generator.next);
      var callThrow = step.bind(generator["throw"]);

      function step(arg) {
        var record = tryCatch(this, null, arg);
        if (record.type === "throw") {
          reject(record.arg);
          return;
        }

        var info = record.arg;
        if (info.done) {
          resolve(info.value);
        } else {
          Promise.resolve(info.value).then(callNext, callThrow);
        }
      }

      callNext();
    });
  };

  function Generator(innerFn, outerFn, self, tryLocsList) {
    var generator = outerFn ? Object.create(outerFn.prototype) : this;
    var context = new Context(tryLocsList);
    var state = GenStateSuspendedStart;

    function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;

            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedStart &&
              typeof arg !== "undefined") {
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
            throw new TypeError(
              "attempt to send " + JSON.stringify(arg) + " to newborn generator"
            );
          }

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            delete context.sent;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;

          if (method === "next") {
            context.dispatchException(record.arg);
          } else {
            arg = record.arg;
          }
        }
      }
    }

    generator.next = invoke.bind(generator, "next");
    generator["throw"] = invoke.bind(generator, "throw");
    generator["return"] = invoke.bind(generator, "return");

    return generator;
  }

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset();
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function() {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      // Pre-initialize at least 20 temporary variables to enable hidden
      // class optimizations for simple generators.
      for (var tempIndex = 0, tempName;
           hasOwn.call(this, tempName = "t" + tempIndex) || tempIndex < 20;
           ++tempIndex) {
        this[tempName] = null;
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg < finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          return this.complete(entry.completion, entry.afterLoc);
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});


//# sourceMappingURL=serialison.js.map