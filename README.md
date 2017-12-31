# imdb-collaboration

This application showcases how easy the Circuit JS SDK can be integrated into a website. The website allows users to collaborate on different movies/shows.

Live app at [https://imdb.circuitsandbox.com]()  ... soon

This app is built using web components, specifically the [lit-html](https://github.com/PolymerLabs/lit-html) library built by the Polymer team. In addition [lit-html-element](https://github.com/kenchris/lit-element) is used simplify the code.

## Limitations in this first version
* Only 3 fixed TV shows to collaborate on
* Login only with the 3 accounts listed below sign in button

## Future
* Search for movies or TV shows and allow collaboration on all of them. Show more information of the movies/shows of OMDb API.
* Login with your own sandbox account. This will require a server-side integration with the Circuit Node.js SDK where a bot adds users to the corresponding conversation as needed.
* Collaboration via Circuit WebRTC APIs (audio and/or video).
* Allow commenting on post (maybe)
* Like/Unlike posts
* Show analytics data of usage
* Use a module bundler like webpack rather than serving node_modules.

## Install
```bash
  git clone https://github.com/circuit/imdb-collaboration.git
  npm install
```

## Run
```bash
  npm start
```
