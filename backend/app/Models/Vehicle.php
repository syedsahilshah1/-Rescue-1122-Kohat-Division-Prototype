<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = ['unit_id', 'type', 'status', 'driver_name', 'driver_contact', 'lat', 'lng', 'oxygen_level', 'equipment'];

}
