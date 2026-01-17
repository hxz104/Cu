// 史迪奇接星星游戏
class StitchGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.startBtn = document.getElementById('startGameBtn');
        
        // 游戏状态
        this.gameRunning = false;
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = 2;
        
        // 史迪奇属性
        this.stitch = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 80,
            width: 60,
            height: 60,
            speed: 8
        };
        
        // 星星数组
        this.stars = [];
        
        // 游戏元素颜色（蓝灰色调）
        this.colors = {
            stitch: '#87CEEB', // 雾霾蓝
            star: '#FFD700',   // 金色星星
            background: '#F5F5F5',
            heart: '#FF69B4'   // 粉色爱心（生命值）
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.drawInitialScreen();
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => {
            if (!this.gameRunning) {
                this.startGame();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.moveStitch('left');
                    break;
                case 'ArrowRight':
                    this.moveStitch('right');
                    break;
            }
        });
        
        // 触摸事件支持（移动端）
        let touchStartX = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (!this.gameRunning) return;
            e.preventDefault();
            
            const touchX = e.touches[0].clientX;
            const diff = touchX - touchStartX;
            
            if (Math.abs(diff) > 10) {
                if (diff > 0) {
                    this.moveStitch('right');
                } else {
                    this.moveStitch('left');
                }
                touchStartX = touchX;
            }
        });
    }
    
    moveStitch(direction) {
        if (direction === 'left') {
            this.stitch.x = Math.max(0, this.stitch.x - this.stitch.speed);
        } else if (direction === 'right') {
            this.stitch.x = Math.min(this.canvas.width - this.stitch.width, this.stitch.x + this.stitch.speed);
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.score = 0;
        this.lives = 3;
        this.stars = [];
        this.startBtn.textContent = '游戏中...';
        this.startBtn.disabled = true;
        
        // 开始游戏循环
        this.gameLoop();
        
        // 开始生成星星
        this.starSpawnInterval = setInterval(() => {
            this.spawnStar();
        }, 1000);
    }
    
    spawnStar() {
        if (!this.gameRunning) return;
        
        const star = {
            x: Math.random() * (this.canvas.width - 30),
            y: -30,
            width: 20,
            height: 20,
            speed: this.gameSpeed + Math.random() * 2,
            collected: false
        };
        
        this.stars.push(star);
    }
    
    update() {
        // 更新星星位置
        for (let i = this.stars.length - 1; i >= 0; i--) {
            const star = this.stars[i];
            star.y += star.speed;
            
            // 检查是否被收集
            if (this.checkCollision(this.stitch, star)) {
                star.collected = true;
                this.score += 10;
                this.stars.splice(i, 1);
            }
            // 检查是否掉落到底部
            else if (star.y > this.canvas.height) {
                this.lives--;
                this.stars.splice(i, 1);
                
                if (this.lives <= 0) {
                    this.endGame();
                }
            }
        }
        
        // 增加游戏难度
        if (this.score > 0 && this.score % 100 === 0) {
            this.gameSpeed = Math.min(5, 2 + Math.floor(this.score / 100) * 0.5);
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#e0f7fa');
        gradient.addColorStop(1, '#bbdefb');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制史迪奇（更可爱的造型）
        this.drawCuteStitch(this.stitch.x, this.stitch.y);
        
        // 绘制星星
        this.stars.forEach(star => {
            if (!star.collected) {
                this.drawStar(star.x + star.width/2, star.y + star.height/2, 8, 5);
            }
        });
        
        // 绘制UI信息
        this.drawUI();
    }
    
    drawStar(centerX, centerY, outerRadius, innerRadius) {
        const spikes = 5;
        let rotation = Math.PI / 2 * 3;
        let x = centerX;
        let y = centerY;
        let step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = centerX + Math.cos(rotation) * outerRadius;
            y = centerY + Math.sin(rotation) * outerRadius;
            this.ctx.lineTo(x, y);
            rotation += step;

            x = centerX + Math.cos(rotation) * innerRadius;
            y = centerY + Math.sin(rotation) * innerRadius;
            this.ctx.lineTo(x, y);
            rotation += step;
        }
        
        this.ctx.lineTo(centerX, centerY - outerRadius);
        this.ctx.closePath();
        this.ctx.fillStyle = this.colors.star;
        this.ctx.fill();
        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    drawCuteStitch(x, y) {
        // 单一圓極簡風格
        this.ctx.fillStyle = '#E0E0E0';
        this.ctx.strokeStyle = '#B0B0B0';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x + this.stitch.width / 2, y + 35, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawUI() {
        // 分数
        this.ctx.fillStyle = '#333';
        this.ctx.font = '20px "Noto Sans SC", sans-serif';
        this.ctx.fillText(`得分: ${this.score}`, 20, 30);
        
        // 生命值
        for (let i = 0; i < this.lives; i++) {
            this.ctx.fillStyle = this.colors.heart;
            this.ctx.beginPath();
            const heartX = this.canvas.width - 40 - (i * 30);
            const heartY = 25;
            
            // 简单的心形绘制
            this.ctx.ellipse(heartX, heartY, 8, 8, Math.PI / 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 游戏速度提示
        this.ctx.fillStyle = '#666';
        this.ctx.font = '14px "Noto Sans SC", sans-serif';
        this.ctx.fillText(`难度: ${Math.floor(this.gameSpeed)}`, 20, 55);
    }
    
    drawInitialScreen() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = this.colors.stitch;
        this.ctx.font = 'bold 24px "Noto Sans SC", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('史迪奇接星星游戏', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.fillStyle = '#666';
        this.ctx.font = '16px "Noto Sans SC", sans-serif';
        this.ctx.fillText('使用 ← → 键控制史迪奇接住星星!', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => {
            this.gameLoop();
        });
    }
    
    endGame() {
        this.gameRunning = false;
        clearInterval(this.starSpawnInterval);
        this.startBtn.textContent = '重新开始';
        this.startBtn.disabled = false;
        
        // 显示游戏结束画面
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 36px "Noto Sans SC", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束!', this.canvas.width / 2, this.canvas.height / 2 - 40);
        
        this.ctx.font = '24px "Noto Sans SC", sans-serif';
        this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        
        this.ctx.fillStyle = this.colors.stitch;
        this.ctx.font = '18px "Noto Sans SC", sans-serif';
        this.ctx.fillText('点击按钮重新开始', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    // 确保canvas元素存在后再初始化游戏
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        setTimeout(() => {
            new StitchGame();
        }, 100); // 等待DOM完全加载
    }
});