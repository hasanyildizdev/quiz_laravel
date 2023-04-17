<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\ResultModel;
use App\Models\User;
use App\Http\Resources\UsersResource;
use Illuminate\Support\Facades\Auth;

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
         
        return to_route('result.index');
    }
}
