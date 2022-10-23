<?php

use App\Http\Controllers\DataController;
use App\Http\Controllers\ModelController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::controller(DataController::class)->prefix('data')->group(function () {
    Route::get('/', 'records');
    Route::post('/', 'create');
    Route::post('/extract', 'extract');
    Route::delete('/{data}', 'delete');
});

Route::controller(ModelController::class)->prefix('model')->group(function () {
    Route::get('/', 'records');
    Route::post('/', 'create');
    Route::delete('/{model}', 'delete');
});
