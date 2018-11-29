const webpack = require('webpack');
const withSass = require('@zeit/next-sass');

const styleConfig = {
    cssModules: true,
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: '[name]_[local]_[hash:base64:5]'

    }
};



module.exports = withSass({
    webpack: config => {
        config.plugins.push(
            new webpack.EnvironmentPlugin({
                GOOGLE_MAPS_API: ''
            })
        );

        return config;
    },
    ...styleConfig
});
