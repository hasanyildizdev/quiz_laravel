<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UsersResource;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    public function index()
    {

        $user = Auth::user();
        if (!$user || !$user->hasRole('admin')) {
            return redirect('/')->with('error', 'You do not have permission to access this page.');
        } 

        $users = UsersResource::collection(User::all());
        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function delete_user(Request $request) {
        User::where('id', $request->userID)->delete();
        return Redirect::back();
    }
}
