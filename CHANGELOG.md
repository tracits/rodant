# Changelog

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
