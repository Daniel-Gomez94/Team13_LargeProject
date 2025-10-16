module.exports = {
  apps: [{
    name: 'ucf-coding-practice',
    script: 'server.js',
    cwd: './Backend',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 5000,
      HOST: '0.0.0.0'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      HOST: '0.0.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};