const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Génère un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Inscription
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const user = await User.create({ email, password });

    res.status(201).json({
      message: "Inscription réussie.",
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Connexion
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    res.status(200).json({
      message: "Connexion réussie.",
      token: generateToken(user._id),
      user: { email: user.email }, // Optionnel : Renvoie les infos de l'utilisateur
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { registerUser, loginUser };
