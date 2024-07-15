const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/orders'),
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
      optimization: false,
      outputHashing: 'none',
    }),
  ],
};
