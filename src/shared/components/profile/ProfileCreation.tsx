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
import { ProfileType } from '@/api/careSubjectApi';
import ProfileTypeSelection from './ProfileTypeSelection';
import BasicInfoForm from './BasicInfoForm';
import InfantInfoForm from './InfantInfoForm';
import ProfileSummary from './ProfileSummary';

/**
 * 케어 대상 프로필 생성 메인 컴포넌트
 */
const ProfileCreation: React.FC = () => {
  const navigate = useNavigate();

  // 스텝 관리
  const [activeStep, setActiveStep] = useState(0);

  // 프로필 타입 선택 상태
  const [profileType, setProfileType] = useState<ProfileType>(ProfileType.INFANT); // 기본값은 신생아 프로필

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
  const steps = [
    '프로필 유형 선택',
    '기본 정보 입력',
    ...(profileType === ProfileType.INFANT ? ['신생아 정보 입력'] : []),
    '정보 확인'
  ];

  // 현재 스텝에 따른 컴포넌트 렌더링
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ProfileTypeSelection
            profileType={profileType}
            setProfileType={setProfileType}
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
            />
          );
        }
      case 3:
        return (
          <ProfileSummary
            profileType={profileType}
            basicInfo={basicInfo}
            infantInfo={infantInfo}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  // 다음 스텝으로 이동
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // 이전 스텝으로 이동
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // 프로필 생성 취소
  const handleCancel = () => {
    if (window.confirm('프로필 생성을 취소하시겠습니까?')) {
      navigate('/care-subjects');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          케어 대상 프로필 생성
        </Typography>

        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Box>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  이전
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={activeStep === steps.length - 1 ? undefined : handleNext}
                type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                form={activeStep === steps.length - 1 ? 'profile-form' : undefined}
              >
                {activeStep === steps.length - 1 ? '저장' : '다음'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfileCreation;