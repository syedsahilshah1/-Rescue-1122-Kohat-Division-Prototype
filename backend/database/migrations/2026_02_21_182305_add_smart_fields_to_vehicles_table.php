<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->integer('oxygen_level')->default(100)->after('status');
            $table->string('equipment')->nullable()->after('oxygen_level'); // e.g. "Ventilator, Defibrillator"
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['oxygen_level', 'equipment']);
        });
    }

};
