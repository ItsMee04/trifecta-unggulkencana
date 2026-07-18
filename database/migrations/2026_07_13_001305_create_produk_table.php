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
        Schema::create('produk', function (Blueprint $table) {
            $table->id();
            $table->string('kodeproduk', 20);
            $table->string('nama', 100);
            $table->decimal('berat', 8, 3)->default(0.0);
            $table->unsignedBigInteger('jenisproduk_id');
            $table->unsignedBigInteger('karat_id');
            $table->unsignedBigInteger('jeniskarat_id');
            $table->integer('lingkar')->unsigned()->default(0);
            $table->integer('panjang')->unsigned()->default(0);
            $table->unsignedBigInteger('harga_id');
            $table->integer('hargabeli')->unsigned()->default(0);
            $table->text('keterangan')->nullable();
            $table->unsignedBigInteger('kondisi_id')->nullable()->default(1);
            $table->string('image', 100)->nullable();
            $table->unsignedBigInteger('oleh');
            $table->integer('status')->unsigned()->default(1);
            $table->timestamps();

            $table->foreign('jenisproduk_id')->references('id')->on('jenisproduk')->onDelete('cascade');
            $table->foreign('karat_id')->references('id')->on('karat')->onDelete('cascade');
            $table->foreign('jeniskarat_id')->references('id')->on('jeniskarat')->onDelete('cascade');
            $table->foreign('harga_id')->references('id')->on('harga')->onDelete('cascade');
            $table->foreign('kondisi_id')->references('id')->on('kondisi')->onDelete('cascade');
            $table->foreign('oleh')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
