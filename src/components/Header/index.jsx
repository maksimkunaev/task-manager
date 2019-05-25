import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Table, Button, Popover } from 'antd';

const data = [
  {
    name: '12 aug 2019', pv: 0, amt: 1000,
  },
  {
    name: '12 aug 2019', pv: 3000, amt: 1000,
  },
  {
    name: '12 aug 2019', pv: 2000, amt: 1000,
  },
  {
    name: '12 aug 2019', pv: 2780, amt: 1000,
  },
  {
    name: '12 aug 2019', pv: 1890, amt: 1000,
  },
  {
    name: '12 aug 2019', pv: 2390, amt: 1000,
  },
  {
    name: '12 aug 2019', pv: 3490, amt: 1000,
  },
];


const dataSource = [
  {
    source: 'YandexDirekt',
    total: 2600,
    diff: 100,
    key: 'YandexDirekt'
  },
  {
    key: 'Google AdWords',
    source: 'Google AdWords',
    total: 2550,
    diff: 80,
  },
];

const columns = [
  {
    title: 'Все источники в среднем',
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: '',
    dataIndex: 'total',
    key: 'total',
  },
  {
    title: '',
    dataIndex: 'diff',
    key: 'diff',
    render: (text, record) =>
      <Popover content={text} key>
        {text}
      </Popover>
  },
];


export default class Example extends PureComponent {
  render() {
    return (
      <div>
        <Table dataSource={dataSource} columns={columns} pagination={false}/>

        <ResponsiveContainer width="100%" height={600}>
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis ticks={[500, 1000,1500, 2000]}/>
            <Tooltip />
            <Line type="linear" dataKey="pv" stroke="#00981a" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    );
  }
}