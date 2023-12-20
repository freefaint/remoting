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
exports.nginx_deploy = void 0;
const ssh_class_1 = require("./class/ssh.class");
const nginx_deploy = () => __awaiter(void 0, void 0, void 0, function* () {
    const ssh = new ssh_class_1.SSH('ma1p-vit1', 'atereschenko', 'Amazon123');
    // await ssh.uploadFile({
    //   source: `${__dirname}/../nginx/vit1/default`,
    //   target: `/etc/nginx/sites-available/default`,
    // });
    yield ssh.exec('systemctl restart nginx');
    ssh.close();
});
exports.nginx_deploy = nginx_deploy;
(0, exports.nginx_deploy)();
