import Image from "next/image";

export default function AboutHero() {
    return (
        <section className="relative h-[70vh] w-full">
            <Image
                src="/images/balloon-land.webp"
                fill
                className="object-cover brightness-60"
                alt="Hot Air Balloon"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h1 className="text-white text-5xl font-extrabold tracking-wide">
                    À propos de SKY EXPERIENCE
                </h1>
            </div>
        </section>
    );
}
