import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  active: boolean;
  onComplete: () => void;
}

function Confetti({ active, onComplete }: ConfettiProps) {
  useEffect(() => {
    if (active) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#bb0000', '#ffffff']
        });
        
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#bb0000', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          onComplete();
        }
      };

      frame();
    }
  }, [active, onComplete]);

  return null;
}

export default Confetti;