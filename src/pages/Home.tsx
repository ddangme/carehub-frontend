import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardActionArea,
  Avatar,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import Trace from '@/shared/components/common/Trace';
import SubjectSelector from '@/shared/components/profile/SubjectSelector';
import { useCareSubject } from '@/shared/contexts/CareSubjectContext';

/**
 * 홈 페이지 컴포넌트
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedSubject, careSubjects } = useCareSubject();

  return (
    <Box>
      {/* 경로 네비게이션 */}
      <Trace paths={[{ name: '홈', path: '/', isActive: true }]} />

      {/* 헤더 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="medium">
          대시보드
        </Typography>

        <SubjectSelector />
      </Box>

      {/* 케어 대상이 없는 경우 안내 */}
      {careSubjects.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
          <ChildCareIcon sx={{ fontSize: 60, color: '#3AAA8F', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            케어 대상을 추가해보세요
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            첫 번째 케어 대상을 추가하고 건강 상태와 활동을 기록해보세요.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/care-subjects/create')}
            sx={{ mt: 2 }}
          >
            케어 대상 추가하기
          </Button>
        </Paper>
      ) : (
        /* 케어 대상이 있는 경우 대시보드 표시 */
        <Stack spacing={3}>
          {/* 빠른 링크 섹션 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              빠른 링크
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(4, 1fr)'
                },
                gap: 2
              }}
            >
              <Card>
                <CardActionArea
                  onClick={() => navigate('/care-subjects/create')}
                  sx={{ p: 2, textAlign: 'center' }}
                >
                  <PersonAddIcon sx={{ fontSize: 40, color: '#3AAA8F', mb: 1 }} />
                  <Typography variant="body1" fontWeight="medium">
                    케어 대상 추가
                  </Typography>
                </CardActionArea>
              </Card>

              <Card>
                <CardActionArea
                  onClick={() => navigate('/schedules')}
                  sx={{ p: 2, textAlign: 'center' }}
                >
                  <EventNoteIcon sx={{ fontSize: 40, color: '#5D5FEF', mb: 1 }} />
                  <Typography variant="body1" fontWeight="medium">
                    일정 관리
                  </Typography>
                </CardActionArea>
              </Card>

              <Card>
                <CardActionArea
                  onClick={() => navigate('/health-data')}
                  sx={{ p: 2, textAlign: 'center' }}
                >
                  <HealthAndSafetyIcon sx={{ fontSize: 40, color: '#FE8269', mb: 1 }} />
                  <Typography variant="body1" fontWeight="medium">
                    건강 기록
                  </Typography>
                </CardActionArea>
              </Card>

              <Card>
                <CardActionArea
                  onClick={() => navigate('/care-subjects')}
                  sx={{ p: 2, textAlign: 'center' }}
                >
                  <ChildCareIcon sx={{ fontSize: 40, color: '#3AAA8F', mb: 1 }} />
                  <Typography variant="body1" fontWeight="medium">
                    케어 대상 관리
                  </Typography>
                </CardActionArea>
              </Card>
            </Box>
          </Box>

          {/* 현재 선택된 케어 대상 정보 */}
          {selectedSubject && (
            <Box>
              <Typography variant="h6" gutterBottom>
                현재 선택: {selectedSubject.name}
              </Typography>
              <Paper sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    alignItems: { xs: 'center', md: 'flex-start' }
                  }}
                >
                  {/* 프로필 이미지 및 버튼 */}
                  <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
                    {selectedSubject.profileImageUrl ? (
                      <Avatar
                        src={selectedSubject.profileImageUrl}
                        alt={selectedSubject.name}
                        sx={{
                          width: { xs: 120, md: 150 },
                          height: { xs: 120, md: 150 },
                          mx: 'auto',
                          mb: 2
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: { xs: 120, md: 150 },
                          height: { xs: 120, md: 150 },
                          fontSize: { xs: '3rem', md: '4rem' },
                          bgcolor: '#D4F0E8',
                          color: '#3AAA8F',
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        {selectedSubject.name.charAt(0)}
                      </Avatar>
                    )}
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/care-subjects/${selectedSubject.subjectType === 'INFANT' ? 'infant/' : ''}${selectedSubject.id}`)}
                    >
                      프로필 보기
                    </Button>
                  </Box>

                  {/* 설명 및 액션 버튼 */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" paragraph>
                      {selectedSubject.description || `${selectedSubject.name}에 대한 정보를 기록하고 관리할 수 있습니다.`}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/care-subjects/${selectedSubject.id}/health-records/create`)}
                      >
                        건강 정보 기록
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/care-subjects/${selectedSubject.id}/schedules/create`)}
                      >
                        일정 추가
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/care-subjects/${selectedSubject.id}/notes/create`)}
                      >
                        메모 작성
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default HomePage;