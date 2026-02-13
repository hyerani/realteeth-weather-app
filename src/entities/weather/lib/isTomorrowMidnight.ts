/**
 * 시간대별 예보가 "내일"인지 판별
 *
 * @param hourTimestamp
 * @param baseTimestamp
 * @returns 내일 자정이면 true
 */
export const isTomorrowMidnight = (hourTimestamp: number, baseTimestamp: number): boolean => {
  const hourDate = new Date(hourTimestamp * 1000)
  const baseDate = new Date(baseTimestamp * 1000)

  return hourDate.getHours() === 0 && hourDate.getDate() !== baseDate.getDate()
}
