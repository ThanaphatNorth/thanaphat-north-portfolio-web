"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { Dialog } from "@/components/ui/Dialog";
import { useContact } from "@/components/contact/ContactProvider";
import { setMotionPaused } from "@/motion/tier";
import { scrollToTarget } from "@/motion/scrollTo";
import { siteConfig } from "@/lib/constants";
import { complete, runCommand, type TerminalAction, type TerminalData } from "./commands";

interface TerminalContextValue {
  openTerminal: () => void;
}
const TerminalContext = createContext<TerminalContextValue>({ openTerminal: () => {} });
export const useTerminal = () => useContext(TerminalContext);

interface Entry {
  id: number;
  input?: string;
  lines: string[];
}

const PROMPT = "north@portfolio:~$";
const BANNER = [
  "north.os — type `help` to explore, `hire` to talk.",
];

function isEditable(el: EventTarget | null) {
  const t = el as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
}

/**
 * A small, real terminal: press "/" or "`" anywhere (or the >_ button) to open.
 * Commands are static (no network), see ./commands.ts.
 */
export function TerminalProvider({ children, data }: { children: ReactNode; data: TerminalData }) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, lines: BANNER }]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const nextId = useRef(1);
  const outRef = useRef<HTMLDivElement>(null);
  const { openContact } = useContact();
  const lenis = useLenis();

  const openTerminal = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  // Global shortcut: "/" or "`" when not typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open || e.isComposing || e.metaKey || e.ctrlKey || e.altKey || isEditable(e.target)) return;
      if (e.key === "/" || e.key === "`") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [entries]);

  const perform = (action: TerminalAction) => {
    switch (action.type) {
      case "clear":
        setEntries([]);
        break;
      case "close":
        setOpen(false);
        break;
      case "contact":
        setOpen(false);
        // Let the terminal close (and release focus) before the contact dialog opens.
        setTimeout(() => openContact(action.service ?? ""), 250);
        break;
      case "scroll":
        setOpen(false);
        setTimeout(() => scrollToTarget(action.target, lenis), 250);
        break;
      case "download": {
        const a = document.createElement("a");
        a.href = siteConfig.resumeUrl;
        a.download = "Thanaphat-Chirutpadathorn-Resume.pdf";
        a.click();
        break;
      }
      case "toggle-motion":
        setMotionPaused(document.documentElement.dataset.motion !== "static");
        break;
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = value;
    setValue("");
    cursor.current = -1;
    if (input.trim()) history.current.unshift(input);
    const result = runCommand(input, data);
    if (result.action?.type !== "clear") {
      setEntries((prev) => [...prev, { id: nextId.current++, input, lines: result.lines }]);
    }
    if (result.action) perform(result.action);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (!h.length) return;
      cursor.current = e.key === "ArrowUp" ? Math.min(h.length - 1, cursor.current + 1) : Math.max(-1, cursor.current - 1);
      setValue(cursor.current === -1 ? "" : h[cursor.current]);
    } else if (e.key === "Tab") {
      const c = complete(value);
      if (c) {
        e.preventDefault();
        setValue(`${c} `);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  const ctx = useMemo(() => ({ openTerminal }), [openTerminal]);

  return (
    <TerminalContext value={ctx}>
      {children}
      <Dialog open={open} onClose={close} title={<span className="font-mono text-sm">{PROMPT.replace("$", "")}</span>} className="!max-w-3xl" testId="terminal">
        <div className="bg-ink font-mono text-[13px] leading-relaxed text-paper/85 flex flex-col h-[min(70vh,560px)]">
          <div ref={outRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3" aria-live="polite" data-lenis-prevent data-testid="terminal-output">
            {entries.map((en) => (
              <div key={en.id}>
                {en.input !== undefined && (
                  <p>
                    <span className="text-accent">{PROMPT}</span> <span className="text-paper">{en.input}</span>
                  </p>
                )}
                {en.lines.map((l, i) => (
                  <p key={i} className="whitespace-pre-wrap text-paper/70">
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 border-t border-border px-5 py-3">
            <label htmlFor="terminal-input" className="text-accent shrink-0">
              {PROMPT}
            </label>
            <input
              id="terminal-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Terminal command"
              className="flex-1 bg-transparent outline-none text-paper caret-accent rounded focus-visible:ring-1 focus-visible:ring-accent/60"
              data-testid="terminal-input"
            />
          </form>
        </div>
      </Dialog>
    </TerminalContext>
  );
}
