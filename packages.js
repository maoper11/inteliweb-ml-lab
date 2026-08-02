module.exports = {
  run: [
    {
      when: "{{String(env.COURSE_PROFILE || 'full').toLowerCase() === 'minimal'}}",
      method: "shell.run",
      params: {
        venv: "{{args && args.venv ? args.venv : null}}",
        path: "{{args && args.path ? args.path : '.'}}",
        message: "uv pip install -r ../requirements/minimal.txt",
      },
    },
    {
      when: "{{String(env.COURSE_PROFILE || 'full').toLowerCase() === 'standard'}}",
      method: "shell.run",
      params: {
        venv: "{{args && args.venv ? args.venv : null}}",
        path: "{{args && args.path ? args.path : '.'}}",
        message: "uv pip install -r ../requirements/standard.txt",
      },
    },
    {
      when: "{{String(env.COURSE_PROFILE || 'full').toLowerCase() === 'data-science'}}",
      method: "shell.run",
      params: {
        venv: "{{args && args.venv ? args.venv : null}}",
        path: "{{args && args.path ? args.path : '.'}}",
        message: "uv pip install -r ../requirements/data-science.txt",
      },
    },
    {
      when: "{{String(env.COURSE_PROFILE || 'full').toLowerCase() === 'generative-ai'}}",
      method: "shell.run",
      params: {
        venv: "{{args && args.venv ? args.venv : null}}",
        path: "{{args && args.path ? args.path : '.'}}",
        message: "uv pip install -r ../requirements/generative-ai.txt",
      },
    },
    {
      when: "{{!['minimal','standard','data-science','generative-ai'].includes(String(env.COURSE_PROFILE || 'full').toLowerCase())}}",
      method: "shell.run",
      params: {
        venv: "{{args && args.venv ? args.venv : null}}",
        path: "{{args && args.path ? args.path : '.'}}",
        message: "uv pip install -r ../requirements/full.txt",
      },
    },
  ],
};
