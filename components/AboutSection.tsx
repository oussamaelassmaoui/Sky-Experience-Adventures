'use client';

import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import { ArrowRight } from "lucide-react";

interface AboutSectionProps {
  dict: any;
  lang?: string;
}

function renderBold(text: string) {
  return { __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') };
}

export default function AboutSection({ dict, lang = 'fr' }: AboutSectionProps) {
  return (
    <>
      {/* SECTION 1 */}
      <section id="about" className="bg-white py-24 ">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* IMAGE SIDE */}
          <div className="relative">
            <div className="relative w-full h-[720px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/balloon-intro.webp"
                alt="Adventure Balloon"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* TEXT SIDE */}
          <div>
            <p className="text-[#C04000] font-bold mb-3 uppercase tracking-wider">
              {dict.about_section.subtitle}
            </p>

            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-gray-900 mb-8 leading-tight">
              {dict.about_section.title}
              <br /> {dict.about_section.title_suffix}
            </h2>

            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p dangerouslySetInnerHTML={renderBold(dict.about_section.content_1)} />
              <p dangerouslySetInnerHTML={renderBold(dict.about_section.content_2)} />
              {dict.about_section.content_3 && (
                <p dangerouslySetInnerHTML={renderBold(dict.about_section.content_3)} />
              )}
            </div>

            <div className="mt-8">
              <Link href={`/${lang}/about`} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                {dict.about_section.cta}
                <ArrowRight size={20} />
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
