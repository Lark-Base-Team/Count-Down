export interface ICountProps {
  target: number;
  units: {
    /** 1个单位的秒数 */
    unit: number;
    [p: string]: any;
  }[]
}

export interface ICountReturn {
  /** 按照unit从大到小排序 */
  units: {
    /** 1个单位的秒数 */
    unit: number;
    /** target除unit后剩余的整数部分  */
    count: number;
    [p: string]: any;
  }[]
}

export function getTime({ target, units }: ICountProps): ICountReturn {

  const restTime = Math.floor((target - new Date().getTime()) / 1000);

  if (restTime < 0) {
    return {
      units: units.map((v) => ({ ...v, count: 0 }))
    }
  }

  const sortedUnits = units.map((v) => ({ ...v })).sort((a, b) => b.unit - a.unit);

  sortedUnits.reduce((pre: number, current) => {
    current.count = Math.floor(pre / current.unit);

    return pre % current.unit

  }, restTime);

  return { units: sortedUnits } as ICountReturn;

}
