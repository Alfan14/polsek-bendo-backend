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
  const { user_id, organizer_name, event_name, event_description, event_start, event_end, location, guest_estimate, levy_fees , form_creation} = request.body

  pool.query(
    'INSERT INTO crowd_permit_letter (user_id, organizer_name, event_name, event_description, event_start, event_end, location, guest_estimate, levy_fees , form_creation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 , $9, $10)',
    [user_id, organizer_name, event_name, event_description, event_start, event_end, location, guest_estimate, levy_fees , form_creation],
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


const patchSik = async (request, response) => {
    const id = parseInt(request.params.id);
    const { organizer_name, event_name, event_description, event_start, event_end, location, guest_estimate, levy_fees, form_creation , status_handling } = request.body;

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

  pool.query('DELETE FROM rowd_permit_letter WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`CPL deleted with ID: ${id}`)
  })
}

export default {
  getSiks,
  getSikById,
  createSik,
  updateSik,
  patchSik,
  deleteSik,
}