// This library allows us to combine paths easily
const path = require('path');
module.exports = {
    bail: true,
    // devtool: 'source-map',
    entry: path.resolve(__dirname, 'assets', 'main.js'),
    output: {
       path: path.resolve(__dirname, 'assets'),
       filename: 'main.min.js'
    },
    target: "web",
    module: {
        rules: [
            // the 'transform-runtime' plugin tells babel to require the runtime
            // instead of inlining it.
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    watchOptions: {
        ignored: ['node_modules','**/test/*.js','**/test-in-browser/*.js','**/test-helper/*.js']
    },
};

