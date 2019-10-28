# The data-collection-tool project

## Version 0.1, this is a work in progress!

The data collection tool was build as a part of the TITCO project to enable project officers in india to collect and send data to KI servers. The project has grown and covers four sites in india and two major ongoing projects, the TRISS and TAFT project. Both collect data on adult trauma patients at different sites. Each site has a number of project officers employed that collect the data. The future project includes the “open trauma data bank”, this would enable any interested hospital that want to start to collect data to do so using the data collection tool supplied, the idea here is that information is only processed and de-identification is done on the client level and information is automatically uploaded to the internet for aggregation and made available to anyone who wishes to use it. These two different types of usages for the data collection tool  have different requirements in terms of set-up and configuration. The requirements for this future project is described further down in this document.
Some of the sites and project officers now also collect additional data on something called Audit filters, these have been added to the tool

## Study environments and data collection for TITCO-sites

## The data collection process for TITCO-sites
For the ongoing projects, each of the four sites involved has several project officers that collect data. As of now, they keep track of the patient ID to make sure it’s unique and when to follow up patients.
Current workflow:
1. Project officer logs on to data-collection site and prints several forms on paper.
2. PO works in the ED, when patient arrives they collect the data on paper. This is because working with a computer/tabled in the ED is not feasible.
3. The next day/days they follow up patients that where admitted to hospital to make additional recordings on mortality, admission status and radiology reports. This is added to the paper-form.
4. The project officers enter the data, _not_ including patient identifying information, from the paper form, into the online form, validates and saves it. _Patient identifying information is only ever stored on paper, locally_
5. After 30 days, followup is done by calling the patient. The online form is then updated again, marked as finished.
6. The record, _not_ containing patient details, is manually uploaded to back end servers by an online interface.

Flow for the next version:
1. a. Project officers access site for the first time, asked to login and based on configured credentials the local database is created. Ex MAMC officer, get’s the mamc code-book.  If the user is configured to also collect audit filters, the codebook containing these are loaded for that user.
	b. PO access site that they are working on, they are displayed with all patient IDs and initials grouped by status. Top shows ongoing records (Not finished records younger than 30 days). Next group shows patients that are now due to have 30 day followup (ie, 30 days since the initial record was created). 
	2. PO prints paper documents as usual, as soon as the patient data has been recorded it’s entered into the tool. Here the patient ID gets assigned. The partial record is saved.
	3. PO can pick up the record, edit it, and save it again.
	4. The record is finished, it’s marked as finished, validated and saved. (Perhaps not editable after that)
	5. At any time when the PO has good internet access, on the first page there is an option to upload, the database tables that contain level 2 information is then uploaded to backend servers.

Requirements: The data collection tool, once loaded, needs to be usable offline.
The codebook is loaded based on user configuration
Local database contain level 1 information, only level 2 information is uploaded to back end servers.

## Data collection workflow for the open trauma bank sites
Done without any involvement from project team. They sign up, register a site and users, start to collect data according to a specified codebook. When uploading data, level 3 (needs to be defined) data is uploaded to public servers.
Work on the codebook is done here [Google drive link](drive.google.com)

## Security points
Medical data can have different levels of sensitivity, we have chosen to call these level 1-4. Level 1 is data that contain direct patient identifiers like personal ID, name and contact information in connection with the same record. This data needs to be stored with very high security standards and is ideely not be stored in the same location.
Data that only contains information about the time of incident, age and medical information is level 2. By this data this patient can still be identified by using other sources of information, or, the patients themselves can identify them if seeing the data. Pseudo anonymous-data is also included here.
Next level 3 is data where for example date of incident is not available, it would become impossible with any sensitivity to identify a patient from this data alone.
The final level, level 4 is aggregated data, for example data that contains several patients in one identifier. Example, one line that states “Hospital X, had 44 femur fractures in 2017”.
**Data on level 1 needs to be handled with extreme care.**
### General guidelines for datahandling
**Level 1** data may never be uploaded from the local site. The patient identifiers are only available locally, with a local backup to an encrypted USB drive. 
**Level 2** data may be uploaded to KI servers, that is the record minus patient information except for the patient ID that has been generated with the record was created. It would be possible to connect the patient using the KI data and the local data on the USB drive.
**Level 3** and **level 4** data may be uploaded directly to publicly available servers.
For local clients data may only ever be uploaded and _never_ downloaded from KI/backend servers to ensure that unauthorised people get control of a client computer or login and download information.
#### User handling
The tool is available by directing a browser to a specified URL. Here you login with your supplied credentials which gives you access to the tool based on the codebook for that specific site and project. All passwords are stored encrypted in the back end database. For titco projects, assignments are made by the project management team. For the future open databank, users should be able to register an account and a site.

Requirements: How do we handle level 1 data locally? OK to keep in database?
Only level 2 data uploaded
Patient ID is generated for a new record based on SITE+USER+increment ID


## Abbrevidations and definitions

- Record: Is a complete set of data beloing to one patient with all variables collected. The data can be in several tables, but referes to one row.
- Field: A single point of data in a Record also called "variable" for collection, example heart rate, would equal a column in database.
- Data-collector : The person also called project officer or po, that use the tool and enter research data.
- Patient: The person a record is referring to
- Site: A physical or logical grouping of multiple users sharing the same Codebook
- Codebook: A file or document detailing which fields should show up in a Record for a specific Site
- Local Database(LDB): An in browser DB containing multiple records
- LDB Backup: A file that can be exported/imported from/to the tool containing the entirety of the LDB
- Remote Database(RDB): Where the tool or the user would send data for safekeeping
- UID: Unique Identifier, generally to identify Records, built by site_ID+user_id+incremental_value.

## Site configuration

## Techincal platform

## Back end data handling

## Deployment 

