import z from 'zod';

const imageFileSchema = typeof File !== 'undefined' ? z.instanceof(File) : z.any();

export const listingSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    price: z.string().min(1, 'Price is required'),
    category: z.string().min(1, 'Select a category'),
    brand: z.string().min(1, 'Brand is required'),
    size: z.string().min(1, 'Size is required'),
    condition: z.string().min(1, 'Select condition'),
    lockerSize: z.string().min(1, 'Select locker size'),
    location: z.string().min(1, 'Select location'),
    description: z.string().min(1, 'Description is required'),
    images: z.array(imageFileSchema).optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
  })
  .superRefine((data, ctx) => {
    const hasImages = Boolean(data.images?.length);
    const hasExistingImage = Boolean(data.imageUrl);

    if (!hasImages && !hasExistingImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one photo is required',
        path: ['images'],
      });
    }
  });

export type ListingValues = z.infer<typeof listingSchema>;
