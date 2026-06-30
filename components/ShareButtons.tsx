'use client';

import { useLang } from '@/lib/i18n';

interface ShareButtonsProps {
  shareText: string;   // text to share on WhatsApp
  className?: string;
}

export default function ShareButtons({ shareText, className = '' }: ShareButtonsProps) {
  const { t } = useLang();

  function handlePrint() {
    window.print();
  }

  function handleWhatsApp() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = encodeURIComponent(`${shareText}\n\n${url}\n\n— via DRISHTI Vedic+`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  return (
    <div className={`flex flex-wrap gap-3 no-print ${className}`}>
      <button onClick={handlePrint} className="btn-ghost text-sm">
        🖨️ {t('common.download')}
      </button>
      <button onClick={handleWhatsApp} className="btn-ghost text-sm">
        💬 {t('common.shareWA')}
      </button>
    </div>
  );
}
