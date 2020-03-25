import { TextFieldEditor, TextField } from './TextField';
import { IntegerFieldEditor, IntegerField } from './IntegerField';
import { MultiSelectFieldEditor, MultiSelectField } from './MultiSelectField';

export default [
	{ name: 'Text', id: 'text', editor: TextFieldEditor, field: TextField },
	{ name: 'Integer', id: 'integer', editor: IntegerFieldEditor, field: IntegerField },
	{ name: 'Multi Select', id: 'multi-select', editor: MultiSelectFieldEditor, field: MultiSelectField },
]