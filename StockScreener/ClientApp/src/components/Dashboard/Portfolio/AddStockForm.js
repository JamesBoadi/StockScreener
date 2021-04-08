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
        return (
            <>
                <div visibility={
                    this.props.state.formIsVisible}>
                    <Form
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
                        <Form.Item label="Select"> {/* Search Content */}
                            <Search {...this.props} />
                        </Form.Item>
                        <Form.Item label="Date">
                            <DatePicker onChange={this.props.setDate} />
                        </Form.Item>
                        <Form.Item label="Shares">
                            <InputNumber
                                min={0}
                                defaultValue={0}
                                onChange={this.props.setShares} />
                        </Form.Item>
                        <Form.Item label="Price">
                            <InputNumber
                                min={0}
                                step={0.25}
                                defaultValue={0}
                                onChange={this.props.setPrice} />
                        </Form.Item>

                        <Button style={{
                            position: 'absolute', bottom: '4px', right: '20px',
                            zIndex: '999'
                        }}
                            onClick={this.props.addPortfolioTableRow}
                            visibility={
                                this.props.state.formIsVisible
                            }
                        >Add Stock</Button>
                    </Form>
                </div>

            </>
        );
    }
}