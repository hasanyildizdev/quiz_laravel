<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\ResultModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\User;

use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function index()
    {           
        return Inertia::render('Quiz/Result');
    }

    public function store(Request $request){
        $request->validate([ 
            'score' => ['required', 'integer'],
        ]); 

        User::where('id', Auth::user()->id)->update(['score' => $request->score]);
        User::where('id', Auth::user()->id)->update(['total_score' => total_score]);

         
        return Redirect::back();
    }
}
