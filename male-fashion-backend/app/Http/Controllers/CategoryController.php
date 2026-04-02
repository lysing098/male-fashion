<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $querry = Category::query();

        if($request->filled('search')){
            $search = $request->search;
            $querry->where('name','like',"%$search%");
        }

        $category = $querry->orderBy('id','asc')->paginate(10);
        return response()->json([
            'categories'=>$category
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'=>'required|string|min:2|max:15|unique:categories,name',
        ]);

        $category = Category::create($request->all());

        return response()->json([
            'message'=>'crated successs',
            'category'=>$category
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
        $category = Category::findOrFail($id);

        $request->validate([
            'name'=>'required|string|min:2|max:15|unique:categories,name,'.$category->id,
        ]);

        $category->update($request->all());

        return response()->json([
            'message'=>'updated successs',
            'category'=>$category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'message'=>'deleted successs',
            'category'=>$category
        ]);
    }
}
