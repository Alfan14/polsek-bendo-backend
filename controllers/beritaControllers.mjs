import pool from "../db/index.mjs";

const getNews = (async (request, response) => {
  pool.query('SELECT * FROM news ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const getNewsById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM news WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createNews = (request, response) => {
  const { title, slug, excerpt, content, author_id, category_id, published_at } = request.body

  pool.query(
    'INSERT INTO news (title, slug, excerpt, content, author_id, category_id, published_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [title, slug, excerpt, content, author_id, category_id, published_at],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    });
}

const updateNews = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, slug, excerpt, content, author_id, category_id, published_at } = request.body

  pool.query(
    'UPDATE news SET title = $1, slug = $2, excerpt = $3, content = $4, author_id = $5, category_id = $6, published_at = $7 WHERE id = $8',
    [title, slug, excerpt, content, author_id, category_id, published_at, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteNews = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM news WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

export default {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
}