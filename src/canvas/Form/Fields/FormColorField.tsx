import React from 'react';
import { useFormContext } from '../Context/FormContext';
import { sanitizeName } from '../helpers';
import { v4 as uuidv4 } from 'uuid';

function FormColorField({ name, label, required = false }: { name?: string; label?: string; required?: boolean }) {
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
        type="color"
        required={required}
        value={formData[identifier]?.value || '#000000'}
        onChange={handleChange}
        className="mt-1 block w-full h-10 p-0 bg-white border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
}

export default FormColorField;
