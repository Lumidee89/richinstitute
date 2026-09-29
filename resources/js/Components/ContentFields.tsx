import { Content } from "../types";
export type ContentDetails = Record<string, string>;
const fields: Record<string, [string, string, string?][]> = {
    books: [
        ["major_lessons", "Major lessons", "textarea"],
        ["author_name", "Author"],
        ["currency", "Currency"],
    ],
    articles: [["author_name", "Author"]],
    programmes: [
        ["duration", "Duration"],
        ["format", "Delivery format"],
        ["fee", "Participation fee"],
        ["currency", "Currency"],
        ["audience", "Target audience", "textarea"],
        ["outcomes", "Learning outcomes", "textarea"],
        ["registration_opens_at", "Registration opens", "datetime-local"],
        ["registration_closes_at", "Registration closes", "datetime-local"],
        ["capacity", "Registration capacity", "number"],
        ["whatsapp_url", "Programme WhatsApp / community URL", "url"],
    ],
    events: [
        ["starts_at", "Starts at (event local time)", "datetime-local"],
        ["ends_at", "Ends at (event local time)", "datetime-local"],
        ["timezone", "IANA time zone (e.g. Africa/Lusaka)"],
        ["venue", "Venue / address"],
        ["virtual_platform", "Virtual platform"],
        ["fee", "Participation fee"],
        ["currency", "Currency"],
        ["registration_opens_at", "Registration opens (UTC)", "datetime-local"],
        [
            "registration_closes_at",
            "Registration closes (UTC)",
            "datetime-local",
        ],
        ["capacity", "Registration capacity", "number"],
        ["whatsapp_url", "Event WhatsApp / community URL", "url"],
        ["gallery", "Gallery image URLs — one per line", "textarea"],
        ["gallery_alt", "Gallery descriptions — matching lines", "textarea"],
    ],
    testimonials: [
        ["person_name", "Person name"],
        ["position", "Position"],
        ["organisation", "Organisation"],
        ["testimonial_type", "Testimonial type"],
    ],
    pages: [
        ["gallery", "Gallery image URLs — one per line", "textarea"],
        ["gallery_alt", "Gallery descriptions — matching lines", "textarea"],
    ],
    media: [
        ["gallery", "Gallery image URLs — one per line", "textarea"],
        ["gallery_alt", "Gallery descriptions — matching lines", "textarea"],
    ],
};
export default function ContentFields({
    type,
    details,
    onChange,
}: {
    type: string;
    details: ContentDetails;
    onChange: (v: ContentDetails) => void;
}) {
    const entries = fields[type] || [];
    if (!entries.length) return null;
    return (
        <details className="editor-details" open>
            <summary>
                {type === "testimonials"
                    ? "Testimonial & approval"
                    : "Content details"}
            </summary>
            <div className="form-grid">
                {entries.map(([key, label, inputType = "text"]) => (
                    <label key={key}>
                        {label}
                        {inputType === "textarea" ? (
                            <textarea
                                rows={3}
                                value={details[key] || ""}
                                onChange={(e) =>
                                    onChange({
                                        ...details,
                                        [key]: e.target.value,
                                    })
                                }
                            />
                        ) : (
                            <input
                                type={inputType}
                                min={inputType === "number" ? 1 : undefined}
                                placeholder={
                                    key === "timezone"
                                        ? "Africa/Lusaka"
                                        : undefined
                                }
                                value={details[key] || ""}
                                onChange={(e) =>
                                    onChange({
                                        ...details,
                                        [key]: e.target.value,
                                    })
                                }
                            />
                        )}
                    </label>
                ))}
                {type === "testimonials" && (
                    <label>
                        Approval status
                        <select
                            value={details.approval_status || "pending"}
                            onChange={(e) =>
                                onChange({
                                    ...details,
                                    approval_status: e.target.value,
                                })
                            }
                        >
                            <option value="pending">Pending review</option>
                            <option value="approved">
                                Approved for publication
                            </option>
                            <option value="rejected">Not approved</option>
                        </select>
                    </label>
                )}
            </div>
        </details>
    );
}
export function ContentRelations({
    tags,
    options,
    tagIds,
    relatedIds,
    onTags,
    onRelated,
    currentId,
}: {
    tags: { id: number; title: string; type: string }[];
    options: Pick<Content, "id" | "type" | "title">[];
    tagIds: number[];
    relatedIds: number[];
    onTags: (ids: number[]) => void;
    onRelated: (ids: number[]) => void;
    currentId?: number;
}) {
    function toggle(ids: number[], id: number) {
        return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    }
    return (
        <details className="editor-details">
            <summary>Tags & related content</summary>
            <p className="field-hint">
                Select reusable tags and related publications or resources. Only
                approved public records appear to visitors.
            </p>
            <fieldset>
                <legend>Tags</legend>
                <div className="choice-grid">
                    {tags
                        .filter((x) => x.type === "tags")
                        .map((t) => (
                            <label className="check-label" key={t.id}>
                                <input
                                    type="checkbox"
                                    checked={tagIds.includes(t.id)}
                                    onChange={() =>
                                        onTags(toggle(tagIds, t.id))
                                    }
                                />
                                {t.title}
                            </label>
                        ))}
                    {!tags.some((x) => x.type === "tags") && (
                        <p className="muted">
                            Create tags in the Tags module first.
                        </p>
                    )}
                </div>
            </fieldset>
            <fieldset>
                <legend>Related content</legend>
                <div className="choice-grid">
                    {options
                        .filter((x) => x.id !== currentId)
                        .map((t) => (
                            <label className="check-label" key={t.id}>
                                <input
                                    type="checkbox"
                                    checked={relatedIds.includes(t.id)}
                                    onChange={() =>
                                        onRelated(toggle(relatedIds, t.id))
                                    }
                                />
                                {t.title} <small>({t.type})</small>
                            </label>
                        ))}
                </div>
            </fieldset>
        </details>
    );
}
