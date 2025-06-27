import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioContext: AudioContext | null = null;
  private isEnabled = true;

  constructor() {
    // Inizializza AudioContext solo se supportato
    if (typeof AudioContext !== 'undefined') {
      this.audioContext = new AudioContext();
    } else if (typeof (window as any).webkitAudioContext !== 'undefined') {
      this.audioContext = new (window as any).webkitAudioContext();
    }
  }

  enableSound(): void {
    this.isEnabled = true;
  }

  disableSound(): void {
    this.isEnabled = false;
  }

  playAddToCartSound(): void {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      // Crea un suono sintetizzato per "aggiunto al carrello"
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configurazione del suono (suono positivo e allegro)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5

      // Envelope del volume
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  }

  playSuccessSound(): void {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      // Suono di successo più elaborato
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Due oscillatori per un suono più ricco
      oscillator1.type = 'sine';
      oscillator2.type = 'triangle';

      // Sequenza di note per un suono di successo
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, index) => {
        const time = this.audioContext!.currentTime + index * 0.1;
        oscillator1.frequency.setValueAtTime(freq, time);
        oscillator2.frequency.setValueAtTime(freq * 1.01, time); // Leggermente detuned per richezza
      });

      // Envelope
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

      oscillator1.start(this.audioContext.currentTime);
      oscillator2.start(this.audioContext.currentTime);
      oscillator1.stop(this.audioContext.currentTime + 0.5);
      oscillator2.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play success sound:', error);
    }
  }

  playClickSound(): void {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      // Suono di click breve e secco
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.05);
    } catch (error) {
      console.warn('Could not play click sound:', error);
    }
  }
}