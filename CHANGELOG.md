# Changelog

## v1.0.12 (30/11/2021)

#### Bug Fixes:

- [#143](https://github.com/tracits/rodant/issues/143) Make it impossible to delete locked record 
- [#134](https://github.com/tracits/rodant/issues/134) Search in specific fields broken 

---

## v1.0.11 (04/02/2021)

#### Enhancements:

- [#144](https://github.com/tracits/rodant/issues/144) Add github octocat icon to after Built with Rodant (vx.x.x) and link to https://github.com/tracits/rodant 

#### Bug Fixes:

- [#151](https://github.com/tracits/rodant/issues/151) Parse error package.json during npm install 

---

## v1.0.10 (01/11/2020)

#### Enhancements:

- [#132](https://github.com/tracits/rodant/issues/132) Records containing no data should not be saved 
- [#120](https://github.com/tracits/rodant/issues/120) Refactor - RecordPicker component 

---

## v1.0.9 (08/09/2020)

#### Enhancements:

- [#126](https://github.com/tracits/rodant/issues/126) Exported dataset uses <unset> instead of NULL 

#### Bug Fixes:

- [#128](https://github.com/tracits/rodant/issues/128) Sort id variable as numeric 

---

## v1.0.8 (25/08/2020)

#### Enhancements:

- [#122](https://github.com/tracits/rodant/issues/122) Improve working of check boxes 
- [#106](https://github.com/tracits/rodant/issues/106) Add Built with Rodant vX.Y.Z 

---

## v1.0.7 (08/07/2020)

#### Enhancements:

- [#109](https://github.com/tracits/rodant/issues/109) Add switch for dark mode 

---

## v1.0.6 (07/07/2020)

#### Enhancements:

- [#92](https://github.com/tracits/rodant/issues/92) Display progress bar when importing or exporting data 

#### Bug Fixes:

- [#103](https://github.com/tracits/rodant/issues/103) Fix eslint warnings 

---

## v1.0.5 (28/05/2020)

#### Bug Fixes:

- [#99](https://github.com/tracits/rodant/issues/99) Validation for date and time that includes unknown fails 

---

## v1.0.4 (11/05/2020)

#### Enhancements:

- [#31](https://github.com/tracits/cockroach_react/issues/31) Allow users to unlock records 

#### Bug Fixes:

- [#94](https://github.com/tracits/cockroach_react/issues/94) Should not be possible to delete locked records 
- [#93](https://github.com/tracits/cockroach_react/issues/93) Locked records can still be edited 

---

## v1.0.3 (09/04/2020)

#### Enhancements:

- [#89](https://github.com/tracits/cockroach_react/issues/89) Show Rodant version in tool instance 
- [#88](https://github.com/tracits/cockroach_react/issues/88) Replace "Save and exit" with "Close record" and remove link from tool title. 
- [#87](https://github.com/tracits/cockroach_react/issues/87) Remove option to discard record from RecordEditor 
- [#68](https://github.com/tracits/cockroach_react/issues/68) Ability to navigate from record page even though the entry is incomplete 

#### Bug Fixes:

- [#91](https://github.com/tracits/cockroach_react/issues/91) Tool collapses with TypeError: Cannot read property toString of undefined when trying to import from csv 
- [#90](https://github.com/tracits/cockroach_react/issues/90) Previously completed and locked records are not displayed as such 
- [#85](https://github.com/tracits/cockroach_react/issues/85) Change app name to Rodant 
- [#80](https://github.com/tracits/cockroach_react/issues/80) Validation error for dct_tct when dct is valid and tct is 99 does not show  

---

## v1.0.0 (17/02/2020)

#### Enhancements:

- [#78](https://github.com/tracits/cockroach_react/issues/78) Add valid field to records 
- [#76](https://github.com/tracits/cockroach_react/issues/76) Allow export of invalid records 
- [#75](https://github.com/tracits/cockroach_react/issues/75) Add project identifier to default file name when exporting CSV  
- [#67](https://github.com/tracits/cockroach_react/issues/67) Add page_size to config 
- [#66](https://github.com/tracits/cockroach_react/issues/66) Add deploy script 
- [#65](https://github.com/tracits/cockroach_react/issues/65) Warn if existing data is being overwritten 
- [#64](https://github.com/tracits/cockroach_react/issues/64) Allow upload file sizes of > 2 Mb 
- [#62](https://github.com/tracits/cockroach_react/issues/62) Move record picker button group to top of page 
- [#57](https://github.com/tracits/cockroach_react/issues/57) Fix parsing of nested quotes in codebook  
- [#55](https://github.com/tracits/cockroach_react/issues/55) Set unknown value in config 
- [#49](https://github.com/tracits/cockroach_react/issues/49) Add coding instructions to field information 
- [#46](https://github.com/tracits/cockroach_react/issues/46) Align uid with id_field value 
- [#41](https://github.com/tracits/cockroach_react/issues/41) Increase width of paginator page box 
- [#40](https://github.com/tracits/cockroach_react/issues/40) Add option to perform exact search 
- [#39](https://github.com/tracits/cockroach_react/issues/39) Fix sort order 
- [#36](https://github.com/tracits/cockroach_react/issues/36) Avoid hardcoding id field name in RecordEditor 
- [#35](https://github.com/tracits/cockroach_react/issues/35) Allow calculated date and time fields 
- [#34](https://github.com/tracits/cockroach_react/issues/34) Show project name on all screens, including print 
- [#33](https://github.com/tracits/cockroach_react/issues/33) Always show warnings 
- [#27](https://github.com/tracits/cockroach_react/issues/27) Change default variable to filter records on to variable with id = yes 
- [#26](https://github.com/tracits/cockroach_react/issues/26) Show total number of records in database 
- [#20](https://github.com/tracits/cockroach_react/issues/20) Implement double entry for complete records 

#### Bug Fixes:

- [#77](https://github.com/tracits/cockroach_react/issues/77) Download of large CSV fails 
- [#70](https://github.com/tracits/cockroach_react/issues/70) When editing an existing record with missing data, this is not saved 
- [#60](https://github.com/tracits/cockroach_react/issues/60) Set calculated fields to unknown if any component is unknown 
- [#58](https://github.com/tracits/cockroach_react/issues/58) Change default behaviour of date and time comparisons when component value is a valid but not date or time formatted value 
- [#56](https://github.com/tracits/cockroach_react/issues/56) When id_field is 999 it should show as 999, not unknown 
- [#53](https://github.com/tracits/cockroach_react/issues/53) Numeric fields accept out of range values  
- [#47](https://github.com/tracits/cockroach_react/issues/47) Quantitative variables accept mix of numbers and characters 
- [#45](https://github.com/tracits/cockroach_react/issues/45) 999 in id_field should not be treated as unknown 
- [#44](https://github.com/tracits/cockroach_react/issues/44) Import of exported csv fails 
- [#43](https://github.com/tracits/cockroach_react/issues/43) Fails with unknown validation error 
- [#42](https://github.com/tracits/cockroach_react/issues/42) Unexpected behavior when trying to type page number 
- [#38](https://github.com/tracits/cockroach_react/issues/38) Implement valid_values for date and time 
- [#32](https://github.com/tracits/cockroach_react/issues/32) Different grey in filled fields 
- [#29](https://github.com/tracits/cockroach_react/issues/29) Double entry breaks with updated codebook 
- [#28](https://github.com/tracits/cockroach_react/issues/28) Do not fill fields that cannot be filled online with unknown when "Mark empty fields as unknown is clicked" 
- [#25](https://github.com/tracits/cockroach_react/issues/25) Only fields with double_enter = yes should be double entered 
