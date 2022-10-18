<?php

namespace App\Models;

use App\Models\Model as ModelsModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Datas extends Model
{
    use HasFactory;
    protected $guarded = [''];

    public function model(): BelongsTo
    {
        return $this->belongsTo(ModelsModel::class);
    }
}
