// ========================================
// Igh Studio - Custom Video Player
// ========================================

class VideoPlayer {
    constructor(videoElement) {
        this.video = videoElement;
        this.wrapper = this.video.closest('.video-wrapper');
        this.controls = this.wrapper.querySelector('.video-controls');
        this.playBtn = this.wrapper.querySelector('.video-play-btn');
        this.muteBtn = this.wrapper.querySelector('.video-mute-btn');                                                                                 
        this.fullscreenBtn = this.wrapper.querySelector('.video-fullscreen-btn');
        this.progressBar = this.wrapper.querySelector('.progress-bar');
        this.progressHandle = this.wrapper.querySelector('.progress-handle');
        this.progressContainer = this.wrapper.querySelector('.video-progress');
        this.currentTimeEl = this.wrapper.querySelector('.current-time');
        this.durationEl = this.wrapper.querySelector('.duration');
        this.overlay = this.wrapper.querySelector('.video-overlay');
        
        this.isPlaying = false;
        this.isMuted = true; // Start muted for autoplay
        this.volume = 1;
        
        this.init();
    }
    
    init() {
        // Set video attributes
        this.video.muted = true;
        this.video.playsInline = true;
        
        // Try autoplay
        this.video.play().catch(() => {
            console.log('Autoplay prevented - showing overlay');
            this.showOverlay();
        });
        
        // Event Listeners
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('loadedmetadata', () => this.setDuration());
        this.video.addEventListener('play', () => this.onPlay());
        this.video.addEventListener('pause', () => this.onPause());
        this.video.addEventListener('ended', () => this.onEnded());
        
        // Controls
        this.playBtn?.addEventListener('click', () => this.togglePlay());
        this.muteBtn?.addEventListener('click', () => this.toggleMute());
        this.fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());
        
        // Progress bar
        this.progressContainer?.addEventListener('click', (e) => this.seek(e));
        this.progressContainer?.addEventListener('mousemove', (e) => this.handleProgressHover(e));
        this.progressContainer?.addEventListener('mouseleave', () => this.hideProgressHandle());
        
        // Keyboard controls
        this.video.addEventListener('click', () => this.togglePlay());
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Overlay buttons
        this.wrapper.querySelectorAll('.overlay-buttons .btn').forEach(btn => {
            btn.addEventListener('click', () => this.hideOverlay());
        });
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.video.pause();
        } else {
            this.video.play();
            this.hideOverlay();
        }
    }
    
    toggleMute() {
        this.video.muted = !this.video.muted;
        this.isMuted = this.video.muted;
        this.updateMuteButton();
    }
    
    updateMuteButton() {
        if (!this.muteBtn) return;
        
        const icon = this.muteBtn.querySelector('svg');
        if (icon) {
            if (this.isMuted) {
                icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3z"/>';
            } else {
                icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
            }
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.wrapper.requestFullscreen();
            this.fullscreenBtn.classList.add('active');
        } else {
            document.exitFullscreen();
            this.fullscreenBtn.classList.remove('active');
        }
    }
    
    seek(e) {
        const rect = this.progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = pos * this.video.duration;
    }
    
    updateProgress() {
        if (!this.video.duration) return;
        
        const progress = (this.video.currentTime / this.video.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        
        if (this.progressHandle) {
            this.progressHandle.style.left = `${progress}%`;
        }
        
        this.updateTimeDisplay();
    }
    
    setDuration() {
        if (this.durationEl) {
            const duration = this.formatTime(this.video.duration);
            this.durationEl.textContent = duration;
        }
    }
    
    updateTimeDisplay() {
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = this.formatTime(this.video.currentTime);
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    onPlay() {
        this.isPlaying = true;
        this.playBtn?.classList.add('playing');
        this.hideOverlay();
    }
    
    onPause() {
        this.isPlaying = false;
        this.playBtn?.classList.remove('playing');
        this.showOverlay();
    }
    
    onEnded() {
        this.isPlaying = false;
        this.playBtn?.classList.remove('playing');
        this.showOverlay();
        this.video.currentTime = 0;
    }
    
    showOverlay() {
        if (this.overlay) {
            this.overlay.classList.add('active');
        }
    }
    
    hideOverlay() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
    }
    
    handleProgressHover(e) {
        if (!this.progressHandle) return;
        
        const rect = this.progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const handlePos = Math.max(0, Math.min(100, pos * 100));
        
        this.progressHandle.style.left = `${handlePos}%`;
        this.progressHandle.style.opacity = '1';
        
        // Show preview time
        const previewTime = pos * this.video.duration;
        this.showPreviewTime(e.clientX, previewTime);
    }
    
    hideProgressHandle() {
        if (this.progressHandle) {
            this.progressHandle.style.opacity = '0';
        }
        this.hidePreviewTime();
    }
    
    showPreviewTime(x, time) {
        let preview = this.wrapper.querySelector('.time-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.className = 'time-preview';
            this.wrapper.appendChild(preview);
        }
        
        preview.style.left = `${x}px`;
        preview.textContent = this.formatTime(time);
        preview.style.opacity = '1';
    }
    
    hidePreviewTime() {
        const preview = this.wrapper.querySelector('.time-preview');
        if (preview) {
            preview.style.opacity = '0';
        }
    }
    
    handleKeyboard(e) {
        // Space bar for play/pause
        if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
            e.preventDefault();
            this.togglePlay();
        }
        
        // M key for mute
        if (e.code === 'KeyM') {
            e.preventDefault();
            this.toggleMute();
        }
        
        // F key for fullscreen
        if (e.code === 'KeyF') {
            e.preventDefault();
            this.toggleFullscreen();
        }
        
        // Arrow keys for seeking
        if (e.code === 'ArrowRight') {
            e.preventDefault();
            this.video.currentTime += 10;
        }
        
        if (e.code === 'ArrowLeft') {
            e.preventDefault();
            this.video.currentTime -= 10;
        }
    }
}

// Initialize video player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('welcome-video');
    if (video) {
        new VideoPlayer(video);
    }
});
