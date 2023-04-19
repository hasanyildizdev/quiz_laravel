<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Resources\UsersResource;
use App\Models\ResultModel;
use App\Http\Resources\ResultsResource;
use Illuminate\Support\Facades\Redirect;

class ResultsController extends Controller
{
    public function index()
    {           
        $results = ResultsResource::collection(ResultModel::all());
        return Inertia::render('Admin/Results', [
            'results' => $results,
        ]);
    }

    public function store(Request $request){

        $request->validate([ 
            'score' => ['required', 'integer'],
        ]); 

        $user = Auth::user();
        $userId = $user->id;

        ResultModel::create([ 
            'user_id' => $userId,
            'score' => $request->score,
        ]); 
        

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
         
        return Redirect::back();
    }

    public function delete_score(Request $request) {
        ResultModel::where('id', $request->ID)->delete();
        return Redirect::back();
    }
}
