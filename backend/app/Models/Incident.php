<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    protected $fillable = ['type', 'location', 'status', 'severity', 'lat', 'lng', 'vehicle_id'];

}
