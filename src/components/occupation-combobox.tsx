import { SearchableCombobox } from './searchable-combobox';
import { OCCUPATION_GROUPS } from '@/constants/occupation-groups';

interface OccupationComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function OccupationCombobox({
  value,
  onValueChange,
  disabled
}: OccupationComboboxProps) {
  // Sort occupations alphabetically
  const sortedOccupations = OCCUPATION_GROUPS.sort((a, b) =>
    a.name.localeCompare(b.name, 'sv')
  );

  // Create items array with "all" option first
  const items = [
    { value: 'all', label: 'Alla yrkesgrupper' },
    ...sortedOccupations.map((occupation) => ({
      value: occupation.urlSlug,
      label: occupation.name
    }))
  ];

  return (
    <SearchableCombobox
      items={items}
      value={value}
      onValueChange={onValueChange}
      placeholder='Välj yrkesgrupp'
      searchPlaceholder='Sök yrkesgrupp...'
      emptyMessage='Ingen yrkesgrupp hittades.'
      disabled={disabled}
      className='w-full'
    />
  );
}
