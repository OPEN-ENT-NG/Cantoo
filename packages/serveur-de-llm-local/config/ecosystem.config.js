module.exports = {
  apps: [{
    name: "ai-server",
    script: "index.js",
    cwd: "@INSTALL_DIR@",
    exp_backoff_restart_delay: 100,
    watch: false,
    exec_mode: "fork",
    instances: 1,
    autorestart: true,
    env: {
      NODE_ENV: "production",
      PORT: "@PORT@",
      LISTEN_HOST: "127.0.0.1",
    },
    log_date_format: "YYYY-MM-DD HH:mm Z"
  }]
};
