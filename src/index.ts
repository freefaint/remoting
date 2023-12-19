#!/usr/bin/env node

const [nodePath, cachePath, command, ...params] = process.argv;

if (['build', 'deploy', 'run'].includes(command)) {
  const [project, profile, ...rest] = params;

  if (!project) {
    console.log('Project name is not defined!')
    process.exit(1)
  }

  console.log("command", command, "project", project, "profile", profile);
} else {
  console.log("command", command, "params", params);
}