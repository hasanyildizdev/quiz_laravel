<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\ResultModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

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

        if(ResultModel::find(Auth::user()->id)){
            ResultModel::where('user_id', Auth::user()->id)->update(['score' => $request->score]);
        }else{
            ResultModel::create([ 
                'user_id' => Auth::user()->id,
                'score' => $request->score,
                'total_score' => $request->score
            ]); 
        }
        

    /*     if(auth()->check()){ */
/*         }
        else{
            if (isset($_COOKIE['user_id'])) {
                $userId = $_COOKIE['user_id'];
            } else {
                $userId = uniqid();
                setcookie('user_id', $userId, time() + 86400 * 7); // set cookie to expire after 7 days
            }
            $scores = json_decode(\Cookie::get('local_scores'), true) ?? [];
            $scores[] = [
                'user_id' => $userId,
                'score' => $request->score,
            ];
            \Cookie::queue('local_scores', json_encode($scores));
        }*/
         
        //return Redirect::back();
    }
}
