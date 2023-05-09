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
use App\Models\DailyAttemptModel;


class GameController extends Controller
{
    public function index()
    {

        // Music player
        $music_session = Session::has('music_active');
        if(!$music_session) {
            session()->put('music_active', true);
            $music_active = true;
        }else{
            $music_active = session()->get('music_active');
        }

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
        if($userAttemptCount === $questionsCount){
            return redirect()->route('congratulations.index')->with('success', 'You completed all quiz!');
        } 

        $questions_answered_today = DailyAttemptModel::where('user_id', $id_key)->value('attempt_count');
        // $questions atama
        if( AttemptModel::where('user_id', $id_key)->get()->count() > 0 ){
            $attempted_question_ids = AttemptModel::where('user_id', $id_key)->get()->pluck('question_id')->toArray();
            $attempted_question_ids = array_map('intval', $attempted_question_ids);
            
            if ($questions_answered_today === 0) {
                $questions = QuestionsResource::collection(QuestionsModel::whereNotIn('id', $attempted_question_ids)->inRandomOrder()->limit(7)->get());
            } else if($questions_answered_today === 7){
                return redirect()->route('result.index');
            } else {
                $questions = QuestionsResource::collection(QuestionsModel::whereNotIn('id', $attempted_question_ids)->inRandomOrder()->limit(7 - $questions_answered_today)->get());
            }  
        }else{
            DailyAttemptModel::create([
                'user_id' => $id_key,
                'attempt_count' => 0,
                'correct' => 0,
                'wrong' => 0
            ]);
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
                'point' => $request->point,
            ]);
        }
        
        $today_attempt_count = DailyAttemptModel::where('user_id', $id_key)->value('attempt_count');
        $correct = DailyAttemptModel::where('user_id', $id_key)->value('correct');
        $wrong = DailyAttemptModel::where('user_id', $id_key)->value('wrong');
        
        // questions answered'i 1 arttir
        DailyAttemptModel::where('user_id', $id_key)->update([
            'attempt_count' => $today_attempt_count + 1,
            'correct' => $request->correct ? $correct + 1 : $correct,
            'wrong' => $request->wrong ? $wrong + 1 : $wrong,
            'points' => $request->points
        ]);
 

        /* Score kaydet */
        $attempts = AttemptModel::where('user_id', $id_key)->get();
        $totalPoints = $attempts->sum('point');
        $user_score = ScoresModel::where('user_id', $id_key)->first();
        if ($user_score) {
            $user_score->score =$totalPoints;
            $user_score->save();
        } else {
            ScoresModel::create([
                'user_id' => $id_key,
                'score' => $totalPoints
            ]);
        }
    
        return response()->json(['message' => 'Attempt saved successfully']); 
    }

    public function set_music(Request $request){
        session()->put('music_active', $request->music_active);
        return response()->json(['message' => 'Music status saved successfully']); 
    }

    
}

