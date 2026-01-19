import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

export const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ MSSQL Connected");
    return pool;
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed:", err);
  });
