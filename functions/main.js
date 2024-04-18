const axios = require("axios");
const cheerio = require("cheerio");
const CryptoJS = require("crypto-js");
const SITEURL="https://www9.gogoanimes.fi"
const REQUEST_HEADER = {
    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
}

const Categories = [
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

async function get_available_links(main_link, referer) {
  const url = new URL(main_link)
  try {
    const get_animixplay_manifest = await axios(url.href, {
      headers: {
	...REQUEST_HEADER,
        "Referer": referer,
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    const animixplay_manifest_d = await get_animixplay_manifest.data;
    const animixplay_manifest = animixplay_manifest_d
      .replace(/\#.*\n/g, "")
      .replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "")
      .split("\n");
    const base_url = main_link.replace(/\/ep.*/, "") + "/";
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

async function Extractor(url){
    const header = REQUEST_HEADER
    const send_search_request = await axios.get(url, {
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
      let title = $(this).find("a").attr("title");
      const link = $(this).find("a").attr("href");
      const animeID = link.replace("/category/", "").replace(/^\//,"");
      let thumbnail = thumb_arr[count];
      if(title.length <= 0){
	title = animeID.replaceAll('-',' ')
      }
      if(!thumbnail.includes('https://gogocdn.net/cover')){ 
	thumbnail = "https://gogocdn.net" + thumbnail
      }
      anime.push({
        title,
        animeID,
        thumbnail,
      });
      count++;
    });
  return anime
}

async function Links(res, id, ep) {
  try {
    const requested_episode = ep;
    const anime_watch_url = `${SITEURL}/${id}-episode-${ep}`;
    const send_fetch_req = await axios(anime_watch_url, { headers: REQUEST_HEADER });
    const fetch_raw_html = await send_fetch_req.data;

    let $ = cheerio.load(fetch_raw_html);

    const iframeLink = new URL(
      $("div.play-video").find("iframe").attr("src")
    );


    const fetchGogoServerPage = await axios(iframeLink.href, {
      headers: REQUEST_HEADER,
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
	  Referer:  `${SITEURL}/${id}-episode-${ep}`,
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
    let sourceFile = decrypt_data.source[0].file 

    if(sourceFile.includes('vipanicdn')){
      sourceFile = decrypt_data.source_bk[0].file;
    }

    const source = await get_available_links(sourceFile, links[0].link);
    video_links.push(source);
    const download_link = iframeLink.toString().replace('streaming.php','download')

    res.status(200).json({
      animeID: id,
      requested_episode,
      iframeLink,
      download_link,
      video_links,
      streamLinks : links
    });
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

async function Details(res,id){
  const anime_url = `${SITEURL}/category/${id}`;
  const header = REQUEST_HEADER;
  try {
    let send_fetch_req = await axios.get(anime_url, { headers: header });
    let fetch_raw_html = send_fetch_req.data;
    let $ = cheerio.load(fetch_raw_html);
    let title = $("div.anime_info_body_bg").find("h1").text();
    let thumb = $("div.anime_info_body_bg").find("img").attr('src')
    if(!thumb.includes("https://")){
	thumb = "https://gogocdn.net" + thumb.replace(SITEURL,"")
    } else {
      if(thumb.includes(SITEURL)){
	thumb = "https://gogocdn.net" + thumb.replace(SITEURL,"")
      }
    }
    if(title.length <= 0){
	title = id.replaceAll('-',' ')
      }
    let anime_type = $("div.anime_info_body_bg")
      .find("h1")
      .next()
      .next()
      .text()
      .replace("Type: ", "")
      .replaceAll("\n", "")
      .trim();
    const genre = $("div.anime_info_body_bg > div.description")
      .next()
      .text()
      .replace("Genre: ", "")
      .replaceAll(" ", "")
      .replaceAll("\n", "")
      .replaceAll("\t", "");

    const released_year = $("div.anime_info_body_bg > div.description")
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
	.replace(/ {2,}/g,',').replace(",","").replace(/\,$/,'')
        .trim() || "Not-Mentioned";

    const description = $("div.anime_info_body_bg > div.description").text().replace(/\n\n/g,"")
    let total_ep = $("ul#episode_page li")
      .last()
      .find("a")
      .attr("ep_end")
      .toString();

    total_ep = total_ep == 0 ? 1 : total_ep


    res.status(200).json({
      animeID: id,
      title,
      anime_type,
      genre,
      released_year,
      description,
      other_name,
      anime_status,
      total_ep,
      thumb:thumb
    });
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

async function Search(res, query, page) {
  const search_url = `${SITEURL}/search.html?keyword=${query}&page=${
    page || 1
  }`;
  try{
    const anime = await Extractor(search_url)
    res.status(200).json(anime);
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

async function Genre(res, page,genre) {
  const search_url = `${SITEURL}/genre/${genre}?page=${page || 1}`;
  try{
    const anime = await Extractor(search_url)
    res.status(200).json(anime);
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

async function Movies(res, page) {
  const search_url = `${SITEURL}/anime-movies.html?page=${page || 1}`;
  try{
    const anime = await Extractor(search_url)
    res.status(200).json(anime);
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

async function Latest(res, page) {
  const search_url = `${SITEURL}/new-season.html?page=${page || 1}`;
  try{
    const anime = await Extractor(search_url)
    res.status(200).json(anime);
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

async function Popular(res, page) {
  const search_url = `${SITEURL}/popular.html?page=${page || 1}`;
  try{
    const anime = await Extractor(search_url)
    res.status(200).json(anime);
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

async function Releases(res, page, type) {
  const search_url = `https://ajax.gogocdn.net/ajax/page-recent-release.html?page=${page}&type=${type}`;
  try{
    const anime = await Extractor(search_url)
    res.status(200).json(anime);
  } catch (error) {
    res.status(200).json({ message: error });
  }
}

async function List(res,page,order){
  const search_url = `${SITEURL}/anime-list-${order}?page=${page || 1}`;
    const send_search_request = await axios.get(search_url, {
      headers: REQUEST_HEADER,
    });
    const search_raw_html = send_search_request.data;
    const $ = cheerio.load(search_raw_html);

    const anime = [];
    $("ul.listing > li").each(function () {
      let title = $(this).find("a").text().trim();
      const link = $(this).find("a").attr("href");
      const animeID = link.replace("/category/", "");
      if(title.length <= 0){
	title = animeID.replaceAll('-',' ')
      }
      anime.push({
        title,
        animeID,
      });
    });
  res.json(anime)
}

module.exports = {
  Links,
  Search,
  Popular,
  Latest,
  Genre,
  Movies,
  List,
  Categories,
  Details,
  Releases
};

