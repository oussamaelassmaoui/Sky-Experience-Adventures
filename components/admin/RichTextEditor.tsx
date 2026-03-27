'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import sanitizeHtml from 'sanitize-html';
import 'react-quill-new/dist/quill.snow.css';
import './editor.css';

// Dynamic import for ReactQuill to avoid SSR issues
// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(async () => {
    const { default: RQ, Quill } = await import('react-quill-new');
    const { default: BlotFormatter, AlignAction, ResizeAction, DeleteAction } = await import('quill-blot-formatter');

    class CustomBlotFormatter extends BlotFormatter {
        constructor(quill: any, options: any) {
            super(quill, options);
            (this as any).allowed = ['image']; // Only allow image handling
        }
    }

    Quill.register('modules/blotFormatter', CustomBlotFormatter);
    return RQ;
}, { ssr: false }) as any;

import { uploadImage } from '@/services/api';
import ImageCropperModal from './ImageCropperModal';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
    const quillRef = React.useRef<any>(null);
    const [cropperState, setCropperState] = React.useState<{ isOpen: boolean; imageSrc: string | null }>({
        isOpen: false,
        imageSrc: null
    });

    const imageHandler = React.useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    setCropperState({
                        isOpen: true,
                        imageSrc: e.target?.result as string
                    });
                };
                reader.readAsDataURL(file);
            }
        };
    }, []);

    const handleCropComplete = async (croppedBlob: Blob) => {
        try {
            // Create a File from Blob
            const file = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });

            // Upload
            const url = await uploadImage(file);

            // Insert into Editor
            const quill = quillRef.current?.getEditor();
            if (quill) {
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, 'image', url);
                quill.setSelection(range.index + 1);
            }

            setCropperState({ isOpen: false, imageSrc: null });
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Failed to upload image');
        }
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
        blotFormatter: {
            overlay: {
                style: {
                    border: '2px solid #C04000',
                }
            }
        },
        clipboard: {
            matchVisual: false
        }
    }), [imageHandler]);

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'indent',
        'align', 'color', 'background',
        'link', 'image', 'video'
    ];

    // Custom sanitization to handle full HTML document pasting
    const handleChange = (content: string) => {
        // Only trigger heavy sanitization if we detect full HTML structure or specific tags we want to strip
        if (content.includes('<html') || content.includes('<body') || content.includes('<!DOCTYPE') || content.includes('<head')) {
            const clean = sanitizeHtml(content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                    'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'p', 'br', 'strong', 'em', 'u', 's', 'blockquote', 'ul', 'ol', 'li', 'a', 'iframe'
                ]),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    'img': ['src', 'alt', 'width', 'height'],
                    'a': ['href', 'name', 'target', 'rel'],
                    'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
                    '*': ['style', 'class']
                },
                exclusiveFilter: function (frame) {
                    return frame.tag === 'head' || frame.tag === 'meta' || frame.tag === 'title' || frame.tag === 'script' || frame.tag === 'style' || frame.tag === 'link';
                }
            });
            onChange(clean);
        } else {
            onChange(content);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden prose max-w-none">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || 'Write something amazing...'}
            />

            <ImageCropperModal
                isOpen={cropperState.isOpen}
                imageSrc={cropperState.imageSrc}
                onClose={() => setCropperState({ isOpen: false, imageSrc: null })}
                onCropComplete={handleCropComplete}
            />
        </div>
    );
};

export default RichTextEditor;
