import {
  DomSanitizer
} from "./chunk-4235WDZO.js";
import "./chunk-M2UQCX6S.js";
import "./chunk-NBGPGVFA.js";
import "./chunk-E3L45OF3.js";
import "./chunk-W7ENOTKE.js";
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  Directive,
  Injectable,
  NgModule,
  computed,
  effect,
  inject,
  input,
  model,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomProperty,
  ɵɵgetInheritedFactory,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵsanitizeHtml
} from "./chunk-E6736SUA.js";
import "./chunk-G6ECYYJH.js";
import "./chunk-YVXMBCE5.js";
import "./chunk-RTGP7ALM.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@fortawesome/fontawesome-svg-core/index.mjs
function _defineProperty(e, r2, t2) {
  return (r2 = _toPropertyKey(r2)) in e ? Object.defineProperty(e, r2, {
    value: t2,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r2] = t2, e;
}
function _inherits(t2, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t2.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t2,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t2, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t2, e);
}
function ownKeys(e, r2) {
  var t2 = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread2(e) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys(Object(t2), true).forEach(function(r3) {
      _defineProperty(e, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e;
}
function _setPrototypeOf(t2, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e2) {
    return t3.__proto__ = e2, t3;
  }, _setPrototypeOf(t2, e);
}
function _toPrimitive(t2, r2) {
  if ("object" != typeof t2 || !t2) return t2;
  var e = t2[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t2, r2 || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r2 ? String : Number)(t2);
}
function _toPropertyKey(t2) {
  var i = _toPrimitive(t2, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _wrapRegExp() {
  _wrapRegExp = function(e2, r3) {
    return new BabelRegExp(e2, void 0, r3);
  };
  var e = RegExp.prototype, r2 = /* @__PURE__ */ new WeakMap();
  function BabelRegExp(e2, t2, p2) {
    var o2 = RegExp(e2, t2);
    return r2.set(o2, p2 || r2.get(e2)), _setPrototypeOf(o2, BabelRegExp.prototype);
  }
  function buildGroups(e2, t2) {
    var p2 = r2.get(t2);
    return Object.keys(p2).reduce(function(r3, t3) {
      var o2 = p2[t3];
      if ("number" == typeof o2) r3[t3] = e2[o2];
      else {
        for (var i = 0; void 0 === e2[o2[i]] && i + 1 < o2.length; ) i++;
        r3[t3] = e2[o2[i]];
      }
      return r3;
    }, /* @__PURE__ */ Object.create(null));
  }
  return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function(r3) {
    var t2 = e.exec.call(this, r3);
    if (t2) {
      t2.groups = buildGroups(t2, this);
      var p2 = t2.indices;
      p2 && (p2.groups = buildGroups(p2, this));
    }
    return t2;
  }, BabelRegExp.prototype[Symbol.replace] = function(t2, p2) {
    if ("string" == typeof p2) {
      var o2 = r2.get(this);
      return e[Symbol.replace].call(this, t2, p2.replace(/\$<([^>]+)>/g, function(e2, r3) {
        var t3 = o2[r3];
        return "$" + (Array.isArray(t3) ? t3.join("$") : t3);
      }));
    }
    if ("function" == typeof p2) {
      var i = this;
      return e[Symbol.replace].call(this, t2, function() {
        var e2 = arguments;
        return "object" != typeof e2[e2.length - 1] && (e2 = [].slice.call(e2)).push(buildGroups(e2, i)), p2.apply(this, e2);
      });
    }
    return e[Symbol.replace].call(this, t2, p2);
  }, _wrapRegExp.apply(this, arguments);
}
var noop = () => {
};
var _WINDOW = {};
var _DOCUMENT = {};
var _MUTATION_OBSERVER = null;
var _PERFORMANCE = {
  mark: noop,
  measure: noop
};
try {
  if (typeof window !== "undefined") _WINDOW = window;
  if (typeof document !== "undefined") _DOCUMENT = document;
  if (typeof MutationObserver !== "undefined") _MUTATION_OBSERVER = MutationObserver;
  if (typeof performance !== "undefined") _PERFORMANCE = performance;
} catch (e) {
}
var {
  userAgent = ""
} = _WINDOW.navigator || {};
var WINDOW = _WINDOW;
var DOCUMENT2 = _DOCUMENT;
var MUTATION_OBSERVER = _MUTATION_OBSERVER;
var PERFORMANCE = _PERFORMANCE;
var IS_BROWSER = !!WINDOW.document;
var IS_DOM = !!DOCUMENT2.documentElement && !!DOCUMENT2.head && typeof DOCUMENT2.addEventListener === "function" && typeof DOCUMENT2.createElement === "function";
var IS_IE = ~userAgent.indexOf("MSIE") || ~userAgent.indexOf("Trident/");
var p = /fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/;
var g = /Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i;
var S = {
  classic: {
    fa: "solid",
    fas: "solid",
    "fa-solid": "solid",
    far: "regular",
    "fa-regular": "regular",
    fal: "light",
    "fa-light": "light",
    fat: "thin",
    "fa-thin": "thin",
    fab: "brands",
    "fa-brands": "brands"
  },
  duotone: {
    fa: "solid",
    fad: "solid",
    "fa-solid": "solid",
    "fa-duotone": "solid",
    fadr: "regular",
    "fa-regular": "regular",
    fadl: "light",
    "fa-light": "light",
    fadt: "thin",
    "fa-thin": "thin"
  },
  sharp: {
    fa: "solid",
    fass: "solid",
    "fa-solid": "solid",
    fasr: "regular",
    "fa-regular": "regular",
    fasl: "light",
    "fa-light": "light",
    fast: "thin",
    "fa-thin": "thin"
  },
  "sharp-duotone": {
    fa: "solid",
    fasds: "solid",
    "fa-solid": "solid",
    fasdr: "regular",
    "fa-regular": "regular",
    fasdl: "light",
    "fa-light": "light",
    fasdt: "thin",
    "fa-thin": "thin"
  }
};
var A = {
  GROUP: "duotone-group",
  SWAP_OPACITY: "swap-opacity",
  PRIMARY: "primary",
  SECONDARY: "secondary"
};
var P = ["fa-classic", "fa-duotone", "fa-sharp", "fa-sharp-duotone"];
var s = "classic";
var t = "duotone";
var r = "sharp";
var o = "sharp-duotone";
var L = [s, t, r, o];
var G = {
  classic: {
    900: "fas",
    400: "far",
    normal: "far",
    300: "fal",
    100: "fat"
  },
  duotone: {
    900: "fad",
    400: "fadr",
    300: "fadl",
    100: "fadt"
  },
  sharp: {
    900: "fass",
    400: "fasr",
    300: "fasl",
    100: "fast"
  },
  "sharp-duotone": {
    900: "fasds",
    400: "fasdr",
    300: "fasdl",
    100: "fasdt"
  }
};
var lt = {
  "Font Awesome 6 Free": {
    900: "fas",
    400: "far"
  },
  "Font Awesome 6 Pro": {
    900: "fas",
    400: "far",
    normal: "far",
    300: "fal",
    100: "fat"
  },
  "Font Awesome 6 Brands": {
    400: "fab",
    normal: "fab"
  },
  "Font Awesome 6 Duotone": {
    900: "fad",
    400: "fadr",
    normal: "fadr",
    300: "fadl",
    100: "fadt"
  },
  "Font Awesome 6 Sharp": {
    900: "fass",
    400: "fasr",
    normal: "fasr",
    300: "fasl",
    100: "fast"
  },
  "Font Awesome 6 Sharp Duotone": {
    900: "fasds",
    400: "fasdr",
    normal: "fasdr",
    300: "fasdl",
    100: "fasdt"
  }
};
var pt = /* @__PURE__ */ new Map([["classic", {
  defaultShortPrefixId: "fas",
  defaultStyleId: "solid",
  styleIds: ["solid", "regular", "light", "thin", "brands"],
  futureStyleIds: [],
  defaultFontWeight: 900
}], ["sharp", {
  defaultShortPrefixId: "fass",
  defaultStyleId: "solid",
  styleIds: ["solid", "regular", "light", "thin"],
  futureStyleIds: [],
  defaultFontWeight: 900
}], ["duotone", {
  defaultShortPrefixId: "fad",
  defaultStyleId: "solid",
  styleIds: ["solid", "regular", "light", "thin"],
  futureStyleIds: [],
  defaultFontWeight: 900
}], ["sharp-duotone", {
  defaultShortPrefixId: "fasds",
  defaultStyleId: "solid",
  styleIds: ["solid", "regular", "light", "thin"],
  futureStyleIds: [],
  defaultFontWeight: 900
}]]);
var xt = {
  classic: {
    solid: "fas",
    regular: "far",
    light: "fal",
    thin: "fat",
    brands: "fab"
  },
  duotone: {
    solid: "fad",
    regular: "fadr",
    light: "fadl",
    thin: "fadt"
  },
  sharp: {
    solid: "fass",
    regular: "fasr",
    light: "fasl",
    thin: "fast"
  },
  "sharp-duotone": {
    solid: "fasds",
    regular: "fasdr",
    light: "fasdl",
    thin: "fasdt"
  }
};
var Ft = ["fak", "fa-kit", "fakd", "fa-kit-duotone"];
var St = {
  kit: {
    fak: "kit",
    "fa-kit": "kit"
  },
  "kit-duotone": {
    fakd: "kit-duotone",
    "fa-kit-duotone": "kit-duotone"
  }
};
var At = ["kit"];
var Ct = {
  kit: {
    "fa-kit": "fak"
  },
  "kit-duotone": {
    "fa-kit-duotone": "fakd"
  }
};
var Lt = ["fak", "fakd"];
var Wt = {
  kit: {
    fak: "fa-kit"
  },
  "kit-duotone": {
    fakd: "fa-kit-duotone"
  }
};
var Et = {
  kit: {
    kit: "fak"
  },
  "kit-duotone": {
    "kit-duotone": "fakd"
  }
};
var t$1 = {
  GROUP: "duotone-group",
  SWAP_OPACITY: "swap-opacity",
  PRIMARY: "primary",
  SECONDARY: "secondary"
};
var r$1 = ["fa-classic", "fa-duotone", "fa-sharp", "fa-sharp-duotone"];
var bt$1 = ["fak", "fa-kit", "fakd", "fa-kit-duotone"];
var Yt = {
  "Font Awesome Kit": {
    400: "fak",
    normal: "fak"
  },
  "Font Awesome Kit Duotone": {
    400: "fakd",
    normal: "fakd"
  }
};
var ua = {
  classic: {
    "fa-brands": "fab",
    "fa-duotone": "fad",
    "fa-light": "fal",
    "fa-regular": "far",
    "fa-solid": "fas",
    "fa-thin": "fat"
  },
  duotone: {
    "fa-regular": "fadr",
    "fa-light": "fadl",
    "fa-thin": "fadt"
  },
  sharp: {
    "fa-solid": "fass",
    "fa-regular": "fasr",
    "fa-light": "fasl",
    "fa-thin": "fast"
  },
  "sharp-duotone": {
    "fa-solid": "fasds",
    "fa-regular": "fasdr",
    "fa-light": "fasdl",
    "fa-thin": "fasdt"
  }
};
var I$1 = {
  classic: ["fas", "far", "fal", "fat", "fad"],
  duotone: ["fadr", "fadl", "fadt"],
  sharp: ["fass", "fasr", "fasl", "fast"],
  "sharp-duotone": ["fasds", "fasdr", "fasdl", "fasdt"]
};
var ga = {
  classic: {
    fab: "fa-brands",
    fad: "fa-duotone",
    fal: "fa-light",
    far: "fa-regular",
    fas: "fa-solid",
    fat: "fa-thin"
  },
  duotone: {
    fadr: "fa-regular",
    fadl: "fa-light",
    fadt: "fa-thin"
  },
  sharp: {
    fass: "fa-solid",
    fasr: "fa-regular",
    fasl: "fa-light",
    fast: "fa-thin"
  },
  "sharp-duotone": {
    fasds: "fa-solid",
    fasdr: "fa-regular",
    fasdl: "fa-light",
    fasdt: "fa-thin"
  }
};
var x = ["fa-solid", "fa-regular", "fa-light", "fa-thin", "fa-duotone", "fa-brands"];
var Ia = ["fa", "fas", "far", "fal", "fat", "fad", "fadr", "fadl", "fadt", "fab", "fass", "fasr", "fasl", "fast", "fasds", "fasdr", "fasdl", "fasdt", ...r$1, ...x];
var m$1 = ["solid", "regular", "light", "thin", "duotone", "brands"];
var c$1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var F$1 = c$1.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
var ma = [...Object.keys(I$1), ...m$1, "2xs", "xs", "sm", "lg", "xl", "2xl", "beat", "border", "fade", "beat-fade", "bounce", "flip-both", "flip-horizontal", "flip-vertical", "flip", "fw", "inverse", "layers-counter", "layers-text", "layers", "li", "pull-left", "pull-right", "pulse", "rotate-180", "rotate-270", "rotate-90", "rotate-by", "shake", "spin-pulse", "spin-reverse", "spin", "stack-1x", "stack-2x", "stack", "ul", t$1.GROUP, t$1.SWAP_OPACITY, t$1.PRIMARY, t$1.SECONDARY].concat(c$1.map((a) => "".concat(a, "x"))).concat(F$1.map((a) => "w-".concat(a)));
var wa = {
  "Font Awesome 5 Free": {
    900: "fas",
    400: "far"
  },
  "Font Awesome 5 Pro": {
    900: "fas",
    400: "far",
    normal: "far",
    300: "fal"
  },
  "Font Awesome 5 Brands": {
    400: "fab",
    normal: "fab"
  },
  "Font Awesome 5 Duotone": {
    900: "fad"
  }
};
var NAMESPACE_IDENTIFIER = "___FONT_AWESOME___";
var UNITS_IN_GRID = 16;
var DEFAULT_CSS_PREFIX = "fa";
var DEFAULT_REPLACEMENT_CLASS = "svg-inline--fa";
var DATA_FA_I2SVG = "data-fa-i2svg";
var DATA_FA_PSEUDO_ELEMENT = "data-fa-pseudo-element";
var DATA_FA_PSEUDO_ELEMENT_PENDING = "data-fa-pseudo-element-pending";
var DATA_PREFIX = "data-prefix";
var DATA_ICON = "data-icon";
var HTML_CLASS_I2SVG_BASE_CLASS = "fontawesome-i2svg";
var MUTATION_APPROACH_ASYNC = "async";
var TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = ["HTML", "HEAD", "STYLE", "SCRIPT"];
var PRODUCTION = (() => {
  try {
    return false;
  } catch (e$$1) {
    return false;
  }
})();
function familyProxy(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      return prop in target ? target[prop] : target[s];
    }
  });
}
var _PREFIX_TO_STYLE = _objectSpread2({}, S);
_PREFIX_TO_STYLE[s] = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, {
  "fa-duotone": "duotone"
}), S[s]), St["kit"]), St["kit-duotone"]);
var PREFIX_TO_STYLE = familyProxy(_PREFIX_TO_STYLE);
var _STYLE_TO_PREFIX = _objectSpread2({}, xt);
_STYLE_TO_PREFIX[s] = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, {
  duotone: "fad"
}), _STYLE_TO_PREFIX[s]), Et["kit"]), Et["kit-duotone"]);
var STYLE_TO_PREFIX = familyProxy(_STYLE_TO_PREFIX);
var _PREFIX_TO_LONG_STYLE = _objectSpread2({}, ga);
_PREFIX_TO_LONG_STYLE[s] = _objectSpread2(_objectSpread2({}, _PREFIX_TO_LONG_STYLE[s]), Wt["kit"]);
var PREFIX_TO_LONG_STYLE = familyProxy(_PREFIX_TO_LONG_STYLE);
var _LONG_STYLE_TO_PREFIX = _objectSpread2({}, ua);
_LONG_STYLE_TO_PREFIX[s] = _objectSpread2(_objectSpread2({}, _LONG_STYLE_TO_PREFIX[s]), Ct["kit"]);
var LONG_STYLE_TO_PREFIX = familyProxy(_LONG_STYLE_TO_PREFIX);
var ICON_SELECTION_SYNTAX_PATTERN = p;
var LAYERS_TEXT_CLASSNAME = "fa-layers-text";
var FONT_FAMILY_PATTERN = g;
var _FONT_WEIGHT_TO_PREFIX = _objectSpread2({}, G);
var FONT_WEIGHT_TO_PREFIX = familyProxy(_FONT_WEIGHT_TO_PREFIX);
var ATTRIBUTES_WATCHED_FOR_MUTATION = ["class", "data-prefix", "data-icon", "data-fa-transform", "data-fa-mask"];
var DUOTONE_CLASSES = A;
var RESERVED_CLASSES = [...At, ...ma];
var initial = WINDOW.FontAwesomeConfig || {};
function getAttrConfig(attr) {
  var element = DOCUMENT2.querySelector("script[" + attr + "]");
  if (element) {
    return element.getAttribute(attr);
  }
}
function coerce(val) {
  if (val === "") return true;
  if (val === "false") return false;
  if (val === "true") return true;
  return val;
}
if (DOCUMENT2 && typeof DOCUMENT2.querySelector === "function") {
  const attrs = [["data-family-prefix", "familyPrefix"], ["data-css-prefix", "cssPrefix"], ["data-family-default", "familyDefault"], ["data-style-default", "styleDefault"], ["data-replacement-class", "replacementClass"], ["data-auto-replace-svg", "autoReplaceSvg"], ["data-auto-add-css", "autoAddCss"], ["data-auto-a11y", "autoA11y"], ["data-search-pseudo-elements", "searchPseudoElements"], ["data-observe-mutations", "observeMutations"], ["data-mutate-approach", "mutateApproach"], ["data-keep-original-source", "keepOriginalSource"], ["data-measure-performance", "measurePerformance"], ["data-show-missing-icons", "showMissingIcons"]];
  attrs.forEach((_ref) => {
    let [attr, key] = _ref;
    const val = coerce(getAttrConfig(attr));
    if (val !== void 0 && val !== null) {
      initial[key] = val;
    }
  });
}
var _default = {
  styleDefault: "solid",
  familyDefault: s,
  cssPrefix: DEFAULT_CSS_PREFIX,
  replacementClass: DEFAULT_REPLACEMENT_CLASS,
  autoReplaceSvg: true,
  autoAddCss: true,
  autoA11y: true,
  searchPseudoElements: false,
  observeMutations: true,
  mutateApproach: "async",
  keepOriginalSource: true,
  measurePerformance: false,
  showMissingIcons: true
};
if (initial.familyPrefix) {
  initial.cssPrefix = initial.familyPrefix;
}
var _config = _objectSpread2(_objectSpread2({}, _default), initial);
if (!_config.autoReplaceSvg) _config.observeMutations = false;
var config = {};
Object.keys(_default).forEach((key) => {
  Object.defineProperty(config, key, {
    enumerable: true,
    set: function(val) {
      _config[key] = val;
      _onChangeCb.forEach((cb) => cb(config));
    },
    get: function() {
      return _config[key];
    }
  });
});
Object.defineProperty(config, "familyPrefix", {
  enumerable: true,
  set: function(val) {
    _config.cssPrefix = val;
    _onChangeCb.forEach((cb) => cb(config));
  },
  get: function() {
    return _config.cssPrefix;
  }
});
WINDOW.FontAwesomeConfig = config;
var _onChangeCb = [];
function onChange(cb) {
  _onChangeCb.push(cb);
  return () => {
    _onChangeCb.splice(_onChangeCb.indexOf(cb), 1);
  };
}
var d$2 = UNITS_IN_GRID;
var meaninglessTransform = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: false,
  flipY: false
};
function insertCss(css2) {
  if (!css2 || !IS_DOM) {
    return;
  }
  const style = DOCUMENT2.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerHTML = css2;
  const headChildren = DOCUMENT2.head.childNodes;
  let beforeChild = null;
  for (let i = headChildren.length - 1; i > -1; i--) {
    const child = headChildren[i];
    const tagName = (child.tagName || "").toUpperCase();
    if (["STYLE", "LINK"].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }
  DOCUMENT2.head.insertBefore(style, beforeChild);
  return css2;
}
var idPool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function nextUniqueId() {
  let size = 12;
  let id = "";
  while (size-- > 0) {
    id += idPool[Math.random() * 62 | 0];
  }
  return id;
}
function toArray(obj) {
  const array = [];
  for (let i = (obj || []).length >>> 0; i--; ) {
    array[i] = obj[i];
  }
  return array;
}
function classArray(node) {
  if (node.classList) {
    return toArray(node.classList);
  } else {
    return (node.getAttribute("class") || "").split(" ").filter((i) => i);
  }
}
function htmlEscape(str) {
  return "".concat(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function joinAttributes(attributes) {
  return Object.keys(attributes || {}).reduce((acc, attributeName) => {
    return acc + "".concat(attributeName, '="').concat(htmlEscape(attributes[attributeName]), '" ');
  }, "").trim();
}
function joinStyles(styles2) {
  return Object.keys(styles2 || {}).reduce((acc, styleName) => {
    return acc + "".concat(styleName, ": ").concat(styles2[styleName].trim(), ";");
  }, "");
}
function transformIsMeaningful(transform) {
  return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}
function transformForSvg(_ref) {
  let {
    transform,
    containerWidth,
    iconWidth
  } = _ref;
  const outer = {
    transform: "translate(".concat(containerWidth / 2, " 256)")
  };
  const innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
  const innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
  const innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
  const inner = {
    transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
  };
  const path = {
    transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
  };
  return {
    outer,
    inner,
    path
  };
}
function transformForCss(_ref2) {
  let {
    transform,
    width = UNITS_IN_GRID,
    height = UNITS_IN_GRID,
    startCentered = false
  } = _ref2;
  let val = "";
  if (startCentered && IS_IE) {
    val += "translate(".concat(transform.x / d$2 - width / 2, "em, ").concat(transform.y / d$2 - height / 2, "em) ");
  } else if (startCentered) {
    val += "translate(calc(-50% + ".concat(transform.x / d$2, "em), calc(-50% + ").concat(transform.y / d$2, "em)) ");
  } else {
    val += "translate(".concat(transform.x / d$2, "em, ").concat(transform.y / d$2, "em) ");
  }
  val += "scale(".concat(transform.size / d$2 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d$2 * (transform.flipY ? -1 : 1), ") ");
  val += "rotate(".concat(transform.rotate, "deg) ");
  return val;
}
var baseStyles = ':root, :host {\n  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";\n  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";\n  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";\n  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";\n  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";\n  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";\n  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 6 Sharp Duotone";\n  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 6 Sharp Duotone";\n  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 6 Sharp Duotone";\n}\n\nsvg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {\n  overflow: visible;\n  box-sizing: content-box;\n}\n\n.svg-inline--fa {\n  display: var(--fa-display, inline-block);\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-2xs {\n  vertical-align: 0.1em;\n}\n.svg-inline--fa.fa-xs {\n  vertical-align: 0em;\n}\n.svg-inline--fa.fa-sm {\n  vertical-align: -0.0714285705em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.2em;\n}\n.svg-inline--fa.fa-xl {\n  vertical-align: -0.25em;\n}\n.svg-inline--fa.fa-2xl {\n  vertical-align: -0.3125em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-li {\n  width: var(--fa-li-width, 2em);\n  top: 0.25em;\n}\n.svg-inline--fa.fa-fw {\n  width: var(--fa-fw-width, 1.25em);\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  transform-origin: center center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: var(--fa-counter-background-color, #ff253a);\n  border-radius: var(--fa-counter-border-radius, 1em);\n  box-sizing: border-box;\n  color: var(--fa-inverse, #fff);\n  line-height: var(--fa-counter-line-height, 1);\n  max-width: var(--fa-counter-max-width, 5em);\n  min-width: var(--fa-counter-min-width, 1.5em);\n  overflow: hidden;\n  padding: var(--fa-counter-padding, 0.25em 0.5em);\n  right: var(--fa-right, 0);\n  text-overflow: ellipsis;\n  top: var(--fa-top, 0);\n  transform: scale(var(--fa-counter-scale, 0.25));\n  transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: var(--fa-bottom, 0);\n  right: var(--fa-right, 0);\n  top: auto;\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: var(--fa-bottom, 0);\n  left: var(--fa-left, 0);\n  right: auto;\n  top: auto;\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  top: var(--fa-top, 0);\n  right: var(--fa-right, 0);\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: var(--fa-left, 0);\n  right: auto;\n  top: var(--fa-top, 0);\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: top left;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-2xs {\n  font-size: 0.625em;\n  line-height: 0.1em;\n  vertical-align: 0.225em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n  line-height: 0.0833333337em;\n  vertical-align: 0.125em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n  line-height: 0.0714285718em;\n  vertical-align: 0.0535714295em;\n}\n\n.fa-lg {\n  font-size: 1.25em;\n  line-height: 0.05em;\n  vertical-align: -0.075em;\n}\n\n.fa-xl {\n  font-size: 1.5em;\n  line-height: 0.0416666682em;\n  vertical-align: -0.125em;\n}\n\n.fa-2xl {\n  font-size: 2em;\n  line-height: 0.03125em;\n  vertical-align: -0.1875em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: var(--fa-li-margin, 2.5em);\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: calc(-1 * var(--fa-li-width, 2em));\n  position: absolute;\n  text-align: center;\n  width: var(--fa-li-width, 2em);\n  line-height: inherit;\n}\n\n.fa-border {\n  border-color: var(--fa-border-color, #eee);\n  border-radius: var(--fa-border-radius, 0.1em);\n  border-style: var(--fa-border-style, solid);\n  border-width: var(--fa-border-width, 0.08em);\n  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);\n}\n\n.fa-pull-left {\n  float: left;\n  margin-right: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-pull-right {\n  float: right;\n  margin-left: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-beat {\n  animation-name: fa-beat;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-bounce {\n  animation-name: fa-bounce;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n}\n\n.fa-fade {\n  animation-name: fa-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-beat-fade {\n  animation-name: fa-beat-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-flip {\n  animation-name: fa-flip;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-shake {\n  animation-name: fa-shake;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin {\n  animation-name: fa-spin;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 2s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-reverse {\n  --fa-animation-direction: reverse;\n}\n\n.fa-pulse,\n.fa-spin-pulse {\n  animation-name: fa-spin;\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, steps(8));\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fa-beat,\n.fa-bounce,\n.fa-fade,\n.fa-beat-fade,\n.fa-flip,\n.fa-pulse,\n.fa-shake,\n.fa-spin,\n.fa-spin-pulse {\n    animation-delay: -1ms;\n    animation-duration: 1ms;\n    animation-iteration-count: 1;\n    transition-delay: 0s;\n    transition-duration: 0s;\n  }\n}\n@keyframes fa-beat {\n  0%, 90% {\n    transform: scale(1);\n  }\n  45% {\n    transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@keyframes fa-bounce {\n  0% {\n    transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    transform: scale(1, 1) translateY(0);\n  }\n}\n@keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@keyframes fa-flip {\n  50% {\n    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@keyframes fa-shake {\n  0% {\n    transform: rotate(-15deg);\n  }\n  4% {\n    transform: rotate(15deg);\n  }\n  8%, 24% {\n    transform: rotate(-18deg);\n  }\n  12%, 28% {\n    transform: rotate(18deg);\n  }\n  16% {\n    transform: rotate(-22deg);\n  }\n  20% {\n    transform: rotate(22deg);\n  }\n  32% {\n    transform: rotate(-12deg);\n  }\n  36% {\n    transform: rotate(12deg);\n  }\n  40%, 100% {\n    transform: rotate(0deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  transform: scale(1, -1);\n}\n\n.fa-flip-both,\n.fa-flip-horizontal.fa-flip-vertical {\n  transform: scale(-1, -1);\n}\n\n.fa-rotate-by {\n  transform: rotate(var(--fa-rotate-angle, 0));\n}\n\n.fa-stack {\n  display: inline-block;\n  vertical-align: middle;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: var(--fa-stack-z-index, auto);\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}\n\n.sr-only,\n.fa-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.sr-only-focusable:not(:focus),\n.fa-sr-only-focusable:not(:focus) {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}';
function css() {
  const dcp = DEFAULT_CSS_PREFIX;
  const drc = DEFAULT_REPLACEMENT_CLASS;
  const fp = config.cssPrefix;
  const rc = config.replacementClass;
  let s2 = baseStyles;
  if (fp !== dcp || rc !== drc) {
    const dPatt = new RegExp("\\.".concat(dcp, "\\-"), "g");
    const customPropPatt = new RegExp("\\--".concat(dcp, "\\-"), "g");
    const rPatt = new RegExp("\\.".concat(drc), "g");
    s2 = s2.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
  }
  return s2;
}
var _cssInserted = false;
function ensureCss() {
  if (config.autoAddCss && !_cssInserted) {
    insertCss(css());
    _cssInserted = true;
  }
}
var InjectCSS = {
  mixout() {
    return {
      dom: {
        css,
        insertCss: ensureCss
      }
    };
  },
  hooks() {
    return {
      beforeDOMElementCreation() {
        ensureCss();
      },
      beforeI2svg() {
        ensureCss();
      }
    };
  }
};
var w = WINDOW || {};
if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
var namespace = w[NAMESPACE_IDENTIFIER];
var functions = [];
var listener = function() {
  DOCUMENT2.removeEventListener("DOMContentLoaded", listener);
  loaded = 1;
  functions.map((fn) => fn());
};
var loaded = false;
if (IS_DOM) {
  loaded = (DOCUMENT2.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT2.readyState);
  if (!loaded) DOCUMENT2.addEventListener("DOMContentLoaded", listener);
}
function domready(fn) {
  if (!IS_DOM) return;
  loaded ? setTimeout(fn, 0) : functions.push(fn);
}
function toHtml(abstractNodes) {
  const {
    tag,
    attributes = {},
    children = []
  } = abstractNodes;
  if (typeof abstractNodes === "string") {
    return htmlEscape(abstractNodes);
  } else {
    return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(""), "</").concat(tag, ">");
  }
}
function iconFromMapping(mapping, prefix, iconName) {
  if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
    return {
      prefix,
      iconName,
      icon: mapping[prefix][iconName]
    };
  }
}
var bindInternal4 = function bindInternal42(func, thisContext) {
  return function(a, b, c, d) {
    return func.call(thisContext, a, b, c, d);
  };
};
var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
  var keys = Object.keys(subject), length = keys.length, iterator = thisContext !== void 0 ? bindInternal4(fn, thisContext) : fn, i, key, result;
  if (initialValue === void 0) {
    i = 1;
    result = subject[keys[0]];
  } else {
    i = 0;
    result = initialValue;
  }
  for (; i < length; i++) {
    key = keys[i];
    result = iterator(result, subject[key], key, subject);
  }
  return result;
};
function ucs2decode(string) {
  const output = [];
  let counter2 = 0;
  const length = string.length;
  while (counter2 < length) {
    const value = string.charCodeAt(counter2++);
    if (value >= 55296 && value <= 56319 && counter2 < length) {
      const extra = string.charCodeAt(counter2++);
      if ((extra & 64512) == 56320) {
        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value);
        counter2--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}
function toHex(unicode) {
  const decoded = ucs2decode(unicode);
  return decoded.length === 1 ? decoded[0].toString(16) : null;
}
function codePointAt(string, index) {
  const size = string.length;
  let first = string.charCodeAt(index);
  let second;
  if (first >= 55296 && first <= 56319 && size > index + 1) {
    second = string.charCodeAt(index + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function normalizeIcons(icons) {
  return Object.keys(icons).reduce((acc, iconName) => {
    const icon2 = icons[iconName];
    const expanded = !!icon2.icon;
    if (expanded) {
      acc[icon2.iconName] = icon2.icon;
    } else {
      acc[iconName] = icon2;
    }
    return acc;
  }, {});
}
function defineIcons(prefix, icons) {
  let params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  const {
    skipHooks = false
  } = params;
  const normalized = normalizeIcons(icons);
  if (typeof namespace.hooks.addPack === "function" && !skipHooks) {
    namespace.hooks.addPack(prefix, normalizeIcons(icons));
  } else {
    namespace.styles[prefix] = _objectSpread2(_objectSpread2({}, namespace.styles[prefix] || {}), normalized);
  }
  if (prefix === "fas") {
    defineIcons("fa", icons);
  }
}
var duotonePathRe = [_wrapRegExp(/path d="([^"]+)".*path d="([^"]+)"/, {
  d1: 1,
  d2: 2
}), _wrapRegExp(/path class="([^"]+)".*d="([^"]+)".*path class="([^"]+)".*d="([^"]+)"/, {
  cls1: 1,
  d1: 2,
  cls2: 3,
  d2: 4
}), _wrapRegExp(/path class="([^"]+)".*d="([^"]+)"/, {
  cls1: 1,
  d1: 2
})];
var {
  styles,
  shims
} = namespace;
var FAMILY_NAMES = Object.keys(PREFIX_TO_LONG_STYLE);
var PREFIXES_FOR_FAMILY = FAMILY_NAMES.reduce((acc, familyId) => {
  acc[familyId] = Object.keys(PREFIX_TO_LONG_STYLE[familyId]);
  return acc;
}, {});
var _defaultUsablePrefix = null;
var _byUnicode = {};
var _byLigature = {};
var _byOldName = {};
var _byOldUnicode = {};
var _byAlias = {};
function isReserved(name) {
  return ~RESERVED_CLASSES.indexOf(name);
}
function getIconName(cssPrefix, cls) {
  const parts = cls.split("-");
  const prefix = parts[0];
  const iconName = parts.slice(1).join("-");
  if (prefix === cssPrefix && iconName !== "" && !isReserved(iconName)) {
    return iconName;
  } else {
    return null;
  }
}
var build = () => {
  const lookup = (reducer) => {
    return reduce(styles, (o$$1, style, prefix) => {
      o$$1[prefix] = reduce(style, reducer, {});
      return o$$1;
    }, {});
  };
  _byUnicode = lookup((acc, icon2, iconName) => {
    if (icon2[3]) {
      acc[icon2[3]] = iconName;
    }
    if (icon2[2]) {
      const aliases = icon2[2].filter((a$$1) => {
        return typeof a$$1 === "number";
      });
      aliases.forEach((alias) => {
        acc[alias.toString(16)] = iconName;
      });
    }
    return acc;
  });
  _byLigature = lookup((acc, icon2, iconName) => {
    acc[iconName] = iconName;
    if (icon2[2]) {
      const aliases = icon2[2].filter((a$$1) => {
        return typeof a$$1 === "string";
      });
      aliases.forEach((alias) => {
        acc[alias] = iconName;
      });
    }
    return acc;
  });
  _byAlias = lookup((acc, icon2, iconName) => {
    const aliases = icon2[2];
    acc[iconName] = iconName;
    aliases.forEach((alias) => {
      acc[alias] = iconName;
    });
    return acc;
  });
  const hasRegular = "far" in styles || config.autoFetchSvg;
  const shimLookups = reduce(shims, (acc, shim) => {
    const maybeNameMaybeUnicode = shim[0];
    let prefix = shim[1];
    const iconName = shim[2];
    if (prefix === "far" && !hasRegular) {
      prefix = "fas";
    }
    if (typeof maybeNameMaybeUnicode === "string") {
      acc.names[maybeNameMaybeUnicode] = {
        prefix,
        iconName
      };
    }
    if (typeof maybeNameMaybeUnicode === "number") {
      acc.unicodes[maybeNameMaybeUnicode.toString(16)] = {
        prefix,
        iconName
      };
    }
    return acc;
  }, {
    names: {},
    unicodes: {}
  });
  _byOldName = shimLookups.names;
  _byOldUnicode = shimLookups.unicodes;
  _defaultUsablePrefix = getCanonicalPrefix(config.styleDefault, {
    family: config.familyDefault
  });
};
onChange((c$$1) => {
  _defaultUsablePrefix = getCanonicalPrefix(c$$1.styleDefault, {
    family: config.familyDefault
  });
});
build();
function byUnicode(prefix, unicode) {
  return (_byUnicode[prefix] || {})[unicode];
}
function byLigature(prefix, ligature) {
  return (_byLigature[prefix] || {})[ligature];
}
function byAlias(prefix, alias) {
  return (_byAlias[prefix] || {})[alias];
}
function byOldName(name) {
  return _byOldName[name] || {
    prefix: null,
    iconName: null
  };
}
function byOldUnicode(unicode) {
  const oldUnicode = _byOldUnicode[unicode];
  const newUnicode = byUnicode("fas", unicode);
  return oldUnicode || (newUnicode ? {
    prefix: "fas",
    iconName: newUnicode
  } : null) || {
    prefix: null,
    iconName: null
  };
}
function getDefaultUsablePrefix() {
  return _defaultUsablePrefix;
}
var emptyCanonicalIcon = () => {
  return {
    prefix: null,
    iconName: null,
    rest: []
  };
};
function getFamilyId(values) {
  let family = s;
  const famProps = FAMILY_NAMES.reduce((acc, familyId) => {
    acc[familyId] = "".concat(config.cssPrefix, "-").concat(familyId);
    return acc;
  }, {});
  L.forEach((familyId) => {
    if (values.includes(famProps[familyId]) || values.some((v$$1) => PREFIXES_FOR_FAMILY[familyId].includes(v$$1))) {
      family = familyId;
    }
  });
  return family;
}
function getCanonicalPrefix(styleOrPrefix) {
  let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    family = s
  } = params;
  const style = PREFIX_TO_STYLE[family][styleOrPrefix];
  if (family === t && !styleOrPrefix) {
    return "fad";
  }
  const prefix = STYLE_TO_PREFIX[family][styleOrPrefix] || STYLE_TO_PREFIX[family][style];
  const defined = styleOrPrefix in namespace.styles ? styleOrPrefix : null;
  const result = prefix || defined || null;
  return result;
}
function moveNonFaClassesToRest(classNames) {
  let rest = [];
  let iconName = null;
  classNames.forEach((cls) => {
    const result = getIconName(config.cssPrefix, cls);
    if (result) {
      iconName = result;
    } else if (cls) {
      rest.push(cls);
    }
  });
  return {
    iconName,
    rest
  };
}
function sortedUniqueValues(arr) {
  return arr.sort().filter((value, index, arr2) => {
    return arr2.indexOf(value) === index;
  });
}
function getCanonicalIcon(values) {
  let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    skipLookups = false
  } = params;
  let givenPrefix = null;
  const faCombinedClasses = Ia.concat(bt$1);
  const faStyleOrFamilyClasses = sortedUniqueValues(values.filter((cls) => faCombinedClasses.includes(cls)));
  const nonStyleOrFamilyClasses = sortedUniqueValues(values.filter((cls) => !Ia.includes(cls)));
  const faStyles = faStyleOrFamilyClasses.filter((cls) => {
    givenPrefix = cls;
    return !P.includes(cls);
  });
  const [styleFromValues = null] = faStyles;
  const family = getFamilyId(faStyleOrFamilyClasses);
  const canonical = _objectSpread2(_objectSpread2({}, moveNonFaClassesToRest(nonStyleOrFamilyClasses)), {}, {
    prefix: getCanonicalPrefix(styleFromValues, {
      family
    })
  });
  return _objectSpread2(_objectSpread2(_objectSpread2({}, canonical), getDefaultCanonicalPrefix({
    values,
    family,
    styles,
    config,
    canonical,
    givenPrefix
  })), applyShimAndAlias(skipLookups, givenPrefix, canonical));
}
function applyShimAndAlias(skipLookups, givenPrefix, canonical) {
  let {
    prefix,
    iconName
  } = canonical;
  if (skipLookups || !prefix || !iconName) {
    return {
      prefix,
      iconName
    };
  }
  const shim = givenPrefix === "fa" ? byOldName(iconName) : {};
  const aliasIconName = byAlias(prefix, iconName);
  iconName = shim.iconName || aliasIconName || iconName;
  prefix = shim.prefix || prefix;
  if (prefix === "far" && !styles["far"] && styles["fas"] && !config.autoFetchSvg) {
    prefix = "fas";
  }
  return {
    prefix,
    iconName
  };
}
var newCanonicalFamilies = L.filter((familyId) => {
  return familyId !== s || familyId !== t;
});
var newCanonicalStyles = Object.keys(ga).filter((key) => key !== s).map((key) => Object.keys(ga[key])).flat();
function getDefaultCanonicalPrefix(prefixOptions) {
  const {
    values,
    family,
    canonical,
    givenPrefix = "",
    styles: styles2 = {},
    config: config$$1 = {}
  } = prefixOptions;
  const isDuotoneFamily = family === t;
  const valuesHasDuotone = values.includes("fa-duotone") || values.includes("fad");
  const defaultFamilyIsDuotone = config$$1.familyDefault === "duotone";
  const canonicalPrefixIsDuotone = canonical.prefix === "fad" || canonical.prefix === "fa-duotone";
  if (!isDuotoneFamily && (valuesHasDuotone || defaultFamilyIsDuotone || canonicalPrefixIsDuotone)) {
    canonical.prefix = "fad";
  }
  if (values.includes("fa-brands") || values.includes("fab")) {
    canonical.prefix = "fab";
  }
  if (!canonical.prefix && newCanonicalFamilies.includes(family)) {
    const validPrefix = Object.keys(styles2).find((key) => newCanonicalStyles.includes(key));
    if (validPrefix || config$$1.autoFetchSvg) {
      const defaultPrefix = pt.get(family).defaultShortPrefixId;
      canonical.prefix = defaultPrefix;
      canonical.iconName = byAlias(canonical.prefix, canonical.iconName) || canonical.iconName;
    }
  }
  if (canonical.prefix === "fa" || givenPrefix === "fa") {
    canonical.prefix = getDefaultUsablePrefix() || "fas";
  }
  return canonical;
}
var Library = class {
  constructor() {
    this.definitions = {};
  }
  add() {
    for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
      definitions[_key] = arguments[_key];
    }
    const additions = definitions.reduce(this._pullDefinitions, {});
    Object.keys(additions).forEach((key) => {
      this.definitions[key] = _objectSpread2(_objectSpread2({}, this.definitions[key] || {}), additions[key]);
      defineIcons(key, additions[key]);
      const longPrefix = PREFIX_TO_LONG_STYLE[s][key];
      if (longPrefix) defineIcons(longPrefix, additions[key]);
      build();
    });
  }
  reset() {
    this.definitions = {};
  }
  _pullDefinitions(additions, definition) {
    const normalized = definition.prefix && definition.iconName && definition.icon ? {
      0: definition
    } : definition;
    Object.keys(normalized).map((key) => {
      const {
        prefix,
        iconName,
        icon: icon2
      } = normalized[key];
      const aliases = icon2[2];
      if (!additions[prefix]) additions[prefix] = {};
      if (aliases.length > 0) {
        aliases.forEach((alias) => {
          if (typeof alias === "string") {
            additions[prefix][alias] = icon2;
          }
        });
      }
      additions[prefix][iconName] = icon2;
    });
    return additions;
  }
};
var _plugins = [];
var _hooks = {};
var providers = {};
var defaultProviderKeys = Object.keys(providers);
function registerPlugins(nextPlugins, _ref) {
  let {
    mixoutsTo: obj
  } = _ref;
  _plugins = nextPlugins;
  _hooks = {};
  Object.keys(providers).forEach((k) => {
    if (defaultProviderKeys.indexOf(k) === -1) {
      delete providers[k];
    }
  });
  _plugins.forEach((plugin) => {
    const mixout = plugin.mixout ? plugin.mixout() : {};
    Object.keys(mixout).forEach((tk) => {
      if (typeof mixout[tk] === "function") {
        obj[tk] = mixout[tk];
      }
      if (typeof mixout[tk] === "object") {
        Object.keys(mixout[tk]).forEach((sk) => {
          if (!obj[tk]) {
            obj[tk] = {};
          }
          obj[tk][sk] = mixout[tk][sk];
        });
      }
    });
    if (plugin.hooks) {
      const hooks = plugin.hooks();
      Object.keys(hooks).forEach((hook) => {
        if (!_hooks[hook]) {
          _hooks[hook] = [];
        }
        _hooks[hook].push(hooks[hook]);
      });
    }
    if (plugin.provides) {
      plugin.provides(providers);
    }
  });
  return obj;
}
function chainHooks(hook, accumulator) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  const hookFns = _hooks[hook] || [];
  hookFns.forEach((hookFn) => {
    accumulator = hookFn.apply(null, [accumulator, ...args]);
  });
  return accumulator;
}
function callHooks(hook) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  const hookFns = _hooks[hook] || [];
  hookFns.forEach((hookFn) => {
    hookFn.apply(null, args);
  });
  return void 0;
}
function callProvided() {
  const hook = arguments[0];
  const args = Array.prototype.slice.call(arguments, 1);
  return providers[hook] ? providers[hook].apply(null, args) : void 0;
}
function findIconDefinition(iconLookup) {
  if (iconLookup.prefix === "fa") {
    iconLookup.prefix = "fas";
  }
  let {
    iconName
  } = iconLookup;
  const prefix = iconLookup.prefix || getDefaultUsablePrefix();
  if (!iconName) return;
  iconName = byAlias(prefix, iconName) || iconName;
  return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}
