import './App.css';
import React from 'react';
import { dashboard } from "@lark-base-open/js-sdk";
import { Button, DatePicker } from '@douyinfe/semi-ui';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function App() {
    const [target, setTarget] = useState<number>(0);
    const initialTime = React.useMemo(() => {
        return Math.floor((target - Date.now()) / 1000);
    }, [target]);
    const url = new URL(window.location.href);
    const isConfig = !!url.searchParams.get('isConfig');

    React.useEffect(() => {
        dashboard.getConfig().then(res => {
            const { customConfig } = res;
            if (typeof customConfig?.target === 'number') {
                setTarget(customConfig.target);
            }
        });
    }, []);
    React.useEffect(() => {
        const offConfigChange = dashboard.onConfigChange(() => {
            dashboard.getConfig().then(res => {
                const { customConfig } = res;
                if (typeof customConfig?.target === 'number') {
                    setTarget(customConfig.target);
                }
            });
        });
        return () => {
            offConfigChange();
        }
    }, []);
    const onClick = React.useCallback(() => {
        // @ts-ignore
        dashboard.saveConfig({
            customConfig: {
                target,
            }
        })
    }, [target]);

    return (
        <main className="main" style={{
            display: 'flex',
        }}
        >
            <div className='content' style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontSize: 64,
                minWidth: 0,
            }}>
                <Countdown
                    key={target}
                    target={target}
                    initialTime={initialTime}
                />
            </div>
            {
                isConfig && (
                    <div style={{
                        width: '30%',
                        flex: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'column',
                    }}>
                        <div>
                            <p>修改日期和时间：</p>
                            <DatePicker
                                type="dateTime"
                                style={{
                                    width: '100%'
                                }}
                                onChange={(date) => {
                                    setTarget(+(date as Date));
                                }}
                            />
                        </div>
                        <Button
                            size="large"
                            type="primary"
                            onClick={onClick}
                        >
                            确定
                        </Button>
                    </div>
                )
            }
        </main>
    )
}

function Countdown({ initialTime, target }: { initialTime: number; target: number }) {
    const [time, setTime] = useState(initialTime);
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

    const formatTime = () => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time - hours * 3600) / 60);
        const seconds = time - hours * 3600 - minutes * 60;

        const formatNumber = (num: number) => (num < 10 ? `0${num}` : num);

        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    };



    if (time < 0) {
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
            <p style={{
                fontSize: 14
            }}>距离: {convertTimestamp(target)} 还有</p>
            {formatTime()}
        </div>
    );
}

function convertTimestamp(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return year + ":" + month + ":" + day + " " + hours + ":" + minutes + ":" + seconds;
}

