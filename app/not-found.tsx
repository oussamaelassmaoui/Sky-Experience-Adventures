import Link from 'next/link';
import Image from 'next/image';
import './globals.css'; // Import global styles
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function NotFound() {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} font-sans`}>
                <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">

                    {/* Background Pattern/Gradient */}
                    <div className="absolute inset-0 z-0 opacity-30">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-[#FDFBF7]" />
                    </div>

                    <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6 animate-float">
                            <Image
                                src="/images/balloon-intro.webp"
                                alt="Lost Hot Air Balloon"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        <h1 className="text-6xl md:text-8xl font-playfair font-black text-gray-900 mb-2 leading-none">
                            404
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#C04000] mb-6 font-playfair">
                            Lost in the Clouds?
                        </h2>

                        <p className="text-gray-600 text-lg mb-10 max-w-lg leading-relaxed">
                            The page you are looking for seems to have drifted away with the wind. Let's get you back on solid ground.
                        </p>

                        <div className="flex gap-4">
                            <Link
                                href="/"
                                className="bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white px-8 py-3.5 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                <span>Return to Home</span>
                            </Link>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
}
