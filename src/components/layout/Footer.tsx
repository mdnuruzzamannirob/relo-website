import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import Logo from '../shared/Logo';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="border-brand-100 bg-brand-50 border-t">
      {/* Top Section */}
      <div className="app-container grid grid-cols-1 gap-8 py-14 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-3">
          <Logo />

          <p className="max-w-xs text-sm leading-relaxed text-slate-500">
            Buy and sell quality pre-owned items easily and securely on one trusted marketplace.
          </p>
        </div>

        {/* Help */}
        <div>
          <h3 className="mb-4 font-semibold text-slate-800">Help</h3>
          <ul className="space-y-3 text-sm text-slate-500">
            <li className="w-fit cursor-pointer font-medium transition hover:text-slate-800">
              Help Center
            </li>
            <li className="w-fit cursor-pointer font-medium transition hover:text-slate-800">
              Selling guide
            </li>
            <li className="w-fit cursor-pointer font-medium transition hover:text-slate-800">
              Buying guide
            </li>
            <li className="w-fit cursor-pointer font-medium transition hover:text-slate-800">
              How it works
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="mb-4 font-semibold text-slate-800">Legal</h3>
          <ul className="space-y-3 text-sm text-slate-500">
            <li className="w-fit cursor-pointer font-medium transition hover:text-slate-800">
              About Us
            </li>
            <li className="w-fit cursor-pointer font-medium transition hover:text-slate-800">
              Privacy Policy
            </li>
            <li className="w-fit cursor-pointer font-medium transition hover:text-slate-800">
              Terms & Condition
            </li>
            <li className="w-fit cursor-pointer font-medium transition hover:text-slate-800">
              Trust & safety
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-4 font-semibold text-slate-800">Connect With Us</h3>

          <p className="mb-5 max-w-xs text-sm text-slate-500">
            Follow our journey through the broken world on social media.
          </p>

          <div className="flex gap-3">
            <SocialIcon>
              <Facebook size={16} />
            </SocialIcon>
            <SocialIcon>
              <Twitter size={16} />
            </SocialIcon>
            <SocialIcon>
              <Instagram size={16} />
            </SocialIcon>
            <SocialIcon>
              <Mail size={16} />
            </SocialIcon>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-brand-100 border-t" />

      {/* Bottom */}
      <div className="app-container py-4 text-slate-500">
        <small>© 2026 RELO. All rights reserved.</small>
      </div>
    </footer>
  );
}

/* Social Button */
function SocialIcon({ children }: { children: React.ReactNode }) {
  return <Button className="size-8 min-w-8 rounded-full">{children}</Button>;
}
