'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';

export default function TopBar() {
  const { t, lang, toggle } = useLang();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-bg/80 border-b border-[rgba(245,158,11,0.12)]">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-saffron grid place-items-center text-bg text-base font-bold">
            ॐ
          </span>
          <span className="font-serif text-lg hidden sm:inline">DRISHTI</span>
        </Link>

        {/* Center nav */}
        <div className="flex items-center gap-1 text-sm overflow-x-auto no-scrollbar">
          <NavLink href="/sevayein" label={t('nav.services')} />
          <NavLink href="/match" label={t('nav.match')} />
          <NavLink href="/why-drishti" label={t('nav.whyDrishti')} />
        </div>

        {/* Right: lang + auth */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language toggle */}
          <button
            onClick={toggle}
            className="flex items-center rounded-full border border-strong overflow-hidden text-xs font-mono"
            title="Switch language"
          >
            <span className={`px-2 py-1 ${lang === 'en' ? 'bg-gold text-bg' : 'text-text-muted'}`}>EN</span>
            <span className={`px-2 py-1 ${lang === 'hi' ? 'bg-gold text-bg' : 'text-text-muted'}`}>हिं</span>
          </button>

          {/* Auth */}
          {user ? (
            <button onClick={logout} className="text-xs text-text-muted hover:text-gold px-2 py-1 hidden sm:inline">
              {t('nav.logout')}
            </button>
          ) : (
            <Link href="/login" className="text-xs bg-gold/15 border border-gold/30 text-gold rounded-full px-3 py-1.5 hover:bg-gold/25">
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-text-muted hover:text-gold hover:bg-gold/5 transition-colors whitespace-nowrap"
    >
      {label}
    </Link>
  );
}
