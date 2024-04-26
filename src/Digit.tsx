import React from 'react';
import { Button, Input } from '@douyinfe/semi-ui';
import { dashboard } from "@lark-base-open/js-sdk";

export default function Digit() {
    const url = new URL(window.location.href);
    const isConfig = !!url.searchParams.get('isConfig');
    const [state, setState] = React.useState('');
    React.useEffect(() => {
        // @ts-ignore
        window['__dashboard'] = dashboard;
        dashboard.getConfig().then(config => {
            console.log("🚀 ~ dashboard.getConfig ~ config:", config)
            setState(config.customConfig?.number as string)
        })
        const offConfig = dashboard.onConfigChange((config) => {
            console.log("🚀 ~ dashboard.onConfigChange ~ window.location.href:", window.location.href, config.data.customConfig?.number)
            setState(config.data.customConfig?.number as string)
        });
        return () => {
            offConfig();
        }
    }, []);

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
                    fontSize: 64,
                    minWidth: 0,
                }}
            >
                {state}
            </div>
            {
                isConfig && (
                    <div
                        style={{
                            width: '30%',
                            flex: 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexDirection: 'column',
                        }}
                    >
                        <Input onChange={value => setState(value)} value ={state}></Input>
                        <Button onClick={() => {
                            // @ts-ignore
                            dashboard.saveConfig({
                                customConfig: {
                                    number: state,
                                  }
                            })
                        }}>保存</Button>
                    </div>
                )
            }
        </main>
    )
}