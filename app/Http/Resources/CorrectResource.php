<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CorrectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'question_id' => $this->question_id,
            'correct_answer_id' => $this->correct_answer_id,
        ];
    }
}
