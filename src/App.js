import React, { Component } from 'react';
import './App.css';
import {
  HeartRate,
  RespirationRate,
  TurnOver
} from './components/ChartRealTime';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(prev => ({
        time: prev.time + 1
      }));
    }, 50);
  }
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }
  render() {
    const { time } = this.state;
    return (
      <div className="wrapper">
        <div className="left">
          <HeartRate heartRate={90} time={time} />
        </div>
        <div className="mid">
          <RespirationRate breathRate={60} time={time} />
        </div>
        <div className="right">
          <TurnOver turnOverCount={1} time={time} />
        </div>
      </div>
    );
  }
}

export default App;
