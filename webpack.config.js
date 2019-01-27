const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
        // fix json file will not be compile by version-loader in webpack 4,
        // @see https://github.com/webpack-contrib/json-loader/issues/65
        {
            test: /\.json$/,
            loader: [path.resolve(__dirname, 'version-loader'), 'json-loader'],
            exclude: [/[/\\\\]node_modules[/\\\\]/],
            type: 'javascript/auto',
        },{
            test: /\.(js|jsx|mjs)$/,
            include: path.resolve(__dirname, 'src'),
            use: [
                path.resolve(__dirname, 'version-loader')
            ]
        },
    ],
  },
};