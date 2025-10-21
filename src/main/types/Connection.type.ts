export interface Connection {
  uuid: string;
  host: string;
  port: number;
  username: string;
  privateKey?: string;
  password?: string;
}
