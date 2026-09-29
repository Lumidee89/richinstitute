<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use RuntimeException;

class PreparePublicUploads extends Command
{
    protected $signature = 'uploads:prepare';

    protected $description = 'Copy legacy uploads into a real public/storage directory, preserving URLs and originals';

    public function handle(): int
    {
        $source = storage_path('app/public');
        $target = public_path('storage');
        try {
            if (is_link($target)) {
                if (realpath($target) !== realpath($source) || ! is_dir($source)) {
                    throw new RuntimeException('Unexpected public/storage symlink target; resolve it manually before continuing.');
                }
                // Copy completely before removing the old link. Originals remain untouched.
                $stage = public_path('.uploads-'.bin2hex(random_bytes(8)));
                try {
                    $this->copyFiles($source, $stage);
                    if (! unlink($target)) {
                        throw new RuntimeException('Could not remove the old upload symlink.');
                    }
                    if (! rename($stage, $target)) {
                        throw new RuntimeException('Could not activate uploads. Original files remain in storage/app/public.');
                    }
                } finally {
                    if (is_dir($stage)) {
                        File::deleteDirectory($stage);
                    }
                }
            } else {
                $this->copyFiles($source, $target);
            }
            $this->info('Uploads ready in public/storage. Existing /storage URLs are unchanged; legacy originals are retained.');

            return self::SUCCESS;
        } catch (\Throwable $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }
    }

    private function copyFiles(string $source, string $target): void
    {
        File::ensureDirectoryExists($target, 0755, true);
        if (! is_dir($source)) {
            return;
        }
        foreach (File::allFiles($source, true) as $file) {
            $relative = $file->getRelativePathname();
            if ($relative === '.gitignore') {
                continue;
            }
            $destination = $target.'/'.$relative;
            if (is_link($destination)) {
                throw new RuntimeException('Refusing to overwrite a linked upload: '.$relative);
            }
            if (is_file($destination)) {
                if (hash_file('sha256', $file->getPathname()) !== hash_file('sha256', $destination)) {
                    throw new RuntimeException('Existing upload differs; no overwrite performed: '.$relative);
                }

                continue;
            }
            File::ensureDirectoryExists(dirname($destination), 0755, true);
            if (! copy($file->getPathname(), $destination) || hash_file('sha256', $file->getPathname()) !== hash_file('sha256', $destination)) {
                throw new RuntimeException('Could not verify copied upload: '.$relative);
            }
        }
    }
}
