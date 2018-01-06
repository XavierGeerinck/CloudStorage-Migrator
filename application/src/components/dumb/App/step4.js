import React from "react";
import PropTypes from "prop-types";
import ProgressBar from "../ProgressBar";
import Header from "../Header";
import { FileList, File } from "../FileList";
import * as SyncUtil from "../../../utils/SyncUtil";
import "./App.css";
import * as Events from "../../../constants/Events";
import EventUtil from "../../../utils/EventUtil";
import * as MimeTypeUtil from "../../../utils/MimeTypeUtil";

class App extends React.Component {
  static propTypes = {
    source: PropTypes.object.isRequired, // contains { provider, folder }
    destination: PropTypes.object.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      syncList: {},
      stats: {},
      filesSynced: 0,
      isPreProcessing: false, // Is preprocessing
      countFilesToSync: 0, // Total count of files to sync (gotten in the preprocessing step)
      countFoldersToSync: 0, // Total count of folders to sync (gotten in the preprocessing step)
      rootFoldersProcessed: 0, // Amount of rootFolders processed (this way we can show process without having to count all files)
    };
  }

  async componentDidMount() {
    console.log("PROVIDERS");
    console.log(JSON.stringify(this.props.source));
    console.log(this.props.source);
    console.log(JSON.stringify(this.props.destination));

    // Adding a file to sync
    EventUtil.on(Events.SYNC_ADD_FILE, ({ idx, file }) => {
      let newSyncList = this.state.syncList;
      newSyncList[idx] = file;
      this.setState({
        syncList: newSyncList
      });
    });

    // Removing a file that got synced
    EventUtil.on(Events.SYNC_REMOVE_FILE, ({ idx }) => {
      let newSyncList = this.state.syncList;
      delete newSyncList[idx];
      this.setState({
        syncList: newSyncList
      });
    });

    EventUtil.on(Events.SYNC_UPDATE_FILE_SET_DOWNLOADING, ({ idx }) => {
      let newSyncList = this.state.syncList;
      newSyncList[idx].isDownloading = true;
      newSyncList[idx].isUploading = false;

      this.setState({
        syncList: newSyncList
      });
    });

    EventUtil.on(Events.SYNC_UPDATE_FILE_SET_UPLOADING, ({ idx }) => {
      let newSyncList = this.state.syncList;
      newSyncList[idx].isDownloading = false;
      newSyncList[idx].isUploading = true;

      this.setState({
        syncList: newSyncList
      });
    });

    // Set progress of file download
    EventUtil.on(Events.SYNC_UPDATE_FILE_DOWNLOAD_PROGRESS, ({ idx, bytesTotal, bytesDownloaded }) => {
      let newSyncList = this.state.syncList;
      newSyncList[idx].downloadTotal = bytesTotal;
      newSyncList[idx].downloadBytesTransferred = bytesDownloaded;

      this.setState({
        syncList: newSyncList
      });
    });

    // Set progress of file upload
    EventUtil.on(Events.SYNC_UPDATE_FILE_UPLOAD_PROGRESS, ({ idx, bytesTotal, bytesUploaded }) => {
      let newSyncList = this.state.syncList;
      newSyncList[idx].uploadTotal = bytesTotal;
      newSyncList[idx].uploadBytesTransferred = bytesUploaded;

      this.setState({
        syncList: newSyncList
      });
    });

    // Set progress of file
    EventUtil.on(Events.SYNC_UPDATE_STAT, ({ key, value }) => {
      let stats = this.state.stats;

      if (!stats[key]) {
        stats[key] = value;
      } else {
        stats[key] += value;
      }

      this.setState({ stats });
    });

    EventUtil.on(Events.SYNC_INCREMENT_FILES_SYNCED, () => {
      this.setState({ filesSynced: this.state.filesSynced + 1 });
    });

    // Preprocessing
    // Note: in this step we just get the count of folders below the main folder
    // this.setState({ isPreProcessing: true });
    // let rootFolderFolderCount = await this.props.source.provider.api.getFolders(this.props.source.folder.id);
    // this.setState({ isPreProcessing: false, rootFoldersProcessed: 0 });
 
    // // Actual sync
    // await SyncUtil.sync(this.props.source, this.props.destination, this);
    // console.log('DONE - Congrats');

    // this.props.onClickContinue(this.state.filesSynced, this.state.countFilesToSync);
  }

  render() {
    return (
      <div className="App">
        <Header step={4}>
          {this.state.isPreProcessing && this.renderHeaderPreProcessing()}
          {!this.state.isPreProcessing && this.renderHeaderSyncing()}
        </Header>

        <FileList>
          {/* <File name="onedrive.pdf" extension="pdf" sizeDownloaded={5892997.12} sizeUploaded={0.00} sizeTotal={0} isDownloading={true} speed={1258291.2} />
        <File name="onedrive.pdf" extension="pdf" sizeDownloaded={5892997.12} sizeUploaded={0.00} sizeTotal={13170114.6} isDownloading={true} speed={1258291.2} />
        <File name="onedrive.pdf" extension="pdf" sizeDownloaded={5892997.12} sizeUploaded={0.00} sizeTotal={13170114.6} isDownloading={true} speed={1258291.2} />
        <File name="onedrive.pdf" extension="pdf" sizeDownloaded={5892997.12} sizeUploaded={0.00} sizeTotal={13170114.6} isDownloading={true} speed={1258291.2} />
        <File name="onedrive.pdf" extension="pdf" sizeDownloaded={5892997.12} sizeUploaded={0.00} sizeTotal={13170114.6} isDownloading={true} speed={1258291.2} />
 */}

          {Object.entries(this.state.syncList).map(([fileIdx, file]) => {
            if (file.isDownloading) {
              return (
                <File
                  name={file.name}
                  extension={MimeTypeUtil.mimeTypes[file.mimeType].extension}
                  sizeDownloaded={file.downloadBytesTransferred}
                  isDownloading={true}
                  sizeTotal={file.downloadTotal}
                  speed={1258291.2}
                />
              );
            }

            if (file.isUploading) {
              return (
                <File
                  name={file.name}
                  extension={MimeTypeUtil.mimeTypes[file.mimeType].extension}
                  sizeUploaded={file.uploadBytesTransferred}
                  isUploading={true}
                  sizeTotal={file.uploadTotal}
                  speed={1258291.2}
                />
              );
            }
          })}
        </FileList>

        <div className="Footer">M18X</div>
      </div>
    );
  }

  renderHeaderPreProcessing() {
    return <p>Gathering files to sync ({this.state.countFilesToSync})...</p>;
  }

  renderHeaderSyncing() {
    return (
      <div>
        <p>
          Syncing&nbsp;
          <strong>
            {this.props.source.provider.configuration.details.title}:{this.props.source.folder.name}
          </strong>
          &nbsp;to&nbsp;
          <strong>
            {this.props.destination.provider.configuration.details.title}:{this.props.destination.folder.name}
          </strong>
        </p>
        {/* <br /> */}
        {/* <ProgressBar valMax={this.state.countFilesToSync} valCurrent={this.state.filesSynced} height="12" showPercentage={true} /> */}
      </div>
    );
  }
}

export default App;
