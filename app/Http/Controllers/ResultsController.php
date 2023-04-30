<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\ScoresModel;
use App\Http\Resources\ScoresResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ResultsController extends Controller
{
    public function index()
    {           
        $scores = ScoresResource::collection(ScoresModel::all());
        return Inertia::render('Admin/Results',[
            'scores' => $scores
        ]);
    }

    public function delete_score(Request $request){
        ScoresModel::where('id', $request->id)->delete();
        return Redirect::back();
    }
}
