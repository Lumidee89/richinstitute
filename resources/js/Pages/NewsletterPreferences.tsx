import { Head, Link, useForm } from "@inertiajs/react";
export default function NewsletterPreferences({
    status,
    action,
}: {
    status: string;
    action: string;
}) {
    const f = useForm({});
    return (
        <main className="subscription-page">
            <Head title="Email preferences" />
            <Link href="/">
                <img src="/drlogo.png" alt="Dr. Rich Global" />
            </Link>
            <section className="panel">
                <span className="eyebrow blue">
                    YOUR COMMUNITY, YOUR CHOICE
                </span>
                <h1>Email preferences</h1>
                {status === "unsubscribed" ? (
                    <>
                        <p>You have been unsubscribed from community emails.</p>
                        <Link href="/community" className="text-link">
                            You’re welcome to rejoin at any time.
                        </Link>
                    </>
                ) : (
                    <>
                        <p>
                            You are subscribed to the Dr. Rich Global community.
                            You can stop receiving updates below.
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                f.post(action);
                            }}
                        >
                            <button
                                disabled={f.processing}
                                className="button navy"
                            >
                                {f.processing
                                    ? "Updating…"
                                    : "Unsubscribe from updates"}
                            </button>
                        </form>
                    </>
                )}
            </section>
            <Link href="/" className="text-link">
                Back to Dr. Rich Global
            </Link>
        </main>
    );
}
