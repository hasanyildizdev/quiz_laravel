<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorrectModel extends Model
{
    use HasFactory;
    protected $table = 'correct';
    protected $primaryKey = 'id';
    protected $fillable = ['question_id', 'correct_answer_id'];
}
