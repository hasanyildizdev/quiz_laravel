<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\ScoresModel;
use App\Http\Resources\ScoresResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CongratulationsController extends Controller
{
    public function index()
    {   
        $total_score = 0;
        $record = ScoresModel::where('user_id', Auth::id())->first();
        if ($record) {
          $total_score = $record->score;
        }         

        return Inertia::render('Quiz/Congratulations', [
            'total_score' => $total_score,
            'language' => session()->get('language')
        ]);
    }
}