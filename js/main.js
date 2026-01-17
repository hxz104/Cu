// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动导航
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 页面加载动画 - 启用新的滚动动画
    const elementsToAnimate = document.querySelectorAll('.photo-card, .info-card, .section-title, .hero-title, .hero-subtitle, .stitch-img, .milestone-item, .snack-item, .movie-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 为不同类型的元素添加不同的动画效果
                if(entry.target.classList.contains('photo-card')) {
                    entry.target.classList.add('slide-in-left');
                } else if(entry.target.classList.contains('info-card')) {
                    entry.target.classList.add('bounce-in');
                } else if(entry.target.classList.contains('milestone-item') || 
                       entry.target.classList.contains('snack-item') || 
                       entry.target.classList.contains('movie-item')) {
                    entry.target.classList.add('slide-in-right');
                }
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });

    // 翻牌效果用于照片卡片
    const photoCards = document.querySelectorAll('.photo-card');
    photoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });

    // 史迪奇图片悬停效果增强
    const stitchHoverImg = document.querySelector('.stitch-img');
    if (stitchHoverImg) {
        stitchHoverImg.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
        });

        stitchHoverImg.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }

    // 添加一些随机的史迪奇表情变化和互动
    let lastStitchChange = 0;
    setInterval(() => {
        const now = Date.now();
        if (now - lastStitchChange > 10000) { // 每10秒改变一次
            const stitchDiv = document.querySelector('.stitch-decoration');
            if (stitchDiv) {
                stitchDiv.style.animation = 'none';
                setTimeout(() => {
                    stitchDiv.style.animation = 'float 3s ease-in-out infinite';
                }, 10);
                lastStitchChange = now;
            }
        }
    }, 10000);
    
    // 点击史迪奇会有特殊效果
    const stitchImg = document.querySelector('.stitch-img');
    if (stitchImg) {
        stitchImg.addEventListener('click', function() {
            this.style.transform = 'scale(0.9) rotate(15deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
            
            // 创建爱心飘落效果
            createLoveEffect();
        });
    }
    
    // 添加滚动视差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.section');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 - (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
    });

    // 添加背景粒子效果
    createBackgroundParticles();

    // 添加移动端菜单功能
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击导航链接后关闭移动端菜单
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // 欢迎弹窗功能
    const welcomeModal = document.getElementById('welcomeModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    // 页面加载完成后显示欢迎弹窗
    setTimeout(() => {
        if (welcomeModal) {
            welcomeModal.classList.remove('hidden');
        }
    }, 500);
    
    // 关闭弹窗功能
    if (closeModalBtn && welcomeModal) {
        closeModalBtn.addEventListener('click', function() {
            welcomeModal.classList.add('hidden');
            
            // 添加一些特效再完全隐藏
            setTimeout(() => {
                welcomeModal.style.display = 'none';
            }, 500);
        });
        
        // 点击遮罩层也可以关闭弹窗
        welcomeModal.addEventListener('click', function(e) {
            if (e.target === welcomeModal) {
                welcomeModal.classList.add('hidden');
                setTimeout(() => {
                    welcomeModal.style.display = 'none';
                }, 500);
            }
        });
    }
    
    // 添加鼠标跟随效果
    addMouseFollower();
});

// 创建爱心飘落效果
function createLoveEffect() {
    const loveContainer = document.body;
    const loveCount = 5;
    
    for (let i = 0; i < loveCount; i++) {
        const love = document.createElement('div');
        love.innerHTML = '❤️';
        love.style.position = 'fixed';
        love.style.fontSize = (Math.random() * 20 + 20) + 'px';
        love.style.left = (Math.random() * 100) + 'vw';
        love.style.top = '-30px';
        love.style.zIndex = '9998';
        love.style.pointerEvents = 'none';
        love.style.userSelect = 'none';
        love.style.opacity = '0.8';
        love.style.transition = 'all 0.3s ease';
        
        // 添加随机颜色
        const colors = ['#ff6b6b', '#ff8e8e', '#ffa0a0', '#ffc0cb', '#ff69b4'];
        love.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        // 添加动画
        const animation = document.createElement('style');
        animation.textContent = `
            @keyframes loveFall${i} {
                0% {
                    transform: translateY(0) rotate(0deg) scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg) scale(0.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(animation);
        
        love.style.animation = `loveFall${i} ${Math.random() * 3 + 2}s linear forwards`;
        loveContainer.appendChild(love);
        
        // 移除元素
        setTimeout(() => {
            if (love.parentNode) {
                love.parentNode.removeChild(love);
            }
        }, 5000);
    }
}

// 创建背景粒子效果函数
function createBackgroundParticles() {
    const container = document.body;
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = Math.random() * 10 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = `rgba(135, 206, 235, ${Math.random() * 0.3})`;
        particle.style.borderRadius = '50%';
        particle.style.zIndex = '-1';
        particle.style.pointerEvents = 'none';
        
        // 随机初始位置
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        
        // 添加漂浮动画
        particle.style.animation = `floatParticle ${Math.random() * 20 + 10}s linear infinite`;
        
        container.appendChild(particle);
    }

    // 添加粒子动画到样式中
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: ${Math.random() * 0.3};
            }
            25% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                opacity: ${Math.random() * 0.5};
            }
            75% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
                opacity: ${Math.random() * 0.3};
            }
        }
    `;
    document.head.appendChild(style);
}

// 添加鼠标跟随效果
function addMouseFollower() {
    const follower = document.createElement('div');
    follower.style.position = 'fixed';
    follower.style.width = '20px';
    follower.style.height = '20px';
    follower.style.backgroundColor = 'rgba(135, 206, 235, 0.3)';
    follower.style.borderRadius = '50%';
    follower.style.pointerEvents = 'none';
    follower.style.zIndex = '9999';
    follower.style.mixBlendMode = 'multiply';
    follower.style.transition = 'transform 0.1s ease';
    follower.style.left = '-100px'; // 初始隐藏
    follower.style.top = '-100px';
    document.body.appendChild(follower);

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let requestAnimationFrameId;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateFollower() {
        const speed = 0.1;
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;

        follower.style.left = followerX - 10 + 'px';
        follower.style.top = followerY - 10 + 'px';

        requestAnimationFrameId = requestAnimationFrame(animateFollower);
    }

    animateFollower();

    // 鼠标悬停在特定元素上时放大跟随器
    const hoverElements = document.querySelectorAll('a, button, .photo-card, .info-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.style.transform = 'scale(2)';
            follower.style.backgroundColor = 'rgba(135, 206, 235, 0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            follower.style.transform = 'scale(1)';
            follower.style.backgroundColor = 'rgba(135, 206, 235, 0.3)';
        });
    });
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}