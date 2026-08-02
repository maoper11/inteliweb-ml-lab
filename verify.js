module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        path: "{{args && args.path ? args.path : 'app'}}",
        venv: "{{args && args.venv ? args.venv : 'env'}}",
        message: [
          "python --version",
          "python -m pip --version",
          "python -m pip check",
          "python -c \"import sys; print('python_executable', sys.executable)\"",
          "python -c \"import torch; print('torch', torch.__version__); print('cuda_available', torch.cuda.is_available()); print('cuda_runtime', torch.version.cuda); print('hip', getattr(torch.version, 'hip', None)); print('mps_available', hasattr(torch.backends, 'mps') and torch.backends.mps.is_available()); print('gpu', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'none')\"",
          "python -c \"import jupyterlab, numpy, pandas, sklearn; print('JupyterLab and core ML packages: OK')\"",
          "jupyter kernelspec list",
        ],
      },
    },
  ],
};
