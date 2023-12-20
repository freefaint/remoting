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
exports.Hosts = exports.Host = void 0;
const prompt_1 = __importDefault(require("prompt"));
class Host {
    constructor(data) {
        this.data = data;
        Object.keys(data).forEach(i => this[i] = data[i]);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const required = ['hostname', 'username', 'password'];
                const needed = required.filter(i => !Object.keys(this.data).includes(i));
                if (!needed.length) {
                    return resolve();
                }
                const properties = needed.map(i => ({
                    name: i,
                    hidden: i === 'password'
                }));
                prompt_1.default.start();
                prompt_1.default.get(properties, (err, result) => {
                    needed.forEach(i => this[i] = result[i]);
                    return resolve();
                });
            });
        });
    }
}
exports.Host = Host;
class Hosts {
    constructor() {
        this.hosts = {};
    }
    get(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hosts[name]) {
                return this.hosts[name];
            }
            else {
                const host = new Host(data);
                yield host.init();
                this.hosts[name] = host;
                return host;
            }
        });
    }
}
exports.Hosts = Hosts;
