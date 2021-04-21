import React, { Component, useState, useContext } from 'react';

import { Router, Route, Switch } from 'react-router';
import { Menu, Button } from 'antd';
import { Redirect } from "react-router-dom";
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SyncOutlined,
  NotificationOutlined,
  SettingOutlined,
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


  onMenuClick(e) {
    switch (e.key) {
      case "9":
        this.props.redirect(9);
        break;
      case "10":
        this.props.redirect(10);
        break;
      case "12":
        this.props.redirect(12);
        break;
      case "13":
        this.props.redirect(13);
        break;
      case "14":
        this.props.redirect(14);
        break;

      default:
        console.log("default " + e.key)
        break;
    }
  }

  render() {
    // switch
    return (

      <div>

        <div style={{ top: '0px', width: '25px', zIndex: '999' }}>
          {/*  <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
    </Button> */}

          <Menu
            style={{ position: 'absolute', minHeight: '1600px', width: '55px', height: '100vh', margin: 0, zIndex: '999' }}
            onClick={this.onMenuClick.bind(this)}
            mode="inline"
            theme="rgb(0.00,0.00,0.55)"
            inlineCollapsed={this.state.collapsed}
          >

            <SubMenu key="sub2" icon={<AppstoreOutlined />} title=" Menu">
              <Menu.Item key="9">Dashboard One</Menu.Item>
              <Menu.Item key="10">Dashboard Two</Menu.Item>
              <Menu.Item key="11">Dashboard Three</Menu.Item>
              <Menu.Item key="12">Screener</Menu.Item>
              <Menu.Item key="13">Historical Table</Menu.Item>
              <Menu.Item key="14">My Portfolio</Menu.Item>
            </SubMenu>

            <Menu.Item key="1" icon={<SyncOutlined />} onClick={() => this.props.redirect(1)}>
              Manual Refresh
          </Menu.Item>
            <Menu.Item key="2" icon={<NotificationOutlined />} onClick={this.props.showTab} >
              Notifications
          </Menu.Item>

            <Menu.Item key="3" icon={<SettingOutlined />}>
              Settings
          </Menu.Item>

          </Menu>
        </div>

      </div>
    );
  }
};

