module.exports = {
    apps: [
        {
            name: 'speech-api',
            script: 'npm',
            args: 'run start:prod',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        },
    ],
};
