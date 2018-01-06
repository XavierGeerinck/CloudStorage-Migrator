import React from "react";
import "./App.css";
import GoogleDriveFolderExplorer from "../../smart/Google/FolderExplorer";
import Header from "../Header";
import ProviderContainer from "../ProviderContainer";
import Provider from "../../smart/Provider";
import ProviderGoogle from "../../../providers/google/index";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProvider: null,
      selectedFolder: null
    };
  }

  render() {
    return (
      <div className="App">
        <Header step={1} />

        <div className="App-Content">{this.state.selectedProvider ? this.renderSelectedProvider() : this.renderAllProviders()}</div>

        <div className="Footer">M18X</div>
      </div>
    );
  }

  renderAllProviders() {
    return (
      <ProviderContainer>
        <Provider
          provider={ProviderGoogle}
          onAuthSuccess={providerKey =>
            this.setState({
              selectedProvider: ProviderGoogle
            })
          }
        />
      </ProviderContainer>
    );
  }

  renderSelectedProvider() {
    const { details } = this.state.selectedProvider.configuration;

    switch (details.key) {
      case "google":
        return this.renderSelectedProviderGoogle();
        break;
      default:
        return <div>Not supported provider {details.key}</div>;
    }
  }

  renderSelectedProviderGoogle() {
    const { localStorageKeys } = this.state.selectedProvider.configuration;
    return (
      <div>
        <Provider
          isSelected={true}
          provider={ProviderGoogle}
          onAuthSuccess={providerKey =>
            this.setState({
              selectedProvider: ProviderGoogle
            })
          }
        />

        <div className="Provider-Folder-Selected">
          <p>
            Selected Folder: <span>{this.state.selectedFolder ? this.state.selectedFolder.name : "none"}</span>
          </p>

          {this.state.selectedFolder && (
            <button onClick={e => this.props.onClickContinue(this.state.selectedProvider, this.state.selectedFolder)}>Continue</button>
          )}
        </div>

        <div style={{ margin: 20, height: "calc(100% - 60px - 40px - 42px)", overflowY: "scroll", background: "white" }}>
          <GoogleDriveFolderExplorer
            style={{ flex: 1 }}
            accessToken={localStorage.getItem(localStorageKeys.token)}
            onAuthError={err => ProviderGoogle.handlers.handleAuthError(err)}
            onSelectFolder={folder => this.setState({ selectedFolder: folder })}
          />
        </div>
      </div>
    );
  }
}

export default App;
