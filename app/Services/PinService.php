<?php
namespace App\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class PinService
{
    public function generatePin(): string
    {
        return str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
    }

    public function hashPin(string $pin): string
    {
        return Hash::make($pin);
    }

    public function verifyPin(string $pin, string $hashedPin): bool
    {
        return Hash::check($pin, $hashedPin);
    }

    public function attemptPin(string $studentId, string $pin, string $hashedPin): array
    {
        $cacheKey = "pin_attempts_{$studentId}";
        $attempts = Cache::get($cacheKey, 0);

        if ($attempts >= 5) {
            $blockedUntil = Cache::get("pin_blocked_{$studentId}");
            if ($blockedUntil && now()->lt($blockedUntil)) {
                return ['success' => false, 'blocked' => true, 'remaining' => 0, 'blocked_until' => $blockedUntil];
            }
            Cache::forget($cacheKey);
            Cache::forget("pin_blocked_{$studentId}");
            $attempts = 0;
        }

        $isValid = $this->verifyPin($pin, $hashedPin);

        if (!$isValid) {
            $newAttempts = $attempts + 1;
            Cache::put($cacheKey, $newAttempts, now()->addMinutes(15));

            if ($newAttempts >= 5) {
                $blockedUntil = now()->addMinutes(5);
                Cache::put("pin_blocked_{$studentId}", $blockedUntil, $blockedUntil);
                return ['success' => false, 'blocked' => true, 'remaining' => 0, 'blocked_until' => $blockedUntil];
            }
            return ['success' => false, 'blocked' => false, 'remaining' => 5 - $newAttempts];
        }

        Cache::forget($cacheKey);
        Cache::forget("pin_blocked_{$studentId}");
        
        return ['success' => true, 'blocked' => false, 'remaining' => 5];
    }
}