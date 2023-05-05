<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ResultController extends Controller
{
    public function index()
    {           
        $language = session()->get('language');
        return Inertia::render('Quiz/Result', [
            'language' => $language
        ]);
    }
}
