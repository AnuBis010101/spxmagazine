"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

let externalConfirm: ((message: string) => Promise<boolean>) | null = null;

/**
 * Imperative themed confirmation (drop-in for window.confirm) — returns a
 * Promise<boolean>. Falls back to window.confirm if the provider isn't mounted.
 */
export function adminConfirm(message: string): Promise<boolean> {
  if (externalConfirm) return externalConfirm(message);
  return Promise.resolve(
    typeof window !== "undefined" ? window.confirm(message) : false
  );
}

/** Mount once (in the admin layout). Renders the themed confirm dialog. */
export default function ConfirmProvider() {
  const [state, setState] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const resolver = useRef<((v: boolean) => void) | null>(null);

  useEffect(() => {
    externalConfirm = (message: string) => {
      setState({ open: true, message });
      return new Promise<boolean>((resolve) => {
        resolver.current = resolve;
      });
    };
    return () => {
      externalConfirm = null;
    };
  }, []);

  const settle = (result: boolean) => {
    setState((s) => ({ ...s, open: false }));
    resolver.current?.(result);
    resolver.current = null;
  };

  return (
    <Modal isOpen={state.open} onClose={() => settle(false)} title="Please confirm">
      <p className="text-mag-light">{state.message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={() => settle(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => settle(true)}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
