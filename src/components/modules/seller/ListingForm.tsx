'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
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

  const onFormSubmit = async (data: ListingValues) => {
    try {
      if (type === 'create') {
        console.log('Creating:', data);
        alert('Published Successfully!');
      } else {
        console.log('Updating:', data);
        alert('Updated Successfully!');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="border-brand-100 space-y-6 rounded-xl border bg-white p-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
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

        {/* Photo Upload Area */}
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium text-slate-500">Photos</FormLabel>
          <div className="group border-brand-100 hover:bg-brand-50 flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all">
            <Upload className="group-hover:text-primary mb-2 size-10 text-gray-400" />
            <p className="text-lg font-semibold text-slate-500">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
          </div>
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
