import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
declare global {
    interface Window {
        dataLayer: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}
const consentKey = "dr-rich-analytics-consent";
export function trackConversion(name: string) {
    if (localStorage.getItem(consentKey) === "accepted")
        window.gtag?.("event", name);
}
export default function AnalyticsConsent({
    measurementId,
}: {
    measurementId?: string;
}) {
    const [choice, setChoice] = useState<string | null>(() =>
        localStorage.getItem(consentKey),
    );
    useEffect(() => {
        const reopen = () => setChoice(null);
        window.addEventListener("privacy-choices", reopen);
        return () => window.removeEventListener("privacy-choices", reopen);
    }, []);
    useEffect(() => {
        if (!measurementId || choice !== "accepted") return;
        window.dataLayer = window.dataLayer || [];
        window.gtag =
            window.gtag ||
            function () {
                window.dataLayer.push(arguments);
            };
        window.gtag("consent", "update", { analytics_storage: "granted" });
        if (!document.getElementById("analytics-script")) {
            const script = document.createElement("script");
            script.id = "analytics-script";
            script.async = true;
            script.src =
                "https://www.googletagmanager.com/gtag/js?id=" +
                encodeURIComponent(measurementId);
            document.head.appendChild(script);
            window.gtag("js", new Date());
            window.gtag("config", measurementId, { anonymize_ip: true });
        }
    }, [choice, measurementId]);
    function choose(value: string) {
        localStorage.setItem(consentKey, value);
        setChoice(value);
        if (value === "declined")
            window.gtag?.("consent", "update", { analytics_storage: "denied" });
    }
    if (!measurementId || choice) return null;
    return (
        <section className="consent-banner" aria-label="Analytics preferences">
            <div>
                <b>Make yourself at home.</b>
                <p>
                    With your permission, we use analytics cookies to understand
                    how the site is used. Essential cookies keep forms and
                    sign-in working.{" "}
                    <Link href="/cookie-policy">Cookie policy</Link>
                </p>
            </div>
            <button
                className="button small outline"
                onClick={() => choose("declined")}
            >
                Essential only
            </button>
            <button
                className="button small navy"
                onClick={() => choose("accepted")}
            >
                Allow analytics
            </button>
        </section>
    );
}
