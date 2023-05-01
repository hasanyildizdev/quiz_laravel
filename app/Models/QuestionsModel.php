<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionsModel extends Model
{
    use HasFactory;
    protected $table = 'questions';
    protected $primaryKey = 'id';
    protected $fillable = ['question_id', 'text' , 'image'];
}
