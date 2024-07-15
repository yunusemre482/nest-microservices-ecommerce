const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  mode: 'production',
  output: {
    path: join(__dirname, '../../dist/apps/api-gateway'),
    filename: '[name].js',
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        "./src/assets",
        {
          input: '../../libs/common/src/internationalization/',
          glob: '**/*.json',
          output: './src/i18n/',
        }
      ],
      optimization: true,
      outputHashing: 'none',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
