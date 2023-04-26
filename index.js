const express = require('express'); 
const ani = require('./functions/main')
const cors = require('cors')
const server = express()
server.use(cors())

const port = process.env.PORT || 3020 

 const genre_list = [
"Action",
"Adult Cast",
"Adventure",
"Anthropomorphic",
"Avant Garde",
"Boys Love",
"Cars",
"CGDCT",
"Childcare",
"Comedy",
"Comic",
"Crime",
"Crossdressing",
"Delinquents",
"Dementia",
"Demons",
"Detective",
"Drama",
"Dub",
"Ecchi",
"Erotica",
"Family",
"Fantasy",
"Gag Humor",
"Game",
"Gender Bender",
"Gore",
"Gourmet",
"Harem",
"Hentai",
"High Stakes Game",
"Historical",
"Horror",
"Isekai",
"Iyashikei",
"Josei",
"Kids",
"Magic",
"Magical Sex Shift",
"Mahou Shoujo",
"Martial Arts",
"Mecha",
"Medical",
"Military",
"Music",
"Mystery",
"Mythology",
"Organized Crime",
"Parody",
"Performing Arts",
"Pets",
"Police",
"Psychological",
"Racing",
"Reincarnation",
"Romance",
"Romantic Subtext",
"Samurai",
"School",
"Sci-Fi",
"Seinen",
"Shoujo",
"Shoujo Ai",
"Shounen",
"Slice of Life",
"Space",
"Sports",
"Strategy Game",
"Super Power",
"Supernatural",
"Survival",
"Suspense",
"Team Sports",
"Thriller",
"Time Travel",
"Vampire",
"Visual Arts",
"Work Life",
"Workplace",
"Yaoi",
"Yuri"
]

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
  const ep = req.query.ep || 1
  ani.get_anime(res,id,ep)
})

server.get('/latest', (req,res) => {
  const page = req.query.page || 1
  ani.latest_anime(res, page)
})

server.get('/movies', (req,res) => {
  const page = req.query.page || 1
  ani.movies(res, page)
})

server.get('/genre',(req,res) => {
const genre = genre_list.map(g => g.toLowerCase().replaceAll(' ','-'))
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

  ani.genre(res,page,genre)
})

server.get('/anime-list', async(req,res) => {
  const page = req.query.page || 1
  let order = req.query.list || 0
 
  if(!/([a-b]|[A-Z]|[0-9])/g.test(order)){
    order = 0
  }

  order = order.toString().toLowerCase()
  ani.anime_list(res,page,order)

})

server.get('/thumbnail/:id', async(req,res) => {
  const id = req.params.id 	
  if(!id) return
  try {
  const thumbnail = await ani.thumb(id)
  res.status(200).json({
    thumbnail
  })
  	
  } catch (e) {
  res.status(200).json({
    message: "Invalid id or Thumbnail Not Available!"
  })
  }
  	
})

server.use(function(req,res){
  	res.status(404).json({ message : "Error 404" })
})

server.listen(port, 
  () => {
    console.log(`http://localhost:${port}`)
  })

module.exports = server
