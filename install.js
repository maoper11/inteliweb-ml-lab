module.exports = async (kernel, info) => {
  const run = [
    // 1) Create the application and persistent workspace folders.
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

    // 2) Install a uv-managed Python and create app/env.
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "uv python install {{env.PYTHON_VER || '3.12'}}",
          "{{ platform === 'win32' ? 'if exist .installed del /f /q .installed' : 'rm -f .installed' }}",
          "{{ platform === 'win32' ? 'if exist env rmdir /s /q env' : 'rm -rf env' }}",
          "uv venv --python {{env.PYTHON_VER || '3.12'}} env",
        ],
      },
    },

    // 3) Bootstrap pip and install Jupyter services.
    // uv venv does not guarantee that pip is initially available, so use
    // uv pip first, matching the proven Inteliweb ComfyUI installer pattern.
    {
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        message: [
          "uv pip install -U pip setuptools wheel",
          "uv pip install jupyterlab notebook ipykernel ipywidgets tensorboard",
          "python -m pip --version",
          "python -m jupyterlab --version",
          "python -m tensorboard.main --version",
        ],
      },
    },

    // 4) Install the selected validated PyTorch build.
    {
      method: "script.start",
      params: {
        uri: "pytorch.js",
        params: { path: "app", venv: "env" },
      },
    },

    // 5) Install the selected course package profile.
    {
      method: "script.start",
      params: {
        uri: "packages.js",
        params: { path: "app", venv: "env" },
      },
    },

    // 6) Register a clearly named Jupyter kernel inside app/env.
    {
      when: "{{String(env.REGISTER_JUPYTER_KERNEL || 'true').toLowerCase() !== 'false'}}",
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        message: "python -m ipykernel install --sys-prefix --name inteliweb-ml --display-name \"Python - Inteliweb ML Lab\"",
      },
    },

    // 7) Final checks. Any failure prevents the completion marker.
    {
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        message: [
          "python -c \"import jupyterlab, tensorboard, torch; print('jupyterlab', jupyterlab.__version__); print('tensorboard', tensorboard.__version__); print('torch', torch.__version__); print('cuda_available', torch.cuda.is_available()); print('cuda_runtime', torch.version.cuda)\"",
          "python -m pip check",
        ],
      },
    },

    // 8) Mark the installation as complete only after every required import works.
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "{{ platform === 'win32' ? 'type nul > .installed' : 'touch .installed' }}",
      },
    },
  ];

  return { run, requires: { bundle: "ai" } };
};
