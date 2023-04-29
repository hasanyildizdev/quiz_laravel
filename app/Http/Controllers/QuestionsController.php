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
use Illuminate\Support\Facades\Redirect;

class QuestionsController extends Controller
{
    public function index()
    {
        $questions = QuestionsResource::collection(QuestionsModel::all());
        $answers = AnswersResource::collection(AnswersModel::all());
        return Inertia::render('Admin/Questions', [
            'questions' => $questions,
            'answers' => $answers,
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
            'correct' => ['required', 'integer', 'between:1,4'],
            'imageQuestion' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif','max:2048'],
            'imageA' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif','max:2048'],
            'imageB' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif','max:2048'],
            'imageC' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif','max:2048'],
            'imageD' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif','max:2048'],
        ]); 


            QuestionsModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->question,
                'image' => $request->file('imageQuestion')
            ]); 

            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer1,
                'option' => 1,
                'image' => $request->imageA
            ]);
            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer2,
                'option' => 2,
                'image' => $request->imageB
            ]);
            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer3,
                'option' => 3,
                'image' => $request->imageC
            ]);
            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer4,
                'option' => 4,
                'image' => $request->imageD
            ]);
            
            CorrectModel::create([ 
                'question_id' => $request->questionID, 
                'correct_answer_id' => $request->correct,
            ]);  
          // return Redirect::back();
    }
    
    public function delete(Request $request) {
        $questionID = $request->questionID;

        AnswersModel::where('question_id', $questionID)->delete();
        CorrectModel::where('question_id', $questionID)->delete();
        QuestionsModel::where('question_id', $questionID)->delete();
    
        return Redirect::back();
    }
}
