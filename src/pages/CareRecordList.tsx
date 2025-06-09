import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Skeleton,
  Alert,
  Pagination,
  Fab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { useCareSubject } from '@/shared/contexts/CareSubjectContext';
import careRecordApi, {
  CareRecordResponse,
  CareRecordType,
  CareRecordPageResponse
} from '@/api/careRecordApi';
import CareRecordCard from '@/shared/components/careRecord/CareRecordCard';
import CareRecordFilters from '@/shared/components/careRecord/CareRecordFilters';
import CareRecordStats from '@/shared/components/careRecord/CareRecordStats';
import Trace from '@/shared/components/common/Trace';
import SubjectSelector from '@/shared/components/profile/SubjectSelector';

/**
 * 케어 기록 목록 페이지
 */
const CareRecordList: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { selectedSubject } = useCareSubject();

  // 상태 관리
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<CareRecordResponse[]>([]);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 12
  });

  // 필터 상태
  const [selectedType, setSelectedType] = useState<CareRecordType | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // 케어 기록 목록 조회
  const fetchCareRecords = async (page: number = 0) => {
    if (!selectedSubject) {
      setError('케어 대상을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {
        careSubjectId: selectedSubject.id,
        page,
        size: pagination.size,
        ...(selectedType !== 'ALL' && { recordType: selectedType as CareRecordType }),
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() })
      };

      const response: CareRecordPageResponse = await careRecordApi.getCareRecords(params);

      setRecords(response.content);
      setPagination({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number,
        size: response.size
      });
    } catch (err: any) {
      console.error('Failed to fetch care records:', err);
      setError('케어 기록을 불러오는 중 오류가 발생했습니다.');
      enqueueSnackbar('케어 기록을 불러오는 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (selectedSubject) {
      fetchCareRecords(0);
    }
  }, [selectedSubject, selectedType, startDate, endDate]);

  // 케어 기록 생성 페이지로 이동
  const handleCreateRecord = () => {
    if (!selectedSubject) {
      enqueueSnackbar('케어 대상을 먼저 선택해주세요.', { variant: 'warning' });
      return;
    }
    navigate('/care-records/create');
  };

  // 케어 기록 상세 페이지로 이동
  const handleRecordClick = (recordId: number) => {
    navigate(`/care-records/${recordId}`);
  };

  // 페이지 변경
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchCareRecords(value - 1); // Material-UI Pagination은 1부터 시작
  };

  // 필터 초기화
  const handleClearFilters = () => {
    setSelectedType('ALL');
    setStartDate(null);
    setEndDate(null);
  };

  // 레코드를 그룹으로 나누는 함수 (3개씩)
  const groupRecords = (records: CareRecordResponse[], groupSize: number = 3) => {
    const groups = [];
    for (let i = 0; i < records.length; i += groupSize) {
      groups.push(records.slice(i, i + groupSize));
    }
    return groups;
  };

  // 선택된 케어 대상이 없는 경우
  if (!selectedSubject) {
    return (
      <Box>
        <Trace paths={[
          { name: '홈', path: '/' },
          { name: '케어 기록', path: '/care-records', isActive: true }
        ]} />

        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" gutterBottom>
            케어 대상을 선택해주세요
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            케어 기록을 보려면 먼저 케어 대상을 선택해야 합니다.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/care-subjects')}
          >
            케어 대상 관리로 이동
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* 경로 네비게이션 */}
      <Trace paths={[
        { name: '홈', path: '/' },
        { name: '케어 기록', path: '/care-records', isActive: true }
      ]} />

      {/* 헤더 */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4
      }}>
        <Typography variant="h5" component="h1" fontWeight="medium">
          케어 기록
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SubjectSelector />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateRecord}
          >
            기록 추가
          </Button>
        </Box>
      </Box>

      {/* 통계 카드 */}
      <Box sx={{ mb: 4 }}>
        <CareRecordStats
          records={records}
          totalElements={pagination.totalElements}
        />
      </Box>

      {/* 필터 */}
      <CareRecordFilters
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearFilters={handleClearFilters}
      />

      {/* 오류 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 로딩 상태 */}
      {loading ? (
        <Stack spacing={3}>
          {[1, 2].map((rowIndex) => (
            <Stack
              key={rowIndex}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
            >
              {[1, 2, 3].map((colIndex) => (
                <Box key={`${rowIndex}-${colIndex}`} sx={{ flex: 1 }}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Box>
              ))}
            </Stack>
          ))}
        </Stack>
      ) : (
        <>
          {/* 기록 목록 */}
          {records.length > 0 ? (
            <Box>
              <Stack spacing={3}>
                {groupRecords(records).map((recordGroup, groupIndex) => (
                  <Stack
                    key={groupIndex}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={3}
                  >
                    {recordGroup.map((record) => (
                      <Box key={record.id} sx={{ flex: 1 }}>
                        <CareRecordCard
                          record={record}
                          onClick={handleRecordClick}
                        />
                      </Box>
                    ))}
                    {/* 마지막 행에서 빈 공간 채우기 */}
                    {recordGroup.length < 3 &&
                      Array.from({ length: 3 - recordGroup.length }).map((_, emptyIndex) => (
                        <Box key={`empty-${groupIndex}-${emptyIndex}`} sx={{ flex: 1 }} />
                      ))
                    }
                  </Stack>
                ))}
              </Stack>

              {/* 페이지네이션 */}
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage + 1}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </Box>
          ) : (
            /* 빈 상태 */
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                아직 기록된 케어 활동이 없습니다
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                첫 번째 케어 기록을 추가해보세요.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateRecord}
                sx={{ mt: 2 }}
              >
                첫 기록 추가하기
              </Button>
            </Box>
          )}
        </>
      )}

      {/* 플로팅 액션 버튼 (모바일용) */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleCreateRecord}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default CareRecordList;
