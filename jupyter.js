module.exports = {
  requires: { bundle: "ai" },
  daemon: true,

  run: [
    {
      id: "start_jupyterlab",
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        env: {
          PYTHONUNBUFFERED: "1",
          TOKENIZERS_PARALLELISM: "false",
        },
        message: [
          "python -m jupyterlab --no-browser --ip 127.0.0.1 --port {{env.JUPYTER_PORT || '8888'}} --ServerApp.root_dir=../workspace",
        ],
        on: [
          {
            event: "/(http:\\/\\/(?:127\\.0\\.0\\.1|localhost):\\d+\\/lab\\?token=[^\\s]+)/i",
            done: true,
          },
          {
            event: "/(http:\\/\\/(?:127\\.0\\.0\\.1|localhost):\\d+\\/tree\\?token=[^\\s]+)/i",
            done: true,
          },
          { event: "/No module named/i", break: true },
          { event: "/is not recognized/i", break: true },
          { event: "/error:/i", break: false },
        ],
      },
    },
    {
      method: "local.set",
      params: {
        url: "{{(input.event && input.event[1] && /^https?:\\/\\//.test(input.event[1])) ? input.event[1].replace('127.0.0.1', 'localhost') : 'http://localhost:' + (env.JUPYTER_PORT || '8888')}}",
      },
    },
  ],
};
