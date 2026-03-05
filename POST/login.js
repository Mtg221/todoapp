app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (user.length === 0) {
    return res.status(400).json({ message: "User not found" });
  }

  const valid = await bcrypt.compare(password, user[0].password);

  if (!valid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { userId: user[0].id },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });

});