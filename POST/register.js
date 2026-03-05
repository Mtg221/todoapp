app.post("/register", async (req, res) => {

  const { email, password } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      email,
      password: hashedPassword
    });

    res.json({ message: "User created" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});