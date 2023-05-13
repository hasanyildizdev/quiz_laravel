<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ScoresModel;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {

        $invite_code = $request->invite_code;
        return Inertia::render('Auth/Register',[
            'invite_code' => $invite_code
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|min:3',
            'email' => 'required|string|email|max:255|min:3|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'invite_code' =>  'nullable|int|max:1000000|min:100000',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->update(['invite_code' => $user->id + 100000]);

        if($request->invite_code > 99999 ) {
            $userByCode = User::where('invite_code', 100033);
            if($userByCode->exists()) {
                $user_id = $userByCode->get()->value('id') ;
                if($user_id != null) {
                    $score = ScoresModel::where('user_id', $user_id);
                    if($score->exists()) {
                        $score_old = $score->get()->value('score');
                        $score->update(['score' => $score_old + 100]);
                    } else {
                        ScoresModel::create([
                           'user_id' => $user_id, 
                           'score'=> 100
                        ]); 
                    }
                }
            }
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}
