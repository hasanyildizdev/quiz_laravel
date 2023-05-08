<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyAttemptModel extends Model
{
    use HasFactory;
    protected $table = 'daily_attempts';
    protected $primaryKey = 'id';
    protected $fillable = ['user_id', 'attempt_count' , 'correct', 'wrong', 'points'];
}
