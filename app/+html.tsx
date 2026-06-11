import type { ReactNode } from "react";
import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#eff1f5" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#181825" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: WEB_STYLES }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const WEB_STYLES = `
html, body, #root {
  height: 100%;
  min-height: 100%;
}

#root {
  display: flex;
  flex-direction: column;
}

@media (min-width: 769px) {
  body {
    overflow: hidden;
    background: radial-gradient(ellipse at 50% 20%, #f5f5f7 0%, #e8e8ed 100%);
  }
}

@media (prefers-color-scheme: dark) {
  @media (min-width: 769px) {
    body {
      background: radial-gradient(ellipse at 50% 20%, #2c2c2e 0%, #1a1a1c 100%);
    }
  }
}

body {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  overscroll-behavior: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (max-width: 768px) {
  html, body, #root {
    height: 100dvh;
    min-height: 100dvh;
    overflow: hidden;
  }

  body {
    background: var(--background, #eff1f5);
  }
}

input, textarea, [contenteditable] {
  user-select: text !important;
  -webkit-user-select: text !important;
}

::-webkit-scrollbar {
  display: none;
}

* {
  scrollbar-width: none;
}
`;
