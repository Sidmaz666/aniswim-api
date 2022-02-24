# aniswim-api

A simple API to get anime details and video links.

## Installation
	
	npm i
		
Run Locally - `npm run start ` or `node index.js`

## Endpoints:

1. `/` - List of popular Anime with animeID
2. `/anime?id=` - Get Anime Detail and Video Links with `animeID`
3. `/search?q=` - Search Anime get animeID

## URL Query Parameters

1. `page` - Go to <b>n</b> number of pages.
2.  `q` - For Search
3. `id` - For animeID

### Example
		
		/search?q=one+piece&page=2

		/?page=2

## Usage
		GET:
		url: "https://aniswim-api.herokuapp.com/?page=2"
		response: [
  	{
    "title": "100-man no Inochi no Ue ni Ore wa Tatteiru 2nd Season",
    "animeID": "100-man-no-inochi-no-ue-ni-ore-wa-tatteiru-2nd-season-episode-1",
    "thumbnail": "https://gogocdn.net/cover/100-man-no-inochi-no-ue-ni-ore-wa-tatteiru-2nd-season.png"
  	},
  	{
    "title": "Go! Princess Precure",
    "animeID": "go-princess-precure-episode-1",
    "thumbnail": "https://gogocdn.net/images/upload/Go!.Princess.Precure.full.1812487.jpg"
  	},
  	{
    "title": "Arifureta Shokugyou de Sekai Saikyou",
    "animeID": "arifureta-shokugyou-de-sekai-saikyou-episode-1",
    "thumbnail": "https://gogocdn.net/cover/arifureta-shokugyou-de-sekai-saikyou.png"
  	},
  	{
    "title": "Log Horizon: Entaku Houkai",
    "animeID": "log-horizon-entaku-houkai-episode-1",
    "thumbnail": "https://gogocdn.net/cover/log-horizon-entaku-houkai.png"
  	},
  	{
    "title": "Jahy-sama wa Kujikenai!",
    "animeID": "jahy-sama-wa-kujikenai-episode-1",
    "thumbnail": "https://gogocdn.net/cover/jahy-sama-wa-kujikenai.png"
  	},
  	{
    "title": "Mushoku Tensei: Isekai Ittara Honki Dasu",
    "animeID": "mushoku-tensei-isekai-ittara-honki-dasu-episode-1",
    "thumbnail": "https://gogocdn.net/cover/mushoku-tensei-isekai-ittara-honki-dasu.png"
  	},
  	{
    "title": "Dr. Stone",
    "animeID": "dr-stone-episode-1",
    "thumbnail": "https://gogocdn.net/cover/dr-stone.png"
  	},
  	{
    "title": "Nanatsu no Taizai: Fundo no Shinpan",
    "animeID": "nanatsu-no-taizai-fundo-no-shinpan-episode-1",
    "thumbnail": "https://gogocdn.net/cover/nanatsu-no-taizai-fundo-no-shinpan.png"
  	},
  	{
    "title": "Genjitsu Shugi Yuusha no Oukoku Saikenki",
    "animeID": "genjitsu-shugi-yuusha-no-oukoku-saikenki-episode-1",
    "thumbnail": "https://gogocdn.net/cover/genjitsu-shugi-yuusha-no-oukoku-saikenki.png"
  	},
  	{
    "title": "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka II",
    "animeID": "dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-darou-ka-ii-episode-1",
    "thumbnail": "https://gogocdn.net/cover/dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-darou-ka-ii.png"
  	},
  	{
    "title": "Enen no Shouboutai",
    "animeID": "enen-no-shouboutai-episode-1",
    "thumbnail": "https://gogocdn.net/cover/enen-no-shouboutai.png"
  	},
  	{
    "title": "Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season Part 2",
    "animeID": "rezero-kara-hajimeru-isekai-seikatsu-2nd-season-part-2-episode-1",
    "thumbnail": "https://gogocdn.net/cover/rezero-kara-hajimeru-isekai-seikatsu-2nd-season-part-2.png"
  	},
  	{
    "title": "Karakai Jouzu no Takagi-san 2",
    "animeID": "karakai-jouzu-no-takagi-san-2-episode-1",
    "thumbnail": "https://gogocdn.net/cover/karakai-jouzu-no-takagi-san-2.png"
  	},
  	{
    "title": "Big Order (TV)",
    "animeID": "big-order-tv-episode-1",
    "thumbnail": "https://gogocdn.net/cover/big-order-tv.jpg"
  	},
  	{
    "title": "Katsute Kami Datta Kemono-tachi e",
    "animeID": "katsute-kami-datta-kemono-tachi-e-episode-1",
    "thumbnail": "https://gogocdn.net/cover/katsute-kami-datta-kemono-tachi-e.png"
  	},
 	 {
    "title": "Tensei shitara Slime Datta Ken 2nd Season",
    "animeID": "tensei-shitara-slime-datta-ken-2nd-season-episode-1",
    "thumbnail": "https://gogocdn.net/cover/tensei-shitara-slime-datta-ken-2nd-season.png"
  	},
  	{
    "title": "Boku no Hero Academia",
    "animeID": "boku-no-hero-academia-episode-1",
    "thumbnail": "https://gogocdn.net/cover/boku-no-hero-academia.jpg"
  	},
  	{
    "title": "Lord El-Melloi II Sei no Jikenbo: Rail Zeppelin Grace Note",
    "animeID": "lord-el-melloi-ii-sei-no-jikenbo-rail-zeppelin-grace-note-episode-1",
    "thumbnail": "https://gogocdn.net/cover/lord-el-melloi-ii-sei-no-jikenbo-rail-zeppelin-grace-note.png"
  	},
  	{
    "title": "Bungou Stray Dogs",
    "animeID": "bungou-stray-dogs-episode-1",
    "thumbnail": "https://gogocdn.net/cover/bungou-stray-dogs.jpg"
  	},
  	{
    "title": "Endride",
    "animeID": "endride-episode-1",
    "thumbnail": "https://gogocdn.net/cover/endride.jpg"
 	 }	
	]


		      GET:
		      url: "https://aniswim-api.herokuapp.com/anime?id=100-man-no-inochi-no-ue-ni-ore-wa-tatteiru-2nd-season-episode-1"
		      response :[
	    {
	      "title": "100-man no Inochi no Ue ni Ore wa Tatteiru 2nd Season (2021)",
	      "total_ep": "12",
	      "anime_status": "Completed",
	      "description": "Second season of 100-man no Inochi no Ue ni Ore wa Tatteiru.",
	      "iframeLink": "https://gogoplay.io/streaming.php?id=MTY1MDAy&title=100-man+no+Inochi+no+Ue+ni+Ore+wa+Tatteiru+2nd+Season+Episode+1",
	      "videoID": "MTY1MDAy",
	      "video_links": {
		"source": [
		  {
		    "file": "https://vidstreamingcdn.com/cdn29/c083ad3ac53b6885e7fc1b41859b1951/EP.1.v0.1639380621.360p.mp4?mac=RuvWRIQD%2Bazn4cNz02qtVN2kynTOAtGnbtjM%2FccofKg%3D&vip=44.201.26.53&expiry=1645643201752",
		    "label": "360 P",
		    "type": "mp4"
		  },
		  {
		    "file": "https://vidstreamingcdn.com/cdn29/c083ad3ac53b6885e7fc1b41859b1951/EP.1.v0.1639380621.480p.mp4?mac=08QgE2K3Hmsr6p%2FzAG6PbwYmj0A96uiXtkT1veAnQlY%3D&vip=44.201.26.53&expiry=1645643201807",
		    "label": "480 P",
		    "type": "mp4"
		  },
		  {
		    "file": "https://vidstreamingcdn.com/cdn29/c083ad3ac53b6885e7fc1b41859b1951/EP.1.v0.1639380621.720p.mp4?mac=W7cDNxnR6zrSYjMCTNO%2FqoRigt8Q4t0oME0FZ0nEKso%3D&vip=44.201.26.53&expiry=1645643201864",
		    "label": "720 P",
		    "type": "mp4"
		  },
		  {
		    "file": "https://vidstreamingcdn.com/cdn29/c083ad3ac53b6885e7fc1b41859b1951/EP.1.v0.1639380621.1080p.mp4?mac=hJoKbmeTAVmopoGx6HtLHTt%2BgO4KJd%2BXaCWz3cw%2Frdk%3D&vip=44.201.26.53&expiry=1645643202126",
		    "label": "1080 P",
		    "type": "mp4"
		  },
		  {
		    "file": "https://vidstreamingcdn.com/cdn29/c083ad3ac53b6885e7fc1b41859b1951/EP.1.v0.1639380621.720p.mp4?mac=W7cDNxnR6zrSYjMCTNO%2FqoRigt8Q4t0oME0FZ0nEKso%3D&vip=44.201.26.53&expiry=1645643201864",
		    "label": "Auto",
		    "default": "true",
		    "type": "mp4"
		  }
		],
		"source_bk": [
		  {
		    "file": "https://www03.gogocdn.stream/videos/hls/_evHz25fKpD08_82S2cOpQ/1645650477/165002/e96754ea0bddca9b04ddadd74cbce9fa/ep.1.1645587374.m3u8",
		    "label": "hls P",
		    "type": "hls"
		  }
		],
		"track": {
		  "tracks": [
		    {
		      "file": "https://cache.anicdn.stream/images/c083ad3ac53b6885e7fc1b41859b1951/1.vtt",
		      "kind": "thumbnails"
		    }
		  ]
		},
		"advertising": [],
		"linkiframe": "https://sbplay2.com/e/s3ixfzd2l0qy"
	      }
	    }
	  ]

### <a src="https://aniswim-api.herokuapp.com/">Live Demo</a>

<a href="https://aniswim-api.herokuapp.com/">Live Link</a> - Getthe list of top/popular Anime.



