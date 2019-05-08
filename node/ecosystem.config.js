module.exports = {
  apps : [{
    name: 'server',
    // what to launch
    script: 'server.js',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args to pass to script
    args: 'one two',
    instances: 1,
    autorestart: true,
    //Enable or disable the watch mode
    watch: false,
    //Object that will be used as an options with chokidar (refer to chokidar documentation)
    //watch_options: { },
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
