<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name','category_id','brand_id','price','discount','description','colors','sizes'];

    protected $casts = ['colors'=>'array','sizes'=>'array'];

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function brand(){
        return $this->belongsTo(Brand::class);
    }

    public function images(){
        return $this->hasMany(Image::class);
    }
}
