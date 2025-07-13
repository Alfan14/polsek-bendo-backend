import pool from "../../db/index.mjs";

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
  const { user_id, complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status } = request.body

  pool.query(
    'INSERT INTO community_complaints (user_id, complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [user_id, complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status],
    (error, results) => {
      if (error) {
        throw error;
        console.log("Erornya bro:",error)
      }
      response.status(201).send(`Complainant added with ID: ${results.insertId}`);
    });
}

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
    const { user_id, complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status } = request.body;

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

export default {
  getReports,
  getReportById,
  createReport,
  updateReport,
  patchReport,
  deleteReport,
}