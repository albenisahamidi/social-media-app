const activeProfile = (req, res, next) => {
  if (!req.user?.isActive) {
    return res.status(403).json({ message: "Profile is inactive" });
  }

  next();
};

export default activeProfile;