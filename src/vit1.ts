import { SSH } from "class/ssh.class";

const nginx_deploy = async ({ hostname, username, password, }: { hostname: string, username: string, password: string }) => {
  const ssh = new SSH('ma1p-amznlm1', 'atereschenko', 'Amazon123');
  
  await ssh.uploadFile({
    source: `${__dirname}/../nginx/amznlm1/default`,
    target: `/etc/nginx/sites-available/default`,
  });
  
  await ssh.exec('systemctl restart nginx');

  ssh.close();
}
