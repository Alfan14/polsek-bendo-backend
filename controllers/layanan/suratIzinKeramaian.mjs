import generateSikPdfModule from "../generatePDFController.mjs";
import pool from "../../db/index.mjs";
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';


const getSiks = (async (request, response) => {
  pool.query('SELECT * FROM crowd_permit_letter ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const getSikById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM crowd_permit_letter WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createSik = (request, response) => {
  const { user_id, organizer_name, event_name, event_description, event_start, event_end, location, guest_estimate, levy_fees , form_creation, job, address, religion } = request.body

  pool.query(
    'INSERT INTO crowd_permit_letter (user_id, organizer_name, event_name, event_description, event_start, event_end, location, guest_estimate, levy_fees , form_creation ,job, address, religion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 , $9, $10, $11, $12, $13)',
    [user_id, organizer_name, event_name, event_description, event_start, event_end, location, guest_estimate, levy_fees , form_creation, job, address, religion],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`CPL added with ID: ${results.insertId}`);
    });
}

const updateSik = (request, response) => {
  const id = parseInt(request.params.id)
  const { organizer_name, event_name, event_description, event_start, event_end, location, guest_estimate, levy_fees , form_creation } = request.body

  pool.query(
    'UPDATE crowd_permit_letter SET organizer_name = $1, event_name = $2, event_description = $3, event_start = $4, event_end = $5, location = $6, guest_estimate = $7, levy_fees = $8 form_creation = $9 WHERE id = $10',
    [organizer_name, event_name, event_description, event_start, event_end, location, guest_estimate, levy_fees, form_creation, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`CPL modified with ID: ${id}`)
    }
  )
}


const updateSikVerificationStatusAdmin = (request, response) => {
  const { id } = request.params;
  const { status_handling } = request.body;
  const { officer_in_charge } = request.body;

  try {
    pool.query('UPDATE crowd_permit_letter SET status_handling = $1 , officer_in_charge = $2 WHERE id = $3', [
      status_handling,
      officer_in_charge,
      id
    ]);
    response.json({ message: 'Verification status updated' });
  } catch (error) {
    console.error('Error updating status:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};


const patchSik = async (request, response) => {
    const id = parseInt(request.params.id);
    const { organizer_name, event_name, event_description, event_start, event_end, location, guest_estimate, levy_fees, form_creation , status_handling , job, address, religion} = request.body;

    const fields = [];
    const values = [];
    let valueIndex = 1;

     if (organizer_name) {
      fields.push(`organizer_name = $${valueIndex++}`);
      values.push(organizer_name);
    }
    if (event_name) {
      fields.push(`event_name = $${valueIndex++}`);
      values.push(event_name);
    }
    if (event_description) {
      fields.push(`event_description = $${valueIndex++}`);
      values.push(event_description);
    }
    if (event_start) {
      fields.push(`event_start = $${valueIndex++}`);
      values.push( event_start);
    }
    if (event_end) {
      fields.push(`event_end = $${valueIndex++}`);
      values.push(event_end);
    }
    if (location) {
      fields.push(`location = $${valueIndex++}`);
      values.push(location);
    }
    if (levy_fees) {
      fields.push(`levy_fees = $${valueIndex++}`);
      values.push(levy_fees);
    }
    if (form_creation) {
      fields.push(`form_creation = $${valueIndex++}`);
      values.push(form_creation);
    }
    if (status_handling) {
      fields.push(`status_handling = $${valueIndex++}`);
      values.push(status_handling);
    }
    if (job) {
      fields.push(`job = $${valueIndex++}`);
      values.push(job);
    }
    if (address) {
      fields.push(`address = $${valueIndex++}`);
      values.push(address);
    }
    if (religion) {
      fields.push(`religion = $${valueIndex++}`);
      values.push(religion);
    }

    if (fields.length === 0) {
      return response.status(400).json({ message: "No fields to update." });
    }

    values.push(id);
    const query = `UPDATE crowd_permit_letter SET ${fields.join(', ')} WHERE id = $${valueIndex}`;

    pool.query(query, values, (error, results) => {
      if (error) {
        return response.status(500).json({ message: "Update failed.", error });
      }
      response.status(200).send(`SIK with ID: ${id} patched.`);
    });
  };

const deleteSik = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM crowd_permit_letter WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`CPL deleted with ID: ${id}`)
  })
}

const downloadPdf = async (request, response) => {
  const { id } = request.params;

  try {
    const sikData = await pool.query("SELECT * FROM crowd_permit_letter WHERE id = $1", [id]);
    if (sikData.rows.length === 0) {
      return response.status(404).json({ error: "sik not found" });
    }
    const sik = sikData.rows[0];

    const usersData = await pool.query("SELECT * FROM users WHERE id = $1", [
      sik.officer_in_charge,
    ]);
    if (usersData.rows.length === 0) {
      return response.status(404).json({ error: "Officer not found" });
    }
    const sikOfficer = usersData.rows[0];

    const pdfBuffer = await generateSikPdfModule.generateSikPdf(
      sik,
      sikOfficer
    );

    response.setHeader("Content-Type", "application/pdf");
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=sik_${id}.pdf`
    );
    response.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    response.status(500).json({ error: "Failed to generate PDF" });
  }
};

export default {
  downloadPdf,
  getSiks,
  getSikById,
  createSik,
  updateSikVerificationStatusAdmin,
  updateSik,
  patchSik,
  deleteSik,
}