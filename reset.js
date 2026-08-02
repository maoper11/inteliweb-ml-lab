module.exports = {
  run: [
    { method: "fs.rm", params: { path: "app" } },
    // Remove the legacy root-level workspace from versions prior to 0.1.2.
    { method: "fs.rm", params: { path: "workspace" } },
  ],
};
