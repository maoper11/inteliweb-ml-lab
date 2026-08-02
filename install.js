module.exports = async () => ({
  requires: { bundle: "ai" },
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          "{{ platform === 'win32' ? 'if not exist app mkdir app' : 'mkdir -p app' }}",
          "{{ platform === 'win32' ? 'if not exist workspace\\notebooks mkdir workspace\\notebooks' : 'mkdir -p workspace/notebooks' }}",
          "{{ platform === 'win32' ? 'if not exist workspace\\scripts mkdir workspace\\scripts' : 'mkdir -p workspace/scripts' }}",
          "{{ platform === 'win32' ? 'if not exist workspace\\datasets mkdir workspace\\datasets' : 'mkdir -p workspace/datasets' }}",
          "{{ platform === 'win32' ? 'if not exist workspace\\models mkdir workspace\\models' : 'mkdir -p workspace/models' }}",
          "{{ platform === 'win32' ? 'if not exist workspace\\outputs mkdir workspace\\outputs' : 'mkdir -p workspace/outputs' }}",
        ],
      },
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "uv python install {{env.PYTHON_VER || '3.12'}}",
          "{{ platform === 'win32' ? 'if exist env rmdir /s /q env' : 'rm -rf env' }}",
          "uv venv --python {{env.PYTHON_VER || '3.12'}} env",
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
          "python -m pip install jupyterlab notebook ipykernel ipywidgets tensorboard",
        ],
      },
    },
    {
      method: "script.start",
      params: { uri: "pytorch.js", params: { path: "app", venv: "env" } },
    },
    {
      method: "script.start",
      params: { uri: "packages.js", params: { path: "app", venv: "env" } },
    },
    {
      when: "{{String(env.REGISTER_JUPYTER_KERNEL || 'true').toLowerCase() !== 'false'}}",
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        message: "python -m ipykernel install --sys-prefix --name inteliweb-ml --display-name \"Python - Inteliweb ML Lab\"",
      },
    },
    {
      method: "script.start",
      params: { uri: "verify.js", params: { path: "app", venv: "env" } },
    },
  ],
});
