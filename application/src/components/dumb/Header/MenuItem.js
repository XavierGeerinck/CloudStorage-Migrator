import React from 'react';
import PropTypes from 'prop-types';

class MenuItem extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
    img: PropTypes.object,
    title: PropTypes.string,
  }

  static defaultProps = {
    isActive: false,
    title: "",
  }

  render() {
    let classes = "MenuItem";

    if (this.props.isActive) {
      classes += " MenuItem-Active";
    }
  
    return (
      <div className={classes}>
        <img src={this.props.img} />
        <button>{this.props.title}</button>
        {this.props.children}
      </div>
    );
  }
}

export default MenuItem;
