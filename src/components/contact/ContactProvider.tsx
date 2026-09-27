"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ContactFormModal } from "@/components/ui/ContactFormModal";

interface ContactContextValue {
  openContact: (service?: string) => void;
}

const ContactContext = createContext<ContactContextValue>({ openContact: () => {} });

export const useContact = () => useContext(ContactContext);

/** One contact dialog for the whole page; any CTA can open it (optionally pre-selecting a service). */
export function ContactProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; service: string; nonce: number }>({
    open: false,
    service: "",
    nonce: 0,
  });

  const openContact = useCallback((service = "") => {
    setState((s) => ({ open: true, service, nonce: s.nonce + 1 }));
  }, []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const value = useMemo(() => ({ openContact }), [openContact]);

  return (
    <ContactContext value={value}>
      {children}
      <ContactFormModal
        key={state.nonce}
        isOpen={state.open}
        onClose={close}
        prefilledService={state.service}
      />
    </ContactContext>
  );
}
