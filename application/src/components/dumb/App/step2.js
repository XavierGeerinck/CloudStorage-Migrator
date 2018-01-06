import React from "react";
import "./App.css";
import OneDriveFolderExplorer from "../../smart/Microsoft/FolderExplorer";
import Header from "../Header";
import Container from "../Container";
import Provider from "../../smart/Provider";
import ProviderMicrosoft from "../../../providers/microsoft/index";

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
        <Header step={2} />

        <div className="App-Content">{this.state.selectedProvider ? this.renderSelectedProvider() : this.renderAllProviders()}</div>

        <div className="Footer">M18X</div>
      </div>
    );
  }

  renderAllProviders() {
    return (
      <Container>
        <Provider
          provider={ProviderMicrosoft}
          onAuthSuccess={providerKey =>
            this.setState({
              selectedProvider: ProviderMicrosoft
            })
          }
        />
      </Container>
    );
  }

  renderSelectedProvider() {
    const { details } = this.state.selectedProvider.configuration;

    switch (details.key) {
      case "onedrive":
        return this.renderSelectedProviderOneDrive();
        break;
      default:
        return <div>Not supported provider {details.key}</div>;
    }
  }

  renderSelectedProviderOneDrive() {
    const { localStorageKeys } = this.state.selectedProvider.configuration;
    return (
      <div>
        <Provider
          isSelected={true}
          provider={ProviderMicrosoft}
          onAuthSuccess={providerKey =>
            this.setState({
              selectedProvider: ProviderMicrosoft
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
          <OneDriveFolderExplorer
            style={{ flex: 1 }}
            accessToken={localStorage.getItem(localStorageKeys.token)}
            onAuthError={err => ProviderMicrosoft.handlers.handleAuthError(err)}
            onSelectFolder={folder => this.setState({ selectedFolder: folder })}
          />
        </div>
      </div>
    );
  }
}

export default App;
