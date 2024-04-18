# aniswim-api

A simple API to get anime details and video links.

## Installation
	
	npm i
		
Run Locally - `npm run start ` or `node index.js`

## Endpoints:

1. `/` - List of popular Anime with animeID
2. `/anime?id=` - Get Anime Detail and Video Links with `animeID`
3. `/search?q=` - Search Anime get animeID
4. `/latest` - Get Latest Anime List
5. `/movies` - Get Anime Movies List
6. `/genre` - List of Genres
7. `/genre/{genre_name}` - Get Anime List Based on Genre
8. `/thumbnail/{animeID}` - Get Thumbnail of a Particular Anime
9. `/anime-list` - Get List of Anime


## URL Query Parameters

1. `page` - Go to <b>n</b> number of pages.
2.  `q` - For Search
3. `id` - For animeID & `ep` - To request a particular Episode
4. `list` - `/anime-list` Define List type Numerically or Alphabatically

### Example

```
/search?q=one+piece&page=2
/?page=2
/anime?id=one-piece
/search?q=one-piece
/movies?page=2
/genre
/genre/action
/anime-list?list=z
/thumbnail/one-piece
```

### Expected Response

```
URL : http://localhost:3020/anime?id=one-piece

{
  "title": "One Piece",
  "anime_type": "TV Series",
  "genre": "Action,Adventure,Comedy,Fantasy,Shounen,SuperPower",
  "released_year": "1999",
  "description": "One Piece is a story about  Monkey D. Luffy, who wants to become a sea-robber. In a world mystical, there have a mystical fruit whom eat will have a special power but also have greatest weakness. Monkey ate Gum-Gum Fruit which gave him a strange power but he can NEVER swim. And this weakness made his dream become a sea – robber to find ultimate treasure is difficult.\n\nOne Piece is a story about  Monkey D. Luffy, who wants to become a sea-robber. In a world mystical, there have a mystical fruit whom eat will have a special power but also have greatest weakness. Monkey ate Gum-Gum Fruit which gave him a strange power but he can NEVER swim. And this weakness made his dream become a sea – robber to find ultimate treasure is difficult. But along his ways, he meet himself many members to help. Together, they sail the Seven Seas of adventure in search of the elusive treasure “One Piece.”",
  "other_name": "Not-Mentioned",
  "anime_status": "Ongoing",
  "total_ep": "1059",
  "requested_episode": 1,
  "thumb": "https://gogocdn.net/images/anime/One-piece.jpg",
  "iframeLink": "https://playtaku.net/streaming.php?id=MzUxOA==&title=One+Piece+Episode+1",
  "video_links": Array[1][
    {
      "main_link": "https://ta-009.anewcdn.com/1ab5d45273a9183bebb58eb74d5722d8ea6384f350caf008f08cf018f1f0566d0cb82a2a799830d1af97cd3f4b6a9a81ef3aed2fb783292b1abcf1b8560a1d1aa308008b88420298522a9f761e5aa1024fbe74e5aa853cfc933cd1219327d1232e91847a185021b184c027f97ae732b3708ee6beb80ba5db6628ced43f1196fe/0b594d900f47daabc194844092384914/ep.1.1677592419.m3u8",
      "available_links": Array[4][
        {
          "url": "https://ta-009.anewcdn.com/1ab5d45273a9183bebb58eb74d5722d8ea6384f350caf008f08cf018f1f0566d0cb82a2a799830d1af97cd3f4b6a9a81ef3aed2fb783292b1abcf1b8560a1d1aa308008b88420298522a9f761e5aa1024fbe74e5aa853cfc933cd1219327d1232e91847a185021b184c027f97ae732b3708ee6beb80ba5db6628ced43f1196fe/0b594d900f47daabc194844092384914/ep.1.1677592419.360.m3u8",
          "quality": "360"
        },
        {
          "url": "https://ta-009.anewcdn.com/1ab5d45273a9183bebb58eb74d5722d8ea6384f350caf008f08cf018f1f0566d0cb82a2a799830d1af97cd3f4b6a9a81ef3aed2fb783292b1abcf1b8560a1d1aa308008b88420298522a9f761e5aa1024fbe74e5aa853cfc933cd1219327d1232e91847a185021b184c027f97ae732b3708ee6beb80ba5db6628ced43f1196fe/0b594d900f47daabc194844092384914/ep.1.1677592419.480.m3u8",
          "quality": "480"
        },
        {
          "url": "https://ta-009.anewcdn.com/1ab5d45273a9183bebb58eb74d5722d8ea6384f350caf008f08cf018f1f0566d0cb82a2a799830d1af97cd3f4b6a9a81ef3aed2fb783292b1abcf1b8560a1d1aa308008b88420298522a9f761e5aa1024fbe74e5aa853cfc933cd1219327d1232e91847a185021b184c027f97ae732b3708ee6beb80ba5db6628ced43f1196fe/0b594d900f47daabc194844092384914/ep.1.1677592419.720.m3u8",
          "quality": "720"
        },
        {
          "url": "https://ta-009.anewcdn.com/1ab5d45273a9183bebb58eb74d5722d8ea6384f350caf008f08cf018f1f0566d0cb82a2a799830d1af97cd3f4b6a9a81ef3aed2fb783292b1abcf1b8560a1d1aa308008b88420298522a9f761e5aa1024fbe74e5aa853cfc933cd1219327d1232e91847a185021b184c027f97ae732b3708ee6beb80ba5db6628ced43f1196fe/0b594d900f47daabc194844092384914/ep.1.1677592419.1080.m3u8",
          "quality": "1080"
        }
      ]
    }
  ],
  "streamLinks": Array[4][
    {
      "link": "https://playtaku.net/embedplus?id=MzUxOA==&token=i2DXMix0juyfFCyHSvpVnQ&expires=1682502845"
    },
    {
      "link": "https://sbone.pro/e/3pf7o29i349d"
    },
    {
      "link": "https://dood.wf/e/8ol21m67ej3r"
    },
    {
      "link": "https://fembed9hd.com/v/zdp-5sjx-g6dw77"
    }
  ]
}
```

### Live Demo

<a href="https://aniswim-api.vercel.app/">Live Link</a> - Get the list of top/popular Anime.



