<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShortUrl;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class UrlShortenerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['redirect']);
    }

    public function shorten(Request $request)
    {
        try {
        $validator = Validator::make($request->all(), [
            'original_url' => 'required|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid input',
                'errors' => $validator->errors(),
            ], 422);
        }

            $code = Str::random(6);
            $url = new ShortUrl();
            $url->original_url = $request->original_url;
            $url->shortened_url = $code;
            $url->save();

            return response()->json([
                'id' => $url->id,
                'long_url' => $url->original_url,
                'code' => $url->shortened_url,
                'clicks' => $url->click_count,
                'created_at' => $url->created_at,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create short URL',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            if (!$request->user()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 401);
            }

            $urls = $request->user()->shortUrls()->latest()->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $urls->map(function ($url) {
                    return [
                        'id' => $url->id,
                        'long_url' => $url->original_url,
                        'short_url' => config('app.url') . '/' . $url->shortened_url,
                        'clicks' => $url->click_count ?? 0,
                        'expired_at' => $url->expired_at ? Carbon::parse($url->expired_at)->format('Y-m-d H:i:s') : null,
                        'created_at' => Carbon::parse($url->created_at)->format('Y-m-d H:i:s'),
                    ];
                })
            ]);
        } catch (\Exception $e) {
            Log::error('Error in index method: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil daftar URL',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function paginate(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 5);
            $urls = ShortUrl::paginate($perPage);
            return response()->json($urls);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to paginate URLs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $url = ShortUrl::findOrFail($id);
            $url->delete();
            return response()->json(['message' => 'URL deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error in destroy method: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete URL',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function restore($id)
    {
        try {
            $url = ShortUrl::withTrashed()->findOrFail($id);
            $url->restore();
            return response()->json(['message' => 'URL restored'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'URL not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to restore URL', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            if (!$request->user()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'url' => 'required|url',
                'expired_at' => 'nullable|date|after:now'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Invalid input',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $url = ShortUrl::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$url) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'URL tidak ditemukan'
                ], 404);
            }

            $url->original_url = $request->url;
            if ($request->expired_at) {
                $url->expired_at = Carbon::parse($request->expired_at);
            }
            $url->save();

            return response()->json([
                'id' => $url->id,
                'long_url' => $url->original_url,
                'short_url' => config('app.url') . '/' . $url->shortened_url,
                'clicks' => $url->click_count ?? 0,
                'expired_at' => $url->expired_at ? Carbon::parse($url->expired_at)->format('Y-m-d H:i:s') : null,
                'created_at' => Carbon::parse($url->created_at)->format('Y-m-d H:i:s'),
            ]);
        } catch (\Exception $e) {
            Log::error('Error in update method: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update URL',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $url = ShortUrl::findOrFail($id);
            return response()->json($url);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'URL not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch URL', 'error' => $e->getMessage()], 500);
        }
    }

    public function search(Request $request)
    {
        $query = $request->query('query');
        if (!$query) {
            return response()->json(['message' => 'Query parameter is required'], 400);
        }

        try {
            $perPage = $request->get('per_page', 10);

            $urls = ShortUrl::where('original_url', 'LIKE', "%{$query}%")
                ->orWhere('shortened_url', 'LIKE', "%{$query}%")
                ->paginate($perPage);

            if ($urls->isEmpty()) {
                return response()->json(['message' => 'Data not found'], 404);
            }

            return response()->json($urls);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to search URLs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            if (!$request->user()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'url' => 'required|url',
                'expired_at' => 'nullable|date|after:now'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Invalid input',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $shortUrl = $request->user()->shortUrls()->create([
                'original_url' => $request->url,
                'shortened_url' => Str::random(6),
                'expired_at' => $request->expired_at ? Carbon::parse($request->expired_at) : now()->addDays(7),
                'click_count' => 0
            ]);

            return response()->json([
                'id' => $shortUrl->id,
                'long_url' => $shortUrl->original_url,
                'short_url' => config('app.url') . '/' . $shortUrl->shortened_url,
                'clicks' => $shortUrl->click_count,
                'expired_at' => $shortUrl->expired_at ? Carbon::parse($shortUrl->expired_at)->format('Y-m-d H:i:s') : null,
                'created_at' => Carbon::parse($shortUrl->created_at)->format('Y-m-d H:i:s'),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error in store method: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create short URL',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function redirect($code)
    {
        try {
            $url = ShortUrl::where('shortened_url', $code)
                ->where(function ($query) {
                    $query->where('expired_at', '>', now())
                        ->orWhereNull('expired_at');
                })
                ->first();

            if (!$url) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'URL tidak ditemukan atau sudah kedaluwarsa',
                    'code' => $code
                ], 404);
            }

            $url->increment('click_count');
            
            // Log redirect untuk debugging
            Log::info('Redirecting URL', [
                'code' => $code,
                'original_url' => $url->original_url,
                'click_count' => $url->click_count
            ]);

            return redirect($url->original_url);
        } catch (\Exception $e) {
            Log::error('Error in redirect method: ' . $e->getMessage(), [
                'code' => $code,
                'exception' => $e
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengakses URL',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
