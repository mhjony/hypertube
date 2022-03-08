// import bcrypt from "bcrypt";
// import validator from "validator";

const register = async (req, res) => {
  try {
    console.log("I am register");
    // const { email, password } = req.body;

    // if (!validator.isEmail(email)) {
    //   res.status(401).send({ error: "invalid email" }).end();
    //   return;
    // }
    // if (!password && password.length < 4) {
    //   res.status(401).send({ error: "invalid password" }).end();
    //   return;
    // }

    // const hashedPassword = await bcrypt.hash(password, 10);

    // // Need to create user in DB

    res
      .status(200)
      .json({
        message: "account created",
      })
      .end();
  } catch (e) {
    logging(e);
    res.status(500).json({ error: "Server error" });
  }
};

export default {
  register,
};
