// src/shared/components/careRecord/CareRecordFilters.tsx
import React from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Box,
  IconButton,
  Tooltip,
  Stack,
  Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FilterListIcon from '@mui/icons-material/FilterList';
import { CareRecordType, recordTypeDisplayMap } from '@/api/careRecordApi';

interface CareRecordFiltersProps {
  selectedType: CareRecordType | 'ALL';
  onTypeChange: (type: CareRecordType | 'ALL') => void;
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

const CareRecordFilters: React.FC<CareRecordFiltersProps> = ({
                                                               selectedType,
                                                               onTypeChange,
                                                               startDate,
                                                               endDate,
                                                               onStartDateChange,
                                                               onEndDateChange,
                                                               showFilters,
                                                               onToggleFilters,
                                                               onClearFilters
                                                             }) => {
  const getTabIndex = () => {
    if (selectedType === 'ALL') return 0;
    const types = Object.values(CareRecordType);
    return types.indexOf(selectedType as CareRecordType) + 1;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      onTypeChange('ALL');
    } else {
      const types = Object.values(CareRecordType);
      onTypeChange(types[newValue - 1]);
    }
  };

  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Tabs
          value={getTabIndex()}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="전체" />
          {Object.entries(recordTypeDisplayMap).map(([type, display]) => (
            <Tab key={type} label={display} />
          ))}
        </Tabs>

        <Tooltip title="필터">
          <IconButton onClick={onToggleFilters}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 날짜 필터 */}
      {showFilters && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <DatePicker
                label="시작 날짜"
                value={startDate}
                onChange={onStartDateChange}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="종료 날짜"
                value={endDate}
                onChange={onEndDateChange}
                slotProps={{ textField: { size: 'small' } }}
              />
              <Button
                variant="outlined"
                onClick={onClearFilters}
                size="small"
              >
                초기화
              </Button>
            </Stack>
          </LocalizationProvider>
        </Box>
      )}
    </Paper>
  );
};

export default CareRecordFilters;
