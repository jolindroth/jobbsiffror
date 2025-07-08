import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { OCCUPATION_GROUPS } from '@/constants/occupation-groups';

interface OccupationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function OccupationSelect({
  value,
  onValueChange,
  disabled
}: OccupationSelectProps) {
  // Sort occupations alphabetically
  const sortedOccupations = OCCUPATION_GROUPS.sort((a, b) =>
    a.name.localeCompare(b.name, 'sv')
  );

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder='Välj yrkesgrupp' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>Alla yrkesgrupper</SelectItem>
        {sortedOccupations.map((occupation) => (
          <SelectItem key={occupation.id} value={occupation.urlSlug}>
            {occupation.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
