import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import SocialButton from "../../smart/SocialLogin/SocialButton";
import * as SocialUtils from "../../smart/SocialLogin/SocialUtils";
import OneDriveFolderExplorer from "../../smart/Microsoft/FolderExplorer";
import GoogleDriveFolderExplorer from "../../smart/Google/FolderExplorer";
import providerGoogle from "../../../providers/google";
import providerMicrosoft from "../../../providers/microsoft";

class App extends Component {
  state = {
    authorizeGoogle: false,
    authorizeMicrosoft: false
  };

  componentDidMount() {
    const authTokenMicrosoft = localStorage.getItem("auth.microsoft.token");
    const authTokenGoogle = localStorage.getItem("auth.google.token");

    this.setState({
      authorizeGoogle: !!!authTokenGoogle,
      authorizeMicrosoft: !!!authTokenMicrosoft
    });
  }

  handleGoogleAuthError(err) {
    if (err === "Invalid Credentials") {
      SocialUtils.handleRefresh(providerGoogle.configuration)
        .then(() =>
          this.setState({
            authorizeGoogle: true
          })
        )
        .catch(e => console.log(e));
    }
  }

  handleMicrosoftAuthError(err) {
    // InvalidAuthenticationToken:
    //     CompactToken validation failed with reason code: 80049228.
    if (err === "CompactToken parsing failed with error code: 80049217" || err === "CompactToken validation failed with reason code: 80049228.") {
      SocialUtils.handleRefresh(providerMicrosoft.configuration)
        .then(() =>
          this.setState({
            authorizeMicrosoft: true
          })
        )
        .catch(e => console.log(e));
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <button onClick={() => localStorage.removeItem("auth.google.token")}>Clear Google Token</button>
        <button onClick={() => localStorage.removeItem("auth.microsoft.token")}>Clear Microsoft Token</button>

        {this.state.authorizeMicrosoft && (
          <SocialButton
            name={providerMicrosoft.name}
            buttonText={`Login with ${providerMicrosoft.name}`}
            authUrl={providerMicrosoft.authUrl}
            refreshUrl={providerMicrosoft.refreshUrl}
            successUrl={providerMicrosoft.successUrl}
            errorUrl={providerMicrosoft.errorUrl}
          />
        )}

        {this.state.authorizeGoogle && (
          <SocialButton
            name={providerGoogle.name}
            buttonText={`Login with ${providerGoogle.name}`}
            authUrl={providerGoogle.authUrl}
            refreshUrl={providerGoogle.refreshUrl}
            successUrl={providerGoogle.successUrl}
            errorUrl={providerGoogle.errorUrl}
          />
        )}

        <div style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: 'stretch' }}>
          {!this.state.authorizeGoogle && (
            <GoogleDriveFolderExplorer
              style={{ flex: 1 }}
              accessToken={localStorage.getItem("auth.google.token")}
              onAuthError={err => this.handleGoogleAuthError(err)}
            />
          )}

          {!this.state.authorizeMicrosoft && (
            <OneDriveFolderExplorer
              style={{ flex: 1 }}
              accessToken={localStorage.getItem("auth.microsoft.token")}
              onAuthError={err => this.handleMicrosoftAuthError(err)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
