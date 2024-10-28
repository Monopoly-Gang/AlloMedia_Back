const jwtService = require("../services/jwtService");

module.exports = async function sendAuthTokens(res, userData) {
  const accessToken = jwtService.generateToken(
    { id: userData._id, role: userData.role },
    30 * 60
  );
  const refreshToken = jwtService.generateToken(
    { id: userData._id, role: userData.role },
    7 * 24 * 60 * 60
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    accessToken,
    user: {
      id: userData._id,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
    },
  });
};
