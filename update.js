module.exports = async () => ({
  requires: { bundle: "ai" },
  run: [
    {
      method: "shell.run",
      params: {
        message: "git pull --ff-only",
      },
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        message: [
          "python -m pip install -U pip setuptools wheel",
          "python -m pip install -U jupyterlab notebook ipykernel ipywidgets tensorboard",
        ],
      },
    },
    {
      method: "script.start",
      params: {
        uri: "packages.js",
        params: { path: "app", venv: "env" },
      },
    },
    {
      method: "script.start",
      params: {
        uri: "verify.js",
        params: { path: "app", venv: "env" },
      },
    },
  ],
});
