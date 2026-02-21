<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hospital;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    public function index()
    {
        return Hospital::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'beds_total' => 'required|integer',
            'beds_occupied' => 'required|integer',
            'critical_cases' => 'nullable|integer'
        ]);

        return Hospital::create($validated);
    }
}
