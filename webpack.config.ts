import { Configuration, EnvironmentPlugin } from "webpack"
import { resolve } from "path"
import HTMLWebpackPlugin from "html-webpack-plugin"
import "webpack-dev-server"
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

 
const SRC = resolve(__dirname, "src")
const DIST = resolve(__dirname, "dist")
const isDevelopment = process.env.NODE_ENV !== "production"


const configuration: Configuration = {
    mode: isDevelopment ? "development" : "production",
    entry: {
        app: resolve(SRC, "index.tsx")
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].js",
        assetModuleFilename: 'resources/[hash][ext][query]',
        publicPath: "/"
    },
    resolve: {
        alias: {
            "~": SRC,
            "@": SRC,
            "@components": SRC + "/components",
            "@locales": __dirname + "/locales",
            "@assets": SRC + "/assets"
        },
        extensions: [".tsx", ".ts", ".jsx", ".js"],
        modules: [
            SRC,
            "node_modules"
        ]
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.[jt]sx?$/i,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
                    },
                }
    
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: "asset/resource"
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: "Telephonist"
        }),
        new EnvironmentPlugin(['NODE_ENV', 'DEBUG', 'API_URL']),
        isDevelopment && new ReactRefreshWebpackPlugin()
    ].filter(Boolean),
    devServer: {
        historyApiFallback: true,
        hot: isDevelopment
    },
    devtool: 'inline-source-map',    
}

export default configuration