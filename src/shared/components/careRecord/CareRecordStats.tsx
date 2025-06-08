// src/shared/components/careRecord/CareRecordStats.tsx
import React from 'react';
import { Paper, Typography, Stack } from '@mui/material';
import { CareRecordResponse, CareRecordType } from '@/api/careRecordApi';

interface CareRecordStatsProps {
  records: CareRecordResponse[];
  totalElements: number;
}

const CareRecordStats: React.FC<CareRecordStatsProps> = ({ records, totalElements }) => {
  const getCountByType = (type: CareRecordType) => {
    return records.filter(r => r.recordType === type).length;
  };

  const stats = [
    {
      label: '총 기록 수',
      value: totalElements,
      color: '#3AAA8F'
    },
    {
      label: '오늘 식사',
      value: getCountByType(CareRecordType.FEEDING),
      color: '#FF9800'
    },
    {
      label: '오늘 수면',
      value: getCountByType(CareRecordType.SLEEP),
      color: '#9C27B0'
    },
    {
      label: '오늘 기저귀',
      value: getCountByType(CareRecordType.DIAPER),
      color: '#8BC34A'
    }
  ];

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      {stats.map((stat, index) => (
        <Paper key={index} sx={{ p: 2, textAlign: 'center', flex: 1 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: stat.color }}
          >
            {stat.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stat.label}
          </Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default CareRecordStats;
