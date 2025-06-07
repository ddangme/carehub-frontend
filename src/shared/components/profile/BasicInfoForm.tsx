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
  IconButton,
  Button,
  Stack,
  Autocomplete,
  Chip,
  Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO } from 'date-fns';
import careSubjectApi from '@/api/careSubjectApi';
import { useSnackbar } from 'notistack';

interface User {
  id: number;
  name: string;
  email: string;
  profileImageUrl?: string;
}

interface BasicInfoFormProps {
  basicInfo: {
    name: string;
    birthDate: string;
    gender: string;
    bloodType: string;
    description: string;
    profileImageUrl: string;
    additionalCaregiverIds: number[];
  };
  setBasicInfo: (info: any) => void;
}

/**
 * 기본 정보 입력 폼 컴포넌트
 */
const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ basicInfo, setBasicInfo }) => {
  // 파일 업로드 상태 관리
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);

  // 에러 메시지 상태 관리
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 캐어기버 목록 상태 관리 (실제 API로 대체해야 함)
  const [availableCaregivers, setAvailableCaregivers] = useState<User[]>([
    { id: 1, name: '홍길동', email: 'hong@example.com', profileImageUrl: '/images/avatar/avatar1.jpg' },
    { id: 2, name: '김철수', email: 'kim@example.com', profileImageUrl: '/images/avatar/avatar2.jpg' },
    { id: 3, name: '이영희', email: 'lee@example.com', profileImageUrl: '/images/avatar/avatar3.jpg' },
  ]);
  const [selectedCaregivers, setSelectedCaregivers] = useState<User[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  // 폼 필드값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBasicInfo((prev: any) => ({ ...prev, [name]: value }));

    // 에러 메시지 클리어
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setBasicInfo((prev: any) => ({
        ...prev,
        birthDate: format(date, 'yyyy-MM-dd')
      }));
    } else {
      setBasicInfo((prev: any) => ({ ...prev, birthDate: '' }));
    }
  };

  // 셀렉트 변경 핸들러
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setBasicInfo((prev: any) => ({ ...prev, [name]: value }));
  };

  // 추가 보호자 변경 핸들러
  const handleCaregiversChange = (event: any, newValue: User[]) => {
    setSelectedCaregivers(newValue);
    setBasicInfo((prev: any) => ({
      ...prev,
      additionalCaregiverIds: newValue.map(user => user.id)
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // 파일 유효성 검사
      if (!file.type.startsWith('image/')) {
        enqueueSnackbar('이미지 파일만 업로드할 수 있습니다.', { variant: 'error' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar('파일 크기는 5MB 이하여야 합니다.', { variant: 'error' });
        return;
      }

      setImageFile(file);

      try {
        setUploadProgress(true);
        // 실제 파일 업로드 API 호출
        const response = await careSubjectApi.uploadProfileImage(file);
        setBasicInfo((prev: any) => ({
          ...prev,
          profileImageUrl: response.imageUrl
        }));
        enqueueSnackbar('이미지가 성공적으로 업로드되었습니다.', { variant: 'success' });
      } catch (error) {
        console.error('Image upload error:', error);
        enqueueSnackbar('이미지 업로드에 실패했습니다.', { variant: 'error' });
      } finally {
        setUploadProgress(false);
      }
    }
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = () => {
    setImageFile(null);
    setBasicInfo((prev: any) => ({ ...prev, profileImageUrl: '' }));
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!basicInfo.name.trim()) {
      newErrors.name = '이름은 필수 입력값입니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        기본 정보
      </Typography>

      <Grid container spacing={3}>
        {/* 프로필 이미지 */}
        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                border: '1px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                mb: 2,
                position: 'relative',
                backgroundColor: '#f5f5f5'
              }}
            >
              {basicInfo.profileImageUrl ? (
                <>
                  <img
                    src={basicInfo.profileImageUrl}
                    alt="프로필 이미지"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    aria-label="delete image"
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      },
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              ) : uploadProgress ? (
                <Typography variant="body2" color="text.secondary">
                  이미지 업로드 중...
                </Typography>
              ) : (
                <PhotoCamera sx={{ fontSize: 40, color: '#aaa' }} />
              )}
            </Box>

            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCamera />}
              sx={{ mt: 1 }}
              disabled={uploadProgress}
            >
              이미지 업로드
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              최대 파일 크기: 5MB
            </Typography>
          </Box>
        </Grid>

        {/* 기본 정보 입력 폼 */}
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            {/* 이름 */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                name="name"
                label="이름"
                value={basicInfo.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name || '케어 대상의 이름을 입력해주세요.'}
              />
            </Grid>

            {/* 생년월일 */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="생년월일"
                  value={basicInfo.birthDate ? parseISO(basicInfo.birthDate) : null}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: '생년월일을 선택해주세요.'
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* 성별 */}
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">성별</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={basicInfo.gender}
                  label="성별"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="M">남성</MenuItem>
                  <MenuItem value="F">여성</MenuItem>
                  <MenuItem value="O">기타</MenuItem>
                </Select>
                <FormHelperText>선택사항입니다.</FormHelperText>
              </FormControl>
            </Grid>

            {/* 혈액형 */}
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="bloodType-label">혈액형</InputLabel>
                <Select
                  labelId="bloodType-label"
                  id="bloodType"
                  name="bloodType"
                  value={basicInfo.bloodType}
                  label="혈액형"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="A">A형</MenuItem>
                  <MenuItem value="B">B형</MenuItem>
                  <MenuItem value="O">O형</MenuItem>
                  <MenuItem value="AB">AB형</MenuItem>
                  <MenuItem value="OTHER">기타</MenuItem>
                </Select>
                <FormHelperText>선택사항입니다.</FormHelperText>
              </FormControl>
            </Grid>

            {/* 설명 */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="설명"
                multiline
                rows={3}
                value={basicInfo.description}
                onChange={handleChange}
                helperText="케어 대상에 대한 간략한 설명을 입력해주세요."
              />
            </Grid>

            {/* 추가 보호자 */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="additionalCaregivers"
                options={availableCaregivers}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                value={selectedCaregivers}
                onChange={handleCaregiversChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      avatar={
                        <Avatar
                          alt={option.name}
                          src={option.profileImageUrl}
                        />
                      }
                      label={option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="추가 보호자"
                    helperText="케어 활동을 공유할 추가 보호자를 선택해주세요."
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInfoForm;