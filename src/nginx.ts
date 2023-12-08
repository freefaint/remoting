import { NodeSSH } from "node-ssh";

const ssh = new NodeSSH();

// const host = 'ma1p-vit1';
const username = 'atereschenko';
const password = 'Amazon123';

export const nginx = (host: string, dir: string) => {
  ssh.connect({
    host,
    username,
    password,
  })
  .then(async (conn) => {
    const options = { stdin: `${password}\n`, execOptions: { pty: true } };

    console.log("Connected to " + host);

    await ssh.putFile(`${__dirname}/../nginx/${dir}/default`, '~/default', null).then(function() {
      console.log("The File thing is done");
    });

    await ssh.exec("sudo", [`mv`, `~/default`, `/etc/nginx/sites-available/default`], options).then(() => {
      console.log("Placed to nginx conf");
    });

    await ssh.exec("sudo", ["systemctl", "restart", "nginx"], options).then(() => {
      console.log("Nginx restarted");
    });

    ssh.dispose();
  });
}
