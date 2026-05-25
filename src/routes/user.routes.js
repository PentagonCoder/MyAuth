import { Router } from 'express';

const router = Router();


import { registerUser, emailVerify, loginUser, getProfile, refreshToken, logoutUser, adminDashboard} from '../controllers/user.controllers.js';
import {verifyjwt} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema } from '../validators/user.validation.js';
import { authorizeRoles  } from '../middlewares/authorizeRoles.js'
import { forgotPassword , resetPassword, forgotPasswordOtp, resetPasswordOtp} from '../controllers/auth.controller.js';

// Register endpoint
router.post('/register', validate(registerSchema), registerUser);
router.get('/verify-email/:token', emailVerify)
router.post('/login', loginUser );
router.post('/refresh-Token', refreshToken);
router.post('/profile', verifyjwt, getProfile);
router.post('/logout', verifyjwt, logoutUser);
router.post('/admin/dashboard', verifyjwt, authorizeRoles ('admin'), adminDashboard);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/forgot-password-Otp', forgotPasswordOtp);
router.post('/reset-password-Otp', resetPasswordOtp,);


// router.delete("/delete-user", verifyJWT, isAdmin, deleteUser);

// router.post('/:id', (req, res) => {
//   const { id } = req.params;
//   const user = users.find((u)=> u.id == id)
//   res.send(user.username);
// });

export default router;