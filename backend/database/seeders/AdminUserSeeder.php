<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or get the admin role
        $adminRole = Role::firstOrCreate(
            ['code' => 'admin'],
            [
                'name' => 'Administrator',
                'description' => 'System Administrator with full access',
                'permissions' => [
                    'users.manage',
                    'roles.manage',
                    'companies.manage',
                    'departments.manage',
                    'staff.manage',
                    'posts.manage',
                ]
            ]
        );

        // Create admin user if doesn't exist
        $admin = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
            ]
        );

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@admin.com');
        $this->command->info('Password: password');
    }
}
