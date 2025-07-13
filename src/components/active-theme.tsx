'use client';

import { ReactNode, useEffect } from 'react';

const DEFAULT_THEME = 'blue';

export function ActiveThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    Array.from(document.body.classList)
      .filter((className) => className.startsWith('theme-'))
      .forEach((className) => {
        document.body.classList.remove(className);
      });
    document.body.classList.add(`theme-${DEFAULT_THEME}`);
  }, []);

  return <>{children}</>;
}
