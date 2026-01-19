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

// SAVE SCANNED ASSET
export const createAssetScan = tryCatch(async (req, res) => {
  const { barcode, assetTag, greenTag } = req.body;

  if (!barcode || !assetTag || !greenTag) {
    throw new AppError("Required fields: barcode, assetTag and greenTag.", 400);
  }

  let pool;

  try {
    pool = await sql.connect(config);

    // 1️⃣ Fetch DOCNO (PSNo) and Material from MaterialBarcode
    const fetchQuery = `
      SELECT DOCNO AS PSNo, Material
      FROM MaterialBarcode
      WHERE Serial = @Serial
    `;
    const fetchResult = await pool
      .request()
      .input("Serial", sql.VarChar, barcode)
      .query(fetchQuery);

    if (!fetchResult.recordset.length) {
      throw new AppError(`No material found for barcode: ${barcode}`, 404);
    }

    const { PSNo, Material } = fetchResult.recordset[0];

    // 2️⃣ Insert into TagSerial with fetched data and scanned values
    const insertQuery = `
      INSERT INTO TagSerial (
        PSNo,
        Material,
        Serial,
        VSerial,
        Serial2
      )
      VALUES (
        @PSNo,
        @Material,
        @Serial,
        @VSerial,
        @Serial2
      )
    `;

    await pool
      .request()
      .input("PSNo", sql.VarChar, PSNo)
      .input("Material", sql.VarChar, Material)
      .input("Serial", sql.VarChar, barcode)
      .input("VSerial", sql.VarChar, assetTag)
      .input("Serial2", sql.VarChar, greenTag)
      .query(insertQuery);

    res.status(201).json({
      success: true,
      message: "Asset scan saved successfully.",
      data: {
        PSNo,
        Material,
        Serial: barcode,
        VSerial: assetTag,
        Serial2: greenTag,
      },
    });
  } catch (error) {
    throw new AppError(
      `Failed to save scanned asset data: ${error.message}`,
      500,
    );
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});
