import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { user } from '../database/schema/user.schema';
import { DI } from '../dependency-injection'
import { items } from '../database/schema/items.schema';

export const createUserZodSchema = createInsertSchema(user, {
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
}).transform(async (data) => {
  return {
    ... data,
    password: await DI.utils.passwordHasher.hashPassword(data.password),
  };
});

export const createItemZodSchema = createInsertSchema(items, {
  name: z.string().min(1),
  description: z.string().min(1),
})

export const loginZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateItem = z.infer<typeof createItemZodSchema>;
export type CreateUser = z.infer<typeof createUserZodSchema>;
