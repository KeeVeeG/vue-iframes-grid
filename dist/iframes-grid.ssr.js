'use strict';function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var script = {
  name: 'IframesGrid',
  props: {
    iframes: {
      type: Array,
      required: true,
      validator: function validator(val) {
        return val.length > 0;
      }
    },
    ratio: {
      type: String,
      default: "16:9",
      validator: function validator(val) {
        var arr = val.split(":");
        return arr.length == 2 && arr.every(function (e) {
          return +e > 0;
        });
      }
    }
  },
  data: function data() {
    return {
      count: -1,
      iframeheight: 0,
      iframewidth: 0,
      boardpadding: 0,
      wInnerHeight: 0
    };
  },
  methods: {
    Calc: function Calc() {
      var widthRatio = +this.ratio.split(":")[0];
      var heightRatio = +this.ratio.split(":")[0];
      this.count = this.iframes.length;
      var height = this.$refs.iframes_grid.clientHeight - 41;
      this.wInnerHeight = height;
      var width = this.$refs.iframes_grid.clientWidth;
      var best_height = 0;
      var best_width = 0;
      var wrapper_padding = 0;

      for (var per_row = 1; per_row <= this.count; per_row++) {
        var num_rows = Math.ceil(this.count / per_row);
        var max_width = ~~(width / per_row) - 11;
        var max_height = ~~(height / num_rows) - 11;

        if (max_width * heightRatio / widthRatio < max_height) {
          max_height = max_width * heightRatio / widthRatio;
        } else {
          max_width = max_height * widthRatio / heightRatio;
        }

        if (max_width > best_width) {
          best_width = max_width;
          best_height = max_height;
          wrapper_padding = (height - num_rows * max_height) / 2;
        }
      }

      this.iframeheight = ~~best_height;
      this.iframewidth = ~~best_width;
      if (this.$refs.iframes_grid.clientWidth > 910 && this.count > 1) this.boardpadding = ~~wrapper_padding;else this.boardpadding = 0;
    }
  },
  created: function created() {
    window.addEventListener("resize", this.Calc);
  },
  mounted: function mounted() {
    this.Calc();
  },
  watch: {
    iframes: {
      handler: function handler() {
        this.Calc();
      },
      deep: true
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group = css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    ref: "iframes_grid",
    staticClass: "iframes_grid",
    style: {
      'padding-top': _vm.boardpadding + 'px'
    }
  }, [_vm._ssrNode(_vm._ssrList(_vm.iframes, function (stream, index) {
    return "<iframe" + _vm._ssrAttr("stream", stream) + _vm._ssrAttr("iframeheight", _vm.iframeheight) + _vm._ssrAttr("iframewidth", _vm.iframewidth) + _vm._ssrAttr("src", stream) + " frameborder=\"0\"" + _vm._ssrStyle(null, {
      width: _vm.iframewidth + 'px',
      height: _vm.iframeheight + 'px'
    }, null) + " data-v-67b14ee7></iframe>";
  }))]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-67b14ee7_0", {
    source: ".iframes_grid[data-v-67b14ee7]{width:100%;height:100%;text-align:center;float:left;margin:0;padding:0;width:100%}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-67b14ee7";
/* module identifier */

var __vue_module_identifier__ = "data-v-67b14ee7";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var component = /*#__PURE__*/(function () {
  // Get component instance
  var installable = __vue_component__; // Attach install function executed by Vue.use()

  installable.install = function (Vue) {
    Vue.component('IframesGrid', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
var namedExports=/*#__PURE__*/Object.freeze({__proto__:null,'default': component});// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)

Object.entries(namedExports).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      exportName = _ref2[0],
      exported = _ref2[1];

  if (exportName !== 'default') component[exportName] = exported;
});module.exports=component;