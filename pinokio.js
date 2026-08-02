module.exports = {
  version: "0.1.0",
  title: "Inteliweb ML Lab",
  description: "Isolated Python, PyTorch and JupyterLab environment for machine learning courses.",
  icon: "icon.png",

  menu: async (kernel, info) => {
    const installed = info.exists("app/env");
    const running = {
      install: info.running("install.js"),
      jupyter: info.running("jupyter.js"),
      tensorboard: info.running("tensorboard.js"),
      verify: info.running("verify.js"),
      update: info.running("update.js"),
      rebuild: info.running("rebuild.js"),
      reset: info.running("reset.js"),
    };

    if (running.install) return [{ default: true, icon: "fa-solid fa-plug", text: "Installing", href: "install.js" }];
    if (!installed) return [{ default: true, icon: "fa-solid fa-plug", text: "Install", href: "install.js" }];

    const menu = [];

    if (running.jupyter) {
      const local = info.local("jupyter.js");
      if (local && local.url) menu.push({ default: true, icon: "fa-solid fa-book", text: "Open JupyterLab", href: local.url });
      menu.push({ icon: "fa-solid fa-terminal", text: "JupyterLab Terminal", href: "jupyter.js" });
    } else {
      menu.push({ default: true, icon: "fa-solid fa-play", text: "Start JupyterLab", href: "jupyter.js" });
    }

    if (running.tensorboard) {
      const local = info.local("tensorboard.js");
      if (local && local.url) menu.push({ icon: "fa-solid fa-chart-line", text: "Open TensorBoard", href: local.url });
      menu.push({ icon: "fa-solid fa-terminal", text: "TensorBoard Terminal", href: "tensorboard.js" });
    } else {
      menu.push({ icon: "fa-solid fa-chart-line", text: "Start TensorBoard", href: "tensorboard.js" });
    }

    menu.push(
      { icon: "fa-solid fa-circle-check", text: running.verify ? "Verifying" : "Verify Environment", href: "verify.js" },
      { icon: "fa-solid fa-rotate", text: running.update ? "Updating" : "Update Packages", href: "update.js" },
      { icon: "fa-solid fa-arrows-rotate", text: running.rebuild ? "Rebuilding" : "Rebuild Environment", href: "rebuild.js", confirm: "Recreate app/env? Your workspace files will be preserved." },
      { icon: "fa-regular fa-circle-xmark", text: running.reset ? "Resetting" : "Factory Reset", href: "reset.js", confirm: "Delete app and workspace? This removes notebooks, datasets, models and outputs." }
    );

    return menu;
  },
};
