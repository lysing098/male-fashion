<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $querry = Brand::query();
        if($request->filled('search')){
            $search = $request->search;
            $querry->where('name','like',"%$search%");
        }

        $brand = $querry->orderBy('id','asc')->paginate(10);
        return response()->json([
            'brands'=>$brand
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'=>'required|min:2|max:15,unique:brands,name',
            'logo'=>'required|image|mimes:png,jpg,gif,jpeg,webp'
        ]);

        if($request->hasFile('logo')){
            $data['logo'] = $request->file('logo')->store('brand','public');
        }

        $brand  = Brand::create($data);

        return response()->json([
            'message'=>'created success',
            'brand'=>$brand
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $brand = Brand::findOrFail($id);
        $request->validate([
            'name'=>'required|min:2|max:15,unique:brands,name,'.$brand->id,
            'logo'=>'nullable|image|mimes:png,jpg,gif,jpeg,webp'
        ]);

        if($request->hasFile('logo')){
            if($brand->logo && Storage::disk('public')->exists($brand->logo)){
                Storage::disk('public')->delete($brand->logo);
            }

            $brand['logo'] = $request->file('logo')->store('brand','public');
        }

        $brand->update($request->all());

        return response()->json([
            'message'=>'updated success',
            'brand'=>$brand
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = Brand::findOrFail($id);
        $brand->delete();

        return response()->json([
            'message'=>'deleted success',
            'brand'=>$brand
        ]);
    }
}
