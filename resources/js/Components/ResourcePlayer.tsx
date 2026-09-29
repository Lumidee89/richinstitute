export default function ResourcePlayer({
    url,
    title,
}: {
    url: string;
    title: string;
}) {
    let videoId: string | null = null;
    try {
        const u = new URL(url);
        if (
            ["www.youtube.com", "youtube.com", "m.youtube.com"].includes(
                u.hostname,
            )
        )
            videoId =
                u.searchParams.get("v") ||
                u.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/)?.[1] ||
                null;
        if (u.hostname === "youtu.be") videoId = u.pathname.slice(1);
    } catch {}
    if (videoId && /^[\w-]{11}$/.test(videoId))
        return (
            <iframe
                className="resource-video"
                title={title}
                src={"https://www.youtube-nocookie.com/embed/" + videoId}
                loading="lazy"
                allow="fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
            />
        );
    if (/\.(mp3|ogg|wav)(\?.*)?$/i.test(url))
        return <audio controls preload="none" src={url} aria-label={title} />;
    return null;
}
