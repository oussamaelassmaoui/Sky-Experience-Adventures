import PageHeader from '@/components/PageHeader';
import { getDictionary } from '../../get-dictionary';
import ContactPageClient from './ContactPageClient';

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const t = dict.contact_page;

    return (
        <main className="min-h-screen bg-[#FDFBF7] font-sans">
            <PageHeader
                title={t.header_title}
                subtitle={t.header_subtitle}
                backgroundImage="/images/hero.webp"
                waveColor="#FDFBF7"
            />
            <ContactPageClient dict={dict} lang={lang} />
        </main>
    );
}