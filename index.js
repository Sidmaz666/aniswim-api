const express = require('express'); 
const ani = require('./functions/main')
const cors = require('cors')
const compression = require('compression');
const server = express()

server.use(compression())
server.use(cors())

const port = process.env.PORT || 3020 

server.get(['/','/popular'], (req,res) => {
  const page = req.query.page || 1
  ani.Popular(res,page)
})

server.get('/search', (req,res) => {
  ani.Search(res,{...req.query})
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


server.get('/releases', (req,res) => {
  const page = req.query.page || 1
  const type = req.query.type || 1
  ani.Releases(res, page,type)
})

server.get('/genre',(req,res) => {
const genre = ani.Categories.map(g => g.toLowerCase().replaceAll(' ','-'))
  res.status(200).json({
	genre
  })
})

server.get('/filters',(req,res) => {
    res.status(200).json(
      {
	filter_options:{
		genre:ani.Categories.map(g => g.toLowerCase().replaceAll(' ','-')),
      		country:["china","japan"],
      		season:["fall","summer","spring","winter"],
	  	year: Array.from({ length: new Date().getFullYear() - 1998 }, (_, index) => 1999 + index),
      		language:["subdub","sub","dub"],
      		type:["movie;3","tv;1","ova;26","ona;30","special;2","music;32"],
      		status: ["Upcoming","Ongoing","Completed"],
      		sort:["title_az","recently_updated","recently_added","release_date"]
       }
     }
    )
})

server.get('/genre/:genre', async (req,res) => {
  const page = req.query.page || 1
  let genre = req.params.genre 
  let checkExist = false
  ani.Categories.forEach((g) => {
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
