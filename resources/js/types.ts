export interface Content {
    id: number;
    type: string;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    category: string;
    category_id?: number | null;
    status: string;
    featured: boolean;
    display_order: number;
    image: string;
    alt_text: string;
    external_url: string;
    seo_title: string;
    meta_description: string;
    canonical_url: string;
    noindex: boolean;
    event_starts_at?: string;
    event_ends_at?: string;
    tags?: { id: number; title: string; slug: string }[];
    related?: { id: number; type: string; title: string; slug: string }[];
    published_at: string;
    details: Record<string, string>;
    created_at: string;
}
export interface Submission {
    id: number;
    type: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    admin_notes: string;
    details: Record<string, string>;
    created_at: string;
}
export interface Shared {
    auth: {
        user: { id: number; name: string; email: string; role: string } | null;
    };
    flash: { success?: string };
    [key: string]: unknown;
}
export const labels: Record<string, string> = {
    home: "Home",
    about: "About Dr. Rich",
    "vision-mission": "Our purpose",
    books: "Books & publications",
    programmes: "Programmes & masterclasses",
    consultations: "Consultations",
    speaking: "Speaking engagements",
    events: "Events & experiences",
    articles: "Articles & insights",
    media: "Media & resources",
    "social-impact": "Social impact",
    testimonials: "Stories of transformation",
    partnerships: "Partnerships",
    community: "Join the community",
    contact: "Let’s start a conversation",
    faq: "Frequently asked questions",
    "privacy-policy": "Privacy policy",
    terms: "Terms & conditions",
    "cookie-policy": "Cookie policy",
    disclaimer: "Disclaimer",
    "refund-policy": "Refund & cancellation policy",
    search: "Explore our library",
};
