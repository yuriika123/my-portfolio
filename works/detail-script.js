document.addEventListener('DOMContentLoaded', () => {
    // コンテナのフェードイン表示
    const container = document.getElementById('project-container');
    if (container) {
        setTimeout(() => {
            container.style.opacity = '1';
        }, 100);
    }

    // 動画の自動再生を確実にする
    const videos = document.querySelectorAll('.detail-video');
    videos.forEach(video => {
        video.play().catch(error => console.log('Video autoplay blocked.', error));
    });
});