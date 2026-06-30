'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth-context';
import TopBar from '@/components/TopBar';
import OmSound from '@/components/OmSound';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <TopBar />
        {children}
        <OmSound />
      </AuthProvider>
    </I18nProvider>
  );
}
