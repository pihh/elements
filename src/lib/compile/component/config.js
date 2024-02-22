export const ComponentDefaultConfiguration = {
  shadow: "open",
  styles: "global",
};

export const ComponentRequiredConfigurations = ["template", "selector"];
export const ComponentConfigValidator = function (config = {}) {
  config = {
    ...ComponentDefaultConfiguration,
    ...config,
  };
  for (let req of ComponentRequiredConfigurations) {
    if (!config.hasOwnProperty(req)) {
      throw new Error(
        "ComponentConfigValidator:: Missing required configuration",
        req
      );
    }
  }
  return config;
};
