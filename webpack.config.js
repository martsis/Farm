const path = require("path");
module.exports = {
    entry: "./js/index.js",

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "script.js"
    },
    devtool: 'source-map',
    watch: true
};