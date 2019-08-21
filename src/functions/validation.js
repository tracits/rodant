import moment from 'moment'

/** Validates a field according to its type */
function validate(value, field) {
	switch (field.type) {
		case 'quantitative': return validateQuantitative(value, field)
		case 'qualitative': return validateQualitative(value, field)
		case 'date': return validateDate(value, field)
		case 'datetime': return validateDateTime(value, field)
		case 'time': return validateTime(value, field)
		case 'text': return validateText(value, field)
		default: // none
			return true
	}
}

/** 
 * Validates a qualitative value to be within the range 
 * dictated by the fields valid_values first and second elements 
 */
function validateQuantitative(value, field) {
	if (!field.valid_values)
		return true

	if (value === field.unknown)
		return true

	let v = Number(value)
	let range = field.valid_values.split(',').map(d => parseFloat(d))

	return v >= range[0] && v <= range[1]
}

/** Validates a qualitative value to exist within the fields valid_values */
function validateQualitative(value, field) {
	if (!field.valid_values)
		return true

	if (value === field.unknown)
		return true

	return field.valid_values.split(',').indexOf(value) !== -1
}

/** Validates a date to match YYYY-HH-MM and be a valid date */
function validateDate(value, field) {
	if (value === field.unknown)
		return true;

	// Check format
	if (!(/^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/.test(value)))
		return false

	// Validate date with moment
	return moment(value).isValid()
}

/** Validates a date and time to match format YYYY-MM-DD HH:mm and be a valid date */
function validateDateTime(value, field) {
	if (value === field.unknown)
		return true;

	// Check format
	if (!(/^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]$/.test(value)))
		return false

	// Validate date and time with moment
	return moment(value).isValid()
}

/** Validates a time string to match HH:mm and be in range */
function validateTime(value, field) {
	if (value === field.unknown)
		return true;

	// Check format
	if (!(/^[0-9][0-9]:[0-9][0-9]$/.test(value)))
		return false

	// Check ranges
	let tok = value.split(':')
	let h = parseInt(tok[0])
	let m = parseInt(tok[1])

	return h > 0 && h < 24 && m > 0 && m < 60
}

/** Validates a text to be shorter than 1000 characters */
function validateText(value, field) {
	if (value === field.unknown)
		return true;

	return value.length < 1000
}

function validateRecord(record, fields) {
	return null
}

export default validate
export {
	validateQualitative,
	validateQuantitative,
	validateDate,
	validateDateTime,
	validateText,
	validateRecord,
}