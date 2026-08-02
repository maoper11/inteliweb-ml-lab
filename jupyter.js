module.exports = {
  requires: { bundle: "ai" },
  daemon: true,

  run: [
    {
      id: "start_jupyterlab",
      method: "shell.run",
      params: {
        // Start directly inside the persistent workspace. This avoids passing
        // a relative ServerApp.root_dir value that Jupyter may normalize with
        // literal quotes on Windows.
        path: "workspace",
        venv: "../app/env",
        env: {
          PYTHONUNBUFFERED: "1",
          TOKENIZERS_PARALLELISM: "false",
        },
        message: [
          "python -m jupyterlab --no-browser --ip 127.0.0.1 --port {{env.JUPYTER_PORT || '8888'}}",
        ],
        on: [
          {
            event: "/(http:\\/\\/(?:127\\.0\\.0\\.1|localhost):\\d+\\/lab\\?token=[^\\s]+)/i",
            done: true,
          },
          {
            event: "/(http:\\/\\/(?:127\\.0\\.0\\.1|localhost):\\d+\\?token=[^\\s]+)/i",
            done: true,
          },
          { event: "/No module named/i", break: true },
          { event: "/is not recognized/i", break: true },
          { event: "/Bad config encountered/i", break: true },
          { event: "/error:/i", break: false },
        ],
      },
    },
    {
      // Do not create a fake localhost link when the server failed to start.
      when: "{{input.event && input.event[1] && /^https?:\\/\\//.test(input.event[1])}}",
      method: "local.set",
      params: {
        url: "{{input.event[1].replace('127.0.0.1', 'localhost')}}",
      },
    },
  ],
};
