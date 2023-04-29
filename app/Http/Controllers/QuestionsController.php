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
            'correct' => ['required', 'integer', 'between:1,4'],
            'imageQuestion' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif','max:2048'],
            'imageA' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif','max:2048'],
            'imageB' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif','max:2048'],
            'imageC' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif','max:2048'],
            'imageD' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif','max:2048'],
        ]); 

        if($request->question === null) { $request->question = ''; }
        if($request->answer1 === null) { $request->answer1 = ''; }
        if($request->answer2 === null) { $request->answer2 = ''; }
        if($request->answer3 === null) { $request->answer3 = ''; }
        if($request->answer4 === null) { $request->answer4 = ''; }
        

            // Save the question image.
            if ($request->hasFile('imageQuestion')) {
                $imageQuestion = $request->file('imageQuestion');
                $filenameQuestion = time() . '_' . $imageQuestion->getClientOriginalName();
                $pathQuestion = $imageQuestion->storeAs('images', $filenameQuestion, 'public_images');
                $imageUrlQuestion = asset('images/' . $filenameQuestion);
            } else {
                $imageUrlQuestion = null;
            }

            // Save the answer images.
            $imageUrls = [];
            foreach (['A', 'B', 'C', 'D'] as $option) {
                $fieldName = "image{$option}";
                if ($request->hasFile($fieldName)) {
                    $image = $request->file($fieldName);
                    $filename = time() . '_' . $image->getClientOriginalName();
                    $path = $image->storeAs('images', $filename, 'public_images');
                    $imageUrl = asset('images/' . $filename);
                } else {
                    $imageUrl = null;
                }
                $imageUrls[$option] = $imageUrl;
            }

            QuestionsModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->question,
                'image' => $imageUrlQuestion
            ]); 

            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer1,
                'option' => 1,
                'image' => $imageUrls['A']
            ]);
            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer2,
                'option' => 2,
                'image' => $imageUrls['B']
            ]);
            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer3,
                'option' => 3,
                'image' => $imageUrls['C']
            ]);
            AnswersModel::create([ 
                'question_id' => $request->questionID, 
                'text' => $request->answer4,
                'option' => 4,
                'image' => $imageUrls['D']
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
