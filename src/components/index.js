import React, { Component } from "react";
import s from "./index.styl";
import Header from "./Header";
import container from "./container";
import { bind } from 'decko';
import 'antd/dist/antd.css';

class App extends Component {
  componentDidMount() {
    this.getInitialRemote();
  }

  @bind
  getInitialRemote() {
    this.props.getAllTasks();
  }

  render() {
    return (
        <div className={s.app}>
          <div className={s.container}>
            <Header />
          </div>
        </div>
      );
  }
}

export default container(App);
