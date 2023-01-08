const {HotModuleReplacementPlugin} = require("webpack")
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserWebpackPlugin = require('terser-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
console.log(isDev)

const devtool = () =>  isDev ? 'source-map' : false

const plugins=()=>{
    const base = [
        new HTMLWebpackPlugin({
            template:'./index.html',
            minify:{
                collapseWhitespace:!isDev
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
        new CopyWebpackPlugin({
            patterns:[
                {from:path.resolve(__dirname,'src/favicon.ico'), to:path.resolve(__dirname,'public')}
            ]
        }),
    ]
    if(!isDev){
        // base.push(new BundleAnalyzerPlugin())
    }
    return base
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`
const optimization = () => {
    const config = {
        splitChunks:{
            chunks: "all"
        }
    }
    if(!isDev){
        config.minimizer = [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry:['@babel/polyfill','./index.tsx'],
    optimization:optimization(),
    module: {
        rules: [
            {
                test: /\.(tsx|js|ts|jsx)$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader",]
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader",'sass-loader']
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, "css-loader",'less-loader']
            },
            {
                test:/\.(png|jpg|svg|gif|webp|jpeg)$/,
                use:['file-loader']
            },
            {
                test:/\.(ttf|woff|woff2|eot)$/,
                use:['file-loader']
            },
            {
                test:/\.xml$/,
                use:['xml-loader']
            },
            {
                test:/\.csv$/,
                use:['csv-loader']
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js','.png','.json']
    },
    devtool:devtool(),
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'public'),
    },
    mode:'production',
    plugins:plugins(),
}
if (isDev) {
    module.exports.plugins.push(new HotModuleReplacementPlugin());

}

