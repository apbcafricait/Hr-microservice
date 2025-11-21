export const testCreate = async (req, res) => {
  console.log("test controller hit");
  console.log("Body:", req.body);
  console.log("User:", req.user);
  
  try {
    res.status(200).json({ 
      message: "Test endpoint works!",
      body: req.body,
      user: req.user 
    });
  } catch (err) {
    console.error("Test error:", err);
    res.status(500).json({ error: err.message });
  }
};