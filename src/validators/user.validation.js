import { z } from 'zod';

const registerSchema = z.object({
   fullname: z.string().min(3),
   email: z.string().email(),
   password: z.string().min(6)
});

export { registerSchema };