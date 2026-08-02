module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        venv: "{{args.venv}}",
        path: "{{args.path}}",
        message: "python -m pip uninstall -y torch torchvision torchaudio triton triton-windows torch-directml xformers || true",
      },
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia' && ['', 'auto', '2.10.0-cu130'].includes(String(env.TORCH_PROFILE || 'auto').toLowerCase())}}",
      method: "shell.run",
      params: {
        venv: "{{args.venv}}", path: "{{args.path}}",
        message: [
          "python -m pip install torch==2.10.0 torchvision==0.25.0 torchaudio==2.10.0 --index-url https://download.pytorch.org/whl/cu130 --force-reinstall --no-deps",
          "python -m pip install \"triton-windows>=3.6,<3.7\"",
        ],
      },
    },
    {
      when: "{{platform === 'linux' && gpu === 'nvidia' && ['', 'auto', '2.10.0-cu130'].includes(String(env.TORCH_PROFILE || 'auto').toLowerCase())}}",
      method: "shell.run",
      params: {
        venv: "{{args.venv}}", path: "{{args.path}}",
        message: [
          "python -m pip install torch==2.10.0 torchvision==0.25.0 torchaudio==2.10.0 --index-url https://download.pytorch.org/whl/cu130 --force-reinstall --no-deps",
          "python -m pip install \"triton>=3.6,<3.7\"",
        ],
      },
    },
    {
      when: "{{(platform === 'win32' || platform === 'linux') && gpu === 'nvidia' && String(env.TORCH_PROFILE || '').toLowerCase() === '2.9.1-cu128'}}",
      method: "shell.run",
      params: {
        venv: "{{args.venv}}", path: "{{args.path}}",
        message: [
          "python -m pip install torch==2.9.1 torchvision==0.24.1 torchaudio==2.9.1 --index-url https://download.pytorch.org/whl/cu128 --force-reinstall --no-deps",
          "{{platform === 'win32' ? 'python -m pip install \"triton-windows>=3.5,<3.6\"' : 'python -m pip install \"triton>=3.5,<3.6\"'}}",
        ],
      },
    },
    {
      when: "{{(platform === 'win32' || platform === 'linux') && gpu === 'nvidia' && String(env.TORCH_PROFILE || '').toLowerCase() === '2.8.0-cu128'}}",
      method: "shell.run",
      params: {
        venv: "{{args.venv}}", path: "{{args.path}}",
        message: [
          "python -m pip install torch==2.8.0 torchvision==0.23.0 torchaudio==2.8.0 --index-url https://download.pytorch.org/whl/cu128 --force-reinstall --no-deps",
          "{{platform === 'win32' ? 'python -m pip install \"triton-windows>=3.4,<3.5\"' : 'python -m pip install \"triton>=3.4,<3.5\"'}}",
        ],
      },
    },
    {
      when: "{{(platform === 'win32' || platform === 'linux') && gpu === 'nvidia' && String(env.TORCH_PROFILE || '').toLowerCase() === 'latest-cu130'}}",
      method: "shell.run",
      params: {
        venv: "{{args.venv}}", path: "{{args.path}}",
        message: [
          "python -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu130 --force-reinstall --no-deps",
          "{{platform === 'win32' ? 'python -m pip install -U triton-windows' : 'python -m pip install -U triton'}}",
        ],
      },
    },
    {
      when: "{{platform === 'win32' && gpu === 'amd' && ['', 'auto', 'directml'].includes(String(env.TORCH_PROFILE || 'auto').toLowerCase())}}",
      method: "shell.run",
      params: { venv: "{{args.venv}}", path: "{{args.path}}", message: ["python -m pip install numpy==1.26.4 --force-reinstall", "python -m pip install torch-directml torch torchvision torchaudio --force-reinstall"] },
    },
    {
      when: "{{platform === 'darwin' && arch === 'arm64'}}",
      method: "shell.run",
      params: { venv: "{{args.venv}}", path: "{{args.path}}", message: "python -m pip install torch torchvision torchaudio --force-reinstall" },
    },
    {
      when: "{{String(env.TORCH_PROFILE || '').toLowerCase() === 'cpu' || (platform === 'linux' && gpu === 'amd' && ['', 'auto'].includes(String(env.TORCH_PROFILE || 'auto').toLowerCase())) || (platform === 'darwin' && arch === 'x64')}}",
      method: "shell.run",
      params: { venv: "{{args.venv}}", path: "{{args.path}}", message: "python -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu --force-reinstall --no-deps" },
    },
    {
      when: "{{platform === 'linux' && gpu === 'amd' && String(env.TORCH_PROFILE || '').toLowerCase() === '2.7.0-rocm6.3'}}",
      method: "shell.run",
      params: { venv: "{{args.venv}}", path: "{{args.path}}", message: "python -m pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index-url https://download.pytorch.org/whl/rocm6.3 --force-reinstall --no-deps" },
    },
  ],
};
