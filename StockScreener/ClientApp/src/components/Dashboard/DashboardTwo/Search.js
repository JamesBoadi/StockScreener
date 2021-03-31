import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';

import {
    Box, Button, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    Input, InputGroup, InputRightElement, InputLeftElement,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption,
    MenuGroup, MenuOptionGroup, MenuIcon, MenuCommand, MenuDivider
} from '@chakra-ui/react';


//const [value, setValue] = useState('');
//const [options, setOptions] = useState([]);

export class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: false,
            options: []
        };
    }

    returnQuery = (stockName, id) => (// Not a function
        [
            { value: stockName.toString() },
            { id: "TV" }
        ]
    );

    onSearch = (query) => {

        // Search Query
        // const arr = await this.props.searchDatabase(query);

        // Return array of objects 

        this.setState({
            options:
                (!query ? [] : [this.returnQuery("gender ", 29)[0]])
        });
    };

    onChange = (data, option) => {
        setTimeout(() => {


            // set id here
            console.log('data ' + data + ' ' + option);
        }, 1000);
        //this.setState({ value: data });
    };

    render() {
        return (
            <>
                {/* Search Box */}
                <div class="stockTableTwoMenu" style={{
                                    position: 'absolute', left: '250px'}}>
                    <div class="dropdown" 
                    >
                        <InputGroup>
                            <Input
                                style={{
                                    position: 'absolute', top: '-15px',
                                    left: '-250px', height: '29px',
                                    minWidth: '12.25rem',
                                    width: '12.25rem',
                                    color: 'black'
                                }}

                                onInput={this.props.searchDatabase}
                                placeholder="Search "
                                value={this.props.state.selectedRecordValue}
                                onChange={() => this.props.setSelectedRecord("")}
                            />

                            <InputRightElement children={<img style={{top: '-15px', left: '-23px'}} id="searchIcon" />} />
                        </InputGroup>

                        {/* Drop down Menu */}
                        <div class="dropdown-content"
                         style={{
                            right: '55px', top: '0px'}}
                        >
                            <Box
                                min-width='12.25rem'
                                width='12.25rem'
                                height='12.25rem'
                                overflowY='auto'
                                bg='#f9f9f9'
                                top='0px'
                                backgroundColor='rgb(40,40,40)'>

                                {this.props.state.display}

                            </Box>
                        </div>
                    </div>
                </div>
            </>
        );

    }
}