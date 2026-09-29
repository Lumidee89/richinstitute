import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
const pages = {
    Site: () => import("./Pages/Site"),
    Admin: () => import("./Pages/Admin"),
    Login: () => import("./Pages/Login"),
    NewsletterPreferences: () => import("./Pages/NewsletterPreferences"),
};
createInertiaApp({
    title: (title) => `${title} | Dr. Rich Global`,
    resolve: async (name) =>
        (await pages[name as keyof typeof pages]()).default,
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: { color: "#1d55b3" },
});
