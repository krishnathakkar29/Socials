// async (req,res,next) => {}

import { Notification } from "../models/notification.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res, _) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      console.log("post mein img if mein", uploadedResponse);
      img = uploadedResponse.secure_url;
    }

    const newPost = await Post.create({
      user: userId,
      text,
      img,
    });

    return res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
};

const deletePost = async (req, res, _) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const commentOnPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const posty = await Post.findById(postId);

    if (!posty) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            text,
            user: req.user._id,
          },
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const likeUnlikePost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //unlike
      await Post.updateOne(
        {
          _id: postId,
        },
        {
          $pull: {
            likes: userId,
          },
        }
      );
      await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          likedPosts: postId,
        },
      });
      return res.status(200).json({ message: "Post unliked Successfully" });
    } else {
      //like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notify = await Notification.create({
        from: userId,
        to: post.user,
        type: "like",
      });

      return res.status(200).json({ message: "Post liked Successfully" });
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getLikedPosts = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserPosts = async (req, res) => {
    try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		return res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts
}
