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
const ssh_class_1 = require("./class/ssh.class");
const nginx_deploy = ({ hostname, username, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const ssh = new ssh_class_1.SSH('ma1p-amznlm1', 'atereschenko', 'Amazon123');
    yield ssh.uploadFile({
        source: `${__dirname}/../nginx/amznlm1/default`,
        target: `/etc/nginx/sites-available/default`,
    });
    yield ssh.exec('systemctl restart nginx');
    ssh.close();
});
