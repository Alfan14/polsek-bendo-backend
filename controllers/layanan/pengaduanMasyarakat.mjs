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
  const { complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status } = request.body

  pool.query(
    'INSERT INTO community_complaints (complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [complainant_name, contact, complainant_address, complaint_category, complaint_title, complaint_content, proof, complaint_date, complaint_status],
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
  deleteReport,
}