'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateProductMutation,
  useLazyGetCategoriesQuery,
  useLazyGetLockerAddressesQuery,
  useUpdateProductMutation,
} from '@/store/apis/productApi';
import { listingMultiSchema, type ListingMultiValues } from '@/lib/schema/product';

interface ListingFormProps {
  type: 'create' | 'edit';
  productId?: string;
  initialData?: Partial<ListingMultiValues>;
}

const MAX_PHOTOS = 4;
const MAX_FILE_MB = 4;
const ACCEPTED_IMAGE_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

export default function ListingForm({ type, initialData, productId }: ListingFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lazy queries
  const [triggerCategories, categoriesState] = useLazyGetCategoriesQuery();
  const [triggerLockers, lockersState] = useLazyGetLockerAddressesQuery();

  const categoriesData = categoriesState.data?.data?.categories;
  const lockerAddressesData = lockersState.data?.data?.categories;

  const hasCategories = Boolean(categoriesData?.length);
  const hasLockers = Boolean(lockerAddressesData?.length);

  const isCategoriesLoading = categoriesState.isFetching || categoriesState.isLoading;
  const isLockersLoading = lockersState.isFetching || lockersState.isLoading;

  const ensureCategories = () => {
    if (hasCategories || isCategoriesLoading) return;
    triggerCategories(undefined, true);
  };

  const ensureLockers = () => {
    if (hasLockers || isLockersLoading) return;
    triggerLockers(undefined, true);
  };

  // Mutations
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSaving = isCreating || isUpdating;

  // New files + previews
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Existing URLs (edit mode)
  const [existingUrls, setExistingUrls] = useState<string[]>(initialData?.existingImages ?? []);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    setError,
  } = useForm<ListingMultiValues>({
    resolver: zodResolver(listingMultiSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      price: initialData?.price ?? '',
      category: initialData?.category ?? '',
      brand: initialData?.brand ?? '',
      size: initialData?.size ?? '',
      condition: initialData?.condition ?? '',
      lockerSize: initialData?.lockerSize ?? '',
      location: initialData?.location ?? '',
      description: initialData?.description ?? '',
      images: [],
      existingImages: initialData?.existingImages ?? [],
    },
  });

  // Controllers for shadcn Select
  const { field: categoryField } = useController({ name: 'category', control });
  const { field: conditionField } = useController({ name: 'condition', control });
  const { field: lockerSizeField } = useController({ name: 'lockerSize', control });
  const { field: locationField } = useController({ name: 'location', control });

  // Keep form existingImages synced with local state
  useEffect(() => {
    setValue('existingImages', existingUrls, { shouldValidate: true });
  }, [existingUrls, setValue]);

  // Cleanup blob urls
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const totalCount = existingUrls.length + selectedFiles.length;
  const remainingSlots = Math.max(0, MAX_PHOTOS - totalCount);
  const isMaxed = remainingSlots === 0;

  const openPicker = () => {
    if (isSaving || isMaxed) return;
    fileInputRef.current?.click();
  };

  const validateIncomingFiles = (files: File[]) => {
    const valid: File[] = [];

    for (const f of files) {
      if (!ACCEPTED_IMAGE_MIME.has(f.type)) {
        toast.error(`Unsupported file type: ${f.name}`);
        continue;
      }
      const sizeMB = f.size / (1024 * 1024);
      if (sizeMB > MAX_FILE_MB) {
        toast.error(`File too large (max ${MAX_FILE_MB}MB): ${f.name}`);
        continue;
      }
      valid.push(f);
    }

    return valid;
  };

  const addFiles = (incomingFiles: File[]) => {
    if (isSaving) return;

    const incoming = validateIncomingFiles(incomingFiles);
    if (!incoming.length) return;

    // de-dupe against current selectedFiles
    const key = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;
    const existingKeys = new Set(selectedFiles.map(key));
    const filtered = incoming.filter((f) => !existingKeys.has(key(f)));

    const accepted = filtered.slice(0, remainingSlots);

    if (!accepted.length) {
      if (remainingSlots === 0) toast.error(`You can upload max ${MAX_PHOTOS} photos`);
      return;
    }

    const nextFiles = [...selectedFiles, ...accepted];
    setSelectedFiles(nextFiles);
    setValue('images', nextFiles, { shouldValidate: true });

    const newPreviews = accepted.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    const skipped = filtered.length - accepted.length;
    if (skipped > 0) toast.message(`Skipped ${skipped} file(s) (max ${MAX_PHOTOS})`);
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    e.target.value = '';
    addFiles(files);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    addFiles(files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removeNewFile = (index: number) => {
    setSelectedFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setValue('images', next, { shouldValidate: true });
      return next;
    });

    setPreviewUrls((prev) => {
      const url = prev[index];
      if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingUrl = (index: number) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllNew = () => {
    setSelectedFiles([]);
    setValue('images', [], { shouldValidate: true });

    setPreviewUrls((prev) => {
      prev.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      return [];
    });
  };

  const handleReset = () => {
    reset();
    clearAllNew();
    setExistingUrls(initialData?.existingImages ?? []);
  };

  const onFormSubmit = async (data: ListingMultiValues) => {
    try {
      if (isSaving) return;

      const payload = {
        title: data.title,
        price: Number(data.price),
        brandName: data.brand,
        size: Number(data.size),
        condition: data.condition,
        description: data.description,
        lockerSize: data.lockerSize ? data.lockerSize.toUpperCase() : data.lockerSize,
        categoryId: data.category,
        locationId: data.location,
        isPublic: true,
        existingImages: existingUrls,
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      selectedFiles.forEach((file) => formData.append('images', file));

      if (type === 'create') {
        await createProduct(formData).unwrap();
        router.push('/seller/my-listings');
        return;
      }

      if (type === 'edit' && productId) {
        await updateProduct({ productId, body: formData }).unwrap();
        router.push('/seller/my-listings');
        return;
      }
    } catch (error) {
      setError('root', { message: 'Something went wrong. Please try again.' });
    }
  };

  const existingTiles = useMemo(
    () =>
      existingUrls.map((url, idx) => ({
        url,
        idx,
      })),
    [existingUrls],
  );

  const newTiles = useMemo(
    () =>
      previewUrls.map((url, idx) => ({
        url,
        idx,
      })),
    [previewUrls],
  );

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="border-brand-100 space-y-6 rounded-xl border bg-white p-8"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
        <div className="md:col-span-3">
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-500">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            placeholder="Item name"
            disabled={isSaving}
            {...register('title')}
            className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.title && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={14} />
              {errors.title.message}
            </div>
          )}
        </div>

        <div className="md:col-span-3">
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-500">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            placeholder="0.00"
            disabled={isSaving}
            {...register('price')}
            className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.price && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={14} />
              {errors.price.message}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-500">
            Category <span className="text-red-500">*</span>
          </label>

          <Select
            onValueChange={categoryField.onChange}
            value={categoryField.value || ''}
            disabled={isSaving}
          >
            <SelectTrigger className="h-11! w-full" onPointerDown={ensureCategories}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>

            <SelectContent position="popper">
              {isCategoriesLoading && (
                <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-slate-500">
                  <Loader2 size={18} className="animate-spin" />
                  Loading categories...
                </div>
              )}

              {!isCategoriesLoading &&
                categoriesData?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}

              {!isCategoriesLoading && !hasCategories && (
                <div className="px-3 py-3 text-center text-sm text-slate-500">
                  No categories found
                </div>
              )}
            </SelectContent>
          </Select>

          {errors.category && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={14} />
              {errors.category.message}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="brand" className="mb-1 block text-sm font-medium text-slate-500">
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            id="brand"
            placeholder="Brand name"
            disabled={isSaving}
            {...register('brand')}
            className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.brand && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={14} />
              {errors.brand.message}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="size" className="mb-1 block text-sm font-medium text-slate-500">
            Size <span className="text-red-500">*</span>
          </label>
          <input
            id="size"
            type="number"
            placeholder="Size"
            disabled={isSaving}
            {...register('size')}
            className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.size && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={14} />
              {errors.size.message}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="condition" className="mb-1 block text-sm font-medium text-slate-500">
            Condition <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={conditionField.onChange}
            value={conditionField.value || ''}
            disabled={isSaving}
          >
            <SelectTrigger className="h-11! w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
          {errors.condition && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={14} />
              {errors.condition.message}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="lockerSize" className="mb-1 block text-sm font-medium text-slate-500">
            Locker size <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={lockerSizeField.onChange}
            value={lockerSizeField.value || ''}
            disabled={isSaving}
          >
            <SelectTrigger className="h-11! w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="SMALL">Small</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LARGE">Large</SelectItem>
            </SelectContent>
          </Select>
          {errors.lockerSize && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={14} />
              {errors.lockerSize.message}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-500">
            Location <span className="text-red-500">*</span>
          </label>

          <Select
            onValueChange={locationField.onChange}
            value={locationField.value || ''}
            disabled={isSaving}
          >
            <SelectTrigger className="h-11! w-full" onPointerDown={ensureLockers}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>

            <SelectContent position="popper">
              {isLockersLoading && (
                <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-slate-500">
                  <Loader2 size={18} className="animate-spin" />
                  Loading locations...
                </div>
              )}

              {!isLockersLoading &&
                lockerAddressesData?.map((locker: any) => (
                  <SelectItem key={locker.id} value={locker.id}>
                    {locker.title}
                  </SelectItem>
                ))}

              {!isLockersLoading && !hasLockers && (
                <div className="px-3 py-3 text-center text-sm text-slate-500">
                  No locations found
                </div>
              )}
            </SelectContent>
          </Select>

          {errors.location && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={14} />
              {errors.location.message}
            </div>
          )}
        </div>

        <div className="col-span-full">
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-500">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            placeholder="Describe your item..."
            disabled={isSaving}
            {...register('description')}
            className="border-brand-100 focus:bg-brand-50/50 min-h-30 w-full resize-none rounded-md border p-3 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.description && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={14} />
              {errors.description.message}
            </div>
          )}
        </div>
      </div>

      {/* PHOTOS (no outer border/effects; only uploader card reacts) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-slate-500">
            Photos <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {totalCount}/{MAX_PHOTOS}
            </span>

            {selectedFiles.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={clearAllNew}
                disabled={isSaving}
                className="hover:text-destructive hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-2" />
                Clear new
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                if (isSaving) {
                  toast.message('Please wait — saving in progress');
                  return;
                }
                if (isMaxed) {
                  toast.error(`You can upload max ${MAX_PHOTOS} photos`);
                  return;
                }
                openPicker();
              }}
              disabled={isSaving || isMaxed}
            >
              <ImagePlus size={16} className="mr-2" />
              Add photos
            </Button>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          multiple
          onChange={handleAddImages}
          disabled={isSaving}
        />

        {/* Transparent drop handler (NO border / NO hover / NO ring on the whole area) */}
        <div
          onDrop={(e) => {
            if (isSaving) return;
            if (isMaxed) {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
              toast.error(`You can upload max ${MAX_PHOTOS} photos`);
              return;
            }
            onDrop(e);
          }}
          onDragOver={(e) => {
            if (isSaving || isMaxed) return;
            onDragOver(e);
          }}
          onDragLeave={(e) => {
            if (isSaving || isMaxed) return;
            onDragLeave(e);
          }}
          className={isSaving ? 'opacity-60' : ''}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {/* Existing first */}
            {existingTiles.map((t) => (
              <div
                key={`existing-${t.url}-${t.idx}`}
                className="group relative aspect-square overflow-hidden rounded-xl border bg-slate-50"
              >
                <Image src={t.url} alt="Existing" fill className="object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExistingUrl(t.idx);
                    toast.message('Removed 1 existing photo');
                  }}
                  disabled={isSaving}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 disabled:opacity-50"
                  title="Remove"
                >
                  <X size={16} />
                </button>
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                  Existing
                </span>
              </div>
            ))}

            {/* New next */}
            {newTiles.map((t) => (
              <div
                key={`new-${t.url}-${t.idx}`}
                className="group relative aspect-square overflow-hidden rounded-xl border bg-slate-50"
              >
                <Image src={t.url} alt="New" fill className="object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNewFile(t.idx);
                    toast.message('Removed 1 new photo');
                  }}
                  disabled={isSaving}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 disabled:opacity-50"
                  title="Remove"
                >
                  <X size={16} />
                </button>
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                  New
                </span>
              </div>
            ))}

            {/* Uploader card LAST (like before). Hidden when maxed. */}
            {!isMaxed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSaving) {
                    toast.message('Please wait — saving in progress');
                    return;
                  }
                  openPicker();
                }}
                disabled={isSaving}
                className={[
                  'border-brand-100 group flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white transition-all',
                  isDragging ? 'bg-brand-50/60 ring-2 ring-slate-300' : 'hover:bg-brand-50/30',
                  isSaving ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                ].join(' ')}
              >
                <div className="bg-brand-50 group-hover:bg-brand-100 rounded-full p-4 transition-all group-hover:scale-105">
                  <ImagePlus className="text-primary size-7" />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  {isSaving
                    ? 'Saving...'
                    : isDragging
                      ? 'Drop to upload'
                      : totalCount === 0
                        ? 'Click or drag & drop'
                        : 'Add more'}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {remainingSlots} left • Max {MAX_FILE_MB}MB
                </p>
              </button>
            )}
          </div>
        </div>

        {errors.images && (
          <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle size={14} />
            {errors.images.message}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button
          type="button"
          variant="ghost"
          className="h-11"
          onClick={handleReset}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button type="submit" className="h-11 flex-1" disabled={isSaving}>
          {isSaving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </span>
          ) : type === 'create' ? (
            'Publish'
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
