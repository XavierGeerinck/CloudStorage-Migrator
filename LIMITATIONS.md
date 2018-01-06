# Limitations
Since every provider is unique, there are currently some limitations for this application. These can potentially be removed, but require more development work.

## OneDrive
* OneDrive supports max upload of 60Mb files 
  * See https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_createuploadsession for more information
  * This can be solved by creating a chunker that uploads chunks of maximum 60MiB

## Google Drive
* GDrive supports folders with max 100 items (see: https://developers.google.com/drive/v3/reference/files/list)
* GDrive supports max export to certain format for 10Mb files or smaller
* GDrive API Limits: https://developers.google.com/admin-sdk/reports/v1/limits (QPS: 5, QPD: 150.000)
--> This means we can only sync GDrives with around 90.000 files (we use 1 api call for folder list, 1 api call for all file list, 1 api call for file count, 1 api call for download in right format) --> 3log(n)*n 

