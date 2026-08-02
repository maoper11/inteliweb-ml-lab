module.exports = async (kernel, info) => {
  const run = [
    {
      method: "shell.run",
      params: {
        message: "{{ platform === 'win32' ? 'if not exist app mkdir app' : 'mkdir -p app' }}",
      },
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "{{ platform === 'win32' ? 'if not exist workspace mkdir workspace' : 'mkdir -p workspace' }}",
      },
    },
    {
      method: "shell.run",
      params: {
        path: "app/workspace",
        message: [
          "{{ platform === 'win32' ? 'if not exist courses mkdir courses' : 'mkdir -p courses' }}",
          "{{ platform === 'win32' ? 'if not exist shared mkdir shared' : 'mkdir -p shared' }}",
          "{{ platform === 'win32' ? 'if not exist projects mkdir projects' : 'mkdir -p projects' }}",
          "{{ platform === 'win32' ? 'if not exist datasets mkdir datasets' : 'mkdir -p datasets' }}",
          "{{ platform === 'win32' ? 'if not exist models mkdir models' : 'mkdir -p models' }}",
          "{{ platform === 'win32' ? 'if not exist outputs mkdir outputs' : 'mkdir -p outputs' }}",
        ],
      },
    },
    {
      method: "shell.run",
      params: {
        path: "app/workspace/shared",
        message: [
          "{{ platform === 'win32' ? 'if not exist assets mkdir assets' : 'mkdir -p assets' }}",
          "{{ platform === 'win32' ? 'if not exist utilities mkdir utilities' : 'mkdir -p utilities' }}",
        ],
      },
    },
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
    {
      method: "script.start",
      params: {
        uri: "pytorch.js",
        params: { path: "app", venv: "env" },
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
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        message: "python ../tools/install_courses.py curriculum workspace/courses",
      },
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
