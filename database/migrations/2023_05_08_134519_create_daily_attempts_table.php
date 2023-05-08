<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('daily_attempts', function (Blueprint $table) {
            $table->id();
            $table->text('user_id');
            $table->integer('wrong');
            $table->integer('correct');
            $table->integer('points');
            $table->integer('attempt_count');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('daily_attempts');
    }
};
