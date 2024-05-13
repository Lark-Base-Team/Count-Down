import { bitable } from "@lark-base-open/js-sdk";
import { useLayoutEffect } from "react";

function updateTheme(theme: string) {
  document.documentElement.dataset['theme'] = theme === 'dark' ? 'dark' : 'light';
}

export function useTheme() {
  useLayoutEffect(() => {
    bitable.bridge.getTheme().then((theme: string) => {
      updateTheme(theme.toLocaleLowerCase())
    })

    bitable.bridge.onThemeChange((e) => {
      updateTheme(e.data.theme.toLocaleLowerCase())
    })
  }, [])
}