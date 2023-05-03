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
use App\Models\ScoresModel;
use App\Http\Resources\ScoresResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class GameController extends Controller
{
    public function index()
    {
        // If Completed go to Congratulations
        $record = ScoresModel::where('user_id', Auth::id())->first();
        if ($record) {
            return redirect()->route('congratulations.index')->with('success', 'You completed all quiz!');
        }
        
        // Music player
        $music_session = session()->get('music_active');
        if(!$music_session) {
            session()->put('music_active', true);
            $music_active = true;
        }else{
            $music_active = session()->get('music_active');
        }

        // $questions atama
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
            'advertisement' => $advertisement,
            'music_active' => $music_active
        ]);
    }
    
    public function attempt(Request $request)
    {
        $request->validate([ 
            'question_id' => ['required', 'integer'],
            'point' => ['required', 'integer'],
        ]); 
        
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

        // if question not saved before create attempt
        $exists = AttemptModel::where('user_id', $id_key)->where('question_id', $request->question_id)->exists();
        if (!$exists) {
            AttemptModel::create([
                'user_id' => $id_key,
                'question_id' => $request->question_id,
                'point' => $request->point
            ]);
        }


      /* Kullanici tum sorulari cozmusse total score olarak kaydet */
      $userAttemptCount = AttemptModel::where('user_id', $id_key)->count();
        $questionsCount = QuestionsModel::count();
        if($userAttemptCount === $questionsCount){
            $totalScore = 0;
            for($i = 1; $i <=  $questionsCount; $i++){
                $attempt = AttemptModel::where('user_id', $id_key)->where('question_id', $i)->first();
                if($attempt){
                    $totalScore += $attempt->point;
                }
            }
            $record = ScoresModel::where('user_id', $id_key)->first();
            if ($record) {
                $record->score =$totalScore;
                $record->save();
            } else {
                ScoresModel::create([
                    'user_id' => $id_key,
                    'score' => $totalScore
                ]);
            }
        } 
  
        return response()->json(['message' => 'Attempt saved successfully']); 
    }

    public function set_music(Request $request){
        session()->put('music_active', $request->music_active);
        return response()->json(['message' => 'Music status saved successfully']); 
    }

    public function get_music() {
        return response()->json(session()->get('music_active'));
    }
}

