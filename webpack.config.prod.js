var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'app/main.js'),
    output: {
        path: path.resolve(__dirname, 'public/static/js/'),
        filename: 'bundle.js',
        publicPath: '/proxy/static/js/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': "'production'"
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [
            // js
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'app')
            },
            // CSS
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            // css
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            // files
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.(ttf|otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?|(jpg|gif)$/,
                loader: 'file-loader'
            }
        ]
    }
};