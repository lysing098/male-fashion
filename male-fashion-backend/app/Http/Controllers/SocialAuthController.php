<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    public function redirect($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function callback($provider)
    {
        $socialUser = Socialite::driver($provider)->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'name' => $socialUser->getName(),
                'password' => bcrypt(Str::random(16)),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
            ]
        );

        // Generate your API token here (Passport, Sanctum, JWT, etc.)
        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }
}
