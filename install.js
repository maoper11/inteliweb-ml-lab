module.exports = async (kernel, info) => {
  const run = [
    // 1) Create app.
    {
      method: "shell.run",
      params: {
        message: "{{ platform === 'win32' ? 'if not exist app mkdir app' : 'mkdir -p app' }}",
      },
    },

    // 2) Create app/workspace without nested paths in the command.
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "{{ platform === 'win32' ? 'if not exist workspace mkdir workspace' : 'mkdir -p workspace' }}",
      },
    },

    // 3) Create each workspace subfolder from inside app/workspace.
    // This avoids backslash escaping in Pinokio on Windows.
    {
      method: "shell.run",
      params: {
        path: "app/workspace",
        message: [
          "{{ platform === 'win32' ? 'if not exist notebooks mkdir notebooks' : 'mkdir -p notebooks' }}",
          "{{ platform === 'win32' ? 'if not exist scripts mkdir scripts' : 'mkdir -p scripts' }}",
          "{{ platform === 'win32' ? 'if not exist datasets mkdir datasets' : 'mkdir -p datasets' }}",
          "{{ platform === 'win32' ? 'if not exist models mkdir models' : 'mkdir -p models' }}",
          "{{ platform === 'win32' ? 'if not exist outputs mkdir outputs' : 'mkdir -p outputs' }}",
        ],
      },
    },

    // 4) Install a uv-managed Python and create app/env.
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

    // 5) Bootstrap pip and install Jupyter services.
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

    // 6) Install the selected validated PyTorch build.
    {
      method: "script.start",
      params: {
        uri: "pytorch.js",
        params: { path: "app", venv: "env" },
      },
    },

    // 7) Install the selected course package profile.
    {
      method: "script.start",
      params: {
        uri: "packages.js",
        params: { path: "app", venv: "env" },
      },
    },

    // 8) Register a clearly named Jupyter kernel inside app/env.
    {
      when: "{{String(env.REGISTER_JUPYTER_KERNEL || 'true').toLowerCase() !== 'false'}}",
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        message: "python -m ipykernel install --sys-prefix --name inteliweb-ml --display-name \"Python - Inteliweb ML Lab\"",
      },
    },

    // 9) Final checks. Any failure prevents the completion marker.
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

    // 10) Mark the installation as complete only after every required import works.
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
