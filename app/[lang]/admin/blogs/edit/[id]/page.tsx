'use client';

import React, { use } from 'react';
import BlogEditor from '@/components/admin/BlogEditor';

export default function EditPostPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
    const { lang, id } = use(params);
    return <BlogEditor lang={lang} postId={id} />;
}
