import Image from 'next/image';
import type { Phone } from '@/data/phones';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PhoneSelectorProps {
  phones: Phone[];
  selectedPhoneIds: number[];
  onPhoneSelectionChange: (phoneId: number, isSelected: boolean) => void;
  selectionLimitReached: boolean;
}

export default function PhoneSelector({
  phones,
  selectedPhoneIds,
  onPhoneSelectionChange,
  selectionLimitReached
}: PhoneSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {phones.map(phone => {
        const isSelected = selectedPhoneIds.includes(phone.id);
        const isDisabled = !isSelected && selectionLimitReached;
        const aiHint = phone.brand === 'Pixel' ? 'smartphone technology' : phone.brand === 'Apex' ? 'futuristic smartphone' : phone.brand === 'Orchard' ? 'sleek smartphone' : 'android phone';
        return (
          <Label
            key={phone.id}
            htmlFor={`phone-${phone.id}`}
            className={`block rounded-lg border-2 bg-card text-card-foreground shadow-sm transition-all duration-200 ${
              isDisabled 
                ? 'cursor-not-allowed opacity-60' 
                : 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
            } ${
              isSelected
                ? 'border-accent ring-2 ring-accent'
                : 'border-border'
            }`}
          >
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="p-4 flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-headline leading-none tracking-tight pr-2">
                  {phone.model}
                </CardTitle>
                <Checkbox
                  id={`phone-${phone.id}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    if (isDisabled && checked) return;
                    onPhoneSelectionChange(phone.id, !!checked)
                  }}
                  disabled={isDisabled}
                  className="size-5"
                />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="aspect-square relative w-full overflow-hidden rounded-md bg-muted">
                  <Image
                    src={phone.image}
                    alt={phone.model}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover"
                    data-ai-hint={aiHint}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-body">{phone.brand}</p>
              </CardContent>
            </Card>
          </Label>
        );
      })}
    </div>
  );
}
