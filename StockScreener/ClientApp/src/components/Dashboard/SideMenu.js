import React, { Component, useState, useContext } from 'react';

import { Router, Route, Switch } from 'react-router';
import { Menu, Button } from 'antd';
import { Redirect } from "react-router-dom";
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;

export class SideMenu extends Component {
  constructor(props) {
    super();
    this.state = {
      collapsed: 5000,
    };
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };



  render() {

  
    // switch
    return (

      <div>

       {/*  <Route path='/PortFolio' component={Portfolio} />
          <Route path='/fetch-data' component={FetchData}
          
  RedirectToPortFolio = () => {
     <Redirect to='/PortFolio' />;
  };

          />

      Navigation Menu */}
        <div style={{ top: '0px', width: '25px', zIndex: '999' }}>
          {/*  <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
    </Button> */}

          <Menu
            style={{ position: 'absolute', minHeight: '1600px', width: '55px', height: '100vh', margin: 0, zIndex: '999' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="rgb(0.00,0.00,0.55)"
            inlineCollapsed={this.state.collapsed}
          >
            <Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => this.props.redirect(1)}>
              Option 1
          </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              Option 2
          </Menu.Item>
            <Menu.Item key="3" icon={<ContainerOutlined />}>
              Option 3
          </Menu.Item>
            <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>


        </div>

      </div>
    );
  }
};

