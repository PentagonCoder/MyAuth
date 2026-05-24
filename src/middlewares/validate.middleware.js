import { asyncHandler } from '../utils/asyncHandler.js';

const validate = (schema) => {

   return (req, res, next) => {

      const result = schema.safeParse(req.body);

      if (!result.success) {
         return res.status(400).json({
            message: "VALIDATION ERROR",
            error: result.error.errors
         });
      }

      next();

   };

};

export { validate };