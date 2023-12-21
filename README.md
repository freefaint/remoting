### Remoting


## Description

# This is awesome shell agent that helps to optimize your time.
# You can build, deploy, remotely start web applications with Remoting.


## Installing

# 1. Please, use 1aauto specified .npmrc inside of your home directory. Example:

registry=https://pkgs.dev.azure.com/1aauto/Technology/_packaging/1aauto/npm/registry/ 
always-auth=true

//pkgs.dev.azure.com/1aauto/Technology/_packaging/1aauto/npm/registry/:username=1aauto
//pkgs.dev.azure.com/1aauto/Technology/_packaging/1aauto/npm/registry/:_password=c2tseGRobWRzMmFrcW55b3hhd3BjMmliMzMyZHZ1dWM0dndwaDJ4Mjd0NHd3amg0NWlucQ==
//pkgs.dev.azure.com/1aauto/Technology/_packaging/1aauto/npm/registry/:email=atereschenko@1aauto.inc
//pkgs.dev.azure.com/1aauto/Technology/_packaging/1aauto/npm/:username=1aauto
//pkgs.dev.azure.com/1aauto/Technology/_packaging/1aauto/npm/:_password=c2tseGRobWRzMmFrcW55b3hhd3BjMmliMzMyZHZ1dWM0dndwaDJ4Mjd0NHd3amg0NWlucQ==
//pkgs.dev.azure.com/1aauto/Technology/_packaging/1aauto/npm/:email=atereschenko@1aauto.inc

# In your shell use:

npm i -g remoting


## Using

# In your project you must have a project.json file. It has your project profiles description. Example:

{
  "name": "ui-generator",

  "hosts": {
    "vit1": {
      "hostname": "ma1p-vit1",
      "username": "atereschenko"
    },

    "amznlm1": {
      "hostname": "ma1p-amznlm1",
      "username": "atereschenko"
    }
  },

  "profiles": {
    "qa": {
      "path": "./build",
      "host": "vit1",
      "dir": "/srv/api/ui/build/",

      "build": [
        "cp config.vit1.json src/config.json",
        "yarn",
        "yarn build"
      ],
      
      "start": [
        "ls"
      ]
    }
  },

  "scripts": {
    "nginx:vit1": [
      "remoting cp vit1 ./nginx/vit1/default /etc/nginx/sites-available/default",
      "remoting exec vit1 systemctl restart nginx"
    ],

    "nginx:amznlm1": [
      "remoting cp amznlm1 ./nginx/amznlm1/default /etc/nginx/sites-available/default",
      "remoting exec amznlm1 systemctl restart nginx"
    ]
  }
}

# This config has all data for building, deploying, running project on remote machines.
# In future wi will add to Remoting utility to control your project.json in any folder.


## Commands

# Help.
# You can use this to read this manual in shell. Use:

remoting help

# Build.
# It needs build section defined in your project.json in profile. So it works per profile.
# This command will run a couple of your commands to build project. Example:

remoting build qa

# Deploy
# If your profile has path to build and host specified and dir specified, this command wil sync local build folder and remote dir on host.
# Example:

remoting deploy qa

# Copy remote
# Specify three arguments (1 - host, 2 - source file on local, 3 - target file on remote host machine)
# Example:

remoting cp vit1 ~/.npmrc /var/www/.npmrc

# Exec command remotely
# Specify hostname and full command then
# Example:

remoting exec vit1 systemctl restart nginx

# Run script
# If you have scripts specified in  your package.json, just run them.
# Example

remoting run nginx:vit1