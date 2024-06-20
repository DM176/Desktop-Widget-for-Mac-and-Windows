const path = require("path");

module.exports = {
  packagerConfig: {
    icon: path.resolve(__dirname, "assets/icons/ic_logo"), // set path here
    extendInfo: {
      LSBackgroundOnly: true,
    },
    osxSign: {
      hardenedRuntime: true,
      entitlements: "entitlements.mac.plist",
      entitlementsInherit: "entitlements.mac.plist",
    },
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "electron_js_widget",
        setupIcon: path.resolve(__dirname, "assets/icons/ic_logo.ico"), // set path here
        iconUrl: path.resolve(__dirname, "assets/icons/ic_logo.ico"), // set path here
        requestedExecutionLevel: "requireAdministrator",
      },
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {
        icon: path.resolve(__dirname, "assets/icons/ic_logo.icns"), // set path here
      },
    },
  ],
};
