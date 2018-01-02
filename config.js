'use strict';

// Get your own client_id at http://circuit.github.io/oauth
export const client_id = '05e6fecd330e4d1094a55c0e64ec9e85';
export const domain = 'circuitsandbox.net';

// Hardcoded for now. Taken from http://www.omdbapi.com/ since IMDb is not free anymore.
export const shows = [{
  name: 'Seinfeld',
  convId: '85ac4b2f-3c6f-4d49-acdb-49cd635ec283',
  data: {
    "Title": "Seinfeld",
    "Year": "1989–1998",
    "Rated": "TV-PG",
    "Released": "05 Jul 1989",
    "Runtime": "22 min",
    "Genre": "Comedy",
    "Director": "N/A",
    "Writer": "Larry David, Jerry Seinfeld",
    "Actors": "Jerry Seinfeld, Michael Richards, Jason Alexander, Julia Louis-Dreyfus",
    "Plot": "The continuing misadventures of neurotic New York stand-up comedian Jerry Seinfeld and his equally neurotic New York friends.",
    "Language": "English",
    "Country": "USA",
    "Awards": "Won 3 Golden Globes. Another 70 wins & 182 nominations.",
    "Poster": "https://images-na.ssl-images-amazon.com/images/M/MV5BZjZjMzQ2ZmUtZWEyZC00NWJiLWFjM2UtMzhmYzZmZDcxMzllXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "8.9/10"
      }
    ],
    "Metascore": "N/A",
    "imdbRating": "8.9",
    "imdbVotes": "197,761",
    "imdbID": "tt0098904",
    "Type": "series",
    "totalSeasons": "9",
    "Response": "True"
  }
}, {
  name: 'Breaking Bad',
  convId: '9f9dfd27-3082-4968-8069-9f83f1ace86b',
  data: {
    "Title": "Breaking Bad",
    "Year": "2008–2013",
    "Rated": "TV-MA",
    "Released": "20 Jan 2008",
    "Runtime": "49 min",
    "Genre": "Crime, Drama, Thriller",
    "Director": "N/A",
    "Writer": "Vince Gilligan",
    "Actors": "Bryan Cranston, Anna Gunn, Aaron Paul, Dean Norris",
    "Plot": "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    "Language": "English, Spanish",
    "Country": "USA",
    "Awards": "Won 2 Golden Globes. Another 144 wins & 225 nominations.",
    "Poster": "https://images-na.ssl-images-amazon.com/images/M/MV5BZDNhNzhkNDctOTlmOS00NWNmLWEyODQtNWMxM2UzYmJiNGMyXkEyXkFqcGdeQXVyNTMxMjgxMzA@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "9.5/10"
      }
    ],
    "Metascore": "N/A",
    "imdbRating": "9.5",
    "imdbVotes": "1,041,362",
    "imdbID": "tt0903747",
    "Type": "series",
    "totalSeasons": "5",
    "Response": "True"
  }
}, {
  name: 'Homeland',
  convId: '78eee25a-55a4-48c6-b485-60ee4bf00a4c',
  data: {
    "Title": "Homeland",
    "Year": "2011–",
    "Rated": "TV-MA",
    "Released": "02 Oct 2011",
    "Runtime": "55 min",
    "Genre": "Crime, Drama, Mystery",
    "Director": "N/A",
    "Writer": "Alex Gansa, Howard Gordon",
    "Actors": "Claire Danes, Mandy Patinkin, Rupert Friend, F. Murray Abraham",
    "Plot": "A bipolar CIA operative becomes convinced a prisoner of war has been turned by al-Qaeda and is planning to carry out a terrorist attack on American soil.",
    "Language": "English",
    "Country": "USA",
    "Awards": "Won 5 Golden Globes. Another 49 wins & 163 nominations.",
    "Poster": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTA1MTA4MjU5MjReQTJeQWpwZ15BbWU4MDg3Mjc0NjAy._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "8.4/10"
      }
    ],
    "Metascore": "N/A",
    "imdbRating": "8.4",
    "imdbVotes": "257,335",
    "imdbID": "tt1796960",
    "Type": "series",
    "totalSeasons": "8",
    "Response": "True"
    }
}, {
  name: 'Game of Thrones',
  convId: 'a7342b73-417c-4a4e-bb65-9440c75d3a7d',
  data: {
    "Title": "Game of Thrones",
    "Year": "2011–",
    "Rated": "TV-MA",
    "Released": "17 Apr 2011",
    "Runtime": "57 min",
    "Genre": "Adventure, Drama, Fantasy",
    "Director": "N/A",
    "Writer": "David Benioff, D.B. Weiss",
    "Actors": "Peter Dinklage, Lena Headey, Emilia Clarke, Kit Harington",
    "Plot": "Nine noble families fight for control over the mythical lands of Westeros, while a forgotten race returns after being dormant for thousands of years.",
    "Language": "English",
    "Country": "USA, UK",
    "Awards": "Won 1 Golden Globe. Another 253 wins & 441 nominations.",
    "Poster": "https://images-na.ssl-images-amazon.com/images/M/MV5BMjE3NTQ1NDg1Ml5BMl5BanBnXkFtZTgwNzY2NDA0MjI@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "9.5/10"
      }
    ],
    "Metascore": "N/A",
    "imdbRating": "9.5",
    "imdbVotes": "1,268,485",
    "imdbID": "tt0944947",
    "Type": "series",
    "totalSeasons": "8",
    "Response": "True"
  }
}];
