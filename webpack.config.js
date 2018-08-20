'use strict';
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var autoprefixer = require('autoprefixer');

/**
 * webpack.config.js 可以 export 一个 object，或者是一个 env 为参数的 function
 */
module.exports = function (env) {
    /**
     * https://webpack.js.org/configuration/configuration-types/#exporting-a-function-to-use-env
     */
    const isProduction = env && env.production === true;

    return {
        // https://webpack.js.org/configuration/entry-context/
        context: path.resolve(__dirname, "src"),
        entry: './index.js',

        // https://webpack.js.org/configuration/output/
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'static/js/[name].[hash].js'
        },

        module: {
            /**
             *  https://webpack.js.org/concepts/loaders/
             */
            loaders: [
                /**
                 * eslint-loader
                 * https://github.com/MoOx/eslint-loader
                 */
                {
                    enforce: "pre",
                    test: /\.js$/,
                    include: path.resolve(__dirname, 'src'),
                    loader: "eslint-loader",
                    options: {
                        failOnError: true,
                        fix: true
                    }
                },
                /**
                 * babel-loader
                 * https://github.com/babel/babel-loader
                 */
                {
                    test: /\.(js|jsx)$/,
                    include: path.resolve(__dirname, 'src'),
                    loader: 'babel-loader',
                    query: {
                        babelrc: false,
                        presets: [require.resolve('babel-preset-react-app')],
                    },
                },
                /**
                 * css-loader & style-loader
                 *  https://github.com/webpack-contrib/css-loader
                 *  https://github.com/webpack-contrib/style-loader
                 */
                {
                    test: /\.css$/,
                    loader: isProduction ?
                        ExtractTextPlugin.extract({ fallback: 'style-loader', use: [
                            {
                                loader: require.resolve('css-loader')
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9',
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            }
                        ] }) :
                        [ 'style-loader', 'css-loader', ]
                },
                /**
                 * json-loader
                 * https://github.com/webpack-contrib/json-loader
                 */
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                // "file" loader for svg
                // https://github.com/webpack-contrib/file-loader
                {
                    test: /\.svg$/,
                    loader: 'file-loader',
                    query: {
                        name: 'static/media/[name].[hash:8].[ext]'
                    }
                }
            ]
        },
        /**
         * https://webpack.js.org/concepts/plugins/
         */
        plugins: [
            new InterpolateHtmlPlugin({
                PUBLIC_URL: '' // index.html %PUBLIC_URL%
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: '../public/index.html',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                }
            }),
            new ExtractTextPlugin('static/css/[name].[hash].css'),
            new webpack.HotModuleReplacementPlugin(),
            // https://webpack.js.org/plugins/define-plugin/#use-case-service-urls
            new webpack.DefinePlugin({
                'SERVICE_URL': isProduction ?
                    JSON.stringify("http://pro.example.com") :
                    JSON.stringify("http://dev.example.com"),
                "process.env": {
                    NODE_ENV: isProduction ?
                        JSON.stringify("production") :
                        JSON.stringify("development")
                }
            })
        ],
        /**
         * https://webpack.js.org/guides/development/#webpack-dev-server
         * https://webpack.js.org/configuration/dev-server/
         */
        devServer:{
            hot: true,
            contentBase: path.join(__dirname, "public"),
            compress: true,
            port: 9000,
            publicPath: '/',
            // https://webpack.js.org/configuration/dev-server/#devserver-proxy
            // https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware-options
            proxy: {
                "/api": {
                    target: "http://localhost:7000/",
                    pathRewrite: {"^/api" : ""},
                    secure: false,
                    changeOrigin: true
                }
            }
        },
        // https://webpack.js.org/configuration/devtool/
        devtool: isProduction ?
            'hidden-source-map' :
            'cheap-module-eval-source-map',
    };
}
