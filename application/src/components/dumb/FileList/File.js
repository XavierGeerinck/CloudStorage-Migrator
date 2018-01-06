import React from "react";
import PropTypes from "prop-types";
import ProgressBar from "../ProgressBar";

class File extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    size: PropTypes.number,
    extension: PropTypes.string,
    sizeDownloaded: PropTypes.number,
    sizeUploaded: PropTypes.number,
    sizeTotal: PropTypes.number,
    speed: PropTypes.number,
    isDownloading: PropTypes.number,
    isUploading: PropTypes.number
  };

  static defaultProps = {
    extension: "general",
    sizeDownloaded: 0,
    sizeUploaded: 0,
    sizeTotal: 0,
    isDownloading: false,
    isUploading: false,
    size: 0
  };

  render() {
    const {sizeDownloaded, sizeUploaded} = this.props;
    let sizeTotal = this.props.sizeTotal || 0;
    let percentageUploading = parseFloat(0).toFixed(2);
    let percentageDownloading = parseFloat(0).toFixed(2);

    if (this.props.isUploading && sizeTotal > 0) {
      percentageUploading = parseFloat(sizeUploaded / sizeTotal * 100).toFixed(2) || 0;
    } 

    if (this.props.isDownloading && sizeTotal > 0) {
      percentageDownloading = parseFloat(sizeDownloaded / sizeTotal * 100).toFixed(2) || 0;
    }

    return (
      <div className="FileList-File">
        <img src={require(`../../../images/icons/${this.props.extension || "general"}.svg`)} />

        <div className="FileList-File-Details">
        {this.props.isDownloading && (<h1>{this.props.name} <span>Downloading...</span></h1>)}
        {this.props.isUploading && (<h1>{this.props.name} <span>Uploading...</span></h1>)}

          {this.props.isDownloading && (
            <div>
              <ProgressBar color="#333333" height="3" valMax={this.props.sizeTotal} valCurrent={sizeDownloaded} />
              <p>
                {parseFloat(sizeDownloaded / 1014 / 1024).toFixed(2)} Mb of&nbsp;
                {parseFloat(sizeTotal / 1014 / 1024).toFixed(2)} Mb 
                ({percentageDownloading}% done)
                <span>12.0MB/sec</span>
              </p>
            </div>
          )}

          {this.props.isUploading && (
            <div>
              <ProgressBar color="#333333" height="3" valMax={sizeTotal} valCurrent={sizeUploaded} />
              <p>
                {parseFloat(sizeUploaded / 1014 / 1024).toFixed(2)} Mb of&nbsp;
                {parseFloat(sizeTotal / 1014 / 1024).toFixed(2)} Mb 
                ({percentageUploading}% done)
                <span>12.0MB/sec</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default File;