var library = new Library();
var noAuto = () => {
  config.autoReplaceSvg = false;
  config.observeMutations = false;
  callHooks("noAuto");
};
var dom = {
  i2svg: function() {
    let params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (IS_DOM) {
      callHooks("beforeI2svg", params);
      callProvided("pseudoElements2svg", params);
      return callProvided("i2svg", params);
    } else {
      return Promise.reject(new Error("Operation requires a DOM of some kind."));
    }
  },
  watch: function() {
    let params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const {
      autoReplaceSvgRoot
    } = params;
    if (config.autoReplaceSvg === false) {
      config.autoReplaceSvg = true;
    }
    config.observeMutations = true;
    domready(() => {
      autoReplace({
        autoReplaceSvgRoot
      });
      callHooks("watch", params);
    });
  }
};
var parse = {
  icon: (icon2) => {
    if (icon2 === null) {
      return null;
    }
    if (typeof icon2 === "object" && icon2.prefix && icon2.iconName) {
      return {
        prefix: icon2.prefix,
        iconName: byAlias(icon2.prefix, icon2.iconName) || icon2.iconName
      };
    }
    if (Array.isArray(icon2) && icon2.length === 2) {
      const iconName = icon2[1].indexOf("fa-") === 0 ? icon2[1].slice(3) : icon2[1];
      const prefix = getCanonicalPrefix(icon2[0]);
      return {
        prefix,
        iconName: byAlias(prefix, iconName) || iconName
      };
    }
    if (typeof icon2 === "string" && (icon2.indexOf("".concat(config.cssPrefix, "-")) > -1 || icon2.match(ICON_SELECTION_SYNTAX_PATTERN))) {
      const canonicalIcon = getCanonicalIcon(icon2.split(" "), {
        skipLookups: true
      });
      return {
        prefix: canonicalIcon.prefix || getDefaultUsablePrefix(),
        iconName: byAlias(canonicalIcon.prefix, canonicalIcon.iconName) || canonicalIcon.iconName
      };
    }
    if (typeof icon2 === "string") {
      const prefix = getDefaultUsablePrefix();
      return {
        prefix,
        iconName: byAlias(prefix, icon2) || icon2
      };
    }
  }
};
var api = {
  noAuto,
  config,
  dom,
  parse,
  library,
  findIconDefinition,
  toHtml
};
var autoReplace = function() {
  let params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const {
    autoReplaceSvgRoot = DOCUMENT2
  } = params;
  if ((Object.keys(namespace.styles).length > 0 || config.autoFetchSvg) && IS_DOM && config.autoReplaceSvg) api.dom.i2svg({
    node: autoReplaceSvgRoot
  });
};
function domVariants(val, abstractCreator) {
  Object.defineProperty(val, "abstract", {
    get: abstractCreator
  });
  Object.defineProperty(val, "html", {
    get: function() {
      return val.abstract.map((a) => toHtml(a));
    }
  });
  Object.defineProperty(val, "node", {
    get: function() {
      if (!IS_DOM) return;
      const container = DOCUMENT2.createElement("div");
      container.innerHTML = val.html;
      return container.children;
    }
  });
  return val;
}
function asIcon(_ref) {
  let {
    children,
    main,
    mask,
    attributes,
    styles: styles2,
    transform
  } = _ref;
  if (transformIsMeaningful(transform) && main.found && !mask.found) {
    const {
      width,
      height
    } = main;
    const offset = {
      x: width / height / 2,
      y: 0.5
    };
    attributes["style"] = joinStyles(_objectSpread2(_objectSpread2({}, styles2), {}, {
      "transform-origin": "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
    }));
  }
  return [{
    tag: "svg",
    attributes,
    children
  }];
}
function asSymbol(_ref) {
  let {
    prefix,
    iconName,
    children,
    attributes,
    symbol
  } = _ref;
  const id = symbol === true ? "".concat(prefix, "-").concat(config.cssPrefix, "-").concat(iconName) : symbol;
  return [{
    tag: "svg",
    attributes: {
      style: "display: none;"
    },
    children: [{
      tag: "symbol",
      attributes: _objectSpread2(_objectSpread2({}, attributes), {}, {
        id
      }),
      children
    }]
  }];
}
function makeInlineSvgAbstract(params) {
  const {
    icons: {
      main,
      mask
    },
    prefix,
    iconName,
    transform,
    symbol,
    title,
    maskId,
    titleId,
    extra,
    watchable = false
  } = params;
  const {
    width,
    height
  } = mask.found ? mask : main;
  const isUploadedIcon = Lt.includes(prefix);
  const attrClass = [config.replacementClass, iconName ? "".concat(config.cssPrefix, "-").concat(iconName) : ""].filter((c$$1) => extra.classes.indexOf(c$$1) === -1).filter((c$$1) => c$$1 !== "" || !!c$$1).concat(extra.classes).join(" ");
  let content = {
    children: [],
    attributes: _objectSpread2(_objectSpread2({}, extra.attributes), {}, {
      "data-prefix": prefix,
      "data-icon": iconName,
      "class": attrClass,
      "role": extra.attributes.role || "img",
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 ".concat(width, " ").concat(height)
    })
  };
  const uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf("fa-fw") ? {
    width: "".concat(width / height * 16 * 0.0625, "em")
  } : {};
  if (watchable) {
    content.attributes[DATA_FA_I2SVG] = "";
  }
  if (title) {
    content.children.push({
      tag: "title",
      attributes: {
        id: content.attributes["aria-labelledby"] || "title-".concat(titleId || nextUniqueId())
      },
      children: [title]
    });
    delete content.attributes.title;
  }
  const args = _objectSpread2(_objectSpread2({}, content), {}, {
    prefix,
    iconName,
    main,
    mask,
    maskId,
    transform,
    symbol,
    styles: _objectSpread2(_objectSpread2({}, uploadedIconWidthStyle), extra.styles)
  });
  const {
    children,
    attributes
  } = mask.found && main.found ? callProvided("generateAbstractMask", args) || {
    children: [],
    attributes: {}
  } : callProvided("generateAbstractIcon", args) || {
    children: [],
    attributes: {}
  };
  args.children = children;
  args.attributes = attributes;
  if (symbol) {
    return asSymbol(args);
  } else {
    return asIcon(args);
  }
}
function makeLayersTextAbstract(params) {
  const {
    content,
    width,
    height,
    transform,
    title,
    extra,
    watchable = false
  } = params;
  const attributes = _objectSpread2(_objectSpread2(_objectSpread2({}, extra.attributes), title ? {
    "title": title
  } : {}), {}, {
    "class": extra.classes.join(" ")
  });
  if (watchable) {
    attributes[DATA_FA_I2SVG] = "";
  }
  const styles2 = _objectSpread2({}, extra.styles);
  if (transformIsMeaningful(transform)) {
    styles2["transform"] = transformForCss({
      transform,
      startCentered: true,
      width,
      height
    });
    styles2["-webkit-transform"] = styles2["transform"];
  }
  const styleString = joinStyles(styles2);
  if (styleString.length > 0) {
    attributes["style"] = styleString;
  }
  const val = [];
  val.push({
    tag: "span",
    attributes,
    children: [content]
  });
  if (title) {
    val.push({
      tag: "span",
      attributes: {
        class: "sr-only"
      },
      children: [title]
    });
  }
  return val;
}
function makeLayersCounterAbstract(params) {
  const {
    content,
    title,
    extra
  } = params;
  const attributes = _objectSpread2(_objectSpread2(_objectSpread2({}, extra.attributes), title ? {
    "title": title
  } : {}), {}, {
    "class": extra.classes.join(" ")
  });
  const styleString = joinStyles(extra.styles);
  if (styleString.length > 0) {
    attributes["style"] = styleString;
  }
  const val = [];
  val.push({
    tag: "span",
    attributes,
    children: [content]
  });
  if (title) {
    val.push({
      tag: "span",
      attributes: {
        class: "sr-only"
      },
      children: [title]
    });
  }
  return val;
}
var {
  styles: styles$1
} = namespace;
function asFoundIcon(icon2) {
  const width = icon2[0];
  const height = icon2[1];
  const [vectorData] = icon2.slice(4);
  let element = null;
  if (Array.isArray(vectorData)) {
    element = {
      tag: "g",
      attributes: {
        class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
      },
      children: [{
        tag: "path",
        attributes: {
          class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
          fill: "currentColor",
          d: vectorData[0]
        }
      }, {
        tag: "path",
        attributes: {
          class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
          fill: "currentColor",
          d: vectorData[1]
        }
      }]
    };
  } else {
    element = {
      tag: "path",
      attributes: {
        fill: "currentColor",
        d: vectorData
      }
    };
  }
  return {
    found: true,
    width,
    height,
    icon: element
  };
}
var missingIconResolutionMixin = {
  found: false,
  width: 512,
  height: 512
};
function maybeNotifyMissing(iconName, prefix) {
  if (!PRODUCTION && !config.showMissingIcons && iconName) {
    console.error('Icon with name "'.concat(iconName, '" and prefix "').concat(prefix, '" is missing.'));
  }
}
function findIcon(iconName, prefix) {
  let givenPrefix = prefix;
  if (prefix === "fa" && config.styleDefault !== null) {
    prefix = getDefaultUsablePrefix();
  }
  return new Promise((resolve, reject) => {
    if (givenPrefix === "fa") {
      const shim = byOldName(iconName) || {};
      iconName = shim.iconName || iconName;
      prefix = shim.prefix || prefix;
    }
    if (iconName && prefix && styles$1[prefix] && styles$1[prefix][iconName]) {
      const icon2 = styles$1[prefix][iconName];
      return resolve(asFoundIcon(icon2));
    }
    maybeNotifyMissing(iconName, prefix);
    resolve(_objectSpread2(_objectSpread2({}, missingIconResolutionMixin), {}, {
      icon: config.showMissingIcons && iconName ? callProvided("missingIconAbstract") || {} : {}
    }));
  });
}
var noop$1 = () => {
};
var p$2 = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
  mark: noop$1,
  measure: noop$1
};
var preamble = 'FA "6.7.2"';
var begin = (name) => {
  p$2.mark("".concat(preamble, " ").concat(name, " begins"));
  return () => end(name);
};
var end = (name) => {
  p$2.mark("".concat(preamble, " ").concat(name, " ends"));
  p$2.measure("".concat(preamble, " ").concat(name), "".concat(preamble, " ").concat(name, " begins"), "".concat(preamble, " ").concat(name, " ends"));
};
var perf = {
  begin,
  end
};
var noop$2 = () => {
};
function isWatched(node) {
  const i2svg = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;
  return typeof i2svg === "string";
}
function hasPrefixAndIcon(node) {
  const prefix = node.getAttribute ? node.getAttribute(DATA_PREFIX) : null;
  const icon2 = node.getAttribute ? node.getAttribute(DATA_ICON) : null;
  return prefix && icon2;
}
function hasBeenReplaced(node) {
  return node && node.classList && node.classList.contains && node.classList.contains(config.replacementClass);
}
function getMutator() {
  if (config.autoReplaceSvg === true) {
    return mutators.replace;
  }
  const mutator = mutators[config.autoReplaceSvg];
  return mutator || mutators.replace;
}
function createElementNS(tag) {
  return DOCUMENT2.createElementNS("http://www.w3.org/2000/svg", tag);
}
function createElement(tag) {
  return DOCUMENT2.createElement(tag);
}
function convertSVG(abstractObj) {
  let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    ceFn = abstractObj.tag === "svg" ? createElementNS : createElement
  } = params;
  if (typeof abstractObj === "string") {
    return DOCUMENT2.createTextNode(abstractObj);
  }
  const tag = ceFn(abstractObj.tag);
  Object.keys(abstractObj.attributes || []).forEach(function(key) {
    tag.setAttribute(key, abstractObj.attributes[key]);
  });
  const children = abstractObj.children || [];
  children.forEach(function(child) {
    tag.appendChild(convertSVG(child, {
      ceFn
    }));
  });
  return tag;
}
function nodeAsComment(node) {
  let comment = " ".concat(node.outerHTML, " ");
  comment = "".concat(comment, "Font Awesome fontawesome.com ");
  return comment;
}
var mutators = {
  replace: function(mutation) {
    const node = mutation[0];
    if (node.parentNode) {
      mutation[1].forEach((abstract) => {
        node.parentNode.insertBefore(convertSVG(abstract), node);
      });
      if (node.getAttribute(DATA_FA_I2SVG) === null && config.keepOriginalSource) {
        let comment = DOCUMENT2.createComment(nodeAsComment(node));
        node.parentNode.replaceChild(comment, node);
      } else {
        node.remove();
      }
    }
  },
  nest: function(mutation) {
    const node = mutation[0];
    const abstract = mutation[1];
    if (~classArray(node).indexOf(config.replacementClass)) {
      return mutators.replace(mutation);
    }
    const forSvg = new RegExp("".concat(config.cssPrefix, "-.*"));
    delete abstract[0].attributes.id;
    if (abstract[0].attributes.class) {
      const splitClasses = abstract[0].attributes.class.split(" ").reduce((acc, cls) => {
        if (cls === config.replacementClass || cls.match(forSvg)) {
          acc.toSvg.push(cls);
        } else {
          acc.toNode.push(cls);
        }
        return acc;
      }, {
        toNode: [],
        toSvg: []
      });
      abstract[0].attributes.class = splitClasses.toSvg.join(" ");
      if (splitClasses.toNode.length === 0) {
        node.removeAttribute("class");
      } else {
        node.setAttribute("class", splitClasses.toNode.join(" "));
      }
    }
    const newInnerHTML = abstract.map((a) => toHtml(a)).join("\n");
    node.setAttribute(DATA_FA_I2SVG, "");
    node.innerHTML = newInnerHTML;
  }
};
function performOperationSync(op) {
  op();
}
function perform(mutations, callback) {
  const callbackFunction = typeof callback === "function" ? callback : noop$2;
  if (mutations.length === 0) {
    callbackFunction();
  } else {
    let frame = performOperationSync;
    if (config.mutateApproach === MUTATION_APPROACH_ASYNC) {
      frame = WINDOW.requestAnimationFrame || performOperationSync;
    }
    frame(() => {
      const mutator = getMutator();
      const mark = perf.begin("mutate");
      mutations.map(mutator);
      mark();
      callbackFunction();
    });
  }
}
var disabled = false;
function disableObservation() {
  disabled = true;
}
function enableObservation() {
  disabled = false;
}
var mo = null;
function observe(options) {
  if (!MUTATION_OBSERVER) {
    return;
  }
  if (!config.observeMutations) {
    return;
  }
  const {
    treeCallback = noop$2,
    nodeCallback = noop$2,
    pseudoElementsCallback = noop$2,
    observeMutationsRoot = DOCUMENT2
  } = options;
  mo = new MUTATION_OBSERVER((objects) => {
    if (disabled) return;
    const defaultPrefix = getDefaultUsablePrefix();
    toArray(objects).forEach((mutationRecord) => {
      if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
        if (config.searchPseudoElements) {
          pseudoElementsCallback(mutationRecord.target);
        }
        treeCallback(mutationRecord.target);
      }
      if (mutationRecord.type === "attributes" && mutationRecord.target.parentNode && config.searchPseudoElements) {
        pseudoElementsCallback(mutationRecord.target.parentNode);
      }
      if (mutationRecord.type === "attributes" && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
        if (mutationRecord.attributeName === "class" && hasPrefixAndIcon(mutationRecord.target)) {
          const {
            prefix,
            iconName
          } = getCanonicalIcon(classArray(mutationRecord.target));
          mutationRecord.target.setAttribute(DATA_PREFIX, prefix || defaultPrefix);
          if (iconName) mutationRecord.target.setAttribute(DATA_ICON, iconName);
        } else if (hasBeenReplaced(mutationRecord.target)) {
          nodeCallback(mutationRecord.target);
        }
      }
    });
  });
  if (!IS_DOM) return;
  mo.observe(observeMutationsRoot, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true
  });
}
function disconnect() {
  if (!mo) return;
  mo.disconnect();
}
function styleParser(node) {
  const style = node.getAttribute("style");
  let val = [];
  if (style) {
    val = style.split(";").reduce((acc, style2) => {
      const styles2 = style2.split(":");
      const prop = styles2[0];
      const value = styles2.slice(1);
      if (prop && value.length > 0) {
        acc[prop] = value.join(":").trim();
      }
      return acc;
    }, {});
  }
  return val;
}
function classParser(node) {
  const existingPrefix = node.getAttribute("data-prefix");
  const existingIconName = node.getAttribute("data-icon");
  const innerText = node.innerText !== void 0 ? node.innerText.trim() : "";
  let val = getCanonicalIcon(classArray(node));
  if (!val.prefix) {
    val.prefix = getDefaultUsablePrefix();
  }
  if (existingPrefix && existingIconName) {
    val.prefix = existingPrefix;
    val.iconName = existingIconName;
  }
  if (val.iconName && val.prefix) {
    return val;
  }
  if (val.prefix && innerText.length > 0) {
    val.iconName = byLigature(val.prefix, node.innerText) || byUnicode(val.prefix, toHex(node.innerText));
  }
  if (!val.iconName && config.autoFetchSvg && node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) {
    val.iconName = node.firstChild.data;
  }
  return val;
}
function attributesParser(node) {
  const extraAttributes = toArray(node.attributes).reduce((acc, attr) => {
    if (acc.name !== "class" && acc.name !== "style") {
      acc[attr.name] = attr.value;
    }
    return acc;
  }, {});
  const title = node.getAttribute("title");
  const titleId = node.getAttribute("data-fa-title-id");
  if (config.autoA11y) {
    if (title) {
      extraAttributes["aria-labelledby"] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
    } else {
      extraAttributes["aria-hidden"] = "true";
      extraAttributes["focusable"] = "false";
    }
  }
  return extraAttributes;
}
function blankMeta() {
  return {
    iconName: null,
    title: null,
    titleId: null,
    prefix: null,
    transform: meaninglessTransform,
    symbol: false,
    mask: {
      iconName: null,
      prefix: null,
      rest: []
    },
    maskId: null,
    extra: {
      classes: [],
      styles: {},
      attributes: {}
    }
  };
}
function parseMeta(node) {
  let parser = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
    styleParser: true
  };
  const {
    iconName,
    prefix,
    rest: extraClasses
  } = classParser(node);
  const extraAttributes = attributesParser(node);
  const pluginMeta = chainHooks("parseNodeAttributes", {}, node);
  let extraStyles = parser.styleParser ? styleParser(node) : [];
  return _objectSpread2({
    iconName,
    title: node.getAttribute("title"),
    titleId: node.getAttribute("data-fa-title-id"),
    prefix,
    transform: meaninglessTransform,
    mask: {
      iconName: null,
      prefix: null,
      rest: []
    },
    maskId: null,
    symbol: false,
    extra: {
      classes: extraClasses,
      styles: extraStyles,
      attributes: extraAttributes
    }
  }, pluginMeta);
}
var {
  styles: styles$2
} = namespace;
function generateMutation(node) {
  const nodeMeta = config.autoReplaceSvg === "nest" ? parseMeta(node, {
    styleParser: false
  }) : parseMeta(node);
  if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
    return callProvided("generateLayersText", node, nodeMeta);
  } else {
    return callProvided("generateSvgReplacementMutation", node, nodeMeta);
  }
}
function getKnownPrefixes() {
  return [...Ft, ...Ia];
}
function onTree(root) {
  let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  if (!IS_DOM) return Promise.resolve();
  const htmlClassList = DOCUMENT2.documentElement.classList;
  const hclAdd = (suffix) => htmlClassList.add("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
  const hclRemove = (suffix) => htmlClassList.remove("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
  const prefixes = config.autoFetchSvg ? getKnownPrefixes() : P.concat(Object.keys(styles$2));
  if (!prefixes.includes("fa")) {
    prefixes.push("fa");
  }
  const prefixesDomQuery = [".".concat(LAYERS_TEXT_CLASSNAME, ":not([").concat(DATA_FA_I2SVG, "])")].concat(prefixes.map((p$$1) => ".".concat(p$$1, ":not([").concat(DATA_FA_I2SVG, "])"))).join(", ");
  if (prefixesDomQuery.length === 0) {
    return Promise.resolve();
  }
  let candidates = [];
  try {
    candidates = toArray(root.querySelectorAll(prefixesDomQuery));
  } catch (e$$1) {
  }
  if (candidates.length > 0) {
    hclAdd("pending");
    hclRemove("complete");
  } else {
    return Promise.resolve();
  }
  const mark = perf.begin("onTree");
  const mutations = candidates.reduce((acc, node) => {
    try {
      const mutation = generateMutation(node);
      if (mutation) {
        acc.push(mutation);
      }
    } catch (e$$1) {
      if (!PRODUCTION) {
        if (e$$1.name === "MissingIcon") {
          console.error(e$$1);
        }
      }
    }
    return acc;
  }, []);
  return new Promise((resolve, reject) => {
    Promise.all(mutations).then((resolvedMutations) => {
      perform(resolvedMutations, () => {
        hclAdd("active");
        hclAdd("complete");
        hclRemove("pending");
        if (typeof callback === "function") callback();
        mark();
        resolve();
      });
    }).catch((e$$1) => {
      mark();
      reject(e$$1);
    });
  });
}
function onNode(node) {
  let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  generateMutation(node).then((mutation) => {
    if (mutation) {
      perform([mutation], callback);
    }
  });
}
function resolveIcons(next) {
  return function(maybeIconDefinition) {
    let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
    let {
      mask
    } = params;
    if (mask) {
      mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
    }
    return next(iconDefinition, _objectSpread2(_objectSpread2({}, params), {}, {
      mask
    }));
  };
}
var render = function(iconDefinition) {
  let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    transform = meaninglessTransform,
    symbol = false,
    mask = null,
    maskId = null,
    title = null,
    titleId = null,
    classes = [],
    attributes = {},
    styles: styles2 = {}
  } = params;
  if (!iconDefinition) return;
  const {
    prefix,
    iconName,
    icon: icon2
  } = iconDefinition;
  return domVariants(_objectSpread2({
    type: "icon"
  }, iconDefinition), () => {
    callHooks("beforeDOMElementCreation", {
      iconDefinition,
      params
    });
    if (config.autoA11y) {
      if (title) {
        attributes["aria-labelledby"] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
      } else {
        attributes["aria-hidden"] = "true";
        attributes["focusable"] = "false";
      }
    }
    return makeInlineSvgAbstract({
      icons: {
        main: asFoundIcon(icon2),
        mask: mask ? asFoundIcon(mask.icon) : {
          found: false,
          width: null,
          height: null,
          icon: {}
        }
      },
      prefix,
      iconName,
      transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
      symbol,
      title,
      maskId,
      titleId,
      extra: {
        attributes,
        styles: styles2,
        classes
      }
    });
  });
};
var ReplaceElements = {
  mixout() {
    return {
      icon: resolveIcons(render)
    };
  },
  hooks() {
    return {
      mutationObserverCallbacks(accumulator) {
        accumulator.treeCallback = onTree;
        accumulator.nodeCallback = onNode;
        return accumulator;
      }
    };
  },
  provides(providers$$1) {
    providers$$1.i2svg = function(params) {
      const {
        node = DOCUMENT2,
        callback = () => {
        }
      } = params;
      return onTree(node, callback);
    };
    providers$$1.generateSvgReplacementMutation = function(node, nodeMeta) {
      const {
        iconName,
        title,
        titleId,
        prefix,
        transform,
        symbol,
        mask,
        maskId,
        extra
      } = nodeMeta;
      return new Promise((resolve, reject) => {
        Promise.all([findIcon(iconName, prefix), mask.iconName ? findIcon(mask.iconName, mask.prefix) : Promise.resolve({
          found: false,
          width: 512,
          height: 512,
          icon: {}
        })]).then((_ref) => {
          let [main, mask2] = _ref;
          resolve([node, makeInlineSvgAbstract({
            icons: {
              main,
              mask: mask2
            },
            prefix,
            iconName,
            transform,
            symbol,
            maskId,
            title,
            titleId,
            extra,
            watchable: true
          })]);
        }).catch(reject);
      });
    };
    providers$$1.generateAbstractIcon = function(_ref2) {
      let {
        children,
        attributes,
        main,
        transform,
        styles: styles2
      } = _ref2;
      const styleString = joinStyles(styles2);
      if (styleString.length > 0) {
        attributes["style"] = styleString;
      }
      let nextChild;
      if (transformIsMeaningful(transform)) {
        nextChild = callProvided("generateAbstractTransformGrouping", {
          main,
          transform,
          containerWidth: main.width,
          iconWidth: main.width
        });
      }
      children.push(nextChild || main.icon);
      return {
        children,
        attributes
      };
    };
  }
};
var Layers = {
  mixout() {
    return {
      layer(assembler) {
        let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const {
          classes = []
        } = params;
        return domVariants({
          type: "layer"
        }, () => {
          callHooks("beforeDOMElementCreation", {
            assembler,
            params
          });
          let children = [];
          assembler((args) => {
            Array.isArray(args) ? args.map((a) => {
              children = children.concat(a.abstract);
            }) : children = children.concat(args.abstract);
          });
          return [{
            tag: "span",
            attributes: {
              class: ["".concat(config.cssPrefix, "-layers"), ...classes].join(" ")
            },
            children
          }];
        });
      }
    };
  }
};
var LayersCounter = {
  mixout() {
    return {
      counter(content) {
        let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const {
          title = null,
          classes = [],
          attributes = {},
          styles: styles2 = {}
        } = params;
        return domVariants({
          type: "counter",
          content
        }, () => {
          callHooks("beforeDOMElementCreation", {
            content,
            params
          });
          return makeLayersCounterAbstract({
            content: content.toString(),
            title,
            extra: {
              attributes,
              styles: styles2,
              classes: ["".concat(config.cssPrefix, "-layers-counter"), ...classes]
            }
          });
        });
      }
    };
  }
};
var LayersText = {
  mixout() {
    return {
      text(content) {
        let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const {
          transform = meaninglessTransform,
          title = null,
          classes = [],
          attributes = {},
          styles: styles2 = {}
        } = params;
        return domVariants({
          type: "text",
          content
        }, () => {
          callHooks("beforeDOMElementCreation", {
            content,
            params
          });
          return makeLayersTextAbstract({
            content,
            transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
            title,
            extra: {
              attributes,
              styles: styles2,
              classes: ["".concat(config.cssPrefix, "-layers-text"), ...classes]
            }
          });
        });
      }
    };
  },
  provides(providers$$1) {
    providers$$1.generateLayersText = function(node, nodeMeta) {
      const {
        title,
        transform,
        extra
      } = nodeMeta;
      let width = null;
      let height = null;
      if (IS_IE) {
        const computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
        const boundingClientRect = node.getBoundingClientRect();
        width = boundingClientRect.width / computedFontSize;
        height = boundingClientRect.height / computedFontSize;
      }
      if (config.autoA11y && !title) {
        extra.attributes["aria-hidden"] = "true";
      }
      return Promise.resolve([node, makeLayersTextAbstract({
        content: node.innerHTML,
        width,
        height,
        transform,
        title,
        extra,
        watchable: true
      })]);
    };
  }
};
var CLEAN_CONTENT_PATTERN = new RegExp('"', "ug");
var SECONDARY_UNICODE_RANGE = [1105920, 1112319];
var _FONT_FAMILY_WEIGHT_TO_PREFIX = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, {
  FontAwesome: {
    normal: "fas",
    400: "fas"
  }
}), lt), wa), Yt);
var FONT_FAMILY_WEIGHT_TO_PREFIX = Object.keys(_FONT_FAMILY_WEIGHT_TO_PREFIX).reduce((acc, key) => {
  acc[key.toLowerCase()] = _FONT_FAMILY_WEIGHT_TO_PREFIX[key];
  return acc;
}, {});
var FONT_FAMILY_WEIGHT_FALLBACK = Object.keys(FONT_FAMILY_WEIGHT_TO_PREFIX).reduce((acc, fontFamily) => {
  const weights = FONT_FAMILY_WEIGHT_TO_PREFIX[fontFamily];
  acc[fontFamily] = weights[900] || [...Object.entries(weights)][0][1];
  return acc;
}, {});
function hexValueFromContent(content) {
  const cleaned = content.replace(CLEAN_CONTENT_PATTERN, "");
  const codePoint = codePointAt(cleaned, 0);
  const isPrependTen = codePoint >= SECONDARY_UNICODE_RANGE[0] && codePoint <= SECONDARY_UNICODE_RANGE[1];
  const isDoubled = cleaned.length === 2 ? cleaned[0] === cleaned[1] : false;
  return {
    value: isDoubled ? toHex(cleaned[0]) : toHex(cleaned),
    isSecondary: isPrependTen || isDoubled
  };
}
function getPrefix(fontFamily, fontWeight) {
  const fontFamilySanitized = fontFamily.replace(/^['"]|['"]$/g, "").toLowerCase();
  const fontWeightInteger = parseInt(fontWeight);
  const fontWeightSanitized = isNaN(fontWeightInteger) ? "normal" : fontWeightInteger;
  return (FONT_FAMILY_WEIGHT_TO_PREFIX[fontFamilySanitized] || {})[fontWeightSanitized] || FONT_FAMILY_WEIGHT_FALLBACK[fontFamilySanitized];
}
function replaceForPosition(node, position) {
  const pendingAttribute = "".concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(":", "-"));
  return new Promise((resolve, reject) => {
    if (node.getAttribute(pendingAttribute) !== null) {
      return resolve();
    }
    const children = toArray(node.children);
    const alreadyProcessedPseudoElement = children.filter((c$$1) => c$$1.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position)[0];
    const styles2 = WINDOW.getComputedStyle(node, position);
    const fontFamily = styles2.getPropertyValue("font-family");
    const fontFamilyMatch = fontFamily.match(FONT_FAMILY_PATTERN);
    const fontWeight = styles2.getPropertyValue("font-weight");
    const content = styles2.getPropertyValue("content");
    if (alreadyProcessedPseudoElement && !fontFamilyMatch) {
      node.removeChild(alreadyProcessedPseudoElement);
      return resolve();
    } else if (fontFamilyMatch && content !== "none" && content !== "") {
      const content2 = styles2.getPropertyValue("content");
      let prefix = getPrefix(fontFamily, fontWeight);
      const {
        value: hexValue,
        isSecondary
      } = hexValueFromContent(content2);
      const isV4 = fontFamilyMatch[0].startsWith("FontAwesome");
      let iconName = byUnicode(prefix, hexValue);
      let iconIdentifier = iconName;
      if (isV4) {
        const iconName4 = byOldUnicode(hexValue);
        if (iconName4.iconName && iconName4.prefix) {
          iconName = iconName4.iconName;
          prefix = iconName4.prefix;
        }
      }
      if (iconName && !isSecondary && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
        node.setAttribute(pendingAttribute, iconIdentifier);
        if (alreadyProcessedPseudoElement) {
          node.removeChild(alreadyProcessedPseudoElement);
        }
        const meta = blankMeta();
        const {
          extra
        } = meta;
        extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position;
        findIcon(iconName, prefix).then((main) => {
          const abstract = makeInlineSvgAbstract(_objectSpread2(_objectSpread2({}, meta), {}, {
            icons: {
              main,
              mask: emptyCanonicalIcon()
            },
            prefix,
            iconName: iconIdentifier,
            extra,
            watchable: true
          }));
          const element = DOCUMENT2.createElementNS("http://www.w3.org/2000/svg", "svg");
          if (position === "::before") {
            node.insertBefore(element, node.firstChild);
          } else {
            node.appendChild(element);
          }
          element.outerHTML = abstract.map((a$$1) => toHtml(a$$1)).join("\n");
          node.removeAttribute(pendingAttribute);
          resolve();
        }).catch(reject);
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
}
function replace(node) {
  return Promise.all([replaceForPosition(node, "::before"), replaceForPosition(node, "::after")]);
}
function processable(node) {
  return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== "svg");
}
function searchPseudoElements(root) {
  if (!IS_DOM) return;
  return new Promise((resolve, reject) => {
    const operations = toArray(root.querySelectorAll("*")).filter(processable).map(replace);
    const end2 = perf.begin("searchPseudoElements");
    disableObservation();
    Promise.all(operations).then(() => {
      end2();
      enableObservation();
      resolve();
    }).catch(() => {
      end2();
      enableObservation();
      reject();
    });
  });
}
var PseudoElements = {
  hooks() {
    return {
      mutationObserverCallbacks(accumulator) {
        accumulator.pseudoElementsCallback = searchPseudoElements;
        return accumulator;
      }
    };
  },
  provides(providers2) {
    providers2.pseudoElements2svg = function(params) {
      const {
        node = DOCUMENT2
      } = params;
      if (config.searchPseudoElements) {
        searchPseudoElements(node);
      }
    };
  }
};
var _unwatched = false;
var MutationObserver$1 = {
  mixout() {
    return {
      dom: {
        unwatch() {
          disableObservation();
          _unwatched = true;
        }
      }
    };
  },
  hooks() {
    return {
      bootstrap() {
        observe(chainHooks("mutationObserverCallbacks", {}));
      },
      noAuto() {
        disconnect();
      },
      watch(params) {
        const {
          observeMutationsRoot
        } = params;
        if (_unwatched) {
          enableObservation();
        } else {
          observe(chainHooks("mutationObserverCallbacks", {
            observeMutationsRoot
          }));
        }
      }
    };
  }
};
var parseTransformString = (transformString) => {
  let transform = {
    size: 16,
    x: 0,
    y: 0,
    flipX: false,
    flipY: false,
    rotate: 0
  };
  return transformString.toLowerCase().split(" ").reduce((acc, n) => {
    const parts = n.toLowerCase().split("-");
    const first = parts[0];
    let rest = parts.slice(1).join("-");
    if (first && rest === "h") {
      acc.flipX = true;
      return acc;
    }
    if (first && rest === "v") {
      acc.flipY = true;
      return acc;
    }
    rest = parseFloat(rest);
    if (isNaN(rest)) {
      return acc;
    }
    switch (first) {
      case "grow":
        acc.size = acc.size + rest;
        break;
      case "shrink":
        acc.size = acc.size - rest;
        break;
      case "left":
        acc.x = acc.x - rest;
        break;
      case "right":
        acc.x = acc.x + rest;
        break;
      case "up":
        acc.y = acc.y - rest;
        break;
      case "down":
        acc.y = acc.y + rest;
        break;
      case "rotate":
        acc.rotate = acc.rotate + rest;
        break;
    }
    return acc;
  }, transform);
};
var PowerTransforms = {
  mixout() {
    return {
      parse: {
        transform: (transformString) => {
          return parseTransformString(transformString);
        }
      }
    };
  },
  hooks() {
    return {
      parseNodeAttributes(accumulator, node) {
        const transformString = node.getAttribute("data-fa-transform");
        if (transformString) {
          accumulator.transform = parseTransformString(transformString);
        }
        return accumulator;
      }
    };
  },
  provides(providers2) {
    providers2.generateAbstractTransformGrouping = function(_ref) {
      let {
        main,
        transform,
        containerWidth,
        iconWidth
      } = _ref;
      const outer = {
        transform: "translate(".concat(containerWidth / 2, " 256)")
      };
      const innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
      const innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
      const innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
      const inner = {
        transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
      };
      const path = {
        transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
      };
      const operations = {
        outer,
        inner,
        path
      };
      return {
        tag: "g",
        attributes: _objectSpread2({}, operations.outer),
        children: [{
          tag: "g",
          attributes: _objectSpread2({}, operations.inner),
          children: [{
            tag: main.icon.tag,
            children: main.icon.children,
            attributes: _objectSpread2(_objectSpread2({}, main.icon.attributes), operations.path)
          }]
        }]
      };
    };
  }
};
var ALL_SPACE = {
  x: 0,
  y: 0,
  width: "100%",
  height: "100%"
};
function fillBlack(abstract) {
  let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  if (abstract.attributes && (abstract.attributes.fill || force)) {
    abstract.attributes.fill = "black";
  }
  return abstract;
}
function deGroup(abstract) {
  if (abstract.tag === "g") {
    return abstract.children;
  } else {
    return [abstract];
  }
}
var Masks = {
  hooks() {
    return {
      parseNodeAttributes(accumulator, node) {
        const maskData = node.getAttribute("data-fa-mask");
        const mask = !maskData ? emptyCanonicalIcon() : getCanonicalIcon(maskData.split(" ").map((i) => i.trim()));
        if (!mask.prefix) {
          mask.prefix = getDefaultUsablePrefix();
        }
        accumulator.mask = mask;
        accumulator.maskId = node.getAttribute("data-fa-mask-id");
        return accumulator;
      }
    };
  },
  provides(providers2) {
    providers2.generateAbstractMask = function(_ref) {
      let {
        children,
        attributes,
        main,
        mask,
        maskId: explicitMaskId,
        transform
      } = _ref;
      const {
        width: mainWidth,
        icon: mainPath
      } = main;
      const {
        width: maskWidth,
        icon: maskPath
      } = mask;
      const trans = transformForSvg({
        transform,
        containerWidth: maskWidth,
        iconWidth: mainWidth
      });
      const maskRect = {
        tag: "rect",
        attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, {
          fill: "white"
        })
      };
      const maskInnerGroupChildrenMixin = mainPath.children ? {
        children: mainPath.children.map(fillBlack)
      } : {};
      const maskInnerGroup = {
        tag: "g",
        attributes: _objectSpread2({}, trans.inner),
        children: [fillBlack(_objectSpread2({
          tag: mainPath.tag,
          attributes: _objectSpread2(_objectSpread2({}, mainPath.attributes), trans.path)
        }, maskInnerGroupChildrenMixin))]
      };
      const maskOuterGroup = {
        tag: "g",
        attributes: _objectSpread2({}, trans.outer),
        children: [maskInnerGroup]
      };
      const maskId = "mask-".concat(explicitMaskId || nextUniqueId());
      const clipId = "clip-".concat(explicitMaskId || nextUniqueId());
      const maskTag = {
        tag: "mask",
        attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, {
          id: maskId,
          maskUnits: "userSpaceOnUse",
          maskContentUnits: "userSpaceOnUse"
        }),
        children: [maskRect, maskOuterGroup]
      };
      const defs = {
        tag: "defs",
        children: [{
          tag: "clipPath",
          attributes: {
            id: clipId
          },
          children: deGroup(maskPath)
        }, maskTag]
      };
      children.push(defs, {
        tag: "rect",
        attributes: _objectSpread2({
          fill: "currentColor",
          "clip-path": "url(#".concat(clipId, ")"),
          mask: "url(#".concat(maskId, ")")
        }, ALL_SPACE)
      });
      return {
        children,
        attributes
      };
    };
  }
};
var MissingIconIndicator = {
  provides(providers2) {
    let reduceMotion = false;
    if (WINDOW.matchMedia) {
      reduceMotion = WINDOW.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    providers2.missingIconAbstract = function() {
      const gChildren = [];
      const FILL = {
        fill: "currentColor"
      };
      const ANIMATION_BASE = {
        attributeType: "XML",
        repeatCount: "indefinite",
        dur: "2s"
      };
      gChildren.push({
        tag: "path",
        attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
          d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
        })
      });
      const OPACITY_ANIMATE = _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, {
        attributeName: "opacity"
      });
      const dot = {
        tag: "circle",
        attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
          cx: "256",
          cy: "364",
          r: "28"
        }),
        children: []
      };
      if (!reduceMotion) {
        dot.children.push({
          tag: "animate",
          attributes: _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, {
            attributeName: "r",
            values: "28;14;28;28;14;28;"
          })
        }, {
          tag: "animate",
          attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
            values: "1;0;1;1;0;1;"
          })
        });
      }
      gChildren.push(dot);
      gChildren.push({
        tag: "path",
        attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
          opacity: "1",
          d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
        }),
        children: reduceMotion ? [] : [{
          tag: "animate",
          attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
            values: "1;0;0;0;0;1;"
          })
        }]
      });
      if (!reduceMotion) {
        gChildren.push({
          tag: "path",
          attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
            opacity: "0",
            d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
          }),
          children: [{
            tag: "animate",
            attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
              values: "0;0;1;1;0;0;"
            })
          }]
        });
      }
      return {
        tag: "g",
        attributes: {
          "class": "missing"
        },
        children: gChildren
      };
    };
  }
};
var SvgSymbols = {
  hooks() {
    return {
      parseNodeAttributes(accumulator, node) {
        const symbolData = node.getAttribute("data-fa-symbol");
        const symbol = symbolData === null ? false : symbolData === "" ? true : symbolData;
        accumulator["symbol"] = symbol;
        return accumulator;
      }
    };
  }
};
var plugins = [InjectCSS, ReplaceElements, Layers, LayersCounter, LayersText, PseudoElements, MutationObserver$1, PowerTransforms, Masks, MissingIconIndicator, SvgSymbols];
registerPlugins(plugins, {
  mixoutsTo: api
});
var noAuto$1 = api.noAuto;
var config$1 = api.config;
var library$1 = api.library;
var dom$1 = api.dom;
var parse$1 = api.parse;
var findIconDefinition$1 = api.findIconDefinition;
var toHtml$1 = api.toHtml;
var icon = api.icon;
var layer = api.layer;
var text = api.text;
var counter = api.counter;

