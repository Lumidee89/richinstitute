<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    public function preferences(Request $request, int $subscriber)
    {
        $record = DB::table('subscribers')->find($subscriber);
        abort_unless($record, 404);

        return Inertia::render('NewsletterPreferences', ['status' => $record->status, 'action' => $request->fullUrl()]);
    }

    public function unsubscribe(Request $request, int $subscriber)
    {
        abort_unless(DB::table('subscribers')->where('id', $subscriber)->exists(), 404);
        DB::table('subscribers')->where('id', $subscriber)->update(['status' => 'unsubscribed', 'unsubscribed_at' => now(), 'updated_at' => now()]);

        return back()->with('success', 'You have been unsubscribed. You will no longer receive community emails.');
    }
}
