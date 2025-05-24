import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HallVoiceSounds } from "@/lib/api";
import { AudioPlayer } from "@/components/ui/audio-player";

interface HallVoiceCardProps {
  sounds: HallVoiceSounds;
}

export function HallVoiceCard({ sounds }: HallVoiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="font-mono">Hall Voice</CardTitle>
          <CardDescription>Student&apos;s hall voice sounds</CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {!sounds.hasHallVoice ? (
            <div className="text-center py-6 text-muted-foreground">
              No hall voice configured
            </div>
          ) : (
            <div className="space-y-6">
              {sounds.inSounds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Ins</h3>
                  <div className="grid gap-2">
                    {sounds.inSounds.map((sound, index) => (
                      <AudioPlayer
                        key={`in-${index}`}
                        src={sound}
                      />
                    ))}
                  </div>
                </div>
              )}

              {sounds.outSounds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Outs</h3>
                  <div className="grid gap-2">
                    {sounds.outSounds.map((sound, index) => (
                      <AudioPlayer
                        key={`out-${index}`}
                        src={sound}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
