import React from "react";
import PropTypes from "prop-types";
import "./style.css";

class ProgressBar extends React.Component {
  static propTypes = {
    showNumbers: PropTypes.bool,
    valLabel: PropTypes.string,
    valMax: PropTypes.number,
    valMin: PropTypes.number,
    valCurrent: PropTypes.number,
    color: PropTypes.string,
    height: PropTypes.number,
    showPercentage: PropTypes.bool
  };

  static defaultProps = {
    showNumbers: true,
    valCurrent: 0,
    valMax: 0,
    valMin: 0,
    valLabel: "",
    color: "#f1f1f1",
    height: 3,
    showPercentage: false
  };

  render() {
    let valMax = this.props.valMax || this.props.valCurrent; // If not known, just set to current
    let progressPercentage = parseFloat(this.props.valCurrent / valMax * 100);
    progressPercentage = progressPercentage >= 100 ? 100 : progressPercentage; // Cap it at 100

    return (
      <div className="ProgressBar-Flex">
        <div
          className="ProgressBar"
          style={{
            border: `1px solid ${this.props.color}`,
            height: `${this.props.height}px`
          }}
        >
          <div
            className="ProgressBar-Background"
            style={{
              width: `${this.props.valCurrent / this.props.valMax * 100}%`,
              background: this.props.color
            }}
          />

          <div className="ProgressBar-Content">{this.props.children}</div>
        </div>

        {this.props.showPercentage && (
          <div className="ProgressBar-Content-Percentage" style={{ color: this.props.color }}>
            {isNaN(progressPercentage) ? 0 : progressPercentage.toFixed(2)}%
          </div>
        )}
      </div>
    );
  }
}

export default ProgressBar;
