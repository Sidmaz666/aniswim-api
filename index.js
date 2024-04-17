const express = require('express'); 
const ani = require('./functions/main')
const cors = require('cors')
const server = express()
server.use(cors())

const port = process.env.PORT || 3020 

server.get(['/','/popular'], (req,res) => {
  const page = req.query.page || 1
  ani.Popular(res,page)
})

server.get('/search', (req,res) => {
  const query = req.query.q
  const page = req.query.page || 1
  ani.Search(res,query,page)
})

server.get('/details',(req,res) => {
  const id = req.query.id
  ani.Details(res,id)
})

server.get('/links',(req,res) => {
  const id = req.query.id
  const ep = req.query.ep || 1
  ani.Links(res,id,ep)
})

server.get(['/latest','/new'], (req,res) => {
  const page = req.query.page || 1
  ani.Latest(res, page)
})

server.get('/movies', (req,res) => {
  const page = req.query.page || 1
  ani.Movies(res, page)
})

server.get('/genre',(req,res) => {
const genre = ani.Categories.map(g => g.toLowerCase().replaceAll(' ','-'))
  res.status(200).json({
	genre
  })
})

server.get('/genre/:genre', async (req,res) => {
  const page = req.query.page || 1
  let genre = req.params.genre 
  let checkExist = false
  genre_list.forEach((g) => {
    if(g.toLowerCase().replaceAll(' ','-') == genre){
      checkExist = true
    }
  })

  if(!checkExist){
    genre = genre_list[0].toLowerCase()
  }
  ani.Genre(res,page,genre)
})

server.get('/list', async(req,res) => {
  const page = req.query.page || 1
  let order = req.query.list || 0
  if(!/([a-b]|[A-Z]|[0-9])/g.test(order)){
    order = 0
  }
  order = order.toString().toLowerCase()
  ani.List(res,page,order)
})

server.use(function(req,res){
  	res.status(404).json({ message : "Error 404" })
})

server.listen(port, 
  () => {
    console.log(`http://localhost:${port}`)
  })

module.exports = server
