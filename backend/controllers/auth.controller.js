import { generateTokenAndSetCookie } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, username } = req.body;

    if (
      [fullName, username, password, email].some(
        (field) => field?.trim() === ""
      )
    ) {
      return res.status(400).json({
        message: "All field must be filled",
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      return res.status(400).json({
        error: "Credentials already taken",
      });
    }

    const newUser = await User.create({
      username,
      password,
      fullName,
      email,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("error in signup controller", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid Username",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: "Invalid Password",
      });
    }

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("error in login controller", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const logout = async (req, res, next) => {
  try {
    return res.status(200).cookie("jwt", "", {
      maxAge: 0
    }).json({
      message: "Logged out successfully"
    })
  } catch (error) {
    console.log("error in logout controller", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getMe = async (req,res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    return res.status(200).json(user)
  } catch (error) {
    console.log("error in getMe controller", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

export { signup, login, logout, getMe };
