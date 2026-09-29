import { Link, usePage } from "@inertiajs/react";
import { Content } from "../types";
import { RichText } from "./RichText";
import { trackConversion } from "./AnalyticsConsent";
export function ResponsiveImage({
    src,
    alt,
    className,
    loading = "lazy",
}: {
    src: string;
    alt: string;
    className?: string;
    loading?: "lazy" | "eager";
}) {
    const props = usePage().props as {
        mediaVariants?: Record<string, { url: string; width: number }[]>;
    };
    const variants = props.mediaVariants?.[src];
    return (
        <img
            className={className}
            src={src}
            alt={alt}
            loading={loading}
            srcSet={variants?.map((v) => `${v.url} ${v.width}w`).join(", ")}
            sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 800px"
        />
    );
}
export function Gallery({ details }: { details: Record<string, string> }) {
    const images = (details.gallery || "")
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
    const descriptions = (details.gallery_alt || "").split("\n");
    return images.length > 0 ? (
        <section className="gallery-section">
            <h3>Photo gallery</h3>
            <div className="photo-gallery">
                {images.map((src, i) => (
                    <a
                        href={src}
                        key={src + i}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ResponsiveImage
                            src={src}
                            alt={
                                descriptions[i] || `Gallery photograph ${i + 1}`
                            }
                        />
                        {descriptions[i] && <span>{descriptions[i]}</span>}
                    </a>
                ))}
            </div>
        </section>
    ) : null;
}
export function DetailMeta({ entry }: { entry: Content }) {
    const d = entry.details || {};
    const facts = [
        ["duration", "Duration"],
        ["format", "Delivery"],
        ["fee", "Participation fee"],
        ["venue", "Venue"],
        ["virtual_platform", "Online venue"],
        ["audience", "Who it’s for"],
        ["outcomes", "What you’ll learn"],
        ["major_lessons", "Major lessons"],
    ] as const;
    function eventDate(value: string) {
        try {
            return new Intl.DateTimeFormat("en", {
                dateStyle: "long",
                timeStyle: "short",
                timeZone: d.timezone || "Africa/Lusaka",
            }).format(new Date(value));
        } catch {
            return value;
        }
    }
    return (
        <>
            <div className="content-meta">
                {entry.status === "forthcoming" && (
                    <span className="badge forthcoming">
                        Forthcoming publication
                    </span>
                )}
                {d.author_name && <span>By {d.author_name}</span>}
                {entry.type === "articles" && entry.published_at && (
                    <time dateTime={entry.published_at}>
                        {new Date(entry.published_at).toLocaleDateString("en", {
                            dateStyle: "long",
                        })}
                    </time>
                )}
                {entry.tags?.map((t) => (
                    <Link
                        key={t.id}
                        className="badge"
                        href={`/${entry.type}?tag=${encodeURIComponent(t.slug)}`}
                    >
                        {t.title}
                    </Link>
                ))}
            </div>
            {entry.type === "events" && entry.event_starts_at && (
                <div className="event-dates">
                    <b>{eventDate(entry.event_starts_at)}</b>
                    {entry.event_ends_at && (
                        <span> — {eventDate(entry.event_ends_at)}</span>
                    )}
                    <small> {d.timezone || "Africa/Lusaka"}</small>
                </div>
            )}
            {facts.some(([k]) => d[k]) && (
                <dl className="detail-facts">
                    {facts
                        .filter(([k]) => d[k])
                        .map(([k, label]) => (
                            <div key={k}>
                                <dt>{label}</dt>
                                <dd>
                                    {k === "fee" ? (
                                        `${d.currency || ""} ${d[k]}`
                                    ) : (
                                        <RichText body={d[k]} />
                                    )}
                                </dd>
                            </div>
                        ))}
                </dl>
            )}
            {entry.type === "testimonials" && (
                <div className="testimonial-attribution">
                    <b>{d.person_name || entry.title}</b>
                    <p>
                        {[d.position, d.organisation]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>
                </div>
            )}
            {d.whatsapp_url && (
                <a
                    className="button outline"
                    href={d.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackConversion("whatsapp_click")}
                >
                    Join the conversation ↗
                </a>
            )}
            <Gallery details={d} />
        </>
    );
}
export function CatalogFilters({
    page,
    filters,
    query,
}: {
    page: string;
    query: string;
    filters: {
        category: string;
        tag: string;
        view: string;
        categories: string[];
        tags: { id: number; slug: string; title: string }[];
    };
}) {
    if (
        ![
            "articles",
            "books",
            "programmes",
            "events",
            "media",
            "search",
        ].includes(page)
    )
        return null;
    return (
        <form action={"/" + page} className="catalog-filters">
            {query && <input type="hidden" name="q" value={query} />}
            <label>
                Category
                <select name="category" defaultValue={filters.category}>
                    <option value="">All categories</option>
                    {filters.categories.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>
            </label>
            {filters.tags.length > 0 && (
                <label>
                    Tag
                    <select name="tag" defaultValue={filters.tag}>
                        <option value="">All tags</option>
                        {filters.tags.map((t) => (
                            <option value={t.slug} key={t.id}>
                                {t.title}
                            </option>
                        ))}
                    </select>
                </label>
            )}
            {page === "events" && (
                <label>
                    Events
                    <select name="view" defaultValue={filters.view}>
                        <option value="upcoming">Upcoming events</option>
                        <option value="past">Past events</option>
                    </select>
                </label>
            )}
            <button className="button small navy">Apply filters</button>
        </form>
    );
}
