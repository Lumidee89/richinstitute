<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['featured' => 'boolean', 'noindex' => 'boolean', 'event_starts_at' => 'datetime', 'event_ends_at' => 'datetime', 'details' => 'array', 'published_at' => 'datetime'];
    }

    public function tags()
    {
        return $this->belongsToMany(self::class, 'content_tag', 'content_id', 'tag_id');
    }

    public function related()
    {
        return $this->belongsToMany(self::class, 'content_related', 'content_id', 'related_id');
    }

    public function publicPath(): string
    {
        return $this->type === 'pages' ? ($this->slug === 'home' ? '/' : '/'.$this->slug) : '/'.($this->type === 'partners' ? 'partnerships' : $this->type).'/'.$this->slug;
    }

    public function scopeVisible($query)
    {
        return $query->where(fn ($q) => $q->where('status', 'published')->orWhere(fn ($q) => $q->where('type', 'books')->where('status', 'forthcoming')))->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))->where(fn ($q) => $q->where('type', '!=', 'testimonials')->orWhere('details->approval_status', 'approved'));
    }
}
