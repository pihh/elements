export const stringContentType = function (str) {
    if (!isNaN(str)) {
      return {
        type: "number",
        value: Number(str),
      };
    } else if (["true", "false"].indexOf(str) > -1) {
      return {
        type: "boolean",
        value: "true" == str,
      };
    } else {
      return {
        type: "string",
        value: str,
      };
    }
  };