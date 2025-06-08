import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Stack,
  Avatar,
  Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useSnackbar } from 'notistack';
import careRecordApi, { CareRecordResponse, recordTypeColorMap } from '@/api/careRecordApi';
import CareRecordDetails from '@/shared/components/careRecord/CareRecordDetails';
import { getCareRecordIconLarge } from '@/shared/components/careRecord/CareRecordUtils';
import Trace from '@/shared/components/common/Trace';

/**
 * 케어 기록 상세 페이지
 */
const CareRecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // 상태 관리
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<CareRecordResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  // 기록 조회
  const fetchCareRecord = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await careRecordApi.getCareRecord(parseInt(id, 10));
      setRecord(response);
    } catch (err: any) {
      console.error('Failed to fetch care record:', err);
      setError('케어 기록을 불러오는 중 오류가 발생했습니다.');
      enqueueSnackbar('케어 기록을 불러오는 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchCareRecord();
  }, [id]);

  // 기록 목록으로 돌아가기
  const handleGoBack = () => {
    navigate('/care-records');
  };

  // 기록 편집 페이지로 이동
  const handleEdit = () => {
    navigate(`/care-records/${id}/edit`);
  };

  // 삭제 다이얼로그 열기
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // 삭제 다이얼로그 닫기
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // 기록 삭제 처리
  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      await careRecordApi.deleteCareRecord(parseInt(id, 10));
      enqueueSnackbar('케어 기록이 성공적으로 삭제되었습니다.', { variant: 'success' });
      navigate('/care-records');
    } catch (err: any) {
      console.error('Failed to delete care record:', err);
      enqueueSnackbar('케어 기록 삭제 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // 날짜 포맷팅
  const formatRecordDateTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
    } catch {
      return dateString;
    }
  };

  // 로딩 중 상태 렌더링
  if (loading) {
    return (
      <Box>
        <Trace paths={[
          { name: '홈', path: '/' },
          { name: '케어 기록', path: '/care-records' },
          { name: '상세', path: `/care-records/${id}`, isActive: true }
        ]} />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
          <Skeleton width={200} height={40} />
        </Box>

        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        </Stack>
      </Box>
    );
  }

  // 오류 상태 렌더링
  if (error) {
    return (
      <Box>
        <Trace paths={[
          { name: '홈', path: '/' },
          { name: '케어 기록', path: '/care-records' },
          { name: '상세', path: `/care-records/${id}`, isActive: true }
        ]} />

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error" paragraph>
            {error}
          </Typography>
          <Button variant="outlined" onClick={fetchCareRecord}>
            다시 시도
          </Button>
        </Box>
      </Box>
    );
  }

  // 기록이 없는 경우
  if (!record) {
    return (
      <Box>
        <Trace paths={[
          { name: '홈', path: '/' },
          { name: '케어 기록', path: '/care-records' },
          { name: '상세', path: `/care-records/${id}`, isActive: true }
        ]} />

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography paragraph>
            케어 기록을 찾을 수 없습니다.
          </Typography>
          <Button variant="outlined" onClick={handleGoBack}>
            목록으로 돌아가기
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
        { name: '케어 기록', path: '/care-records' },
        { name: record.title, path: `/care-records/${id}`, isActive: true }
      ]} />

      {/* 헤더 영역 */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          목록으로 돌아가기
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<EditIcon />}
            onClick={handleEdit}
            variant="outlined"
          >
            수정
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            onClick={handleDeleteClick}
            variant="outlined"
          >
            삭제
          </Button>
        </Box>
      </Box>

      {/* 기록 기본 정보 */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* 아이콘 및 기본 정보 */}
          <Box sx={{ textAlign: 'center', minWidth: { md: 200 } }}>
            <Box sx={{ mb: 2 }}>
              {getCareRecordIconLarge(record.recordType)}
            </Box>

            <Chip
              label={record.recordTypeDisplayName}
              sx={{
                backgroundColor: recordTypeColorMap[record.recordType],
                color: 'white',
                fontWeight: 600,
                mb: 2
              }}
            />

            <Typography variant="body2" color="text.secondary">
              {record.careSubjectName}
            </Typography>
          </Box>

          {/* 세부 정보 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom fontWeight="medium">
              {record.title}
            </Typography>

            <Typography variant="h6" color="primary" gutterBottom>
              {formatRecordDateTime(record.recordedAt)}
            </Typography>

            {record.description && (
              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                {record.description}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* 작성자 정보 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Avatar sx={{ width: 32, height: 32, mr: 1.5 }}>
                {record.recordedByName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {record.recordedByName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(parseISO(record.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })} 작성
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* 상세 정보 */}
      <CareRecordDetails record={record} />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>케어 기록 삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{record.title}" 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>취소</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CareRecordDetail;
