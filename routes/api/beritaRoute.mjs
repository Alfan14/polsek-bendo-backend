import express from 'express';
import db from '../../controllers/beritaControllers.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author_id
 *         - category_id
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Peran Seorang Polisi bagi Masyarakat dan Keluarga
 *         slug:
 *           type: string
 *           example: peran-seorang-polisi-bagi-masyarakat-dan-keluarga
 *         excerpt:
 *           type: string
 *           format: uri
 *           example: https://kabarsarolangun.com/artikel-peran-seorang-polisi-bagi-masyarakat-dan-keluarga
 *         content:
 *           type: string
 *           example: Seorang polisi bukan hanya simbol penegakan hukum, tetapi juga sosok yang memiliki peran besar...
 *         author_id:
 *           type: integer
 *           example: 2
 *         category_id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           example: draft
 *         published_at:
 *           type: string
 *           format: date-time
 *           example: 2025-08-13T10:00:00Z
 *         url_gambar_unggulan:
 *           type: string
 *           format: uri
 *           example: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *         view_count:
 *           type: integer
 *           example: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-08-13T10:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-08-13T10:00:00Z

 */

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News management
 */

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get all news
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of all newss
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 */

router.get('/news',db.getNews)


/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Get a news by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: News found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News not found
 */
router.get('/news/:id', db.getNewsById)

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       201:
 *         description: News created successfully
 */
router.post('/news',db.createNews)
/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Update a news fully
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       200:
 *         description: News updated successfully
 *       404:
 *         description: News not found
 */
router.put('/news/:id', db.updateNews)

/**
 * @swagger
 * /news/{id}:
 *   patch:
 *     summary: Partially update a news
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: News updated partially
 *       404:
 *         description: News not found
 */
router.patch('/news/:id', db.patchNews)

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Delete a news by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: News deleted successfully
 *       404:
 *         description: News not found
 */
router.delete('/news/:id',db.deleteNews)

export default router;