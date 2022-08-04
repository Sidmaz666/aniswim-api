 async function get_anime (res,id,ep){
  const { exec } = require("child_process");
  const axios = require('axios')
  const cheerio = require('cheerio')

  const anime_url = `https://gogoanime.lu/category/${id}`
   
  const header =  {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
  }

  try{
   let send_fetch_req = await axios.get(anime_url,{headers : header})
   let fetch_raw_html = send_fetch_req.data


   let $ = cheerio.load(fetch_raw_html)
   
   const requested_episode = ep
   const title = $('div.anime_info_body_bg').find('h1').text()
   let anime_type = $('div.anime_info_body_bg').find('h1').next().next().text().replace('Type: ', '').replaceAll('\n','').trim()
   const genre = $('div.anime_info_body_bg').find('h1').next().next().next().next().text().replace('Genre: ', '').replaceAll(' ','').replaceAll('\n','').replaceAll('\t','')

   const released_year = $('div.anime_info_body_bg').find('h1').next().next().next().next().next().text().replace('Released: ', '').replaceAll(' ','').replaceAll('\n','')

   const anime_status =  $('div.anime_info_body_bg').find('p').last().prev().text().replace('Status: ', '').replaceAll('\n','').replaceAll(' ','')
   const other_name =  $('div.anime_info_body_bg').find('p').last().text().replace('Other name:', '').replaceAll('\n','').replaceAll(' ','') || 'Not-Mentioned'

   const description =  $('div.anime_info_body_bg').find('h1').next().next().next().text().replace('Plot Summary: ', '')
   const total_ep =  $('ul#episode_page li').last().find('a').attr('ep_end').toString()

   const anime_watch_url = `https://gogoanime.lu/${id}-episode-${ep}`

  send_fetch_req = await axios(anime_watch_url,{headers:header})
  fetch_raw_html = await send_fetch_req.data
	
    $ = cheerio.load(fetch_raw_html)

    const iframeLink = "https:" + $('div.play-video').find('iframe').attr('src')
    const download_link = $('div.favorites_book').find('ul').find('.dowloads').find('a').attr('href')
   

  //send_fetch_req = await axios(download_link,{headers:header})
  //fetch_raw_html = await send_fetch_req.data
 
//  $ = cheerio.load(fetch_raw_html)

  


    res.status(200).json({
      title,
      anime_type,
      genre,
      released_year,
      description,
      other_name,
      anime_status,
      total_ep,
      requested_episode,
      iframeLink
    })
  
  } catch (error) {
 	//get_anime(res, id)
       res.status(200).json({ message: error })
  }

}

async function search_anime(res,query,page){
  const axios = require('axios')
  const cheerio = require('cheerio')
  const search_url = `https://gogoanime.lu/search.html?keyword=${query}&page=${page || 1}`
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
    $('.items > li').each(function(){
	const thumb=  $(this).find('img').attr('src')
	thumb_arr.push(
	  thumb
	)
      })
    
    let count=0

    
    $('.items > li').each(function(){
      const title = $(this).find('a').attr('title')
      const link = $(this).find('a').attr('href')
      const animeID = link.replace('/category/','')
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
  const search_url = `https://gogoanime.lu/new-season.html?page=${page || 1}`
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
    $('.items > li').each(function(){
	const thumb=  $(this).find('img').attr('src')
	thumb_arr.push(
	  thumb
	)
      })
    
    let count=0

    
    $('.items > li').each(function(){
      const title = $(this).find('a').attr('title')
      const link = $(this).find('a').attr('href')
      const animeID = link.replace('/category/','')
      const thumbnail =  thumb_arr[count]
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
  const search_url = `https://gogoanime.lu/popular.html?page=${page || 1 }`
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
    $('.items > li').each(function(){
	const thumb= $(this).find('img').attr('src')
	thumb_arr.push(
	  thumb
	)
      })
    
    let count=0

    
    $('.items > li').each(function(){
      const title = $(this).find('a').attr('title')
      const link = $(this).find('a').attr('href')
      const animeID = link.replace('/category/','')
      const thumbnail =  thumb_arr[count]
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
