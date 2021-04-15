import React, { Component } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Redirect } from "react-router-dom";
import { DashboardOne } from './components/Dashboard/DashboardOne/DashboardOne';
import { DashboardInterface } from './components/DashboardInterface';
import { Router, Route, Switch } from 'react-router';
import { FilterTable } from './components/Dashboard/Historical/FilterTable';
import { PortFolio } from './components/Dashboard/Portfolio/PortFolio';
import { SideMenu } from './components/Dashboard/SideMenu';
import { DataFeed } from './components/Dashboard/DataFeed';
import './custom.css'
import 'antd/dist/antd.css';

export default class App extends Component {
  static displayName = App.name;
  constructor(props) {
    super();

    this.redirect = this.redirect.bind(this);
    this.getUpdateCache = this.getUpdateCache.bind(this);

    this.state = {
      redirect: [],
      updateCache: false,
    };
  }

  componentDidMount() {
    /*<Redirect to='/' />;*/
  }

  redirect(key) {
    console.log('key ' + key);
    let redirect = [];
    switch (key) {
      case 9:
        redirect.push(<Redirect to='/DashboardOne' />);
        break;
      case 13:
        redirect.push(<Redirect to='/HistoricalTable' />);
        break;
      case 14:
        redirect.push(<Redirect to='/Portfolio' />);
        break;
      default:
        break;
    }
    this.setState({ redirect: redirect });
  }

  getUpdateCache(update) {
    this.setState({ updateCache: update });
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
        <DataFeed {...this} />
        {this.state.redirect}
        <Switch>
          <Route exact path='/' component={() => <FilterTable {...this} />} />
          <Route path='/DashboardOne' component={() => <DashboardOne {...this} />} />
          <Route path='/HistoricalTable' component={() => <FilterTable {...this} />} />
          <Route path='/Portfolio' component={() => <PortFolio {...this} />} />
        </Switch>
      </div>
    );
  }
}
