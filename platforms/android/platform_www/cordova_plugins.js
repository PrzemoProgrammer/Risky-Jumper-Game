cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-navigationbar.navigationbar",
      "file": "plugins/cordova-plugin-navigationbar/www/navigationbar.js",
      "pluginId": "cordova-plugin-navigationbar",
      "clobbers": [
        "window.navigationbar"
      ]
    },
    {
      "id": "cordova-plugin-splashscreen.SplashScreen",
      "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
      "pluginId": "cordova-plugin-splashscreen",
      "clobbers": [
        "navigator.splashscreen"
      ]
    },
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-navigationbar": "1.0.31",
    "cordova-plugin-splashscreen": "5.0.3-dev",
    "cordova-plugin-statusbar": "3.0.0"
  };
});