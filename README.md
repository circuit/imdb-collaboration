# imdb-collaboration

This application showcases how easy the Circuit JS SDK can be integrated into a website. This website allows users to collaborate on different movies or TV shows.

Live app at [https://rawgit.com/circuit/imdb-collaboration/v1.0/index.html]()

This app is built using web components, specifically the [lit-html](https://github.com/PolymerLabs/lit-html) library built by the Google Polymer team. In addition [lit-html-element](https://github.com/kenchris/lit-element) is used to simplify the code.

## Limitations in this first version
* Only 4 fixed TV shows to collaborate on
* Login only with the 3 accounts listed below sign in button

## Future
* Search for movies or TV shows and allow collaboration on all of them. Show more information of the movies/shows of OMDb API.
* Login with your own sandbox account. This will require a server-side integration with the Circuit Node.js SDK where a bot adds users to the corresponding conversation as needed.
* Collaboration via Circuit WebRTC APIs (audio and/or video).
* Allow commenting on post (maybe)
* Like/Unlike posts
* Show analytics data of usage
* Use a module bundler like webpack rather than serving node_modules.

## Run locally
Use any webserver and open the index.html file. E.g. using [http-server](https://www.npmjs.com/package/http-server)
```bash
  git clone https://github.com/circuit/imdb-collaboration.git
  cd imdb-collaboration
  http-server -p 3200
  // browse to http://localhost:3200
```
