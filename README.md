# Inteliweb ML Lab

Isolated Python, PyTorch and JupyterLab environment installer for Pinokio by Inteliweb AI.

## Features

- Managed Python installation with `uv` — no system-wide Python required.
- Isolated virtual environment in `app/env`.
- Validated PyTorch profiles for NVIDIA CUDA, CPU, DirectML, ROCm and Apple Silicon.
- JupyterLab with its editable workspace stored inside `app/workspace`.
- Extensible course catalog stored in `app/curriculum`.
- Full machine-learning and generative-AI package profile.
- Environment verification and rebuild tools.
- Pinokio DEV mode automatically detects `app/env` and exposes a Python Shell with the environment activated.

## Default configuration

```ini
PYTHON_VER=3.12
TORCH_PROFILE=auto
COURSE_PROFILE=full
JUPYTER_PORT=8888
GPU_DEVICE=auto
```

## App structure

```text
app/
  curriculum/        # Master course content distributed with the launcher
    catalog.json
    python-to-diffusion/
    python-to-ai-agents/
    predictive-machine-learning/
  env/               # Isolated Python environment
  workspace/         # Editable student files opened in JupyterLab
    courses/
    shared/
    projects/
    datasets/
    models/
    outputs/
```

During installation, missing files are copied from `app/curriculum` into `app/workspace/courses`. Existing student files are preserved during an environment rebuild.

Deleting the complete Pinokio app removes the curriculum, environment and workspace together.

## CUDA clarification

CUDA profiles install the CUDA-enabled PyTorch wheels. They do not install the full NVIDIA CUDA Toolkit or `nvcc`. This is sufficient for normal PyTorch inference, training, Diffusers and image generation. A full CUDA Toolkit is only required for compiling custom CUDA code or extensions.

## Status

Initial MVP under active development.
