var script = {
  name: 'IframesGrid',
  props: {
    iframes: {
      type: Array,
      required: true,

      validator(val) {
        return val.length > 0;
      }

    },
    ratio: {
      type: String,
      default: "16:9",

      validator(val) {
        var arr = val.split(":");
        return arr.length == 2 && arr.every(e => +e > 0);
      }

    }
  },

  data() {
    return {
      count: -1,
      iframeheight: 0,
      iframewidth: 0,
      boardpadding: 0,
      wInnerHeight: 0
    };
  },

  methods: {
    Calc() {
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

  created() {
    window.addEventListener("resize", this.Calc);
  },

  mounted() {
    this.Calc();
  },

  watch: {
    iframes: {
      handler: function () {
        this.Calc();
      },
      deep: true
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    ref: "iframes_grid",
    staticClass: "iframes_grid",
    style: {
      'padding-top': _vm.boardpadding + 'px'
    }
  }, _vm._l(_vm.iframes, function (stream, index) {
    return _c('iframe', {
      key: index,
      style: {
        width: _vm.iframewidth + 'px',
        height: _vm.iframeheight + 'px'
      },
      attrs: {
        "stream": stream,
        "iframeheight": _vm.iframeheight,
        "iframewidth": _vm.iframewidth,
        "src": stream,
        "frameborder": "0"
      }
    });
  }), 0);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-67b14ee7_0", {
    source: ".iframes_grid[data-v-67b14ee7]{width:100%;height:100%;text-align:center;float:left;margin:0;padding:0;width:100%}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-67b14ee7";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = __vue_component__; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('IframesGrid', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export default entry_esm;
