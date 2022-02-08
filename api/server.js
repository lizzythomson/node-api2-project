// implement your server here
// require your posts router and connect it here
const express = require('express');
const postsModel = require('./posts/posts-model');

const server = express();

server.use(express.json());

server.get('/api/posts', (req, res) => {
  postsModel
    .find()
    .then((posts) => {
      console.log(posts);
      res.json(posts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: 'The posts information could not be retrieved' });
    });
});

server.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  postsModel
    .findById(id)
    .then((post) => {
      if (post === undefined || post === null) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      } else {
        res.json(post);
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: 'The post information could not be retrieved' });
    });
});

server.post('/api/posts', (req, res) => {
  const body = req.body;
  if (!body.title || !body.contents) {
    res
      .status(400)
      .json({ message: 'Please provide title and contents for the post' });
  } else {
    postsModel
      .insert(body)
      .then((post) => {
        res.status(201).json({
          id: post.id,
          ...body,
        });
      })
      .catch(() => {
        res.status(500).json({
          message: 'There was an error while saving the post to the database',
        });
      });
  }
});

server.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postsModel.findById(id);
    const body = req.body;
    if (post === undefined || post === null) {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist' });
      return;
    } else if (!body.title || !body.contents) {
      res
        .status(400)
        .json({ message: 'Please provide title and contents for the post' });
      return;
    } else {
      const numUpdatedPosts = await postsModel.update(id, body);
      console.log(numUpdatedPosts);
      res.status(200).json({ id: Number(id), ...body });
      return;
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'The post information could not be modified' });
  }
});

// 4	PUT	/api/posts/:id
// 5	DELETE	/api/posts/:id
// 6	GET	/api/posts/:id/comments

module.exports = server;
