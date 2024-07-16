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
        "apps/api-gateway/src/deployment.json",
        "apps/api-gateway/src/services.json",
        {
          input: '../../libs/common/src/internationalization/',
          glob: '**/*.json',
          output: './src/i18n/',
        },

        {
          input: './src',
          glob: '**/*.json',
          output: './src/',
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
