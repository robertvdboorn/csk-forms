import React from 'react';
import { useFormContext } from '../Context/FormContext';
import { sanitizeName } from '../helpers';
import { v4 as uuidv4 } from 'uuid';

function FormCheckboxField({ name, label, required = false }: { name?: string; label?: string; required?: boolean }) {
  const { formData, handleInputChange } = useFormContext();
  const identifier = name && name.length > 0 ? sanitizeName(name) : uuidv4();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(identifier, e.target.checked.toString());
  };

  return (
    <div className="mb-4">
      <input
        id={identifier}
        name={identifier}
        type="checkbox"
        checked={formData[identifier]?.value === 'true'}
        onChange={handleChange}
        className="text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label htmlFor={identifier} className="ml-2 text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
    </div>
  );
}

export default FormCheckboxField;
