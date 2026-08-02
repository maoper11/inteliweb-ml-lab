# Inteliweb ML Lab Curriculum

This directory contains the master course content distributed with the Pinokio launcher.

Each course is independent and should include:

```text
<course-slug>/
  course.json
  README.md
  modules/
  assets/
  projects/
  solutions/
```

The installer copies missing course files from `app/curriculum` into `app/workspace/courses` without overwriting files already modified by the student.

## Planned learning routes

- `python-to-diffusion` — Python foundations, PyTorch, computer vision, diffusion models and ComfyUI concepts.
- `python-to-ai-agents` — Python, APIs, tools, structured outputs, memory, RAG and agent workflows.
- `predictive-machine-learning` — data preparation, supervised learning, evaluation, forecasting and deployment.

Only `python-to-diffusion` is enabled initially. The other routes are placeholders for future development.
