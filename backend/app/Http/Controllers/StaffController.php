<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $query = Staff::with(['user', 'company', 'department', 'role']);

        if ($request->has('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $staff = $query->paginate(15);
        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:users,id',
            'company_id' => 'required|exists:companies,id',
            'department_id' => 'required|exists:departments,id',
            'role_id' => 'required|exists:roles,id',
            'employee_id' => 'required|string|max:255|unique:staff',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:staff',
            'phone' => 'nullable|string|max:255',
            'hire_date' => 'required|date',
            'termination_date' => 'nullable|date|after:hire_date',
            'status' => 'required|in:active,inactive,terminated',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $staff = Staff::create($request->all());
        $staff->load(['user', 'company', 'department', 'role']);
        return response()->json($staff, 201);
    }

    public function show(Staff $staff)
    {
        $staff->load(['user', 'company', 'department', 'role']);
        return response()->json($staff);
    }

    public function update(Request $request, Staff $staff)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:users,id',
            'company_id' => 'required|exists:companies,id',
            'department_id' => 'required|exists:departments,id',
            'role_id' => 'required|exists:roles,id',
            'employee_id' => 'required|string|max:255|unique:staff,employee_id,' . $staff->id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:staff,email,' . $staff->id,
            'phone' => 'nullable|string|max:255',
            'hire_date' => 'required|date',
            'termination_date' => 'nullable|date|after:hire_date',
            'status' => 'required|in:active,inactive,terminated',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $staff->update($request->all());
        $staff->load(['user', 'company', 'department', 'role']);
        return response()->json($staff);
    }

    public function destroy(Staff $staff)
    {
        $staff->delete();
        return response()->json(null, 204);
    }
}
