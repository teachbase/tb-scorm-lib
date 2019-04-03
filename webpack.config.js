module.exports = {
  entry: {
    // 'scorm-api' : ['./src/api/scorm-api.js'],
    'scorm-rte': ['./client/src/player/scorm-player.js']
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].min.js',
    library: 'scormRTE',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js']
  }
  // devtool: 'source-map'
};
