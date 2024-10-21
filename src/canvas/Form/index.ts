import { registerUniformComponent } from '@uniformdev/canvas-react';
import Form from './Form';
import FormTextField from './Fields/FormTextField';
import FormNumericField from './Fields/FormNumericField';
import FormDropdownField from './Fields/FormDropdownField';
import FormCheckboxField from './Fields/FormCheckboxField';
import FormRadioField from './Fields/FormRadioField';
import FormDateField from './Fields/FormDateField';
import FormTimeField from './Fields/FormTimeField';
import FormColorField from './Fields/FormColorField';
import FormButton from './Buttons/FormButton';

const components = [
	{ type: 'form', component: Form },
	{ type: 'formTextField', component: FormTextField },
	{ type: 'formNumericField', component: FormNumericField },
	{ type: 'formDropdownField', component: FormDropdownField },
	{ type: 'formCheckboxField', component: FormCheckboxField },
	{ type: 'formRadioField', component: FormRadioField },
	{ type: 'formDateField', component: FormDateField },
	{ type: 'formTimeField', component: FormTimeField },
	{ type: 'formColorField', component: FormColorField },
	{ type: 'formButton', component: FormButton },
];

components.forEach(({ type, component }) => {
	registerUniformComponent({ type, component });
});

export * from './Form';
export * from './Fields/FormTextField';
export * from './Fields/FormNumericField';
export * from './Fields/FormDropdownField';
export * from './Fields/FormCheckboxField';
export * from './Fields/FormRadioField';
export * from './Fields/FormDateField';
export * from './Fields/FormTimeField';
export * from './Fields/FormColorField';
export * from './Buttons/FormButton';
