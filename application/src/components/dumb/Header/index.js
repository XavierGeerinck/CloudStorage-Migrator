import React from "react";
import PropTypes from "prop-types";
import MenuItem from "./MenuItem";
import "./style.css";

class Header extends React.Component {
  static propTypes = {
    step: PropTypes.number
  };

  static defaultProps = {
    step: 1
  };

  render() {
    return (
      <div className="Header">
        {this.props.step < 4 && this.renderNormalSteps()}
        {this.props.step === 4 &&  this.renderSyncStep()}
        {this.props.step === 5 &&  this.renderDoneStep()}
      </div>
    );
  }

  renderNormalSteps() {
    return (
      <div className="Menu">
        <MenuItem
          isActive={this.props.step >= 1}
          img={this.props.step >= 1 ? require("../../../images/download-active.svg") : require("../../../images/download-active.svg")}
          title="Select Source"
        />
        <MenuItem
          isActive={this.props.step >= 2}
          img={this.props.step >= 2 ? require("../../../images/upload-active.svg") : require("../../../images/upload-inactive.svg")}
          title="Select Destination"
        />
        <MenuItem
          isActive={this.props.step >= 3}
          img={this.props.step >= 3 ? require("../../../images/start-active.svg") : require("../../../images/start-inactive.svg")}
          title="Start!"
        />
      </div>
    );
  }

  renderSyncStep() {
    return (
      <div className="Menu">
        <div className="MenuItem" style={{ padding: '0' }}>
          <img src={require("../../../images/loading.svg")} style={{ padding: 0, marginBottom: -15 }} />
          {this.props.children}
        </div>
      </div>
    );
  }

  renderDoneStep() {
    return (
      <div className="Menu">
        <div className="MenuItem" style={{ padding: '0' }}>
          <img src={require("../../../images/check.svg")} style={{ padding: 0, marginBottom: -15 }} />
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Header;
