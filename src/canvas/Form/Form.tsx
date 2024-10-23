import React, { useEffect, useState } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { FormProvider, useFormContext } from './Context/FormContext';
import { FormElement, FormEventAction, FormSetQuirkActionFields } from './formTypes';
import { ComponentInstance } from '@uniformdev/canvas';
import { useUniformContext } from '@uniformdev/context-react';

function extractFormElements(component: ComponentInstance): FormElement[] {
  if (!component.slots || !component.slots['formFields']) return [];

  return component.slots['formFields'].map((fieldInstance: ComponentInstance, index: number) => {
    const { type, parameters } = fieldInstance;
    return {
      type,
      fields: parameters,
      index,
    } as FormElement;
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
