module.exports = {
  requires: { bundle: "ai" },
  daemon: true,

  run: [
    {
      id: "start_tensorboard",
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        message: [
          "python -m tensorboard.main --logdir ../workspace/outputs --host 127.0.0.1 --port {{env.TENSORBOARD_PORT || '6006'}}",
        ],
        on: [
          {
            event: "/(http:\\/\\/(?:127\\.0\\.0\\.1|localhost):\\d+)/i",
            done: true,
          },
          { event: "/No module named/i", break: true },
          { event: "/is not recognized/i", break: true },
          { event: "/error/i", break: false },
        ],
      },
    },
    {
      method: "local.set",
      params: {
        url: "{{(input.event && input.event[1] && /^https?:\\/\\//.test(input.event[1])) ? input.event[1].replace('127.0.0.1', 'localhost') : 'http://localhost:' + (env.TENSORBOARD_PORT || '6006')}}",
      },
    },
  ],
};
