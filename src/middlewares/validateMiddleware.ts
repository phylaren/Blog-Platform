import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod'; 

export const validate = (schema: z.ZodTypeAny) => 
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
         res.status(400).json({ 
          error: 'Помилка валідації даних', 
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
         return;
      }
      next(error);
    }
  };