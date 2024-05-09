import './App.css';
import React from 'react';
import { dashboard, bitable, DashboardState } from "@lark-base-open/js-sdk";
import { Button, DatePicker, ConfigProvider, Checkbox, Row, Col, GetProp, ColorPicker } from 'antd';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getTime } from './utils';
import dayjs from 'dayjs';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import classnames from 'classnames'

interface ICountDownConfig {
    color: string;
    target: number;
    units: string[];
    othersConfig: string[],
}

const othersConfigKey = [{
    key: 'showTitle',
    title: '展示标题',
}]

const defaultOthersConfig = ['showTitle']

import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

dayjs.locale('zh-cn');

const availableUnits: { [p: string]: { title: string, unit: number, order: number } } = {
    sec: {
        title: '秒',
        unit: 1,
        order: 1,
    },
    min: {
        title: '分',
        unit: 60,
        order: 2,
    },
    hour: {
        title: '小时',
        unit: 60 * 60,
        order: 3,
    },
    day: {
        title: '天',
        unit: 60 * 60 * 24,
        order: 4,
    },
    week: {
        title: '周',
        unit: 60 * 60 * 24 * 7,
        order: 5,
    },
    month: {
        title: '月',
        unit: 60 * 60 * 24 * 30,
        order: 6,
    },
}

const defaultUnits = ['sec', 'min', 'hour', 'day']


export default function App() {

    const [locale, setLocale] = useState(zhCN);

    const [config, setConfig] = useState<ICountDownConfig>({
        target: dayjs().unix(),
        color: '#373C43',
        units: defaultUnits,
        othersConfig: defaultOthersConfig
    })

    const url = new URL(window.location.href);
    /** 是否配置模式下 */
    const isConfig = dashboard.state === DashboardState.Config
        || !!url.searchParams.get('isConfig') || dashboard.state === DashboardState.Create;


    const onUnitChange = (checkedValues: string[]) => {
        setConfig({
            ...config,
            units: checkedValues,
        })
    };
    const changeLang = (lang: 'en-us' | 'zh-cn') => {
        if (lang === 'zh-cn') {
            setLocale(zhCN);
            dayjs.locale('zh-cn');
        } else {
            setLocale(enUS);
            dayjs.locale('en-ud');
        }
    }

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

    React.useEffect(() => {
        // 初始化获取配置
        dashboard.getConfig().then(updateConfig);
    }, []);


    React.useEffect(() => {
        const offConfigChange = dashboard.onConfigChange((r) => {
            // 监听配置变化，协同修改配置
            updateConfig(r.data);
        });
        return () => {
            offConfigChange();
        }
    }, []);

    const onClick = () => {
        // 保存配置
        dashboard.saveConfig({
            customConfig: config
        } as any)
    }

    return (
        <main className={classnames({
            'main-config': isConfig,
            'main': true,
        })}>

            <ConfigProvider locale={locale}>

                <div className='content'>
                    <Countdown
                        key={config.target}
                        config={config}
                        initialTime={0}
                        isConfig={isConfig}
                    />
                </div>
                {
                    isConfig && (
                        <div className='config-panel'>
                            <div className='form'>
                                <div className='form-item'>
                                    <div className='label'>修改日期和时间：</div>
                                    <DatePicker
                                        showTime
                                        value={dayjs.unix(config.target)}
                                        onChange={(date) => {
                                            setConfig({
                                                ...config,
                                                target: date.unix(),
                                            })
                                        }}
                                    />
                                </div>


                                <div className='form-item'>
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
                                </div>
                                <div className='form-item'>
                                    <div className='label'>单位</div>
                                    <Checkbox.Group value={config.units} style={{ width: '100%' }} onChange={onUnitChange}>
                                        <Row className='checkbox-group'>
                                            {Object.keys(availableUnits).sort((a, b) => availableUnits[b].order - availableUnits[a].order).map((v) => (
                                                <Col key={v} span={12}>
                                                    <Checkbox value={v}>{availableUnits[v].title}</Checkbox>
                                                </Col>))}
                                        </Row>
                                    </Checkbox.Group>

                                </div>

                                <div className='form-item'>
                                    <div className='label'>颜色</div>
                                    <ColorPicker value={config.color} onChange={(v) => {
                                        setConfig({
                                            ...config,
                                            color: v.toHexString(),
                                        })
                                    }} />
                                </div>

                            </div>

                            <Button
                                className='btn'
                                size="middle"
                                type="primary"
                                onClick={onClick}
                            >
                                确定
                            </Button>
                        </div>
                    )
                }
            </ConfigProvider>

        </main>
    )
}



function Countdown({ config, initialTime, isConfig }: { config: ICountDownConfig, initialTime: number, isConfig: boolean }) {
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
                请点击右上角配置时间
            </div>
        )
    }

    return (
        <div style={{ width: '100vw', textAlign: 'center', overflow: 'hidden' }}>

            {config.othersConfig.includes('showTitle') ? <p className={classnames('count-down-title', {
                'count-down-title-config': isConfig
            })}>
                距离: {convertTimestamp(target * 1000)} 还有
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
    const date = new Date(timestamp);
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

