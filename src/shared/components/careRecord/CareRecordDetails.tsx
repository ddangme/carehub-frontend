// src/shared/components/careRecord/CareRecordDetails.tsx
import React from 'react';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CareRecordResponse, CareRecordType } from '@/api/careRecordApi';
import { optionLabels } from './CareRecordUtils';

interface CareRecordDetailsProps {
  record: CareRecordResponse;
}

// 상세 정보 아이템 컴포넌트
const DetailItem: React.FC<{
  label: string;
  value: string | number;
  span?: number;
}> = ({ label, value, span = 1 }) => (
  <Box sx={{ gridColumn: `span ${span}` }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight="medium">
      {value || '-'}
    </Typography>
  </Box>
);

// 식사 상세 정보
const FeedingDetails: React.FC<{ recordData: Record<string, any> }> = ({ recordData }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" gutterBottom color="primary">
        식사 상세 정보
      </Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 2
      }}>
        <DetailItem
          label="식사 유형"
          value={optionLabels.feedingType[recordData.feedingType as keyof typeof optionLabels.feedingType] || recordData.feedingType}
        />
        <DetailItem
          label="양"
          value={recordData.amount ? `${recordData.amount}${recordData.unit || 'ml'}` : ''}
        />
        {recordData.notes && (
          <DetailItem
            label="메모"
            value={recordData.notes}
            span={3}
          />
        )}
      </Box>
    </CardContent>
  </Card>
);

// 수면 상세 정보
const SleepDetails: React.FC<{ recordData: Record<string, any> }> = ({ recordData }) => {
  const startTime = recordData.startTime ? parseISO(recordData.startTime as string) : null;
  const endTime = recordData.endTime ? parseISO(recordData.endTime as string) : null;
  const duration = startTime && endTime ?
    Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) : null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          수면 상세 정보
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
          gap: 2
        }}>
          <DetailItem
            label="수면 시작"
            value={startTime ? format(startTime, 'HH:mm', { locale: ko }) : ''}
          />
          <DetailItem
            label="수면 종료"
            value={endTime ? format(endTime, 'HH:mm', { locale: ko }) : '진행 중'}
          />
          <DetailItem
            label="수면 시간"
            value={duration ? `${Math.floor(duration / 60)}시간 ${duration % 60}분` : ''}
          />
          <DetailItem
            label="수면 질"
            value={optionLabels.sleepQuality[recordData.sleepQuality as keyof typeof optionLabels.sleepQuality] || recordData.sleepQuality}
          />
          {recordData.notes && (
            <DetailItem
              label="메모"
              value={recordData.notes}
              span={4}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// 기저귀 상세 정보
const DiaperDetails: React.FC<{ recordData: Record<string, any> }> = ({ recordData }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" gutterBottom color="primary">
        기저귀 상세 정보
      </Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 2
      }}>
        <DetailItem
          label="유형"
          value={optionLabels.diaperType[recordData.diaperType as keyof typeof optionLabels.diaperType] || recordData.diaperType}
        />
        <DetailItem
          label="젖음 정도"
          value={optionLabels.wetness[recordData.wetness as keyof typeof optionLabels.wetness] || recordData.wetness}
        />
        <DetailItem
          label="변 상태"
          value={optionLabels.stoolType[recordData.stoolType as keyof typeof optionLabels.stoolType] || recordData.stoolType}
        />
        {recordData.notes && (
          <DetailItem
            label="메모"
            value={recordData.notes}
            span={3}
          />
        )}
      </Box>
    </CardContent>
  </Card>
);

// 건강 상세 정보
const HealthDetails: React.FC<{ recordData: Record<string, any> }> = ({ recordData }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" gutterBottom color="primary">
        건강 상세 정보
      </Typography>
      <Stack spacing={2}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2
        }}>
          {recordData.temperature && (
            <DetailItem
              label="체온"
              value={`${recordData.temperature}${optionLabels.temperatureUnit[recordData.temperatureUnit as keyof typeof optionLabels.temperatureUnit] || '°C'}`}
            />
          )}
          {recordData.medication && (
            <DetailItem
              label="복용 약물"
              value={recordData.medication}
            />
          )}
        </Box>
        {recordData.symptoms && (
          <DetailItem
            label="증상"
            value={recordData.symptoms}
          />
        )}
        {recordData.notes && (
          <DetailItem
            label="메모"
            value={recordData.notes}
          />
        )}
      </Stack>
    </CardContent>
  </Card>
);

// 기타 상세 정보
const OtherDetails: React.FC<{ recordData: Record<string, any> }> = ({ recordData }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" gutterBottom color="primary">
        기타 정보
      </Typography>
      {recordData.notes ? (
        <Typography variant="body1">{recordData.notes}</Typography>
      ) : (
        <Typography variant="body2" color="text.secondary">
          추가 정보가 없습니다.
        </Typography>
      )}
    </CardContent>
  </Card>
);

// 메인 상세 정보 컴포넌트
const CareRecordDetails: React.FC<CareRecordDetailsProps> = ({ record }) => {
  const { recordType, recordData } = record;

  switch (recordType) {
    case CareRecordType.FEEDING:
      return <FeedingDetails recordData={recordData} />;
    case CareRecordType.SLEEP:
      return <SleepDetails recordData={recordData} />;
    case CareRecordType.DIAPER:
      return <DiaperDetails recordData={recordData} />;
    case CareRecordType.HEALTH:
      return <HealthDetails recordData={recordData} />;
    default:
      return <OtherDetails recordData={recordData} />;
  }
};

export default CareRecordDetails;
