import express from 'express';
import db from '../../controllers/layanan/skckControllers.mjs';
import authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware;
const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Skck:
 *       type: object
 *       required:
 *         - applicant_name
 *         - place_date_birth
 *         - complete_address
 *         - needs
 *         - id_number
 *         - submission_date
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         applicant_name:
 *           type: string
 *           example: John Doe
 *         place_date_birth:
 *           type: string
 *           example: Magetan, 21 September 2006
 *         complete_address:
 *           type: string
 *           example: Ds. Ngaglik RT 2 RW 1, Kec. Barat, Kab. Magetan
 *         needs:
 *           type: string
 *           example: Keperluan mendaftar Visa
 *         id_number:
 *           type: string
 *           example: 3520181209040002
 *         verification_status:
 *           type: string
 *           example: diterima
 *         submission_date:
 *           type: string
 *           format: date-time
 *           example: 2025-08-04T21:00:00Z
 *         passport_photo:
 *           type: string
 *           format: uri
 *           example: https://res.cloudinary.com/image/upload/image.jpg
 *         user_id:
 *           type: integer
 *           example: 1
 *         officer_in_charge:
 *           type: integer
 *           example: 2
 *         sex:
 *           type: string
 *           example: male
 *         nationality:
 *           type: string
 *           example: Indonesia
 *         religion:
 *           type: string
 *           example: Islam
 */

/**
 * @swagger
 * tags:
 *   name: Skck
 *   description: Skck management
 */

/**
 * @swagger
 * /skck:
 *   get:
 *     summary: Get all Skck records
 *     tags: [Skck]
 *     responses:
 *       200:
 *         description: List of all Skck records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skck'
 */

router.get('/skck', db.getSkcks);

/**
 * @swagger
 * /skck/{id}:
 *   get:
 *     summary: Get a Skck by ID
 *     tags: [Skck]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Skck found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skck'
 *       404:
 *         description: Skck not found
 */
router.get('/skck/:id', db.getSkckById);

/**
 * @swagger
 * /skck:
 *   post:
 *     summary: Create a new Skck
 *     tags: [Skck]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skck'
 *     responses:
 *       201:
 *         description: Skck created successfully
 */
router.post('/skck', db.createSkck);

/**
 * @swagger
 * /skck/{id}:
 *   put:
 *     summary: Fully update a Skck
 *     tags: [Skck]
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
 *             $ref: '#/components/schemas/Skck'
 *     responses:
 *       200:
 *         description: Skck updated successfully
 *       404:
 *         description: Skck not found
 */
router.put('/skck/:id', db.updateSkck);

/**
 * @swagger
 * /skck/officer/{id}:
 *   put:
 *     summary: Update Skck officer info
 *     tags: [Skck]
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
 *         description: Officer updated successfully
 */
router.put('/skck/officer/:id', db.updateSkckOfficer);

/**
 * @swagger
 * /skck/officer/{id}:
 *   patch:
 *     summary: Partially update Skck officer info
 *     tags: [Skck]
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
 *         description: Officer partially updated
 */
router.patch('/skck/officer/:id', db.patchOfficerSkck);

/**
 * @swagger
 * /skck/{id}:
 *   delete:
 *     summary: Delete a Skck by ID
 *     tags: [Skck]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Skck deleted successfully
 *       404:
 *         description: Skck not found
 */
router.delete('/skck/:id', db.deleteSkck);

/**
 * @swagger
 * /skck/status/{id}:
 *   put:
 *     summary: Update Skck verification status
 *     tags: [Skck]
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
router.put('/skck/status/:id', db.updateSkckVerificationStatusAdmin);

/**
 * @swagger
 * /skck/pdf/{id}:
 *   get:
 *     summary: Generate and download Skck PDF by ID
 *     tags: [Skck]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Skck PDF generated
 */
router.get('/skck/pdf/:id', db.downloadPdf);

export default router;
