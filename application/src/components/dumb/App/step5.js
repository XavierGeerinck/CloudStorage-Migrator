import React from "react";
import "./App.css";
import Header from "../Header";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Header step={5} />

        <p style={{ textAlign: 'center' }}>Successfully converted {this.props.filesUploaded} files of the {this.props.filesDownloaded} files</p>
        <p style={{ textAlign: 'center' }}>
          From&nbsp;
          <strong>
            {this.props.source.provider.configuration.details.title}:{this.props.source.folder.name}
          </strong>
          &nbsp;to&nbsp;
          <strong>
            {this.props.destination.provider.configuration.details.title}:{this.props.destination.folder.name}
          </strong>
        </p>

        <div className="Footer">M18X</div>
      </div>
    );
  }
}

export default App;
