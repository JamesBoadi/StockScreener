import React, { Component } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Redirect } from "react-router-dom";
import { DashboardOne } from './components/Dashboard/DashboardOne/DashboardOne';
import { DashboardInterface } from './components/DashboardInterface';
import { Router, Route, Switch } from 'react-router';
import { PortFolio } from './components/Dashboard/DashboardTwo/PortFolio';
import { SideMenu } from './components/Dashboard/SideMenu';
import { DataFeed } from './components/Dashboard/DataFeed';
import './custom.css'
import 'antd/dist/antd.css';

export default class App extends Component {
  static displayName = App.name;
  constructor(props) {
    super();
    this.redirect = this.redirect.bind(this);
    this.state = {
      redirect: [],
    };
  }

  componentDidMount() {
    /*<Redirect to='/' />;*/
  }

  redirect(key) {
    console.log('key ' + key);
    let redirect = [];
    switch (key) {
      case 1:
        redirect.push(<Redirect to='/PortFolio' />);
        this.setState({ redirect: redirect });
      default:
        break;
    }
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
        <SideMenu {...this} />
        <DataFeed />
        {this.state.redirect}
        <Switch>
          <Route exact path='/' component={PortFolio} />
          <Route path='/DashboardOne' component={DashboardOne} />
          <Route path='/PortFolio' component={PortFolio} />
        </Switch>
      </div>
    );
  }
}
