import JWT from 'jsonwebtoken';
import { User } from '../models/userModel.js'; 
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from authorization header
    const token = req?.headers?.authorization?.split(' ')[1];
    console.log("Token from header authorization:", req?.headers?.authorization);

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: "Please login to access this resource.",
        error: true,
        success: false,
      });
    }

    // Verify the token
    JWT.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.log("Error during token verification:", err);
        return res.status(401).json({
          message: "Invalid or expired token.",
          error: true,
          success: false,
        });
      }

      // Find the user by ID
      const user = await User.findById(decoded.id);

      // Check if user exists
      if (!user) {
        return res.status(404).json({
          message: "User not found.",
          error: true,
          success: false,
        });
      }

      // Attach user data to request object
      req.user = user;

      // Proceed to next middleware or controller
      next();
    });
  } catch (error) {
    console.log('Error in authentication middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
      error,
    });
  }
};
