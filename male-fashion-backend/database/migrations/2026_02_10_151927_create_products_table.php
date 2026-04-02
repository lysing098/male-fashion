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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unique(['name', 'brand_id']);
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->decimal('price',8,2);
            $table->decimal('discount',2,2)->default(0);
            $table->text('description');
            $table->json('colors');
            $table->json('sizes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
