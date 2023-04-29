<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\QuestionsModel;
use App\Http\Resources\QuestionsResource;
use App\Models\AnswersModel;
use App\Http\Resources\AnswersResource;
use App\Models\CorrectModel;
use App\Http\Resources\CorrectResource;
use App\Models\AdvertisementModel;
use App\Http\Resources\AdvertisementResource;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use App\Models\AttemptModel;
use App\Http\Resources\AttemptResource;
use Illuminate\Support\Facades\Auth;

class GameController extends Controller
{
    public function index()
    {

        if( AttemptModel::where('user_id', Auth::id())->get()->count() > 0 ){
            $attempted_question_ids = AttemptModel::where('user_id', Auth::id())->get()->pluck('question_id')->toArray();
            $attempted_question_ids = array_map('intval', $attempted_question_ids);
            $questions = QuestionsResource::collection(QuestionsModel::whereNotIn('question_id', $attempted_question_ids)->inRandomOrder()->limit(7)->get());
        }else{
            $questions = QuestionsResource::collection(QuestionsModel::inRandomOrder()->limit(7)->get());
        } 
        $answers = AnswersResource::collection(AnswersModel::all());
        $correct = CorrectResource::collection(CorrectModel::all());
        $advertisement = AdvertisementResource::collection(AdvertisementModel::all());

        return Inertia::render('Quiz/Game', [
            'questions' => $questions,
            'answers' => $answers,
            'correct' => $correct,
            'advertisement' => $advertisement
        ]);
    }
    
    public function attempt(Request $request)
    {
        $request->validate([ 
            'question_id' => ['required', 'integer'],
            'point' => ['required', 'integer'],
        ]); 

        if(AttemptModel::where('user_id', Auth::id())->where('question_id', $request->question_id)->count() == 0){
            AttemptModel::create([
                'user_id' => Auth::id(),
                'question_id' => $request->question_id,
                'point' => $request->point
            ]);
        }

        return response()->json(['success' => true]);
    }
}

