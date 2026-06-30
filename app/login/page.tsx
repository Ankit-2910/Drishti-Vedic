'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/i18n';

export default function LoginPage() {
  const { user, sendMagicLink, demoLogin, isConfigured, logout } = useAuth();
  const { t, lang } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'sent' | 'error' | 'demo'; msg: string; canDemo?: boolean }>({ type: 'idle', msg: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await sendMagicLink(email);
    setLoading(false);
    if (res.demo) {
      setStatus({ type: 'demo', msg: res.message });
    } else if (res.ok) {
      setStatus({ type: 'sent', msg: res.message });
    } else {
      setStatus({ type: 'error', msg: res.message, canDemo: res.canDemo });
    }
  }

  // Already logged in
  if (user) {
    return (
      <main className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald/20 border-2 border-emerald grid place-items-center text-3xl mx-auto mb-6">
          ✓
        </div>
        <h1 className="font-serif text-3xl mb-2">{t('login.welcome')}</h1>
        <p className="text-text-muted mb-2">{user.email}</p>
        {user.isDemo && (
          <p className="text-gold text-xs font-mono mb-6">DEMO SESSION</p>
        )}
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => router.push('/sevayein')} className="btn-primary">
            {lang === 'hi' ? 'सेवाओं पर जाएँ' : 'Go to Services'} →
          </button>
          <button onClick={logout} className="btn-ghost">{t('nav.logout')}</button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-saffron grid place-items-center text-bg text-2xl font-bold mx-auto mb-5">
          ॐ
        </div>
        <h1 className="font-serif text-3xl mb-2">{t('login.title')}</h1>
        <p className="text-text-muted text-sm">{t('login.sub')}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-bg-elev border border-strong rounded-2xl p-6">
        <label className="block text-sm text-text-muted mb-2">{t('login.email')}</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input mb-4"
        />
        <button type="submit" disabled={loading || !email} className="btn-primary w-full justify-center disabled:opacity-50">
          {loading ? t('common.loading') : t('login.sendLink')}
        </button>

        {status.type === 'sent' && (
          <div className="mt-4 bg-emerald/10 border border-emerald/30 rounded-lg p-3 text-sm text-emerald">
            ✓ {t('login.checkEmail')}
          </div>
        )}
        {status.type === 'error' && (
          <div className="mt-4 space-y-3">
            <div className="bg-crimson/10 border border-crimson/30 rounded-lg p-3 text-sm">
              <div className="font-medium mb-1">{lang === 'hi' ? 'ईमेल लॉगिन अभी उपलब्ध नहीं' : 'Email login not available yet'}</div>
              <div className="text-text-muted text-xs">{status.msg}</div>
            </div>
            {status.canDemo && (
              <button
                type="button"
                onClick={() => { demoLogin(email); }}
                className="btn-primary w-full justify-center"
              >
                {lang === 'hi' ? 'अभी डेमो लॉगिन से आगे बढ़ें' : 'Continue with Demo Login'} →
              </button>
            )}
          </div>
        )}
        {status.type === 'demo' && (
          <div className="mt-4 space-y-3">
            <div className="bg-gold/10 border border-gold/30 rounded-lg p-3 text-sm text-text-muted">
              {status.msg}
            </div>
            <button
              type="button"
              onClick={() => { demoLogin(email); }}
              className="btn-ghost w-full justify-center"
            >
              {lang === 'hi' ? 'डेमो लॉगिन (तुरंत)' : 'Demo Login (instant)'} →
            </button>
          </div>
        )}
      </form>

      {/* Always-available demo access — smooth path for demos/exploring */}
      <div className="text-center mt-4">
        <button
          onClick={() => demoLogin(email || 'guest@drishti.demo')}
          className="text-text-muted hover:text-gold text-sm underline underline-offset-4"
        >
          {lang === 'hi' ? 'सिर्फ़ देख रहे हैं? डेमो एक्सेस से आगे बढ़ें →' : 'Just exploring? Use demo access →'}
        </button>
      </div>

      {!isConfigured && (
        <p className="text-text-faint text-xs text-center mt-4 font-mono">
          {lang === 'hi'
            ? 'नोट: ईमेल सर्वर कॉन्फ़िगर नहीं — Supabase कुंजी जोड़ने पर असली मैजिक लिंक सक्रिय होगा।'
            : 'Note: email server not configured — real magic links activate once Supabase keys are added.'}
        </p>
      )}
    </main>
  );
}
