import { useState, Fragment, ReactNode } from "react";
import {
    ResponsiveImage,
    Gallery,
    DetailMeta,
    CatalogFilters,
} from "../Components/ContentPresentation";
import AnalyticsConsent, {
    trackConversion,
} from "../Components/AnalyticsConsent";
import ResourcePlayer from "../Components/ResourcePlayer";
import Pagination, { PaginationData } from "../Components/Pagination";
import { RichText } from "../Components/RichText";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    ArrowUpRight,
    ArrowRight,
    Menu,
    X,
    Compass,
    BookOpen,
    Globe,
    Lightbulb,
    MoveUpRight,
    Search,
    Check,
    ChevronDown,
} from "lucide-react";
import { Content, Shared, labels } from "../types";
type Props = {
    related: Content[];
    services: { id: number; type: string; title: string }[];
    catalogFilters: {
        category: string;
        tag: string;
        view: string;
        categories: string[];
        tags: { id: number; slug: string; title: string }[];
    };
    page: string;
    entry?: Content;
    items: Content[];
    settings: Record<string, string>;
    query: string;
    pagination: PaginationData | null;
    registrationOpen: boolean;
    seo: {
        title: string;
        description: string;
        canonical: string;
        image: string | null;
        noindex: boolean;
    };
};
const themes = [
    {
        title: "Liberate your mind.",
        text: "Challenge limiting beliefs. Discover a new way of thinking about what is possible.",
        icon: Lightbulb,
    },
    {
        title: "Transform your life.",
        text: "Connect purpose with practical action, personal growth, and meaningful change.",
        icon: Compass,
    },
    {
        title: "Create a different future.",
        text: "Explore ideas, entrepreneurship, and the foundations of sustainable wealth.",
        icon: Globe,
    },
];
export default function Site({
    page,
    entry,
    items,
    settings,
    query,
    pagination,
    registrationOpen,
    seo,
    related,
    services,
    catalogFilters,
}: Props) {
    const [menu, setMenu] = useState(false);
    const homeThemes = themes.map((t, i) => ({
        ...t,
        title: settings["home_principle_" + (i + 1) + "_title"] || t.title,
        text: settings["home_principle_" + (i + 1) + "_body"] || t.text,
    }));
    const { flash } = usePage<Shared>().props;
    const title =
        entry?.seo_title || entry?.title || labels[page] || "Dr. Rich Global";
    const list = items.filter((x) =>
        page === "search"
            ? ["books", "programmes", "events", "articles", "media"].includes(
                  x.type,
              ) &&
              `${x.title} ${x.body} ${x.excerpt}`
                  .toLowerCase()
                  .includes(query.toLowerCase())
            : x.type ===
              (page === "faq"
                  ? "faqs"
                  : page === "partnerships"
                    ? "partners"
                    : page),
    );
    const pageContent = items.find(
        (x) => x.type === "pages" && x.slug === page,
    );
    const renderHome = () => {
        const blocks: Record<string, ReactNode> = {
            hero: (
                <section className="hero">
                    <div className="hero-copy">
                        <span className="eyebrow">
                            <span />{" "}
                            {settings.home_eyebrow ||
                                "A DIFFERENT FUTURE STARTS WITH YOU"}
                        </span>
                        <h1>
                            {settings.hero_title ? (
                                settings.hero_title
                                    .split("\n")
                                    .map((line, i) => (
                                        <span className="headline-line" key={i}>
                                            {i > 1 ? <em>{line}</em> : line}
                                        </span>
                                    ))
                            ) : (
                                <>
                                    Liberate
                                    <br />
                                    your mind.
                                    <br />
                                    <em>Transform</em>
                                    <br />
                                    <em>your life.</em>
                                </>
                            )}
                        </h1>
                        <p>
                            {settings.hero_description ||
                                "Expand your thinking. Discover your purpose. Turn your potential into lasting impact."}
                        </p>
                        <Link className="button navy" href="/programmes">
                            {settings.home_hero_cta || "Begin your journey"}{" "}
                            <ArrowUpRight size={18} />
                        </Link>
                        <Link className="text-link hero-story" href="/about">
                            <span className="play-circle">
                                <ArrowUpRight size={17} />
                            </span>
                            {settings.home_hero_story_label ||
                                "Discover the vision"}{" "}
                            <span className="muted">of Dr. Rich Global</span>
                        </Link>
                    </div>
                    <div
                        className="hero-art"
                        style={{
                            backgroundImage: `linear-gradient(0deg, #102433bb, transparent 60%), url("${settings.home_hero_image || "/images/mountain-perspective.jpg"}")`,
                        }}
                        role="group"
                        aria-label={
                            settings.home_hero_image_alt ||
                            "Sunlight over a mountain landscape, symbolising a new perspective"
                        }
                    >
                        <div className="art-top">
                            <span className="tiny-star">✦</span>
                            <span>
                                {settings.home_hero_top_label || (
                                    <>
                                        THINK DIFFERENTLY.
                                        <br />
                                        BECOME MORE.
                                    </>
                                )}
                            </span>
                        </div>
                        <div className="hero-quote">
                            <span>
                                {settings.home_hero_quote_label ||
                                    "THE NEXT CHAPTER"}
                            </span>
                            <p>
                                {settings.home_hero_quote || (
                                    <>
                                        Your potential.
                                        <br />A world of possibility.
                                    </>
                                )}
                            </p>
                            <Link
                                href="/vision-mission"
                                className="circle-link"
                                aria-label="Explore our purpose"
                            >
                                <ArrowUpRight />
                            </Link>
                        </div>
                        <div className="image-caption">
                            {settings.home_hero_caption ||
                                "A NEW PERSPECTIVE CHANGES EVERYTHING"}
                        </div>
                    </div>
                </section>
            ),
            journeys: (
                <section className="journey-grid">
                    <Link href="/consultations" className="journey-card dark">
                        <Compass size={30} />
                        <ArrowUpRight className="corner" />
                        <div>
                            <span className="eyebrow">
                                {settings.home_consultation_eyebrow ||
                                    "CLARITY STARTS HERE"}
                            </span>
                            <h3>
                                {settings.home_consultation_title || (
                                    <>
                                        A conversation.
                                        <br />A new direction.
                                    </>
                                )}
                            </h3>
                            <p>
                                {settings.home_consultation_body ||
                                    "Explore personal and business consultations."}
                            </p>
                        </div>
                    </Link>
                    <div className="journey-card pathways">
                        <div className="row-between">
                            <h3>
                                {settings.home_journeys_title ||
                                    "Find your path forward"}
                            </h3>
                            <Link href="/programmes">
                                Explore <ArrowUpRight size={14} />
                            </Link>
                        </div>
                        <div className="mini-grid">
                            {[
                                [
                                    settings.home_pathway_1_title || "Mindset",
                                    settings.home_pathway_1_body ||
                                        "A fresh perspective",
                                    "mind",
                                ],
                                [
                                    settings.home_pathway_2_title ||
                                        "Leadership",
                                    settings.home_pathway_2_body ||
                                        "Lead with purpose",
                                    "lead",
                                ],
                                [
                                    settings.home_pathway_3_title ||
                                        "Entrepreneurship",
                                    settings.home_pathway_3_body ||
                                        "Ideas into possibility",
                                    "enterprise",
                                ],
                            ].map(([t, d, c]) => (
                                <Link
                                    href="/programmes"
                                    className="pathway"
                                    key={t}
                                >
                                    <div className={`path-art ${c}`}>
                                        <span>{t[0]}</span>
                                        <ArrowUpRight size={18} />
                                    </div>
                                    <b>{t}</b>
                                    <span>{d}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <Link href="/speaking" className="journey-card gold">
                        <Globe size={29} />
                        <ArrowUpRight className="corner" />
                        <div>
                            <span className="eyebrow">
                                {settings.home_speaking_eyebrow ||
                                    "IDEAS THAT MOVE PEOPLE"}
                            </span>
                            <h3>
                                {settings.home_speaking_title || (
                                    <>
                                        Bring a new perspective
                                        <br />
                                        to your audience.
                                    </>
                                )}
                            </h3>
                            <p>
                                {settings.home_speaking_body ||
                                    "Invite Dr. Rich to speak."}
                            </p>
                        </div>
                    </Link>
                </section>
            ),
            introduction: (
                <section className="intro section">
                    <div>
                        <span className="eyebrow blue">
                            {settings.home_intro_eyebrow ||
                                "THE HUMAN TRANSFORMATION & WEALTH INSTITUTE"}
                        </span>
                        <h2>
                            {pageContent?.title || (
                                <>
                                    Change begins within.
                                    <br />
                                    <em>Its impact reaches beyond.</em>
                                </>
                            )}
                        </h2>
                    </div>
                    <div>
                        {pageContent?.body ? (
                            <RichText body={pageContent.body} />
                        ) : (
                            <>
                                {" "}
                                <p>
                                    Dr. Rich Global exists at the intersection
                                    of personal transformation,
                                    entrepreneurship, leadership, and wealth
                                    creation.
                                </p>
                                <p className="muted">
                                    From Lusaka, Zambia, our vision is to help
                                    individuals and organisations rethink
                                    possibilities and take purposeful steps
                                    towards a different future.
                                </p>
                            </>
                        )}
                        <Link href="/about" className="text-link">
                            Get to know Dr. Rich Global{" "}
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>
                </section>
            ),
            principles: (
                <section className="principles">
                    {homeThemes.map((t, i) => (
                        <article key={t.title}>
                            <span className="number">0{i + 1}</span>
                            <t.icon size={25} />
                            <h3>{t.title}</h3>
                            <p>{t.text}</p>
                        </article>
                    ))}
                </section>
            ),
            about: settings.home_about_body ? (
                <section className="section home-about">
                    {settings.home_about_image && (
                        <ResponsiveImage
                            src={settings.home_about_image}
                            alt={settings.home_about_alt || "Dr. Rich"}
                        />
                    )}
                    <div>
                        <span className="eyebrow blue">MEET DR. RICH</span>
                        <h2>
                            {settings.home_about_title ||
                                "The person behind the purpose."}
                        </h2>
                        <RichText body={settings.home_about_body} />
                        <Link href="/about" className="text-link">
                            Discover the story <ArrowUpRight size={17} />
                        </Link>
                    </div>
                </section>
            ) : null,
            vision: settings.home_vision_body ? (
                <section className="section">
                    <h2>
                        {settings.home_vision_title || "Our vision & mission"}
                    </h2>
                    <RichText body={settings.home_vision_body} />
                    <Link className="text-link" href="/vision-mission">
                        Explore our purpose <ArrowUpRight size={17} />
                    </Link>
                </section>
            ) : null,
            newsletter: (
                <Newsletter
                    eyebrow={settings.home_newsletter_eyebrow}
                    title={settings.home_newsletter_title}
                    description={settings.home_newsletter_body}
                />
            ),
        };
        for (const type of [
            "programmes",
            "books",
            "events",
            "testimonials",
            "articles",
        ]) {
            const featured = items.filter((x) => x.type === type).slice(0, 3);
            blocks[type] =
                featured.length > 0 ? (
                    <section className="section">
                        <div className="row-between">
                            <h2>
                                {settings["home_" + type + "_title"] ||
                                    (type === "events"
                                        ? "Upcoming experiences"
                                        : labels[type])}
                            </h2>
                            <Link href={"/" + type} className="text-link">
                                View all <ArrowUpRight size={18} />
                            </Link>
                        </div>
                        <div className="content-grid">
                            {featured.map((item) => (
                                <ContentCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                ) : null;
        }
        const order = (
            settings.home_sections ||
            "hero,journeys,introduction,principles,vision,about,programmes,books,events,testimonials,articles,newsletter"
        )
            .split(",")
            .map((x) => x.trim());
        return [...new Set(order)].map((key) => (
            <Fragment key={key}>{blocks[key]}</Fragment>
        ));
    };
    return (
        <>
            <Head
                title={
                    page === "home"
                        ? "Liberate your mind. Transform your life."
                        : title
                }
            >
                <meta
                    head-key="robots"
                    name="robots"
                    content={seo.noindex ? "noindex,follow" : "index,follow"}
                />
                <meta
                    head-key="description"
                    name="description"
                    content={seo.description}
                />
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={seo.canonical}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content={seo.title}
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={seo.description}
                />
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={seo.canonical}
                />
                {seo.image && (
                    <meta
                        head-key="og:image"
                        property="og:image"
                        content={seo.image}
                    />
                )}
            </Head>
            <div className="site-shell">
                <header className="public-header">
                    <Link href="/" aria-label="Dr. Rich Global home">
                        <img
                            className="brand"
                            src="/drlogo.png"
                            alt="Dr. Rich Global — Human Transformation and Wealth Institute"
                        />
                    </Link>
                    <nav className={menu ? "public-nav open" : "public-nav"}>
                        {[
                            ["/about", "Our story"],
                            ["/programmes", "Programmes"],
                            ["/books", "Books"],
                            ["/articles", "Insights"],
                        ].map(([url, label]) => (
                            <Link
                                key={url}
                                href={url}
                                onClick={() => setMenu(false)}
                            >
                                {label}
                            </Link>
                        ))}
                        <Link href="/search" aria-label="Search">
                            <Search size={17} />
                        </Link>
                    </nav>
                    <Link
                        className="button small navy header-cta"
                        href="/consultations"
                    >
                        Let’s connect <ArrowUpRight size={16} />
                    </Link>
                    <button
                        className="mobile-toggle icon-button"
                        aria-label="Toggle navigation"
                        aria-expanded={menu}
                        onClick={() => setMenu(!menu)}
                    >
                        {menu ? <X /> : <Menu />}
                    </button>
                </header>
                {flash.success && (
                    <div className="notice" role="status">
                        <Check size={18} />
                        {flash.success}
                    </div>
                )}
                {page === "home" ? (
                    renderHome()
                ) : (
                    <main className="inner-main">
                        <div className="breadcrumbs">
                            <Link href="/">Home</Link>
                            <span>/</span>
                            {labels[page]}
                        </div>
                        <div className="page-heading">
                            <span className="eyebrow blue">
                                DR. RICH GLOBAL
                            </span>
                            <h1>
                                {entry?.title || pageContent?.title || title}
                            </h1>
                            <p>
                                {entry?.excerpt ||
                                    pageContent?.excerpt ||
                                    (
                                        {
                                            about: "A vision for human transformation, purposeful leadership, and sustainable wealth creation.",
                                            programmes:
                                                "Make room for growth. Discover experiences that connect new thinking with practical action.",
                                            books: "Ideas to challenge your thinking and inspire your next chapter.",
                                            consultations:
                                                "Create space to think clearly about your next step.",
                                            speaking:
                                                "Start a conversation about bringing transformative ideas to your audience.",
                                            events: "Connect, learn, and grow through meaningful experiences.",
                                            articles:
                                                "Fresh perspectives on mindset, purpose, leadership, and entrepreneurship.",
                                            media: "Explore teachings, conversations, and resources.",
                                        } as Record<string, string>
                                    )[page]}
                            </p>
                        </div>
                        {!entry && (
                            <CatalogFilters
                                page={page}
                                filters={catalogFilters}
                                query={query}
                            />
                        )}
                        {entry ? (
                            <>
                                <article className="article-body">
                                    {entry.image && (
                                        <ResponsiveImage
                                            className="detail-image"
                                            src={entry.image}
                                            alt={entry.alt_text || entry.title}
                                        />
                                    )}
                                    <RichText body={entry.body} />
                                    <DetailMeta entry={entry} />
                                    {page === "media" && entry.external_url && (
                                        <ResourcePlayer
                                            url={entry.external_url}
                                            title={entry.title}
                                        />
                                    )}
                                    {entry.external_url && (
                                        <a
                                            href={entry.external_url}
                                            className="button navy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() =>
                                                trackConversion(
                                                    page === "books"
                                                        ? "book_purchase_click"
                                                        : page === "programmes"
                                                          ? "programme_registration_click"
                                                          : page === "events"
                                                            ? "event_registration_click"
                                                            : "resource_click",
                                                )
                                            }
                                        >
                                            {page === "books"
                                                ? entry.status === "forthcoming"
                                                    ? "Pre-order / learn more"
                                                    : "Purchase book"
                                                : [
                                                        "programmes",
                                                        "events",
                                                    ].includes(page)
                                                  ? "External registration"
                                                  : "Open resource"}
                                            <ArrowUpRight size={18} />
                                        </a>
                                    )}
                                </article>
                                {related.length > 0 && (
                                    <section className="related-section">
                                        <h2>Continue exploring</h2>
                                        <div className="content-grid">
                                            {related.map((item) => (
                                                <ContentCard
                                                    key={item.id}
                                                    item={item}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {["books", "programmes", "events"].includes(
                                    page,
                                ) &&
                                    (registrationOpen ? (
                                        <Enquiry
                                            type={
                                                page === "books"
                                                    ? "book"
                                                    : page === "events"
                                                      ? "event"
                                                      : "programme"
                                            }
                                            contentId={entry.id}
                                            services={services}
                                        />
                                    ) : (
                                        <div className="empty-state">
                                            <h3>
                                                Registration is currently
                                                closed.
                                            </h3>
                                            <p>
                                                Contact our team for upcoming
                                                opportunities.
                                            </p>
                                            <Link
                                                className="button navy"
                                                href="/contact"
                                            >
                                                Get in touch
                                            </Link>
                                        </div>
                                    ))}
                            </>
                        ) : (
                            <>
                                {pageContent?.body && (
                                    <div className="prose article-body">
                                        <RichText body={pageContent.body} />
                                        <Gallery
                                            details={pageContent.details || {}}
                                        />
                                    </div>
                                )}
                                {[
                                    "consultations",
                                    "speaking",
                                    "contact",
                                    "partnerships",
                                ].includes(page) ? (
                                    <div>
                                        <div className="service-topics">
                                            {items
                                                .filter((x) =>
                                                    [
                                                        "consultation-services",
                                                        "speaking-topics",
                                                        "partners",
                                                    ].includes(x.type),
                                                )
                                                .map((x) => (
                                                    <article key={x.id}>
                                                        <h3>{x.title}</h3>
                                                        <RichText
                                                            body={
                                                                x.body ||
                                                                x.excerpt
                                                            }
                                                        />
                                                    </article>
                                                ))}
                                        </div>
                                        <div className="contact-grid">
                                            <aside>
                                                <span className="eyebrow">
                                                    LET’S TAKE THE NEXT STEP
                                                </span>
                                                <h2>
                                                    {page === "speaking"
                                                        ? "Ideas worth sharing."
                                                        : "Your next chapter starts with a conversation."}
                                                </h2>
                                                <p>
                                                    Tell us a little about
                                                    yourself and what you have
                                                    in mind. Our team will
                                                    follow up to discuss the
                                                    next steps.
                                                </p>
                                                <div className="contact-detail">
                                                    <Globe size={19} />
                                                    {settings.location ||
                                                        "Lusaka, Zambia"}
                                                </div>
                                                {settings.contact_email && (
                                                    <a
                                                        className="text-link"
                                                        href={
                                                            "mailto:" +
                                                            settings.contact_email
                                                        }
                                                    >
                                                        {settings.contact_email}
                                                    </a>
                                                )}
                                                {settings.whatsapp && (
                                                    <a
                                                        className="button outline"
                                                        href={
                                                            "https://wa.me/" +
                                                            settings.whatsapp +
                                                            "?text=" +
                                                            encodeURIComponent(
                                                                "Hello Dr. Rich Global, I would like to make an enquiry.",
                                                            )
                                                        }
                                                        onClick={() =>
                                                            trackConversion(
                                                                "whatsapp_click",
                                                            )
                                                        }
                                                    >
                                                        Chat on WhatsApp{" "}
                                                        <ArrowUpRight
                                                            size={16}
                                                        />
                                                    </a>
                                                )}
                                            </aside>
                                            <Enquiry
                                                services={services}
                                                type={
                                                    page === "consultations"
                                                        ? "consultation"
                                                        : page === "speaking"
                                                          ? "speaking"
                                                          : page ===
                                                              "partnerships"
                                                            ? "partnership"
                                                            : "contact"
                                                }
                                            />
                                        </div>
                                    </div>
                                ) : page === "community" ? (
                                    <>
                                        <Newsletter />
                                        {settings.community_url && (
                                            <a
                                                className="button navy"
                                                href={settings.community_url}
                                                onClick={() =>
                                                    trackConversion(
                                                        "whatsapp_click",
                                                    )
                                                }
                                            >
                                                Join our WhatsApp community{" "}
                                                <ArrowUpRight size={18} />
                                            </a>
                                        )}
                                    </>
                                ) : page === "about" ||
                                  page === "vision-mission" ? (
                                    <>
                                        <div className="about-banner">
                                            <span>THINK. BECOME. CREATE.</span>
                                            <h2>
                                                We believe a different future
                                                <br />
                                                begins with a liberated mind.
                                            </h2>
                                        </div>
                                        <div className="principles">
                                            {themes.map((t) => (
                                                <article key={t.title}>
                                                    <t.icon />
                                                    <h3>{t.title}</h3>
                                                    <p>{t.text}</p>
                                                </article>
                                            ))}
                                        </div>
                                        <Link
                                            className="button navy"
                                            href="/contact"
                                        >
                                            Connect with us{" "}
                                            <ArrowUpRight size={18} />
                                        </Link>
                                    </>
                                ) : page === "faq" ? (
                                    <div className="faq-list">
                                        {list.length ? (
                                            list.map((x) => (
                                                <details key={x.id}>
                                                    <summary>
                                                        {x.title}
                                                        <ChevronDown
                                                            size={18}
                                                        />
                                                    </summary>
                                                    <RichText body={x.body} />
                                                </details>
                                            ))
                                        ) : (
                                            <Empty text="Have a question about our work? Our team is here to help." />
                                        )}
                                    </div>
                                ) : [
                                      "privacy-policy",
                                      "terms",
                                      "cookie-policy",
                                      "disclaimer",
                                      "refund-policy",
                                  ].includes(page) ? (
                                    !pageContent && (
                                        <Empty text="This policy is being prepared for publication. Please contact us with any questions before submitting personal information." />
                                    )
                                ) : (
                                    <>
                                        {page === "search" && (
                                            <form
                                                action="/search"
                                                className="search-form"
                                            >
                                                <Search />
                                                <input
                                                    name="q"
                                                    aria-label="Search library"
                                                    defaultValue={query}
                                                    placeholder="Search books, programmes, articles…"
                                                />
                                                <button className="button navy">
                                                    Search
                                                </button>
                                            </form>
                                        )}
                                        {list.length ? (
                                            <div className="content-grid">
                                                {list.map((item) => (
                                                    <ContentCard
                                                        key={item.id}
                                                        item={item}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <Empty
                                                text={
                                                    page === "search"
                                                        ? "No published results match your search. Try another keyword."
                                                        : "A new chapter is taking shape. Published updates will appear here as they become available."
                                                }
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        )}
                        <Pagination data={pagination} />
                    </main>
                )}
                <AnalyticsConsent measurementId={settings.analytics_id} />
                <footer>
                    <div className="footer-top">
                        <img src="/drlogo.png" alt="Dr. Rich Global" />
                        <p>
                            Liberating minds. Transforming lives.
                            <br />
                            Creating wealth.
                        </p>
                        <Link className="button navy" href="/contact">
                            {settings.home_final_cta ||
                                "Let’s build a different future"}{" "}
                            <ArrowUpRight size={18} />
                        </Link>
                    </div>
                    <div className="footer-links">
                        {[
                            "about",
                            "vision-mission",
                            "programmes",
                            "books",
                            "events",
                            "media",
                            "social-impact",
                            "partnerships",
                            "faq",
                            "contact",
                        ].map((p) => (
                            <Link key={p} href={"/" + p}>
                                {labels[p]}
                            </Link>
                        ))}
                    </div>
                    {settings.analytics_id && (
                        <button
                            className="text-link"
                            onClick={() =>
                                window.dispatchEvent(
                                    new Event("privacy-choices"),
                                )
                            }
                        >
                            Privacy choices
                        </button>
                    )}
                    <div className="social-links">
                        {["instagram", "facebook", "linkedin", "youtube"]
                            .filter((key) => settings[key])
                            .map((key) => (
                                <a
                                    key={key}
                                    href={settings[key]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {key}
                                    <ArrowUpRight size={13} />
                                </a>
                            ))}
                    </div>
                    <div className="footer-bottom">
                        <span>
                            © {new Date().getFullYear()} Dr. Rich Global ·{" "}
                            {settings.location || "Lusaka, Zambia"}
                        </span>
                        <div>
                            {[
                                "privacy-policy",
                                "terms",
                                "cookie-policy",
                                "disclaimer",
                                "refund-policy",
                            ].map((p) => (
                                <Link key={p} href={"/" + p}>
                                    {labels[p]}
                                </Link>
                            ))}
                            <Link href="/admin">
                                Admin <ArrowUpRight size={12} />
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
function ContentCard({ item }: { item: Content }) {
    return (
        <Link
            className="content-card"
            href={
                "/" +
                (item.type === "partners" ? "partnerships" : item.type) +
                "/" +
                item.slug
            }
        >
            {item.image ? (
                <ResponsiveImage
                    src={item.image}
                    alt={item.alt_text || item.title}
                    loading="lazy"
                />
            ) : (
                <div className="card-placeholder">
                    <BookOpen size={38} />
                    <span>DR. RICH GLOBAL</span>
                </div>
            )}
            <div className="card-body">
                <span className="eyebrow blue">
                    {item.category || item.type}
                </span>
                {item.status === "forthcoming" && (
                    <span className="badge forthcoming">Forthcoming</span>
                )}
                <h3>{item.title}</h3>
                {item.type === "events" && item.event_starts_at && (
                    <p>
                        {new Date(item.event_starts_at).toLocaleDateString(
                            "en",
                            {
                                dateStyle: "long",
                                timeZone:
                                    item.details?.timezone || "Africa/Lusaka",
                            },
                        )}
                    </p>
                )}
                {item.type === "testimonials" && (
                    <blockquote>
                        <RichText body={item.body} />
                        <cite>
                            {[
                                item.details?.person_name,
                                item.details?.position,
                                item.details?.organisation,
                            ]
                                .filter(Boolean)
                                .join(" · ")}
                        </cite>
                    </blockquote>
                )}
                <p>{item.excerpt}</p>
                <span className="text-link">
                    Discover more <ArrowUpRight size={18} />
                </span>
            </div>
        </Link>
    );
}
function Empty({ text }: { text: string }) {
    return (
        <div className="empty-state">
            <Compass size={30} />
            <h3>There’s more ahead.</h3>
            <p>{text}</p>
            <Link className="text-link" href="/contact">
                Get in touch <ArrowUpRight size={17} />
            </Link>
        </div>
    );
}
function Newsletter({
    title,
    eyebrow,
    description,
}: { title?: string; description?: string; eyebrow?: string } = {}) {
    const f = useForm({ email: "", consent: false, website: "" });
    return (
        <section className="newsletter">
            <div>
                <span className="eyebrow">{eyebrow || "KEEP GROWING"}</span>
                <h2>
                    {title || (
                        <>
                            A little inspiration.
                            <br />
                            <em>A new possibility.</em>
                        </>
                    )}
                </h2>
                <p>
                    {description ||
                        "Join our community for ideas, insights, and upcoming experiences."}
                </p>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    f.post("/subscribe", {
                        preserveScroll: true,
                        onSuccess: () => {
                            f.reset();
                            trackConversion("newsletter_subscribe");
                        },
                    });
                }}
            >
                <label htmlFor="newsletter-email">Your email address</label>
                <div className="newsletter-field">
                    <input
                        id="newsletter-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={f.data.email}
                        onChange={(e) => f.setData("email", e.target.value)}
                    />
                    <button disabled={f.processing} aria-label="Subscribe">
                        <ArrowRight />
                    </button>
                </div>
                <label className="check-label">
                    <input
                        type="checkbox"
                        required
                        checked={f.data.consent}
                        onChange={(e) => f.setData("consent", e.target.checked)}
                    />
                    I agree to receive email updates and the{" "}
                    <Link href="/privacy-policy">privacy policy</Link>.
                </label>
                <input
                    className="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    name="website"
                    value={f.data.website}
                    onChange={(e) => f.setData("website", e.target.value)}
                />
                {Object.values(f.errors).map((x) => (
                    <p role="alert" className="error" key={x}>
                        {x}
                    </p>
                ))}
            </form>
        </section>
    );
}
function Enquiry({
    type,
    contentId,
    services = [],
}: {
    type: string;
    contentId?: number;
    services?: Props["services"];
}) {
    const f = useForm({
        type,
        name: "",
        email: "",
        phone: "",
        message: "",
        consent: false,
        website: "",
        content_id: contentId || "",
        details: {
            country: "",
            organisation: "",
            category: "",
            preferred_date: "",
            method: "Virtual",
            event_name: "",
            event_location: "",
            expected_audience: "",
            requester_type: "Individual",
            proposed_topic: "",
            enquiry_category: "General",
            subject: "",
        },
    });
    return (
        <form
            className="enquiry-form"
            onSubmit={(e) => {
                e.preventDefault();
                f.post("/enquiries", {
                    preserveScroll: true,
                    onSuccess: () => {
                        f.reset();
                        trackConversion(
                            (
                                {
                                    speaking: "speaking_invitation_submit",
                                    event: "event_registration_submit",
                                    programme: "programme_registration_submit",
                                } as Record<string, string>
                            )[type] || type + "_submit",
                        );
                    },
                });
            }}
        >
            <h3>
                {type === "event" || type === "programme"
                    ? "Register your interest"
                    : "Tell us what you have in mind"}
            </h3>
            <div className="form-grid">
                {[
                    ["name", "Full name", "text"],
                    ["email", "Email address", "email"],
                    ["phone", "WhatsApp / phone", "tel"],
                ].map(([key, label, t]) => (
                    <label key={key}>
                        {label}
                        <input
                            type={t}
                            required={key !== "phone"}
                            value={f.data[key as "name"]}
                            onChange={(e) =>
                                f.setData(key as "name", e.target.value)
                            }
                        />
                    </label>
                ))}
                <label>
                    Country
                    <input
                        value={f.data.details.country}
                        onChange={(e) =>
                            f.setData("details", {
                                ...f.data.details,
                                country: e.target.value,
                            })
                        }
                    />
                </label>
                {["consultation", "speaking", "partnership"].includes(type) && (
                    <label>
                        Organisation (if applicable)
                        <input
                            value={f.data.details.organisation}
                            onChange={(e) =>
                                f.setData("details", {
                                    ...f.data.details,
                                    organisation: e.target.value,
                                })
                            }
                        />
                    </label>
                )}
                {type === "consultation" && (
                    <label>
                        Requesting as
                        <select
                            value={f.data.details.requester_type}
                            onChange={(e) =>
                                f.setData("details", {
                                    ...f.data.details,
                                    requester_type: e.target.value,
                                })
                            }
                        >
                            <option>Individual</option>
                            <option>Organisation</option>
                        </select>
                    </label>
                )}
                {type === "contact" && (
                    <>
                        <label>
                            Enquiry category
                            <select
                                value={f.data.details.enquiry_category}
                                onChange={(e) =>
                                    f.setData("details", {
                                        ...f.data.details,
                                        enquiry_category: e.target.value,
                                    })
                                }
                            >
                                {[
                                    "General",
                                    "Consultation",
                                    "Speaking",
                                    "Events",
                                    "Media",
                                    "Partnerships",
                                    "Book enquiries",
                                ].map((x) => (
                                    <option key={x}>{x}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Subject
                            <input
                                value={f.data.details.subject}
                                onChange={(e) =>
                                    f.setData("details", {
                                        ...f.data.details,
                                        subject: e.target.value,
                                    })
                                }
                            />
                        </label>
                    </>
                )}
                {type === "speaking" && (
                    <>
                        <label>
                            Proposed topic
                            <input
                                list="speaking-topics"
                                value={f.data.details.proposed_topic}
                                onChange={(e) =>
                                    f.setData("details", {
                                        ...f.data.details,
                                        proposed_topic: e.target.value,
                                    })
                                }
                            />
                            <datalist id="speaking-topics">
                                {services
                                    .filter((x) => x.type === "speaking-topics")
                                    .map((x) => (
                                        <option key={x.id} value={x.title} />
                                    ))}
                            </datalist>
                        </label>
                        <label>
                            Engagement format
                            <select
                                value={f.data.details.method}
                                onChange={(e) =>
                                    f.setData("details", {
                                        ...f.data.details,
                                        method: e.target.value,
                                    })
                                }
                            >
                                <option>Virtual</option>
                                <option>In person</option>
                            </select>
                        </label>
                    </>
                )}
                {type === "consultation" && (
                    <>
                        <label>
                            Area of interest
                            <select
                                value={f.data.details.category}
                                onChange={(e) =>
                                    f.setData("details", {
                                        ...f.data.details,
                                        category: e.target.value,
                                    })
                                }
                            >
                                <option value="">Choose an area</option>
                                {[
                                    ...services
                                        .filter(
                                            (x) =>
                                                x.type ===
                                                "consultation-services",
                                        )
                                        .map((x) => x.title),
                                    "Personal transformation",
                                    "Financial mindset",
                                    "Idea development",
                                    "Entrepreneurship",
                                    "Business strategy",
                                    "Leadership",
                                    "Organisational transformation",
                                ].map((x) => (
                                    <option key={x}>{x}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Preferred date
                            <input
                                type="date"
                                value={f.data.details.preferred_date}
                                onChange={(e) =>
                                    f.setData("details", {
                                        ...f.data.details,
                                        preferred_date: e.target.value,
                                    })
                                }
                            />
                        </label>
                        <label>
                            Consultation method
                            <select
                                value={f.data.details.method}
                                onChange={(e) =>
                                    f.setData("details", {
                                        ...f.data.details,
                                        method: e.target.value,
                                    })
                                }
                            >
                                <option>Virtual</option>
                                <option>In person</option>
                            </select>
                        </label>
                    </>
                )}
                {type === "speaking" && (
                    <>
                        {[
                            ["event_name", "Event name", "text"],
                            ["preferred_date", "Event date", "date"],
                            ["event_location", "Event location", "text"],
                            [
                                "expected_audience",
                                "Expected audience",
                                "number",
                            ],
                        ].map(([k, l, t]) => (
                            <label key={k}>
                                {l}
                                <input
                                    type={t}
                                    value={f.data.details[k as "event_name"]}
                                    onChange={(e) =>
                                        f.setData("details", {
                                            ...f.data.details,
                                            [k]: e.target.value,
                                        })
                                    }
                                />
                            </label>
                        ))}
                    </>
                )}
            </div>
            <label>
                {type === "consultation"
                    ? "What would you like guidance with?"
                    : "Your message"}
                <textarea
                    required
                    minLength={10}
                    rows={5}
                    value={f.data.message}
                    onChange={(e) => f.setData("message", e.target.value)}
                    placeholder="Share a little context so we can help…"
                />
            </label>
            <label className="check-label">
                <input
                    type="checkbox"
                    required
                    checked={f.data.consent}
                    onChange={(e) => f.setData("consent", e.target.checked)}
                />
                I consent to being contacted about this request and agree to the{" "}
                <Link href="/privacy-policy">privacy policy</Link>.
            </label>
            <input
                className="honeypot"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={f.data.website}
                onChange={(e) => f.setData("website", e.target.value)}
            />
            {Object.values(f.errors).map((x) => (
                <p className="error" role="alert" key={x}>
                    {x}
                </p>
            ))}
            <button className="button navy" disabled={f.processing}>
                {f.processing ? "Sending…" : "Send request"}
                <ArrowUpRight size={17} />
            </button>
        </form>
    );
}
