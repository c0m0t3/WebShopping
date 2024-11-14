import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { user } from '../database/schema/user.schema';
import { DI } from '../dependency-injection';
import { items } from '../database/schema/items.schema';
import { shoppingLists } from '../database/schema/shoppingLists.schema';

export const createUserZodSchema = createInsertSchema(user, {
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
}).transform(async (data) => {
  return {
    ...data,
    password: await DI.utils.passwordHasher.hashPassword(data.password),
  };
});

export const createShoppingListZodSchema = createInsertSchema(shoppingLists, {
  name: z.string().min(1),
  description: z.string().min(1),
})
  .pick({
    name: true,
    description: true,
  })
  .extend({
    items: z
      .array(
        z
          .object({
            id: z.string().uuid().optional(),
            name: z.string().min(1).optional(),
            description: z.string().min(1).optional(),
            quantity: z.number().int().positive().optional(),
          })
          .refine((data) => data.id ?? data.name, {
            message: 'At least one of id or name must be provided',
          }),
      )
      .optional(),
  });

export const createItemZodSchema = createInsertSchema(items, {
  name: z.string().min(1),
  description: z.string().min(1).optional(),
});

export const associateItemsWithShoppingListSchema = z.object({
  items: z.array(
    z.object({
      itemId: z.string().uuid(),
      quantity: z.number().int().positive().optional(),
    })
  ),
});

export const loginZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateItem = z.infer<typeof createItemZodSchema>;
export type CreateUser = z.infer<typeof createUserZodSchema>;
