import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SWEDISH_REGIONS } from '@/constants/swedish-regions';

interface RegionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function RegionSelect({
  value,
  onValueChange,
  disabled
}: RegionSelectProps) {
  // Sort regions alphabetically
  const sortedRegions = SWEDISH_REGIONS.sort((a, b) =>
    a.name.localeCompare(b.name, 'sv')
  );

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder='Välj region' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>Alla regioner</SelectItem>

        {sortedRegions.map((region) => (
          <SelectItem key={region.code} value={region.urlSlug}>
            {region.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
