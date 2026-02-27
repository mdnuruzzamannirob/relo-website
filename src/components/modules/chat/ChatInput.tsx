'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, ImageIcon, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ChatInputProps {
  onSend: (message?: string, images?: string[]) => void;
  isSending: boolean;
  disabled?: boolean;
}

export default function ChatInput({ onSend, isSending, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed && imagePreview.length === 0) return;
    if (isSending || disabled) return;

    onSend(trimmed || undefined, imagePreview.length > 0 ? imagePreview : undefined);
    setMessage('');
    setImagePreview([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setImagePreview((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-brand-100 border-t bg-white p-3">
      {/* Image Previews */}
      {imagePreview.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {imagePreview.map((img, idx) => (
            <div key={idx} className="group relative">
              <Image
                src={img}
                alt={`preview-${idx}`}
                height={64}
                width={64}
                className="h-16 w-16 rounded-lg border object-cover"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="border-brand-100 flex items-center gap-2 rounded-lg border px-3 py-2">
        {/* Image Upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSending}
          className="shrink-0 text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-50"
        >
          <ImageIcon className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Text Input */}
        <input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled || isSending}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 disabled:opacity-50"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || isSending || (!message.trim() && imagePreview.length === 0)}
          className="bg-primary shrink-0 rounded-lg p-2 text-white transition-opacity disabled:opacity-50"
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
