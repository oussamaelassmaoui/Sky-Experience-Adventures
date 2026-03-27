import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { X, Check, ZoomIn } from 'lucide-react';
import getCroppedImg from '@/utils/cropImage';

interface ImageCropperModalProps {
    isOpen: boolean;
    imageSrc: string | null;
    onClose: () => void;
    onCropComplete: (croppedImageBlob: Blob) => void;
}

const ASPECT_RATIOS = [
    { label: '16:9', value: 16 / 9 },
    { label: '4:3', value: 4 / 3 },
    { label: '1:1', value: 1 },
    { label: '2:3', value: 2 / 3 },
];

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ isOpen, imageSrc, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(16 / 9);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            setLoading(true);
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !imageSrc) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        Crop Image
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">
                        <X size={24} />
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="flex-1 relative bg-gray-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={setZoom}
                    />
                </div>

                {/* Controls */}
                <div className="p-4 border-t bg-white flex flex-col gap-4">

                    {/* Zoom & Aspect Ratio */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                            <ZoomIn size={20} className="text-gray-500" />
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full accent-[#C04000] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="flex gap-2">
                            {ASPECT_RATIOS.map((ratio) => (
                                <button
                                    key={ratio.label}
                                    onClick={() => setAspect(ratio.value)}
                                    className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${aspect === ratio.value
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {ratio.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-dashed">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-[#C04000] text-white font-bold hover:bg-[#A03000] flex items-center gap-2 disabled:opacity-70 transition-all shadow-lg shadow-orange-500/30"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <Check size={18} /> Insert Image
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
