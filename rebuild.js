module.exports = {
  requires: { bundle: "ai" },
  run: [
    {
      method: "fs.rm",
      params: { path: "app/env" },
    },
    {
      method: "script.start",
      params: { uri: "install.js" },
    },
  ],
};
