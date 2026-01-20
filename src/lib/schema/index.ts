import z from 'zod';

export const listingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.string().min(1, 'Price is required'),
  category: z.string().min(1, 'Select a category'),
  brand: z.string().min(1, 'Brand is required'),
  size: z.string().min(1, 'Size is required'),
  condition: z.string().min(1, 'Select condition'),
  lockerSize: z.string().min(1, 'Select locker size'),
  location: z.string().min(1, 'Select location'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z
    .string()
    .min(1, 'Image is required')
    .url('Invalid image URL')
    .refine(
      (url) => {
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)$/i;
        return imageExtensions.test(url);
      },
      { message: 'Only image files are allowed (jpg, jpeg, png, gif, webp, bmp, svg, ico)' },
    ),
});

export type ListingValues = z.infer<typeof listingSchema>;
