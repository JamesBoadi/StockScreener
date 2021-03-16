import React, { Component } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Layout } from './components/Layout';
import { Redirect } from "react-router-dom";
import { DashboardOne } from './components/Dashboard/DashboardOne/DashboardOne';
import { DashboardInterface } from './components/DashboardInterface';
import { Router, Route, Switch } from 'react-router';
import { FetchData } from './components/Dashboard/DashboardOne/FetchData';
import { Counter } from './components/Counter';
import './custom.css'
import 'antd/dist/antd.css';

export default class App extends Component {
  static displayName = App.name;

  componentDidMount()
  {
    <Redirect to='/' />;
  }

  render() {
    /*
            <Route exact path='/' component={DashboardInterface} />
            <Route path='/counter' component={Counter} />
            <Route path='/fetch-data' component={FetchData} />
            <Route path='/DashboardOne' component={DashboardOne} />
     */
    return (
      <div>
        <Switch>
          <Route exact path='/' component={DashboardOne} />
          <Route path='/DashboardOne' component={DashboardOne} />
        </Switch>
      </div>
    );
  }
}
