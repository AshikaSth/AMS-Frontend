import { z } from "zod"

export const registerFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string(),
  gender: z.enum(["female", "male", "others"]),
  address: z.string().min(3, "Address is too short"),
  phone_number: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
}).superRefine((data, ctx) => {
    // Check for empty password_confirmation first
    if (!data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password_confirmation"],
        message: "Password confirmation is required",
      });
      return; // stop here if empty
    }

    // Only check mismatch if password_confirmation exists
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password_confirmation"],
        message: "Passwords do not match",
      });
    }
  });
