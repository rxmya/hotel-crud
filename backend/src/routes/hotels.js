import express from "express";
import fs from "node:fs/promises";
import { pool } from "../db.js";
import { upload } from "../upload.js";
import { validateHotel } from "../validateHotel.js";
const router = express.Router();
function toHotel(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    price: Number(row.price),
    imageUrl: `/${row.image_path}`,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
async function deleteImageFile(filePath) {
  if (!filePath || filePath.startsWith("uploads/seed/")) return;
  try {
    await fs.unlink(filePath);
  } catch {
    //
  }
}
const isValidId = (id) => /^\d{1,9}$/.test(id);
const notFound = (res, id) =>
  res.status(404).json({ message: `Hotel with id ${id} was not found.` });
router.get("/", async (req, res) => {
  const { search, minPrice, maxPrice } = req.query;
  if (
    (minPrice && Number.isNaN(Number(minPrice))) ||
    (maxPrice && Number.isNaN(Number(maxPrice)))
  ) {
    return res
      .status(400)
      .json({ message: "minPrice and maxPrice must be numbers." });
  }
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const conditions = [];
  const values = [];
  if (search) {
    values.push(`%${search}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }
  if (minPrice) {
    values.push(Number(minPrice));
    conditions.push(`price >= $${values.length}`);
  }
  if (maxPrice) {
    values.push(Number(maxPrice));
    conditions.push(`price <= $${values.length}`);
  }
  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM hotels ${where}`,
    values,
  );
  const dataResult = await pool.query(
    `SELECT * FROM hotels ${where}
     ORDER BY created_at DESC, id DESC
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset],
  );
  res.json({
    data: dataResult.rows.map(toHotel),
    total: Number(countResult.rows[0].count),
    offset,
    limit,
  });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return notFound(res, id);
  const result = await pool.query("SELECT * FROM hotels WHERE id = $1", [id]);
  if (result.rows.length === 0) return notFound(res, id);
  res.json(toHotel(result.rows[0]));
});
router.post("/", upload.single("image"), async (req, res) => {
  const errors = validateHotel(req.body, {
    file: req.file,
    requireImage: true,
  });
  if (Object.keys(errors).length > 0) {
    if (req.file) await deleteImageFile(req.file.path);
    return res.status(400).json({ message: "Validation failed.", errors });
  }
  const { title, description, latitude, longitude, price } = req.body;
  const result = await pool.query(
    `INSERT INTO hotels (title, description, latitude, longitude, price, image_path)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      title.trim(),
      description.trim(),
      latitude,
      longitude,
      price,
      `uploads/${req.file.filename}`,
    ],
  );
  res.status(201).json(toHotel(result.rows[0]));
});
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const existing = isValidId(id)
    ? await pool.query("SELECT image_path FROM hotels WHERE id = $1", [id])
    : { rows: [] };
  if (existing.rows.length === 0) {
    if (req.file) await deleteImageFile(req.file.path);
    return notFound(res, id);
  }
  const errors = validateHotel(req.body, {
    file: req.file,
    requireImage: false,
  });
  if (Object.keys(errors).length > 0) {
    if (req.file) await deleteImageFile(req.file.path);
    return res.status(400).json({ message: "Validation failed.", errors });
  }
  const { title, description, latitude, longitude, price } = req.body;
  const newImagePath = req.file ? `uploads/${req.file.filename}` : null;
  const result = await pool.query(
    `UPDATE hotels
     SET title = $1, description = $2, latitude = $3, longitude = $4, price = $5,
         image_path = COALESCE($6, image_path), updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [
      title.trim(),
      description.trim(),
      latitude,
      longitude,
      price,
      newImagePath,
      id,
    ],
  );
  if (req.file) await deleteImageFile(existing.rows[0].image_path);
  res.json(toHotel(result.rows[0]));
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return notFound(res, id);
  const result = await pool.query(
    "DELETE FROM hotels WHERE id = $1 RETURNING image_path",
    [id],
  );
  if (result.rows.length === 0) return notFound(res, id);
  const deleteImage = req.query.deleteImage !== "false";
  if (deleteImage) await deleteImageFile(result.rows[0].image_path);
  res.json({
    message: "Hotel deleted successfully.",
    id: Number(id),
    imageDeleted: deleteImage,
  });
});
export default router;