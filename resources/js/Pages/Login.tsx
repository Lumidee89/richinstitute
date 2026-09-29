import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ArrowUpRight, ArrowLeft, LockKeyhole } from "lucide-react";
import { Shared } from "../types";
export default function Login({
    mode,
    token = "",
    email = "",
}: {
    mode: string;
    token?: string;
    email?: string;
}) {
    const f = useForm({
        email,
        password: "",
        password_confirmation: "",
        token,
    });
    const { flash } = usePage<Shared>().props;
    return (
        <div className="login-page">
            <Head title="Administrator access" />
            <aside>
                <Link href="/">
                    <img src="/drlogo.png" alt="Dr. Rich Global" />
                </Link>
                <div>
                    <span className="eyebrow">
                        PURPOSE IN EVERY POSSIBILITY
                    </span>
                    <h1>
                        Liberating minds.
                        <br />
                        <em>
                            Creating a<br />
                            different future.
                        </em>
                    </h1>
                    <p>
                        Your workspace for meaningful connections,
                        <br />
                        new perspectives, and lasting impact.
                    </p>
                </div>
                <span>Lusaka, Zambia · Dr. Rich Global</span>
            </aside>
            <main>
                <Link href="/" className="text-link">
                    <ArrowLeft size={16} />
                    Back to website
                </Link>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        f.post(
                            mode === "forgot"
                                ? "/forgot-password"
                                : mode === "reset"
                                  ? "/reset-password"
                                  : "/admin/login",
                        );
                    }}
                >
                    <div className="login-icon">
                        <LockKeyhole />
                    </div>
                    <span className="eyebrow blue">
                        ADMINISTRATOR WORKSPACE
                    </span>
                    <h2>
                        {mode === "forgot"
                            ? "Reset your password"
                            : mode === "reset"
                              ? "Choose a new password"
                              : "Welcome back."}
                    </h2>
                    <p className="muted">
                        {mode === "login"
                            ? "Sign in to manage Dr. Rich Global."
                            : "Secure access to your workspace."}
                    </p>
                    {flash.success && <p className="notice">{flash.success}</p>}
                    <label>
                        Email address
                        <input
                            autoFocus
                            required
                            type="email"
                            autoComplete="username"
                            value={f.data.email}
                            onChange={(e) => f.setData("email", e.target.value)}
                        />
                    </label>
                    {mode !== "forgot" && (
                        <label>
                            Password
                            <input
                                required
                                minLength={mode === "reset" ? 12 : undefined}
                                type="password"
                                autoComplete={
                                    mode === "reset"
                                        ? "new-password"
                                        : "current-password"
                                }
                                value={f.data.password}
                                onChange={(e) =>
                                    f.setData("password", e.target.value)
                                }
                            />
                        </label>
                    )}
                    {mode === "reset" && (
                        <label>
                            Confirm password
                            <input
                                required
                                type="password"
                                autoComplete="new-password"
                                value={f.data.password_confirmation}
                                onChange={(e) =>
                                    f.setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                            />
                        </label>
                    )}
                    {Object.values(f.errors).map((x) => (
                        <p role="alert" className="error" key={x}>
                            {x}
                        </p>
                    ))}
                    <button disabled={f.processing} className="button navy">
                        {f.processing
                            ? "Please wait…"
                            : mode === "forgot"
                              ? "Send reset link"
                              : mode === "reset"
                                ? "Reset password"
                                : "Sign in"}
                        <ArrowUpRight size={17} />
                    </button>
                    {mode === "login" && (
                        <Link href="/forgot-password" className="text-link">
                            Forgot your password?
                        </Link>
                    )}
                </form>
                <small>Authorised administrators only.</small>
            </main>
        </div>
    );
}
