import z from 'zod';

const imageFileSchema = typeof File !== 'undefined' ? z.instanceof(File) : z.any();

export const listingMultiSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    price: z.string().min(1, 'Price is required'),
    category: z.string().min(1, 'Select a category'),
    brand: z.string().min(1, 'Brand is required'),
    size: z.coerce.number().optional().default(1),
    condition: z.string().min(1, 'Select condition'),
    lockerSize: z.string().min(1, 'Select locker size'),
    location: z.string().min(1, 'Select locker address name '),
    description: z.string().min(1, 'Description is required'),
    images: z.array(imageFileSchema).optional(),
    existingImages: z.array(z.string().url()).optional(),
  })
  .superRefine((data, ctx) => {
    const newCount = data.images?.length ?? 0;
    const existingCount = data.existingImages?.length ?? 0;

    if (newCount + existingCount < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one photo is required',
        path: ['images'],
      });
    }
  });

export type ListingMultiValues = z.infer<typeof listingMultiSchema>;
