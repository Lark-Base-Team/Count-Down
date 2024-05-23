import { ReactElement, useEffect, useState } from "react"
import { bitable } from "@lark-base-open/js-sdk"
import './style.css'
import '../../locales/i18n';
import { LocaleProvider } from '@douyinfe/semi-ui';
import dayjs from 'dayjs';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';
// import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
// import ko_KR from '@douyinfe/semi-ui/lib/es/locale/source/ko_KR';
import ja_JP from '@douyinfe/semi-ui/lib/es/locale/source/ja_JP';
// import vi_VN from '@douyinfe/semi-ui/lib/es/locale/source/vi_VN';
// import ru_RU from '@douyinfe/semi-ui/lib/es/locale/source/ru_RU';
// import id_ID from '@douyinfe/semi-ui/lib/es/locale/source/id_ID';
// import ms_MY from '@douyinfe/semi-ui/lib/es/locale/source/ms_MY';
// import th_TH from '@douyinfe/semi-ui/lib/es/locale/source/th_TH';
// import tr_TR from '@douyinfe/semi-ui/lib/es/locale/source/tr_TR';
// import pt_BR from '@douyinfe/semi-ui/lib/es/locale/source/pt_BR';
// import zh_TW from '@douyinfe/semi-ui/lib/es/locale/source/zh_TW';
// import sv_SE from '@douyinfe/semi-ui/lib/es/locale/source/sv_SE';
// import pl_PL from '@douyinfe/semi-ui/lib/es/locale/source/pl_PL';
// import nl_NL from '@douyinfe/semi-ui/lib/es/locale/source/nl_NL';
// import ar from '@douyinfe/semi-ui/lib/es/locale/source/ar';
// import es from '@douyinfe/semi-ui/lib/es/locale/source/es';
// import it from '@douyinfe/semi-ui/lib/es/locale/source/it';
// import de from '@douyinfe/semi-ui/lib/es/locale/source/de';
// import fr from '@douyinfe/semi-ui/lib/es/locale/source/fr';
// import ro from '@douyinfe/semi-ui/lib/es/locale/source/ro';

dayjs.locale('en-us');

export default function LoadApp(props: { children: ReactElement }): ReactElement {
  const [locale, setLocale] = useState(en_US);

  useEffect(() => {
    bitable.bridge.getLanguage().then((v) => {
      if (v === 'zh') {
        setLocale(zh_CN);
        dayjs.locale('zh-cn');
      }

      if (v === 'ja') {
        setLocale(ja_JP);
      }

    }).catch((e) => {
      console.error(e);
    })
  }, [])

  return <div>
    <LocaleProvider locale={locale}>
      {props.children}
    </LocaleProvider>
  </div>
}

