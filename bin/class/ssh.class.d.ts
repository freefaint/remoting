export declare class SSH {
    private hostname;
    private username;
    private password;
    private ssh;
    constructor(hostname: string, username: string, password: string);
    uploadFile({ source, target, }: {
        source: string;
        target: string;
    }): Promise<this>;
    exec(cmd: string): Promise<void>;
    close(): void;
}
//# sourceMappingURL=ssh.class.d.ts.map