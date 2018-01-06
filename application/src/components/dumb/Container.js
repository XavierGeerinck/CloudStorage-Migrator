import React from 'react';

class Header extends React.Component {
  render() {
    let padding;

    if (this.props.small) {
      padding = '20px 30px';
    } else {
      padding = '80px 30px';
    }

    return (
      <div className="Container" style={{ padding }}>
        {this.props.children}
      </div>
    );
  }
}

export default Header;
