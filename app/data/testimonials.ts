export interface Testimonial {
    name: string;
    date: string;
    rating: number;
    text: string;
    avatar: string | null;
    bgColor?: string;
    video?: boolean;
    viewMore?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
    {
        name: "Lizzie Mack9",
        date: "Il y a 2 mois",
        rating: 5,
        text: "Definitely a bucket list experience. Everything went smoothly on the day. Jamal and the team were great, really friendly and checked in with us throughout the morning to check we were enjoying the experience. Good value for the money with breakfast and transfers included. Thank you to Jamal The pilot and the rest of the team.",
        avatar: null, // "L" letter avatar
        bgColor: "bg-[#3D0C02]" // Dark brownish/red for avatar background
    },
    {
        name: "Cecile F",
        date: "févr. 2025 • En famille",
        rating: 5,
        text: "Expérience incroyable et très bien organisée par la compagnie. Si bien que cela mérite un avis positif laissé ici afin que d'autres personnes puissent vivre la même chose en toute confiance ! Notre \"pilote\" était français et très rassurant, vous pouvez y foncer les yeux fermés !Merci pour tout et bravo !",
        avatar: "/images/avatar1.webp",
        video: false
    },
    {
        name: "Yassine AIT BELLA",
        date: "décembre 2024",
        rating: 5,
        text: "J'ai vécu une expérience inoubliable en montgolfière pour admirer le lever de soleil, et c'était tout simplement magique ! Voler au-dessus des paysages à couper le souffle dans une atmosphère paisible était une sensation incroyable. Khalid a été un hôte",
        avatar: "/images/avatar2.webp",
        viewMore: true
    }
];
