import configuration from "./configuration";
import * as handlers from "./handlers";
import * as SocialUtils from "../../components/smart/SocialLogin/SocialUtils";
import * as MimeUtils from "../../utils/MimeTypeUtil";
import * as XHRUtils from "../../utils/XHRUtil";

export const handleApiMessage = data =>
  new Promise((resolve, reject) => {
    if (!data) {
      return resolve();
    }

    if (data.error) {
      return reject(data.error.message);
    }

    return resolve(data);
  });

export async function handleApiError(err) { 
  console.log(err);
  // InvalidAuthenticationToken:
  //     CompactToken validation failed with reason code: 80049228.
  if (
    err === "CompactToken parsing failed with error code: 80049217" ||
    err === "CompactToken validation failed with reason code: 80049228."
  ) {
    return SocialUtils.handleRefresh(configuration);
  }

  return Promise.reject(`Received non handled error: ${err}`);
};

//=================================================
// URLs
//=================================================
export const craftFoldersApiRoot = `https://graph.microsoft.com/v1.0/me/drive/root/children?$select=id,name,folder&filter=folder/childCount gt -1`;

export const craftFoldersApi = folderIdOrAlias =>
  `https://graph.microsoft.com/v1.0/me/drive/items/${folderIdOrAlias}/children?$select=id,name,folder&filter=folder/childCount gt -1`;

export const craftCreateFolderApi = sourceFolderIdOrAlias => `https://graph.microsoft.com/v1.0/me/drive/items/${sourceFolderIdOrAlias}/children`;
export const craftUploadSessionApi = (folderIdOrAlias, fileName) => `https://graph.microsoft.com/v1.0/me/drive/items/${folderIdOrAlias}:/${fileName}:/createUploadSession`;
export const craftUploadFileApi = (folderIdOrAlias, fileName) => `https://graph.microsoft.com/v1.0/me/drive/items/${folderIdOrAlias}:/${fileName}:/content`;

//=================================================
// API Calls
//=================================================
export async function getFolders(folderIdOrAlias) {
  let accessToken = handlers.getAccessToken();
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  // https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/driveitem_list_children
  // https://developer.microsoft.com/en-us/graph/docs/concepts/query_parameters#filter
  return fetch(
    folderIdOrAlias === "root"
      ? craftFoldersApiRoot
      : craftFoldersApi(folderIdOrAlias),
    {
      method: "GET",
      headers
    }
  )
    .then(res => res.json())
    .then(data => handleApiMessage(data))
    .catch(async e => {
      // Something happened, handle the error and try again @todo: limit the amount of retries!
      let res = await handleApiError(e);
      return getFolders(folderIdOrAlias);
    });
};

export async function createFolder(sourceFolderIdOrAlias, newFolderName) {
  let accessToken = handlers.getAccessToken();
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  // https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_post_children
  return fetch(craftCreateFolderApi(sourceFolderIdOrAlias),
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: newFolderName,
        folder: {
          childCount: 0
        }
        // "@microsoft.graph.conflictBehavior": "rename"
      })
    }
  )
    .then(res => res.json())
    .then(data => handleApiMessage(data))
    .catch(async e => {
      // Something happened, handle the error and try again @todo: limit the amount of retries!
      let res = await handleApiError(e);
      return createFolder(sourceFolderIdOrAlias, newFolderName);
    });
}

/**
 * Since we suspect users will create files > 4Mb, we are using the upload session API
 * https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_createuploadsession
 * @param {*} remoteFolderId the id of the remote folder where we are putting the file in, example: 60F2C51D3F4D08B3!21174
 * @param {*} fileName the name of the file, example: temp.txt
 * @param {*} localFileLocation the full path to the file, example: C:\temp.txt
 * @param {bytesTotal, bytesUploaded} cbProgress how much is uploaded?
 */
export async function uploadFile(remoteFolderId, fileName, localFileLocation, cbProgress) {
  let accessToken = handlers.getAccessToken();
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  // https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_post_children
  return fetch(craftUploadSessionApi(remoteFolderId, fileName),
    {
      method: "POST",
      headers,
    }
  )
  .then(res => res.json())
  .then(data => {
    return handleApiMessage(data); 
  })
  .then((data) => {
    const fs = window.require("fs");
    const file = fs.readFileSync(localFileLocation);

    headers.set("Content-Range", `bytes 0-${file.length - 1}/${file.length}`);

    // 
    // We get the uploadUrl back here, now we need to send the bytes (max 60Mb at a time if as one file, or 320Kb if byte ranges)
    return XHRUtils.fetchWithProgress(data.uploadUrl, {
      method: "PUT",
      headers,
      body: file,
    }, (e) => cbProgress({ bytesTotal: e.total, bytesUploaded: e.loaded }))
  })
  .then(data => handleApiMessage(data))
  .catch(async e => {
    // Something happened, handle the error and try again @todo: limit the amount of retries!
    let res = await handleApiError(e);
    return uploadFile(remoteFolderId, fileName, localFileLocation, cbProgress);
  });
}