/**
 * birthDate(YYYYMM 형식)을 받아서 현재 시간과 비교하여 나이를 계산하는 함수
 * @param birthDate - YYYYMM 형식의 생년월일 (예: "202509")
 * @returns 나이 문자열 (예: "2세", "4개월")
 */
export function calculateAge(birthDate: string | null | undefined): string {
  if (!birthDate) {
    return "나이 정보 없음";
  }

  // YYYYMM 형식 검증
  if (birthDate.length !== 6) {
    return "나이 정보 없음";
  }

  const year = parseInt(birthDate.substring(0, 4));
  const month = parseInt(birthDate.substring(4, 6));

  // 유효한 연월인지 검증
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return "나이 정보 없음";
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth()는 0부터 시작

  // 년도 차이 계산
  let ageYears = currentYear - year;

  // 월 차이를 고려하여 조정
  let ageMonths = currentMonth - month;

  if (ageMonths < 0) {
    ageYears -= 1;
    ageMonths += 12;
  }

  // 1세 이상이면 "N세"로 표시
  if (ageYears >= 1) {
    return `${ageYears}세`;
  }

  // 1세 미만이면 "N개월"로 표시
  if (ageMonths === 0) {
    return "신생아";
  }

  return `${ageMonths}개월`;
}