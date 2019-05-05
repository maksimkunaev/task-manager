import React, { Component } from "react";
import s from "./index.styl";
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
    console.log(s)
    return (
        <div className={s.app}>
          <div className={s.container}>
            <Header {...this.props}/>
            <AddTask {...this.props}/>
            <TaskList {...this.props} />
          </div>
        </div>
      );
  }
}

export default container(App);
