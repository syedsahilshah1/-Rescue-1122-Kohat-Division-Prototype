<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index()
    {
        return Vehicle::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_id' => 'required|unique:vehicles',
            'type' => 'required',
            'status' => 'required'
        ]);

        return Vehicle::create($validated);
    }

    public function update(Request $request, Vehicle $vehicle)

    {
        $vehicle->update($request->all());
        return $vehicle;
    }
}

