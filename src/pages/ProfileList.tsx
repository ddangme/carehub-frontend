import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Avatar,
  Chip,
  Divider,
  Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EventIcon from '@mui/icons-material/Event';
import { format, parseISO, differenceInDays } from 'date-fns';
import careSubjectApi, { CareSubjectResponse, InfantProfileResponse } from '@/api/careSubjectApi';
import { useSnackbar } from 'notistack';

/**
 * 케어 대상 프로필 목록 페이지
 */
const ProfileList: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // 상태 관리
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [profiles, setProfiles] = useState<CareSubjectResponse[]>([]);
  const [infantProfiles, setInfantProfiles] = useState<InfantProfileResponse[]>([]);

  // 탭 변경 핸들러
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 케어 대상 목록 조회
  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await careSubjectApi.getCareSubjects();
      setProfiles(response.content);

      // 신생아 프로필 별도 조회
      const infantResponse = await careSubjectApi.getInfantProfiles();
      setInfantProfiles(infantResponse);
    } catch (err: any) {
      console.error('Failed to fetch profiles:', err);
      setError('프로필 목록을 불러오는 중 오류가 발생했습니다.');
      enqueueSnackbar('프로필 목록을 불러오는 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchProfiles();
  }, []);

  // 케어 대상 프로필 생성 페이지로 이동
  const handleCreateProfile = () => {
    navigate('/care-subjects/create');
  };

  // 프로필 상세 페이지로 이동
  const handleProfileClick = (id: number, type: string) => {
    if (type === 'INFANT') {
      navigate(`/care-subjects/infant/${id}`);
    } else {
      navigate(`/care-subjects/${id}`);
    }
  };

  // 나이 표시 포맷
  const formatAge = (profile: CareSubjectResponse): string => {
    if (!profile.birthDate) {
      return '나이 정보 없음';
    }

    if (profile.ageYears && profile.ageYears > 0) {
      return `${profile.ageYears}세`;
    }

    if (profile.ageMonths && profile.ageMonths > 0) {
      return `${profile.ageMonths}개월`;
    }

    if (profile.ageDays !== undefined) {
      return `${profile.ageDays}일`;
    }

    // 직접 계산
    const days = differenceInDays(new Date(), parseISO(profile.birthDate));
    return `${days}일`;
  };

  // 로딩 중 상태 렌더링
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            케어 대상 관리
          </Typography>
          <Skeleton width={120} height={40} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Skeleton width={300} height={40} />
        </Box>

        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
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
        <Button variant="outlined" onClick={fetchProfiles}>
          다시 시도
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          케어 대상 관리
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateProfile}
        >
          케어 대상 추가
        </Button>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="전체" />
          <Tab label="신생아" />
          <Tab
            label="어린이"
            disabled
            sx={{ '&.Mui-disabled': { opacity: 0.5 } }}
          />
          <Tab
            label="노인"
            disabled
            sx={{ '&.Mui-disabled': { opacity: 0.5 } }}
          />
          <Tab
            label="반려동물"
            disabled
            sx={{ '&.Mui-disabled': { opacity: 0.5 } }}
          />
        </Tabs>
      </Paper>

      {/* 상단 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
            <ChildCareIcon sx={{ fontSize: 40, color: '#3AAA8F', mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">총 케어 대상</Typography>
              <Typography variant="h4" component="div" fontWeight="500">
                {profiles.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
            <FavoriteIcon sx={{ fontSize: 40, color: '#FE8269', mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">건강 체크 필요</Typography>
              <Typography variant="h4" component="div" fontWeight="500">
                {/* 임시 데이터 */}
                {Math.floor(Math.random() * 3)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
            <EventIcon sx={{ fontSize: 40, color: '#5D5FEF', mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">오늘의 일정</Typography>
              <Typography variant="h4" component="div" fontWeight="500">
                {/* 임시 데이터 */}
                {Math.floor(Math.random() * 5)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 프로필 목록 */}
      {((tabValue === 0 && profiles.length === 0) ||
        (tabValue === 1 && infantProfiles.length === 0)) ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>등록된 케어 대상이 없습니다.</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            '케어 대상 추가' 버튼을 클릭하여 새로운 케어 대상을 등록해보세요.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateProfile}
            sx={{ mt: 2 }}
          >
            케어 대상 추가
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* 전체 탭 또는 신생아 탭 선택 시 해당하는 프로필 목록 표시 */}
          {(tabValue === 0 ? profiles : infantProfiles).map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile.id}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea
                  onClick={() => handleProfileClick(profile.id, profile.subjectType)}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <Box sx={{ position: 'relative' }}>
                    {profile.profileImageUrl ? (
                      <CardMedia
                        component="img"
                        height="140"
                        image={profile.profileImageUrl}
                        alt={profile.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 140,
                          backgroundColor: '#D4F0E8',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            fontSize: '2.5rem',
                            bgcolor: 'white',
                            color: '#3AAA8F'
                          }}
                        >
                          {profile.name.charAt(0)}
                        </Avatar>
                      </Box>
                    )}

                    {/* 유형 표시 칩 */}
                    <Chip
                      label={profile.subjectType === 'INFANT' ? '신생아' : '케어 대상'}
                      size="small"
                      color={profile.subjectType === 'INFANT' ? 'primary' : 'default'}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: profile.subjectType === 'INFANT' ? '#3AAA8F' : '#F5F5F5',
                        color: profile.subjectType === 'INFANT' ? 'white' : 'text.primary',
                        fontWeight: 500
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {profile.name}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatAge(profile)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile.gender === 'M' ? '남성' :
                          profile.gender === 'F' ? '여성' :
                            profile.gender === 'O' ? '기타' : ''}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 'auto',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {profile.description || '설명 없음'}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={profile.mainCaregiver.profileImageUrl}
                          alt={profile.mainCaregiver.name}
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {profile.mainCaregiver.name}
                        </Typography>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        {profile.caregivers.length > 0 ? `+${profile.caregivers.length}명` : ''}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProfileList;