export interface ResponseInterface {
    message: string;
    status: boolean;
    data?: { [key: string]: any } | Array<string> | Array<number> | null;
}
