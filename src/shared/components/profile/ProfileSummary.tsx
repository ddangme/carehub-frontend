import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Stack, Button,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ProfileType } from '@/api/careSubjectApi';

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

interface ProfileSummaryProps {
  profileType: ProfileType;
  basicInfo: {
    name: string;
    birthDate: string;
    gender: string;
    bloodType: string;
    description: string;
    profileImageUrl: string;
    additionalCaregiverIds: number[];
  };
  infantInfo?: {
    birthWeightGrams?: number;
    birthHeightCm?: number;
    headCircumferenceCm?: number;
    gestationalAgeWeeks?: number;
    deliveryType: string;
    allergies: string;
    specialCareNeeds: string;
    lastCheckupDate: string;
  };
  showSaveButton?: boolean; // 저장 버튼 표시 여부 제어
  onSave?: () => void; // 저장 함수 (옵션)
}

/**
 * 프로필 정보 확인 컴포넌트
 */
const ProfileSummary: React.FC<ProfileSummaryProps> = ({
                                                         profileType,
                                                         basicInfo,
                                                         infantInfo,
                                                         showSaveButton = false,
                                                         onSave
                                                       }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        프로필 정보 확인
      </Typography>

      <Typography variant="body1" paragraph>
        입력하신 정보를 확인하고 프로필을 저장해주세요. 모든 정보는 저장 후에도 수정할 수 있습니다.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        {/* 기본 정보 */}
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              기본 정보
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>

          {/* 프로필 이미지와 기본 정보 */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'center', md: 'flex-start' }}
          >
            {/* 프로필 이미지 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              {basicInfo.profileImageUrl ? (
                <Avatar
                  alt={basicInfo.name}
                  src={basicInfo.profileImageUrl}
                  sx={{ width: 150, height: 150 }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 150,
                    height: 150,
                    fontSize: '3rem',
                    bgcolor: '#D4F0E8',
                    color: '#3AAA8F'
                  }}
                >
                  {basicInfo.name.charAt(0)}
                </Avatar>
              )}
            </Box>

            {/* 기본 정보 리스트 */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <List disablePadding>
                <ListItem>
                  <ListItemText
                    primary="이름"
                    secondary={basicInfo.name || '-'}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="생년월일"
                    secondary={basicInfo.birthDate ? format(parseISO(basicInfo.birthDate), 'yyyy년 MM월 dd일') : '-'}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="성별"
                    secondary={basicInfo.gender ? genderMap[basicInfo.gender] : '-'}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="혈액형"
                    secondary={basicInfo.bloodType ? bloodTypeMap[basicInfo.bloodType] : '-'}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              </List>
            </Box>
          </Stack>

          {/* 설명 */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              설명
            </Typography>
            <Typography variant="body1" paragraph>
              {basicInfo.description || '-'}
            </Typography>
          </Box>

          {/* 추가 보호자 */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              추가 보호자
            </Typography>
            <Box sx={{ mt: 1 }}>
              {basicInfo.additionalCaregiverIds && basicInfo.additionalCaregiverIds.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {/* 여기서는 더미 데이터 사용, 실제로는 API 연동 필요 */}
                  {basicInfo.additionalCaregiverIds.map((id) => (
                    <Chip
                      key={id}
                      label={`보호자 #${id}`}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body1">추가 보호자 없음</Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* 신생아 프로필인 경우 추가 정보 표시 */}
      {profileType === ProfileType.INFANT && infantInfo && (
        <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                신생아 정보
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Box>

            {/* 출생 정보와 건강 정보를 가로로 배치 */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
            >
              {/* 출생 정보 */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  출생 정보
                </Typography>
                <List disablePadding>
                  <ListItem>
                    <ListItemText
                      primary="출생 체중"
                      secondary={infantInfo.birthWeightGrams ? `${infantInfo.birthWeightGrams} g` : '-'}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="출생 신장"
                      secondary={infantInfo.birthHeightCm ? `${infantInfo.birthHeightCm} cm` : '-'}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="머리 둘레"
                      secondary={infantInfo.headCircumferenceCm ? `${infantInfo.headCircumferenceCm} cm` : '-'}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="재태 기간"
                      secondary={infantInfo.gestationalAgeWeeks ? `${infantInfo.gestationalAgeWeeks} 주` : '-'}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="분만 유형"
                      secondary={infantInfo.deliveryType ? deliveryTypeMap[infantInfo.deliveryType] : '-'}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                </List>
              </Box>

              {/* 건강 정보 */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  건강 정보
                </Typography>
                <List disablePadding>
                  <ListItem>
                    <ListItemText
                      primary="알레르기"
                      secondary={infantInfo.allergies || '-'}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="마지막 검진일"
                      secondary={infantInfo.lastCheckupDate ? format(parseISO(infantInfo.lastCheckupDate), 'yyyy년 MM월 dd일') : '-'}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                </List>
              </Box>
            </Stack>

            {/* 특별 케어 요구사항 */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                특별 케어 요구사항
              </Typography>
              <Typography variant="body1" paragraph>
                {infantInfo.specialCareNeeds || '-'}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* 조건부 저장 버튼 (외부에서 제어) */}
      {showSaveButton && onSave && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onSave}
            sx={{ px: 4, py: 1 }}
          >
            프로필 저장
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProfileSummary;