'use client';

import { CITIES, INSTRUMENTS, STYLES } from '@/lib/constants';
import { Instrument, Style } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { HiChevronDown, HiX } from 'react-icons/hi';

interface FiltersProps {
  city: string;
  setCity: (v: string) => void;
  instrument: string;
  setInstrument: (v: string) => void;
  styles: Style[];
  setStyles: (v: Style[]) => void;
}

function Dropdown({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-left hover:border-[#3a3a3a] transition-colors"
      >
        <span className={selected ? 'text-[#e5e5e5]' : 'text-[#a1a1aa]'}>
          {selected ? selected.label : placeholder}
        </span>
        <HiChevronDown className={`text-[#a1a1aa] w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg max-h-48 overflow-y-auto shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                opt.value === value ? 'text-[#8b5cf6]' : 'text-[#e5e5e5]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiSelect({
  selected,
  options,
  onChange,
  placeholder,
}: {
  selected: Style[];
  options: { value: Style; label: string }[];
  onChange: (v: Style[]) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (v: Style) => {
    if (selected.includes(v)) {
      onChange(selected.filter((s) => s !== v));
    } else {
      onChange([...selected, v]);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-left hover:border-[#3a3a3a] transition-colors min-w-0"
      >
        <span className={selected.length > 0 ? 'text-[#e5e5e5] truncate' : 'text-[#a1a1aa]'}>
          {selected.length > 0 ? selected.join(' / ') : placeholder}
        </span>
        <HiChevronDown className={`text-[#a1a1aa] w-4 h-4 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg max-h-48 overflow-y-auto shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                selected.includes(opt.value) ? 'text-[#8b5cf6]' : 'text-[#e5e5e5]'
              }`}
            >
              <span className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 text-[10px] ${
                selected.includes(opt.value)
                  ? 'border-[#8b5cf6] bg-[#8b5cf6] text-white'
                  : 'border-[#2a2a2a]'
              }`}>
                {selected.includes(opt.value) ? '✓' : ''}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Filters({ city, setCity, instrument, setInstrument, styles, setStyles }: FiltersProps) {
  const cityOptions = CITIES.map((c) => ({ value: c, label: c }));
  const instrumentOptions = [{ value: '', label: '全部乐器' }, ...INSTRUMENTS];

  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-full sm:w-auto sm:min-w-[140px]">
        <div className="text-xs text-[#a1a1aa] mb-1">城市</div>
        <Dropdown
          value={city}
          options={cityOptions}
          onChange={setCity}
          placeholder="选择城市"
        />
      </div>
      <div className="w-full sm:w-auto sm:min-w-[140px]">
        <div className="text-xs text-[#a1a1aa] mb-1">乐器</div>
        <Dropdown
          value={instrument}
          options={instrumentOptions}
          onChange={setInstrument}
          placeholder="全部乐器"
        />
      </div>
      <div className="w-full sm:w-auto sm:min-w-[180px]">
        <div className="text-xs text-[#a1a1aa] mb-1">风格（多选）</div>
        <MultiSelect
          selected={styles}
          options={STYLES}
          onChange={setStyles}
          placeholder="全部风格"
        />
      </div>
    </div>
  );
}
