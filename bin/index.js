#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const ssh_class_1 = require("./class/ssh.class");
const host_class_1 = require("./class/host.class");
const [nodePath, cachePath, command, ...params] = process.argv;
const hosts = new host_class_1.Hosts();
const shell = (command, ...params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Promise.resolve(`${`${process.cwd()}/project.json`}`).then(s => __importStar(require(s))).then(({ default: config }) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_1, _b, _c, _d, e_2, _e, _f;
            if (!config.profiles || !Object.keys(config.profiles).length) {
                console.log("Error! Add project profile to config.json!");
                process.exit(1);
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
                try {
                    for (var _g = true, cmds_1 = __asyncValues(cmds), cmds_1_1; cmds_1_1 = yield cmds_1.next(), _a = cmds_1_1.done, !_a; _g = true) {
                        _c = cmds_1_1.value;
                        _g = false;
                        let cmd = _c;
                        const parts = cmd.split(/\s/);
                        if (parts[0] !== 'remoting') {
                            yield new Promise((resolve, reject) => {
                                console.log(cmd);
                                (0, node_child_process_1.exec)(cmd, { cwd: process.cwd() }, (exception, stdout, stderr) => {
                                    console.log(stdout);
                                    if (exception) {
                                        reject(stderr);
                                    }
                                    else {
                                        resolve(stderr);
                                    }
                                });
                            });
                        }
                        else {
                            yield shell(...parts.slice(1));
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_g && !_a && (_b = cmds_1.return)) yield _b.call(cmds_1);
                    }
                    finally { if (e_1) throw e_1.error; }
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
                const { hostname, username, password } = yield hosts.get(data.host, hostData);
                const ssh = new ssh_class_1.SSH(hostname, username, password);
                yield ssh.open();
                yield ssh.uploadDir({
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
                const { hostname, username, password } = yield hosts.get(data.host, hostData);
                const ssh = new ssh_class_1.SSH(hostname, username, password);
                yield ssh.open();
                yield ssh.exec([
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
                const { hostname, username, password } = yield hosts.get(host, hostData);
                const ssh = new ssh_class_1.SSH(hostname, username, password);
                yield ssh.open();
                yield ssh.uploadFile({
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
                const { hostname, username, password } = yield hosts.get(host, hostData);
                const ssh = new ssh_class_1.SSH(hostname, username, password);
                yield ssh.open();
                yield ssh.exec([rest.join(' ')]);
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
                try {
                    for (var _h = true, cmds_2 = __asyncValues(cmds), cmds_2_1; cmds_2_1 = yield cmds_2.next(), _d = cmds_2_1.done, !_d; _h = true) {
                        _f = cmds_2_1.value;
                        _h = false;
                        let cmd = _f;
                        const parts = cmd.split(/\s/);
                        if (parts[0] !== 'remoting') {
                            yield new Promise((resolve, reject) => {
                                console.log(cmd);
                                (0, node_child_process_1.exec)(cmd, { cwd: process.cwd() }, (exception, stdout, stderr) => {
                                    console.log(stdout);
                                    if (exception) {
                                        reject(stderr);
                                    }
                                    else {
                                        resolve(stderr);
                                    }
                                });
                            });
                        }
                        else {
                            yield shell(...parts.slice(1));
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_h && !_d && (_e = cmds_2.return)) yield _e.call(cmds_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }));
    }
    catch (e) {
        console.log("Error! Create project.json config!");
        process.exit(1);
    }
    ;
});
shell(command, ...params);
