const router = require("express").Router();
const { Post } = require("../lib/sequelize");
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
  try {
    const { image_url, caption, location } = req.body;
    const newPost = await Post.create({
      image_url,
      caption,
      location,
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

module.exports = router;
