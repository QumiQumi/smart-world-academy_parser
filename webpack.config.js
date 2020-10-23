const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PAGES_DIR = __dirname + "/src/";
const PAGES = fs
    .readdirSync(PAGES_DIR)
    .filter((fileName) => fileName.endsWith(".pug"));

module.exports = {
    entry: { main: "./src/index.js" },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js",
    },
    module: {
        rules: [{
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader", // compiles Sass to CSS
                ],
                exclude: [/node_modules/],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|png)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                },
            },
            {
                test: /\.pug$/,
                loader: "pug-loader",
            },
        ],
    },
    plugins: [
        // Array of plugins to apply to build chunk
        ...PAGES.map(
            (page) =>
            new HtmlWebpackPlugin({
                template: `${PAGES_DIR}/${page}`,
                filename: `./${page.replace(/\.pug/, ".html")}`,
            })
        ),


    ],
};