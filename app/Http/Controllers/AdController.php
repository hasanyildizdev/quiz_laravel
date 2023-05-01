<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AdvertisementModel;
use App\Http\Resources\AdvertisementResource;
use Illuminate\Support\Facades\Redirect;

class AdController extends Controller
{
    public function index()
    {
        $advertisement = AdvertisementResource::collection(AdvertisementModel::all());
        return Inertia::render('Admin/Ad', [
            'advertisement' => $advertisement
        ]);
    }

    public function update(Request $request){
    
        $request->validate([ 
            'question_id' => ['required', 'integer'],
            'active' => ['required', 'boolean'],
        ]); 

        $data = [
            'question_id' => $request->question_id,
            'active' => (int)$request->active
        ];
        
        AdvertisementModel::where('id', 1)->first()->update($data);
        
        return Redirect::back();
    }
}
