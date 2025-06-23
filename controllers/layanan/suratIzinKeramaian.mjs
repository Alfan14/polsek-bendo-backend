import pool from "../../db/index.mjs";

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
  const { organizer_name, event_name, event_description, event_starts, event_ends, location, guest_estimate, levy_fees } = request.body

  pool.query(
    'INSERT INTO crowd_permit_letter (organizer_name, event_name, event_description, event_starts, event_ends, location, guest_estimate, levy_fees) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [organizer_name, event_name, event_description, event_starts, event_ends, location, guest_estimate, levy_fees],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

const updateSik = (request, response) => {
  const id = parseInt(request.params.id)
  const { organizer_name, event_name, event_description, event_starts, event_ends, location, guest_estimate, levy_fees } = request.body

  pool.query(
    'UPDATE crowd_permit_letter SET organizer_name = $1, event_name = $2, event_description = $3, event_starts = $4, event_ends = $5, location = $6, guest_estimate = $7, levy_fees = $8 WHERE id = $9',
    [organizer_name, event_name, event_description, event_starts, event_ends, location, guest_estimate, levy_fees, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteSik = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM crowd_permit_letter WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

export default {
  getSiks,
  getSikById,
  createSik,
  updateSik,
  deleteSik,
}