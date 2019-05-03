import React, { Component } from "react";
import "./index.styl";
import Header from "./Header";
import TaskList from "./TaskList";
import EditorField from "./EditorField";
import container from "./container";
import { bind } from 'decko'
class App extends Component {

  componentDidMount() {
    this.getInitialRemote();
  }

  @bind
  getInitialRemote() {
    this.props.getAllTasks();
  }

  @bind
  addTask(data) {
    this.props.addTask(data)
  }

  render() {
      return (
        <div className="app">
          <div className="container">
            <Header {...this.props}/>
            <div className="addTask">
              <EditorField {...this.props} onChange={this.addTask} mode='add'/>
            </div>
            <TaskList {...this.props} />
          </div>
        </div>
      );
  }
}

export default container(App);
