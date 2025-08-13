import express from 'express';
import db from '../../controllers/layanan/suratIzinKeramaian.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Sik:
 *       type: object
 *       required:
 *         - organizer_name
 *         - event_name
 *         - event_description
 *         - event_start
 *         - event_end
 *         - location
 *         - guest_estimate
 *         - levy_fees
 *         - form_creation
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         organizer_name:
 *           type: string
 *           example: John Doe
 *         event_name:
 *           type: string
 *           example: Festival Musik Desa
 *         event_description:
 *           type: string
 *           example: Acara musik tahunan desa
 *         event_start:
 *           type: string
 *           format: date-time
 *           example: 2025-08-04T21:00:00Z
 *         event_end:
 *           type: string
 *           format: date-time
 *           example: 2025-09-04T21:00:00Z
 *         location:
 *           type: string
 *           example: Ds. Ngaglik RT 2 RW 1, Kec. Barat, Kab. Magetan
 *         guest_estimate:
 *           type: integer
 *           example: 50
 *         levy_fees:
 *           type: number
 *           example: 50000
 *         form_creation:
 *           type: string
 *           format: date-time
 *           example: 2025-08-04T21:00:00Z
 *         status_handling:
 *           type: string
 *           example: diterima
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
 *   name: Sik
 *   description: Sik management
 */

/**
 * @swagger
 * /sik:
 *   get:
 *     summary: Get all Sik records
 *     tags: [Sik]
 *     responses:
 *       200:
 *         description: List of all Sik records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sik'
 */

router.get('/sik',db.getSiks);

/**
 * @swagger
 * /sik/{id}:
 *   get:
 *     summary: Get a Sik by ID
 *     tags: [Sik]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Sik found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sik'
 *       404:
 *         description: Sik not found
 */
router.get('/sik/:id', db.getSikById);


/**
 * @swagger
 * /sik/pdf/{id}:
 *   get:
 *     summary: Generate and download Sik PDF by ID
 *     tags: [Sik]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Sik PDF generated
 */
router.get('/sik/pdf/:id', db.downloadPdf);

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
router.post('/sik',db.createSik);

/** 
 * @swagger
 * /sik/status/{id}:
 *   put:
 *     summary: Update Sik verification status
 *     tags: [Sik]
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

router.put('/sik/status/:id', db.updateSikVerificationStatusAdmin);

/**
 * @swagger
 * /sik/{id}:
 *   put:
 *     summary: Fully update a Sik
 *     tags: [Sik]
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
 *             $ref: '#/components/schemas/Sik'
 *     responses:
 *       200:
 *         description: Sik updated successfully
 *       404:
 *         description: Sik not found
 */
router.put('/sik/:id', db.updateSik);

/**
 * @swagger
 * /sik/{id}:
 *   patch:
 *     summary: Partially update Sik
 *     tags: [Sik]
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
 *         description: Sik partially updated
 */
router.patch('/sik/:id', db.patchSik);

/**
 * @swagger
 * /sik/{id}:
 *   delete:
 *     summary: Delete a Sik by ID
 *     tags: [Sik]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Sik deleted successfully
 *       404:
 *         description: Sik not found
 */
router.delete('/sik/:id',db.deleteSik);

export default router;