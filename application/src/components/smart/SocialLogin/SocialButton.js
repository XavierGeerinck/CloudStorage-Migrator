import React from "react";
import PropTypes from "prop-types";
import PopupWindow from "./PopupWindow";
import * as SocialUtils from "./SocialUtils";

class SocialButton extends React.Component {
  static propTypes = {
    authUrl: PropTypes.string.isRequired, // Where do we direct the user to, to log in? (we use a server to not expose our secret)
    successUrl: PropTypes.string.isRequired, // Where are we redirected to if we are successful? The token should be in the query parameters
    errorUrl: PropTypes.string.isRequired, // Where are we redirect to if we got an error? The message should be in the query parameters
    buttonText: PropTypes.string,
    name: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    // Hooks
    onRequest: PropTypes.func,
    onFailure: PropTypes.func,
    onSuccess: PropTypes.func
  };

  static defaultProps = {
    name: "",
    authUrl: "https://api.m18x.com/auth/office365",
    refreshUrl: "https://api.m18x.com/auth/office365/refresh",
    successUrl: "https://api.m18x.com/auth/success",
    errorUrl: "https://api.m18x.com/auth/error",
    buttonText: "Sign in with Microsoft",
    // Hooks
    onRequest: null,
    onFailure: null,
    onSuccess: null
  };

  onBtnClick(e) {
    e.preventDefault();

    const { buttonText, authUrl, successUrl, errorUrl } = this.props;

    SocialUtils.authenticate({ authUrl, successUrl, errorUrl }, this.onRequest).then(data => this.onSuccess(data), error => this.onFailure(error));
  }

  onRequest() {
    this.props.onRequest();
  }

  onSuccess(data) {
    if (this.props.onSuccess) {
      return this.props.onSuccess(data);
    }

    const { name, authUrl, successUrl, errorUrl, refreshUrl } = this.props;
    SocialUtils.handleAuthSuccess({ authUrl, successUrl, errorUrl, refreshUrl, name }, data);
  }

  onFailure(error) {
    if (this.props.onFailure) {
      return this.props.onFailure(error);
    }

    const { name, authUrl, successUrl, errorUrl, refreshUrl } = this.props;
    SocialUtils.handleAuthError({ authUrl, successUrl, errorUrl, refreshUrl, name }, error);
  }

  render() {
    const { className, buttonText, children } = this.props;
    const attrs = { onClick: e => this.onBtnClick(e) };

    if (className) {
      attrs.className = className;
    }

    return <button {...attrs}>{children || buttonText}</button>;
  }
}

export default SocialButton;
