// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/App.tsx', // Entry point of your application
    output: {
        filename: 'bundle.js', // Output bundle file name
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    // Other webpack configurations...
};
