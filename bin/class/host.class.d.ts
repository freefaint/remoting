export type Creds = {
    hostname?: string;
    username?: string;
    password?: string;
};
export declare class Host {
    private data;
    hostname?: string;
    username?: string;
    password?: string;
    constructor(data: Creds);
    init(): Promise<void>;
}
export declare class Hosts {
    private hosts;
    get(name: string, data: Creds): Promise<Host>;
}
//# sourceMappingURL=host.class.d.ts.map