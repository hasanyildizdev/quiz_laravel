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

        if (Auth::check()) {
            $user_id = Auth::id();
            
            /* Tum sorular cozulduyse go to Congratulations */
            $userAttempt = AttemptModel::where('user_id', $user_id)->get();
            if($userAttempt) {
                $userAttemptCount = $userAttempt->count();
                $questionsCount = QuestionsModel::count();
                if($userAttemptCount === $questionsCount){
                    return redirect()->route('congratulations.index')->with('success', 'You completed all quiz!');
                } 
            }
            
            // $questions atama
            if($userAttempt) {
                // Today attempt count
                $daily_attempt = DailyAttemptModel::where('user_id', $user_id );
                $attempt_count_today = $daily_attempt ? $daily_attempt->value('attempt_count') : 0;
                $attempted_question_ids = AttemptModel::where('user_id',  $user_id)->get()->pluck('question_id')->toArray();
                $attempted_question_ids = array_map('intval', $attempted_question_ids);
                
                if ($attempt_count_today === 0) {
                    $questions = QuestionsResource::collection(QuestionsModel::whereNotIn('id', $attempted_question_ids)->inRandomOrder()->limit(7)->get());
                } else if($attempt_count_today === 7){
                    return redirect()->route('result.index');
                } else {
                    $questions = QuestionsResource::collection(QuestionsModel::whereNotIn('id', $attempted_question_ids)->inRandomOrder()->limit(7 - $attempt_count_today)->get());
                }  
            } else{
                $questions = QuestionsResource::collection(QuestionsModel::inRandomOrder()->limit(7)->get());
            }

        } else {
            /* Kullanici tum sorulari cozmusse go to Congratulations */
            $userAttempt = session()->get('attempts', []);
            if($userAttempt) {
                $userAttemptCount = count($userAttempt);
                $questionsCount = QuestionsModel::count();
                if( $userAttemptCount === $questionsCount) {
                    return redirect()->route('congratulations.index')->with('success', 'You completed all quiz!');
                }
            }

            // $questions atama
            if($userAttempt) {
                // Today attempt count
                $attempt_count_today = session()->get('attempt_count') ?? 0;
                $attempted_question_ids = [];
                foreach ($userAttempt as $attempt) {
                    array_push($attempted_question_ids, $attempt['question_id']);
                }
                $attempted_question_ids = array_map('intval', $attempted_question_ids);
                if($attempt_count_today  === 0){
                    $questions = QuestionsResource::collection(QuestionsModel::whereNotIn('id', $attempted_question_ids)->inRandomOrder()->limit(7)->get());
                } else if($attempt_count_today === 7 ) {
                    return redirect()->route('result.index');
                } else {
                    $questions = QuestionsResource::collection(QuestionsModel::whereNotIn('id', $attempted_question_ids)->inRandomOrder()->limit(7 - $attempt_count_today)->get());
                }
            } else {
                $questions = QuestionsResource::collection(QuestionsModel::inRandomOrder()->limit(7)->get());
            }
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

        // Question Attempt
        if( Auth::check() ) {
            $user_id = Auth::id();
            $exists = AttemptModel::where('user_id', $user_id)->where('question_id', $request->question_id)->exists();
            // if question not saved before create attempt
            if ( !$exists ) {
                AttemptModel::create([
                    'user_id' => $user_id,
                    'question_id' => $request->question_id,
                    'point' => $request->point
                ]);
            } 
        } else {
            $attempts = session()->get('attempts', []);
            // hic attempt yoksa
            if(!$attempts) {
                $attempt = [
                    'question_id' => $request->question_id,
                    'point' => $request->point
                ];
                array_push($attempts, $attempt);
                session()->put('attempts', $attempts);
            } else {
                $isExist = false;
                // sorunun kaydi yoksa kaydet
                foreach ($attempts as $attempt) {
                    if ($attempt['question_id'] === $request->question_id) {
                        $isExist = true;  
                        break;    
                    }
                }
                if(!$isExist) {
                    $attempt = [
                        'question_id' => $request->question_id,
                        'point' => $request->point
                    ];
                    array_push($attempts, $attempt);
                    session()->put('attempts', $attempts);   
                }
            }
        }

        // Daily Attempt
        if( Auth::check() ) {
            $user_id = Auth::id();
            $daily_attempt = DailyAttemptModel::where('user_id', $user_id);
            if( $daily_attempt ) {
                $today_attempt_count = $daily_attempt->value('attempt_count') ? $daily_attempt->value('attempt_count') : 0;
                $old_points = $daily_attempt->value('points') ? $daily_attempt->value('points') : 0;
                $correct = $daily_attempt->value('correct') ? $daily_attempt->value('correct') : 0;
                $wrong = $daily_attempt->value('wrong') ? $daily_attempt->value('wrong') : 0; 
                $daily_attempt->update([
                    'attempt_count' => $today_attempt_count + 1,
                    'correct' => $request->correct ? $correct + 1 : $correct,
                    'wrong' => $request->wrong ? $wrong + 1 : $wrong,
                    'points' => $request->point + $old_points
                ]);
            } else {
                DailyAttemptModel::create([
                    'user_id' => $user_id,
                    'attempt_count' => 1,
                    'correct' =>$request->correct ? 1 : 0,
                    'wrong' =>$request->wrong ? 1 : 0,
                    'points' => $request->point ? $request->point : 0
                ]);
            }
        } else {
            // Daily Attempt Session
            $today_attempt_count = session()->get('attempt_count') ? session()->get('attempt_count') : 0;
            $old_points = session()->get('points') ? session()->get('points') : 0;
            $correct = session()->get('correct') ? session()->get('correct') : 0;
            $wrong = session()->get('wrong') ? session()->get('wrong') : 0;
            session()->put('attempt_count', $today_attempt_count + 1 );
            session()->put('correct',  $request->correct ? $correct + 1 : $correct);
            session()->put('wrong',$request->wrong ? $wrong + 1 : $wrong);
            session()->put('points', $request->point + $old_points);
            session()->put('updated_at', date("Y-m-d", time()));
        }
        

        
        // Total scoru session'a kaydet
        if ( Auth::check() ) {
            $user_id = Auth::id();
            $user_name = Auth::user()->name;
            $attempts = AttemptModel::where('user_id', $user_id)->get();
            if($attempts) {
                $totalPoints = $attempts->sum('point');
                $user_score = ScoresModel::where('user_id', $user_id)->first();
                if ($user_score) {
                    $user_score->score =$totalPoints;
                    $user_score->save();
                } else {
                    ScoresModel::create([
                        'user_id' => $user_id,
                        'user_name' => $user_name,
                        'score' => $totalPoints
                    ]);
                }
            }
        } else {
            $totalPoints = 0;
            $attempts = session()->get('attempts',[]);
            if(count($attempts)>0){
                foreach($attempts as $attempt) {
                    $totalPoints =  $totalPoints + $attempt['point'];
                }
                session()->put('total_score', $totalPoints);
            } 
        }

        return response()->json(['message' => 'Attempt saved successfully']); 
    }

    public function set_music(Request $request){
        session()->put('music_active', $request->music_active);
        return response()->json(['message' => 'Music status saved successfully']); 
    }

    
}

