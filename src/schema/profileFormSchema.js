// import { z } from 'zod'

// export const profileFormSchema = z.object({
//   bio: z.string().optional(),
//   website: z.string().url("Please enter a valid URL.").optional(),
//   social_media_links: z.array(
//     z.object({
//       platform: z.string().min(1, "Platform is required."),
//       link: z.string().url("Please enter a valid URL for the social link."),
//     })
//   ),
//   genres: z.array(z.string().min(1, "Genre name cannot be empty.")),
//   user_id: z.coerce.number().optional(),
//   manager_id: z.coerce.number().optional(),
//   photo: z.any().optional(),
//    first_name: z.string().min(2, "First name must be at least 2 characters"),
//   last_name: z.string().min(2, "Last name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   gender: z.enum(["female", "male", "others"]),
//   address: z.string().min(3, "Address is too short"),
//   phone_number: z.string().regex(/^\d{3}-\d{3}-\d{3,4}$/, "Invalid phone number"),
//   role: z.enum(["super_admin", "artist_manager", "artist"]).default("artist"),
//   dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
//     message: "Invalid date of birth",
//   }),
// })



import { z } from 'zod'

export const profileFormSchema = z.object({
first_release_year: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}$/.test(val) && parseInt(val) >= 1900 && parseInt(val) <= new Date().getFullYear(),
      { message: 'First release year must be a valid year between 1900 and the current year' }
    ),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  social_media_links: z
    .array(
      z.object({
        platform: z.string().min(1, 'Platform is required'),
        link: z.string().url('Must be a valid URL'),
      })
    )
    .optional(),
  genres: z.array(z.string().min(1, 'Genre cannot be empty')).optional(),
  user_id: z.number().optional().nullable(),
  manager_id: z.number().optional().nullable(),
  photo: z.any().optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Must be a valid email'),
  gender: z.enum(['male', 'female', 'other', ''], {
    errorMap: () => ({ message: 'Please select a valid gender' }),
  }).optional(),
  address: z.string().max(255, 'Address must be 255 characters or less').optional(),
  phone_number: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 123-456-7890')
    .optional(),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in the format YYYY-MM-DD')
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        const date = new Date(val)
        return date <= new Date() && date >= new Date('1900-01-01')
      },
      { message: 'Date of birth must be a valid date between 1900 and today' }
    ),
})