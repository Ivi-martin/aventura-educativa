<?php
namespace App\Policies;

use App\Models\User;
use App\Models\Student;

class StudentPolicy
{
    public function view(User $user, Student $student): bool
    {
        if ($user->isAdmin()) return true;
        if ($user->isFamily()) return $user->id === $student->family_user_id;
        
        if ($user->isTeacher()) {
            $teacherClassrooms = $user->classrooms->pluck('id');
            return $teacherClassrooms->contains($student->classroom_id);
        }
        return false;
    }

    public function update(User $user, Student $student): bool
    {
        if ($user->isAdmin()) return true;
        if ($user->isFamily()) return $user->id === $student->family_user_id;
        return false;
    }

    public function delete(User $user, Student $student): bool
    {
        return $this->update($user, $student);
    }

    public function viewProgress(User $user, Student $student): bool
    {
        return $this->view($user, $student);
    }
}