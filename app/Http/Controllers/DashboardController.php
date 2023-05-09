<?php

namespace App\Http\Controllers;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\QuestionsModel;
use App\Models\User;
use App\Models\AttemptModel;
use App\Models\AdvertisementModel;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function show(Request $request)
    {
        $user = Auth::user();
        if (!$user || !$user->hasRole('admin')) {
            return redirect('/')->with('error', 'You do not have permission to access this page.');
        } 

        $advertisement = AdvertisementModel::where('id', 1)->value('active');
        $usersCount = User::count();
        $questionsCount = QuestionsModel::count();
        $attemptsCount = AttemptModel::count();

        return Inertia::render('Dashboard',[
            'usersCount' => $usersCount,
            'questionsCount' => $questionsCount,
            'attemptsCount' => $attemptsCount,
            'advertisement' => $advertisement
        ]);
    }
}
