import React from "react";
import PropTypes from "prop-types";
import * as SocialUtils from "../SocialLogin/SocialUtils";
import "./style.css";

class Provider extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    provider: PropTypes.object,
    onAuthSuccess: PropTypes.func, // Happens when we authenticate successfully
    isSelected: PropTypes.bool, // If this one is selected, we apply a different style "Provider-Selected"
  };

  static defaultProps = {
    onClick: () => {}
  };

  handleAuthentication() {
    const { configuration } = this.props.provider;

    // if already authenticated, don't authenticate again
    if (localStorage.getItem(configuration.localStorageKeys.token) && localStorage.getItem(configuration.localStorageKeys.refresh)) {
      return this.props.onAuthSuccess(configuration.details.key);
    }

    SocialUtils.authenticate(configuration).then(
      data => {
        console.log(`[${configuration.auth.name}] Saving access and refresh tokens`);
        localStorage.setItem(configuration.localStorageKeys.token, data.token);
        localStorage.setItem(
          configuration.localStorageKeys.refresh,
          data.refresh
        );

        // If we are successfull, return the key of the provider
        this.props.onAuthSuccess(configuration.details.key);
      },
      error =>
        this.props.provider
          .handleAuthError(error)
          .then(() => console.log("Reauthenticated Successfully"))
    );
  }

  render() {
    const { details } = this.props.provider.configuration;

    let className = "Provider";

    if (this.props.isSelected) {
      className = "Provider-Selected";
    }

    return (
      <div className={className} onClick={e => this.handleAuthentication(e)}>
        <img src={details.logo} />
        <h1>{details.title}</h1>
      </div>
    );
  }
}

export default Provider;
