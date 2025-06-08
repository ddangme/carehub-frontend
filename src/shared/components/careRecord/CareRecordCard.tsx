// src/shared/components/careRecord/CareRecordCard.tsx
import React from 'react';
import {
  Card,
  CardActionArea,
  Box,
  Typography,
  Chip,
  Avatar
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CareRecordResponse, recordTypeColorMap } from '@/api/careRecordApi';
import { getCareRecordIcon, getRecordSummary } from './CareRecordUtils';

interface CareRecordCardProps {
  record: CareRecordResponse;
  onClick: (recordId: number) => void;
}

const CareRecordCard: React.FC<CareRecordCardProps> = ({ record, onClick }) => {
  const formatRecordTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MM월 dd일 HH:mm', { locale: ko });
    } catch {
      return dateString;
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardActionArea
        onClick={() => onClick(record.id)}
        sx={{ height: '100%', p: 2 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ mr: 2, mt: 0.5 }}>
            {getCareRecordIcon(record.recordType)}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1
            }}>
              <Chip
                label={record.recordTypeDisplayName}
                size="small"
                sx={{
                  backgroundColor: recordTypeColorMap[record.recordType],
                  color: 'white',
                  fontWeight: 500
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatRecordTime(record.recordedAt)}
              </Typography>
            </Box>

            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              {record.title}
            </Typography>

            {getRecordSummary(record) && (
              <Typography variant="body2" color="primary" fontWeight="medium" gutterBottom>
                {getRecordSummary(record)}
              </Typography>
            )}

            {record.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {record.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Avatar
                sx={{ width: 20, height: 20, mr: 1, fontSize: '0.75rem' }}
              >
                {record.recordedByName.charAt(0)}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {record.recordedByName}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default CareRecordCard;
