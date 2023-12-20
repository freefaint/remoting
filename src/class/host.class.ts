import prompt from "prompt";

export type Creds = { hostname?: string, username?: string, password?: string };

export class Host {
  hostname?: string;
  username?: string;
  password?: string;

  constructor (private data: Creds) {
    Object.keys(data).forEach(i => this[i] = data[i]);
  }

  async init() {
    return new Promise<void>((resolve, reject) => {
      const required = ['hostname', 'username', 'password'];
      const needed = required.filter(i => !Object.keys(this.data).includes(i));

      if (!needed.length) {
        return resolve();
      }

      const properties = needed.map(i => ({
        name: i,
        hidden: i === 'password'
      }));
    
      prompt.start();
    
      prompt.get(properties, (err, result) => {
        needed.forEach(i => this[i] = result[i]);

        return resolve();
      });
    });
  }
}

export class Hosts {
  private hosts: Record<string, Host> = {};

  async get(name: string, data: Creds) {
    if (this.hosts[name]) {
      return this.hosts[name];
    } else {
      const host = new Host(data);

      await host.init();

      this.hosts[name] = host;

      return host;
    }
  }
}