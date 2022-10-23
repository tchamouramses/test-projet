<?php

namespace App\Http\Controllers;

use App\Models\Model;
use App\Models\ResponseEntity;
use Illuminate\Support\Facades\Request;

class ModelController extends Controller
{

    public function records()
    {
        $models = Model::orderBy('id', 'DESC')->get();
        $response = new ResponseEntity();
        $response->data = $models;
        $response->status = 200;
        $response->message = 'liste des models';
        return response()->json($response);
    }

    public function create(Request $request)
    {
        $request->validate([
            'nom' => 'required',
            'template' => 'required',
        ]);
        $model = new Model($request->only('nom', 'template'));
        $oldModel = Model::whereTemplate($model->template)->first();
        $response = new ResponseEntity();
        if ($oldModel) {
            $response->data = null;
            $response->message = 'le model existe deja';
            $response->status = 403;
        } else {
            $model = $model->save();
            $response->data = $model;
            $response->message = 'model enregistré avec success!!!';
            $response->status = 200;
        }
        return $response;
    }

    public function delete(Model $model)
    {
        $model->delete();
        $response = new ResponseEntity();
        $response->message = 'suppression effectué avec success!!!';
        $response->status = 200;
        return response()->json($response);
    }
}
