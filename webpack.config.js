const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', 
    output: {
        filename: 'main.js', 
        path: path.resolve(__dirname, 'dist'), 
        publicPath: '/' 
    },
    mode: 'development',
    module: {
        rules: [
        {
            test: /\.css$/, 
            use: ['style-loader', 'css-loader'] 
        },
        {
            test: /\.(png|svg|jpg|gif)$/, 
            use: ['file-loader'] 
        },
    ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/Assets', to: 'Assets' }
            ]
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'index.html'
        })
    ]
};
