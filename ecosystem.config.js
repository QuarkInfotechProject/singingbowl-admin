module.exports = {
    apps: [
      {
        name: 'admin.zolpastore.com',
        script: 'npm',
        exec_mode: "cluster",  // Enables clustering
        instances: "1", // Change to "max" to use all available cores        
        args: 'run start',
        watch: false, // Set to true if you want to watch file changes
        max_memory_restart: "2G",
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  
  