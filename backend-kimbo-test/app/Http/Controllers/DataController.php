<?php

namespace App\Http\Controllers;

use App\Models\Datas;
use App\Models\ResponseEntity;
use App\Services\DataService;
use Illuminate\Http\Request;
use thiagoalessio\TesseractOCR\TesseractOCR;

class DataController extends Controller
{
    public function records()
    {
        $data = Datas::orderBy('id', 'DESC')->with('model')->get();
        $response = new ResponseEntity();
        $response->data = $data;
        $response->message = 'liste des données';
        $response->status = 200;
        return response()->json($response);
    }


    public function extract(Request $request)
    {
        $response = new ResponseEntity();
        if (!$request->hasFile('image')) {
            $response->data = null;
            $response->message = 'no file selected';
            $response->status = 404;
            return response()->json($response);
        }
        $ocr = new TesseractOCR();
        $ocr->image($request->file('image'));
        $res = $ocr->run();
        $dataService = new DataService();
        // $response->data = $res;
        $response->data = $dataService->dataExtraction($res);
        $response->message = 'liste des données';
        $response->status = 200;
        return response()->json($response);
    }

    public function delete(Datas $data)
    {
        $data->delete();
        $response = new ResponseEntity();
        $response->message = 'suppression effectué avec success!!!';
        $response->status = 200;
        return response()->json($response);
    }

    public function create(Request $request)
    {
        $request->validate([
            'nom_medecin' => 'required',
            'nom_hopital' => 'required',
            'tarif' => 'required',
            'model_id' => 'required'
        ]);
        $data = new Datas($request->all());
        $data = $data->save();
        $response = new ResponseEntity();
        $response->status = 200;
        $response->message = 'suppression effectué avec success!!!';
        if ($data) {
            $response->status = 404;
            $response->message = 'erreur!!! model inexistant';
        }
        return response()->json($response);
    }
}
