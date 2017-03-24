module.exports = {
    context: __dirname + "/app",
    entry: {
        App: "./assets/scripts/App.js",
        Vendor: "./assets/scripts/Vendor.js"
    },
    output: {
        path: __dirname + "/app/temp/scripts",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    }
}