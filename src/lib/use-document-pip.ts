"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

// Document Picture-in-Picture API (Chrome / Edge 116+). Not yet in TypeScript's DOM lib.
interface DocumentPictureInPicture {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
  window: Window | null;
}

function getPipApi(): DocumentPictureInPicture | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { documentPictureInPicture?: DocumentPictureInPicture })
    .documentPictureInPicture ?? null;
}

const noopSubscribe = () => () => {};

/**
 * Copies every stylesheet (Tailwind, next/font @font-face, ...) into the PiP document.
 * The PiP document is about:blank, so stylesheets are linked by absolute URL — a cloned
 * relative href (and the font files it references) may not resolve there.
 */
function copyStyles(target: Document) {
  const base = target.createElement("base");
  base.href = document.baseURI;
  target.head.appendChild(base);

  for (const sheet of Array.from(document.styleSheets)) {
    const owner = sheet.ownerNode;
    if (sheet.href) {
      const link = target.createElement("link");
      link.rel = "stylesheet";
      link.href = sheet.href;
      target.head.appendChild(link);
    } else if (owner instanceof HTMLStyleElement) {
      target.head.appendChild(owner.cloneNode(true));
    }
  }
}

/** Resolves once the copied stylesheets have loaded, so the first paint uses the app fonts. */
function waitForStyles(target: Document) {
  const links = Array.from(target.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
  return Promise.all(
    links.map(
      (link) =>
        new Promise<void>((resolve) => {
          if (link.sheet) return resolve();
          link.addEventListener("load", () => resolve(), { once: true });
          link.addEventListener("error", () => resolve(), { once: true });
        })
    )
  );
}

/**
 * Opens an always-on-top floating window whose body can be filled with a React portal.
 * Keeps the <html> class (dark mode, font variables) in sync with the main document.
 */
export function useDocumentPip() {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  // Server snapshot is false so SSR markup never shows the PiP button.
  const isSupported = useSyncExternalStore(
    noopSubscribe,
    () => getPipApi() !== null,
    () => false
  );

  const open = useCallback(async (size: { width: number; height: number }) => {
    const api = getPipApi();
    if (!api) return null;
    if (api.window) return api.window;

    let win: Window;
    try {
      win = await api.requestWindow(size);
    } catch (error) {
      // e.g. no user activation, or an embedded webview that cannot open windows
      console.warn("Picture-in-Picture window could not be opened", error);
      return null;
    }
    copyStyles(win.document);
    win.document.documentElement.className = document.documentElement.className;
    win.document.body.className = "bg-background text-foreground font-sans antialiased";
    win.document.title = document.title;
    await waitForStyles(win.document);
    win.addEventListener("pagehide", () => setPipWindow(null), { once: true });
    setPipWindow(win);
    return win;
  }, []);

  const close = useCallback(() => {
    getPipApi()?.window?.close();
  }, []);

  // Mirror theme changes (the `.dark` class on <html>) into the floating window.
  useEffect(() => {
    if (!pipWindow) return;
    const observer = new MutationObserver(() => {
      pipWindow.document.documentElement.className = document.documentElement.className;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [pipWindow]);

  // Close the floating window when the owning page unmounts (e.g. navigating away).
  useEffect(() => () => getPipApi()?.window?.close(), []);

  return { isSupported, pipWindow, open, close };
}
