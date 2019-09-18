! function(root, factory) {
    if (typeof exports == 'object' && typeof module != 'undefined') {
        module.exports = factory()
    } else if (typeof define == 'function' && define.amd) {
        define(factory)
    } else {
        /**
         * 插件对象直接扩展到 window 对象上
         * 这个对象的名字，需要自己填写一下。例如：plugintest
         */
        var moduleName = 'payPlugins';
        root[moduleName] = factory()
    }
}(this, function() {
    var _BARCODE = 'payPlugins';
    var plugintest = {
        PluginTestFunction: function(Argus1, Argus2, Argus3, Argus4, successCallback, errorCallback) {
            var success = typeof successCallback !== 'function' ? null : function(args) {
                    successCallback(args);
                },
                fail = typeof errorCallback !== 'function' ? null : function(code) {
                    errorCallback(code);
                };
            var callbackID = plus.bridge.callbackId(success, fail);

            return plus.bridge.exec(_BARCODE, "PluginTestFunction", [callbackID, Argus1, Argus2, Argus3, Argus4]);
        },
        PluginTestFunctionArrayArgu: function(Argus, successCallback, errorCallback) {
            var success = typeof successCallback !== 'function' ? null : function(args) {
                    successCallback(args);
                },
                fail = typeof errorCallback !== 'function' ? null : function(code) {
                    errorCallback(code);
                };
            var callbackID = plus.bridge.callbackId(success, fail);
            return plus.bridge.exec(_BARCODE, "PluginTestFunctionArrayArgu", [callbackID, Argus]);
        },
        PluginTestFunctionSync: function(Argus1, Argus2, Argus3, Argus4) {
            return plus.bridge.execSync(_BARCODE, "PluginTestFunctionSync", [Argus1, Argus2, Argus3, Argus4]);
        },
        PluginTestFunctionSyncArrayArgu: function(Argus) {
            return plus.bridge.execSync(_BARCODE, "PluginTestFunctionSyncArrayArgu", [Argus]);
        },
        // 上面的是demo函数
        performUnifyPayment: function(tn, mode, successCallback, errorCallback) {
            var success = typeof successCallback !== 'function' ? null : function(args) {
                  successCallback(args);
              },
              fail = typeof errorCallback !== 'function' ? null : function(code) {
                  errorCallback(code);
              };
            var callbackID = plus.bridge.callbackId(success, fail);

            return plus.bridge.exec(_BARCODE, "performUnifyPayment", [callbackID, tn, mode]);
        }
    };
    return plugintest;
});
