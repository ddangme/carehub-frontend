import React, { useState } from 'react';
import {
  Box,
  MenuItem,
  Avatar,
  Typography,
  Button,
  Menu,
  ListItemIcon,
  ListItemText,
  Skeleton,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PersonIcon from '@mui/icons-material/Person';
import ElderlyIcon from '@mui/icons-material/Elderly';
import PetsIcon from '@mui/icons-material/Pets';
import { useCareSubject } from '@/shared/contexts/CareSubjectContext';

/**
 * 케어 대상 선택기 컴포넌트
 */
const SubjectSelector: React.FC = () => {
  const navigate = useNavigate();
  const { selectedSubject, selectSubject, careSubjects, loading } = useCareSubject();

  // 메뉴 상태 관리
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // 메뉴 열기
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 메뉴 닫기
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 케어 대상 변경
  const handleSubjectChange = (id: number) => {
    const subject = careSubjects.find(s => s.id === id) || null;
    selectSubject(subject);
    handleClose();
  };

  // 케어 대상 유형에 따른 아이콘 선택
  const getSubjectIcon = (type: string) => {
    switch (type) {
      case 'INFANT':
        return <ChildCareIcon sx={{ fontSize: 20 }} />;
      case 'CHILD':
        return <PersonIcon sx={{ fontSize: 20 }} />;
      case 'ELDERLY':
        return <ElderlyIcon sx={{ fontSize: 20 }} />;
      case 'PET':
        return <PetsIcon sx={{ fontSize: 20 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 20 }} />;
    }
  };

  // 케어 대상 관리 페이지로 이동
  const handleManageSubjects = () => {
    navigate('/care-subjects');
    handleClose();
  };

  // 케어 대상 추가 페이지로 이동
  const handleAddSubject = () => {
    navigate('/care-subjects/create');
    handleClose();
  };

  // 로딩 중 상태 렌더링
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
        <Skeleton width={150} height={40} />
      </Box>
    );
  }

  // 케어 대상이 없는 경우
  if (careSubjects.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="케어 대상 추가">
          <IconButton
            onClick={handleAddSubject}
            sx={{
              color: 'primary.main',
              bgcolor: 'primary.light',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white'
              }
            }}
          >
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 1 }}
        >
          케어 대상 추가하기
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          borderRadius: 2,
          minWidth: 200,
          justifyContent: 'flex-start',
          textTransform: 'none',
          px: 2,
          py: 1
        }}
      >
        {selectedSubject && (
          <>
            {selectedSubject.profileImageUrl ? (
              <Avatar
                src={selectedSubject.profileImageUrl}
                alt={selectedSubject.name}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  fontSize: '1rem',
                  bgcolor: '#D4F0E8',
                  color: '#3AAA8F'
                }}
              >
                {selectedSubject.name.charAt(0)}
              </Avatar>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {selectedSubject.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedSubject.subjectType === 'INFANT' ? '신생아' : '케어 대상'}
              </Typography>
            </Box>
          </>
        )}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 250,
            maxHeight: 350,
            overflow: 'auto',
            mt: 1,
            '& .MuiMenuItem-root': {
              py: 1.5,
            },
          }
        }}
      >
        {careSubjects.map((subject) => (
          <MenuItem
            key={subject.id}
            onClick={() => handleSubjectChange(subject.id)}
            selected={selectedSubject?.id === subject.id}
            sx={{
              borderLeft: selectedSubject?.id === subject.id ? 2 : 0,
              borderColor: 'primary.main',
              pl: selectedSubject?.id === subject.id ? 1.8 : 2
            }}
          >
            <ListItemIcon>
              {subject.profileImageUrl ? (
                <Avatar
                  src={subject.profileImageUrl}
                  alt={subject.name}
                  sx={{ width: 30, height: 30 }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    fontSize: '0.9rem',
                    bgcolor: '#D4F0E8',
                    color: '#3AAA8F'
                  }}
                >
                  {subject.name.charAt(0)}
                </Avatar>
              )}
            </ListItemIcon>
            <ListItemText
              primary={subject.name}
              secondary={subject.subjectType === 'INFANT' ? '신생아' : '케어 대상'}
              primaryTypographyProps={{
                fontWeight: selectedSubject?.id === subject.id ? 600 : 400
              }}
            />
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              {getSubjectIcon(subject.subjectType)}
            </ListItemIcon>
          </MenuItem>
        ))}

        <Box sx={{ px: 2, py: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleAddSubject}
            sx={{ mt: 1 }}
          >
            케어 대상 추가
          </Button>
          <Button
            fullWidth
            variant="text"
            startIcon={<ManageAccountsIcon />}
            onClick={handleManageSubjects}
            sx={{ mt: 1 }}
          >
            케어 대상 관리
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default SubjectSelector;