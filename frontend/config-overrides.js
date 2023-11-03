module.exports = {
    webpack: (config, env) => {

        config.plugins = config.plugins.filter(plugin => plugin.constructor.name !== 'ESLintWebpackPlugin')

        return config
    }
}