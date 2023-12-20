import { SSH } from "./class/ssh.class";

export const nginx_deploy = async () => {
  const ssh = new SSH('ma1p-vit1', 'atereschenko', 'Amazon123');
  
  // await ssh.uploadFile({
  //   source: `${__dirname}/../nginx/vit1/default`,
  //   target: `/etc/nginx/sites-available/default`,
  // });
  
  await ssh.exec('systemctl restart nginx').catch(e => console.log(e));

  ssh.close();
}

nginx_deploy();