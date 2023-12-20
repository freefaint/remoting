import { NodeSSH, SSHExecOptions } from "node-ssh";
export declare class SSH {
    private hostname;
    private username;
    private password;
    private ssh;
    constructor(hostname: string, username: string, password: string);
    open(): Promise<NodeSSH>;
    uploadFile({ source, target, }: {
        source: string;
        target: string;
    }): Promise<this>;
    uploadDir({ source, target, }: {
        source: string;
        target: string;
    }): Promise<this>;
    exec(cmds: string[], opts?: SSHExecOptions): Promise<void>;
    close(): void;
}
//# sourceMappingURL=ssh.class.d.ts.map