
import pg from "pg";
const { Pool } = pg;

let localPoolConfig = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
};

const pool = new Pool(localPoolConfig);
export default pool;