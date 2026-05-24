import { Router } from 'express';

const router = Router();


import { registerUser, loginUser, getProfile, refreshToken, logoutUser, adminDashboard} from '../controllers/user.controllers.js';
import {verifyjwt} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema } from '../validators/user.validation.js';
import { authorizeRoles  } from '../middlewares/authorizeRoles.js'

// Register endpoint
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', loginUser );
router.post('/refresh-Token', refreshToken);
router.post('/profile', verifyjwt, getProfile);
router.post('/logout', verifyjwt, logoutUser);
router.post('/admin/dashboard', verifyjwt, authorizeRoles ('admin'), adminDashboard);
// router.delete("/delete-user", verifyJWT, isAdmin, deleteUser);

// router.post('/:id', (req, res) => {
//   const { id } = req.params;
//   const user = users.find((u)=> u.id == id)
//   res.send(user.username);
// });

export default router;