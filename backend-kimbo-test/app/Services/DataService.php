<?php

namespace App\Services;

use App\Models\Datas;
use App\Models\Model;
use Illuminate\Support\Str;

class DataService
{
    protected $text;
    protected const PATTERN_TYPE_NUMBER = 1;
    protected const PATTERN_TYPE_TEXT = 0;

    public function dataExtraction($text)
    {
        $this->text = $text;
        $current_model = $this->getCurrentModel();
        if (!$current_model) {
            return null;
        }
        if ($current_model->template == 'POLYCLINIQUE CENTRALE ABOBO') {
            $patterns = [
                [
                    'pattern' => '/Dr [a-z, ]*/i',
                    'type' => DataService::PATTERN_TYPE_TEXT,
                    'name' => 'nom_medecin',
                    'const_start' => '',
                    'const_end' => '',
                ],
                [
                    'pattern' => '/payer[0-9]*/',
                    'type' => DataService::PATTERN_TYPE_NUMBER,
                    'name' => 'tarif',
                    'const_start' => '',
                    'const_end' => '',
                ],
            ];
            $data = $this->extractData($patterns);
            $data->nom_hopital = $current_model->nom;
            $data->model_id = $current_model->id;
            $data->template = $current_model->template;
            return $data;
        } else if ($current_model->template == 'Route Nyousso Omnisports') {
            $patterns = [
                [
                    'pattern' => '/payer[0-9]*/',
                    'type' => DataService::PATTERN_TYPE_NUMBER,
                    'name' => 'tarif',
                    'const_start' => '',
                    'const_end' => '',
                ],
            ];
            $data = $this->extractData($patterns);
            $data->nom_medecin = 'inconue';
            $data->nom_hopital = $current_model->nom;
            $data->model_id = $current_model->id;
            $data->template = $current_model->template;
            return $data;
        }
        return null;
    }

    private function getCurrentModel()
    {
        $current_model = null;
        $models = Model::all();
        foreach ($models as $model) {
            if (str_contains($this->text, $model->template)) {
                $current_model = $model;
            }
        }
        return $current_model;
    }

    private function extractData($patterns = null)
    {
        $data = new Datas();
        // return $this->text;
        $this->text = str_replace('_', '', $this->text);
        $result = '';
        if ($patterns)
            foreach ($patterns as $pattern) {
                $text = '';
                if ($pattern['type'] == DataService::PATTERN_TYPE_NUMBER) {
                    $this->text = str_replace(':', '', $this->text);
                    $this->text = str_replace(';', '', $this->text);
                    $this->text = str_replace('.', '', $this->text);
                    $this->text = str_replace(' ', '', $this->text);
                }
                preg_match_all($pattern['pattern'], $this->text, $matches);

                foreach ($matches[0] as $match) {
                    $result .= ' ' . $match;
                    $text .= ';' . $match;
                }
                $text = substr($text, 1, Str::length($text));
                if ($pattern['type'] == DataService::PATTERN_TYPE_NUMBER) {
                    preg_match('/[0-9]*$/', $text, $matches);
                    $text = $matches[0];
                }
                $data[$pattern['name']] = $text;
            }
        return $data;
    }
}
