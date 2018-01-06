const Events = require("../constants/Events");
const EventEmitter = window.require("events");

class MyEmitter extends EventEmitter {
  static instance;

  constructor() {
    super();

    if (this.instance) {
      return this.instance;
    }

    this.instance = this;
  }

  syncAddFile(idx, file) {
    this.emit(Events.SYNC_ADD_FILE, { idx, file });
  }

  syncRemoveFile(idx) {
    this.emit(Events.SYNC_REMOVE_FILE, { idx });
  }

  syncUpdateFileDownloadProgress(idx, bytesTotal, bytesDownloaded) {
    this.emit(Events.SYNC_UPDATE_FILE_DOWNLOAD_PROGRESS, { idx, bytesTotal, bytesDownloaded });
  }

  syncUpdateFileUploadProgress(idx, bytesTotal, bytesUploaded) {
    this.emit(Events.SYNC_UPDATE_FILE_UPLOAD_PROGRESS, { idx, bytesTotal, bytesUploaded });
  }

  syncUpdateStat(stat, value) {
    this.emit(Events.SYNC_UPDATE_STAT, { key: stat, value });
  }

  syncIncrementFilesSynced() {
    this.emit(Events.SYNC_INCREMENT_FILES_SYNCED);
  }

  syncUpdateFileSetDownloading(idx) {
    this.emit(Events.SYNC_UPDATE_FILE_SET_DOWNLOADING, { idx });
  }

  syncUpdateFileSetUploading(idx) {
    this.emit(Events.SYNC_UPDATE_FILE_SET_UPLOADING, { idx });
  }
};

export default new MyEmitter();
