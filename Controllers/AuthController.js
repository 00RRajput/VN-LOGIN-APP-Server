const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Response = require("../Helpers/Response");
const Modify = require("../Helpers/Modify");
const User = require("../Models/User");
const { DATABASE, APP_NAME } = process.env;
const jwt = require("jsonwebtoken");

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with user data / error }
 */
const register = async (req, res, next) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  req.body.isActive = true;
  req.body.created_at = new Date();
  req.body.updated_at = new Date();
  //   mongoose
  //     .connect(DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  // .then(() => {
  const newUser = new User(req.body);

  newUser
    .save()
    .then((result) => {
      Response.success(res, {
        message: "User saved successfully",
      });
    })
    .catch((error) => {
      if (
        error.name === "MongoServerError" &&
        error.code === 11000 &&
        error.keyPattern.user_name === 1
      ) {
        Response.badRequest(res, {
          message: "Username already exists",
        });
      } else {
        console.error("Error:", error);
      }
    });
  // })
  // .catch((error) => {
  //   console.error("Error:", error);
  // });
};

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with user data / error }
 */
const login = async (req, res, next) => {
  try {
    // mongoose
    //   .connect(DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })

    //   .then(async () => {
    let data = await User.findOne({ user_name: req.body.user_name });

    if (data) {
      data = await Modify.record(data.toObject());

      if (await bcrypt.compare(req.body.password, data.password)) {
        let token = jwt.sign({ id: data.id }, "secret-string-here", {
          expiresIn: "12 hours",
        });
        delete data.password;
        
        await User.findOneAndUpdate(
          { user_name: req.body.user_name },
          {
            $set: {
              access_token: token,
              refresh_token: token,
              updated_at: new Date()
            },
          },
          { new: true }
        );

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        // console.log('expiryDate ', expiryDate, APP_NAME);
        res.cookie(APP_NAME, JSON.stringify({ token }), {
          secure: true,
          httpOnly: true,
          expires: new Date(),
          sameSite: "none",
        });

        data.access_token = token;
        data.refresh_token = token;

        Response.success(res, {
          message: "User logged in successfully",
          data,
        });
      } else
        Response.badRequest(res, {
          message: "Invalid password 😣!",
        });
    } else
      Response.badRequest(res, {
        message: "User not found 😣!",
      });
    //   });
  } catch (error) {
    console.error("Error:", error);
  }
};
/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with user data / error }
 */
const getUser = async (req, res, next) => {
let data = await User.findOne({ refresh_token: req.query.rememberToken });
  
  if (data) {
    delete data.password;

    data = await Modify.record(data.toObject());
    Response.success(res, {
      message: "User logged in successfully",
      data,
    });
  } else {
    Response.badRequest(res, {
      message: "User not found 😣!",
    });
  }
};

const logout = async (req, res, next) => {
    await User.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          access_token: null,
          refresh_token: null,
        },
      },
      { new: true }
    );

    Response.success(res, {
      message: "User logged out successfully"
    });
  };

module.exports = {
  register,
  login,
  getUser,
  logout
};
