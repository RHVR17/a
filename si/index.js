const express = require('express')
let movies = require('./movies.json')
const fs = require('fs')
const { z } = require('zod')
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000

const moviesSchema = z.object({
  title: z.string().min(1),
  year: z.number().int().min(1895),
  director: z.string().min(10),
  duration: z.number().int().min(1),
  poster: z.string().url(),
  genre: z.array(z.string().min(1)),
  rate: z.number().min(0).max(10),
})

app.disable('x-powered-by')
const veri
 = (req, res, next) => {
  const { id } = req.params;
  const movie = movies.find(movie => movie.id === id)
  if (!movie) {
    return res.status(404).json({ error: 'Película no encontrada' })
  }
  req.movie = movie
  next()
}
app.get('/peliculas', (req, res) => {
  res.json(movies)
})
app.get('/pelicula/:id', veri
, (req, res) => {
  res.json(req.movie)
})

app.post('/pelicula', (req, res) => 
{
  try {
    const nuevapeli = moviesSchema.parse(req.body)
  nuevapeli.id = Date.now().toString()
   movies.push(nuevapeli)
    fs.writeFileSync('./movies.json', JSON.stringify(movies, null, 2))
    res.status(201).json(nuevapeli)
  } 
  catch (error) {
    res.status(400).json({ error:"datos inválidos"})
  }
})
app.put('/pelicula/:id', veri
, (req, res) => {
  try {
    const actu = moviesSchema.parse(req.body);
   Object.assign(req.movie, actu);
  fs.writeFileSync('./movies.json', JSON.stringify(movies, null, 2))
    res.json(req.movie)
  } catch (error) {
    res.status(400).json({ error:"datos inválidos"})
  }
})
app.delete('/pelicula/:id', veri
, (req, res) => {
  movies = movies.filter(movie => movie.id !== req.movie.id);
  fs.writeFileSync('./movies.json', JSON.stringify(movies, null, 2))
  res.sendStatus(204)
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'fallo servidor' })
})
app.use((req, res, next) => {
  res.status(404).json({
      error: true,
      message: `La ruta'${req.url}' no existe`
})
})
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`)
})
