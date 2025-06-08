import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { ProfileType } from '@/api/careSubjectApi';
import careSubjectApi from '@/api/careSubjectApi';
import ProfileTypeSelection from './ProfileTypeSelection';
import BasicInfoForm from './BasicInfoForm';
import InfantInfoForm from './InfantInfoForm';
import ProfileSummary from './ProfileSummary';
import { useCareSubject } from '@/shared/contexts/CareSubjectContext';

/**
 * 케어 대상 프로필 생성 메인 컴포넌트
 */
const ProfileCreation: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { refreshSubjects } = useCareSubject();

  // 스텝 관리
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 프로필 타입 선택 상태
  const [profileType, setProfileType] = useState<ProfileType>(ProfileType.INFANT);

  // 기본 프로필 정보 상태
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    birthDate: '',
    gender: '',
    bloodType: '',
    description: '',
    profileImageUrl: '',
    additionalCaregiverIds: [] as number[]
  });

  // 신생아 특화 프로필 정보 상태
  const [infantInfo, setInfantInfo] = useState({
    birthWeightGrams: undefined as number | undefined,
    birthHeightCm: undefined as number | undefined,
    headCircumferenceCm: undefined as number | undefined,
    gestationalAgeWeeks: undefined as number | undefined,
    deliveryType: '',
    allergies: '',
    specialCareNeeds: '',
    lastCheckupDate: ''
  });

  // 스텝 정의
  const steps = profileType === ProfileType.INFANT
    ? ['프로필 유형 선택', '기본 정보 입력', '신생아 정보 입력', '정보 확인']
    : ['프로필 유형 선택', '기본 정보 입력', '정보 확인'];

  // 기본 정보 유효성 검사
  const validateBasicInfo = () => {
    if (!basicInfo.name.trim()) {
      enqueueSnackbar('이름을 입력해주세요.', { variant: 'error' });
      return false;
    }
    if (!basicInfo.birthDate) {
      enqueueSnackbar('생년월일을 선택해주세요.', { variant: 'error' });
      return false;
    }
    return true;
  };

  // 다음 스텝으로 이동
  const handleNext = () => {
    // 기본 정보 입력 단계에서 유효성 검사
    if (activeStep === 1 && !validateBasicInfo()) {
      return;
    }

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  // 이전 스텝으로 이동
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // 프로필 생성 취소
  const handleCancel = () => {
    if (window.confirm('프로필 생성을 취소하시겠습니까?')) {
      navigate('/care-subjects');
    }
  };

  // 프로필 저장 함수
  const handleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (profileType === ProfileType.INFANT) {
        // 신생아 프로필 저장
        const data = {
          ...basicInfo,
          ...infantInfo
        };

        const response = await careSubjectApi.createInfantProfile(data);
        enqueueSnackbar('신생아 프로필이 성공적으로 생성되었습니다.', { variant: 'success' });

        // 케어 대상 목록 새로고침
        await refreshSubjects();

        navigate(`/care-subjects/infant/${response.id}`);
      } else {
        // 일반 케어 대상 프로필 저장
        const response = await careSubjectApi.createCareSubject(basicInfo);
        enqueueSnackbar('케어 대상 프로필이 성공적으로 생성되었습니다.', { variant: 'success' });

        // 케어 대상 목록 새로고침
        await refreshSubjects();

        navigate(`/care-subjects/${response.id}`);
      }
    } catch (error: any) {
      console.error('Profile creation error:', error);
      enqueueSnackbar(
        error.message || '프로필 생성 중 오류가 발생했습니다.',
        { variant: 'error' }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 타입 변경 핸들러
  const handleProfileTypeChange = (newType: ProfileType) => {
    setProfileType(newType);

    // 프로필 타입이 변경되면 스텝을 재조정
    if (activeStep > 1) {
      setActiveStep(1); // 기본 정보 입력 단계로 이동
    }
  };

  // 마지막 스텝인지 확인
  const isLastStep = activeStep === steps.length - 1;

  // 현재 스텝에 해당하는 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <ProfileTypeSelection
            profileType={profileType}
            setProfileType={handleProfileTypeChange}
          />
        );
      case 1:
        return (
          <BasicInfoForm
            basicInfo={basicInfo}
            setBasicInfo={setBasicInfo}
          />
        );
      case 2:
        if (profileType === ProfileType.INFANT) {
          return (
            <InfantInfoForm
              infantInfo={infantInfo}
              setInfantInfo={setInfantInfo}
            />
          );
        } else {
          return (
            <ProfileSummary
              profileType={profileType}
              basicInfo={basicInfo}
              infantInfo={infantInfo}
              showSaveButton={false} // ProfileCreation에서 저장 버튼 제어
            />
          );
        }
      case 3:
        // 신생아 프로필의 마지막 단계 (정보 확인)
        return (
          <ProfileSummary
            profileType={profileType}
            basicInfo={basicInfo}
            infantInfo={infantInfo}
            showSaveButton={false} // ProfileCreation에서 저장 버튼 제어
          />
        );
      default:
        return <div>스텝을 찾을 수 없습니다.</div>;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          케어 대상 프로필 생성
        </Typography>

        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label, index) => (
            <Step key={`${label}-${index}`}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {renderCurrentStep()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              취소
            </Button>
            <Box>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  disabled={isLoading}
                >
                  이전
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={isLastStep ? handleSave : handleNext}
                disabled={isLoading}
                type="button"
              >
                {isLoading ? '저장 중...' : (isLastStep ? '저장' : '다음')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfileCreation;