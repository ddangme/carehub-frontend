import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import careSubjectApi, { CareSubjectResponse } from '@/api/careSubjectApi';
import { useSnackbar } from 'notistack';

// 컨텍스트 타입 정의
interface CareSubjectContextType {
  selectedSubject: CareSubjectResponse | null;
  selectSubject: (subject: CareSubjectResponse | null) => void;
  careSubjects: CareSubjectResponse[];
  loading: boolean;
  error: string | null;
  refreshSubjects: () => Promise<void>;
}

// 기본값 생성
const defaultContextValue: CareSubjectContextType = {
  selectedSubject: null,
  selectSubject: () => {},
  careSubjects: [],
  loading: false,
  error: null,
  refreshSubjects: async () => {}
};

// 컨텍스트 생성
const CareSubjectContext = createContext<CareSubjectContextType>(defaultContextValue);

// 컨텍스트 프로바이더 컴포넌트
export const CareSubjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSubject, setSelectedSubject] = useState<CareSubjectResponse | null>(null);
  const [careSubjects, setCareSubjects] = useState<CareSubjectResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // 케어 대상 선택
  const selectSubject = (subject: CareSubjectResponse | null) => {
    setSelectedSubject(subject);

    // 선택된 대상 정보를 로컬 스토리지에 저장
    if (subject) {
      localStorage.setItem('selectedCareSubject', JSON.stringify(subject));
    } else {
      localStorage.removeItem('selectedCareSubject');
    }
  };

  // 케어 대상 목록 조회
  const fetchCareSubjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await careSubjectApi.getCareSubjects();
      setCareSubjects(response.content);

      // 저장된 대상이 있으면 선택, 없으면 첫 번째 대상 선택
      const savedSubject = localStorage.getItem('selectedCareSubject');
      if (savedSubject) {
        const parsed = JSON.parse(savedSubject) as CareSubjectResponse;
        // 아직 목록에 있는지 확인
        const exists = response.content.some(s => s.id === parsed.id);
        if (exists) {
          const current = response.content.find(s => s.id === parsed.id) || null;
          setSelectedSubject(current);
        } else {
          // 삭제된 대상이면 저장된 정보 제거
          localStorage.removeItem('selectedCareSubject');
          setSelectedSubject(response.content.length > 0 ? response.content[0] : null);
        }
      } else {
        setSelectedSubject(response.content.length > 0 ? response.content[0] : null);
      }
    } catch (err: any) {
      console.error('Failed to fetch care subjects:', err);
      setError('케어 대상 목록을 불러오는 중 오류가 발생했습니다.');
      enqueueSnackbar('케어 대상 목록을 불러오는 중 오류가 발생했습니다.', {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchCareSubjects();
  }, []);

  // 컨텍스트 값
  const value: CareSubjectContextType = {
    selectedSubject,
    selectSubject,
    careSubjects,
    loading,
    error,
    refreshSubjects: fetchCareSubjects
  };

  return (
    <CareSubjectContext.Provider value={value}>
      {children}
    </CareSubjectContext.Provider>
  );
};

// 커스텀 훅: 케어 대상 컨텍스트 사용
export const useCareSubject = () => useContext(CareSubjectContext);

export default CareSubjectContext;