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

    performanceStocksSettings(checkedValues)
    {
        this.props.setPerformanceStocksSettings(checkedValues);
    }

    macdStocksSettings(checkedValues) {
        this.props.setMacdStocksSettings(checkedValues);
    }
    
    bollingerBandSettings(checkedValues) {
        this.props.setBollingerBandSettings(checkedValues);
    }

    render() {
        const performanceOptions = [
            { label: 'High Momentum', value: 'High Momentum' },
            { label: 'Low Momentum', value: 'Low Momentum' },
            { label: 'Growth Stocks', value: 'Growth Stocks' },  // Link to volume
            { label: 'Shorted Stocks', value: 'Shorted Stocks' },
        ];

        const macdOptions = [
            { label: 'Golden Cross', value: 'Golden Cross' },
            { label: 'MACD', value: 'MACD' },
            // Add custom MACD checkbox
        ];

        const bandsOptions = [
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
                            <Checkbox.Group macdOptions={performanceOptions} onChange={this.performanceStocksSettings} />
                            <br />
                            <br />
                            <p>Moving Average Convergence/Divergence</p>
                            <Checkbox.Group macdOptions={macdOptions} onChange={this.macdStocksSettings} />

                            <br />
                            <br />
                            <p>Bollinger Bands</p>
                            <Checkbox.Group
                                macdOptions={bandsOptions}
                                onChange={this.bollingerBandSettings}
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
                                onClick={this.props.applyChanges}
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