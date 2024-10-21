import React, { createContext, useReducer, useContext, useEffect } from 'react';
import {
  FormAction,
  FormElement,
  FormState,
  DropdownFieldFields,
  AnyFormElementFields,
  DropdownOption,
  RadioFieldFields,
  RadioOption,
} from '../formTypes';

function isRadioField(fields: AnyFormElementFields): fields is RadioFieldFields {
  return Array.isArray((fields as RadioFieldFields).options?.value);
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          value: action.payload.value,
        },
      };
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
}

interface FormContextProps {
  formData: FormState;
  handleInputChange: (name: string, value: string) => void;
  initializeForm: (initialFormElements: FormElement[]) => void;
  dispatch: React.Dispatch<FormAction>;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const useFormContext = (): FormContextProps => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

// Type guard to check if the fields are of type DropdownFieldFields
function isDropdownFieldFields(fields: AnyFormElementFields): fields is DropdownFieldFields {
  return (fields as DropdownFieldFields).options !== undefined;
}

export const FormProvider: React.FC<{ children: React.ReactNode; initialFormElements?: FormElement[] }> = ({
  children,
  initialFormElements = [],
}) => {
  const [formData, dispatch] = useReducer(formReducer, {});

  const handleInputChange = (name: string, value: string) => {
    dispatch({ type: 'SET_VALUE', payload: { name, value } });
  };

  // Initialize form data based on the initial form elements
  const initializeForm = (initialFormElements: FormElement[]) => {
    const initialFormData = initialFormElements.reduce((acc: FormState, element: FormElement) => {
      const fieldIdentifier = element?.fields?.identifier?.value;

      if (fieldIdentifier && element.fields) {
        // Set up the initial structure with index and empty value
        acc[fieldIdentifier] = { index: element.index, value: '' };

        // Handle dropdown fields
        if (element.type === 'formDropdownField' && isDropdownFieldFields(element.fields)) {
          const defaultValue =
            element.fields.options?.value.find((option: DropdownOption) => {
              const isDefault =
                Array.isArray(option.fields?.options?.value) && option.fields.options.value.includes('default');

              return isDefault;
            })?.fields?.value?.value || '';
          acc[fieldIdentifier].value = defaultValue;
        }
        // Handle color fields
        else if (element.type === 'formColorField') {
          acc[fieldIdentifier].value = '#000000'; // Default color if not provided
        }
        // Handle radio fields
        else if (element.type === 'formRadioField' && isRadioField(element.fields)) {
          const defaultValue =
            element.fields.options?.value.find((option: RadioOption) => {
              const isDefault =
                Array.isArray(option.fields?.options?.value) && option.fields.options.value.includes('default');
              return isDefault;
            })?.fields?.value?.value || '';
          acc[fieldIdentifier].value = defaultValue;
        }
        // For other field types, initialize with an empty string
        else if (element.type !== 'formSubmitButton') {
          acc[fieldIdentifier].value = '';
        }
      }

      if (fieldIdentifier) {
        acc[fieldIdentifier].index = element.index;
      }

      return acc;
    }, {} as FormState);
    dispatch({ type: 'RESET', payload: initialFormData });
  };

  useEffect(() => {
    if (initialFormElements.length > 0) {
      initializeForm(initialFormElements);
    }
  }, [initialFormElements]);

  return (
    <FormContext.Provider value={{ formData, handleInputChange, initializeForm, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};
