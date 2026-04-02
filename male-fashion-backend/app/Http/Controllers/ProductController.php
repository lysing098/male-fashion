<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::select(
                    'id',
                    'name',
                    'category_id',
                    'brand_id',
                    'price',
                    'discount',
                    'description',
                    'colors',
                    'sizes'
                )
                ->with([
                    'images:id,product_id,image',
                    'category:id,name',
                    'brand:id,name'
                ]);

        // Search by name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%$search%");
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->whereIn('category_id', $request->category_id);
        }

        // Filter by brand
        if ($request->filled('brand_id')) {
            $query->whereIn('brand_id', $request->brand_id);
        }

        // filter by size
        if($request->filled('sizes')){
            $query->where(function ($q) use ($request){
                foreach($request->sizes as $size){
                    $q->orWhereJsonContains('sizes',$size);
                }
            });
        }

        // filter by color
        if($request->filled('colors')){
            $query->where(function ($q) use ($request){
                foreach ($request->colors as $color){
                    $q->orWhereJsonContains('colors',$color);
                }
            });
        }

        if($request->filled('sort')){
            if($request->sort === 'high'){
                $query->orderBy('price','desc');
            }
            elseif($request->sort === 'low'){
                $query->orderBy('price','asc');
            }
        }
        else{
            $query->orderBy('id','asc');
        }

        $products = $query->paginate(10);

        return response()->json([
            'products' => $products,
            'categories' => Category::select('id','name')->get(),
            'brands' => Brand::select('id','name')->get(),
            'all_color'=>Product::pluck('colors')->flatten()->unique()->values(),
            'all_size'=>Product::pluck('sizes')->flatten()->unique()->values(),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|min:2|max:30',
            'category_id'    => 'required|exists:categories,id',
            'brand_id'    => 'required|exists:brands,id',
            'price'       => 'required|numeric|min:0',
            'discount'    => 'nullable|numeric|min:0|max:80',
            'description' => 'required|string',

            'colors'      => 'required|array',
            'colors.*'    => 'string',

            'sizes'       => 'required|array',
            'sizes.*'     => 'string',

            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $product = Product::create($validated);

        if($request->hasFile('images')){
            foreach($request->file('images') as $image){
                $path = $image->store('product','public');
                $product->images()->create(['image'=>$path]);
            }

        }

        return response()->json([
            'message'=>'created success',
            'product' => $product->load(['images','category','brand'])
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with([
            'images:id,product_id,image',
            'category:id,name',
            'brand:id,name'
        ])->findOrFail($id);

        return response()->json([
            'product' => $product
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::with('images')->findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|min:2|max:30',
            'category_id' => 'required|exists:categories,id',
            'brand_id'    => 'required|exists:brands,id',
            'price'       => 'required|numeric|min:0',
            'discount'    => 'nullable|numeric|min:0|max:80',
            'description' => 'required|string',

            'colors'      => 'required|array',
            'colors.*'    => 'string',

            'sizes'       => 'required|array',
            'sizes.*'     => 'string',

            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            'old_images'   => 'nullable|array',
            'old_images.*' => 'integer',
        ]);

        $product->update($validated);

        // delete removed images
        $keepIds = $request->old_images ?? [];

        foreach ($product->images as $img) {
            if (!in_array($img->id, $keepIds)) {
                Storage::disk('public')->delete($img->image);
                $img->delete();
            }
        }

        // add new images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('product', 'public');
                $product->images()->create(['image' => $path]);
            }
        }

        return response()->json([
            'message' => 'Updated successfully',
            'product' => $product->load(['images','category','brand'])
        ]);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::with('images')->findOrFail($id);

        foreach($product->images as $img){
            Storage::disk('public')->delete($img->image);
            $img->delete();
        }

        $product->delete();

        return response()->json([
            'message' => 'Deleted successfully',
            'product' => $product
        ]);
    }
}
