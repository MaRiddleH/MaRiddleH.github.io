// 博客配置
const blogConfig = {
    title: "个人博客",
    subtitle: "留学·语言·AI·工作·海外生活",
    socialLinks: [
        { name: "GitHub", url: "https://github.com/MaRiddleH" },
        { name: "Twitter", url: "https://twitter.com" },
        { name: "LinkedIn", url: "https://linkedin.com" }
    ]
};

// 文章数据
const posts = [
    {
        id: "first-post",
        title: "第一篇博客",
        date: "2026-02-10",
        category: "生活",
        tags: ["博客", "起点"],
        excerpt: "最近打算重新写博客，希望给自己永远留下一块自留地。",
        contentPath: "posts/first-post.md"
    },
    {
        id: "ai-trends-2026",
        title: "2026年AI发展趋势",
        date: "2026-02-05",
        category: "AI",
        tags: ["AI", "趋势"],
        excerpt: "探讨2026年人工智能领域的最新发展趋势和技术突破。",
        contentPath: "posts/ai-trends-2026.md"
    },
    {
        id: "study-abroad-experience",
        title: "我的留学经历分享",
        date: "2026-01-20",
        category: "留学",
        tags: ["留学", "经验"],
        excerpt: "分享我在海外留学的点点滴滴和心得体会。",
        contentPath: "posts/study-abroad-experience.md"
    }
];

// 初始化页面
function initPage() {
    // 更新页面标题
    document.title = blogConfig.title + " | " + blogConfig.subtitle;
    
    // 渲染社交链接
    renderSocialLinks();
    
    // 检查当前页面
    if (window.location.pathname.includes('post.html')) {
        // 渲染文章内容
        renderPost();
    } else if (window.location.pathname.includes('about.html')) {
        // 关于页面无需特殊处理
    } else {
        // 渲染首页文章列表
        renderPostList();
    }
}

// 渲染社交链接
function renderSocialLinks() {
    const socialLinksContainer = document.querySelector('.social-links');
    if (socialLinksContainer) {
        socialLinksContainer.innerHTML = '';
        blogConfig.socialLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.textContent = link.name;
            socialLinksContainer.appendChild(a);
        });
    }
}

// 渲染文章列表
function renderPostList() {
    const container = document.getElementById('posts-container');
    if (container) {
        container.innerHTML = '';
        
        // 按日期降序排序
        const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-item';
            
            postElement.innerHTML = `
                <h2 class="post-title">
                    <a href="post.html?id=${post.id}">${post.title}</a>
                </h2>
                <div class="post-meta">
                    <span class="post-date">${post.date}</span>
                    <span class="post-category">${post.category}</span>
                </div>
                <div class="post-excerpt">${post.excerpt}</div>
            `;
            
            container.appendChild(postElement);
        });
    }
}

// 渲染文章内容
function renderPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        document.body.innerHTML = '<div class="container"><h1>文章不存在</h1><p>请检查链接是否正确。</p></div>';
        return;
    }
    
    const post = posts.find(p => p.id === postId);
    if (!post) {
        document.body.innerHTML = '<div class="container"><h1>文章不存在</h1><p>请检查链接是否正确。</p></div>';
        return;
    }
    
    // 加载Markdown内容
    fetch(post.contentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            // 渲染Markdown
            const html = marked.parse(markdown);
            
            // 创建文章内容容器
            const postContent = document.createElement('div');
            postContent.className = 'post-content';
            postContent.innerHTML = `
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <span class="post-date">${post.date}</span>
                    <span class="post-category">${post.category}</span>
                </div>
                <div class="markdown-body">${html}</div>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                    <a href="index.html">返回首页</a>
                </div>
            `;
            
            // 替换页面内容
            document.body.innerHTML = `
                <header>
                    <div class="container">
                        <h1>${blogConfig.title}</h1>
                        <nav>
                            <ul>
                                <li><a href="index.html">首页</a></li>
                                <li><a href="about.html">关于</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>
                ${postContent.outerHTML}
                <footer>
                    <div class="container">
                        <p>&copy; 2026 ${blogConfig.title}. 保留所有权利.</p>
                        <div class="social-links">
                            <!-- 社交链接将通过JavaScript动态生成 -->
                        </div>
                    </div>
                </footer>
            `;
            
            // 重新渲染社交链接
            renderSocialLinks();
        })
        .catch(error => {
            console.error('Error loading post:', error);
            document.body.innerHTML = '<div class="container"><h1>加载失败</h1><p>文章内容加载失败，请稍后重试。</p></div>';
        });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initPage);