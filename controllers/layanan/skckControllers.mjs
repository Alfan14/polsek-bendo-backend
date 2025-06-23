import pool from "../../db/index.mjs";

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

const createSkck = (request, response) => {
  const { applicant_name, place_date_birth, needs, id_number, submission_date, verification_status, officer_notes } = request.body

  pool.query(
    'INSERT INTO skck (complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

const updateSkck = (request, response) => {
  const id = parseInt(request.params.id)
  const { applicant_name, place_date_birth, needs, id_number, submission_date, verification_status, officer_notes } = request.body

  pool.query(
    'UPDATE skck SET applicant_name = $1, place_date_birth = $2, needs = $3, id_number = $4, submission_date = $5, verification_status = $6, officer_notes = $7 WHERE id = $8',
    [applicant_name, place_date_birth, needs, id_number, submission_date, verification_status, officer_notes, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
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

export default {
  getSkcks,
  getSkckById,
  createSkck,
  updateSkck,
  deleteSkck,
}