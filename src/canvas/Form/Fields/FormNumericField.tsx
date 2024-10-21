import React from 'react';
import { useFormContext } from '../Context/FormContext';
import { sanitizeName } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import { NumericInputType } from '../formTypes';

function FormNumericField({
  name,
  label,
  placeholder = '',
  required = false,
  minimum,
  maximum,
  step,
  type = 'number',
}: {
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  minimum?: number;
  maximum?: number;
  step?: number;
  type?: NumericInputType;
}) {
  const { formData, handleInputChange } = useFormContext();
  const identifier = name && name.length > 0 ? sanitizeName(name) : uuidv4();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(identifier, e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor={identifier} className="block text-sm font-medium text-black">
        {label}
      </label>
      <input
        id={identifier}
        name={identifier}
        placeholder={placeholder}
        required={required}
        type={type}
        min={minimum}
        max={maximum}
        step={step}
        value={formData[identifier]?.value || ''}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 bg-white border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
}

export default FormNumericField;
