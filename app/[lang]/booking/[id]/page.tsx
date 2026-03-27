import { getDictionary } from '../../../get-dictionary';
import BookingProcessContent from '@/components/BookingProcessContent';

interface PageProps {
    params: Promise<{ lang: string; id: string }>;
}

export default async function BookingProcessPage({ params }: PageProps) {
    const { lang, id } = await params;
    const dict = await getDictionary(lang);

    return <BookingProcessContent id={id} lang={lang} dict={dict} />;
}
