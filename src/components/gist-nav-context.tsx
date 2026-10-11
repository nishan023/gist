"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const GistNavContext = createContext<{
  title: string | null;
  setTitle: (title: string | null) => void;
}>({ title: null, setTitle: () => {} });

export function GistNavProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  const value = useMemo(() => ({ title, setTitle }), [title]);
  return (
    <GistNavContext.Provider value={value}>{children}</GistNavContext.Provider>
  );
}

export function useGistNav() {
  return useContext(GistNavContext);
}

export function GistNavTitle({ title }: { title: string }) {
  const { setTitle } = useGistNav();
  useEffect(() => {
    setTitle(title);
    return () => setTitle(null);
  }, [title, setTitle]);
  return null;
}
