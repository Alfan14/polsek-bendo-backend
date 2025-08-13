import express from 'express';
import db from '../../controllers/layanan/noteControllers.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - officer_id
 *         - officer_name
 *         - officer_note
 *         - correction_link
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         officer_id:
 *           type: integer
 *           example: 2
 *         officer_name:
 *           type: string
 *           example: Ajun Komisaris Polisi Agus Suparmono , S.H
 *         officer_note:
 *           type: string
 *           example: Lapangan sedang dipakai ganti hari lain!!
 *         date:
 *           type: string
 *           format: date
 *           example: 2025-08-13
 *         time:
 *           type: string
 *           example: 10:00:00
 *         related_field:
 *           type: string
 *           example: SIK
 *         correction_link:
 *           type: string
 *           format: uri
 *           example: /order/sik/edit-sik?sik_id=5
 *         user_id:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of all notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get('/notes', db.getNotes)

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a notes by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Notes found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notes'
 *       404:
 *         description: Notes not found
 */

router.get('/notes/:id', db.getNotesById)


/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new notes
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notes'
 *     responses:
 *       201:
 *         description: Notes created successfully
 */

router.post('/notes',db.createNotes)

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a notes fully
 *     tags: [Notes]
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
 *             $ref: '#/components/schemas/Notes'
 *     responses:
 *       200:
 *         description: Notes updated successfully
 *       404:
 *         description: Notes not found
 */
router.put('/notes/:id', db.createNotes)

/**
 * @swagger
 * /notes/{id}:
 *   patch:
 *     summary: Partially update a note
 *     tags: [Notes]
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
 *         description: Notes updated partially
 *       404:
 *         description: Notes not found
 */

router.patch('/notes/:id', db.patchNotes)


/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Notes deleted successfully
 *       404:
 *         description: Notes not found
 */
router.delete('/notes/:id',db.deleteNotes)

export default router;