import React, { Component } from 'react';
import './AddTask.styl';
import EditorField from '../EditorField'
import { bind } from 'decko'

class AddTask extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        }
    }

    @bind
    addTask(data) {
        this.props.addTask(data)
    }

    @bind
    onButtonClick(data) {
        this.setState({
            isVisible: !this.state.isVisible
        })
    }

    @bind
    renderButton() {
        const { isVisible } = this.state;

        return (
          <button className="field button" onClick={this.onButtonClick}>
              {isVisible ?
                <div className="arrow-down"/> : <span>
                  <div>+</div>
                  <div>Add</div>
                </span>
              }
          </button>
        )
    }

    render() {

        return (
          <div className="addTask">
              {
                  this.renderButton()
              }
              {this.state.isVisible && <EditorField {...this.props} onChange={this.addTask} mode='add'/>}
          </div>
        )
    }
}

export default AddTask;