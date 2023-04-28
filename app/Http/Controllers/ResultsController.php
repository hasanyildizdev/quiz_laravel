<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Resources\UsersResource;
use App\Models\ResultModel;
use App\Http\Resources\ResultsResource;
use Illuminate\Support\Facades\Redirect;

class ResultsController extends Controller
{
    public function index()
    {           
        $results = ResultsResource::collection(ResultModel::all());
        return Inertia::render('Admin/Results', [
            'results' => $results,
        ]);
    }

    public function delete_score(Request $request) {
        ResultModel::where('id', $request->ID)->delete();
        return Redirect::back();
    }
}
