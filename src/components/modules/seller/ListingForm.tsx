'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listingMultiSchema, type ListingMultiValues } from '@/lib/schema/product';
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetLockerAddressesQuery,
  useUpdateProductMutation,
} from '@/store/apis/productApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ImagePlus, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

const ALLOWED_EXT_HINT = 'JPG, PNG, WEBP, AVIF, GIF';

const toMB = (bytes: number) => bytes / (1024 * 1024);
const round1 = (n: number) => Math.round(n * 10) / 10;

const CONDITION_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like new' },
  { value: 'gently_used', label: 'Gently used' },
  { value: 'used', label: 'Used' },
  { value: 'well_used', label: 'Well used' },
  { value: 'refurbished', label: 'Refurbished' },
  { value: 'damaged', label: 'Damaged' },
];

const LOCKER_SIZES = [
  { value: 'SMALL', label: 'Small' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LARGE', label: 'Large' },
];

export default function ListingForm({ type, initialData, productId }: ListingFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Direct queries
  const categoriesState = useGetCategoriesQuery();
  const lockersState = useGetLockerAddressesQuery();

  const categoriesData = categoriesState.data?.data?.categories;
  const lockerAddressesData = lockersState.data?.data?.categories;

  const hasCategories = Boolean(categoriesData?.length);
  const hasLockers = Boolean(lockerAddressesData?.length);

  const isCategoriesLoading = categoriesState.isFetching || categoriesState.isLoading;
  const isLockersLoading = lockersState.isFetching || lockersState.isLoading;

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

  const defaultValues = useMemo(
    () => ({
      title: initialData?.title ?? '',
      price: initialData?.price ?? '',
      category: initialData?.category ?? '',
      brand: initialData?.brand ?? '',
      size: initialData?.size ? Number(initialData.size) : 1,
      condition: initialData?.condition ?? '',
      lockerSize: initialData?.lockerSize ?? '',
      location: initialData?.location ?? '',
      description: initialData?.description ?? '',
      images: [],
      existingImages: initialData?.existingImages ?? [],
    }),
    [initialData],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    setError,
  } = useForm<ListingMultiValues>({
    resolver: zodResolver(listingMultiSchema) as any,
    defaultValues,
  });

  // Controllers for shadcn Select
  const { field: categoryField } = useController({ name: 'category', control });
  const { field: conditionField } = useController({ name: 'condition', control });
  const { field: lockerSizeField } = useController({ name: 'lockerSize', control });
  const { field: locationField } = useController({ name: 'location', control });

  const categoryValue = categoryField.value || '';
  const locationValue = locationField.value || '';
  const categoryLabel = categoriesData?.find(
    (category: any) => category.id === categoryValue,
  )?.title;
  const locationLabel = lockerAddressesData?.find(
    (locker: any) => locker.id === locationValue,
  )?.title;
  const showCategoryFallback = Boolean(categoryValue && !categoryLabel);
  const showLocationFallback = Boolean(locationValue && !locationLabel);

  // Keep form existingImages synced with local state
  useEffect(() => {
    setValue('existingImages', existingUrls, { shouldValidate: true });
  }, [existingUrls, setValue]);

  // Sync edit data into the form so selects stay filled
  useEffect(() => {
    reset(defaultValues);
    setExistingUrls(defaultValues.existingImages ?? []);
    setSelectedFiles([]);
    setPreviewUrls((prev) => {
      prev.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      return [];
    });
  }, [defaultValues, reset]);

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
    fileInputRef.current?.click();
  };

  const openPickerSafe = () => {
    if (isSaving) return toast.message('Please wait, saving is in progress.');
    if (isMaxed) return toast.error(`You can upload maximum ${MAX_PHOTOS} photos.`);
    openPicker();
  };

  // Validation returns a report (NO toast here)
  const validateIncomingFiles = (files: File[]) => {
    const valid: File[] = [];
    const rejected = {
      invalidType: [] as File[],
      tooLarge: [] as File[],
    };

    for (const f of files) {
      if (!ACCEPTED_IMAGE_MIME.has(f.type)) {
        rejected.invalidType.push(f);
        continue;
      }
      const sizeMB = toMB(f.size);
      if (sizeMB > MAX_FILE_MB) {
        rejected.tooLarge.push(f);
        continue;
      }
      valid.push(f);
    }

    return { valid, rejected };
  };

  // Single source of truth for upload-related toasts
  const addFiles = (incomingFiles: File[]) => {
    if (isSaving) return toast.message('Please wait, saving is in progress.');
    if (!incomingFiles.length) return;

    if (remainingSlots <= 0) return toast.error(`You can upload maximum ${MAX_PHOTOS} photos.`);

    const { valid, rejected } = validateIncomingFiles(incomingFiles);

    // Unsupported types (1 toast)
    if (rejected.invalidType.length) {
      const names = rejected.invalidType
        .slice(0, 2)
        .map((f) => f.name)
        .join(', ');
      const extra =
        rejected.invalidType.length > 2 ? ` (+${rejected.invalidType.length - 2} more)` : '';
      toast.error(`Unsupported file type: ${names}${extra}. `, {
        description: `Allowed types: ${ALLOWED_EXT_HINT}.`,
      });
    }

    // Too large (1 toast)
    if (rejected.tooLarge.length) {
      const first = rejected.tooLarge[0];
      const firstMB = round1(toMB(first.size));
      const extra = rejected.tooLarge.length > 1 ? ` (+${rejected.tooLarge.length - 1} more)` : '';
      toast.error(`File too large: ${first.name} (${firstMB}MB)${extra}.`, {
        description: `Max file size is ${MAX_FILE_MB}MB.`,
      });
    }

    // If nothing valid, don't show extra "no valid" toast (avoid duplicates)
    if (!valid.length) return;

    // de-dupe against current selectedFiles
    const key = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;
    const existingKeys = new Set(selectedFiles.map(key));

    let dupes = 0;
    const deduped = valid.filter((f) => {
      const isDup = existingKeys.has(key(f));
      if (isDup) dupes += 1;
      return !isDup;
    });

    if (dupes > 0) {
      toast.message(
        dupes === 1 ? 'This file is already selected.' : `${dupes} files were already selected.`,
      );
    }

    if (!deduped.length) return;

    const accepted = deduped.slice(0, remainingSlots);
    const skippedBecauseMax = Math.max(0, deduped.length - accepted.length);

    const nextFiles = [...selectedFiles, ...accepted];
    setSelectedFiles(nextFiles);
    setValue('images', nextFiles, { shouldValidate: true });

    const newPreviews = accepted.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    if (skippedBecauseMax > 0) {
      toast.message(
        `${skippedBecauseMax} file${skippedBecauseMax > 1 ? 's were' : ' was'} not added due to the maximum limit of ${MAX_PHOTOS} photos.`,
      );
    }
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // allow re-selecting same file
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

  // Toast only here (UI onClick no toast)
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

  // Toast only here (UI onClick no toast)
  const removeExistingUrl = (index: number) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Toast only here
  const clearAllNew = (options?: { toast?: boolean }) => {
    const showToast = options?.toast !== false;
    if (selectedFiles.length === 0) {
      if (showToast) toast.message('No new photos to clear.');
      return;
    }

    const count = selectedFiles.length;

    setSelectedFiles([]);
    setValue('images', [], { shouldValidate: true });

    setPreviewUrls((prev) => {
      prev.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      return [];
    });

    if (showToast) toast.success(`Cleared ${count} new photo(s).`);
  };

  const handleReset = () => {
    reset(defaultValues);
    clearAllNew({ toast: false });
    setExistingUrls(defaultValues.existingImages ?? []);
    router.push('/seller/my-listings');
  };

  const onFormSubmit = async (data: ListingMultiValues) => {
    try {
      if (isSaving) return;

      const payload = {
        title: data.title,
        price: Number(data.price),
        brandName: data.brand,
        size: data.size ?? 1,
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
        // toast.success('Listing published successfully.');
        router.push('/seller/my-listings');
        return;
      }

      if (type === 'edit' && productId) {
        await updateProduct({ productId, body: formData }).unwrap();
        toast.success('Changes saved successfully.');
        router.push('/seller/my-listings');
        return;
      }
    } catch (error: any) {
      const serverMessage =
        error?.data?.message || error?.error?.data?.message || error?.message || null;

      const msg = serverMessage || 'Something went wrong while saving. Please try again.';
      setError('root', { message: msg });
      toast.error(msg);
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
            <SelectTrigger className="h-11! w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>

            <SelectContent position="popper">
              {isCategoriesLoading && (
                <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-slate-500">
                  <Loader2 size={18} className="animate-spin" />
                  Loading categories...
                </div>
              )}

              {showCategoryFallback && (
                <SelectItem value={categoryValue}>Current selection</SelectItem>
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
            Size
          </label>
          <input
            id="size"
            type="number"
            placeholder="Size (optional, default: 1)"
            disabled={isSaving}
            {...register('size', { valueAsNumber: true })}
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
              {CONDITION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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
              {LOCKER_SIZES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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
            Locker Address Name<span className="text-red-500">*</span>
          </label>

          <Select
            onValueChange={locationField.onChange}
            value={locationField.value || ''}
            disabled={isSaving}
          >
            <SelectTrigger className="h-11! w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>

            <SelectContent position="popper">
              {isLockersLoading && (
                <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-slate-500">
                  <Loader2 size={18} className="animate-spin" />
                  Loading lockers...
                </div>
              )}

              {showLocationFallback && (
                <SelectItem value={locationValue}>Current selection</SelectItem>
              )}

              {!isLockersLoading &&
                lockerAddressesData?.map((locker: any) => (
                  <SelectItem key={locker.id} value={locker.id}>
                    {locker.title}
                  </SelectItem>
                ))}

              {!isLockersLoading && !hasLockers && (
                <div className="px-3 py-3 text-center text-sm text-slate-500">No lockers found</div>
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

      {/* PHOTOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-slate-500">
            Photos <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {totalCount}/{MAX_PHOTOS}
            </span>
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

        <div
          onDrop={(e) => {
            if (isSaving || isMaxed) {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
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

            {/* Uploader card LAST */}
            {!isMaxed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPickerSafe();
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
                  {remainingSlots} left • Max {MAX_FILE_MB}MB <br />
                  {ALLOWED_EXT_HINT}
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
