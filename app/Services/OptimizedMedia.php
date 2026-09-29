<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class OptimizedMedia
{
    public function store(UploadedFile $file): array
    {
        $variants = [];
        $image = null;
        if (str_starts_with($file->getMimeType(), 'image/')) {
            $size = getimagesize($file->getRealPath());
            if (! $size || $size[0] * $size[1] > 12000000) {
                throw ValidationException::withMessages(['file' => 'Use an image of no more than 12 megapixels.']);
            }
            if (function_exists('imagewebp')) {
                $image = @imagecreatefromstring(file_get_contents($file->getRealPath()));
            }
        }
        $original = $file->store('media/originals', 'public');
        $path = $original;
        try {
            if ($image) {
                $width = imagesx($image);
                $height = imagesy($image);
                foreach (array_unique([min(640, $width), min(1280, $width), min(1920, $width)]) as $target) {
                    $scaled = imagecreatetruecolor($target, max(1, (int) round($height * $target / $width)));
                    imagealphablending($scaled, false);
                    imagesavealpha($scaled, true);
                    imagecopyresampled($scaled, $image, 0, 0, 0, 0, $target, imagesy($scaled), $width, $height);
                    ob_start();
                    imagewebp($scaled, null, 82);
                    $bytes = ob_get_clean();
                    $path = 'media/'.pathinfo($original, PATHINFO_FILENAME).'-'.$target.'.webp';
                    Storage::disk('public')->put($path, $bytes);
                    $variants[] = ['width' => $target, 'url' => '/storage/'.$path];
                    unset($scaled);
                }
            }
        } finally {
            unset($image);
        }

        return ['path' => '/storage/'.$path, 'original_path' => '/storage/'.$original, 'variants' => $variants, 'mime_type' => count($variants) ? 'image/webp' : $file->getMimeType(), 'size' => Storage::disk('public')->size($path)];
    }
}
