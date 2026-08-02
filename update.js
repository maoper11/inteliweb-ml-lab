module.exports = async () => ({
  requires: { bundle: "ai" },
  run: [
    { method: "shell.run", params: { message: "git pull --ff-only" } },

    // Create the new app-contained workspace structure.
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "{{ platform === 'win32' ? 'if not exist workspace mkdir workspace' : 'mkdir -p workspace' }}",
          "{{ platform === 'win32' ? 'if not exist workspace\\notebooks mkdir workspace\\notebooks' : 'mkdir -p workspace/notebooks' }}",
          "{{ platform === 'win32' ? 'if not exist workspace\\scripts mkdir workspace\\scripts' : 'mkdir -p workspace/scripts' }}",
          "{{ platform === 'win32' ? 'if not exist workspace\\datasets mkdir workspace\\datasets' : 'mkdir -p workspace/datasets' }}",
          "{{ platform === 'win32' ? 'if not exist workspace\\models mkdir workspace\\models' : 'mkdir -p workspace/models' }}",
          "{{ platform === 'win32' ? 'if not exist workspace\\outputs mkdir workspace\\outputs' : 'mkdir -p workspace/outputs' }}",
        ],
      },
    },

    // Migrate files from the legacy root-level workspace when present.
    {
      method: "shell.run",
      params: {
        message: [
          "{{ platform === 'win32' ? 'if exist workspace\\* xcopy workspace\\* app\\workspace\\ /E /I /Y' : 'if [ -d workspace ]; then cp -a workspace/. app/workspace/; fi' }}",
          "{{ platform === 'win32' ? 'if exist workspace rmdir /s /q workspace' : 'rm -rf workspace' }}",
        ],
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
      params: { uri: "packages.js", params: { path: "app", venv: "env" } },
    },
    {
      method: "script.start",
      params: { uri: "verify.js", params: { path: "app", venv: "env" } },
    },
  ],
});
