import React from 'react';
import {
  Breadcrumbs,
  Typography,
  Link,
  Box
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface TracePath {
  name: string;
  path: string;
  isActive?: boolean;
}

interface TraceProps {
  paths?: TracePath[];
}

/**
 * 경로 네비게이션 컴포넌트 (브레드크럼)
 */
const Trace: React.FC<TraceProps> = ({ paths }) => {
  const location = useLocation();

  // 현재 경로에서 브레드크럼 생성 (경로가 명시적으로 주어지지 않은 경우)
  const generatePathsFromLocation = (): TracePath[] => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');

    // 패스 세그먼트가 없으면 홈만 표시
    if (pathSegments.length === 0) {
      return [{ name: '홈', path: '/', isActive: true }];
    }

    // 경로 세그먼트를 브레드크럼 경로로 변환
    const generatedPaths: TracePath[] = [{ name: '홈', path: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // 경로 이름 매핑
      let name = segment;
      switch (segment) {
        case 'care-subjects':
          name = '케어 대상';
          break;
        case 'create':
          name = '생성';
          break;
        case 'edit':
          name = '수정';
          break;
        case 'infant':
          name = '신생아';
          break;
        default:
          // ID로 보이는 숫자만 있는 세그먼트인 경우 생략
          if (/^\d+$/.test(segment)) {
            return;
          }
          // 첫 글자를 대문자로 변환
          name = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      generatedPaths.push({
        name,
        path: currentPath,
        isActive: index === pathSegments.length - 1
      });
    });

    return generatedPaths;
  };

  // 커스텀 경로가 제공되었으면 사용, 아니면 현재 위치에서 생성
  const breadcrumbPaths = paths || generatePathsFromLocation();

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbPaths.map((item, index) => {
          // 마지막 항목이거나 활성 상태로 표시된 항목
          const isLast = index === breadcrumbPaths.length - 1 || item.isActive;

          return isLast ? (
            <Typography
              key={item.path}
              color="text.primary"
              fontWeight="medium"
            >
              {item.name}
            </Typography>
          ) : (
            <Link
              key={item.path}
              component={RouterLink}
              to={item.path}
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  textDecoration: 'none',
                  color: 'primary.main'
                }
              }}
            >
              {index === 0 ? (
                <>
                  <HomeIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                  {item.name}
                </>
              ) : (
                item.name
              )}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Trace;