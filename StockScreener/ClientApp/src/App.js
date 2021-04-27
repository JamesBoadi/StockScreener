import React, { Component } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Redirect } from "react-router-dom";
import { DashboardOne } from './components/Dashboard/DashboardOne/DashboardOne';
import { DashboardTwo } from './components/Dashboard/DashboardTwo/DashboardTwo';
import { DashboardInterface } from './components/DashboardInterface';
import { Router, Route, Switch } from 'react-router';
import { Scanner } from './components/Dashboard/Scanner/Scanner';
import { FilterTable } from './components/Dashboard/Historical/FilterTable';
import { PortFolio } from './components/Dashboard/Portfolio/PortFolio';

import { SideMenu } from './components/Dashboard/SideMenu';
import { DataFeed } from './components/Dashboard/DataFeed';

import './custom.css'
import 'antd/dist/antd.css';


import { NotificationsContext } from './components/Dashboard/NotificationsContext';



export default class App extends Component {
  static displayName = App.name;
  constructor(props) {
    super();

    this.redirect = this.redirect.bind(this);
    this.getUpdateCache = this.getUpdateCache.bind(this);
    this.sideMenu = this.sideMenu.bind(this);
    this.update = this.update.bind(this);

    this.state = {
      redirect: [],
      updateCache: false,
      update: true,
      sidemenu: null,
      toggleTab: false
    };
  }

  componentDidMount() {
    /*<Redirect to='/' />;*/
    this.setState({ sidemenu: <SideMenu {...this} /> });
    this.setState({ update: true });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.update) {
      this.setState({ update: false });
    }



  }

  update(update) {
    this.setState({ update: update });
  }


  redirect(key) {

    this.sideMenu(key);

    let redirect = [];
    switch (key) {
      case 9:
        redirect.push(<Redirect to='/DashboardOne' />);
        break;
      case 10:
        redirect.push(<Redirect to='/DashboardTwo' />);
        break;
      case 12:
        redirect.push(<Redirect to='/Scanner' />);
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
    this.setState({ update: true });
  }

  getUpdateCache(update) {
    this.setState({ updateCache: update });
  }

  sideMenu(key) {
    switch (key) {
      case 9:
        this.setState({
          sidemenu: <SideMenu {...this}
            style={{ position: 'absolute', minHeight: '1200px', width: '55px', height: '100vh', margin: 0, zIndex: '999' }}
          />
        });
        this.setState({ update: true });
        break;
      case 12:
        this.setState({
          sidemenu: <SideMenu {...this}

          />

        });
        this.setState({ update: true });
        break;
      case 13:
        this.setState({ sidemenu: <SideMenu {...this} /> });
        this.setState({ update: true });
        break;
      case 14:
        this.setState({ sidemenu: <SideMenu {...this} /> });
        this.setState({ update: true });
        break;
      default:
        break;
    }


  }




  showTab = () => {
    this.setState({ toggleTab: !this.state.toggleTab });
  }



  render() {

    const state = {
      toggleTab: false,
      showTab: this.showTab
    }
    /*
            <Route exact path='/' component={DashboardInterface} />
            <Route path='/counter' component={Counter} />
            <Route path='/fetch-data' component={FetchData} />
            <Route path='/DashboardOne' component={DashboardOne} />

             style={{ position: 'absolute', minHeight: '975px', width: '55px', height: '100vh', margin: 0, zIndex: '999' }}
     */

    return ( <div >
      {this.state.sidemenu}
      <DataFeed {...this} />
      {this.state.redirect}
     
      <NotificationsContext.Provider value={state}>
      
        <Switch>
          <Route exact path='/' component={() => <DashboardOne {...this} />} />
          <Route path='/DashboardOne' component={() => <DashboardOne {...this} />} />
          <Route path='/DashboardTwo' component={() => <DashboardTwo {...this} />} />
          <Route path='/HistoricalTable' component={() => <FilterTable {...this} />} />
          <Route path='/Portfolio' component={() => <PortFolio {...this} />} />
          <Route path='/Scanner' component={() => <Scanner {...this} />} />
        </Switch>

     </NotificationsContext.Provider>
     </div>
    );
  }
}
