import Config from "webpack-config";
module.exports = function(env, argv) {
  return new Config().extend(
    "config/webpack." + argv.env.NODE_ENV + ".config.js"
  );
};
