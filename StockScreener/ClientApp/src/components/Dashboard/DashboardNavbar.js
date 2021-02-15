import React, { Component, useState, useContext } from 'react';
import { Box, Select } from '@chakra-ui/react';

export const DashboardNavbar = props => {

    let selectMarket = <select name="fruit">
        <option value="none">Nothing</option>
        <option value="guava">Guava</option>
        <option value="lychee">Lychee</option>
        <option value="papaya">Papaya</option>
        <option value="watermelon">Watermelon</option>
    </select>;

    // Return NavBar
    return (
        <div class="DashboardNavbar">
            <Box
                style={{ position: 'absolute', top: '80px', left: '60px', zIndex: -999 }}
                bg='rgb(40,40,40)'
                boxShadow='sm'
                textAlign='center'
                height='11rem'
                width='115rem'
                rounded="lg"
                borderWidth="1px"
            >

                {selectMarket}




            </Box>
        </div>
    );
};

