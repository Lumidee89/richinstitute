import { useForm } from "@inertiajs/react";
import { Save, ArrowUp, ArrowDown } from "lucide-react";
const sections = [
    ["hero", "Hero"],
    ["journeys", "Consultation & speaking cards"],
    ["introduction", "Institute introduction"],
    ["principles", "Transformation principles"],
    ["vision", "Vision & mission"],
    ["about", "Meet Dr. Rich"],
    ["programmes", "Featured programmes"],
    ["books", "Featured books"],
    ["events", "Upcoming events"],
    ["testimonials", "Featured testimonials"],
    ["articles", "Latest articles"],
    ["newsletter", "Newsletter"],
] as const;
const groups: [string, [string, string, boolean?][]][] = [
    [
        "Brand & contact",
        [
            ["hero_title", "Homepage headline (one line per row)", true],
            ["hero_description", "Homepage supporting message", true],
            ["contact_email", "Public email"],
            ["phone", "Telephone"],
            ["whatsapp", "WhatsApp number (country code, digits only)"],
            ["location", "Location"],
            ["instagram", "Instagram URL"],
            ["facebook", "Facebook URL"],
            ["linkedin", "LinkedIn URL"],
            ["youtube", "YouTube URL"],
            ["community_url", "Community WhatsApp URL"],
        ],
    ],
    [
        "Homepage copy",
        [
            ["home_eyebrow", "Hero introduction label"],
            ["home_about_title", "Dr. Rich introduction title"],
            [
                "home_about_body",
                "Approved Dr. Rich introduction (Markdown)",
                true,
            ],
            ["home_about_image", "Approved portrait URL"],
            ["home_about_alt", "Portrait description"],
            ["home_vision_title", "Vision & mission title"],
            ["home_vision_body", "Vision & mission (Markdown)", true],
            ["home_consultation_title", "Consultation card title"],
            ["home_consultation_body", "Consultation card text"],
            ["home_speaking_title", "Speaking card title"],
            ["home_speaking_body", "Speaking card text"],
            ["home_journeys_title", "Pathways title"],
            ["home_newsletter_title", "Newsletter title"],
            ["home_newsletter_body", "Newsletter text"],
            ["home_final_cta", "Footer call to action"],
        ],
    ],
    [
        "Search & analytics",
        [
            ["seo_description", "Default search description", true],
            ["analytics_id", "GA4 measurement ID (G-…)"],
            [
                "search_console_verification",
                "Google Search Console verification token",
            ],
        ],
    ],
];
const kinds = [
    "contact",
    "consultation",
    "speaking",
    "programme",
    "event",
    "book",
    "partnership",
];
export default function SiteSettings({
    settings,
    copyFields,
}: {
    settings: Record<string, string>;
    copyFields: Record<string, { label: string; default: string }>;
}) {
    const keys = [
        ...Object.keys(copyFields),
        ...groups.flatMap(([, fields]) => fields.map(([k]) => k)),
    ];
    const f = useForm<Record<string, string>>({
        ...Object.fromEntries(
            [...keys, "notification_email"].map((k) => [k, settings[k] || ""]),
        ),
        home_sections:
            settings.home_sections || sections.map(([key]) => key).join(","),
        ...Object.fromEntries(
            kinds.flatMap((kind) => [
                [
                    "notification_email_" + kind,
                    settings["notification_email_" + kind] || "",
                ],
                [
                    "notification_enabled_" + kind,
                    settings["notification_enabled_" + kind] ?? "1",
                ],
            ]),
        ),
    });
    const order = f.data.home_sections.split(",").filter(Boolean);
    function move(index: number, direction: number) {
        const next = [...order];
        if (index + direction < 0 || index + direction >= next.length) return;
        [next[index], next[index + direction]] = [
            next[index + direction],
            next[index],
        ];
        f.setData("home_sections", next.join(","));
    }
    return (
        <form
            className="settings-form"
            onSubmit={(e) => {
                e.preventDefault();
                f.put("/admin/settings", { preserveScroll: true });
            }}
        >
            {groups.map(([title, fields]) => (
                <section className="panel settings-group" key={title}>
                    <h3>{title}</h3>
                    <div className="form-grid">
                        {fields.map(([key, label, multiline]) => (
                            <label key={key}>
                                {label}
                                {multiline ? (
                                    <textarea
                                        rows={key === "hero_title" ? 4 : 3}
                                        value={f.data[key]}
                                        onChange={(e) =>
                                            f.setData(key, e.target.value)
                                        }
                                    />
                                ) : (
                                    <input
                                        type={
                                            key.includes("email")
                                                ? "email"
                                                : "text"
                                        }
                                        value={f.data[key]}
                                        onChange={(e) =>
                                            f.setData(key, e.target.value)
                                        }
                                    />
                                )}
                            </label>
                        ))}
                    </div>
                    {title === "Homepage copy" && (
                        <p className="field-hint">
                            Use Site content → home to edit the institute
                            introduction. Empty optional biography and vision
                            sections remain hidden. Content cards show approved
                            public records only.
                        </p>
                    )}
                </section>
            ))}
            <details className="panel settings-group">
                <summary>
                    Additional homepage labels, imagery & section headings
                </summary>
                <div className="form-grid">
                    {Object.entries(copyFields).map(([key, field]) => (
                        <label key={key}>
                            {field.label}
                            <input
                                placeholder={field.default}
                                value={f.data[key]}
                                onChange={(e) => f.setData(key, e.target.value)}
                            />
                        </label>
                    ))}
                </div>
            </details>
            <section className="panel settings-group">
                <h3>Homepage sections & order</h3>
                <p className="muted">
                    Enable sections and move them into the order visitors should
                    read them.
                </p>
                <div className="section-order">
                    {order.map((key, index) => (
                        <div key={key}>
                            <label className="check-label">
                                <input
                                    type="checkbox"
                                    checked
                                    onChange={() => {
                                        if (order.length > 1)
                                            f.setData(
                                                "home_sections",
                                                order
                                                    .filter((x) => x !== key)
                                                    .join(","),
                                            );
                                    }}
                                />
                                {sections.find(([k]) => k === key)?.[1] || key}
                            </label>
                            <button
                                type="button"
                                className="icon-button"
                                aria-label={"Move " + key + " up"}
                                disabled={index === 0}
                                onClick={() => move(index, -1)}
                            >
                                <ArrowUp size={15} />
                            </button>
                            <button
                                type="button"
                                className="icon-button"
                                aria-label={"Move " + key + " down"}
                                disabled={index === order.length - 1}
                                onClick={() => move(index, 1)}
                            >
                                <ArrowDown size={15} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="choice-grid">
                    {sections
                        .filter(([key]) => !order.includes(key))
                        .map(([key, label]) => (
                            <label className="check-label" key={key}>
                                <input
                                    type="checkbox"
                                    checked={false}
                                    onChange={() =>
                                        f.setData(
                                            "home_sections",
                                            [...order, key].join(","),
                                        )
                                    }
                                />
                                Enable {label}
                            </label>
                        ))}
                </div>
            </section>
            <section className="panel settings-group">
                <h3>Enquiry notifications</h3>
                <p className="muted">
                    Each form can use a separate recipient. Blank recipients use
                    the default address. Disabling email never prevents saving
                    the enquiry.
                </p>
                <label>
                    Default notification recipient
                    <input
                        type="email"
                        value={f.data.notification_email}
                        onChange={(e) =>
                            f.setData("notification_email", e.target.value)
                        }
                    />
                </label>
                {kinds.map((kind) => (
                    <div className="form-grid" key={kind}>
                        <label>
                            {kind} recipient
                            <input
                                type="email"
                                value={f.data["notification_email_" + kind]}
                                onChange={(e) =>
                                    f.setData(
                                        "notification_email_" + kind,
                                        e.target.value,
                                    )
                                }
                            />
                        </label>
                        <label>
                            {kind} email notifications
                            <select
                                value={f.data["notification_enabled_" + kind]}
                                onChange={(e) =>
                                    f.setData(
                                        "notification_enabled_" + kind,
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="1">Enabled</option>
                                <option value="0">Disabled</option>
                            </select>
                        </label>
                    </div>
                ))}
            </section>
            {Object.entries(f.errors).map(([key, error]) => (
                <p className="error" role="alert" key={key}>
                    {key.replaceAll("_", " ")}: {error}
                </p>
            ))}
            <button disabled={f.processing} className="button blue-button">
                <Save size={17} />
                {f.processing ? "Saving…" : "Save settings"}
            </button>
        </form>
    );
}
