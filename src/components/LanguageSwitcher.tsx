'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { locales, localeNames, type Locale } from '@/i18n/config';

const Wrapper = styled.div`
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.pill};
`;

const Pill = styled.button<{ $active: boolean }>`
  padding: 5px 11px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 12px;
  font-weight: 700;
  transition: background 0.2s, color 0.2s;
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.textMuted)};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : 'transparent'};
  &:hover { color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.text)}; }
`;

export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const switchTo = (target: Locale) => {
    if (target === current) return;
    const parts = (pathname || '/').split('/');
    if (parts[1] && (locales as readonly string[]).includes(parts[1])) {
      parts[1] = target;
    } else {
      parts.splice(1, 0, target);
    }
    const q = search?.toString();
    const nextPath = (parts.join('/') || `/${target}`) + (q ? `?${q}` : '');
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.push(nextPath);
  };

  return (
    <Wrapper role="group" aria-label="Language switcher">
      {locales.map((l) => (
        <Pill
          key={l}
          type="button"
          $active={l === current}
          onClick={() => switchTo(l)}
          aria-pressed={l === current}
          lang={l}
        >
          {localeNames[l]}
        </Pill>
      ))}
    </Wrapper>
  );
}
