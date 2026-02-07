'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listingSchema } from '@/lib/schema';
import type { ListingValues } from '@/lib/schema';
import { useCreateProductMutation, useUpdateProductMutation } from '@/store/apis/productApi';

interface ListingFormProps {
  type: 'create' | 'edit';
  initialData?: ListingValues;
  productId?: string;
}

export default function ListingForm({ type, initialData, productId }: ListingFormProps) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialData?.imageUrl ? [initialData.imageUrl] : [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    setError,
  } = useForm<ListingValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: initialData || {
      title: '',
      price: '',
      category: '',
      brand: '',
      size: '',
      condition: '',
      lockerSize: '',
      location: '',
      description: '',
      images: [],
      imageUrl: undefined,
    },
  });

  const { field: categoryField } = useController({
    name: 'category',
    control,
    defaultValue: initialData?.category || '',
  });
  const { field: conditionField } = useController({
    name: 'condition',
    control,
    defaultValue: initialData?.condition || '',
  });
  const { field: lockerSizeField } = useController({
    name: 'lockerSize',
    control,
    defaultValue: initialData?.lockerSize || '',
  });
  const { field: locationField } = useController({
    name: 'location',
    control,
    defaultValue: initialData?.location || '',
  });

  useEffect(() => {
    if (!initialData?.imageUrl) {
      return;
    }

    setPreviewUrls([initialData.imageUrl]);
    setValue('imageUrl', initialData.imageUrl, { shouldValidate: true });
  }, [initialData?.imageUrl, setValue]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      return;
    }

    setSelectedFiles(files);
    setValue('images', files, { shouldValidate: true });
    setValue('imageUrl', undefined, { shouldValidate: true });
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const onFormSubmit = async (data: ListingValues) => {
    try {
      if (isSaving) {
        return;
      }

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
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      selectedFiles.forEach((file) => formData.append('images', file));

      if (type === 'create') {
        await createProduct(formData).unwrap();
        router.push('/seller/my-listings');
      } else if (productId) {
        await updateProduct({ productId, body: formData }).unwrap();
        router.push('/seller/my-listings');
      }
    } catch (error) {
      setError('root', { message: 'Something went wrong. Please try again.' });
    }
  };

  const handleReset = () => {
    reset();
    setSelectedFiles([]);
    if (initialData?.imageUrl) {
      setPreviewUrls([initialData.imageUrl]);
    } else {
      setPreviewUrls([]);
    }
  };

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
          <div className="relative">
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
        </div>

        <div className="md:col-span-3">
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-500">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
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
        </div>

        <div className="md:col-span-2">
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-500">
            Category <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={categoryField.onChange} value={categoryField.value || ''}>
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
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
          <div className="relative">
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
        </div>

        <div className="md:col-span-2">
          <label htmlFor="size" className="mb-1 block text-sm font-medium text-slate-500">
            Size <span className="text-red-500">*</span>
          </label>
          <div className="relative">
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
        </div>

        <div className="md:col-span-2">
          <label htmlFor="condition" className="mb-1 block text-sm font-medium text-slate-500">
            Condition <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={conditionField.onChange} value={conditionField.value || ''}>
            <SelectTrigger className="h-11 w-full">
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
          <Select onValueChange={lockerSizeField.onChange} value={lockerSizeField.value || ''}>
            <SelectTrigger className="h-11 w-full">
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
          <Select onValueChange={locationField.onChange} value={locationField.value || ''}>
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="dhaka">Dhaka</SelectItem>
              <SelectItem value="ny">New York</SelectItem>
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
          <div className="relative">
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
      </div>

      {/* --- Image Upload & Preview Section --- */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-500">Photos</label>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          multiple
          onChange={handleImageChange}
        />

        {previewUrls.length ? (
          /* --- Image Preview State --- */
          <div className="group border-brand-100 bg-brand-50 relative h-72 w-full overflow-hidden rounded-xl border-2 transition-all">
            {/* Background container for the image to maintain shape without distortion */}
            <div className="relative flex h-full w-full items-center justify-center p-2">
              <Image
                src={previewUrls[0]}
                alt="Preview"
                fill
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Action Overlays */}
            <div className="bg-primary/20 absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Replace Photo
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setPreviewUrls([]);
                    setSelectedFiles([]);
                    setValue('images', [], { shouldValidate: true });
                  }}
                  className="rounded-full"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* --- Empty Upload State --- */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group border-brand-100 hover:bg-brand-50/50 flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white p-14 transition-all duration-300"
          >
            <div className="bg-brand-50 group-hover:bg-brand-100 rounded-full p-5 transition-all duration-300 group-hover:scale-110">
              <Upload className="text-primary size-9" />
            </div>

            <div className="mt-5 text-center">
              <p className="text-primary text-lg font-bold">Click to upload or drag and drop</p>
              <p className="mt-1 text-sm font-medium text-slate-500">PNG, JPG or WebP (Max 10MB)</p>
            </div>
          </div>
        )}

        {previewUrls.length > 1 && (
          <div className="flex flex-wrap gap-3">
            {previewUrls.slice(1).map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="border-brand-100 bg-brand-50 relative h-16 w-16 overflow-hidden rounded-lg border"
              >
                <Image src={url} alt="Preview" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {errors.images?.message && <p className="text-sm text-red-500">{errors.images?.message}</p>}
      </div>

      {/* Buttons */}
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
          {isSaving ? 'Saving...' : type === 'create' ? 'Publish' : 'Save Changes'}
        </Button>
      </div>
      {errors.root?.message && <p className="text-sm text-red-500">{errors.root?.message}</p>}
    </form>
  );
}
