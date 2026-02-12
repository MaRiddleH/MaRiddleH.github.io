// 博客配置
const blogConfig = {
  title: "Riddle的个人博客",
  subtitle: "留学·语言·AI·工作·海外生活",
  socialLinks: [
    { name: "GitHub", url: "https://github.com/MaRiddleH" }
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
    title: "2026年AI学习笔记",
    date: "2026-02-05",
    category: "AI",
    tags: ["AI"],
    excerpt: "玩ai时遇到的问题。",
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

// 全局变量，用于存储当前筛选状态
const currentFilters = {
  search: '',
  tag: '',
  category: ''
};

// 工具函数
const utils = {
  // 获取DOM元素
  getElement: (selector) => document.querySelector(selector),
  getElementById: (id) => document.getElementById(id),
  
  // 创建DOM元素
  createElement: (tag, options = {}) => {
    const element = document.createElement(tag);
    if (options.className) element.className = options.className;
    if (options.textContent) element.textContent = options.textContent;
    if (options.innerHTML) element.innerHTML = options.innerHTML;
    if (options.href) element.href = options.href;
    if (options.target) element.target = options.target;
    return element;
  },
  
  // 提取URL参数
  getUrlParam: (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
};

// 渲染相关函数
const render = {
  // 渲染社交链接
  socialLinks: () => {
    const container = utils.getElement('.social-links');
    if (!container) return;
    
    container.innerHTML = '';
    blogConfig.socialLinks.forEach(link => {
      const a = utils.createElement('a', {
        href: link.url,
        target: '_blank',
        textContent: link.name
      });
      container.appendChild(a);
    });
  },
  
  // 提取所有唯一标签
  getAllTags: () => {
    const tagsSet = new Set();
    posts.forEach(post => post.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet);
  },
  
  // 渲染标签云
  tags: () => {
    const tagsList = utils.getElementById('tags-list');
    if (!tagsList) return;
    
    const tags = render.getAllTags();
    tagsList.innerHTML = '';
    
    tags.forEach(tag => {
      const tagElement = utils.createElement('span', {
        className: `tag-item ${currentFilters.tag === tag ? 'active' : ''}`,
        textContent: tag
      });
      
      tagElement.addEventListener('click', () => {
        currentFilters.tag = currentFilters.tag === tag ? '' : tag;
        render.tags();
        render.posts();
      });
      
      tagsList.appendChild(tagElement);
    });
  },
  
  // 根据筛选条件过滤文章
  getFilteredPosts: () => {
    return posts
      .filter(post => {
        // 搜索筛选
        const matchesSearch = !currentFilters.search || 
          post.title.toLowerCase().includes(currentFilters.search) ||
          post.excerpt.toLowerCase().includes(currentFilters.search);
        
        // 标签筛选
        const matchesTag = !currentFilters.tag || 
          post.tags.includes(currentFilters.tag);
        
        // 分类筛选
        const matchesCategory = !currentFilters.category || 
          post.category === currentFilters.category;
        
        return matchesSearch && matchesTag && matchesCategory;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  
  // 渲染文章列表
  posts: () => {
    const container = utils.getElementById('posts-container');
    if (!container) return;
    
    const filteredPosts = render.getFilteredPosts();
    container.innerHTML = '';
    
    if (filteredPosts.length === 0) {
      container.innerHTML = '<p>没有找到匹配的文章</p>';
      return;
    }
    
    filteredPosts.forEach(post => {
      const postElement = utils.createElement('div', {
        className: 'post-item',
        innerHTML: `
          <h2 class="post-title">
            <a href="post.html?id=${post.id}">${post.title}</a>
          </h2>
          <div class="post-meta">
            <span class="post-date">${post.date}</span>
            <span class="post-category">${post.category}</span>
          </div>
          <div class="post-excerpt">${post.excerpt}</div>
        `
      });
      
      container.appendChild(postElement);
    });
  },
  
  // 渲染分类文章列表
  categoryPostList: () => {
    const category = utils.getUrlParam('category');
    
    // 设置当前分类筛选
    currentFilters.category = category;
    
    // 更新页面标题
    const categoryTitle = utils.getElementById('category-title');
    if (categoryTitle) {
      categoryTitle.textContent = category || '分类';
    }
    
    document.title = `${category} | ${blogConfig.title} | ${blogConfig.subtitle}`;
    
    // 渲染文章列表
    render.posts();
  },
  
  // 渲染文章内容
  post: () => {
    const postId = utils.getUrlParam('id');
    
    if (!postId) {
      render.showError('文章不存在', '请检查链接是否正确。');
      return;
    }
    
    const post = posts.find(p => p.id === postId);
    if (!post) {
      render.showError('文章不存在', '请检查链接是否正确。');
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
        const postContent = utils.createElement('div', {
          className: 'post-content',
          innerHTML: `
            <h1>${post.title}</h1>
            <div class="post-meta">
              <span class="post-date">${post.date}</span>
              <span class="post-category">${post.category}</span>
            </div>
            <div class="markdown-body">${html}</div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <a href="index.html">返回首页</a>
            </div>
          `
        });
        
        // 替换页面内容
            document.body.innerHTML = `
                <header>
                    <div class="container">
                        <h1>${blogConfig.title}</h1>
                        <nav>
                            <ul>
                                <li><a href="index.html">首页</a></li>
                                <li><a href="category.html?category=生活">生活</a></li>
                                <li><a href="category.html?category=PFAS">PFAS</a></li>
                                <li><a href="document-converter.html">文档转换</a></li>
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
        render.socialLinks();
      })
      .catch(error => {
        console.error('Error loading post:', error);
        render.showError('加载失败', '文章内容加载失败，请稍后重试。');
      });
  },
  
  // 显示错误页面
  showError: (title, message) => {
    document.body.innerHTML = `
      <div class="container" style="text-align: center; padding: 100px 20px;">
        <h1>${title}</h1>
        <p>${message}</p>
        <a href="index.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #0a2463; color: white; text-decoration: none; border-radius: 4px;">返回首页</a>
      </div>
    `;
  },
  
  // 渲染侧边栏内容
  sidebar: () => {
    render.tags();
    initSearch();
  }
};

// 初始化搜索功能
function initSearch() {
  const searchInput = utils.getElementById('search-input');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value.toLowerCase();
    render.posts();
  });
}

// 初始化页面
function initPage() {
  // 更新页面标题
  document.title = `${blogConfig.title} | ${blogConfig.subtitle}`;
  
  // 渲染社交链接
  render.socialLinks();
  
  // 检查当前页面
  const pathname = window.location.pathname;
  if (pathname.includes('post.html')) {
    render.post();
  } else if (pathname.includes('category.html')) {
    render.categoryPostList();
  } else if (!pathname.includes('about.html')) {
    render.posts();
  }
  
  // 渲染侧边栏内容
  if (!pathname.includes('post.html')) {
    render.sidebar();
  }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initPage);