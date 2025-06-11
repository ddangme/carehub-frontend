import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCareSubject } from '@/shared/contexts/CareSubjectContext';
import careRecordApi, { CareRecordType, CareRecordCreateRequest } from '@/api/careRecordApi';
import CareRecordTypeSelector from '@/shared/components/careRecord/CareRecordTypeSelector';
import CareRecordForm from '@/shared/components/careRecord/CareRecordForm';
import Trace from '@/shared/components/common/Trace';

/**
 * 케어 기록 생성 페이지
 */
const CareRecordCreate: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { selectedSubject } = useCareSubject();

  // 스텝 관리
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 기록 유형 선택 상태
  const [recordType, setRecordType] = useState<CareRecordType>(CareRecordType.FEEDING);

  // 기록 정보 상태
  const [recordInfo, setRecordInfo] = useState({
    title: '',
    description: '',
    recordedAt: new Date(),
    recordData: {}
  });

  // 스텝 정의
  const steps = ['기록 유형 선택', '기록 정보 입력'];

  // 기록 정보 유효성 검사
  const validateRecordInfo = () => {
    if (!recordInfo.title.trim()) {
      enqueueSnackbar('제목을 입력해주세요.', { variant: 'error' });
      return false;
    }
    return true;
  };

  // 다음 스텝으로 이동
  const handleNext = () => {
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

  // 기록 생성 취소
  const handleCancel = () => {
    if (window.confirm('기록 작성을 취소하시겠습니까?')) {
      navigate('/care-records');
    }
  };

  // 기록 저장 함수
  const handleSave = async () => {
    if (!selectedSubject) {
      enqueueSnackbar('케어 대상을 선택해주세요.', { variant: 'error' });
      return;
    }

    if (!validateRecordInfo()) {
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    const formattedDate = format(recordInfo.recordedAt, 'yyyy-MM-dd HH:mm:ss');

    try {
      const data: CareRecordCreateRequest = {
        careSubjectId: selectedSubject.id,
        recordType,
        title: recordInfo.title,
        description: recordInfo.description,
        recordedAt: formattedDate,
        recordData: recordInfo.recordData
      };

      const response = await careRecordApi.createCareRecord(data);
      enqueueSnackbar('케어 기록이 성공적으로 저장되었습니다.', { variant: 'success' });
      navigate(`/care-records/${response.id}`);
    } catch (error: any) {
      console.error('Care record creation error:', error);
      enqueueSnackbar(
        error.message || '케어 기록 저장 중 오류가 발생했습니다.',
        { variant: 'error' }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 기록 유형 변경 핸들러
  const handleRecordTypeChange = (newType: CareRecordType) => {
    setRecordType(newType);

    // 기록 유형에 따른 기본 제목 설정
    const defaultTitles = {
      [CareRecordType.FEEDING]: '식사',
      [CareRecordType.SLEEP]: '수면',
      [CareRecordType.DIAPER]: '기저귀 교체',
      [CareRecordType.HEALTH]: '건강 체크',
      [CareRecordType.ACTIVITY]: '활동',
      [CareRecordType.OTHER]: '기타'
    };

    setRecordInfo(prev => ({
      ...prev,
      title: defaultTitles[newType] || '',
      recordData: {} // 기록 데이터 초기화
    }));
  };

  // 마지막 스텝인지 확인
  const isLastStep = activeStep === steps.length - 1;

  // 선택된 케어 대상이 없는 경우
  if (!selectedSubject) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 8 }}>
          <Trace paths={[
            { name: '홈', path: '/' },
            { name: '케어 기록', path: '/care-records' },
            { name: '기록 추가', path: '/care-records/create', isActive: true }
          ]} />

          <Alert severity="warning" sx={{ mt: 4 }}>
            케어 대상을 먼저 선택해주세요.
          </Alert>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/care-subjects')}
            >
              케어 대상 선택하기
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  // 현재 스텝에 해당하는 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <CareRecordTypeSelector
            recordType={recordType}
            setRecordType={handleRecordTypeChange}
          />
        );
      case 1:
        return (
          <CareRecordForm
            recordType={recordType}
            recordInfo={recordInfo}
            setRecordInfo={setRecordInfo}
          />
        );
      default:
        return <div>스텝을 찾을 수 없습니다.</div>;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Trace paths={[
          { name: '홈', path: '/' },
          { name: '케어 기록', path: '/care-records' },
          { name: '기록 추가', path: '/care-records/create', isActive: true }
        ]} />

        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          케어 기록 추가
        </Typography>

        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
          {selectedSubject.name}의 케어 기록을 추가합니다
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

export default CareRecordCreate;
