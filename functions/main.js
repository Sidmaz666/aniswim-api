 async function get_anime (res,id){
  const { exec } = require("child_process");
  const axios = require('axios')
  const cheerio = require('cheerio')
  const cdn_url = "https://gogoplay.io/encrypt-ajax.php"
  const anime_url = `https://anistream.fun/view/${id}`
  const header =  {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
  }

  try{
    const send_fetch_req = await axios.get(anime_url,{headers : header,})
    const fetch_raw_html = send_fetch_req.data

    const $ = cheerio.load(fetch_raw_html)

    const anime = []

     const main =  $('div#epslistplace')
     const total_ep =  main.find('button.playbutton').last().text()
     const title = $('h1').text()
     const iframeLink = "https:" + $('iframe').attr('src')
     const description = $('div.movie-container').find('h6').last().text().replace('Anime Plot : ','').trim().replaceAll('\n')
     const anime_status = $('div.movie-container').find('h6').last().prev().text().replace('Anime Status : ','').trim()

    const fetch_req = await axios.get(iframeLink, { headers : header, })
    const fetch_req_html = fetch_req.data

    const $$ = cheerio.load(fetch_req_html)
    const videoID = $$('input#id').attr('value')
    const mock_title = $$('input#title').attr('value')
    

    const  key='3235373436353338353932393338333936373634363632383739383333323838'
    const  iv='34323036393133333738303038313335'
 
    exec(`echo ${videoID} | openssl enc -aes256 -K ${key} -iv ${iv} -a`, (error, stdout, stderr) => {

      const encrypted_ID = stdout.replace('\n','')
      const gogo_config = {
	headers : {
	       Accept: 'application/json, text/javascript, */*; q=0.01',
	  	Referer: `${iframeLink}`,
	      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
	      'X-Requested-With': 'XMLHttpRequest'
	},
	params:{
	  id:`${encrypted_ID}`,
	  title: `${mock_title}`,
	  refer: "https://anistream.fun/",
	  time: '69420691337800813569'
	}
      }
	

      axios.get(cdn_url,gogo_config)
      .then(function(response){
	const video_links = response.data
	anime.push(
	  {
	    title,
	    total_ep,
	    anime_status,
	    description,
	    iframeLink,
	    videoID,
	    video_links
	  }
	)

      res.status(200).json(anime)
	})

    })

  } catch (error) {
    res.status(200).json({ message: error })
  }

}

async function search_anime(res,query,page){
  const axios = require('axios')
  const cheerio = require('cheerio')
  const search_url = `https://anistream.fun/results?q=${query}&p=${page}`
  const header =  {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
  }

  try{

    const send_search_request = await axios.get(search_url,{ headers : header, })
    const search_raw_html  = send_search_request.data

    const $ = cheerio.load(search_raw_html)

    const anime = []
    $('h6.card-title').each(function(){
      const title = $(this).find('a').text()
      const thumb = $('img.card-img-top').attr('src')
      const link = $(this).find('a').attr('href')
      const animeID = link.replace('/view/','')
      anime.push({
	title,
	animeID,
	thumb
      })
    })


    res.status(200).json(anime)

  } catch (error){
    res.status(200).json({ message : error })
  }
}

async function latest_anime(res,page){
  const axios = require('axios')
  const cheerio = require('cheerio')
  const search_url = `https://anistream.fun/browse?p=${page}`
  const header =  {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
  }

  try{

    const send_search_request = await axios.get(search_url,{ headers : header, })
    const search_raw_html  = send_search_request.data

    const $ = cheerio.load(search_raw_html)

    const anime = []
    $('h6.card-title').each(function(){
      const title = $(this).find('a').text()
      const thumb = $('img.card-img-top').attr('src')
      const link = $(this).find('a').attr('href')
      const animeID = link.replace('/view/','')
      anime.push({
	title,
	animeID,
	thumb
      })
    })


    res.status(200).json(anime)

  } catch (error){
    res.status(200).json({ message : error })
  }
}

async function popular_anime(res,page){
  const axios = require('axios')
  const cheerio = require('cheerio')
  const search_url = `https://anistream.fun/top?p=${page}`
  const header =  {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
  }

  try{

    const send_search_request = await axios.get(search_url,{ headers : header, })
    const search_raw_html  = send_search_request.data

    const $ = cheerio.load(search_raw_html)

    const anime = []
    $('h6.card-title').each(function(){
      const title = $(this).find('a').text()
      const thumb = $('img.card-img-top').attr('src')
      const link = $(this).find('a').attr('href')
      const animeID = link.replace('/view/','')
      anime.push({
	title,
	animeID,
	thumb
      })
    })


    res.status(200).json(anime)

  } catch (error){
    res.status(200).json({ message : error })
  }
}


module.exports = {
  get_anime,
  search_anime,
  popular_anime,
  latest_anime
} 
