import pool from "../../db/index.mjs";

const getSlks = (async (request, response) => {
  pool.query('SELECT * FROM lost_report_letter ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const getSlkById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM lost_report_letter WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createSlk = (request, response) => {
  const { reporter_name, contact_reporter, item_type, date_lost, police_number, chronology, status_handling, date_closed } = request.body

  pool.query(
    'INSERT INTO lost_report_letter (reporter_name, contact_reporter, item_type, date_lost, police_number, chronology, status_handling, date_closed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [reporter_name, contact_reporter, item_type, date_lost, police_number, chronology, status_handling, date_closed],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

const updateSlk = (request, response) => {
  const id = parseInt(request.params.id)
  const { reporter_name, contact_reporter, item_type, date_lost, police_number, chronology, status_handling, date_closed } = request.body

  pool.query(
    'UPDATE lost_report_letter SET reporter_name = $1, contact_reporter = $2, item_type = $3, date_lost = $4, police_number = $5, chronology = $6, status_handling = $7, date_closed = $8 WHERE id = $9',
    [reporter_name, contact_reporter, item_type, date_lost, police_number, chronology, status_handling, date_closed, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteSlk = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM lost_report_letter WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

export default {
  getSlks,
  getSlkById,
  createSlk,
  updateSlk,
  deleteSlk,
}