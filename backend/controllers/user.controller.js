import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

const getUserProfile = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({
      username,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not FOund",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const followUnfollowUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //unfollow the user

      await User.findByIdAndUpdate(id, {
        $pull: {
          followers: req.user._id,
        },
      });

      await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          following: id,
        },
      });

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //follow
      await User.findByIdAndUpdate(id, {
        $push: {
          followers: req.user._id,
        },
      });

      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          following: id,
        },
      });

      const notify = Notification.create({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      //Sending a notification
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getSuggestedUsers = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const users = await User.find({
      _id: {
        $nin: user.following,
      },
    })
      .limit(10)
      .select("-password");

    const usersExcludingMe = users.filter(
      (user) => user._id.toString() !== userId.toString()
    );

    const suggestedUsers = usersExcludingMe.slice(0, 4);
    return res.status(200).json({
      suggestedUsers,
    });
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const {
      username,
      email,
      fullName,
      bio,
      link,
      currentPassword,
      newPassword,
    } = req.body;

    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    //only one of pass is present
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    // updating password
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });

      user.password = newPassword;
      await user.save({ validateBeforeSave: false });
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg, {
        resource_type: "auto",
      });
      console.log(uploadedResponse);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg, {
        resource_type: "auto",
      });
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save();

    const finalUser = await User.findById(userId).select("-password");

    return res.status(200).json({ user: finalUser });
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUserProfile,
};
