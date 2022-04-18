 async function get_anime (res,id){
  const { exec } = require("child_process");
  const axios = require('axios')
  const cheerio = require('cheerio')
  const cdn_url = "https://goload.pro/encrypt-ajax.php"
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

     const fetch_iframe = await axios.get(iframeLink, { headers : header })
     const iframeData = fetch_iframe.data
	
    const $$ = cheerio.load(iframeData)

        let iv = $$('div.wrapper').attr('class').replaceAll('wrapper container-','')

	let sh = `echo "${iv}" | tr -d "\n" | od -A n -t x1 | tr -d " |\n"`

      exec(sh,(error,stdout,stderror) => {

		iv = stdout

	const id = iframeLink.split('=')[1].replaceAll('&title','')

	 sh = `printf "%s" "${id}" | base64 -d | od -A n -t x1 | tr -d " |\n"`
	
	exec(sh, (error, stdout, stderror) => {
      	const dec_id = stdout
	
	  let sh = `printf "%s%s" "${dec_id}" "${iv}" | cut -c-32 | tr -d "\n" | od -A n -t x1 | tr -d " |\n"`

	  exec(sh,(error,stdout,stderror) => {
	
	    const secret_key = stdout

	    sh = `printf '%s' "${id}" | openssl enc -e -aes256 -K "${secret_key}" -iv "${iv}" | base64`

	    exec(sh, async(error,stdout,stderror) => {
	    
	      const ajax = stdout.replaceAll('\n','')
	    	
	      const _fetch = await axios.get(cdn_url, {
		headers : {
		  'X-Requested-With': 'XMLHttpRequest',
		},
		params : {
		  id : `${ajax}`,
		  alias : `${id}`
		}
	      })

	      const data = await _fetch.data.data

	      
	      exec(`printf "%s" "${data}" | base64 -d | openssl enc -d -aes256 -K "${secret_key}" -iv "${iv}"`,
		(error,stdout,stderr) => {
	
		  if(error){
		    res.json(error)
		  }

		   const video_links = JSON.parse(stdout)
		 
		anime.push(
		    {
		  title,
		  total_ep,
		  anime_status,
		  description,
		  iframeLink,
		  video_links
		  }
		)

	      res.status(200).json(anime)
	      
	    })
	  })
	})
      })
  })

  } catch (error) {
 	get_anime(res, id)
    //   res.status(200).json({ message: error })
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
    const thumb_arr = []
      $('img.card-img-top').each(function(){
	const thumb= $(this).attr('src')
	thumb_arr.push(
	  thumb
	)
      })
    
    let count=0

    $('h6.card-title').each(function(){
      const title = $(this).find('a').text()
      const link = $(this).find('a').attr('href')
      const animeID = link.replace('/view/','')
      const thumbnail = thumb_arr[count]
	anime.push({
	  title,
	  animeID,
	  thumbnail
	})
      count++
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
    const thumb_arr = []
      $('img.card-img-top').each(function(){
	const thumb= $(this).attr('src')
	thumb_arr.push(
	  thumb
	)
      })
    
    let count=0

    $('h6.card-title').each(function(){
      const title = $(this).find('a').text()
      const link = $(this).find('a').attr('href')
      const animeID = link.replace('/view/','')
      const thumbnail = thumb_arr[count]
      anime.push({
	title,
	animeID,
	thumbnail
      })
      count++
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
    const thumb_arr = []
      $('img.card-img-top').each(function(){
	const thumb= $(this).attr('src')
	thumb_arr.push(
	  thumb
	)
      })
    
    let count=0

    
    $('h6.card-title').each(function(){
      const title = $(this).find('a').text()
      const link = $(this).find('a').attr('href')
      const animeID = link.replace('/view/','')
      const thumbnail = thumb_arr[count]
      anime.push({
	title,
	animeID,
	thumbnail
      })
      count++
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
