'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Light is the site default. Choosing dark adds `site-dark` to <html>
 * and remembers it in localStorage; THEME_INIT_SCRIPT (inlined in the
 * root layout's <head>) re-applies it before first paint so a returning
 * dark-mode visitor never sees a flash of the light theme.
 */
export const THEME_STORAGE_KEY = 'wff-theme';

export const THEME_INIT_SCRIPT = `try{if(localStorage.getItem('${THEME_STORAGE_KEY}')==='dark')document.documentElement.classList.add('site-dark')}catch(e){}`;

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

const isDark = () => document.documentElement.classList.contains('site-dark');

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const next = !isDark();
    document.documentElement.classList.toggle('site-dark', next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // Private mode / blocked storage: the switch still works for this visit.
    }
    listeners.forEach(l => l());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={className}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
