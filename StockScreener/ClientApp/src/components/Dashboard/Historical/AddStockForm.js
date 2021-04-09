import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    Checkbox,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    AutoComplete
} from 'antd';
import { Search } from './Search';

export class AddStockForm extends Component {
    constructor(props) {
        super(props);


    }

    onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }

    render() {
        const plainOptions = ['Apple', 'Pear', 'Orange'];
        const options = [
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange' },
        ];
        const optionsWithDisabled = [
            { label: 'AppleJellyTimePinnaple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange', disabled: false },
        ];

        return (
            <>
                <div visibility={
                    this.props.state.formIsVisible}>

                    <Form>
                        <div style={{transform: "translateY(60px)"}}>
                        <Checkbox.Group options={plainOptions} defaultValue={['Apple']} onChange={this.onChange} />
                        <br />
                        <br />
                        <Checkbox.Group options={options} defaultValue={['Pear']} onChange={this.onChange} />
                        <br />
                        <br />
                        
                        <Checkbox.Group
                            options={optionsWithDisabled}
                            disabled
                            defaultValue={['Apple']}
                            onChange={this.onChange}
                        />

                        <Button style={{
                            position: 'absolute', bottom: '4px', right: '20px',
                            zIndex: '999'
                        }}
                            onClick={this.props.addPortfolioTableRow}
                            visibility={
                                this.props.state.formIsVisible
                            }
                        >Add Stock</Button>
                        </div>
                    </Form>
                </div>

            </>
        );
    }
}