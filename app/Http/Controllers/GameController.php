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
use App\Models\MusicModel;


class GameController extends Controller
{
    public function index()
    {
        $record = ScoresModel::where('user_id', Auth::id())->first();
        if ($record) {
            return redirect()->route('congratulations.index')->with('success', 'You completed all quiz!');
        } 

        if (Auth::check()) {
            $id_key = MusicModel::where('id', Auth::id()); // ->get('music_active');
            if (!$id_key) {
                MusicModel::create([
                    'user_id' => $result_key,
                    'music_active' => 1,
                ]);
            }

        }else{
            $id_key = session()->get('user_session_id');
            if (!$id_key) {
                $id_key = Str::random(40);                
                session()->put('user_session_id', $id_key);
            }
            $music_active = User::where('id', session('user_session_id'))->get('music_active');            
        }

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
        
        if (Auth::check()) {
            $result_key = Auth::id();
        } else {
            $result_key = session()->get('user_session_id');
            if (!$result_key) {
                $result_key = Str::random(40);                
                session()->put('user_session_id', $result_key);
            }
        } 

        $exists = AttemptModel::where('user_id', $result_key)->where('question_id', $request->question_id)->exists();


        if (!$exists) {
            AttemptModel::create([
                'user_id' => $result_key,
                'question_id' => $request->question_id,
                'point' => $request->point
            ]);
        }


      /* Kullanici tum sorulari cozmusse total score olarak kaydet */
      $userAttemptCount = AttemptModel::where('user_id', $result_key)->count();
        $questionsCount = QuestionsModel::count();
        if($userAttemptCount === $questionsCount){
            $totalScore = 0;
            for($i = 1; $i <=  $questionsCount; $i++){
                $attempt = AttemptModel::where('user_id', $result_key)->where('question_id', $i)->first();
                if($attempt){
                    $totalScore += $attempt->point;
                }
            }
            $record = ScoresModel::where('user_id', $result_key)->first();
            if ($record) {
                $record->score =$totalScore;
                $record->save();
            } else {
                ScoresModel::create([
                    'user_id' => $result_key,
                    'score' => $totalScore
                ]);
            }
        } 
  
        return response()->json(['message' => 'Attempt saved successfully']); 
    }

    public function music(Request $request){
        
        if (Auth::check()) {
            $id_key = Auth::id();
        } else {
            $id_key = session()->get('user_session_id');
            if (!$id_key) {
                $id_key = Str::random(40);                
                session()->put('user_session_id', $id_key);
            }
        } 
            
        $musicModel  = MusicModel::where('user_id', $id_key)->first();

        if (!$musicModel ) {
            MusicModel::create([
                'user_id' => $id_key,
                'active' => $request->music_active,
            ]);
        }else{
            $musicModel->active = $request->music_active;
            $musicModel->save();
        }

    }
}

