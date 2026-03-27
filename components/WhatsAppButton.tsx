'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
    const pathname = usePathname();
    const lang = pathname.split('/')[1] || 'fr';
    
    const phoneNumber = '212751622180';
    
    const messages = {
        fr: 'Bonjour! Je vous contacte depuis le site Sky Experience. Je souhaite avoir plus d\'informations.',
        en: 'Hello! I\'m contacting you from the Sky Experience website. I would like more information.',
        ar: 'مرحبا! أتواصل معكم من موقع Sky Experience. أود الحصول على مزيد من المعلومات.'
    };
    
    const message = encodeURIComponent(messages[lang as keyof typeof messages] || messages.fr);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-[#C04000] to-[#F27A23] hover:shadow-2xl text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 group"
            aria-label="Contact via WhatsApp"
        >
            <FaWhatsapp size={32} className="group-hover:scale-110 transition-transform" />
            
            {/* Pulse animation */}
            <span className="absolute w-full h-full bg-[#F27A23] rounded-full animate-ping opacity-20"></span>
        </motion.a>
    );
}
