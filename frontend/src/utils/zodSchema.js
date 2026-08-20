import z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(5)
});
export const signInSchema = signUpSchema.omit({ name: true });

export const createCourseSchema = z.object({
  name: z.string().min(5),
  categoryId: z.string().min(5, { message: "Please select a category" }),
  tagline: z.string().min(5),
  description: z.string().min(10),
  isFree: z.boolean().default(false).optional(),
  price: z.string().optional()
});

export const updateCourseSchema = createCourseSchema;

const baseContentSchema = z.object({
  title: z.string().min(5),
  type: z.string().min(3, { message: "Type is required" }),
  video: z.any().optional(),
  text: z.any().optional()
});

export const createContentSchema = baseContentSchema.superRefine((val, ctx) => {
  const parseText = z.string().min(4).safeParse(val.text);

  if (val.type === "video") {
    if (!val.video || (val.video.length === 0 && !val.video.name)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Video file is required",
        path: ["video"]
      });
    }
  }

  if (val.type === "text") {
    if (!parseText.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Text is required for text content",
        path: ["text"]
      });
    }
  }
});

export const updateContentSchema = baseContentSchema.superRefine((val, ctx) => {
  if (val.type === "text") {
    const parseText = z.string().min(4).safeParse(val.text);
    if (!parseText.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Text is required for text content",
        path: ["text"]
      });
    }
  }
});

export const createStudentSchema = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(5),
  avatar: z.any().refine((file) => file?.name, { message: "Avatar is required" })
});

export const updateStudentSchema = z.object({
  name: z.string().min(5),
  email: z.string().email()
});

export const addStudentCourseSchema = z.object({
  studentId: z.string().min(5)
});
