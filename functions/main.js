async function get_anime(res, id, ep) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  const CryptoJS = require("crypto-js");

  const anime_url = `https://gogoanime.lu/category/${id}`;

  const header = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
  };

  try {
    let send_fetch_req = await axios.get(anime_url, { headers: header });
    let fetch_raw_html = send_fetch_req.data;

    let $ = cheerio.load(fetch_raw_html);

    const requested_episode = ep;

    const title = $("div.anime_info_body_bg").find("h1").text();

    let anime_type = $("div.anime_info_body_bg")
      .find("h1")
      .next()
      .next()
      .text()
      .replace("Type: ", "")
      .replaceAll("\n", "")
      .trim();

    const genre = $("div.anime_info_body_bg")
      .find("h1")
      .next()
      .next()
      .next()
      .next()
      .text()
      .replace("Genre: ", "")
      .replaceAll(" ", "")
      .replaceAll("\n", "")
      .replaceAll("\t", "");

    const released_year = $("div.anime_info_body_bg")
      .find("h1")
      .next()
      .next()
      .next()
      .next()
      .next()
      .text()
      .replace("Released: ", "")
      .replaceAll(" ", "")
      .replaceAll("\n", "");

    const anime_status = $("div.anime_info_body_bg")
      .find("p")
      .last()
      .prev()
      .text()
      .replace("Status: ", "")
      .replaceAll("\n", "")
      .replaceAll(" ", "");

    const other_name =
      $("div.anime_info_body_bg")
        .find("p")
        .last()
        .text()
        .replace("Other name:", "")
        .replaceAll("\n", "")
        .replaceAll(" ", "") || "Not-Mentioned";

    const description = $("div.anime_info_body_bg")
      .find("h1")
      .next()
      .next()
      .next()
      .text()
      .replace("Plot Summary: ", "");

    const total_ep = $("ul#episode_page li")
      .last()
      .find("a")
      .attr("ep_end")
      .toString();

    const consumenet_url = `https://api.consumet.org/anime/gogoanime/watch/${id}-episode-${ep}`
    
    send_fetch_req = await axios.get(
      consumenet_url,
      {
      headers: {
	  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'

      }}
    )

    const consumenet_stream_links = await send_fetch_req.data
    const iframeLink = consumenet_stream_links.headers.Referer

    const video_links = []
    const available_links = []
    let main_link

    consumenet_stream_links.sources.forEach((link) => {
      if(link.quality == 'default') {
	main_link = link.url
      } else {
      available_links.push({
	link : link.url,
	quality : link.quality
      })
    }
    })

    video_links.push({
	main_link,
      	available_links
    })


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
      iframeLink,
      video_links
    });
  } catch (error) {
    //get_anime(res, id)
    res.status(200).json({ message: error });
  }
}

async function search_anime(res, query, page) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  const search_url = `https://gogoanime.lu/search.html?keyword=${query}&page=${
    page || 1
  }`;
  const header = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
  };

  try {
    const send_search_request = await axios.get(search_url, {
      headers: header,
    });
    const search_raw_html = send_search_request.data;

    const $ = cheerio.load(search_raw_html);

    const anime = [];
    const thumb_arr = [];
    $(".items > li").each(function () {
      const thumb = $(this).find("img").attr("src");
      thumb_arr.push(thumb);
    });

    let count = 0;

    $(".items > li").each(function () {
      const title = $(this).find("a").attr("title");
      const link = $(this).find("a").attr("href");
      const animeID = link.replace("/category/", "");
      const thumbnail = thumb_arr[count];
      anime.push({
        title,
        animeID,
        thumbnail,
      });
      count++;
    });

    res.status(200).json(anime);
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

async function latest_anime(res, page) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  const search_url = `https://gogoanime.lu/new-season.html?page=${page || 1}`;
  const header = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
  };

  try {
    const send_search_request = await axios.get(search_url, {
      headers: header,
    });
    const search_raw_html = send_search_request.data;

    const $ = cheerio.load(search_raw_html);

    const anime = [];
    const thumb_arr = [];
    $(".items > li").each(function () {
      const thumb = $(this).find("img").attr("src");
      thumb_arr.push(thumb);
    });

    let count = 0;

    $(".items > li").each(function () {
      const title = $(this).find("a").attr("title");
      const link = $(this).find("a").attr("href");
      const animeID = link.replace("/category/", "");
      const thumbnail = thumb_arr[count];
      anime.push({
        title,
        animeID,
        thumbnail,
      });
      count++;
    });

    res.status(200).json(anime);
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

async function popular_anime(res, page) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  const search_url = `https://gogoanime.lu/popular.html?page=${page || 1}`;
  const header = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
  };

  try {
    const send_search_request = await axios.get(search_url, {
      headers: header,
    });
    const search_raw_html = send_search_request.data;

    const $ = cheerio.load(search_raw_html);

    const anime = [];
    const thumb_arr = [];
    $(".items > li").each(function () {
      const thumb = $(this).find("img").attr("src");
      thumb_arr.push(thumb);
    });

    let count = 0;

    $(".items > li").each(function () {
      const title = $(this).find("a").attr("title");
      const link = $(this).find("a").attr("href");
      const animeID = link.replace("/category/", "");
      const thumbnail = thumb_arr[count];
      anime.push({
        title,
        animeID,
        thumbnail,
      });
      count++;
    });

    res.status(200).json(anime);
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

module.exports = {
  get_anime,
  search_anime,
  popular_anime,
  latest_anime,
};
