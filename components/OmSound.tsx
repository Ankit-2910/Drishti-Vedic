'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';

/**
 * OM Dhwani — ambient meditative drone.
 *
 * Honest engineering note: a pure 9999 Hz tone alone is piercing and near the
 * upper limit of human hearing — not relaxing. So this layers the TRADITIONAL
 * OM frequency (136.1 Hz "Om / Earth-year tuning") with its harmonics for a warm,
 * grounding drone, plus a *very faint* 9999 Hz shimmer for an ethereal high sparkle.
 * Slow amplitude modulation gives a natural "breathing" feel.
 *
 * Browsers block autoplay, so audio starts only on user tap. Preference is
 * remembered, and it auto-resumes on the next visit after the first interaction.
 */

const PREF_KEY = 'drishti_om_on';

export default function OmSound() {
  const { t, lang } = useLang();
  const [on, setOn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ oscillators: OscillatorNode[]; master: GainNode; lfo: OscillatorNode } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function buildGraph(ctx: AudioContext) {
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 2.5); // gentle fade-in
    master.connect(ctx.destination);

    // Soft lowpass to keep it warm
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    filter.Q.value = 0.5;
    filter.connect(master);

    const oscillators: OscillatorNode[] = [];

    // Layer definitions: [frequency, gain, type]
    const layers: Array<[number, number, OscillatorType]> = [
      [136.1, 0.5, 'sine'],   // OM fundamental (Earth-year / "Sa" tuning)
      [68.05, 0.32, 'sine'],  // sub-octave for depth
      [272.2, 0.18, 'sine'],  // octave up
      [204.15, 0.12, 'sine'], // perfect fifth
      [408.3, 0.06, 'triangle'], // subtle upper harmonic
    ];

    layers.forEach(([freq, gain, type]) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = gain;
      // tiny detune for organic chorus
      osc.detune.value = (Math.random() - 0.5) * 6;
      osc.connect(g);
      g.connect(filter);
      osc.start();
      oscillators.push(osc);
    });

    // Faint 9999 Hz shimmer (very low gain so it sparkles, never pierces)
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.value = 9999;
    shimmerGain.gain.value = 0.012;
    shimmer.connect(shimmerGain);
    shimmerGain.connect(master); // bypasses lowpass intentionally
    shimmer.start();
    oscillators.push(shimmer);

    // LFO for slow "breathing" amplitude modulation on the master
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12; // ~8 second breath cycle
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();

    nodesRef.current = { oscillators, master, lfo };
  }

  function start() {
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;
      buildGraph(ctx);
      ctx.resume();
      setOn(true);
      try { localStorage.setItem(PREF_KEY, '1'); } catch {}
    } catch (e) {
      console.error('OM sound failed:', e);
    }
  }

  function stop() {
    const nodes = nodesRef.current;
    const ctx = ctxRef.current;
    if (nodes && ctx) {
      // fade out then close
      nodes.master.gain.cancelScheduledValues(ctx.currentTime);
      nodes.master.gain.setValueAtTime(nodes.master.gain.value, ctx.currentTime);
      nodes.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
      setTimeout(() => {
        try {
          nodes.oscillators.forEach((o) => o.stop());
          nodes.lfo.stop();
          ctx.close();
        } catch {}
        ctxRef.current = null;
        nodesRef.current = null;
      }, 1300);
    }
    setOn(false);
    try { localStorage.setItem(PREF_KEY, '0'); } catch {}
  }

  function toggle() {
    if (on) stop();
    else start();
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label={on ? t('om.off') : t('om.on')}
      title={on ? t('om.off') : t('om.on')}
      className={`
        fixed bottom-5 right-5 z-50 group flex items-center gap-2
        rounded-full border backdrop-blur-md transition-all
        ${on
          ? 'bg-gold/20 border-gold text-gold shadow-[0_0_24px_rgba(245,158,11,0.4)] px-4 py-3'
          : 'bg-bg-elev/80 border-strong text-text-muted hover:text-gold hover:border-gold px-4 py-3'}
      `}
    >
      <span className={`text-2xl leading-none ${on ? 'animate-pulse' : ''}`}>ॐ</span>
      <span className="text-xs font-mono tracking-wider hidden group-hover:inline md:inline">
        {t('om.label')}
        {on && (
          <span className="ml-1 inline-flex gap-0.5 items-end h-3">
            <span className="w-0.5 bg-gold animate-[ombar_0.8s_ease-in-out_infinite]" style={{ height: '60%' }} />
            <span className="w-0.5 bg-gold animate-[ombar_0.8s_ease-in-out_infinite_0.2s]" style={{ height: '100%' }} />
            <span className="w-0.5 bg-gold animate-[ombar_0.8s_ease-in-out_infinite_0.4s]" style={{ height: '40%' }} />
          </span>
        )}
      </span>
    </button>
  );
}
