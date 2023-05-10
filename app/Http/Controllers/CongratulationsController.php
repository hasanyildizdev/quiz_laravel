<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\ScoresModel;
use App\Http\Resources\ScoresResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\QuestionsModel;
use App\Models\AttemptModel;

class CongratulationsController extends Controller
{
    public function index()
    {   

        // id atama
        if (Auth::check()) {
            $id_key = Auth::id();
        } else {
            $id_key = session()->get('user_session_id');
            if (!$id_key) {
                $id_key = Str::random(40);                
                session()->put('user_session_id', $id_key);
            }
        } 

        /* Kullanici tum sorulari cozmusse go to Congratulations */
        $userAttemptCount = AttemptModel::where('user_id', $id_key)->count();
        $questionsCount = QuestionsModel::count();
        if($userAttemptCount != $questionsCount){
            return redirect('/');
        } 

        $total_score = 0;
        if( Auth::id() ) {
            $total_score = ScoresModel::where('user_id', Auth::id())->first()->value('score');
        } else if(session()->get('total_score')){
            $total_score = session()->get('total_score');
        }


        return Inertia::render('Quiz/Congratulations', [
            'total_score' => $total_score,
            'language' => session()->get('language')
        ]);
    }
}