import sql from "mssql";
import { config } from "../config/db.js";
import { tryCatch } from "../config/tryCatch.js";
import { AppError } from "../utils/AppError.js";

// FETCH ASSETS
export const fetchAssets = tryCatch(async (req, res) => {
  let pool;

  try {
    pool = await sql.connect(config);

    let query = `
      SELECT * FROM TagSerial
    `;

    const request = pool.request();

    const result = await request.query(query);

    res.status(200).json({
      success: true,
      message: "Assets data fetched successfully.",
      count: result.recordset.length,
      data: result.recordset,
    });
  } catch (error) {
    throw new AppError(`Failed to fetch assets: ${error.message}`, 500);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});
