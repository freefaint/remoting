#!/usr/bin/env node
import { exec } from 'node:child_process';
import fs from "fs";
import { SSH } from "./class/ssh.class";
import { Hosts } from "./class/host.class";

const [nodePath, cachePath, command, ...params] = process.argv;

const hosts = new Hosts();

const shell = async (command: string, ...params: string[]) => {
  try {
    return import(`${process.cwd()}/project.json`).then(async ({ default: config }) => {
      if (!config.profiles || !Object.keys(config.profiles).length) {
        console.log("Error! Add project profile to config.json!");
        process.exit(1);
      }

      if (command === 'help') {
        fs.readFile(`${__dirname}/../README.md`, (err, data) => {
          console.log(data.toString());
        });
      }
      
      if (command === 'build') {
        const [profile] = params;
  
        if (!profile) {
          console.log("Specify profile!");
          process.exit(1);
        }
  
        const data = config.profiles[profile];
  
        if (!data) {
          console.log(`Profile ${profile} not found!`);
          process.exit(1);
        }

        const cmds = data.build;

        if (!cmds) {
          console.log(`Build schema for ${profile} is not specified!`);
          process.exit(1);
        }
        
        for await (let cmd of cmds) {
          const parts = cmd.split(/\s/);

          if (parts[0] !== 'remoting') {
            await new Promise((resolve, reject) => {
              console.log(cmd);

              exec(cmd, { cwd: process.cwd() }, (exception, stdout, stderr) => {
                console.log(stdout);

                if (exception) {
                  reject(stderr);
                } else {
                  resolve(stderr);
                }
              });
            })
          } else {
            await shell(...parts.slice(1) as [string, ...string[]]);
          }
        }
      }
  
      if (command === 'deploy') {
        const [profile] = params;
  
        if (!profile) {
          console.log("Specify profile!");
          process.exit(1);
        }
  
        const data = config.profiles[profile];
  
        if (!data) {
          console.log(`Profile ${profile} not found!`);
          process.exit(1);
        }
  
        const hostData = config.hosts[data.host];
  
        if (!hostData) {
          console.log(`Host ${data.host} data not found!`);
          process.exit(1);
        }
  
        if (!data.path) {
          console.log(`Build path for ${profile} not found!`);
          process.exit(1);
        }
  
        if (!data.dir) {
          console.log(`Remote dir for ${profile} not found!`);
          process.exit(1);
        }

       
  
        const { hostname, username, password } = await hosts.get(data.host, hostData);
  
        const ssh = new SSH(hostname!, username!, password!);
  
        await ssh.open();
  
        await ssh.uploadDir({
          source: data.path,
          target: data.dir,
        });
  
        ssh.close();
      }
  
      if (command === 'start') {
        const [profile] = params;
  
        if (!profile) {
          console.log("Specify profile!");
          process.exit(1);
        }
  
        const data = config.profiles[profile];
  
        if (!data) {
          console.log(`Profile ${profile} not found!`);
          process.exit(1);
        }
  
        if (!data.start) {
          console.log(`Start commands for ${profile} not found!`);
          process.exit(1);
        }
        
        const hostData = config.hosts[data.host];
  
        if (!hostData) {
          console.log(`Host ${data.host} data not found!`);
          process.exit(1);
        }
  
        const { hostname, username, password } = await hosts.get(data.host, hostData);
  
        const ssh = new SSH(hostname!, username!, password!);
  
        await ssh.open();
  
        await ssh.exec([
          ...data.start
        ], { cwd: data.dir });
  
        ssh.close();
      }
  
      if (command === 'cp') {
        const [host, source, target] = params;
  
        const hostData = config.hosts[host];
  
        if (!hostData) {
          console.log(`Host ${host} data not found!`);
          process.exit(1);
        }
  
        const { hostname, username, password } = await hosts.get(host, hostData);
  
        const ssh = new SSH(hostname!, username!, password!);
  
        await ssh.open();
  
        await ssh.uploadFile({
          source,
          target,
        });
  
        ssh.close();
      }
  
      if (command === 'exec') {
        const [host, ...rest] = params;
  
        const hostData = config.hosts[host];
  
        if (!hostData) {
          console.log(`Host ${host} data not found!`);
          process.exit(1);
        }
  
        const { hostname, username, password } = await hosts.get(host, hostData);
  
        const ssh = new SSH(hostname!, username!, password!);
  
        await ssh.open();
        await ssh.exec([rest.join(' ')]);
  
        ssh.close();
      }
  
      if (command === 'run') {
        const [script] = params;
  
        if (!script) {
          console.log(`Empty script name!`);
          process.exit(1);
        }
  
        const cmds = config.scripts[script];
  
        if (!cmds) {
          console.log(`Script ${script} is not specified!`);
          process.exit(1);
        }
        
        for await (let cmd of cmds) {
          const parts = cmd.split(/\s/);

          if (parts[0] !== 'remoting') {
            await new Promise((resolve, reject) => {
              console.log(cmd);

              exec(cmd, { cwd: process.cwd() }, (exception, stdout, stderr) => {
                console.log(stdout);

                if (exception) {
                  reject(stderr);
                } else {
                  resolve(stderr);
                }
              });
            })
          } else {
            await shell(...parts.slice(1) as [string, ...string[]]);
          }
        }
      }
    })
  } catch (e) {
    console.log("Error! Create project.json config!");
    process.exit(1);
  };
}

shell(command, ...params);
