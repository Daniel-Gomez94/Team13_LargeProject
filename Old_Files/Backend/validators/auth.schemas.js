import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    handle: z.string().min(3).max(20),
    password: z.string().min(8)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

export const verifySchema = z.object({
  body: z.object({
    email: z.string().email(),
    code: z.string().min(4).max(8)
  })
});

export const requestResetSchema = z.object({
  body: z.object({ email: z.string().email() })
});

export const resetSchema = z.object({
  body: z.object({
    token: z.string(),
    password: z.string().min(8)
  })
});
