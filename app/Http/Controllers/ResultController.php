<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function index()
    {           
        return Inertia::render('Quiz/Result');
    }
}
