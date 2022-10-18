<?php

namespace App\Http\Controllers;

use App\Models\Datas;
use App\Models\Model;
use App\Models\ResponseEntity;
use Illuminate\Http\Request;

class DataController extends Controller
{
    public function records()
    {
        $data = Datas::orderBy('id', 'DESC')->with('model')->get();
        $response = new ResponseEntity();
        $response->data = $data;
        $response->message = 'liste des données';
        return response()->json($response);
    }


    public function create(Request $request)
    {
        $request->validate([
            'nom_medecin' => 'required',
            'tarif' => 'required',
            'nom_hopital' => 'required',
            'contenue' => 'required',
            'model_id' => 'required',
            'saveModel' => 'required'
        ]);
        $response = new ResponseEntity();
        $model = $request->model_id;
        $saveModel = $request->saveModel;
        $existingModel = Model::whereNom($model['nom'])->first();
        if (!$existingModel) {
            if ($saveModel == false) {
                $response->message = 'le model n\'existe pas';
                $response->status = 404;
                return response()->json($response);
            } else {
                $model = Model::create(['nom' => $model['nom'], 'template' => $model['template']]);
            }
        } else {
            $model = $existingModel;
        }
        $data = $request->only(['nom_medecin', 'tarif', 'nom_hopital', 'contenue']);
        $data['model_id'] = $model->id;
        $result = Datas::create($data);
        $response->message = 'création effectué avec success';
        $response->status = 200;
        $response->data = $result;
        return response()->json($response);
    }

    public function delete(Datas $data)
    {
        $result = $data->delete();
        return response()->json($result, 200);
    }
}
