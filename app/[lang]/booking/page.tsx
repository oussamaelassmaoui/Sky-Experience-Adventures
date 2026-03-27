import { getDictionary } from '../../get-dictionary';
import BookingContent from '@/components/BookingContent';

interface PageProps {
    params: Promise<{ lang: string }>;
}

export default async function BookingPage({ params }: PageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <BookingContent lang={lang} dict={dict} />;
}
