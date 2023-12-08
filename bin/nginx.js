"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nginx = void 0;
const node_ssh_1 = require("node-ssh");
const ssh = new node_ssh_1.NodeSSH();
// const host = 'ma1p-vit1';
const username = 'atereschenko';
const password = 'Amazon123';
const nginx = (host, dir) => {
    ssh.connect({
        host,
        username,
        password,
    })
        .then((conn) => __awaiter(void 0, void 0, void 0, function* () {
        const options = { stdin: `${password}\n`, execOptions: { pty: true } };
        console.log("Connected to " + host);
        yield ssh.putFile(`${__dirname}/../nginx/${dir}/default`, '~/default', null).then(function () {
            console.log("The File thing is done");
        });
        yield ssh.exec("sudo", [`mv`, `~/default`, `/etc/nginx/sites-available/default`], options).then(() => {
            console.log("Placed to nginx conf");
        });
        yield ssh.exec("sudo", ["systemctl", "restart", "nginx"], options).then(() => {
            console.log("Nginx restarted");
        });
        ssh.dispose();
    }));
};
exports.nginx = nginx;
