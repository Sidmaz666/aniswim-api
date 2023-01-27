async function getFileDetails(main_link, referer) {
  const axios = require("axios");

  const url = new URL(main_link)

  try {
    const get_animixplay_manifest = await axios(url.href, {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
        "Referer": referer
      },
    });

    const animixplay_manifest_d = await get_animixplay_manifest.data;

    const animixplay_manifest = animixplay_manifest_d
      .replace(/\#.*\n/g, "")
      .replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "")
      .split("\n");

    const base_url = main_link.replace(/\/ep.*/, "").replace(/\.com.*/, ".com") + "/";
    
    const available_links = [];

    Array.from(animixplay_manifest).map((e, i) => {
      let quality = e.split(".")[3];

      if (!quality) {
        quality = animixplay_manifest_d
          .match(/\#EXT\-X\-STREAM\-INF.*/g)
          [i].replace(/\#EXT.*RESOLUTION\=/, "")
          .split("x")[1];
      }

      const url = base_url + e;
      available_links.push({
        url,
        quality,
      });
    });

    return { main_link, available_links };
  } catch (error) {
    return { main_link };
  }
}

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

    const anime_watch_url = `https://gogoanime.lu/${id}-episode-${ep}`;

    send_fetch_req = await axios(anime_watch_url, { headers: header });
    fetch_raw_html = await send_fetch_req.data;

    $ = cheerio.load(fetch_raw_html);

    const iframeLink = new URL(
      "https:" + $("div.play-video").find("iframe").attr("src")
    );

    const fetchGogoServerPage = await axios(iframeLink.href, {
      headers: header,
    });

    $ = cheerio.load(await fetchGogoServerPage.data);

  const container_value = $('body').attr('class').replace('container-','')
  const wrapper_container_value = $('div.wrapper').attr('class').replace('wrapper container-','')
  const videocontent_value = $('div.videocontent').attr('class').replace('videocontent videocontent-','')
  const data_value = $('script[data-name="episode"]').attr('data-value').replace('=','')

    const links = []

    $('li[data-status="1"]').each(function(){
	const link = $(this).attr('data-video')
      	links.push({
	 link
      	})
    })

    const keys = {
      key: CryptoJS.enc.Utf8.parse(container_value),
      second_key: CryptoJS.enc.Utf8.parse(videocontent_value),
      iv: CryptoJS.enc.Utf8.parse(wrapper_container_value),
    };

    const videoId = iframeLink.searchParams.get("id");

    const encrypted_key = CryptoJS.AES["encrypt"](videoId, keys.key, {
      iv: keys.iv,
    });

    const token = CryptoJS.AES["decrypt"](data_value, keys.key, {
      iv: keys.iv,
    }).toString(CryptoJS.enc.Utf8);

    const encrypt_ajax =
      "id=" + encrypted_key + "&alias=" + videoId + "&" + token;

    const fetchGogoRes = await axios.get(
      `
        ${iframeLink.protocol}//${iframeLink.hostname}/encrypt-ajax.php?${encrypt_ajax}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
	  Referer:  `https://gogoanime.lu/${id}-episode-${ep}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const decrypted = CryptoJS.enc.Utf8.stringify(
      CryptoJS.AES.decrypt(await fetchGogoRes.data.data, keys.second_key, {
        iv: keys.iv,
      })
    );

    const decrypt_data = JSON.parse(decrypted);

    const video_links = [];

    let sourceFile = decrypt_data.source[0].file ? decrypt_data.source[0].file : decrypt_data.source_bk[0].file;

    const source = await getFileDetails(sourceFile, links[0].link);
    video_links.push(source);

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
      video_links,
      streamLinks : links
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
