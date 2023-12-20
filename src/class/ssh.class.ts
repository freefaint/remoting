import { NodeSSH, SSHExecOptions } from "node-ssh";
import { v4 } from "uuid";

export class SSH {
  private ssh: NodeSSH;

  constructor(private hostname: string, private username: string, private password: string) {
    this.ssh = new NodeSSH();
  }

  public async open() {
    return this.ssh.connect({
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
    const rand = v4();
  
    console.log(`Connected to ${this.hostname}`);
  
    await this.ssh.putFile(source, `~/${rand}`, null).then(function() {
      console.log(`File ${source} uploaded`);
    });
  
    await this.ssh.exec("sudo", [`mv`, `~/${rand}`, target], options).then(() => {
      console.log(`Placed to ${target}`);
    });
  
    return this;
  }

  public async uploadDir({
    source,
    target,
  }: {
    source: string,
    target: string,
  }) {
    console.log(`Connected to ${this.hostname}`);
  
    await this.ssh.putDirectory(source, target, { recursive: true }).then(function() {
      console.log(`Dir ${source} fynced with ${target} uploaded`);
    });
  
    return this;
  }

  public async exec(cmds: string[], opts?: SSHExecOptions) {
    const options = { ...opts, stdin: `${this.password}\n`, execOptions: { pty: true } } as any;
    console.log(cmds);
    for await (let cmd of cmds) {
      console.log('Run remote: ' + cmd);

      const parts = cmd.split(/\s/);
      const promise = parts[0] === 'cd' ? this.ssh.exec('cd', parts.slice(1), options) : this.ssh.exec('sudo', parts, options)

      await promise.then(result => console.log(result));
    }
    
    return;
  }

  public close() {
    return this.ssh.dispose();
  }
}
