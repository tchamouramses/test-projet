<?php

namespace App\Http\Controllers;

use App\Models\Model;
use Illuminate\Support\Facades\Request;

class ModelController extends Controller
{
    public function records()
    {
        $models = Model::orderBy('id', 'DESC')->get();
        return response()->json($models, 200);
    }

    public function create(Request $request)
    {
        $template = $request->templete;
        $models = Model::orderBy('id', 'DESC')->get();
        if ($template) {
            foreach ($models as $model) {
                $modelTemplate = explode(' ', $model->template);
                $incomingModel = explode(' ', $template);
                $percent = 0;
                $range = 100 / count($modelTemplate);
                foreach ($modelTemplate as $key) {
                    if (array_search($key, $incomingModel)) {
                        $percent += $range;
                    }
                }
            }
        }
    }
}
