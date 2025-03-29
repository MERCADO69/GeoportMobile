
export default class Timer {
    constructor(duration, onUpdate, onComplete) {
      this.duration = duration; 
      this.remainingTime = duration;
      this.onUpdate = onUpdate; 
      this.onComplete = onComplete; 
      this.timerInterval = null;
    }
  
    start() {
      if (this.timerInterval) return; // Prevent multiple intervals
  
      this.timerInterval = setInterval(() => {
        this.remainingTime--;
  
        if (this.onUpdate) this.onUpdate(this.remainingTime);
  
        if (this.remainingTime <= 0) {
          this.stop();
          if (this.onComplete) this.onComplete();
        }
      }, 1000);
    }
  
    stop() {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  
    reset() {
      this.stop();
      this.remainingTime = this.duration;
    }
  
    getFormattedTime() {
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
  }
  