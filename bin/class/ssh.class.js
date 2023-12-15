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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSH = void 0;
const node_ssh_1 = require("node-ssh");
const uuid_1 = __importDefault(require("uuid"));
class SSH {
    constructor(hostname, username, password) {
        this.hostname = hostname;
        this.username = username;
        this.password = password;
        this.ssh = new node_ssh_1.NodeSSH();
        this.ssh.connect({
            host: this.hostname,
            username: this.username,
            password: this.password
        });
    }
    uploadFile({ source, target, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { stdin: `${this.password}\n`, execOptions: { pty: true } };
            const rand = uuid_1.default.v4();
            console.log(`Connected to ${this.hostname}`);
            yield this.ssh.putFile(source, `~/${rand}`, null).then(function () {
                console.log(`File ${source} uploaded`);
            });
            yield this.ssh.exec("sudo", [`mv`, `~/${rand}`, target], options).then(() => {
                console.log(`Placed to ${target}`);
            });
            return this;
        });
    }
    exec(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { stdin: `${this.password}\n`, execOptions: { pty: true } };
            const parts = cmd.split(/\s/);
            return yield this.ssh.exec('sudo', parts, options).then(() => {
                console.log("Nginx restarted");
            });
        });
    }
    close() {
        return this.ssh.dispose();
    }
}
exports.SSH = SSH;
