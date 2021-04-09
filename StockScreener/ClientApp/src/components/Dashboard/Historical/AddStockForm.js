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
        const plainOptions = [
            { label: 'High Momentum', value: 'High Momentum' },
            { label: 'Low Momentum', value: 'Low Momentum' },
            { label: 'Growth Stocks', value: 'Growth Stocks' },  // Link to volume
            { label: 'Shorted Stocks', value: 'Shorted Stocks' },
        ];

        const options = [
            { label: 'Golden Cross', value: 'Golden Cross' },
            { label: 'Custom MACD', value: 'MACD' },
        ];

        const optionsWithDisabled = [
            { label: 'UpperBand', value: 'UpperBand' },
            { label: 'MiddleBand', value: 'MiddleBand' },
            { label: 'LowerBand', value: 'LowerBand' }
        ];

        return (
            <>
                <div visibility={
                    this.props.state.formIsVisible}>

                    <Form>
                        <div style={{ transform: "translateY(60px)" }}>
                            <p>Performance Stocks</p>
                            <Checkbox.Group options={plainOptions} onChange={this.onChange} />
                            <br />
                            <br />
                            <p>Moving Average Convergence/Divergence</p>
                            <Checkbox.Group options={options} onChange={this.onChange} />

                            <br />
                            <br />
                            <p>Bollinger Bands</p>
                            <Checkbox.Group
                                options={optionsWithDisabled}
                                onChange={this.onChange}
                            />
                            <br />
                            <br />

                            <Checkbox
                                style={{ position: 'absolute', top: '211.5px', right: '90px'}}
                            >
                                Apply to All
                            </Checkbox>

                            <Button style={{
                                position: 'absolute', bottom: '4px', right: '20px',
                                zIndex: '999'
                            }}
                                onClick={this.props.addPortfolioTableRow}
                                visibility={
                                    this.props.state.formIsVisible
                                }
                            >Apply</Button>
                        </div>
                    </Form>
                </div>

            </>
        );
    }
}