import React from "react";
import PropTypes from "prop-types";
import ProgressBar from "../ProgressBar";
import Header from "../Header";
import { FileList, File } from "../FileList";
import * as SyncUtil from "../../../utils/SyncUtil";
import "./App.css";
import * as Events from "../../../constants/Events";
import EventUtil from "../../../utils/EventUtil";

class App extends React.Component {
  static propTypes = {
    source: PropTypes.object.isRequired, // contains { provider, folder }
    destination: PropTypes.object.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Header step={3} />

        <div className="App-StepConfirm">
          <p>You are about to synchronize your files from</p>
          <p>
            <strong>
              {this.props.source.provider.configuration.details.title}:{this.props.source.folder.name}
            </strong>
            &nbsp;to&nbsp;
            <strong>
              {this.props.destination.provider.configuration.details.title}:{this.props.destination.folder.name}
            </strong>
          </p>
          <p>Do you want to start now?</p>
          <button onClick={e => this.props.onClickContinue()}>Yes</button>
          <button className="button-disabled">No</button>
        </div>

        <div className="Footer">M18X</div>
      </div>
    );
  }
}

export default App;
