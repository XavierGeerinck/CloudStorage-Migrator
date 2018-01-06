import EventUtil from "./EventUtil";
import * as NumberUtils from "./NumberUtil";

export async function sync(source, destination) {
  const sourceProvider = source.provider;
  const destinationProvider = destination.provider;

  // Stack containing the files that we are downloading
  let fileDownloads = [];

  // Create a stack and add our root folder
  let a = [];
  a.push({
    source: {
      id: source.folder.id,
      path: ""
    },
    destination: {
      id: destination.folder.id,
      path: ""
    }
  });

  // As long as the stack is not empty, continue
  // A stack is used to prevent the need for recursion
  while (a.length > 0) {
    let currentFolder = a.shift(); // Shift removes first item and returns it

    // Get the folders in our current folder
    // console.log(sourceProvider);
    let folders = await sourceProvider.api.getFolders(currentFolder.source.id);

    console.log(`[SyncUtil] Current Folder: ${currentFolder.source.path}`);

    // Go through the folders, if they do not exist on our destination, create them
    // Afterwards, push them on our queue for processing the files in it
    // Note: using a Promise for parallell processing, and also proper awaiting for the .push
    // folders.forEach(async folder => {
    await Promise.all(folders.map(async (folder) => {
      console.log(`[SyncUtil] Create Folder "${folder.name}" in folder ${currentFolder.source.id}`);
      let resource = await destinationProvider.api.createFolder(currentFolder.destination.id, folder.name);

      // Statistic for root folder processing
      if (currentFolder.source.path === '') {
        console.log('processing root folder');
      }

      a.push({
        source: {
          id: folder.id, // Folder ID to download from
          path: `${currentFolder.source.path}/${folder.name}` 
        },
        destination: {
          id: resource.id, // Folder ID to upload to
          path: `${currentFolder.source.path}/${folder.name}` 
        }
      });                                                                                                                                                                                  
    }));

    // Go through the files in the folder and sync them to the destination
    // The format automatically gets converted into a standard folder through the api of the source
    let files = await sourceProvider.api.getFiles(currentFolder.source.id);

    console.log(`[SyncUtil] Uploading ${files.length} files to /${currentFolder.source.path}`);
    files.forEach(async file => {
      fileDownloads.push({
        id: file.id,
        mimeType: file.mimeType,
        name: file.name,
        srcFolderId: currentFolder.source.id,
        srcFolderPath: currentFolder.source.path,
        dstFolderId: currentFolder.destination.id,
        dstFolderPath: currentFolder.destination.path,
      });
    });

    // Start processing the files one by one (we do it here so we can do multiple files at the same time but still limit the amount)
    // Currently parallellism is 1 file
    // @todo: this is not real 3 time at a time yet, it will first finish the 3 and the continue with the next 3!
    let maxParallell = 5;
    while (fileDownloads.length > 0) {
      let downloads = [];

      while (fileDownloads.length > 0 && downloads.length < maxParallell) {
        let downloadFile = fileDownloads.shift(); // Shift removes first item and returns it
        downloads.push(syncFile(sourceProvider, destinationProvider, downloadFile));
      }

      await Promise.all(downloads);
    }

    // console.log('[DEBUG]', 'folders', folders, 'files', files);
  }

  console.log(fileDownloads);
}
        
/**
 * file: {
 *   id,
 *   mimeType,
 *   name,
 *   srcFolderId,
 *   srcFolderPath,
 *   dstFolderId,
 *   dstFolderPath
 * }
 * @param {*} file 
 */
export async function syncFile(sourceProvider, destinationProvider, file) {
  let fileSizeDownloaded = 0;
  let fileSizeUploaded = 0;
  EventUtil.syncAddFile(file.id, file);
  console.log(`[SyncUtil] Uploading ${file.srcFolderPath}`);
  
  // Sync files from provider #1 to provider #2, in the <currentFolder>
  // First download the file
  const os = window.require("os");
  const tempFileLocationName = `m18x-${NumberUtils.generateUUID()}`; // Local name of the file, saved through the temp lib
  const tempFileLocation = `${os.tmpdir()}/${tempFileLocationName}`;

  EventUtil.syncUpdateFileSetDownloading(file.id);
  let downloadResult = await sourceProvider.api.downloadFile(file.id, file.name, file.mimeType, tempFileLocation, (event) => {
    EventUtil.syncUpdateFileDownloadProgress(file.id, event.bytesTotal, event.bytesDownloaded);
    fileSizeDownloaded = event.bytesTotal;
  });

  let fileName;

  // Add the extension if the file doesn't have it
  if (downloadResult.fileExtension && file.name.indexOf(downloadResult.fileExtension) === -1) {
    fileName = `${file.name}.${downloadResult.fileExtension}`;
  } else {
    fileName = file.name;
  }

  // Throw out special characters (such as /)
  fileName = fileName.replace(/\//g, '_');
  
  // Then reupload the file
  EventUtil.syncUpdateFileSetUploading(file.id);
  await destinationProvider.api.uploadFile(file.dstFolderId, fileName, tempFileLocation, (event) => {
    EventUtil.syncUpdateFileUploadProgress(file.id, event.bytesTotal, event.bytesUploaded);
    fileSizeUploaded = event.bytesTotal;
  });
  console.log(`[SyncUtil] Uploaded ${file.srcFolderPath}/${file.name}`);

  // Clean the local file
  const fs = window.require("fs");
  fs.unlinkSync(tempFileLocation.replace(/\\/g, '/'));

  // Send event updates
  EventUtil.syncUpdateStat('downloaded', fileSizeDownloaded);
  EventUtil.syncUpdateStat('uploaded', fileSizeUploaded);
  EventUtil.syncIncrementFilesSynced();
  EventUtil.syncRemoveFile(file.id);
}

// console.log(`[SyncUtil] Uploading ${currentFolder.source.path}/${file.name}`);
// // Sync files from provider #1 to provider #2, in the <currentFolder>
// // First download the file
// let downloadResult = await sourceProvider.api.downloadFile(file.id, file.name, file.mimeType);
// let fileName = `${file.name}.${downloadResult.fileExtension}`;

// // Then reupload the file
// await destinationProvider.api.uploadFile(currentFolder.destination.id, fileName, downloadResult.fileLocation);
// console.log(`[SyncUtil] Uploaded ${currentFolder.source.path}/${file.name}`);