// node_modules/@fortawesome/angular-fontawesome/fesm2022/angular-fontawesome.mjs
var _c0 = ["*"];
var FaConfig = class _FaConfig {
  /**
   * Default prefix to use, when one is not provided with the icon name.
   *
   * @default 'fas'
   */
  defaultPrefix = "fas";
  /**
   * Provides a fallback icon to use whilst main icon is being loaded asynchronously.
   * When value is null, then fa-icon component will throw an error if icon input is missing.
   * When value is not null, then the provided icon will be used as a fallback icon if icon input is missing.
   *
   * @default null
   */
  fallbackIcon = null;
  /**
   * Set icons to the same fixed width.
   *
   * @see {@link: https://fontawesome.com/how-to-use/on-the-web/styling/fixed-width-icons}
   * @default false
   */
  fixedWidth;
  /**
   * Automatically add Font Awesome styles to the document when icon is rendered.
   *
   * For the majority of the cases the automatically added CSS is sufficient,
   * please refer to the linked guide for more information on when to disable
   * this feature.
   *
   * @see {@link: https://github.com/FortAwesome/angular-fontawesome/blob/main/docs/guide/adding-css.md}
   * @default true
   */
  set autoAddCss(value) {
    config$1.autoAddCss = value;
    this._autoAddCss = value;
  }
  get autoAddCss() {
    return this._autoAddCss;
  }
  _autoAddCss = true;
  static ɵfac = function FaConfig_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FaConfig)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FaConfig,
    factory: _FaConfig.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaConfig, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var FaIconLibrary = class _FaIconLibrary {
  definitions = {};
  addIcons(...icons) {
    for (const icon2 of icons) {
      if (!(icon2.prefix in this.definitions)) {
        this.definitions[icon2.prefix] = {};
      }
      this.definitions[icon2.prefix][icon2.iconName] = icon2;
      for (const alias of icon2.icon[2]) {
        if (typeof alias === "string") {
          this.definitions[icon2.prefix][alias] = icon2;
        }
      }
    }
  }
  addIconPacks(...packs) {
    for (const pack of packs) {
      const icons = Object.keys(pack).map((key) => pack[key]);
      this.addIcons(...icons);
    }
  }
  getIconDefinition(prefix, name) {
    if (prefix in this.definitions && name in this.definitions[prefix]) {
      return this.definitions[prefix][name];
    }
    return null;
  }
  static ɵfac = function FaIconLibrary_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FaIconLibrary)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FaIconLibrary,
    factory: _FaIconLibrary.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaIconLibrary, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var faWarnIfIconDefinitionMissing = (iconSpec) => {
  throw new Error(`Could not find icon with iconName=${iconSpec.iconName} and prefix=${iconSpec.prefix} in the icon library.`);
};
var faWarnIfIconSpecMissing = () => {
  throw new Error("Property `icon` is required for `fa-icon`/`fa-duotone-icon` components.");
};
var isKnownRotateValue = (rotate) => rotate != null && (rotate === 90 || rotate === 180 || rotate === 270 || rotate === "90" || rotate === "180" || rotate === "270");
var faClassList = (props) => {
  const knownRotateValue = isKnownRotateValue(props.rotate);
  const classes = {
    [`fa-${props.animation}`]: props.animation != null && !props.animation.startsWith("spin"),
    "fa-spin": props.animation === "spin" || props.animation === "spin-reverse",
    "fa-spin-pulse": props.animation === "spin-pulse" || props.animation === "spin-pulse-reverse",
    "fa-spin-reverse": props.animation === "spin-reverse" || props.animation === "spin-pulse-reverse",
    // According to https://fontawesome.com/docs/web/style/animate#spin fa-pulse
    // class is deprecated, remove the below line when Font Awesome 5 support
    // is dropped.
    "fa-pulse": props.animation === "spin-pulse" || props.animation === "spin-pulse-reverse",
    "fa-fw": props.fixedWidth,
    "fa-border": props.border,
    "fa-inverse": props.inverse,
    "fa-layers-counter": props.counter,
    "fa-flip-horizontal": props.flip === "horizontal" || props.flip === "both",
    "fa-flip-vertical": props.flip === "vertical" || props.flip === "both",
    [`fa-${props.size}`]: props.size !== null,
    [`fa-rotate-${props.rotate}`]: knownRotateValue,
    "fa-rotate-by": props.rotate != null && !knownRotateValue,
    [`fa-pull-${props.pull}`]: props.pull !== null,
    [`fa-stack-${props.stackItemSize}`]: props.stackItemSize != null
  };
  return Object.keys(classes).map((key) => classes[key] ? key : null).filter((key) => key != null);
};
var cssInserted = /* @__PURE__ */ new WeakSet();
var autoCssId = "fa-auto-css";
function ensureCss2(document2, config2) {
  if (!config2.autoAddCss) {
    return;
  }
  if (cssInserted.has(document2)) {
    return;
  }
  if (document2.getElementById(autoCssId) != null) {
    config2.autoAddCss = false;
    cssInserted.add(document2);
    return;
  }
  const style = document2.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute("id", autoCssId);
  style.innerHTML = dom$1.css();
  const headChildren = document2.head.childNodes;
  let beforeChild = null;
  for (let i = headChildren.length - 1; i > -1; i--) {
    const child = headChildren[i];
    const tagName = child.nodeName.toUpperCase();
    if (["STYLE", "LINK"].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }
  document2.head.insertBefore(style, beforeChild);
  config2.autoAddCss = false;
  cssInserted.add(document2);
}
var isIconLookup = (i) => i.prefix !== void 0 && i.iconName !== void 0;
var faNormalizeIconSpec = (iconSpec, defaultPrefix) => {
  if (isIconLookup(iconSpec)) {
    return iconSpec;
  }
  if (Array.isArray(iconSpec) && iconSpec.length === 2) {
    return {
      prefix: iconSpec[0],
      iconName: iconSpec[1]
    };
  }
  return {
    prefix: defaultPrefix,
    iconName: iconSpec
  };
};
var FaStackItemSizeDirective = class _FaStackItemSizeDirective {
  /**
   * Specify whether icon inside {@link FaStackComponent} should be rendered in
   * regular size (1x) or as a larger icon (2x).
   */
  stackItemSize = input("1x");
  /**
   * @internal
   */
  size = input();
  _effect = effect(() => {
    const size = this.size();
    if (size) {
      throw new Error('fa-icon is not allowed to customize size when used inside fa-stack. Set size on the enclosing fa-stack instead: <fa-stack size="4x">...</fa-stack>.');
    }
  });
  static ɵfac = function FaStackItemSizeDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FaStackItemSizeDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FaStackItemSizeDirective,
    selectors: [["fa-icon", "stackItemSize", ""], ["fa-duotone-icon", "stackItemSize", ""]],
    inputs: {
      stackItemSize: [1, "stackItemSize"],
      size: [1, "size"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaStackItemSizeDirective, [{
    type: Directive,
    args: [{
      // eslint-disable-next-line @angular-eslint/directive-selector
      selector: "fa-icon[stackItemSize],fa-duotone-icon[stackItemSize]"
    }]
  }], null, null);
})();
var FaStackComponent = class _FaStackComponent {
  /**
   * Size of the stacked icon.
   * Note that stacked icon is by default 2 times bigger, than non-stacked icon.
   * You'll need to set size using custom CSS to align stacked icon with a
   * simple one. E.g. `fa-stack { font-size: 0.5em; }`.
   */
  size = input();
  classes = computed(() => {
    const sizeValue = this.size();
    const sizeClass = sizeValue ? {
      [`fa-${sizeValue}`]: true
    } : {};
    return __spreadProps(__spreadValues({}, sizeClass), {
      "fa-stack": true
    });
  });
  static ɵfac = function FaStackComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FaStackComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _FaStackComponent,
    selectors: [["fa-stack"]],
    hostVars: 2,
    hostBindings: function FaStackComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.classes());
      }
    },
    inputs: {
      size: [1, "size"]
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function FaStackComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaStackComponent, [{
    type: Component,
    args: [{
      selector: "fa-stack",
      template: `<ng-content></ng-content>`,
      host: {
        "[class]": "classes()"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var FaIconComponent = class _FaIconComponent {
  icon = model.required();
  /**
   * Specify a title for the icon.
   *
   * This text will be displayed in a tooltip on hover and presented to the
   * screen readers.
   */
  title = model();
  /**
   * Icon animation.
   *
   * Most of the animations are only available when using Font Awesome 6. With
   * Font Awesome 5, only 'spin' and 'spin-pulse' are supported.
   */
  animation = model();
  mask = model();
  flip = model();
  size = model();
  pull = model();
  border = model();
  inverse = model();
  symbol = model();
  rotate = model();
  fixedWidth = model();
  transform = model();
  /**
   * Specify the `role` attribute for the rendered <svg> element.
   *
   * @default 'img'
   */
  a11yRole = model();
  renderedIconHTML = computed(() => {
    const iconValue = this.icon();
    if (iconValue == null && this.config.fallbackIcon == null) {
      faWarnIfIconSpecMissing();
      return "";
    }
    const iconDefinition = this.findIconDefinition(iconValue ?? this.config.fallbackIcon);
    if (!iconDefinition) {
      return "";
    }
    const params = this.buildParams();
    ensureCss2(this.document, this.config);
    const renderedIcon = icon(iconDefinition, params);
    return this.sanitizer.bypassSecurityTrustHtml(renderedIcon.html.join("\n"));
  });
  document = inject(DOCUMENT);
  sanitizer = inject(DomSanitizer);
  config = inject(FaConfig);
  iconLibrary = inject(FaIconLibrary);
  stackItem = inject(FaStackItemSizeDirective, {
    optional: true
  });
  stack = inject(FaStackComponent, {
    optional: true
  });
  constructor() {
    if (this.stack != null && this.stackItem == null) {
      console.error('FontAwesome: fa-icon and fa-duotone-icon elements must specify stackItemSize attribute when wrapped into fa-stack. Example: <fa-icon stackItemSize="2x"></fa-icon>.');
    }
  }
  findIconDefinition(i) {
    const lookup = faNormalizeIconSpec(i, this.config.defaultPrefix);
    if ("icon" in lookup) {
      return lookup;
    }
    const definition = this.iconLibrary.getIconDefinition(lookup.prefix, lookup.iconName);
    if (definition != null) {
      return definition;
    }
    faWarnIfIconDefinitionMissing(lookup);
    return null;
  }
  buildParams() {
    const fixedWidth = this.fixedWidth();
    const classOpts = {
      flip: this.flip(),
      animation: this.animation(),
      border: this.border(),
      inverse: this.inverse(),
      size: this.size(),
      pull: this.pull(),
      rotate: this.rotate(),
      fixedWidth: typeof fixedWidth === "boolean" ? fixedWidth : this.config.fixedWidth,
      stackItemSize: this.stackItem != null ? this.stackItem.stackItemSize() : void 0
    };
    const transform = this.transform();
    const parsedTransform = typeof transform === "string" ? parse$1.transform(transform) : transform;
    const mask = this.mask();
    const maskIconDefinition = mask != null ? this.findIconDefinition(mask) : null;
    const attributes = {};
    const a11yRole = this.a11yRole();
    if (a11yRole != null) {
      attributes["role"] = a11yRole;
    }
    const styles2 = {};
    if (classOpts.rotate != null && !isKnownRotateValue(classOpts.rotate)) {
      styles2["--fa-rotate-angle"] = `${classOpts.rotate}`;
    }
    return {
      title: this.title(),
      transform: parsedTransform,
      classes: faClassList(classOpts),
      mask: maskIconDefinition ?? void 0,
      symbol: this.symbol(),
      attributes,
      styles: styles2
    };
  }
  static ɵfac = function FaIconComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FaIconComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _FaIconComponent,
    selectors: [["fa-icon"]],
    hostAttrs: [1, "ng-fa-icon"],
    hostVars: 2,
    hostBindings: function FaIconComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵdomProperty("innerHTML", ctx.renderedIconHTML(), ɵɵsanitizeHtml);
        ɵɵattribute("title", ctx.title());
      }
    },
    inputs: {
      icon: [1, "icon"],
      title: [1, "title"],
      animation: [1, "animation"],
      mask: [1, "mask"],
      flip: [1, "flip"],
      size: [1, "size"],
      pull: [1, "pull"],
      border: [1, "border"],
      inverse: [1, "inverse"],
      symbol: [1, "symbol"],
      rotate: [1, "rotate"],
      fixedWidth: [1, "fixedWidth"],
      transform: [1, "transform"],
      a11yRole: [1, "a11yRole"]
    },
    outputs: {
      icon: "iconChange",
      title: "titleChange",
      animation: "animationChange",
      mask: "maskChange",
      flip: "flipChange",
      size: "sizeChange",
      pull: "pullChange",
      border: "borderChange",
      inverse: "inverseChange",
      symbol: "symbolChange",
      rotate: "rotateChange",
      fixedWidth: "fixedWidthChange",
      transform: "transformChange",
      a11yRole: "a11yRoleChange"
    },
    decls: 0,
    vars: 0,
    template: function FaIconComponent_Template(rf, ctx) {
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaIconComponent, [{
    type: Component,
    args: [{
      selector: "fa-icon",
      template: ``,
      host: {
        class: "ng-fa-icon",
        "[attr.title]": "title()",
        "[innerHTML]": "renderedIconHTML()"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [], null);
})();
var FaDuotoneIconComponent = class _FaDuotoneIconComponent extends FaIconComponent {
  /**
   * Swap the default opacity of each duotone icon’s layers. This will make an
   * icon’s primary layer have the default opacity of 40% rather than its
   * secondary layer.
   *
   * @default false
   */
  swapOpacity = input();
  /**
   * Customize the opacity of the primary icon layer.
   * Valid values are in range [0, 1.0].
   *
   * @default 1.0
   */
  primaryOpacity = input();
  /**
   * Customize the opacity of the secondary icon layer.
   * Valid values are in range [0, 1.0].
   *
   * @default 0.4
   */
  secondaryOpacity = input();
  /**
   * Customize the color of the primary icon layer.
   * Accepts any valid CSS color value.
   *
   * @default CSS inherited color
   */
  primaryColor = input();
  /**
   * Customize the color of the secondary icon layer.
   * Accepts any valid CSS color value.
   *
   * @default CSS inherited color
   */
  secondaryColor = input();
  findIconDefinition(i) {
    const definition = super.findIconDefinition(i);
    if (definition != null && !Array.isArray(definition.icon[4])) {
      throw new Error(`The specified icon does not appear to be a Duotone icon. Check that you specified the correct style: <fa-duotone-icon [icon]="['fad', '${definition.iconName}']"></fa-duotone-icon> or use: <fa-icon icon="${definition.iconName}"></fa-icon> instead.`);
    }
    return definition;
  }
  buildParams() {
    const params = super.buildParams();
    const swapOpacity = this.swapOpacity();
    if (swapOpacity === true || swapOpacity === "true") {
      if (Array.isArray(params.classes)) {
        params.classes.push("fa-swap-opacity");
      } else if (typeof params.classes === "string") {
        params.classes = [params.classes, "fa-swap-opacity"];
      } else {
        params.classes = ["fa-swap-opacity"];
      }
    }
    if (params.styles == null) {
      params.styles = {};
    }
    const primaryOpacity = this.primaryOpacity();
    if (primaryOpacity != null) {
      params.styles["--fa-primary-opacity"] = primaryOpacity.toString();
    }
    const secondaryOpacity = this.secondaryOpacity();
    if (secondaryOpacity != null) {
      params.styles["--fa-secondary-opacity"] = secondaryOpacity.toString();
    }
    const primaryColor = this.primaryColor();
    if (primaryColor != null) {
      params.styles["--fa-primary-color"] = primaryColor;
    }
    const secondaryColor = this.secondaryColor();
    if (secondaryColor != null) {
      params.styles["--fa-secondary-color"] = secondaryColor;
    }
    return params;
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFaDuotoneIconComponent_BaseFactory;
    return function FaDuotoneIconComponent_Factory(__ngFactoryType__) {
      return (ɵFaDuotoneIconComponent_BaseFactory || (ɵFaDuotoneIconComponent_BaseFactory = ɵɵgetInheritedFactory(_FaDuotoneIconComponent)))(__ngFactoryType__ || _FaDuotoneIconComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FaDuotoneIconComponent,
    selectors: [["fa-duotone-icon"]],
    inputs: {
      swapOpacity: [1, "swapOpacity"],
      primaryOpacity: [1, "primaryOpacity"],
      secondaryOpacity: [1, "secondaryOpacity"],
      primaryColor: [1, "primaryColor"],
      secondaryColor: [1, "secondaryColor"]
    },
    features: [ɵɵInheritDefinitionFeature],
    decls: 0,
    vars: 0,
    template: function FaDuotoneIconComponent_Template(rf, ctx) {
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaDuotoneIconComponent, [{
    type: Component,
    args: [{
      selector: "fa-duotone-icon",
      template: ``,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var faWarnIfParentNotExist = (parent, parentName, childName) => {
  if (!parent) {
    throw new Error(`${childName} should be used as child of ${parentName} only.`);
  }
};
var FaLayersComponent = class _FaLayersComponent {
  size = input();
  fixedWidth = input();
  faFw = computed(() => {
    const fixedWidth = this.fixedWidth();
    return typeof fixedWidth === "boolean" ? fixedWidth : this.config.fixedWidth;
  });
  classes = computed(() => {
    const sizeValue = this.size();
    const sizeClass = sizeValue ? {
      [`fa-${sizeValue}`]: true
    } : {};
    return __spreadProps(__spreadValues({}, sizeClass), {
      "fa-fw": this.faFw(),
      "fa-layers": true
    });
  });
  document = inject(DOCUMENT);
  config = inject(FaConfig);
  ngOnInit() {
    ensureCss2(this.document, this.config);
  }
  static ɵfac = function FaLayersComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FaLayersComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _FaLayersComponent,
    selectors: [["fa-layers"]],
    hostVars: 2,
    hostBindings: function FaLayersComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.classes());
      }
    },
    inputs: {
      size: [1, "size"],
      fixedWidth: [1, "fixedWidth"]
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function FaLayersComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaLayersComponent, [{
    type: Component,
    args: [{
      selector: "fa-layers",
      template: `<ng-content></ng-content>`,
      host: {
        "[class]": "classes()"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var FaLayersCounterComponent = class _FaLayersCounterComponent {
  content = input.required();
  title = input();
  position = input();
  renderedHTML = computed(() => {
    const params = this.buildParams();
    return this.updateContent(params);
  });
  document = inject(DOCUMENT);
  config = inject(FaConfig);
  parent = inject(FaLayersComponent, {
    optional: true
  });
  sanitizer = inject(DomSanitizer);
  constructor() {
    faWarnIfParentNotExist(this.parent, "FaLayersComponent", this.constructor.name);
  }
  buildParams() {
    const position = this.position();
    return {
      title: this.title(),
      classes: position != null ? [`fa-layers-${position}`] : void 0
    };
  }
  updateContent(params) {
    ensureCss2(this.document, this.config);
    return this.sanitizer.bypassSecurityTrustHtml(counter(this.content() || "", params).html.join(""));
  }
  static ɵfac = function FaLayersCounterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FaLayersCounterComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _FaLayersCounterComponent,
    selectors: [["fa-layers-counter"]],
    hostAttrs: [1, "ng-fa-layers-counter"],
    hostVars: 1,
    hostBindings: function FaLayersCounterComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵdomProperty("innerHTML", ctx.renderedHTML(), ɵɵsanitizeHtml);
      }
    },
    inputs: {
      content: [1, "content"],
      title: [1, "title"],
      position: [1, "position"]
    },
    decls: 0,
    vars: 0,
    template: function FaLayersCounterComponent_Template(rf, ctx) {
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaLayersCounterComponent, [{
    type: Component,
    args: [{
      selector: "fa-layers-counter",
      template: "",
      host: {
        class: "ng-fa-layers-counter",
        "[innerHTML]": "renderedHTML()"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [], null);
})();
var FaLayersTextComponent = class _FaLayersTextComponent {
  content = input.required();
  title = input();
  flip = input();
  size = input();
  pull = input();
  border = input();
  inverse = input();
  rotate = input();
  fixedWidth = input();
  transform = input();
  renderedHTML = computed(() => {
    const params = this.buildParams();
    return this.updateContent(params);
  });
  document = inject(DOCUMENT);
  config = inject(FaConfig);
  parent = inject(FaLayersComponent, {
    optional: true
  });
  sanitizer = inject(DomSanitizer);
  constructor() {
    faWarnIfParentNotExist(this.parent, "FaLayersComponent", this.constructor.name);
  }
  /**
   * Updating params by component props.
   */
  buildParams() {
    const classOpts = {
      flip: this.flip(),
      border: this.border(),
      inverse: this.inverse(),
      size: this.size(),
      pull: this.pull(),
      rotate: this.rotate(),
      fixedWidth: this.fixedWidth()
    };
    const transform = this.transform();
    const parsedTransform = typeof transform === "string" ? parse$1.transform(transform) : transform;
    const styles2 = {};
    if (classOpts.rotate != null && !isKnownRotateValue(classOpts.rotate)) {
      styles2["--fa-rotate-angle"] = `${classOpts.rotate}`;
    }
    return {
      transform: parsedTransform,
      classes: faClassList(classOpts),
      title: this.title(),
      styles: styles2
    };
  }
  updateContent(params) {
    ensureCss2(this.document, this.config);
    return this.sanitizer.bypassSecurityTrustHtml(text(this.content() || "", params).html.join("\n"));
  }
  static ɵfac = function FaLayersTextComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FaLayersTextComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _FaLayersTextComponent,
    selectors: [["fa-layers-text"]],
    hostAttrs: [1, "ng-fa-layers-text"],
    hostVars: 1,
    hostBindings: function FaLayersTextComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵdomProperty("innerHTML", ctx.renderedHTML(), ɵɵsanitizeHtml);
      }
    },
    inputs: {
      content: [1, "content"],
      title: [1, "title"],
      flip: [1, "flip"],
      size: [1, "size"],
      pull: [1, "pull"],
      border: [1, "border"],
      inverse: [1, "inverse"],
      rotate: [1, "rotate"],
      fixedWidth: [1, "fixedWidth"],
      transform: [1, "transform"]
    },
    decls: 0,
    vars: 0,
    template: function FaLayersTextComponent_Template(rf, ctx) {
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaLayersTextComponent, [{
    type: Component,
    args: [{
      selector: "fa-layers-text",
      template: "",
      host: {
        class: "ng-fa-layers-text",
        "[innerHTML]": "renderedHTML()"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [], null);
})();
var FontAwesomeModule = class _FontAwesomeModule {
  static ɵfac = function FontAwesomeModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FontAwesomeModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _FontAwesomeModule,
    imports: [FaIconComponent, FaDuotoneIconComponent, FaLayersComponent, FaLayersTextComponent, FaLayersCounterComponent, FaStackComponent, FaStackItemSizeDirective],
    exports: [FaIconComponent, FaDuotoneIconComponent, FaLayersComponent, FaLayersTextComponent, FaLayersCounterComponent, FaStackComponent, FaStackItemSizeDirective]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FontAwesomeModule, [{
    type: NgModule,
    args: [{
      imports: [FaIconComponent, FaDuotoneIconComponent, FaLayersComponent, FaLayersTextComponent, FaLayersCounterComponent, FaStackComponent, FaStackItemSizeDirective],
      exports: [FaIconComponent, FaDuotoneIconComponent, FaLayersComponent, FaLayersTextComponent, FaLayersCounterComponent, FaStackComponent, FaStackItemSizeDirective]
    }]
  }], null, null);
})();
export {
  FaConfig,
  FaDuotoneIconComponent,
  FaIconComponent,
  FaIconLibrary,
  FaLayersComponent,
  FaLayersCounterComponent,
  FaLayersTextComponent,
  FaStackComponent,
  FaStackItemSizeDirective,
  FontAwesomeModule
};
/*! Bundled license information:

@fortawesome/fontawesome-svg-core/index.mjs:
  (*!
   * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
   * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
   * Copyright 2024 Fonticons, Inc.
   *)
*/
//# sourceMappingURL=@fortawesome_angular-fontawesome.js.map
