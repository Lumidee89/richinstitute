<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    public function save(Request $request, ?User $user = null)
    {
        abort_unless($request->user()->role === 'super_admin', 403);
        $data = $request->validate(['name' => 'required|string|max:150', 'email' => ['required', 'email', 'max:254', Rule::unique('users')->ignore($user?->id)], 'role' => 'required|in:editor,super_admin', 'password' => [$user ? 'nullable' : 'required', 'string', 'min:12', 'confirmed']]);
        if ($user?->id === $request->user()->id && $data['role'] !== 'super_admin') {
            throw ValidationException::withMessages(['role' => 'You cannot remove your own administrator privileges.']);
        }
        DB::transaction(function () use ($request, $user, $data) {
            $admins = User::where('role', 'super_admin')->lockForUpdate()->get();
            if ($user?->role === 'super_admin' && $data['role'] !== 'super_admin' && $admins->count() <= 1) {
                throw ValidationException::withMessages(['role' => 'At least one super administrator must remain.']);
            }
            $account = $user ?? new User;
            $account->name = $data['name'];
            $account->email = strtolower($data['email']);
            $account->role = $data['role'];
            if (! empty($data['password'])) {
                $account->password = $data['password'];
            }
            $account->save();
            if ($user && (! empty($data['password']) || $account->wasChanged('role'))) {
                DB::table('sessions')->where('user_id', $account->id)->where('id', '!=', $request->session()->getId())->delete();
            }
            DB::table('activity_logs')->insert(['user_id' => $request->user()->id, 'action' => $user ? 'Updated administrator' : 'Created administrator', 'subject' => $account->email, 'created_at' => now(), 'updated_at' => now()]);
        });

        return back()->with('success', 'Administrator account saved.');
    }

    public function destroy(Request $request, User $user)
    {
        abort_unless($request->user()->role === 'super_admin', 403);
        abort_if($request->user()->id === $user->id, 422, 'You cannot delete your own account.');
        DB::transaction(function () use ($request, $user) {
            $admins = User::where('role', 'super_admin')->lockForUpdate()->get();
            abort_if($user->role === 'super_admin' && $admins->count() <= 1, 422, 'At least one super administrator must remain.');
            DB::table('sessions')->where('user_id', $user->id)->delete();
            DB::table('activity_logs')->insert(['user_id' => $request->user()->id, 'action' => 'Removed administrator', 'subject' => $user->email, 'created_at' => now(), 'updated_at' => now()]);
            $user->delete();
        });

        return back()->with('success','Administrator access removed.');
    }
}
