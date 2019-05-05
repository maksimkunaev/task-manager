import React, { Component } from 'react';
import styles from './Table.styl';
import { bind } from 'decko';
import EditorField from "../EditorField";
import cn from 'classnames';
import { Rate } from 'antd';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

class Rater extends React.Component {
    state = {
        value: 3,
    }

    handleChange = (value) => {
        this.setState({ value });
    }

    render() {
        const { value } = this.state;
        return (
          <span>
        <Rate tooltips={desc} onChange={this.handleChange} value={value} />
              {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : ''}
      </span>
        );
    }
}

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
    onSortClick(key, direction) {

        const queryParams = {
            sort_field: key,
            sort_direction: direction,
            page: this.state.currentPage,
        }
        this.props.getAllTasks(queryParams);
    }


    @bind
    renderHead(){
        const { columns, isAdmin } = this.props;

        return (
          <tr className={cn(styles.block_wrap, styles.block, styles.tableHead)}>
              {columns.map(({ title, width, key }) => {
                  return <th key={key} width={width}>
                      <div className={styles.blockItems}>
                          <div className={styles.blockItem}>{title}</div>

                          <div className={styles.arrows}>
                              <div className={styles[`arrow-up`]} onClick={this.onSortClick.bind(this, key, 'asc')}/>
                              <div className={styles[`arrow-down`]} onClick={this.onSortClick.bind(this, key, 'desc')}/>
                          </div>

                      </div>
                  </th>
              })}

              {isAdmin && <th width={100}>
                  <div className={styles.headRow}>
                      <div className={styles.blockItem} />
                  </div>
              </th>
              }

          </tr>
        )
    }

    @bind
    renderRow(data){
        const { id } = data;
        const { isEdit, editTaskId} = this.state;
        const { isAdmin } = this.props;
        const isCurrentTaskEditable = isEdit && editTaskId === id;

        if (isCurrentTaskEditable) {
            return <tr className={styles.block_wrap} key={id}>
                <td className={styles.block}>
                    <EditorField {...this.props} onChange={this.editTask.bind(this, id)} mode='edit' currentTaskId={id}/>
                </td>
            </tr>
        }
        const columns = this.props.columns;

        return (
          <tr className={cn(styles.block_wrap, styles.block)} key={id}>
              {columns.map(({ key, width, render }) => {
                  return <td key={key} width={width}>
                      <div className={styles.blockItems}>
                          <div className={styles.blockItem}>{
                              render ?
                                render(data): data[key]
                          }</div>
                      </div>
                  </td>
              })}
              {isAdmin && <td>
                  <div className={styles.blockItems}>
                      <button className={cn(styles.button, styles.blockItem)} onClick={this.onTaskClick.bind(this, id)}>edit</button>
                  </div>
              </td>
              }

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
              <div className={cn(style, styles.navigation_button_dots)} key={index} >...</div>
        }
        for (let i of range) {
            const classes = cn({
                [styles.navigation_button]: true,
                [styles.navigation_button_active]: currentPage === i
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
        const { id } = data;
        const { isEdit, editTaskId} = this.state;
        const isCurrentTaskEditable = isEdit && editTaskId === id;

        if (isCurrentTaskEditable) {
            return <tr className={styles.block_wrap} key={id}>
                <td className={styles.block}>
                    <EditorField {...this.props} onChange={this.editTask.bind(this, id)} mode='edit' currentTaskId={id}/>
                </td>
            </tr>
        }

        return (
          <div className={styles.tableWrap}>
              <Rater />
              {data.length > 0 && <table className={styles.tasks__list}>
                  <thead>
                  {this.renderHead()}
                  </thead>
                  <tbody>
                  {data.map(taskData => {
                      return this.renderRow(taskData)
                  })}
                  </tbody>
              </table>
              }

              {data.length > 0 && <div className={styles.block__pagination}>
                  {this.renderPagination()}
                </div>
              }

          </div>
        )
    }
}

export default Table;
