const router = require("express").Router();
const { Post, User, Like } = require("../lib/sequelize");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    // untuk pagination
    const { _limit = 30, _page = 1 } = req.query;

    delete req.query._limit;
    delete req.query._page;

    const findPosts = await Post.findAndCountAll({
      where: {
        ...req.query,
      },

      // untuk pagination
      limit: _limit ? parseInt(_limit) : undefined,
      offset: (_page - 1) * _limit,
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    return res.status(200).json({
      message: "Post fetched successfully",
      result: findPosts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.post("/", async (req, res) => {
  __
  try {
    const { image_url, caption, location, user_id } = req.body;
    const newPost = await Post.create({
      image_url,
      caption,
      location,
      user_id,
    });
    res.status(201).json({
      message: "Post created",
      result: newPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPost = await Post.update(
      {
        ...req.body,
      },
      {
        where: {
          id,
        },
      }
    );
    return res.status(201).json({
      message: "Post editted successfully",
      result: updatedPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.destroy({
      where: {
        id,
      },
    });

    return res.status(201).json({
      message: "Post deleted successfully",
      result: deletedPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.get("/:id/likes", async (req, res) => {
  try {
    const { id } = req.params;
    const postLikes = await Like.findAll({
      where: {
        post_id: id,
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    return res.status(200).json({
      message: "Fetch likes",
      result: postLikes,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
});
router.post("/:postId/likes/:userId", async (req, res) => {
  // 1. check apakah user sudah like post?
  // 2. tambah relasi user dengan post di table like
  // 3. increment like count di post
  const { userId, postId } = req.params;
  const isUserLikeAlready = await Like.findOne({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });

  if (isUserLikeAlready) {
    return res.status(400).json({
      message: "User already liked this post",
    });
  }
  await Like.create({
    user_id: userId,
    post_id: postId,
  });

  await Post.increment(
    { like_count: 1 },
    {
      where: {
        id: postId,
      },
    }
  );
  return res.status(201).json({
    message: "Liked the post successfully",
  });
});

router.delete("/:postId/likes/:userId", async (req, res) => {
  const { userId, postId } = req.params;
  const isUserLikeAlready = await Like.findOne({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });
  if (!isUserLikeAlready) {
    return res.status(400).json({
      message: "User hasn't liked the post",
    });
  }

  await Like.destroy({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });
  await Post.increment(
    { like_count: -1 },
    {
      where: {
        id: postId,
      },
    }
  );
  return res.status(201).json({
    message: "Unliked successfully"
  })
});
module.exports = router;
