# Codebook metadata
This file includes descriptions of the columns in the codebook file used to
dynamically create a record in the data collection instrument. 

| Column name | Description |
| ----- | --- | 
| label | The name of a field used to collect data on the variable as understandable for most humans, for example "Age" or "Sex". |
| name | The name of the variable in the resulting database, for example "age" or "sex". |
| description | A short description of the variable, for example "Participant age in years". This should be shown to the user during data entry. |
| source | A short description, for example a list, of where the user is supposed to get the data on the variable from, for example "1. Participant 2. Hospital record". |
| coding_instructions | A short description of how the user should go about coding the variable, for example "Round up unless the participant is younger than 6 months, then enter as 0". |
| id | An indicator of whether the variable should be used when generating the unique identifier (UID). |
| complete | An indicator of whether the variable should be used to indicate if the record is complete and should be locked for further edits. |
| header | An indicator of whether the field should be included in the header of the record. |
| input | An indicator of whether the user should be allowed to input data into the field. Typically used for fields that should be filled on the paper record but not in the electronic record. |
| double_enter | An indicator of whether data in the field should be entered twice once the record is marked as complete. | 
| type | The variable type which governs how the field is built and the type of input that is possible. |
| valid_values | The values that are considered valid, formatted differently for different type of variables. |
| show_valid_values | An indicator of whether the valid values should be shown to the user during data entry. |
| unknown | The value that should be used to indicate that the true value of a variable is unknown. |
| value_labels | The labels associated with each valid value. For example, if the variable "sex" has the type "qualitative" and the valid values "0, 1" then the value labels might be "Female", "Male", meaning that 0 = Female and 1 = Male. |
| logic_checks | Logical statements in javascript used to validate the record, in addition to checking for valid values. For example, "rr > 80 && hr < 20" tests if respiratory rate is over 80 when heart rate is below 20. |
| logic_prompts | Human readable prompts corresponding to the logical checks. For example, if "rr > 80 && hr < 20" is true then the prompt could be "The respiratory rate you entered is very high while the heart rate is very low, are you sure this is correct?". |
| logic_must_be_true | An indicator of whether the logic must be FALSE for the record to considered valid. |
| calculated | An indicator of whether the field and variable is calculated by the application rather than entered by the user. |
| equation | The equation, in javascript, used to calculate the variable. |
| visible | An indicator of whether the field should be visible in the record. |
| --- | --- |
