<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ShortUrl;

class DeleteExpiredUrls extends Command
{
    protected $signature = 'urls:clean-expired';
    protected $description = 'Delete expired short URLs';

    public function handle()
    {
        $count = ShortUrl::where('expires_at', '<', now())->delete();
        $this->info("Deleted {$count} expired URLs.");
    }
}
