'use strict';

const request = require('request');
const Circuit = require('circuit-sdk');
const config = require('./config.json');

module.exports = app => {
  const users = [];
  let searchId;
  let bot;

  /**
   * Create Circuit client instance and login as bot (Client Credentials Grant)
   */
  const client = new Circuit.Client(config.circuit);
  client.logon()
    .then(user => bot = user)
    .catch(console.error);

  /**
   * Search omdbapi for movie and TV show titles. Proxied here since omdbapi
   * doesn't support https
   */
  app.get('/search/:query', (req, res) => {
    request(`http://www.omdbapi.com/?apikey=${config.omdbapikey}&s=${req.params.query}`, { json: true }, (err, resp, body) => {
      if (err) {
        res.status(500).send(err);
      }
      if (!err && resp.statusCode === 200) {
        res.status(200).send(body);
        return;
      }
      res.status(resp.statusCode).send(err);
    });
  });

  /**
   * Get details of movie using imdb ID. Proxied here since omdbapi
   * doesn't support https
   */
  app.get('/details/:id', (req, res) => {
    request(`http://www.omdbapi.com/?apikey=${config.omdbapikey}&i=${req.params.id}`, { json: true }, (err, resp, body) => {
      if (!err && resp.statusCode === 200) {
        res.status(200).send(body);
        return;
      }
      res.status(resp.statusCode).send(err);
    });
  });

  /**
   * Search conversation by title. Create conversation if it doesn't exist yet.
   * Uses Circuit's search API with scope 'CONVERSATION'.
   */
  app.get('/find/:imdb', (req, res) => {
    const title = 'IMDB: ' + req.params.imdb;
    let convId;

    const basicSearchResultsHandler = evt => {
      if (evt.data.searchId !== searchId) {
        console.error('Result is not for the current search');
        return;
      }
      const searchResults = evt.data.searchResults;
      if (searchResults && searchResults.length) {
        // There should only be one conversation with that title that the bot
        // is a member of.
        convId = searchResults[0].convId;
      }
    };

    const searchStatusHandler = evt => {
      if (evt.data.searchId !== searchId) {
        // Something is wrong. The event is for another pending search.
        return;
      }

      if (evt.data.status === Circuit.Enums.SearchStatusCode.NO_RESULT) {
        // No conversation exists yet, so let's create one. A conference bridge is
        // just a regular conversation without any other participants yet.
        client.createConferenceBridge(title)
          .then(conv => sendResponse(200, conv.convId))
          .catch(err => sendResponse(500, err));
        return;
      }

      if (evt.data.status === Circuit.Enums.SearchStatusCode.FINISHED && convId) {
        // Search is finished and conversation was found.
        sendResponse(200, convId);
        return;
      }

      // Error cases. Should not happen.
      sendResponse(500);
    };

    const sendResponse = (status, data) => {
      res.status(status).send(data);
      client.removeEventListener('basicSearchResults', basicSearchResultsHandler);
      client.removeEventListener('searchStatus', searchStatusHandler);
    }

    client.addEventListener('basicSearchResults', basicSearchResultsHandler);
    client.addEventListener('searchStatus', searchStatusHandler);

    // Start the scoped search. Zero, one or more `basicSearchResults` will be raised,
    // and a `searchStatus` at the end.
    client.startBasicSearch([{
      scope: Circuit.Enums.SearchScope.CONVERSATIONS,
      searchTerm: title
    }])
      .then(id => searchId = id)
      .catch(err => sendResponse(500, err));
  });

  /**
   * Get the post (text items) for a conversation.
   */
  app.get('/posts/:conv', (req, res) => {
    client.getConversationItems(req.params.conv, {numberOfItems: 50})
      .then(items => {
        let posts = items.reverse().filter(item => !!item.text);
        let newUserIds = posts
          .map(post => post.creatorId)
          .filter(userId => !users[userId]);
        newUserIds = [...new Set(newUserIds)];

        return client.getUsersById(newUserIds)
          .then(userList => {
            userList.forEach(user => users[user.userId] = user);

            // Add avatar and displayName of creator
            posts.forEach(post => {
              const user = users[post.creatorId];
              post.creatorAvatar = user.avatar;
              post.creatorDisplayName = user.displayName;
            });
            res.status(200).send(posts);
          })
      })
      .catch(err => res.status(500).send(err));
  });

  /**
   * Lookup a user to get its avatar and display name
   */
  app.get('/user/:userId', (req, res) => {
    const user = users[req.params.userId];
    if (user) {
      res.status(200).send(user);
      return;
    }
    client.getUserById(req.params.userId)
      .then(user => {
        users[user.userId] = user;
        res.status(200).send(user);
      })
      .catch(err => res.status(500).send(err));
  });

  /**
   * Add user as member of the conversation.
   */
  app.post('/join/:conv/:user', (req, res) => {
    client.addParticipant(req.params.conv, [req.params.user])
      .then(() => res.sendStatus(200))
      .catch(err => {
        // We are in the process of improving the error handling, so
        // we don't have to string compare for specific errors :)
        if (err.message.indexOf('already exist')) {
          res.sendStatus(200);
        } else {
          res.status(500).send(err)
        }
      });
  });

}
