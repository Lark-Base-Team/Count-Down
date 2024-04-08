import React, { useState, useRef, useEffect } from 'react';
import { IData, IDataCondition, dashboard, bitable, IConfig, SourceType, FilterOperator, GroupMode, DATA_SOURCE_SORT_TYPE, FilterConjunction, FieldType } from "@lark-base-open/js-sdk";
import { Button, Form, Select, Space } from '@douyinfe/semi-ui';
import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface';
import { useSearchParams } from 'react-router-dom';

export default function Chart() {
    const api = useRef<BaseFormApi>();
    const [searchParams] = useSearchParams();
    const isConfig = searchParams.get('isConfig');
    const [state, setState] = useState<IData>();
    const [dataSources, setDataSources] = useState<{ name: string; id: string }[]>([]);
    const [fieldList, setFieldList] = useState<{ name: string; id: string }[]>([]);

    // 初始化配置页
    useEffect(() => {
        const init = async () => {
            if (isConfig && api.current?.setValues) {
                const config = await dashboard.getConfig();
                console.log("🚀 ~ dashboard.getConfig ~ config:", config)
                if (Array.isArray(config.dataConditions) && config.dataConditions?.[0]) {
                    const dataCondition = config.dataConditions?.[0];
                    const table = await bitable.base.getTableById(dataCondition.tableId);
                    const fieldList = await table.getFieldList();
                    const fieldOptionList = await Promise.all(
                        fieldList.map(async field => {
                            const name = await field.getName();
                            const id = field.id;
                            return {
                                name,
                                id,
                                type: await field.getType(),
                            }
                        })
                    );
                    console.log("🚀 ~ table.getFieldList ~ fieldList:", fieldOptionList)
                    setFieldList(fieldOptionList);
                    const condition = dataCondition.dataRange?.filterInfo?.conditions?.[0];
                    // 已经有配置的情况
                    if (condition && condition.fieldId) {
                        const values = {
                            dataSource: dataCondition.tableId,
                            fieldId: condition.fieldId,
                            operator: condition.operator,
                            value: condition.value,
                        };
                        console.log("🚀 ~ table.getFieldList ~ values:", values)
                        api.current?.setValues(values);
                    } else {
                        const firstTextField = fieldOptionList.find(field => field.name === '文本');
                        api.current?.setValues({
                            dataSource: dataCondition.tableId,
                            fieldId: firstTextField?.id,
                            operator: FilterOperator.Is,
                        });
                    }
                }
            }
        }
        init();
    }, [isConfig]);

    React.useEffect(() => {
        dashboard.onConfigChange(config => {
            console.log("🚀 ~ dashboard.onConfigChange ~ config:", config)
        });
        dashboard.getConfig().then(config => {
            console.log("🚀 ~ dashboard.getConfig ~ config:", config)
        })
        dashboard.getData().then(data => {
            console.log("🚀 ~ dashboard.getData ~ data:", data)
            setState(data);
        }).catch(e => {
            console.log("🚀 ~ dashboard.getData ~ e:", e)
        })
        dashboard.onDataChange(data => {
            console.log("🚀 ~ React.useEffect ~onDataChange  data:", data)
            setState(data.data);
        })
        const fetchDataSources = async () => {
            const tableList = await bitable.base.getTableList();
            const tables = await Promise.all(
                tableList.map(async table => {
                    const name = await table.getName();
                    const id = table.id;
                    return {
                        name,
                        id,
                    };
                })
            );
            console.log("🚀 ~ fetchDataSources ~ tables:", tables)
            setDataSources(tables);
        }
        fetchDataSources();
        bitable.base.getTableList().then(tableList => {
            console.log("🚀 ~ bitable.base.getTableList ~ tableList:", tableList)
            tableList.map(table => table.getName());
        })
    }, []);

    const onSubmit = React.useCallback((values: any) => {
        console.log("🚀 ~ onSubmit ~ values:", values)
        const dataConditions = createConfigByValues(values);
        dashboard.saveConfig({
            // @ts-ignore
            dataConditions,
        }).then(configResult => {
            console.log("🚀 ~ onSubmit ~ configResult:", configResult)
        })
    }, [])
    const preview = React.useCallback((formState: any) => {
        console.log("🚀 ~ preview ~ formState:", formState)
        const values = api.current?.getValues();
        console.log("🚀 ~ preview ~ values:", values)
        const preview = async () => {
            try {
                const dataConditions = createConfigByValues(values);
                console.log("🚀 ~ preview ~ dataConditions:", dataConditions)
                // @ts-ignore
                const previewData = await dashboard.getPreviewData(dataConditions);
                setState(previewData);
            } catch (e) {
                console.error(e);
            }
        }
        preview()
    }, [])

    return (
        <main
            style={{
                display: 'flex',
            }}
        >
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    minWidth: 0,
                }}
            >
                {state ? JSON.stringify(state, undefined, 2) : 'loading...'}
            </div>
            {
                isConfig && (
                    <div
                        style={{
                            width: '40%',
                            flex: 'none',
                        }}
                    >
                        <Form
                            layout="vertical"
                            onSubmit={onSubmit}
                            getFormApi={formApi => api.current = formApi}
                            initValues={{
                                operator: 'is',
                            }}
                            onChange={preview}
                            style={{
                                height: '100%',
                                position: 'relative',
                            }}
                        >
                            <Form.Select
                                field='dataSource'
                                label={{
                                    text: '数据源'
                                }}
                            >
                                {
                                    dataSources.map(dataSource => {
                                        return (
                                            <Select.Option key={dataSource.id} value={dataSource.id}>{dataSource.name}</Select.Option>
                                        )
                                    })
                                }
                            </Form.Select>
                            {/* <Form.Select
                                field='dataRange'
                                label={{
                                    text: '数据范围'
                                }}
                            >
                                <Select.Option value="CUSTOM">全部数据</Select.Option>
                            </Form.Select> */}
                            <Form.InputGroup label={{ text: '筛选数据' }}>
                                <Form.Select style={{ width: 100, marginRight: 4 }} field='fieldId'>
                                    {
                                        fieldList.map(field => {
                                            return (
                                                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                                            )
                                        })
                                    }
                                </Form.Select>
                                <Form.Select style={{ width: 80, marginRight: 4 }} field='operator'>
                                    <Select.Option value="is">等于</Select.Option>
                                </Form.Select>
                                <br />
                                <Form.Input field='value' style={{ marginTop: 4, width: '100%' }}></Form.Input>
                            </Form.InputGroup>
                            <Button
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                }}
                                htmlType="submit"
                                size="large"
                                type="primary"
                            >
                                确定
                            </Button>
                        </Form>
                    </div>
                )
            }
        </main>
    )
}

function createConfigByValues(values: any) {
    return [
        {
            tableId: values.dataSource,
            series: 'COUNTA',
            groups: [
                {
                    fieldId: values.fieldId,
                    mode: GroupMode.INTEGRATED,
                    sort: {
                        sortType: DATA_SOURCE_SORT_TYPE.GROUP,
                    }
                }
            ],
            dataRange: {
                type: SourceType.CUSTOM, // 看着应该是 CUSTOM
                filterInfo: {
                    conjunction: FilterConjunction.And,
                    conditions: [
                        {
                            fieldId: values.fieldId,
                            value: values.value,
                            operator: FilterOperator.Is,
                            fieldType: 1,
                        }
                    ]
                }
            },
        }
    ]
}