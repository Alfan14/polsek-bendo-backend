import express from 'express';
import db from '../../controllers/layanan/pengaduanMasyarakat.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()


/**
 * @swagger
 * components:
 *   schemas:
 *     Pm:
 *       type: object
 *       required:
 *         - complainant_name
 *         - contact
 *         - complainant_address
 *         - date_lost
 *         - complaint_title
 *         - complaint_content
 *         - proof
 *         - complaint_date
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         complainant_name:
 *           type: string
 *           example: John Doe
 *         contact:
 *           type: string
 *           example: 082276549972
 *         complainant_address:
 *           type: string
 *           example: Ds. Ngaglik RT 2 RW 1, Kec. Barat, Kab. Magetan
 *         proof:
 *           type: string
 *           format: uri
 *           example: https://res.cloudinary.com/image/upload/image.jpg
 *         complaint_date:
 *           type: string
 *           format: date-time
 *           example: 2025-08-04T21:00:00Z
 *         officer_in_charge:
 *           type: integer
 *           example: 1
 *         result:
 *           type: string
 *           example: Waktu belanja di toko kelontong ada seorang pria berboncengan lalu mengambil motor saya dalam keadaan kontak ada di motor.
 *         complaint_status:
 *           type: string
 *           example: diterima
 *         date_closed:
 *           type: string
 *           format: date-time
 *           example: 2025-08-04T21:00:00Z
 *         user_id:
 *           type: integer
 *           example: 1
 *         complainant_religion:
 *           type: string
 *           example: Islam
 *         complainant_nationality:
 *           type: string
 *           example: Indonesia
 *         complainant_job:
 *           type: string
 *           example: Farmer
 *         complainant_loss:
 *           type: string
 *           example: 50.000
 *         sex:
 *           type: string
 *           example: male
 */

/**
 * @swagger
 * tags:
 *   name: Pm
 *   description: Pm management
 */

/**
 * @swagger
 * /pm:
 *   get:
 *     summary: Get all Pm records
 *     tags: [Pm]
 *     responses:
 *       200:
 *         description: List of all Pm records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pm'
 */

router.get('/pm',db.getReports);

/**
 * @swagger
 * /pm/{id}:
 *   get:
 *     summary: Get a Pm by ID
 *     tags: [Pm]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Pm found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pm'
 *       404:
 *         description: Slk not found
 */
router.get('/pm/:id', db.getReportById);

/**
 * @swagger
 * /pm/pdf/{id}:
 *   get:
 *     summary: Generate and download Pm PDF by ID
 *     tags: [Pm]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Pm PDF generated
 */
router.get('/pm/pdf/:id', db.downloadPdf);

/**
 * @swagger
 * /pm:
 *   post:
 *     summary: Create a new Pm
 *     tags: [Pm]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pm'
 *     responses:
 *       201:
 *         description: Sik created successfully
 */
router.post('/pm',db.createReport);

/**
 * @swagger
 * /pm/{id}:
 *   put:
 *     summary: Fully update a Pm
 *     tags: [Pm]
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
 *             $ref: '#/components/schemas/Pm'
 *     responses:
 *       200:
 *         description: Pm updated successfully
 *       404:
 *         description: Pm not found
 */
router.put('/pm/:id', db.updateReport);

/** 
 * @swagger
 * /pm/status/{id}:
 *   put:
 *     summary: Update Pm verification status
 *     tags: [Pm]
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
router.put('/pm/status/:id', db.updatePmVerificationStatusAdmin);

/**
 * @swagger
 * /pm/{id}:
 *   patch:
 *     summary: Partially update Pm
 *     tags: [Pm]
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
 *         description: Pm partially updated
 */
router.patch('/pm/:id', db.patchReport);

/**
 * @swagger
 * /pm/{id}:
 *   delete:
 *     summary: Delete a Pm by ID
 *     tags: [Pm]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Pm deleted successfully
 *       404:
 *         description: Pm not found
 */
router.delete('/pm/:id',db.deleteReport);

export default router;