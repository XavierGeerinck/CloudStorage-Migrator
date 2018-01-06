import configuration from "./configuration";
import * as handlers from "./handlers";
import * as SocialUtils from "../../components/smart/SocialLogin/SocialUtils";
import * as MimeUtils from "../../utils/MimeTypeUtil";
import * as NumberUtils from "../../utils/NumberUtil";

const throttledQueue = window.require('throttled-queue');
const throttle = throttledQueue(5, 1000); // 5 requests every second

export async function handleApiMessage(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      return resolve();
    }

    if (data.error) {
      return reject(data.error.message);
    }

    return resolve(data);
  });
}

export async function handleApiError(err) { 
  if (err === "Invalid Credentials") {
    return SocialUtils.handleRefresh(configuration);
  }

  return Promise.reject(`Received non handled error: ${err}`);
};

//=================================================
// URLs
//=================================================
export const craftFoldersApi = folderIdOrAlias =>
  `https://www.googleapis.com/drive/v3/files?q=trashed=false and mimeType='application/vnd.google-apps.folder' and '${
    folderIdOrAlias
  }' in parents&orderBy=folder,name asc&spaces=drive`;
export const craftFilesApi = folderIdOrAlias =>
  `https://www.googleapis.com/drive/v3/files?q=trashed=false and mimeType!='application/vnd.google-apps.folder' and '${
    folderIdOrAlias
  }' in parents&orderBy=folder,name asc&spaces=drive`;
export const craftFileDownloadApi = (fileIdOrAlias, mimeType) => `https://www.googleapis.com/drive/v3/files/${fileIdOrAlias}?alt=media&mimeType=${mimeType}`;
export const craftFileDownloadExportApi = (fileIdOrAlias, mimeType) => `https://www.googleapis.com/drive/v3/files/${fileIdOrAlias}/export?alt=media&mimeType=${mimeType}`;
  
//=================================================
// API Calls
//=================================================
export async function getFolders(folderIdOrAlias) {
  let accessToken = handlers.getAccessToken();
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  // Root folder: https://www.googleapis.com/drive/v3/files/root --> Get id

  // https://developers.google.com/drive/v3/reference/files/list
  // https://developers.google.com/drive/v3/web/search-parameters (q= parameter, every = is encoded with %3D)
  return new Promise(async (resolve, reject) => {
    throttle(() => fetch(craftFoldersApi(folderIdOrAlias), {
      method: "GET",
      headers
    })
    .then(res => res.json())
    .then(data => handleApiMessage(data))
    .then(data => resolve(data.files)) // Return the array of folders
    .catch(async e => {
      // Something happened, handle the error and try again @todo: limit the amount of retries!
      let res = await handleApiError(e);
      return getFolders(folderIdOrAlias, 0);
    }));
  });
};

export async function getFiles(folderIdOrAlias) {
  let accessToken = handlers.getAccessToken();
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  // Root folder: https://www.googleapis.com/drive/v3/files/root --> Get id

  // https://developers.google.com/drive/v3/reference/files/list
  // https://developers.google.com/drive/v3/web/search-parameters (q= parameter, every = is encoded with %3D)
  return new Promise(async (resolve, reject) => {
    throttle(() => fetch(craftFilesApi(folderIdOrAlias), {
      method: "GET",
      headers
    })
    .then(res => res.json())
    .then(data => handleApiMessage(data))
    .then(data => resolve(data.files)) // Return the array of folders
    .catch(async e => {
      // Something happened, handle the error and try again @todo: limit the amount of retries!
      let res = await handleApiError(e);
      return getFiles(folderIdOrAlias);
    }));
  })
};

/**
 * 
 * @param {*} fileIdOrAlias the id or alias of the file to download (this id is for the Google API)
 * @param {*} fileName the name of the file we are downloading
 * @param {*} mimeType the mimeType
 * @param {*} tempLocation the location where we will save it on disk
 * @param {bytestTotal, bytesDownloaded} progressCb progress cb to track how far we are in downloading
 */
