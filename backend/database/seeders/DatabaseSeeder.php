<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Incident;
use App\Models\Hospital;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Hospitals First
        $dhq = Hospital::create(['name' => 'DHQ Hospital (KDA) Kohat', 'specialization' => 'Trauma & General', 'beds_total' => 120, 'beds_occupied' => 95, 'critical_cases' => 12, 'ventilators_available' => 5, 'lat' => '33.5812', 'lng' => '71.4654']);
        $lmh = Hospital::create(['name' => 'Liaquat Memorial Hospital', 'specialization' => 'Burn & ICU Specialist', 'beds_total' => 80, 'beds_occupied' => 45, 'critical_cases' => 8, 'ventilators_available' => 3, 'lat' => '33.5700', 'lng' => '71.4350']);
        $cmh = Hospital::create(['name' => 'CMH Kohat', 'specialization' => 'Multi-Specialty Military', 'beds_total' => 150, 'beds_occupied' => 110, 'critical_cases' => 15, 'ventilators_available' => 10, 'lat' => '33.5950', 'lng' => '71.4420']);

        // 2. Seed Users
        User::create([
            'name' => 'Dr. Adnan (Admin)',
            'email' => 'admin@rescue1122.pk',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Operator 01 (Kohat)',
            'email' => 'op1@rescue1122.pk',
            'password' => Hash::make('password'),
            'role' => 'operator',
        ]);

        User::create([
            'name' => 'Rescue Unit KHT-01',
            'email' => 'responder@rescue1122.pk',
            'password' => Hash::make('password'),
            'role' => 'responder',
        ]);

        // Specific Hospital Users
        User::create([
            'name' => 'DHQ Hospital Manager',
            'email' => 'dhq@hospital.pk',
            'password' => Hash::make('password'),
            'role' => 'hospital',
            'hospital_id' => $dhq->id
        ]);

        User::create([
            'name' => 'Liaquat Hospital Manager',
            'email' => 'lmh@hospital.pk',
            'password' => Hash::make('password'),
            'role' => 'hospital',
            'hospital_id' => $lmh->id
        ]);

        User::create([
            'name' => 'CMH Kohat Manager',
            'email' => 'cmh@hospital.pk',
            'password' => Hash::make('password'),
            'role' => 'hospital',
            'hospital_id' => $cmh->id
        ]);


        // 3. Seed Incidents
        Incident::create(['type' => 'Road Traffic Accident', 'location' => 'KDA Gate, Kohat', 'status' => 'Dispatching', 'severity' => 'Critical', 'lat' => '33.5812', 'lng' => '71.4654']);
        Incident::create(['type' => 'Medical Emergency', 'location' => 'Bannu Road, Kohat', 'status' => 'On Scene', 'severity' => 'Moderate', 'lat' => '33.5721', 'lng' => '71.4321']);
        Incident::create(['type' => 'Fire Outbreak', 'location' => 'Main Bazaar, Kohat', 'status' => 'Completed', 'severity' => 'High', 'lat' => '33.5891', 'lng' => '71.4412']);


        // 4. Seed Vehicles
        Vehicle::create(['unit_id' => 'KHT-1122-01', 'type' => 'ALS (Advanced)', 'status' => 'In Service', 'driver_name' => 'Ahmad Ali', 'driver_contact' => '0300-1122334', 'lat' => '33.5850', 'lng' => '71.4450', 'oxygen_level' => 92, 'equipment' => 'Ventilator, Defibrillator, Patient Monitor']);
        Vehicle::create(['unit_id' => 'KHT-1122-02', 'type' => 'BLS (Basic)', 'status' => 'On Call', 'driver_name' => 'Zahir Khan', 'driver_contact' => '0312-5566778', 'lat' => '33.5800', 'lng' => '71.4500', 'oxygen_level' => 45, 'equipment' => 'First Aid Kit, Stretcher, Oxygen Cylinder']);
        Vehicle::create(['unit_id' => 'KHT-1122-03', 'type' => 'ALV (Rescue)', 'status' => 'Charging', 'driver_name' => 'Muhammad Usman', 'driver_contact' => '0333-9988771', 'lat' => '33.5900', 'lng' => '71.4400', 'oxygen_level' => 100, 'equipment' => 'Extrication Gear, Fire Extinguisher']);


    }
}
