<?php

namespace App\Http\Controllers;

use App\Models\Carousel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarouselController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $querry = Carousel::query();

        if($request->filled('search')){
            $search = $request->search;
            $querry->where('title','like',"%$search%");
        }

        if($request->filled('status')){
            $querry->where('status',$request->status);
        }

        $carousel = $querry->orderBy('order','asc')->paginate(10);
        return response()->json([
            'carousels'=>$carousel
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'=>'required|string|min:20',
            'description'=>'required|min:30',
            'collection'=>'required|min:15',
            'status'=>'required|in:active,inactive',
            'order'=>'required|min:1|unique:carousels,order',
            'image'=>'required|image|mimes:jpg,png,jpeg,gif,webp'
        ]);

        if($request->hasFile('image')){
            $data['image'] = $request->file('image')->store('carousel','public');
        }

        $carousel = Carousel::create($data);

        return response()->json([
            'message'=>'created success',
            'carousel'=>$carousel
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
        $carousel = Carousel::findOrFail($id);
        $data = $request->validate([
            'title'=>'required|string|min:20',
            'description'=>'required|min:30',
            'collection'=>'required|min:15',
            'status'=>'required|in:active,inactive',
            'order'=>'required|min:1|unique:carousels,order,'.$carousel->id,
            'image'=>'sometimes|image|mimes:jpg,png,jpeg,gif,webp'
        ]);

        if($request->hasFile('image')){
            if($carousel->image && Storage::disk('public')->exists($carousel->image)){
                Storage::disk('public')->delete($carousel->image);
            }
            $data['image'] = $request->file('image')->store('carousel','public');
        }

        $carousel->update($data);

        return response()->json([
            'message'=>'updated success',
            'carousel'=>$carousel
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $carousel = Carousel::findOrFail($id);

        if($carousel->image && Storage::disk('public')->exists($carousel->image)){
            Storage::disk('public')->delete($carousel->image);
        }

        $carousel->delete($carousel);

        return response()->json([
            'message'=>'deleted success',
            'carousel'=>$carousel
        ]);
    }
}
