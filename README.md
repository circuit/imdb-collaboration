# imdb-collaboration

This application shows how easy the Circuit JS SDK can be integrated into a website. This website allows users to collaborate on different movies or TV shows.

Live app at [https://imdb.circuitsandbox.net](https://imdb.circuitsandbox.net/)

Medium article at [https://medium.com/@rurscheler/imdb-collaboration-bot-c43fa577b6e5](https://medium.com/@rurscheler/imdb-collaboration-bot-c43fa577b6e5)

This app is built using web components, specifically the [lit-html](https://github.com/PolymerLabs/lit-html) library built by the Google Polymer team.

> This is the README for the most current version. To view the version that corresponds to the [first medium article](https://medium.com/@rurscheler/introducing-the-circuit-apis-f98285f470f0) see [Branch V1](https://github.com/circuit/imdb-collaboration/tree/v1) 

## Features
* Search for movies or TV shows using [omdbapi.com](http://www.omdbapi.com)
* Allow collaboration on any of the movies/shows using the [Circuit SDK](https://github.com/circuit-sdk)
* No authentication required to view chat messages
* Corresponding Circuit conversation in created dyanmically by server-side bot application
* User management (i.e. adding users to conversation) is done dynamically by the bot
* Login using your own sandbox account or one of the test accounts
* Using webpack2
* Build with web components using lit-html

## Future
* Collaboration via Circuit WebRTC APIs (audio and/or video)
* AI for bot to reply to simple questions
* Allow commenting on post
* Like/Unlike posts
* Mention users
* Post links, properly display line breaks
* Show analytics data of usage

## Run locally
```bash
  git clone https://github.com/circuit/imdb-collaboration.git
  cd imdb-collaboration
  npm start
  // browse to http://localhost:3200
```
