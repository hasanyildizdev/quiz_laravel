<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttemptModel extends Model
{
    use HasFactory;
    protected $table = 'attempts';
    protected $primaryKey = 'id';
    protected $fillable = ['user_id', 'question_id', 'point'];
}
