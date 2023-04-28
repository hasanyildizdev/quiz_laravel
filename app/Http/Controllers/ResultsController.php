<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Resources\UsersResource;
use Illuminate\Support\Facades\Redirect;

class ResultsController extends Controller
{
    public function index()
    {           
        return Inertia::render('Admin/Results');
    }
}
