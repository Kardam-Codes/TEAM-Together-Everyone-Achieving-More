// OWNER - HEET
// PURPOSE - Expo app configuration for running the dashboard in Expo Go.

export default {
  expo: {
    name: 'HEET',
    slug: 'heet',
    owner: 'heet',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    icon: './mobile/src/logo.png',
    splash: {
      image: './mobile/src/logo.png',
      resizeMode: 'contain',
      backgroundColor: '#FFFFFF',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './mobile/src/logo.png',
        backgroundColor: '#FFFFFF',
      },
    },
    assetBundlePatterns: ['**/*'],
    experiments: {
      tsconfigPaths: true,
    },
  },
};
