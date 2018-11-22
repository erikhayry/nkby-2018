const webpack = require('webpack');

module.exports = {
    webpack: config => {
        config.plugins.push(
            new webpack.EnvironmentPlugin({
                GOOGLE_MAPS_API: ''
            })
        );

        return config;
    },
};
