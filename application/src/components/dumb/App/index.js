import React from "react";
import "./App.css";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";

class App extends React.Component {
  constructor(props) {
    super(props);

    // Todo: set folder: null, provider: null
    this.state = {
      step: 1
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.step === 1 && <Step1 onClickContinue={(provider, folder) => this.setState({ source: { folder, provider }, step: 2 })} />}
        {this.state.step === 2 && <Step2 onClickContinue={(provider, folder) => this.setState({ destination: { folder, provider }, step: 3 })} />}
        {this.state.step === 3 && <Step3 onClickContinue={() => this.setState({ step: 4 })} source={this.state.source} destination={this.state.destination} />}
        {this.state.step === 4 && <Step4 onClickContinue={(filesUploaded, filesDownloaded) => this.setState({ filesUploaded, filesDownloaded, step: 5 })} source={this.state.source} destination={this.state.destination} />}
        {this.state.step === 5 && <Step5 filesUploaded={this.state.filesUploaded} filesDownloaded={this.state.filesDownloaded} source={this.state.source} destination={this.state.destination} />}
      </div>
    );
  }
}

export default App;
