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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSH = void 0;
const node_ssh_1 = require("node-ssh");
const uuid_1 = require("uuid");
class SSH {
    constructor(hostname, username, password) {
        this.hostname = hostname;
        this.username = username;
        this.password = password;
        this.ssh = new node_ssh_1.NodeSSH();
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ssh.connect({
                host: this.hostname,
                username: this.username,
                password: this.password
            });
        });
    }
    uploadFile({ source, target, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { stdin: `${this.password}\n`, execOptions: { pty: true } };
            const rand = (0, uuid_1.v4)();
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
    uploadDir({ source, target, }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Connected to ${this.hostname}`);
            yield this.ssh.putDirectory(source, target, { recursive: true }).then(function () {
                console.log(`Dir ${source} fynced with ${target} uploaded`);
            });
            return this;
        });
    }
    exec(cmds, opts) {
        var _a, cmds_1, cmds_1_1;
        var _b, e_1, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const options = Object.assign(Object.assign({}, opts), { stdin: `${this.password}\n`, execOptions: { pty: true } });
            console.log(cmds);
            try {
                for (_a = true, cmds_1 = __asyncValues(cmds); cmds_1_1 = yield cmds_1.next(), _b = cmds_1_1.done, !_b; _a = true) {
                    _d = cmds_1_1.value;
                    _a = false;
                    let cmd = _d;
                    console.log('Run remote: ' + cmd);
                    const parts = cmd.split(/\s/);
                    const promise = parts[0] === 'cd' ? this.ssh.exec('cd', parts.slice(1), options) : this.ssh.exec('sudo', parts, options);
                    yield promise.then(result => console.log(result));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = cmds_1.return)) yield _c.call(cmds_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return;
        });
    }
    close() {
        return this.ssh.dispose();
    }
}
exports.SSH = SSH;
