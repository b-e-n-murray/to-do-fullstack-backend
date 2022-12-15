import { Client } from "pg"

const client = new Client({database: "tododb"});

export default client 