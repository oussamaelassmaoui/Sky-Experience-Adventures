export interface FAQItem {
    id: string;
    number: string;
    question: string;
    answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
    {
        id: '1',
        number: '01',
        question: "À quelle heure décolle la montgolfière ? Et quand rentre-t-on ?",
        answer: "Tous les vols décollent au lever du soleil pour garantir une lumière magique. La prise en charge à Marrakech s'effectue généralement entre 4h00 et 5h00 en été et entre 5h00 et 6h00 en hiver. Vous serez de retour à votre hôtel entre 9h15 et 10h15."
    },
    {
        id: '2',
        number: '02',
        question: "D'où décolle la montgolfière ?",
        answer: "Nos sites d'envol sont situés à environ 30 à 45 minutes du centre de Marrakech, offrant une vue imprenable sur la Palmeraie et l'Atlas. Nous assurons le transfert aller-retour depuis votre hôtel ou riad."
    },
    {
        id: '3',
        number: '03',
        question: "Combien de temps dure l'expérience complète ?",
        answer: "L'aventure dure environ 4 heures au total. Cela inclut le transfert, la préparation du ballon, le vol (45 à 60 min), le petit-déjeuner traditionnel berbère sous tente et le retour."
    },
    {
        id: '4',
        number: '04',
        question: "Proposez-vous des tarifs pour les groupes ?",
        answer: "Absolument ! Nous proposons des tarifs préférentiels pour les groupes de 6 personnes ou plus. Contactez-nous via WhatsApp au +212 661 445 327 pour obtenir un devis personnalisé."
    },
    {
        id: '5',
        number: '05',
        question: "Que se passe-t-il en cas de mauvaises conditions météo ?",
        answer: "Votre sécurité est notre priorité absolue. Si le vol est annulé pour des raisons météorologiques, nous vous proposons de reporter l'expérience au lendemain ou de recevoir un remboursement intégral."
    },
    {
        id: '6',
        number: '06',
        question: "Est-il possible de personnaliser le vol pour un événement spécial ?",
        answer: "Oui ! Qu'il s'agisse d'une demande en mariage, d'un anniversaire ou d'un événement d'entreprise, nous proposons des vols privés sur mesure avec des options exclusives (bouquet de fleurs, banderoles personnalisées, gâteau) pour rendre ce moment inoubliable."
    },
    {
        id: '7',
        number: '07',
        question: "Les enfants peuvent-ils participer au vol ?",
        answer: "Oui, les enfants sont les bienvenus à partir de 4 ans. Les enfants âgés de 4 à 11 ans bénéficient d'un tarif réduit spécial."
    },
    {
        id: '8',
        number: '08',
        question: "Combien de passagers y a-t-il dans la nacelle ?",
        answer: "Pour nos vols classiques partagés, les nacelles accueillent entre 12 et 16 personnes avec des compartiments séparés pour votre confort. Si vous préférez plus d'intimité, nos Packs Privés et VIP vous garantissent une nacelle exclusivement réservée pour vous."
    }
];
