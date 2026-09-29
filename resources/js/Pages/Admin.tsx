import SiteSettings from "../Components/SiteSettings";
import ContentFields, {
    ContentRelations,
    ContentDetails,
} from "../Components/ContentFields";
import { useState, useEffect } from "react";
import Pagination, { PaginationData } from "../Components/Pagination";
import UserManager from "../Components/UserManager";
import { RichEditor } from "../Components/RichText";
import { useModal } from "../Hooks/useModal";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    ArrowUpRight,
    Plus,
    Search,
    LayoutDashboard,
    BookOpen,
    CalendarDays,
    FileText,
    Inbox,
    Settings,
    LogOut,
    Globe,
    Users,
    Image,
    ChevronRight,
    X,
    Save,
    Trash2,
    Upload,
    Check,
    Activity,
    GraduationCap,
    MessageCircle,
} from "lucide-react";
import { Content, Submission, Shared } from "../types";
type Props = {
    relatedOptions: Pick<Content, "id" | "type" | "title">[];
    homeCopyFields: Record<string, { label: string; default: string }>;
    section: string;
    pagination: PaginationData | null;
    filters: { q: string; status: string };
    taxonomy: { id: number; type: string; title: string }[];
    stats: {
        published: number;
        drafts: number;
        new_enquiries: number;
        subscribers: number;
        chart: { label: string; count: number }[];
    };
    contents: Content[];
    submissions: Submission[];
    subscribers: {
        id: number;
        email: string;
        created_at: string;
        status: string;
    }[];
    mediaAssets: {
        id: number;
        name: string;
        path: string;
        mime_type: string;
        size: number;
        alt_text: string;
    }[];
    settings: Record<string, string>;
    activity: {
        id: number;
        action: string;
        subject: string;
        created_at: string;
    }[];
    users: { id: number; name: string; email: string; role: string }[];
};
const modules = [
    ["dashboard", "Overview", LayoutDashboard],
    ["pages", "Site content", FileText],
    ["books", "Books", BookOpen],
    ["programmes", "Programmes", GraduationCap],
    ["events", "Events", CalendarDays],
    ["articles", "Articles", FileText],
    ["media", "Media library", Image],
    ["inbox", "Enquiries", Inbox],
    ["subscribers", "Community", Users],
    ["testimonials", "Testimonials", MessageCircle],
    ["partners", "Partners", Globe],
    ["social-impact", "Social impact", Globe],
    ["faqs", "FAQs", MessageCircle],
    ["consultation-services", "Consultation services", MessageCircle],
    ["speaking-topics", "Speaking topics", MessageCircle],
    ["categories", "Categories", FileText],
    ["tags", "Tags", FileText],
    ["activity", "Activity log", Activity],
    ["settings", "Settings", Settings],
    ["users", "Administrators", Users],
] as const;
const empty = {
    type: "articles",
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    category: "",
    category_id: "" as number | string,
    status: "draft",
    featured: false,
    display_order: 0,
    image: "",
    alt_text: "",
    external_url: "",
    seo_title: "",
    meta_description: "",
    canonical_url: "",
    noindex: false,
    tag_ids: [] as number[],
    related_ids: [] as number[],
    published_at: "",
    details: {} as ContentDetails,
};
export default function Admin(p: Props) {
    const {
        section,
        contents,
        submissions,
        subscribers,
        settings,
        activity,
        users,
        pagination,
        stats,
        filters,
        taxonomy,
        mediaAssets,
        relatedOptions,
    } = p;
    const { auth, flash } = usePage<Shared>().props;
    const [search, setSearch] = useState(filters.q);
    const [filter, setFilter] = useState(filters.status);
    useEffect(() => {
        if (search === filters.q && filter === filters.status) return;
        const timeout = setTimeout(
            () =>
                router.get(
                    "/admin/" + section,
                    { q: search, status: filter },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                ),
            350,
        );
        return () => clearTimeout(timeout);
    }, [search, filter, section]);
    const [edit, setEdit] = useState<Content | null | undefined>(undefined);
    const [selected, setSelected] = useState<Submission | null>(null);
    const title = modules.find((m) => m[0] === section)?.[1] || section;
    const published = stats.published;
    const pending = stats.drafts;
    const newLeads = stats.new_enquiries;
    const rows = contents.filter(
        (c) =>
            c.type === section &&
            (filter === "all" || c.status === filter) &&
            `${c.title} ${c.category}`
                .toLowerCase()
                .includes(search.toLowerCase()),
    );
    return (
        <>
            <Head title={`${title} · Admin`} />
            <div className="admin-shell">
                <header className="admin-header">
                    <Link href="/admin">
                        <img src="/drlogo.png" alt="Dr. Rich Global" />
                    </Link>
                    <nav>
                        {modules.slice(0, 7).map(([key, label]) => (
                            <Link
                                key={key}
                                className={section === key ? "active" : ""}
                                href={"/admin/" + key}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                    <Link className="icon-button" href="/" title="View website">
                        <ArrowUpRight size={19} />
                    </Link>
                    <button
                        className="icon-button"
                        title="Sign out"
                        onClick={() => router.post("/admin/logout")}
                    >
                        <LogOut size={18} />
                    </button>
                    <span className="avatar" title={auth.user?.name}>
                        {auth.user?.name.charAt(0)}
                    </span>
                </header>
                <div className="admin-layout">
                    <aside className="admin-sidebar">
                        <span className="eyebrow">WORKSPACE</span>
                        {modules
                            .filter(
                                ([k]) =>
                                    !["settings", "users"].includes(k) ||
                                    auth.user?.role === "super_admin",
                            )
                            .map(([key, label, Icon]) => (
                                <Link
                                    key={key}
                                    className={section === key ? "active" : ""}
                                    href={"/admin/" + key}
                                >
                                    <Icon size={17} />
                                    {label}
                                    {key === "inbox" && newLeads > 0 && (
                                        <small>{newLeads}</small>
                                    )}
                                </Link>
                            ))}
                        <div className="sidebar-note">
                            <span>✦</span>
                            <b>A different future.</b>
                            <p>One meaningful connection at a time.</p>
                        </div>
                    </aside>
                    <main className="admin-main">
                        {flash.success && (
                            <div className="notice" role="status">
                                <Check size={16} />
                                {flash.success}
                            </div>
                        )}
                        <div className="admin-title">
                            <div>
                                <span className="eyebrow muted">
                                    YOUR INSTITUTE, AT A GLANCE
                                </span>
                                <h1>
                                    {section === "dashboard"
                                        ? "Welcome back, " +
                                          (auth.user?.name.split(" ")[0] ||
                                              "Administrator") +
                                          "."
                                        : title}
                                </h1>
                                <p>
                                    {section === "dashboard"
                                        ? "Here’s what’s happening at Dr. Rich Global."
                                        : "Manage your " +
                                          title.toLowerCase() +
                                          " in one place."}
                                </p>
                            </div>
                            {![
                                "inbox",
                                "subscribers",
                                "settings",
                                "activity",
                                "users",
                            ].includes(section) && (
                                <button
                                    className="button blue-button"
                                    onClick={() => setEdit(null)}
                                >
                                    <Plus size={17} />
                                    Create{" "}
                                    {section === "dashboard"
                                        ? "content"
                                        : section === "media"
                                          ? "resource"
                                          : section === "faqs"
                                            ? "FAQ"
                                            : section.replace(/s$/, "")}
                                </button>
                            )}
                        </div>
                        {section === "dashboard" ? (
                            <>
                                <div className="stats-grid">
                                    {[
                                        {
                                            label: "New enquiries",
                                            n: newLeads,
                                            sub: "Ready for your response",
                                            icon: Inbox,
                                            color: "blue",
                                        },
                                        {
                                            label: "Published content",
                                            n: published,
                                            sub: "Ideas shared with the world",
                                            icon: FileText,
                                            color: "gold",
                                        },
                                        {
                                            label: "Community subscribers",
                                            n: stats.subscribers,
                                            sub: "People on a journey of growth",
                                            icon: Users,
                                            color: "green",
                                        },
                                        {
                                            label: "Drafts in progress",
                                            n: pending,
                                            sub: "Your next chapter is taking shape",
                                            icon: BookOpen,
                                            color: "purple",
                                        },
                                    ].map((s) => (
                                        <article
                                            className={"stat-card " + s.color}
                                            key={s.label}
                                        >
                                            <div className="row-between">
                                                <span>{s.label}</span>
                                                <s.icon size={17} />
                                            </div>
                                            <strong>
                                                {s.n.toLocaleString()}
                                            </strong>
                                            <p>{s.sub}</p>
                                            <div className="stat-decoration" />
                                        </article>
                                    ))}
                                </div>
                                <div className="dashboard-middle">
                                    <section className="panel activity-panel">
                                        <div className="row-between">
                                            <h3>Enquiry activity</h3>
                                            <span className="badge">
                                                Last 7 days
                                            </span>
                                        </div>
                                        <p className="muted">
                                            Every conversation is a new
                                            possibility.
                                        </p>
                                        <div className="bar-chart">
                                            {stats.chart.map((day) => (
                                                <div
                                                    className="bar-col"
                                                    key={day.label}
                                                >
                                                    <span>{day.count}</span>
                                                    <div className="bar-track">
                                                        <div
                                                            style={{
                                                                height: `${Math.max(2, (day.count / Math.max(1, ...stats.chart.map((x) => x.count))) * 100)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <small>{day.label}</small>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                    <section className="dashboard-prompt">
                                        <span className="eyebrow">
                                            MAKE ROOM FOR WHAT’S NEXT
                                        </span>
                                        <h2>
                                            Your ideas.
                                            <br />
                                            <em>Their next chapter.</em>
                                        </h2>
                                        <p>
                                            Share a perspective, create an
                                            experience, or publish a resource.
                                        </p>
                                        <button
                                            className="button white"
                                            onClick={() => setEdit(null)}
                                        >
                                            Create something meaningful{" "}
                                            <ArrowUpRight size={16} />
                                        </button>
                                        <span className="prompt-star">✦</span>
                                    </section>
                                </div>
                                <section className="inbox-panel">
                                    <div className="row-between">
                                        <div>
                                            <span className="eyebrow">
                                                CONNECTIONS THAT MATTER
                                            </span>
                                            <h3>Your latest enquiries</h3>
                                        </div>
                                        <Link
                                            className="button small white"
                                            href="/admin/inbox"
                                        >
                                            View inbox{" "}
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    </div>
                                    {submissions.length ? (
                                        <div className="recent-leads">
                                            {submissions
                                                .slice(0, 4)
                                                .map((s) => (
                                                    <button
                                                        onClick={() =>
                                                            setSelected(s)
                                                        }
                                                        key={s.id}
                                                    >
                                                        <span className="avatar">
                                                            {s.name.charAt(0)}
                                                        </span>
                                                        <span>
                                                            <b>{s.name}</b>
                                                            <small>
                                                                {s.type} enquiry
                                                            </small>
                                                        </span>
                                                        <span className="badge">
                                                            {s.status}
                                                        </span>
                                                        <ChevronRight
                                                            size={18}
                                                        />
                                                    </button>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="inbox-empty">
                                            <Inbox size={32} />
                                            <div>
                                                <h3>
                                                    Your next connection starts
                                                    here.
                                                </h3>
                                                <p>
                                                    Consultations, speaking
                                                    invitations, and
                                                    registrations will appear in
                                                    your inbox.
                                                </p>
                                            </div>
                                            <Link
                                                href="/contact"
                                                className="text-link"
                                            >
                                                View contact page{" "}
                                                <ArrowUpRight size={16} />
                                            </Link>
                                        </div>
                                    )}
                                </section>
                            </>
                        ) : section === "settings" ? (
                            <SiteSettings
                                settings={settings}
                                copyFields={p.homeCopyFields}
                            />
                        ) : section === "inbox" ? (
                            <>
                                <Toolbar
                                    search={search}
                                    setSearch={setSearch}
                                    filter={filter}
                                    setFilter={setFilter}
                                    options={[
                                        "new",
                                        "contacted",
                                        "confirmed",
                                        "closed",
                                    ]}
                                />
                                <div className="panel table-wrap">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Contact</th>
                                                <th>Enquiry</th>
                                                <th>Received</th>
                                                <th>Status</th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submissions
                                                .filter(
                                                    (s) =>
                                                        (filter === "all" ||
                                                            s.status ===
                                                                filter) &&
                                                        `${s.name} ${s.email} ${s.type}`
                                                            .toLowerCase()
                                                            .includes(
                                                                search.toLowerCase(),
                                                            ),
                                                )
                                                .map((s) => (
                                                    <tr key={s.id}>
                                                        <td>
                                                            <b>{s.name}</b>
                                                            <small>
                                                                {s.email}
                                                            </small>
                                                        </td>
                                                        <td>{s.type}</td>
                                                        <td>
                                                            {date(s.created_at)}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={
                                                                    "badge " +
                                                                    s.status
                                                                }
                                                            >
                                                                {s.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="text-link"
                                                                onClick={() =>
                                                                    setSelected(
                                                                        s,
                                                                    )
                                                                }
                                                            >
                                                                Review{" "}
                                                                <ArrowUpRight
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                    {submissions.length === 0 && (
                                        <AdminEmpty text="New enquiries and registrations will appear here." />
                                    )}
                                </div>
                            </>
                        ) : section === "subscribers" ? (
                            <div className="panel table-wrap">
                                <div className="row-between">
                                    <h3>
                                        {stats.subscribers} community members
                                    </h3>
                                    <a
                                        className="button small outline"
                                        href="/admin/subscribers/export"
                                    >
                                        Export CSV
                                    </a>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Joined</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscribers.map((s) => (
                                            <tr key={s.id}>
                                                <td>{s.email}</td>
                                                <td>{date(s.created_at)}</td>
                                                <td>
                                                    <span className="badge">
                                                        {s.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {!subscribers.length && (
                                    <AdminEmpty text="Consented newsletter subscriptions will appear here." />
                                )}
                            </div>
                        ) : section === "activity" ? (
                            <div className="panel">
                                <h3>Recent activity</h3>
                                {activity.map((a) => (
                                    <div className="activity-row" key={a.id}>
                                        <Activity size={16} />
                                        <b>{a.action}</b>
                                        <span>{a.subject}</span>
                                        <small>{date(a.created_at)}</small>
                                    </div>
                                ))}
                                {!activity.length && (
                                    <AdminEmpty text="Content changes and enquiry updates will be recorded here." />
                                )}
                            </div>
                        ) : section === "users" ? (
                            <UserManager
                                users={users}
                                currentUserId={Number(auth.user?.id)}
                            />
                        ) : (
                            <>
                                <Toolbar
                                    search={search}
                                    setSearch={setSearch}
                                    filter={filter}
                                    setFilter={setFilter}
                                    options={[
                                        "draft",
                                        "published",
                                        "scheduled",
                                        "archived",
                                        "forthcoming",
                                    ]}
                                />
                                <div className="panel table-wrap">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Status</th>
                                                <th>Updated</th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((c) => (
                                                <tr key={c.id}>
                                                    <td>
                                                        <b>{c.title}</b>
                                                        <small>
                                                            /{c.type}/{c.slug}
                                                        </small>
                                                    </td>
                                                    <td>{c.category || "—"}</td>
                                                    <td>
                                                        <span
                                                            className={
                                                                "badge " +
                                                                c.status
                                                            }
                                                        >
                                                            {c.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {date(c.created_at)}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="text-link"
                                                            onClick={() =>
                                                                setEdit(c)
                                                            }
                                                        >
                                                            Edit{" "}
                                                            <ArrowUpRight
                                                                size={16}
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {!rows.length && (
                                        <AdminEmpty
                                            text={
                                                search
                                                    ? "No matching content. Try another search."
                                                    : "Your story starts with a first entry. Create content and publish it when approved."
                                            }
                                        />
                                    )}
                                </div>
                            </>
                        )}
                        {section === "media" && (
                            <section className="media-assets">
                                <h3>Uploaded files</h3>
                                <p className="muted">
                                    Files remain available even when a resource
                                    is unpublished. Copy a file’s link to reuse
                                    it in another entry.
                                </p>
                                {mediaAssets.length ? (
                                    <div className="asset-grid">
                                        {mediaAssets.map((asset) => (
                                            <article
                                                className="asset-card"
                                                key={asset.id}
                                            >
                                                {asset.mime_type.startsWith(
                                                    "image/",
                                                ) ? (
                                                    <img
                                                        src={asset.path}
                                                        alt={asset.alt_text}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <FileText size={32} />
                                                )}
                                                <p>{asset.name}</p>
                                                <small>
                                                    {Math.ceil(
                                                        asset.size / 1024,
                                                    )}{" "}
                                                    KB · {asset.mime_type}
                                                </small>
                                                <a
                                                    href={asset.path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Open file ↗
                                                </a>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <AdminEmpty text="Upload files while creating or editing a resource." />
                                )}
                            </section>
                        )}
                        <Pagination data={pagination} />
                        <div className="admin-footer">
                            <span>Dr. Rich Global · Administration</span>
                            <span>Purpose in every possibility. ✦</span>
                        </div>
                    </main>
                </div>
            </div>
            {edit !== undefined && (
                <ContentEditor
                    relatedOptions={relatedOptions}
                    taxonomy={taxonomy}
                    content={edit}
                    type={section === "dashboard" ? "articles" : section}
                    close={() => setEdit(undefined)}
                />
            )}
            {selected && (
                <LeadEditor
                    submission={selected}
                    close={() => setSelected(null)}
                />
            )}
        </>
    );
}
function date(v: string) {
    return new Date(v).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
function AdminEmpty({ text }: { text: string }) {
    return (
        <div className="empty-state">
            <FileText size={30} />
            <h3>A fresh start.</h3>
            <p>{text}</p>
        </div>
    );
}
function Toolbar({
    search,
    setSearch,
    filter,
    setFilter,
    options,
}: {
    search: string;
    setSearch: (v: string) => void;
    filter: string;
    setFilter: (v: string) => void;
    options: string[];
}) {
    return (
        <div className="toolbar">
            <div className="search-input">
                <Search size={17} />
                <input
                    aria-label="Search records"
                    placeholder="Search…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <select
                aria-label="Filter by status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="all">All statuses</option>
                {options.map((x) => (
                    <option key={x}>{x}</option>
                ))}
            </select>
        </div>
    );
}
function ContentEditor({
    relatedOptions,
    taxonomy,
    content,
    type,
    close,
}: {
    relatedOptions: Props["relatedOptions"];
    taxonomy: Props["taxonomy"];
    content: Content | null;
    type: string;
    close: () => void;
}) {
    useModal(close);
    const f = useForm({
        ...empty,
        ...content,
        type: content?.type || type,
        published_at: content?.published_at?.slice(0, 16) || "",
        details: { ...empty.details, ...content?.details },
        tag_ids: content?.tags?.map((t) => t.id) || [],
        related_ids: content?.related?.map((t) => t.id) || [],
    });
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    async function upload(file: File) {
        setUploading(true);
        setUploadError("");
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("alt_text", f.data.alt_text || f.data.title || file.name);
            const token = decodeURIComponent(
                document.cookie
                    .split("; ")
                    .find((x) => x.startsWith("XSRF-TOKEN="))
                    ?.split("=")
                    .slice(1)
                    .join("=") || "",
            );
            const res = await fetch("/admin/upload", {
                method: "POST",
                headers: { "X-XSRF-TOKEN": token, Accept: "application/json" },
                body: fd,
            });
            const body = await res.json();
            if (!res.ok) throw new Error(body.message || "Upload failed");
            f.setData(
                file.type.startsWith("image/") ? "image" : "external_url",
                file.type.startsWith("image/")
                    ? body.path
                    : window.location.origin + body.path,
            );
        } catch (e) {
            setUploadError(e instanceof Error ? e.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    }
    return (
        <div className="modal-backdrop">
            <section
                className="editor modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="editor-title"
            >
                <div className="modal-heading">
                    <div>
                        <span className="eyebrow blue">CONTENT STUDIO</span>
                        <h2 id="editor-title">
                            {content
                                ? "Edit content"
                                : "Create your next chapter"}
                        </h2>
                    </div>
                    <button
                        className="icon-button"
                        onClick={close}
                        aria-label="Close editor"
                    >
                        <X />
                    </button>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        content
                            ? f.put("/admin/content/" + content.id, {
                                  onSuccess: close,
                              })
                            : f.post("/admin/content", { onSuccess: close });
                    }}
                >
                    <div className="form-grid">
                        <label>
                            Content type
                            <select
                                value={f.data.type}
                                onChange={(e) =>
                                    f.setData("type", e.target.value)
                                }
                            >
                                {modules
                                    .filter(
                                        ([k]) =>
                                            ![
                                                "dashboard",
                                                "inbox",
                                                "subscribers",
                                                "settings",
                                                "activity",
                                                "users",
                                            ].includes(k),
                                    )
                                    .map(([k, l]) => (
                                        <option key={k} value={k}>
                                            {l}
                                        </option>
                                    ))}
                            </select>
                        </label>
                        <label>
                            Publishing status
                            <select
                                value={f.data.status}
                                onChange={(e) =>
                                    f.setData("status", e.target.value)
                                }
                            >
                                {[
                                    "draft",
                                    "published",
                                    "scheduled",
                                    "archived",
                                    "forthcoming",
                                ].map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <label>
                        Title
                        <input
                            autoFocus
                            required
                            value={f.data.title || ""}
                            onChange={(e) => {
                                f.setData("title", e.target.value);
                                if (!content)
                                    f.setData(
                                        "slug",
                                        e.target.value
                                            .toLowerCase()
                                            .replace(/[^a-z0-9]+/g, "-")
                                            .replace(/^-|-$/g, ""),
                                    );
                            }}
                        />
                    </label>
                    <div className="form-grid">
                        <label>
                            URL slug
                            <input
                                required
                                value={f.data.slug || ""}
                                onChange={(e) =>
                                    f.setData("slug", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Category
                            <select
                                value={f.data.category_id || ""}
                                onChange={(e) => {
                                    f.setData(
                                        "category_id",
                                        e.target.value
                                            ? Number(e.target.value)
                                            : "",
                                    );
                                    f.setData(
                                        "category",
                                        taxonomy.find(
                                            (t) =>
                                                t.id === Number(e.target.value),
                                        )?.title || "",
                                    );
                                }}
                            >
                                <option value="">
                                    {!f.data.category_id && f.data.category
                                        ? f.data.category + " (legacy category)"
                                        : "Uncategorised"}
                                </option>
                                {taxonomy
                                    .filter((t) => t.type === "categories")
                                    .map((t) => (
                                        <option value={t.id} key={t.id}>
                                            {t.title}
                                        </option>
                                    ))}
                            </select>
                        </label>
                    </div>
                    <datalist id="category-options">
                        {taxonomy
                            .filter((t) => t.type === "categories")
                            .map((t) => (
                                <option key={t.id} value={t.title} />
                            ))}
                    </datalist>
                    <label>
                        Short description
                        <textarea
                            rows={2}
                            value={f.data.excerpt || ""}
                            onChange={(e) =>
                                f.setData("excerpt", e.target.value)
                            }
                        />
                    </label>
                    <RichEditor
                        value={f.data.body || ""}
                        onChange={(value) => f.setData("body", value)}
                    />
                    <div className="form-grid">
                        <label>
                            Image / cover URL
                            <input
                                value={f.data.image || ""}
                                onChange={(e) =>
                                    f.setData("image", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Image description
                            <input
                                value={f.data.alt_text || ""}
                                onChange={(e) =>
                                    f.setData("alt_text", e.target.value)
                                }
                            />
                        </label>
                    </div>
                    <label className="upload-control">
                        <Upload size={18} />
                        {uploading
                            ? "Uploading…"
                            : "Upload image, PDF, or audio (10 MB max)"}
                        <input
                            disabled={uploading}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf,.mp3"
                            onChange={(e) =>
                                e.target.files?.[0] && upload(e.target.files[0])
                            }
                        />
                    </label>
                    {uploadError && <p className="error">{uploadError}</p>}
                    <label>
                        External purchase / resource URL
                        <input
                            type="url"
                            value={f.data.external_url || ""}
                            onChange={(e) =>
                                f.setData("external_url", e.target.value)
                            }
                        />
                    </label>
                    <ContentFields
                        type={f.data.type}
                        details={f.data.details}
                        onChange={(details) => f.setData("details", details)}
                    />
                    <ContentRelations
                        tags={taxonomy}
                        options={relatedOptions}
                        currentId={content?.id}
                        tagIds={f.data.tag_ids}
                        relatedIds={f.data.related_ids}
                        onTags={(ids) => f.setData("tag_ids", ids)}
                        onRelated={(ids) => f.setData("related_ids", ids)}
                    />
                    <details className="editor-details">
                        <summary>Search engine settings</summary>
                        <label>
                            Canonical URL (optional override)
                            <input
                                type="url"
                                value={f.data.canonical_url || ""}
                                onChange={(e) =>
                                    f.setData("canonical_url", e.target.value)
                                }
                            />
                        </label>
                        <label className="check-label">
                            <input
                                type="checkbox"
                                checked={f.data.noindex || false}
                                onChange={(e) =>
                                    f.setData("noindex", e.target.checked)
                                }
                            />
                            Exclude this page from search engines and sitemap
                        </label>

                        <label>
                            SEO title
                            <input
                                value={f.data.seo_title || ""}
                                onChange={(e) =>
                                    f.setData("seo_title", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Meta description
                            <textarea
                                value={f.data.meta_description || ""}
                                onChange={(e) =>
                                    f.setData(
                                        "meta_description",
                                        e.target.value,
                                    )
                                }
                            />
                        </label>
                    </details>
                    <div className="form-grid">
                        <label>
                            Publication date
                            <input
                                type="datetime-local"
                                required={f.data.status === "scheduled"}
                                value={f.data.published_at}
                                onChange={(e) =>
                                    f.setData("published_at", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Display order
                            <input
                                type="number"
                                min={0}
                                value={f.data.display_order}
                                onChange={(e) =>
                                    f.setData(
                                        "display_order",
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </label>
                    </div>
                    <label className="check-label">
                        <input
                            type="checkbox"
                            checked={f.data.featured}
                            onChange={(e) =>
                                f.setData("featured", e.target.checked)
                            }
                        />
                        Featured content
                    </label>
                    {Object.values(f.errors).map((err) => (
                        <p key={err} className="error" role="alert">
                            {err}
                        </p>
                    ))}
                    <div className="modal-actions">
                        {content && (
                            <button
                                type="button"
                                className="button danger"
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Permanently delete this content?",
                                        )
                                    )
                                        router.delete(
                                            "/admin/content/" + content.id,
                                            { onSuccess: close },
                                        );
                                }}
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        )}
                        <button
                            type="button"
                            className="button outline"
                            onClick={close}
                        >
                            Cancel
                        </button>
                        <button
                            className="button blue-button"
                            disabled={f.processing || uploading}
                        >
                            <Save size={16} />
                            {f.processing ? "Saving…" : "Save content"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
function LeadEditor({
    submission: s,
    close,
}: {
    submission: Submission;
    close: () => void;
}) {
    useModal(close);
    const f = useForm({ status: s.status, admin_notes: s.admin_notes || "" });
    return (
        <div className="modal-backdrop">
            <section
                className="modal lead-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Enquiry details"
            >
                <div className="modal-heading">
                    <h2>{s.name}</h2>
                    <button
                        className="icon-button"
                        onClick={close}
                        aria-label="Close enquiry"
                    >
                        <X />
                    </button>
                </div>
                <span className="badge">{s.type}</span>
                <p>
                    <a href={"mailto:" + s.email}>{s.email}</a> · {s.phone}
                </p>
                <div className="message-body">{s.message}</div>
                {Object.entries(s.details || {})
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                        <p key={k}>
                            <b>{k.replaceAll("_", " ")}:</b> {v}
                        </p>
                    ))}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        f.put("/admin/inbox/" + s.id, { onSuccess: close });
                    }}
                >
                    <label>
                        Status
                        <select
                            value={f.data.status}
                            onChange={(e) =>
                                f.setData("status", e.target.value)
                            }
                        >
                            {["new", "contacted", "confirmed", "closed"].map(
                                (x) => (
                                    <option key={x}>{x}</option>
                                ),
                            )}
                        </select>
                    </label>
                    <label>
                        Internal notes
                        <textarea
                            rows={4}
                            value={f.data.admin_notes}
                            onChange={(e) =>
                                f.setData("admin_notes", e.target.value)
                            }
                        />
                    </label>
                    <button
                        disabled={f.processing}
                        className="button blue-button"
                    >
                        Save changes
                    </button>
                </form>
            </section>
        </div>
    );
}
