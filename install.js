var cp = require('child_process')
var os = require('os')
var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm'

cp.spawn(npmCmd, ['install'], {env: process.env, cwd: './server', stdio: 'inherit'})
cp.spawn(npmCmd, ['install'], {env: process.env, cwd: './frontend', stdio: 'inherit'})