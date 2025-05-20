<?php

namespace App\Http\Controllers;

use App\Models\ShortUrl;
use Illuminate\Http\Request;

class ClickController extends Controller
{
    /**
     * Update click count for a specific URL.
     */
    public function updateClickCount($id)
    {
        $shortUrl = ShortUrl::find($id);

        if (!$shortUrl) {
            return response()->json(['message' => 'URL not found'], 404);
        }

        $shortUrl->increment('click_count');

        return response()->json([
            'message' => 'Click count updated',
            'click_count' => $shortUrl->click_count,
        ]);
    }

    /**
     * Get click count for a specific URL.
     */
    public function getClickCount($id)
    {
        $shortUrl = ShortUrl::find($id);

        if (!$shortUrl) {
            return response()->json(['message' => 'URL not found'], 404);
        }

        return response()->json([
            'click_count' => $shortUrl->click_count,
        ]);
    }
}
