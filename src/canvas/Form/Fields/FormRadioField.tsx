import React from 'react';
import { useFormContext } from '../Context/FormContext';
import { sanitizeName } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import { RadioOption } from '../formTypes';

function FormRadioField({
  name,
  label,
  options,
  required = false,
}: {
  name?: string;
  label?: string;
  options?: RadioOption[];
  required?: boolean;
}) {
  const { formData, handleInputChange } = useFormContext();
  const identifier = name && name.length > 0 ? sanitizeName(name) : uuidv4();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(identifier, e.target.value);
  };

  return (
    <div className="mb-4">
      <fieldset>
        <legend className="block text-sm font-medium text-black">{label}</legend>
        {options?.map((option, index) => {
          const { fields } = option;

          const optionId =
            fields?.identifier?.value && fields.identifier.value.length > 0
              ? sanitizeName(fields.identifier.value)
              : `${identifier}-option-${index}`;

          // Default values for isDefault, isHidden, and isDisabled if options field doesn't exist
          const isDefault = Array.isArray(fields?.options?.value) && fields.options.value.includes('default');
          const isHidden = Array.isArray(fields?.options?.value) && fields.options.value.includes('hidden');
          const isDisabled = Array.isArray(fields?.options?.value) && fields.options.value.includes('disabled');

          // Render the radio button only if it's not hidden
          return !isHidden ? (
            <div key={index} className="flex items-center">
              <input
                id={optionId}
                name={identifier}
                type="radio"
                value={fields?.value?.value || ''}
                checked={isDefault || formData[identifier]?.value === fields?.value?.value}
                required={required}
                onChange={handleChange}
                disabled={isDisabled}
                className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor={optionId} className="ml-3 block text-sm text-gray-700">
                {fields?.label?.value || ''}
              </label>
            </div>
          ) : null;
        })}
      </fieldset>
    </div>
  );
}

export default FormRadioField;
