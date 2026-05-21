import { Router } from 'express';

const router = Router();


import { registerUser, loginUser, getProfile} from '../controllers/user.controllers.js';
import {verifyjwt} from '../middlewares/auth.middleware.js';

// Register endpoint
router.post('/register', registerUser);
router.get('/login', loginUser );
router.get('/profile', verifyjwt, getProfile);



// router.post('/:id', (req, res) => {
//   const { id } = req.params;
//   const user = users.find((u)=> u.id == id)
//   res.send(user.username);
// });

export default router;