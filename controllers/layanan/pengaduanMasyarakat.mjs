import pool from "../../db/index.mjs";
import generatePmPdfModule from "../generatePDFController.mjs";


const getReports = (async (request, response) => {
  pool.query('SELECT * FROM community_complaints ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const getReportById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM community_complaints WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createReport = (request, response) => {
  const { user_id, complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status, complainant_job, complainant_religion, complainant_nationality, complainant_loss, sex } = request.body

  pool.query(
    'INSERT INTO community_complaints (user_id, complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
    [user_id, complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status , complainant_job, complainant_religion, complainant_nationality, complainant_loss, sex],
    (error, results) => {
      if (error) {
        throw error;
        console.log("Erornya bro:",error)
      }
      response.status(201).send(`Complainant added with ID: ${results.insertId}`);
    });
}


const updatePmVerificationStatusAdmin = (request, response) => {
  const { id } = request.params;
  const { complaint_status } = request.body;
  const { officer_in_charge } = request.body;

  try {
    pool.query('UPDATE lost_report_letter SET complaint_status = $1 , officer_in_charge = $2 WHERE id = $3', [
      complaint_status,
      officer_in_charge,
      id
    ]);
    response.json({ message: 'Verification status updated' });
  } catch (error) {
    console.error('Error updating status:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};

const updateReport = (request, response) => {
  const id = parseInt(request.params.id)
  const {  officer_in_charge, result, complaint_status } = request.body

  pool.query(
    'UPDATE community_complaints SET officer_in_charge = $1, result = $2, complaint_status = $3 WHERE id = $4',
    [ officer_in_charge, result, complaint_status, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const patchReport = async (request, response) => {
    const id = parseInt(request.params.id);
    const { user_id, complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status , complainant_job, complainant_religion, complainant_nationality, complainant_loss, sex } = request.body;

    const fields = [];
    const values = [];
    let valueIndex = 1;

     if (user_id) {
      fields.push(`user_id = $${valueIndex++}`);
      values.push(user_id);
    }

    if (complainant_name) {
      fields.push(`complainant_name = $${valueIndex++}`);
      values.push(complainant_name);
    }

    if (contact) {
      fields.push(`contact = $${valueIndex++}`);
      values.push(contact);
    }
    if (complainant_address) {
      fields.push(`complainant_address = $${valueIndex++}`);
      values.push(complainant_address);
    }
    if (complaint_category) {
      fields.push(`complaint_category = $${valueIndex++}`);
      values.push(complaint_category);
    }
    if (complaint_title) {
      fields.push(`complaint_title = $${valueIndex++}`);
      values.push(complaint_title);
    }

    if (complaint_content) {
      fields.push(`complaint_content = $${valueIndex++}`);
      values.push(complaint_content);
    }

    if (complainant_job) {
      fields.push(`complainant_job = $${valueIndex++}`);
      values.push(complainant_job);
    }

    if (complainant_religion) {
      fields.push(`complainant_religion = $${valueIndex++}`);
      values.push(complainant_religion);
    }

    if (complainant_nationality) {
      fields.push(`complainant_nationality = $${valueIndex++}`);
      values.push(complainant_nationality);
    }

    if (complainant_loss) {
      fields.push(`complainant_loss = $${valueIndex++}`);
      values.push(complainant_loss);
    }

    if (proof) {
      fields.push(`proof = $${valueIndex++}`);
      values.push(proof);
    }
    
    if (complaint_date) {
      fields.push(`complaint_date = $${valueIndex++}`);
      values.push(complaint_date);
    }
    
    if (complaint_status) {
      fields.push(`complaint_status = $${valueIndex++}`);
      values.push(complaint_status);
    }

    if (fields.length === 0) {
      return response.status(400).json({ message: "No fields to update." });
    }

    values.push(id);
    const query = `UPDATE community_complaints SET ${fields.join(', ')} WHERE id = $${valueIndex}`;

    pool.query(query, values, (error, results) => {
      if (error) {
        return response.status(500).json({ message: "Update failed.", error });
      }
      response.status(200).send(`PM with ID: ${id} patched.`);
    });
  };

const deleteReport = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM community_complaints WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}


const downloadPdf = async (request, response) => {
  const { id } = request.params;

  try {
    const pmData = await pool.query("SELECT * FROM community_complaints WHERE id = $1", [id]);
    if (pmData.rows.length === 0) {
      return response.status(404).json({ error: "pm not found" });
    }
    const pm = pmData.rows[0];

    const usersData = await pool.query("SELECT * FROM users WHERE id = $1", [
      pm.officer_in_charge,
    ]);
    if (usersData.rows.length === 0) {
      return response.status(404).json({ error: "Officer not found" });
    }
    const pmOfficer = usersData.rows[0];

    const pdfBuffer = await generatePmPdfModule.generatePmPdf(
      pm,
      pmOfficer
    );

    response.setHeader("Content-Type", "application/pdf");
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=pm_${id}.pdf`
    );
    response.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    response.status(500).json({ error: "Failed to generate PDF" });
  }
};

export default {
  getReports,
  getReportById,
  downloadPdf,
  createReport,
  updatePmVerificationStatusAdmin,
  updateReport,
  patchReport,
  deleteReport,
}