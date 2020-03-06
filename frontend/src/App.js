import React, { Component } from 'react';
import './App.css';
import FormUpload from './components/FormUpload';
import socketIOClient from 'socket.io-client';
import config from './constants';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class App extends Component {

  state = {
    files: [],
    networkUrl: `${config.url}`,
    endpoint: `${config.url}:4001`
  }

  componentDidMount = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.on('reloadFilesList', (data) => {
      this.setState({ files: data })
    })
  }

  componentWillMount() {
    fetch(`${this.state.networkUrl}:8000/files`, {
      method: 'POST',
    }).then((response, error) => {
      response.json().then((body) => {
        this.setState({ files: body.files });
      }).catch(err => {
        console.log('caught it!', err);
      });
    });
  }

  render() {
    const files = this.state.files.map((file, key) => <p key={key}>{file}</p>);

    return (
      <div className="App">
        <FormUpload networkUrl={this.state.networkUrl} />
        <div className="filesList">
          <h2>Upload files successfully ( {files.length} )</h2>
          <ReactCSSTransitionGroup
            transitionName="uploadList"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
            transitionEnter={true}
            transitionLeave={true}
          >
            {files}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

export default App;