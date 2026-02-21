<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IncidentController;
use App\Http\Controllers\Api\HospitalController;
use App\Http\Controllers\Api\VehicleController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource('incidents', IncidentController::class);
    Route::apiResource('hospitals', HospitalController::class);
    Route::apiResource('vehicles', VehicleController::class);
});

// For demo purposes, allow public access to list
Route::get('/public/incidents', [IncidentController::class, 'index']);
Route::get('/public/hospitals', [HospitalController::class, 'index']);
Route::get('/public/vehicles', [VehicleController::class, 'index']);
