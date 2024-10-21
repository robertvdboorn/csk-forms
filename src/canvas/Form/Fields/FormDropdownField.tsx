import React from 'react';
import { useFormContext } from '../Context/FormContext';
import { sanitizeName } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import { DropdownOption } from '../formTypes';

function FormDropdownField({
  name,
  label,
  options,
  required = false,
}: {
  name?: string;
  label?: string;
  options?: DropdownOption[];
  required?: boolean;
}) {
  const { formData, handleInputChange } = useFormContext();
  const identifier = name && name.length > 0 ? sanitizeName(name) : uuidv4();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleInputChange(identifier, e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor={identifier} className="block text-sm font-medium text-black">
        {label}
      </label>
      <select
        id={identifier}
        name={identifier}
        required={required}
        value={formData[identifier]?.value || ''}
        onChange={handleChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-700 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {options?.map((option, index) => {
          const { fields } = option;

          // Default values for isDefault, isHidden, and isDisabled if options field doesn't exist
          const isDefault = Array.isArray(fields?.options?.value) && fields.options.value.includes('default');
          const isHidden = Array.isArray(fields?.options?.value) && fields.options.value.includes('hidden');
          const isDisabled = Array.isArray(fields?.options?.value) && fields.options.value.includes('disabled');

          // Determine the value of the option
          const optionValue = isDisabled && isHidden && isDefault ? '' : fields?.value?.value || '';

          return (
            <option key={index} value={optionValue} disabled={isDisabled} hidden={isHidden}>
              {fields?.label?.value || ''}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default FormDropdownField;
