<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    protected $fillable = ['name', 'beds_total', 'beds_occupied', 'critical_cases', 'lat', 'lng', 'specialization', 'ventilators_available'];

}
