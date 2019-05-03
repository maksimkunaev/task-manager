import React, { Component } from "react";
import "./index.styl";
import Header from "./Header";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import container from "./container";
import { bind } from 'decko';

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
        <div className="app">
          <div className="container">
            <Header {...this.props}/>
            <AddTask {...this.props}/>
            <TaskList {...this.props} />
          </div>
        </div>
      );
  }
}

export default container(App);
