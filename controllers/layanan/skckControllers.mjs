import generateSkckPdfModule from "../generatePDFController.mjs";
import pool from "../../db/index.mjs";
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.ALFAN_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.ALFAN_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.ALFAN_PUBLIC_CLOUDINARY_API_SECRET,
});

const getSkcks = (async (request, response) => {
  pool.query('SELECT * FROM skck ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const getSkckById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM skck WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateSkckVerificationStatusAdmin = (request, response) => {
  const { id } = request.params;
  const { verification_status } = request.body;
  const { officer_in_charge } = request.body;

  try {
    pool.query('UPDATE skck SET verification_status = $1 , officer_in_charge = $2 WHERE id = $3', [
      verification_status,
      officer_in_charge,
      id
    ]);
    response.json({ message: 'Verification status updated' });
  } catch (error) {
    console.error('Error updating status:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};

const createSkck = (request, response) => {
  const { user_id, applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, sex, nationality, religion, job, passport_photo } = request.body

  pool.query(
    'INSERT INTO skck ( user_id, applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, sex, nationality, religion, job, passport_photo) VALUES ($1, $2, $3, $4, $5, $6, $7 , $8, $9, $10, $11, $12, $13)',
    [user_id, applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, sex, nationality, religion, job, passport_photo],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

const updateSkck = (request, response) => {
  const id = parseInt(request.params.id)
  const { applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, sex, nationality, religion, job,  passport_photo } = request.body

  pool.query(
    'UPDATE skck SET applicant_name = $1, place_date_birth = $2, complete_address = $3, needs = $4, id_number = $5, submission_date = $6, verification_status = $7, sex = $8, nationality = $9, religion = $10, job = $11, passport_photo = $12 WHERE id = $13',
    [applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, sex, nationality, religion, job, passport_photo, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const patchOfficerSkck = async (request, response) => {
  const id = parseInt(request.params.id);
  const { applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, sex, nationality, religion, job, passport_photo } = request.body;

  const fields = [];
  const values = [];
  let valueIndex = 1;

  if (applicant_name) {
    fields.push(`applicant_name = $${valueIndex++}`);
    values.push(applicant_name);
  }
  if (place_date_birth) {
    fields.push(`place_date_birth = $${valueIndex++}`);
    values.push(place_date_birth);
  }
  if (complete_address) {
    fields.push(`complete_address = $${valueIndex++}`);
    values.push(complete_address);
  }
  if (needs) {
    fields.push(`needs = $${valueIndex++}`);
    values.push(needs);
  }
  if (id_number) {
    fields.push(`id_number = $${valueIndex++}`);
    values.push(id_number);
  }
  if (submission_date) {
    fields.push(`submission_date = $${valueIndex++}`);
    values.push(submission_date);
  }

  if (verification_status) {
    fields.push(`verification_status = $${valueIndex++}`);
    values.push(verification_status);
  }

  if (sex) {
    fields.push(`sex = $${valueIndex++}`);
    values.push(sex);
  }

  if (nationality) {
    fields.push(`nationality = $${valueIndex++}`);
    values.push(nationality);
  }

  if (religion) {
    fields.push(`religion = $${valueIndex++}`);
    values.push(religion);
  }

  if (job) {
    fields.push(`job = $${valueIndex++}`);
    values.push(job);
  }

  if (passport_photo) {
    fields.push(`passport_photo = $${valueIndex++}`);
    values.push(passport_photo);
  }

  if (fields.length === 0) {
    return response.status(400).json({ message: "No fields to update." });
  }

  values.push(id);
  const query = `UPDATE skck SET ${fields.join(', ')} WHERE id = $${valueIndex}`;

  pool.query(query, values, (error, results) => {
    if (error) {
      return response.status(500).json({ message: "Update failed.", error });
    }
    response.status(200).send(`SKCK with ID: ${id} patched.`);
  });
};

const updateSkckOfficer = (request, response) => {
  const id = parseInt(request.params.id)
  const { submission_date, verification_status, officer_notes } = request.body

  pool.query(
    'UPDATE skck SET submission_date = $1, verification_status = $2, officer_notes = $3  WHERE id = $4',
    [submission_date, verification_status, officer_notes, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Skck modified with ID: ${id}`)
    }
  )
}

const deleteSkck = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM skck WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

const downloadPdf = async (request, response) => {
  const { id } = request.params;

  try {
    const skckData = await pool.query("SELECT * FROM skck WHERE id = $1", [id]);
    if (skckData.rows.length === 0) {
      return response.status(404).json({ error: "SKCK not found" });
    }
    const skck = skckData.rows[0];

    const usersData = await pool.query("SELECT * FROM users WHERE id = $1", [
      skck.officer_in_charge,
    ]);
    if (usersData.rows.length === 0) {
      return response.status(404).json({ error: "Officer not found" });
    }
    const skckOfficer = usersData.rows[0];

    const pdfBuffer = await generateSkckPdfModule.generateSkckPdf(
      skck,
      skckOfficer
    );

    response.setHeader("Content-Type", "application/pdf");
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=skck_${id}.pdf`
    );
    response.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    response.status(500).json({ error: "Failed to generate PDF" });
  }
};



export default {
  downloadPdf,
  getSkcks,
  getSkckById,
  updateSkckVerificationStatusAdmin,
  createSkck,
  updateSkck,
  updateSkckOfficer,
  patchOfficerSkck,
  deleteSkck,
}