<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\ScoresModel;
use App\Http\Resources\ScoresResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;

class ResultsController extends Controller
{
    public function index()
    {         
        
        $user = Auth::user();
        if (!$user || !$user->hasRole('admin')) {
            return redirect('/')->with('error', 'You do not have permission to access this page.');
        } 
        
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
