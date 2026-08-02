module.exports = {
  requires: { bundle: "ai" },
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        message: "tensorboard --logdir ../workspace/outputs --host 127.0.0.1 --port {{env.TENSORBOARD_PORT || '6006'}}",
        on: [{ event: "/(http:\\/\\/(?:127\\.0\\.0\\.1|localhost):\\d+)/i", done: true }],
      },
    },
    {
      method: "local.set",
      params: { url: "{{input.event && input.event[1] ? input.event[1].replace('127.0.0.1','localhost') : 'http://localhost:' + (env.TENSORBOARD_PORT || '6006')}}" },
    },
  ],
};
