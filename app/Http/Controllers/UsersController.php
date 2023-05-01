<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UsersResource;
use Illuminate\Support\Facades\Redirect;

class UsersController extends Controller
{
    public function index()
    {
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
