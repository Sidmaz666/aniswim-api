const express = require('express'); 
const ani = require('./functions/main')
const cors = require('cors')

const server = express()

server.use(cors())

const port = process.env.PORT || 2090 

server.get('/', (req,res) => {
  const page = req.query.page || 1
  ani.popular_anime(res,page)
})

server.get('/search', (req,res) => {
  const query = req.query.q
  const page = req.query.page || 1
  ani.search_anime(res,query,page)
})

server.get('/anime',(req,res) => {
  const id = req.query.id
  ani.get_anime(res,id)
})

server.get('/latest', (req,res) => {
  const page = req.query.page || 1
  ani.latest_anime(res, page)
})

server.use(function(req,res){
  	res.status(404).json({ message : "Error 404" })
})

server.listen(port, 
  () => {
    console.log(`http://localhost:${port}`)
  })
