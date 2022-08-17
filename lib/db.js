import { Pool } from "pg";

let conn;

if (!conn) {
  conn = new Pool({
    host: process.env.NEXT_PUBLIC_PGSQL_HOST,
    port: process.env.NEXT_PUBLIC_PGSQL_PORT,
    database: process.env.NEXT_PUBLIC_PGSQL_DATABASE ,
    user: process.env.NEXT_PUBLIC_PGSQL_USER,
    password: process.env.NEXT_PUBLIC_PGSQL_PASSWORD,
  });
}

export default conn ;