export async function downloadFile(fileIdOrAlias, fileName, mimeType, localFileLocation, progressCb) {
  let accessToken = handlers.getAccessToken();
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("Content-Type", "application/json");

  // Root folder: https://www.googleapis.com/drive/v3/files/root --> Get id

  // https://developers.google.com/drive/v3/reference/files/list
  // https://developers.google.com/drive/v3/web/search-parameters (q= parameter, every = is encoded with %3D)
  let downloadUrl;
  let extension;

  // If we have a google specific format, convert it!
  if (Object.keys(MimeUtils.mimeTypesGoogle).indexOf(mimeType) > -1) {
    let convertedMimeType = MimeUtils.mimeTypesGoogle[mimeType];
    downloadUrl = craftFileDownloadExportApi(fileIdOrAlias, convertedMimeType);
    extension = MimeUtils.mimeTypes[convertedMimeType].extension;
  } 
  // Else try to add an extension for known mimeTypes
  else if (MimeUtils.mimeTypes[mimeType]) {
    downloadUrl = craftFileDownloadApi(fileIdOrAlias, mimeType);
    extension = MimeUtils.mimeTypes[mimeType].extension;
  } 
  // If the mimeType is not known, just convert and log it
  else {
    console.warn(`[Google] API: MimeType ${mimeType} not known!`);
    downloadUrl = craftFileDownloadApi(fileIdOrAlias, mimeType);
    extension = null;
  }

  try {
    let result = await downloadFileFromUrl(downloadUrl, localFileLocation, progressCb);
    return { fileLocation: localFileLocation, fileExtension: extension };
  } catch (e) {
    // Something happened, handle the error and try again @todo: limit the amount of retries!
    let res = await handleApiError(e);
    return downloadFile(fileIdOrAlias, fileName, mimeType);
  }
}

export async function downloadFileFromUrl(url, localFileLocation, progressCb) {
  let accessToken = handlers.getAccessToken();

  const http = window.require("http");
  const fs = window.require("fs");
  const request = window.require("request");
  const progress = window.require("request-progress");

  let dest = fs.createWriteStream(localFileLocation);  

  return new Promise((resolve, reject) => {
    progress(request({
      url,
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }))
    .on('progress', (state) => progressCb({ bytesTotal: state.size.total, bytesDownloaded: state.size.transferred }))
    // .on('response', (res) => console.log(`response code: ${res.statusCode}`))
    .on('error', (error) => console.error(error))
    .on('end', () => {
      // Close the file, then resolve
      dest.close(() => resolve())
    })
    .pipe(fs.createWriteStream(localFileLocation));
  });
}

/**
 * Note: DEPRECATED
 * We do not use this method anymore, since it takes a long while to get the full count
 * Instead we use a workaround that will get the rootFolders and sees if these are processed
 * @param {*} sourceFolder 
 * @param {*} progressCb 
 */
export async function getFolderAndFileCount(sourceFolder, progressCb) {
  return new Promise(async (resolve, reject) => {
    let countFiles = 0; // Initial file
    let countFolders = 0;

    // Create a stack and add our root folder
    let a = [];
    a.push({
      id: sourceFolder.id,
      path: ""
    });

    // Get files in root
    let children = await this.getFiles(sourceFolder.id);
    console.log(children);
    countFiles += children.length;
    progressCb(countFiles);

    // As long as the stack is not empty, continue
    // A stack is used to prevent the need for recursion
    while (a.length > 0) {
      let currentFolder = a.shift(); // Shift removes first item and returns it
      countFolders++;

      // Get the folders in our current folder
      let folders = await this.getFolders(currentFolder.id);

      // Go through the folders and get the file child count in a parallell way
      await Promise.all(folders.map(async (folder) => {
        let children = await this.getFiles(folder.id);
        countFiles += children.length;

        // Send the progress
        progressCb(countFiles);

        // Push child folders, these also need to be processed
        a.push({
          id: folder.id, // Folder ID to download from
          path: `${currentFolder.path}/${folder.name}` 
        });            
      }));
    }

    return resolve({ fileCount: countFiles, folderCount: countFolders });
  })
}