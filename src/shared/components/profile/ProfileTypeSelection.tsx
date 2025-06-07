import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ElderlyIcon from '@mui/icons-material/Elderly';
import PetsIcon from '@mui/icons-material/Pets';
import { ProfileType } from '@/api/careSubjectApi';

interface ProfileTypeSelectionProps {
  profileType: ProfileType;
  setProfileType: (type: ProfileType) => void;
}

/**
 * 프로필 유형 선택 컴포넌트
 */
const ProfileTypeSelection: React.FC<ProfileTypeSelectionProps> = ({
                                                                     profileType,
                                                                     setProfileType
                                                                   }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileType(event.target.value as ProfileType);
  };

  // 프로필 유형 옵션 정의
  const profileTypes = [
    {
      value: ProfileType.INFANT,
      label: '신생아',
      description: '0~24개월 영아를 위한 프로필입니다. 체중, 신장, 체온 등 영아 특화 데이터를 기록할 수 있습니다.',
      icon: <ChildCareIcon sx={{ fontSize: 60, color: '#3AAA8F' }} />,
      available: true // 1차 개발에서 사용 가능
    },
    {
      value: 'CHILD',
      label: '어린이',
      description: '2~12세 어린이를 위한 프로필입니다. 연령대별 발달 단계와 학교/교육 일정 관리가 가능합니다.',
      icon: <PersonIcon sx={{ fontSize: 60, color: '#888' }} />,
      available: false // 2차 개발 예정
    },
    {
      value: 'ELDERLY',
      label: '노인',
      description: '노인 케어를 위한 프로필입니다. 만성질환 관리, 약물 상호작용 체크, 인지능력 모니터링 등이 가능합니다.',
      icon: <ElderlyIcon sx={{ fontSize: 60, color: '#888' }} />,
      available: false // 2차 개발 예정
    },
    {
      value: 'PET',
      label: '반려동물',
      description: '반려동물을 위한 프로필입니다. 종별 특화 건강 지표, 예방접종 및 구충제 일정 관리가 가능합니다.',
      icon: <PetsIcon sx={{ fontSize: 60, color: '#888' }} />,
      available: false // 2차 개발 예정
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        케어 대상 유형을 선택해주세요
      </Typography>

      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{ mb: 2 }}>
          케어 대상에 맞는 프로필 유형을 선택하시면 해당 대상에 특화된 기능을 이용하실 수 있습니다.
        </FormLabel>

        <RadioGroup
          aria-label="profile-type"
          name="profile-type"
          value={profileType}
          onChange={handleChange}
        >
          <Grid container spacing={3}>
            {profileTypes.map((type) => (
              <Grid item xs={12} sm={6} key={type.value}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: type.available ? 'pointer' : 'not-allowed',
                    borderColor: profileType === type.value ? '#3AAA8F' : 'divider',
                    borderWidth: profileType === type.value ? 2 : 1,
                    height: '100%',
                    opacity: type.available ? 1 : 0.6,
                    position: 'relative',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: type.available ? '#3AAA8F' : 'divider',
                      boxShadow: type.available ? '0 0 0 1px #3AAA8F' : 'none'
                    }
                  }}
                  onClick={() => type.available && setProfileType(type.value as ProfileType)}
                >
                  {!type.available && (
                    <Paper
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        px: 1,
                        py: 0.5,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        borderRadius: 1,
                        fontSize: '0.75rem'
                      }}
                    >
                      2차 개발 예정
                    </Paper>
                  )}
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <FormControlLabel
                      value={type.value}
                      control={
                        <Radio
                          disabled={!type.available}
                          sx={{
                            '&.Mui-checked': {
                              color: '#3AAA8F'
                            }
                          }}
                        />
                      }
                      label=""
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        margin: 0
                      }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {type.icon}
                      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
                        {type.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default ProfileTypeSelection;