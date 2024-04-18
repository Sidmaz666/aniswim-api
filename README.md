# aniswim-api

A simple API to get anime details and video links.

## Installation
	
	npm i
		
Run Locally - `npm run start ` or `node index.js`

## Endpoints:

1. `/` , `/popular` - List of popular Anime with animeID
2. `/links?id=animeID` - Get Anime Streaming Links
3. `/search?q=searchQuery` - Search Anime get animeID
4. `/latest` , `/new` - Get Latest Anime List
5. `/movies` - Get Anime Movies List
6. `/genre` - List of Genres
7. `/genre/genre_name` - Get Anime List Based on Genre
8. `/details?=animeID` - Get Thumbnail of a Particular Anime
9. `/list?page=1?order=m` - Get List of Anime
10. `/releases?page=1&type=1` - `Type: 1 = Sub, 2 = Dub, 3 = Chinese` - Get Recent Releases.


## URL Query Parameters

1. `page` - Go to <b>n</b> number of pages.
2.  `q` - For Search
3. `id` - For animeID & `ep` - To request a particular Episode
4. `list` - `/anime-list` Define List type Numerically or Alphabatically

### Example

```
/search?q=one+piece&page=2
/?page=2
/links?id=one-piece
/search?q=one-piece
/movies?page=2
/genre
/genre/action
/list?list=z
/details?id=one-piece
```
