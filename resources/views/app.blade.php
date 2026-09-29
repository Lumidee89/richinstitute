<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
@if(isset($seo))
<meta name="robots" content="{{ ($seo['noindex'] ?? false) ? 'noindex,follow' : 'index,follow' }}" inertia="robots">
<title inertia>{{ $seo['title'] }}</title>
<meta name="description" content="{{ $seo['description'] }}" inertia="description">
<link rel="canonical" href="{{ $seo['canonical'] }}" inertia="canonical">
<meta property="og:type" content="website" inertia="og:type">
<meta property="og:title" content="{{ $seo['title'] }}" inertia="og:title">
<meta property="og:description" content="{{ $seo['description'] }}" inertia="og:description">
<meta property="og:url" content="{{ $seo['canonical'] }}" inertia="og:url">
@if($seo['verification'] ?? null)<meta name="google-site-verification" content="{{ $seo['verification'] }}">@endif
@if($seo['image'])<meta property="og:image" content="{{ $seo['image'] }}" inertia="og:image">@endif
<meta name="twitter:card" content="summary_large_image" inertia="twitter:card">
@else
<meta name="robots" content="noindex,nofollow">
@endif
@if(isset($structured))
<script type="application/ld+json">{!! json_encode($structured, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES) !!}</script>
@endif
<link rel="icon" href="/drlogo.png">
@viteReactRefresh
@vite(['resources/css/app.css', 'resources/js/app.tsx'])
@inertiaHead
</head>
<body>@inertia</body>
</html>
