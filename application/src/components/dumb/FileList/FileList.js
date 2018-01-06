import React from "react";

class FileList extends React.Component {
  render() {
    return <div className="FileList">{this.props.children}</div>;
  }
}

export default FileList;

