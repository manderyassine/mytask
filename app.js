//NewsAPI key
const API_KEY = 'cd2deacd2178481fa0864df7c9481265';
const BASE_URL = 'https://newsapi.org/v2';


document.addEventListener('DOMContentLoaded', () => {
    // Dark mode toggle functionality
    const themeToggle = document.getElementById('switch');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'dark';
    }
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // DOM Elements
    const newsFeed = document.getElementById('newsFeed');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('articleModal');
    const modalContent = document.getElementById('modalContent');
    const closeButton = document.querySelector('.close-button');

    // Event Listeners
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    closeButton.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fetch news on page load
    fetchNews('top-headlines?country=us');

    // Search functionality
    async function handleSearch() {
        const query = searchInput.value.trim();
        if (query) {
            await fetchNews(`everything?q=${encodeURIComponent(query)}`);
        }
    }

    // Fetch news from API
    async function fetchNews(endpoint) {
        try {
            showLoader();
            const response = await fetch(`${BASE_URL}/${endpoint}&apiKey=${API_KEY}`);
            const data = await response.json();
            
            if (data.status === 'ok') {
                displayNews(data.articles);
            } else {
                throw new Error(data.message || 'Failed to fetch news');
            }
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoader();
        }
    }

    // Display news articles
    function displayNews(articles) {
        newsFeed.innerHTML = '';
        
        articles.forEach(article => {
            const articleElement = createNewsCard(article);
            newsFeed.appendChild(articleElement);
        });
    }

    // Create news card
    function createNewsCard(article) {
        const card = document.createElement('div');
        card.className = 'news-card';

        // Add image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'news-image-container';
        
        const image = document.createElement('img');
        image.className = 'news-image';
        image.src = article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image+Available';
        image.alt = article.title;
        image.onerror = () => {
            image.src = 'https://via.placeholder.com/400x200?text=No+Image+Available';
        };

        imageContainer.appendChild(image);
        card.appendChild(imageContainer);

        const content = document.createElement('div');
        content.className = 'news-content';

        const title = document.createElement('h2');
        title.className = 'news-title';
        title.textContent = article.title;

        const description = document.createElement('p');
        description.className = 'news-description';
        description.textContent = article.description || 'No description available';

        const meta = document.createElement('div');
        meta.className = 'news-meta';

        const source = document.createElement('span');
        source.className = 'news-source';
        source.textContent = article.source.name || 'Unknown Source';

        const date = document.createElement('span');
        date.className = 'news-date';
        date.textContent = new Date(article.publishedAt).toLocaleDateString();

        const readMore = document.createElement('a');
        readMore.className = 'read-more';
        readMore.href = article.url;
        readMore.target = '_blank';
        readMore.textContent = 'Read More';

        meta.appendChild(source);
        meta.appendChild(date);

        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(meta);
        content.appendChild(readMore);

        card.appendChild(content);
        
        return card;
    }

    // Show article details in modal
    function showArticleDetails(article) {
        modalContent.innerHTML = `
            <h2>${article.title}</h2>
            <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}" style="max-width: 100%; margin: 1rem 0;">
            <p><strong>Published:</strong> ${new Date(article.publishedAt).toLocaleDateString()}</p>
            <p><strong>Author:</strong> ${article.author || 'Unknown'}</p>
            <p>${article.content || article.description}</p>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
        `;
        modal.style.display = 'block';
    }

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Utility functions
    function showLoader() {
        newsFeed.innerHTML = '<div class="loader">Loading...</div>';
    }

    function hideLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.remove();
        }
    }

    function showError(message) {
        newsFeed.innerHTML = `<div class="error">${message}</div>`;
    }
});
