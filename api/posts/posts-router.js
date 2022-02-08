const { Router } = require('express');
const postsModel = require('./posts-model');
const router = Router();

router.get('/', (req, res) => {
  console.log('Router is working');
  postsModel
    .find(req.query)
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

router.get('/:id', (req, res) => {
  postsModel
    .findById(req.params.id)
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

router.post('/', (req, res) => {
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

router.put('/:id', async (req, res) => {
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
      await postsModel.update(id, body);
      res.status(200).json({ id: Number(id), ...body });
      return;
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'The post information could not be modified' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const postToDelete = await postsModel.findById(id);
  postsModel
    .remove(id)
    .then((numDeletedPosts) => {
      if (numDeletedPosts === 0) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      } else {
        res.status(200).json(postToDelete);
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The post could not be removed' });
    });
});

router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postsModel.findById(id);
    if (post === null || post === undefined) {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist' });
      return;
    }
    const comments = await postsModel.findPostComments(id);
    res.json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'The comments information could not be retrieved' });
  }
});

module.exports = router;
