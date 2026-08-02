module.exports = {
  requires: { bundle: "ai" },
  daemon: true,

  run: [
    {
      id: "start_tensorboard",
      method: "shell.run",
      params: {
        path: "app/workspace",
        venv: "../env",
        message: [
          "python -m tensorboard.main --logdir outputs --host 127.0.0.1 --port {{env.TENSORBOARD_PORT || '6006'}}",
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
      when: "{{input.event && input.event[1] && /^https?:\\/\\//.test(input.event[1])}}",
      method: "local.set",
      params: {
        url: "{{input.event[1].replace('127.0.0.1', 'localhost')}}",
      },
    },
  ],
};
