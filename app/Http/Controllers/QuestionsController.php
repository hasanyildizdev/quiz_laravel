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
use Illuminate\Support\Facades\Auth;

class QuestionsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user || !$user->hasRole('admin')) {
            return redirect('/')->with('error', 'You do not have permission to access this page.');
        } 

        $questions = QuestionsResource::collection(QuestionsModel::all());
        $answers = AnswersResource::collection(AnswersModel::all());
        $corrects = CorrectResource::collection(CorrectModel::all());
        return Inertia::render('Admin/Questions', [
            'questions' => $questions,
            'answers' => $answers,
            'corrects' => $corrects
        ]);
    }

    public function store(Request $request){

        $request->validate([ 
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

            // Update or Create Question
            if(  $request->is_update && $request->question_id  != null ) {
                $question_id = $request->question_id;
                QuestionsModel::where('id', $question_id)->update([ 
                    'text' => $request->question,
                    'image' => $imageUrlQuestion
                ]); 
                 AnswersModel::where('question_id', $question_id)->where('option', 1)->update([ 
                    'text' => $request->answer1,
                    'image' => $imageUrls['A']
                ]);
                AnswersModel::where('question_id', $question_id)->where('option', 2)->update([ 
                    'text' => $request->answer2,
                    'image' => $imageUrls['B']
                ]);
                AnswersModel::where('question_id', $question_id)->where('option', 3)->update([ 
                    'text' => $request->answer3,
                    'image' => $imageUrls['C']
                ]);
                AnswersModel::where('question_id', $question_id)->where('option', 4)->update([ 
                    'text' => $request->answer4,
                    'image' => $imageUrls['D']
                ]);
                
                CorrectModel::where('question_id', $question_id)->update([ 
                    'correct_answer_id' => $request->correct,
                ]);  
            }else{
                $newQuestion = QuestionsModel::create([ 
                    'text' => $request->question,
                    'image' => $imageUrlQuestion
                ]); 
                $newQuestionId = $newQuestion->id;
                AnswersModel::create([ 
                    'question_id' => $newQuestionId, 
                    'text' => $request->answer1,
                    'option' => 1,
                    'image' => $imageUrls['A']
                ]);
                AnswersModel::create([ 
                    'question_id' => $newQuestionId, 
                    'text' => $request->answer2,
                    'option' => 2,
                    'image' => $imageUrls['B']
                ]);
                AnswersModel::create([ 
                    'question_id' => $newQuestionId, 
                    'text' => $request->answer3,
                    'option' => 3,
                    'image' => $imageUrls['C']
                ]);
                AnswersModel::create([ 
                    'question_id' => $newQuestionId, 
                    'text' => $request->answer4,
                    'option' => 4,
                    'image' => $imageUrls['D']
                ]);
                
                CorrectModel::create([ 
                    'question_id' => $newQuestionId, 
                    'correct_answer_id' => $request->correct,
                ]);  
            }


         return Redirect::back();
    }
    
    public function delete(Request $request) {
        $questionID = $request->questionID;

        AnswersModel::where('question_id', $questionID)->delete();
        CorrectModel::where('question_id', $questionID)->delete();
        QuestionsModel::where('id', $questionID)->delete();
    
        return Redirect::back();
    }
}
