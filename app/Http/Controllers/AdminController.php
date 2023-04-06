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
use App\Models\User;
use App\Http\Resources\UsersResource;
class AdminController extends Controller

{
    public function index()
    {
        $questions = QuestionsResource::collection(QuestionsModel::all());
        $answers = AnswersResource::collection(AnswersModel::all());
        $users = UsersResource::collection(User::all());
        return Inertia::render('Quiz/Admin', [
            'questions' => $questions,
            'answers' => $answers,
            'users' => $users,
        ]);
    }

    public function store(Request $request){

        $request->validate([ 
            'questionID' => ['required', 'integer'],
            'question' => ['required', 'string', 'max:255'],
            'answer1' => ['required', 'string', 'max:255'],
            'answer2' => ['required', 'string', 'max:255'],
            'answer3' => ['required', 'string', 'max:255'],
            'answer4' => ['required', 'string', 'max:255'],
            'correct' => ['required', 'integer', 'between:1,4']
        ]); 

            QuestionsModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->question,
            ]); 

            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer1,
                'option' => 1
            ]);
            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer2,
                'option' => 2
            ]);
            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer3,
                'option' => 3
            ]);
            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer4,
                'option' => 4
            ]);
            
            CorrectModel::create([ 
                'question_id' => $request->questionID, 
                'correct_answer_id' => $request->correct,
            ]);  

            return to_route('admin.index');
    }

    public function delete(Request $request) {
        $questionID = $request->questionID;

        AnswersModel::where('question_id', $questionID)->delete();
        CorrectModel::where('question_id', $questionID)->delete();
        QuestionsModel::where('question_id', $questionID)->delete();
    
        return to_route('admin.index');
    }

    public function delete_user(Request $request) {
        User::where('id', $request->userID)->delete();
        return to_route('admin.index');
    }

    
}
