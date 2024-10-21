import React, { useEffect, useState } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { FormProvider, useFormContext } from './Context/FormContext';
import {
  FormElement,
  DropdownOption,
  FormFieldType,
  DropdownOptionValue,
  NumericInputType,
  TextInputType,
  RadioOptionValue,
  RadioOption,
  FormEventAction,
  FormSetQuirkActionFields,
} from './formTypes';
import { ComponentInstance } from '@uniformdev/canvas';
import { sanitizeName } from './helpers';
import { useUniformContext } from '@uniformdev/context-react';

function extractFormElements(component: ComponentInstance): FormElement[] {
  if (!component.slots || !component.slots['formFields']) return [];

  return component.slots['formFields'].map((fieldInstance: ComponentInstance, index: number) => {
    const { parameters } = fieldInstance;

    // Initialize the base form element
    const formElement: FormElement = {
      type: fieldInstance.type as FormFieldType,
      fields: {
        identifier: { value: sanitizeName(parameters?.name?.value as string) },
        label: { value: parameters?.label?.value as string },
        required: { value: parameters?.required?.value as boolean },
      },
    };

    // Handle text fields
    if (fieldInstance.type === 'formTextField') {
      formElement.fields = {
        ...formElement.fields,
        type: { value: parameters?.type?.value as TextInputType },
        ...(parameters?.placeholder && {
          placeholder: { value: parameters?.placeholder?.value as string },
        }),
      };
    }

    // Handle numeric fields
    if (fieldInstance.type === 'formNumericField') {
      formElement.fields = {
        ...formElement.fields,
        type: { value: parameters?.type?.value as NumericInputType },
        ...(parameters?.placeholder && {
          placeholder: { value: parameters?.placeholder?.value as string },
        }),
        minimum: { value: parameters?.minimum?.value as number },
        maximum: { value: parameters?.maximum?.value as number },
        step: { value: parameters?.step?.value as number },
      };
    }

    // Handle dropdown field options
    if (fieldInstance.type === 'formDropdownField' && parameters?.options?.value) {
      const options = (parameters.options.value as DropdownOption[]).map((option: DropdownOption) => ({
        fields: {
          identifier: { value: sanitizeName(option.fields?.label?.value as string) },
          label: { value: option.fields?.label?.value as string },
          value: { value: option.fields?.value?.value as string },
          options: { value: option.fields?.options?.value as DropdownOptionValue[] },
        },
      }));

      formElement.fields = {
        ...formElement.fields,
        options: { value: options },
      };
    }

    // Extend for additional form fields like checkbox, radio, etc.
    // Handle checkbox fields
    if (fieldInstance.type === 'formCheckboxField') {
      formElement.fields = {
        ...formElement.fields,
      };
    }

    // Handle radio fields
    if (fieldInstance.type === 'formRadioField' && parameters?.options?.value) {
      const options = (parameters.options.value as RadioOption[]).map((option: RadioOption) => ({
        fields: {
          identifier: { value: sanitizeName(option.fields?.label?.value as string) },
          label: { value: option.fields?.label?.value as string },
          value: { value: option.fields?.value?.value as string },
          options: { value: option.fields?.options?.value as RadioOptionValue[] },
        },
      }));

      formElement.fields = {
        ...formElement.fields,
        options: { value: options },
      };
    }

    // Handle date fields
    if (fieldInstance.type === 'formDateField') {
      formElement.fields = {
        ...formElement.fields,
      };
    }

    // Handle time fields
    if (fieldInstance.type === 'formTimeField') {
      formElement.fields = {
        ...formElement.fields,
      };
    }

    // Handle color fields
    if (fieldInstance.type === 'formColorField') {
      formElement.fields = {
        ...formElement.fields,
      };
    }

    formElement.index = index;

    return formElement;
  });
}

function FormComponent({
  formName,
  formIdentifier,
  formActions,
}: {
  formName: string;
  formIdentifier: string;
  formActions?: FormEventAction[];
  component: ComponentInstance;
}) {
  const { formData, dispatch } = useFormContext();
  const { context } = useUniformContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formIdentifier: formIdentifier, ...formData }),
      });

      if (response.ok) {
        // Handle quirk actions
        formActions?.forEach(action => {
          if (action.type === 'formSetQuirkAction') {
            const setQuirkActionFields = action.fields as FormSetQuirkActionFields;
            if (setQuirkActionFields.quirkName && setQuirkActionFields.quirkValue) {
              context.update({
                quirks: {
                  [setQuirkActionFields.quirkName.value]: setQuirkActionFields.quirkValue.value,
                },
              });
            }
          }
        });

        dispatch({ type: 'RESET', payload: {} });
      } else {
        const result = await response.json();
        alert(`Failed to submit the form: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{formName}</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <UniformSlot name="formFields" />
        <UniformSlot name="formButtons" />
      </form>
    </div>
  );
}

function Form({
  formName,
  formIdentifier,
  formActions,
  component,
}: {
  formName: string;
  formIdentifier: string;
  formActions?: FormEventAction[];
  component: ComponentInstance;
}) {
  const [initialFormElements, setInitialFormElements] = useState<FormElement[]>([]);
  useEffect(() => {
    const formElements = extractFormElements(component);
    setInitialFormElements(formElements);
  }, [component]);

  return (
    <FormProvider initialFormElements={initialFormElements}>
      <FormComponent
        formName={formName}
        formIdentifier={formIdentifier}
        component={component}
        formActions={formActions}
      />
    </FormProvider>
  );
}

export default Form;
