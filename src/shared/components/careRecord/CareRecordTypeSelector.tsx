import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stack
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { CareRecordType, recordTypeColorMap } from '@/api/careRecordApi';

interface CareRecordTypeSelectorProps {
  recordType: CareRecordType;
  setRecordType: (type: CareRecordType) => void;
}

/**
 * 케어 기록 유형 선택 컴포넌트
 */
const CareRecordTypeSelector: React.FC<CareRecordTypeSelectorProps> = ({
                                                                         recordType,
                                                                         setRecordType
                                                                       }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecordType(event.target.value as CareRecordType);
  };

  // 기록 유형 옵션 정의
  const recordTypes = [
    {
      value: CareRecordType.FEEDING,
      label: '식사',
      description: '수유, 이유식, 간식 등 식사 관련 기록입니다. 양, 시간, 종류를 기록할 수 있습니다.',
      icon: <RestaurantIcon sx={{ fontSize: 60, color: recordTypeColorMap[CareRecordType.FEEDING] }} />
    },
    {
      value: CareRecordType.SLEEP,
      label: '수면',
      description: '낮잠, 밤잠 등 수면 관련 기록입니다. 수면 시간과 품질을 기록할 수 있습니다.',
      icon: <BedtimeIcon sx={{ fontSize: 60, color: recordTypeColorMap[CareRecordType.SLEEP] }} />
    },
    {
      value: CareRecordType.DIAPER,
      label: '기저귀',
      description: '기저귀 교체 및 배변 관련 기록입니다. 상태와 특이사항을 기록할 수 있습니다.',
      icon: <ChildCareIcon sx={{ fontSize: 60, color: recordTypeColorMap[CareRecordType.DIAPER] }} />
    },
    {
      value: CareRecordType.HEALTH,
      label: '건강',
      description: '체온, 약물 복용, 증상 등 건강 관련 기록입니다. 상세한 건강 정보를 기록할 수 있습니다.',
      icon: <HealthAndSafetyIcon sx={{ fontSize: 60, color: recordTypeColorMap[CareRecordType.HEALTH] }} />
    },
    {
      value: CareRecordType.ACTIVITY,
      label: '활동',
      description: '놀이, 산책, 운동 등 활동 관련 기록입니다. 활동 내용과 시간을 기록할 수 있습니다.',
      icon: <SportsEsportsIcon sx={{ fontSize: 60, color: recordTypeColorMap[CareRecordType.ACTIVITY] }} />
    },
    {
      value: CareRecordType.OTHER,
      label: '기타',
      description: '위 카테고리에 해당하지 않는 기타 케어 활동을 기록할 수 있습니다.',
      icon: <MoreHorizIcon sx={{ fontSize: 60, color: recordTypeColorMap[CareRecordType.OTHER] }} />
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        어떤 종류의 기록을 남기시겠습니까?
      </Typography>

      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{ mb: 2 }}>
          기록하려는 케어 활동의 종류를 선택해주세요.
        </FormLabel>

        <RadioGroup
          aria-label="record-type"
          name="record-type"
          value={recordType}
          onChange={handleChange}
        >
          {/* Stack을 사용한 2열 레이아웃 */}
          <Stack spacing={3}>
            {/* 첫 번째 행 - 식사, 수면, 기저귀 */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              {recordTypes.slice(0, 3).map((type) => (
                <Box key={type.value} sx={{ flex: 1 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      borderColor: recordType === type.value ? recordTypeColorMap[type.value] : 'divider',
                      borderWidth: recordType === type.value ? 2 : 1,
                      height: '100%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: recordTypeColorMap[type.value],
                        boxShadow: `0 0 0 1px ${recordTypeColorMap[type.value]}`
                      }
                    }}
                    onClick={() => setRecordType(type.value)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <FormControlLabel
                        value={type.value}
                        control={
                          <Radio
                            sx={{
                              '&.Mui-checked': {
                                color: recordTypeColorMap[type.value]
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
                </Box>
              ))}
            </Stack>

            {/* 두 번째 행 - 건강, 활동, 기타 */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              {recordTypes.slice(3, 6).map((type) => (
                <Box key={type.value} sx={{ flex: 1 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      borderColor: recordType === type.value ? recordTypeColorMap[type.value] : 'divider',
                      borderWidth: recordType === type.value ? 2 : 1,
                      height: '100%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: recordTypeColorMap[type.value],
                        boxShadow: `0 0 0 1px ${recordTypeColorMap[type.value]}`
                      }
                    }}
                    onClick={() => setRecordType(type.value)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <FormControlLabel
                        value={type.value}
                        control={
                          <Radio
                            sx={{
                              '&.Mui-checked': {
                                color: recordTypeColorMap[type.value]
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
                </Box>
              ))}
            </Stack>
          </Stack>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default CareRecordTypeSelector;
