#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { SSH } from "./class/ssh.class";
// import { Hosts } from "./class/host.class";
const vit1_1 = require("./vit1");
(0, vit1_1.nginx_deploy)();
// const [nodePath, cachePath, command, ...params] = process.argv;
// try {
//   import(`${process.cwd()}/project.json`).then(async ({ default: config }) => {
//     const hosts = new Hosts();
//     if (!config.profiles || !Object.keys(config.profiles).length) {
//       console.log("Error! Add project profile to config.json!");
//       process.exit(1);
//     }
//     if (command === 'build') {
//       const [profile] = params;
//       if (!profile) {
//         console.log("Specify profile!");
//         process.exit(1);
//       }
//       const data = config.profiles[profile];
//     }
//     if (command === 'deploy') {
//       const [profile] = params;
//       if (!profile) {
//         console.log("Specify profile!");
//         process.exit(1);
//       }
//       const data = config.profiles[profile];
//       if (!data) {
//         console.log(`Profile ${profile} not found!`);
//         process.exit(1);
//       }
//       const host = config.host[data.host];
//     }
//     if (command === 'run') {
//       const [profile] = params;
//     }
//     if (command === 'cp') {
//       const [host, source, target] = params;
//     }
//     if (command === 'exec') {
//       const [host, ...rest] = params;
//       const hostData = config.hosts[host];
//       if (!hostData) {
//         console.log(`Host ${host} data not found!`);
//         process.exit(1);
//       }
//       const { hostname, username, password } = await hosts.get(host, hostData);
//       // const ssh = new SSH(hostname!, username!, password!);
//       // await ssh.exec(rest.join(' '));
//       // ssh.close();
//       nginx_deploy();
//     }
//   })
// } catch (e) {
//   console.log("Error! Create project.json config!");
//   process.exit(1);
// };
