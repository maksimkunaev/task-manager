import React, { Component } from 'react';
import './Table.styl';
import { bind } from 'decko';
import EditorField from "../EditorField";
import cn from 'classnames'
class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            editTaskId: null,
            currentPage: 1,
            taskPerPage: 3,
        }
    }

    @bind
    onTaskClick(editTaskId){
        this.setState({
            isEdit: true,
            editTaskId,
        })
    }

    @bind
    editTask(id, data) {
        this.props.editTask(id, data);

        this.setState({
            isEdit: false,
            editTaskId: null,
        })
    }

    @bind
    renderTask(data){
        const { id } = data;
        const { isEdit, editTaskId} = this.state;
        const { isAdmin } = this.props;
        const isCurrentTaskEditable = isEdit && editTaskId === id;

        if (isCurrentTaskEditable) {
            return <tr className="block_wrap" key={id}>
                <td className="block">
                    <EditorField {...this.props} onChange={this.editTask.bind(this, id)} mode='edit' currentTaskId={id}/>
                </td>
            </tr>
        }
        const columns = this.props.columns;

        return (
          <tr className="block_wrap block" key={id}>
              {columns.map(({ key, width }) => {
                  return <td key={key} width={width}>
                      <div className="blockItems">
                          <div className="blockItem">{data[key]}</div>
                      </div>
                  </td>
              })}
              {isAdmin &&  <td className="">
                  <div className="blockItems">
                      <button className="button blockItem" onClick={this.onTaskClick.bind(this, id)}>edit</button>
                  </div>
              </td>
              }

              {/*<td className="block">*/}
                  {/*<div className="blockItems">*/}
                      {/*{columns.map(({ key }) => {*/}
                          {/*return <div className="blockItem">{data[key]}</div>*/}
                      {/*})}*/}
                  {/*</div>*/}
                  {/*{isAdmin && <button className="button" onClick={this.onTaskClick.bind(this, id)}>edit</button>}*/}
              {/*</td>*/}

          </tr>
        )
    }

    @bind
    goToPage(i) {
        this.setState({ currentPage: i});
        this.props.getAllTasks({
            sort_field: 'id',
            sort_direction: 'asc',
            page: i,
        })
    }

    @bind
    renderPagination() {
        const { currentPage, taskPerPage } = this.state;

        const { total } = this.props;
        const pages = Math.ceil(Number(total)/taskPerPage);
        const delta = 1;
        const left = currentPage - delta;
        const right = currentPage + delta + 1;
        const range = [];
        const rangeWithDots = [];

        let l;

        for (let i = 1; i <= pages; i++) {
            if (i === 1 || i === pages || i >= left && i < right) {
                range.push(i);
            }
        }


        const button = (index, style) => {
            return index ? <div className={style} key={index} onClick={this.goToPage.bind(this, index)}>{index}</div> :
              <div className={cn(style, 'navigation_button_dots')} key={index} >...</div>
        }
        for (let i of range) {
            const classes = cn({
                navigation_button: true,
                navigation_button_active: currentPage === i
            });

            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(button(l + 1, classes));
                } else if (i - l !== 1) {
                    rangeWithDots.push(button(null, classes));
                }
            }

            rangeWithDots.push(button(i, classes));
            l = i;
        }

        return rangeWithDots;
    }

    render() {
        const { data } = this.props;

        return (
          <div>
              <table className="tasks__list">
                  <tbody>
                  {data.map(taskData => {
                      return this.renderTask(taskData)
                  })}
                  </tbody>

              </table>

              {data.length > 0 && <div className="block__pagination">
                  {this.renderPagination()}
              </div>
              }

          </div>
        )
    }
}

export default Table;
