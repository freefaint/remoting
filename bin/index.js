#!/usr/bin/env node
"use strict";
const [nodePath, cachePath, command, ...params] = process.argv;
if (['build', 'deploy', 'run'].includes(command)) {
    const [project, profile, ...rest] = params;
    console.log("command", command, "project", project, "profile", profile);
}
else {
    console.log("command", command, "params", params);
}
