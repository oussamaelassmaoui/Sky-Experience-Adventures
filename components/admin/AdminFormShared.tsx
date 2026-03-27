import React, { useState, useRef, DragEvent } from 'react';
import { ChevronDown, CheckCircle, AlertCircle, Upload, Cloud, Database, Check, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type UploadStep = 'idle' | 'uploading_images' | 'saving_data' | 'done';

// ─── Slug helper (mirrors backend slugify) ────────────────────────────────────
export function toSlug(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// ─── Collapsible Section ──────────────────────────────────────────────────────
export function Section({
    title, icon, defaultOpen = false, badge, children
}: {
    title: string; icon?: React.ReactNode;
    defaultOpen?: boolean; badge?: 'ok' | 'warn' | null;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-bold text-gray-800 text-base">{title}</span>
                    {badge === 'ok' && <CheckCircle size={16} className="text-green-500" />}
                    {badge === 'warn' && <AlertCircle size={16} className="text-amber-400" />}
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <div className="px-6 pb-6 space-y-6 border-t border-gray-100">{children}</div>}
        </div>
    );
}

// ─── Drag-and-Drop Upload Zone ────────────────────────────────────────────────
export function DropZone({ onFiles, multiple = false, label }: { onFiles: (files: File[]) => void; multiple?: boolean; label: string }) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); setDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length) onFiles(multiple ? files : [files[0]]);
    };

    return (
        <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragging ? 'border-[#C04000] bg-orange-50' : 'border-gray-300 hover:border-[#C04000] hover:bg-gray-50'
                }`}
        >
            <Upload size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 font-medium">{label}</p>
            <p className="text-xs text-gray-400 mt-1">Drag & drop or click · Max 5MB per image · JPG, PNG, WEBP</p>
            <input ref={inputRef} type="file" accept="image/*" multiple={multiple} className="hidden"
                onChange={e => { if (e.target.files?.length) onFiles(Array.from(e.target.files)); }} />
        </div>
    );
}

// ─── Upload Progress Banner ───────────────────────────────────────────────────
const STEPS = [
    { key: 'uploading_images', icon: Cloud, label: 'Uploading images…' },
    { key: 'saving_data', icon: Database, label: 'Saving data…' },
    { key: 'done', icon: Check, label: 'Saved!' },
] as const;

export function UploadProgress({ step }: { step: UploadStep }) {
    if (step === 'idle') return null;
    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6">
            {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = s.key === step;
                const isDone = STEPS.findIndex(x => x.key === step) > i;
                return (
                    <div key={s.key} className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${isDone ? 'bg-green-100 text-green-600' : isActive ? 'bg-orange-100 text-[#C04000]' : 'bg-gray-100 text-gray-400'}`}>
                            {isActive ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
                        </div>
                        <span className={`text-sm font-medium ${isActive ? 'text-[#C04000]' : isDone ? 'text-green-600' : 'text-gray-400'}`}>{s.label}</span>
                        {i < STEPS.length - 1 && <div className={`w-8 h-px ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />}
                    </div>
                );
            })}
        </div>
    );
}
