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
  const { title, slug, excerpt, content, author_id, category_id, url_gambar_unggulan, status, published_at , created_at, updated_at} = request.body

  pool.query(
    'INSERT INTO news (title, slug, excerpt, content, author_id, category_id, url_gambar_unggulan, status, published_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    [title, slug, excerpt, content, author_id, category_id, url_gambar_unggulan, status, published_at, created_at, updated_at],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`News added with ID: ${results.insertId}`);
    });
}

const updateNews = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, slug, excerpt, content, author_id, category_id, url_gambar_unggulan, status, published_at, created_at, updated_at } = request.body

  pool.query(
    'UPDATE news SET title = $1, slug = $2, excerpt = $3, content = $4, author_id = $5, category_id = $6, url_gambar_unggulan = $7, status = $8, published_at = $9, created_at = $10, updated_at = $11, published_at = $12 WHERE id = $13',
    [title, slug, excerpt, content, author_id, category_id, url_gambar_unggulan, ,status, published_at , created_at, updated_at, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`News modified with ID: ${id}`)
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