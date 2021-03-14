import React from 'react';
import { DashboardNavbar } from './DashboardNavbar';

export const DashboardNavbarHOC = Component => {
  return props => {
    const dashboardNavbar = DashboardNavbar();

    return <Component width={dashboardNavbar} {...props} />;
  };
};