import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useState } from "react";
import {
    Bold,
    Italic,
    Heading2,
    List,
    Link as LinkIcon,
    Quote,
    Eye,
    Pencil,
} from "lucide-react";
export function RichText({ body }: { body: string }) {
    return (
        <div className="rich-text">
            <Markdown
                remarkPlugins={[remarkGfm]}
                skipHtml
                components={{
                    a: ({ children, ...props }) => (
                        <a {...props} rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                }}
            >
                {body || ""}
            </Markdown>
        </div>
    );
}
export function RichEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    const [preview, setPreview] = useState(false);
    const ref = useRef<HTMLTextAreaElement>(null);
    function wrap(before: string, after = "") {
        const node = ref.current;
        if (!node) return;
        const start = node.selectionStart,
            end = node.selectionEnd;
        onChange(
            value.slice(0, start) +
                before +
                (value.slice(start, end) || "Your text") +
                after +
                value.slice(end),
        );
        requestAnimationFrame(() => {
            node.focus();
            node.setSelectionRange(
                start + before.length,
                start + before.length + (end - start || 9),
            );
        });
    }
    return (
        <div className="rich-editor">
            <label htmlFor="content-body">Body / answer</label>
            <div className="editor-toolbar">
                {[
                    { label: "Bold", icon: Bold, b: "**", a: "**" },
                    { label: "Italic", icon: Italic, b: "_", a: "_" },
                    { label: "Heading", icon: Heading2, b: "\n## ", a: "\n" },
                    { label: "List", icon: List, b: "\n- ", a: "\n" },
                    { label: "Quote", icon: Quote, b: "\n> ", a: "\n" },
                    {
                        label: "Link",
                        icon: LinkIcon,
                        b: "[",
                        a: "](https://example.com)",
                    },
                ].map((t) => (
                    <button
                        key={t.label}
                        type="button"
                        disabled={preview}
                        title={t.label}
                        aria-label={t.label}
                        onClick={() => wrap(t.b, t.a)}
                    >
                        <t.icon size={16} />
                    </button>
                ))}
                <button
                    type="button"
                    className="preview-toggle"
                    onClick={() => setPreview(!preview)}
                >
                    {preview ? <Pencil size={15} /> : <Eye size={15} />}{" "}
                    {preview ? "Edit" : "Preview"}
                </button>
            </div>
            {preview ? (
                <div className="rich-preview">
                    <RichText body={value} />
                </div>
            ) : (
                <textarea
                    id="content-body"
                    ref={ref}
                    rows={10}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
            <p className="field-hint">
                Use the toolbar or Markdown to format your content. Preview
                before publishing approved information.
            </p>
        </div>
    );
}
