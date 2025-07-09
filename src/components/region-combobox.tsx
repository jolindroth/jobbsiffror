import { SearchableCombobox } from './searchable-combobox';
import { SWEDISH_REGIONS } from '@/constants/swedish-regions';

interface RegionComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function RegionCombobox({
  value,
  onValueChange,
  disabled
}: RegionComboboxProps) {
  // Sort regions alphabetically
  const sortedRegions = SWEDISH_REGIONS.sort((a, b) =>
    a.name.localeCompare(b.name, 'sv')
  );

  // Create items array with "all" option first
  const items = [
    { value: 'all', label: 'Alla regioner' },
    ...sortedRegions.map((region) => ({
      value: region.urlSlug,
      label: region.name
    }))
  ];

  return (
    <SearchableCombobox
      items={items}
      value={value}
      onValueChange={onValueChange}
      placeholder='Välj region'
      searchPlaceholder='Sök region...'
      emptyMessage='Ingen region hittades.'
      disabled={disabled}
      className='w-full'
    />
  );
}
