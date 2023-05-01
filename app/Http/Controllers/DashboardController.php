<?php

namespace App\Http\Controllers;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function show(Request $request)
    {
/*         $user = Auth::user();
        if (!$user || !$user->hasRole('admin')) {
            return redirect('/')->with('error', 'You do not have permission to access this page.');
        } */

        return Inertia::render('Dashboard');
    }
}
