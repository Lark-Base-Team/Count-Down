import './App.css';
import React, { useLayoutEffect, useMemo } from 'react';
import { dashboard, bitable, DashboardState } from "@lark-base-open/js-sdk";
import { Button, DatePicker, ConfigProvider, Checkbox, Row, Col, Input } from '@douyinfe/semi-ui';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getTime } from './utils';
import './locales/i18n';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import { useConfig, useTheme } from './hooks';
import dayjs from 'dayjs';
import classnames from 'classnames'
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next/typescript/t';


interface ICountDownConfig {
    color: string;
    /** 毫秒级时间戳 */
    target: number;
    units: string[];
    othersConfig: string[],
    title: string,
}

const othersConfigKey: { key: string, title: string }[] = []

const defaultOthersConfig = ['showTitle']


const getAvailableUnits: (t: TFunction<"translation", undefined>) => { [p: string]: { title: string, unit: number, order: number } } = (t) => {
    return {
        sec: {
            title: t('second'),
            unit: 1,
            order: 1,
        },
        min: {
            title: t('minute'),
            unit: 60,
            order: 2,
        },
        hour: {
            title: t('hour'),
            unit: 60 * 60,
            order: 3,
        },
        day: {
            title: t('day'),
            unit: 60 * 60 * 24,
            order: 4,
        },
        week: {
            title: t('week'),
            unit: 60 * 60 * 24 * 7,
            order: 5,
        },
        month: {
            title: t('month'),
            unit: 60 * 60 * 24 * 30,
            order: 6,
        },
    }

}

const defaultUnits = ['sec', 'min', 'hour', 'day']


export default function App() {
    const { t, i18n } = useTranslation();

    useTheme();

    const [title, setTitle] = useState('');

    // 配置
    const [config, setConfig] = useState<ICountDownConfig>({
        target: new Date().getTime(),
        color: '#373C43',
        units: defaultUnits,
        title: '',
        othersConfig: defaultOthersConfig
    })

    const availableUnits = useMemo(() => getAvailableUnits(t), [i18n.language])

    const isCreate = dashboard.state === DashboardState.Create
    /** 是否配置/创建模式下 */
    const isConfig = dashboard.state === DashboardState.Config || isCreate;

    const onUnitChange = (checkedValues: string[]) => {
        setConfig({
            ...config,
            units: checkedValues,
        })
    };


    /** 配置用户配置 */
    const updateConfig = (res: any) => {
        const { customConfig } = res;
        if (customConfig) {
            setConfig(customConfig as any)
            setTimeout(() => {
                // 预留3s给浏览器进行渲染，3s后告知服务端可以进行截图了
                dashboard.setRendered();
            }, 3000);
        }

    }

    useConfig(updateConfig)

    /**保存配置 */
    const onSaveConfig = () => {
        dashboard.saveConfig({
            customConfig: config,
            dataConditions: [],
        } as any)
    }

    useLayoutEffect(() => {
        if (!config?.title) {
            setTitle(t('target.remain'));
        } else {
            setTitle(config.title)
        }
    }, [config?.title, t])

    return (
        <main className={classnames({
            'main-config': isConfig,
            'main': true,
        })}>
            <div className='content'>
                <Countdown
                    targetStr={title}
                    t={t}
                    availableUnits={availableUnits}
                    key={config.target}
                    config={config}
                    isConfig={isConfig}
                />
            </div>
            {
                isConfig && (
                    <div className='config-panel'>
                        <div className='form'>
                            <Item label={t('label.set.target')}>
                                <DatePicker
                                    value={config.target}
                                    type='dateTime'
                                    onChange={(date: any) => {
                                        setConfig({
                                            ...config,
                                            target: new Date(date).getTime(),
                                        })
                                    }}
                                />
                            </Item>

                            <Item label={t('label.display.time')}>
                                <Input
                                    value={title}
                                    onChange={(v) => setTitle(v)}
                                    onBlur={(e) => {
                                        setConfig({
                                            ...config,
                                            title: e.target.value,
                                        })
                                    }} />
                            </Item>

                            {othersConfigKey.length ? <Item label={''}>
                                <Checkbox.Group value={config.othersConfig} style={{ width: '100%' }} onChange={(v) => {
                                    setConfig({
                                        ...config,
                                        othersConfig: v.slice(),
                                    })
                                }}>
                                    <Row className='checkbox-group'>
                                        {othersConfigKey.map((v) => (
                                            <Col key={v.key} span={12}>
                                                <Checkbox value={v.key}>{v.title}</Checkbox>
                                            </Col>))}
                                    </Row>
                                </Checkbox.Group>
                            </Item> : null}

                            <Item label={t('label.unit')}>
                                <Checkbox.Group value={config.units} style={{ width: '100%' }} onChange={onUnitChange}>
                                    <Row className='checkbox-group'>
                                        {Object.keys(availableUnits).sort((a, b) => availableUnits[b].order - availableUnits[a].order).map((v) => (
                                            <Col key={v} span={12}>
                                                <Checkbox value={v}>{availableUnits[v].title}</Checkbox>
                                            </Col>))}
                                    </Row>
                                </Checkbox.Group>
                            </Item>

                            <Item label={t("label.color")}>
                                <Input type='color' value={config.color} onChange={(v) => {
                                    setConfig({
                                        ...config,
                                        color: v,
                                    })
                                }} />
                            </Item>

                        </div>

                        <Button
                            className='btn'
                            theme='solid'
                            onClick={onSaveConfig}
                        >
                            {t('confirm')}
                        </Button>
                    </div>
                )
            }
        </main>
    )
}


interface ICountdown {
    config: ICountDownConfig,
    isConfig: boolean,
    /** 一个包含{time}的字符串 */
    targetStr: string,
    t: TFunction<"translation", undefined>,
    availableUnits: ReturnType<typeof getAvailableUnits>
}
function Countdown({ config, isConfig, availableUnits, t, targetStr }: ICountdown) {
    const { units, target, color } = config
    const [time, setTime] = useState(target ?? 0);
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(time => {
                return time - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const timeCount = getTime({ target: target, units: units.map((v) => availableUnits[v]) })

    if (time <= 0) {
        return (
            <div style={{
                fontSize: 26
            }}>
                {t('please.config')}
            </div>
        )
    }

    return (
        <div style={{ width: '100vw', textAlign: 'center', overflow: 'hidden' }}>

            {config.othersConfig.includes('showTitle') ? <p className={classnames('count-down-title', {
                'count-down-title-config': isConfig
            })}>
                {targetStr.replaceAll(/\{\{\s*time\s*\}\}/g, convertTimestamp(target * 1000))}
            </p> : null}
            <div className='number-container' style={{ color }}>
                {timeCount.units.sort((a, b) => b.unit - a.unit).map(({ count, title }) => {
                    return <div key={title}>
                        <div className='number'>{count}</div>
                        <div className='number-title'>{title} </div>
                    </div>
                })}
            </div>

        </div>
    );
}

function convertTimestamp(timestamp: number) {
    return dayjs(timestamp / 1000).format('YYYY-MM-DD HH:mm:ss')
}


function Item(props: {
    label?: React.ReactElement | string;
    children?: React.ReactElement;
}) {

    if (!props.children && !props.label) {
        return null
    }

    return <div className='form-item'>
        {props.label ? <div className='label'>{props.label}</div> : null}
        {props.children ? <div>{props.children}</div> : null}
    </div>
}