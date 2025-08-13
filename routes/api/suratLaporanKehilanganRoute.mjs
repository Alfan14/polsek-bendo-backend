import express from 'express';
import db from '../../controllers/layanan/suratLaporanKehilangan.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()


/**
 * @swagger
 * components:
 *   schemas:
 *     Slk:
 *       type: object
 *       required:
 *         - reporter_name
 *         - contact_reporter
 *         - item_type
 *         - date_lost
 *         - chronology
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         reporter_name:
 *           type: string
 *           example: John Doe
 *         contact_reporter:
 *           type: string
 *           example: 082276549972
 *         item_type:
 *           type: string
 *           example: Dompet
 *         date_lost:
 *           type: string
 *           format: date-time
 *           example: 2025-08-04T21:00:00Z
 *         police_number:
 *           type: string
 *           example: 085723459876
 *         chronology:
 *           type: string
 *           example: Waktu belanja di toko kelontong ada seorang pria berboncengan lalu mengambil motor saya dalam keadaan kontak ada di motor.
 *         status_handling:
 *           type: string
 *           example: diterima
 *         date_closed:
 *           type: string
 *           format: date-time
 *           example: 2025-08-04T21:00:00Z
 *         user_id:
 *           type: integer
 *           example: 1
 *         officer_in_charge:
 *           type: integer
 *           example: 1
 *         place_date_birth:
 *           type: string
 *           example: Magetan, 21 September 2006
 *         job:
 *           type: string
 *           example: Farmer
 *         address:
 *           type: string
 *           example: Ds. Ngaglik RT 2 RW 1, Kec. Barat, Kab. Magetan
 *         religion:
 *           type: string
 *           example: Islam
 */

/**
 * @swagger
 * tags:
 *   name: Slk
 *   description: Slk management
 */

/**
 * @swagger
 * /sik:
 *   get:
 *     summary: Get all Slk records
 *     tags: [Sik]
 *     responses:
 *       200:
 *         description: List of all Slk records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slk'
 */

router.get('/slk',db.getSlks);

/**
 * @swagger
 * /slk/{id}:
 *   get:
 *     summary: Get a Slk by ID
 *     tags: [Slk]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Slk found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Slk'
 *       404:
 *         description: Slk not found
 */
router.get('/slk/:id', db.getSlkById);

/**
 * @swagger
 * /slk/pdf/{id}:
 *   get:
 *     summary: Generate and download Slk PDF by ID
 *     tags: [Slk]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Slk PDF generated
 */
router.get('/slk/pdf/:id', db.downloadPdf);

/**
 * @swagger
 * /sik:
 *   post:
 *     summary: Create a new Sik
 *     tags: [Sik]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sik'
 *     responses:
 *       201:
 *         description: Sik created successfully
 */
router.post('/slk',db.createSlk);

/**
 * @swagger
 * /slk/{id}:
 *   put:
 *     summary: Fully update a Slk
 *     tags: [Slk]
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
 *             $ref: '#/components/schemas/Slk'
 *     responses:
 *       200:
 *         description: Slk updated successfully
 *       404:
 *         description: Slk not found
 */
router.put('/slk/:id', db.updateSlk);

/** 
 * @swagger
 * /slk/status/{id}:
 *   put:
 *     summary: Update Slk verification status
 *     tags: [Slk]
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
 *         description: Verification status updated
 */
router.put('/slk/status/:id', db.updateSlkVerificationStatusAdmin);

/**
 * @swagger
 * /slk/{id}:
 *   patch:
 *     summary: Partially update Slk
 *     tags: [Slk]
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
 *         description: Slk partially updated
 */
router.patch('/slk/:id', db.patchSik);

/**
 * @swagger
 * /slk/{id}:
 *   delete:
 *     summary: Delete a Slk by ID
 *     tags: [Slk]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Slk deleted successfully
 *       404:
 *         description: Slk not found
 */
router.delete('/slk/:id',db.deleteSlk);

export default router;