import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CareRecordType } from '@/api/careRecordApi';
import { optionLabels } from '@/shared/components/careRecord/CareRecordUtils';

interface CareRecordFormProps {
  recordType: CareRecordType;
  recordInfo: {
    title: string;
    description: string;
    recordedAt: Date;
    recordData: Record<string, any>;
  };
  setRecordInfo: (info: any) => void;
}

/**
 * 케어 기록 입력 폼 컴포넌트
 */
const CareRecordForm: React.FC<CareRecordFormProps> = ({
                                                         recordType,
                                                         recordInfo,
                                                         setRecordInfo
                                                       }) => {
  // 기본 필드 변경 핸들러
  const handleBasicChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRecordInfo((prev: any) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // 기록 데이터 변경 핸들러
  const handleRecordDataChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRecordInfo((prev: any) => ({
      ...prev,
      recordData: {
        ...prev.recordData,
        [field]: e.target.value
      }
    }));
  };

  // 숫자 필드 변경 핸들러
  const handleNumberChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : '';
    setRecordInfo((prev: any) => ({
      ...prev,
      recordData: {
        ...prev.recordData,
        [field]: value
      }
    }));
  };

  // 날짜 변경 핸들러
  const handleDateTimeChange = (date: Date | null) => {
    if (date) {
      setRecordInfo((prev: any) => ({
        ...prev,
        recordedAt: date
      }));
    }
  };

  // 수면 시간 변경 핸들러
  const handleSleepTimeChange = (field: string) => (date: Date | null) => {
    if (date) {
      setRecordInfo((prev: any) => ({
        ...prev,
        recordData: {
          ...prev.recordData,
          [field]: date.toISOString()
        }
      }));
    }
  };

  // 셀렉트 변경 핸들러
  const handleSelectChange = (field: string) => (e: any) => {
    setRecordInfo((prev: any) => ({
      ...prev,
      recordData: {
        ...prev.recordData,
        [field]: e.target.value
      }
    }));
  };

  // 기록 유형별 폼 렌더링
  const renderTypeSpecificForm = () => {
    switch (recordType) {
      case CareRecordType.FEEDING:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">식사 정보</Typography>
            <Divider />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>식사 유형</InputLabel>
                <Select
                  value={recordInfo.recordData.feedingType || 'BOTTLE'}
                  label="식사 유형"
                  onChange={handleSelectChange('feedingType')}
                >
                  {Object.entries(optionLabels.feedingType).map(([key, label]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="양"
                type="number"
                value={recordInfo.recordData.amount || ''}
                onChange={handleNumberChange('amount')}
                InputProps={{ endAdornment: 'ml' }}
              />

              <TextField
                fullWidth
                label="단위"
                value={recordInfo.recordData.unit || 'ml'}
                onChange={handleRecordDataChange('unit')}
              />
            </Stack>

            <TextField
              fullWidth
              label="메모"
              multiline
              rows={2}
              value={recordInfo.recordData.notes || ''}
              onChange={handleRecordDataChange('notes')}
              helperText="특이사항이나 추가 정보를 입력해주세요."
            />
          </Stack>
        );

      case CareRecordType.SLEEP:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">수면 정보</Typography>
            <Divider />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <DateTimePicker
                  label="수면 시작"
                  value={recordInfo.recordData.startTime ? new Date(recordInfo.recordData.startTime) : new Date()}
                  onChange={handleSleepTimeChange('startTime')}
                  slotProps={{ textField: { fullWidth: true } }}
                />

                <DateTimePicker
                  label="수면 종료 (선택사항)"
                  value={recordInfo.recordData.endTime ? new Date(recordInfo.recordData.endTime) : null}
                  onChange={handleSleepTimeChange('endTime')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Stack>
            </LocalizationProvider>

            <FormControl fullWidth>
              <InputLabel>수면 품질</InputLabel>
              <Select
                value={recordInfo.recordData.sleepQuality || 'GOOD'}
                label="수면 품질"
                onChange={handleSelectChange('sleepQuality')}
              >
                {Object.entries(optionLabels.sleepQuality).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="메모"
              multiline
              rows={2}
              value={recordInfo.recordData.notes || ''}
              onChange={handleRecordDataChange('notes')}
              helperText="수면 상태나 특이사항을 입력해주세요."
            />
          </Stack>
        );

      case CareRecordType.DIAPER:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">기저귀 정보</Typography>
            <Divider />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>유형</InputLabel>
                <Select
                  value={recordInfo.recordData.diaperType || 'WET'}
                  label="유형"
                  onChange={handleSelectChange('diaperType')}
                >
                  {Object.entries(optionLabels.diaperType).map(([key, label]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>젖음 정도</InputLabel>
                <Select
                  value={recordInfo.recordData.wetness || 'MODERATE'}
                  label="젖음 정도"
                  onChange={handleSelectChange('wetness')}
                >
                  {Object.entries(optionLabels.wetness).map(([key, label]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>변 상태</InputLabel>
                <Select
                  value={recordInfo.recordData.stoolType || 'NORMAL'}
                  label="변 상태"
                  onChange={handleSelectChange('stoolType')}
                >
                  {Object.entries(optionLabels.stoolType).map(([key, label]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              fullWidth
              label="메모"
              multiline
              rows={2}
              value={recordInfo.recordData.notes || ''}
              onChange={handleRecordDataChange('notes')}
              helperText="특이사항이나 추가 정보를 입력해주세요."
            />
          </Stack>
        );

      case CareRecordType.HEALTH:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">건강 정보</Typography>
            <Divider />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="체온"
                type="number"
                value={recordInfo.recordData.temperature || ''}
                onChange={handleNumberChange('temperature')}
                InputProps={{ endAdornment: '°C' }}
                inputProps={{ step: 0.1 }}
              />

              <FormControl fullWidth>
                <InputLabel>체온 단위</InputLabel>
                <Select
                  value={recordInfo.recordData.temperatureUnit || 'CELSIUS'}
                  label="체온 단위"
                  onChange={handleSelectChange('temperatureUnit')}
                >
                  {Object.entries(optionLabels.temperatureUnit).map(([key, label]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              fullWidth
              label="복용 약물"
              value={recordInfo.recordData.medication || ''}
              onChange={handleRecordDataChange('medication')}
              helperText="복용한 약물명과 용량을 입력해주세요."
            />

            <TextField
              fullWidth
              label="증상"
              value={recordInfo.recordData.symptoms || ''}
              onChange={handleRecordDataChange('symptoms')}
              helperText="관찰된 증상을 입력해주세요."
            />

            <TextField
              fullWidth
              label="메모"
              multiline
              rows={2}
              value={recordInfo.recordData.notes || ''}
              onChange={handleRecordDataChange('notes')}
              helperText="추가 건강 정보나 특이사항을 입력해주세요."
            />
          </Stack>
        );

      default:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary">기타 정보</Typography>
            <Divider />

            <TextField
              fullWidth
              label="메모"
              multiline
              rows={4}
              value={recordInfo.recordData.notes || ''}
              onChange={handleRecordDataChange('notes')}
              helperText="케어 활동에 대한 상세 정보를 입력해주세요."
            />
          </Stack>
        );
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        기록 정보 입력
      </Typography>

      <Stack spacing={4}>
        {/* 기본 정보 */}
        <Stack spacing={3}>
          <Typography variant="h6" color="primary">기본 정보</Typography>
          <Divider />

          <TextField
            required
            fullWidth
            label="제목"
            value={recordInfo.title}
            onChange={handleBasicChange('title')}
            helperText="기록의 제목을 입력해주세요."
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="기록 시간"
              value={recordInfo.recordedAt}
              onChange={handleDateTimeChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: '케어 활동이 일어난 시간을 선택해주세요.'
                }
              }}
            />
          </LocalizationProvider>

          <TextField
            fullWidth
            label="설명"
            multiline
            rows={3}
            value={recordInfo.description}
            onChange={handleBasicChange('description')}
            helperText="케어 기록에 대한 간략한 설명을 입력해주세요."
          />
        </Stack>

        {/* 유형별 상세 정보 */}
        {renderTypeSpecificForm()}
      </Stack>
    </Box>
  );
};

export default CareRecordForm;
