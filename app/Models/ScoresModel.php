<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScoresModel extends Model
{
    use HasFactory;
    protected $table = 'scores';
    protected $primaryKey = 'id';
    protected $fillable = ['user_id', 'user_name', 'score' ];
}
