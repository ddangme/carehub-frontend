import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, parseISO } from 'date-fns';

interface InfantInfoFormProps {
  infantInfo: {
    birthWeightGrams?: number;
    birthHeightCm?: number;
    headCircumferenceCm?: number;
    gestationalAgeWeeks?: number;
    deliveryType: string;
    allergies: string;
    specialCareNeeds: string;
    lastCheckupDate: string;
  };
  setInfantInfo: (info: any) => void;
}

/**
 * 신생아 정보 입력 폼 컴포넌트
 */
const InfantInfoForm: React.FC<InfantInfoFormProps> = ({ infantInfo, setInfantInfo }) => {
  // 에러 메시지 상태 관리
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 폼 필드값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInfantInfo((prev: any) => ({ ...prev, [name]: value }));

    // 에러 메시지 클리어
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 숫자 필드 변경 핸들러
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numValue = value ? parseInt(value, 10) : undefined;
    setInfantInfo((prev: any) => ({ ...prev, [name]: numValue }));

    // 에러 메시지 클리어
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setInfantInfo((prev: any) => ({
        ...prev,
        lastCheckupDate: format(date, 'yyyy-MM-dd')
      }));
    } else {
      setInfantInfo((prev: any) => ({ ...prev, lastCheckupDate: '' }));
    }
  };

  // 셀렉트 변경 핸들러
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setInfantInfo((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        신생아 정보
      </Typography>

      <Grid container spacing={3}>
        {/* 출생 관련 정보 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            출생 정보
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        {/* 출생 체중 */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="birthWeightGrams"
            name="birthWeightGrams"
            label="출생 체중"
            type="number"
            InputProps={{ endAdornment: <Typography color="text.secondary">g</Typography> }}
            value={infantInfo.birthWeightGrams || ''}
            onChange={handleNumberChange}
            inputProps={{ min: 0, max: 10000 }}
            helperText="출생 시 체중 (그램)"
          />
        </Grid>

        {/* 출생 신장 */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="birthHeightCm"
            name="birthHeightCm"
            label="출생 신장"
            type="number"
            InputProps={{ endAdornment: <Typography color="text.secondary">cm</Typography> }}
            value={infantInfo.birthHeightCm || ''}
            onChange={handleNumberChange}
            inputProps={{ min: 0, max: 100 }}
            helperText="출생 시 신장 (센티미터)"
          />
        </Grid>

        {/* 머리 둘레 */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="headCircumferenceCm"
            name="headCircumferenceCm"
            label="머리 둘레"
            type="number"
            InputProps={{ endAdornment: <Typography color="text.secondary">cm</Typography> }}
            value={infantInfo.headCircumferenceCm || ''}
            onChange={handleNumberChange}
            inputProps={{ min: 0, max: 100 }}
            helperText="출생 시 머리 둘레 (센티미터)"
          />
        </Grid>

        {/* 재태 기간 */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="gestationalAgeWeeks"
            name="gestationalAgeWeeks"
            label="재태 기간"
            type="number"
            InputProps={{ endAdornment: <Typography color="text.secondary">주</Typography> }}
            value={infantInfo.gestationalAgeWeeks || ''}
            onChange={handleNumberChange}
            inputProps={{ min: 20, max: 45 }}
            helperText="임신 기간 (주)"
          />
        </Grid>

        {/* 분만 유형 */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="deliveryType-label">분만 유형</InputLabel>
            <Select
              labelId="deliveryType-label"
              id="deliveryType"
              name="deliveryType"
              value={infantInfo.deliveryType}
              label="분만 유형"
              onChange={handleSelectChange}
            >
              <MenuItem value="NATURAL">자연분만</MenuItem>
              <MenuItem value="C_SECTION">제왕절개</MenuItem>
              <MenuItem value="OTHER">기타</MenuItem>
            </Select>
            <FormHelperText>분만 방식을 선택해주세요.</FormHelperText>
          </FormControl>
        </Grid>

        {/* 건강 관련 정보 */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            건강 정보
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        {/* 알레르기 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="allergies"
            name="allergies"
            label="알레르기"
            value={infantInfo.allergies}
            onChange={handleChange}
            helperText="알레르기가 있다면 입력해주세요. (쉼표로 구분)"
          />
        </Grid>

        {/* 특별 케어 요구사항 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="specialCareNeeds"
            name="specialCareNeeds"
            label="특별 케어 요구사항"
            multiline
            rows={3}
            value={infantInfo.specialCareNeeds}
            onChange={handleChange}
            helperText="특별히 주의해야 할 사항이나 케어 요구사항이 있다면 입력해주세요."
          />
        </Grid>

        {/* 마지막 검진일 */}
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="마지막 검진일"
              value={infantInfo.lastCheckupDate ? parseISO(infantInfo.lastCheckupDate) : null}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: '마지막 건강 검진 날짜를 선택해주세요.'
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InfantInfoForm;