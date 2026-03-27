
import React from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

interface DynamicListProps {
    title: string;
    items: string[];
    onChange: (newItems: string[]) => void;
    placeholder?: string;
}

export default function DynamicList({ title, items, onChange, placeholder = "Add item..." }: DynamicListProps) {
    const handleAdd = () => {
        onChange([...items, '']);
    };

    const handleRemove = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        onChange(newItems);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700">{title}</label>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="text-[#C04000] text-sm font-semibold hover:bg-orange-50 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                >
                    <Plus size={16} /> Add
                </button>
            </div>

            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center group">
                        <GripVertical size={16} className="text-gray-300 cursor-move" />
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleChange(index, e.target.value)}
                            placeholder={placeholder}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}

                {items.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No items added yet.</p>
                )}
            </div>
        </div>
    );
}
