const WebpackObfuscator = require('webpack-obfuscator');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.plugins.push(
      new WebpackObfuscator({
        rotate: true,
        selfDefending: true, // 自我防御，如果格式化代码则失效
        stringArray: true,
        stringArrayThreshold: 0.75
      })
    );
  }
  return config;
};