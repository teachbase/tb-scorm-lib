module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        targets: {
          ie: 11
        },
        modules: false
      }
    ]
  ];
  const plugins = [];

  return {
    presets,
    plugins
  };
};
