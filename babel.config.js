// OWNER - HEET
// PURPOSE - Babel configuration required by Expo for transpiling the app.

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
  };
};
