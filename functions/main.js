 async function get_anime (res,id){
  const { exec } = require("child_process");
  const axios = require('axios')
  const cheerio = require('cheerio')
  const cdn_url = "https://gogoplay4.com/encrypt-ajax.php"
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


    const secret_key='3633393736383832383733353539383139363339393838303830383230393037'
    const iv='34373730343738393639343138323637'
	
    const getId=`printf "%s" "${iframeLink}" | sed -nE 's/.*id=(.*)&title.*/\\1/p'`

    exec(`${getId}`,
      (error,stdout,stderr) => {

	exec(`echo ${getId} |openssl enc -e -aes256 -K "${secret_key}" -iv "${iv}" | base64`, (error,stdout,stderr) => {

	  const id_enc = stdout

	    axios.get(cdn_url,{
	      headers : {
		'X-Requested-With' : 'XMLHttpRequest'
	      },
	      params : {
		id : `${id_enc}`
	      }
	    }).then(function(response){

	      const decrypt_data = response.data.data

	      exec(`echo "${decrypt_data}" | base64 -d | openssl enc -d -aes256 -K "${secret_key}" -iv "${iv}"`,
		(error,stdout,stderr) => {


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
