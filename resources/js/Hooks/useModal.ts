import { useEffect } from "react";
export function useModal(close: () => void) {
    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
        const nodes = () =>
            Array.from(
                dialog?.querySelectorAll<HTMLElement>(
                    'button:not([disabled]),a[href],input:not([disabled]),textarea,select,[tabindex="0"]',
                ) || [],
            ).filter((e) => e.offsetParent !== null);
        nodes()[0]?.focus();
        function key(e: KeyboardEvent) {
            if (e.key === "Escape") {
                e.preventDefault();
                close();
            }
            if (e.key === "Tab") {
                const items = nodes();
                const first = items[0],
                    last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        }
        document.addEventListener("keydown", key);
        return () => {
            document.removeEventListener("keydown", key);
            document.body.style.overflow = previousOverflow;
            previous?.focus();
        };
    }, []);
}
