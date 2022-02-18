import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { Configuration, EnvironmentPlugin, WebpackPluginInstance } from 'webpack';
import 'webpack-dev-server';

const SRC = resolve(__dirname, 'src');
const isDevelopment = process.env.NODE_ENV !== 'production';

const styleLoader = isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader;
const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      auto: true,
      localIdentName: isDevelopment ? '[name]__[local]--[hash:base64:6]' : '[hash:base64:6]',
    },
  },
};

const plugins: WebpackPluginInstance[] = [
  new HTMLWebpackPlugin({
    title: 'Telephonist',
  }),
  new EnvironmentPlugin(['NODE_ENV', 'DEBUG', 'API_URL']),
];

if (isDevelopment) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

const configuration: Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    app: resolve(SRC, 'index.tsx'),
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    assetModuleFilename: 'resources/[hash][ext][query]',
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@locales': __dirname + '/locales',
      '@assets': SRC + '/assets',
      '@ui': SRC + '/core/components',
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    modules: [SRC, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [styleLoader, cssLoader, 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [styleLoader, cssLoader],
      },
      {
        test: /\.[jt]sx?$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  plugins,
  devServer: {
    historyApiFallback: true,
    hot: isDevelopment,
  },
  devtool: 'inline-source-map',
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  cache: true,
};

export default configuration;
