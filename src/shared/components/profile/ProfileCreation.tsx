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

  // 스텝 정의 - 고정된 배열로 관리
  const steps = profileType === ProfileType.INFANT
    ? ['프로필 유형 선택', '기본 정보 입력', '신생아 정보 입력', '정보 확인']
    : ['프로필 유형 선택', '기본 정보 입력', '정보 확인'];

  // 컴포넌트 배열 - 각 스텝에 해당하는 컴포넌트를 배열로 관리
  const getStepComponents = () => {
    const components = [
      // 0: 프로필 유형 선택
      <ProfileTypeSelection
        key="profile-type"
        profileType={profileType}
        setProfileType={setProfileType}
      />,
      // 1: 기본 정보 입력
      <BasicInfoForm
        key="basic-info"
        basicInfo={basicInfo}
        setBasicInfo={setBasicInfo}
      />
    ];

    if (profileType === ProfileType.INFANT) {
      // 신생아 프로필인 경우
      components.push(
        // 2: 신생아 정보 입력
        <InfantInfoForm
          key="infant-info"
          infantInfo={infantInfo}
          setInfantInfo={setInfantInfo}
        />,
        // 3: 정보 확인
        <ProfileSummary
          key="profile-summary"
          profileType={profileType}
          basicInfo={basicInfo}
          infantInfo={infantInfo}
        />
      );
    } else {
      // 일반 프로필인 경우
      components.push(
        // 2: 정보 확인
        <ProfileSummary
          key="profile-summary"
          profileType={profileType}
          basicInfo={basicInfo}
          infantInfo={infantInfo}
        />
      );
    }

    return components;
  };

  const stepComponents = getStepComponents();

  // 기본 정보 유효성 검사
  const validateBasicInfo = () => {
    if (!basicInfo.name.trim()) {
      alert('이름을 입력해주세요.');
      return false;
    }
    if (!basicInfo.birthDate) {
      alert('생년월일을 선택해주세요.');
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

    console.log('Current step:', activeStep);
    console.log('Profile type:', profileType);
    console.log('Steps array:', steps);
    console.log('Total steps:', steps.length);
    console.log('Next step will be:', activeStep + 1);

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

  // 마지막 단계에서 저장 버튼 클릭 처리
  const handleSave = async () => {
    // ProfileSummary 컴포넌트의 저장 함수를 직접 호출하는 대신
    // 여기서 직접 저장 로직 처리
    try {
      if (profileType === ProfileType.INFANT && infantInfo) {
        const data = {
          ...basicInfo,
          ...infantInfo
        };

        const response = await careSubjectApi.createInfantProfile(data);
        console.log('Profile created successfully:', response);
        navigate(`/care-subjects/infant/${response.id}`);
      } else {
        const response = await careSubjectApi.createCareSubject(basicInfo);
        console.log('Profile created successfully:', response);
        navigate(`/care-subjects/${response.id}`);
      }
    } catch (error) {
      console.error('Profile creation error:', error);
    }
  };

  // 프로필 타입 변경 핸들러
  const handleProfileTypeChange = (newType: ProfileType) => {
    console.log('Profile type changed:', profileType, '->', newType);
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
    // 프로필 타입 선택 단계는 특별 처리 (타입 변경 핸들러 사용)
    if (activeStep === 0) {
      return (
        <ProfileTypeSelection
          profileType={profileType}
          setProfileType={handleProfileTypeChange}
        />
      );
    }

    // 나머지 스텝은 배열에서 가져오기
    return stepComponents[activeStep] || <div>스텝을 찾을 수 없습니다.</div>;
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
                onClick={isLastStep ? handleSave : handleNext}
                type="button"
              >
                {isLastStep ? '저장' : '다음'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfileCreation;