<?php

namespace Database\Seeders;

use App\Models\Model;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $models = [
            [
                'nom' => 'POLYCLINIQUE CENTRALE ABOBO',
                'template' => 'POLYCLINIQUE CENTRALE ABOBO'
            ],
            [
                'nom' => 'Inconue',
                'template' => 'Route Nyousso Omnisports'
            ]
        ];
        foreach ($models as $item) {
            $model = new Model($item);
            $model->save();
        }
    }
}
