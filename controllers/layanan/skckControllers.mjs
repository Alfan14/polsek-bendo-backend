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
  const { applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, officer_notes , passport_photo} = request.body

  pool.query(
    'INSERT INTO skck ( applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, officer_notes , passport_photo) VALUES ($1, $2, $3, $4, $5, $6, $7 , $8, $9)',
    [ applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, officer_notes , passport_photo],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

const updateSkck = (request, response) => {
  const id = parseInt(request.params.id)
  const { applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, officer_notes, passport_photo} = request.body

  pool.query(
    'UPDATE skck SET applicant_name = $1, place_date_birth = $2, complete_address = $3, needs = $4, id_number = $5, submission_date = $6, verification_status = $7, officer_notes = $8 passport_photo = $9 WHERE id = $10',
    [applicant_name, place_date_birth, complete_address, needs, id_number, submission_date, verification_status, officer_notes, passport_photo, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const updateSkckOfficer = (request, response) => {
  const id = parseInt(request.params.id)
  const { submission_date, verification_status, officer_notes} = request.body

  pool.query(
    'UPDATE skck SET submission_date = $1, verification_status = $2, officer_notes = $3  WHERE id = $4',
    [ submission_date, verification_status, officer_notes,  id],
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

export default {
  getSkcks,
  getSkckById,
  createSkck,
  updateSkck,
  updateSkckOfficer,
  deleteSkck,
}