'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listingSchema, ListingValues } from '@/lib/schema';

interface ListingFormProps {
  type: 'create' | 'edit';
  initialData?: ListingValues;
}

export default function ListingForm({ type, initialData }: ListingFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ListingValues>({
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
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = async (data: ListingValues) => {
    try {
      const formData = { ...data, imageFile: selectedFile };

      if (type === 'create') {
        alert('Published Successfully!');
      } else {
        alert('Updated Successfully!');
      }
    } catch (error) {}
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="border-brand-100 space-y-6 rounded-xl border bg-white p-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
          {/* Title & Price */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel className="text-sm font-medium text-slate-500">Title</FormLabel>
                <FormControl>
                  <input
                    placeholder="Item name"
                    className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel className="text-sm font-medium text-slate-500">Price</FormLabel>
                <FormControl>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-slate-500">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11! w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-slate-500">Brand</FormLabel>
                <FormControl>
                  <input
                    placeholder="Brand name"
                    className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-slate-500">Size</FormLabel>
                <FormControl>
                  <input
                    placeholder="Size"
                    className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-slate-500">Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11! w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lockerSize"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-slate-500">Locker size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11! w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-slate-500">Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11! w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    <SelectItem value="dhaka">Dhaka</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel className="text-sm font-medium text-slate-500">Description</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Describe your item..."
                    className="border-brand-100 focus:bg-brand-50/50 h-11 min-h-30 w-full resize-none rounded-md border p-3 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* --- Image Upload & Preview Section --- */}
        <div className="space-y-3">
          <FormLabel className="text-sm font-medium text-slate-500">Photos</FormLabel>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {previewUrl ? (
            /* --- Image Preview State --- */
            <div className="group border-brand-100 bg-brand-50 relative h-72 w-full overflow-hidden rounded-xl border-2 transition-all">
              {/* Background container for the image to maintain shape without distortion */}
              <div className="relative flex h-full w-full items-center justify-center p-2">
                <Image
                  src={previewUrl}
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
                      setPreviewUrl(null);
                      setSelectedFile(null);
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
                <p className="mt-1 text-sm font-medium text-slate-500">
                  PNG, JPG or WebP (Max 10MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <Button type="button" variant="ghost" className="h-11" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit" className="h-11 flex-1">
            {type === 'create' ? 'Publish' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
