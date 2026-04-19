// OWNER - HEET
// PURPOSE - Expo app configuration for running the dashboard in Expo Go.

export default {
  expo: {
    name: 'HEET',
    slug: 'heet',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
    experiments: {
      tsconfigPaths: true,
    },
    android: {
      package: 'com.heet.lakshya'
    },
    ios: {
      bundleIdentifier: 'com.heet.lakshya'
    },
    extra: {
      eas: {
        projectId: 'f2ccbdd6-fd49-4b6a-b7e5-096ea70ddfe9',
      },
    },
  },
};
