'use client';

import React, { use } from 'react';
import BlogEditor from '@/components/admin/BlogEditor';

export default function NewPostPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    return <BlogEditor lang={lang} />;
}
