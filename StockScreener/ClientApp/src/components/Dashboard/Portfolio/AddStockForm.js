import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    Dropdown,
    TreeSelect,
    Switch,
    AutoComplete
} from 'antd';
import { Search } from './Search';

export class AddStockForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style =
        {
            visibility: (this.props.state.addStockFormVisible) ? "visible" : "hidden",
            zIndex: '999'
        };

        const form = <Form
            style={{ transform: "translate(10px, 60px)", zIndex: '999' }}

            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 14,
            }}
            layout="horizontal"
            initialValues={{
                size: this.props.state.componentSize,
            }}
            onValuesChange={this.props.onFormLayoutChange}
            size={this.props.state.componentSize}
        >
            <Form.Item label="Select"
                hidden={!this.props.state.addStockFormVisible}
            > {/* Search Content */}
                <Search {...this.props} />
            </Form.Item>
            <Form.Item label="Date"
                hidden={!this.props.state.addStockFormVisible}>
                <DatePicker onChange={this.props.setDate} />
            </Form.Item>
            <Form.Item label="Shares"
                hidden={!this.props.state.addStockFormVisible}>
                <InputNumber
                    min={0}
                    defaultValue={0}
                    onChange={this.props.setShares} />
            </Form.Item>
            <Form.Item label="Price"
                hidden={!this.props.state.addStockFormVisible}>
                <InputNumber
                    min={0}
                    step={0.25}
                    defaultValue={0}
                    onChange={this.props.setPrice} />
            </Form.Item>
        </Form>;

        return (
            <>
                <div 
                class="addStockForm"
                style={style}>
                    <h4 style={{ position: 'absolute', color: 'black' }}>Add Stock </h4>
                    <p style={{
                        position: 'absolute', color: 'black', fontWeight: 'bold',
                        fontSize: '15px', top: '5px', right: '20px', cursor: 'pointer',
                        zIndex: '999'
                    }}
                        onClick={() => {
                            this.props.setShares(null);
                            this.props.setPrice(null)
                            this.props.setDate(null);
                            this.props.updateForm(true);
                            this.props.setAddFormVisibility(false)}}>Close</p>

                    {form}

                    <button style={{
                        position: 'absolute', bottom: '4px', right: '20px',
                        zIndex: '999'
                    }}
                        onClick={() =>{ 
                          

                            this.props.addPortfolioTableRow()
                        }}
                        visibility={!this.props.state.addStockFormVisible}
                    > Add Stock </button>
                </div>
            </>
        );
    }
}