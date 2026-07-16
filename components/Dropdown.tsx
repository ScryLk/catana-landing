"use client";

import { useEffect, useRef, useState } from "react";

/* Dropdown dedicado (substitui o <select> nativo): gatilho estilizado
   + painel flutuante, com teclado (setas, Enter, Esc) e clique-fora.
   Expõe o valor num input hidden pra funcionar com FormData. */
export default function Dropdown({
  id,
  name,
  options,
  value,
  onChange,
}: {
  id?: string;
  name: string;
  options: readonly string[];
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [internal, setInternal] = useState(options[0]);
  const selected = value ?? internal;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const select = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
    setOpen(false);
  };

  const toggle = (next: boolean) => {
    setOpen(next);
    if (next) setActive(Math.max(0, options.indexOf(selected)));
  };

  // Clique fora fecha
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        toggle(true);
      }
      return;
    }
    if (e.key === "Escape") {
      e.stopPropagation(); // não fecha o modal junto
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(options[active]);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <input type="hidden" name={name} value={selected} />
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => toggle(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-graphite-600 bg-graphite-950 px-4 py-3 text-left font-sans text-[15px] text-graphite-100 transition-colors hover:border-graphite-400 focus:border-graphite-300 focus:outline-none"
      >
        <span className="truncate">{selected}</span>
        <span
          aria-hidden
          className={`shrink-0 text-[10px] text-graphite-400 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-activedescendant={`${name}-opt-${active}`}
          className="custom-scroll absolute top-full right-0 left-0 z-20 m-0 mt-2 max-h-64 list-none overflow-y-auto rounded-lg border border-graphite-600 bg-graphite-900 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.5)] animate-[dropIn_0.15s_ease-out]"
        >
          {options.map((opt, i) => (
            <li key={opt} id={`${name}-opt-${i}`} role="option" aria-selected={opt === selected}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => select(opt)}
                onPointerMove={() => setActive(i)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left font-sans text-[14px] transition-colors ${
                  i === active
                    ? "bg-graphite-800 text-graphite-100"
                    : "text-graphite-200"
                }`}
              >
                {/* marcador quadradinho — eco da malha de células */}
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-sm ${
                    opt === selected ? "bg-graphite-100" : "bg-graphite-600"
                  }`}
                />
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
