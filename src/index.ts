import { ExtendedClient } from "./structs/extendend-client";

console.log(__dirname);
const client = new ExtendedClient();
client.start();

export { client };
