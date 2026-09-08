<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class AssessmentFormulaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('assessment_formula.create')
            || $this->user()?->can('assessment_formula.update');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'type' => ['required', Rule::in(['academic', 'tahfizh', 'mutabaah'])],
            'scope' => ['required', Rule::in(['global', 'unit', 'class'])],
            'education_unit_id' => ['nullable', 'uuid', 'exists:education_units,id', 'required_unless:scope,global'],
            'class_id' => ['nullable', 'uuid', 'exists:tbl_kelas,id', 'required_if:scope,class'],
            'academic_year_id' => ['required', 'uuid', 'exists:academic_years,id'],
            'semester_id' => ['nullable', 'uuid', 'exists:semesters,id'],
            'components' => ['required', 'array', 'min:1'],
            'components.*.key' => ['required', 'string', 'max:50', 'distinct'],
            'components.*.label' => ['required', 'string', 'max:100'],
            'components.*.weight' => ['required', 'numeric', 'min:0', 'max:100'],
            'components.*.aggregation' => ['nullable', Rule::in(['average', 'latest', 'sum', 'percentage'])],
            'minimum_score' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'rounding_precision' => ['nullable', 'integer', 'min:0', 'max:2'],
            'effective_from' => ['nullable', 'date'],
            'effective_until' => ['nullable', 'date', 'after_or_equal:effective_from'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            $allowed = [
                'academic' => ['assignment', 'quiz', 'project', 'midterm', 'final_exam'],
                'tahfizh' => ['hafalan', 'murajaah', 'tilawah', 'kelancaran', 'tajwid', 'makhraj', 'adab'],
                'mutabaah' => ['achievement', 'consistency', 'verification', 'good', 'less', 'not_done'],
            ];
            $type = (string) $this->input('type');
            $components = collect($this->input('components', []));
            if (abs((float) $components->sum('weight') - 100.0) > 0.01) {
                $validator->errors()->add('components', 'Total bobot komponen wajib tepat 100%.');
            }
            foreach ($components->pluck('key') as $key) {
                if (! in_array($key, $allowed[$type] ?? [], true)) {
                    $validator->errors()->add('components', "Komponen {$key} tidak tersedia untuk jenis {$type}.");
                }
            }
        }];
    }
}
