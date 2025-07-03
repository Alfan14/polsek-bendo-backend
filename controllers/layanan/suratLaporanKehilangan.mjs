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
  const { user_id, reporter_name, contact_reporter, item_type, date_lost,  chronology, status_handling } = request.body

  pool.query(
    'INSERT INTO lost_report_letter (user_id, reporter_name, contact_reporter, item_type, date_lost,  chronology, status_handling) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [user_id, reporter_name, contact_reporter, item_type, date_lost,  chronology, status_handling],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

const updateSlk = (request, response) => {
  const id = parseInt(request.params.id)
  const {  police_number, status_handling, date_closed } = request.body

  pool.query(
    'UPDATE lost_report_letter SET  police_number = $1,  status_handling = $2, date_closed = $3 WHERE id = $4',
    [ police_number,  status_handling, date_closed, id ],
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