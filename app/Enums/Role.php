<?php
namespace App\Enums;

enum Role: string
{
    case FAMILY = 'family';
    case TEACHER = 'teacher';
    case CONTENT_EDITOR = 'content_editor';
    case ADMIN = 'admin';

    public function label(): string
    {
        return match($this) {
            self::FAMILY => 'Familia',
            self::TEACHER => 'Profesor/a',
            self::CONTENT_EDITOR => 'Editor de Contenido',
            self::ADMIN => 'Administrador',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::FAMILY => '👨‍👩‍👦',
            self::TEACHER => '👨‍🏫',
            self::CONTENT_EDITOR => '✏️',
            self::ADMIN => '⚙️',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}