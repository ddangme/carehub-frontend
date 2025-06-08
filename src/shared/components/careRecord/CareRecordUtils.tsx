// src/shared/components/careRecord/CareRecordUtils.tsx
import { parseISO } from 'date-fns';
import { CareRecordResponse, CareRecordType, recordTypeColorMap } from '@/api/careRecordApi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// 아이콘 매핑
const iconMap = {
  FEEDING: RestaurantIcon,
  SLEEP: BedtimeIcon,
  DIAPER: ChildCareIcon,
  HEALTH: HealthAndSafetyIcon,
  ACTIVITY: SportsEsportsIcon,
  OTHER: MoreHorizIcon
};

// 아이콘 컴포넌트 가져오기
export const getCareRecordIcon = (type: CareRecordType) => {
  const IconComponent = iconMap[type];
  return <IconComponent sx={{ fontSize: 24, color: recordTypeColorMap[type] }} />;
};

// 큰 아이콘 (상세 페이지용)
export const getCareRecordIconLarge = (type: CareRecordType) => {
  const IconComponent = iconMap[type];
  return <IconComponent sx={{ fontSize: 40, color: recordTypeColorMap[type] }} />;
};

// 기록 데이터 요약 표시
export const getRecordSummary = (record: CareRecordResponse): string => {
  const { recordType, recordData } = record;

  switch (recordType) {
    case CareRecordType.FEEDING:
      return recordData.amount ? `${recordData.amount}${recordData.unit || 'ml'}` : '';

    case CareRecordType.SLEEP:
      if (recordData.startTime && recordData.endTime) {
        const start = parseISO(recordData.startTime as string);
        const end = parseISO(recordData.endTime as string);
        const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
        return `${Math.floor(duration / 60)}시간 ${duration % 60}분`;
      }
      return '';

    case CareRecordType.HEALTH:
      return recordData.temperature ? `${recordData.temperature}°C` : '';

    default:
      return '';
  }
};

// 기록 유형별 기본 데이터 반환
export const getDefaultRecordData = (type: CareRecordType): Record<string, any> => {
  switch (type) {
    case CareRecordType.FEEDING:
      return {
        feedingType: 'BOTTLE',
        amount: '',
        unit: 'ml',
        notes: ''
      };
    case CareRecordType.SLEEP:
      return {
        startTime: new Date(),
        endTime: null,
        sleepQuality: 'GOOD',
        notes: ''
      };
    case CareRecordType.DIAPER:
      return {
        diaperType: 'WET',
        wetness: 'MODERATE',
        stoolType: 'NORMAL',
        notes: ''
      };
    case CareRecordType.HEALTH:
      return {
        temperature: '',
        temperatureUnit: 'CELSIUS',
        medication: '',
        symptoms: '',
        notes: ''
      };
    default:
      return {};
  }
};

// 옵션 라벨 매핑
export const optionLabels = {
  feedingType: {
    BREAST: '모유',
    BOTTLE: '분유',
    SOLID: '이유식'
  },
  sleepQuality: {
    GOOD: '좋음',
    FAIR: '보통',
    POOR: '나쁨'
  },
  diaperType: {
    WET: '소변',
    SOILED: '대변',
    BOTH: '소변+대변'
  },
  wetness: {
    LIGHT: '약간',
    MODERATE: '보통',
    HEAVY: '많이'
  },
  stoolType: {
    NORMAL: '정상',
    SOFT: '무름',
    HARD: '딱딱함',
    LIQUID: '설사'
  },
  temperatureUnit: {
    CELSIUS: '°C',
    FAHRENHEIT: '°F'
  }
};
