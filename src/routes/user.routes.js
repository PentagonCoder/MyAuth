import { Router } from 'express';
const router = Router();


import { registerUser, loginUser } from '../controllers/user.controllers.js';

// Register endpoint
router.post('/register', registerUser);
router.get('/login', loginUser );


// router.post('/:id', (req, res) => {
//   const { id } = req.params;
//   const user = users.find((u)=> u.id == id)
//   res.send(user.username);
// });

export default router;