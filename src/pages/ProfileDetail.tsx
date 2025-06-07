import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  IconButton,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GrowthIcon from '@mui/icons-material/ShowChart';
import NoteIcon from '@mui/icons-material/Note';
import EventIcon from '@mui/icons-material/Event';
import { format, parseISO, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import careSubjectApi, { InfantProfileResponse } from '@/api/careSubjectApi';
import { useSnackbar } from 'notistack';

// 성별 표시 매핑
const genderMap: Record<string, string> = {
  'M': '남성',
  'F': '여성',
  'O': '기타'
};

// 혈액형 표시 매핑
const bloodTypeMap: Record<string, string> = {
  'A': 'A형',
  'B': 'B형',
  'O': 'O형',
  'AB': 'AB형',
  'OTHER': '기타'
};

// 분만 유형 표시 매핑
const deliveryTypeMap: Record<string, string> = {
  'NATURAL': '자연분만',
  'C_SECTION': '제왕절개',
  'OTHER': '기타'
};

/**
 * 신생아 프로필 상세 페이지
 */
const ProfileDetail: React.FC = () => {
  const { id, type } = useParams<{ id: string, type?: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // 상태 관리
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<InfantProfileResponse | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  // 탭 변경 핸들러
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 프로필 조회
  const fetchProfile = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // 프로필 타입에 따라 적절한 API 호출
      if (type === 'infant') {
        const response = await careSubjectApi.getInfantProfile(parseInt(id, 10));
        setProfile(response);
      } else {
        const response = await careSubjectApi.getCareSubject(parseInt(id, 10));
        setProfile(response as InfantProfileResponse);
      }
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError('프로필 정보를 불러오는 중 오류가 발생했습니다.');
      enqueueSnackbar('프로필 정보를 불러오는 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchProfile();
  }, [id, type]);

  // 나이 계산
  const calculateAge = () => {
    if (!profile || !profile.birthDate) {
      return '나이 정보 없음';
    }

    const birthDate = parseISO(profile.birthDate);
    const now = new Date();

    const years = differenceInYears(now, birthDate);
    if (years > 0) {
      return `${years}세`;
    }

    const months = differenceInMonths(now, birthDate);
    if (months > 0) {
      return `${months}개월`;
    }

    const days = differenceInDays(now, birthDate);
    return `${days}일`;
  };

  // 프로필 목록으로 돌아가기
  const handleGoBack = () => {
    navigate('/care-subjects');
  };

  // 프로필 편집 페이지로 이동
  const handleEdit = () => {
    navigate(`/care-subjects/${type === 'infant' ? 'infant/' : ''}${id}/edit`);
  };

  // 삭제 다이얼로그 열기
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // 삭제 다이얼로그 닫기
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // 프로필 삭제 처리
  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      await careSubjectApi.deleteCareSubject(parseInt(id, 10));
      enqueueSnackbar('프로필이 성공적으로 삭제되었습니다.', { variant: 'success' });
      navigate('/care-subjects');
    } catch (err: any) {
      console.error('Failed to delete profile:', err);
      enqueueSnackbar('프로필 삭제 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // 로딩 중 상태 렌더링
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
          <Skeleton width={200} height={40} />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  // 오류 상태 렌더링
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" paragraph>
          {error}
        </Typography>
        <Button variant="outlined" onClick={fetchProfile}>
          다시 시도
        </Button>
      </Box>
    );
  }

  // 프로필이 없는 경우
  if (!profile) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography paragraph>
          프로필 정보를 찾을 수 없습니다.
        </Typography>
        <Button variant="outlined" onClick={handleGoBack}>
          목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 헤더 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          목록으로 돌아가기
        </Button>

        <Box>
          <Button
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            수정
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            onClick={handleDeleteClick}
          >
            삭제
          </Button>
        </Box>
      </Box>

      {/* 프로필 기본 정보 */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* 프로필 이미지 및 기본 정보 */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            {profile.profileImageUrl ? (
              <Avatar
                src={profile.profileImageUrl}
                alt={profile.name}
                sx={{
                  width: { xs: 150, md: 200 },
                  height: { xs: 150, md: 200 },
                  mx: 'auto',
                  mb: 2
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: { xs: 150, md: 200 },
                  height: { xs: 150, md: 200 },
                  fontSize: { xs: '3rem', md: '4rem' },
                  bgcolor: '#D4F0E8',
                  color: '#3AAA8F',
                  mx: 'auto',
                  mb: 2
                }}
              >
                {profile.name.charAt(0)}
              </Avatar>
            )}

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
              {profile.name}
            </Typography>

            <Chip
              label={profile.subjectType === 'INFANT' ? '신생아' : '케어 대상'}
              color={profile.subjectType === 'INFANT' ? 'primary' : 'default'}
              sx={{
                my: 1,
                backgroundColor: profile.subjectType === 'INFANT' ? '#3AAA8F' : undefined,
                color: profile.subjectType === 'INFANT' ? 'white' : undefined,
              }}
            />

            <Typography variant="body1" sx={{ mt: 1 }}>
              {calculateAge()}
            </Typography>

            {profile.birthDate && (
              <Typography variant="body2" color="text.secondary">
                {format(parseISO(profile.birthDate), 'yyyy년 MM월 dd일')}
              </Typography>
            )}
          </Grid>

          {/* 기본 정보 상세 */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              기본 정보
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <List disablePadding>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="성별"
                      secondary={profile.gender ? genderMap[profile.gender] : '-'}
                      primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                      secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="혈액형"
                      secondary={profile.bloodType ? bloodTypeMap[profile.bloodType] : '-'}
                      primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                      secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} sm={6}>
                <List disablePadding>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="주 보호자"
                      secondary={profile.mainCaregiver?.name || '-'}
                      primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                      secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="추가 보호자"
                      secondary={
                        profile.caregivers?.length > 0
                          ? profile.caregivers.map(cg => cg.name).join(', ')
                          : '없음'
                      }
                      primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                      secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="설명"
                    secondary={profile.description || '-'}
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                  />
                </ListItem>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* 탭 내비게이션 */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<PersonIcon />} label="기본 정보" />
          <Tab icon={<LocalHospitalIcon />} label="건강 정보" />
          <Tab icon={<GrowthIcon />} label="성장 기록" />
          <Tab icon={<EventIcon />} label="일정" />
          <Tab icon={<NoteIcon />} label="메모" />
        </Tabs>
      </Paper>

      {/* 탭 내용 */}
      <Box sx={{ p: 2 }}>
        {/* 기본 정보 탭 */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              세부 정보
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {profile.subjectType === 'INFANT' && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      출생 정보
                    </Typography>
                    <List disablePadding>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="출생 체중"
                          secondary={(profile as InfantProfileResponse).birthWeightGrams ? `${(profile as InfantProfileResponse).birthWeightGrams} g` : '-'}
                          primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        />
                      </ListItem>

                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="출생 신장"
                          secondary={(profile as InfantProfileResponse).birthHeightCm ? `${(profile as InfantProfileResponse).birthHeightCm} cm` : '-'}
                          primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        />
                      </ListItem>

                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="머리 둘레"
                          secondary={(profile as InfantProfileResponse).headCircumferenceCm ? `${(profile as InfantProfileResponse).headCircumferenceCm} cm` : '-'}
                          primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        />
                      </ListItem>

                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="재태 기간"
                          secondary={(profile as InfantProfileResponse).gestationalAgeWeeks ? `${(profile as InfantProfileResponse).gestationalAgeWeeks} 주` : '-'}
                          primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        />
                      </ListItem>

                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="분만 유형"
                          secondary={(profile as InfantProfileResponse).deliveryType ? deliveryTypeMap[(profile as InfantProfileResponse).deliveryType] : '-'}
                          primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      특별 케어 요구사항
                    </Typography>
                    <Typography variant="body1">
                      {(profile as InfantProfileResponse).specialCareNeeds || '특별한 케어 요구사항이 없습니다.'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        )}

        {/* 건강 정보 탭 */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              건강 정보
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {profile.subjectType === 'INFANT' && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      알레르기 정보
                    </Typography>
                    <Typography variant="body1">
                      {(profile as InfantProfileResponse).allergies || '알레르기 정보가 없습니다.'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      마지막 검진일
                    </Typography>
                    <Typography variant="body1">
                      {(profile as InfantProfileResponse).lastCheckupDate ?
                        format(parseISO((profile as InfantProfileResponse).lastCheckupDate), 'yyyy년 MM월 dd일') :
                        '검진 기록이 없습니다.'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      최근 건강 지표
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      아직 기록된 건강 정보가 없습니다.
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/care-subjects/${id}/health-records/create`)}
                    >
                      건강 정보 기록하기
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        )}

        {/* 성장 기록 탭 */}
        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              성장 기록
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" paragraph>
                성장 기록을 추적하고 차트로 시각화할 수 있습니다.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                아직 기록된 성장 데이터가 없습니다.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/care-subjects/${id}/growth-records/create`)}
              >
                성장 기록 추가하기
              </Button>
            </Paper>
          </Box>
        )}

        {/* 일정 탭 */}
        {tabValue === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              일정 관리
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" paragraph>
                예방접종, 병원 방문 등의 일정을 관리할 수 있습니다.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                아직 등록된 일정이 없습니다.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/care-subjects/${id}/schedules/create`)}
              >
                일정 추가하기
              </Button>
            </Paper>
          </Box>
        )}

        {/* 메모 탭 */}
        {tabValue === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              메모
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" paragraph>
                케어 대상과 관련된 메모를 남기고 다른 보호자와 공유할 수 있습니다.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                아직 작성된 메모가 없습니다.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/care-subjects/${id}/notes/create`)}
              >
                메모 작성하기
              </Button>
            </Paper>
          </Box>
        )}
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>프로필 삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {profile.name} 프로필을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며,
            모든 관련 데이터가 함께 삭제됩니다.
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

export default ProfileDetail;