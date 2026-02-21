<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use Illuminate\Http\Request;

class IncidentController extends Controller
{
    public function index()
    {
        return Incident::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required',
            'location' => 'required',
            'severity' => 'required',
            'status' => 'nullable',
            'lat' => 'nullable',
            'lng' => 'nullable'
        ]);

        return Incident::create($validated);
    }

    public function show(Incident $incident)
    {
        return $incident;
    }

    public function update(Request $request, Incident $incident)
    {
        $incident->update($request->all());
        return $incident;
    }
}
