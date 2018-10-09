module.exports = {
  apps: [{
    name: 'todo-api',
    script: './src/server.js',
    instances: 4,
    watch: true,
    env: {
      'NODE_ENV': 'development',
    },
    env_production: {
      'NODE_ENV': 'production'
    }
  }
  ]
};
