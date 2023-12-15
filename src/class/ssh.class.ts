import { NodeSSH } from "node-ssh";
import uuid from "uuid";

export class SSH {
  private ssh: NodeSSH;

  constructor(private hostname: string, private username: string, private password: string) {
    this.ssh = new NodeSSH();

    this.ssh.connect({
      host: this.hostname,
      username: this.username,
      password: this.password
    });
  }

  public async uploadFile({
    source,
    target,
  }: {
    source: string,
    target: string,
  }) {
    const options = { stdin: `${this.password}\n`, execOptions: { pty: true } };
    const rand = uuid.v4();
  
    console.log(`Connected to ${this.hostname}`);
  
    await this.ssh.putFile(source, `~/${rand}`, null).then(function() {
      console.log(`File ${source} uploaded`);
    });
  
    await this.ssh.exec("sudo", [`mv`, `~/${rand}`, target], options).then(() => {
      console.log(`Placed to ${target}`);
    });
  
    return this;
  }

  public async exec(cmd: string) {
    const options = { stdin: `${this.password}\n`, execOptions: { pty: true } };

    const parts = cmd.split(/\s/);

    return await this.ssh.exec('sudo', parts, options).then(() => {
      console.log("Nginx restarted");
    });
  }

  public close() {
    return this.ssh.dispose();
  }
}
